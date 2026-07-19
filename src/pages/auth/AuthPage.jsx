// pages/auth/AuthPage.jsx
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const AuthPage = () => {
  const [form, setForm] = useState({});
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);

  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from || "/";

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const url = "https://e-commerce-app-backend1.vercel.app/api/auth/send-otp";
      await axios.post(url, { name: form.name, email: form.email });
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
      const res = await axios.post(url, { email: form.email, otp });
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
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Login with OTP</h2>

        {/* Form */}
        <form onSubmit={otpSent ? handleVerifyOTP : handleSendOTP} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Full Name"
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            disabled={otpSent}
          />

          <input
            type="email"
            placeholder="Email"
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            disabled={otpSent}
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

          <button
            type="submit"
            disabled={loading}
            className="bg-yellow-500 cursor-pointer hover:bg-yellow-600 text-white font-semibold rounded-lg py-2 mt-2 shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Processing..." : (otpSent ? "Verify OTP" : "Send OTP")}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          Enter your name and email to receive an OTP for login
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
