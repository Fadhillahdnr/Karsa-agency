import { z } from 'zod'

export const inquirySchema = z.object({
  name: z.string().trim().min(2).max(100),
  company: z.string().trim().max(150).optional().or(z.literal('')),
  email: z.string().trim().email().max(254),
  phone: z.string().trim().max(40).optional().or(z.literal('')),
  service: z.enum([
    'website',
    'ecommerce',
    'web-application',
    'custom-software',
    'ui-ux',
    'maintenance',
    'other',
  ]),
  budgetRange: z.string().trim().max(60).optional().or(z.literal('')),
  timeline: z.string().trim().max(60).optional().or(z.literal('')),
  projectDescription: z.string().trim().min(30).max(5000),
  referralSource: z.string().trim().max(100).optional().or(z.literal('')),
  turnstileToken: z.string().max(4000).optional().or(z.literal('')),
})

export type InquiryInput = z.infer<typeof inquirySchema>
