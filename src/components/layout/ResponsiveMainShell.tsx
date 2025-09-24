import { Outlet, useMatches, useNavigate } from "react-router-dom";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import { DESKTOP_MEDIA_QUERY } from "../../shared/breakpoints";
import type { GoToPolicy, HeaderMeta, MobileHeaderProps } from "../../types/header";
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

  const close = (meta as any)?.close as GoToPolicy | undefined;
  const back = (meta as any)?.back as GoToPolicy | undefined;

  function onPolicy(policy: GoToPolicy | undefined) {
    const p = policy ?? { type: "back" as const, steps: 1 };
    if (p.type === "back") {
      nav(-(p.steps ?? 1));
    }
    else if (p.type === "push") {
      nav(p.to);
    }
    else if (p.type === "replace") {
      nav(p.to, { replace: true });
    }
  };

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
        onClose: () => onPolicy(close),
        onBack: () => onPolicy(back),
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
