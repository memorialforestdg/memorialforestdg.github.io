import { type Icon } from '../components/OpenMap.astro'
import mapIcon from '../../public/map-pin-trees.svg'
import mapIconShadow from '../../public/map-pin-trees-shadow.png'


// Icon
export const iconOpts: Icon = {
  iconUrl: mapIcon.src,
  shadowUrl: mapIconShadow.src,
  iconSize: [80, 77],
  shadowSize: [80, 40],
  shadowAnchor: [0, 8],
  iconAnchor: [12, 41]
}

export const defaultCenter = [55.06512,-4.03507]

/**
 * Map locations
 * Links to pages should be relative to the base path
 */

export const mapLocations = [
  {
    id: 'castle-douglas',
    content:
      'The Dispersed Memorial Forest:<br/> <a href="./castle-douglas.com">Castle Douglas</a> at Threave Nature Reserve.',
    popup: {offset: {x: 30, y: -22}},
    lat: 54.933848,
    lon: -3.959061,
    open: false,
    icon: iconOpts
  },
  {
    id: 'dumfries',
    content:
      'The Dispersed Memorial Forest:<br/> <a href="./dumfries">Dumfries</a>, a XXkm walking trail between Mountainhall Three Roads End and Bankend Road, on the Crichton Estate.',
    popup: {offset: {x: 30, y: -22}},
    lat: 55.057851,
    lon: -3.601577,
    open: false,
    icon: iconOpts
  },
  {
    id: 'moffat',
    content:
      'The Dispersed Memorial Forest:<br/> <a href="./moffat">Moffat</a> at the Moffat Community Nature Reserve.',
    popup: {offset: {x: 30, y: -22}},
    lat: 55.319197,
    lon: -3.43987,
    open: false,
    icon: iconOpts
  },
  {
    id: 'sanquhar',
    content:
      'The Dispersed Memorial Forest:<br/> <a href="./sanquhar">Sanquhar</a>, near the junction of Bell Crescent and Deer Park Avenue.',
    popup: {offset: {x: 30, y: -22}},
    lat: 55.363505,
    lon: -3.923666,
    open: false,
    icon: iconOpts
  },
  {
    id: 'stranraer',
    content:
      'The Dispersed Memorial Forest:<br/> <a href="./stranraer">Stranraer</a> is found within the Community Garden, behind the Galloway Community Hospital car park.',
    popup: {offset: {x: 30, y: -22}},
    lat: 54.89962,
    lon: -5.020083,
    open: false,
    icon: iconOpts
  }
]
