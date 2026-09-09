<script setup lang="ts">
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import { Table } from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableHeader from '@tiptap/extension-table-header'
import TableCell from '@tiptap/extension-table-cell'
import Placeholder from '@tiptap/extension-placeholder'
import type { JSONContent } from '@tiptap/vue-3'

/**
 * Reusable rich-text field for admin content forms (insights, service copy,
 * etc — see master prompt §34). Stores/emits TipTap JSON, not HTML: HTML is
 * only ever generated at render time (server/utils/render-rich-text.ts),
 * sanitized there, and never trusted raw from this component.
 */
const props = withDefaults(defineProps<{
  modelValue: JSONContent | null
  placeholder?: string
}>(), {
  placeholder: 'Start writing…',
})

const emit = defineEmits<{ 'update:modelValue': [JSONContent] }>()

const editor = useEditor({
  content: props.modelValue ?? '',
  extensions: [
    StarterKit.configure({ heading: { levels: [2, 3, 4] } }),
    Link.configure({ openOnClick: false, autolink: true }),
    Image,
    Table.configure({ resizable: false }),
    TableRow,
    TableHeader,
    TableCell,
    Placeholder.configure({ placeholder: props.placeholder }),
  ],
  editorProps: {
    attributes: {
      class: 'prose prose-sm max-w-none focus:outline-none min-h-[12rem] px-4 py-3 text-[var(--color-text)]',
    },
  },
  onUpdate: ({ editor: instance }) => {
    emit('update:modelValue', instance.getJSON())
  },
})

function setLink() {
  if (!editor.value) return
  const previous = editor.value.getAttributes('link').href as string | undefined

  const url = window.prompt('Link URL', previous || 'https://')
  if (url === null) return
  if (url === '') {
    editor.value.chain().focus().extendMarkRange('link').unsetLink().run()
    return
  }
  editor.value.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
}

onBeforeUnmount(() => {
  editor.value?.destroy()
})

interface ToolbarButton {
  label: string
  active?: () => boolean
  run: () => void
}

const toolbarButtons = computed<ToolbarButton[]>(() => {
  const e = editor.value
  if (!e) return []
  return [
    { label: 'Bold', active: () => e.isActive('bold'), run: () => e.chain().focus().toggleBold().run() },
    { label: 'Italic', active: () => e.isActive('italic'), run: () => e.chain().focus().toggleItalic().run() },
    { label: 'H2', active: () => e.isActive('heading', { level: 2 }), run: () => e.chain().focus().toggleHeading({ level: 2 }).run() },
    { label: 'H3', active: () => e.isActive('heading', { level: 3 }), run: () => e.chain().focus().toggleHeading({ level: 3 }).run() },
    { label: 'Bullet list', active: () => e.isActive('bulletList'), run: () => e.chain().focus().toggleBulletList().run() },
    { label: 'Numbered list', active: () => e.isActive('orderedList'), run: () => e.chain().focus().toggleOrderedList().run() },
    { label: 'Quote', active: () => e.isActive('blockquote'), run: () => e.chain().focus().toggleBlockquote().run() },
    { label: 'Link', active: () => e.isActive('link'), run: setLink },
  ]
})
</script>

<template>
  <div class="overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)]">
    <div
      v-if="editor"
      class="flex flex-wrap gap-1 border-b border-[var(--color-border)] p-2"
      role="toolbar"
      aria-label="Formatting"
    >
      <button
        v-for="button in toolbarButtons"
        :key="button.label"
        type="button"
        class="min-h-[36px] rounded-[var(--radius-sm)] px-2.5 text-xs font-medium transition-colors"
        :class="button.active?.()
          ? 'bg-[var(--color-accent)]/10 text-[var(--color-accent)]'
          : 'text-[var(--color-text-muted)] hover:bg-[var(--color-surface-raised)] hover:text-[var(--color-text)]'"
        :aria-pressed="button.active?.()"
        @click="button.run"
      >
        {{ button.label }}
      </button>
    </div>

    <EditorContent :editor="editor" />
  </div>
</template>

<style>
.tiptap p.is-editor-empty:first-child::before {
  content: attr(data-placeholder);
  color: var(--color-text-muted);
  float: left;
  height: 0;
  pointer-events: none;
}
</style>
