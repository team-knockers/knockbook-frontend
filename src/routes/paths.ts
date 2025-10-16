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
