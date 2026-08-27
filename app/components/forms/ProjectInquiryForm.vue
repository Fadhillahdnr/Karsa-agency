<script setup lang="ts">
const { t } = useI18n()

const serviceValues = ['website', 'ecommerce', 'web-application', 'custom-software', 'ui-ux', 'maintenance', 'other'] as const
const serviceOptions = computed(() =>
  serviceValues.map(value => ({ value, label: t(`inquiryForm.serviceOptions.${value}`) })),
)

const budgetOptions = useTmList<string[]>('inquiryForm.budgetOptions')
const timelineOptions = useTmList<string[]>('inquiryForm.timelineOptions')

const form = reactive<InquiryFormState>(createEmptyInquiryForm())
const errors = reactive<Partial<Record<keyof InquiryFormState, string>>>({})
const turnstileToken = ref('')
const turnstileWidget = ref<{ reset: () => void } | null>(null)
const attemptedSubmit = ref(false)

const { status, errorMessage, referenceId, submit, reset } = useProjectInquiry()
const { public: publicConfig } = useRuntimeConfig()
const { track } = useAnalytics()
const hasTrackedStart = ref(false)

function trackStartOnce() {
  if (hasTrackedStart.value) return
  hasTrackedStart.value = true
  track('inquiry_start')
}

function validateField(field: keyof InquiryFormState): string {
  switch (field) {
    case 'name':
      return form.name.trim().length >= 2 ? '' : t('inquiryForm.errors.name')
    case 'email':
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()) ? '' : t('inquiryForm.errors.email')
    case 'service':
      return form.service ? '' : t('inquiryForm.errors.service')
    case 'projectDescription':
      return form.projectDescription.trim().length >= 30
        ? ''
        : t('inquiryForm.errors.projectDescription')
    default:
      return ''
  }
}

function validateAll(): boolean {
  const fields: (keyof InquiryFormState)[] = ['name', 'email', 'service', 'projectDescription']
  let valid = true
  for (const field of fields) {
    const message = validateField(field)
    errors[field] = message
    if (message) valid = false
  }
  return valid
}

function handleBlur(field: keyof InquiryFormState) {
  if (attemptedSubmit.value) errors[field] = validateField(field)
}

async function handleSubmit() {
  attemptedSubmit.value = true
  const valid = validateAll()
  if (!valid) return

  if (publicConfig.turnstileSiteKey && !turnstileToken.value) {
    errorMessageOverride.value = t('inquiryForm.errors.verification')
    return
  }

  errorMessageOverride.value = ''
  await submit(form, turnstileToken.value)

  if (status.value === 'success') {
    Object.assign(form, createEmptyInquiryForm())
    attemptedSubmit.value = false
    turnstileToken.value = ''
  }
  else {
    turnstileWidget.value?.reset()
  }
}

const errorMessageOverride = ref('')

function handleReset() {
  reset()
  Object.assign(form, createEmptyInquiryForm())
  attemptedSubmit.value = false
}
</script>

