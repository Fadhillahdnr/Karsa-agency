# Admin Guide

A non-developer walkthrough of the Karsa Agency admin panel — how to sign in, what your role lets you do, and how to manage each type of content. No code or terminal access is needed for anything in this document.

## Signing in

1. Go to `/admin/login` on the live site.
2. Sign in with the email and password you were given.
3. You'll land on the **Dashboard** (`/admin`) — a quick overview of published/draft projects and recent leads.

If sign-in fails or you land on the login page again immediately after signing in, your account may not have an admin role assigned yet — contact whoever manages the admin panel (see "Roles" below) rather than retrying.

## Roles — what you can see and do

Every admin account has exactly one role. The sidebar and page content adjust automatically to what your role can do — if a section isn't in your sidebar, your role doesn't have access to it.

| Role | Can do |
|---|---|
| **Super Admin** | Everything below, plus delete content and manage other admin accounts. |
| **Content Editor** | Create and edit content across the site (projects, services, packages, articles, careers, portfolio, etc.). Cannot delete some content types or manage admin accounts. |
| **Sales** | Focused on the Leads section — view, update, and follow up on inquiries. |
| **Viewer** | Read-only access — can see content and leads but not make changes. |

If you're not sure what your role is, it's shown wherever your name/email appears in the admin header.

## Managing content

Content is organized by type in the sidebar. Every content type follows the same basic pattern:

- **List page** (e.g. `/admin/projects`) — shows everything of that type, with its current status.
- **New page** (e.g. `/admin/projects/new`) — a form to create one.
- **Detail/edit page** (e.g. `/admin/projects/[id]`) — edit an existing item, and (if your role allows) delete it.

### Publishing states

Most content types have a status: **Draft**, **Scheduled**, **Published**, or **Archived** (a few simpler types like FAQs and legal pages only use Draft/Published/Archived). Only **Published** content (with a publish date/time that has already passed, for scheduled content) appears on the live website. Use **Draft** while you're still working on something, and **Archived** to hide something without deleting it.

Projects are the one exception — they use a simple Published / Not Published toggle rather than the four-state system above; the effect on visibility is the same.

### Content types and where to manage them

| What it is | Where on the live site | Manage at |
|---|---|---|
| Case study / portfolio projects | `/work` | `/admin/projects` |
| Services offered | `/services` | `/admin/services` |
| Pricing packages | `/packages` | `/admin/packages` |
| Client logos | shown across the site | `/admin/clients` |
| Client testimonials | shown across the site | `/admin/testimonials` |
| Design / photography / videography portfolio pieces | `/design`, `/photography`, `/videography` | `/admin/portfolio/[discipline]` (pick the discipline from the sidebar) |
| Insights (blog articles) | `/insights` | `/admin/articles` |
| Company updates/news | `/updates` | `/admin/updates` |
| Frequently asked questions | `/faq` | `/admin/faqs` |
| Job openings | `/careers` | `/admin/careers` |
| Legal pages (privacy, terms, etc.) | linked in the footer | `/admin/legal` |
| Homepage section content | `/` (homepage) | `/admin/content/home` |
| Uploaded images/videos | used across content | `/admin/media` |

### Rich text editing

Any field with formatting options (bold, links, headings, lists) uses the same rich-text editor throughout the admin panel. What you see in the editor is close to what visitors will see — formatting is cleaned up automatically when you save, so pasting from Word/Google Docs won't bring along stray styling.

### Uploading images and videos

Use `/admin/media` to upload directly, or upload inline from most content forms (e.g. a project's cover image field). Accepted files: images or videos, up to 50MB each. Uploaded files are stored externally (Cloudinary) and can be reused across multiple pieces of content — check the media library before re-uploading the same asset.

## Managing leads (inquiries)

When someone submits the "Start a Project" form on the public site, it appears in `/admin/leads` automatically — no action needed to receive it.

1. Click a lead to open its detail page (`/admin/leads/[id]`).
2. Update its **status** as it moves through your process: New → Contacted → Qualified → Discovery → Proposal → Won / Lost, or Archived if it goes nowhere.
3. Assign it to a team member if applicable.
4. Add internal notes — these are private, visible only inside the admin panel, never to the person who submitted the inquiry.
5. Every change (status updates, notes, assignment) is recorded automatically in that lead's timeline, so there's always a record of what happened and when.

## Language (EN/ID)

The public site is bilingual (English and Indonesian). For content types that support translation, the edit form has separate fields per language — fill in both if you want the content to read naturally in each language; leaving one blank will fall back to showing the other language's content or an empty state, depending on the field.

## Light/dark theme

The public site supports light mode, dark mode, and following the visitor's device setting automatically — this is a visitor-facing preference, not something managed from the admin panel.

## Getting help

If something in the admin panel isn't behaving as described here, or a section you expect to see is missing, check with whoever manages admin accounts before assuming it's broken — it may be a role-access difference rather than a bug.
