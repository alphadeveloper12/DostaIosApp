const ContactUsContent = () => {
 return (
  <main className="flex-grow py-16 sm:py-24 bg-gray-50 w-full">
   <div className="main-container px-4 sm:px-6 lg:px-8">
    {/* Header Section */}
    <div className="text-center mb-16">
     <p className={`font-semibold uppercase tracking-widest mb-3 text-primary`}>
      Get in Touch
     </p>
     <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight">
      Contact <span className={`text-primary`}>DOSTA</span>
     </h1>
     <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
      We are here to help you with inquiries about our services, support, and
      career opportunities.
     </p>
    </div>

    {/* Main Content Grid */}
    <div className="grid lg:grid-cols-3 gap-10">
     {/* Left Column: General Contact & Support (Main Cards) */}
     <div className="lg:col-span-2 space-y-8">
      {/* Card 1: Main Contact */}
      <div className="bg-white p-8 rounded-xl shadow-lg border-l-4 border-primary">
       <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center">
        {/* Icon for Business Contact */}
        <svg
         className={`w-8 h-8 mr-3 text-primary`}
         fill="none"
         stroke="currentColor"
         viewBox="0 0 24 24"
         xmlns="http://www.w3.org/2000/svg">
         <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
        </svg>
        Contact DOSTA
       </h2>
       <dl className="space-y-4 text-lg">
        <div>
         <dt className="font-medium text-gray-500">Website</dt>
         <dd>
          <a
           href="https://www.dosta.ae"
           target="_blank"
           rel="noopener noreferrer"
           className={`text-primary hover:text-gray-900 transition duration-300`}>
           www.dosta.ae
          </a>
         </dd>
        </div>
        <div>
         <dt className="font-medium text-gray-500">General Inquiry Email</dt>
         <dd>
          <a
           href="mailto:info@dosta.ae"
           className={`text-primary hover:text-gray-900 transition duration-300`}>
           info@dosta.ae
          </a>
         </dd>
        </div>
       </dl>
      </div>

      {/* Card 2: Customer Support */}
      <div
       className={`bg-white p-8 rounded-xl shadow-lg border-l-4 border-primary`}>
       <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center">
        {/* Icon for Customer Support */}
        <svg
         className={`w-8 h-8 mr-3 text-primary`}
         fill="none"
         stroke="currentColor"
         viewBox="0 0 24 24"
         xmlns="http://www.w3.org/2000/svg">
         <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
        </svg>
        Customer Support
       </h2>
       <dl className="space-y-4 text-lg">
        <div>
         <dt className="font-medium text-gray-500">Support Email</dt>
         <dd>
          <a
           href="mailto:support@dosta.ae"
           className={`text-primary hover:text-gray-900 transition duration-300`}>
           support@dosta.ae
          </a>
         </dd>
        </div>
        <div>
         <dt className="font-medium text-gray-500">Phone</dt>
         <dd className="text-gray-700 font-semibold">
          <a
           href="tel:+971501638613"
           className="hover:text-gray-900 transition duration-300 mr-4">
           +971 50 1638 613
          </a>
          <span className="hidden sm:inline">|</span>
          <a
           href="tel:+97143207543"
           className="hover:text-gray-900 transition duration-300 ml-4">
           +971 4 320 7543
          </a>
         </dd>
        </div>
       </dl>
      </div>
     </div>

     {/* Right Column: Location & Careers */}
     <div className="lg:col-span-1 space-y-8">
      {/* Location Card */}
      <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-primary">
       <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
        {/* Icon for Location */}
        <svg
         className={`w-6 h-6 mr-2 text-primary`}
         fill="none"
         stroke="currentColor"
         viewBox="0 0 24 24"
         xmlns="http://www.w3.org/2000/svg">
         <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0L6.343 16.657a8 8 0 1111.314 0z"></path>
         <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
        </svg>
        Office Location
       </h2>
       <address className="not-italic text-gray-700 text-base">
        UAE – Dubai – Al Quoz 4
       </address>
       {/* Placeholder for Map Visual */}
       <div className="mt-4 bg-gray-200 h-32 rounded-lg flex items-center justify-center text-gray-500 text-sm">
        <iframe
         src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14449.912226857836!2d55.224289737318486!3d25.119523742308576!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f69001b3683e5%3A0x113ffd359671d03c!2sDOSTA%20KITCHEN!5e0!3m2!1sen!2s!4v1763981240241!5m2!1sen!2s"
         className="h-full w-full rounded-lg"
         allowFullScreen={false}
         loading="lazy"
         referrerPolicy="no-referrer-when-downgrade"></iframe>
       </div>
      </div>

      {/* Careers Card */}
      <div className={`p-6 rounded-xl shadow-xl bg-primary text-white`}>
       <h2 className="text-xl font-bold mb-3 flex items-center">
        {/* Icon for Team/Careers */}
        <svg
         className="w-6 h-6 mr-2 text-white"
         fill="none"
         stroke="currentColor"
         viewBox="0 0 24 24"
         xmlns="http://www.w3.org/2000/svg">
         <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M12 10a3 3 0 11-6 0 3 3 0 016 0zm-2 4h4a2 2 0 012 2v2H6v-2a2 2 0 012-2z"></path>
        </svg>
        Join Our Team
       </h2>
       <p className="text-base mb-4 opacity-90">
        We are hiring! Be a part of DOSTA's innovative journey in the UAE.
       </p>
       <a
        href="#"
        className="inline-block bg-white text-gray-900 font-bold py-2 px-4 rounded-full text-sm hover:bg-gray-100 transition duration-300">
        Check Careers
       </a>
      </div>
     </div>
    </div>
   </div>
  </main>
 );
};

export default ContactUsContent;
