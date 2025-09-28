import { createBrowserRouter, Navigate } from "react-router-dom";
import { PATHS } from "./paths";
import AuthLayout, { authLoader, AUTH_LOADER_ID } from "./auth.layout";

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

import HomeSub1Page from "../pages/HomeSub1Page";
import HomeSub2Page from "../pages/HomeSub2Page";
import HomeSub3Page from "../pages/HomeSub3Page";
import HomeSub4Page from "../pages/HomeSub4Page";
import HomeSub5Page from "../pages/HomeSub5Page";
import FAQPage from "../pages/customer/FAQPage";
import QnAPage from "../pages/customer/QnAPage";
import PolicyPage from "../pages/customer/PolicyPage";
import { faqLoader } from "../pages/customer/FAQPage.loader";
import { productSummaryListLoader } from "../pages/products/ProductSummaryList.loader"; 

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
            /* !caution! this is a temporary code for guide */
            element: <HomePage />,
            children: [
              {
                index: true,
                element: <Navigate to={PATHS.homeSub1} replace />
              },
              {
                path: PATHS.homeSub1,
                element: <HomeSub1Page />,
                handle: { header: { kind: "main", title: "문앞의책방" } }
              },
              {
                path: PATHS.homeSub2,
                element: <HomeSub2Page />,
                handle: { header: { kind: "main", title: "문앞의책방" } }
              },
              {
                path: PATHS.homeSub3,
                element: <HomeSub3Page />,
                handle: { header: { kind: "main", title: "문앞의책방" } }
              },
              {
                path: PATHS.homeSub4,
                element: <HomeSub4Page />,
                handle: { header: { kind: "main", title: "문앞의책방" } }
              },
              {
                path: PATHS.homeSub5,
                element: <HomeSub5Page />,
                handle: { header: { kind: "main", title: "문앞의책방" } }
              },
            ],
            handle: { header: { kind: "main", title: "문앞의책방" } } },
          { path: PATHS.booksHome,
            element: <BooksHomePage />,
            handle: { header: { kind: "main", title: "문앞의책방" } } },
          { path: PATHS.booksSearch,
            element: <BooksSearchPage />,
            handle: { header: { kind: "main", title: "문앞의책방" } } },
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
          { path: PATHS.productsDetail,
            element: <ProductDetailPage />},
          { path: PATHS.loungeHome,
            element: <LoungeHomePage />,
            handle: { 
              header: { 
                kind: "main", 
                title: "문앞의책방" 
              } 
            } 
          },
          { path: PATHS.feedHome,
            element: <FeedHomePage />,
            handle: { 
              header: { 
                kind: "main",
                title: "문앞의책방" 
              } 
            }
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
            }
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
