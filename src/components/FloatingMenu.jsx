import React, { useContext } from "react";
import { Home, ShoppingCart, Filter, Store } from "lucide-react";
import { StoreContext } from "../context/StoreContext";
import { Link } from "react-router-dom";

const FloatingMenu = () => {
  const { menuOpen, setMenuOpen, showFilter, setShowFilter } =
    useContext(StoreContext);

  return (
    <div className="md:hidden block fixed bottom-0 left-1/2 -translate-x-1/2 w-full bg-[#11182575]/30 backdrop-blur-2xl text-white  border border-white/20 flex justify-around py-3 px-2 z-40">
      {/* Menu */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="flex flex-col items-center gap-1 text-sm transition-all duration-200 "
      >
        <Home size={18} />
        <span className="text-[10px] uppercase font-medium">Menu</span>
      </button>

      {/* shop */}
      <Link
        to={"/products"}
        className="flex flex-col items-center gap-1 text-sm transition-all duration-200"
      >
        <Store size={18} />
        <span className="text-[10px] uppercase font-medium">Shop</span>
      </Link>

      {/* Filter */}
      <button
        className="flex flex-col items-center gap-1 text-sm transition-all duration-200"
        onClick={() => setShowFilter(true)}
      >
        <Filter size={18} />
        <span className="text-[10px] uppercase font-medium">Filter</span>
      </button>

      {/* Profile */}
      {/* <Link
        to={"/profile"}
        className="flex flex-col items-center gap-1 text-sm transition-all duration-200"
      >
        <User size={18} />
        <span className="text-[10px] uppercase font-medium">Profile</span>
      </Link> */}

      {/* Cart */}
      <Link
        to={"/cart"}
        className="flex flex-col items-center gap-1 text-sm transition-all duration-200"
      >
        <ShoppingCart size={18} />
        <span className="text-[10px] uppercase font-medium">Cart</span>
      </Link>
    </div>
  );
};

export default FloatingMenu;
