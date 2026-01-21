import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const steps = [
 {
  icon: "images/header/catle.svg",
  title: "Select Your Catering Style",
  description:
   "Choose from a variety of catering styles. Whether it's a corporate lunch or a private celebration, our fully customizable menu caters to all the staff events you host.",
 },
 {
  icon: "images/header/deleiver.svg",
  title: "Set Your Event Details",
  description:
   "Let us know the event date, time, and guest count. We'll handle the food planning, preparation, and delivery, so you don't have to worry about anything.",
 },
 {
  icon: "images/header/calender.svg",
  title: "Relax While We Deliver",
  description:
   "Sit back and leave the rest to us. Your order will be delivered fresh and on time to your specified location, ensuring everything runs smoothly on the day.",
 },
];

const HowItWorks = () => {
 return (
  <section className="pb-[24px] pt-[48px] bg-neutral-white">
   <div className="main-container mx-auto px-4">
    <h2 className="text-3xl md:text-[28px] leading-[36px] font-[700] tracking-[0.1px] text-center text-primary">
     How We Make It Happen
    </h2>

    {/* Steps */}
    <div className="flex flex-col md:flex-row justify-center items-center md:items-stretch md:gap-6 gap-4 my-[24px]">
     {steps.map((step, index) => {
      const Icon = step.icon;
      return (
       <div
        key={index}
        className="w-full max-w-[350px] md:h-auto md:w-[350px] bg-neutral-white rounded-[16px] p-6 shadow-lg text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-light rounded-full mb-4">
         <img src={step.icon} alt="logo" />
        </div>
        <h3 className="text-lg font-semibold text-primary mb-3">
         {step.title}
        </h3>
        <p className="text-neutral-gray-dark text-sm leading-relaxed">
         {step.description}
        </p>
       </div>
      );
     })}
    </div>

    {/* CTA Button */}
    <div className="text-center pt-4">
     <Link
      to="/catering/plan"
      className="!px-[16px] bg-primary text-white py-4 rounded-[8px] font-[600] text-[14px]">
      Let's Get Started
     </Link>
    </div>
   </div>
  </section>
 );
};

export default HowItWorks;
