import { createBrowserRouter, Navigate } from "react-router-dom";
import { PATHS } from "./paths";

import ResponsiveShell from "../components/layout/ResponsiveShell";
import IntroPage from "../pages/IntroPage";
import LoginPage from "../pages/LoginPage";
import HomePage from "../pages/HomePage";
import BooksHomePage from "../pages/BooksHomePage";
import ProductsHomePage from "../pages/ProductsHomePage";
import LoungeHomePage from "../pages/LoungeHomePage";
import FeedHomePage from "../pages/FeedHomePage";
import NotificationPage from "../pages/NotificationPage";
import CartPage from "../pages/CartPage";
import AccountHomePage from "../pages/AccountHomePage";

import AuthLayout, { authLoader, AUTH_LOADER_ID } from "./auth.layout";

export const router = createBrowserRouter([
  { path: PATHS.intro, element: <IntroPage /> },
  { path: PATHS.login, element: <LoginPage /> },
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
