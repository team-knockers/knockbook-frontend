import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { InputGroup, InputGroupText, Input, Label } from "reactstrap";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { AuthService } from "../../features/onboarding/services/AuthService";
import { ApiError } from "../../types/http";
import { PATHS } from "../../routes/paths";

import backgroundUrl from '../../assets/login_page_bg.png';
import naverUrl from '../../assets/naver_login_btn.png';
import kakaoUrl from '../../assets/kakao_login_btn.png';
import googleUrl from '../../assets/google_login_btn.png';

import styles from './LoginPage.module.css';

export default function LoginPage() {
  
  const nav = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [remember, setRemember] = useState(false);

  async function handleLogin() {
    try {
      await AuthService.localLogin({ email, password });
      console.log("Welcome");
      nav(PATHS.home);
    } catch (e) {
      if (e instanceof ApiError) {
        console.error(e.problem.title); // temporary procedure
      }
    }
  }

  return (
    <main>
      <div className={styles['page-layout']}>
        <div className={styles['page-left-section']}>
          <img
            className={styles['page-left-section-img']}
            src={backgroundUrl}
            alt="login page background image" />
        </div>
        <div className={styles['page-right-section']}>
          <div className={styles['page-title']}>
            <span>문앞의책방</span>
          </div>
          <div className={styles['local-section']}>
            <div className={styles['email-section']}>
              <Label 
                className={styles['email-label-name']}
                for="email-input">
                  이메일
              </Label>
              <Input
                className={styles['email-input']}
                id="email-input" 
                type="text"
                placeholder="이메일을 입력하세요"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
            <div className={styles['password-section']}>
              <div className={styles['password-section']}>
                <Label 
                  className={styles['password-label-name']}
                  for="password-input">
                    비밀번호
                </Label>
                <InputGroup className={styles['password-input-wrapper']}>
                  <Input 
                    className={styles['password-input']}
                    id="password-input" 
                    type={show ? "text" : "password"}
                    placeholder="비밀번호를 입력하세요"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                  />
                  <InputGroupText
                    className={styles['password-show-icon']}
                    onClick={() => setShow(prev => !prev)}>
                      {show ? <FiEyeOff /> : <FiEye />}
                  </InputGroupText>                
                </InputGroup>
              </div>
            </div>
            <div className={styles['rememberme-and-find-password-section']}>
              <div className={styles['rememberme-section']}>
                <Input
                  className={styles['rememberme-checkbox']}
                  type="checkbox"
                  id="rememberme-checkbox"
                  checked={remember}
                  onChange={e => setRemember(e.target.checked)} />
                <Label
                  className={styles['rememberme-label']} 
                  for="rememberme-checkbox">
                  로그인유지
                </Label>
              </div>
              <button 
                  className={styles['find-password-button']}
                  onClick={() => {/* TODO */}}>
                  비밀번호 찾기
              </button>
            </div>
            <button 
              className={styles['login-button']}
              onClick={handleLogin}>
              로그인
            </button>
          </div>
            <div className={styles['signup-section']}>
              <span>아직 문앞의책장 회원이 아니세요?</span>
            <button
                className={styles['signup-button']}
                onClick={() => nav(PATHS.signupVerifyEmail)}>
                회원 가입하기
              </button>
            </div>
          <div className={styles['social-section']}>
            <div className={styles['social-header']}>
              <span>소셜 계정으로 시작하기</span>
            </div>
            <div className={styles['social-buttons-wrapper']}>
              <button 
                className={styles['social-login-button']}
                onClick={() => {/* TODO */}}>
                  <img
                    className={styles['social-login-img']}
                    src={naverUrl}
                    alt="naver login button image"/>
              </button>
              <button 
                className={styles['social-login-button']}
                onClick={() => {/* TODO */}}>
                  <img
                    className={styles['social-login-img']}
                    src={kakaoUrl}
                    alt="kakao login button image"/>
              </button> 
              <button 
                className={styles['social-login-button']}
                onClick={() => {/* TODO */}}>
                  <img
                    className={styles['social-login-img']}
                    src={googleUrl}
                    alt="google login button image"/>
              </button> 
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
