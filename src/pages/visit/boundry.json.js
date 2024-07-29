
import loadBoundry from '../../js/loadBoundry'
export async function GET({params}) {
  const data = await loadBoundry('https://nominatim.openstreetmap.org/search.php?county=dumfries&country=UK&state=Scotland&polygon_geojson=1&format=jsonv2')

  return new Response(JSON.stringify(data), {
    headers: {
      'status': 200,
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json'
    }
  })
}
