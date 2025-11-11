import React from "react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react"; // 'Divide' import was unused, so I removed it
import { Link } from "react-router-dom";
import { MinusIcon, PlusIcon } from "@heroicons/react/24/outline";

interface FoodItem {
 imgSrc: string;
 heading: string;
 imgAlt: string;
 description: string;
 price: string;
}

// --- NEW: Interface for items in our cart, now with quantity ---
interface SelectedFoodItem extends FoodItem {
 quantity: number;
}

interface MenuProps {
 handleConfirmStep: () => void;
 orderNowMenuFunc?: any; // Added optional prop for orderNowMenuFunc
}

// --- Data defined outside component (no change) ---
const foodData: FoodItem[] = [
 // ... (your food data remains unchanged)
 {
  imgSrc: "/images/vending_home/food.svg",
  heading: "Angus Burger",
  imgAlt: "food1",
  description:
   "Ea his sensibus eleifend, mollis iudicabit omittantur id mel. Et cum ignota euismod corpora, et saepe.",
  price: "AED 47.25",
 },
 {
  imgSrc: "/images/vending_home/food.svg",
  heading: "Angus Burger",
  imgAlt: "food2",
  description:
   "Ea his sensibus eleifend, mollis iudicabit omittantur id mel. Et cum ignota euismod corpora, et saepe.",
  price: "AED 47.25",
 },
 {
  imgSrc: "/images/vending_home/food.svg",
  heading: "Angus Burger",
  imgAlt: "food3",
  description:
   "Ea his sensibus eleifend, mollis iudicabit omittantur id mel. Et cum ignota euismod corpora, et saepe.",
  price: "AED 47.25",
 },
 {
  imgSrc: "/images/vending_home/food.svg",
  heading: "Angus Burger",
  imgAlt: "food4",
  description:
   "Ea his sensibus eleifend, mollis iudicabit omittantur id mel. Et cum ignota euismod corpora, et saepe.",
  price: "AED 47.25",
 },
 {
  imgSrc: "/images/vending_home/food.svg",
  heading: "Angus Burger",
  imgAlt: "food5",
  description:
   "Ea his sensibus eleifend, mollis iudicabit omittantur id mel. Et cum ignota euismod corpora, et saepe.",
  price: "AED 47.25",
 },
 {
  imgSrc: "/images/vending_home/food.svg",
  heading: "Angus Burger",
  imgAlt: "food6",
  description:
   "Ea his sensibus eleifend, mollis iudicabit omittantur id mel. Et cum ignota euismod corpora, et saepe.",
  price: "AED 47.25",
 },
 {
  imgSrc: "/images/vending_home/food.svg",
  heading: "Angus Burger",
  imgAlt: "food7",
  description:
   "Ea his sensibus eleifend, mollis iudicabit omittantur id mel. Et cum ignota euismod corpora, et saepe.",
  price: "AED 47.25",
 },

 // ... all other food items
];

