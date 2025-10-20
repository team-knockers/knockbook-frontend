import { useLocation, useNavigate } from 'react-router-dom';
import { PATHS } from '../../routes/paths';

import OneWayButton from '../../components/forms/OneWayButton';
import backgroundUrl from '../../assets/login_page_bg.png';

import s from './styles/SignupMbtiResultPage.module.css';

const mbtiInfoMap: Record<string, { description: string; typeName: string; thumbnailUrl: string; books: string[] }> = {
  ENFJ: {
    description: '청중을 사로잡고 의욕을 불어넣는',
    typeName: '선도자',
    thumbnailUrl: 'https://www.16personalities.com/static/images/personality-types/avatars/enfj-protagonist.svg',
    books: [
      'https://contents.kyobobook.co.kr/sih/fit-in/400x0/pdt/9788936439743.jpg',
      'https://contents.kyobobook.co.kr/sih/fit-in/400x0/pdt/9791191114768.jpg',
      'https://contents.kyobobook.co.kr/sih/fit-in/400x0/pdt/9791198754080.jpg'
    ]
  },
  ENFP: {
    description: '열정적이고 창의적인',
    typeName: '활동가',
    thumbnailUrl: 'https://www.16personalities.com/static/images/personality-types/avatars/enfp-campaigner.svg',
    books: [
      'https://contents.kyobobook.co.kr/sih/fit-in/400x0/pdt/9788936439743.jpg',
      'https://contents.kyobobook.co.kr/sih/fit-in/400x0/pdt/9791191114768.jpg',
      'https://contents.kyobobook.co.kr/sih/fit-in/400x0/pdt/9791198754080.jpg'
    ]
  },
  ENTJ: {
    description: '항상 문제 해결 방법을 찾아내는',
    typeName: '통솔자',
    thumbnailUrl: 'https://www.16personalities.com/static/images/personality-types/avatars/entj-commander.svg',
    books: [
      'https://contents.kyobobook.co.kr/sih/fit-in/400x0/pdt/9788936439743.jpg',
      'https://contents.kyobobook.co.kr/sih/fit-in/400x0/pdt/9791191114768.jpg',
      'https://contents.kyobobook.co.kr/sih/fit-in/400x0/pdt/9791198754080.jpg'
    ]
  },
  ENTP: {
    description: '지적 도전을 즐기는 영리한',
    typeName: '변론가',
    thumbnailUrl: 'https://www.16personalities.com/static/images/personality-types/avatars/entp-debater.svg',
    books: [
      'https://contents.kyobobook.co.kr/sih/fit-in/400x0/pdt/9788936439743.jpg',
      'https://contents.kyobobook.co.kr/sih/fit-in/400x0/pdt/9791191114768.jpg',
      'https://contents.kyobobook.co.kr/sih/fit-in/400x0/pdt/9791198754080.jpg'
    ]
  },
  ESFJ: {
    description: '배려심 넘치고 항상 다른 사람들을 도울 준비가 된',
    typeName: '집정관',
    thumbnailUrl: 'https://www.16personalities.com/static/images/personality-types/avatars/esfj-consul.svg',
    books: [
      'https://contents.kyobobook.co.kr/sih/fit-in/400x0/pdt/9788936439743.jpg',
      'https://contents.kyobobook.co.kr/sih/fit-in/400x0/pdt/9791191114768.jpg',
      'https://contents.kyobobook.co.kr/sih/fit-in/400x0/pdt/9791198754080.jpg'
    ]
  },
  ESFP: {
    description: '즉흥적이고 넘치는 에너지와 열정으로 주변 사람들을 즐겁게 하는',
    typeName: '연예인',
    thumbnailUrl: 'https://www.16personalities.com/static/images/personality-types/avatars/esfp-entertainer.svg',
    books: [
      'https://contents.kyobobook.co.kr/sih/fit-in/400x0/pdt/9788936439743.jpg',
      'https://contents.kyobobook.co.kr/sih/fit-in/400x0/pdt/9791191114768.jpg',
      'https://contents.kyobobook.co.kr/sih/fit-in/400x0/pdt/9791198754080.jpg'
    ]
  },
  ESTJ: {
    description: '사물과 사람을 관리하는 데 뛰어난 능력을 지닌',
    typeName: '경영자',
    thumbnailUrl: 'https://www.16personalities.com/static/images/personality-types/avatars/estj-executive.svg',
    books: [
      'https://contents.kyobobook.co.kr/sih/fit-in/400x0/pdt/9788936439743.jpg',
      'https://contents.kyobobook.co.kr/sih/fit-in/400x0/pdt/9791191114768.jpg',
      'https://contents.kyobobook.co.kr/sih/fit-in/400x0/pdt/9791198754080.jpg'
    ]
  },
  ESTP: {
    description: '영리하고 에너지 넘치며 관찰력이 뛰어난',
    typeName: '사업가',
    thumbnailUrl: 'https://www.16personalities.com/static/images/personality-types/avatars/estp-entrepreneur.svg',
    books: [
      'https://contents.kyobobook.co.kr/sih/fit-in/400x0/pdt/9788936439743.jpg',
      'https://contents.kyobobook.co.kr/sih/fit-in/400x0/pdt/9791191114768.jpg',
      'https://contents.kyobobook.co.kr/sih/fit-in/400x0/pdt/9791198754080.jpg'
    ]
  },
  INFJ: {
    description: '차분하고 신비한 분위기를 풍기는',
    typeName: '옹호자',
    thumbnailUrl: 'https://www.16personalities.com/static/images/personality-types/avatars/infj-advocate.svg',
    books: [
      'https://contents.kyobobook.co.kr/sih/fit-in/400x0/pdt/9788936439743.jpg',
      'https://contents.kyobobook.co.kr/sih/fit-in/400x0/pdt/9791191114768.jpg',
      'https://contents.kyobobook.co.kr/sih/fit-in/400x0/pdt/9791198754080.jpg'
    ]
  },
  INFP: {
    description: '항상 선을 행할 준비가 되어 있는',
    typeName: '중재자',
    thumbnailUrl: 'https://www.16personalities.com/static/images/personality-types/avatars/infp-mediator.svg',
    books: [
      'https://contents.kyobobook.co.kr/sih/fit-in/400x0/pdt/9788936439743.jpg',
      'https://contents.kyobobook.co.kr/sih/fit-in/400x0/pdt/9791191114768.jpg',
      'https://contents.kyobobook.co.kr/sih/fit-in/400x0/pdt/9791198754080.jpg'
    ]
  },
  INTJ: {
    description: '모든 일에 대해 계획을 세우는',
    typeName: '전략가',
    thumbnailUrl: 'https://www.16personalities.com/static/images/personality-types/avatars/intj-architect.svg',
    books: [
      'https://contents.kyobobook.co.kr/sih/fit-in/400x0/pdt/9788936439743.jpg',
      'https://contents.kyobobook.co.kr/sih/fit-in/400x0/pdt/9791191114768.jpg',
      'https://contents.kyobobook.co.kr/sih/fit-in/400x0/pdt/9791198754080.jpg'
    ]
  },
  INTP: {
    description: '지식을 끝없이 갈망하는',
    typeName: '논리술사',
    thumbnailUrl: 'https://www.16personalities.com/static/images/personality-types/avatars/intp-logician.svg',
    books: [
      'https://contents.kyobobook.co.kr/sih/fit-in/400x0/pdt/9788936439743.jpg',
      'https://contents.kyobobook.co.kr/sih/fit-in/400x0/pdt/9791191114768.jpg',
      'https://contents.kyobobook.co.kr/sih/fit-in/400x0/pdt/9791198754080.jpg'
    ]
  },
  ISFJ: {
    description: '주변 사람들을 보호할 준비가 되어 있는',
    typeName: '수호자',
    thumbnailUrl: 'https://www.16personalities.com/static/images/personality-types/avatars/isfj-defender.svg',
    books: [
      'https://contents.kyobobook.co.kr/sih/fit-in/400x0/pdt/9788936439743.jpg',
      'https://contents.kyobobook.co.kr/sih/fit-in/400x0/pdt/9791191114768.jpg',
      'https://contents.kyobobook.co.kr/sih/fit-in/400x0/pdt/9791198754080.jpg'
    ]
  },
  ISFP: {
    description: '항상 새로운 경험을 추구하는',
    typeName: '모험가',
    thumbnailUrl: 'https://www.16personalities.com/static/images/personality-types/avatars/isfp-adventurer.svg',
    books: [
      'https://contents.kyobobook.co.kr/sih/fit-in/400x0/pdt/9788936439743.jpg',
      'https://contents.kyobobook.co.kr/sih/fit-in/400x0/pdt/9791191114768.jpg',
      'https://contents.kyobobook.co.kr/sih/fit-in/400x0/pdt/9791198754080.jpg'
    ]
  },
  ISTJ: {
    description: '사실을 중시하고 실용적인',
    typeName: '현실주의자',
    thumbnailUrl: 'https://www.16personalities.com/static/images/personality-types/avatars/istj-logistician.svg',
    books: [
      'https://contents.kyobobook.co.kr/sih/fit-in/400x0/pdt/9788936439743.jpg',
      'https://contents.kyobobook.co.kr/sih/fit-in/400x0/pdt/9791191114768.jpg',
      'https://contents.kyobobook.co.kr/sih/fit-in/400x0/pdt/9791198754080.jpg'
    ]
  },
  ISTP: {
    description: '대담하면서도 현실적인',
    typeName: '장인',
    thumbnailUrl: 'https://www.16personalities.com/static/images/personality-types/avatars/istp-virtuoso.svg',
    books: [
      'https://contents.kyobobook.co.kr/sih/fit-in/400x0/pdt/9788936439743.jpg',
      'https://contents.kyobobook.co.kr/sih/fit-in/400x0/pdt/9791191114768.jpg',
      'https://contents.kyobobook.co.kr/sih/fit-in/400x0/pdt/9791198754080.jpg'
    ]
  },
};

