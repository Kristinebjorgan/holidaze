import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import LoginRegister from "./pages/LoginRegister";
import CustomerProfile from "./components/profiles/CustomerProfile";
import ManagerProfile from "./components/profiles/ManagerProfile";
import AllVenues from "./pages/AllVenues";
import VenueDetails from "./pages/VenueDetails";
import About from "./pages/About";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<AllVenues />} />
        <Route path="/auth" element={<LoginRegister />} />
        <Route path="/account/customer" element={<CustomerProfile />} />
        <Route path="/account/manager" element={<ManagerProfile />} />
        <Route path="/venues/:id" element={<VenueDetails />} />
        <Route path="/about" element={<About />} />
      </Route>
    </Routes>
  );
}
