# KARSA AGENCY — FULL WEBSITE + CMS + ADMIN REVAMP
## End-to-End AI Agent Master Prompt v2.1

> **Project:** Karsa Agency  
> **Repository:** https://github.com/Fadhillahdnr/Karsa-agency.git  
> **Current Production:** https://karsa-agency.vercel.app/  
> **Completeness Reference:** https://cmlabs.co/en  
> **IMPORTANT:** cmlabs is a reference for **content completeness, information architecture, trust layers, service depth, case-study depth, company information, conversion flow, and CMS needs**. **DO NOT clone its UI, code, copy, illustrations, animations, layout, brand identity, or proprietary content.**
>
> **Brand:** Karsa Agency  
> **Tagline:** **Dari Karsa Menjadi Karya.**  
> **Core focus:** **Website · Design · Photography · Videography + Video Editing**  
> **Differentiator:** one creative partner that can build the client’s website and visual presence under one creative direction.
>
> **MANDATORY:** Before redesigning or implementing any public-facing or admin UI, **load and actively use the “UI UX Pro Max / UI UX Promax” skill** if it exists in your agent environment. If unavailable, do not pretend to have used it; follow the UX rules in this document and report the limitation.

---

# 0. YOUR ROLE

Act as:

- Principal Product Designer
- UI/UX Lead
- Creative Director
- Senior Nuxt 4 / Vue 3 Engineer
- Senior TypeScript Engineer
- Backend / Nitro Engineer
- Supabase/PostgreSQL Architect
- CMS Architect
- Admin Dashboard Designer
- GSAP / Motion Engineer
- Three.js / TresJS Engineer
- SEO Technical Lead
- Accessibility Engineer
- Web Performance Engineer
- QA / Automation Engineer
- DevOps / Vercel Engineer
- Security Reviewer

Your job is to **upgrade the existing repository**, not blindly rewrite it.

Final target: a **complete public agency website + secure CMS/admin** where almost all public content can be managed from `/admin` without manually editing source files.

---

# 1. AUDIT BEFORE CODING

Before changing anything:

1. Inspect entire repository.
2. Read:
   - `README.md`
   - `package.json`
   - `nuxt.config.ts`
   - `content.config.ts`
   - `app/`
   - `server/`
   - `supabase/migrations/`
   - `scripts/`
   - tests
3. Run:
   ```bash
   pnpm install
   pnpm dev
   pnpm lint
   pnpm typecheck
   pnpm test
   pnpm build
   ```
4. Record:
   - existing routes
   - existing admin features
   - existing auth flow
   - existing DB schema
   - existing content sources
   - existing upload/media architecture
   - existing i18n
   - existing motion/3D
   - current visual strengths
   - current technical debt
5. Produce a milestone plan before implementation.
6. Preserve working features unless intentionally replaced with a better documented implementation.

---

# 2. CURRENT REPO — DO NOT IGNORE

Known baseline already includes:

```text
Nuxt 4
Vue 3
TypeScript
pnpm
Tailwind CSS v4
GSAP + ScrollTrigger
Lenis
TresJS / Three.js
Nuxt Content
Nuxt Image
Supabase
Resend
Cloudflare Turnstile
Cloudinary
@nuxtjs/i18n
@nuxtjs/sitemap
@nuxtjs/robots
nuxt-schema-org
Vitest
Playwright
Vercel
```

Known existing structure:

```text
app/pages/
  admin/
    index.vue
    login.vue
    leads/
    projects/
  services/
  work/
  index.vue
  privacy.vue
  start-a-project.vue
  studio.vue

server/api/
  admin/
  work/
  inquiry.post.ts

supabase/migrations/
  0001_create_leads.sql
  0002_create_projects.sql
  0003_fix_function_search_path.sql
  0004_add_project_links.sql
```

Existing capabilities already include:

- admin login
- admin middleware
- lead management
- project management
- Supabase database/auth
- project image upload
- project CRUD
- public work API
- inquiry form
- Resend
- Turnstile
- EN/ID foundations

**Do not regress these.**

---

# 3. BUSINESS REPOSITIONING — PRIORITY ZERO

Current public site still contains the old identity:

```text
Karsa Studio
Digital Product & Software Studio
Design / Build / Grow
Custom Software
Internal Systems
```

Final identity must be consistent:

# KARSA AGENCY

Recommended positioning:

> **Creative & Digital Agency**

Supporting descriptor:

> **Website · Design · Photography · Film**

Core promise:

> **We shape how businesses look, feel, and live online.**

Indonesian support:

> Kami membantu bisnis membangun kehadiran digital yang utuh melalui website, desain, fotografi, dan video dalam satu creative direction.

Tagline:

> **Dari Karsa Menjadi Karya.**

Search and intentionally replace public-facing leftovers:

```bash
rg -n "Karsa Studio|KARSA STUDIO|Digital Product & Software Studio"
```

Update:

- site name
- footer
- nav
- metadata
- schema.org
- Open Graph
- email templates
- admin labels
- README
- SEO defaults

---

# 4. BUSINESS DIFFERENTIATOR

Do NOT fabricate:

- clients
- logos
- testimonials
- awards
- project counts
- satisfaction rates
- team size
- office addresses
- years of experience
- project metrics

Karsa’s real early-stage positioning:

## ONE CREATIVE PARTNER
Website, design, photography, and video under one creative direction.

## CONSISTENT BRAND EXPERIENCE
Website, visual identity, photography, and motion should speak the same language.

## BUSINESS-LED CREATIVITY
Creative decisions start from what the business needs to communicate and achieve.

Until Karsa has strong historical metrics:

> **Process is proof.**

When real results exist:

> **Results become proof.**

---

# 5. WHAT TO LEARN FROM CMLABS

Study cmlabs for **completeness only**, including:

- service overview + detailed service pages
- case studies
- real client logos
- testimonials
- measurable outcomes where real
- about/company information
- contact and quote flow
- FAQ
- updates/news
- careers
- legal pages
- rich footer
- content engine
- SEO depth
- conversion CTAs
- trust-building information

Do NOT add services Karsa does not sell. Do NOT add SEO/ads/GEO/backlink offerings unless the owner explicitly approves later.

---

# 6. TARGET PUBLIC ROUTES

```text
/
├── /services
│   └── /services/[slug]
├── /packages
├── /work
│   └── /work/[slug]
│
├── /design
│   └── /design/[slug]              # dedicated design evidence / case-study detail
├── /photography
│   └── /photography/[slug]         # dedicated photography evidence / album detail
├── /videography
│   └── /videography/[slug]         # dedicated video evidence / project detail
│
├── /clients                        # render only when useful
├── /testimonials                   # optional standalone page
├── /insights
│   └── /insights/[slug]
├── /updates
│   └── /updates/[slug]
├── /about
├── /process
├── /faq
├── /contact
├── /start-a-project
├── /careers
│   └── /careers/[slug]
├── /privacy
├── /terms
├── /terms-of-service
├── /search                         # recommended when content grows
└── /404
```

## Dedicated Evidence Hubs — Mandatory

Karsa already intends to have dedicated public pages for **Design, Photography, and Videography**. These must NOT be simple service-description pages.

They are **evidence / portfolio hubs** showing what Karsa has actually created.

The three hub routes are mandatory:

```text
/design
/photography
/videography
```

Each hub must combine:

1. discipline positioning / service summary
2. evidence of completed work
3. featured projects
4. gallery / media showcase
5. optional client context
6. related services
7. related packages
8. testimonial when real and permitted
9. CTA to Start a Project

All evidence shown on these pages must be uploaded and managed from the admin CMS.

Do not hard-code portfolio evidence in Vue files.

Do not show fake work or placeholders disguised as client work.


Internationalization:

```text
Default locale: id
English: /en/...
Recommended strategy: prefix_except_default
```

Preserve existing i18n foundations where compatible.

---

# 7. MAIN PUBLIC NAVIGATION

Recommended:

```text
KARSA AGENCY

Work
Services
Packages
Insights
About
Contact
Start a Project ↗
```

Service menu:

```text
WEB
- Website Development
- Landing Page
- Company Profile
- E-Commerce
- Website Revamp

DESIGN
- Brand Identity
- Logo Design
- Social Media Design
- Campaign Design
- Marketing Collateral

PHOTO
- Product Photography
- Brand Photography
- Corporate / Business
- Event Documentation

FILM
- Reels / Short-form
- Company Profile Video
- Campaign / Brand Film
- Event Highlight
- Video Editing
```

