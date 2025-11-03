import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import Slider from "react-slick"; // Importing React Slick

// Settings for the slider
const sliderSettings = {
 infinite: true, // Infinite loop
 slidesToShow: 1, // Show one slide at a time
 slidesToScroll: 1,
 autoplay: true, // Enable autoplay
 autoplaySpeed: 3000, // Change slide every 3 seconds
 dots: true, // Show pagination dots
 arrows: false, // Hide navigation arrows (optional)
 speed: 500, // Transition speed (ms)
};

const HeroSection = () => {
 const navigate = useNavigate();

 return (
  <section className="relative  lg:min-h-[623px] sm:min-h-[512px] flex items-start  justify-center  sm:py-0 bg-primary-dark">
   {/* React Slick Carousel */}
   <Slider {...sliderSettings} className=" main-container">
    {/* Render the same card 4 times for now */}
    {[...Array(4)].map((_, index) => (
     <div key={index} className="relative z-10 w-full lg:mt-[52px]  sm:mt-0 ">
      <div className="w-full flex flex-col md:flex-row items-center justify-between gap-[80px] px-0 sm:px-0 md:px-0 py-0 sm:py-0">
       <div className="w-auto md:w-[50%] lg:max-w-[490px]">
        <h1 className="text-[28px] pt-4 md:pt-0 leading-[34px] md:text-[40px] md:leading-[56px] font-[800] tracking-[0.1px] text-neutral-white pb-[16px]">
         Innovation Meets Nutrition!
        </h1>
        <p className="text-[16px] leading-[24px] tracking-[0.1px] font-[700] text-neutral-white pb-[32px]">
         We’re on a mission to transform how people experience healthy food,
         with chef-designed meals, smart technology, and a touch of surprise.
        </p>
        <Button className="bg-[#FF5C60] py-[12px] px-[16px]">
         Our Food Technology
        </Button>
       </div>

       <div className="max-w-full lg:min-w-[540px] rounded-[24px] overflow-hidden">
        <img
         src="/images/header/cheff.svg"
         alt="chef image"
         className="w-full h-auto md:h-[361px] object-cover object-top"
        />
       </div>
      </div>
     </div>
    ))}
   </Slider>
  </section>
 );
};

export default HeroSection;
