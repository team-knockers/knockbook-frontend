import { useNavigate } from "react-router-dom";
import { PATHS } from "../routes/paths";

import styles from './IntroPage.module.css';

export default function IntroPage() {
  const nav = useNavigate();

  return (
    <div>
      <header className={styles['header-layout']}>
        <div className={styles['header-title']}>문앞의책방</div>
        <button className={styles['header-button']}
                onClick={() => nav(PATHS.login)}>시작하기</button>
      </header>
      <main>
        <div>
          <h1>Knockbook IntroPage</h1>
        </div>
      </main>
    </div>
  );
}
