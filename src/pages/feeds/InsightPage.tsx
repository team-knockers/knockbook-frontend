import { Outlet } from 'react-router-dom';
import { PATHS } from '../../routes/paths';
import TwoLevelTabMenu from '../../components/navigation/TwoLevelTabMenu';
import s from './InsightPage.module.css';
import { IoAddCircleOutline } from "react-icons/io5";
import FeedProfile from '../../assets/feed_profile.jpg';
import InsightStatPage from './InsightStatPage';
import InsightHistoryPage from './InsightHistoryPage';

export default function InsightPage() {

  // dummy data
  const userData = {
    profileImageUrl: FeedProfile,
    username: "유저 아이디",
    description: "책 친구 만들고 싶어요 같이 소통해요",
    userMbti: "ISFP",
    preferredGenre: ""
  };

  const UserProfile = (
    <div className={s['user-date']}>
      <div className={s['user-date-left']}>
        <p className={s['user-name']}>{userData.username}</p>
        <p className={s['user-description']}>{userData.description}</p>
        <div className={s['user-date-box']}>
          <p className={s['user-mbti']}>
            <span>MBTI</span>
            {userData.userMbti ? userData.userMbti : <IoAddCircleOutline />}
          </p>
          <p className={s['user-preferred-genre']}>
            <span>선호장르</span>
            {userData.preferredGenre ? userData.preferredGenre : <IoAddCircleOutline />}
          </p>
        </div>
      </div>
      <div className={s['user-date-right']}>
        <img
          src={userData.profileImageUrl}
          alt={`${userData.username}님의 프로필`}
        />
      </div>
    </div>
  );

  return (
    <main className={s['page-layout']}>
      <div className={s['max-width-container']}>
        {UserProfile}
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
