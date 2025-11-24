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
      <p className="text-xl text-gray-600 max-w-3xl mx-auto">
       DOSTA is a UAE-based multi-sector business group focused on smart,
       sustainable, and technology-driven solutions in food, events, and
       Delivery automation. Established under Dosta Holding LLC, we unify all
       our subsidiaries — including{" "}
       <strong>
        DOSTA Catering, DOSTA Vending Machines, and Dosta For Events Managing
       </strong>{" "}
       — to deliver operational excellence, innovation, and scalable growth.
      </p>
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
        To consolidate and manage all subsidiaries under one holding structure,
        driving growth through{" "}
        <strong>
         innovation, operational excellence, and digital transformation
        </strong>
        , while supporting the UAE’s Vision 2031 for sustainability and economic
        development.
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
        To be the{" "}
        <strong>leading UAE smart food, events, and Delivery solutions</strong>{" "}
        — delivering sustainable, technology-driven, and customer-centric
        experiences across the region.
       </p>
      </div>
     </div>
    </section>

    {/* 3. Focus Areas / Pillars of Growth Section */}
    <section className="py-20 ">
     <div className="w-full">
      <h2 className="text-4xl font-extrabold text-primary text-center mb-12">
       Our Focus Areas
      </h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
       {/* Focus Area 1: Synergy */}
       <div className="p-6 bg-gray-50 rounded-lg shadow-md hover:shadow-xl transition duration-300">
        {/* Icon: Network/Synergy */}

        <h3 className="text-lg font-bold text-primary mb-2">
         Operational Synergy
        </h3>
        <p className="text-gray-600">
         Creating financial and operational synergy across subsidiaries to
         maximize efficiency and shared resources.
        </p>
       </div>

       {/* Focus Area 2: Scalable Growth */}
       <div className="p-6 bg-gray-50 rounded-lg shadow-md hover:shadow-xl transition duration-300">
        {/* Icon: Growth/Scale */}

        <h3 className="text-lg font-bold text-primary mb-2">
         Strategic Expansion
        </h3>
        <p className="text-gray-600">
         Driving scalable growth via strategic partnerships and technology
         adoption across all business units.
        </p>
       </div>

       {/* Focus Area 3: Diversifying Revenue */}
       <div className="p-6 bg-gray-50 rounded-lg shadow-md hover:shadow-xl transition duration-300">
        {/* Icon: Diversification/Money */}

        <h3 className="text-lg font-bold text-primary mb-2">
         Revenue Model
        </h3>
        <p className="text-gray-600">
         Diversifying revenue streams across catering, vending, logistics, and
         events to ensure stability and market resilience.
        </p>
       </div>

       {/* Focus Area 4: Sustainability */}
       <div className="p-6 bg-gray-50 rounded-lg shadow-md hover:shadow-xl transition duration-300">
        {/* Icon: Sustainability/Ecology */}

        <h3 className="text-lg font-bold text-primary mb-2">
         Social Responsibility
        </h3>
        <p className="text-gray-600">
         Embedding sustainability and social responsibility into all operations
         to align with the UAE's long-term vision.
        </p>
       </div>
      </div>
     </div>
    </section>
   </div>
   {/* 1. Hero / Introduction Section */}
  </main>
 );
};

export default AboutUsContent;
