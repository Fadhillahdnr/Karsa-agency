<script setup lang="ts">
import type { PackageApiItem } from '../../../server/api/packages/index.get'

const { t, locale } = useI18n()
const localePath = useLocalePath()

const serviceValues = ['website', 'design', 'photography', 'videography', 'integrated-package', 'other'] as const
const serviceOptions = computed(() =>
  serviceValues.map(value => ({ value, label: t(`inquiryForm.serviceOptions.${value}`) })),
)

const preferredContactValues = ['email', 'phone', 'whatsapp'] as const
const preferredContactOptions = computed(() =>
  preferredContactValues.map(value => ({ value, label: t(`inquiryForm.preferredContactOptions.${value}`) })),
)

const budgetOptions = useTmList<string[]>('inquiryForm.budgetOptions')
const timelineOptions = useTmList<string[]>('inquiryForm.timelineOptions')

const { data: packages } = await useAsyncData(`inquiry-packages-${locale.value}`, () =>
  $fetch<PackageApiItem[]>('/api/packages', { query: { locale: locale.value } }),
)

function packagePriceLabel(pkg: PackageApiItem) {
  if (pkg.priceType === 'custom' || pkg.price == null) return t('packagesIndex.custom')
  const formatted = `${pkg.currency} ${pkg.price.toLocaleString(locale.value)}`
  if (pkg.priceType === 'starting_from') return `${t('packagesIndex.startingFrom')} ${formatted}`
  if (pkg.priceType === 'monthly') return `${formatted}${t('packagesIndex.monthly')}`
  return formatted
}

const form = reactive<InquiryFormState>(createEmptyInquiryForm())
const errors = reactive<Partial<Record<'name' | 'email' | 'service' | 'projectDescription' | 'consentPrivacy', string>>>({})
const turnstileToken = ref('')
const turnstileWidget = ref<{ reset: () => void } | null>(null)
const errorMessageOverride = ref('')

const { status, errorMessage, referenceId, submit, reset } = useProjectInquiry()
const { public: publicConfig } = useRuntimeConfig()
const { track } = useAnalytics()
const hasTrackedStart = ref(false)

function trackStartOnce() {
  if (hasTrackedStart.value) return
  hasTrackedStart.value = true
  track('inquiry_start')
}

const stepKeys = ['service', 'project', 'budget', 'about', 'review'] as const
type StepKey = (typeof stepKeys)[number]
const currentStep = ref(0)
const attemptedStepAdvance = ref(false)

function validateField(field: 'name' | 'email' | 'service' | 'projectDescription'): string {
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
  }
}

function isStepValid(step: StepKey): boolean {
  switch (step) {
    case 'service':
      return !!form.service
    case 'project':
      return form.projectDescription.trim().length >= 30
    case 'budget':
      return true
    case 'about':
      return form.name.trim().length >= 2 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())
    case 'review':
      return form.consentPrivacy
  }
}

function applyStepErrors(step: StepKey) {
  if (step === 'service') errors.service = validateField('service')
  if (step === 'project') errors.projectDescription = validateField('projectDescription')
  if (step === 'about') {
    errors.name = validateField('name')
    errors.email = validateField('email')
  }
  if (step === 'review') errors.consentPrivacy = form.consentPrivacy ? '' : t('inquiryForm.errors.consent')
}

function goNext() {
  attemptedStepAdvance.value = true
  const step = stepKeys[currentStep.value]!
  applyStepErrors(step)
  if (!isStepValid(step)) return

  attemptedStepAdvance.value = false
  trackStartOnce()
  track('inquiry_step', { step: currentStep.value + 1, key: step })
  if (currentStep.value < stepKeys.length - 1) currentStep.value += 1
}

function goBack() {
  attemptedStepAdvance.value = false
  if (currentStep.value > 0) currentStep.value -= 1
}

function goToStep(index: number) {
  if (index < currentStep.value) {
    attemptedStepAdvance.value = false
    currentStep.value = index
  }
}

function selectPackage(pkg: PackageApiItem | null) {
  form.selectedPackageId = pkg ? pkg.id : null
}

async function handleSubmit() {
  attemptedStepAdvance.value = true
  applyStepErrors('review')
  if (!isStepValid('review')) return

  if (publicConfig.turnstileSiteKey && !turnstileToken.value) {
    errorMessageOverride.value = t('inquiryForm.errors.verification')
    return
  }

  errorMessageOverride.value = ''
  await submit(form, turnstileToken.value)

  if (status.value === 'success') {
    Object.assign(form, createEmptyInquiryForm())
    attemptedStepAdvance.value = false
    currentStep.value = 0
    turnstileToken.value = ''
  }
  else {
    turnstileWidget.value?.reset()
  }
}

function handleReset() {
  reset()
  Object.assign(form, createEmptyInquiryForm())
  attemptedStepAdvance.value = false
  currentStep.value = 0
}

const selectedPackage = computed(() => (packages.value ?? []).find(p => p.id === form.selectedPackageId) ?? null)
const serviceLabel = computed(() => serviceOptions.value.find(o => o.value === form.service)?.label ?? '')
const preferredContactLabel = computed(() => preferredContactOptions.value.find(o => o.value === form.preferredContact)?.label ?? '')

