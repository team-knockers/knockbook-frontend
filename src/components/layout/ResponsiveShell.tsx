import { Outlet } from "react-router-dom";
import MobileHeader from "./MobileHeader";
import DesktopHeader from "./DesktopHeader";
import MobileNavigationBar from "./../navigation/MobileNavigationBar";
import DesktopNavigationBar from "./../navigation/DesktopNavigationBar";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import { DESKTOP_MEDIA_QUERY } from "../../shared/breakpoints";

import styles from './styles/ResponsiveShell.module.css';

export default function ResponsiveShell() {
  const isDesktop = useMediaQuery(DESKTOP_MEDIA_QUERY);

  return (
    <div className={styles['app-shell']}>
      {/* Render either desktop or mobile header */}
      {isDesktop ? (
        <DesktopHeader>
          <DesktopNavigationBar />
        </DesktopHeader>
      ) : (
        <MobileHeader />
      )}

      {/* Page content (Home/Books/...) */}
      <main className={styles['app-main']}>
        <Outlet />
      </main>

      {/* Only render mobile bottom nav on mobile */}
      {!isDesktop && <MobileNavigationBar />}
    </div>
  );
}
