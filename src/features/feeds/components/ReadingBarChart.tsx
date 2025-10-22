import { BarChart, Bar, XAxis, Legend, ResponsiveContainer, LabelList } from 'recharts';
import type { BookReadCountStat } from '../types';

type BarChartData = {
  month: string;
  "나의 독서량": number;
  "회원 평균": number;
};

function toBarChartData(stats: BookReadCountStat[]): BarChartData[] {
  return stats.map(s => ({
    month: `${s.yearAt}.${String(s.monthAt).padStart(2, "0")}`,
    "나의 독서량": s.readCountByMe,
    "회원 평균": s.avgReadCountByMember,
  }));
}

export default function ReadingBarChart({ readCountStat }: { readCountStat: BookReadCountStat[] }) {
  const data = toBarChartData(readCountStat);
  const monthFmt = (m: string) => m.replace(/^20(\d{2})\./, '$1.');

  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={data} margin={{ top: 24, right: 8, left: 8, bottom: 8 }} barSize={12} barGap={2} barCategoryGap="30%">
        <XAxis
          dataKey="month"
          tickFormatter={monthFmt}
          tickLine={false}
          axisLine={{ stroke: '#666', strokeWidth: 1 }}
          tick={{ fill: '#333', fontSize: 10, fontFamily: 'Pretendard' }}
          interval={0}
        />
        <Legend layout="horizontal" align="center" verticalAlign="top" iconType="square"
                wrapperStyle={{ fontSize: '10px', fontFamily: 'Pretendard', fontWeight: 600, color: '#333' }} />
        <Bar dataKey="나의 독서량" fill="#6C8CA1">
          <LabelList
            dataKey="나의 독서량"
            position="top"
            content={(props) => {
              const { x, y, value, width } = props;
              if (x == null || y == null) return null;
              return (
                <text
                  x={Number(x) + (Number(width) / 2) - 3}
                  y={Number(y) - 10}
                  textAnchor="middle"
                  fill="#333"
                  fontSize={10}
                  fontFamily="Pretendard"
                >
                  {`${value ?? 0}권`}
                </text>
              );
            }}
          />
        </Bar>

        <Bar dataKey="회원 평균" fill="#A2C5C1">
          <LabelList
            dataKey="회원 평균"
            position="top"
            content={(props) => {
              const { x, y, value, width } = props;
              if (x == null || y == null) return null;
              return (
                <text
                  x={Number(x) + (Number(width) / 2) + 3}
                  y={Number(y) - 10}
                  textAnchor="middle"
                  fill="#333"
                  fontSize={10}
                  fontFamily="Pretendard"
                >
                  {`${value ?? 0}권`}
                </text>
              );
            }}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
