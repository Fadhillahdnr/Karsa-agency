<script setup lang="ts">
const { contactChannels } = useKarsaConfig()
const { t } = useI18n()
const thirdPartyItems = useTmList<string[]>('privacy.thirdPartyItems')

useSeoMeta({
  title: t('privacy.title'),
  description: t('privacy.metaDescription'),
})
</script>

<template>
  <div>
    <BaseSection
      tight
      narrow
      class="pt-32"
    >
      <BaseHeading
        :eyebrow="t('privacy.eyebrow')"
        size="display-2"
        as="h1"
      >
        {{ t('privacy.title') }}
      </BaseHeading>

      <div class="prose prose-invert mt-12 max-w-none prose-headings:font-display prose-headings:font-medium prose-p:text-[var(--color-text-muted)] prose-li:text-[var(--color-text-muted)]">
        <h2>{{ t('privacy.whatWeCollectTitle') }}</h2>
        <p>{{ t('privacy.whatWeCollectBody') }}</p>

        <h2>{{ t('privacy.whyWeCollectTitle') }}</h2>
        <p>{{ t('privacy.whyWeCollectBody') }}</p>

        <h2>{{ t('privacy.storageTitle') }}</h2>
        <p>{{ t('privacy.storageBody') }}</p>

        <h2>{{ t('privacy.thirdPartyTitle') }}</h2>
        <p>{{ t('privacy.thirdPartyIntro') }}</p>
        <ul>
          <li
            v-for="item in thirdPartyItems"
            :key="item"
          >
            {{ item }}
          </li>
        </ul>
        <p>{{ t('privacy.thirdPartyOutro') }}</p>

        <h2>{{ t('privacy.analyticsTitle') }}</h2>
        <p>{{ t('privacy.analyticsBody') }}</p>

        <h2>{{ t('privacy.yourDataTitle') }}</h2>
        <p>{{ t('privacy.yourDataBody') }}</p>

        <h2>{{ t('privacy.contactTitle') }}</h2>
        <p v-if="contactChannels.length">
          {{ t('privacy.contactWithChannels') }}
          <a
            v-for="(channel, i) in contactChannels"
            :key="channel.label"
            :href="channel.href"
          >{{ channel.label }}<span v-if="i < contactChannels.length - 1">, </span></a>.
        </p>
        <p v-else>
          {{ t('privacy.contactWithoutChannelsPrefix') }} <NuxtLink to="/start-a-project">
            {{ t('nav.startProject') }}
          </NuxtLink> {{ t('privacy.contactWithoutChannelsSuffix') }}
        </p>
      </div>
    </BaseSection>
  </div>
</template>
