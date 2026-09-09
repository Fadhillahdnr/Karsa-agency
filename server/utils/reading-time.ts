/** Rough reading time (minutes) from TipTap JSON content, ~200 words/minute. */
export function estimateReadingTime(content: Record<string, unknown>): number {
  const text = extractText(content)
  const words = text.trim().split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(words / 200))
}

function extractText(node: unknown): string {
  if (!node || typeof node !== 'object') return ''
  const obj = node as { text?: unknown, content?: unknown[] }
  let text = typeof obj.text === 'string' ? obj.text : ''
  if (Array.isArray(obj.content)) {
    text += ' ' + obj.content.map(extractText).join(' ')
  }
  return text
}
