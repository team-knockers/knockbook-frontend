import { createBrowserRouter, Navigate } from "react-router-dom";
import { PATHS } from "./paths";
import AuthLayout, { authLoader, AUTH_LOADER_ID } from "./auth.layout";
import { QnAListPageLoader } from "../pages/customer/QnAListPage.loader";
import { faqLoader } from "../pages/customer/FAQPage.loader";
import { homeLoader } from "../pages/Home.loader";
import { productSummaryListLoader } from "../pages/products/ProductSummaryList.loader";
import { productDetailLoader } from "../pages/products/ProductDetail.loader";
import { productDetailQnaLoader } from "../pages/products/ProductDetailQna.loader";
import { productDetailReviewsLoader } from "../pages/products/ProductDetailReviews.loader";
import { booksHomeLoader } from "../pages/books/BooksHome.loader";
import { booksSearchLoader } from "../pages/books/BooksSearch.loader";
import { bookDetailsLoader } from "../pages/books/BookDetails.loader";
import { booksCategoryLoader } from "../pages/books/BooksCategory.loader";
import { loungeHomeLoader } from "../pages/lounge/LoungeHome.loader";
import { loungePostLoader } from "../pages/lounge/LoungePost.loader";
import { NotificationPageLoader } from "../pages/customer/NotificationPage.loader";
import { policyLoader } from "../pages/customer/PolicyPage.loader";
import { cartAction, CartPageLoader } from "../pages/purchase/CartPage.loader";
import { UserAddressAction, UserAddressPageLoader } from "../pages/account/UserAddressPage.loader";

import ResponsiveMainShell from "../components/layout/ResponsiveMainShell";
import IntroPage from "../pages/IntroPage";
import LoginPage from "../pages/onboarding/LoginPage"
import SignupEmailPage from "../pages/onboarding/SignupEmailPage";
import SignupPolicyPage from "../pages/onboarding/SignupPolicyPage";
import SignupPasswordPage from "../pages/onboarding/SignupPasswordPage";
import SignupDisplayNamePage from "../pages/onboarding/SignupDisplayNamePage";
import SignupSetFavoriteCategory from "../pages/onboarding/SignupSetFavoriteCategoryPage";
import SignupSelectMbti from "../pages/onboarding/SignupSelectMbitPage";
import SignupMbtiResult from "../pages/onboarding/SignupMbtiResultPage";
import SignupComplete from "../pages/onboarding/SignupCompletePage";

