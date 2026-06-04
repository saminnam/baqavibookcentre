import React, { useEffect, useState } from "react";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import axiosInstance from "../../api/axiosInstance";

const OfferHeroSection = () => {
  const [heroOfferSlides, setHeroOfferSlides] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOfferHeroSlides = async () => {
    try {
      const { data } = await axiosInstance.get("/offer-hero-slides");
      setHeroOfferSlides(data);
    } catch (error) {
      console.error("Failed to fetch offer hero slides:", error);
      setHeroOfferSlides([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOfferHeroSlides();
  }, []);

  if (loading) {
    return (
      <section className="overflow-hidden m-1">
        <div className="flex items-center justify-center h-[500px]">
          <div className="text-gray-500">Loading offer slides...</div>
        </div>
      </section>
    );
  }

  if (heroOfferSlides.length === 0) {
    return (
      <section className="overflow-hidden m-1">
        <div className="flex items-center justify-center h-[500px]">
          <div className="text-gray-500">No offer slides available</div>
        </div>
      </section>
    );
  }

  return (
    <section className="overflow-hidden m-1">
      <Swiper
        direction="vertical"
        autoplay={{ delay: 2500, disableOnInteraction: false }}
        loop={true}
        slidesPerView={2}
        spaceBetween={5}
        breakpoints={{
          0: { direction: "horizontal", spaceBetween: 10 },
          768: { direction: "vertical", spaceBetween: 5 },
        }}
        modules={[Autoplay]}
        className="h-auto md:h-[500px]"
        speed={600}
      >
        {heroOfferSlides.map((item) => (
          <SwiperSlide key={item._id}>
            <div className="relative group bg-[url('./assets/images/bg-pattern/shopping-pattern.avif')] bg-cover bg-center overflow-hidden">
              <div
                className={`absolute inset-0 opacity-90 ${
                  item._id % 3 === 0
                    ? "bg-[#030050db]"
                    : item._id % 3 === 1
                    ? "bg-[#e5b336e0]"
                    : "bg-[#000000d0]"
                }`}
              ></div>

              <div className="relative z-10 flex justify-between items-center px-5 md:py-10 lg:py-12">
                <div className="space-y-3 w-[65%]">
                  <h2 className="text-white font-semibold lg:text-2xl text-xl">
                    {item.title}
                  </h2>
                  <h5 className="font-bold content-font text-white text-lg md:text-xl">
                    {item.subTitle}
                  </h5>
                  <Link
                    to="/products"
                    className="bg-white flex gap-1 items-center px-2 py-1 md:text-[16px] text-[12px] cursor-pointer mt-8 w-max md:px-5 md:py-2 font-semibold transition-all rounded hover:bg-[#111825] hover:text-white"
                  >
                    <span>Shop Now</span>
                    <ArrowRight size={20} />
                  </Link>
                </div>

                <div className="w-[35%] overflow-hidden group-hover:scale-110 transition-animation">
                  <img
                    src={item.img}
                    alt={item.title}
                    className="object-cover h-[145px]"
                  />
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default OfferHeroSection;