Mobile menu must be accessible, keyboard-friendly, focus-managed, and not hover-dependent.

---

# 8. LIGHT + DARK MODE — MANDATORY

The current site feels too dark. Final site must support:

```text
Light
Dark
System
```

Recommended:

```text
@nuxtjs/color-mode
```

unless repo audit finds an equally robust existing implementation.

Preferred:

```text
default = system
fallback = light
```

No hydration flash.

Light mode must be fully designed, not merely inverted.

Suggested starting palette:

## Light

```css
--bg: #F4F1EA;
--surface: #FFFFFF;
--surface-2: #EBE8E1;
--text: #080808;
--text-muted: #64645F;
--border: rgba(8,8,8,.14);
--accent: #8B866A;
```

## Dark

```css
--bg: #050505;
--surface: #0D0D0D;
--surface-2: #151515;
--text: #F4F1EA;
--text-muted: #A3A19A;
--border: rgba(244,241,234,.14);
--accent: #A49D77;
```

Refine using UI UX Pro Max.

---

# 9. VISUAL DIRECTION

Preserve Karsa identity:

> **Minimal · Editorial · Creative · Architectural · Human · Digital**

Avoid:

- generic SaaS dashboard look on public site
- neon/cyberpunk
- endless black sections
- glassmorphism everywhere
- over-rounded cards everywhere
- excessive gradients
- template aesthetics
- 3D in every section

Use official Karsa Agency logo asset. Do not redesign it during implementation.

---

# 10. HOMEPAGE V2

## 10.1 Hero

Suggested content:

```text
KARSA AGENCY
Creative & Digital Agency

DARI KARSA
MENJADI KARYA.

Website · Design · Photography · Film

We create digital and visual experiences
that make businesses easier to see,
understand, and remember.
```

CTA:

```text
View Our Work
Start a Project ↗
```

Use bright premium light-mode hero. 3D is optional and restrained.

## 10.2 Client proof strip

Data-driven. Only show real approved clients.

## 10.3 Brand statement

```text
One creative direction.
Four ways to bring it to life.
```

## 10.4 Services

Interactive editorial pillars:

```text
01 WEB
02 DESIGN
03 PHOTO
04 FILM
```

## 10.5 Integrated offer

Signature section:

```text
FULL PRESENCE
Website + Design + Photography + Video
```

Price and content from CMS, never hard-coded.

## 10.6 Selected Work

Categories:

```text
Web
Design
Photography
Film
Integrated
```

## 10.7 Why Karsa

```text
ONE CREATIVE PARTNER
CONSISTENT BRAND EXPERIENCE
BUILT AROUND BUSINESS
```

## 10.8 Process / Trust

```text
Discover
Define
Create
Review
Deliver
Support
```

Proof points:
- clear scope
- milestone delivery
- approvals
- revision rules
- website QA
- asset handover
- warranty/support where relevant

## 10.9 Testimonials
Only verified, permission-approved records.

## 10.10 Insights
Latest published useful content.

## 10.11 Updates
Latest company/project update.

## 10.12 FAQ
Featured FAQ from CMS.

## 10.13 Final CTA

```text
Have a Karsa in mind?
Let’s turn it into a Karya.
```

---

# 11. SECTION RHYTHM

Do not make everything white or black.

Recommended:

```text
Hero              Light
Brand Statement   Light
Services           Dark
Featured Work      Light
Full Presence      Dark
Why Karsa          Warm Neutral
Process            Light
Testimonials       Dark
Insights           Light
Final CTA          Dark
```

Dark mode adapts this hierarchy with controlled contrast.

---

# 12. SERVICE TAXONOMY

Replace old `Design / Build / Grow` primary taxonomy with:

```text
WEB
DESIGN
PHOTO
FILM
INTEGRATED
```

Initial services:

## WEB
- Website Development
- Landing Page
- Company Profile Website
- E-Commerce Website
- Website Revamp
- Custom Web Experience
- Website Maintenance

## DESIGN
- Brand Identity
- Logo Design
- Social Media Design
- Campaign Design
- Marketing Collateral
- Company Profile / Presentation Design
- UI/UX Design

## PHOTO
- Product Photography
- Brand Photography
- Business / Corporate Photography
- Food & Beverage Photography
- Event Documentation
- Lifestyle / Campaign Photography

## FILM
- Reels / Short-form Video
- Company Profile Video
- Campaign / Brand Film
- Product Video
- Event Highlight
- Video Editing Only
- Social Cutdowns

Each service page supports:
- hero
- summary
- who it is for
- problem solved
- deliverables
- included
- excluded
- typical timeline
- optional starting price
- process
- related case studies
- related packages
- FAQ
- CTA
- SEO

---

# 13. PACKAGES

Create `/packages`.

Categories:

```text
Solo Services
Combo
Signature
Maintenance / Retainer
```

CMS fields:

```text
title
slug
category
summary
price_type
price
currency
price_note
featured
badge
recommended_for
duration
revision
included_items
excluded_items
cta
order
status
published_at
```

Price types:

```text
fixed
starting_from
custom
monthly
```

Prices must come from database/CMS.

Use owner-approved launch pricing only.

Wording:

> **Karsa Launch Pricing — introductory rates for selected early partner projects.**

Never say “cheap because we are new”.


---


# 13A. DEDICATED CREATIVE EVIDENCE SYSTEM — MANDATORY

Karsa must have a first-class evidence system for:

```text
DESIGN
PHOTOGRAPHY
VIDEOGRAPHY
```

This is separate from generic service copy.

The purpose is to answer:

> “What has Karsa actually created?”

The public evidence hubs must be visually rich and discipline-specific.

---

## 13A.1 `/design`

This page is both:

- a design discipline landing page
- a design portfolio / evidence hub

Recommended structure:

```text
Hero
↓
Design Positioning
↓
Featured Design Work
↓
Portfolio Grid
↓
Categories
↓
Selected Case Study
↓
Process
↓
Related Packages
↓
Testimonials if available
↓
CTA
```

Suggested categories:

```text
Brand Identity
Logo Design
Social Media Design
Campaign Visual
Marketing Collateral
Presentation / Company Profile
UI/UX
Other
```

Design evidence item may contain:

```text
title
slug
client_id optional
project_id optional
category
year
summary
cover_media_id
gallery[]
mockups[]
before_after optional
deliverables[]
credits
permission_to_show
featured
status
published_at
seo
```

Public page must support:

- editorial grid
- full-width showcase
- lightbox
- project detail page
- category filtering
- featured work
- responsive mockup/media presentation

---

## 13A.2 `/photography`

This page is both:

- a photography service landing page
- a photography portfolio / album hub

Recommended structure:

```text
Hero
↓
Photography Positioning
↓
Featured Shoot
↓
Photo Collections / Albums
↓
Category Filter
↓
Selected Gallery
↓
Process / Shoot Experience
↓
Related Packages
↓
Testimonials if available
↓
CTA
```

Suggested categories:

```text
Product
Brand
Food & Beverage
Corporate
Lifestyle
Event
Campaign
Other
```

Photography evidence must support album-style presentation.

A photography collection may contain:

```text
title
slug
client_id optional
project_id optional
category
shoot_date
location optional
summary
cover_media_id
photos[]
orientation_mix
credits
usage_rights_note
permission_to_show
featured
status
published_at
seo
```

Each photo item may contain:

```text
media_id
alt_text
caption
order_index
featured
```

Public experience should support:

- masonry/editorial grid
- lightbox
- fullscreen image viewing
- image sequence
- keyboard navigation
- swipe on mobile
- responsive Cloudinary transformations
- EXIF stripped if not needed
- no delivery of original full-resolution files to public users

---

## 13A.3 `/videography`

This page is both:

- a videography / video editing landing page
- a video work evidence hub

Recommended structure:

```text
Hero
↓
Film / Motion Positioning
↓
Featured Reel / Film
↓
Video Project Grid
↓
Category Filter
↓
Selected Project
↓
Process
↓
Related Packages
↓
Testimonials if available
↓
CTA
```

Suggested categories:

```text
Reels / Short-form
Company Profile
Brand Film
Campaign
Product Video
Event Highlight
Video Editing
Social Cutdown
Other
```

Videography evidence item may contain:

```text
title
slug
client_id optional
project_id optional
category
year
summary
poster_media_id
video_provider
video_url
cloudinary_public_id optional
duration
aspect_ratio
deliverables[]
credits
raw_footage_policy_note optional
permission_to_show
featured
status
published_at
seo
```

Public page requirements:

