import { Routes, Route } from "react-router-dom";
import LoginRegister from "./pages/LoginRegister";
import CustomerProfile from "./components/profiles/CustomerProfile";
import ManagerProfile from "./components/profiles/ManagerProfile";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginRegister />} />
      <Route path="/auth" element={<LoginRegister />} />
      <Route path="/profile" element={<CustomerProfile />} />
      <Route path="/customer" element={<CustomerProfile />} />
      <Route path="/manager" element={<ManagerProfile />} />
    </Routes>
  );
}
