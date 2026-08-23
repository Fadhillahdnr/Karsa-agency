<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin-auth' })

const { login } = useAdminAuth()
const route = useRoute()

const email = ref('')
const password = ref('')
const errorMessage = ref('')
const submitting = ref(false)

async function handleSubmit() {
  submitting.value = true
  errorMessage.value = ''

  const { error } = await login(email.value, password.value)

  submitting.value = false

  if (error) {
    errorMessage.value = error
    return
  }

  const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : '/admin/projects'
  await navigateTo(redirect)
}
</script>

<template>
  <div class="mx-auto max-w-sm py-16">
    <h1 class="font-display text-2xl font-medium">
      Admin sign in
    </h1>
    <p class="mt-2 text-sm text-[var(--color-text-muted)]">
      Sign in with your admin account to manage work projects.
    </p>

    <form
      class="mt-8 flex flex-col gap-6"
      novalidate
      @submit.prevent="handleSubmit"
    >
      <div
        v-if="errorMessage"
        role="alert"
        class="rounded-[var(--radius-md)] border border-[var(--color-danger)] bg-[var(--color-danger)]/10 p-4 text-sm"
      >
        {{ errorMessage }}
      </div>

      <div>
        <label
          for="admin-email"
          class="mb-2 block text-sm font-medium"
        >Email</label>
        <input
          id="admin-email"
          v-model="email"
          type="email"
          required
          autocomplete="email"
          class="w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm focus-visible:border-[var(--color-accent)]"
        >
      </div>

      <div>
        <label
          for="admin-password"
          class="mb-2 block text-sm font-medium"
        >Password</label>
        <input
          id="admin-password"
          v-model="password"
          type="password"
          required
          autocomplete="current-password"
          class="w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm focus-visible:border-[var(--color-accent)]"
        >
      </div>

      <BaseButton
        type="submit"
        variant="primary"
        :disabled="submitting"
      >
        {{ submitting ? 'Signing in…' : 'Sign in' }}
      </BaseButton>
    </form>
  </div>
</template>
