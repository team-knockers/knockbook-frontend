import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    const skipScroll = sessionStorage.getItem('skipScroll') === 'true';
    sessionStorage.removeItem('skipScroll'); // 한 번만 적용

    if (!skipScroll) {
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  return null;
}
