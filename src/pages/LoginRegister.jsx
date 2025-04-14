// src/pages/LoginRegister.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../api";

export default function LoginRegister() {
  const [mode, setMode] = useState("login"); // "login" or "register"
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isManager, setIsManager] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Clear placeholder on focus and restore on blur if empty.
  const handleFocus = (e) => {
    e.target.dataset.placeholder = e.target.placeholder;
    e.target.placeholder = "";
  };
  const handleBlur = (e) => {
    if (e.target.value.trim() === "") {
      e.target.placeholder = e.target.dataset.placeholder;
    }
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    if (mode === "register") {
      // Registration validations.
      if (!email.endsWith("@stud.noroff.no")) {
        setError("Email must be a stud.noroff.no address");
        return;
      }
      if (password.length < 8) {
        setError("Password must be at least 8 characters.");
        return;
      }
      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }

      const payload = {
        name,
        email,
        password,
        venueManager: isManager, // true if manager, false if explorer.
        bio: "created via holidaze", // tag for our site.
      };

      try {
        // Registration endpoint with query parameters.
        const regData = await apiFetch("/auth/register?_holidaze=true", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        console.log("Registration response data:", regData);

        if (regData.data?.accessToken) {
          localStorage.setItem("holidazeToken", regData.data.accessToken);
          // Always explicitly store the role:
          localStorage.setItem("userRole", isManager ? "manager" : "explorer");
          navigate("/profile");
        } else {
          // Auto-login if the registration response didn't include a token.
          const loginPayload = { email, password };
          const loginData = await apiFetch("/auth/login?_holidaze=true", {
            method: "POST",
            body: JSON.stringify(loginPayload),
          });
          console.log("Auto-login response data:", loginData);
          if (loginData.data?.accessToken) {
            localStorage.setItem("holidazeToken", loginData.data.accessToken);
            localStorage.setItem(
              "userRole",
              isManager ? "manager" : "explorer"
            );
            navigate("/profile");
          } else {
            setError(
              "Registered successfully, but auto-login failed. Please log in."
            );
          }
        }
      } catch (err) {
        setError(err.message);
      }
    } else {
      // Login mode.
      const payload = { email, password };
      try {
        const loginData = await apiFetch("/auth/login?_holidaze=true", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        console.log("Login response data:", loginData);
        if (loginData.data?.accessToken) {
          localStorage.setItem("holidazeToken", loginData.data.accessToken);
          // Store the role returned by the API, or fallback to explorer if not provided.
          localStorage.setItem(
            "userRole",
            loginData.data.venueManager ? "manager" : "explorer"
          );
          navigate("/profile");
        } else {
          setError("Login succeeded, but no access token returned.");
        }
      } catch (err) {
        setError(err.message);
      }
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-[#7A92A7] font-thin lowercase">
      <nav className="mb-8 flex space-x-6">
        <button
          type="button"
          className={`pb-1 ${mode === "login" ? "border-b-2 border-[#7A92A7]" : ""}`}
          onClick={() => setMode("login")}
        >
          login
        </button>
        <button
          type="button"
          className={`pb-1 ${mode === "register" ? "border-b-2 border-[#7A92A7]" : ""}`}
          onClick={() => setMode("register")}
        >
          register
        </button>
      </nav>
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-xs flex flex-col items-center text-center"
      >
        {/* In register mode, display fields in this order: */}
        {/* 1. Name */}
        {mode === "register" && (
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder="name"
            className="mb-4 outline-none p-2 text-center"
          />
        )}
        {/* 2. Email */}
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder="email"
          className="mb-4 outline-none p-2 text-center"
        />
        {/* 3. Password */}
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder="password"
          className="mb-4 outline-none p-2 text-center"
        />
        {/* 4. Confirm Password (only in register mode) */}
        {mode === "register" && (
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder="confirm password"
            className="mb-4 outline-none p-2 text-center"
          />
        )}
        {/* 5. Explorer/Manager Toggle (only in register mode) */}
        {mode === "register" && (
          <div className="flex justify-around mb-4 w-full">
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
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <button
          type="submit"
          className="text-[#7A92A7] no-underline hover:underline focus:outline-none"
        >
          {mode === "login" ? "login" : "submit"}
        </button>
      </form>
    </div>
  );
}
