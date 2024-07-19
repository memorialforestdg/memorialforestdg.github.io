/**
 * toggleNavigation.ts
 * https://knowbility.org/blog/2020/accessible-slide-menus
 * https://inclusive-components.design/menus-menu-buttons/
 *
 *
 *
 * @TODO Update toggel strategy
 * Current solution is to use JS to toggle the 'tn-hidden' attribute, and then use event listeners to toggle the display property as this needs to happen after the transition has ended.
 * There should be way to set in CSS *[tn-hidden] { display: none; } and then use JS to toggle the attribute to 'tn-hidden' after the transition has ended.
 * We currently rely on event listeners for this rather then being declaritve about the order of operations, which makes it a bit magical. We may need a tn-opening tn-closing attributes to do this.
 *
*/

/**
 * Toggle the nav drawer using the 'tn-hidden' attribute as a flag.
 *
 * @param {HTMLElement} navToggle - The navigation toggle element.
 * @param {HTMLElement} navDrawer - The navigation drawer element.
 *
 * @returns {void}
 */
function toggleNavDrawer(navToggle, navDrawer){
    if (!navDrawer || !navToggle) {
        console.warn('No navDrawer or navToggle found')
        return
    }

    // Remove the current display:none property before any animations start.
    if (navDrawer.hasAttribute('tn-hidden')) {
        navDrawer.style.removeProperty('display')
        // display: none will be re-added after the transition ends via event listeners on 'transitionend'
    }

    // Allow any transitions to start
    requestAnimationFrame(() => {
        // Toggle the 'tn-hidden' attribute
        navDrawer.toggleAttribute('tn-hidden')

        const isHidden = navDrawer.hasAttribute('tn-hidden')

        // Toggle aria attributes
        navToggle.setAttribute('aria-expanded', !isHidden ? 'true' : 'false')
        navToggle.setAttribute('aria-label', !isHidden ? 'Hide navigation menu' : 'Show navigation menu')
    })
}

/**
 * Toggle display: none after the transition ends as a means of adding/removing any elements from the accessibility tree.
 * The CSS property to check against a numeric value is also parameterized.
 *
 * @param {HTMLElement} element - The element to toggle display for.
 * @param {Object} opts - The options object.
  * @param {string} [opts.cssProp] - The CSS property to toggle e.g.'grid-template-rows'
 * @param {number} [opts.threshold=0] - The threshold value for toggling.
 * @param {HTMLElement} [opts.targetEl] - The element to focus on exit.
 *
 * @returns {void}
 */
function toggleDisplayAfterTransition(e, el, opts = { cssProp: 'grid-template-rows', threshold: 0, targetEl: null }) {
    // Bail if the transition is not the one we're looking for.
    if (e.propertyName !== opts.cssProp && e.target !== el) return;

    if (!el && !opts.targetEl) {
        console.warn('No target element found!')
    }
    // If no target element is specified, use the navDrawer
    if (!el && opts?.targetEl) {
        el = opts.targetEl
    }

    const { cssProp, threshold } = opts

    const computedStyle = getComputedStyle(el)
    const computedValueStr = computedStyle.getPropertyValue(cssProp)
    const computedValue = parseFloat(computedValueStr) // Remove 'px' and convert to number

    if (isNaN(computedValue)) {
        console.warn(`CSS property ${cssProp} not found in the computed style of your target element.`)
        return
    }
    // Set display to 'none' after the transition.
    // Otherwise, remove the 'display' property to show the element.
    if (computedValue === threshold) {
        el.style.display = 'none'
    } else {
        // Remove 'display: none' to allow the transition to show the element.
        el.style.removeProperty('display')
        // Set focus after the transition is completed.
        focusFirstFocusableElement(el)
    }
}

/**
 * Focuses the first focusable element within the specified node.
 * It considers elements that are links, buttons, inputs, selects, and textareas
 * that are not disabled, and any elements with a tabindex that is not -1.
 *
 * @param {HTMLElement} el - The DOM node to search within for focusable elements.
 *
 * @returns {void}
 */
function focusFirstFocusableElement(el) {
    const focusableElements = el.querySelectorAll(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )
    if (focusableElements.length > 0) {
        focusableElements[0].focus()
    }
}

/**
 * Closes the drawer if the user clicks or focuses outside of it using the 'tn-hidden' attribute.
 *
 * @param {FocusEvent | MouseEvent} e - The event object.
 * @param {HTMLElement} navDrawer - The navigation drawer element.
 * @param {HTMLElement} navToggle - The navigation toggle element.
 *
 * @returns {void}
 */
function exitFocusClose(e, navDrawer, navToggle) {
    // Check if the click or focus event target is outside the navDrawer
    // and if the navDrawer does not have the 'tn-hidden' attribute (indicating it's visible).
    if (
        !navDrawer.contains(e.target as Node) &&
        !navDrawer.hasAttribute('tn-hidden') &&
        e.target !== navToggle
    ) {
      toggleNavDrawer(navToggle, navDrawer)
    }
}

/**
 * Initializes the navigation functionality.
 *
 * @param {HTMLElement} navToggle - The navigation toggle element.
 * @param {HTMLElement} navDrawer - The navigation drawer element.
 * @param {Object} [opts] - Optional parameters for target and threshold.
 * @param {string} [opts.cssProp] - The CSS property to toggle e.g.'grid-template-rows'
 * @param {number} [opts.threshold=0] - The threshold value for toggling.
 * @param {HTMLElement} [opts.targetEl] - Optional target element to measure for open/close threshold. If not defined navDrawer will be used.
 *
 * @return {void}
 */
function initializeNavigation(navToggle, navDrawer, opts = { cssProp: 'grid-template-rows', threshold: 0, targetEl: null }) {
    // Initialize the navDrawer state.
    navDrawer.style.display = 'none'
    navDrawer.setAttribute('tn-hidden', '')

    // Toggle the nav drawer event
    navToggle.addEventListener('click', () => {
        toggleNavDrawer(navToggle, navDrawer)
    })

   // Reveal navToggle by removing the [hidden] attribute
   navToggle.removeAttribute('hidden')

    // Toggle the nav drawer display state on subsequent animations
    navDrawer.addEventListener('transitionend', (e) => toggleDisplayAfterTransition(e, navDrawer, opts ))

    // Close the drawer if the focus leaves the drawer, or the user clicks outside.
    window.addEventListener('focusin', (e) => exitFocusClose(e, navDrawer, navToggle))
    window.addEventListener('click', (e) => exitFocusClose(e, navDrawer, navToggle))

    // On the escape key, close the drawer and return focus to the toggle.
    window.addEventListener('keydown', (e) => {
        if (navDrawer.contains(document.activeElement) && e.key === 'Escape') {
            toggleNavDrawer(navToggle, navDrawer)
            navToggle.focus()
        }
    })
}

export { initializeNavigation, toggleNavDrawer}