- poster/thumbnail
- hover preview only when performant and muted
- click-to-play
- fullscreen modal/player
- keyboard accessible controls
- mobile playsinline
- lazy loading
- reduced-motion-safe behavior
- do not autoplay audio

---

## 13A.4 Evidence Relationship to `/work`

`/work` remains the cross-disciplinary portfolio/case-study index.

It should aggregate selected published evidence from:

```text
Web
Design
Photography
Videography
Integrated
```

Do not duplicate content manually.

Recommended approach:

- `projects` = higher-level client/project/case-study entity
- `portfolio_collections` = discipline-specific evidence collection
- `portfolio_items` = individual media/evidence items

A project can be linked to multiple discipline collections.

Example:

```text
Client Project: Coffee Brand Launch
  ├── Website case study
  ├── Design collection
  ├── Photography collection
  └── Videography collection
```

This enables one integrated project to appear properly on:

```text
/work/coffee-brand-launch
/design/coffee-brand-identity
/photography/coffee-brand-shoot
/videography/coffee-brand-film
```

while still sharing the same client/project relationship.

---

## 13A.5 Admin Requirements for Creative Evidence

Admin sidebar must include:

```text
PORTFOLIO / EVIDENCE
- Work / Case Studies
- Design Showcase
- Photography Portfolio
- Videography Portfolio
```

The user must be able to upload and manage evidence through admin without editing code.

Admin capabilities:

### Design Showcase
- create collection
- upload cover
- upload multiple images/mockups
- choose category
- link client
- link parent project
- reorder media
- set featured
- permission to show
- draft / preview / publish
- SEO

### Photography Portfolio
- create album
- multi-image upload
- bulk upload
- drag-to-reorder
- choose category
- album cover
- image captions/alt
- link client/project
- permission to show
- draft / preview / publish
- SEO

### Videography Portfolio
- create video project
- upload poster
- add Cloudinary video OR YouTube/Vimeo URL
- set duration/aspect ratio
- add multiple cuts
- link client/project
- permission to show
- draft / preview / publish
- SEO

Evidence publishing must respect:

```text
permission_to_show = true
AND status = published
AND published_at <= now()
```

---

## 13A.6 Recommended Evidence Database Model

Create reusable tables rather than three unrelated implementations.

Recommended:

```text
portfolio_collections
portfolio_collection_translations
portfolio_items
portfolio_collection_project_links
portfolio_collection_client_links
```

`portfolio_collections`:

```text
id
slug
discipline
category
client_id nullable
project_id nullable
cover_media_id
featured
permission_to_show
order_index
status
published_at
created_by
updated_by
created_at
updated_at
```

`discipline` enum:

```text
design
photography
videography
```

Translation fields:

```text
title
summary
description
credits
seo_title
seo_description
```

`portfolio_items`:

```text
id
collection_id
media_id nullable
item_type
external_url nullable
poster_media_id nullable
caption
alt_text
duration nullable
aspect_ratio nullable
featured
order_index
metadata jsonb
created_at
```

`item_type`:

```text
image
mockup
video
external_video
before
after
document
```

This common model should still allow discipline-specific UI.

Do not force every discipline to look identical just because the data model is shared.

---

## 13A.7 Homepage Integration

Homepage can pull:

- featured design evidence
- featured photography evidence
- featured videography evidence

but avoid turning the homepage into a giant gallery.

Recommended:

```text
SELECTED CREATIVE WORK

Design       → 1 featured work
Photography  → 1 featured collection
Film         → 1 featured video
```

CTA:

```text
Explore All Work
```

---

## 13A.8 Media Upload Quality

Because evidence is core to sales, admin upload must be production-grade.

Design/photo:
- multi-upload
- progress
- validation
- optimized derivative
- preserve quality
- alt text
- reorder

Video:
- do not load huge files into server memory
- signed/direct upload to Cloudinary when used
- upload progress
- poster generation
- duration metadata
- streaming-friendly delivery

---


# 14. WORK / CASE STUDIES

Expand the existing project CRUD rather than discarding it.

Target case study model:

```text
slug
title
client_id optional
project_type
category
year
summary
description
challenge
approach
solution
outcome
services[]
deliverables[]
technologies[] optional
featured
cover_media_id
hero_media_id
gallery
video
live_url
external_url
metrics[]
testimonial_id optional
credits
status
published_at
order
seo
```

Case-study page structure:

```text
Hero
Overview
Challenge
Approach
Creative Direction
Gallery / Media
Deliverables
Selected Details
Outcome
Metrics (only real/verified)
Client Quote
Related Services
Next Project
CTA
```

Photography and film case studies must be media-first, not forced into a web-project template.

---

# 15. CLIENTS

Create CMS module:

```text
Clients
```

Fields:

```text
name
slug
logo_media_id
website_url
industry
description
featured
permission_to_show
order
status
```

Public client rendering must require:

```text
permission_to_show = true
AND status = published
```

---

# 16. TESTIMONIALS

Fields:

```text
quote
person_name
person_role
company
client_id
project_id
avatar_media_id
source
source_url
permission_to_show
featured
order
status
```

Never publish without permission.

---

# 17. INSIGHTS / CONTENT ENGINE

Create:

```text
/insights
/insights/[slug]
```

Initial categories:

```text
Website
Design
Photography
Video
Branding
Business
Creative Process
```

Content fields:

```text
title
slug
excerpt
cover_media_id
content_json
author
category
tags
featured
status
published_at
updated_at
reading_time
seo_title
seo_description
canonical_url
og_media_id
locale
```

Status:

```text
draft
scheduled
published
archived
```

Use rich-text editor in admin.

Do not require manual Markdown edits for production publishing.

Suggested real topics:
- Berapa biaya website company profile?
- Website vs Instagram untuk bisnis
- Cara menyiapkan foto produk untuk website
- Kenapa branding, website, foto, dan video harus konsisten
- Checklist company profile website
- Berapa biaya video company profile?
- Persiapan sebelum photoshoot produk
- Logo vs brand identity

Do not auto-generate hundreds of low-quality articles.

---

# 18. COMPANY UPDATES

Create:

```text
/updates
/updates/[slug]
```

Use for:

- project launches
- agency updates
- collaborations
- service updates
- behind-the-scenes
- creative experiments
- milestones

Keep separate from editorial Insights.

---

# 19. FAQ

Create:

```text
/faq
```

CMS tables/modules:

```text
faq_categories
faqs
```

Fields:

```text
category
question
answer
related_service
order
featured
status
locale
```

Features:

- category filter
- search
- accessible accordion
- FAQ schema only when visible content qualifies

FAQ topics should cover:
- price
- timeline
- revision
- ownership
- source files
- RAW photos
- raw footage
- hosting/domain
- travel fee
- studio/talent
- payment
- maintenance
- how project starts

---

# 20. ABOUT

Route:

```text
/about
```

Include:
- meaning of Karsa
- agency philosophy
- service focus
- working principles
- process
- honest company stage
- optional team section
- CTA

Do not invent team members or fake history.

If no team section is ready, use:

```text
How We Work
Our Principles
Creative Network
```

---

# 21. PROCESS PAGE

Route:

```text
/process
```

Suggested process:

```text
01 Discover
02 Define
03 Create
04 Review
05 Deliver
06 Support
```

Explain differences for:
- Website
- Design
- Photography
- Film

Use real operational rules already established by Karsa where relevant.

---

# 22. CONTACT

Create a richer `/contact` page.

Include:
- service selector
- email
- WhatsApp if configured
- social channels
- location only if real
- FAQ
- project CTA

Do not render placeholders when data is missing.

---

# 23. START A PROJECT

Upgrade current form to a premium multi-step flow:

```text
1. What do you need?
2. Tell us about the project
3. Budget & timeline
4. About you
5. Review & submit
```

Services:

```text
Website
Design
Photography
Videography / Video Editing
Integrated Package
Other
```

Store:
- selected service
- selected package
- description
- budget
- timeline
- name
- company
- email
- phone
- preferred contact
- referral source
- source page
- UTM values
- locale
- privacy consent

Preserve:
- Zod
- Turnstile
- Supabase
- Resend
- reference ID
- form preservation on failure

---

# 24. CAREERS

Routes:

```text
/careers
/careers/[slug]
```

Fields:

```text
title
slug
department
employment_type
location
work_mode
summary
responsibilities
requirements
nice_to_have
status
published_at
closing_at
application_url
application_email
order
seo
```

If zero open roles:
show a tasteful honest empty state.

---

# 25. LEGAL / INFORMATION PAGES

Admin-editable:

