import { motion } from "framer-motion";
const Shrimmer = () => {
 return (
  <div className="animate-pulse w-full h-full">
   {/* Shimmer skeleton style */}
   <div className="relative overflow-hidden rounded-lg bg-gray-200 w-full h-full">
    <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent" />
    {/* Placeholder adapts to parent */}
   </div>

   {/* Tailwind custom shimmer animation */}
   <style>{`
    @keyframes shimmer {
     100% {
      transform: translateX(100%);
     }
    }
   `}</style>
  </div>
 );
};

export default Shrimmer;
