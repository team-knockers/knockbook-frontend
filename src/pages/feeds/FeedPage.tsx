import { Outlet } from 'react-router-dom';
import { PATHS } from '../../routes/paths';
import Footer from '../../components/layout/Footer';

import FeedTwoLevelTabMenu from '../../features/feeds/components/FeedTwoLevelTabMenu';

import s from './FeedPage.module.css';

export default function FeedPage() {
  return (
    <main className={s['page-layout']}>
      <div className={s['max-width-container']}>
        <FeedTwoLevelTabMenu
          leftTabTitle="홈"
          leftTabPath={PATHS.feedHome}
          rightTabTitle="프로필"
          rightTabPath={PATHS.feedProfile}/>
        <Outlet />
      </div>
      <Footer />
    </main>
  );
}
