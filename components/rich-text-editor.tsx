import { useEffect } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import { Bold, Italic, Strikethrough, Code, List, ListOrdered } from 'lucide-react'

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  error?: boolean;
}

const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) {
    return null
  }

  return (
    <div className="flex flex-wrap items-center gap-1 border-b border-outline-variant p-2 bg-surface-container-low rounded-t-md">
      <button
        onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleBold().run() }}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={`p-1.5 rounded transition-colors ${editor.isActive('bold') ? 'bg-primary-container text-on-primary-container' : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'}`}
      >
        <Bold size={16} />
      </button>
      <button
        onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleItalic().run() }}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={`p-1.5 rounded transition-colors ${editor.isActive('italic') ? 'bg-primary-container text-on-primary-container' : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'}`}
      >
        <Italic size={16} />
      </button>
      <button
        onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleStrike().run() }}
        disabled={!editor.can().chain().focus().toggleStrike().run()}
        className={`p-1.5 rounded transition-colors ${editor.isActive('strike') ? 'bg-primary-container text-on-primary-container' : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'}`}
      >
        <Strikethrough size={16} />
      </button>
      <div className="w-px h-5 bg-outline-variant mx-1"></div>
      <button
        onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleCodeBlock().run() }}
        className={`p-1.5 rounded transition-colors ${editor.isActive('codeBlock') ? 'bg-primary-container text-on-primary-container' : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'}`}
      >
        <Code size={16} />
      </button>
      <button
        onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleBulletList().run() }}
        className={`p-1.5 rounded transition-colors ${editor.isActive('bulletList') ? 'bg-primary-container text-on-primary-container' : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'}`}
      >
        <List size={16} />
      </button>
      <button
        onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleOrderedList().run() }}
        className={`p-1.5 rounded transition-colors ${editor.isActive('orderedList') ? 'bg-primary-container text-on-primary-container' : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'}`}
      >
        <ListOrdered size={16} />
      </button>
    </div>
  )
}

const handleImageUpload = (view: any, file: File) => {
  const reader = new FileReader();
  reader.onload = (readerEvent) => {
    const dataUrl = readerEvent.target?.result as string;
    if (dataUrl) {
      const { schema } = view.state;
      const node = schema.nodes.image.create({ src: dataUrl });
      const transaction = view.state.tr.replaceSelectionWith(node);
      view.dispatch(transaction);
    }
  };
  reader.readAsDataURL(file);
};

export default function RichTextEditor({ content, onChange, error }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        HTMLAttributes: {
          class: 'rounded-md max-w-full h-auto border border-outline-variant my-2 shadow-sm cursor-default select-none',
        },
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      // Return HTML string instead of JSON
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm dark:prose-invert max-w-none min-h-[120px] focus:outline-none p-4 text-[14px] text-on-surface',
      },
      handleDrop(view, event, slice, moved) {
        if (!moved && event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files.length > 0) {
          const files = Array.from(event.dataTransfer.files);
          const imageFiles = files.filter((file) => file.type.startsWith('image/'));
          if (imageFiles.length > 0) {
            event.preventDefault();
            imageFiles.forEach((file) => handleImageUpload(view, file));
            return true;
          }
        }
        return false;
      },
      handlePaste(view, event, slice) {
        if (event.clipboardData && event.clipboardData.files && event.clipboardData.files.length > 0) {
          const files = Array.from(event.clipboardData.files);
          const imageFiles = files.filter((file) => file.type.startsWith('image/'));
          if (imageFiles.length > 0) {
            event.preventDefault();
            imageFiles.forEach((file) => handleImageUpload(view, file));
            return true;
          }
        }
        return false;
      },
    },
  })

  useEffect(() => {
    if (content === '' && editor && !editor.isEmpty) {
      editor.commands.setContent('');
    }
  }, [content, editor]);

  // Prevent hydration errors by rendering empty div until mounted
  if (!editor) {
    return (
      <div className={`border rounded-md min-h-[160px] ${error ? 'border-error bg-error-container/10' : 'border-outline-variant bg-surface-container-lowest'}`} />
    )
  }

  return (
    <div className={`border rounded-md transition-all flex flex-col ${error ? 'border-error bg-error-container/10' : 'border-outline-variant bg-surface-container-lowest focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary'}`}>
      <MenuBar editor={editor} />
      <EditorContent editor={editor} className="flex-grow cursor-text overflow-y-auto custom-scrollbar max-h-[300px]" />
    </div>
  )
}
