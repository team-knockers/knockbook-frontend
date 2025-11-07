import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { ApiError } from '../../types/http';

import OneWayButton from '../../components/forms/OneWayButton';
import styles from './AccountHomePage.module.css'
import { PATHS } from '../../routes/paths';
import { useEffect, useState } from 'react';
import type { UserProfile } from '../../features/account/types';
import { ensureUser } from '../../shared/authReady';
import { AuthService } from '../../service/AuthService';

export default function AccountHomePage() {
  
  const nav = useNavigate();
  const loc = useLocation();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    (async () => {
      try {
        const me = await ensureUser();
        setUser(me);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) { return null; }
  if (!user) { return <Navigate to={PATHS.login} replace state={{ from: loc }} />; }

  if (!user) {
    return <Navigate to={PATHS.login} replace state={{ from: loc }} />;
  }

  async function handleLogout() {
    try {
      await AuthService.logout();
      nav(PATHS.login);
    } catch (e) {
      if (e instanceof ApiError) {
        console.error(e.problem.title); // temporary procedure
      }
    }
  }

  return (
    <main className={styles['page-layout']}>
      <div className={styles['wrapper']}>
        <div className={styles['profile-section']}>
          <div className={styles['profile-section-greeting']}>
            <span className={styles['profile-section-greeting-name']}>
              {user.displayName}
            </span>
            <span className={styles['profile-section-greeting-description']}>
              님 안녕하세요!
            </span>
          </div>
          <div className={styles['profile-section-details']}>
            <span>{user.email}</span>
          </div>
        </div>
        <div className={styles['bar-menu-section']}>
          <button 
            className={styles['bar-menu-item-wrapper']}
            onClick={() => nav(PATHS.purchaseHistory)}>
            <div className={styles['bar-menu-order-icon']} />
            <div className={styles['bar-menu-item-name']}>
              <span>구매 내역</span>
            </div>
            <div className={styles['bar-menu-item-value']}>
              {/* orderCount */}
            </div>
          </button>
          <button 
            className={styles['bar-menu-item-wrapper']}
            onClick={() => nav(PATHS.rentalHistory)}>
            <div className={styles['bar-menu-rental-icon']} />
            <div className={styles['bar-menu-item-name']}>
              <span>대여 내역</span>
            </div>
            <div className={styles['bar-menu-item-value']}>
              {/* rentalCount */}
            </div>
          </button>
          <button 
            className={styles['bar-menu-item-wrapper']}
            onClick={() => nav(PATHS.wishlist)}>
            <div className={styles['bar-menu-likes-icon']} />
            <div className={styles['bar-menu-item-name']}>
              <span>찜 목록</span>
            </div>
            <div className={styles['bar-menu-item-value']}>
              {/* likesCount */}
            </div>
          </button>
          <button 
            className={styles['bar-menu-item-wrapper']}
            onClick={() => nav(PATHS.pointTransactions)}>
            <div className={styles['bar-menu-point-icon']} />
            <div className={styles['bar-menu-item-name']}>
              <span>포인트</span>
            </div>
            <div className={styles['bar-menu-item-value']}>
              {/* pointAmount */}
            </div>
          </button>
          <button 
            className={styles['bar-menu-item-wrapper']}
            onClick={() => nav(PATHS.coupon)}>
            <div className={styles['bar-menu-coupon-icon']} />
            <div className={styles['bar-menu-item-name']}>
              <span>쿠폰</span>
            </div>
            <div className={styles['bar-menu-item-value']}>
              {/* couponCount */}
            </div>
          </button>
        </div>
        <button 
          className={styles['banner-section']}
          onClick={() => {/* TODO */}}>
          <span className={styles['banner-content-title']}>
            문앞의 책방 추천 상품
          </span>
          <span className={styles['banner-content-description']}>
            마음을 담은 각인 책갈피로 <br /> 독서 경험을 더욱 특별하게
          </span>
        </button>
        <div className={styles['list-menu-section']}>
          <div className={styles['list-menu-account-section']}>
            <button 
              className={styles['list-menu-item']}
              onClick={() => nav(PATHS.accountSettingsIntro)}>
              내 정보 관리
            </button>
            <button 
              className={styles['list-menu-item']}
              onClick={() => nav(PATHS.userAddress)}>
              배송지 설정
            </button>
            <button 
              className={styles['list-menu-item']}
              onClick={() => nav(PATHS.qna)}>
              1:1 문의
            </button>
          </div>
          <div className={styles['list-menu-utility-section']}>
            <button 
              className={styles['list-menu-item']}
              onClick={() => nav(PATHS.notification)}>
              공지사항
            </button>
            <button 
              className={styles['list-menu-item']}
              onClick={() => nav(PATHS.policy)}>
              이용약관
            </button>
            <button 
              className={styles['list-menu-item']}
              onClick={() => nav(PATHS.faq)}>
              고객센터
            </button>
          </div>
        </div>
        <OneWayButton 
          content='로그아웃'
          onClick={handleLogout}
          responsiveType='fluid'
          widthSizeType='xl'
          heightSizeType='xxl'
          colorType='dark'
        />
      </div>
    </main>
  );
}
