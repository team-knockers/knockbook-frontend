import type { LoaderFunctionArgs } from 'react-router-dom';
import type { LoungePostDetails } from '../../features/lounge/types';
import { LoungeService } from '../../features/lounge/services/LoungeService';
import type { UserProfile } from '../../features/account/types';
import { ensureUser } from '../../shared/authReady';

export type LoungePostLoaderData = {
  postDetails: LoungePostDetails;
  currentUserInfo: UserProfile;
};

export async function loungePostLoader({ params }: LoaderFunctionArgs): Promise<LoungePostLoaderData> {
  const postId = params.postId;

  if (!postId) {
    throw new Error('Missing postId');
  }

  const postDetails = await LoungeService.getLoungePostDetails(postId);
  const currentUserInfo = await ensureUser();

  return { postDetails, currentUserInfo };
}
