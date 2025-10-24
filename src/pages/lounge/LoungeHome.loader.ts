import type { LoaderFunctionArgs } from 'react-router-dom';
import type { LoungePostsSummaryApiResponse } from '../../features/lounge/types';
import { LoungeService } from '../../features/lounge/services/LoungeService';

export type LoungeHomeLoaderData = {
  postSummaries: LoungePostsSummaryApiResponse;
  sliderPosts: LoungePostsSummaryApiResponse['posts'];
};

function shuffleArray<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export async function loungeHomeLoader(_args: LoaderFunctionArgs): Promise<LoungeHomeLoaderData> {

  // for official post
  const postSummaries = await LoungeService.getPaginatedLoungePostSummaries(1, 6, 'newest');

  // for slider
  const desiredCount = 10;
  const postPool = await LoungeService.getPaginatedLoungePostSummaries(1, 30, 'newest');

  const items = postPool.posts ?? [];

  const shuffled = shuffleArray(items);

  const seen = new Set<string>();
  const uniqueSelected: typeof items = [];
  for (const it of shuffled) {
    if (!it || !it.id) {
      continue;
    }
    if (!seen.has(it.id)) {
      seen.add(it.id);
      uniqueSelected.push(it);
      if (uniqueSelected.length >= desiredCount) {
        break;
      }
    }
  }

  return { postSummaries, sliderPosts: uniqueSelected };
}
