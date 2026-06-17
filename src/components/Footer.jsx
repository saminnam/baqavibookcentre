import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/images/logo-bg.png";
import { Facebook, Instagram, Youtube } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="w-full md:mt-16 mt-0 relative bg-[url('src/assets/images/bg-pattern/footer-pattern.webp')] bg-cover bg-center bg-no-repeat">
      <div className="bg-[#bc8600f5] absolute inset-0 z-10"></div>
      {/* <div class="bg-[#111825fa] absolute inset-0 z-10"></div> */}
      <div className="mx-auto container px-4 pt-16 sm:px-6 lg:px-8 relative z-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 pb-16 lg:grid-cols-5 gap-4  mx-auto w-full content-font">
          <div className="w-full">
            <Link to={"/"}>
              <img
                src={logo}
                alt="baqavi-book-centre-logo"
                className="w-[80px] md:w-[120px] filter invert brightness-0"
              />
            </Link>
            <div>
              <p className="text-white text-justify mb-5 mt-5 w-[300px] md:max-w-[400px] lg:w-full">
                Shop the best Islamic books online, including Quran, Hadith,
                Islamic history, and educational Islamic literature. Fast
                delivery across India.
              </p>
            </div>
          </div>
          <div className="w-full">
            <h4 className="text-xl text-white font-medium mb-7">Our Links</h4>
            <ul className="space-y-3">
              <li>
                <Link to={"/"} className="text-white">
                  Home
                </Link>
              </li>
              {/* <li>
                <Link to={"/about-us"} className=" text-white">
                  About
                </Link>
              </li> */}
              <li>
                <Link to={"/products"} className=" text-white">
                  Shop
                </Link>
              </li>
              <li>
                <Link to={"/cart"} className=" text-white">
                  Cart
                </Link>
              </li>
              <li>
                <Link to={""} className=" text-white">
                  Re Seller
                </Link>
              </li>
              <li>
                <Link to={"/blogs"} className=" text-white">
                  Blog
                </Link>
              </li>
            </ul>
          </div>
          <div className="w-full">
            <h4 className="text-xl text-white font-medium mb-7">
              Customer Policy
            </h4>
            <ul className="space-y-3">
              <li>
                <Link to={""} className="text-white">
                  Return Policy
                </Link>
              </li>
              <li>
                <Link to={""} className=" text-white">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to={""} className=" text-white">
                  Privacy
                </Link>
              </li>
              <li>
                <Link to={""} className=" text-white">
                  Security
                </Link>
              </li>
              <li>
                <Link to={""} className=" text-white">
                  Sitemap
                </Link>
              </li>
            </ul>
          </div>
          <div className="w-full">
            <h4 className="text-xl text-white font-medium mb-7">Help</h4>
            <ul className="space-y-3">
              <li>
                <Link to={"/contact-us"} className=" text-white">
                  Contact
                </Link>
              </li>
              <li>
                <Link to={""} className="text-white">
                  Payments
                </Link>
              </li>
              <li>
                <Link to={""} className=" text-white">
                  Shiping
                </Link>
              </li>
              <li>
                <Link to={""} className=" text-white">
                  Cancellation & Returns
                </Link>
              </li>
              <li>
                <Link to={""} className=" text-white">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
          <div className="w-full">
            <h4 className="text-xl text-white font-medium mb-7">Support</h4>
            <ul className="space-y-3">
              <li>
                <Link to={""} className="text-white">
                  Customer Support
                </Link>
              </li>
              <li>
                <Link to={""} className=" text-white">
                  Cookies
                </Link>
              </li>
              <li>
                <Link to={""} className=" text-white">
                  License
                </Link>
              </li>
              <li>
                <Link to={""} className=" text-white">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to={""} className=" text-white">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="py-2 border-t border-gray-200">
          <div className="flex content-font items-center justify-center flex-col sm:justify-between sm:flex-row">
            <span className="text-sm md:text-[15px] text-white">
              © {new Date().getFullYear()}{" "}
              <a href="#" className="hover:underline text-[#fff]">
                Baqavi Book Centre{" "}
              </a>
<<<<<<< HEAD
              All Rights Reserved 
=======
              All Rights Reserved.
>>>>>>> 74fbb95 (updated)
            </span>

            <div className="flex mt-6 space-x-4 sm:justify-center sm:mt-0">
              {/* Facebook */}
              <a className="group w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center transition-all duration-300 hover:border-indigo-600">
                <Facebook
                  size={18}
                  className="text-white transition-all duration-300 group-hover:text-indigo-600"
                />
              </a>

              {/* Instagram */}
              <a className="group w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center transition-all duration-300 hover:border-indigo-600">
                <Instagram
                  size={18}
                  className="text-white transition-all duration-300 group-hover:text-indigo-600"
                />
              </a>

              {/* WhatsApp */}
              <a className="group w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center transition-all duration-300 hover:border-indigo-600">
                <FaWhatsapp
                  size={18}
                  className="text-white group-hover:text-indigo-600"
                />
              </a>

              {/* YouTube */}
              <a className="group w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center transition-all duration-300 hover:border-indigo-600">
                <Youtube
                  size={18}
                  className="text-white transition-all duration-300 group-hover:text-indigo-600"
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
