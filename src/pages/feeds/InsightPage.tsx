import { Outlet, useRouteLoaderData } from 'react-router-dom';
import { PATHS } from '../../routes/paths';
import TwoLevelTabMenu from '../../components/navigation/TwoLevelTabMenu';
import s from './InsightPage.module.css';
import InsightStatPage from './InsightStatPage';
import InsightHistoryPage from './InsightHistoryPage';
import type { InsightLoaderData } from './InsightPage.loader';

export default function InsightPage() {

  const data = useRouteLoaderData("insight") as InsightLoaderData;
  const profile = data?.profile ?? [];
  const mainCategory = profile.favoriteBookCategories?.[0] ?? "미등록";

  const UserProfile = (
    <div className={s['user-data']}>
      <div className={s['user-data-left']}>
        <p className={s['user-name']}>{profile.displayName}</p>
        <p className={s['user-description']}>{profile.bio}</p>
        <div className={s['user-data-box']}>
          <p className={s['user-mbti']}>
            <span>MBTI</span>
            {profile.mbti ?? "미등록"}
          </p>
          <p className={s['user-preferred-genre']}>
            <span>선호장르</span>
            {mainCategory}
          </p>
        </div>
      </div>
      <div className={s['user-data-right']}>
        <img
          src={profile.avatarUrl}
          alt={`${profile.displayName}님의 프로필`}
        />
      </div>
    </div>
  );

  return (
    <main className={s['page-layout']}>
      <div className={s['max-width-container']}>
        <div className={s['user-date-layout']}>
          {UserProfile}
        </div>
        <TwoLevelTabMenu
          leftTabTitle="통계"
          leftTabPath={PATHS.insightStat}
          rightTabTitle="히스토리"
          rightTabPath={PATHS.insightHistory}/>
        <Outlet />
      </div>

      {/* min-width: 1024px */}
      <div className={s['min-width-container']}>
        <div className={s['insight-left']}>
          <InsightStatPage />
        </div>
        <div className={s['insight-right']}>
          {UserProfile}
          <InsightHistoryPage />
        </div>
      </div>
    </main>
  );
}
