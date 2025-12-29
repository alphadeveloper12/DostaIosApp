// src/components/cart/CartItem.tsx
import React from "react";
import { CartItemType } from "@/pages/CartPage";
import { PlusIcon, MinusIcon, TrashIcon } from "@heroicons/react/24/outline";

interface CartItemProps {
 item: CartItemType;
 onQuantityChange: (id: number, delta: number) => void;
 onDeleteItem: (id: number) => void;
}

const CartItem: React.FC<CartItemProps> = ({
 item,
 onQuantityChange,
 onDeleteItem,
}) => {
 return (
  <div className="flex flex-row md:items-end gap-3 ">
   <img
    src={item.imageUrl}
    alt={item.name}
    className="md:w-[72px] md:h-[72px] h-10 w-10 md:rounded-md rounded-xl object-cover"
   />

   <div className=" flex flex-col lg:flex-row lg:items-center lg:justify-between w-full">
    <div className="flex-grow">
     <h3 className="text-[16px] leading-[24px] font-[700]">{item.name}</h3>
     <p className="text-[12px] leading-[16px] font-[600] text-neutral-gray-dark">
      {item.notes}
     </p>
     <div className="">
      {" "}
      <span className="text-[12px] leading-[16px] font-[600] text-neutral-gray-dark">
       pick up at:{" "}
      </span>
      <span className="text-[12px] leading-[16px] font-[600] text-neutral-black">
       {item.pickupLocation}
      </span>
     </div>
    </div>

    <div className="flex items-center max-md:justify-between gap-4 pt-[13px]">
     {/* Quantity Stepper */}
     <div className="flex items-center  ">
      <button
       onClick={() => onQuantityChange(item.id, -1)}
       className="p-[3px] text-black bg-[#EDEEF2] rounded-[4px]">
       <MinusIcon className="w-[10px] h-[10px]" />
      </button>
      <span className="px-2 text-[16px] leading-[24px] font-[600]">{item.quantity}</span>
      <button
       onClick={() => onQuantityChange(item.id, 1)}
       className="p-[3px] text-black bg-[#EDEEF2] rounded-[4px]">
       <PlusIcon className="w-[10px] h-[10px]" />
      </button>
     </div>

     {/* Price */}
     <div className="w-24 text-right">
      <p className="text-lg md:font-semibold font-[700] text-neutral-black">
       AED{item.price.toFixed(2)}
      </p>
     </div>

     {/* Delete Button */}
     <button
      onClick={() => onDeleteItem(item.id)}
      className="text-gray-400 hover:text-red-500 transition-colors">
      <img src="/images/icons/delete.svg" alt="delete" />
     </button>
    </div>
   </div>
  </div>
 );
};

export default CartItem;
