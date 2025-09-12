export type HeaderKind = "main" | "backTitleClose";

export type HeaderMeta = {
  kind: HeaderKind;
  title: string;
};

// 최종 props 타입 (콜백 포함)
export type MobileHeaderProps =
  | (HeaderMeta & {
      kind: "main";
      onBell(): void;
      onCart(): void;
      onProfile?(): void; // 옵션으로 통일
    })
  | (HeaderMeta & {
      kind: "backTitleClose";
      onBack(): void;
      onClose(): void;
    });
