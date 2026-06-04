import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import OfferHeroSection from "./OfferHeroSection";

const Hero = () => {
  const [isMobile, setIsMobile] = useState(false);
  const slidesRef = useRef(null);
  const indicatorsRef = useRef([]);
  const [current, setCurrent] = useState(0);
  const intervalRef = useRef(null);
  const startX = useRef(0);
  const deltaX = useRef(0);
  const isDragging = useRef(false);
  const [heroSlides, setHeroSlides] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHeroSlides = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/api/hero-slides");
      setHeroSlides(data);
    } catch (error) {
      console.error("Failed to fetch hero slides:", error);
      // Fallback to empty array if API fails
      setHeroSlides([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHeroSlides();
  }, []);

  // Detect screen size
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const goToSlide = (index) => {
    clearTimeout(intervalRef.current);
    const slides = slidesRef.current;
    const indicators = indicatorsRef.current;

    indicators.forEach((ind, i) => {
      const progress = ind.querySelector(".progress");
      ind.classList.toggle("active", i === index);
      progress.style.transition = "none";
      progress.style.width = "0%";
      void progress.offsetWidth; // trigger reflow
      if (i === index) {
        progress.style.transition = "width 3s linear";
        setTimeout(() => (progress.style.width = "100%"), 50);
      }
    });

    slides.style.transition = "transform 0.5s ease-in-out";
    slides.style.transform = `translateX(-${index * 100}%)`;
    setCurrent(index);

    intervalRef.current = setTimeout(() => {
      goToSlide((index + 1) % (heroSlides.length || 1));
    }, 3000);
  };

  // --- Event Handlers for Swipe ---
  const handleStart = (clientX) => {
    isDragging.current = true;
    startX.current = clientX;
    slidesRef.current.style.transition = "none";
  };

  const handleMove = (clientX) => {
    if (!isDragging.current) return;
    deltaX.current = clientX - startX.current;
    slidesRef.current.style.transform = `translateX(${
      -current * 100 + (deltaX.current / slidesRef.current.clientWidth) * 100
    }%)`;
  };

  const handleEnd = () => {
    if (!isDragging.current) return;
    isDragging.current = false;
    if (deltaX.current > 50) {
      goToSlide((current - 1 + (heroSlides.length || 1)) % (heroSlides.length || 1));
    } else if (deltaX.current < -50) {
      goToSlide((current + 1) % (heroSlides.length || 1));
    } else {
      goToSlide(current);
    }
    deltaX.current = 0;
  };

  useEffect(() => {
    goToSlide(0);

    const handleMouseMove = (e) => handleMove(e.pageX);
    const handleTouchMove = (e) => handleMove(e.touches[0].clientX);
    const handleMouseUp = handleEnd;
    const handleTouchEnd = handleEnd;

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("touchend", handleTouchEnd);

    return () => {
      clearTimeout(intervalRef.current);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, []);

  return (
    <section className="flex md:flex-row flex-col">
      <div className="slider-container overflow-hidden md:w-[55%] w-full">
        {loading ? (
          <div className="flex items-center justify-center h-[500px]">
            <div className="text-gray-500">Loading slides...</div>
          </div>
        ) : heroSlides.length === 0 ? (
          <div className="flex items-center justify-center h-[500px]">
            <div className="text-gray-500">No slides available</div>
          </div>
        ) : (
          <>
            <div
              id="slides"
              ref={slidesRef}
              className="slides"
              onMouseDown={(e) => handleStart(e.pageX)}
              onTouchStart={(e) => handleStart(e.touches[0].clientX)}
            >
              {heroSlides.map((slide) => (
                <div className="slide" key={slide._id}>
                  <img
                    src={isMobile ? slide.mobileImg : slide.desktopImg}
                    alt={slide.title}
                    className="object-contain h-full md:h-[500px]"
                  />
                </div>
              ))}
            </div>

            <div className="indicators">
              {heroSlides.map((_, i) => (
                <div
                  key={i}
                  ref={(el) => (indicatorsRef.current[i] = el)}
                  className={`indicator ${i === current ? "active" : ""}`}
                  onClick={() => goToSlide(i)}
                >
                  <div className="progress"></div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
      <div className="md:w-[45%] lg:block hidden w-full overflow-hidden">
        <OfferHeroSection />
      </div>
    </section>
  );
};

export default Hero;
