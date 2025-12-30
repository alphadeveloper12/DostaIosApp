import React, { useState } from "react";
import Shrimmer from "../ui/Shrimmer";
import { MinusIcon, PlusIcon } from "@heroicons/react/24/outline";

interface FoodItem {
 imgSrc: string;
 heading: string;
 imgAlt: string;
 description: string;
 price: string;
 id: number;
}

interface SelectedFoodItem extends FoodItem {
 quantity: number;
}

interface MenuCardProps {
 data: FoodItem;
 itemInCart?: SelectedFoodItem;
 handleCardClick: (item: FoodItem) => void;
 handleQuantityChange: (
  e: React.MouseEvent,
  foodItem: FoodItem,
  change: number
 ) => void;
}

const MenuCard: React.FC<MenuCardProps> = ({
 data,
 itemInCart,
 handleCardClick,
 handleQuantityChange,
}) => {
 const [imageLoading, setImageLoading] = useState(true);

 return (
  <div
   onClick={() => handleCardClick(data)}
   className={`w-full border ${
    itemInCart ? "border-[#054A86]" : "border-[#EDEEF2]"
   } max-w-[306px] max-md:col-span-6 bg-neutral-white rounded-[16px] px-3 pt-3 pb-5 sm:px-4 sm:pt-4 sm:pb-6 overflow-hidden cursor-pointer hover:shadow-lg transition-shadow`}>
   {/* Image Container with Shimmer */}
   <div className="relative w-full h-[120px] md:h-[180px] rounded-[12px] sm:rounded-[16px] overflow-hidden">
    {imageLoading && (
     <div className="absolute inset-0 z-10">
      <Shrimmer />
     </div>
    )}
    <img
     src={data.imgSrc}
     alt={data.imgAlt}
     onLoad={() => setImageLoading(false)}
     className={`block w-full h-full object-cover transition-opacity duration-300 ${
      imageLoading ? "opacity-0" : "opacity-100"
     }`}
    />
   </div>

   <h3 className="text-[16px] leading-[24px] md:text-[24px] pt-3 pb-1 md:leading-[32px] font-[700] tracking-[0.1px] text-[#2B2B43]">
    {data.heading}
   </h3>
   <p className="text-[14px] line-clamp-2 leading-[20px] font-[400] tracking-[0.2px] text-[#83859C]">
    {data.description}
   </p>
   <div className="flex justify-between items-center pt-2">
    <h4 className="md:text-[16px] text-[13px] leading-[16px] md:leading-[24px] font-[700] tracking-[0.1px] text-[#2B2B43]">
     {data.price}
    </h4>

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
     // Plus icon button
     <button onClick={(e) => handleQuantityChange(e, data, 1)}>
      <img src="/images/icons/plusicon.svg" alt="plus icon" />
     </button>
    )}
   </div>
  </div>
 );
};

export default MenuCard;
