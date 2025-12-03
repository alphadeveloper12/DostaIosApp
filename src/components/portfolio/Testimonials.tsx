import React from "react";
import { Star } from "lucide-react"; // Assuming you are using lucide-react or similar

const Testimonials = () => {
 // Use your existing data here
 const testimonials = [
  {
   name: "Sarah Johnson",
   role: "Event Planner",
   text:
    "Dosta transformed our event with their impeccable catering and service. Highly recommended!",
   image:
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80",
  },
  {
   name: "Michael Chen",
   role: "Logistics Manager",
   text:
    "The efficiency and reliability of their delivery network are unmatched. A true partner in growth.",
   image:
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80",
  },
  {
   name: "Emily Davis",
   role: "Bride",
   text:
    "Our wedding food was the talk of the night. Thank you Dosta for making our special day perfect!",
   image:
    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80",
  },
  {
   name: "Sarah Johnson",
   role: "Event Planner",
   text:
    "Dosta transformed our event with their impeccable catering and service. Highly recommended!",
   image:
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80",
  },
  {
   name: "Michael Chen",
   role: "Logistics Manager",
   text:
    "The efficiency and reliability of their delivery network are unmatched. A true partner in growth.",
   image:
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80",
  },
  {
   name: "Emily Davis",
   role: "Bride",
   text:
    "Our wedding food was the talk of the night. Thank you Dosta for making our special day perfect!",
   image:
    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80",
  },
 ];

 return (
  <section className="py-20 bg-white overflow-hidden">
   <div className="main-container relative">
    <div className="text-center mb-16">
     <h2 className="text-3xl font-bold text-neutral-black mb-4">
      Client Satisfaction
     </h2>
     <p className="text-neutral-gray-dark max-w-2xl mx-auto">
      Don't just take our word for it. Here's what our valued clients have to
      say about their experience with Dosta.
     </p>
    </div>

    {/* Mask Image: Creates a fade effect on left and right 
            so cards don't just disappear abruptly 
        */}
    <div className="flex overflow-hidden space-x-8 [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)] py-10">
     {/* ORIGINAL SET */}
     <div className="flex space-x-8 animate-loop-scroll hover:paused">
      {testimonials.map((testimonial, index) => (
       <TestimonialCard key={index} testimonial={testimonial} />
      ))}
     </div>

     {/* DUPLICATE SET (Required for seamless looping) */}
     <div
      className="flex space-x-8 animate-loop-scroll hover:paused"
      aria-hidden="true">
      {testimonials.map((testimonial, index) => (
       <TestimonialCard key={`dup-${index}`} testimonial={testimonial} />
      ))}
     </div>
    </div>
   </div>
  </section>
 );
};

// Extracted Card Component for cleaner code
const TestimonialCard = ({ testimonial }: { testimonial: any }) => (
 <div className="bg-neutral-gray-lightest rounded-2xl p-8 relative w-[350px] md:w-[450px] flex-shrink-0 mt-6">
  <div className="absolute -top-6 left-8">
   <img
    src={testimonial.image}
    alt={testimonial.name}
    className="w-16 h-16 rounded-full border-4 border-white shadow-md object-cover object-top"
   />
  </div>
  <div className="mt-6">
   <div className="flex text-yellow-400 mb-4">
    {[...Array(5)].map((_, i) => (
     <Star key={i} size={16} fill="currentColor" />
    ))}
   </div>
   <p className="text-neutral-gray-dark italic mb-6">"{testimonial.text}"</p>
   <div>
    <h4 className="font-bold text-neutral-black">{testimonial.name}</h4>
    <p className="text-sm text-primary">{testimonial.role}</p>
   </div>
  </div>
 </div>
);

export default Testimonials;
