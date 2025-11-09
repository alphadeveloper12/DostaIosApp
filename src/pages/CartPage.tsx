// src/components/cart/CartPage.tsx
import React, { useState, useMemo } from "react";
import OrderList from "@/components/Cart/OrderList";
import OrderSummary from "@/components/Cart/OrderSummary";
import VendingHeader from "@/components/vending_home/VendingHeader";
import Footer from "@/components/layout/Footer";
import BreadCrumb from "@/components/home/BreadCrumb";
import Header from "./catering/components/layout/Header";

// Define the type for a single cart item for type safety
export interface CartItemType {
 id: number;
 name: string;
 notes: string;
 pickupLocation: string;
 imageUrl: string;
 quantity: number;
 price: number;
}

// Initial mock data based on the image
const initialCartItems: CartItemType[] = [
 {
  id: 1,
  name: "Angus Burger",
  notes: "Other notes or copy here",
  pickupLocation: "Pickup at: Barsha 1, Near Mall of the Emirates.",
  imageUrl: "/images/vending_home/food.svg", // Placeholder image
  quantity: 2,
  price: 12.4,
 },
 {
  id: 2,
  name: "Angus Burger",
  notes: "Other notes or copy here",
  pickupLocation: "Pickup at: Barsha 1, Near Mall of the Emirates.",
  imageUrl: "/images/vending_home/food.svg", // Placeholder image
  quantity: 2,
  price: 53.0,
 },
 {
  id: 3,
  name: "Angus Burger",
  notes: "Other notes or copy here",
  pickupLocation: "Pickup at: Barsha 1, Near Mall of the Emirates.",
  imageUrl: "/images/vending_home/food.svg", // Placeholder image
  quantity: 1,
  price: 35.0,
 },
];

const CartPage: React.FC = () => {
 const [items, setItems] = useState<CartItemType[]>(initialCartItems);
 const [coupon, setCoupon] = useState<string>("DOSTA25");

 const handleQuantityChange = (id: number, delta: number) => {
  setItems(
   items
    .map((item) =>
     item.id === id
      ? { ...item, quantity: Math.max(1, item.quantity + delta) }
      : item
    )
    .filter((item) => item.quantity > 0)
  );
 };

 const handleDeleteItem = (id: number) => {
  setItems(items.filter((item) => item.id !== id));
 };

 // Calculate summary values using useMemo for performance
 const summary = useMemo(() => {
  const subtotal = items.reduce(
   (acc, item) => acc + item.price * item.quantity,
   0
  );
  const vat = 5.0; // Fixed value from image
  const discount = coupon === "DOSTA25" ? 5.0 : 0; // Fixed discount from image
  const total = subtotal + vat - discount;
  return { subtotal, vat, discount, total };
 }, [items, coupon]);

 return (
  <div className="bg-gray-50 min-h-screen ">
   <Header />
   {/* Breadcrumbs and title section  */}
   <div className="w-full bg-white pt-2 pb-6">
    <div className="main-container">
     <BreadCrumb />
     <h2 className="text-[28px] text-[#054A86] leading-[36px] font-[700] tracking-[0.1px]">
      Cart
     </h2>
    </div>
   </div>
   <div className="main-container">
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start py-6">
     {/* Left Column: Order List */}
     <div className="lg:col-span-2">
      <OrderList
       items={items}
       onQuantityChange={handleQuantityChange}
       onDeleteItem={handleDeleteItem}
      />
     </div>

     {/* Right Column: Order Summary */}
     <div className="lg:col-span-1">
      <OrderSummary
       subtotal={summary.subtotal}
       vat={summary.vat}
       discount={summary.discount}
       total={summary.total}
       coupon={coupon}
       setCoupon={setCoupon}
      />
     </div>
    </div>
   </div>
   <Footer></Footer>
  </div>
 );
};

export default CartPage;
