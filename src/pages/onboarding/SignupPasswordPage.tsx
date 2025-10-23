import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { InputGroup, InputGroupText, Input, Label } from 'reactstrap';
import { PATHS } from '../../routes/paths';
import { FiEye, FiEyeOff } from "react-icons/fi";
import { checkPasswordAlphaLetter, checkPasswordDigit, checkPasswordLength, checkPasswordSpecialLetter, isPasswordValid } from '../../shared/validation/validUserProfile';
import { useSignupFlow } from '../../features/onboarding/hooks/useSignupFlow';

import OneWayButton from '../../components/forms/OneWayButton';
import backgroundUrl from '../../assets/intro-background.jpg';

import Item from '../../components/display/Item';
import styles from './styles/SignupPasswordPage.module.css';

export default function SignupPasswordPage() {

  const nav = useNavigate();
  const { password, setPassword } = useSignupFlow();
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword ] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword ] = useState(false);
  const [canProceed, setCanProceed ] = useState(false);

  const isValid = isPasswordValid(password);
  const isMatch = confirmPassword.length > 0 && password === confirmPassword;

  useEffect(() => setCanProceed(isValid && isMatch), [password, confirmPassword]);

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
          <div className={styles['title-password-wrapper']}>
             <div className={styles['title']}>
              <span>비밀번호를 설정해주세요</span>
            </div>
            <div className={styles['password-group-wrapper']}>
              <div className={styles['password-section']}>
                <Label 
                  className={styles['password-label']}
                  for="password-input"
                  type="text">
                    비밀번호 입력
                </Label>
                <InputGroup className={styles['password-input-wrapper']}>
                  <Input 
                    className={styles['password-input']}
                    id="password-input"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="비밀번호를 입력하세요"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    valid={isPasswordValid(password)}
                    invalid={!isPasswordValid(password)}/>
                  <InputGroupText
                    className={styles['show-icon']}
                    onClick={() => setShowPassword(prev => !prev)}>
                      {showPassword ? <FiEyeOff /> : <FiEye />}
                  </InputGroupText>
                </InputGroup>
                <div className={styles['password-request-wrapper']}>
                  <Item ok={checkPasswordLength(password)}>8-12자</Item>
                  <Item ok={checkPasswordAlphaLetter(password)}>영문</Item>
                  <Item ok={checkPasswordDigit(password)}>숫자</Item>
                  <Item ok={checkPasswordSpecialLetter(password)}>특수문자</Item>
                </div>
              </div>
              <div className={styles['confirm-password-section']}>
                <Label 
                  className={styles['confirm-password-label']}
                  for="confirm-password-input">
                    비밀번호 확인
                </Label>
                <InputGroup className={styles['confirm-password-input-wrapper']}>
                  <Input 
                    className={styles['confirm-password-input']}
                    id="confirm-password-input"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="비밀번호를 입력하세요"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    valid={isMatch}
                    invalid={!isMatch}/>
                  <InputGroupText
                    className={styles['show-icon']}
                    onClick={() => setShowConfirmPassword(prev => !prev)}>
                      {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                  </InputGroupText>
                </InputGroup>
              </div>
            </div>
          </div>
          <OneWayButton 
            content='다음'
            responsiveType='fluid'
            widthSizeType='lg'
            heightSizeType='lg'
            colorType='light'
            onClick={() => nav(PATHS.signupSetName)}
            disabled={!canProceed}/>
        </div>
      </div>
    </main>
  );
}
