import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Send } from "lucide-react";
import axiosInstance from "../../api/axiosInstance";

const sellerSchema = z.object({
  fullName: z.string().min(3, "Name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(10, "Phone number required"),
  businessType: z.string().min(1, "Business type required"),
  businessName: z.string().min(3, "Business name required"),
  gst: z.string().optional(),
  pan: z.string().min(5, "PAN required"),
  pickupAddress: z.string().min(5, "Pickup address required"),
  bankHolderName: z.string().min(3, "Account holder name required"),
  accountNumber: z.string().min(6, "Account number required"),
  ifsc: z.string().min(5, "IFSC required"),
  category: z.string().min(1, "Select category"),
});

export default function BecomeSellerForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(sellerSchema),
  });

  const onSubmit = async (data) => {
    try {
      const res = await axiosInstance.post("/seller", data);
      alert(res.data.message);

      reset(); // ✅ clears all inputs
    } catch (error) {
      console.error(error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="mx-auto p-8 bg-white mt-12 content-font">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid md:grid-cols-2 gap-10">
          {/* Personal Details */}
          <div className="p-6 border border-gray-300 rounded-lg bg-gray-50">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">
              Personal Details
            </h2>
            <div className="grid grid-cols-1 gap-4">
              <input
                {...register("fullName")}
                placeholder="Full Name"
                className="input bg-white border-gray-300 border rounded-lg p-3"
              />
              <p className="text-red-600 text-sm">{errors.fullName?.message}</p>

              <input
                {...register("email")}
                placeholder="Email"
                className="input bg-white border-gray-300 border rounded-lg p-3"
              />
              <p className="text-red-600 text-sm">{errors.email?.message}</p>

              <input
                {...register("phone")}
                placeholder="Phone Number"
                className="input bg-white border-gray-300 border rounded-lg p-3"
              />
              <p className="text-red-600 text-sm">{errors.phone?.message}</p>
            </div>
          </div>

          {/* Business Details */}
          <div className="p-6 border border-gray-300 rounded-lg bg-gray-50">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">
              Business Details
            </h2>

            <div className="grid grid-cols-1 gap-4">
              <select
                {...register("businessType")}
                className="input bg-white border-gray-300 border rounded-lg p-3"
              >
                <option value="">Select Business Type</option>
                <option value="individual">Individual</option>
                <option value="proprietorship">Proprietorship</option>
                <option value="company">Company</option>
              </select>
              <p className="text-red-600 text-sm">
                {errors.businessType?.message}
              </p>

              <input
                {...register("businessName")}
                placeholder="Business Name"
                className="input bg-white border-gray-300 border rounded-lg p-3"
              />
              <p className="text-red-600 text-sm">
                {errors.businessName?.message}
              </p>

              <input
                {...register("gst")}
                placeholder="GST Number (optional)"
                className="input bg-white border-gray-300 border rounded-lg p-3"
              />

              <input
                {...register("pan")}
                placeholder="PAN Number"
                className="input bg-white border-gray-300 border rounded-lg p-3"
              />
              <p className="text-red-600 text-sm">{errors.pan?.message}</p>
            </div>
          </div>

          {/* Address Section */}
          <div className="p-6 border border-gray-300 rounded-lg bg-gray-50">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">
              Pickup Address
            </h2>

            <textarea
              {...register("pickupAddress")}
              className="input bg-white border-gray-300 border rounded-lg p-3 h-32 w-full"
              placeholder="Enter pickup address"
            ></textarea>
            <p className="text-red-600 text-sm">
              {errors.pickupAddress?.message}
            </p>
          </div>

          {/* Bank Details */}
          <div className="p-6 border border-gray-300 rounded-lg bg-gray-50">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">
              Bank Details
            </h2>

            <div className="grid grid-cols-1 gap-4">
              <input
                {...register("bankHolderName")}
                placeholder="Account Holder Name"
                className="input bg-white border-gray-300 border rounded-lg p-3"
              />
              <p className="text-red-600 text-sm">
                {errors.bankHolderName?.message}
              </p>

              <input
                {...register("accountNumber")}
                placeholder="Account Number"
                className="input bg-white border-gray-300 border rounded-lg p-3"
              />
              <p className="text-red-600 text-sm">
                {errors.accountNumber?.message}
              </p>

              <input
                {...register("ifsc")}
                placeholder="IFSC Code"
                className="input bg-white border-gray-300 border rounded-lg p-3"
              />
              <p className="text-red-600 text-sm">{errors.ifsc?.message}</p>
            </div>
          </div>

          {/* Product Category */}
          <div className="p-6 border border-gray-300 rounded-lg bg-gray-50">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">
              Product Information
            </h2>

            <select
              {...register("category")}
              className="input bg-white w-full border-gray-300 border rounded-lg p-3"
            >
              <option value="">Select Product Category</option>
              <option value="fashion">Fashion</option>
              <option value="electronics">Electronics</option>
              <option value="grocery">Grocery</option>
              <option value="beauty">Beauty</option>
            </select>
            <p className="text-red-600 text-sm">{errors.category?.message}</p>
          </div>
        </div>

        {/* Submit Button */}
        <button className="mt-10 cursor-pointer flex items-center gap-2 bg-[#111825] text-white py-3 px-5 rounded hover:bg-yellow-600 transition">
          <Send size={18} />
          Send Message
        </button>
      </form>
    </div>
  );
}
