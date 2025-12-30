import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MobileFooterNav from "@/components/home/MobileFooterNav";

const ComingSoon = () => {
 return (
  <div className="min-h-screen flex flex-col relative">
   <Header />
   <main className="flex-1 flex items-center justify-center bg-neutral-white px-4 py-20">
    <div className="text-center max-w-2xl mx-auto">
     <div className="mb-8 relative">
      <div className="text-[80px] sm:text-[120px] md:text-[150px] font-[700] text-primary/10 leading-none">
       COMING SOON
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
       <svg
        className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 text-primary"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24">
        <path
         strokeLinecap="round"
         strokeLinejoin="round"
         strokeWidth={1.5}
         d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
       </svg>
      </div>
     </div>

     <h1 className="text-[32px] sm:text-[40px] md:text-[48px] leading-[40px] sm:leading-[48px] md:leading-[56px] font-[700] -tracking-[0.1px] text-primary mb-4">
      Something Amazing is in the Works!
     </h1>

     <p className="text-[16px] sm:text-[18px] md:text-[20px] leading-[24px] sm:leading-[26px] md:leading-[28px] font-[600] -tracking-[0.1px] text-neutral-gray-dark mb-8 px-4">
      We are working hard to bring you this feature. Stay tuned for updates!
     </p>

     <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
      <a
       href="/"
       className="w-full sm:w-auto bg-primary text-primary-foreground font-[700] text-[14px] leading-[20px] tracking-[0.3px] py-[12px] px-[24px] rounded-[8px] hover:opacity-90 transition-opacity inline-flex items-center justify-center">
       Back to Home
      </a>
     </div>
    </div>
   </main>
   <MobileFooterNav />
   <Footer />
  </div>
 );
};

export default ComingSoon;
