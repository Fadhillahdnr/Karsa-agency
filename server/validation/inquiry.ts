import { z } from 'zod'

// §23 — broad categories, not the full granular services list (that's what
// selectedPackageId / a specific service page link into project_description
// context are for). Replaces the old software-focused enum (website/
// ecommerce/web-application/custom-software/ui-ux/maintenance/other),
// deferred from M04/M07 until this milestone.
export const inquiryServiceValues = ['website', 'design', 'photography', 'videography', 'integrated-package', 'other'] as const

export const inquirySchema = z.object({
  name: z.string().trim().min(2).max(100),
  company: z.string().trim().max(150).optional().or(z.literal('')),
  email: z.string().trim().email().max(254),
  phone: z.string().trim().max(40).optional().or(z.literal('')),
  service: z.enum(inquiryServiceValues),
  selectedPackageId: z.string().uuid().nullable().optional(),
  budgetRange: z.string().trim().max(60).optional().or(z.literal('')),
  timeline: z.string().trim().max(60).optional().or(z.literal('')),
  projectDescription: z.string().trim().min(30).max(5000),
  preferredContact: z.enum(['email', 'phone', 'whatsapp']).optional().or(z.literal('')),
  referralSource: z.string().trim().max(100).optional().or(z.literal('')),
  sourcePage: z.string().trim().max(300).optional().or(z.literal('')),
  utmSource: z.string().trim().max(150).optional().or(z.literal('')),
  utmMedium: z.string().trim().max(150).optional().or(z.literal('')),
  utmCampaign: z.string().trim().max(150).optional().or(z.literal('')),
  utmContent: z.string().trim().max(150).optional().or(z.literal('')),
  utmTerm: z.string().trim().max(150).optional().or(z.literal('')),
  locale: z.string().trim().max(10).optional().or(z.literal('')),
  consentPrivacy: z.literal(true),
  turnstileToken: z.string().max(4000).optional().or(z.literal('')),
})

export type InquiryInput = z.infer<typeof inquirySchema>
