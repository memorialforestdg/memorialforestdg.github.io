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
      'The Dispersed Memorial Forest:<br/> <a href="./castle-douglas.com">Castle Douglas</a>',
    popup: {offset: {x: 30, y: -22}},
    lat: 54.933848,
    lon: -3.959061,
    open: false,
    icon: iconOpts
  },
  {
    id: 'dumfries',
    content:
      'The Dispersed Memorial Forest:<br/> <a href="./dumfries">Dumfries</a>',
    popup: {offset: {x: 30, y: -22}},
    lat: 55.057851,
    lon: -3.601577,
    open: false,
    icon: iconOpts
  },
  {
    id: 'moffat',
    content:
      'The Dispersed Memorial Forest:<br/> <a href="./moffat">Moffat</a>',
    popup: {offset: {x: 30, y: -22}},
    lat: 55.3332407,
    lon: -3.444357,
    open: false,
    icon: iconOpts
  },
  {
    id: 'sanquhar',
    content:
      'The Dispersed Memorial Forest:<br/> <a href="./sanquhar">Sanquhar</a>',
    popup: {offset: {x: 30, y: -22}},
    lat: 55.3676858,
    lon: -3.9236766,
    open: false,
    icon: iconOpts
  },
  {
    id: 'stranraer',
    content:
      'The Dispersed Memorial Forest:<br/> <a href="./stranraer">Stranraer</a>',
    popup: {offset: {x: 30, y: -22}},
    lat: 54.9044332,
    lon: -5.026204,
    open: false,
    icon: iconOpts
  }
]
