import s from './MbtiSelector.module.css';

type Axis = 'EI'|'SN'|'TF'|'JP'; 
type Choice = 'E'|'I'|'S'|'N'|'T'|'F'|'J'|'P';

const OPTIONS:
{ axis: Axis;
  left: Choice;
  right: Choice;
  leftLabel: string;
  rightLabel: string; 
}[]=[
  {axis:'EI', left:'E', right:'I', leftLabel:'외향형', rightLabel:'내향형'},
  {axis:'SN', left:'S', right:'N', leftLabel:'감각형', rightLabel:'직관형'},
  {axis:'TF', left:'T', right:'F', leftLabel:'사고형', rightLabel:'감정형'},
  {axis:'JP', left:'J', right:'P', leftLabel:'판단형', rightLabel:'인식형'},
];
export function MbtiSelector(
  props: {
    value: Record<Axis,string>;
    onToggle: (axis: Axis, next: Choice) => void
  }) {
  const { value, onToggle } = props;
  return (
    <div 
      className={s['mbti-grid']} 
      role="group" 
      aria-label="MBTI 선택">
      {OPTIONS.map(({axis, left, right, leftLabel, rightLabel})=>{
        const cur = value[axis];
        const L = cur === left;
        const R = cur === right;
        return (
          <div 
            key={axis}
            className={s['mbti-row']}>
            <button 
              type="button"
              className={`${s['mbti-button']} ${L? s['selected']:''}`} 
              aria-pressed={L}
              onClick={() => onToggle(axis,left)} 
              aria-label={`${left} (${leftLabel})${L?' 선택됨':''}`}>
                {left}
            </button>
            <button 
              type="button" 
              className={`${s['mbti-button']} ${R? s['selected']:''}`}
              aria-pressed={R}
              onClick={() => onToggle(axis,right)} 
              aria-label={`${right} (${rightLabel})${R?' 선택됨':''}`}>
                {right}
            </button>
            <div 
              className={s['label-left']}>
                {leftLabel}
            </div>
            <div className={s['label-right']}>
              {rightLabel}
            </div>
          </div>
        );
      })}
    </div>
  );
}
