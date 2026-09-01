import React, { useEffect, useRef, useState } from "react";

import {
  Menu,
  X,
  ShoppingCart,
  Heart,
  User,
  Search,
  ChevronDown,
  LogIn,
  LogOut,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { StoreContext } from "../context/StoreContext";

import logo from "../assets/images/logo-bg.png";
import MobileSearchBar from "../components/MobileSearchBar";
import { policyData } from "../data/policyData";
import PolicyPopup from "../modals/PolicyPopup";
import { AuthContext } from "../context/AuthContext";
const Navbar = () => {
  const [categoryOpen, setCategoryOpen] = useState(false);
  const { menuOpen, setMenuOpen, cartItems, categoryOptions, products } = useContext(StoreContext);

  const navigate = useNavigate();
  const [navbarSearch, setNavbarSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const handleLogout = () => {
    logout();
    navigate("/auth"); // Redirect to login page after logout
  };
  const openPolicy = (id) => {
    const found = policyData.find((p) => p.id === id);
    setSelectedPolicy(found);
    setIsOpen(true);
  };

  const handleSearch = (overrideValue) => {
    const q = (overrideValue ?? navbarSearch).trim();
    if (q !== "") {
      navigate(`/products?search=${encodeURIComponent(q)}`);
    } else {
      // If user clears input, reset products list by removing query param
      navigate(`/products`);
    }
  };



  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    navigate(`/products?category=${encodeURIComponent(category)}`);
  };
  const dropdownRef = useRef(null);
  const [showSuggestions, setShowSuggestions] = useState(false);



  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setCategoryOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <header className="w-full content-font">
        {/* 🔹 Top Bar */}
        {/* <div className="hidden md:flex justify-between items-center bg-[#E5B236] text-sm px-6 py-2">
          <div className="flex gap-3 text-white">
            <a
              href="https://list.baqavibookcentre.com/"
              className="hover:text-[#111825] transition-animation"
            >
              Fast Booking
            </a>
            <span>|</span>
            <div
              onClick={() => openPolicy("return-policy")}
              className="hover:text-[#111825] cursor-pointer transition-animation"
            >
              Returns Policy
            </div>
          </div>
          <div className="flex gap-3 text-white">
            <Link
              to="/auth"
              className="hover:text-[#111825] transition-animation"
            >
              Sign In
            </Link>
            <span>|</span>
            <Link
              to="/auth"
              className="hover:text-[#111825] transition-animation"
            >
              Sign Up
            </Link>
          </div>
        </div> */}
        {/* 🔹 Mobile Canvas Menu */}
        <div
          className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 z-50 ${
            menuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="p-4 border-b flex justify-between items-center">
            <span className="text-xl font-semibold">Menu</span>
            <button onClick={() => setMenuOpen(false)}>
              <X size={22} />
            </button>
          </div>
          <div className="p-4">
            {/* Links */}
            <ul className="space-y-3 text-gray-700">
              <li
                className="border-b border-gray-300 pb-2"
                onClick={() => setMenuOpen(false)}
              >
                <Link to="/" className="block">
                  Home
                </Link>
              </li>
              <li
                className="border-b border-gray-300 pb-2"
                onClick={() => setMenuOpen(false)}
              >
                <Link to="/products" className="block">
                  Shop
                </Link>
              </li>
              <li
                className="border-b border-gray-300 pb-2"
                onClick={() => setMenuOpen(false)}
              >
                <Link to="/cart" className="block">
                  Cart
                </Link>
              </li>
              {/* <li
                className="border-b border-gray-300 pb-2"
                onClick={() => setMenuOpen(false)}
              >
                <Link to="/" className="block">
                  Re-Seller
                </Link>
              </li> */}
              {/* <li
                className="border-b border-gray-300 pb-2"
                onClick={() => setMenuOpen(false)}
              >
                <a
                  href="https://saminnam.github.io/demo-book-center/"
                  className="block"
                >
                  Fast Booking
                </a>
              </li> */}
              <li
                className="border-b border-gray-300 pb-2"
                onClick={() => setMenuOpen(false)}
              >
                <Link to="/blogs" className="block">
                  Blog
                </Link>
              </li>
              <li
                className="border-b border-gray-300 pb-2"
                onClick={() => setMenuOpen(false)}
              >
                <Link to="/contact-us" className="block">
                  Contact Us
                </Link>
              </li>
              <li
                className="border-b border-gray-300 pb-2"
                onClick={() => setMenuOpen(false)}
              >
                <Link to="/become-a-seller" className="block">
                  Become a Seller
                </Link>
              </li>
              {/* <li
                className="border-b border-gray-300 pb-2"
                onClick={() => setMenuOpen(false)}
              >
                <Link to="/about-us" className="block">
                  About Us
                </Link>
              </li> */}
              {/* <li
                className="border-b border-gray-300 pb-2"
                onClick={() => setMenuOpen(false)}
              >
                <div
                  onClick={() => openPolicy("return-policy")}
                  className="block"
                >
                  Returns Policy
                </div>
              </li> */}
              {/* <li
                className="border-b border-gray-300 pb-2"
                onClick={() => setMenuOpen(false)}
              >
                <div
                  onClick={() => openPolicy("terms-conditions")}
                  className="block"
                >
                  Terms & Conditions
                </div>
              </li> */}
            </ul>
            <ul className="mt-5 flex gap-2 justify-center text-center">
              <li className="bg-[#111825] w-full text-white py-2 px-4">
                <Link to="/auth" className="flex  items-center justify-between">
                  <span>Sign In</span> <LogIn size={18} />
                </Link>
              </li>
              <li className="bg-[#E5B236] text-white w-full py-2 px-4">
                <Link to="/auth" className="flex  items-center justify-between">
                  <span>Signup</span> <LogIn size={18} />
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Background Overlay */}
        {menuOpen && (
          <div
            className="fixed inset-0 bg-black/40 bg-opacity-40 z-40"
            onClick={() => setMenuOpen(false)}
          ></div>
        )}
      </header>
      {/* 🔹 Middle Section */}
      <div className="z-40 md:sticky top-0">
        <div className="flex items-center justify-between px-4 md:px-10 py-3 bg-[#111825]">
          {/* Logo */}
          <Link to="/">
            <img
              src={logo}
              alt="baqavi-book-centre-logo"
              className="w-[80px] md:w-[105px]"
            />
          </Link>
          <nav className="hidden uppercase lg:flex justify-center gap-10 text-white text-sm font-medium">
            <Link to="/" className="hover:text-[#E5B236] transition-animation">
              Home
            </Link>
            <Link
              to="/products"
              className="hover:text-[#E5B236] transition-animation"
            >
              Shop
            </Link>
            {/* <Link to="/" className="hover:text-[#E5B236] transition-animation">
              Re-seller
            </Link> */}
            <Link
              to="/become-a-seller"
              className="hover:text-[#E5B236] transition-animation"
            >
              Become a Seller
            </Link>
            <Link
              to="/blogs"
              className="hover:text-[#E5B236] transition-animation"
            >
              Blog
            </Link>
            <Link
              to="/contact-us"
              className="hover:text-[#E5B236] transition-animation"
            >
              Contact Us
            </Link>
          </nav>
          {/* Search & Categories (Desktop) */}
          <div className="hidden md:flex items-center mx-10">
            <div ref={dropdownRef} className="relative text-gray-600">
              <button
                className="bg-white px-3 py-2 cursor-pointer rounded-l-full hidden lg:flex items-center gap-1"
                onClick={() => setCategoryOpen(!categoryOpen)}
              >
                <span>Categories</span> <ChevronDown size={20} />
              </button>

              {/* Dropdown */}
              <div
                className={`absolute top-full left-0 bg-white mt-1 scrollbar rounded shadow-lg w-max py-2 z-50 overflow-y-auto max-h-[150px] md:max-h-[300px]
          transition-all duration-300 ease-in-out transform origin-top
          ${
            categoryOpen
              ? "opacity-100 scale-y-100"
              : "opacity-0 scale-y-0 pointer-events-none"
          }`}
              >
                {categoryOptions.map((category, index) => (
                  <ul className="text-sm" key={index}>
                    <li
                      onClick={() => handleCategorySelect(category)}
                      className={`px-3 font-semibold py-2 hover:bg-[#E5B236] hover:text-white cursor-pointer ${
                        selectedCategory === category
                          ? "bg-[#E5B236] text-white"
                          : ""
                      }`}
                    >
                      {category}
                    </li>
                  </ul>
                ))}
              </div>
            </div>
            <div className="relative flex border bg-white lg:rounded-l-none rounded-l-full rounded-r-full">
              <input
                type="text"
                placeholder="Search for products..."
                value={navbarSearch}
                onChange={(e) => {
                  setNavbarSearch(e.target.value);
                  setShowSuggestions(true);
                  // Clear URL when search input is cleared
                  if (e.target.value.trim() === "") {
                    navigate("/products");
                  }
                }}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => {
                  // allow click on suggestion items
                  setTimeout(() => setShowSuggestions(false), 150);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSearch();
                }}
                className="w-full px-4 py-2 outline-none"
              />

              {showSuggestions && navbarSearch.trim() !== "" && (
                <div className="absolute left-0 top-full w-full bg-white shadow-lg z-50 max-h-60 overflow-y-auto rounded-b-lg border border-gray-200">
                  <ul className="text-sm">
                    {Array.from(
                      new Set(
                        (products || [])
                          .map((p) => p.name)
                          .filter(Boolean)
                          .filter((name) =>
                            name
                              .toLowerCase()
                              .replace(/\s+/g, "")
                              .includes(
                                navbarSearch
                                  .toLowerCase()
                                  .replace(/\s+/g, ""),
                              ),
                          )

                          .slice(0, 8),
                      ),
                    ).map((name) => (
                      <li
                        key={name}
                        className="px-3 py-2 hover:bg-[#E5B236] hover:text-white cursor-pointer"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => {
                          setNavbarSearch(name);
                          setShowSuggestions(false);
                          handleSearch(name);
                        }}
                      >
                        {name}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <button
                onClick={() => handleSearch()}
                className="bg-[#E5B236] cursor-pointer text-white px-4 rounded-r-full"
              >
                <Search size={18} />
              </button>
            </div>

          </div>

          {/* Wishlist & Cart */}
          <div className="flex items-center gap-4 text-white">
            {/* <button className="relative">
              <Heart size={22} />
            </button> */}
            <Link to="/cart" className="relative">
              <ShoppingCart size={22} />
              <div
                className={`absolute -top-2 -right-2 text-xs font-bold rounded-full flex items-center justify-center ${
                  Object.keys(cartItems).length > 0
                    ? "w-5 h-5 bg-[#E5B236] text-white"
                    : "w-0 h-0"
                }`}
              >
                {Object.keys(cartItems).length > 0
                  ? Object.keys(cartItems).length
                  : null}
              </div>
            </Link>
            {user ? (
              // SHOW LOGOUT IF LOGGED IN
              <button
                onClick={handleLogout}
                className="hidden md:block cursor-pointer hover:text-red-500 transition-colors"
                title="Logout"
              >
                <LogOut size={22} />
              </button>
            ) : (
              // SHOW LOGIN ICON IF NOT LOGGED IN
              <Link
                to="/auth"
                className="hidden md:block hover:text-yellow-500 transition-colors"
                title="Login"
              >
                <User size={22} />
              </Link>
            )}

            {/* <Link to={"/profile"} className="hidden md:block">
              <User size={22} />
            </Link> */}
            {/* Mobile Menu Button */}
            <button
              className="lg:hidden cursor-pointer text-white"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>
      </div>
      <div className="sticky top-0 z-40 bg-white">
        <MobileSearchBar
          categories={categoryOptions}
          searchValue={navbarSearch}
          setSearchValue={setNavbarSearch}
          handleSearch={handleSearch}
          setSelectedCategory={setSelectedCategory}
        />
      </div>

      <PolicyPopup
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        data={selectedPolicy}
      />
    </>
  );
};

export default Navbar;