```text
/privacy
/terms
/terms-of-service
```

Optional future:

```text
/cookie-policy
```

Do not invent legal company registration details.

Mark wording as requiring professional legal review before commercial reliance.

---

# 26. ADMIN — PRIMARY PRODUCT GOAL

The user wants a **real CMS/admin**, not merely a lead table and project CRUD.

`/admin` must become the content operations center.

Admin must be:
- clean
- fast
- practical
- responsive
- accessible
- keyboard-friendly
- light/dark capable
- consistent with Karsa
- designed with UI UX Pro Max
- significantly less animation-heavy than public site

---

# 27. ADMIN INFORMATION ARCHITECTURE

Recommended sidebar:

```text
OVERVIEW
- Dashboard

CONTENT
- Homepage
- Pages
- Services
- Packages
- Work / Case Studies
- Clients
- Testimonials
- Insights
- Updates
- FAQ
- Careers

PORTFOLIO / EVIDENCE
- Design Showcase
- Photography Portfolio
- Videography Portfolio

SALES
- Leads
- Lead Pipeline

MEDIA
- Media Library

SITE
- Navigation
- Footer
- SEO
- Redirects
- Settings

SYSTEM
- Users & Roles
- Audit Log
```

Hide entries based on user role.

---

# 28. ADMIN DASHBOARD

Metrics:
- new leads
- leads this month
- qualified leads
- proposal-stage leads
- published projects
- draft projects
- published articles
- draft content
- media count

Widgets:
- recent leads
- recent content edits
- scheduled content
- quick actions
- unpublished/incomplete content
- translation gaps

Optional analytics:
- visitors
- top pages
- conversion

If analytics is not connected, show:
> Analytics not connected.

Never fake values.

---

# 29. AUTH + RBAC

Continue Supabase Auth.

Required:
- email/password
- secure session
- logout
- route guard
- server-side authorization
- role-based access

Roles:

```text
super_admin
content_editor
sales
viewer
```

Permissions:

## super_admin
full access.

## content_editor
content/media CRUD, no user/security management.

## sales
lead/contact pipeline only.

## viewer
read-only.

Do not rely only on client middleware.

Implement server helper such as:

```ts
requireAdmin(event, allowedRoles)
```

Every privileged API must:
1. verify Supabase token/session
2. fetch active admin profile
3. check role
4. then execute privileged operation

---

# 30. ADMIN PROFILES

Add table:

```text
admin_profiles
```

Fields:

```text
user_id uuid PK/FK auth.users
display_name
role
avatar_url
is_active
last_seen_at
created_at
updated_at
```

---

# 31. CONTENT WORKFLOW

Major content must support:

```text
draft
scheduled
published
archived
```

Fields:

```text
status
published_at
created_by
updated_by
created_at
updated_at
```

Scheduled content is visible when:

```text
status = scheduled
AND published_at <= now()
```

Draft must never leak into normal public API.

---

# 32. PREVIEW MODE

Admin can preview:
- page
- service
- package
- project
- article
- update

Draft preview:
- authenticated
- noindex
- not public through normal API
- actual front-end component rendering

---

# 33. HOMEPAGE / PAGE EDITING STRATEGY

Do NOT build an unrestricted Wix clone.

Use a **structured section-based CMS**.

Table/model:

```text
page_sections
```

Fields:

```text
page_id
section_key
component_type
enabled
order_index
theme_variant
content JSONB
settings JSONB
```

Approved component types:

```text
hero
client_logos
brand_statement
service_grid
featured_work
integrated_package
why_karsa
process
testimonials
insights
updates
faq
cta
```

Admin can:
- edit content
- choose media
- reorder
- show/hide
- choose approved theme/style variant
- preview

Admin cannot inject arbitrary scripts/components.

---

# 34. RICH TEXT

Use a robust editor such as TipTap.

Recommended extensions:
- StarterKit
- Link
- Image
- Heading
- Bullet/Ordered List
- Blockquote
- Table only where useful

Store TipTap JSON as canonical content.

Sanitize rendered content server-side.

Never trust raw HTML from admin client.

---

# 35. MEDIA LIBRARY

Create `/admin/media`.

Use Cloudinary as primary media provider unless audit finds a better existing implementation.

Support:

```text
image
video
document
external_video
```

`media_assets` fields:

```text
id
provider
public_id
resource_type
url
secure_url
thumbnail_url
alt_text
caption
width
height
duration
format
bytes
folder
rights_status
credit
source
created_by
created_at
```

Features:
- upload
- drag/drop
- progress
- search
- filter
- edit alt text
- copy URL
- delete with reference checks
- reusable media picker

For video:
- Cloudinary upload OR
- Vimeo/YouTube URL

Do not send huge raw video through app server memory.

---

# 36. MEDIA PERFORMANCE

Images:
- responsive derivatives
- WebP/AVIF delivery
- correct width/height
- lazy load below fold
- preserve high visual quality for photography

Video:
- poster
- playsinline
- lazy load
- pause offscreen where practical
- reduced-motion fallback
- no autoplay with sound

---

# 37. DATABASE MIGRATION STRATEGY

Existing migrations may be applied.

**Do not destructively rewrite them.**

Add new migrations from the next available number.

Suggested sequence:

```text
0005_create_admin_profiles.sql
0006_expand_leads.sql
0007_create_media_assets.sql
0008_create_clients_testimonials.sql
0009_create_services_packages.sql
0010_expand_projects_case_studies.sql
0011_create_portfolio_evidence.sql
0012_create_insights_updates.sql
0013_create_faq_careers.sql
0014_create_site_pages_sections.sql
0015_create_navigation_settings.sql
0016_create_audit_logs_redirects.sql
0017_add_indexes_constraints.sql
```

Use actual next numbering after audit.

---

# 38. TARGET TABLES

Minimum practical target:

```text
admin_profiles

site_settings
navigation_items
social_links

pages
page_translations
page_sections

services
service_translations
service_faqs

packages
package_translations
package_items
package_service_links

projects
project_translations
project_media
project_metrics
project_service_links

portfolio_collections
portfolio_collection_translations
portfolio_items
portfolio_collection_project_links
portfolio_collection_client_links

clients
testimonials

articles
article_translations
article_categories
article_tags
article_tag_links

company_updates
company_update_translations

faq_categories
faqs
faq_translations

job_positions
job_position_translations

media_assets

leads
lead_notes
lead_activities

redirects
audit_logs
```

Do not create tables that remain unused.

---

# 39. I18N DATA MODEL

Use base entity + translation table for major content.

Example:

```text
services
service_translations
```

Base:
- slug
- category
- status
- featured
- order
- publication data
- relations

Translation:
- locale
- title
- summary
- long text
- SEO title
- SEO description

Unique:

```text
(service_id, locale)
```

If repo audit shows a more efficient JSONB locale model already, it may be used, but document trade-offs.

---

# 40. SERVICE MODEL

Base:

```text
id
slug
parent_id
category
cover_media_id
featured
show_price
price_type
starting_price
currency
order_index
status
published_at
created_by
updated_by
created_at
updated_at
```

Translation:

```text
title
short_title
eyebrow
summary
intro
who_its_for
problems
deliverables
included
excluded
process
cta_label
seo_title
seo_description
```

---

# 41. PACKAGE MODEL

Base:

```text
id
slug
category
price_type
price
currency
badge
featured
order_index
status
published_at
created_at
updated_at
```

Translation:

```text
title
summary
price_note
recommended_for
duration_note
revision_note
cta_label
seo_title
seo_description
```

`package_items`:

```text
package_id
label
description
is_highlight
order_index
```

---

# 42. PROJECT / CASE STUDY MODEL

Expand existing `projects` safely.

Add where needed:

```text
client_id
project_kind
hero_media_id
summary
solution
deliverables_json
technologies_json
status
published_at
seo_title
seo_description
og_media_id
created_by
updated_by
```

Preserve existing project data and links.

---

# 43. PROJECT MEDIA

Create:

```text
project_media
```

Fields:

```text
id
project_id
media_id
media_role
caption
alt_text
order_index
full_width
theme
```

Roles:

```text
hero
gallery
detail
before
after
video
thumbnail
```

---

# 44. PROJECT METRICS

Create:

```text
project_metrics
```

Fields:

```text
project_id
label
value
unit
context
verified
order_index
```

Public rendering requires:

```text
verified = true
```

---

# 45. LEAD CRM EXPANSION

Preserve existing lead data.

Add:

