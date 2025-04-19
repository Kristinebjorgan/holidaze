import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser, loginUser } from "../api";

function LoginRegister() {
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isManager, setIsManager] = useState(false);

  const navigate = useNavigate();

  const validate = () => {
    const errors = [];

    if (mode === "register") {
      if (!/^[\w]+$/.test(name)) {
        errors.push(
          "Username must only contain letters, numbers, and underscores."
        );
      }
      if (!email.endsWith("@stud.noroff.no")) {
        errors.push("Email must be a stud.noroff.no address.");
      }
      if (password.length < 8) {
        errors.push("Password must be at least 8 characters.");
      }
      if (password !== confirmPassword) {
        errors.push("Passwords do not match.");
      }
    }

    if (mode === "login") {
      if (!email || !password) {
        errors.push("Email and password are required.");
      }
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validate();
    if (errors.length) {
      alert(errors.join("\n"));
      return;
    }

    if (mode === "register") {
      const response = await registerUser({
        name,
        email,
        password,
        venueManager: isManager,
      });

      if (response?.data?.email) {
        // auto-login after successful registration
        const loginResponse = await loginUser({ email, password });

        if (loginResponse?.data?.accessToken) {
          localStorage.setItem("token", loginResponse.data.accessToken);
          localStorage.setItem("user", JSON.stringify(loginResponse.data));

          // redirect to profile after registration
          const destination = loginResponse.data.venueManager
            ? "/account/manager"
            : "/account/customer";
          navigate(destination);
        } else {
          alert("Registration succeeded, but auto-login failed.");
        }
      } else {
        alert("Registration failed.");
      }
    }

    if (mode === "login") {
      const response = await loginUser({ email, password });

      if (response?.data?.accessToken) {
        localStorage.setItem("token", response.data.accessToken);
        localStorage.setItem("user", JSON.stringify(response.data));

        // redirect to homepage after login
        navigate("/");
      } else {
        alert("Login failed.");
      }
    }
  };

  return (
    <div className="p-6 max-w-xs mx-auto text-center">
      <h2 className="text-lg font-medium mb-6 text-[#D94C4C]">{mode}</h2>

      <form onSubmit={handleSubmit} className="flex flex-col">
        {mode === "register" && (
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="name"
            className="mb-4 text-center border-b border-gray-300 focus:outline-none"
          />
        )}

        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email"
          className="mb-4 text-center border-b border-gray-300 focus:outline-none"
        />

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="password"
          className="mb-4 text-center border-b border-gray-300 focus:outline-none"
        />

        {mode === "register" && (
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="confirm password"
            className="mb-4 text-center border-b border-gray-300 focus:outline-none"
          />
        )}

        {mode === "register" && (
          <div className="flex justify-around text-sm mb-4">
            <button
              type="button"
              className={`${!isManager ? "border-b-2 border-[#7A92A7]" : ""}`}
              onClick={() => setIsManager(false)}
            >
              explorer
            </button>
            <button
              type="button"
              className={`${isManager ? "border-b-2 border-[#7A92A7]" : ""}`}
              onClick={() => setIsManager(true)}
            >
              manager
            </button>
          </div>
        )}

        <button
          type="submit"
          className="bg-[#3C6FF0] text-white py-2 mt-2 text-sm"
        >
          {mode}
        </button>
      </form>

      <button
        onClick={() => setMode(mode === "login" ? "register" : "login")}
        className="mt-4 text-sm text-blue-600 underline"
      >
        {mode === "login" ? "register" : "login"}
      </button>
    </div>
  );
}

export default LoginRegister;
