import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PATHS } from '../../routes/paths';

import OneWayButton from '../../components/forms/OneWayButton';
import backgroundUrl from '../../assets/intro-background.jpg';

import s from './styles/SignupSetFavoriteCategoryPage.module.css';

export default function SignupSetFavoriteCategoryPage() {
  const nav = useNavigate();

  const genres = [
    { name: '소설', imgUrl: 'https://contents.kyobobook.co.kr/sih/fit-in/400x0/pdt/9788936439743.jpg' },
    { name: '시/\n에세이', imgUrl: 'https://contents.kyobobook.co.kr/sih/fit-in/400x0/pdt/9791191114768.jpg' },
    { name: '인문', imgUrl: 'https://contents.kyobobook.co.kr/sih/fit-in/400x0/pdt/9791198754080.jpg' },
    { name: '가정/\n육아', imgUrl: 'https://contents.kyobobook.co.kr/sih/fit-in/400x0/pdt/9788934986652.jpg' },
    { name: '요리', imgUrl: 'https://contents.kyobobook.co.kr/sih/fit-in/400x0/pdt/9791192512761.jpg' },
    { name: '건강', imgUrl: 'https://contents.kyobobook.co.kr/sih/fit-in/400x0/pdt/9791198553317.jpg' },
    { name: '경제/\n경영', imgUrl: 'https://contents.kyobobook.co.kr/sih/fit-in/400x0/pdt/9791191056372.jpg' },
    { name: '자기계발', imgUrl: 'https://contents.kyobobook.co.kr/sih/fit-in/400x0/pdt/9788965404149.jpg' },
    { name: '외국어', imgUrl: 'https://contents.kyobobook.co.kr/sih/fit-in/400x0/pdt/9788954793704.jpg' },
  ];

  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);

  const toggleGenre = (genreName: string) => {
    setSelectedGenre(prev => (prev === genreName ? null : genreName));
  };

  const isGenreSelected = selectedGenre !== null;

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
            <p className={s['subtitle']}>거의 다왔어요!</p>
          <h2 className={s['title']}>선호하는 장르를 선택해주세요</h2>
          <p className={s['description']}>맞춤형 책 추천에 사용돼요</p>
        </div>

        <div className={s['genre-grid']}>
          {genres.map((genre, i) => {
            const isSelected = selectedGenre === genre.name;
            return (
              <div
                className={`${s['genre-card']} ${isSelected ? s['selected'] : ''}`}
                key={i}
                style={{ backgroundImage: `url(${genre.imgUrl})` }}
                onClick={() => toggleGenre(genre.name)}
              >
                <span className={s['genre-name']}>{genre.name}</span>
              </div>
            );
          })}
        </div>

        <div className={s['button-section']}>
          <button 
            className={s['skip-button']}
            onClick={() => nav(PATHS.signupSelectMbti)}
          >
            건너뛰기
          </button>
          <OneWayButton
            content="다음"
            responsiveType="fluid"
            widthSizeType="lg"
            heightSizeType="lg"
            colorType="light"
            onClick={() => {nav(PATHS.signupSelectMbti)}}
            disabled={!isGenreSelected}
          />
        </div>
      </div>
    </main>
  );
}
