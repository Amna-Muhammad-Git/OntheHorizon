const MAX_IMAGE_SIDE = 900
const JPEG_QUALITY = 0.8

/** Resize an uploaded image in the browser and return a compressed JPEG data URL. */
export async function compressImage(file) {
  if (!file || !file.type.startsWith('image/')) {
    throw new Error('Choose an image file to continue.')
  }

  let image
  let releaseImage = () => {}
  try {
    if (typeof createImageBitmap === 'function') {
      image = await createImageBitmap(file)
      releaseImage = () => image.close?.()
    } else {
      const objectUrl = URL.createObjectURL(file)
      releaseImage = () => URL.revokeObjectURL(objectUrl)
      image = await new Promise((resolve, reject) => {
        const element = new Image()
        element.onload = () => resolve(element)
        element.onerror = () => reject(new Error('Could not read that image. Try another one.'))
        element.src = objectUrl
      })
    }

    const scale = Math.min(1, MAX_IMAGE_SIDE / Math.max(image.width, image.height))
    const width = Math.max(1, Math.round(image.width * scale))
    const height = Math.max(1, Math.round(image.height * scale))
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height

    const context = canvas.getContext('2d')
    if (!context) throw new Error('Your browser could not process this image.')
    context.fillStyle = '#ffffff'
    context.fillRect(0, 0, width, height)
    context.drawImage(image, 0, 0, width, height)
    return canvas.toDataURL('image/jpeg', JPEG_QUALITY)
  } catch (error) {
    if (error instanceof Error && error.message.includes('image')) throw error
    throw new Error('Could not read that image. Try another one.')
  } finally {
    releaseImage()
  }
}
