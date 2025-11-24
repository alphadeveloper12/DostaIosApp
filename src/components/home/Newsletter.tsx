import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";

const Newsletter = () => {
 return (
  <section className="bg-[#EDEEF2]">
   <div className="container mx-auto px-4">
    <div className="max-w-2xl mx-auto text-center">
     <h2 className="text-2xl md:text-3xl font-bold text-primary mb-3 pt-[24px]">
      Subscribe for exclusive offers
     </h2>
     <p className="text-neutral-gray-dark text-sm mb-[36px]">
      Subscribe to our emails and get the latest product offers, recipe updates
      and more.
     </p>

     {/* Email Input */}
     <div className="flex flex-col sm:flex-row gap-2 items-center max-w-md mx-auto mb-[44px]">
      <Input
       type="email"
       placeholder="Email"
       className="w-full sm:w-[327px] h-[44px] rounded-[8px] flex-1 border-neutral-gray-light focus:border-primary bg-neutral-white placeholder:text-[16px] leadiang-[24px] tracking-[0.1px] font-[400]"
      />
      <Button className="w-full sm:w-auto bg-[#FF5C60] text-[14px] !leading-[20px] tracking-[0.3px] font-[700] !py-[12px] !px-[16px] hover:bg-secondary/90 text-secondary-foreground inline-flex items-center">
       Subscribe
      </Button>
     </div>
    </div>
   </div>
   <div className="text-center w-full border-t border-t-neutral-gray-light">
    {/* Privacy Note */}
    <p className="text-[14px] sm:text-[16px] leading-[20px] sm:leading-[24px] font-[400] tracking-[0.1px] text-neutral-black py-[16px] px-2">
     By providing your email you are agreeing to receive email marketing from
     Dosta Plazi. You can opt-out at any time. See{" "}
     <Link to="/terms" className="text-[#8C3EEE] hover:underline">
      Terms & Conditions
     </Link>{" "}
     and{" "}
     <Link to="/privacy-policy" className="text-[#8C3EEE] hover:underline">
      Privacy Policy
     </Link>
     .
    </p>
   </div>
  </section>
 );
};

export default Newsletter;
