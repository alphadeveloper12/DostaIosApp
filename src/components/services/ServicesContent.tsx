import {
 ArrowRight,
 Truck,
 Utensils,
 Clock,
 MapPin,
 ShieldCheck,
 HeartHandshake,
} from "lucide-react";
import { Link } from "react-router-dom";

const ServicesContent = () => {
 const services = [
  {
   icon: Truck,
   title: "Express Delivery",
   description:
    "Get your orders delivered in record time with our optimized logistics network.",
   color: "bg-blue-50 text-primary",
  },
  {
   icon: Utensils,
   title: "Premium Catering",
   description:
    "Elevate your events with our exquisite catering services tailored to your needs.",
   color: "bg-red-50 text-secondary",
  },
  {
   icon: Clock,
   title: "Real-time Tracking",
   description:
    "Track your delivery every step of the way with our advanced GPS tracking system.",
   color: "bg-green-50 text-tertiary-green",
  },
  {
   icon: MapPin,
   title: "Wide Coverage",
   description:
    "We serve a vast network of locations, ensuring you're never out of reach.",
   color: "bg-purple-50 text-tertiary-purple",
  },
 ];

 const features = [
  {
   icon: ShieldCheck,
   title: "Secure Payments",
   description:
    "Your transactions are safe with our top-tier security protocols.",
  },
  {
   icon: HeartHandshake,
   title: "Customer First",
   description: "Our dedicated support team is available 24/7 to assist you.",
  },
  {
   icon: Utensils,
   title: "Premium Catering",
   description: "Our dedicated Premium Catering Service is right at your doorstep.",
  },
  {
   icon: MapPin,
   title: "Wide Coverage",
   description: "Our dedicated Wide Coverage Service is right at your doorstep.",
  },
 ];

 return (
  <div className="flex flex-col w-full">
   {/* Hero Section */}
   <section className="relative bg-primary-dark text-white py-20 overflow-hidden">
    <div className="absolute inset-0 opacity-10 bg-[url('/images/nav/dosta_blue.svg')] bg-repeat space-x-4"></div>
    <div className="main-container relative z-10 text-center">
     <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
      Our Exceptional Services <br />
      <span className="">Tailored for You</span>
     </h1>
     <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-10">
      Experience the best in delivery and catering. We bring convenience and
      quality right to your doorstep.
     </p>
     <div className="flex flex-col sm:flex-row gap-4 justify-center">
      <Link
       to="/signup"
       className="bg-[#ff5c60] hover:bg-red-600 text-white font-bold py-3 px-8 rounded-lg transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-2">
       Get Started <ArrowRight size={20} />
      </Link>
      <Link
       to="/contact-us"
       className="bg-transparent border-2 border-white hover:bg-white hover:text-primary-dark text-white font-bold py-3 px-8 rounded-lg transition-all flex items-center justify-center">
       Contact Us
      </Link>
     </div>
    </div>
   </section>

   {/* Services Grid */}
   <section className="py-20 bg-neutral-gray-lightest">
    <div className="main-container">
     <div className="text-center mb-16">
      <h2 className="text-3xl md:text-4xl font-bold text-neutral-black mb-4">
       Our Core Services
      </h2>
      <p className="text-neutral-gray-dark max-w-2xl mx-auto">
       Discover how we can make your life easier with our comprehensive range of
       services designed for efficiency and satisfaction.
      </p>
     </div>

     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {services.map((service, index) => (
       <div
        key={index}
        className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group">
        <div
         className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 ${service.color} group-hover:scale-110 transition-transform`}>
         <service.icon size={28} />
        </div>
        <h3 className="text-xl font-bold text-neutral-black mb-3">
         {service.title}
        </h3>
        <p className="text-neutral-gray-dark leading-relaxed">
         {service.description}
        </p>
       </div>
      ))}
     </div>
    </div>
   </section>

   {/* Features Section */}
   <section className="py-20 bg-white">
    <div className="main-container">
     <div className="flex flex-col lg:flex-row items-center gap-16">
      <div className="lg:w-1/2">
       <div className="relative">
        <div className="absolute -inset-4 bg-primary rounded-3xl transform rotate-3"></div>
        <img
         src="/images/services.svg"
         alt="Why Choose Us"
         className="relative rounded-2xl shadow-lg w-full object-cover h-[400px] bg-gray-100"
         onError={(e) => {
          e.currentTarget.src =
           "https://images.unsplash.com/photo-1556740758-90de374c12ad?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80";
         }}
        />
       </div>
      </div>
      <div className="lg:w-1/2">
       <h2 className="text-3xl md:text-4xl font-bold text-neutral-black mb-6">
        Why Choose Dosta?
       </h2>
       <p className="text-neutral-gray-dark mb-8 text-lg">
        We are committed to providing the highest quality service with a focus
        on reliability, speed, and customer satisfaction.
       </p>

       <div className="space-y-6">
        {features.map((feature, index) => (
         <div key={index} className="flex gap-4">
          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary-light flex items-center justify-center text-primary">
           <feature.icon size={24} />
          </div>
          <div>
           <h4 className="text-xl font-bold text-neutral-black mb-2">
            {feature.title}
           </h4>
           <p className="text-neutral-gray-dark">{feature.description}</p>
          </div>
         </div>
        ))}
       </div>
      </div>
     </div>
    </div>
   </section>

   {/* CTA Section */}
   <section className="py-20 bg-primary text-white relative overflow-hidden">
    <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-primary-3d rounded-full opacity-20 blur-3xl"></div>
    <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-secondary rounded-full opacity-20 blur-3xl"></div>

    <div className="main-container relative z-10 text-center">
     <h2 className="text-3xl md:text-4xl font-bold mb-6">
      Ready to Experience the Difference?
     </h2>
     <p className="text-primary-light text-lg mb-10 max-w-2xl mx-auto">
      Join thousands of satisfied customers who trust Dosta for their delivery
      and catering needs.
     </p>
     <Link
      to="/signin"
      className="inline-block bg-white text-primary font-bold py-4 px-10 rounded-full hover:bg-gray-100 transition-colors shadow-lg transform hover:scale-105">
      Join Dosta Today
     </Link>
    </div>
   </section>
  </div>
 );
};

export default ServicesContent;
