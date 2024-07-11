import { getImage } from "astro:assets";
import sharp from 'sharp'
import { z } from 'zod'
import {imageExifMetadata} from '../schemas.js'
type ImageExifMetadata = z.infer<typeof imageExifMetadata>
interface MetaPool extends Array<ImageExifMetadata> {}

/**
 * Get album images from collections in src/content/albums
 * With thanks to: https://jankraus.net/2024/04/05/how-to-build-a-simple-photo-gallery-with-astro/
 *
 * @param {string} albumId
 * @returns {Promise<ImageMetadata[]>}
 */
async function getAlbumImages(albumId) {
  let images = import.meta.glob<{ default: ImageMetadata }>(
    "/src/content/**/*.{jpeg,jpg,JPG,png,gif,avif,webp}",
  );

  images = Object.fromEntries(
    Object.entries(images).filter(([key]) => key.includes(albumId))
  );

  const resolvedImages = await Promise.all(
    Object.values(images).map((image) => image().then((mod) => mod.default))
  );

  return resolvedImages;
}

/**
 * Decode and clean up an image object provided.
 * e.g from getImage() <GetImageResult> object or  import.meta.glob <ImageMetadata> object
 *
 * @param {<GetImageResult>} image
 * @returns {string}
 */
function extractImagePath(image) {

  if (!image || !image?.src) {
    throw new Error("No image path, expected an image object with src property . Received: " + image);
  }

  const cleanedPath = decodeURIComponent(image.src)
    .replace(/.*\/src\//, '/src/')
    .replace(/\?.*$/, '');

  return cleanedPath;
}


/**
 * Extrapolates the dimensions of an image based on a target in pixels and a flag representing the axis to target.
 *
 * @param {number} targetDim - The target dimension.
 * @param {'long' | 'short' | 'width' | 'height'} axis - The axis to target.
 * @param {number | undefined} imageWidth - The width of the image, or undefined if not provided.
 * @param {number | undefined} imageHeight - The height of the image, or undefined if not provided.
 *
 * @returns {{ width: number, height: number }} The extrapolated dimensions.
 * @throws {Error} If image dimensions or axis are invalid, or if image dimensions are not provided.
 */
function extrapolateImageDims(target: number, flag, imageWidth?, imageHeight?) {
  if (imageWidth === undefined || imageHeight === undefined) {
    throw new Error("Image dimensions are required.");
  }
  if (flag !== 'long' && flag !== 'short' && flag !== 'width' && flag !== 'height') {
    throw new Error("Invalid flag: " + flag + ". Expected 'long|short|width|height'.");
  }

  let targetWidth: number = 0;
  let targetHeight: number = 0;
  // Square image return early
  if (imageWidth === imageHeight) {
    return { width: Math.round(target), height: Math.round(target) };
  }

  // LONG & SHORT DIMS
  // Peg long dimention to target, irrespective of orientation.
  if (flag === 'long') {
    if (imageWidth >= imageHeight) {
      // For 'long', if the image is horizontal, fix width to target
      targetWidth = target;
      targetHeight =  (imageHeight / imageWidth) * targetWidth;
    } else {
      // For 'long', if the image is vertical, fix height to target
      targetWidth = (imageWidth / imageHeight) * target;
      targetHeight = target;
    }
  }
  // Peg short dimention to target irrespective of orientation.
  if (flag === 'short') {
    if (imageWidth >= imageHeight) {
      // For 'short', if the image is horizontal, fix height to target
      targetWidth = (imageWidth / imageHeight) * target;
      targetHeight = target;
    } else {
      // For 'short', if the image is vertical, fix width to target
      targetWidth = target;
      targetHeight = (imageHeight / imageWidth) * targetWidth;
    }
  }

  // WIDTH & HEIGHT
  // Peg image width to target.
  if (flag === 'width') {
    // Target dimension based on width
    if (imageWidth >= imageHeight) {
      // For 'width' if the image is horizontal, the targetWidth is the target
      targetWidth = target;
      targetHeight = (imageHeight / imageWidth) * targetWidth;
    } else {
      // For 'width' if the image is vertical
      targetWidth = target / (imageWidth / imageHeight);
      targetHeight = (imageWidth / imageHeight) * target;
    }
  }
  // Peg image height to target.
  if (flag === 'height') {
    // Target dimension based on height
    if (imageWidth <= imageHeight) {
      // For 'height' if the image is vertical, the targetHeight is the target
      targetWidth = (imageWidth / imageHeight) * target;
      targetHeight = target;
    } else {
      // For 'height' if the image is horizontal
      targetWidth = (imageHeight / imageWidth) * target;
      targetHeight = target / (imageHeight / imageWidth);
    }

  }
  return { width: Math.round(targetWidth), height: Math.round(targetHeight) };
}

/**
 * Retrieves the orientation of an image based on its width and height.
 *
 * @param {number} imageWidth - A unitless width of the image.
 * @param {number} imageHeight - A unitless height of the image.
 * @returns {'square' | 'landscape' | 'portrait'} The orientation of the image.
 * @throws {TypeError} If width or height is not a number.
 */
function getImageOrientation(width: number, height: number): 'square' | 'landscape' | 'portrait' {
    if (isNaN(width) || isNaN(height)) {
      throw new TypeError('Invalid image dimensions');
    }
    if (width === height) {
      return 'square';
    } else if (width > height) {
      return 'landscape';
    } else {
      return 'portrait';
    }
}

async function extractImageData(image: ImageMetadata, targetCellHeight: number, targetModalImageLongDim: number, metaPool: MetaPool ) {
  // Fallback if sharp fails
  let dominantColor = 'inherit'

  // Calculate image dimensions for lightbox
  const lightboxDims = extrapolateImageDims(
    targetModalImageLongDim,
    'long',
    image.width,
    image.height
  )

  // Calculate image dimensions for thumbnail
  const thumbDims = extrapolateImageDims(
    targetCellHeight,
    'short',
    image.width,
    image.height
  )

  // Get dominant color
  try {
    // This is slow in dev as we are checking the full size image.
    const path = '.' + extractImagePath(image)
    const {dominant} = await sharp(path).stats()
    dominantColor = `rgb(${dominant.r}, ${dominant.g}, ${dominant.b})`
  } catch (error) {
    console.warn(error)
  }

  // Pull in image metadata
  let metadata
  if (metaPool) {
    try {
      metadata = Object.values(metaPool)
        .flat()
        .find((item: ImageExifMetadata): boolean => {
          return item.SourceFile === `..${extractImagePath(image)}`
        }) as ImageExifMetadata
    } catch (error) {
      console.warn(error)
    }
  }

  return {lightboxDims, thumbDims, dominantColor, metadata}
}


export { getAlbumImages, extrapolateImageDims, extractImagePath, getImageOrientation, extractImageData }
