export type HeaderKind = "main" | "backTitleClose";

export type HeaderMeta = {
  kind: HeaderKind;
  title: string;
};

export type MobileHeaderProps =
  | (HeaderMeta & {
      kind: "main";
      onBell(): void;
      onCart(): void;
      onProfile?(): void;
    })
  | (HeaderMeta & {
      kind: "backTitleClose";
      onBack(): void;
      onClose(): void;
    });

export type ClosePolicy =
  | { type: "back"; steps?: number }
  | { type: "push"; to: string }
  | { type: "replace"; to: string };

export type HeaderHandle = {
  kind: 'main' | 'backTitleClose';
  title?: string;
  close?: ClosePolicy;
};