const fieldClass = 'w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm focus-visible:border-[var(--color-accent)]'
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
      @submit.prevent="currentStep === stepKeys.length - 1 ? handleSubmit() : goNext()"
    >
      <div>
        <p class="text-xs font-medium text-[var(--color-text-muted)]">
          {{ t('inquiryForm.stepOf', { current: currentStep + 1, total: stepKeys.length }) }}
        </p>
        <div class="mt-3 flex gap-1.5">
          <div
            v-for="(step, i) in stepKeys"
            :key="step"
            class="h-1 flex-1 rounded-full transition-colors"
            :class="i <= currentStep ? 'bg-[var(--color-accent)]' : 'bg-[var(--color-border)]'"
          />
        </div>
        <h2 class="mt-4 font-display text-xl font-medium">
          {{ t(`inquiryForm.steps.${stepKeys[currentStep]}`) }}
        </h2>
      </div>

      <div
        v-if="status === 'error' && (errorMessage || errorMessageOverride)"
        role="alert"
        class="rounded-[var(--radius-md)] border border-[var(--color-danger)] bg-[var(--color-danger)]/10 p-4 text-sm"
      >
        {{ errorMessageOverride || errorMessage }}
      </div>

      <!-- Step 1: service -->
      <div
        v-show="currentStep === 0"
        class="grid grid-cols-1 gap-3 sm:grid-cols-2"
      >
        <button
          v-for="option in serviceOptions"
          :key="option.value"
          type="button"
          class="rounded-[var(--radius-md)] border px-5 py-4 text-left text-sm font-medium transition-colors"
          :class="form.service === option.value
            ? 'border-[var(--color-accent)] bg-[var(--color-accent)]/10 text-[var(--color-accent)]'
            : 'border-[var(--color-border)] hover:border-[var(--color-text-muted)]'"
          @click="form.service = option.value"
        >
          {{ option.label }}
        </button>
      </div>
      <p
        v-if="currentStep === 0 && attemptedStepAdvance && errors.service"
        class="text-sm text-[var(--color-danger)]"
      >
        {{ errors.service }}
      </p>

      <!-- Step 2: project -->
      <div
        v-show="currentStep === 1"
        class="flex flex-col gap-6"
      >
        <div v-if="packages?.length">
          <p class="text-sm font-medium">
            {{ t('inquiryForm.packageSectionTitle') }}
          </p>
          <p class="mt-1 text-xs text-[var(--color-text-muted)]">
            {{ t('inquiryForm.packageSectionSubtitle') }}
          </p>
          <div class="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <button
              type="button"
              class="rounded-[var(--radius-md)] border px-4 py-3 text-left text-sm transition-colors"
              :class="!form.selectedPackageId
                ? 'border-[var(--color-accent)] bg-[var(--color-accent)]/10'
                : 'border-[var(--color-border)] hover:border-[var(--color-text-muted)]'"
              @click="selectPackage(null)"
            >
              <span class="font-medium">{{ t('inquiryForm.noPackage') }}</span>
            </button>
            <button
              v-for="pkg in packages"
              :key="pkg.slug"
              type="button"
              class="rounded-[var(--radius-md)] border px-4 py-3 text-left text-sm transition-colors"
              :class="form.selectedPackageId === pkg.id
                ? 'border-[var(--color-accent)] bg-[var(--color-accent)]/10'
                : 'border-[var(--color-border)] hover:border-[var(--color-text-muted)]'"
              @click="selectPackage(pkg)"
            >
              <span class="font-medium">{{ pkg.title }}</span>
              <span class="mt-1 block text-xs text-[var(--color-text-muted)]">{{ packagePriceLabel(pkg) }}</span>
            </button>
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
            :class="fieldClass"
          />
          <p
            v-if="attemptedStepAdvance && errors.projectDescription"
            id="inquiry-description-error"
            class="mt-2 text-sm text-[var(--color-danger)]"
          >
            {{ errors.projectDescription }}
          </p>
        </div>
      </div>

      <!-- Step 3: budget & timeline -->
      <div
        v-show="currentStep === 2"
        class="grid grid-cols-1 gap-6 sm:grid-cols-2"
      >
        <div>
          <label
            for="inquiry-budget"
            class="mb-2 block text-sm font-medium"
          >{{ t('inquiryForm.budgetRange') }}</label>
          <select
            id="inquiry-budget"
            v-model="form.budgetRange"
            :class="fieldClass"
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
            :class="fieldClass"
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
      </div>

      <!-- Step 4: about you -->
      <div
        v-show="currentStep === 3"
        class="grid grid-cols-1 gap-6 sm:grid-cols-2"
      >
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
            :class="fieldClass"
          >
          <p
            v-if="attemptedStepAdvance && errors.name"
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
            :class="fieldClass"
          >
          <p
            v-if="attemptedStepAdvance && errors.email"
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
            :class="fieldClass"
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
            :class="fieldClass"
          >
        </div>

        <div>
          <label
            for="inquiry-preferred-contact"
            class="mb-2 block text-sm font-medium"
          >{{ t('inquiryForm.preferredContact') }}</label>
          <select
            id="inquiry-preferred-contact"
            v-model="form.preferredContact"
            :class="fieldClass"
          >
            <option value="">
              {{ t('inquiryForm.selectPreferredContact') }}
            </option>
            <option
              v-for="option in preferredContactOptions"
              :key="option.value"
              :value="option.value"
            >
              {{ option.label }}
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
            :class="fieldClass"
          >
        </div>
      </div>

      <!-- Step 5: review & submit -->
      <div
        v-show="currentStep === 4"
        class="flex flex-col gap-6"
      >
        <div class="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] divide-y divide-[var(--color-border)]">
          <div class="flex items-center justify-between gap-4 p-4">
            <div>
              <p class="text-xs text-[var(--color-text-muted)]">
                {{ t('inquiryForm.service') }}
              </p>
              <p class="mt-1 text-sm font-medium">
                {{ serviceLabel }}<span v-if="selectedPackage"> · {{ selectedPackage.title }}</span>
              </p>
            </div>
            <button
              type="button"
              class="text-xs font-medium text-[var(--color-text-muted)] hover:text-[var(--color-accent)]"
              @click="goToStep(0)"
            >
              {{ t('inquiryForm.editStep') }}
            </button>
          </div>
          <div class="flex items-center justify-between gap-4 p-4">
            <div class="min-w-0">
              <p class="text-xs text-[var(--color-text-muted)]">
                {{ t('inquiryForm.projectDescription') }}
              </p>
              <p class="mt-1 truncate text-sm font-medium">
                {{ form.projectDescription }}
              </p>
            </div>
            <button
              type="button"
              class="shrink-0 text-xs font-medium text-[var(--color-text-muted)] hover:text-[var(--color-accent)]"
              @click="goToStep(1)"
            >
              {{ t('inquiryForm.editStep') }}
            </button>
          </div>
          <div
            v-if="form.budgetRange || form.timeline"
            class="flex items-center justify-between gap-4 p-4"
          >
            <div>
              <p class="text-xs text-[var(--color-text-muted)]">
                {{ t('inquiryForm.budgetRange') }} / {{ t('inquiryForm.timeline') }}
              </p>
              <p class="mt-1 text-sm font-medium">
                {{ [form.budgetRange, form.timeline].filter(Boolean).join(' · ') || '—' }}
              </p>
            </div>
            <button
              type="button"
              class="text-xs font-medium text-[var(--color-text-muted)] hover:text-[var(--color-accent)]"
              @click="goToStep(2)"
            >
              {{ t('inquiryForm.editStep') }}
            </button>
          </div>
          <div class="flex items-center justify-between gap-4 p-4">
            <div>
              <p class="text-xs text-[var(--color-text-muted)]">
                {{ t('inquiryForm.name') }}
              </p>
              <p class="mt-1 text-sm font-medium">
                {{ form.name }}<span v-if="form.company"> · {{ form.company }}</span>
              </p>
              <p class="mt-1 text-xs text-[var(--color-text-muted)]">
                {{ form.email }}<span v-if="form.phone"> · {{ form.phone }}</span><span v-if="preferredContactLabel"> · {{ preferredContactLabel }}</span>
              </p>
            </div>
            <button
              type="button"
              class="text-xs font-medium text-[var(--color-text-muted)] hover:text-[var(--color-accent)]"
              @click="goToStep(3)"
            >
              {{ t('inquiryForm.editStep') }}
            </button>
          </div>
        </div>

        <label class="flex items-start gap-3 text-sm">
          <input
            v-model="form.consentPrivacy"
            type="checkbox"
            class="mt-0.5 h-4 w-4 shrink-0 rounded border-[var(--color-border)]"
          >
          <i18n-t
            keypath="inquiryForm.consentText"
            tag="span"
            class="text-[var(--color-text-muted)]"
          >
            <template #privacyLink>
              <NuxtLink
                :to="localePath('/privacy')"
                target="_blank"
                class="text-[var(--color-text)] underline hover:text-[var(--color-accent)]"
              >{{ t('inquiryForm.privacyLinkLabel') }}</NuxtLink>
            </template>
          </i18n-t>
        </label>
        <p
          v-if="attemptedStepAdvance && errors.consentPrivacy"
          class="text-sm text-[var(--color-danger)]"
        >
          {{ errors.consentPrivacy }}
        </p>

        <TurnstileWidget
          ref="turnstileWidget"
          @verified="(token) => (turnstileToken = token)"
          @expired="turnstileToken = ''"
          @error="turnstileToken = ''"
        />
      </div>

      <div class="flex items-center justify-between gap-4">
        <BaseButton
          v-if="currentStep > 0"
          type="button"
          variant="secondary"
          @click="goBack"
        >
          {{ t('inquiryForm.back') }}
        </BaseButton>
        <span v-else />

        <BaseButton
          v-if="currentStep < stepKeys.length - 1"
          type="submit"
          variant="primary"
        >
          {{ t('inquiryForm.next') }}
        </BaseButton>
        <BaseButton
          v-else
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
