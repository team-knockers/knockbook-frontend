import { useNavigate } from "react-router-dom";

import styles from '../styles/IntroHeader.module.css';

export default function IntroHeader() {

  const nav = useNavigate();

  return (
    <header className={styles['header-layout']}>
      <div className={styles['header-title']}>문앞의책방</div>
      <button className={styles['header-button']}
              onClick={() => nav("/login")}>시작하기</button>
    </header>
  );
}
