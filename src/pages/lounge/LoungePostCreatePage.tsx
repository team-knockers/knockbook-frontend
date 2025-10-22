import s from './LoungePostCreatePage.module.css';
import { useEffect, useRef, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import TurndownService from "turndown";
import EditorToolbar from '../../features/lounge/components/EditorToolbar';
import { useNavigate } from 'react-router-dom';
import { PATHS } from '../../routes/paths';

const displayName = "호랭이";

export default function LoungePostCreatePage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [markdown, setMarkdown] = useState("");

  const titleRef = useRef<HTMLTextAreaElement | null>(null);
  const subtitleRef = useRef<HTMLTextAreaElement | null>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
    ],
    content: "<p>본문을 작성해주세요</p>",
});

  const handleSave = () => {
    if (!editor) {
      return;
    }
    const html = editor.getHTML();
    const turndownService = new TurndownService();
    const md = turndownService.turndown(html);
    setMarkdown(md);

    console.log("Title:", title);
    console.log("Subtitle:", subtitle);
    console.log("Markdown content:", markdown);
  };

  const handleCancel = () => {
    setTitle("");
    setSubtitle("");
    setMarkdown("");
    if (editor) {
      editor.commands.setContent('<p>본문을 작성해주세요</p>');
      editor.chain().focus().run();
    }
    navigate(PATHS.loungeHome);
  };
  
  // Auto-resize function for textarea
  const autoResize = (textarea: HTMLTextAreaElement | null) => {
    if (!textarea) {
      return;
    }
    textarea.style.height = "auto";
    textarea.style.height = textarea.scrollHeight + "px";
  };

  // Change on height adjustment
  useEffect(() => {
    autoResize(titleRef.current);
  }, [title]);

  useEffect(() => {
    autoResize(subtitleRef.current);
  }, [subtitle]);

  return (
    <main className={s['lounge-post-create']}>

      {/* Post header */}
      <header className={s['post-header']}>
        <div className={s['post-header__content']}>
          <textarea
            className={s['post-header__title']}
            ref={titleRef}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="제목"
            rows={1}
          />
          <textarea
            className={s['post-header__subtitle']}
            ref={subtitleRef}
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            placeholder="소제목"
            rows={1}
          />
        </div>
        <div className={s['post-header__meta']}>
          <span className={s['post-header__meta-label']}>by</span>
          <span className={s['post-header__author-name']}>{displayName}</span>
        </div>
      </header>

      {/* Post editor */}
      <section>
        <EditorToolbar editor={editor} />

        <div className={s['post-body']}>
          <EditorContent editor={editor} />
        </div>
      </section>

      <div className={s['post-create__actions']}>
        <button
          className={s['post-create__cancel-btn']}
          onClick={handleCancel}
        >
          취소
        </button>
        <button
          className={s['post-create__save-btn']}
          onClick={handleSave}
        >
          포스트 작성
        </button>
      </div>
    </main>
  );
}
