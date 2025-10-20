export const PATHS = {
  intro: "/",

  /* auth */
  authCallback: "/auth/callback",

  /* onboarding */
  signupVerifyEmail: "/signup/verifyemail",
  signupAgreePolicy: "/signup/agreepolicy",
  signupSetPassword: "/signup/setpassword",
  signupSetName: "/signup/setname",
  signupSetFavoriteCategory: "/signup/setfavoritecategory",
  signupSelectMbti: "/signup/selectmbti",
  signupMbtiResult: "/signup/mbtiresult",
  signupComplete: "/signup/complete",
  login: "/login",

  /* home */
  home: "/home",

  /* books */
  booksHome: "/books",
  booksSearch: "/books/search",
  bookDetails: "/books/:bookId",
  booksCategory: "/books/category/:categoryCodeName",

  /* products */
  productsHome: "/products",
  productsSearch: "/products/search",
  productDetail: "/products/:productId",

  /* lounge */
  loungeHome: "/lounge",
  loungePost: "/lounge/:postId",

  /* feed */
  feed: "/feed",
  feedHome: "/feed/home",
  feedProfile: "/feed/profile",
  insight: "/insight",
  insightStat: "/insight/stat",
  insightHistory: "/insight/history",

  /* order */
  cart: "/cart",
  order: "/order/:orderId",
  orderById: (orderId: string) => `/order/${orderId}`,
  orderComplete: "/order/:orderId/complete",
  orderCompleteById: (orderId: string) => `/order/${orderId}/complete`,

  /* account */
  accountHome: "/account",
  accountSettingsIntro: "/account/settings",
  accountSettingsProfile: "/account/settings/profile",
  userAddress: "/account/settings/address",
  selectAddress: "/account/settings/address/select",
  purchaseHistory: "/account/history/purchase",
  rentalHistory: "/account/history/rental",
  rentalPending: "/account/history/rental/pending",
  rentalOngoing: "/account/history/rental/ongoing",
  rentalCompleted: "/account/history/rental/completed",
  like: "/account/likes",
  likeBook: "/account/likes/book",
  likeProduct: "/account/likes/product",
  point: "/account/points",
  pointAll: "/account/points/all",
  pointEarned: "/account/points/earned",
  pointUsed: "/account/points/used",
  pointExpired: "/account/points/expired",
  coupon: "/account/coupon",

  /* customer */
  customer: "/customer",
  faq: "/customer/faq",
  qna: "/customer/qna",
  registerQnA: "/customer/qna/register",
  listQnA: "/customer/qna/list",
  policy: "/customer/policy",
  notification: "/customer/notification",
};
