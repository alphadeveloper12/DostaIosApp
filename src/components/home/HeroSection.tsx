import { Link, useNavigate } from "react-router-dom";
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
 fade: true, // Fade effect
 cssEase: "linear",
 swipe: false, // Disable swiping to prevent slide feel
};

const SliderData = [
 {
  title: "Innovation Meets Nutrition!",
  description:
   "We’re on a mission to transform how people experience healthy food, with chef-designed meals, smart technology, and a touch of surprise.",
  image: "/images/header/cheff.png",
  buttonText: "Explore Our Services",
  buttonLink: "/services",
 },
 {
  title: "Chef-Prepared Meals Crafted for Quality & Consistency",
  description:
   "Fresh meals prepared daily by professional chefs, designed for individuals, businesses, and modern lifestyles across Dubai.",
  image: "/images/header/Slide2.png",
  buttonText: "View Our Food Services",
  buttonLink: "/services",
 },
 {
  title: "Corporate & Event Catering Services in Dubai",
  description:
   "Customized catering solutions for corporate events, private gatherings,and special occasions — delivered with consistency and care.",
  image: "/images/header/Slide3.png",
  buttonText: "Request a Quote",
  buttonLink: "/catering/request-custom-quote",
 },
 {
  title: "Smart Food Ordering Starts Here",
  description:
   "Download the DOSTA app and enjoy 15% off your first order with FIRST15.",
  image: "/images/header/Slide4.png",
  buttonText: "Download App",
  buttonLink: "/",
 },
];

const HeroSection = () => {
 const navigate = useNavigate();

 return (
  <section className="relative  lg:min-h-[623px] sm:min-h-[732px] max-md:pt-[15px] max-md:pb-48 flex items-start  justify-center  sm:py-0 bg-primary-dark">
   {/* React Slick Carousel */}
   <Slider {...sliderSettings} className=" main-container max-md:px-4">
    {/* Render the same card 4 times for now */}
    {SliderData.map((item, index) => (
     <div
      key={index}
      className="relative z-10 w-full lg:mt-[52px]  sm:mt-0 px-4">
      <div className="w-full flex flex-col-reverse md:flex-row items-center justify-between md:gap-[80px] gap-[20px] px-0 sm:px-0 md:px-0 py-0 sm:py-0">
       <div className="w-auto md:w-[50%] lg:max-w-[490px] ">
        <h1 className=" pt-[22px] max-md:text-center md:pt-0  text-[40px] leading-[56px] font-[800] tracking-[0.1px] text-neutral-white pb-[16px]">
         {item.title}
        </h1>
        <p className="text-[16px] max-md:text-center leading-[24px] tracking-[0.1px] font-[700] text-neutral-white pb-[32px]">
         {item.description}
        </p>
        <div className="max-md:w-full max-md:text-center">
         <Link
          to={item.buttonLink}
          className="bg-[#FF5C60] rounded-[8px] border-none text-[14px] font-[700] text-white py-[12px] px-[16px]">
          {item.buttonText}
         </Link>
        </div>
       </div>

       <div className="relative lg:min-w-[540px] rounded-[24px]">
        <div className="overflow-hidden hidden md:block rounded-[24px]">
         <img
          src={item.image}
          alt="chef image"
          className="w-full hidden md:block h-auto md:h-[361px] object-cover object-top"
         />

         <div className="md:h-[361px] absolute top-[-10px] inset-[-10px] right-[-10px] z-50 max-w-full lg:min-w-[540px] md:border-2 md:border-[#A7CF38] rounded-[24px]"></div>
        </div>
        <div className="overflow-hidden md:hidden  rounded-[24px]">
         <img
          src={item.image}
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
