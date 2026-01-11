import React, { useState, useEffect, useCallback } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface LicenseViewerModalProps {
 isOpen: boolean;
 onClose: () => void;
 images: string[];
 title: string;
}

const LicenseViewerModal: React.FC<LicenseViewerModalProps> = ({
 isOpen,
 onClose,
 images,
 title,
}) => {
 const [currentIndex, setCurrentIndex] = useState(0);

 // Reset index when modal opens
 useEffect(() => {
  if (isOpen) {
   setCurrentIndex(0);
   document.body.style.overflow = "hidden"; // Prevent background scrolling
  } else {
   document.body.style.overflow = "unset";
  }
  return () => {
   document.body.style.overflow = "unset";
  };
 }, [isOpen]);

 const handlePrevious = useCallback(() => {
  setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
 }, [images.length]);

 const handleNext = useCallback(() => {
  setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
 }, [images.length]);

 // Keyboard navigation
 useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
   if (!isOpen) return;

   if (e.key === "ArrowLeft") handlePrevious();
   if (e.key === "ArrowRight") handleNext();
   if (e.key === "Escape") onClose();
  };

  window.addEventListener("keydown", handleKeyDown);
  return () => window.removeEventListener("keydown", handleKeyDown);
 }, [isOpen, handleNext, handlePrevious, onClose]);

 if (!isOpen) return null;

 return (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm">
   {/* Header */}
   <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-10 text-white bg-gradient-to-b from-black/50 to-transparent">
    <h3 className="text-lg font-semibold">{title}</h3>
    <button
     onClick={onClose}
     className="p-2 hover:bg-white/10 rounded-full transition-colors">
     <X className="w-6 h-6" />
    </button>
   </div>

   {/* Main Content */}
   <div className="relative w-full h-full flex items-center justify-center p-4">
    {/* Previous Button */}
    {images.length > 1 && (
     <button
      onClick={(e) => {
       e.stopPropagation();
       handlePrevious();
      }}
      className="absolute left-4 p-3 text-white bg-black/50 hover:bg-black/70 rounded-full transition-all hover:scale-110 focus:outline-none z-20">
      <ChevronLeft className="w-8 h-8" />
     </button>
    )}

    {/* Image Container */}
    <div
     className="relative max-w-5xl max-h-[85vh] select-none"
     onContextMenu={(e) => e.preventDefault()} // Disable right-click
    >
     <img
      src={images[currentIndex]}
      alt={`${title} - Page ${currentIndex + 1}`}
      className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl pointer-events-auto"
      draggable={false}
     />

     {/* Page Indicator */}
     <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm">
      {currentIndex + 1} / {images.length}
     </div>
    </div>

    {/* Next Button */}
    {images.length > 1 && (
     <button
      onClick={(e) => {
       e.stopPropagation();
       handleNext();
      }}
      className="absolute right-4 p-3 text-white bg-black/50 hover:bg-black/70 rounded-full transition-all hover:scale-110 focus:outline-none z-20">
      <ChevronRight className="w-8 h-8" />
     </button>
    )}
   </div>
  </div>
 );
};

export default LicenseViewerModal;
