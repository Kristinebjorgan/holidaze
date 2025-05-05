import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser, loginUser } from "../api";

export default function LoginRegister() {
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
      if (!/^[\w]+$/.test(name)) errors.push("username must be valid.");
      if (!email.endsWith("@stud.noroff.no"))
        errors.push("use a stud.noroff.no email.");
      if (password.length < 8)
        errors.push("password must be at least 8 characters.");
      if (password !== confirmPassword) errors.push("passwords do not match.");
    } else {
      if (!email || !password) errors.push("email and password required.");
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validate();
    if (errors.length) return alert(errors.join("\n"));

    try {
      if (mode === "register") {
        const res = await registerUser({
          name,
          email,
          password,
          venueManager: isManager,
        });
        if (res?.data?.email) {
          const loginRes = await loginUser({ email, password });
          if (loginRes?.data?.accessToken) {
            localStorage.setItem("token", loginRes.data.accessToken);
            localStorage.setItem("user", JSON.stringify(loginRes.data));
            navigate(
              loginRes.data.venueManager
                ? "/account/manager"
                : "/account/customer"
            );
          } else alert("registration ok, login failed.");
        } else alert("registration failed.");
      }

      if (mode === "login") {
        const res = await loginUser({ email, password });
        if (res?.data?.accessToken) {
          localStorage.setItem("token", res.data.accessToken);
          localStorage.setItem("user", JSON.stringify(res.data));
          navigate("/");
        } else alert("login failed.");
      }
    } catch (err) {
      alert("something went wrong.");
    }
  };

  return (
    <div className="px-6 py-20 max-w-xs mx-auto text-center text-[#7A92A7] lowercase text-sm">
      {/* Mode toggle */}
      <div className="flex justify-center gap-6 mb-10">
        <button
          type="button"
          onClick={() => setMode("login")}
          className={`hover:underline ${mode === "login" ? "underline" : ""}`}
        >
          login
        </button>
        <button
          type="button"
          onClick={() => setMode("register")}
          className={`hover:underline ${mode === "register" ? "underline" : ""}`}
        >
          register
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {mode === "register" && (
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="full name"
            className="text-center bg-transparent focus:outline-none"
          />
        )}

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email"
          className="text-center bg-transparent focus:outline-none"
        />

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="password"
          className="text-center bg-transparent focus:outline-none"
        />

        {mode === "register" && (
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="confirm password"
            className="text-center bg-transparent focus:outline-none"
          />
        )}

        {mode === "register" && (
          <>
            <p className="mt-2">im a</p>
            <div className="flex justify-center gap-6">
              <button
                type="button"
                onClick={() => setIsManager(false)}
                className={`${!isManager ? "underline" : ""} hover:underline`}
              >
                explorer
              </button>
              <button
                type="button"
                onClick={() => setIsManager(true)}
                className={`${isManager ? "underline" : ""} hover:underline`}
              >
                manager
              </button>
            </div>
          </>
        )}

        <button
          type="submit"
          className="mt-6 text-s text-[#7A92A7] hover:underline hover:opacity-80"
        >
          {mode}
        </button>
      </form>
    </div>
  );
}
