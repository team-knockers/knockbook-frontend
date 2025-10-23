import { UserService } from "../../features/account/services/UserService";

export type MbtiInfo = {
  description: string;
  name: string;
  typeName: string;
  thumbnailUrl: string;
  recommendedBooksImgUrl: string[];
};

export type SignupMbtiResultPageLoaderData = {
  displayName: string;
  mbtiInfo: MbtiInfo;
};

const mbtiInfoMap: Record<string, MbtiInfo> = {
  ENFJ: {
    description: '청중을 사로잡고 의욕을 불어넣는',
    typeName: "ENFJ",
    name: '선도자',
    thumbnailUrl: 'https://www.16personalities.com/static/images/personality-types/avatars/enfj-protagonist.svg',
    recommendedBooksImgUrl: [
      'https://contents.kyobobook.co.kr/sih/fit-in/400x0/pdt/9788936439743.jpg',
      'https://contents.kyobobook.co.kr/sih/fit-in/400x0/pdt/9791191114768.jpg',
      'https://contents.kyobobook.co.kr/sih/fit-in/400x0/pdt/9791198754080.jpg'
    ]
  },
  ENFP: {
    description: '열정적이고 창의적인',
    typeName: "ENFP",
    name: '활동가',
    thumbnailUrl: 'https://www.16personalities.com/static/images/personality-types/avatars/enfp-campaigner.svg',
    recommendedBooksImgUrl: [
      'https://contents.kyobobook.co.kr/sih/fit-in/400x0/pdt/9788936439743.jpg',
      'https://contents.kyobobook.co.kr/sih/fit-in/400x0/pdt/9791191114768.jpg',
      'https://contents.kyobobook.co.kr/sih/fit-in/400x0/pdt/9791198754080.jpg'
    ]
  },
  ENTJ: {
    description: '항상 문제 해결 방법을 찾아내는',
    typeName: "ENTJ",
    name: '통솔자',
    thumbnailUrl: 'https://www.16personalities.com/static/images/personality-types/avatars/entj-commander.svg',
    recommendedBooksImgUrl: [
      'https://contents.kyobobook.co.kr/sih/fit-in/400x0/pdt/9788936439743.jpg',
      'https://contents.kyobobook.co.kr/sih/fit-in/400x0/pdt/9791191114768.jpg',
      'https://contents.kyobobook.co.kr/sih/fit-in/400x0/pdt/9791198754080.jpg'
    ]
  },
  ENTP: {
    description: '지적 도전을 즐기는 영리한',
    typeName: "ENTP",
    name: '변론가',
    thumbnailUrl: 'https://www.16personalities.com/static/images/personality-types/avatars/entp-debater.svg',
    recommendedBooksImgUrl: [
      'https://contents.kyobobook.co.kr/sih/fit-in/400x0/pdt/9788936439743.jpg',
      'https://contents.kyobobook.co.kr/sih/fit-in/400x0/pdt/9791191114768.jpg',
      'https://contents.kyobobook.co.kr/sih/fit-in/400x0/pdt/9791198754080.jpg'
    ]
  },
  ESFJ: {
    description: '배려심 넘치고 항상 다른 사람들을 도울 준비가 된',
    typeName: "ESFJ",
    name: '집정관',
    thumbnailUrl: 'https://www.16personalities.com/static/images/personality-types/avatars/esfj-consul.svg',
    recommendedBooksImgUrl: [
      'https://contents.kyobobook.co.kr/sih/fit-in/400x0/pdt/9788936439743.jpg',
      'https://contents.kyobobook.co.kr/sih/fit-in/400x0/pdt/9791191114768.jpg',
      'https://contents.kyobobook.co.kr/sih/fit-in/400x0/pdt/9791198754080.jpg'
    ]
  },
  ESFP: {
    description: '즉흥적이고 넘치는 에너지와 열정으로 주변 사람들을 즐겁게 하는',
    typeName: "ESFP",
    name: '연예인',
    thumbnailUrl: 'https://www.16personalities.com/static/images/personality-types/avatars/esfp-entertainer.svg',
    recommendedBooksImgUrl: [
      'https://contents.kyobobook.co.kr/sih/fit-in/400x0/pdt/9788936439743.jpg',
      'https://contents.kyobobook.co.kr/sih/fit-in/400x0/pdt/9791191114768.jpg',
      'https://contents.kyobobook.co.kr/sih/fit-in/400x0/pdt/9791198754080.jpg'
    ]
  },
  ESTJ: {
    description: '사물과 사람을 관리하는 데 뛰어난 능력을 지닌',
    typeName: "ESTJ",
    name: '경영자',
    thumbnailUrl: 'https://www.16personalities.com/static/images/personality-types/avatars/estj-executive.svg',
    recommendedBooksImgUrl: [
      'https://contents.kyobobook.co.kr/sih/fit-in/400x0/pdt/9788936439743.jpg',
      'https://contents.kyobobook.co.kr/sih/fit-in/400x0/pdt/9791191114768.jpg',
      'https://contents.kyobobook.co.kr/sih/fit-in/400x0/pdt/9791198754080.jpg'
    ]
  },
  ESTP: {
    description: '영리하고 에너지 넘치며 관찰력이 뛰어난',
    typeName: "ESTP",
    name: '사업가',
    thumbnailUrl: 'https://www.16personalities.com/static/images/personality-types/avatars/estp-entrepreneur.svg',
    recommendedBooksImgUrl: [
      'https://contents.kyobobook.co.kr/sih/fit-in/400x0/pdt/9788936439743.jpg',
      'https://contents.kyobobook.co.kr/sih/fit-in/400x0/pdt/9791191114768.jpg',
      'https://contents.kyobobook.co.kr/sih/fit-in/400x0/pdt/9791198754080.jpg'
    ]
  },
  INFJ: {
    description: '차분하고 신비한 분위기를 풍기는',
    typeName: "INFJ",
    name: '옹호자',
    thumbnailUrl: 'https://www.16personalities.com/static/images/personality-types/avatars/infj-advocate.svg',
    recommendedBooksImgUrl: [
      'https://contents.kyobobook.co.kr/sih/fit-in/400x0/pdt/9788936439743.jpg',
      'https://contents.kyobobook.co.kr/sih/fit-in/400x0/pdt/9791191114768.jpg',
      'https://contents.kyobobook.co.kr/sih/fit-in/400x0/pdt/9791198754080.jpg'
    ]
  },
  INFP: {
    description: '항상 선을 행할 준비가 되어 있는',
    typeName: "INFP",
    name: '중재자',
    thumbnailUrl: 'https://www.16personalities.com/static/images/personality-types/avatars/infp-mediator.svg',
    recommendedBooksImgUrl: [
      'https://contents.kyobobook.co.kr/sih/fit-in/400x0/pdt/9788936439743.jpg',
      'https://contents.kyobobook.co.kr/sih/fit-in/400x0/pdt/9791191114768.jpg',
      'https://contents.kyobobook.co.kr/sih/fit-in/400x0/pdt/9791198754080.jpg'
    ]
  },
  INTJ: {
    description: '모든 일에 대해 계획을 세우는',
    typeName: "INTJ",
    name: '전략가',
    thumbnailUrl: 'https://www.16personalities.com/static/images/personality-types/avatars/intj-architect.svg',
    recommendedBooksImgUrl: [
      'https://contents.kyobobook.co.kr/sih/fit-in/400x0/pdt/9788936439743.jpg',
      'https://contents.kyobobook.co.kr/sih/fit-in/400x0/pdt/9791191114768.jpg',
      'https://contents.kyobobook.co.kr/sih/fit-in/400x0/pdt/9791198754080.jpg'
    ]
  },
  INTP: {
    description: '지식을 끝없이 갈망하는',
    typeName: "INTP",
    name: '논리술사',
    thumbnailUrl: 'https://www.16personalities.com/static/images/personality-types/avatars/intp-logician.svg',
    recommendedBooksImgUrl: [
      'https://contents.kyobobook.co.kr/sih/fit-in/400x0/pdt/9788936439743.jpg',
      'https://contents.kyobobook.co.kr/sih/fit-in/400x0/pdt/9791191114768.jpg',
      'https://contents.kyobobook.co.kr/sih/fit-in/400x0/pdt/9791198754080.jpg'
    ]
  },
  ISFJ: {
    description: '주변 사람들을 보호할 준비가 되어 있는',
    typeName: "ISFJ",
    name: '수호자',
    thumbnailUrl: 'https://www.16personalities.com/static/images/personality-types/avatars/isfj-defender.svg',
    recommendedBooksImgUrl: [
      'https://contents.kyobobook.co.kr/sih/fit-in/400x0/pdt/9788936439743.jpg',
      'https://contents.kyobobook.co.kr/sih/fit-in/400x0/pdt/9791191114768.jpg',
      'https://contents.kyobobook.co.kr/sih/fit-in/400x0/pdt/9791198754080.jpg'
    ]
  },
  ISFP: {
    description: '항상 새로운 경험을 추구하는',
    typeName: "ISFP",
    name: '모험가',
    thumbnailUrl: 'https://www.16personalities.com/static/images/personality-types/avatars/isfp-adventurer.svg',
    recommendedBooksImgUrl: [
      'https://contents.kyobobook.co.kr/sih/fit-in/400x0/pdt/9788936439743.jpg',
      'https://contents.kyobobook.co.kr/sih/fit-in/400x0/pdt/9791191114768.jpg',
      'https://contents.kyobobook.co.kr/sih/fit-in/400x0/pdt/9791198754080.jpg'
    ]
  },
  ISTJ: {
    description: '사실을 중시하고 실용적인',
    typeName: "ISTJ",
    name: '현실주의자',
    thumbnailUrl: 'https://www.16personalities.com/static/images/personality-types/avatars/istj-logistician.svg',
    recommendedBooksImgUrl: [
      'https://contents.kyobobook.co.kr/sih/fit-in/400x0/pdt/9788936439743.jpg',
      'https://contents.kyobobook.co.kr/sih/fit-in/400x0/pdt/9791191114768.jpg',
      'https://contents.kyobobook.co.kr/sih/fit-in/400x0/pdt/9791198754080.jpg'
    ]
  },
  ISTP: {
    description: '대담하면서도 현실적인',
    typeName: "ISTP",
    name: '장인',
    thumbnailUrl: 'https://www.16personalities.com/static/images/personality-types/avatars/istp-virtuoso.svg',
    recommendedBooksImgUrl: [
      'https://contents.kyobobook.co.kr/sih/fit-in/400x0/pdt/9788936439743.jpg',
      'https://contents.kyobobook.co.kr/sih/fit-in/400x0/pdt/9791191114768.jpg',
      'https://contents.kyobobook.co.kr/sih/fit-in/400x0/pdt/9791198754080.jpg'
    ]
  },
};

const defaultMbtiInfo: MbtiInfo = {
  description: '아직 MBTI 정보가 설정되지 않았어요.',
  typeName: "NNNN",
  name: '미등록',
  thumbnailUrl:
    'https://www.16personalities.com/static/images/personality-types/avatars/default-avatar.svg',
  recommendedBooksImgUrl: [],
};

export async function SignupMbtiResultPageLoader()
: Promise<SignupMbtiResultPageLoaderData> {
  const profile = await UserService.getMyProfile();
  const displayName = profile.displayName;
  const mbtiType = profile.mbti?.toUpperCase();
  const mbtiInfo = mbtiType
  ? mbtiInfoMap[mbtiType] ?? defaultMbtiInfo
  : defaultMbtiInfo;

  return { displayName, mbtiInfo };
}
