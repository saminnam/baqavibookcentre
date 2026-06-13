import { useContext } from "react";
import { StoreContext } from "../context/StoreContext";
import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  const { addToCart } = useContext(StoreContext);
  const inStock = Number(product.stock) > 0;
  const isHidden = product?.status === "inactive";

  return (
    <div className="border rounded-xl shadow hover:shadow-lg p-4 transition bg-white">
      <Link to={`/product/${product.slug || product._id}`}>
        <div className="relative">
          <img
            src={product.image}
            alt={product.name}
            className={`w-full h-48 object-cover rounded-md mb-3 transition ${
              isHidden ? "filter blur-[2px] opacity-70 scale-[1.02]" : ""
            }`}
          />

          {isHidden && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-md">
              <span className="px-3 py-1 text-xs font-bold rounded-full bg-slate-900/70 text-white backdrop-blur">
                Currently no available
              </span>
            </div>
          )}
        </div>

        <div className="mb-2 flex items-center justify-between gap-2">
          <h3 className="text-lg font-semibold">{product.name}</h3>
          <span
            className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
              isHidden
                ? "bg-slate-200 text-slate-700"
                : inStock
                ? "bg-emerald-100 text-emerald-700"
                : "bg-rose-100 text-rose-700"
            }`}
          >
            {isHidden
              ? "Not available"
              : inStock
              ? `In stock (${product.stock})`
              : "Currently unavailable"}
          </span>
        </div>
      </Link>

      <p className="text-gray-700 mt-1 mb-2">₹{Number(product.price || 0).toLocaleString("en-IN")}</p>

      <button
        onClick={() => addToCart(product)}
        disabled={!inStock || isHidden}
        className="w-full rounded-md bg-yellow-500 py-2 text-white transition hover:bg-yellow-600 disabled:cursor-not-allowed disabled:bg-gray-400"
      >
        {isHidden ? "Unavailable" : inStock ? "Add to Cart" : "Out of Stock"}
      </button>
    </div>
  );
};

export default ProductCard;
