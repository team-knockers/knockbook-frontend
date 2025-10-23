import { useState } from 'react';
import { useNavigate, useRouteLoaderData } from 'react-router-dom';
import { PATHS } from '../../routes/paths';
import OneWayButton from '../../components/forms/OneWayButton';
import backgroundUrl from '../../assets/intro-background.jpg';
import s from './styles/SignupSetFavoriteCategoryPage.module.css';
import type { SignupSetFavoriteCategoryPageLoaderData } from './SignupSetFavoriteCategoryPage.loader';
import { UserService } from '../../features/account/services/UserService';

export default function SignupSetFavoriteCategoryPage() {
  const nav = useNavigate();

  const data = useRouteLoaderData('favoriteCategory') as SignupSetFavoriteCategoryPageLoaderData | undefined;
  const categories = data?.categories ?? [];
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const isAnyCategorySelected = selectedCategories.length > 0;

  const handleCategoryToggle = (code: string) => {
    setSelectedCategories(prev =>
      prev.includes(code) ? prev.filter(c => c !== code) : [...prev, code]
    );
  };
  
  const handleSkip = () => nav(PATHS.signupComplete);
  async function handleNext() {
    await UserService.changeFavoriteBookCategories(selectedCategories);
    nav(PATHS.signupSelectMbti);
  };

  if (categories.length === 0) {
    return (
      <main className={s['page-layout']}>
        <div className={s['page-left-section']}>
          <img 
            className={s['page-left-section-img']}
            src={backgroundUrl}
            alt="signup page background" />
        </div>
        <div className={s['page-right-section']}>
          <div className={s['text-section']}>
            <p className={s['subtitle']}>거의 다 왔어요!</p>
            <h2 className={s['title']}>선호 장르</h2>
            <p className={s['description']}>
              카테고리를 불러오지 못했어요. 건너뛰거나 다시 시도해 주세요.
            </p>
          </div>
          <div className={s['button-section']}>
            <button 
              className={s['skip-button']}
              onClick={handleSkip}>
                건너뛰기
            </button>
            <OneWayButton
              content="다시 시도"
              responsiveType="fluid"
              widthSizeType="lg"
              heightSizeType="lg"
              colorType="light"
              onClick={() => window.location.reload()}/>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className={s['page-layout']}>
      <div className={s['page-left-section']}>
        <img 
          className={s['page-left-section-img']} 
          src={backgroundUrl}
          alt="signup page background" />
      </div>

      <div className={s['page-right-section']}>
        <div className={s['text-section']}>
          <p className={s['subtitle']}>거의 다 왔어요!</p>
          <h2 className={s['title']}>선호하는 장르를 선택해 주세요</h2>
          <p className={s['description']}>맞춤형 책 추천에 사용돼요</p>
        </div>

        <div 
          className={s['category-grid']}
          role="list"
          aria-label="선호 장르 목록">
          {categories.map(c => {
            const isSelected = selectedCategories.includes(c.categoryCodeName);
            return (
              <button
                key={c.categoryCodeName}
                type="button"
                role="listitem"
                className={`${s['category-card']} ${isSelected ? s['selected'] : ''}`}
                style={{ backgroundImage: `url(${c.imgUrl})` }}
                onClick={() => handleCategoryToggle(c.categoryCodeName)}
                aria-pressed={isSelected}
                aria-label={`${c.categoryDisplayName}${isSelected ? ' 선택됨' : ''}`}>
                <span className={s['category-name']}>{c.categoryDisplayName}</span>
              </button>
            );
          })}
        </div>

        <div className={s['action-wrapper']}>
          <button 
            className={s['skip-button']}
            onClick={handleSkip}>
              건너뛰기
          </button>
          <OneWayButton
            content="다음"
            responsiveType="fluid"
            widthSizeType="lg"
            heightSizeType="lg"
            colorType="light"
            onClick={handleNext}
            disabled={!isAnyCategorySelected}/>
        </div>
      </div>
    </main>
  );
}