type LocationState = {
  userName: string;
  mbti: string;
};

export default function SignupMbtiResultPage() {
  const nav = useNavigate();
  const location = useLocation();
  const state = (location.state as LocationState) || { userName: '유저이름', mbti: 'ENFJ' };

  const { userName, mbti } = state;
  const mbtiInfo = mbtiInfoMap[mbti] || mbtiInfoMap['ENFJ'];

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
          <p className={s['user-name']}>
            <strong>{userName}</strong> 님은
          </p>
          <p className={s['user-mbti']}>
            {mbtiInfo.description} <strong>{mbtiInfo.typeName}</strong>이시군요!
          </p>
        </div>

        <img 
          className={s['mbti-thumbnail']}
          src={mbtiInfo.thumbnailUrl} 
          alt={`${mbti} 썸네일`} 
        />

        <div className={s['mbti-display']}>
          {mbti.split('').map((char, index) => (
            <span
              className={s['mbti-letter']}
              key={index}
            >
              {char}
            </span>
          ))}
        </div>

        <div className={s['recommendation-section']}>
          <p className={s['recommendation-text']}>
            {userName}님을 위한 <br />
            맞춤형 책을 추천해 드릴게요
          </p>
          <div className={s['book-list']}>
            {mbtiInfo.books.map((imgUrl, index) => (
              <img 
                className={s['book-image']}
                key={index} 
                src={imgUrl} 
                alt={`추천 도서 ${index + 1}`} 
              />
            ))}
          </div>
        </div>

        <div className={s['button-section']}>
          <OneWayButton
            content="다음"
            responsiveType="fluid"
            widthSizeType="lg"
            heightSizeType="lg"
            colorType="light"
            onClick={() => nav(PATHS.signupComplete)}
          />
        </div>
      </div>  
    </main>
  );
}
