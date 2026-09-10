<script setup lang="ts">
import type { PortfolioDetailItem } from '../../../server/api/portfolio/[discipline]/[slug].get'

const props = defineProps<{
  discipline: 'design' | 'photography' | 'videography'
}>()

const route = useRoute()
const { t, locale } = useI18n()
const localePath = useLocalePath()
const slug = route.params.slug as string

const { data: item } = await useAsyncData(`portfolio-${props.discipline}-${slug}-${locale.value}`, () =>
  $fetch<PortfolioDetailItem | null>(`/api/portfolio/${props.discipline}/${slug}`, { query: { locale: locale.value } }),
)

if (!item.value) {
  throw createError({ statusCode: 404, statusMessage: 'Not found', fatal: true })
}

useSeoMeta({
  title: item.value.seoTitle || item.value.title,
  description: item.value.seoDescription || item.value.summary || undefined,
  ogTitle: item.value.title,
  ogDescription: item.value.summary || undefined,
  ogImage: item.value.ogImageUrl || undefined,
})

const disciplineLabel: Record<typeof props.discipline, string> = {
  design: 'Design',
  photography: 'Photography',
  videography: 'Videography',
}

useSchemaOrg([
  defineBreadcrumb({
    itemListElement: [
      { name: disciplineLabel[props.discipline], item: `/${props.discipline}` },
      { name: item.value.title },
    ],
  }),
])

/** YouTube/Vimeo URL -> embeddable iframe src. Falls back to the raw URL (opens as a plain link) for anything else. */
function embedSrc(url: string): string {
  const youtube = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([\w-]+)/)
  if (youtube) return `https://www.youtube-nocookie.com/embed/${youtube[1]}`
  const vimeo = url.match(/vimeo\.com\/(\d+)/)
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`
  return url
}

const imageTypes = new Set(['image', 'mockup', 'before', 'after'])

const lightboxImages = computed(() =>
  (item.value?.items ?? [])
    .filter(media => imageTypes.has(media.itemType) && media.url)
    .map(media => ({ url: media.url as string, alt: media.altText || item.value!.title, caption: media.caption })),
)

/** Maps an index in `item.items` (all media types) to its position in `lightboxImages` (images only), for click-to-open. */
function lightboxIndexFor(index: number): number {
  let count = 0
  for (let i = 0; i < index; i++) {
    if (imageTypes.has(item.value!.items[i]!.itemType) && item.value!.items[i]!.url) count++
  }
  return count
}

const openLightboxIndex = ref<number | null>(null)
</script>

<template>
  <div v-if="item">
    <BaseSection
      tight
      class="pt-32"
    >
      <p
        v-if="item.category"
        class="text-eyebrow"
      >
        {{ item.category }}
      </p>
      <BaseHeading
        size="display-2"
        as="h1"
        class="mt-4"
      >
        {{ item.title }}
      </BaseHeading>
      <p
        v-if="item.summary"
        class="mt-6 max-w-xl text-[length:var(--text-body-lg)] text-[var(--color-text-muted)]"
      >
        {{ item.summary }}
      </p>
      <div class="mt-10">
        <BaseButton to="/start-a-project">
          {{ t('serviceDetail.start') }} ↗
        </BaseButton>
      </div>
    </BaseSection>

    <BaseSection
      v-if="item.description"
      tight
      narrow
      class="border-t border-[var(--color-border)]"
    >
      <p class="text-[length:var(--text-body-lg)] text-[var(--color-text-muted)]">
        {{ item.description }}
      </p>
    </BaseSection>

    <BaseSection
      v-if="item.items.length"
      tight
      class="border-t border-[var(--color-border)]"
    >
      <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <figure
          v-for="(media, index) in item.items"
          :key="index"
          class="overflow-hidden rounded-[var(--radius-lg)] bg-[var(--color-surface)]"
          :class="{ 'sm:col-span-2': media.featured }"
        >
          <button
            v-if="imageTypes.has(media.itemType) && media.url"
            type="button"
            class="block w-full cursor-zoom-in"
            :aria-label="t('portfolio.lightbox.open')"
            @click="openLightboxIndex = lightboxIndexFor(index)"
          >
            <NuxtImg
              :src="media.url ?? undefined"
              :alt="media.altText || item.title"
              loading="lazy"
              class="w-full object-cover"
            />
          </button>

          <video
            v-else-if="media.itemType === 'video' && media.url"
            :src="media.url"
            :poster="media.posterUrl ?? undefined"
            controls
            playsinline
            class="aspect-video w-full"
          />

          <div
            v-else-if="media.itemType === 'external_video' && media.externalUrl"
            class="aspect-video w-full"
          >
            <iframe
              :src="embedSrc(media.externalUrl)"
              class="h-full w-full"
              title="Video"
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
            />
          </div>

          <figcaption
            v-if="media.caption"
            class="p-4 text-sm text-[var(--color-text-muted)]"
          >
            {{ media.caption }}
          </figcaption>
        </figure>
      </div>
    </BaseSection>

    <BaseSection
      v-if="item.credits"
      tight
      class="border-t border-[var(--color-border)]"
    >
      <p class="text-eyebrow mb-2">
        {{ t('portfolio.credits') }}
      </p>
      <p class="text-sm text-[var(--color-text-muted)]">
        {{ item.credits }}
      </p>
    </BaseSection>

    <div class="border-t border-[var(--color-border)] pt-6 pb-16">
      <BaseContainer>
        <NuxtLink
          :to="localePath(`/${discipline}`)"
          class="text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--color-accent)]"
        >
          ← {{ t('portfolio.backToWork') }}
        </NuxtLink>
      </BaseContainer>
    </div>

    <FinalCTA />

    <PortfolioLightbox
      v-model="openLightboxIndex"
      :items="lightboxImages"
    />
  </div>
</template>
