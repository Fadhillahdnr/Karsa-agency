interface Bucket {
  count: number
  resetAt: number
}

const buckets = new Map<string, Bucket>()
const WINDOW_MS = 10 * 60 * 1000
const MAX_REQUESTS = 5

/**
 * In-memory sliding-window limiter keyed by IP. Sufficient for a single
 * long-running Node process; on multi-instance serverless deployments each
 * instance keeps its own counters, so this is a best-effort guard, not a
 * hard limit — see README "Known limitations".
 */
export function isRateLimited(key: string): boolean {
  const now = Date.now()
  const bucket = buckets.get(key)

  if (!bucket || bucket.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + WINDOW_MS })
    return false
  }

  bucket.count += 1
  return bucket.count > MAX_REQUESTS
}
