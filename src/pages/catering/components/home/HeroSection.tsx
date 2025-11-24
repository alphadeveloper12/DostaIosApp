import { useNavigate } from "react-router-dom";
const HeroSection = () => {
 const navigate = useNavigate();

 return (
  <section className="relative min-h-[400px] sm:min-h-[512px] flex items-start justify-center py-8 sm:py-0">
   {/* Background Image */}
   <div
    className="absolute inset-0 bg-cover bg-center"
    style={{
     backgroundImage: `url("images/header/header.svg")`,
     backgroundPosition: "center",
    }}>
    <div className="absolute inset-0 bg-neutral-black/20" />
   </div>

   {/* Content Card */}
   <div className="relative z-10 container mx-auto px-4 mt-[20px] sm:mt-[36px]">
    <div className="mx-auto w-full sm:w-[90%] md:h-[396px] md:w-[657px] bg-neutral-white rounded-[12px] sm:rounded-[16px] shadow-2xl px-[24px] sm:px-[48px] md:px-[64px] py-[24px] sm:py-[32px] text-center">
     {/* Heading */}
     <h1 className="text-[28px] sm:text-3xl md:text-[40px] leading-[36px] sm:leading-[44px] md:leading-[56px] font-[700] -tracking-[0.1px] text-primary mb-[16px] sm:mb-[24px]">
      Catering for Every Occasion
     </h1>

     {/* Description */}
     <p className="text-neutral-gray-dark text-[16px] sm:text-[18px] md:text-[20px] font-[600] leading-[24px] sm:leading-[26px] md:leading-[28px] -tracking-[0.1px] pb-[20px] sm:pb-[24px] px-0 sm:px-4">
      From boardrooms to backyards, plan your event meals with ease by our
      expert Catering team.
     </p>

     {/* CTA Button */}
     <button
      onClick={() => navigate("/catering/plan")}
      className="bg-primary text-primary-foreground font-[700] text-[14px] sm:text-[14px] mb-[20px] sm:mb-6 leading-[20px] tracking-[0.3px] py-[12px] px-[16px] sm:px-[16px] rounded-[8px] hover:opacity-90 transition-opacity w-full sm:w-auto">
      Start planning your event
     </button>

     {/* Illustration */}
     <div className="flex justify-center mt-4">
      <img
       src="images/header/headercardicon.svg"
       alt="Catering service team"
       className="w-full max-w-[280px] sm:max-w-[320px] md:w-[352px] h-auto md:h-[104px] object-contain"
      />
     </div>
    </div>
   </div>
  </section>
 );
};

export default HeroSection;
