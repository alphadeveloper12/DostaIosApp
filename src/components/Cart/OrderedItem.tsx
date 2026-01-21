// src/components/cart/OrderedItem.tsx
import React from "react";
import { CartItemType } from "@/pages/CartPage";

interface OrderedItemProps {
    item: CartItemType;
    isOrderInProgress?: boolean;
}

const OrderedItem: React.FC<OrderedItemProps> = ({
    item,
    isOrderInProgress,
}) => {
    return (
        <div className="flex flex-row md:items-start gap-4 py-4">
            <img
                src={item.imageUrl}
                alt={item.name}
                className="w-[60px] h-[60px] md:w-[72px] md:h-[72px] rounded-lg object-cover flex-shrink-0"
            />

            <div className="flex flex-col w-full">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-[16px] leading-[24px] font-[700] text-[#2B2B43]">
                            {item.name}
                        </h3>
                        <div className="flex flex-col gap-0.5 mt-1">
                            {item.notes && (
                                <p className="text-[12px] leading-[16px] font-[500] text-[#545563]">
                                    {item.notes}
                                </p>
                            )}
                            <p className="text-[12px] leading-[16px] font-[500] text-[#545563]">
                                Pickup at:{" "}
                                <span className="font-[600] text-[#2B2B43]">{item.pickupLocation}</span>
                            </p>
                        </div>

                        {/* Item Fulfillment Status */}
                        <div className="mt-2 flex items-center gap-2">
                            {item.status === "READY" ? (
                                <span className="bg-[#E6F9F0] text-[#1ABF70] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                                    Ready for Pickup
                                </span>
                            ) : item.status === "PREPARING" ? (
                                <span className="bg-[#FFF8E6] text-[#FFA800] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                                    Preparing in Kitchen
                                </span>
                            ) : (
                                <span className="bg-[#F0F2F5] text-[#83859C] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                                    {item.status || "Pending"}
                                </span>
                            )}
                        </div>


                    </div>

                    <div className="text-right flex gap-[26px]">
                        <span className="text-[16px] leading-[24px] font-[500] text-[#83859C]">
                            x {item.quantity}
                        </span>
                        <p className="text-[16px] leading-[24px] font-[700] text-[#2B2B43]">
                            AED{item.price.toFixed(2)}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderedItem;