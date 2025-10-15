import React, { useState } from "react";
import { useAuthModal } from "../contexts/AuthModalContext";
import { useAuth } from "../contexts/AuthContext";

const AuthModal = () => {
  const { isOpen, mode, close, setMode } = useAuthModal();
  const { login, register } = useAuth();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    emailNotifications: true,
  });
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const isSignUp = mode === 'register'

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (mode === "login") {
        if (!form.email || !form.password)
          throw new Error("Email and password are required");
        const res = await login(form.email, form.password);
        if (!res || res.success === false)
          throw new Error(res?.error || "Login failed");
      } else {
        if (!form.name || !form.email || !form.password)
          throw new Error("Name, email and password are required");
        if (form.password !== form.confirmPassword)
          throw new Error("Passwords do not match");
        if (form.password.length < 6)
          throw new Error("Password must be at least 6 characters");
        const { confirmPassword, ...registerData } = form;
        const res = await register(registerData);
        if (!res || res.success === false)
          throw new Error(res?.error || "Registration failed");
      }
      // success
      close();
    } catch (err) {
      // Prefer backend error message when available (axios)
      const serverMsg =
        err?.response?.data?.error || err?.response?.data?.message;
      setError(serverMsg || err.message || "Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md">
      <div className="grid grid-cols-2 gap-6 w-[900px] rounded-2xl overflow-hidden shadow-2xl bg-white/10">
        {/* Left panel - visual */}
        <div className="relative bg-gradient-to-br from-neon-blue to-neon-purple p-8 flex flex-col justify-between">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">
              Welcome to EarthSlight
            </h2>
            <p className="text-sm text-white/90 mb-6">
              AI-powered environmental intelligence with real-time alerts and
              predictions.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-white/90" />
                <span className="text-white text-sm">Real-time alerts</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-white/90" />
                <span className="text-white text-sm">
                  AI real-estate predictions
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-white/90" />
                <span className="text-white text-sm">Global coverage</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="three-body" style={{ "--uib-color": "#fff" }}>
              <div className="three-body__dot" />
              <div className="three-body__dot" />
              <div className="three-body__dot" />
            </div>
            <div className="text-right text-white/80 text-sm">
              Secure · Fast · Accurate
            </div>
          </div>
          <span className="text-2xl font-bold text-gray-800">earthsight</span>
        </div>

        {/* Right panel - form */}
        <div className="bg-dark-900 p-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold">
              {mode === "login" ? "Sign in" : "Create account"}
            </h3>
            <div className="space-x-2">
              <button
                onClick={() => setMode("login")}
                className={`px-3 py-1 rounded bg-blue-600 ${
                  mode === "login" ? "bg-neon-blue text-black" : "text-gray-400"
                }`}
              >
                Sign in
              </button>
              <button
                onClick={() => setMode("register")}
                className={`px-3 py-1 rounded bg-yellow-500 ${
                  mode === "register"
                    ? "bg-neon-blue text-black"
                    : "text-gray-100"
                }`}
              >
                Register
              </button>
            </div>
          </div>
        </div>

        {/* Sign In Form */}
        <div
          className={`absolute top-0 left-0 w-1/2 h-full flex items-center justify-center p-12 transition-all duration-700 ease-in-out ${
            isSignUp ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
        >
          <div className="w-full max-w-sm">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Sign in to Account</h2>
            <p className="text-gray-500 mb-8">Use your email account</p>

          <form onSubmit={submit} className="space-y-4">
            {mode === "register" && (
              <input
                name="name"
                placeholder="Full name"
                value={form.name}
                onChange={onChange}
                className="w-full p-3 rounded bg-white/5 placeholder-gray-400"
              />
            )}
            <input
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={onChange}
              className="w-full p-3 rounded bg-white/5 placeholder-gray-400"
            />
            <input
              name="password"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={onChange}
              className="w-full p-3 rounded bg-white/5 placeholder-gray-400"
            />
            {mode === "register" && (
              <input
                name="confirmPassword"
                type="password"
                placeholder="Confirm password"
                value={form.confirmPassword}
                onChange={onChange}
                className="w-full p-3 rounded bg-white/5 placeholder-gray-400"
              />
            )}

            {mode === "register" && (
              <label className="flex items-center space-x-3 text-sm">
                <input
                  type="checkbox"
                  name="emailNotifications"
                  checked={form.emailNotifications}
                  onChange={onChange}
                  className="h-4 w-4"
                />
                <span className="text-gray-300">
                  Receive environmental alerts via email
                </span>
              </label>

            <div className="flex items-center justify-between">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary px-6 py-3 flex items-center gap-3"
              >
                {loading ? (
                  <div className="three-body" style={{ "--uib-color": "#000" }}>
                    <div className="three-body__dot" />
                    <div className="three-body__dot" />
                    <div className="three-body__dot" />
                  </div>
                ) : null}
                <span>{mode === "login" ? "Sign in" : "Create account"}</span>
              </button>
              <button
                type="button"
                onClick={close}
                className="text-sm text-gray-400"
              >
                Close
              </button>
            </div>
          </form>

          <div className="mt-6 text-center text-sm text-gray-500">
            By continuing, you agree to our Terms & Privacy.
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
