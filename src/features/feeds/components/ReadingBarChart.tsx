import { BarChart, Bar, Rectangle, XAxis, Legend, ResponsiveContainer } from 'recharts';

type ReadingRate = {
  month: string,
  "나의 독서량": number,
  "회원 평균": number
};

type ReadingBarChartProps = {
  readingRateData: ReadingRate[]
};

export default function ReadingBarChart({
  readingRateData,
}: ReadingBarChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        width={500}
        height={300}
        data={readingRateData}
        margin={{
          top: 30,
          right: 10,
          left: 10,
          bottom: 5,
        }}
        barSize={15}
      >
        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={{ stroke: '#000000', strokeWidth: 2 }}
          tick={{ fill: '#000000' }}
        />
        <Legend />
        <Bar dataKey="회원 평균" fill="#4200BC" label={{ position: 'top', fill: '#000000', fontSize: 14 }} activeBar={<Rectangle fill="#2555afff" />} />
        <Bar dataKey="나의 독서량" fill="#c04ca5ff" label={{ position: 'top', fill: '#000000', fontSize: 14 }} activeBar={<Rectangle fill="#d857adff" />} />
      </BarChart>
    </ResponsiveContainer>
  );
};
