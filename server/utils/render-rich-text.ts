import { generateHTML } from '@tiptap/html'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import { Table } from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableHeader from '@tiptap/extension-table-header'
import TableCell from '@tiptap/extension-table-cell'
import DOMPurify from 'isomorphic-dompurify'
import type { JSONContent } from '@tiptap/vue-3'

const extensions = [
  StarterKit.configure({ heading: { levels: [2, 3, 4] } }),
  Link,
  Image,
  Table,
  TableRow,
  TableHeader,
  TableCell,
]

/**
 * Converts admin-authored TipTap JSON (see app/components/admin/RichTextEditor.vue)
 * into sanitized HTML for public rendering. This is the ONLY place TipTap
 * content should become HTML — never trust HTML sent directly from the
 * admin client (see master prompt §34/§56).
 */
export function renderRichText(content: JSONContent | null | undefined): string {
  if (!content) return ''

  let html: string
  try {
    html = generateHTML(content, extensions)
  }
  catch {
    return ''
  }

  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      'p', 'br', 'strong', 'em', 's', 'code', 'pre',
      'h2', 'h3', 'h4', 'ul', 'ol', 'li', 'blockquote',
      'a', 'img', 'table', 'thead', 'tbody', 'tr', 'th', 'td',
    ],
    ALLOWED_ATTR: ['href', 'target', 'rel', 'src', 'alt', 'title'],
    ALLOW_DATA_ATTR: false,
  })
}
