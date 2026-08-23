import { siteConfig, navLinks, primaryCta } from '~/utils/site-config'

export function useKarsaConfig() {
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

  return {
    site: siteConfig,
    navLinks,
    primaryCta,
    contactChannels,
  }
}
