import { useEffect, useRef, useState, useContext } from "react";

import { Menu, Search, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { StoreContext } from "../context/StoreContext";

const MobileSearchBar = ({
  categories,
  category_list,
  searchValue,
  setSearchValue,
  setSelectedCategory,
}) => {
  const { products } = useContext(StoreContext);
  const navigate = useNavigate();

  const [showDropdown, setShowDropdown] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = () => {
    const q = searchValue.trim();
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
    setShowDropdown(false); // close after selecting
  };

  // Prefer `categories` from Navbar/StoreContext (array of strings). Fallback to `category_list`.
  const mobileCategories = categories ?? category_list ?? [];

  return (
    <div className="flex md:hidden w-full px-2 py-2">
      <div className="flex w-full">
        {/* Menu Icon */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="bg-gray-100 text-gray-700 px-3 py-2 flex items-center justify-center"
          >
            {showDropdown ? <X size={20} /> : <Menu size={20} />}
          </button>

          {/* Dropdown List */}
          {showDropdown && (
            <div
              className={`absolute top-full left-0 bg-white mt-1 rounded shadow-lg w-max py-2 z-50 overflow-y-auto max-h-[150px] md:max-h-[300px]
  transition-all duration-200 ease-in-out transform origin-top
  opacity-100 scale-y-100`}
            >
              <ul className="text-sm">
                {/* All Category */}
                <li
                  onClick={() => handleCategorySelect("All")}
                  className="px-3 font-semibold py-2 hover:bg-[#E5B236] hover:text-white cursor-pointer"
                >
                  All
                </li>

                {/* Dynamic Categories */}
                {(mobileCategories ?? []).filter(
                  (c) => (c?.cat_name ?? c) !== "All"
                ).map((item, index) => (
                  <li
                    key={index}
                    onClick={() => handleCategorySelect(item?.cat_name ?? item)}
                    className="px-3 font-semibold py-2 hover:bg-[#E5B236] hover:text-white cursor-pointer"
                  >
                    {item?.cat_name ?? item}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        {/* Search Input + Suggestions */}
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search for products..."
            value={searchValue}
            onChange={(e) => {
              setSearchValue(e.target.value);
              setShowSuggestions(true);
              // Clear URL when search input is cleared
              if (e.target.value.trim() === "") {
                navigate("/products");
              }
            }}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
            className="w-full px-4 py-2 outline-none"
          />

          {showSuggestions && searchValue.trim() !== "" && (
            <div className="absolute left-0 right-0 top-full bg-white shadow-lg z-50 max-h-60 overflow-y-auto border border-gray-200 rounded-b-lg">
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
                            searchValue
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
                      setSearchValue(name);
                      setShowSuggestions(false);
                      navigate(`/products?search=${encodeURIComponent(name)}`);
                    }}
                  >
                    {name}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Search Button */}
        <button
          onClick={() => handleSearch()}
          className="bg-[#E5B236] text-white px-4 flex items-center justify-center"
        >
          <Search size={18} />
        </button>

      </div>
    </div>
  );
};

export default MobileSearchBar;
