import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {

    if (typeof window === 'undefined' || typeof document === 'undefined') return;

    const skipScroll = sessionStorage.getItem('skipScroll') === 'true';
    sessionStorage.removeItem('skipScroll');

    if (!skipScroll) {
      const html = document.documentElement as HTMLElement;
      const prevScrollBehavior = html.style.scrollBehavior;

      try {
        html.style.scrollBehavior = 'auto';

        try {
          window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
        } catch (e) {
          window.scrollTo(0, 0);
        }

        // Extra fallback for older browsers / edge-cases
        document.body.scrollTop = 0; // For Safari
        document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE

      } finally {
        setTimeout(() => {
          html.style.scrollBehavior = prevScrollBehavior;
        }, 0);
      }
    }
  }, [pathname]);

  return null;
}
