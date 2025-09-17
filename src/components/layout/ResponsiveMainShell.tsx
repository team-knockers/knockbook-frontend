import { Outlet, useMatches, useNavigate } from "react-router-dom";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import { DESKTOP_MEDIA_QUERY } from "../../shared/breakpoints";

import MobileHeader from "./MobileHeader";
import DesktopHeader from "./DesktopHeader";
import MobileNavigationBar from "../navigation/MobileNavigationBar";
import DesktopNavigationBar from "../navigation/DesktopNavigationBar";

import type { HeaderMeta, MobileHeaderProps } from "../../types/header";
import styles from './styles/ResponsiveShell.module.css';
import { PATHS } from "../../routes/paths";

export default function ResponsiveMainShell() {
  const nav = useNavigate();
  const isDesktop = useMediaQuery(DESKTOP_MEDIA_QUERY);
  const matches = useMatches();
  const meta = (matches.at(-1) as { handle?: { header?: HeaderMeta } })
    ?.handle?.header;

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
        onClose: () => window.history.back(),
      };
    }
  }

  return (
    <div className={styles['app-shell']}>
      {isDesktop ? (
        <DesktopHeader>
          <DesktopNavigationBar />
        </DesktopHeader>
      ) : (
        headerProps && <MobileHeader {...headerProps} />
      )}
      <main className={styles['app-main']}><Outlet /></main>
      {!isDesktop && <MobileNavigationBar />}
    </div>
  );
}
