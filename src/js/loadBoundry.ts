

/**
 * Fetches data from the specified URL and returns the first item's geojson.
 *
 * @param {string} url - The URL to fetch the data from.
 * @return {Promise<object>} A Promise that resolves to the geojson of the first item.
 * @throws {Error} If there is an error during the fetch or parsing of the data.
 */
export default async function loadBoundry(url: string) {
  try {
    const response = await fetch(url)
    const data = await response.json()
    return data
  } catch (error) {
    console.warn(error)
  }
 }
