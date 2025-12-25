// src/components/cart/CartPage.tsx
import React, { useState, useMemo, useEffect } from "react";
import OrderList from "@/components/Cart/OrderList";
import OrderSummary from "@/components/Cart/OrderSummary";
import Footer from "@/components/layout/Footer";
import BreadCrumb from "@/components/home/BreadCrumb";
import Header from "./catering/components/layout/Header";
import { formatItems, buildConfirmPayload } from "@/utils/orderUtils";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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

const CartPage: React.FC = () => {
 const [items, setItems] = useState<CartItemType[]>([]);
 const [coupon, setCoupon] = useState<string>("DOSTA25");
 const [orderState, setOrderState] = useState<any>(null);
 const [pickupOptionsState, setPickupOptions] = useState<any>([]);
 const [timeSlotsState, setTimeSlots] = useState<any>([]);
 const navigate = useNavigate();
 const baseUrl = import.meta.env.VITE_API_URL;

 useEffect(() => {
  const savedState = localStorage.getItem("orderProgress");
  if (savedState) {
   const parsedState = JSON.parse(savedState);
   setOrderState(parsedState);
   fetchPickupOptions();

   // Convert saved state to cart items for display
   const cartItems: CartItemType[] = [];
   const locationInfo = "Selected Location";

   const addItems = () => {
    if (parsedState.planType === "weekly") {
     if (parsedState.weekMenu) {
      Object.keys(parsedState.weekMenu).forEach((day) => {
       parsedState.weekMenu[day]?.forEach((mItem: any) => {
        cartItems.push({
         id: mItem.id,
         name: mItem.name || mItem.heading, // Handle API vs internal naming
         notes: day,
         pickupLocation: locationInfo,
         imageUrl: mItem.image || "/images/vending_home/food.svg",
         quantity: mItem.quantity || 1,
         price: parseFloat(mItem.price) || 0,
        });
       });
      });
     }
    } else if (parsedState.planType === "monthly") {
     [
      parsedState.weekMenu1,
      parsedState.weekMenu2,
      parsedState.weekMenu3,
      parsedState.weekMenu4,
     ].forEach((menuObj, index) => {
      if (menuObj) {
       Object.keys(menuObj).forEach((day) => {
        menuObj[day]?.forEach((mItem: any) => {
         cartItems.push({
          id: mItem.id,
          name: mItem.name || mItem.heading,
          notes: `Week ${index + 1} - ${day}`,
          pickupLocation: locationInfo,
          imageUrl: mItem.image || "/images/vending_home/food.svg",
          quantity: mItem.quantity || 1,
          price: parseFloat(mItem.price) || 0,
         });
        });
       });
      }
     });
    } else {
     const list = parsedState.orderNowMenu?.length
      ? parsedState.orderNowMenu
      : parsedState.smartGrabMenu;
     if (Array.isArray(list)) {
      list.forEach((mItem: any) => {
       cartItems.push({
        id: mItem.id,
        name: mItem.name || mItem.heading,
        notes: parsedState.orderType,
        pickupLocation: locationInfo,
        imageUrl: mItem.image || "/images/vending_home/food.svg",
        quantity: mItem.quantity || 1,
        price: parseFloat(mItem.price) || 0,
       });
      });
     }
    }
   };

   addItems();
   setItems(cartItems);
  }
 }, []);

 const fetchPickupOptions = async () => {
  try {
   const token = sessionStorage.getItem("authToken");
   const res = await axios.get(
    `${baseUrl}/api/vending/pickup-options/?location_id=1`,
    { headers: { Authorization: `Token ${token}` } }
   );
   if (res.data?.pickup_types) setPickupOptions(res.data.pickup_types);
   if (res.data?.time_slots) setTimeSlots(res.data.time_slots);
  } catch (error) {
   console.error("Error fetching pickup options:", error);
  }
 };

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

 const summary = useMemo(() => {
  const subtotal = items.reduce(
   (acc, item) => acc + item.price * item.quantity,
   0
  );
  const vat = subtotal * 0.05;
  const discount = coupon === "DOSTA25" ? 25.0 : 0;
  const total = subtotal + vat - discount;
  return { subtotal, vat, discount, total };
 }, [items, coupon]);

 const handleCheckout = async () => {
  console.log("Checkout clicked, orderState:", orderState);
  if (!orderState) {
   alert("No order found to place.");
   return;
  }

  let menuDataToSend: any = [];
  const {
   orderType,
   planType,
   weekMenu,
   weekMenu1,
   weekMenu2,
   weekMenu3,
   weekMenu4,
   orderNowMenu,
   smartGrabMenu,
  } = orderState;

  if (orderType === "Order Now") menuDataToSend = orderNowMenu;
  if (orderType === "Smart Grab") menuDataToSend = smartGrabMenu;
  if (orderType === "Start a Plan" && planType === "weekly")
   menuDataToSend = weekMenu;

  // Build base payload
  const payload = buildConfirmPayload({
   location: 1,
   orderType,
   planType,
   pickOrder: orderState.pickOrder,
   time: orderState.time,
   pickupOptions: pickupOptionsState,
   timeSlots: timeSlotsState,
   menuData: menuDataToSend,
   activeStep: 4,
  });

  // Monthly special handling: aggregate all weeks
  if (planType === "monthly") {
   const allItems: any[] = [];
   const processWeek = (wMenu: any, wNum: number) => {
    if (wMenu)
     Object.keys(wMenu).forEach((day) => {
      wMenu[day]?.forEach((i: any) =>
       allItems.push({
        menu_item_id: i.id,
        quantity: i.quantity || 1,
        day_of_week: day,
        week_number: wNum,
       })
      );
     });
   };
   processWeek(weekMenu1, 1);
   processWeek(weekMenu2, 2);
   processWeek(weekMenu3, 3);
   processWeek(weekMenu4, 4);
   payload.items = allItems;
  }

  console.log("Payload sending:", payload);

  try {
   const token = sessionStorage.getItem("authToken");
   await axios.post(`${baseUrl}/api/vending/order/confirm/`, payload, {
    headers: { Authorization: `Token ${token}` },
   });
   console.log("Order placed successfully");
   localStorage.removeItem("orderProgress");
   // alert("Order Placed Successfully!");

   // Navigate to my orders as requested
   navigate("/vending-home/my-orders");
  } catch (err) {
   console.error("Checkout Failed:", err);
   alert("Checkout Failed. See console.");
  }
 };

 return (
  <div className="bg-gray-50 min-h-screen ">
   <Header />
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
     <div className="lg:col-span-2">
      <OrderList
       items={items}
       onQuantityChange={handleQuantityChange}
       onDelete={handleDeleteItem} // Ensure prop name matches OrderList component interface if updated
      />
     </div>
     <div className="lg:col-span-1">
      <OrderSummary
       subtotal={summary.subtotal}
       vat={summary.vat}
       discount={summary.discount}
       total={summary.total}
       coupon={coupon}
       setCoupon={setCoupon}
       onCheckout={handleCheckout}
      />
     </div>
    </div>
   </div>
   <Footer />
  </div>
 );
};

export default CartPage;
