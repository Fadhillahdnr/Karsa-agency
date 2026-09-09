import { requireAdmin } from '../../../utils/require-admin'
import { getSupabaseClient } from '../../../utils/supabase'
import { getCloudinaryClient } from '../../../utils/cloudinary'

/**
 * Deletes a media asset. Every table that can reference media_assets does
 * so with `on delete set null` (see migrations 0007-0011), so this never
 * fails or cascades into other content — references just go blank, which
 * is safer than a hard block for now. A "used in N places" warning can be
 * added once real content exists to check against.
 */
export default defineEventHandler(async (event) => {
  await requireAdmin(event, ['super_admin', 'content_editor'])

  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Missing id' })
  }

  const supabase = getSupabaseClient()
  if (!supabase) {
    throw createError({ statusCode: 500, statusMessage: 'Supabase not configured' })
  }

  const { data: asset } = await supabase
    .from('media_assets')
    .select('public_id, resource_type, provider')
    .eq('id', id)
    .maybeSingle()

  if (!asset) {
    throw createError({ statusCode: 404, statusMessage: 'Media asset not found' })
  }

  if (asset.provider === 'cloudinary' && asset.public_id) {
    const cloudinary = getCloudinaryClient()
    if (cloudinary) {
      try {
        await cloudinary.uploader.destroy(asset.public_id, {
          resource_type: asset.resource_type === 'video' ? 'video' : asset.resource_type === 'document' ? 'raw' : 'image',
        })
      }
      catch {
        // Continue deleting the DB record even if Cloudinary cleanup fails —
        // an orphaned Cloudinary asset is a minor cost; a media_assets row
        // the admin can no longer see/manage is worse.
      }
    }
  }

  const { error } = await supabase.from('media_assets').delete().eq('id', id)
  if (error) {
    throw createError({ statusCode: 500, statusMessage: 'Could not delete media asset' })
  }

  setResponseStatus(event, 204)
  return null
})
