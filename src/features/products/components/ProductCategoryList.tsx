import ProductCategoryCard from './ProductCategoryCard';
import styles from './styles/ProductCategoryList.module.css';
import { useSearchParams } from 'react-router-dom';

import bookStandImg from '../../../assets/book_stand.png';
import bookCoverImg from '../../../assets/book_cover.png';
import bookMarkImg from '../../../assets/book_mark.png';
import bookStorageImg from '../../../assets/book_storage.png';      
import magnifierImg from '../../../assets/magnifier.png';
import footRestImg from '../../../assets/foot_rest.png';
import bookPerfumeImg from '../../../assets/book_perfume.png';
import bookLightImg from '../../../assets/book_light.png';
import paperWeightImg from '../../../assets/paper_weight.png';
import readingNoteImg from '../../../assets/reading_note.png';  
// 이미지는 임시 이미지입니다.

export default function ProductCategoryList() {
  const [, setSp] = useSearchParams();

  function handleCategoryClick(code: string) {
    const next = new URLSearchParams();
    next.set('category', code);
    next.set('page', '1');
    setSp(next);
  }

  return (
    <section className={styles['product-category-list']}>
      <div className={styles['product-category-wrapper']}>
        <div className={styles['product-category-row']}>
          <ProductCategoryCard
            label="독서대"
            imageSrc={bookStandImg}
            onClick={() => handleCategoryClick('book_stand')}
          />
          <ProductCategoryCard
            label="북커버"
            imageSrc={bookCoverImg} 
            onClick={() => handleCategoryClick('book_cover')}
          />
          <ProductCategoryCard
            label="북마크"
            imageSrc={bookMarkImg} 
            onClick={() => handleCategoryClick('book_mark')}
          />
          <ProductCategoryCard
            label="책수납"
            imageSrc={bookStorageImg} 
            onClick={() => handleCategoryClick('book_storage')}
          />
          <ProductCategoryCard
            label="돋보기"
            imageSrc={magnifierImg} 
            onClick={() => handleCategoryClick('magnifier')}
          />
        </div>
        <div className={styles['product-category-row']}>   
          <ProductCategoryCard
            label="발받침대"
            imageSrc={footRestImg}
            onClick={() => handleCategoryClick('foot_rest')}
          />
          <ProductCategoryCard
            label="북퍼퓸"
            imageSrc={bookPerfumeImg} 
            onClick={() => handleCategoryClick('book_perfume')}
          />
          <ProductCategoryCard
            label="북라이트"
            imageSrc={bookLightImg} 
            onClick={() => handleCategoryClick('book_light')}
          />
          <ProductCategoryCard
            label="문진"
            imageSrc={paperWeightImg}
            onClick={() => handleCategoryClick('paper_weight')}
          />
          <ProductCategoryCard
            label="독서노트"
            imageSrc={readingNoteImg}
            onClick={() => handleCategoryClick('reading_note')}
          />
        </div>
      </div>
    </section>
  )
}
