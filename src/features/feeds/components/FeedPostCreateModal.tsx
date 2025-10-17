import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./styles/FeedPostCreateModal.module.css";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import defaultAvatarUrl from "../../../assets/feed_profile.jpg";

const NUM_MAX_LETTER_COUNT = 500;

/** Clamp string by visible characters (graphemes). Works well with emoji & Korean IME. */
function clampByGraphemes(input: string, limit: number) 
: { text: string; count: number } {
  try {
    // Prefer grapheme segmentation for accurate counting
    // @ts-ignore
    const Seg = (Intl as any).Segmenter;
    if (Seg) {
      const seg = new Seg("ko", { granularity: "grapheme" });
      let acc = "";
      let cnt = 0;
      for (const { segment } of seg.segment(input)) {
        if (cnt >= limit) { break; }
        acc += segment;
        cnt++;
      }
      // Count actual graphemes (could exceed limit)
      let total = 0;
      for (const _ of seg.segment(input)) { total++; }
      return { text: acc, count: Math.min(total, limit) };
    }
  } catch {
    // ignore and fall back
  }
  // Fallback by code points
  const units = Array.from(input);
  const sliced = units.slice(0, limit);
  return { text: sliced.join(""), count: Math.min(units.length, limit) };
}

type Props = {
  open: boolean;
  onClose: () => void;
  onShare: (p: { text: string; files: File[] }) => void;
  displayName: string;
  avatarUrl: string;
  maxFiles?: number;
};

