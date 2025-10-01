import { Outlet } from 'react-router-dom';
import { PATHS } from '../../routes/paths';

import TwoLevelTabMenu from '../../components/navigation/TwoLevelTabMenu';

import s from './FeedPage.module.css';

export default function FeedPage() {
  return (
    <main className={s['page-layout']}>
      <div className={s['max-width-container']}>
        <TwoLevelTabMenu
          leftTabTitle="홈"
          leftTabPath={PATHS.feedHome}
          rightTabTitle="프로필"
          rightTabPath={PATHS.feedProfile}/>
        <Outlet />
      </div>
    </main>
  );
}
