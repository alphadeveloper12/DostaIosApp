import { motion } from "framer-motion";

const LazyLoad = ({ children }) => {
 return (
  <motion.div
   initial={{ opacity: 0, y: 20 }}
   animate={{ opacity: 1, y: 0 }}
   transition={{ duration: 0.3, ease: "easeOut" }}
   className="w-full">
   {children}
  </motion.div>
 );
};

export default LazyLoad;
