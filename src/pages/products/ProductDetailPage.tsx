import styles from './styles/ProductsDetailPage.module.css';
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { HiStar } from 'react-icons/hi2';
import ThreeLevelTabMenu from '../../components/navigation/ThreeLevelTabMenu';



export default function ProductDetailPage() {
  // TODO: replace with loader-fetched images 
  const images = [
    "https://contents.kyobobook.co.kr/sih/fit-in/600x0/gift/pdt/1271/hot1750382587476.png",
    "https://contents.kyobobook.co.kr/sih/fit-in/600x0/gift/pdt/1731/hot1750382596852.png",
    "https://contents.kyobobook.co.kr/sih/fit-in/600x0/gift/pdt/1150/hot1750382616799.png",
    "https://contents.kyobobook.co.kr/sih/fit-in/600x0/gift/pdt/1251/hot1750382625565.png",
  ]

  // main image index (default : GALLERY first image)
  const [selected, setSelected] = useState(0);
  const mainSrc = images[selected] ?? ''

  // main gallery nav 
  const goPrev = () => {
    if (selected > 0){
      setSelected(selected - 1);
    }
  }
  const goNext = () => {
    if(selected < images.length - 1){
      setSelected(selected + 1);
    }
  }
  return (
    <main className={styles['detail-layout']}>
      <section className={styles['detail-top']}>
        {/* main image */}
        <div className={styles['gallery']}>
          <button 
            type="button" 
            className={styles['gallery-nav-prev']}
            onClick={goPrev}
            disabled={selected === 0}
          >
            &lt;
          </button>
          <img className={styles['gallery-image']} src={mainSrc} alt=""/>
          <button 
            type="button" 
            className={styles['gallery-nav-next']}
            onClick={goNext}
            disabled={selected === images.length - 1}
          >
            &gt;
          </button>
        </div>

        {/* right section: info + images (images are hidden on mobile) */}
        <aside className={styles['aside']}>
          <div className={styles['info']}>
            <div className={styles['core-info']}>
              <div className={styles['product-title']}>북메이트 북커버백</div>
              <div className={styles['price-info']}>
                <div className={styles['unit-price-amount']}>10000원</div>
                <div>
                  <span className={styles['discount-rate']}>10%</span>
                  <span className={styles['discount-amount']}>9000원</span>
                </div>
              </div>
              <div className={styles['shipping-info']}>배송비 4,000원(30,000원이상 무료배송)</div>
            </div>

            <div className={styles['rating-review']}>
              <HiStar className={styles['star']}/>
                <span>4.9</span>
                <span> | </span>
                <span>리뷰 </span>
                <span>273</span>
                <span>건</span>
            </div>
          </div>

          {/* images -> swap main image on click */}
          <div className={styles['galleries']}>
            {images.map((src, i) => (
              <button 
                key={i} 
                type="button" 
                onClick={ () => { setSelected(i); }}
                className={styles['thumb-button']}
              >
                <img 
                  className={`${styles['gallery-item']} ${i === selected ? styles['is-active'] : ''}`} 
                  src={src}
                  alt=""
                />
              </button>
            ))}
          </div>
        </aside>
      </section>
      
      {/* tabs (children routes) */}
      <section className={styles['detail-contents']}>
        <ThreeLevelTabMenu
          leftTabTitle="상품설명"
          centerTabTitle="리뷰"
          rightTabTitle="Q&A"
          leftTabPath="description"
          centerTabPath="reviews"
          rightTabPath="qna"
        />
        <Outlet />
      </section>
    </main>
  );
}
