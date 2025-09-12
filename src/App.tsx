import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";

import ResponsiveShell from "./components/layout/ResponsiveShell";
import IntroPage from "./pages/IntroPage";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import BooksHomePage from "./pages/BooksHomePage";
import ProductsHomePage from "./pages/ProductsHomePage";
import LoungeHomePage from "./pages/LoungeHomePage";
import FeedHomePage from "./pages/FeedHomePage";
import AccountHomePage from "./pages/AccountHomePage";
import CartPage from "./pages/CartPage";
import NotificationPage from "./pages/NotificationPage";

const router = createBrowserRouter([
  { path: "/", element: <IntroPage /> },
  { path: "/login", element: <LoginPage /> },
  {
    element: <ResponsiveShell />,
    children: [
      { path: "/home",
        element: <HomePage />,
        handle: { header: { kind: "main", title: "문앞의책방" } } },
      { path: "/books/home",
        element: <BooksHomePage />,
        handle: { header: { kind: "main", title: "문앞의책방" } } },
      { path: "/products/home",
        element: <ProductsHomePage />,
        handle: { header: { kind: "main", title: "문앞의책방" } } },
      { path: "/lounge/home",
        element: <LoungeHomePage />,
        handle: { header: { kind: "main", title: "문앞의책방" } } },
      { path: "/feed/home",
        element: <FeedHomePage />,
        handle: { header: { kind: "main", title: "문앞의책방" } } },
      { path: "/notification",
        element: <NotificationPage />,
        handle: { header: { kind: "backTitleClose", title: "알림센터" } } },
      { path: "/cart",
        element: <CartPage />,
        handle: { header: { kind: "backTitleClose", title: "장바구니" } } },
      { path: "/account/home",
        element: <AccountHomePage />,
        handle: { header: { kind: "backTitleClose", title: "관리" } } },
    ],
  },
  { path: "*", element: <Navigate to="/" replace /> },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
