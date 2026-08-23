export default defineNuxtRouteMiddleware(async (to) => {
  if (import.meta.server) return

  const { isAuthenticated, init } = useAdminAuth()
  await init()

  if (!isAuthenticated.value && to.path !== '/admin/login') {
    return navigateTo(`/admin/login?redirect=${encodeURIComponent(to.fullPath)}`)
  }

  if (isAuthenticated.value && to.path === '/admin/login') {
    return navigateTo('/admin/projects')
  }
})
