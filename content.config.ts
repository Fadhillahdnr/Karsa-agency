import { defineContentConfig, defineCollection, z } from '@nuxt/content'

const workSchema = z.object({
  title: z.string(),
  year: z.number(),
  type: z.enum(['Independent Project', 'Internal Concept', 'Experimental Work']),
  category: z.string(),
  services: z.array(z.string()),
  description: z.string(),
  cover: z.string(),
  featured: z.boolean().default(false),
  challenge: z.string().optional(),
  approach: z.string().optional(),
  outcome: z.string().optional(),
  liveUrl: z.string().optional(),
  githubUrl: z.string().optional(),
  order: z.number().default(0),
})

const serviceSchema = z.object({
  title: z.string(),
  pillar: z.enum(['Design', 'Build', 'Grow']),
  summary: z.string(),
  whoItsFor: z.array(z.string()),
  problems: z.array(z.string()),
  deliverables: z.array(z.string()),
  faq: z.array(z.object({ question: z.string(), answer: z.string() })).default([]),
  order: z.number().default(0),
})

export default defineContentConfig({
  collections: {
    work: defineCollection({
      type: 'page',
      source: 'work/*.md',
      schema: workSchema,
    }),
    // Indonesian translations, stored under content/id/ so the source
    // language (English) files stay untouched. `prefix` keeps the
    // generated `.path` identical to the `work` collection (/work/<slug>)
    // so pages can query either collection with the same path.
    workId: defineCollection({
      type: 'page',
      source: { include: 'id/work/*.md', prefix: '/work' },
      schema: workSchema,
    }),
    services: defineCollection({
      type: 'page',
      source: 'services/*.md',
      schema: serviceSchema,
    }),
    servicesId: defineCollection({
      type: 'page',
      source: { include: 'id/services/*.md', prefix: '/services' },
      schema: serviceSchema,
    }),
  },
})