export default function FeedPostCreateModal({
  open,
  onClose,
  onShare,
  displayName,
  avatarUrl,
  maxFiles = 3,
}: Props) {

  // --- stable hooks (never conditional) ---
  const [text, setText] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [slide, setSlide] = useState(0);
  const [emojiOpen, setEmojiOpen] = useState(false);
  const [isComposing, setIsComposing] = useState(false); // IME composition flag

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const emojiRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Create preview blob URLs for selected images
  const previews = useMemo(
    () => files.map((f) => ({ url: URL.createObjectURL(f), name: f.name })),
    [files]
  );

  // Revoke blob URLs on cleanup
  useEffect(() => {
    return () => previews.forEach((p) => URL.revokeObjectURL(p.url));
  }, [previews]);

  // Close emoji picker on outside click
  useEffect(() => {
    const closeEmoji = (e: MouseEvent) => {
      if (
        emojiRef.current &&
        !emojiRef.current.contains(e.target as Node) &&
        !(e.target as HTMLElement).closest(`.${styles.emojiBtn}`)
      ) {
        setEmojiOpen(false);
      }
    };
    if (emojiOpen) {
      document.addEventListener("mousedown", closeEmoji);
    }
    return () => document.removeEventListener("mousedown", closeEmoji);
  }, [emojiOpen]);

  // Reset data when modal closes
  useEffect(() => {
    if (!open) {
      setText("");
      setFiles([]);
      setSlide(0);
      setEmojiOpen(false);
      setIsComposing(false);
    }
  }, [open]);

  // --- early return AFTER hooks ---
  if (!open) { return null; }

  // Overlay click closes modal
  const onOverlayClick: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Open file dialog
  const pick = () => {
    inputRef.current?.click();
  };

  // Handle file selection / drop
  const onPicked = (fl: FileList | null) => {
    if (!fl) { return; }
    const imgs = Array.from(fl).filter((f) => f.type.startsWith("image/"));
    const merged = [...files, ...imgs].slice(0, maxFiles);
    setFiles(merged);
    setSlide((s) => Math.min(s, Math.max(0, merged.length - 1)));
    // Allow re-selecting the same file set
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  // Share action (returns clamped text)
  const share = () => {
    const { text: safe } = clampByGraphemes(text.trim(), NUM_MAX_LETTER_COUNT);
    onShare({ text: safe, files });
  };

  // Insert emoji at current caret and clamp to limit
  const insertEmoji = (emoji: string) => {
    const el = textareaRef.current;
    if (!el) { return; }
    const start = el.selectionStart ?? el.value.length;
    const end = el.selectionEnd ?? el.value.length;
    const next = el.value.slice(0, start) + emoji + el.value.slice(end);
    const clamped = clampByGraphemes(next, NUM_MAX_LETTER_COUNT).text;
    setText(clamped);
    // Restore caret as best-effort (move to end of inserted emoji or end if clamped)
    requestAnimationFrame(() => {
      el.focus();
      const pos = Math.min(start + Array.from(emoji).length, clamped.length);
      el.setSelectionRange(pos, pos);
    });
  };

  // Text handling with IME-friendly clamping
  const handleTextChange: React.ChangeEventHandler<HTMLTextAreaElement> = (e) => {
    const value = e.target.value ?? "";
    if (isComposing) {
      setText(value);
    } else {
      setText(clampByGraphemes(value, NUM_MAX_LETTER_COUNT).text);
    }
  };
  const handleCompositionStart = () => { setIsComposing(true); };
  const handleCompositionEnd: React.CompositionEventHandler<HTMLTextAreaElement> = (e) => {
    setIsComposing(false);
    const value = e.currentTarget.value ?? "";
    setText(clampByGraphemes(value, NUM_MAX_LETTER_COUNT).text);
  };

  const graphemeCount = clampByGraphemes(text, NUM_MAX_LETTER_COUNT).count;

  // Safe avatar fallback
  const validatedAvatarUrl: string = (avatarUrl ?? "").trim() || defaultAvatarUrl;

  // Remove image by index and fix current slide index safely
  const removeAt = (idx: number) => {
    setFiles((prev) => {
      const next = prev.filter((_, i) => i !== idx);
      setSlide((s) => {
        if (idx < s) { return s - 1; }
        if (s >= next.length) { return Math.max(0, next.length - 1); }
        return s;
      });
      return next;
    });
  };

  return (
    <div className={styles.overlay} onClick={onOverlayClick}>
      <div className={styles.sheet}>
        {/* Mobile header */}
        <div className={styles.mHeader}>
          <h1 className={styles.mTitle}>새 포스트</h1>
          <button className={styles.iconBtn} onClick={onClose}>✕</button>
        </div>

        {/* Desktop header */}
        <div className={styles.dHeader}>
          <div className={styles.dTitle}>새 포스트</div>
        </div>

        {/* Desktop close button */}
        <button 
          className={styles.desktopClose}
          onClick={onClose}
          aria-label="close">
            ✕
        </button>

        <div className={styles.body}>
          {/* Left: uploader / preview */}
          <section className={styles.left}>
            {/* Mobile: attach header */}
            <div className={styles.mobileAttachHeader}>
              사진을 첨부해주세요&nbsp;&nbsp;&nbsp;({previews.length} / {maxFiles})
            </div>

            {/* Mobile: plus + thumbnails strip */}
            <div className={styles.mobileAddRow}>
              {previews.length < maxFiles && (
                <button 
                  type="button"
                  className={styles.plusCard}
                  onClick={pick}>
                    ＋
                </button>
              )}
              <div className={styles.mobileThumbStrip}>
                {previews.map((p, i) => (
                  <div 
                    key={p.url}
                    className={styles.mobileThumbItem}>
                    <button
                      className={styles.mobileThumbBtn}
                      onClick={() => setSlide(i)}
                      aria-label={`photo ${i + 1}`}>
                      <img src={p.url} alt={p.name} />
                    </button>
                    <button
                      type="button"
                      className={styles.removeThumb}
                      onClick={(e) => { e.stopPropagation(); removeAt(i); }}
                      aria-label="remove photo"
                      title="삭제">
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Desktop: empty drop area */}
            {previews.length === 0 && (
              <div
                className={styles.desktopDrop}
                onClick={pick}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onPicked(e.dataTransfer.files);
                }}>
                <span>사진을 끌어다 놓으세요</span>
                <button
                  className={styles.selectBtn}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    pick();
                  }}>
                  select from computer
                </button>
              </div>
            )}

            {/* Desktop: slider with blurred background */}
            {previews.length > 0 && (
              <div className={styles.desktopSlider}>
                <div className={styles.slider}>
                  {/* Blurred background of current image */}
                  <img
                    className={styles.blurBg}
                    src={previews[slide].url}
                    alt=""
                    aria-hidden="true"/>
                  {/* Foreground image (contain) */}
                  <img
                    className={styles.slideImg}
                    src={previews[slide].url}
                    alt=""/>
                  <button
                    type="button"
                    className={styles.removeOnSlider}
                    onClick={() => removeAt(slide)}
                    aria-label="remove current photo"
                    title="삭제">
                    ✕
                  </button>

                  {previews.length > 1 && (
                    <>
                      <button
                        className={`${styles.nav} ${styles.leftNav}`}
                        onClick={() =>
                          setSlide((s) => (s - 1 + previews.length) % previews.length)
                        }
                        aria-label="prev">
                        ❮
                      </button>
                      <button
                        className={`${styles.nav} ${styles.rightNav}`}
                        onClick={() =>
                          setSlide((s) => (s + 1) % previews.length)
                        }
                        aria-label="next">
                        ❯
                      </button>

                      {/* Dots pagination */}
                      <div className={styles.dots}>
                        {previews.map((_, i) => (
                          <button
                            key={i}
                            className={`${styles.dot} ${i === slide ? styles.dotActive : ""}`}
                            onClick={() => setSlide(i)}
                            aria-label={`slide ${i + 1}`}/>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Hidden input */}
            <input
              ref={inputRef}
              className={styles.file}
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => onPicked(e.target.files)}
            />
          </section>

          {/* Right: text + emoji */}
          <section className={styles.right}>
            <div className={styles.userRow}>
              <img 
                className={styles.avatar} 
                src={validatedAvatarUrl}
                alt="" />
              <span 
                className={styles.userName}>
                  {displayName}
              </span>
            </div>

            <div className={styles.textWrap}>
              <textarea
                ref={textareaRef}
                className={styles.textarea}
                placeholder="내용을 입력해주세요."
                value={text}
                onChange={handleTextChange}
                onCompositionStart={handleCompositionStart}
                onCompositionEnd={handleCompositionEnd}/>
              <div className={styles.inputFooter}>
                <div className={styles.emojiWrap}>
                  <button
                    type="button"
                    className={styles.emojiBtn}
                    onClick={() => setEmojiOpen((v) => !v)}
                    aria-label="emoji">
                    🙂
                  </button>
                  {emojiOpen && (
                    <div className={styles.emojiPopover} ref={emojiRef}>
                      <Picker
                        data={data}
                        onEmojiSelect={(e: any) => insertEmoji(e.native || "")}
                        theme="light"
                        previewPosition="none"
                        navPosition="none"x/>
                    </div>
                  )}
                </div>
                <span className={styles.counter}>
                  {graphemeCount}/{NUM_MAX_LETTER_COUNT}
                </span>
              </div>
            </div>

            {/* Mobile bottom share */}
            <button 
              className={styles.mobileShare}
              onClick={share}>
                공유하기
            </button>
          </section>
        </div>

        {/* Desktop bottom-right share */}
        <button 
          className={styles.desktopBottomShare}
          onClick={share}>
            공유하기
        </button>
      </div>
    </div>
  );
}
