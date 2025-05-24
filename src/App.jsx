import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import LoginRegister from "./pages/LoginRegister";
import CustomerProfile from "./components/profiles/CustomerProfile";
import ManagerProfile from "./components/profiles/ManagerProfile";
import AllVenues from "./pages/AllVenues";
import VenueDetails from "./pages/VenueDetails";
import About from "./pages/About";
import GlobeLanding from "./components/GlobeLanding";

function isLoggedIn() {
  return (
    Boolean(localStorage.getItem("token")) ||
    localStorage.getItem("guest") === "true"
  );
}

function ProtectedRoute({ children }) {
  return isLoggedIn() ? children : <Navigate to="/auth" />;
}

export default function App() {
  return (
    <Routes>
      {/* ✅ Route WITHOUT Layout */}
      <Route path="/" element={<GlobeLanding />} />

      {/* ✅ All other routes WITH Layout */}
      <Route element={<Layout />}>
        <Route path="/venues" element={<AllVenues />} />
        <Route path="/venues/:id" element={<VenueDetails />} />
        <Route path="/about" element={<About />} />
        <Route path="/globe" element={<GlobeLanding />} />
        <Route path="/auth" element={<LoginRegister />} />
        <Route
          path="/account/customer"
          element={
            <ProtectedRoute>
              <CustomerProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/account/manager"
          element={
            <ProtectedRoute>
              <ManagerProfile />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  );
}
