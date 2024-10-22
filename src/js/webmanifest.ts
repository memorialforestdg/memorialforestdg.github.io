const webmanifest = {
  name: 'Memorial Forest D&G: A Community Covid Memorial',
  short_name: 'Memorial Forest D&G',
  icons: [
    { src: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
    { src: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' }
  ],
  theme_color: '#EDEBCE',
  background_color: '#EDEBCE',
  display: 'minimal-ui',
  shortcuts: [
    {
      name: 'Visit',
      url: '/visit/',
      description:
        'Find out how to visit the Dumfies and Galloway Covid Memorial Forest'
    },
    {
      name: 'About',
      url: '/about/',
      description:
        'Learn about the making of the Dumfies and Galloway Covid Memorial Forest'
    },
    {
      name: 'Stories',
      url: '/stories/',
      description:
        'Hear the some of the stories and voices that shaped the Dumfies and Galloway Covid Memorial Forest'
    }
  ],
  categories: ['covid-19', 'health', 'memorial', 'nature', 'tribute']
}

export default webmanifest
