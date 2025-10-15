import { useNavigate } from "react-router-dom";
import { PATHS } from "../routes/paths";
import Footer from "../components/layout/Footer";
import styles from './IntroPage.module.css';

import logoUrl from '../assets/header_logo.png';
import IntroIconBook from "../assets/intro_icon_book.png";
import IntroIconHome from "../assets/intro_icon_home.png";
import IntroIconbox from "../assets/intro_icon_box.png";
import IntroBook from "../assets/intro_page_book.png";
import IntroCard1 from "../assets/intro_card_book.png";
import IntroCard2 from "../assets/intro_card_cap.png";
import IntroCard3 from "../assets/intro_card_tree.png";
import IntroCard4 from "../assets/intro_card_moon.png";
import Introshadow from "../assets/intro_page_shadow.png";
import IntroStep1 from "../assets/intro_page_step1.png";
import IntroStep2 from "../assets/intro_page_step2.png";
import IntroStep3 from "../assets/intro_page_step3.png";
import IntroFinal from "../assets/intro_final_book.png";

export default function IntroPage() {
  
  const nav = useNavigate();

  return (
    <div className={styles["intro-page"]}>
      <header className={styles['header-layout']}>
        <div className={styles['header-title']}>
          <img 
            className={styles['header-title-logo']}
            src={logoUrl} />
        </div>
        <button 
          className={styles['header-button']}
          onClick={() => nav(PATHS.login)}>
            시작하기
        </button>
      </header>
      <main className={styles["intro-main"]}>
        <section className={styles["intro-section"]}>
          <h1 className={styles["intro-title"]}>
            어느날, <br />
            현관 앞에 <br />
            서재가 생겼다
          </h1>
        </section>
        <section className={styles["story-section"]}>
          <h2 className={styles["story-title"]}>
            오늘, 어떤 이야기가 <br />
            문 앞에 도착하길 바라세요?
          </h2>
        </section>
        <section className={styles["service-section"]}>
          <div className={styles["service-card"]}>
            <img
              className={styles["service-icon"]}
              src={IntroIconBook}
              alt="책 대여하기 아이콘" />
            <h3 className={styles["service-title"]}>책 대여하기</h3>
            <p className={styles["service-description"]}>
              사고 싶은 책이 아니여도 괜찮아요. <br />
              한번 읽어보고 싶은 책, 가볍게 대여하세요.
            </p>
          </div>

          <div className={styles["service-card"]}>
            <img
              className={styles["service-icon"]}
              src={IntroIconHome}
              alt="문 앞까지 배송 아이콘" />
            <h3 className={styles["service-title"]}>문 앞까지 배송</h3>
            <p className={styles["service-description"]}>
              당신이 있는 곳까지 책이 찾아갑니다. <br />
              출근길, 퇴근길, 집 앞에서 바로 받아보세요.
            </p>
          </div>

          <div className={styles["service-card"]}>
            <img 
              className={styles["service-icon"]}
              src={IntroIconbox}
              alt="편하게 반납 아이콘" />
            <h3 className={styles["service-title"]}>편하게 반납</h3>
            <p className={styles["service-description"]}>
              읽고 난 책은 문 앞에 두기만 하세요. <br />
              저희가 가져갈게요.
            </p>
          </div>
        </section>
        <section className={styles["about-section"]}>
          <div className={styles["about-wrapper"]}>
            <div className={styles["about-content"]}>
            <h4 className={styles["about-title"]}>
              문앞의 책방은 <br />
              이야기를 배달하는 <br />
              곳입니다
            </h4>
            <p className={styles["about-description"]}>
              문앞의 책방은 책을 사랑하는 사람들이 <br />
              더 자주, 더 가깝게 책을 만날 수 있도록 <br />
              문 앞까지 이야기를 배달합니다.
            </p>
            </div>
            <img 
              className={styles["about-image"]}
              src={IntroBook} 
              alt="책방 소개 이미지" />
          </div>
        </section>
        <section className={styles["cards-section"]}>
          <div className={styles["cards-item"]}>
            <div className={styles["card-label"]}>
              <div className={styles["card-image-layer"]}>
                <img
                  className={styles["card-image"]}
                  src={IntroCard1}
                  alt="작은 여행 이미지" />
              </div>
              <div className={styles["card-title-layer"]}>
                <span className={styles["card-title"]}>작은 여행</span>
              </div>
            </div>
            <div className={styles["card-label"]}>
              <div className={styles["card-image-layer"]}>
                <img
                  className={styles["card-image"]}
                  src={IntroCard2}
                  alt="작은 여행 이미지" />
              </div>
              <div className={styles["card-title-layer"]}>
                <span className={styles["card-title"]}>휴식의 온기</span>
              </div>
            </div>
            <div className={styles["card-label"]}>
              <div className={styles["card-image-layer"]}>
                <img
                  className={styles["card-image"]}
                  src={IntroCard3}
                  alt="작은 여행 이미지" />
              </div>
              <div className={styles["card-title-layer"]}>
                <span className={styles["card-title"]}>계절의 향기</span>
              </div>
            </div>
            <div className={styles["card-label"]}>
              <div className={styles["card-image-layer"]}>
                <img
                  className={styles["card-image"]}
                  src={IntroCard4}
                  alt="작은 여행 이미지" />
              </div>
              <div className={styles["card-title-layer"]}>
                <span className={styles["card-title"]}>순간의 기억</span>
              </div>
            </div>
          </div>
        </section>
        <section className={styles["mbti-section"]}>
          <img
            className={styles["shadow-image"]} 
            src={Introshadow} 
            alt="MBTI 도서 큐레이션 이미지" />
          <div className={styles["mbti-content"]}>
            <h4 className={styles["mbti-title"]}>MBTI 맞춤 도서 큐레이션</h4>
            <p className={styles["mbti-description"]}>
              사람마다 마음을 울리는 문장의 다르듯, <br />
              책도 성격에 따라 다르게 다가옵니다.
            </p>
            <p className={styles["mbti-description"]}> 
              문앞의 책방은 <strong>MBTI 성향에 맞춘 도서 큐레이션</strong>으로 <br />
              지금 당신에게 가장 잘 어울리는 책을 찾아드립니다.
            </p>
            <p className={styles["mbti-description"]}>
              읽는 순간, '나를 위한 책이구나' 싶은 경험. <br />
              직접 느껴보세요.
            </p>
          </div>
        </section>
        <section className={styles["step-section"]}>
          <div className={styles["step-item"]}>
            <img
              className={styles["step-image"]}
              src={IntroStep1} 
              alt="책 대여하기 단계 이미지" />
            <div className={styles["step-content"]}>
              <span className={styles["step-label"]}>STEP 1</span>
              <h4 className={styles["step-title"]}>대여하기</h4>
              <p className={styles["step-description"]}>
                당신의 마음에 닿을 한 권을 <br />
                골라주세요
              </p>
            </div>
          </div>
          <div className={styles["step-item"]}>
            <img
              className={styles["step-image"]}
              src={IntroStep2} 
              alt="문 앞으로 배송 단계" />
            <div className={styles["step-content"]}>
              <span className={styles["step-label"]}>STEP 2</span>
              <h4 className={styles["step-title"]}>문 앞으로 배송</h4>
              <p className={styles["step-description"]}>
                설렘 가득 담긴 책이 당신의 <br/>
                하루에 도착합니다
              </p>
            </div>
          </div>
          <div className={styles["step-item"]}>
            <img 
              className={styles["step-image"]}
              src={IntroStep3}
              alt="반납하기 단계" />
            <div className={styles["step-content"]}>
              <span className={styles["step-label"]}>STEP 3</span>
              <h4 className={styles["step-title"]}>반납하기</h4>
              <p className={styles["step-description"]}>
                아름다운 이야기를 <br />
                다른 사람에게 <br />
                조심스레 건네주세요
              </p>
            </div>
          </div>
        </section>
        <section className={styles["message-section"]}>
          <div className={styles["message-content"]}>
            <h4 className={styles["message-title"]}>
              "당신의 하루에 조용히 스며드는, 문앞의 한 권."
            </h4>
            <p className={styles["message-description"]}>
              세상은 점점 더 빠르게 움직입니다. 바쁜 일상 속에서 책 한 권 펼칠 여유조차 가지기 힘든 날이 많아졌습니다. <br />
              <br />
              하지만 우리는 믿습니다. <br />
              책 한권이 마음을 다독이고, 삶의 방향을 바꾸며, 아주 작은 위로가 될 수 있다는 것을. <br />
              <br />
              그래서 우리는 '문앞의 책방'을 시작했습니다. <br />
              <br />
              문밖을 나서기도 전에, 누군가 내 마음을 알아채고 조용히 책을 놓고 간 듯한 느낌. <br />
              익숙한 현관문 앞에서 발견한 따뜻한 추천과 섬세한 큐레이션, 그것이 우리의 시작이자 철학입니다. <br />
              <br />
              "문앞의 책방"은 당신의 취향과 감정, 시기와 상황에 맞는 책을 정성껏 골라 문앞까지 배달합니다. <br />
              직접 발로 찾아가던 동네책방의 감성과, 집 앞에서 느끼는 아늑함을 담아. <br />
              <br />
              지친 하루 끝, <br />
              따뜻한 차 한잔과 함께 펼칠 수 있도록 <br />
              당신만을 위한 책 한 권을 문앞에 조용히 놓아두겠습니다.
            </p>
          </div>
          <img 
            className={styles["message-image"]}
            src={IntroFinal}
            alt="마지막 책 이미지" />
        </section>
      </main>
      <Footer />
    </div>
  );
}
