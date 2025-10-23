import { useNavigate, useRouteLoaderData } from 'react-router-dom';
import { PATHS } from '../../routes/paths';

import OneWayButton from '../../components/forms/OneWayButton';
import backgroundUrl from '../../assets/intro-background.jpg';

import s from './styles/SignupMbtiResultPage.module.css';
import type { SignupMbtiResultPageLoaderData } from './SignupMbtiResultPage.loader';

const unknownMbti = {
    description: 'MBTI 정보가 존재하지 않습니다.',
    name: '미등록',
    thumbnailUrl: 'https://www.16personalities.com/static/images/personality-types/avatars/default-avatar.svg',
    recommendedBooksImgUrl: [],
  };

export default function SignupMbtiResultPage() {

  const nav = useNavigate();
  const data = useRouteLoaderData("mbtiResult") as SignupMbtiResultPageLoaderData;
  const displayName = data?.displayName ?? "미확인 유저";
  const mbtiInfo = data?.mbtiInfo ?? unknownMbti;

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
          <p className={s['user-display-name']}>
            <strong>{displayName}</strong> 님은
          </p>
          <p className={s['user-mbti-introduction']}>
            {mbtiInfo.description} <strong>{mbtiInfo.name}</strong>이시군요!
          </p>
        </div>

        <img 
          className={s['mbti-thumbnail']}
          src={mbtiInfo.thumbnailUrl} 
          alt={`${mbtiInfo.name} thumbnail`}/>

        <div className={s['mbti-display']}>
          {mbtiInfo.typeName.split('').map((char, index) => (
            <span
              className={s['mbti-letter']}
              key={index}>
              {char}
            </span>
          ))}
        </div>

        <div className={s['recommendation-section']}>
          <p className={s['recommendation-text']}>
            {displayName}님을 위한 <br />
            맞춤형 책을 추천해 드릴게요
          </p>
          <div className={s['book-list']}>
            {mbtiInfo.recommendedBooksImgUrl.map((url, idx) => (
              <img 
                className={s['book-image']}
                key={idx} 
                src={url} 
                alt={`추천 도서 ${idx + 1}`}/>
            ))}
          </div>
        </div>

        <div className={s['button-section']}>
          <OneWayButton
            content="다음"
            responsiveType="fluid"
            widthSizeType="lg"
            heightSizeType="lg"
            colorType="light"
            onClick={() => nav(PATHS.signupComplete)}
          />
        </div>
      </div>  
    </main>
  );
}
