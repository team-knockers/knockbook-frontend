import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import type { BookMbtiPercentage } from '../types';

type BookDetailsResearchChartProps = {
  data: BookMbtiPercentage[];
  outerRadius: number;
  innerRadius: number;
};

const COLORS = [
  '#6C8CA1',
  '#A2C5C1',
  '#B9DCBD',
  '#FCFAE8',
  '#FEF8E4',
  '#FFF7DE',
];

function calcLabelPosByAngle(cx: number, cy: number, midAngle: number, outerRadius: number) {
  const RADIAN = Math.PI / 180;
  const radius = outerRadius * 1.35; // calculate label distance
  return {
    x: cx + radius * Math.cos(-midAngle * RADIAN),
    y: cy + radius * Math.sin(-midAngle * RADIAN),
  };
}

function renderCustomizedLabel(props: any, fontSize: number) {
  const { cx, cy, midAngle, outerRadius, payload } = props;
  const { x, y } = calcLabelPosByAngle(cx, cy, midAngle, outerRadius);

  const lineHeight = Math.round(fontSize * 1.1);
  const firstDy = Math.round(-lineHeight / 2);
  const secondDy = lineHeight;
  const haloWidth = Math.max(2, Math.round(fontSize * 0.6));

  return (
    <g>
      <text
        x={x}
        y={y}
        textAnchor="middle"
        dominantBaseline="central"
        style={{ fontSize, paintOrder: 'stroke' as const }}
        stroke="#fff"
        strokeWidth={haloWidth}
        strokeLinejoin="round"
        strokeLinecap="round"
        fill="none"
      >
        <tspan x={x} dy={firstDy} fontWeight="700">
          {payload.mbti}
        </tspan>
        <tspan x={x} dy={secondDy}>
          {`(${payload.percentage}%)`}
        </tspan>
      </text>

      <text
        x={x}
        y={y}
        fill="#111"
        textAnchor="middle"
        dominantBaseline="central"
        style={{ fontSize }}
      >
        <tspan x={x} dy={firstDy} fontWeight="700">
          {payload.mbti}
        </tspan>
        <tspan x={x} dy={secondDy}>
          {`(${payload.percentage}%)`}
        </tspan>
      </text>
    </g>
  );
}

/**
 * CustomTooltip: Recharts Tooltip content component
 * - Pie's payload is an array and the original data is at payload[0].payload
 * - Here we output in the format "ISFP:43.4%"
 */
function CustomTooltip({ active, payload, coordinate }: { active?: boolean; payload?: any[]; coordinate?: { x: number; y: number } }) {
  if (!active || !payload || !payload.length || !coordinate) return null;

  const item = payload[0];
  const data = item && item.payload ? item.payload : null;
  if (!data) return null;

  const mbti = data.mbti ?? '';
  const percentage = data.percentage ?? '';

  // small offsets so the tooltip doesn't sit directly under the cursor
  const OFFSET_X = 12;
  const OFFSET_Y = -8;

  return (
    <div
      style={{
        position: 'absolute',
        left: coordinate.x + OFFSET_X,
        top: coordinate.y + OFFSET_Y,
        transform: 'translate(-50%, -100%)', // optional: shift tooltip above the cursor center
        background: '#fff',
        border: '1px solid rgba(0,0,0,0.08)',
        padding: '6px 10px',
        borderRadius: 6,
        fontSize: 12,
        color: '#111',
        boxShadow: '0 2px 8px rgba(16,24,40,0.08)',
        pointerEvents: 'none',
        whiteSpace: 'nowrap',
        zIndex: 9999,
      }}
    >
      {`${mbti}:${percentage}%`}
    </div>
  );
}

export default function BookDetailsResearchChart({
  data,
  outerRadius,
  innerRadius,
}: BookDetailsResearchChartProps) {
  const filteredData = data.filter(item => item.percentage > 0);
  const computedLabelFontSize = Math.max(8, Math.round(outerRadius * 0.2));
  const LABEL_THRESHOLD = 8; // hide labels for items below 8%

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={filteredData}
          cx="50%"
          cy="50%"
          dataKey="percentage"
          outerRadius={outerRadius}
          innerRadius={innerRadius}
          // disable label lines globally. If you want to keep lines, provide a custom function.
          labelLine={false}
          // conditionally render labels: return null when percentage < LABEL_THRESHOLD
          label={(props) => {
            if (!props || !props.payload) return null;
            if (props.payload.percentage < LABEL_THRESHOLD) return null;
            return renderCustomizedLabel(props, computedLabelFontSize);
          }}
        >
          {filteredData.map((entry, index) => (
            <Cell key={`cell-${entry.mbti}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>

        <Tooltip content={<CustomTooltip />} />
      </PieChart>
    </ResponsiveContainer>
  );
}
