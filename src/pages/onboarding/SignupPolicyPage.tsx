import { Input, Label } from "reactstrap";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PATHS } from "../../routes/paths";

import backgroundUrl from '../../assets/login_page_bg.png';
import OneWayButton from '../../components/forms/OneWayButton';

import s from './styles/SignupPolicyPage.module.css';

const CLAUSE_TEXTS = [
  '(필수) 만 14세 이상입니다.',
  '(필수) 서비스 이용 약관에 동의합니다.',
  '(필수) 개인정보 수집 이용에 동의합니다.',
];

export default function SignupPolicyPage() {

  const nav = useNavigate();
  const [clauses, setClauses] = useState<boolean[]>(
    Array(CLAUSE_TEXTS.length).fill(false));
  const isAllChecked = clauses.every(Boolean);

  function toggleClause(idx: number, next: boolean) {
    setClauses(prev => prev.map((v, i) => (i === idx ? next : v)));
  }

  function togleAllClauses(next: boolean) {
    setClauses(Array(CLAUSE_TEXTS.length).fill(next));
  }

  return (
    <main className={s['page-layout']}>
      <div className={s['page-left-section']}>
        <img
          className={s['page-left-section-img']}
          src={backgroundUrl}
          alt="signup page background image" />
      </div>
      <div className={s['page-right-section']}>
        <div className={s['title-policy-wrapper']}>
          <div className={s['title']}>
            <span>서비스 이용 약관에<br/>동의해주세요</span>
          </div>
          <div className={s['policy-group-wrapper']}>
            {/* accept all */}
            <div className={s['accept-all-wrapper']}>
              <Label check>
                <Input
                  className="me-2 mt-0"
                  type="checkbox"
                  checked={isAllChecked}
                  onChange={e => togleAllClauses(e.target.checked)}/>
                  네, 모두 동의합니다.
              </Label>
            </div>
            {/* individual clause */}
            <div className={s['accept-clause-wrapper']}>
              {CLAUSE_TEXTS.map((text, idx) => (
                <div 
                  className={s['accept-clause-item']}
                  key={idx}>
                  <Label check>
                    <Input
                      className="me-2 mt-0"
                      type="checkbox"
                      checked={clauses[idx]}
                      onChange={e=> toggleClause(idx, e.target.checked)}/>
                      {text}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </div>
        <OneWayButton 
          content='다음'
          responsiveType='fluid'
          widthSizeType='lg'
          heightSizeType='lg'
          colorType='light'
          onClick={() => nav(PATHS.signupSetPassword)}
          disabled={!isAllChecked}/>
      </div>
    </main>
  );
}