<template>
  <div>
    <div
      v-if="status === 'success'"
      role="status"
      class="rounded-[var(--radius-lg)] border border-[var(--color-accent)] bg-[var(--color-accent-soft)] p-8"
    >
      <p class="font-display text-2xl font-medium">
        {{ t('inquiryForm.successTitle') }}
      </p>
      <p class="mt-3 text-sm text-[var(--color-text-muted)]">
        {{ t('inquiryForm.successBody') }}
        <strong class="text-[var(--color-text)]">{{ referenceId }}</strong>. {{ t('inquiryForm.successNote') }}
      </p>
      <BaseButton
        class="mt-6"
        variant="secondary"
        @click="handleReset"
      >
        {{ t('inquiryForm.submitAnother') }}
      </BaseButton>
    </div>

    <form
      v-else
      class="flex flex-col gap-8"
      novalidate
      @submit.prevent="handleSubmit"
      @focusin.once="trackStartOnce"
    >
      <div
        v-if="status === 'error' && (errorMessage || errorMessageOverride)"
        role="alert"
        class="rounded-[var(--radius-md)] border border-[var(--color-danger)] bg-[var(--color-danger)]/10 p-4 text-sm"
      >
        {{ errorMessageOverride || errorMessage }}
      </div>

      <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label
            for="inquiry-name"
            class="mb-2 block text-sm font-medium"
          >{{ t('inquiryForm.name') }} <span aria-hidden="true">*</span></label>
          <input
            id="inquiry-name"
            v-model="form.name"
            type="text"
            autocomplete="name"
            :aria-invalid="!!errors.name"
            :aria-describedby="errors.name ? 'inquiry-name-error' : undefined"
            class="w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm focus-visible:border-[var(--color-accent)]"
            @blur="handleBlur('name')"
          >
          <p
            v-if="errors.name"
            id="inquiry-name-error"
            class="mt-2 text-sm text-[var(--color-danger)]"
          >
            {{ errors.name }}
          </p>
        </div>

        <div>
          <label
            for="inquiry-email"
            class="mb-2 block text-sm font-medium"
          >{{ t('inquiryForm.email') }} <span aria-hidden="true">*</span></label>
          <input
            id="inquiry-email"
            v-model="form.email"
            type="email"
            autocomplete="email"
            :aria-invalid="!!errors.email"
            :aria-describedby="errors.email ? 'inquiry-email-error' : undefined"
            class="w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm focus-visible:border-[var(--color-accent)]"
            @blur="handleBlur('email')"
          >
          <p
            v-if="errors.email"
            id="inquiry-email-error"
            class="mt-2 text-sm text-[var(--color-danger)]"
          >
            {{ errors.email }}
          </p>
        </div>

        <div>
          <label
            for="inquiry-company"
            class="mb-2 block text-sm font-medium"
          >{{ t('inquiryForm.company') }}</label>
          <input
            id="inquiry-company"
            v-model="form.company"
            type="text"
            autocomplete="organization"
            class="w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm focus-visible:border-[var(--color-accent)]"
          >
        </div>

        <div>
          <label
            for="inquiry-phone"
            class="mb-2 block text-sm font-medium"
          >{{ t('inquiryForm.phone') }}</label>
          <input
            id="inquiry-phone"
            v-model="form.phone"
            type="tel"
            autocomplete="tel"
            class="w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm focus-visible:border-[var(--color-accent)]"
          >
        </div>

        <div>
          <label
            for="inquiry-service"
            class="mb-2 block text-sm font-medium"
          >{{ t('inquiryForm.service') }} <span aria-hidden="true">*</span></label>
          <select
            id="inquiry-service"
            v-model="form.service"
            :aria-invalid="!!errors.service"
            :aria-describedby="errors.service ? 'inquiry-service-error' : undefined"
            class="w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm focus-visible:border-[var(--color-accent)]"
            @blur="handleBlur('service')"
          >
            <option
              value=""
              disabled
            >
              {{ t('inquiryForm.selectService') }}
            </option>
            <option
              v-for="option in serviceOptions"
              :key="option.value"
              :value="option.value"
            >
              {{ option.label }}
            </option>
          </select>
          <p
            v-if="errors.service"
            id="inquiry-service-error"
            class="mt-2 text-sm text-[var(--color-danger)]"
          >
            {{ errors.service }}
          </p>
        </div>

        <div>
          <label
            for="inquiry-budget"
            class="mb-2 block text-sm font-medium"
          >{{ t('inquiryForm.budgetRange') }}</label>
          <select
            id="inquiry-budget"
            v-model="form.budgetRange"
            class="w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm focus-visible:border-[var(--color-accent)]"
          >
            <option value="">
              {{ t('inquiryForm.selectBudget') }}
            </option>
            <option
              v-for="option in budgetOptions"
              :key="option"
              :value="option"
            >
              {{ option }}
            </option>
          </select>
        </div>

        <div>
          <label
            for="inquiry-timeline"
            class="mb-2 block text-sm font-medium"
          >{{ t('inquiryForm.timeline') }}</label>
          <select
            id="inquiry-timeline"
            v-model="form.timeline"
            class="w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm focus-visible:border-[var(--color-accent)]"
          >
            <option value="">
              {{ t('inquiryForm.selectTimeline') }}
            </option>
            <option
              v-for="option in timelineOptions"
              :key="option"
              :value="option"
            >
              {{ option }}
            </option>
          </select>
        </div>

        <div>
          <label
            for="inquiry-referral"
            class="mb-2 block text-sm font-medium"
          >{{ t('inquiryForm.referralSource') }}</label>
          <input
            id="inquiry-referral"
            v-model="form.referralSource"
            type="text"
            class="w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm focus-visible:border-[var(--color-accent)]"
          >
        </div>
      </div>

      <div>
        <label
          for="inquiry-description"
          class="mb-2 block text-sm font-medium"
        >
          {{ t('inquiryForm.projectDescription') }} <span aria-hidden="true">*</span>
        </label>
        <textarea
          id="inquiry-description"
          v-model="form.projectDescription"
          rows="6"
          :aria-invalid="!!errors.projectDescription"
          :aria-describedby="errors.projectDescription ? 'inquiry-description-error' : undefined"
          class="w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm focus-visible:border-[var(--color-accent)]"
          @blur="handleBlur('projectDescription')"
        />
        <p
          v-if="errors.projectDescription"
          id="inquiry-description-error"
          class="mt-2 text-sm text-[var(--color-danger)]"
        >
          {{ errors.projectDescription }}
        </p>
      </div>

      <TurnstileWidget
        ref="turnstileWidget"
        @verified="(token) => (turnstileToken = token)"
        @expired="turnstileToken = ''"
        @error="turnstileToken = ''"
      />

      <div>
        <BaseButton
          type="submit"
          variant="primary"
          :disabled="status === 'submitting'"
        >
          {{ status === 'submitting' ? t('inquiryForm.submitting') : t('inquiryForm.submit') }}
        </BaseButton>
      </div>
    </form>
  </div>
</template>
