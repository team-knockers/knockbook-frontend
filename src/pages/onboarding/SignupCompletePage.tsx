import { useNavigate } from 'react-router-dom';
import { PATHS } from '../../routes/paths';

import backgroundUrl from '../../assets/intro-background.jpg';
import step1 from '../../assets/intro_page_step1.png';
import step2 from '../../assets/intro_page_step2.png';
import step3 from '../../assets/intro_page_step3.png';
import OneWayButton from '../../components/forms/OneWayButton';

import s from './styles/SignupCompletePage.module.css';

export default function SignupCompletePage() {

  const nav = useNavigate();

  return (
    <main className={s['page-layout']}>
      <div className={s['page-left-section']}>
          <img
          className={s['page-left-section-img']}
          src={backgroundUrl}
          alt="signup page background image" />
      </div>

      <div className={s['page-right-section']}>
        <div className={s['text-section']}>
          <p className={s['subtitle']}>
            가입이 완료되었습니다!
          </p>
          <p className={s['title']}>
            이제부터 문앞의 책방과<br />
            감성적인 여정을 함께하세요
          </p>
        </div>

        <p className={s['intro-text']}>
            문앞의책방과 함께하는<br/>
            새로운 독서생활
        </p>
        <div className={s['images-section']}>
          <img 
            className={s['image']}
            src={step1} 
            alt="signup page image" 
          />
          <img 
            className={s['image']}
            src={step2} 
            alt="signup page image" 
          />
          <img 
            className={s['image']}
            src={step3} 
            alt="signup page image" 
          />
        </div>
        <div className={s['highlight-text']}>
            자는 시간을 쪼갤만큼<br />
            24시간이 짧은 당신을 위해,<br />
            당신의 문 앞으로 찾아갈거에요
        </div>
        <div className={s['description']}>
          독서 후 떠오르는 몽글몽글한 생각들도<br />
          마음맞는 사람들과 마음껏 나눠보세요
        </div>
        <div className={s['button-section']}>
          <OneWayButton
            content="다음"
            responsiveType="fluid"
            widthSizeType="lg"
            heightSizeType="lg"
            colorType="light"
            onClick={() => nav(PATHS.home)}
          />
        </div>
      </div>
      
    </main>
  );
}