const Menu: React.FC<MenuProps> = ({ handleConfirmStep, orderNowMenuFunc }) => {
 const [openDialouge, setOpenDialouge] = useState(false);
 const [scrolled, setScrolled] = useState(false);
 const [selectedItem, setSelectedItem] = useState<FoodItem | null>(null);
 const [isSheetOpen, setIsSheetOpen] = useState(false); // This state is set but not used
 const [toaster, setToaster] = useState<boolean>(false);

 // --- REMOVED: Old states ---
 // const [selectedItems, setSelectedItems] = useState<FoodItem[]>([]);
 // const [quantity, setQuantity] = useState(1);

 // --- NEW: Single state for the cart. This is your backend-ready array ---
 const [cart, setCart] = useState<SelectedFoodItem[]>([]);

 // --- NEW: Derived state (calculated from 'cart') ---
 // This calculates the total number of meals in the cart
 const totalMeals = cart.reduce((acc, item) => acc + item.quantity, 0);

 const handleCardClick = (item: FoodItem) => {
  setSelectedItem(item);
  setIsSheetOpen(true);
 };

 // --- UPDATED: confirmFunc now resets the new 'cart' state ---
 const confirmFunc = () => {
  setOpenDialouge(false);
  setCart([]); // Reset the cart
  setToaster(true);
  setTimeout(() => {
   setToaster(false);
  }, 2000);
 };
 useEffect(() => {
  orderNowMenuFunc(cart);
 }, [cart]);
 // --- Original scroll effect (no change) ---
 useEffect(() => {
  let ticking = false;
  const onScroll = () => {
   if (!ticking) {
    window.requestAnimationFrame(() => {
     setScrolled(window.scrollY > 120);
     ticking = false;
    });
    ticking = true;
   }
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
  return () => window.removeEventListener("scroll", onScroll);
 }, []);

 // --- NEW: Master function to handle all cart logic ---
 const handleQuantityChange = (
  e: React.MouseEvent,
  foodItem: FoodItem,
  change: number // +1 or -1
 ) => {
  e.stopPropagation(); // Prevents the sidebar from opening on card clicks

  setCart((prevCart) => {
   const existingItemIndex = prevCart.findIndex(
    (item) => item.imgAlt === foodItem.imgAlt
   );

   let newCart = [...prevCart]; // Copy the cart

   if (existingItemIndex > -1) {
    // Item already exists in cart
    const newQuantity = newCart[existingItemIndex].quantity + change;

    if (newQuantity <= 0) {
     // Remove item if quantity drops to 0 or below
     newCart.splice(existingItemIndex, 1);
    } else {
     // Update item's quantity
     newCart[existingItemIndex] = {
      ...newCart[existingItemIndex],
      quantity: newQuantity,
     };
    }
   } else if (change > 0) {
    // Item is not in cart, and we are adding it (change must be +1)
    newCart.push({ ...foodItem, quantity: 1 });
   }
   // If item isn't in cart and change is -1, do nothing

   return newCart;
  });
 };

 return (
  <div className="min-h-screen">
   <main className="flex-1 bg-neutral-white relative">
    <div className="w-full bg-transparent pt-2 pb-6">
     <div className="md:px-[30px]">
      {/* title and button */}
      <div className="flex md:flex-row flex-col justify-between items-center py-4 ">
       <h2 className="text-[16px] text-[#2B2B43] leading-[24px] font-[700] tracking-[0.1px]">
        Choose your meal from our daily menu of 13 chef-prepared meals
       </h2>
       <div className="md:flex gap-4 md:flex-row flex-col py-2 hidden">
        {/* --- UPDATED: Checks cart.length --- */}
        {cart.length > 0 && (
         <Button
          className="bg-transparent w-full hover:bg-transparent text-[#545563] border border-[#545563]"
          onClick={() => setOpenDialouge(true)}>
          Reset
         </Button>
        )}
        {/* --- UPDATED: Checks cart.length --- */}
        {cart.length > 0 ? (
         <Button
          className="bg-[#054A86] hover:bg-[#054A86]"
          onClick={() => handleConfirmStep()}>
          Confirm and review
         </Button>
        ) : (
         <Button
          className="bg-[#F7F7F9] hover:bg-[#F7F7F9] text-[#C7C8D2]"
          disabled>
          Confirm and review
         </Button>
        )}
       </div>
      </div>
      <div className="flex md:flex-row justify-between flex-col py-2">
       <p className="text-[14px] font-[700] leading-[20px] tracking-[0.2px] text-[#545563]">
        {/* --- UPDATED: Reads from cart and shows quantity --- */}
        {cart.length === 0 ? (
         "No selected meals"
        ) : (
         <div>
          <span className="font-[400]">Selected meals:</span>{" "}
          {cart.map((item) => `${item.heading} (x${item.quantity})`).join(", ")}
         </div>
        )}
       </p>
       <p className="text-[14px] font-[400] leading-[20px] tracking-[0.2px] text-[#545563]">
        {/* --- UPDATED: Shows total meals from new calculation --- */}
        Total: <span className="font-[700]">{totalMeals} Meals</span>
       </p>
      </div>
     </div>
    </div>

    <div className="w-full h-full pb-4">
     <div className="md:px-[30px] grid grid-cols-12 md:flex md:gap-[24px] gap-[12px] flex-wrap">
      {foodData.map((data, index) => {
       // --- NEW: Check if this item is in the cart ---
       const itemInCart = cart.find((item) => item.imgAlt === data.imgAlt);

       return (
        <div
         key={index}
         onClick={() => handleCardClick(data)}
         className={`w-full border ${
          // --- UPDATED: Check if itemInCart exists ---
          itemInCart ? "border-[#054A86]" : "border-[#EDEEF2]"
         } max-w-[306px] max-md:col-span-6 bg-neutral-white rounded-[16px] px-3 pt-3 pb-5 sm:px-4 sm:pt-4 sm:pb-6 overflow-hidden cursor-pointer hover:shadow-lg transition-shadow`}>
         <img
          src={data.imgSrc}
          alt={data.imgAlt}
          className="block w-full h-[120px] md:h-auto rounded-[12px] sm:rounded-[16px] object-cover"
         />
         <h3 className="text-[16px] leading-[24px] md:text-[24px] pt-3 pb-1 md:leading-[32px] font-[700] tracking-[0.1px] text-[#2B2B43]">
          {data.heading}
         </h3>
         <p className="text-[14px] line-clamp-2 leading-[20px] font-[400] tracking-[0.2px] text-[#83859C]">
          {data.description}
         </p>
         <div className="flex justify-between items-center pt-2">
          <h4 className="md:text-[16px] text-[13px] leading-[16px]  md:leading-[24px] font-[700] tracking-[0.1px] text-[#2B2B43]">
           {data.price}
          </h4>

          {/* --- UPDATED: Stepper logic is now functional --- */}
          {itemInCart ? (
           <>
            {/* Quantity Stepper */}
            <div className="flex items-center">
             <button
              onClick={(e) => handleQuantityChange(e, data, -1)}
              className="p-1 text-black bg-[#EDEEF2] rounded-[8px]">
              <MinusIcon className="w-3 h-3" />
             </button>
             <span className="px-3 md:text-lg text-sm font-[700] md:font-medium">
              {itemInCart.quantity}
             </span>
             <button
              onClick={(e) => handleQuantityChange(e, data, 1)}
              className="p-1 text-black bg-[#EDEEF2] rounded-[8px]">
              <PlusIcon className="w-3 h-3" />
             </button>
            </div>
           </>
          ) : (
           // --- UPDATED: Plus icon is now a functional button ---
           <button onClick={(e) => handleQuantityChange(e, data, 1)}>
            <img src="/images/icons/plusicon.svg" alt="plus icon" />
           </button>
          )}
         </div>
        </div>
       );
      })}
     </div>
     <div className="flex gap-4 md:flex-row flex-col pt-8 pb-1 md:hidden ">
      {/* --- UPDATED: Checks cart.length --- */}
      {cart.length > 0 && (
       <Button
        className="bg-transparent w-full hover:bg-transparent text-[#545563] border border-[#545563]"
        onClick={() => setOpenDialouge(true)}>
        Reset
       </Button>
      )}
      {/* --- UPDATED: Checks cart.length --- */}
      {cart.length > 0 ? (
       <Button
        className="bg-[#054A86] hover:bg-[#054A86]"
        onClick={() => handleConfirmStep()}>
        Confirm and review
       </Button>
      ) : (
       <Button
        className="bg-[#F7F7F9] hover:bg-[#F7F7F9] text-[#C7C8D2]"
        disabled>
        Confirm and review
       </Button>
      )}
     </div>
    </div>

    {/* Sidebar Sheet */}
    <AnimatePresence>
     {selectedItem && (
      <motion.div
       className="fixed inset-0 z-50 flex justify-end bg-black/75 "
       initial={{ opacity: 0 }}
       animate={{ opacity: 1 }}
       exit={{ opacity: 0 }}>
       {/* Sidebar Panel */}
       <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", stiffness: 250, damping: 30 }}
        className="bg-white w-full md:px-8 md:py-4 px-[15px] py-6 max-w-[522px] h-full shadow-2xl flex flex-col overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-[40px] md:pb-[16px]">
         <h2 className="text-[28px] leading-[36px] font-[700]  ">
          {selectedItem.heading}
         </h2>
         <button
          onClick={() => setSelectedItem(null)}
          className="p-2 rounded-full hover:bg-gray-100">
          <X className="w-5 h-5" />
         </button>
        </div>

        {/* Image */}
        <img
         src={selectedItem.imgSrc}
         alt={selectedItem.imgAlt}
         className="w-full object-cover h-60 md:h-[343px] rounded-[16px]"
        />

        {/* Content */}
        <div className="flex-1 p-5 space-y-4">
         <p className="text-gray-600 text-sm">{selectedItem.description}</p>
         <h3 className="text-[24px] leading-[32px] font-[700] tracking-[0.1px]">
          {selectedItem.price}
         </h3>
         {selectedItem && (
          <div className="md:pb-[24px]">
           <img src="/images/icons/offertag.svg" alt="offer" />
           <p className="py-3 px-[18px]">Buy one get one for free</p>
          </div>
         )}
         <div>
          <Link
           className="text-[#056AC1] text-[16px] leading-[24px] font-[400] tracking-[0.1px] underline"
           to={"/"}>
           Terms & conditions Apply
          </Link>
         </div>
        </div>

        {/* Footer Buttons */}
        <div className="md:p-4  flex flex-col sm:flex-row gap-3">
         <button
          onClick={() => setSelectedItem(null)}
          className="w-full border border-[#054A86] rounded-lg py-2 font-medium text-[#054A86]">
          Close
         </button>
         <button
          // --- UPDATED: Uses the new handler function ---
          onClick={() => {
           if (selectedItem) {
            // We pass a "fake" event object
            handleQuantityChange(
             { stopPropagation: () => {} } as React.MouseEvent,
             selectedItem,
             1
            );
           }
           setSelectedItem(null);
          }}
          className="w-full bg-[#054A86] text-white rounded-lg py-2 font-medium ">
          + Add
         </button>
        </div>
       </motion.div>
      </motion.div>
     )}
    </AnimatePresence>

    {/* --- All other modals (Reset, Toaster) remain unchanged --- */}

    {/* menu */}
    {openDialouge && (
     <motion.div
      className="fixed hidden inset-0 bg-black/75 md:flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}>
      <motion.div
       className="bg-white px-4 py-5  rounded-lg shadow-lg max-w-[394px] "
       initial={{ scale: 0.8, opacity: 0 }}
       animate={{ scale: 1, opacity: 1 }}
       exit={{ scale: 0.8, opacity: 0 }}
       transition={{ duration: 0.2 }}>
       <div className=" text-lg font-bold mb-2 gap-3 flex ">
        <img src="/images/icons/info_icon.svg" alt="info" />
        <h3>Reset Menu Selection?</h3>
       </div>
       <p className="text-[#545563] mb-8">
        Are you sure you want to reset your menu selection?
       </p>
       <div className="flex justify-end gap-4">
        <button
         onClick={() => setOpenDialouge(false)}
         className="px-4 py-2 bg-neutral-white border border-[neutral/gray dark] rounded-[8px] hover:bg-gray-300">
         Cancel
        </button>
        <button
         onClick={() => confirmFunc()}
         className="px-4 py-2 bg-[#054A86] text-white rounded-lg hover:bg-[#054A86]">
         Confirm
        </button>
       </div>
      </motion.div>
     </motion.div>
    )}
    {/* reset dialouge mobile*/}
    <AnimatePresence>
     {openDialouge && (
      <motion.div
       className="fixed md:hidden inset-0 z-50 flex justify-end bg-black/75 "
       initial={{ opacity: 0 }}
       animate={{ opacity: 1 }}
       exit={{ opacity: 0 }}>
       {/* Sidebar Panel */}
       <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", stiffness: 250, damping: 30 }}
        className="bg-white w-full md:px-8 md:py-4 px-[15px] py-6 max-w-[522px] h-full shadow-2xl flex flex-col overflow-y-auto">
        {/* Header */}
        <div className="flex items-center gap-4 pb-[24px] md:pb-[16px]">
         <img src="/images/icons/info_icon.svg" alt="alert" />
         <h2 className="text-[28px] leading-[36px] font-[700]   ">
          Reset Menu Selection?
         </h2>
        </div>

        {/* Content */}
        <div className="flex-1 py-0 ">
         <p className="text-gray-600 text-[16px] leading-[24px] font-[400] tracking-[0.1px]">
          Are you sure you want to reset your menu selection?
         </p>
        </div>

        {/* Footer Buttons */}
        <div className="md:p-4  flex flex-col sm:flex-row gap-3">
         <button
          onClick={() => setOpenDialouge(false)}
          className="w-full border border-[#054A86] rounded-lg py-2 font-medium text-[#054A86]">
          Close
         </button>
         <button
          onClick={() => confirmFunc()}
          className="w-full bg-[#054A86] text-white rounded-lg py-2 font-medium ">
          Confirm
         </button>
        </div>
       </motion.div>
      </motion.div>
     )}
    </AnimatePresence>

    {/* toaster  */}
    {toaster && (
     <div className="fixed top-[104px] left-1/2 transform -translate-x-1/2 max-w-[540px] w-full h-[52px] bg-[#E8F9F1] rounded-[16px] shadow-[0px_4px_10px_rgba(232,249,241,0.6)] flex items-center px-4 gap-3 z-50">
      {/* ... (svg icon) ... */}
      <svg
       width="20"
       height="20"
       viewBox="0 0 20 20"
       fill="none"
       xmlns="http://www.w3.org/2000/svg"
       className="flex-shrink-0">
       {/* ... (svg paths) ... */}
      </svg>
      <span className="flex-grow whitespace-nowrap text-[#2B2B43] font-medium text-sm">
       Menu selections have been successfully reset.
      </span>
     </div>
    )}
   </main>
  </div>
 );
};

export default Menu;
