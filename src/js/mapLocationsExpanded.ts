import { type Icon } from '../components/OpenMap.astro'

import treeGroupIcon from '../../public/pins/trees-group.svg'
import treeGroupIconShadow from '../../public/pins/shadows-group.png'

import treeAIcon from '../../public/pins/trees-a.svg'
import treeAShadow from '../../public/pins/shadow-a.png'
import treeBIcon from '../../public/pins/trees-b.svg'
import treeBShadow from '../../public/pins/shadow-b.png'
import treeCIcon from '../../public/pins/trees-c.svg'
import treeCShadow from '../../public/pins/shadow-c.png'


// Icon
export const treeGroupOpts: Icon = {
  iconUrl: treeGroupIcon.src,
  shadowUrl: treeGroupIconShadow.src,
  iconSize: [80, 77],
  shadowSize: [80, 40],
  shadowAnchor: [0, 8],
  iconAnchor: [12, 41]
}

export const treeAOpts: Icon = {
  iconUrl: treeAIcon.src,
  shadowUrl: treeAShadow.src,
  iconSize: [80, 77],
  shadowSize: [80, 40],
  shadowAnchor: [-20 , 15],
  iconAnchor: [12, 41]
}

export const treeBOpts: Icon = {
  iconUrl: treeBIcon.src,
  shadowUrl: treeBShadow.src,
  iconSize: [88, 80],
  shadowSize: [80, 40],
  shadowAnchor: [-28 , 8],
  iconAnchor: [12, 41]
}

