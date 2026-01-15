import { Card } from "../ui/card";
import ImageWithShimmer from "@/components/ui/ImageWithShimmer";

interface EventTypeCardProps {
 image: string;
 title: string;
 selected?: boolean;
 onClick?: () => void;
}

const EventTypeCard = ({
 image,
 title,
 selected,
 onClick,
}: EventTypeCardProps) => {
 return (
  <Card
   onClick={onClick}
   className={`cursor-pointer rounded-2xl overflow-hidden transition-all bg-white 
        ${
         selected
          ? "border-[2px] border-[#054A86] bg-[#EAF5FF]"
          : "border-[2px] border-[#C7C8D2]"
        } 
        `}
   style={{ borderRadius: "16px" }}>
   {/* Image */}
   <div
    className=" h-48"
    style={{ margin: "12px", borderRadius: "16px", overflow: "hidden" }}>
    <ImageWithShimmer
     src={image}
     alt={title}
     className="w-full h-full object-cover"
     wrapperClassName="w-full h-full"
    />
   </div>

   {/* Title */}
   <div className="p-4 text-center">
    <h3
     className={`font-medium ${
      selected ? "text-[#054A86] font-semibold" : "text-primary-text"
     }`}
     style={{ fontSize: "16px" }}>
     {title}
    </h3>
   </div>
  </Card>
 );
};

export default EventTypeCard;
