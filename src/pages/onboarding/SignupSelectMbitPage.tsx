import { useNavigate, useRouteLoaderData } from 'react-router-dom';
import { PATHS } from '../../routes/paths';
import OneWayButton from '../../components/forms/OneWayButton';
import backgroundUrl from '../../assets/intro-background.jpg';
import s from './styles/SignupSelectMbtiPage.module.css';
import { useMbtiSelection } from '../../features/onboarding/hooks/useMbtiSelection';
import { MbtiSelector } from '../../features/onboarding/hooks/MbtiSelector';
import type { SignupSelectMbtiPageLoaderData } from './SignupSelectMbtiPage.loader';
import { UserService } from '../../features/account/services/UserService';

export default function SignupSelectMbtiPage() {
  const nav = useNavigate();
  const { mbti, toggle, isComplete, mbtiString } = useMbtiSelection();
  const data = useRouteLoaderData("selectMbti") as SignupSelectMbtiPageLoaderData;
  const displayName = data?.displayName ?? [];

  async function handleSubmitMbti() {
    const mbitUpper = mbtiString.toUpperCase();
    await UserService.changeMbti(mbitUpper);
    nav(PATHS.signupMbtiResult);
  }

  return (
    <main className={s['page-layout']}>
      <div className={s['page-left-section']}>
        <img
          className={s['page-left-section-img']}
          src={backgroundUrl}
          alt="signup page background"
        />
      </div>

      <div className={s['page-right-section']}>
        <div className={s['text-section']}>
          <p className={s['title']}>
            <strong>{displayName}</strong> 님의 MBTI를 선택해주세요
          </p>
          <p className={s['description']}>
            맞춤형 책 추천에 사용돼요
          </p>
        </div>

        <MbtiSelector 
          value={mbti}
          onToggle={toggle} />

        <div className={s['button-section']}>
          <button 
            className={s['skip-button']}
            onClick={() => nav(PATHS.signupComplete)}>
            건너뛰기
          </button>
          <OneWayButton
            content="다음"
            responsiveType="fluid"
            widthSizeType="lg"
            heightSizeType="lg"
            colorType="light"
            onClick={handleSubmitMbti}
            disabled={!isComplete}
          />
        </div>
      </div>
    </main>
  );
}
