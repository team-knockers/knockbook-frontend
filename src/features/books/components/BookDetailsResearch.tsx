import { useEffect, useRef, useState } from 'react';
import type { BookMbtiPercentage } from '../types';
import BookDetailsResearchChart from './BookDetailsResearchChart';
import styles from './styles/BookDetailsResearch.module.css';
import ResearchNoData from '../../../assets/book_research_no_data.png';

type BookDetailsResearchProps = {
  myMbti: string | null,
  mbtiResearch: BookMbtiPercentage[];
};

export default function BookDetailsResearch({
  myMbti,
  mbtiResearch
}: BookDetailsResearchProps) {
  const chartContainerRef = useRef<HTMLDivElement | null>(null);
  const [chartWidth, setChartWidth] = useState(0);

  // Measure the parent div's width for chart sizing
  useEffect(() => {
    const element = chartContainerRef.current;
    if (!element) {
      return;
    }

    const update = () => {
      setChartWidth(element.getBoundingClientRect().width || 0);
    };

    requestAnimationFrame(update);

    const resizeObserverInstance = new ResizeObserver(() => {
      requestAnimationFrame(update);
    });
    resizeObserverInstance.observe(element);

    return () => {
      resizeObserverInstance.disconnect();
    };
  }, []);

  const outerRadius = chartWidth * 0.23;
  const innerRadius = outerRadius * 0.5;

  // Safe top-N helper (returns as many items as available if missing or insufficient)
  const safeTopN = (arr: BookMbtiPercentage[] | undefined, n = 3) => {
    if (!Array.isArray(arr) || arr.length === 0) return [];
    return arr.slice(0, n);
  };
  
  const top3 = safeTopN(mbtiResearch, 3);

  // Data passed to the chart: use only items with percentage greater than 0
  const filteredData = Array.isArray(mbtiResearch) ? mbtiResearch.filter(item => Number(item.percentage) > 0) : [];

  // Generate description text (handled safely
  const descriptionText = (() => {
    const first = mbtiResearch[0];
    if (!first) return `"리서치 데이터가 없어요"`;

    if (myMbti == null) {
      return `"${first.mbti} 성향의 사람들이 이 책을 가장 선호해요"`;
    }
    
    return myMbti === first.mbti
      ? `"나와 같은 성향의 사람들이 이 책을 가장 선호해요"`
      : `"${first.mbti} 성향의 사람들이 이 책을 가장 선호해요"`;
  })();
  
  // Render 1st, 2nd, 3rd rank results
  const renderRankSpan = (item: BookMbtiPercentage | undefined, rankLabelClass: string, rankLabelText: string) => {
    if (!item) {
      return <span className={styles[rankLabelClass]}>{rankLabelText} 데이터 없음</span>;
    }
    const percentageText = Number.isFinite(Number(item.percentage)) ? `${Number(item.percentage).toFixed(1)}%` : '0.0%';
    return (
      <span className={styles[rankLabelClass]}>
        {rankLabelText} {item.mbti} {percentageText}
      </span>
    );
  };

  return (
    <section className={styles['research-container']}>
      <div className={styles['mbti-research']}>
        <span className={styles['research-title']}>문앞의 리서치</span>

        <div className={styles['research-result']}>
          <div className={styles['research-result-text']}>
            <span className={styles['research-description']}>
              {descriptionText}
            </span>

            <div className={styles['top-mbti']}>
              {renderRankSpan(top3[0], 'first-mbti', '1위')}
              {renderRankSpan(top3[1], 'second-mbti', '2위')}
              {renderRankSpan(top3[2], 'third-mbti', '3위')}
            </div>
          </div>

          <div className={styles['research-result-chart']} ref={chartContainerRef}>
            {filteredData.length > 0 ? (
              <BookDetailsResearchChart
                data={filteredData}
                outerRadius={outerRadius}
                innerRadius={innerRadius}
              />
            ) : (
              <img src={ResearchNoData} alt="리서치 데이터 없음" className={styles['chart-no-data-image']} />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
