const MAX_IMAGE_SIDE = 900
const JPEG_QUALITY = 0.8

/** Resize an uploaded image in the browser and return a compressed JPEG data URL. */
export async function compressImage(file) {
  if (!file || !file.type.startsWith('image/')) {
    throw new Error('Choose an image file to continue.')
  }

  const bitmap = await createImageBitmap(file)
  const scale = Math.min(1, MAX_IMAGE_SIDE / Math.max(bitmap.width, bitmap.height))
  const width = Math.max(1, Math.round(bitmap.width * scale))
  const height = Math.max(1, Math.round(bitmap.height * scale))
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height

  const context = canvas.getContext('2d')
  if (!context) {
    bitmap.close()
    throw new Error('Your browser could not process this image.')
  }

  context.fillStyle = '#ffffff'
  context.fillRect(0, 0, width, height)
  context.drawImage(bitmap, 0, 0, width, height)
  bitmap.close()
  return canvas.toDataURL('image/jpeg', JPEG_QUALITY)
}