export const treeCOpts: Icon = {
  iconUrl: treeCIcon.src,
  shadowUrl: treeCShadow.src,
  iconSize: [80, 77],
  shadowSize: [80, 40],
  shadowAnchor: [-22, 15],
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
      'The Dispersed Memorial Forest:<br/> <a href="../../visit/castle-douglas">Castle Douglas</a> at Threave Nature Reserve.',
    popup: {offset: {x: 30, y: -22}},
    lat: 54.933013,
    lon: -3.95709,
    open: false,
    icon: treeGroupOpts
  },
  {
    id: 'dumfries',
    content: `<p>The Dispersed Memorial Forest in <a href="../../visit/dumfries">Dumfries</a> was planted at six locations to create an aproximate one hour walking loop, reflecting the one hour of exercise allowed during the first Lockdown, Spring 2020:</p>
      <ol>
        <li><b>Crichton Memorial Church (this pin)</b></li>
        <li>Easterbrook Hall</li>
        <li>Dudgeon House</li>
        <li>Monreith House</li>
        <li>Occupational Health at NHS Mountainhall Treatment Centre</li>
        <li>Three Road Ends at Mountainhall Treatment Centre</li>
      </ol>`,
    popup: {offset: {x: 30, y: -22}},
    lat: 55.050628,
    lon: -3.594138,
    open: false,
    icon: treeAOpts
  },
  {
    id: 'dumfries-easterbrook-hall',
    content: `<p>The Dispersed Memorial Forest in <a href="../../visit/dumfries">Dumfries</a> was planted at six locations to create an aproximate one hour walking loop, reflecting the one hour of exercise allowed during the first Lockdown, Spring 2020:</p>
      <ol>
        <li>Crichton Memorial Church</li>
        <li><b>Easterbrook Hall (this pin)</b></li>
        <li>Dudgeon House</li>
        <li>Monreith House</li>
        <li>Occupational Health at NHS Mountainhall Treatment Centre</li>
        <li>Three Road Ends at Mountainhall Treatment Centre</li>
      </ol>`,
    popup: {offset: {x: 30, y: -22}},
    lat: 55.051868,
    lon: -3.591831,
    open: false,
    icon: treeBOpts
  },
  {
    id: 'dumfries-dudgeon-house',
    content: `<p>The Dispersed Memorial Forest in <a href="../../visit/dumfries">Dumfries</a> was planted at six locations to create an aproximate one hour walking loop, reflecting the one hour of exercise allowed during the first Lockdown, Spring 2020:</p>
      <ol>
        <li>Crichton Memorial Church</li>
        <li>Easterbrook Hall</li>
        <li><b>Dudgeon House (this pin)</b></li>
        <li>Monreith House</li>
        <li>Occupational Health at NHS Mountainhall Treatment Centre</li>
        <li>Three Road Ends at Mountainhall Treatment Centre</li>
      </ol>`,
    popup: {offset: {x: 30, y: -22}},
    lat: 55.049226,
    lon: -3.588818,
    open: false,
    icon: treeCOpts
  },
  {
    id: 'dumfries-monreith-house',
    content: `<p>The Dispersed Memorial Forest in <a href="../../visit/dumfries">Dumfries</a> was planted at six locations to create an aproximate one hour walking loop, reflecting the one hour of exercise allowed during the first Lockdown, Spring 2020:</p>
      <ol>
        <li>Crichton Memorial Church</li>
        <li>Easterbrook Hall</li>
        <li>Dudgeon House</li>
        <li><b>Monreith House (this pin)</b></li>
        <li>Occupational Health at NHS Mountainhall Treatment Centre</li>
        <li>Three Road Ends at Mountainhall Treatment Centre</li>
      </ol>`,
    popup: {offset: {x: 30, y: -22}},
    lat: 55.055452,
    lon: -3.599129,
    open: false,
    icon: treeBOpts
  },
  {
    id: 'dumfries-mountainhall-treatment-centre-nhs',
    content: `<p>The Dispersed Memorial Forest in <a href="../../visit/dumfries">Dumfries</a> was planted at six locations to create an aproximate one hour walking loop, reflecting the one hour of exercise allowed during the first Lockdown, Spring 2020:</p>
      <ol>
        <li>Crichton Memorial Church</li>
        <li>Easterbrook Hall</li>
        <li>Dudgeon House</li>
        <li>Monreith House</li>
        <li><b>Occupational Health at NHS Mountainhall Treatment Centre (this pin)</b></li>
        <li>Three Road Ends at Mountainhall Treatment Centre</li>
      </ol>`,
    popup: {offset: {x: 30, y: -22}},
    lat: 55.048283,
    lon: -3.59508,
    open: false,
    icon: treeBOpts
  },
  {
    id: 'dumfries-three-road-ends',
    content: `<p>The Dispersed Memorial Forest in <a href="../../visit/dumfries">Dumfries</a> was planted at six locations to create an aproximate one hour walking loop, reflecting the one hour of exercise allowed during the first Lockdown, Spring 2020:</p>
      <ol>
        <li>Crichton Memorial Church</li>
        <li>Easterbrook Hall</li>
        <li>Dudgeon House</li>
        <li>Monreith House</li>
        <li>Occupational Health at NHS Mountainhall Treatment Centre</li>
        <li><b>Three Road Ends at Mountainhall Treatment Centre (this pin)</b></li>
      </ol>`,
    popup: {offset: {x: 30, y: -22}},
    lat: 55.05742,
    lon: -3.601577,
    open: false,
    icon: treeCOpts
  },
  {
    id: 'moffat',
    content:
      'The Dispersed Memorial Forest:<br/> <a href="../../visit/moffat">Moffat</a> at the Moffat Community Nature Reserve.',
    popup: {offset: {x: 30, y: -22}},
    lat: 55.319197,
    lon: -3.43987,
    open: false,
    icon: treeGroupOpts
  },
  {
    id: 'sanquhar',
    content:
      'The Dispersed Memorial Forest:<br/> <a href="../../visit/sanquhar">Sanquhar</a>, near the junction of Bell Crescent and Deer Park Avenue.',
    popup: {offset: {x: 30, y: -22}},
    lat: 55.363505,
    lon: -3.923666,
    open: false,
    icon: treeGroupOpts
  },
  {
    id: 'stranraer',
    content:
      'The Dispersed Memorial Forest:<br/> <a href="../../visit/stranraer">Stranraer</a> is found within the Community Garden, behind the Galloway Community Hospital car park.',
    popup: {offset: {x: 30, y: -22}},
    lat: 54.89962,
    lon: -5.020083,
    open: false,
    icon: treeGroupOpts
  }
]
