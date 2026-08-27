import { siteConfig, navRoutes, primaryCtaRoute } from '~/utils/site-config'

interface MethodStep {
  step: string
  name: string
  description: string
}

/**
 * Locale-reactive site config. Returns computed refs (not plain values)
 * because SiteHeader/SiteFooter live in the persistent default layout —
 * they don't remount on a locale-only navigation the way page components
 * do, so a plain (non-reactive) value would stay frozen on the first
 * locale the app loaded with.
 */
export function useKarsaConfig() {
  const { t } = useI18n()

  const contactChannels = computed(() =>
    [
      siteConfig.email ? { label: 'Email', href: `mailto:${siteConfig.email}` } : null,
      siteConfig.whatsapp
        ? { label: 'WhatsApp', href: `https://wa.me/${siteConfig.whatsapp}` }
        : null,
      siteConfig.instagram ? { label: 'Instagram', href: siteConfig.instagram } : null,
      siteConfig.linkedin ? { label: 'LinkedIn', href: siteConfig.linkedin } : null,
    ].filter((channel): channel is { label: string, href: string } => channel !== null),
  )

  const navLinks = computed(() => {
    const labels = [t('nav.work'), t('nav.services'), t('nav.studio')]
    return navRoutes.map((to, i) => ({ label: labels[i]!, to }))
  })

  const primaryCta = computed(() => ({ label: t('nav.startProject'), to: primaryCtaRoute }))

  const site = computed(() => ({
    ...siteConfig,
    title: t('site.title'),
    tagline: 'Dari Karsa Menjadi Karya.',
    description: t('site.description'),
    availability: t('site.availability'),
  }))

  const karsaMethod = useTmList<MethodStep[]>('karsaMethod.steps')
  const deliveryStages = useTmList<string[]>('deliveryTrust.stages')

  return {
    site,
    navLinks,
    primaryCta,
    contactChannels,
    karsaMethod,
    deliveryStages,
  }
}
