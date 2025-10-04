import { useEffect, useState } from 'react';
import {BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import type { BookStarCount } from '../types';
import React from 'react';

type BookReviewsBarChartProps = {
  scoreData: BookStarCount[];
};

/* Hook to set responsive change values */
function useMediaQuery(query: string) {
  const [matches, setMatches] = useState<boolean>(() => typeof window !== 'undefined' && window.matchMedia(query).matches);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia(query);
    const handler = (ev: MediaQueryListEvent) => setMatches(ev.matches);
    mq.addEventListener('change', handler);
    setMatches(mq.matches);
    return () => mq.removeEventListener('change', handler);
  }, [query]);
  return matches;
}

/* Ensure ratings 5 through 1 always exist */
const ensureAllRatings = ( input: BookStarCount[] ) => {
  const map = new Map(input.map(d => [String(d.score), d.count]));
  const filled = [];
  for (let i = 5; i >= 1; i--) {
    filled.push({ name: String(i), count: map.get(String(i)) ?? 0 });
  }
  return filled;
};

/* Convert number (e.g., "4") to star string ("★★★★☆") */
const starsFromScore = (score: string | number, max = 5) => {
  const n = Number(score) || 0;
  const filled = '★'.repeat(Math.max(0, Math.min(n, max)));
  const empty = '☆'.repeat(Math.max(0, max - n));
  return filled + empty;
};

export default function BookReviewsBarChart ({
  scoreData
}: BookReviewsBarChartProps) {

  // Variables that change according to media query
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const tickFontSize = isDesktop ? 16 : 11;
  const tickXOffset = isDesktop ? -8 : -6;
  const tickYOffset = isDesktop ? 6 : 4;
  const yAxisWidth = isDesktop ? 100 : 70;
  const barSize = isDesktop ? 12 : 6;

  // Data processing (ensure 5~1 exist / compute total / add percent)
  const filledRaw = ensureAllRatings(scoreData);
  const total = filledRaw.reduce((s, d) => s + d.count, 0);
  const data = filledRaw.map(d => ({
    ...d,
    percent: total === 0 ? 0 : +(d.count / total * 100).toFixed(2),
  }));

  // Custom tick component (using SVG text)
  const StarTick: React.FC<any> = ({ x, y, payload }) => {
    const stars = starsFromScore(payload.value);
    return (
      <text
        x={x + tickXOffset}
        y={y + tickYOffset}
        textAnchor="end"
        fill="#176840"
        fontSize={tickFontSize} 
        fontFamily="Arial, sans-serif"
      >
        {stars}
      </text>
    );
  };
  
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        layout="vertical"
        data={data}
        barSize={barSize}
        margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
      >
        <XAxis
          type="number"
          domain={[0, 100]}
          axisLine={false}
          tickLine={false}
          tick={false}
          height={0}
        />
        <YAxis
          type="category"
          dataKey="name"
          axisLine={false}
          tickLine={false}
          width={yAxisWidth}
          interval={0}
          tick={<StarTick />}
        />
        <Bar dataKey="percent" fill="#176840" background={{ fill: '#cccccc' }} />
      </BarChart>
    </ResponsiveContainer>
  );
};
