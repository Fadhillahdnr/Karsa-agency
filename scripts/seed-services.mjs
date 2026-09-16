// Backwards-compatible entrypoint. The canonical service definitions now live
// beside the approved 2026 pricing packages in seed-pricing.mjs.
process.argv.push('--services-only')
await import('./seed-pricing.mjs')
