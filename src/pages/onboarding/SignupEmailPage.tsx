import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSignupFlow } from '../../features/onboarding/hooks/useSignupFlow';
import { AuthService } from '../../service/AuthService';
import { ApiError } from '../../types/http';
import { PATHS } from '../../routes/paths';

import { Input, Label } from 'reactstrap';
import backgroundUrl from '../../assets/intro-background.jpg';
import OneWayButton from '../../components/forms/OneWayButton';

import styles from './styles/SignupEmailPage.module.css';

export default function SignupEmailPage() {

  const nav = useNavigate();
  const { email, setEmail } = useSignupFlow();
  const [code, setCode] = useState('');
  const [isVerificationButtonDisabled, setIsVerificationButtonDisabled] = useState(false);
  const [isConfirmButtonDisabled, setIsConfirmButtonDisabled] = useState(false);
  const [canProceed, setCanProceed ] = useState(false);

  async function handleGetCode() {
    try {
      await AuthService.getCode(email);
      setIsVerificationButtonDisabled(true);
    } catch (e) {
      if (e instanceof ApiError) {
        console.error(e.problem.title); // temporary procedure
      }
    }
  }

  async function handleVerifyCode() {
    try {
      await AuthService.sendCode(code);
      setIsConfirmButtonDisabled(true);
      setCanProceed(true);
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
            alt="signup page background image" />
        </div>
        <div className={styles['page-right-section']}>
          <div className={styles['title-input-wrapper']}>
             <div className={styles['title']}>
              <span>본인 확인을 위해<br />이메일을 입력하세요</span>
            </div>
            <div className={styles['input-group-wrapper']}>
              <div className={styles['input-group']}>
                <Label 
                  className={styles['input-label']}
                  for="email-input-form"
                  type="text">
                    이메일 주소
                </Label>
                <div className={styles['input-form-wrapper']}>
                  <Input 
                    className={styles['input-form']}
                    id="email-input-form"
                    placeholder="이메일을 입력하세요"
                    value={email}
                    onChange={e => setEmail(e.target.value)}>
                  </Input>
                  <OneWayButton 
                    content='인증'
                    responsiveType='fixed'
                    widthSizeType='sm'
                    heightSizeType='sm'
                    colorType='dark'
                    fontSize='14px'
                    onClick={handleGetCode}
                    disabled={isVerificationButtonDisabled}/>
                </div>
              </div>
              <div className={styles['input-group']}>
                <Label 
                  className={styles['input-label']}
                  for="code-input-form">
                    인증번호 입력
                </Label>
                <div className={styles['input-form-wrapper']}>
                  <Input 
                    className={styles['input-form']}
                    id="code-input-form"
                    type="text"
                    placeholder="인증번호를 입력하세요"
                    value={code}
                    onChange={e => setCode(e.target.value)}>
                  </Input>
                  <OneWayButton 
                    content='인증완료'
                    responsiveType='fixed'
                    widthSizeType='sm'
                    heightSizeType='sm'
                    colorType='dark'
                    fontSize='14px'
                    onClick={handleVerifyCode}
                    disabled={isConfirmButtonDisabled}/>
                </div>
              </div>
            </div>
          </div>
          <OneWayButton 
            content='다음'
            responsiveType='fluid'
            widthSizeType='lg'
            heightSizeType='lg'
            colorType='light'
            onClick={() => nav(PATHS.signupAgreePolicy)}
            disabled={!canProceed}/>
        </div>
      </div>
    </main>
  );
}
