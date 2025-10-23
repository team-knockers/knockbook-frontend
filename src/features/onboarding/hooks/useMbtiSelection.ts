import { useState, useMemo, useCallback } from 'react';

type Axis = 'EI' | 'SN' | 'TF' | 'JP';
type Choice = 'E' | 'I' | 'S' | 'N' | 'T' | 'F' | 'J' | 'P';
type State = Record<Axis, '' | Choice>;

export function useMbtiSelection() {
  const [mbti, setMbti] = useState<State>({
    EI: '',
    SN: '',
    TF: '',
    JP: '',
  });

  const toggle = useCallback(
    (axis: Axis, next: Choice) =>
      setMbti(prev => ({
        ...prev,
        [axis]: prev[axis] === next ? '' : next,
      })),
    []
  );

  const isComplete = useMemo(
    () => !!(mbti.EI && mbti.SN && mbti.TF && mbti.JP),
    [mbti]
  );

  const mbtiString = useMemo(
    () => `${mbti.EI}${mbti.SN}${mbti.TF}${mbti.JP}`,
    [mbti]
  );

  return { mbti, toggle, isComplete, mbtiString };
}