```text
selected_package_id
preferred_contact
source_page
utm_source
utm_medium
utm_campaign
utm_content
utm_term
locale
consent_privacy
assigned_to
last_contacted_at
next_follow_up_at
priority
```

Statuses:

```text
new
contacted
qualified
discovery
proposal
won
lost
archived
```

Validate allowed transitions where practical.

---

# 46. LEAD NOTES + ACTIVITIES

`lead_notes`:

```text
lead_id
author_id
note
created_at
```

`lead_activities`:

```text
lead_id
actor_id
type
metadata
created_at
```

Activity types:

```text
created
status_changed
note_added
email_sent
follow_up_set
assigned
```

---

# 47. LEAD ADMIN UX

Features:
- table
- search
- filters
- status
- service
- budget
- date
- assignee
- priority
- pagination
- optional kanban

Lead detail:
- contact
- requirement
- package/service
- budget/timeline
- activity timeline
- notes
- follow-up date
- quick email
- WhatsApp deep link if configured

Do not auto-send WhatsApp without user action.


---

# 48. NAVIGATION CMS

Admin can manage nav items.

Fields:

```text
label
href
parent_id
type
locale
order_index
visible
opens_new_tab
```

Prevent cyclic nesting and invalid URLs.

---

# 49. SITE SETTINGS

Admin-editable:

```text
agency_name
tagline
descriptor
default_seo_title
default_seo_description
contact_email
whatsapp
phone
instagram
linkedin
tiktok
youtube
address
google_maps_url
business_hours
site_notice
default_og_media
logo_light
logo_dark
favicon
default_theme
```

Do not hard-code contact data across components.

---

# 50. HOMEPAGE SECTION MANAGER

Route:

```text
/admin/content/home
```

Admin features:

- reorder
- enable/disable
- edit copy
- choose media
- choose featured records
- choose theme:
  ```text
  light
  dark
  neutral
  auto
  ```
- preview

No arbitrary JS injection.

---

# 51. SEO MANAGER

Every content record should support:

```text
meta_title
meta_description
canonical_url
robots_index
robots_follow
og_title
og_description
og_media_id
```

Admin guidance:
- title length
- description length
- slug uniqueness
- missing alt text
- missing SEO title/description
- missing translation warnings

Optional Google-style preview.

---

# 52. REDIRECTS

Create:

```text
redirects
```

Fields:

```text
source_path
destination_path
status_code
active
created_at
```

When slug changes:
- warn admin
- offer redirect creation
- prevent loops

---

# 53. AUDIT LOG

Sensitive admin writes should log:

```text
actor
action
entity_type
entity_id
before
after
timestamp
```

Actions:

```text
create
update
publish
unpublish
archive
delete
role_change
```

Do not store secrets in audit payload.

---

# 54. DELETE / ARCHIVE SAFETY

Prefer archive over hard delete for published content.

Before deletion:
- dependency check
- media reference check
- confirmation
- audit log

For public URLs with backlinks:
prefer archive + redirect.

---

# 55. API ARCHITECTURE

Use Nitro server routes.

Public examples:

```text
GET /api/public/services
GET /api/public/services/:slug
GET /api/public/packages
GET /api/public/projects
GET /api/public/projects/:slug
GET /api/public/insights
GET /api/public/insights/:slug
GET /api/public/updates
GET /api/public/faqs
POST /api/inquiry
```

Admin examples:

```text
GET/POST /api/admin/services
GET/PATCH/DELETE /api/admin/services/:id

GET/POST /api/admin/packages
GET/PATCH/DELETE /api/admin/packages/:id

GET/POST /api/admin/projects
GET/PATCH/DELETE /api/admin/projects/:id

...etc.
```

Use consistent response format.

Recommended:

```ts
type ApiSuccess<T> = {
  success: true
  data: T
  meta?: Record<string, unknown>
}

type ApiError = {
  success: false
  error: {
    code: string
    message: string
    fieldErrors?: Record<string, string[]>
  }
}
```

Never expose stack traces in production.

---

# 56. SERVER VALIDATION

All writes use Zod.

Validate:
- IDs
- slug
- status
- prices
- URLs
- locale
- publication date
- arrays
- max length
- media IDs
- relationships
- enum values

Never trust client validation alone.

---

# 57. SECURITY

Mandatory:

- Supabase service role server-only
- Cloudinary API secret server-only
- Resend API key server-only
- Turnstile secret server-only
- no secrets in public runtime config
- admin API auth
- role check server-side
- Zod validation
- rate limiting
- safe redirect validation
- rich-text sanitization
- file MIME/type validation
- upload size limits
- no arbitrary HTML/script
- no direct exposure of private lead data

Evaluate CSRF risk based on auth/session strategy.

---

# 58. PUBLIC DATA VISIBILITY

Public APIs must only return:

```text
status = published
published_at <= now
permission_to_show = true when applicable
not archived
```

Never return:
- admin notes
- lead data
- user IDs
- internal audit fields
- private permissions metadata

---

# 59. CONTENT SOURCE OF TRUTH

Final admin-managed content should live in database.

Current Nuxt Content markdown cannot remain the only editable production source.

Migration strategy:

1. inspect existing `content/`
2. map useful content
3. seed DB
4. switch public read path to DB
5. keep Nuxt Content only if there is a deliberate documented reason
6. avoid two conflicting sources of truth

---

# 60. CURRENT CONTENT MIGRATION

Preserve:
- Karsa philosophy
- useful Karsa method/process copy
- current real projects
- valid existing service copy
- lead data
- project data

Reclassify old services:

```text
UI/UX -> Design
Website Development -> Web
E-Commerce -> Web
Maintenance -> Web / Retainer
```

Remove/hide unapproved old services such as:
- Custom Software
- Internal Systems
- API Integration

unless owner explicitly wants to keep them.

---

# 61. PUBLIC SEARCH

Recommended once content volume justifies it:

```text
/search
```

Search:
- services
- work
- insights
- updates
- FAQ

Prefer Postgres full-text search or a simple server solution.

Do not add paid search infrastructure without need.

---

# 62. FILTERING

Work:

```text
All
Web
Design
Photo
Film
Integrated
```

Insights:
- category
- tag
- search

Admin:
- status
- locale
- author/editor
- date
- category

---

# 63. THEME TOGGLE

Public control:

```text
Light
Dark
System
```

Requirements:
- no hydration flash
- accessible
- keyboard support
- preference persisted
- logo theme aware
- 3D/canvas theme aware where relevant

Admin can have separate preference.

---

# 64. MOTION SYSTEM

Do not use one repetitive fade-up everywhere.

Use purposeful motion:
- mask text reveal
- image clip reveal
- subtle parallax
- hover tilt for selected work
- background transitions
- service media preview
- refined route transitions
- restrained 3D

Use existing GSAP + ScrollTrigger + Lenis.

Every animation must clean up on route change/unmount.

---

# 65. 3D RULES

3D is enhancement, not architecture.

Principle:

```text
HTML/CSS = content
Motion = storytelling
3D = signature enhancement
```

Required:
- WebGL fallback
- reduced-motion mode
- low-performance mode
- capped DPR
- cleanup/disposal
- lazy load when possible
- no giant blocking canvas

---

# 66. UI UX PRO MAX QUALITY GATE

For every public/admin module:

1. load/read UI UX Pro Max if available
2. apply guidance for:
   - hierarchy
   - spacing
   - responsive
   - forms
   - error states
   - empty states
   - dashboards
   - navigation
   - accessibility
3. document major design decisions

Do not claim use if unavailable.

---

# 67. ADMIN DESIGN SYSTEM

Admin should feel Karsa but remain practical.

Recommended:
- light default
- dark optional
- compact sidebar
- neutral surfaces
- strong typography
- subtle olive accent
- no marketing animation overload
- clear tables
- accessible forms
- strong destructive states
- skeletons
- pagination

---

# 68. ADMIN TABLE STANDARD

Every scalable table supports:
- search
- filters
- sorting
- pagination
- status badge
- updated timestamp
- actions menu
- loading state
- error state
- empty state

Avoid loading all rows when dataset can grow.

---

# 69. ADMIN FORM STANDARD

Forms:
- sectioned
- client + server validation
- dirty-state warning
- Save Draft
- Preview
- Publish
- Schedule
- Archive
- Cancel
- clear errors

Translation tabs:

```text
Bahasa Indonesia
English
```

Show translation completeness.

---

# 70. MEDIA PICKER

Reusable component:

```text
MediaPicker
```

Features:
- upload
- select existing
- search
- preview
- alt text
- replace
- remove
- crop/aspect guidance

