import { useEffect, useState, useContext } from "react";
import { useProfile } from "../../context/ProfileContext";
import { StoreContext } from "../../context/StoreContext";
import { AuthContext } from "../../context/AuthContext";
import { createOrder } from "../../services/orderService";
import { toast } from "react-toastify";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Building,
  Hash,
  CreditCard,
  Plus,
  Check,
} from "lucide-react";
import OrderSuccessPopup from "../../modals/OrderSuccessPopup";

const CheckoutPage = () => {
  /* ---------------- CONTEXT ---------------- */
  const { profile, updateProfile } = useProfile();
  const { cartItems, getTotalCartAmount, product_list, clearCart } = useContext(StoreContext);

  const { user } = useContext(AuthContext);

  /* ---------------- STATE ---------------- */
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
  });

  const [errors, setErrors] = useState({});
  const [saveAddress, setSaveAddress] = useState(false);


  const [loading, setLoading] = useState(false);
  const [useSavedAddress, setUseSavedAddress] = useState(true); // Default to saved address if available

  /* ---------------- PREFILL FROM PROFILE OR AUTH USER ---------------- */
  useEffect(() => {
    // Use profile data if available, otherwise use auth user data
    const dataSource = profile || user;
    if (dataSource) {
      setForm({
        name: dataSource.name || "",
        email: dataSource.email || "",
        phone: profile?.phone || user?.phone || "",
        address: profile?.address || "",
        city: profile?.city || "",
        postalCode: profile?.postalCode || "",
      });
      // Set useSavedAddress based on whether profile has complete address
      setUseSavedAddress(!!(profile?.address && profile?.city && profile?.postalCode && profile?.phone));
    }
  }, [profile, user]);

  /* ---------------- VALIDATION ---------------- */
  const regex = {
    name: /^[a-zA-Z.\s]{3,}$/,
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    phone: /^[6-9]\d{9}$/,
    postalCode: /^\d{6}$/,
  };

  const validateForm = () => {
    let newErrors = {};
    Object.entries(form).forEach(([key, value]) => {
      let message = "";
      switch (key) {
        case "name": if (!regex.name.test(value)) message = "Enter valid full name"; break;
        case "email": if (!regex.email.test(value)) message = "Enter valid email"; break;
        case "phone": if (!regex.phone.test(value)) message = "Enter valid 10-digit mobile"; break;
        case "address": if (value.trim().length < 5) message = "Address too short"; break;
        case "city": if (value.trim().length < 2) message = "Enter valid city"; break;
        case "postalCode": if (!regex.postalCode.test(value)) message = "Enter valid 6-digit pincode"; break;
        default: break;
      }
      if (message) newErrors[key] = message;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* ---------------- CART → ORDER SUMMARY (Using fetched 'products') ---------------- */
  const orderProducts = Object.keys(cartItems || {})
    .map((id) => {
      const product = product_list?.find((item) => String(item._id) === String(id));

      if (!product || cartItems[id] === 0) return null;

      return {
        ...product,
        quantity: cartItems[id],
        total: product.price * cartItems[id],
      };
    })
    .filter(Boolean);

  const totalItems = orderProducts.reduce((sum, item) => sum + item.quantity, 0);
  const totalMRP = orderProducts.reduce((sum, item) => sum + item.mrp * item.quantity, 0);
  const totalPrice = orderProducts.reduce((sum, item) => sum + item.total, 0);
  const savedAmount = totalMRP - totalPrice;
  const totalAmount = getTotalCartAmount();

  const [showOrderSuccessPopup, setShowOrderSuccessPopup] = useState(false);

  const placeOrder = async () => {
    if (!orderProducts.length) {
      toast.warning("Cart is empty");
      return;
    }
    if (!validateForm()) return;

    setLoading(true);
    try {
      if (saveAddress) {
        await updateProfile(form);
      }

      await createOrder({
        customer: { name: form.name, email: form.email, phone: form.phone },
        shippingAddress: { street: form.address, city: form.city, postalCode: form.postalCode },
        products: orderProducts.map((p) => ({
          productId: p._id,
          quantity: p.quantity,
          price: p.price,
        })),
        totalAmount,
      });

      setForm({ name: "", email: "", phone: "", address: "", city: "", postalCode: "" });
      setSaveAddress(false);

      // Show animated success popup first
      setShowOrderSuccessPopup(true);

      // Clear cart immediately after order is placed
      clearCart();

    } catch (error) {

      toast.error("❌ Order failed. Please try again.");
    } finally {

      setLoading(false);
    }
  };

  const fields = [
    { key: "name", icon: User, label: "Full Name" },
    { key: "email", icon: Mail, label: "Email Address" },
    { key: "phone", icon: Phone, label: "Mobile Number" },
    { key: "address", icon: MapPin, label: "Address", textarea: true },
    { key: "city", icon: Building, label: "City" },
    { key: "postalCode", icon: Hash, label: "Postal Code" },
  ];

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-12">
      {showOrderSuccessPopup && (
        <OrderSuccessPopup onClose={() => setShowOrderSuccessPopup(false)} />
      )}
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10">
        {/* LEFT: FORM */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <CreditCard className="text-yellow-500" />
            <h2 className="text-2xl font-semibold content-font">Shipping Details</h2>
          </div>

          {/* Address Selection */}
          {profile && (profile.address || profile.city || profile.postalCode) && (
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="font-medium text-gray-800 mb-3">Select Shipping Address:</p>
              <div className="space-y-3">
                {/* Saved Address Option */}
                <div
                  onClick={() => {
                    setUseSavedAddress(true);
                    setForm({
                      name: profile.name || "",
                      email: profile.email || "",
                      phone: profile.phone || "",
                      address: profile.address || "",
                      city: profile.city || "",
                      postalCode: profile.postalCode || "",
                    });
                  }}
                  className={`p-3 border-2 rounded-lg cursor-pointer transition ${
                    useSavedAddress
                      ? "border-yellow-500 bg-yellow-100"
                      : "border-gray-200 hover:border-yellow-300"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      {useSavedAddress ? (
                        <Check className="text-yellow-600" size={18} />
                      ) : (
                        <div className="w-4 h-4 border-2 border-gray-300 rounded" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">Saved Address</p>
                      <p className="text-sm text-gray-600 mt-1">
                        {profile.name}, {profile.address}, {profile.city} - {profile.postalCode}
                      </p>
                      <p className="text-sm text-gray-600">{profile.phone}</p>
                    </div>
                  </div>
                </div>

                {/* New Address Option */}
                <div
                  onClick={() => {
                    setUseSavedAddress(false);
                    setForm({
                      name: profile.name || "",
                      email: profile.email || "",
                      phone: profile.phone || "",
                      address: "",
                      city: "",
                      postalCode: "",
                    });
                  }}
                  className={`p-3 border-2 rounded-lg cursor-pointer transition ${
                    !useSavedAddress
                      ? "border-yellow-500 bg-yellow-100"
                      : "border-gray-200 hover:border-yellow-300"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      {!useSavedAddress ? (
                        <Check className="text-yellow-600" size={18} />
                      ) : (
                        <div className="w-4 h-4 border-2 border-gray-300 rounded" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800 flex items-center gap-2">
                        <Plus size={16} /> New Address
                      </p>
                      <p className="text-sm text-gray-600 mt-1">Enter a new shipping address</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-5">
            {fields.map(({ key, icon: Icon, label, textarea }) => (
              <div key={key}>
                <label className="text-sm font-medium text-gray-600">{label}</label>
                <div className={`mt-1 flex gap-3 border rounded-lg px-4 py-3 ${errors[key] ? "border-red-500" : "border-gray-300"}`}>
                  <Icon size={18} className="text-gray-500 mt-1" />
                  {textarea ? (
                    <textarea rows={3} value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} className="w-full resize-none outline-none bg-transparent" />
                  ) : (
                    <input type="text" value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} className="w-full outline-none bg-transparent" />
                  )}
                </div>
                {errors[key] && <p className="text-red-500 text-xs mt-1">{errors[key]}</p>}
              </div>
            ))}

            {!useSavedAddress && (
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={saveAddress}
                  onChange={(e) => setSaveAddress(e.target.checked)}
                />
                <span className="text-sm">Save this address to profile for future orders</span>
              </label>
            )}

            <button onClick={placeOrder} disabled={loading} className="w-full cursor-pointer bg-yellow-500 hover:bg-yellow-600 text-white py-4 rounded-xl font-semibold transition-colors">
              {loading ? "Placing Order..." : "Place Order"}
            </button>
          </div>
        </div>

        {/* RIGHT: SUMMARY */}
        <div className="bg-white rounded-2xl shadow-xl p-8 sticky top-24 h-fit">
          <h3 className="text-xl font-semibold mb-6 border-b border-gray-300 pb-6 content-font">🧾 Order Summary</h3>

          {orderProducts.length === 0 ? (
             <p className="text-gray-500 text-center py-4">Your cart is empty</p>
          ) : (
            orderProducts.map((item) => (
              <div key={item._id} className="flex justify-between mb-3">
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                </div>
                <p className="font-semibold text-[#E5B236]">₹{item.total}</p>
              </div>
            ))
          )}

          <div className="pt-4 mt-4 border-t border-gray-300">
            <div className="space-y-2 font-medium">
              <div className="flex justify-between">
                <span>Total Items:</span>
                <span>{totalItems}</span>
              </div>
              <div className="flex justify-between text-green-600">
                <span>Saved Amount:</span>
                <span>₹{savedAmount}</span>
              </div>
            </div>
            <div className="flex justify-between border-t border-gray-300 mt-4 pt-4 font-bold text-lg">
              <span>Total Payable</span>
              <span className="text-[#E5B236]">₹{totalAmount}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;