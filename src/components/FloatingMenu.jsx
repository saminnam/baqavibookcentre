import React, { useContext } from "react";
import { Home, ShoppingCart, Filter, Store, User } from "lucide-react";
import { StoreContext } from "../context/StoreContext";
import { Link } from "react-router-dom";
import logo from "../assets/images/logo-bg.png";

const FloatingMenu = () => {
  const { menuOpen, setMenuOpen, showFilter, setShowFilter, cartItems } = useContext(StoreContext);

  return (
    <div className="md:hidden block fixed bottom-0 left-1/2 -translate-x-1/2 w-full bg-[#111825] backdrop-blur-2xl text-[#E5B236]  border border-white/20 flex justify-around py-3 px-2 z-40">
      {/* Menu */}
      <Link
        to={"/"}
        className="flex flex-col items-center gap-1 text-sm transition-all duration-200 "
      >
        <Home size={18} />
        <span className="text-[10px] uppercase font-medium">Home</span>
      </Link>

      {/* shop */}
      <Link
        to={"/products"}
        className="flex flex-col items-center gap-1 text-sm transition-all duration-200"
      >
        <Store size={18} />
        <span className="text-[10px] uppercase font-medium">Shop</span>
      </Link>

      <Link
        to={"/"}
        className="-mt-10"
      >
        <img
          src={logo}
          alt="baqavi-book-centre-logo"
          className="w-[80px]"
        />
      </Link>
      {/* Filter */}
      {/* <button
        className="flex flex-col items-center gap-1 text-sm transition-all duration-200"
        onClick={() => setShowFilter(true)}
      >
        <Filter size={18} />
        <span className="text-[10px] uppercase font-medium">Filter</span>
      </button> */}

      {/* Profile */}


      {/* Cart */}
      <Link
        to={"/cart"}
        className="flex flex-col items-center gap-1 text-sm transition-all duration-200"
      >
        <div className="relative">
          <ShoppingCart size={18} />
          <div
            className={`cart-badge bg-[#E5B236] text-white ${Object.keys(cartItems).length > 0
                ? "opacity-100 scale-100"
                : "opacity-0 scale-0"
              }`}
          >
            {Object.keys(cartItems).length > 0
              ? Object.keys(cartItems).length
              : null}
          </div>
        </div>
        <span className="text-[10px] uppercase font-medium">Cart</span>
      </Link>
      <Link
        to={"/auth"}
        className="flex flex-col items-center gap-1 text-sm transition-all duration-200"
      >
        <User size={18} />
        <span className="text-[10px] uppercase font-medium">Profile</span>
      </Link>
    </div>
  );
};

export default FloatingMenu;
