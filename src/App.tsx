import { useLayoutEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { router } from './routes/router';
import './styles/App.css';

export default function App() {
  useLayoutEffect(() => {
    // Calculate and set CSS variable for 1% viewport height (for iOS Safari)
    const setVH = () =>
      document.documentElement.style.setProperty(
        "--vh",
        `${window.innerHeight * 0.01}px`
      );
    setVH();
    window.addEventListener("resize", setVH);
    return () => window.removeEventListener("resize", setVH);
  }, []);

  return (
    <div className="app-shell">
      <RouterProvider router={router} />
    </div>
  );
}