Do not duplicate upload logic in each module.

---

# 71. SEO ARCHITECTURE

Maintain and improve:

```text
@nuxtjs/sitemap
@nuxtjs/robots
nuxt-schema-org
```

Every public record supports:
- title
- description
- canonical
- OG
- index/noindex
- locale alternates
- breadcrumb

Structured data:
- Organization
- WebSite
- Service
- BreadcrumbList
- Article
- FAQPage when appropriate
- JobPosting for active careers

Never fake:
- Review
- AggregateRating

---

# 72. SITEMAP

Dynamic sitemap includes:
- services
- packages
- work
- insights
- updates
- careers
- static pages

Only published/indexable records.

Use hreflang where appropriate.

---

# 73. ROBOTS

Ensure:

```text
/admin -> disallow
/api/admin -> not indexable
preview -> noindex
```

Production public pages indexable by default where appropriate.

---

# 74. ANALYTICS

Keep current GA foundation if present.

Events:

```text
theme_change
service_view
package_view
work_view
insight_view
cta_start_project
contact_whatsapp
inquiry_start
inquiry_step
inquiry_submit_success
inquiry_submit_error
package_cta_click
```

Never send:
- email
- phone
- project description
- private lead data

to analytics.

---

# 75. EMAIL

Preserve Resend.

At minimum:
- new lead notification to Karsa
- inquiry confirmation to customer

Centralize template copy.

Do not promise an SLA unless approved.

---

# 76. PERFORMANCE

Public targets:

```text
LCP < 2.5s
CLS < 0.1
INP < 200ms
```

Desired Lighthouse:

```text
Performance >= 90
Accessibility >= 95
Best Practices >= 95
SEO >= 95
```

Admin may be heavier but must remain responsive.

---

# 77. ACCESSIBILITY

Target WCAG 2.2 AA where practical.

Mandatory:
- semantic HTML
- heading hierarchy
- keyboard
- visible focus
- form labels
- field errors
- contrast
- reduced motion
- alt text
- accessible dialogs
- accessible tables
- skip links
- no hover-only critical information

---

# 78. RESPONSIVE QA

Test:

```text
360
390
430
768
1024
1280
1440
1920
```

Public:
- strong desktop experience
- efficient touch-first mobile

Admin:
- desktop-first
- usable tablet/mobile
- tables adapt or scroll correctly
- no hidden critical actions

---

# 79. MEDIA PERFORMANCE

Photography quality matters.

Use:
- optimized high-quality source
- responsive derivatives
- correct aspect ratio
- lazy loading
- no original full-res transfer to every device

Video:
- poster
- playsinline
- lazy loading
- pause offscreen where possible

---

# 80. SSR DATA FETCHING

Use Nuxt SSR-friendly methods:

```text
useAsyncData
useFetch
```

Avoid duplicate fetches.

Public content must remain SSR-rendered for SEO.

---

# 81. SLUG CHANGES

On slug change:
- warn
- offer redirect
- maintain URL history
- prevent duplicate slugs

---

# 82. DRAFT / PUBLISH UX

Actions:

```text
Save Draft
Preview
Publish
Schedule
Archive
```

Before publish, warn for:
- missing title
- missing slug
- missing media alt
- missing SEO
- incomplete translation
- missing required content

Warnings should not be unnecessarily blocking.

---

# 83. AUDIT / RECOVERY

Minimum:
- updated_at
- updated_by
- audit log

Optional:
- lightweight revision snapshot

Do not overbuild revision history before core CMS works.

---

# 84. ERROR HANDLING

Public:
- friendly 404
- friendly API errors
- form preserved after failure
- media fallback

Admin:
- inline errors
- toast where appropriate
- retry
- no stack traces

---

# 85. EMPTY STATES

Startup-friendly.

Public:
- hide empty proof sections when appropriate

Admin:
- useful empty CTA

Examples:

```text
No testimonials yet.
Add your first verified testimonial.
```

No embarrassing fake placeholders.

---

# 86. SEED CONTENT RULE

Seed only:
- real Karsa brand content
- approved services
- approved package prices
- real existing project(s)
- legal drafts marked for review

No fake proof.

---

# 87. AANAYA

If Aanaya is a real independent project:
- preserve it
- improve the case study
- label truthfully
- never call it a client if it was not

---

# 88. LEGAL / TEAM HONESTY

Do not invent:
- PT/CV identity
- tax number
- office
- employees
- collaborators
- credentials

If team content is insufficient:
use philosophy/process instead.

---

# 89. ENVIRONMENT VARIABLES

Audit existing `.env.example`.

Likely:

```bash
NUXT_PUBLIC_SITE_URL=
NUXT_PUBLIC_GA_MEASUREMENT_ID=

SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

NUXT_PUBLIC_TURNSTILE_SITE_KEY=
TURNSTILE_SECRET_KEY=

RESEND_API_KEY=
RESEND_FROM_EMAIL=
KARSA_INQUIRY_EMAIL=
```

Add only variables actually used.

Never expose server secrets publicly.

---

# 90. SUPABASE CLIENT STRATEGY

Separate:
- public anon client
- server service-role client
- admin auth-aware server helper

Service role never reaches browser.

---

# 91. ADMIN API AUTH

Browser admin requests should carry a valid Supabase access token/session.

Server:
1. validates user
2. loads admin profile
3. verifies role
4. performs operation

Never trust an `isAdmin` flag from browser.

---

# 92. RLS

Keep RLS enabled.

If server API uses service role:
- public direct access can remain denied

If any table is accessed directly by authenticated client:
- write explicit role-aware RLS
- test it

Prefer consistency.

---

# 93. STORAGE SECURITY

Cloudinary signed uploads:
- sign server-side
- restrict folder
- validate MIME
- size limit
- secure transformations

If using Supabase Storage:
- explicit bucket policies
- no broad anonymous writes

---

# 94. RATE LIMITING

Apply to:
- inquiry
- login-sensitive routes
- upload signature route
- public search if needed

Use a Vercel-compatible implementation.

---

# 95. UNIT TESTS

Vitest should cover:
- Zod schemas
- slug helpers
- pricing formatting
- publication visibility
- permission checks
- locale helpers
- lead status logic
- API response helpers

Avoid testing trivial markup.

---

# 96. E2E PUBLIC TESTS

Playwright:

## Theme
- light
- dark
- persistence

## Navigation
- desktop
- mobile

## Services
- listing -> detail

## Packages
- package -> inquiry

## Work
- listing -> case study

## Insights
- listing -> detail

## Inquiry
- validation
- steps
- server error preservation
- success

## i18n
- ID
- EN
- alternates

---

# 97. E2E ADMIN TESTS

Playwright:

## Auth
- unauthenticated redirect
- login
- logout

## RBAC
- sales cannot edit services
- editor cannot manage users
- super admin can

## Services
- create draft
- preview
- publish
- edit
- archive

## Packages
- CRUD

## Projects
- CRUD + media

## Insights
- rich content
- schedule

## Leads
- filter
- status
- note
- follow-up

## Media
- upload/mock
- select asset

---

# 98. FINAL COMMANDS

Must pass:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm test:e2e
```

Do not hide failures.


---

# 99. BROWSER QA

Test current evergreen:
- Chrome
- Safari
- Firefox
- Edge

Priority:
- macOS Safari
- iOS Safari
- Chrome Android

GSAP/Lenis/Three.js behavior must be verified in Safari.

---

# 100. DATABASE PERFORMANCE

Add indexes for:
- slug
- status
- published_at
- category
- featured
- order_index
- lead status
- lead created_at
- lead follow-up date
- foreign-key joins

Use pagination.

Avoid N+1 query patterns.

---

# 101. DELETION / CASCADE RULES

Define intentionally.

Examples:
- deleting client must not silently erase projects
- deleting media with references must be blocked or reassigned
- translation rows can cascade with parent entity
- category deletion should be blocked if still used unless reassigned

---

# 102. TIME

Use:

```text
timestamptz
```

Store UTC.

Display localized, especially WIB in admin where appropriate.

---

# 103. SOFT DELETE / ARCHIVE

Prefer status/archive for published content.

Hard delete only where deliberate.

---

# 104. AUTHORSHIP

Track `created_by` and `updated_by` on major content.

---

# 105. INTERNAL LINKING

Service pages link to:
- related work
- packages
- relevant insights
- CTA

Articles link naturally to related services.

Case studies link to delivered services.

---

# 106. PUBLIC PRICING RULE

Public price comes from CMS.

Use:
- “Starting from”
- “Custom”
- monthly
- fixed

according to `price_type`.

Do not expose internal cost/margin.

---

# 107. CLIENT PERMISSION

Use permission fields for:
- logos
- testimonials
- project publication
- sensitive photography
- video

Do not display assets with uncertain rights.

---

# 108. MEDIA RIGHTS

Media admin can capture:

```text
rights_status
credit
source
```

Useful especially for photography and film.

---

# 109. FOOTER

Recommended content:

```text
KARSA AGENCY
Creative & Digital Agency
Dari Karsa Menjadi Karya.

