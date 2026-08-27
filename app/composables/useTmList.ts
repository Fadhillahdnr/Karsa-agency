// eslint-disable-next-line @typescript-eslint/no-explicit-any
type RtFn = (node: any) => string

/**
 * vue-i18n's `tm()` returns nested arrays/objects with every string leaf
 * replaced by a compiled-message AST node (shape: `{ type, loc, ... }`) —
 * it's designed to be paired with `rt()` per-leaf, not read as plain data.
 * This walks the structure and resolves every leaf through `rt()`, so
 * components can consume `tm()` results (arrays of strings, or arrays of
 * `{ name, description }`-style objects) as if they were plain JSON.
 */
function isCompiledNode(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === 'object' && 'loc' in (value as object) && 'type' in (value as object)
}

function resolve(node: unknown, rt: RtFn): unknown {
  if (Array.isArray(node)) return node.map(item => resolve(item, rt))
  if (isCompiledNode(node)) return rt(node)
  if (node && typeof node === 'object') {
    const result: Record<string, unknown> = {}
    for (const [key, value] of Object.entries(node as Record<string, unknown>)) {
      result[key] = resolve(value, rt)
    }
    return result
  }
  return node
}

export function useTmList<T>(key: string) {
  const { tm, rt } = useI18n()
  return computed(() => resolve(tm(key), rt) as T)
}
