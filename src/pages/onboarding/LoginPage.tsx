import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { InputGroup, InputGroupText, Input, Label } from "reactstrap";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { AuthService } from "../../service/AuthService";
import { ApiError } from "../../types/http";
import { PATHS } from "../../routes/paths";

import backgroundUrl from '../../assets/intro-background.jpg';

import styles from './styles/LoginPage.module.css';
import { parseLoginError } from "../../features/onboarding/exception/loginError";
import CenterSnackbar from "../../components/feedback/CenterSnackbar";

export default function LoginPage() {
  
  const nav = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [remember, setRemember] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMsg, setSnackMsg] = useState("");
  const [snackVariant, setSnackVariant] = useState<"info"|"success"|"warn"|"error">("info");

  async function handleLogin() {
    if (submitting) {
      return;
    }
    setSubmitting(true);

    try {
      await AuthService.localLogin({ email, password });
      if (remember) {
        localStorage.setItem("rememberEmail", email);
      }
      nav(PATHS.home);
    } catch (err) {
      const { msg, variant } = parseLoginError(err as ApiError);
      console.log(err);
      setSnackMsg(msg);
      setSnackVariant(variant);
      setSnackOpen(false);
      setTimeout(() => setSnackOpen(true), 0);
    } finally {
      setSubmitting(false);
    }
  }

  const onKeyDown = (ev: React.KeyboardEvent) => {
    if (ev.key === "Enter") {
      handleLogin();
    }
  };

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
                onKeyDown={onKeyDown}
                onChange={e => setEmail(e.target.value)}/>
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
                    onKeyDown={onKeyDown}
                    onChange={e => setPassword(e.target.value)}/>
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
        </div>
      </div>

      <CenterSnackbar
        open={snackOpen}
        message={snackMsg}
        variant={snackVariant}
        duration={3000}
        onClose={() => setSnackOpen(false)}
      />
    </main>
  );
}
