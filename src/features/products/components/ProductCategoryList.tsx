import ProductCategoryCard from './ProductCategoryCard';
import styles from './styles/ProductCategoryList.module.css';   
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

  function handleCategoryClick(label: string) {
    // 클릭된 카테고리 label을 받아서
    // backend API 요청을 보내는 로직 작성 예정 
    console.log(label);
  }

  return (
    <section className={styles['product-category-list']}>
      <div className={styles['product-category-wrapper']}>
        <div className={styles['product-category-row']}>
          <ProductCategoryCard
            label="독서대"
            imageSrc={bookStandImg}
            onClick={() => handleCategoryClick('bookStand')}
          />
          <ProductCategoryCard
            label="북커버"
            imageSrc={bookCoverImg} 
            onClick={() => handleCategoryClick('bookCover')}
          />
          <ProductCategoryCard
            label="북마크"
            imageSrc={bookMarkImg} 
            onClick={() => handleCategoryClick('bookMark')}
          />
          <ProductCategoryCard
            label="책수납"
            imageSrc={bookStorageImg} 
            onClick={() => handleCategoryClick('bookStorage')}
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
            onClick={() => handleCategoryClick('footRest')}
          />
          <ProductCategoryCard
            label="북퍼퓸"
            imageSrc={bookPerfumeImg} 
            onClick={() => handleCategoryClick('bookPerfume')}
          />
          <ProductCategoryCard
            label="북라이트"
            imageSrc={bookLightImg} 
            onClick={() => handleCategoryClick('bookLight')}
          />
          <ProductCategoryCard
            label="문진"
            imageSrc={paperWeightImg}
            onClick={() => handleCategoryClick('paperWeight')}
          />
          <ProductCategoryCard
            label="독서노트"
            imageSrc={readingNoteImg}
            onClick={() => handleCategoryClick('readingNote')}
          />
        </div>
      </div>
    </section>
  )
}