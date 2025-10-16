export const PATHS = {
  intro: "/",

  /* onboarding */
  signupVerifyEmail: "/signup/verifyemail",
  signupAgreePolicy: "/signup/agreepolicy",
  signupSetPassword: "/signup/setpassword",
  signupSetName: "/signup/setname",
  signupSetFavoriteCategory: "/signup/setfavoritecategory",
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

  /* account */
  accountHome: "/account",
  accountSettingsIntro: "/account/settings",
  accountSettingsProfile: "/account/settings/profile",
  userAddress: "/account/settings/address",
  accountLike: "/account/likes",
  accountLikeBook: "/account/likes/book",
  accountLikeProduct: "/account/likes/product",
  accountPoint: "/account/points",
  accountPointAll: "/account/points/all",
  accountPointEarned: "/account/points/earned",
  accountPointUsed: "/account/points/used",
  accountPointExpired: "/account/points/expired",
  accountCoupon: "/account/coupon",

  /* customer */
  customer: "/customer",
  faq: "/customer/faq",
  qna: "/customer/qna",
  registerQnA: "/customer/qna/register",
  listQnA: "/customer/qna/list",
  policy: "/customer/policy",
  notification: "/customer/notification",
};
