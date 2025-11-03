import { useNavigate } from "react-router-dom"; // Import useNavigate

const steps = [
 {
  icon: "images/header/card1.svg", // Replace with your actual image path
  title: "25 Restaurants, One Easy Order",
  description:
   "Freshly prepared dishes delivered straight to your home or workspace",
  tag: "DOSTA DELIVERY",
  button: "Browse Menus",
  link: "/menus", // Link for this button
 },
 {
  icon: "images/header/card2.svg", // Replace with your actual image path
  title: "Meals on Your Schedule",
  description:
   "Plan your week with nutritious meals placed in vending stations near you",
  tag: "DOSTA VENDING",
  button: "Start Planning",
  link: "/vending-home", // Link for this button
 },
 {
  icon: "images/header/card3.svg", // Replace with your actual image path
  title: "Wellness Meets Convenience",
  description:
   "Balanced meal plans tailored for your health goals, delivered or picked up.",
  tag: "DOSTA WELLNESS",
  button: "Explore Plans",
  link: "/wellness", // Link for this button
 },
 {
  icon: "images/header/card4.svg", // Replace with your actual image path
  title: "Flavorful Catering for Any Event",
  description:
   "From private gatherings to grand celebrations, we craft unforgettable meals",
  tag: "DOSTA CATERING",
  button: "Book Your Event",
  link: "/catering", // Special link for catering
 },
 {
  icon: "images/header/card5.svg", // Replace with your actual image path
  title: "Fuel Your Team, Elevate Productivity",
  description:
   "Office catering that's both delicious and professionally executed",
  tag: "DOSTA CORPORATE",
  button: "Order for Your Team",
  link: "/corporate", // Link for this button
 },
 {
  icon: "images/header/card6.svg", // Replace with your actual image path
  title: "Food with Heart and Purpose",
  description:
   "Partner with us to support food drives, community events, and local causes.",
  tag: "DOSTA GIVING",
  button: "Support the Mission",
  link: "/giving", // Link for this button
 },
];


const ShowCase = () => {
 const navigate = useNavigate(); // Initialize useNavigate

 const handleNavigation = (link: any) => {
  navigate(link); // Navigate to the specified link
 };

 return (
  <section className="pb-[24px] pt-[48px]  lg:h-[844px] bg-[#F7F7F9] w-full ">
   <div className="main-container relative flex justify-center items-center">
    {/* Steps */}
    <div className="lg:absolute lg:px-[30px] -top-[145px] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 my-[24px] justify-items-center ">
     {steps.map((step, index) => {
      return (
       <div
        key={index}
        className="relative  w-full max-w-[350px] h-[478px] shadow-xl bg-neutral-white rounded-[16px] flex flex-col justify-between overflow-hidden">
        <div className="relative w-full h-[224px] md:h-[224px]">
         <img
          src={step.icon}
          alt="logo"
          className="w-full h-full object-cover rounded-t-[16px]"
         />
         <span className="text-primary-dark absolute bottom-[-14px] left-4 z-10 text-[10px] md:text-[11px] leading-4 font-[700] tracking-[0.6px] rounded-[16px] bg-[#A7CF38] py-[6px] px-[12px]">
          {step.tag}
         </span>
        </div>

        <div className="max-md:flex-1 max-md:flex flex-col md:flex-none  justify-between pt-[24px] md:pt-[32px] px-[16px] md:px-[24px] pb-[16px] md:pb-[24px]">
         <h3 className="text-[18px] md:text-[28px] leading-[26px] md:leading-[36px] tracking-[0.1px] font-[700] text-primary mb-2">
          {step.title}
         </h3>
         <p className="text-neutral-gray-dark text-[13px] md:text-[14px] leading-[20px] font-[400] pb-[16px] md:pb-[24px]">
          {step.description}
         </p>
         <button
          className="py-3 px-4 border text-[14px] text-primary-dark leading-[20px] tracking-[0.3px] border-[#054A86] rounded-[8px]"
          onClick={() => handleNavigation(step.link)}>
          {" "}
          {step.button}{" "}
         </button>
        </div>
       </div>
      );
     })}
    </div>
   </div>
  </section>
 );
};

export default ShowCase;
