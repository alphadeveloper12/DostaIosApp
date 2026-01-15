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
            className={`w-full border ${itemInCart ? "border-[#054A86]" : "border-[#EDEEF2]"
                } max-w-[306px] bg-neutral-white rounded-[12px] md:rounded-[16px] px-2 pt-2 pb-4 sm:px-4 sm:pt-4 sm:pb-6 overflow-hidden cursor-pointer hover:shadow-lg transition-shadow`}>
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
                    className={`block w-full h-full object-cover transition-opacity duration-300 ${imageLoading ? "opacity-0" : "opacity-100"
                        }`}
                />
            </div>

            <h3 className="text-[14px] leading-[20px] md:text-[24px] pt-2 pb-0.5 md:pt-3 md:pb-1 md:leading-[32px] font-[700] tracking-[0.1px] text-[#2B2B43] line-clamp-1">
                {data.heading}
            </h3>
            <p className="text-[11px] md:text-[14px] line-clamp-2 leading-[16px] md:leading-[20px] font-[400] tracking-[0.2px] text-[#83859C]">
                {data.description}
            </p>
            <div className="flex justify-between items-center pt-2">
                <h4 className="md:text-[16px] text-[13px] leading-[16px] md:leading-[24px] font-[700] tracking-[0.1px] text-[#2B2B43]">
                    {data.price}
                </h4>

                {itemInCart ? (
                    <>
                        {/* Quantity Stepper */}
                        <div className="flex items-center bg-[#EDEEF2] rounded-[6px] md:rounded-[8px] p-0.5">
                            <button
                                onClick={(e) => handleQuantityChange(e, data, -1)}
                                className="p-0.5 md:p-1 text-black">
                                <MinusIcon className="w-2.5 h-2.5 md:w-3 h-3" />
                            </button>
                            <span className="px-1.5 md:px-3 text-[12px] md:text-lg font-[700] md:font-medium">
                                {itemInCart.quantity}
                            </span>
                            <button
                                onClick={(e) => handleQuantityChange(e, data, 1)}
                                className="p-0.5 md:p-1 text-black">
                                <PlusIcon className="w-2.5 h-2.5 md:w-3 h-3" />
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
