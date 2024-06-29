/**
 * Slugify a string.
 *
 * @export
 * @param {string} text
 * @returns
 */
export default function sluggo(text: string) {
  return text
    .trim()
    .replace(/[^A-Za-z0-9\s-]/g, '')
    .replace(/[\s-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase()
}
