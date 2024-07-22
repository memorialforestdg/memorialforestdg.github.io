# Astro: adding custom functionality

## [Integrations](https://docs.astro.build/en/reference/configuration-reference/#integrations) & [Integrations API](https://docs.astro.build/en/reference/integrations-reference/)


Integrations add new functionality; however, in our use case, we want to add information to all processed images, and none of the given examples appear to work directly with image data.

The integrations API has several hooks that may be useful at different stages of build or development. [astro.config.setup](https://docs.astro.build/en/reference/integrations-reference/#astroconfigsetup) takes place before vite or Astro config have been resolved, so we can inject changes at different stages of the setup and build process. 

[Understanding Astro: Chapter 8: Build Your Own Astro Integrations]https://github.com/understanding-astro/understanding-astro-book/blob/master/ch8.md#hello-world-sorry-hello-integration


## [Image Service](https://docs.astro.build/en/reference/configuration-reference/#imageservice)

The default image service is powered by [Sharp](https://sharp.pixelplumbing.com/), but it only exposes a small portion of Sharp's overall abilities.  

[sharpService](https://github.com/withastro/astro/blob/16ed760f99bfd8da05473548ccc15a1a045b238c/packages/astro/src/assets/services/sharp.ts#L11) |
[sharpImageService](https://github.com/withastro/astro/blob/16ed760f99bfd8da05473548ccc15a1a045b238c/packages/astro/config.mjs#L4) |
[sharpImageServiceConfig](https://github.com/withastro/astro/blob/16ed760f99bfd8da05473548ccc15a1a045b238c/packages/astro/config.d.ts#L6)

### `image.service.config`
The only documented config for the image.service.config is [limitInputPixels](https://docs.astro.build/en/reference/configuration-reference/#imageserviceconfiglimitinputpixels). It doesn't appear that we can pass any other Sharp config to the Image Serice via the `image.service.config` object.

As there doesn't seem to be a way to extend the default Image Service, we can create our own. It is unclear if, for example, we exposed the [.stats()](https://sharp.pixelplumbing.com/api-input#stats) object or just the dominant colour if these values could be passed upwards to [getImage()](https://docs.astro.build/en/guides/images/#generating-images-with-getimage) without also modifying the whole toolchain and types associated with that API. 

Related:

[getImage()](https://github.com/withastro/astro/blob/16ed760f99bfd8da05473548ccc15a1a045b238c/packages/astro/src/assets/internal.ts#L34) |
[isIamgeMetadata](https://github.com/withastro/astro/blob/16ed760f99bfd8da05473548ccc15a1a045b238c/packages/astro/src/assets/types.ts#L49) |
[ExpectedImageOptions](https://github.com/withastro/astro/blob/16ed760f99bfd8da05473548ccc15a1a045b238c/packages/astro/src/core/errors/errors-data.ts#L659) |
[getImageComponentAttributes](https://github.com/withastro/astro/blob/16ed760f99bfd8da05473548ccc15a1a045b238c/packages/integrations/mdx/src/rehype-images-to-component.ts#L49) |
[GetImageResult](https://github.com/withastro/astro/blob/16ed760f99bfd8da05473548ccc15a1a045b238c/packages/astro/src/assets/types.ts#L49)

## Vite Config / Vite plugin / Rollup compatible plugin
Possibly the lowest level of configuration and custom behaviour modification as Vite powers Astro's build process. While I believe we could manipulate the vite behaviour directly with [`vite.config.js`](https://vitejs.dev/config/), for portability, we would probably want a custom Integration hook to modify the    

https://github.com/vitejs/awesome-vite?tab=readme-ov-file#plugins

imagetools - metadata directive
https://github.com/JonasKruckenberg/imagetools/issues/377