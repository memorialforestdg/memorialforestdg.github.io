import {
  type Icon
} from '../components/OpenMap.astro'

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

export const defaultCenter = [55.083333, -3.833333]

export const mapLocations = [
  {
    id: 'Castle Douglas',
    content:
      'Castle Douglas: Some mixed <a href="https://example.com">markup</a> & content.',
    popup: {offset: {x: 30, y: -22}},
    lat: 54.9248355,
    lon: -3.948683,
    open: true,
    icon: iconOpts
  },
  {
    id: 'The Crichton, Dumfries',
    content:
      'The Crichton, Dumfries: <a href="https://example.com">markup</a> & content.',
    popup: {offset: {x: 30, y: -22}},
    lat: 55.0512608,
    lon: -3.5941989,
    open: false,
    icon: iconOpts
  },
  {
    id: 'Moffat',
    content:
      'Moffat: Some mixed <a href="https://example.com">markup</a> & content.',
    popup: {offset: {x: 30, y: -22}},
    lat: 55.3332407,
    lon: -3.444357,
    open: false,
    icon: iconOpts
  },
  {
    id: 'Sanquhar',
    content:
      'Sanquhar: Some mixed <a href="https://example.com">markup</a> & content.',
    popup: {offset: {x: 30, y: -22}},
    lat: 55.3676858,
    lon: -3.9236766,
    open: false,
    icon: iconOpts
  },
  {
    id: 'Stranraer',
    content:
      'Stranraer: Some mixed <a href="https://example.com">markup</a> & content.',
    popup: {offset: {x: 30, y: -22}},
    lat: 54.9044332,
    lon: -5.026204,
    open: false,
    icon: iconOpts
  }
]
