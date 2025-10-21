import type { LoaderFunctionArgs } from 'react-router-dom';
import type { LoungePostsSummaryApiResponse } from '../../features/lounge/types';
import { LoungeService } from '../../features/lounge/services/LoungeService';

export type LoungeHomeLoaderData = {
  postSummaries: LoungePostsSummaryApiResponse;
};

export async function loungeHomeLoader(_args: LoaderFunctionArgs): Promise<LoungeHomeLoaderData> {

  const postSummaries = await LoungeService.getPaginatedLoungePostSummaries(1, 6, 'newest');

  return { postSummaries };
}
