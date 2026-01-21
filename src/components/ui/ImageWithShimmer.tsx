import React, { useState } from "react";
import Shrimmer from "./Shrimmer";

interface ImageWithShimmerProps extends React.ImgHTMLAttributes<HTMLImageElement> {
 wrapperClassName?: string;
}

// Global set to track loaded images
const loadedImages = new Set<string>();

const ImageWithShimmer: React.FC<ImageWithShimmerProps> = ({
 src,
 alt,
 className,
 wrapperClassName,
 ...props
}) => {
 const imgRef = React.useRef<HTMLImageElement>(null);

 // Initial state based on whether image is already in our cache
 const [imageLoading, setImageLoading] = useState(() => {
  return src ? !loadedImages.has(src) : true;
 });

 const handleImageLoad = () => {
  if (src) {
   loadedImages.add(src);
  }
  setImageLoading(false);
 };

 React.useEffect(() => {
  if (imgRef.current?.complete) {
   handleImageLoad();
  }
 }, []);

 return (
  <div className={`relative overflow-hidden ${wrapperClassName || ""}`}>
   {imageLoading && (
    <div className="absolute inset-0 z-10">
     <Shrimmer />
    </div>
   )}
   <img
    ref={imgRef}
    src={src}
    alt={alt}
    loading="lazy"
    onLoad={handleImageLoad}
    className={`block w-full h-full object-cover transition-opacity duration-300 ${
     imageLoading ? "opacity-0" : "opacity-100"
    } ${className || ""}`}
    {...props}
   />
  </div>
 );
};

export default ImageWithShimmer;
