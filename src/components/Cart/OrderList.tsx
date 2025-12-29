// src/components/cart/OrderList.tsx
import React from "react";
import CartItem from "./CartItem";
import { CartItemType } from "@/pages/CartPage";
import { PlusIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import { Button } from "@/pages/catering/components/ui/button";

interface Section {
 title: string;
 items: CartItemType[];
}

interface OrderListProps {
 items?: CartItemType[];
 groupedItems?: Section[];
 title?: string;
 onQuantityChange: (id: number, delta: number) => void;
 onDeleteItem: (id: number) => void;
}

const OrderList: React.FC<OrderListProps> = ({
 items = [],
 groupedItems,
 title = "Order Now",
 onQuantityChange,
 onDeleteItem,
}) => {
 const totalItems = groupedItems
  ? groupedItems.reduce((acc, group) => acc + group.items.length, 0)
  : items.length;

 return (
  <div className="bg-white rounded-lg shadow-md md:p-6 p-4">
   <div className="flex justify-between items-center mb-6">
    <h2 className="text-[24px] leading-[32px] font-[700] text-[#2B2B43]">
     {title}
     <span className="text-[#83859C] text-[12px] leading-[16px] font-[600] pl-3">
      {" "}
      {totalItems} meals
     </span>
    </h2>
    <Button className="text-sm bg-transparent hover:bg-transparent border border-[#545563] font-medium text-[#545563]  transition-colors">
     Edit
    </Button>
   </div>

   <div className="space-y-4">
    {groupedItems
     ? groupedItems.map((group, groupIndex) => (
        <div key={groupIndex} className="mb-6">
         <h3 className="text-[#2B2B43] text-[18px] font-semibold mb-4">
          {group.title}
         </h3>
         <div className="space-y-4">
          {group.items.map((item, index) => (
           <React.Fragment key={item.id}>
            <CartItem
             item={item}
             onQuantityChange={onQuantityChange}
             onDeleteItem={onDeleteItem}
            />
            {/* Show separator unless it's the last item of the last group? Or just separate items within group? 
              Design shows simple list. Let's keep separator between items in a group. 
          */}
            {index < group.items.length - 1 && (
             <hr className="border-gray-100" />
            )}
           </React.Fragment>
          ))}
         </div>
        </div>
       ))
     : items.map((item, index) => (
        <React.Fragment key={item.id}>
         <CartItem
          item={item}
          onQuantityChange={onQuantityChange}
          onDeleteItem={onDeleteItem}
         />
         {index < items.length - 1 && <hr className="border-gray-100" />}
        </React.Fragment>
       ))}
   </div>

   <Link
    className="mt-6 flex items-center gap-2 text-[#054A86] font-medium hover:text-blue-800 transition-colors"
    to={"/vending-home/order-now"}>
    <PlusIcon className="w-5 h-5" />
    <span>Add More Meals</span>
   </Link>
  </div>
 );
};

export default OrderList;
