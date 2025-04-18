import { Routes, Route } from "react-router-dom";
import LoginRegister from "./pages/LoginRegister";
import CustomerProfile from "./components/CustomerProfile";
import ManagerProfile from "./components/ManagerProfile";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginRegister />} />
      <Route path="/customer" element={<CustomerProfile />} />
      <Route path="/manager" element={<ManagerProfile />} />
    </Routes>
  );
}

export default App;
