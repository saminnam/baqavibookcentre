import React, { useEffect, useState } from "react";
// import blogsData from "../../data/blogsData";
import { Clock } from "lucide-react";
import { Link } from "react-router-dom";

const BlogsCard = () => {
  const [blogs, setBlogs] = useState([])
  useEffect(() => {
  fetch("https://e-commerce-app-backend1.vercel.app/api/blogs")
    .then((res) => res.json())
    .then((data) => setBlogs(data));
}, []);
  return (
    <div className="mx-auto p-2 md:p-6 mt-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
        {blogs.map((blog) => {
          const [day, month] = blog.date.split(" ");

          return (
            <div
              key={blog.id}
              className="rounded content-font group overflow-hidden shadow-lg bg-white hover:shadow-xl transition duration-300"
            >
              {/* Image + Overlay */}
              <div className="relative overflow-hidden">
                <img
                  className="w-full h-52 object-cover group-hover:scale-125 transition-animation"
                  src={blog.image}
                  alt={blog.title}
                />

                {/* Category */}
                <div className="absolute bottom-0 left-0 bg-[#111825] px-4 py-2 text-white text-sm font-medium">
                  {blog.category}
                </div>

                {/* Date Badge */}
                <div className="absolute top-0 right-0 bg-[#111825] h-16 w-16 text-white rounded flex flex-col items-center justify-center mt-3 mr-3 hover:bg-white hover:text-[#111825] transition">
                  <span className="font-bold">{day}</span>
                  <small>{month}</small>
                </div>
              </div>

              {/* Content */}
              <div className="px-6 py-4">
                <Link
                  to={`/blogs/${blog.slug}`}
                  className="font-semibold text-lg inline-block hover:text-[#111825] transition"
                >
                  {blog.title}
                </Link>
                <p className="text-gray-500 text-sm mt-1">{blog.excerpt}</p>
              </div>

              <div className="flex justify-between items-center px-6 pb-4 text-sm">
                <div className="flex items-center text-gray-800">
                  <Clock className="w-4 h-4" />
                  <span className="ml-2">{blog.readTime}</span>
                </div>
                <Link to={`/blogs/${blog.slug}`} className="text-[#E5B236]">View Details</Link>
              </div>
            </div>
          );
        })}
      </div>
    </div> 
  );
};

export default BlogsCard;
