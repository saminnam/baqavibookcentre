import React, { useContext } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import { MoveLeft, MoveRight, Loader2, Plus, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";

// Ensure Swiper styles are imported in your project
import "swiper/css";
import "swiper/css/navigation";

const CategorySwiperSection = () => {
  // ✅ Logic: Use products from StoreContext to avoid duplicate API calls
  const { products, loading, addToCart } = useContext(StoreContext);

  // ✅ Logic: Prevent rendering swiper before data is ready
  if (loading || !products || products.length === 0)
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin text-[#e5b236]" size={32} />
      </div>
    );

  // ✅ Logic: Get unique categories from API data
  const categories = [...new Set(products.map((p) => p.category))];

  return (
    <section className="px-5 md:px-8 space-y-12">
      {categories.map((category, index) => {
        // ✅ Logic: Filter products based on fetched data
        const categoryProducts = products.filter(
          (p) => p.category === category,
        );

        const navPrev = `prev-${index}`;
        const navNext = `next-${index}`;

        return (
          <div key={category} className="space-y-6 container mx-auto">
            {/* 🔹 Section Header */}
            <div className="flex justify-between items-center">
              <h2 className="text-xl md:text-2xl font-semibold text-gray-900">
                {category}
              </h2>
              <div className="flex gap-3">
                <button className={`swiper-button ${navPrev} text-[#e5b236]`}>
                  <MoveLeft size={18} />
                </button>
                <button className={`swiper-button ${navNext} text-[#e5b236]`}>
                  <MoveRight size={18} />
                </button>
              </div>
            </div>

            {/* 🔹 Swiper Section */}
            <Swiper
              modules={[Navigation, Autoplay]}
              navigation={{
                nextEl: `.${navNext}`,
                prevEl: `.${navPrev}`,
              }}
              autoplay={{ delay: 2000, disableOnInteraction: false }}
              spaceBetween={10}
              slidesPerView={2}
              breakpoints={{
                480: { slidesPerView: 2 },
                640: { slidesPerView: 3 },
                768: { slidesPerView: 4 },
                1024: { slidesPerView: 5 },
                1280: { slidesPerView: 6 },
              }}
              loop={categoryProducts.length >= 6} // Loop only if enough items to prevent Swiper glitches
              className="category-swiper"
            >
              {categoryProducts.map((product) => (
                <SwiperSlide key={product._id}>
                  <div className="border content-font h-max md:hover:border-[#e5b236] group overflow-hidden bg-white md:border-gray-200 relative rounded-lg p-3">
                    <div>
                      <Link to={`/product/${product.slug}`}>
                        <div className="overflow-hidden">
                          <img
                            src={product.image}
                            alt={product.name}
                            className={`w-full transition-transform duration-300 object-cover rounded ${
                              product?.status === "inactive"
                                ? "blur-[2px] opacity-70 scale-[1.02]"
                                : "group-hover:scale-110"
                            }`}
                          />
                          {product?.status === "inactive" && (
                            <div className="absolute inset-0 flex items-center justify-center rounded bg-slate-900/20">
                              <span className="rounded-full bg-slate-900/75 px-3 py-1 text-xs font-bold text-white backdrop-blur">
                                Currently no available
                              </span>
                            </div>
                          )}
                        </div>
                      </Link>
                      <div className="md:space-y-1 mt-4">
                        <h3 className="text-[12px] md:text-[16px] truncate w-[120px] md:w-[160px] 2xl:w-[200px]">
                          {product.name}
                        </h3>
                        <div className="flex md:mt-0 mt-1 md:flex-row flex-col md:items-center gap-1 2xl:gap-4">
                          <div className="flex gap-2">
                            <p className="text-gray-800 text-[12px] md:text-[15px] font-semibold">
                              ₹{product.price}
                            </p>
                            <p className="text-red-500 text-[12px] md:text-[15px] line-through">
                              ₹{product.mrp}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }, (_, i) => (
                          <Star
                            key={i}
                            size={14}
                            className={
                              i < (product.rating || 0)
                                ? "text-yellow-500"
                                : "text-gray-300"
                            }
                          />
                        ))}
                      </div>

                      {/* Hidden flow (same logic as ProductList):
                          status === "inactive" => disable + apply disabled styles */}
                      {(() => {
                        const isHidden = product?.status === "inactive";
                        return (
                          <>
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
                                className={`w-3 h-3 md:w-5 md:h-5 ${
                                  !isHidden
                                    ? "transition-transform duration-300 hover:rotate-180"
                                    : ""
                                }`}
                              />
                            </button>

                            {product.discount > 0 && (
                              <div className="absolute top-3 rounded-s right-0 w-[50px] text-center py-1 text-[12px] md:text-sm text-white bg-[#e5b336] hover:scale-110 transition-transform duration-300 overflow-hidden">
                                {product.discount}%
                                <span className="absolute top-0 left-[-75%] w-[50%] h-full bg-white opacity-20 rotate-12 animate-[shine_2s_infinite]" />
                              </div>
                            )}
                          </>
                        );
                      })()}
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        );
      })}
    </section>
  );
};

export default CategorySwiperSection;
