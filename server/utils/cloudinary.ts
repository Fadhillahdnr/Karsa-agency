import { v2 as cloudinary } from 'cloudinary'

let configured = false

/**
 * Server-only Cloudinary client. Returns null when Cloudinary isn't
 * configured yet so callers can fail gracefully instead of crashing the
 * request (mirrors getSupabaseClient in ./supabase).
 */
export function getCloudinaryClient() {
  const config = useRuntimeConfig()

  if (!config.cloudinaryCloudName || !config.cloudinaryApiKey || !config.cloudinaryApiSecret) {
    return null
  }

  if (!configured) {
    cloudinary.config({
      cloud_name: config.cloudinaryCloudName,
      api_key: config.cloudinaryApiKey,
      api_secret: config.cloudinaryApiSecret,
      secure: true,
    })
    configured = true
  }

  return cloudinary
}
