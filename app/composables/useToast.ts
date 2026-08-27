export interface Toast {
  id: number
  message: string
  variant: 'success' | 'error' | 'info'
}

let nextId = 0

/**
 * Global toast stack shared across the /admin panel via useState, so any
 * page/component can push a toast without prop-drilling. ToastStack.vue
 * (mounted once in the admin layout) is the only reader.
 */
export function useToast() {
  const toasts = useState<Toast[]>('admin-toasts', () => [])

  function push(message: string, variant: Toast['variant'] = 'info', duration = 4000) {
    const id = nextId++
    toasts.value.push({ id, message, variant })

    setTimeout(() => {
      toasts.value = toasts.value.filter(t => t.id !== id)
    }, duration)
  }

  function dismiss(id: number) {
    toasts.value = toasts.value.filter(t => t.id !== id)
  }

  return {
    toasts,
    success: (message: string) => push(message, 'success'),
    error: (message: string) => push(message, 'error'),
    info: (message: string) => push(message, 'info'),
    dismiss,
  }
}
