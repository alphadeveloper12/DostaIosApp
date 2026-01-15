import React, { useState } from "react";
import Shrimmer from "./Shrimmer";

interface ImageWithShimmerProps
 extends React.ImgHTMLAttributes<HTMLImageElement> {
 wrapperClassName?: string;
}

const ImageWithShimmer: React.FC<ImageWithShimmerProps> = ({
 src,
 alt,
 className,
 wrapperClassName,
 ...props
}) => {
 const [imageLoading, setImageLoading] = useState(true);

 return (
  <div className={`relative overflow-hidden ${wrapperClassName || ""}`}>
   {imageLoading && (
    <div className="absolute inset-0 z-10">
     <Shrimmer />
    </div>
   )}
   <img
    src={src}
    alt={alt}
    onLoad={() => setImageLoading(false)}
    className={`block w-full h-full object-cover transition-opacity duration-300 ${
     imageLoading ? "opacity-0" : "opacity-100"
    } ${className || ""}`}
    {...props}
   />
  </div>
 );
};

export default ImageWithShimmer;
