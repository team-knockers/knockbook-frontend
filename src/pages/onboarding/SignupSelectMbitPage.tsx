import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PATHS } from '../../routes/paths';

import OneWayButton from '../../components/forms/OneWayButton';
import backgroundUrl from '../../assets/login_page_bg.png';

import s from './styles/SignupSelectMbtiPage.module.css';

export default function SignupSelectMbtiPage() {
  const nav = useNavigate();

  const dummyUser = {
    id: '유저아이디',
    name: '유저이름',
  };

  const [EI, setEI] = useState<'E' | 'I' | ''>('');
  const [SN, setSN] = useState<'S' | 'N' | ''>('');
  const [TF, setTF] = useState<'T' | 'F' | ''>('');
  const [JP, setJP] = useState<'J' | 'P' | ''>('');

  const mbtiOptions = [
    { type: 'EI', left: 'E', right: 'I', leftLabel: '외향형', rightLabel: '내향형', state: EI, setState: setEI },
    { type: 'SN', left: 'S', right: 'N', leftLabel: '감각형', rightLabel: '직관형', state: SN, setState: setSN },
    { type: 'TF', left: 'T', right: 'F', leftLabel: '사고형', rightLabel: '감정형', state: TF, setState: setTF },
    { type: 'JP', left: 'J', right: 'P', leftLabel: '판단형', rightLabel: '인식형', state: JP, setState: setJP },
  ];

  const toggleMbti = (value: string, setState: (v: any) => void, currentValue: string) => {
    setState(currentValue === value ? '' : value);
  };

  const isMbtiComplete = EI && SN && TF && JP;

  return (
    <main className={s['page-layout']}>
      <div className={s['page-left-section']}>
        <img
        className={s['page-left-section-img']}
        src={backgroundUrl}
        alt="signup page background image" />
      </div>

      <div className={s['page-right-section']}>
        <div className={s['text-section']}>
          <p className={s['title']}><strong>{dummyUser.name}</strong> 님의 MBTI를 선택해주세요</p>
          <p className={s['description']}>맞춤형 책 추천에 사용돼요</p>
        </div>

        <div className={s['mbti-grid']}>
          {mbtiOptions.map((option) => (
            <div key={option.type} className={s['mbti-row']}>
              <button
                className={`${s['mbti-button']} ${option.state === option.left ? s['selected'] : ''}`}
                onClick={() => toggleMbti(option.left, option.setState, option.state)}
              >
                {option.left}
              </button>
              <button
                className={`${s['mbti-button']} ${option.state === option.right ? s['selected'] : ''}`}
                onClick={() => toggleMbti(option.right, option.setState, option.state)}
              >
                {option.right}
              </button>
              <div className={s['label-left']}>{option.leftLabel}</div>
              <div className={s['label-right']}>{option.rightLabel}</div>
            </div>
          ))}
        </div>

        <div className={s['button-section']}>
          <button
            className={s['skip-button']}
            onClick={() => nav(PATHS.signupComplete)}
          >
            건너뛰기
          </button>
          <OneWayButton
            content="다음"
            responsiveType="fluid"
            widthSizeType="lg"
            heightSizeType="lg"
            colorType="light"
            onClick={() => {
              const mbti = `${EI}${SN}${TF}${JP}`;
              nav(PATHS.signupMbtiResult, {
                state: { userName: dummyUser.name, mbti }
              });
            }}
            disabled={!isMbtiComplete}
          />
        </div>
      </div>  
    </main>
  );
}
