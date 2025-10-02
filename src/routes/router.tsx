import { createBrowserRouter, Navigate } from "react-router-dom";
import { PATHS } from "./paths";
import AuthLayout, { authLoader, AUTH_LOADER_ID } from "./auth.layout";
import { QnAListPageLoader } from "../pages/customer/QnAListPage.loader";
import { faqLoader } from "../pages/customer/FAQPage.loader";
import { productSummaryListLoader } from "../pages/products/ProductSummaryList.loader";
import { booksHomeLoader } from "../pages/books/BooksHomePageLoader";

import ResponsiveMainShell from "../components/layout/ResponsiveMainShell";
import IntroPage from "../pages/IntroPage";
import LoginPage from "../pages/onboarding/LoginPage"
import SignupEmailPage from "../pages/onboarding/SignupEmailPage";
import SignupPolicyPage from "../pages/onboarding/SignupPolicyPage";
import SignupPasswordPage from "../pages/onboarding/SignupPasswordPage";
import SignupDisplayNamePage from "../pages/onboarding/SignupDisplayNamePage";

import HomePage from "../pages/HomePage";
import BooksHomePage from "../pages/books/BooksHomePage";
import BooksSearchPage from "../pages/books/BooksSearchPage";
import BookDetailsPage from "../pages/books/BookDetailsPage";
import BookDetailsDescriptionPage from "../pages/books/BookDetailsDescriptionPage";
import BookDetailsReviewsPage from "../pages/books/BookDetailsReviewsPage";
import ProductsHomePage from "../pages/products/ProductsHomePage";
import ProductsSearchPage from "../pages/products/ProductsSearchPage";
import ProductDetailPage from "../pages/products/ProductDetailPage";
import LoungeHomePage from "../pages/lounge/LoungeHomePage";
import FeedHomePage from "../pages/feeds/FeedHomePage";
import NotificationPage from "../pages/customer/NotificationPage";
import CartPage from "../pages/purchase/CartPage";
import AccountHomePage from "../pages/account/AccountHomePage";
import AccountSettingsIntroPage from "../pages/account/AccountSettingsIntroPage";
import AccountSettingsProfilePage from "../pages/account/AccountSettingsProfilePage";
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

export const router = createBrowserRouter([
  { path: PATHS.intro, element: <IntroPage /> },
  { path: PATHS.login, element: <LoginPage /> },
  { path: PATHS.signupVerifyEmail, element: <SignupEmailPage /> },
  { path: PATHS.signupAgreePolicy, element: <SignupPolicyPage /> },
  { path: PATHS.signupSetPassword, element: <SignupPasswordPage /> },
  { path: PATHS.signupSetName, element: <SignupDisplayNamePage /> },
  {
    id: AUTH_LOADER_ID,
    element: <AuthLayout />,
    loader: authLoader,
    children: [
      {
        element: <ResponsiveMainShell />,
        children: [
          { path: PATHS.home,
            element: <HomePage />,
            handle: { header: { kind: "main", title: "문앞의책방" } } },
          { path: PATHS.booksHome,
            loader: booksHomeLoader,
            element: <BooksHomePage />,
            handle: { header: { kind: "main", title: "문앞의책방" } } },
          { path: PATHS.booksSearch,
            element: <BooksSearchPage />,
            handle: { header: { kind: "main", title: "문앞의책방" } } },
          { 
            path: PATHS.bookDetails,
            element: <BookDetailsPage />,
            children: [
              {
                index: true,
                element: <Navigate to="description" replace />
              },
              {
                path: "description",
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
            children: [
              {
                index: true,
                element: <Navigate to="description" replace />
              },
              {
                path: "description",
                element: <ProductDetailDescriptionPage />,
                handle: { header: { kind: "main", title: "문앞의책방" } }
              },
              {
                path: "reviews",
                element: <ProductDetailReviewsPage />,
                handle: { header: { kind: "main", title: "문앞의책방" } }
              },
              {
                path: "qna",
                element: <ProductDetailQnaPage />,
                handle: { header: { kind: "main", title: "문앞의책방" } }
              },
            ],
            handle: { header: { kind: "main", title: "문앞의책방" } } 
          },
          { path: PATHS.loungeHome,
            element: <LoungeHomePage />,
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
                handle: { header: { kind: "main", title: "문앞의책방" } }
              },
            ]
          },
          { path: PATHS.cart,
            element: <CartPage />,
            handle: { 
              header: { 
                kind: "backTitleClose", 
                title: "장바구니" 
              } 
            } 
          },
          { path: PATHS.accountHome,
            element: <AccountHomePage />,
            handle: { 
              header: { 
                kind: "backTitleClose",
                title: "관리",
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
                handle: { header: { kind: "main", title: "문앞의책방" } }
              },
              {
                path: PATHS.listQnA,
                loader: QnAListPageLoader,
                element: <QnAListPage />,
                handle: { header: { kind: "main", title: "문앞의책방" } }
              },
            ]
          },
          {
            path: PATHS.notification,
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
            path: PATHS.poicy,
            element: <PolicyPage />,
            handle: {
              header: {
                kind: "backTitleClose",
                title: "고객센터",
                back: { type: 'push', to:PATHS.accountHome },
                close: { type: 'push', to: PATHS.home }
              }
            }
          }
        ],
      },
    ],
  },

  { path: "*", element: <Navigate to={PATHS.intro} replace /> },
]);
