import { BarChart, Bar, XAxis, Legend, ResponsiveContainer } from 'recharts';

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
    <ResponsiveContainer width="100%" height={250}>
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
          axisLine={{ stroke: '#afafafff', strokeWidth: 1 }}
          tick={{ fill: '#333', fontSize: 14 , fontFamily: 'Pretendard' }}
        />
        <Legend
          layout="horizontal"
          align="center"
          verticalAlign="bottom"
          iconType="square"
           wrapperStyle={{
            fontSize: '14px',
            fontFamily: 'Pretendard',
            fontWeight: '700',
            color: '#333',
          }}
         />
        <Bar dataKey="나의 독서량" fill="#6C8CA1" label={{ position: 'top', fill: '#000', fontSize: 12, fontFamily: 'Pretendard' }}/>
        <Bar dataKey="회원 평균" fill="#A2C5C1" label={{ position: 'top', fill: '#000', fontSize: 12 , fontFamily: 'Pretendard' }}/>
      </BarChart>
    </ResponsiveContainer>
  );
};