import HomePage from "../pages/HomePage";
import BooksHomePage from "../pages/books/BooksHomePage";
import BooksSearchPage from "../pages/books/BooksSearchPage";
import BookDetailsPage from "../pages/books/BookDetailsPage";
import BookDetailsDescriptionPage from "../pages/books/BookDetailsDescriptionPage";
import BookDetailsReviewsPage from "../pages/books/BookDetailsReviewsPage";
import BooksCategoryPage from "../pages/books/BooksCategoryPage";
import BooksCategoryHomePage from "../pages/books/BooksCategoryHomePage";
import BooksCategoryAllPage from "../pages/books/BooksCategoryAllPage";
import ProductsHomePage from "../pages/products/ProductsHomePage";
import ProductsSearchPage from "../pages/products/ProductsSearchPage";
import ProductDetailPage from "../pages/products/ProductDetailPage";
import LoungeHomePage from "../pages/lounge/LoungeHomePage";
import LoungePostPage from "../pages/lounge/LoungePostPage";
import FeedHomePage from "../pages/feeds/FeedHomePage";
import NotificationPage from "../pages/customer/NotificationPage";
import CartPage from "../pages/purchase/CartPage";
import AccountHomePage from "../pages/account/AccountHomePage";
import AccountSettingsIntroPage from "../pages/account/AccountSettingsIntroPage";
import AccountSettingsProfilePage from "../pages/account/AccountSettingsProfilePage";
import RentalHistoryPage from "../pages/account/RentalHistoryPage";
import LikePage from "../pages/account/LikePage";
import LikeBookPage from "../pages/account/LikeBookPage";
import LikeProductPage from "../pages/account/LikeProductPage";
import PointPage from "../pages/account/PointPage";
import PointAllPage from "../pages/account/PointAllPage";
import PointEarnedPage from "../pages/account/PointEarnedPage";
import PointUsedPage from "../pages/account/PointUsedPage";
import PointExpiredPage from "../pages/account/PointExpiredPage";
import CouponPage from "../pages/account/CouponPage";
import ProductDetailDescriptionPage from "../pages/products/ProductDetailDescriptionPage";
import ProductDetailReviewsPage from "../pages/products/ProductDetailReviewsPage";
import ProductDetailQnaPage from "../pages/products/ProductDetailQnaPage";
import FAQPage from "../pages/customer/FAQPage";
import PolicyPage from "../pages/customer/PolicyPage";
import QnARegisterPage from "../pages/customer/QnARegisterPage";
import QnAListPage from "../pages/customer/QnAListPage";
import QnAPage from "../pages/customer/QnAPage";
import FeedPage from "../pages/feeds/FeedPage";
import FeedProfilePage from "../pages/feeds/FeedProfilePage";
import InsightPage from "../pages/feeds/InsightPage";
import InsightStatPage from "../pages/feeds/InsightStatPage";
import InsightHistoryPage from "../pages/feeds/InsightHistoryPage";
import UserAddressPage from "../pages/account/UserAddressPage";
import OrderPage from "../pages/purchase/OrderPage";
import { OrderAction, OrderPageLoader } from "../pages/purchase/OrderPage.loader";
import OrderCompletePage from "../pages/purchase/OrderCompletePage";
import AuthCallbackPage from "../pages/auth/AuthCallbackPage";
import { OrderCompletePageLoader } from "../pages/purchase/OrderCompletePage.loader";
import SelectAddressPage from "../pages/account/SelectAddressPage";
import { SelectAddressPageLoader } from "../pages/account/SelectAddressPage.loader";
import PurchaseHistoryPage from "../pages/account/PurchaseHistoryPage";
import { PurchaseHistoryPageLoader } from "../pages/account/PurchaseHistoryPage.loader";
import { RentalHistoryPageLoader } from "../pages/account/RentalHistoryPage.loader";

