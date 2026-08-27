<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin-auth' })

const { login } = useAdminAuth()
const route = useRoute()

const email = ref('')
const password = ref('')
const errorMessage = ref('')
const submitting = ref(false)
const showPassword = ref(false)

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
  <div class="flex h-full min-h-[70vh] items-center justify-center">
    <div class="w-full max-w-sm rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-8 shadow-[var(--shadow-md)]">
      <div class="flex flex-col items-center text-center">
        <div class="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-accent)]/10 text-[var(--color-accent)]">
          <AdminIcon
            name="dashboard"
            :size="22"
          />
        </div>
        <h1 class="mt-4 font-display text-2xl font-medium">
          Admin sign in
        </h1>
        <p class="mt-2 text-sm text-[var(--color-text-muted)]">
          Sign in to manage projects and leads.
        </p>
      </div>

      <form
        class="mt-8 flex flex-col gap-5"
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
            autofocus
            class="w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 text-sm focus-visible:border-[var(--color-accent)]"
          >
        </div>

        <div>
          <label
            for="admin-password"
            class="mb-2 block text-sm font-medium"
          >Password</label>
          <div class="relative">
            <input
              id="admin-password"
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              required
              autocomplete="current-password"
              class="w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 pr-11 text-sm focus-visible:border-[var(--color-accent)]"
            >
            <button
              type="button"
              class="absolute top-1/2 right-3 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
              :aria-label="showPassword ? 'Hide password' : 'Show password'"
              @click="showPassword = !showPassword"
            >
              <AdminIcon
                :name="showPassword ? 'eye-off' : 'eye'"
                :size="18"
              />
            </button>
          </div>
        </div>

        <BaseButton
          type="submit"
          variant="primary"
          :disabled="submitting"
          class="mt-1"
        >
          <AdminIcon
            v-if="submitting"
            name="spinner"
            :size="16"
          />
          {{ submitting ? 'Signing in…' : 'Sign in' }}
        </BaseButton>
      </form>
    </div>
  </div>
</template>
