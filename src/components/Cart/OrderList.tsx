// src/components/cart/OrderList.tsx
import React from "react";
import CartItem from "./CartItem";
import { CartItemType } from "@/pages/CartPage";
import { PlusIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import { Button } from "@/pages/catering/components/ui/button";

interface OrderListProps {
 items: CartItemType[];
 onQuantityChange: (id: number, delta: number) => void;
 onDeleteItem: (id: number) => void;
}

const OrderList: React.FC<OrderListProps> = ({
 items,
 onQuantityChange,
 onDeleteItem,
}) => {
 return (
  <div className="bg-white rounded-lg shadow-md md:p-6 p-4">
   <div className="flex justify-between items-center mb-6">
    <h2 className="text-xl font-semibold text-gray-800">
     Order Now{" "}
     <span className="text-gray-500 font-normal">({items.length} meals)</span>
    </h2>
    <Button className="text-sm bg-transparent hover:bg-transparent border border-[#545563] font-medium text-[#545563]  transition-colors">
     Edit
    </Button>
   </div>

   <div className="space-y-4">
    {items.map((item, index) => (
     <React.Fragment key={item.id}>
      <CartItem
       item={item}
       onQuantityChange={onQuantityChange}
       onDeleteItem={onDeleteItem}
      />
      {index < items.length - 1 && <hr />}
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
