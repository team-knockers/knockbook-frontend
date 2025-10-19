import type { LoaderFunctionArgs } from 'react-router-dom';
import type { LoungePostDetails } from '../../features/lounge/types';
import { LoungeService } from '../../features/lounge/services/LoungeService';
import { UserService } from '../../features/account/services/UserService';
import type { GetMyProfileResponse } from '../../features/account/types';

export type LoungePostLoaderData = {
  postDetails: LoungePostDetails;
  currentUserInfo: GetMyProfileResponse;
};

export async function loungePostLoader({ params }: LoaderFunctionArgs): Promise<LoungePostLoaderData> {
  const postId = params.postId;

  if (!postId) {
    throw new Error('Missing postId');
  }

  const postDetails = await LoungeService.getLoungePostDetails(postId);
  const currentUserInfo = await UserService.getMyProfile();

  return { postDetails, currentUserInfo };
}
