// src/App.jsx
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import AllVenues from "./pages/AllVenues";
import LoginRegister from "./pages/LoginRegister";
import ProfilePage from "./pages/ProfilePage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<AllVenues />} />
        <Route path="auth" element={<LoginRegister />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>
    </Routes>
  );
}
