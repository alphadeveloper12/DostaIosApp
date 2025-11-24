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
 speed: 1000, // Transition speed (ms)
};

const HeroSection = () => {
 const navigate = useNavigate();

 return (
  <section className="relative  lg:min-h-[623px] sm:min-h-[732px] max-md:pt-[15px] max-md:pb-48 flex items-start  justify-center  sm:py-0 bg-primary-dark">
   {/* React Slick Carousel */}
   <Slider {...sliderSettings} className=" main-container max-md:px-4">
    {/* Render the same card 4 times for now */}
    {[...Array(4)].map((_, index) => (
     <div key={index} className="relative z-10 w-full lg:mt-[52px]  sm:mt-0 ">
      <div className="w-full flex flex-col-reverse md:flex-row items-center justify-between md:gap-[80px] gap-[20px] px-0 sm:px-0 md:px-0 py-0 sm:py-0">
       <div className="w-auto md:w-[50%] lg:max-w-[490px] ">
        <h1 className=" pt-[22px] max-md:text-center md:pt-0  text-[40px] leading-[56px] font-[800] tracking-[0.1px] text-neutral-white pb-[16px]">
         Innovation Meets Nutrition!
        </h1>
        <p className="text-[16px] max-md:text-center leading-[24px] tracking-[0.1px] font-[700] text-neutral-white pb-[32px]">
         We’re on a mission to transform how people experience healthy food,
         with chef-designed meals, smart technology, and a touch of surprise.
        </p>
        <div className="max-md:w-full max-md:text-center">
         <Button className="bg-[#FF5C60] py-[12px] px-[16px]">
          Our Food Technology
         </Button>
        </div>
       </div>

       <div className="relative lg:min-w-[540px] rounded-[24px]">
        <div className="overflow-hidden hidden md:block rounded-[24px]">
         <img
          src="/images/header/cheff.png"
          alt="chef image"
          className="w-full hidden md:block h-auto md:h-[361px] object-cover object-top"
         />

         <div className="md:h-[361px] absolute top-[-10px] inset-[-10px] right-[-10px] z-50 max-w-full lg:min-w-[540px] md:border-2 md:border-[#A7CF38] rounded-[24px]"></div>
        </div>
        <div className="overflow-hidden md:hidden  rounded-[24px]">
         <img
          src="/images/header/cheff_mob.svg"
          alt="chef image"
          className="w-full md:hidden block min-w-[330px] min-h-[225px] h-full object-cover object-top"
         />
        </div>
       </div>
      </div>
     </div>
    ))}
   </Slider>
  </section>
 );
};

export default HeroSection;
