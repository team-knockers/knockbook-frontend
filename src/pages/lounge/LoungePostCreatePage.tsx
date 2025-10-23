import s from './LoungePostCreatePage.module.css';
import { useEffect, useRef, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import TurndownService from "turndown";
import EditorToolbar from '../../features/lounge/components/EditorToolbar';
import { useNavigate } from 'react-router-dom';
import { PATHS } from '../../routes/paths';
import { UserService } from '../../features/account/services/UserService';
import { LoungeService } from '../../features/lounge/services/LoungeService';

export default function LoungePostCreatePage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [displayName, setDisplayName] = useState<string>("로딩중");

  const titleRef = useRef<HTMLTextAreaElement | null>(null);
  const subtitleRef = useRef<HTMLTextAreaElement | null>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
    ],
    content: "",
});

  useEffect(() => {
    let mounted = true;
    async function loadProfile() {
      try {
        const profile = await UserService.getMyProfile();
        if (!mounted) { 
          return;
        }
        setDisplayName(profile.displayName);

      } catch (err) {
        if (!mounted) {
          return;
        }
        navigate(PATHS.login);
      }
    }
    loadProfile();
    return () => { mounted = false; };
  }, []);

  const handleSave = async () => {
    if (!editor) {
      return;
    }

    // Check Validation - title
    if (!title.trim()) {
      alert("제목을 입력해주세요.");
      titleRef.current?.focus();
      return;
    }

    // Check Validation - text
    const plainText = editor.getText().trim();
    if (!plainText) {
      alert("본문을 입력해주세요.");
      editor.chain().focus().run();
      return;
    }

    const confirmSave = window.confirm("포스트를 게시하시겠습니까?");
    if (!confirmSave) { return; }

    const html = editor.getHTML();
    const turndownService = new TurndownService({ headingStyle: 'atx' });
    const markdown = turndownService.turndown(html);

    try {
      const response = await LoungeService.registerLoungePost(
        title,
        subtitle || null,
        markdown,
        attachedFiles
      );

      // Navigate to the post detail page after creation
      navigate(PATHS.loungePost.replace(':postId', response.id));

    } catch (err) {
      console.error("Failed to create lounge post:", err);
      alert("포스트 작성 중 오류가 발생했습니다.");
    }
  };

  const handleCancel = () => {
    const confirmCancel = window.confirm("작성을 취소하시겠습니까?");
    if (!confirmCancel) { return; }

    setTitle("");
    setSubtitle("");
    setAttachedFiles([]);
    if (editor) {
      editor.commands.setContent("");
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
        <EditorToolbar
          editor={editor}
          onFileAdd={(file: File) => setAttachedFiles(prev => [...prev, file])}
        />

        <div className={s['post-body']}
          onClick={() => editor?.chain().focus().run()}
        >
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
