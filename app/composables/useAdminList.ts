export function useAdminList<T>(fetcher: () => Promise<T[]>, errorMessage: string) {
  const items = ref<T[]>([]) as Ref<T[]>
  const loading = ref(true)
  const error = ref('')

  async function load() {
    loading.value = true
    error.value = ''
    try {
      items.value = await fetcher()
    }
    catch {
      error.value = errorMessage
    }
    finally {
      loading.value = false
    }
  }

  return { items, loading, error, load }
}
