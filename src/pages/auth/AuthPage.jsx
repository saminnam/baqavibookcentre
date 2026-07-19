// pages/auth/AuthPage.jsx
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [useOTP, setUseOTP] = useState(false);
  const [form, setForm] = useState({});
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);

  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = isLogin
        ? "https://e-commerce-app-backend1.vercel.app/api/auth/login"
        : "https://e-commerce-app-backend1.vercel.app/api/auth/signup";

      const res = await axios.post(url, form);
      login(res.data);
      navigate(redirectTo);
    } catch (err) {
      const message = err.response?.data?.message || "Auth failed";
      toast.error(message);
    }
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const url = "https://e-commerce-app-backend1.vercel.app/api/auth/send-otp";
      await axios.post(url, { email: form.email, mobile: form.mobile });
      setOtpSent(true);
      toast.success("OTP sent successfully");
    } catch (err) {
      const message = err.response?.data?.message || "Failed to send OTP";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const url = "https://e-commerce-app-backend1.vercel.app/api/auth/verify-otp";
      const res = await axios.post(url, { email: form.email, mobile: form.mobile, otp });
      login(res.data);
      navigate(redirectTo);
      toast.success("Login successful");
    } catch (err) {
      const message = err.response?.data?.message || "Invalid OTP";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen content-font flex items-center justify-center bg-gradient-to-br from-yellow-100 to-yellow-300 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-8">
        {/* Tab Switcher */}
        <div className="flex justify-center mb-6">
          <button
            onClick={() => setIsLogin(true)}
            className={`px-6 py-2 cursor-pointer rounded-tl-lg rounded-bl-lg font-semibold transition ${
              isLogin
                ? "bg-yellow-500 text-white shadow-md"
                : "bg-yellow-100 text-yellow-700"
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`px-6 py-2 cursor-pointer rounded-tr-lg rounded-br-lg font-semibold transition ${
              !isLogin
                ? "bg-yellow-500 text-white shadow-md"
                : "bg-yellow-100 text-yellow-700"
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Login Method Toggle */}
        {isLogin && (
          <div className="flex justify-center mb-4">
            <button
              onClick={() => { setUseOTP(false); setOtpSent(false); }}
              className={`px-4 py-2 cursor-pointer rounded-l-lg font-semibold transition text-sm ${
                !useOTP
                  ? "bg-yellow-500 text-white shadow-md"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              Password
            </button>
            <button
              onClick={() => { setUseOTP(true); setOtpSent(false); }}
              className={`px-4 py-2 cursor-pointer rounded-r-lg font-semibold transition text-sm ${
                useOTP
                  ? "bg-yellow-500 text-white shadow-md"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              OTP
            </button>
          </div>
        )}

        {/* Form */}
        <form onSubmit={useOTP ? (otpSent ? handleVerifyOTP : handleSendOTP) : handleSubmit} className="flex flex-col gap-4">
          {!isLogin && (
            <input
              type="text"
              placeholder="Full Name"
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          )}

          {useOTP ? (
            <>
              <input
                type="text"
                placeholder={form.mobile ? "Mobile Number" : "Email"}
                className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d+$/.test(value) || value === "") {
                    setForm({ ...form, mobile: value, email: "" });
                  } else {
                    setForm({ ...form, email: value, mobile: "" });
                  }
                }}
                value={form.mobile || form.email || ""}
              />
              {otpSent && (
                <input
                  type="text"
                  placeholder="Enter OTP"
                  className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength={6}
                />
              )}
            </>
          ) : (
            <>
              <input
                type="email"
                placeholder="Email"
                className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />

              <input
                type="password"
                placeholder="Password"
                className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="bg-yellow-500 cursor-pointer hover:bg-yellow-600 text-white font-semibold rounded-lg py-2 mt-2 shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Processing..." : (useOTP ? (otpSent ? "Verify OTP" : "Send OTP") : (isLogin ? "Login" : "Create Account"))}
          </button>
        </form>

        {/* Footer Toggle */}
        <p
          onClick={() => { setIsLogin(!isLogin); setUseOTP(false); setOtpSent(false); }}
          className="text-center text-sm text-gray-600 mt-4 cursor-pointer hover:text-gray-800 transition"
        >
          {isLogin
            ? "Don't have an account? Sign Up"
            : "Already have an account? Login"}
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
