import s from './FeedProfilePage.module.css';
import OneWayButton from '../../components/forms/OneWayButton';
import { IoSunny } from "react-icons/io5";
import { IoMdArrowRoundForward } from "react-icons/io";
import { PATHS } from '../../routes/paths';
import { useNavigate } from 'react-router-dom';

import FeedProfile from '../../assets/feed_profile.jpg';
import FeedImgGreenBook from '../../assets/feed_slider_img1.png';
import FeedImgBooklight from '../../assets/feed_slider_img2.png';
import FeedImgWhiteBook from '../../assets/feed_slider_img3.png';
import FeedImgBooks from '../../assets/intro_page_step1.png';
import FeedImgBox from '../../assets/intro_page_step2.png';
import FeedImgBook from '../../assets/intro_page_step3.png';

export default function FeedProfilePage() {
  
  // dummy data
  const userData = {
      profileImageUrl: FeedProfile,
      username: "유저 아이디",
      description: "책 친구 만들고 싶어요 같이 소통해요",
      postCount: 12,
      followerCount: 350,
      followingCount: 180,
    };

  const postImage = [
    { id: '1', url: FeedImgBooklight },
    { id: '2', url: FeedImgGreenBook },
    { id: '3', url: FeedImgWhiteBook },
    { id: '4', url: FeedImgBooks },
    { id: '5', url: FeedImgBox },
    { id: '6', url: FeedImgBook },
    { id: '7', url: FeedImgBooklight },
    { id: '8', url: FeedImgGreenBook },
    { id: '9', url: FeedImgWhiteBook }
  ];
  const navigate = useNavigate();

  return (
    <div className={s['page-layout']}>
      <div className={s['feed-header']}>
        <div className={s['feed-header-left']}>
          <img 
            src={userData.profileImageUrl} 
            alt={`${userData.username}님의 프로필`} />
        </div>
        <div className={s['feed-header-right']}>
          <div className={s['user-name']}>
            <span>{userData.username}</span>
            <div className={s['user-profile-button']}>
              <OneWayButton
                content='프로필 편집'
                onClick={() => alert(`프로필 편집 버튼이 클릭되었습니다!`)}
                responsiveType='fluid'
                widthSizeType='sm'
                heightSizeType='xxs'
                colorType='dark'
              />
            </div>
          </div>

          <div className={s['user-description']}>
            <p>{userData.description}</p>
          </div>

          <div className={s['user-information']}>
            <div className={s['user-post']}>
              <span>{userData.postCount}</span>
              <p>포스트</p>
            </div>
            <div className={s['user-follower']}>
              <span>{userData.followerCount}</span>
              <p>팔로워</p>
            </div>
            <div className={s['user-following']}>
              <span>{userData.followingCount}</span>
              <p>팔로잉</p>
            </div>
          </div>
        </div>
      </div>

      <div className={s['insight']}>
        <button onClick={() => navigate(PATHS.insight)}>
          <span className={s['insight-left']}>
            <IoSunny />
            인사이트 보러가기
          </span>
          <IoMdArrowRoundForward />
        </button>
      </div>
      <div className={s['post-button']}>
        <OneWayButton
          content='+ 포스트 작성'
          onClick={() => alert(`포스트 버튼이 클릭되었습니다!`)}
          responsiveType='fluid'
          widthSizeType='sm'
          heightSizeType='xxxs'
          colorType='natural'
        />
      </div>
      <div className={s['post-imges']}>
        {postImage.map((post) => (
          <img 
            key={post.id} 
            src={post.url} 
            alt={`${post.id}포스트 이미지`} />
        ))}
      </div>
    </div>
  );
}
