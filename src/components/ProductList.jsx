import { useContext, useEffect, useState } from "react";
import { StoreContext } from "../context/StoreContext";
import { Link, useSearchParams } from "react-router-dom";
import { Plus, Star, ChevronLeft, ChevronRight } from "lucide-react";
import ProductFilter from "./ProductFilter";
import ProductCardSkeleton from "../skeleton-loader/ProductCardSkeleton";

const ProductListPage = () => {
  const [showFilter, setShowFilter] = useState(false);
  const [searchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10;

  const {
    filteredProducts,
    categories,
    selectedCategory,
    setSelectedCategory,
    sortOrder,
    setSortOrder,
    priceRange,
    setPriceRange,
    filterSearch,
    setFilterSearch,
    addToCart,
    loading,
  } = useContext(StoreContext);

  // ✅ Pagination logic (must come AFTER filteredProducts is available)
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct,
  );

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  // ✅ Handle query params
  useEffect(() => {
    const search = searchParams.get("search");
    const category = searchParams.get("category");

    if (search) setFilterSearch(search);
    if (category) setSelectedCategory(category);
  }, [searchParams, setFilterSearch, setSelectedCategory]);

  return (
    <div className="container mx-auto p-2 md:p-6 content-font">
      <div className="flex lg:flex-row gap-10 flex-col">
        {/* Filter Sidebar */}
        <div>
          <ProductFilter
            showFilter={showFilter}
            setShowFilter={setShowFilter}
            categories={categories}
            filterSearch={filterSearch}
            setFilterSearch={setFilterSearch}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
          />
        </div>

        {/* Product Grid Section */}
        <div>
          <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 md:gap-6">
            {loading ? (
              Array.from({ length: 15 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))
            ) : currentProducts.length > 0 ? (
              currentProducts.map((product) => {
                const isHidden = product?.status === "inactive";

                return (
                  <div
                    key={product._id}
                    className={`border content-font h-max hover:border-[#e5b236] group overflow-hidden bg-white border-gray-200 relative rounded-lg p-3 ${isHidden ? "opacity-90" : ""}`}
                  >
                    {/* {isHidden && (
                      <span className="absolute top-3 right-3 z-10 rounded-full bg-slate-900/80 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white backdrop-blur">
                        Hidden
                      </span>
                    )} */}

                    <div>
                      <Link to={`/product/${product.slug}`}>
                        <div className="relative overflow-hidden rounded">
                          <img
                            src={product.image}
                            alt={product.name}
                            className={`w-full transition-transform duration-300 object-cover rounded ${
                              isHidden
                                ? "blur-[2px] opacity-70 scale-[1.02]"
                                : "group-hover:scale-110"
                            }`}
                          />

                          {isHidden && (
                            <div className="absolute inset-0 flex items-center justify-center rounded bg-slate-900/20">
                              <span className="rounded bg-red-400/75 px-3 py-2 text-[10px] md:text-xs font-bold text-white backdrop-blur">
                                Currently not available
                              </span>
                            </div>
                          )}
                        </div>
                      </Link>
                      <div className="md:space-y-1 mt-4">
                        <h3 className="text-[12px] md:text-[14px] truncate w-[120px] md:w-[200px]">
                          {product.name}
                        </h3>

                        <div className="flex md:mt-0 mt-1 flex-col gap-1">
                          <div className="flex gap-2">
                            <p className="text-gray-800 text-[12px] md:text-[15px] font-semibold">
                              ₹
                              {Number(product.price || 0).toLocaleString(
                                "en-IN",
                              )}
                              {/* ₹{product.finalPrice} */}
                            </p>
                            <p className="text-red-500 text-[12px] md:text-[15px] line-through">
                              ₹{product.mrp}
                            </p>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1">
                              {Array.from({ length: 5 }, (_, i) => (
                                <Star
                                  key={i}
                                  size={14}
                                  className={
                                    i < product.rating
                                      ? "text-yellow-500"
                                      : "text-gray-300"
                                  }
                                />
                              ))}
                            </div>
                            <button
                              onClick={() => !isHidden && addToCart(product)}
                              disabled={isHidden}
                              className={`flex items-center border border-slate-[#111825] justify-center p-1 shadow-md rounded transition ${
                                isHidden
                                  ? "cursor-not-allowed bg-gray-200 text-gray-500"
                                  : "cursor-pointer bg-white text-[#111825]"
                              }`}
                            >
                              <Plus
                                className={`w-3 h-3 md:w-5 md:h-5 ${!isHidden ? "transition-transform duration-300 hover:rotate-180" : ""}`}
                              />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Buttons */}
                    {/* <div className="absolute bottom-3 md:bottom-5 w-full left-1/2 md:px-4 transform -translate-x-1/2">
                    <div className="flex items-center w-full justify-between">
                      <Link
                        to={`/product/${product.slug}`}
                        className="bg-[#111825] md:text-[15px] text-[12px] text-white px-2 py-1 md:py-2 md:px-5 rounded hover:bg-yellow-600 transition"
                      >
                        View Details
                      </Link>
                      <button
                        onClick={() => addToCart(product)}
                        className="flex cursor-pointer items-center border border-slate-[#111825] justify-center text-[#111825] p-1 md:p-2 shadow-md bg-white rounded-full transition"
                      >
                        <Plus className="w-3 transition-transform duration-300 hover:rotate-180 h-3 md:w-5 md:h-5" />
                      </button>
                    </div>
                  </div> */}

                    {/* Discount Tag */}
                    {product.discount > 0 && (
                      <div className="absolute top-3 rounded-s right-0 w-[50px] text-center py-1 text-[12px] md:text-sm text-white bg-[#e5b336] hover:scale-110 transition-transform duration-300 overflow-hidden">
                        {product.discount}%
                        <span className="absolute top-0 left-[-75%] w-[50%] h-full bg-white opacity-20 rotate-12 animate-[shine_2s_infinite]" />
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <p className="col-span-full text-center text-gray-500">
                No products found.
              </p>
            )}
          </div>

          {/* Pagination Controls */}
          {!loading && filteredProducts.length > productsPerPage && (
            <div className="flex justify-center items-center mt-6 md:mb-0 mb-20 md:mt-10 gap-4">
              {/* Previous Button */}
              <button
                onClick={handlePrev}
                disabled={currentPage === 1}
                className={`flex items-center gap-2 px-2 md:px-4 py-2 border rounded-full transition-all ${
                  currentPage === 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white hover:bg-[#e5b236] cursor-pointer hover:text-white text-gray-700"
                }`}
              >
                <ChevronLeft className="w-5 h-5" />
                <span className="hidden sm:inline">Prev</span>
              </button>

              {/* Page Info */}
              <span className="text-gray-700 text-sm md:text-lg font-medium">
                Page <span className="text-[#e5b236]">{currentPage}</span> of{" "}
                {totalPages}
              </span>

              {/* Next Button */}
              <button
                onClick={handleNext}
                disabled={currentPage === totalPages}
                className={`flex items-center gap-2 px-2 md:px-4 py-2 border rounded-full transition-all ${
                  currentPage === totalPages
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white hover:bg-[#e5b236] cursor-pointer hover:text-white text-gray-700"
                }`}
              >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductListPage;
