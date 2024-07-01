/**
 *  Dynamically loads a 'module' used for passing files paths from frontmater in md.
 *
 * @param {String} modulePath
 * @returns {Promise}
 */
export default async function loadModule(modulePath) {
  try {
    const myModule = await import(modulePath)
    return myModule
  } catch (error) {
    console.error('Module loading failed:', error)
    console.error('Filepath:', modulePath)
  }
}
