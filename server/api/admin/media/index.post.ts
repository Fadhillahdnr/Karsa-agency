import { requireAdmin } from '../../../utils/require-admin'
import { getCloudinaryClient } from '../../../utils/cloudinary'
import { getSupabaseClient } from '../../../utils/supabase'

const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50MB — generous for short cuts/reels, not raw footage

function resourceTypeFor(mime: string): 'image' | 'video' | 'document' {
  if (mime.startsWith('image/')) return 'image'
  if (mime.startsWith('video/')) return 'video'
  return 'document'
}

/**
 * Uploads a file to Cloudinary and records it in media_assets in one step —
 * the source of truth for anything the reusable MediaPicker offers. Direct
 * multipart upload only; huge raw video should go through a signed direct
 * upload instead (see master prompt §35/§93), not yet implemented.
 */
export default defineEventHandler(async (event) => {
  const { user } = await requireAdmin(event, ['super_admin', 'content_editor'])

  const cloudinary = getCloudinaryClient()
  if (!cloudinary) {
    throw createError({ statusCode: 500, statusMessage: 'Cloudinary not configured' })
  }

  const supabase = getSupabaseClient()
  if (!supabase) {
    throw createError({ statusCode: 500, statusMessage: 'Supabase not configured' })
  }

  const parts = await readMultipartFormData(event)
  const file = parts?.find(part => part.name === 'file')
  const altText = parts?.find(part => part.name === 'altText')?.data.toString('utf-8')

  if (!file || !file.type) {
    throw createError({ statusCode: 400, statusMessage: 'No file provided' })
  }

  const allowed = ['image/', 'video/', 'application/pdf']
  if (!allowed.some(prefix => file.type!.startsWith(prefix))) {
    throw createError({ statusCode: 400, statusMessage: 'Only image, video, or PDF files are allowed' })
  }

  if (file.data.length > MAX_FILE_SIZE) {
    throw createError({ statusCode: 413, statusMessage: 'File is too large (50MB max)' })
  }

  const dataUri = `data:${file.type};base64,${file.data.toString('base64')}`
  const resourceType = resourceTypeFor(file.type)

  let uploadResult
  try {
    uploadResult = await cloudinary.uploader.upload(dataUri, {
      folder: 'karsa-agency/media',
      resource_type: resourceType === 'document' ? 'raw' : 'auto',
    })
  }
  catch {
    throw createError({ statusCode: 502, statusMessage: 'Upload to Cloudinary failed' })
  }

  const { data, error } = await supabase
    .from('media_assets')
    .insert({
      provider: 'cloudinary',
      public_id: uploadResult.public_id,
      resource_type: resourceType,
      url: uploadResult.url,
      secure_url: uploadResult.secure_url,
      thumbnail_url: resourceType === 'video' ? uploadResult.secure_url.replace(/\.[^.]+$/, '.jpg') : null,
      alt_text: altText || null,
      caption: null,
      width: uploadResult.width ?? null,
      height: uploadResult.height ?? null,
      duration: uploadResult.duration ?? null,
      format: uploadResult.format ?? null,
      bytes: uploadResult.bytes ?? null,
      folder: 'karsa-agency/media',
      rights_status: null,
      credit: null,
      source: null,
      created_by: user.id,
    })
    .select('*')
    .single()

  if (error || !data) {
    throw createError({ statusCode: 500, statusMessage: 'Uploaded to Cloudinary but could not save media record' })
  }

  setResponseStatus(event, 201)
  return data
})
