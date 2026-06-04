import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Clock } from "lucide-react";
import axios from "axios";
import GlobalHero from "../../components/GlobalHero";
import axiosInstance from "../../api/axiosInstance";

const BlogDetail = () => {
  const { slug } = useParams();

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await axiosInstance.get(
          `/blogs/${slug}`
        );
        setBlog(res.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching blog:", error);
        setLoading(false);
      }
    };

    fetchBlog();
  }, [slug]);

  if (loading) {
    return <h2 className="text-center mt-20">Loading...</h2>;
  }

  if (!blog) {
    return <h2 className="text-center mt-20">Blog Not Found</h2>;
  }

  const [day, month] = blog.date?.split(" ") || [];

  return (
    <>
      <GlobalHero title={"📝 Blog Details"} />

      <div className="max-w-4xl mx-auto p-4 md:p-8 mt-10">
        <img
          src={blog.image}
          alt={blog.title}
          className="w-full h-72 object-cover rounded-lg shadow-md"
        />

        <div className="flex items-center gap-4 mt-4 text-sm text-gray-600">
          <div className="bg-[#111825] text-white px-3 py-1 rounded">
            {blog.category}
          </div>

          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            {blog.readTime}
          </div>

          <span className="font-medium">
            {day} {month}
          </span>
        </div>

        <h1 className="text-3xl font-bold mt-4">{blog.title}</h1>

        <div
          className="mt-4 text-gray-700 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />
      </div>
    </>
  );
};

export default BlogDetail;