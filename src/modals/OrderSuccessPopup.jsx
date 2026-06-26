// components/checkout/OrderSuccessPopup.jsx
const OrderSuccessPopup = ({ onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white rounded-xl p-8 shadow-lg max-w-sm w-full text-center">
        {/* Animated tick */}
        <div className="mx-auto mb-4 w-20 h-20 relative">
          <div className="absolute inset-0 rounded-full bg-green-50 animate-ping" />
          <div className="absolute inset-0 rounded-full flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-green-600 flex items-center justify-center animate-bounce">
              <span className="text-white text-4xl leading-none">✓</span>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-semibold text-green-600 mb-3">
          Order Placed Successfully
        </h2>

        <p className="text-gray-600 mb-6">
          We will get back to you in <strong>24 hrs</strong> and for more information
          contact us.
        </p>

        <button
          onClick={onClose}
          className="bg-yellow-500 cursor-pointer text-white px-5 py-2 rounded-md hover:bg-yellow-600 transition"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default OrderSuccessPopup;

