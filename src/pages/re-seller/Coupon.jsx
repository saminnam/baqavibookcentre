import axios from "axios";
import { useState } from "react";

export default function Coupon() {
  const [coupon, setCoupon] = useState("");

  const verify = async () => {
    await axios.post(
      " https://e-commerce-app-backend-seven-henna.vercel.app/api/reseller/verify-coupon",
      { couponCode: coupon },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      }
    );
    alert("Coupon verified");
  };

  return (
    <>
      <input onChange={e => setCoupon(e.target.value)} />
      <button onClick={verify}>Verify Coupon</button>
    </>
  );
}
