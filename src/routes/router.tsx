import { createBrowserRouter, Navigate } from "react-router-dom";
import { PATHS } from "./paths";

import ResponsiveShell from "../components/layout/ResponsiveShell";
import IntroPage from "../pages/IntroPage";
import LoginPage from "../pages/onboarding/LoginPage"
import HomePage from "../pages/HomePage";
import BooksHomePage from "../pages/books/BooksHomePage";
import ProductsHomePage from "../pages/products/ProductsHomePage";
import LoungeHomePage from "../pages/lounge/LoungeHomePage";
import FeedHomePage from "../pages/feeds/FeedHomePage";
import NotificationPage from "../pages/official/NotificationPage";
import CartPage from "../pages/purchase/CartPage";
import AccountHomePage from "../pages/account/AccountHomePage";
import SignupEmailPage from "../pages/onboarding/SignupEmailPage";

import AuthLayout, { authLoader, AUTH_LOADER_ID } from "./auth.layout";

export const router = createBrowserRouter([
  { path: PATHS.intro, element: <IntroPage /> },
  { path: PATHS.login, element: <LoginPage /> },
  { path: PATHS.signupVerifyEmail, element: <SignupEmailPage /> },
  {
    id: AUTH_LOADER_ID,
    element: <AuthLayout />,
    loader: authLoader,
    children: [
      {
        element: <ResponsiveShell />,
        children: [
          { path: PATHS.home,
            element: <HomePage />,
            handle: { header: { kind: "main", title: "문앞의책방" } } },
          { path: PATHS.booksHome,
            element: <BooksHomePage />,
            handle: { header: { kind: "main", title: "문앞의책방" } } },
          { path: PATHS.productsHome,
            element: <ProductsHomePage />,
            handle: { header: { kind: "main", title: "문앞의책방" } } },
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
        ],
      },
    ],
  },

  { path: "*", element: <Navigate to={PATHS.intro} replace /> },
]);
