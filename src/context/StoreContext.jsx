import { createContext, useState, useEffect, useMemo, useContext } from "react";
import axiosInstance from "../api/axiosInstance";

import { toast } from "react-toastify";

import { AuthContext } from "./AuthContext";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const { user } = useContext(AuthContext);

  // 🟢 Data States
  const [products, setProducts] = useState([]); // Replaces static product_list
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // UI & Cart States
  const [menuOpen, setMenuOpen] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [cartItems, setCartItems] = useState({});

  // Filters & Sorting States
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortOrder, setSortOrder] = useState("");
  const [priceRange, setPriceRange] = useState([0, 10000]); // Set a high default
  const [filterSearch, setFilterSearch] = useState("");
  const [minStarRating, setMinStarRating] = useState(0);


  // 1️⃣ FETCH DATA FROM API (with pagination support)
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/products");
      // Handle both old format (array) and new format (object with products key)
      const productsData = response.data.products || response.data;
      setProducts(productsData);
      
      // Auto-adjust price range based on actual data
      if (productsData.length > 0) {
        const maxPrice = Math.max(...productsData.map(p => p.price));
        setPriceRange([0, maxPrice]);
      }
    } catch (error) {
      console.error("Failed to fetch products:", error);
      toast.error("Could not load products.");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axiosInstance.get("/categories");
      const categoriesData = response.data || [];
      if (Array.isArray(categoriesData) && categoriesData.length > 0) {
        setCategories(categoriesData.map((category) => category.name));
      } else {
        setCategories([...new Set(products.map((product) => product.category).filter(Boolean))]);
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      setCategories([...new Set(products.map((product) => product.category).filter(Boolean))]);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [products]);

  // 2️⃣ CART LOGIC - Sync with backend for logged-in users
  const fetchCart = async () => {
    if (!user) return;
    try {
      const response = await axiosInstance.get("/cart");
      const items = {};
      if (response.data && response.data.items) {
        response.data.items.forEach((item) => {
          items[item.productId._id] = item.quantity;
        });
      }
      setCartItems(items);
      localStorage.setItem("cartItems", JSON.stringify(items));
    } catch (error) {
      console.error("Failed to fetch cart:", error);
    }
  };

  const saveCartToBackend = async (items) => {
    if (!user) return;
    try {
      const itemsArray = Object.keys(items).map((productId) => ({
        productId,
        quantity: items[productId],
      }));
      await axiosInstance.post("/cart", { items: itemsArray });
    } catch (error) {
      console.error("Failed to save cart:", error);
    }
  };

  useEffect(() => {
    const savedCart = localStorage.getItem("cartItems");
    if (savedCart) setCartItems(JSON.parse(savedCart));
  }, []);

  useEffect(() => {
    if (user) fetchCart();
    else {
      // Clear cart from website when user logs out
      setCartItems({});
      localStorage.removeItem("cartItems");
    }
  }, [user]);

  const addToCart = (product) => {
    setCartItems((prev) => {
      const updated = { ...prev, [product._id]: (prev[product._id] || 0) + 1 };
      localStorage.setItem("cartItems", JSON.stringify(updated));
      saveCartToBackend(updated);
      return updated;
    });
    toast.success(`${product.name} added to cart!`);
  };

  const removeFromCart = (product, removeAll = false) => {
    const id = product._id;
    setCartItems((prev) => {
      let updated = { ...prev };
      if (removeAll) { delete updated[id]; } 
      else {
        updated[id] = Math.max((updated[id] || 0) - 1, 0);
        if (updated[id] === 0) delete updated[id];
      }
      localStorage.setItem("cartItems", JSON.stringify(updated));
      saveCartToBackend(updated);
      return updated;
    });
    toast.error(`${product.name} removed!`);
  };

  const clearCart = () => {
    if (window.confirm("Clear entire cart?")) {
      const updated = {};
      setCartItems(updated);
      localStorage.removeItem("cartItems");
      saveCartToBackend(updated);
      toast.info("Cart cleared");
    }
  };

  const getTotalCartAmount = () => {
    let total = 0;
    for (const id in cartItems) {
      const product = products.find((p) => p._id === id);
      if (product) total += product.price * cartItems[id];
    }
    return total;
  };

  // 3️⃣ FILTERING & SEARCHING (Client-side)
  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    if (selectedCategory !== "All") {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    filtered = filtered.filter(
      (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
    );

    // ⭐ Filter by minimum star rating
    filtered = filtered.filter((p) => (Number(p.rating) || 0) >= minStarRating);

    // ✅ Header search (Navbar/MobileSearchBar)
    // If filterSearch is empty, do not filter by name.
    const searchTerm = (filterSearch || "").trim();
    if (searchTerm !== "") {
      const searchTermNoSpace = searchTerm.toLowerCase().replace(/\s+/g, "");
      filtered = filtered.filter((p) => {
        const productNameNoSpace = (p.name || "")
          .toLowerCase()
          .replace(/\s+/g, "");
        return productNameNoSpace.includes(searchTermNoSpace);
      });
    }


    if (sortOrder === "low-to-high") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortOrder === "high-to-low") {
      filtered.sort((a, b) => b.price - a.price);
    }

    return filtered;
  }, [products, selectedCategory, priceRange, sortOrder, minStarRating, filterSearch]);



  const categoryOptions = ["All", ...new Set(categories)];

  const contextValue = {
    menuOpen, setMenuOpen,
    showFilter, setShowFilter,
    products,
    product_list: products, // Kept key name 'product_list' so your components don't break
    filteredProducts,
    categories: categoryOptions,
    clearCart,
    cartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    selectedCategory, setSelectedCategory,
    sortOrder, setSortOrder,
    priceRange, setPriceRange,
    filterSearch, setFilterSearch,
    minStarRating, setMinStarRating,
    loading, setLoading,
  };


  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;