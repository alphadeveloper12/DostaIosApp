const CookiesPolicyContent = () => {
 return (
  <main className="flex-grow py-16 sm:py-24 bg-white">
   <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
    {/* Header */}
    <header className="mb-12 border-b pb-6">
     <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight">
      Cookies <span className={`text-primary`}>Policy</span>
     </h1>
     <p className="mt-4 text-lg text-gray-600">
      This Cookies Policy explains how Dosta (“we”, “our”, “the platform”) uses
      cookies and similar technologies in our mobile application and website.
     </p>
    </header>

    {/* 1. What Are Cookies */}
    <section className="mb-10">
     <h2 className="text-3xl font-bold text-gray-900 mb-4">
      1. What Are Cookies
     </h2>
     <p className="text-gray-700 text-lg">
      Cookies are small data files stored on the user’s device to enable core
      functions, enhance the user experience, and improve service performance.
     </p>
    </section>

    {/* 2. Types of Cookies We Use */}
    <section className="mb-10">
     <h2 className={`text-3xl font-bold mb-6 text-primary`}>
      2. Types of Cookies We Use
     </h2>

     {/* A. Necessary Cookies */}
     <div className="mb-6 border-l-4 border-gray-300 pl-4">
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
       A. Necessary Cookies
      </h3>
      <p className="text-gray-700 mb-2">
       These cookies are essential for operating our services and cannot be
       disabled. They are used for:
      </p>
      <ul className="list-disc list-inside ml-4 text-gray-600 space-y-1">
       <li>User login and session management</li>
       <li>Processing orders and payments</li>
       <li>Saving cart information</li>
       <li>Location detection for delivery</li>
       <li>Security, fraud prevention, and system stability</li>
      </ul>
     </div>

     {/* B. Analytics Cookies */}
     <div className="mb-6 border-l-4 border-gray-300 pl-4">
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
       B. Analytics Cookies
      </h3>
      <p className="text-gray-700 mb-2">
       We use analytics tools such as Google Analytics and Firebase Analytics
       to:
      </p>
      <ul className="list-disc list-inside ml-4 text-gray-600 space-y-1">
       <li>Understand how users interact with the app</li>
       <li>Improve speed, performance, and features</li>
       <li>Detect errors and bugs</li>
      </ul>
      <p className="text-sm italic text-gray-500 mt-2">
       These cookies do not collect personal information directly.
      </p>
     </div>

     {/* C. Preference Cookies */}
     <div className="mb-6 border-l-4 border-gray-300 pl-4">
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
       C. Preference Cookies
      </h3>
      <p className="text-gray-700 mb-2">
       These cookies store user preferences such as:
      </p>
      <ul className="list-disc list-inside ml-4 text-gray-600 space-y-1">
       <li>Language</li>
       <li>Saved delivery address</li>
       <li>Display settings</li>
       <li>Recently viewed items</li>
      </ul>
     </div>

     {/* D. Marketing Cookies */}
     <div className="mb-6 border-l-4 border-gray-300 pl-4">
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
       D. Marketing Cookies
      </h3>
      <p className="text-gray-700 mb-2">
       We may use advertising technologies such as:
      </p>
      <ul className="list-disc list-inside ml-4 text-gray-600 space-y-1">
       <li>Google Ads</li>
       <li>Facebook Pixel</li>
       <li>Remarketing tools</li>
      </ul>
      <p className="text-sm italic text-gray-500 mt-2">
       These cookies help display personalized ads based on user interests.
       Users may disable marketing cookies at any time.
      </p>
     </div>
    </section>

    {/* 3. Third-Party Cookies */}
    <section className="mb-10">
     <h2 className="text-3xl font-bold text-gray-900 mb-4">
      3. Third-Party Cookies
     </h2>
     <p className="text-gray-700 mb-4">
      Some external services may store their own cookies, including:
     </p>
     <ul className="list-disc list-inside ml-4 text-gray-600 space-y-1">
      <li>Google Maps API (location and address detection)</li>
      <li>Payment gateways</li>
      <li>Analytics and error-tracking tools</li>
      <li>Advertising partners</li>
     </ul>
     <p className="text-sm italic text-gray-500 mt-4">
      These services follow their own privacy policies.
     </p>
    </section>

    {/* 4. Why We Use Cookies */}
    <section className="mb-10">
     <h2 className="text-3xl font-bold text-gray-900 mb-4">
      4. Why We Use Cookies
     </h2>
     <p className="text-gray-700 mb-4">We use cookies to:</p>
     <ul className="list-disc list-inside ml-4 text-gray-600 space-y-1">
      <li>Ensure the app works correctly</li>
      <li>Improve user experience</li>
      <li>Remember user preferences</li>
      <li>Provide accurate delivery services</li>
      <li>Optimize performance</li>
      <li>Enhance food service quality</li>
      <li>Offer relevant advertisements (optional)</li>
     </ul>
    </section>

    {/* 5. User Control Over Cookies */}
    <section className="mb-10">
     <h2 className="text-3xl font-bold text-gray-900 mb-4">
      5. User Control Over Cookies
     </h2>
     <p className="text-gray-700 mb-4">
      Users can manage or disable cookies through:
     </p>
     <ul className="list-disc list-inside ml-4 text-gray-600 space-y-1">
      <li>App settings (if available)</li>
      <li>Browser settings</li>
      <li>Device privacy settings</li>
     </ul>
     <p className="text-gray-700 mt-4 font-medium">
      Disabling some cookies may affect:
     </p>
     <ul className="list-disc list-inside ml-4 text-gray-600 space-y-1">
      <li>Login functionality</li>
      <li>Order processing</li>
      <li>Delivery location accuracy</li>
      <li>Core app features</li>
     </ul>
    </section>

    {/* 6. Policy Updates */}
    <section className="mb-10">
     <h2 className="text-3xl font-bold text-gray-900 mb-4">
      6. Policy Updates
     </h2>
     <p className="text-gray-700">
      We may update this policy to comply with legal requirements or platform
      improvements. Updates will be posted in the application.
     </p>
    </section>

    {/* 7. Contact Us */}
    <section className="pt-6 border-t border-gray-200">
     <h2 className="text-3xl font-bold text-gray-900 mb-4">7. Contact Us</h2>
     <p className="text-gray-700 mb-2">
      For questions regarding this Cookies Policy, contact us at:
     </p>
     <a
      href="mailto:info@dosta.ae"
      className={`text-xl font-semibold text-primary hover:text-gray-900 transition duration-300`}>
      Email: info@dosta.ae
     </a>
    </section>
   </div>
  </main>
 );
};

export default CookiesPolicyContent;
