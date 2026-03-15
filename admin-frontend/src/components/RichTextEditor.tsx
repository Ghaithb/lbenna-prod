import React from 'react';

type Props = {
  value: string;
  onChange: (html: string) => void;
  onInsertMedia?: (url: string) => void;
};

// Lightweight rich text editor based on contenteditable (no extra deps)
// Provides bold/italic/underline, lists, link, and image insert via toolbar.
export const RichTextEditor = ({ value, onChange, onInsertMedia }: Props) => {
  const ref = (React as any).useRef(null);

  (React as any).useEffect(() => {
    if (!ref.current) return;
    // Avoid cursor jump: only set when external change
    if (ref.current.innerHTML !== value) {
      ref.current.innerHTML = value || '';
    }
  }, [value]);

  const exec = (cmd: string, arg?: string) => {
    document.execCommand(cmd, false, arg);
    if (ref.current) onChange(ref.current.innerHTML);
  };

  const onPaste = (e: any) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
  };

  return (
    <div className="border rounded">
      <div className="flex flex-wrap gap-1 border-b bg-gray-50 p-2">
        <button type="button" className="px-2 py-1 border rounded" onClick={() => exec('bold')}>B</button>
        <button type="button" className="px-2 py-1 border rounded italic" onClick={() => exec('italic')}>I</button>
        <button type="button" className="px-2 py-1 border rounded underline" onClick={() => exec('underline')}>U</button>
        <button type="button" className="px-2 py-1 border rounded" onClick={() => exec('insertUnorderedList')}>• List</button>
        <button type="button" className="px-2 py-1 border rounded" onClick={() => exec('insertOrderedList')}>1. List</button>
        <button type="button" className="px-2 py-1 border rounded" onClick={() => {
          const url = window.prompt('Lien URL:');
          if (url) exec('createLink', url);
        }}>Lien</button>
        <button type="button" className="px-2 py-1 border rounded" onClick={() => {
          const url = window.prompt('Image URL:');
          if (url) exec('insertImage', url);
        }}>Image</button>
        {onInsertMedia && (
          <button type="button" className="px-2 py-1 border rounded" onClick={() => {
            const url = window.prompt('Insérer média URL:');
            if (url) {
              exec('insertImage', url);
              onInsertMedia(url);
            }
          }}>+ Média</button>
        )}
      </div>
      <div
        ref={ref}
        className="min-h-[160px] p-3 outline-none"
        contentEditable
        suppressContentEditableWarning
        onInput={() => ref.current && onChange(ref.current.innerHTML)}
        onPaste={onPaste}
      />
    </div>
  );
};

export default RichTextEditor;
