// src/components/cart/CartPage.tsx
import React, { useState, useMemo, useEffect } from "react";
import OrderList from "@/components/Cart/OrderList";
import OrderSummary from "@/components/Cart/OrderSummary";
import Footer from "@/components/layout/Footer";
import BreadCrumb from "@/components/home/BreadCrumb";
import Header from "./catering/components/layout/Header";
import { buildConfirmPayload } from "@/utils/orderUtils";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Types matching Backend API
interface MenuItemAPI {
 id: number;
 name: string;
 price: string; // Decimal often returns as string
 image_url: string | null;
 description: string;
}

interface CartItemAPI {
 id: number;
 menu_item: MenuItemAPI;
 quantity: number;
 day_of_week: string | null; // "Monday"
 week_number: number | null; // 1-4
 subtotal: number;
}

interface CartAPI {
 id: number;
 location: {
  id: number;
  name: string;
  info: string;
 } | null;
 plan_type: "ORDER_NOW" | "START_PLAN" | "SMART_GRAB";
 plan_subtype: "NONE" | "WEEKLY" | "MONTHLY";
 pickup_type: "TODAY" | "IN_24_HOURS" | null;
 pickup_date: string | null;
 pickup_slot: { id: number; label: string } | null;
 total_price: string;
 items: CartItemAPI[];
}

export interface CartItemType {
 id: number; // Cart Item ID (not menu item id)
 menuItemId: number; // For checkout reconstruction
 name: string;
 notes: string;
 pickupLocation: string;
 imageUrl: string;
 quantity: number;
 price: number;
 weekNumber: number | null; // For grouping
}

