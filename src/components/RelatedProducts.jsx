import { Link } from "react-router-dom";
import { Plus, Star } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { useContext } from "react";
import { StoreContext } from "../context/StoreContext";
import ProductCardSkeleton from "../skeleton-loader/ProductCardSkeleton";

const RelatedProducts = ({ category, currentProductId }) => {
  const { product_list, addToCart, loading } = useContext(StoreContext);

  // Filter related products by category (excluding current one)
  const relatedProducts = product_list.filter(
    (p) => p.category === category && p._id !== currentProductId,
  );

  if (relatedProducts.length === 0) return null;

  return (
    <div className="container mx-auto py-10">
      <div className="">
        <h3 className="text-xl md:text-2xl font-semibold mb-6">
          Related Products
        </h3>

        <Swiper
          modules={[Navigation, Autoplay]}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          spaceBetween={15}
          slidesPerView={2}
          breakpoints={{
            640: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            1024: { slidesPerView: 4 },
            1280: { slidesPerView: 6 },
          }}
          className="mySwiper"
        >
          {loading
            ? // ✅ Show skeletons when loading
              Array.from({ length: relatedProducts.length }).map((_, i) => (
                <SwiperSlide key={i}>
                  <ProductCardSkeleton />
                </SwiperSlide>
              ))
            : // ✅ Show actual products when loaded
              relatedProducts.map((item) => (
                <SwiperSlide key={item._id}>
                  <div className="border content-font hover:border-[#e5b236] group overflow-hidden bg-white border-gray-200 relative rounded-lg md:p-4">
                    <div>
                      <Link to={`/product/${item.slug}`}>
                        <div className="overflow-hidden">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full transition-transform duration-300 group-hover:scale-110 object-cover rounded"
                          />
                        </div>
                      </Link>
                      <div className="md:space-y-1 mt-4">
                        <h3 className="text-[12px] md:text-[16px] truncate w-[120px] md:w-[160px] 2xl:w-[200px]">
                          {item.name}
                        </h3>
                        <div className="flex md:mt-0 mt-1 flex-col gap-1">
                          <div className="flex gap-2">
                            <p className="text-gray-800 text-[12px] md:text-[15px] font-semibold">
                              ₹{Number(item.price || 0).toLocaleString("en-IN")}
                            </p>
                            <p className="text-red-500 text-[12px] md:text-[15px] line-through">
                              ₹{Number(item.mrp || 0).toLocaleString("en-IN")}
                            </p>
                          </div>
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-[1.3px] 2xl:gap-1">
                              {Array.from({ length: 5 }, (_, i) => (
                                <Star
                                  key={i}
                                  size={14}
                                  className={
                                    i < item.rating
                                      ? "text-yellow-500"
                                      : "text-gray-300"
                                  }
                                />
                              ))}
                            </div>
                            <button
                              onClick={() => addToCart(item)}
                              className="flex cursor-pointer items-center border  border-slate-[#111825] justify-center text-[#111825] p-1 shadow-md bg-white rounded transition"
                            >
                              <Plus className="w-3 transition-transform duration-300 hover:rotate-180 h-3 md:w-5 md:h-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Buttons */}
                    {/* <div className="absolute bottom-3 md:bottom-5 w-full left-1/2 md:px-4 transform -translate-x-1/2">
                      <div className="flex items-center w-full justify-between">
                        <Link
                          to={`/product/${item.slug}`}
                          className="bg-[#111825] md:text-[13px] text-[12px] sm:text-[12px] text-white px-2 py-1 md:py-2 md:px-5 rounded hover:bg-yellow-600 transition"
                        >
                          View Details
                        </Link>

                        <button
                          onClick={() => addToCart(item)}
                          className="flex cursor-pointer items-center border  border-slate-[#111825] justify-center text-[#111825] p-1 md:p-2 shadow-md bg-white rounded-full transition"
                        >
                          <Plus className="w-3 transition-transform duration-300 hover:rotate-180 h-3 md:w-5 md:h-5" />
                        </button>
                      </div>
                    </div> */}

                    {/* Discount tag */}
                    {item.discount > 0 && (
                      <div className="absolute top-3 rounded-s right-0 w-[50px] text-center py-1 text-[12px] md:text-sm text-white bg-[#e5b336] hover:scale-110 transition-transform duration-300 overflow-hidden">
                        {item.discount}%
                        <span className="absolute top-0 left-[-75%] w-[50%] h-full bg-white opacity-20 rotate-12 animate-[shine_2s_infinite]" />
                      </div>
                    )}
                  </div>
                </SwiperSlide>
              ))}
        </Swiper>
      </div>
    </div>
  );
};

export default RelatedProducts;
