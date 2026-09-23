// pages/auth/AuthPage.jsx
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AuthPage = () => {
  const [form, setForm] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);

  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from || "/";

  const handleGuestCheckout = () => {
    navigate(redirectTo);
    toast.info("Continuing as guest");
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate login - in production this would call your backend
    const mockUser = {
      token: "mock-token-" + Date.now(),
      user: {
        name: form.name || "Guest User",
        email: form.email || "guest@example.com"
      }
    };
    
    login(mockUser);
    navigate(redirectTo);
    setLoading(false);
  };

  return (
    <div className="min-h-screen content-font flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-8">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Welcome to Baqavi Book Centre</h2>

        <div className="space-y-4">
          <button
            onClick={handleGuestCheckout}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold rounded-lg py-3 shadow-md transition"
          >
            Continue as Guest
          </button>

          <div className="text-center text-gray-500">or</div>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Full Name (Optional)"
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />

            <input
              type="email"
              placeholder="Email (Optional)"
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />

            <button
              type="submit"
              disabled={loading}
              className="bg-yellow-500 cursor-pointer hover:bg-yellow-600 text-white font-semibold rounded-lg py-2 mt-2 shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Processing..." : "Login"}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-gray-600 mt-4">
          No authentication required to shop!
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
