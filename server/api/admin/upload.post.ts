import { requireAdmin } from '../../utils/require-admin'
import { getCloudinaryClient } from '../../utils/cloudinary'
import { isRateLimited } from '../../utils/rate-limit'

const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50MB — generous for short cover videos

export default defineEventHandler(async (event) => {
  const { user } = await requireAdmin(event, ['super_admin', 'content_editor'])

  if (isRateLimited(`upload:${user.id}`)) {
    throw createError({ statusCode: 429, statusMessage: 'Too many uploads. Please wait a few minutes and try again.' })
  }

  const cloudinary = getCloudinaryClient()
  if (!cloudinary) {
    throw createError({ statusCode: 500, statusMessage: 'Cloudinary not configured' })
  }

  const parts = await readMultipartFormData(event)
  const file = parts?.find(part => part.name === 'file')

  if (!file || !file.type) {
    throw createError({ statusCode: 400, statusMessage: 'No file provided' })
  }

  if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
    throw createError({ statusCode: 400, statusMessage: 'Only image or video files are allowed' })
  }

  if (file.data.length > MAX_FILE_SIZE) {
    throw createError({ statusCode: 413, statusMessage: 'File is too large (50MB max)' })
  }

  const dataUri = `data:${file.type};base64,${file.data.toString('base64')}`

  try {
    const result = await cloudinary.uploader.upload(dataUri, {
      folder: 'karsa-agency/projects',
      resource_type: 'auto',
    })

    setResponseStatus(event, 201)
    return { url: result.secure_url, resourceType: result.resource_type }
  }
  catch {
    throw createError({ statusCode: 502, statusMessage: 'Upload to Cloudinary failed' })
  }
})