const CartPage: React.FC = () => {
 const [cartData, setCartData] = useState<CartAPI | null>(null);
 const [items, setItems] = useState<CartItemType[]>([]);
 const [coupon, setCoupon] = useState<string>("DOSTA25");
 const [loading, setLoading] = useState<boolean>(true);
 const navigate = useNavigate();
 const baseUrl = import.meta.env.VITE_API_URL;

 const fetchCart = async () => {
  try {
   setLoading(true);
   const token = sessionStorage.getItem("authToken");
   // GET /api/vending/cart/
   const res = await axios.get(`${baseUrl}/api/vending/cart/`, {
    headers: { Authorization: `Token ${token}` },
   });

   if (res.data) {
    setCartData(res.data);
    mapCartToUI(res.data);
   }
  } catch (error) {
   console.error("Error fetching cart:", error);
   // setItem([]) if 404 or empty? API returns { message: "Cart is empty" } usually or 200 with empty items
   setItems([]);
  } finally {
   setLoading(false);
  }
 };

 useEffect(() => {
  fetchCart();
 }, []);

 const mapCartToUI = (cart: CartAPI) => {
  // Use location name from API
  const locationName = cart.location?.name || "Unknown Location";

  const mapped: CartItemType[] = (cart.items || []).map((apiItem) => {
   let notes = "Other notes or copy here";

   // Customize notes based on plan type
   if (cart.plan_subtype === "WEEKLY" || cart.plan_subtype === "MONTHLY") {
    if (apiItem.day_of_week) {
     notes = `Meal for ${apiItem.day_of_week}`;
    }
   }

   return {
    id: apiItem.id, // CartItem ID
    menuItemId: apiItem.menu_item.id,
    name: apiItem.menu_item.name,
    notes: notes,
    pickupLocation: `${locationName}`,
    imageUrl: apiItem.menu_item.image_url || "/images/vending_home/food.svg",
    quantity: apiItem.quantity,
    price: parseFloat(apiItem.menu_item.price),
    weekNumber: apiItem.week_number,
   };
  });

  setItems(mapped);
 };

 // derived title
 const getMainTitle = () => {
  if (!cartData) return "Order Now";
  if (cartData.plan_type === "SMART_GRAB") return "Smart Grab";
  if (cartData.plan_subtype === "WEEKLY") return "Weekly Plan";
  if (cartData.plan_subtype === "MONTHLY") return "Monthly Plan";
  if (cartData.pickup_type === "IN_24_HOURS") return "Pickup in 24";
  return "Order Now";
 };

 const handleQuantityChange = (id: number, delta: number) => {
  setItems((prev) =>
   prev.map((item) => {
    if (item.id === id) {
     const newQ = Math.max(1, item.quantity + delta);
     return { ...item, quantity: newQ };
    }
    return item;
   })
  );
 };

 const handleDeleteItem = (id: number) => {
  setItems((prev) => prev.filter((i) => i.id !== id));
 };

 const summary = useMemo(() => {
  const subtotal = items.reduce(
   (acc, item) => acc + item.price * item.quantity,
   0
  );
  const vat = subtotal * 0.05;
  const discount = coupon === "DOSTA25" ? 25.0 : 0;
  const total = Math.max(0, subtotal + vat - discount); // Prevent negative
  return { subtotal, vat, discount, total };
 }, [items, coupon]);

 const activePlanSubtype = cartData?.plan_subtype || "NONE";

 // Prepare grouped items for Monthly Plan
 const getMonthlyGroupedItems = () => {
  const weeks = [1, 2, 3, 4];
  const groups = [];

  for (const week of weeks) {
   const weekItems = items.filter((i) => i.weekNumber === week);
   if (weekItems.length > 0) {
    groups.push({
     title: `Week ${week}`,
     items: weekItems,
    });
   }
  }

  // Catch-all for items without week number in a monthly plan context
  const extras = items.filter(
   (i) => !i.weekNumber && activePlanSubtype === "MONTHLY"
  );
  if (extras.length > 0) {
   groups.push({ title: "Other Items", items: extras });
  }

  return groups;
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
    {loading ? (
     <div className="py-10 text-center">Loading cart...</div>
    ) : (
     <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start py-6">
      <div className="lg:col-span-2 space-y-6">
       {activePlanSubtype === "MONTHLY" ? (
        /* Grouped Monthly Plan */
        <OrderList
         title="Monthly Plan"
         groupedItems={getMonthlyGroupedItems()}
         onQuantityChange={handleQuantityChange}
         onDeleteItem={handleDeleteItem}
        />
       ) : (
        /* Default Single List (Pickup, Weekly, Smart Grab) */
        <OrderList
         title={getMainTitle()}
         items={items}
         onQuantityChange={handleQuantityChange}
         onDeleteItem={handleDeleteItem}
        />
       )}
      </div>
      <div className="lg:col-span-1">
       <OrderSummary
        subtotal={summary.subtotal}
        vat={summary.vat}
        discount={summary.discount}
        total={summary.total}
        coupon={coupon}
        setCoupon={setCoupon}
        onCheckout={async () => {
         if (!cartData) return;

         // Helper to find day from original if needed, or add to interface
         // Re-map items
         const checkoutItems = items.map((uiItem) => {
          // Try to find matching original item to preserve metadata like day_of_week
          const original = cartData.items.find((api) => api.id === uiItem.id);
          return {
           menu_item_id: uiItem.menuItemId,
           quantity: uiItem.quantity,
           day_of_week: original?.day_of_week || null,
           week_number: uiItem.weekNumber,
          };
         });

         const payload = {
          location_id: cartData.location?.id || null, // Safely access ID
          plan_type: cartData.plan_type,
          plan_subtype: cartData.plan_subtype,
          pickup_type: cartData.pickup_type,
          pickup_date: cartData.pickup_date,
          pickup_slot_id: cartData.pickup_slot?.id || null, // Extract ID from object
          items: checkoutItems,
         };

         console.log("Checkout Payload:", payload);
         try {
          const token = sessionStorage.getItem("authToken");

          if (!payload.location_id) {
           alert("Location data is missing. Please re-select location.");
           return;
          }

          await axios.post(`${baseUrl}/api/vending/order/confirm/`, payload, {
           headers: { Authorization: `Token ${token}` },
          });
          navigate("/vending-home/my-orders");
         } catch (err) {
          console.error("Checkout failed", err);
          alert("Failed to place order.");
         }
        }}
       />
      </div>
     </div>
    )}
   </div>
   <Footer />
  </div>
 );
};

export default CartPage;
