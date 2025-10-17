import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSignupFlow } from '../../features/onboarding/hooks/useSignupFlow';
import { PATHS } from '../../routes/paths';
import { checkDisplayNameLength, checkDisplayNameLetter, isDisplayNameValid } from '../../shared/validation/validUserProfile';
import { Input, Label } from 'reactstrap';
import { AuthService } from '../../service/AuthService';
import { ApiError } from '../../types/http';

import OneWayButton from '../../components/forms/OneWayButton';
import Item from '../../components/display/Item';
import backgroundUrl from '../../assets/login_page_bg.png';

import s from './styles/SignupDisplayNamePage.module.css';


export default function SignupDisplayNamePage() {

  const nav = useNavigate();
  const { displayName, setDisplayName } = useSignupFlow();
  const [canProceed, setCanProceed ] = useState(false);
  const isValid = isDisplayNameValid(displayName);
  
  useEffect(() => setCanProceed(isValid), [displayName]);

  async function handleProceed() {
    try {
      await AuthService.completeRegistration();
      nav(PATHS.signupSetFavoriteCategory);
    } catch (e) {
      if (e instanceof ApiError) {
        console.error(e.problem.detail); // temporary procedure
      }
    }
  }

  return (
       <main>
      <div className={s['page-layout']}>
        <div className={s['page-left-section']}>
           <img
            className={s['page-left-section-img']}
            src={backgroundUrl}
            alt="signup page background image" />
        </div>
        <div className={s['page-right-section']}>
          <div className={s['title-name-wrapper']}>
             <div className={s['title']}>
              <span>이름을 입력해주세요</span>
            </div>
            <div className={s['name-group-wrapper']}>
              <Label 
                className={s['name-label']}
                for="name-input"
                type="text">
                  이름
              </Label>
              <Input 
                className={s['name-input']}
                id="name-input"
                type="text"
                placeholder="2자에서 10자 사이 한글 혹은 영문자로 입력해주세요."
                value={displayName}
                onChange={e => setDisplayName(e.target.value)}
                valid={isValid}
                invalid={!isValid}/>
              <div className={s['name-request-wrapper']}>
                <Item ok={checkDisplayNameLength(displayName)}>2-10자</Item>
                <Item ok={checkDisplayNameLetter(displayName)}>한글/영문</Item>
              </div>  
            </div>
          </div>
          <OneWayButton 
            content='다음'
            responsiveType='fluid'
            widthSizeType='lg'
            heightSizeType='lg'
            colorType='light'
            onClick={handleProceed}
            disabled={!canProceed}/>
        </div>
      </div>
    </main>
  );
}
