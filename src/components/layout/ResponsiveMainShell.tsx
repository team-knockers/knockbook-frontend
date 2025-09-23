import { Outlet, useMatches, useNavigate } from "react-router-dom";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import { DESKTOP_MEDIA_QUERY } from "../../shared/breakpoints";
import type { ClosePolicy, HeaderMeta, MobileHeaderProps } from "../../types/header";
import { PATHS } from "../../routes/paths";

import MobileHeader from "./MobileHeader";
import DesktopHeader from "./DesktopHeader";
import MobileNavigationBar from "../navigation/MobileNavigationBar";
import DesktopNavigationBar from "../navigation/DesktopNavigationBar";

export default function ResponsiveMainShell() {
  const nav = useNavigate();
  const isDesktop = useMediaQuery(DESKTOP_MEDIA_QUERY);
  const matches = useMatches();
  const meta = (matches.at(-1) as { handle?: { header?: HeaderMeta } })
    ?.handle?.header;

  const close = (meta as any)?.close as ClosePolicy | undefined;
  const onClose = () => {
    const c = close ?? { type: "back" as const, steps: 1 };
    if (c.type === "back") {
      nav(-(c.steps ?? 1));
    }
    else if (c.type === "push") {
      nav(c.to);
    }
    else if (c.type === "replace") {
      nav(c.to, { replace: true });
    }
  };;

  let headerProps: MobileHeaderProps | null = null;
  if (meta) {
    if (meta.kind === "main") {
      headerProps = {
        kind: "main",
        title: meta.title,
        onBell: () => nav(PATHS.notification),
        onCart: () => nav(PATHS.cart),
        onProfile: () => nav(PATHS.accountHome),
      };
    } else {
      headerProps = {
        kind: "backTitleClose",
        title: meta.title,
        onBack: () => window.history.back(),
        onClose,
      };
    }
  }

  return (
    <div className='main-shell'>
      {isDesktop ? (
        <DesktopHeader>
          <DesktopNavigationBar />
        </DesktopHeader>
      ) : (
        headerProps && <MobileHeader {...headerProps} />
      )}
      <div className='app-main'><Outlet /></div>
      {!isDesktop && <MobileNavigationBar />}
    </div>
  );
}
