import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

export default function Layout() {
  const location = useLocation();
  const isLanding = location.pathname === "/";

  return (
    <div className="flex flex-col min-h-screen">
      {!isLanding && <Header />}
      <main className="flex-1">
        <Outlet />
      </main>
      {!isLanding && <Footer />}
    </div>
  );
}
