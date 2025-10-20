import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
// @ts-ignore
import "swiper/css";
// @ts-ignore
import "swiper/css/navigation";
import styles from "./styles/FeedSlider.module.css";
import type { FeedPost } from "../types";

type Props = {
  title: string;
  subtitle?: string;
  items: FeedPost[];
  onClickItem?: (postId: string) => void;
  className?: string;
};

export default function FeedSlider({ title, subtitle, items, onClickItem, className }: Props) {
  return (
    <section className={`${styles["slider-section"]} ${className ?? ""}`}>
      <header className={styles["section-head"]}>
        <div>
          <h2 className={styles["title"]}>{title}</h2>
          {subtitle ? <p className={styles["subtitle"]}>{subtitle}</p> : null}
        </div>
      </header>

      <Swiper
        className={styles["swiper"]}
        modules={[Navigation]}
        navigation
        spaceBetween={16}
        // slidesPerView={4}
        breakpoints={{
          0: { slidesPerView: 2.2, spaceBetween: 12 },
          520: { slidesPerView: 2.8 },
          768: { slidesPerView: 3.2 },
          1024: { slidesPerView: 4 },
        }}
      >
        {items.map((it) => (
          <SwiperSlide key={it.postId}>
            <button
              className={styles["card"]}
              type="button"
              onClick={() => onClickItem?.(it.postId)}
            >
              <img className={styles["thumb"]} src={it.images[0]} alt="" />
              <div className={styles["overlay"]}>
                <div className={styles["author"]}>
                  <img
                    className={styles["avatar"]}
                    src={it.avatarUrl ?? ""}
                    onError={(e) => (e.currentTarget.style.visibility = "hidden")}
                    alt=""
                  />
                  <span className={styles["name"]}>{it.displayName}</span>
                </div>
              </div>
            </button>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
