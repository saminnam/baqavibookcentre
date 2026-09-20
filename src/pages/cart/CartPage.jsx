import { useContext } from "react";
import { StoreContext } from "../../context/StoreContext";
import { Link, useNavigate } from "react-router-dom";
import { Trash2, Minus, Plus } from "lucide-react";
import GlobalHero from "../../components/GlobalHero";

const CartPage = () => {
  const {
    cartItems,
    product_list,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    clearCart,
  } = useContext(StoreContext);
  const navigate = useNavigate();

  const cartProducts = product_list.filter((p) => cartItems[p._id]);

  return (
    <>
      <GlobalHero title={"🛒 Your Cart"}/>
      <div className="container mx-auto max-w-7xl px-4 py-10 content-font">
        {cartProducts.length === 0 ? (
          <div className="text-center py-10 text-gray-600">
            <p className="text-lg">Your cart is empty.</p>
            <button
              onClick={() => navigate("/")}
              className="mt-4 bg-yellow-500 cursor-pointer text-white px-6 py-2 rounded hover:bg-yellow-600 transition"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="bg-white shadow-md rounded-lg">
            {/* Wrapper to enable horizontal scroll on mobile */}
            <div className="overflow-x-auto md:overflow-y-auto scrollbar">
              <div className="min-w-[700px] max-h-[500px]">
                {/* Cart Header */}
                <div className="grid grid-cols-6 text-[12px] md:text-[15px] font-semibold bg-gray-100 text-gray-700 p-3">
                  <p className="col-span-2 text-center">Product</p>
                  <p className="text-center">Price</p>
                  <p className="text-center">Offer Price</p>
                  <p className="text-center">Quantity</p>
                  <p className="text-center">Action</p>
                </div>

                {/* Cart Items */}
                {cartProducts.map((product) => (
                  <div
                    key={product._id}
                    className="grid grid-cols-6 items-center border-t border-gray-300 p-4 hover:bg-gray-50 transition"
                  >
                    {/* Product Info */}
                    <div className="col-span-2 flex items-center gap-4">
                      <Link to={`/product/${product.slug}`}>
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-20 h-20 object-cover rounded-md border border-gray-300"
                        />
                      </Link>
                      <div>
                        <h3 className="font-semibold text-[13px] md:text-[16px] text-gray-800 truncate overflow-hidden whitespace-nowrap w-[120px] md:w-[200px]">
                          {product.name}
                        </h3>

                        {/* <p className="text-sm text-gray-500">
                        {product.description?.slice(0, 40)}...
                      </p> */}
                      </div>
                    </div>

                    {/* Price */}
                    <p className="text-center text-gray-600 text-[12px] md:text-[15px]">
                      ₹{product.mrp}
                    </p>

                    {/* Offer Price */}
                    <p className="text-center text-[12px] md:text-[15px] text-green-600 font-semibold">
                      ₹{product.price}
                    </p>

                    {/* Quantity Controls */}
                    <div className="flex justify-center items-center gap-3 text-gray-600">
                      <button
                        onClick={() => removeFromCart(product)}
                        className="bg-gray-200 cursor-pointer p-1 rounded hover:bg-gray-300"
                      >
                        <Minus size={16} />
                      </button>

                      <span className="md:text-[15px] text-[12px] font-medium">
                        {cartItems[product._id] || 0}
                      </span>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          addToCart(product);
                        }}
                        className="bg-gray-200 cursor-pointer p-1 rounded hover:bg-gray-300"
                      >
                        <Plus size={16} />
                      </button>
                    </div>

                    {/* Remove Button */}
                    <div className="flex justify-center">
                      <button
                        onClick={() => removeFromCart(product, true)}
                        className="text-red-600 cursor-pointer  hover:text-red-700 transition"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="flex md:flex-nowrap flex-wrap text-[12px] md:text-[15px] md:flex-row justify-between items-center gap-4 border-t border-gray-300 p-6 bg-gray-50">
              <button
                onClick={clearCart}
                className="bg-[#111825] text-white px-6 py-2 cursor-pointer rounded hover:bg-red-600 transition"
              >
                Clear Cart
              </button>

              <h2 className="text-lg md:text-xl font-semibold text-gray-800">
                Total: ₹{getTotalCartAmount().toLocaleString()}
              </h2>

              <button
                onClick={() => navigate("/checkout")}
                className="bg-[#e5b236] text-white px-8 py-2 rounded cursor-pointer hover:bg-yellow-600 transition"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CartPage;
