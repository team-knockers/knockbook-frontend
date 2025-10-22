import { Editor } from "@tiptap/react";

import {
  LuUndo2, LuRedo2, LuHeading1, LuHeading2, LuHeading3, LuList, LuListOrdered,
  LuQuote, LuBold, LuItalic, LuStrikethrough, LuUnderline, LuImage,
} from "react-icons/lu";
import s from "./EditorToolbar.module.css";
import { useRef, useEffect, useState } from "react";

type ToolbarProps = {
  editor: Editor | null;
};

export default function EditorToolbar({
  editor
}: ToolbarProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  
  // force re-render when editor state changes so `editor.isActive(...)` is up-to-date
  const [_unused, setTick] = useState(0);
  useEffect(() => {
    if (!editor) return;
    const handler = () => setTick((t) => t + 1);
    // subscribe to a few events that indicate state/selection changes
    editor.on("transaction", handler);
    editor.on("selectionUpdate", handler);
    editor.on("update", handler);
    return () => {
      editor.off("transaction", handler);
      editor.off("selectionUpdate", handler);
      editor.off("update", handler);
    };
  }, [editor]);
  if (!editor) return null;


  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      editor.chain().focus().setImage({ src: url }).run();
      URL.revokeObjectURL(url);
    };

    img.onerror = () => {
      console.error("❌ Failed to load image:", file.name);
      URL.revokeObjectURL(url);
    };

    img.src = url;
  };

  return (
    <div
      className={s['toolbar']}
      role="toolbar"
      aria-label="Formatting options"
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleImageChange}
      />

      {/* group: history */}
      <div className={s.group} role="group" aria-label="history">
        <button
          className={s['button']}
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
        >
          <LuUndo2 className={s['icon']}/>
        </button>
        <button
          className={s['button']}
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
        >
          <LuRedo2 className={s['icon']}/>
        </button>
      </div>

      {/* group: headings */}
      <div className={s.group} role="group" aria-label="headings">
        <button
          className={`${s['button']} ${editor.isActive("heading", { level: 1 }) ? s['buttonActive'] : ''}`}
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        >
          <LuHeading1 className={s['icon']}/>
        </button>
        <button
          className={`${s['button']} ${editor.isActive("heading", { level: 2 }) ? s['buttonActive'] : ''}`}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          <LuHeading2 className={s['icon']}/>
        </button>
        <button
          className={`${s['button']} ${editor.isActive("heading", { level: 3 }) ? s['buttonActive'] : ''}`}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        >
          <LuHeading3 className={s['icon']}/>
        </button>
      </div>

      {/* group: lists + quote (merged to avoid mutually-exclusive active states) */}
      <div className={s.group} role="group" aria-label="lists-quote">
        <button
          className={`${s['button']} ${editor.isActive("bulletList") ? s['buttonActive'] : ''}`}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <LuList className={s['icon']}/>
        </button>
        <button
          className={`${s['button']} ${editor.isActive("orderedList") ? s['buttonActive'] : ''}`}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <LuListOrdered className={s['icon']}/>
        </button>
        <button
          className={`${s['button']} ${editor.isActive("blockquote") ? s['buttonActive'] : ''}`}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          <LuQuote className={s['icon']}/>
        </button>
      </div>

      {/* group: inline styles */}
      <div className={s.group} role="group" aria-label="inline styles">
        <button
          className={`${s['button']} ${editor.isActive("bold") ? s['buttonActive'] : ''}`}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <LuBold className={`${s['icon']} ${s['bold']}`}/>
        </button>
        <button
          className={`${s['button']} ${editor.isActive("italic") ? s['buttonActive'] : ''}`}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <LuItalic className={s['icon']}/>
        </button>
        <button
          className={`${s['button']} ${editor.isActive("strike") ? s['buttonActive'] : ''}`}
          onClick={() => editor.chain().focus().toggleStrike().run()}
        >
          <LuStrikethrough className={s['icon']}/>
        </button>
        <button
          className={`${s['button']} ${editor.isActive("underline") ? s['buttonActive'] : ''}`}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          <LuUnderline className={s['icon']}/>
        </button>
      </div>

      {/* group: media */}
      <div className={s.group} role="group" aria-label="media">
        <button
          className={s['button']}
          onClick={handleImageClick}
          title="Insert image"
          aria-label="Insert image"
        >
          <LuImage className={s['icon']}/>
        </button>
      </div>

    </div>
  );
}
