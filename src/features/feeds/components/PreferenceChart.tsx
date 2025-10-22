import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import type { BookPreferCategoryStat } from "../types";

type PreferenceChartProps = {
  categoryRatioStat: BookPreferCategoryStat[]
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

  const adjustedFontSize = Math.max(10, Math.round(fontSize * 0.8));
  const fontWeight = 500;
  const textColor = "#333";

  const lineHeight = Math.round(fontSize * 1.1);
  const firstDy = Math.round(-lineHeight / 2);
  const secondDy = lineHeight;
  const haloWidth = Math.max(2, Math.round(fontSize * 0.4));

  return (
    <g>
      <text
        x={x}
        y={y}
        textAnchor="middle"
        dominantBaseline="central"
        style={{ fontSize: adjustedFontSize, paintOrder: 'stroke' as const }}
        stroke="#f8f8f8"
        strokeWidth={haloWidth}
        fill="none">
        <tspan x={x} dy={firstDy} fontWeight={fontWeight}>
          {payload.bookCategoryDisplayName}
        </tspan>
        <tspan x={x} dy={secondDy}>{`(${payload.categoryReadRatio.toFixed(1)}%)`}</tspan>
      </text>

      <text
        x={x}
        y={y}
        fill={textColor}
        textAnchor="middle"
        dominantBaseline="central"
        style={{ fontSize: adjustedFontSize }}>
        <tspan x={x} dy={firstDy} fontWeight={fontWeight}>
          {payload.bookCategoryDisplayName}
        </tspan>
        <tspan x={x} dy={secondDy}>{`(${payload.categoryReadRatio.toFixed(1)}%)`}</tspan>
      </text>
    </g>
  );
}

/**
 * CustomTooltip: Recharts Tooltip content component
 * - Pie's payload is an array and the original data is at payload[0].payload
 * - Here we output in the format "추리:43.4%"
 */
function CustomTooltip({ active, payload, coordinate }: { active?: boolean; payload?: any[]; coordinate?: { x: number; y: number } }) {
  if (!active || !payload || !payload.length || !coordinate) return null;

  const item = payload[0];
  const data = item && item.payload ? item.payload : null;
  if (!data) return null;

  const bookCategory = data.bookCategoryDisplayName ?? '';
  const percentage = data.categoryReadRatio ?? '';

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
      {`${bookCategory}:${percentage}%`}
    </div>
  );
}

export default function PreferenceChart({
  categoryRatioStat,
  outerRadius,
  innerRadius
}: PreferenceChartProps) {
  const filteredData = categoryRatioStat.filter(item => item.categoryReadRatio > 0);
  const computedLabelFontSize = Math.max(8, Math.round(outerRadius * 0.2));
  const LABEL_THRESHOLD = 8; // hide labels for items below 8%

  return (
    <ResponsiveContainer width="100%" height={250}>
      <PieChart>
        <Pie
          data={filteredData}
          cx="50%"
          cy="50%"
          dataKey="categoryReadRatio"
          nameKey="bookCategoryDisplayName"
          outerRadius={outerRadius}
          innerRadius={innerRadius}
          // disable label lines globally. If you want to keep lines, provide a custom function.
          labelLine={false}
          // conditionally render labels: return null when percentage < LABEL_THRESHOLD
          label={(props) => {
            if (!props || !props.payload) return null;
            if (props.payload.categoryReadRatio < LABEL_THRESHOLD) return null;
            return renderCustomizedLabel(props, computedLabelFontSize);
          }}
        >
          {filteredData.map((entry, index) => (
            <Cell key={`cell-${entry.bookCategoryDisplayName}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>

        <Tooltip content={<CustomTooltip />} />
      </PieChart>
    </ResponsiveContainer>
  );
}

