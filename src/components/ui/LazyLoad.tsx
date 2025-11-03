import  { useState, useEffect } from "react";
import { motion } from "framer-motion";

const LazyLoad = ({ children }) => {

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className=""
    >
      {children}
    </motion.div>
  );
};

export default LazyLoad;
