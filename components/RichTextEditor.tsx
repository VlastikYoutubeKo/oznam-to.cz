// components/RichTextEditor.tsx - TipTap verze
'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import { useEffect, useState } from 'react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const [isRawMode, setIsRawMode] = useState(false);
  const [rawHTML, setRawHTML] = useState(value);

  const editor = useEditor({
    immediatelyRender: false, // Fix pro Next.js SSR
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          target: '_blank',
          rel: 'noopener noreferrer',
        },
      }),
      Underline,
    ],
    content: value,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      setRawHTML(html);
      onChange(html);
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none focus:outline-none min-h-[200px] p-4',
      },
    },
  });

  // Synchronizace value s editorem
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
      setRawHTML(value);
    }
  }, [value, editor]);

  // Přepnutí do raw módu
  const toggleRawMode = () => {
    if (!isRawMode) {
      // Přepínáme do raw módu - uložíme aktuální HTML
      if (editor) {
        setRawHTML(editor.getHTML());
      }
    } else {
      // Přepínáme zpět do WYSIWYG - nastavíme HTML do editoru
      if (editor) {
        editor.commands.setContent(rawHTML);
        onChange(rawHTML);
      }
    }
    setIsRawMode(!isRawMode);
  };

  // Handler pro změnu raw HTML
  const handleRawHTMLChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newHTML = e.target.value;
    setRawHTML(newHTML);
    onChange(newHTML);
  };

  if (!editor) {
    return <div className="h-[200px] bg-gray-100 animate-pulse rounded-md" />;
  }

  return (
    <div className="border border-gray-300 rounded-lg bg-white overflow-hidden">
      {/* Toolbar */}
      <div className="border-b border-gray-200 bg-gray-50 p-2 flex flex-wrap gap-1">
        {/* Toggle Raw/WYSIWYG */}
        <ToolbarButton
          onClick={toggleRawMode}
          isActive={isRawMode}
          title={isRawMode ? 'Přepnout na WYSIWYG' : 'Přepnout na HTML'}
        >
          {isRawMode ? '📝 WYSIWYG' : '</> HTML'}
        </ToolbarButton>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        {/* Formatting buttons - only visible in WYSIWYG mode */}
        {!isRawMode && (
          <>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBold().run()}
              isActive={editor.isActive('bold')}
              title="Tučné (Ctrl+B)"
            >
              <strong>B</strong>
            </ToolbarButton>
        
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive('italic')}
          title="Kurzíva (Ctrl+I)"
        >
          <em>I</em>
        </ToolbarButton>
        
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          isActive={editor.isActive('underline')}
          title="Podtržené (Ctrl+U)"
        >
          <u>U</u>
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          isActive={editor.isActive('strike')}
          title="Přeškrtnuté"
        >
          <s>S</s>
        </ToolbarButton>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          isActive={editor.isActive('heading', { level: 1 })}
          title="Nadpis 1"
        >
          H1
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          isActive={editor.isActive('heading', { level: 2 })}
          title="Nadpis 2"
        >
          H2
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          isActive={editor.isActive('heading', { level: 3 })}
          title="Nadpis 3"
        >
          H3
        </ToolbarButton>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive('bulletList')}
          title="Odrážky"
        >
          • List
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive('orderedList')}
          title="Číslovaný seznam"
        >
          1. List
        </ToolbarButton>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          isActive={editor.isActive('blockquote')}
          title="Citace"
        >
          " "
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          isActive={editor.isActive('codeBlock')}
          title="Kód"
        >
          {'</>'}
        </ToolbarButton>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        <ToolbarButton
          onClick={() => {
            const url = window.prompt('URL odkazu:');
            if (url) {
              editor.chain().focus().setLink({ href: url }).run();
            }
          }}
          isActive={editor.isActive('link')}
          title="Odkaz"
        >
          🔗
        </ToolbarButton>

        {editor.isActive('link') && (
          <ToolbarButton
            onClick={() => editor.chain().focus().unsetLink().run()}
            title="Odstranit odkaz"
          >
            🔗✕
          </ToolbarButton>
        )}
          </>
        )}
      </div>

      {/* Editor - WYSIWYG or Raw HTML */}
      {isRawMode ? (
        <textarea
          value={rawHTML}
          onChange={handleRawHTMLChange}
          className="w-full min-h-[200px] p-4 font-mono text-sm focus:outline-none resize-y"
          placeholder={placeholder || 'Vložte HTML kód...'}
          spellCheck={false}
        />
      ) : (
        <>
          <EditorContent editor={editor} />

          {!editor.getText() && (
            <div className="absolute top-14 left-4 text-gray-400 pointer-events-none">
              {placeholder || 'Začněte psát...'}
            </div>
          )}
        </>
      )}
    </div>
  );
}

// Komponenta tlačítka v toolbaru
function ToolbarButton({ 
  onClick, 
  isActive, 
  title, 
  children 
}: { 
  onClick: () => void; 
  isActive?: boolean; 
  title: string; 
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`px-3 py-1.5 text-sm font-medium rounded transition-colors ${
        isActive 
          ? 'bg-indigo-600 text-white' 
          : 'bg-white text-gray-700 hover:bg-gray-100'
      } border border-gray-300`}
    >
      {children}
    </button>
  );
}