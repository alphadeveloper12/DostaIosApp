// Define the primary dark blue color (from original header/footer) and the new accent blue.
const PRIMARY_DARK_BLUE = "#0e2c45"; // Used for dark backgrounds (like the CTA background)
const ACCENT_BLUE = "#03446d"; // The new accent color requested by the client

const AboutUsContent = () => {
 return (
  <main className="flex-grow  bg-white w-full">
   <div className="main-container">
    <section className="py-20 ">
     <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <p
       className={`font-semibold uppercase tracking-widest mb-3 text-primary`}>
       Who We Are
      </p>
      <h1 className="text-5xl md:text-6xl font-extrabold text-primary leading-tight mb-6">
       About Us
      </h1>
      <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
       DOSTA is a UAE-based smart food and beverage group delivering innovative
       F&B solutions, automated catering services, smart vending machines, and
       event food management across Dubai, Abu Dhabi, and the wider United Arab
       Emirates.
      </p>
      <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
       Operating under Dosta Holding LLC, DOSTA brings together a portfolio of
       specialized subsidiaries to provide technology-driven, scalable, and
       sustainable food and delivery solutions tailored for corporate clients,
       government entities, developers, and high-footfall locations.
      </p>
      <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
       By integrating AI-enabled systems, smart kitchen operations, automated
       vending infrastructure, and data-driven delivery models, DOSTA is
       redefining how food and beverage services are produced, managed, and
       distributed in the UAE.
      </p>
      <div className="text-left max-w-2xl mx-auto bg-gray-50 p-6 rounded-lg">
       <h3 className="text-xl font-bold text-primary mb-4">
        Our group includes:
       </h3>
       <ul className="list-disc list-inside space-y-2 text-gray-700">
        <li>
         <strong>DOSTA Catering</strong> – smart catering and bulk food
         production solutions
        </li>
        <li>
         <strong>DOSTA Vending Machines</strong> – automated food and beverage
         vending across commercial and industrial sites
        </li>
        <li>
         <strong>DOSTA Events Management</strong> – end-to-end food and beverage
         solutions for events, exhibitions, and large gatherings
        </li>
       </ul>
       <p className="mt-4 text-gray-600 italic">
        Together, these verticals position DOSTA as a leading food innovation
        and delivery automation company in the UAE.
       </p>
      </div>
     </div>
    </section>

    {/* 2. Mission and Vision Section */}
    <section className="py-20 ">
     <div className="w-full grid md:grid-cols-2 gap-8">
      {/* Mission Card */}
      <div
       className={`bg-white p-8 rounded-xl shadow-xl border-t-4 border-primary`}>
       <div className="flex items-center space-x-4 mb-4">
        {/* Icon for Mission (Focus on operational excellence) */}
        <svg
         className={`w-10 h-10 text-primary`}
         fill="none"
         stroke="currentColor"
         viewBox="0 0 24 24"
         xmlns="http://www.w3.org/2000/svg">
         <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
        </svg>
        <h2 className="text-3xl font-bold text-gray-900">Our Mission</h2>
       </div>
       <p className="text-gray-700 text-lg leading-relaxed">
        To lead food and beverage innovation in the UAE by consolidating
        advanced catering, vending, and delivery automation services under one
        smart holding structure—driving operational excellence, digital
        transformation, and sustainable growth while supporting the UAE Vision
        2031 and national sustainability objectives.
       </p>
      </div>

      {/* Vision Card */}
      <div className="bg-white p-8 rounded-xl shadow-xl border-t-4 border-primary">
       <div className="flex items-center space-x-4 mb-4">
        {/* Icon for Vision (Focus on future/sight) */}
        <svg
         className={`w-10 h-10 text-primary`}
         fill="none"
         stroke="currentColor"
         viewBox="0 0 24 24"
         xmlns="http://www.w3.org/2000/svg">
         <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
         <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
        </svg>
        <h2 className="text-3xl font-bold text-gray-900">Our Vision</h2>
       </div>
       <p className="text-gray-700 text-lg leading-relaxed">
        To become the UAE’s most trusted smart food, catering, and delivery
        solutions provider, recognized across Dubai, Abu Dhabi, and the GCC for
        technology-driven operations, sustainable practices, and
        customer-centric food experiences.
       </p>
      </div>
     </div>
    </section>

    {/* 3. What We Do Section (Replaces Focus Areas) */}
    <section className="py-20 bg-gray-50">
     <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
       <h2 className="text-4xl font-extrabold text-primary mb-6">What We Do</h2>
       <p className="text-xl text-gray-600 max-w-3xl mx-auto">
        DOSTA specializes in revolutionary food and beverage innovation
        services, combining culinary expertise with advanced technology to
        deliver:
       </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
       {[
        "Smart catering solutions for corporate, industrial, and institutional clients",
        "Automated vending machine networks across offices, construction sites, and public locations",
        "Centralized kitchen operations with real-time production tracking",
        "AI-driven demand forecasting and inventory optimization",
        "Sustainable food systems aligned with UAE ESG and sustainability goals",
        "End-to-end food and beverage management for events and high-volume environments",
       ].map((item, index) => (
        <div
         key={index}
         className="flex items-start p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
         <div className="flex-shrink-0 mr-4">
          <svg
           className="w-6 h-6 text-primary"
           fill="none"
           stroke="currentColor"
           viewBox="0 0 24 24">
           <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M5 13l4 4L19 7"></path>
          </svg>
         </div>
         <p className="text-gray-700 font-medium">{item}</p>
        </div>
       ))}
      </div>

      <div className="mt-12 text-center">
       <p className="text-lg text-gray-600 max-w-4xl mx-auto border-t border-gray-200 pt-8">
        Our solutions are designed for cost efficiency, consistency,
        scalability, and compliance with UAE regulations and international food
        safety standards.
       </p>
      </div>
     </div>
    </section>
   </div>
   {/* 1. Hero / Introduction Section */}
  </main>
 );
};

export default AboutUsContent;
