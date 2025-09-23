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
import ProductsHomePage from "../pages/products/ProductsHomePage";
import ProductsSearchPage from "../pages/products/ProductsSearchPage";
import ProductDetailPage from "../pages/products/ProductDetailPage";
import LoungeHomePage from "../pages/lounge/LoungeHomePage";
import FeedHomePage from "../pages/feeds/FeedHomePage";
import NotificationPage from "../pages/official/NotificationPage";
import CartPage from "../pages/purchase/CartPage";
import AccountHomePage from "../pages/account/AccountHomePage";
import AccountSettingsIntroPage from "../pages/account/AccountSettingsIntroPage";
import AccountSettingsProfilePage from "../pages/account/AccountSettingsProfilePage";

import HomeSub1Page from "../pages/HomeSub1Page";
import HomeSub2Page from "../pages/HomeSub2Page";
import HomeSub3Page from "../pages/HomeSub3Page";
import HomeSub4Page from "../pages/HomeSub4Page";
import HomeSub5Page from "../pages/HomeSub5Page";
import BooksSearchPage from "../pages/books/BooksSearchPage";

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
                element: <Navigate to={PATHS.homeSub1Page} replace />
              },
              {
                path: PATHS.homeSub1Page,
                element: <HomeSub1Page />
              },
              {
                path: PATHS.homeSub2Page,
                element: <HomeSub2Page />
              },
              {
                path: PATHS.homeSub3Page,
                element: <HomeSub3Page />
              },
              {
                path: PATHS.homeSub4Page,
                element: <HomeSub4Page />
              },
              {
                path: PATHS.homeSub5Page,
                element: <HomeSub5Page />
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
            handle: { header: { kind: "main", title: "문앞의책방" } } },
          { path: PATHS.productsSearch,
            element: <ProductsSearchPage />},
          { path: PATHS.productsDetail,
            element: <ProductDetailPage />},
          { path: PATHS.loungeHome,
            element: <LoungeHomePage />,
            handle: { header: { kind: "main", title: "문앞의책방" } } },
          { path: PATHS.feedHome,
            element: <FeedHomePage />,
            handle: { header: { kind: "main", title: "문앞의책방" } } },
          { path: PATHS.notification,
            element: <NotificationPage />,
            handle: { header: { kind: "backTitleClose", title: "알림센터" } } },
          { path: PATHS.cart,
            element: <CartPage />,
            handle: { header: { kind: "backTitleClose", title: "장바구니" } } },
          { path: PATHS.accountHome,
            element: <AccountHomePage />,
            handle: { header: { kind: "backTitleClose", title: "관리" } } },
          { path: PATHS.accountSettingsIntroPage,
            element: <AccountSettingsIntroPage />,
            handle: { header: { kind: "backTitleClose", title: "내 정보 관리" } } },
          { path: PATHS.accountSettingsProfilePage,
            element: <AccountSettingsProfilePage />,
            handle: { header: { kind: "backTitleClose", title: "내 정보 관리" } } },
        ],
      },
    ],
  },

  { path: "*", element: <Navigate to={PATHS.intro} replace /> },
]);
