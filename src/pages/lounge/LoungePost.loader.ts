import type { LoaderFunctionArgs } from 'react-router-dom';
import type { LoungePostDetails } from '../../features/lounge/types';
import { LoungeService } from '../../features/lounge/services/LoungeService';

export type LoungePostLoaderData = {
  postDetails: LoungePostDetails;
};

export async function loungePostLoader({ params }: LoaderFunctionArgs): Promise<LoungePostLoaderData> {
  const postId = params.postId;

  if (!postId) {
    throw new Error('Missing postId');
  }

  const postDetails = await LoungeService.getLoungePostDetails(postId);

  return { postDetails };
}
