import styles from './styles/ProductBanner.module.css';

type BannerProps = {
  bannerImgUrl: string;
  badge: string;
  title1: string;
  title2: string;
  desc: string;
  tone: 'light' | 'dark';
};

export default function ProductBanner({
  bannerImgUrl,
  badge,
  title1,
  title2,
  desc,
  tone,
}: BannerProps) {
  return (
    <div className={`${styles['card']} phb-card`}>
      <img
        className={styles['img']}
        src={bannerImgUrl}
        alt={title1}
        loading='lazy'
      />
      <div className={`${styles['overlay']} ${tone === 'dark' ? styles['textDark'] : styles['textLight']}`}>
        <span className={styles['badge']}>{badge}</span>
        <div className={styles['title']}>
          <span className={styles['titleLine']}>{title1}</span>
          <span className={styles['titleLine']}>{title2}</span>
        </div>
        <div className={styles['desc']}>{desc}</div>
      </div>
    </div>
  );
}
