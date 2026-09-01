import React from "react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { StoreContext } from "../../context/StoreContext";
import { category_list } from "../../data/productData";
import axiosInstance from "../../api/axiosInstance";
// ✅ Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

const ExploreCategory = () => {
  const navigate = useNavigate();
  const { categories, products } = useContext(StoreContext);

  const getCategoryImageUrl = (image) => {
    if (!image) return "";
    if (typeof image !== "string") return "";

    // Absolute URL
    if (image.startsWith("http://") || image.startsWith("https://")) return image;

    // Get base URL from axios instance
    const baseUrl = axiosInstance.defaults.baseURL?.replace(/\/api\/?$/, "") || "";

    // Normalize any leading slashes: uploads/x -> uploads/x, /uploads/x -> uploads/x, etc.
    const normalized = image.replace(/^\/+/, "");

    // If backend stores a full relative path like uploads/<filename>
    if (normalized.startsWith("uploads/")) {
      return `${baseUrl}/${normalized}`;
    }

    // Otherwise treat it as a raw filename returned by multer (e.g. 12345.webp)
    return `${baseUrl}/uploads/${normalized}`;
  };

  const getCategoryImage = (category) => {
    // If category is an object with image property, use it
    if (typeof category === 'object' && category.image) {
      return getCategoryImageUrl(category.image);
    }

    // Get category name (handle both object and string)
    const categoryName = typeof category === 'object' ? category.name : category;

    // First try to use first product's image from this category (from API)
    if (products && products.length > 0) {
      const firstProduct = products.find(p => p.category === categoryName);
      if (firstProduct && firstProduct.image) return firstProduct.image;
    }

    // Fallback: try static category_list
    if (category_list) {
      const categoryData = category_list.find(c => c.cat_name === categoryName);
      if (categoryData && categoryData.cat_img) return categoryData.cat_img;
    }

    // Default fallback
    return null;
  };

  const getCategoryName = (category) => {
    return typeof category === 'object' ? category.name : category;
  };

  const filteredCategories = categories ? categories.filter(cat => {
    const name = typeof cat === 'object' ? cat.name : cat;
    return name !== "All";
  }) : [];
  const hasEnoughSlides = filteredCategories.length > 2;

  const handleCategorySelect = (category) => {
    const categoryName = typeof category === 'object' ? category.name : category;
    navigate(`/products?category=${encodeURIComponent(categoryName)}`);
  };

  return (
    <section className="px-5 md:px-8 pb-16">
      <div className="container mx-auto">
        <div className="mt-8 md:mt-16">
          <Swiper
            modules={[Autoplay]}
            speed={4000}
            autoplay={{ delay: 1000, disableOnInteraction: false }}
            spaceBetween={4}
            slidesPerView={2}
            breakpoints={{
              320: { slidesPerView: 4, spaceBetween: 15 }, // small phones
              480: { slidesPerView: 4, spaceBetween: 17 },
              580: { slidesPerView: 5, spaceBetween: 18 }, // large phones
              640: { slidesPerView: 6, spaceBetween: 20 }, // tablets portrait
              768: { slidesPerView: 7, spaceBetween: 25 }, // tablets landscape
              1024: { slidesPerView: 8, spaceBetween: 30 }, // laptops
              1280: { slidesPerView: 10, spaceBetween: 35 }, // desktops
              1536: { slidesPerView: 11, spaceBetween: 40 }, // large screens
            }}
            loop={hasEnoughSlides}
            className="mySwiper"
            style={{
              transitionTimingFunction: "linear",
            }}
          >
            {filteredCategories.map((category, index) => (
              <SwiperSlide key={index}>
                <div
                  className="text-center"
                  onClick={() => handleCategorySelect(category)}
                >
                  <div className="flex-shrink-0 cursor-pointer group w-[80px] md:w-[100px] mx-auto">
                    <div className="bg-slate-200 p-2 rounded-lg overflow-hidden h-[60px] md:h-[80px]">
                      {getCategoryImage(category) && (
                        <img
                          className="w-full h-full rounded-lg transition-transform duration-300 group-hover:scale-105 object-cover"
                          src={getCategoryImage(category)}
                          alt={getCategoryName(category)}
                        />
                      )}
                    </div>
                    <p className="text-[12px] md:text-[14px] mt-2 font-medium text-gray-800">
                      {getCategoryName(category)}
                    </p>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default ExploreCategory;
