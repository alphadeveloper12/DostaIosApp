import React, { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Link } from "react-router-dom";
import { MinusIcon, PlusIcon } from "@heroicons/react/24/outline";
import ImageWithShimmer from "../ui/ImageWithShimmer";

/** ---------------- Types ---------------- */
export interface FoodItem {
   imgSrc: string;
   heading: string;
   imgAlt: string;
   description: string;
   price: string; // e.g. "AED 47.25"
   id: number;
   locked?: boolean;
   presentNumber?: number;
}

export interface SelectedFoodItem extends FoodItem {
   quantity: number;
}

export interface GrabMenuProps {
   handleConfirmStep: () => void;
   smartGrabMenuFunc?: (cart: SelectedFoodItem[]) => void;
   initialCart?: SelectedFoodItem[];
   availableItems?: FoodItem[];
}

/** ---------------- Fallback static data ---------------- */
const fallbackFoodData: FoodItem[] = [
   {
      imgSrc: "/images/vending_home/cappucino.svg",
      heading: "Cappucino",
      imgAlt: "food1",
      description:
         "Ea his sensibus eleifend, mollis iudicabit omittantur id mel. Et cum ignota euismod corpora, et saepe.",
      price: "AED 47.00",
      id: 1,
   },
   {
      imgSrc: "/images/vending_home/crosiant.svg",
      heading: "Croissant",
      imgAlt: "food2",
      description:
         "Ea his sensibus eleifend, mollis iudicabit omittantur id mel. Et cum ignota euismod corpora, et saepe.",
      price: "AED 34.25",
      id: 2,
   },
   {
      imgSrc: "/images/vending_home/chicken.svg",
      heading: "Chicken wrap",
      imgAlt: "food3",
      description:
         "Ea his sensibus eleifend, mollis iudicabit omittantur id mel. Et cum ignota euismod corpora, et saepe.",
      price: "AED 56.50",
      id: 3,
   },
   {
      imgSrc: "/images/vending_home/fries.svg",
      heading: "Fries",
      imgAlt: "food4",
      description:
         "Ea his sensibus eleifend, mollis iudicabit omittantur id mel. Et cum ignota euismod corpora, et saepe.",
      price: "AED 32.50",
      id: 4,
   },
   {
      imgSrc: "/images/vending_home/soft_drink.svg",
      heading: "Soft Drink",
      imgAlt: "food5",
      description:
         "Ea his sensibus eleifend, mollis iudicabit omittantur id mel. Et cum ignota euismod corpora, et saepe.",
      price: "AED 47.25",
      id: 5,
   },
];

/** ---------------- Helpers ---------------- */
const stop = (e: React.MouseEvent) => e.stopPropagation();

/** ---------------- MenuCard (extracted to avoid missing component) ---------------- */
function MenuCard({
   data,
   itemInCart,
   onCardClick,
   onChangeQty,
}: {
   data: FoodItem;
   itemInCart?: SelectedFoodItem;
   onCardClick: (item: FoodItem) => void;
   onChangeQty: (e: React.MouseEvent, item: FoodItem, change: number) => void;
}) {
   const qty = itemInCart?.quantity ?? 0;
   const isLocked = data.locked ?? false;
   const isSoldOut = data.presentNumber === 0; // Assuming 0 presentNumber means sold out

   return (
      <div
         onClick={() => !isLocked && onCardClick(data)}
         className={`w-full border ${itemInCart ? "border-[#054A86]" : "border-[#EDEEF2]"
            } max-w-[306px] bg-neutral-white rounded-[12px] md:rounded-[16px] px-2 pt-2 pb-4 sm:px-4 sm:pt-4 sm:pb-6 overflow-hidden cursor-pointer hover:shadow-lg transition-shadow ${(isSoldOut || isLocked) ? "opacity-60 grayscale-[0.5]" : ""}`}>
         <ImageWithShimmer
            src={data.imgSrc}
            alt={data.imgAlt}
            wrapperClassName="w-full md:h-auto h-[120px] rounded-[12px] sm:rounded-[16px]"
         />

         {isLocked ? (
            <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
               <div className="bg-orange-500 text-white px-4 py-1 rounded-full font-bold text-sm shadow-lg transform -rotate-12">
                  LOCKED
               </div>
            </div>
         ) : isSoldOut ? (
            <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
               <div className="bg-red-500 text-white px-4 py-1 rounded-full font-bold text-sm shadow-lg transform -rotate-12">
                  SOLD OUT
               </div>
            </div>
         ) : null}

         <h3 className="text-[14px] leading-[20px] md:text-[24px] pt-2 pb-0.5 md:pt-3 md:pb-1 md:leading-[32px] font-[700] tracking-[0.1px] text-[#2B2B43] line-clamp-1">
            {data.heading}
         </h3>

         <p className="text-[11px] md:text-[14px] line-clamp-2 leading-[16px] md:leading-[20px] font-[400] tracking-[0.2px] text-[#83859C]">
            {data.description}
         </p>

         <div className="flex justify-between items-center pt-2">
            <h4 className="text-[13px] leading-[18px] md:text-[16px] md:leading-[24px] font-[700] tracking-[0.1px] text-[#2B2B43]">
               {data.price}
            </h4>

            {!isLocked && (
               qty > 0 ? (
                  <div className="flex items-center bg-[#EDEEF2] rounded-[6px] md:rounded-[8px] p-0.5">
                     <button
                        onClick={(e) => onChangeQty(e, data, -1)}
                        className="p-0.5 md:p-1 text-black"
                        aria-label="Decrease">
                        <MinusIcon className="w-2.5 h-2.5 md:w-3 h-3" />
                     </button>

                     <span className="px-1.5 md:px-3 text-[12px] md:text-lg font-[700] md:font-medium">
                        {qty}
                     </span>

                     <button
                        onClick={(e) => onChangeQty(e, data, +1)}
                        className="p-0.5 md:p-1 text-black"
                        aria-label="Increase">
                        <PlusIcon className="w-2.5 h-2.5 md:w-3 h-3" />
                     </button>
                  </div>
               ) : (
                  <button onClick={(e) => onChangeQty(e, data, +1)} aria-label="Add">
                     <img src="/images/icons/plusicon.svg" alt="plus icon" />
                  </button>
               )
            )}
         </div>
      </div>
   );
}