export const router = createBrowserRouter([
  { path: PATHS.intro, element: <IntroPage /> },
  { path: PATHS.login, element: <LoginPage /> },
  { path: PATHS.signupVerifyEmail, element: <SignupEmailPage /> },
  { path: PATHS.signupAgreePolicy, element: <SignupPolicyPage /> },
  { path: PATHS.signupSetPassword, element: <SignupPasswordPage /> },
  { path: PATHS.signupSetName, element: <SignupDisplayNamePage /> },
  { path: PATHS.authCallback, element: <AuthCallbackPage /> },
  { path: PATHS.signupSetFavoriteCategory, element: <SignupSetFavoriteCategory /> },
  { path: PATHS.signupSelectMbti, element: <SignupSelectMbti /> },
  { path: PATHS.signupMbtiResult, element: <SignupMbtiResult /> },
  { path: PATHS.signupComplete, element: <SignupComplete /> },
  {
    id: AUTH_LOADER_ID,
    element: <AuthLayout />,
    loader: authLoader,
    children: [
      {
        element: <ResponsiveMainShell />,
        children: [
          { path: PATHS.home,
            loader: homeLoader,
            element: <HomePage />,
            handle: { header: { kind: "main", title: "문앞의책방" } } },
          { path: PATHS.booksHome,
            loader: booksHomeLoader,
            element: <BooksHomePage />,
            handle: { header: { kind: "main", title: "문앞의책방" } } },
          { path: PATHS.booksSearch,
            loader: booksSearchLoader,
            element: <BooksSearchPage />,
            handle: { header: { kind: "main", title: "문앞의책방" } } },
          { 
            path: PATHS.bookDetails,
            loader: bookDetailsLoader,
            element: <BookDetailsPage />,
            children: [
              {
                index: true,
                element: <Navigate to="description" replace />
              },
              {
                path: "description",
                loader: bookDetailsLoader,
                element: <BookDetailsDescriptionPage />,
                handle: { 
                  header: { 
                    kind: "backTitleClose",
                    close: { type: 'push', to: PATHS.booksHome }
                  }
                }
              },
              {
                path: "reviews",
                loader: bookDetailsLoader,
                element: <BookDetailsReviewsPage />,
                handle: {
                  header: {
                    kind: "backTitleClose",
                    close: { type: 'push', to: PATHS.booksHome }
                  }
                }
              },
            ],
            handle: {
              header: {
                kind: "backTitleClose",
                close: { type: 'push', to: PATHS.booksHome }
              }
            }
          },
          { 
            path: PATHS.booksCategory,
            element: <BooksCategoryPage />,
            loader: booksCategoryLoader,
            children: [
              {
                index: true,
                element: <Navigate to="home" replace />
              },
              {
                path: "home",
                element: <BooksCategoryHomePage />,
                loader: booksCategoryLoader,
                handle: { header: { kind: "main", title: "문앞의책방" } }
              },
              {
                path: "all",
                element: <BooksCategoryAllPage />,
                loader: booksCategoryLoader,
                handle: { header: { kind: "main", title: "문앞의책방" } }
              },
            ],
            handle: { header: { kind: "main", title: "문앞의책방" } }
          },
          { path: PATHS.productsHome,
            element: <ProductsHomePage />,
            loader: productSummaryListLoader,
            handle: { 
              header: { 
              kind: "main", 
              title: "문앞의책방" 
              } 
            } 
          },
          { path: PATHS.productsSearch,
            element: <ProductsSearchPage />,
            loader: productSummaryListLoader,
            handle: { 
              header: { 
              kind: "main", 
              title: "문앞의책방" 
              } 
            } 
          },
          { path: PATHS.productDetail,
            element: <ProductDetailPage />,
            loader: productDetailLoader,
            children: [
              {
                index: true,
                element: <Navigate to="description" replace />
              },
              {
                path: "description",
                element: <ProductDetailDescriptionPage />,
                loader: productDetailLoader,
                handle: { 
                  header: { 
                    kind: "backTitleClose", 
                    back: { type: 'push', to: PATHS.productsHome }, 
                    close: { type: 'push', to: PATHS.productsHome }
                  } 
                } 
              },
              {
                path: "reviews",
                element: <ProductDetailReviewsPage />,
                loader: productDetailReviewsLoader,
                handle: { 
                  header: { 
                    kind: "backTitleClose", 
                    back: { type: 'push', to: PATHS.productsHome }, 
                    close: { type: 'push', to: PATHS.productsHome }
                  } 
                } 
              },
              {
                path: "qna",
                element: <ProductDetailQnaPage />,
                loader: productDetailQnaLoader,
                handle: { 
                  header: { 
                    kind: "backTitleClose", 
                    back: { type: 'push', to: PATHS.productsHome }, 
                    close: { type: 'push', to: PATHS.productsHome }
                  } 
                } 
              },
            ],
          },
          { path: PATHS.loungeHome,
            element: <LoungeHomePage />,
            loader: loungeHomeLoader,
            handle: { 
              header: { 
                kind: "main", 
                title: "문앞의책방" 
              } 
            } 
          },
          { path: PATHS.loungePost,
            element: <LoungePostPage />,
            loader: loungePostLoader,
            handle: { 
              header: { 
                kind: "main", 
                title: "문앞의책방" 
              } 
            } 
          },
          { path: PATHS.feed,
            element: <FeedPage />,
            handle: { 
              header: { 
                kind: "main",
                title: "문앞의책방"
              } 
            },
            children: [
              {
                index: true,
                element: <Navigate to={PATHS.feedHome} replace />
              },
              {
                path: PATHS.feedHome,
                element: <FeedHomePage />,
                handle: { header: { kind: "main", title: "문앞의책방" } }
              },
              {
                path: PATHS.feedProfile,
                element: <FeedProfilePage />,
                handle: { header: { kind: "main", title: "문앞의책방" } },
              },
            ]
          },
          {
            path: PATHS.insight,
            element: <InsightPage />,
            children: [
              {
                index: true,
                element: <Navigate to={PATHS.insightStat} replace />,
              },
              {
                path: PATHS.insightStat,
                element: <InsightStatPage />,
                handle: { 
                  header: { 
                    kind: "backTitleClose", 
                    title: "인사이트",
                    back: { type: 'push', to: PATHS.feedProfile }, 
                    close: { type: 'push', to: PATHS.feedProfile }
                  } 
                } 
              },
              {
                path: PATHS.insightHistory,
                element: <InsightHistoryPage />,
                handle: { 
                  header: { 
                    kind: "backTitleClose", 
                    title: "인사이트",
                    back: { type: 'push', to: PATHS.feedProfile }, 
                    close: { type: 'push', to: PATHS.feedProfile }
                  } 
                }
              },
            ],
          },
          { path: PATHS.cart,
            element: <CartPage />,
            loader: CartPageLoader,
            action: cartAction,
            handle: { 
              header: { 
                kind: "backTitleClose", 
                title: "장바구니" 
              } 
            } 
          },
          { path: PATHS.order,
            element: <OrderPage />,
            loader: OrderPageLoader,
            action: OrderAction,
            handle: { 
              header: { 
                kind: "backTitleClose", 
                title: "주문하기" 
              } 
            } 
          },
          { path: PATHS.orderComplete,
            loader: OrderCompletePageLoader,
            element: <OrderCompletePage />,
            handle: { 
              header: { 
                kind: "backTitleClose", 
                title: "주문 상세 정보",
                back: { type: 'push', to:PATHS.home },
                close: { type: 'push', to: PATHS.home }
              } 
            } 
          },
          { path: PATHS.accountHome,
            element: <AccountHomePage />,
            handle: { 
              header: { 
                kind: "backTitleClose",
                title: "관리",
                back: { type: 'push', to:PATHS.home },
                close: { type: 'push', to: PATHS.home }
              } 
            } 
          },
          { path: PATHS.accountSettingsIntro,
            element: <AccountSettingsIntroPage />,
            handle: { 
              header: { 
                kind: "backTitleClose",
                title: "내 정보 관리",
                back: { type: 'push', to:PATHS.accountHome },
                close: { type: 'push', to: PATHS.home }
              }
            }
          },
          { path: PATHS.accountSettingsProfile,
            element: <AccountSettingsProfilePage />,
            handle: { 
              header: { 
                kind: "backTitleClose",
                title: "내 정보 관리",
                back: { type: 'push', to:PATHS.accountHome },
                close: { type: 'push', to: PATHS.home }
              } 
            } 
          },
          { path: PATHS.userAddress,
            element: <UserAddressPage />,
            loader: UserAddressPageLoader,
            action: UserAddressAction,
            handle: { 
              header: { 
                kind: "backTitleClose",
                title: "배송지 변경",
                back: { type: 'push', to:PATHS.accountHome },
                close: { type: 'push', to: PATHS.home }
              } 
            } 
          },
          { path: PATHS.userAddress,
            element: <SelectAddressPage />,
            loader: SelectAddressPageLoader,
            handle: { 
              header: { 
                kind: "backTitleClose",
                title: "배송지 변경",
                back: { type: 'push', to:PATHS.accountHome },
                close: { type: 'push', to: PATHS.home }
              } 
            } 
          },
          {
            path: PATHS.faq,
            element: <FAQPage />,
            loader: faqLoader,
            handle: {
              header: {
                kind: "backTitleClose",
                title: "고객센터",
                back: { type: 'push', to:PATHS.accountHome },
                close: { type: 'push', to: PATHS.home }
              }     
            }
          },
          {
            path: PATHS.qna,
            element: <QnAPage />,
            handle: {
              header: {
                kind: "backTitleClose",
                title: "고객센터",
                back: { type: 'push', to:PATHS.accountHome },
                close: { type: 'push', to: PATHS.home }
              }
            },
            children: [
              {
                index: true,
                element: <Navigate to={PATHS.registerQnA} replace />
              },
              {
                path: PATHS.registerQnA,
                element: <QnARegisterPage />,
                handle: {
                  header: {
                    kind: "backTitleClose",
                    title: "고객센터",
                    back: { type: 'push', to:PATHS.accountHome },
                    close: { type: 'push', to: PATHS.home }
                  }     
                }
              },
              {
                path: PATHS.listQnA,
                loader: QnAListPageLoader,
                element: <QnAListPage />,
                handle: {
                  header: {
                    kind: "backTitleClose",
                    title: "고객센터",
                    back: { type: 'push', to:PATHS.accountHome },
                    close: { type: 'push', to: PATHS.home }
                  }     
                }
              },
            ]
          },
          {
            path: PATHS.notification,
            loader: NotificationPageLoader,
            element: <NotificationPage />,
            handle: {
              header: {
                kind: "backTitleClose",
                title: "고객센터",
                back: { type: 'push', to:PATHS.accountHome },
                close: { type: 'push', to: PATHS.home }
              }
            }
          },
          {
            path: PATHS.policy,
            loader: policyLoader,
            element: <PolicyPage />,
            handle: {
              header: {
                kind: "backTitleClose",
                title: "고객센터",
                back: { type: 'push', to:PATHS.accountHome },
                close: { type: 'push', to: PATHS.home }
              }
            }
          },
          {
            path: PATHS.purchaseHistory,
            loader: PurchaseHistoryPageLoader,
            element: <PurchaseHistoryPage />,
            handle: { 
              header: { 
                kind: "backTitleClose",
                title: "구매 내역",
                close: { type: 'push', to: PATHS.accountHome }
              } 
            } 
          },
          {
            path: PATHS.rentalHistory,
            loader: RentalHistoryPageLoader,
            element: <RentalHistoryPage />,
            handle: { 
              header: { 
                kind: "backTitleClose",
                title: "대여 내역",
                close: { type: 'push', to: PATHS.accountHome }
              } 
            }
          },
          {
            path: PATHS.like,
            element: <LikePage />,
            handle: { 
              header: { 
                kind: "backTitleClose",
                title: "찜 목록",
                close: { type: 'push', to: PATHS.accountHome }
              } 
            },
            children: [
              {
                index: true,
                element: <Navigate to={PATHS.likeBook} replace />,
              },
              {
                path: PATHS.likeBook,
                element: <LikeBookPage />,
                handle: {
                  header: {
                    kind: "backTitleClose",
                    title: "찜 목록",
                    back: { type: 'push', to: PATHS.accountHome },
                    close: { type: 'push', to: PATHS.accountHome }
                  }
                }
              },
              {
                path: PATHS.likeProduct,
                element: <LikeProductPage />,
                handle: {
                  header: {
                    kind: "backTitleClose",
                    title: "찜 목록",
                    back: { type: 'push', to: PATHS.accountHome },
                    close: { type: 'push', to: PATHS.accountHome }
                  }
                }
              }
            ]
          },
          {
            path: PATHS.point,
            element: <PointPage />,
            handle: { 
              header: { 
                kind: "backTitleClose",
                title: "포인트",
                close: { type: 'push', to: PATHS.accountHome }
              } 
            },
            children: [
              {
                index: true,
                element: <Navigate to={PATHS.pointAll} replace />,
              },
              {
                path: PATHS.pointAll,
                element: <PointAllPage />,
                handle: {
                  header: {
                    kind: "backTitleClose",
                    title: "포인트",
                    back: { type: 'push', to: PATHS.accountHome },
                    close: { type: 'push', to: PATHS.accountHome }
                  }
                }
              },
              {
                path: PATHS.pointEarned,
                element: <PointEarnedPage />,
                handle: {
                  header: {
                    kind: "backTitleClose",
                    title: "포인트",
                    back: { type: 'push', to: PATHS.accountHome },
                    close: { type: 'push', to: PATHS.accountHome }
                  }
                }
              },
              {
                path: PATHS.pointUsed,
                element: <PointUsedPage />,
                handle: {
                  header: {
                    kind: "backTitleClose",
                    title: "포인트",
                    back: { type: 'push', to: PATHS.accountHome },
                    close: { type: 'push', to: PATHS.accountHome }
                  }
                }
              },
              {
                path: PATHS.pointExpired,
                element: <PointExpiredPage />,
                handle: {
                  header: {
                    kind: "backTitleClose",
                    title: "포인트",
                    back: { type: 'push', to: PATHS.accountHome },
                    close: { type: 'push', to: PATHS.accountHome }
                  }
                }
              }
            ]
          },
          {
            path: PATHS.coupon,
            element: <CouponPage />,
            handle: { 
              header: { 
                kind: "backTitleClose",
                title: "쿠폰",
                close: { type: 'push', to: PATHS.accountHome }
              } 
            } 
          },
        ],
      },
    ],
  },

  { path: "*", element: <Navigate to={PATHS.intro} replace /> },
]);