Services
Work
Packages
Insights
About
Contact

Instagram
LinkedIn
WhatsApp
YouTube/TikTok if configured

Privacy
Terms
Terms of Service

Indonesia
© YEAR Karsa Agency
```

Everything contact-related comes from settings.

---

# 110. SOCIAL SHARE / OG

Each:
- service
- package
- project
- insight
- update

supports high-quality social preview.

Use uploaded OG media or site fallback.

Dynamic OG generation is optional if stable.

---

# 111. ADMIN QUICK ACTIONS

Dashboard:

```text
New Service
New Package
New Project
New Insight
Add Testimonial
View Leads
Upload Media
```

---

# 112. ADMIN NOTIFICATIONS

Useful lightweight alerts:
- new leads
- scheduled content
- incomplete translations
- missing SEO
- failed upload

Do not build a complex notification infrastructure before core CMS is stable.

---

# 113. ADMIN COMMAND PALETTE

Optional:

```text
Cmd/Ctrl + K
```

for navigation/quick actions.

Only if accessible.

---

# 114. ADMIN RESPONSIVE

On smaller screens:
- sidebar drawer
- usable forms
- lead cards
- table overflow/card fallback
- all critical actions visible

---

# 115. LOADING / FEEDBACK

Use:
- skeleton
- progress
- button loading
- upload progress
- clear success/error state

Avoid full-screen spinner for routine operations.

---

# 116. OPTIMISTIC UI

Use only when safe:
- simple reorder
- harmless toggle

Avoid optimistic destructive operations.

---

# 117. REORDER

Support ordering for:
- homepage sections
- navigation
- packages
- featured work
- FAQ
- media gallery

Drag-and-drop optional but should have accessible/fallback ordering.

---

# 118. DIRTY FORM WARNING

Before route leave:

> You have unsaved changes.

---

# 119. SCHEDULING

Admin datetime picker:
- clear timezone
- store UTC
- display human-friendly local time

Example:

```text
Scheduled for 12 Sep 2026, 09:00 WIB
```

---

# 120. PAGE VISIBILITY

Separate:
- published
- visible in navigation
- indexable

A page can be public but not in navigation.

---

# 121. PREVIEW SECURITY

All preview pages:
- authenticated
- noindex
- no public draft API leak

---

# 122. CACHE / REVALIDATION

After publish/edit:
- update public content predictably
- invalidate cache if introduced
- do not let stale CMS data remain indefinitely

---

# 123. SEEDING

Provide safe development seeds.

Recommended commands:

```text
pnpm seed:admin
pnpm seed:content
```

Never let a seed command overwrite production casually.

Require environment safeguards.

---

# 124. DOCUMENTATION

Update `README.md`.

Add:

```text
docs/admin-guide.md
docs/content-model.md
docs/deployment.md
```

README must cover:
1. overview
2. stack
3. architecture
4. public routes
5. admin routes
6. roles
7. local setup
8. env
9. Supabase
10. migrations
11. Cloudinary
12. Resend
13. Turnstile
14. i18n
15. theme
16. publishing flow
17. tests
18. deployment
19. seed
20. known limitations

---

# 125. NON-DEVELOPER ADMIN ACCEPTANCE

A non-developer should be able to:

- edit homepage headline
- reorder homepage sections
- create/edit service
- update package price
- upload image
- upload/select video
- create case study
- upload and publish design evidence
- create photography album and bulk-upload photos
- create videography evidence and attach/upload video
- add client
- add testimonial
- publish article
- publish company update
- add FAQ
- manage careers
- update nav
- update footer/contact
- manage lead status

without editing source code.

This is a core acceptance criterion.

---

# 126. WHAT STAYS CODE-OWNED

Keep code-owned:
- Vue components
- animation logic
- design tokens
- allowed section types
- API validation
- permissions
- route architecture
- security rules

CMS controls content and approved variants, not executable code.

---

# 127. IMPLEMENTATION MILESTONES

## MILESTONE 00 — AUDIT

Deliver internal findings:
- current features
- current schema
- current admin
- current auth
- content source map
- broken/stale branding
- technical debt
- migration plan

Do not start redesign before audit.

---

## MILESTONE 01 — BRAND + THEME FOUNDATION

Tasks:
- Karsa Studio -> Karsa Agency
- site config
- metadata/schema
- official logo integration
- light/dark/system
- design tokens
- typography
- UI UX Pro Max review
- no regression

Verification:

```bash
pnpm lint
pnpm typecheck
pnpm build
```

---

## MILESTONE 02 — DATABASE CMS FOUNDATION

Add additive migrations for:
- admin profiles
- services
- packages
- media
- clients
- testimonials
- content status
- page sections
- audit
- settings

Verify constraints/security.

---

## MILESTONE 03 — ADMIN SHELL

Build:
- new admin layout
- sidebar
- dashboard
- RBAC
- admin theme
- table/form primitives
- media picker
- rich text editor
- common loading/error/empty states

---

## MILESTONE 04 — SERVICES + PACKAGES CMS

Admin CRUD.

Public:

```text
/services
/services/[slug]
/packages
```

Move production service source to DB.

---

## MILESTONE 05 — WORK + CREATIVE EVIDENCE + CLIENTS + TESTIMONIALS

Expand current project admin.

Add:
- media gallery
- categories
- clients
- verified metrics
- testimonials
- featured
- status
- translations

Build dedicated creative evidence modules:

```text
/admin/portfolio/design
/admin/portfolio/photography
/admin/portfolio/videography
```

Build public hubs:

```text
/design
/photography
/videography
```

Each must be populated from admin-managed evidence data.

Photography must support multi-image albums.
Videography must support video projects, posters, and external/direct video sources.
Design must support project collections and mockup galleries.

Upgrade `/work` to aggregate cross-disciplinary evidence without duplicating records.

---

## MILESTONE 06 — HOMEPAGE CMS + PUBLIC REDESIGN

Build homepage V2:
- light/dark
- section manager
- Karsa identity
- real data
- no fake proof
- new service positioning
- Full Presence section
- featured work
- insights/update/FAQ hooks

---

## MILESTONE 07 — INSIGHTS + UPDATES + FAQ

Build:
- rich text
- draft
- preview
- schedule
- categories/tags
- SEO
- translations

---

## MILESTONE 08 — ABOUT + PROCESS + CONTACT + CAREERS + LEGAL

Implement public and admin management for:
- About
- Process
- Contact
- Careers
- Privacy
- Terms
- Terms of Service

---

## MILESTONE 09 — LEAD CRM

Upgrade:
- multi-step form
- package selection
- CRM fields
- notes
- activities
- follow-up
- RBAC
- Resend
- Turnstile

---

## MILESTONE 10 — SEO + PERFORMANCE + ACCESSIBILITY

Audit:
- canonical
- hreflang
- sitemap
- robots
- schema
- OG
- web vitals
- accessibility
- reduced motion
- media optimization

---

## MILESTONE 11 — TEST + HARDEN

Run:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm test:e2e
```

Fix failures.

Security review.

---

## MILESTONE 12 — PRODUCTION HANDOVER

Deliver:
- final code
- migrations
- seed
- `.env.example`
- README
- admin guide
- content model docs
- test report
- known limitations
- Vercel deployment notes
- QA summary

---

# 128. PUBLIC ACCEPTANCE CHECKLIST

- [ ] Karsa Agency branding consistent
- [ ] no Karsa Studio public leftovers
- [ ] official logo integrated
- [ ] light mode
- [ ] dark mode
- [ ] system mode
- [ ] theme persistence
- [ ] responsive navigation
- [ ] services DB-driven
- [ ] service detail DB-driven
- [ ] packages DB-driven
- [ ] work DB-driven
- [ ] case studies
- [ ] dedicated /design evidence hub
- [ ] dedicated /photography evidence hub
- [ ] dedicated /videography evidence hub
- [ ] client logos permission-aware
- [ ] testimonials permission-aware
- [ ] insights
- [ ] updates
- [ ] FAQ
- [ ] about
- [ ] process
- [ ] contact
- [ ] start-a-project
- [ ] careers
- [ ] legal pages
- [ ] Indonesian
- [ ] English
- [ ] sitemap
- [ ] robots
- [ ] 404
- [ ] SEO
- [ ] OG
- [ ] accessible mobile

