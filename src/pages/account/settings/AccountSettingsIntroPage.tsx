import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input, InputGroup, InputGroupText } from 'reactstrap';
import { PATHS } from '../../../routes/paths';
import { UserService } from '../../../features/account/services/UserService';
import { ApiError } from '../../../types/http';
import { FiEye, FiEyeOff } from "react-icons/fi";

import OneWayButton from '../../../components/forms/OneWayButton';
import s from './AccountSettingsIntroPage.module.css';

export default function AccountSettingsIntroPage() {

  const nav = useNavigate();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword ] = useState(false);

  async function handleClick() {
    try {
      await UserService.verifyPassword(password);
      console.log("success");
      nav(PATHS.accountSettingsProfile);
    } catch (e) {
      if (e instanceof ApiError) {
        console.error(e.problem.title); // temporary procedure
      }
    }
  }

  return (
    <main className={s['page-layout']}>
      <div className={s['content-wrapper']}>
        <div className={s['verify-password-wrapper']}>
          <div className={s['verify-password-img']}></div>
          <div className={s['verify-password-msg']}>
            <span>개인정보 변경을 위하여<br/>비밀번호를 입력해주세요</span>
          </div>
          <InputGroup className={s['password-input-wrapper']}>
            <Input 
              className={s['password-input']}
              id="password-input"
              type={showPassword ? 'text' : 'password'}
              placeholder="비밀번호를 입력하세요"
              value={password}
              onChange={e => setPassword(e.target.value)}/>
            <InputGroupText
              className={s['show-icon']}
              onClick={() => setShowPassword(prev => !prev)}>
                {showPassword ? <FiEyeOff /> : <FiEye />}
            </InputGroupText>
          </InputGroup>
        </div>
        <OneWayButton 
          content='확인'
          responsiveType='fluid'
          widthSizeType='xl'
          heightSizeType='xl'
          colorType='dark'
          onClick={handleClick}/>
      </div>
    </main>
  );
}