/** ---------------- Component ---------------- */
const GrabMenu: React.FC<GrabMenuProps> = ({
   handleConfirmStep,
   smartGrabMenuFunc,
   initialCart = [],
   availableItems,
}) => {
   const [openDialouge, setOpenDialouge] = useState(false);
   const [selectedItem, setSelectedItem] = useState<FoodItem | null>(null);
   const [toaster, setToaster] = useState(false);

   // Single source of truth for cart
   const [cart, setCart] = useState<SelectedFoodItem[]>(
      (initialCart || []).filter((i) => i.quantity > 0),
   );

   // Prefer provided items, fallback to static
   const itemsToDisplay = useMemo(() => {
      return availableItems || [];
   }, [availableItems]);

   // Derived: total number of meals
   const totalMeals = useMemo(
      () => cart.reduce((acc, item) => acc + item.quantity, 0),
      [cart],
   );

   // Keep parent in sync (backend-ready array)
   useEffect(() => {
      smartGrabMenuFunc?.(cart);
   }, [cart, smartGrabMenuFunc]);

   // Reset confirm
   const confirmFunc = () => {
      setOpenDialouge(false);
      setCart([]);
      setToaster(true);
      window.setTimeout(() => setToaster(false), 2000);
   };

   const handleCardClick = (item: FoodItem) => {
      setSelectedItem(item);
   };

   // Master cart handler (fixes upstream bug: minus button was increasing)
   const handleQuantityChange = (
      e: React.MouseEvent,
      foodItem: FoodItem,
      change: number,
   ) => {
      stop(e);

      setCart((prev) => {
         const idx = prev.findIndex((i) => i.imgAlt === foodItem.imgAlt);
         const next = [...prev];

         // FIX: Calculate total available UNLOCKED stock for this item
         const totalAvailable = itemsToDisplay
            .filter(item =>
               item.heading === foodItem.heading &&
               !item.locked
            )
            .reduce((acc, item) => acc + (item.presentNumber ?? 0), 0);

         if (idx >= 0) {
            const newQty = next[idx].quantity + change;
            if (newQty <= 0) {
               next.splice(idx, 1);
            } else if (newQty > totalAvailable) {
               // Limit to totalAvailable instead of hardcoded 3
               return prev;
            } else {
               next[idx] = { ...next[idx], quantity: newQty };
            }
            return next;
         }

         // Not in cart and we are adding
         if (change > 0) {
            if (totalAvailable <= 0) return next;
            return [...next, { ...foodItem, quantity: 1 }];
         }

         // Not in cart and removing -> do nothing
         return next;
      });
   };

   return (
      <div className="min-h-screen">
         <main className="flex-1 bg-neutral-white">
            {/* Header */}
            <div className="w-full bg-transparent pt-2 pb-6">
               <div className="md:px-[30px]">
                  <div className="flex md:flex-row flex-col justify-between items-center py-4">
                     <h2 className="text-[16px] text-[#2B2B43] leading-[24px] font-[700] tracking-[0.1px]">
                        Choose your meal from our daily menu of {itemsToDisplay.length}{" "}
                        chef-prepared meals
                     </h2>

                     <div className="md:flex gap-4 hidden md:flex-row flex-col">
                        {cart.length > 0 && (
                           <Button
                              className="bg-transparent hover:bg-transparent text-[#545563] border border-[#545563]"
                              onClick={() => setOpenDialouge(true)}>
                              Reset
                           </Button>
                        )}

                        {cart.length > 0 ? (
                           <Button
                              className="bg-[#054A86] hover:bg-[#054A86]"
                              onClick={handleConfirmStep}>
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
                     <p className="text-[14px] font-[400] leading-[20px] tracking-[0.2px] text-[#545563]">
                        {cart.length === 0
                           ? "No selected meals"
                           : `Selected meals: ${cart
                              .map((i) => `${i.heading} (x${i.quantity})`)
                              .join(", ")}`}
                     </p>

                     <p className="text-[14px] font-[400] leading-[20px] tracking-[0.2px] text-[#545563]">
                        Total: <span className="font-[700]">{totalMeals} Meals</span>
                     </p>
                  </div>
               </div>
            </div>

            {/* Cards */}
            <div className="w-full h-full pb-4">
               {itemsToDisplay.length > 0 ? (
                  <div className="md:px-[30px] grid grid-cols-2 md:flex md:gap-[24px] gap-[12px] flex-wrap">
                     {itemsToDisplay.map((data, index) => {
                        const itemInCart = cart.find((i) => i.imgAlt === data.imgAlt);
                        return (
                           <MenuCard
                              key={data.id ?? index}
                              data={data}
                              itemInCart={itemInCart}
                              onCardClick={handleCardClick}
                              onChangeQty={handleQuantityChange}
                           />
                        );
                     })}
                  </div>
               ) : (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                     <div className="bg-gray-50 rounded-full p-6 mb-4">
                        <X className="w-12 h-12 text-gray-300" />
                     </div>
                     <h3 className="text-[20px] font-bold text-[#2B2B43] mb-2">
                        No Items Available
                     </h3>
                     <p className="text-[#83859C] max-w-[300px]">
                        Sorry, there are no items currently available at this location.
                     </p>
                  </div>
               )}

               {/* Mobile buttons */}
               <div className="flex gap-4 md:flex-row flex-col md:hidden pt-6">
                  {cart.length > 0 && (
                     <Button
                        className="bg-transparent hover:bg-transparent text-[#545563] border border-[#545563]"
                        onClick={() => setOpenDialouge(true)}>
                        Reset
                     </Button>
                  )}

                  {cart.length > 0 ? (
                     <Button
                        className="bg-[#054A86] hover:bg-[#054A86]"
                        onClick={handleConfirmStep}>
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
                     className="fixed inset-0 z-50 flex justify-end bg-black/75"
                     initial={{ opacity: 0 }}
                     animate={{ opacity: 1 }}
                     exit={{ opacity: 0 }}>
                     <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", stiffness: 250, damping: 30 }}
                        className="bg-white w-full md:px-8 md:py-4 py-6 px-[15px] max-w-[522px] h-full shadow-2xl flex flex-col overflow-y-auto">
                        <div className="flex items-center justify-between pb-[16px]">
                           <h2 className="text-[28px] leading-[36px] font-[700]">
                              {selectedItem.heading}
                           </h2>
                           <button
                              onClick={() => setSelectedItem(null)}
                              className="p-2 rounded-full hover:bg-gray-100">
                              <X className="w-5 h-5" />
                           </button>
                        </div>

                        <img
                           src={selectedItem.imgSrc}
                           alt={selectedItem.imgAlt}
                           className="w-full object-cover h-60 md:h-[343px] rounded-[16px]"
                        />

                        <div className="flex-1 md:p-5 py-6 space-y-4">
                           <p className="text-gray-600 text-sm">{selectedItem.description}</p>

                           <h3 className="text-[24px] leading-[32px] font-[700] tracking-[0.1px]">
                              {selectedItem.price}
                           </h3>

                           <div className="md:pb-[24px]">
                              <img src="/images/icons/offertag.svg" alt="offer" />
                              <p className="py-3 px-[18px]">Buy one get one for free</p>
                           </div>

                           <div className="mt-0">
                              <Link
                                 className="text-[#056AC1] text-[16px] leading-[24px] md:font-[400] font-[600] tracking-[0.1px] underline"
                                 to={"/"}>
                                 Terms & conditions Apply
                              </Link>
                           </div>
                        </div>

                        <div className="md:p-4 flex flex-col sm:flex-row gap-3">
                           <button
                              onClick={() => setSelectedItem(null)}
                              className="w-full border border-[#054A86] rounded-lg py-2 font-medium text-[#054A86]">
                              Close
                           </button>

                           <button
                              onClick={() => {
                                 // add 1 from sheet
                                 handleQuantityChange(
                                    // fake event to reuse handler
                                    { stopPropagation: () => { } } as unknown as React.MouseEvent,
                                    selectedItem,
                                    +1,
                                 );
                                 setSelectedItem(null);
                              }}
                              className="w-full bg-[#054A86] text-white rounded-lg py-2 font-medium">
                              + Add
                           </button>
                        </div>
                     </motion.div>
                  </motion.div>
               )}
            </AnimatePresence>

            {/* Reset dialog (desktop) */}
            {openDialouge && (
               <motion.div
                  className="fixed hidden inset-0 bg-black/75 md:flex items-center justify-center z-50"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}>
                  <motion.div
                     className="bg-white px-4 py-5 rounded-lg shadow-lg max-w-[394px]"
                     initial={{ scale: 0.8, opacity: 0 }}
                     animate={{ scale: 1, opacity: 1 }}
                     exit={{ scale: 0.8, opacity: 0 }}
                     transition={{ duration: 0.2 }}>
                     <div className="text-lg font-bold mb-2 gap-3 flex">
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
                           onClick={confirmFunc}
                           className="px-4 py-2 bg-[#054A86] text-white rounded-lg hover:bg-[#054A86]">
                           Confirm
                        </button>
                     </div>
                  </motion.div>
               </motion.div>
            )}

            {/* Reset dialog (mobile sheet) */}
            <AnimatePresence>
               {openDialouge && (
                  <motion.div
                     className="fixed md:hidden inset-0 z-50 flex justify-end bg-black/75"
                     initial={{ opacity: 0 }}
                     animate={{ opacity: 1 }}
                     exit={{ opacity: 0 }}>
                     <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", stiffness: 250, damping: 30 }}
                        className="bg-white w-full md:px-8 md:py-4 px-[15px] py-6 max-w-[522px] h-full shadow-2xl flex flex-col overflow-y-auto">
                        <div className="flex items-center gap-4 pb-[24px] md:pb-[16px]">
                           <img src="/images/icons/info_icon.svg" alt="alert" />
                           <h2 className="text-[28px] leading-[36px] font-[700]">
                              Reset Menu Selection?
                           </h2>
                        </div>

                        <div className="flex-1 py-0">
                           <p className="text-gray-600 text-[16px] leading-[24px] font-[400] tracking-[0.1px]">
                              Are you sure you want to reset your menu selection?
                           </p>
                        </div>

                        <div className="md:p-4 flex flex-col sm:flex-row gap-3">
                           <button
                              onClick={() => setOpenDialouge(false)}
                              className="w-full border border-[#054A86] rounded-lg py-2 font-medium text-[#054A86]">
                              Close
                           </button>
                           <button
                              onClick={confirmFunc}
                              className="w-full bg-[#054A86] text-white rounded-lg py-2 font-medium">
                              Confirm
                           </button>
                        </div>
                     </motion.div>
                  </motion.div>
               )}
            </AnimatePresence>

            {/* Toaster */}
            {toaster && (
               <div className="fixed top-[104px] left-1/2 transform -translate-x-1/2 max-w-[540px] w-full h-[52px] bg-[#E8F9F1] rounded-[16px] shadow-[0px_4px_10px_rgba(232,249,241,0.6)] flex items-center px-4 gap-3 z-50">
                  <svg
                     width="20"
                     height="20"
                     viewBox="0 0 20 20"
                     fill="none"
                     xmlns="http://www.w3.org/2000/svg"
                     className="flex-shrink-0">
                     <path
                        d="M10 20C15.5228 20 20 15.5228 20 10C20 4.47715 15.5228 0 10 0C4.47715 0 0 4.47715 0 10C0 15.5228 4.47715 20 10 20Z"
                        fill="#34C759"
                     />
                     <path
                        d="M14 6L8.5 11.5L6 9"
                        stroke="white"
                        strokeWidth="1.66667"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                     />
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

export default GrabMenu;