---

# 129. ADMIN ACCEPTANCE CHECKLIST

- [ ] login
- [ ] logout
- [ ] RBAC
- [ ] dashboard
- [ ] homepage editor
- [ ] pages
- [ ] services CRUD
- [ ] packages CRUD
- [ ] projects CRUD
- [ ] design showcase CRUD
- [ ] photography portfolio CRUD + multi-image albums
- [ ] videography portfolio CRUD + video sources/posters
- [ ] client CRUD
- [ ] testimonial CRUD
- [ ] insights CRUD
- [ ] updates CRUD
- [ ] FAQ CRUD
- [ ] careers CRUD
- [ ] lead CRM
- [ ] media library
- [ ] navigation
- [ ] site settings
- [ ] SEO
- [ ] redirects
- [ ] users
- [ ] audit log
- [ ] draft
- [ ] preview
- [ ] publish
- [ ] schedule
- [ ] archive
- [ ] translation editing

---

# 130. SECURITY ACCEPTANCE

- [ ] no Supabase service role in browser
- [ ] no Cloudinary secret in browser
- [ ] no Resend secret in browser
- [ ] admin API verifies auth
- [ ] admin API verifies role
- [ ] Zod server validation
- [ ] inquiry Turnstile
- [ ] rate limits
- [ ] rich content sanitized
- [ ] upload restricted
- [ ] RLS reviewed
- [ ] no private lead endpoint public
- [ ] no secrets committed

---

# 131. UX ACCEPTANCE

- [ ] UI UX Pro Max used if available
- [ ] public site keeps Karsa identity
- [ ] public site not generic
- [ ] light mode fully designed
- [ ] dark mode fully designed
- [ ] mobile is not desktop shrunk
- [ ] admin is efficient
- [ ] clear forms
- [ ] clear tables
- [ ] empty states
- [ ] error states
- [ ] loading states
- [ ] visible focus
- [ ] accessible modals/dialogs
- [ ] touch targets adequate

---

# 132. CONTENT ACCEPTANCE

- [ ] no lorem ipsum
- [ ] no fake client
- [ ] no fake testimonial
- [ ] no fake metric
- [ ] no fake award
- [ ] Website services
- [ ] Design services
- [ ] Photography services
- [ ] Videography + Editing services
- [ ] Integrated packages
- [ ] truthful project labels

---

# 133. PERFORMANCE ACCEPTANCE

- [ ] LCP target <2.5s
- [ ] CLS <0.1
- [ ] INP target <200ms
- [ ] Lighthouse Performance target >=90
- [ ] Accessibility >=95
- [ ] SEO >=95
- [ ] noncritical media lazy-loaded
- [ ] 3D not blocking content
- [ ] images optimized
- [ ] video strategy optimized
- [ ] bundle reviewed

If target is missed, report measured reason and mitigation.

---

# 134. CODE QUALITY ACCEPTANCE

- [ ] no TypeScript errors
- [ ] no lint errors
- [ ] production build works
- [ ] critical tests pass
- [ ] no unnecessary `any`
- [ ] no dead debug logs
- [ ] no monolithic admin pages where reusable components are appropriate
- [ ] consistent API contract
- [ ] centralized schemas/utilities
- [ ] clear naming
- [ ] documented complex logic

---

# 135. DO NOT DO THESE

Never:
- copy cmlabs UI
- copy cmlabs copy
- copy cmlabs assets
- use cmlabs clients as Karsa clients
- invent statistics
- hard-code CMS content everywhere
- expose Supabase service role
- rely only on client-side auth
- leave Karsa Studio branding
- make entire site black again
- turn every section into generic cards
- add excessive 3D
- use many animation libraries unnecessarily
- create unnecessary microservices
- replace Nuxt/Supabase without an audited reason
- destructively edit applied migrations
- mark incomplete TODOs as done

---

# 136. TARGET ARCHITECTURE

```text
                     PUBLIC WEBSITE
                            │
                            ▼
                     Nuxt SSR / Nitro
                            │
               ┌────────────┴─────────────┐
               ▼                          ▼
        PUBLIC READ API              INQUIRY API
               │                          │
               ▼                          ▼
          SUPABASE DB               Zod + Turnstile
               │                          │
               │                          ▼
               │                    Leads + Resend
               │
               ▼
         Published Content


                     ADMIN CMS
                        │
                        ▼
                   Supabase Auth
                        │
                        ▼
                   Nitro Admin API
                        │
                Auth + Role Check
                        │
             ┌──────────┴──────────┐
             ▼                     ▼
        Supabase DB            Cloudinary
             │                     │
             ▼                     ▼
          Content               Media
```

---

# 137. CONTENT PIPELINE

```text
Admin creates content
        ↓
Save Draft
        ↓
Preview
        ↓
Review
        ↓
Publish / Schedule
        ↓
Public SSR page
        ↓
SEO / Sitemap
```

---

# 138. LEAD PIPELINE

```text
Visitor
   ↓
Start a Project
   ↓
Service / Package
   ↓
Project Detail
   ↓
Budget / Timeline
   ↓
Contact
   ↓
Turnstile + Validation
   ↓
Lead Database
   ↓
Resend Notification
   ↓
Admin Pipeline
   ↓
Contacted
   ↓
Qualified
   ↓
Discovery
   ↓
Proposal
   ↓
Won / Lost
```

---

# 139. FINAL POSITIONING CHECK

Within 10–15 seconds, visitor should understand:

> **Karsa Agency is a Creative & Digital Agency helping businesses build a complete brand presence through Website, Design, Photography, and Film.**

---

# 140. FINAL PRODUCT PRINCIPLE

Goal:

```text
mature-agency-level content completeness
+
Karsa-specific services
+
Karsa visual identity
+
bright light mode + refined dark mode
+
real CMS/admin
+
honest startup proof
=
Karsa Agency V2
```

Do not build a cmlabs clone.

---

# 141. FINAL AGENT RESPONSE FORMAT

When complete, report:

```text
1. Audit of original repository
2. Architecture decisions
3. Files/modules changed
4. Database migrations added
5. New public routes
6. New admin routes
7. CMS architecture
8. Authentication/RBAC
9. Media architecture
10. Lead CRM upgrade
11. Light/dark theme implementation
12. UI UX Pro Max usage and design decisions
13. SEO implementation
14. Accessibility results
15. Performance results
16. Tests executed and results
17. Environment variables
18. Supabase migration/seed commands
19. Vercel deployment steps
20. Known limitations
21. Recommended Phase 2
```

Include real verification evidence.

Do not answer only:

> Done.

---

# 142. FINAL DEFINITION OF DONE

The project is only complete when:

```text
PUBLIC
✓ complete agency information architecture
✓ Karsa Agency positioning
✓ Website / Design / Photo / Film
✓ Integrated packages
✓ case studies
✓ dedicated Design evidence hub
✓ dedicated Photography evidence hub
✓ dedicated Videography evidence hub
✓ insights
✓ updates
✓ FAQ
✓ company/legal pages
✓ light/dark/system
✓ ID/EN
✓ responsive
✓ SEO

ADMIN
✓ secure auth
✓ role-based access
✓ complete content CMS
✓ media library
✓ services
✓ packages
✓ projects
✓ design portfolio evidence
✓ photography portfolio evidence
✓ videography portfolio evidence
✓ clients
✓ testimonials
✓ insights
✓ updates
✓ FAQ
✓ careers
✓ site sections
✓ settings
✓ navigation
✓ SEO
✓ leads
✓ audit

ENGINEERING
✓ additive migrations
✓ secure APIs
✓ no leaked secrets
✓ lint passes
✓ typecheck passes
✓ unit tests pass
✓ production build passes
✓ critical E2E passes
✓ accessibility reviewed
✓ performance reviewed

TRUTHFULNESS
✓ no fake proof
✓ no fake clients
✓ no fake metrics
✓ no fake testimonials

HANDOVER
✓ README updated
✓ admin guide
✓ env example
✓ migration docs
✓ seed docs
✓ deployment guide
✓ final QA report
```

---

# END OF MASTER PROMPT

**KARSA AGENCY**  
**Creative & Digital Agency**  
**Website · Design · Photography · Film**  
**Dari Karsa Menjadi Karya.**
