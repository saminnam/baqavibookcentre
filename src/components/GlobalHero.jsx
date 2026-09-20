import { Link, useLocation } from "react-router-dom";

const GlobalHero = ({ title }) => {
  const location = useLocation();

  // Get URL path segments
  const pathSegments = location.pathname
    .split("/")
    .filter((segment) => segment);

  // Decode and format each breadcrumb segment
  const formatBreadcrumb = (segment) => {
    const decoded = decodeURIComponent(segment); // Decode %20 etc.
    return (
      decoded.charAt(0).toUpperCase() + decoded.slice(1).replace(/-/g, " ")
    );
  };

  return (
    <section className="relative px-5 md:px-8 py-10 md:py-16 bg-gray-100 w-full h-auto bg-cover bg-center flex-shrink-0">
      {/* IMAGE OVERLAY */}
      {/* <div className="absolute inset-0 w-full h-full">
        <img
          src="https://img.freepik.com/free-photo/plain-dark-blue-product-background_53876-102471.jpg?semt=ais_hybrid&w=740&q=80"
          alt="overlay"
          className="w-full h-full object-cover pointer-events-none"
        />
      </div> */}
      {/* Content */}
      <div className="relative container mx-auto">
        <div className="flex flex-col items-start justify-center text-center px-4">
          <h1 className="sm:text-4xl text-2xl md:text-5xl font-serif font-bold mb-3 md:mb-10">
            {title}
          </h1>

          <ul className="flex content-font flex-wrap text-sm md:text-[16px] font-medium gap-2 md:justify-center">
            <li>
              <Link
                to="/"
                className="hover:text-[#E5B236] transition-colors duration-200"
              >
                Home
              </Link>
            </li>

            {pathSegments.map((segment, index) => {
              const path = "/" + pathSegments.slice(0, index + 1).join("/");
              const isLast = index === pathSegments.length - 1;

              return (
                <li key={index} className="flex items-center gap-2">
                  <span>/</span>
                  {isLast ? (
                    <span className="text-[#E5B236]">
                      {formatBreadcrumb(segment)}
                    </span>
                  ) : (
                    <Link
                      to={path}
                      className="hover:text-[#E5B236] transition-colors duration-200"
                    >
                      {formatBreadcrumb(segment)}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default GlobalHero;
