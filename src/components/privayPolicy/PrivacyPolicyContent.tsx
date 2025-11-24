

const ACCENT_BLUE = "#03446d";

const PrivacyPolicyContent = () => {
 return (
  <main className="flex-grow py-16 sm:py-24 bg-white">
   <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
    {/* Header */}
    <header className="mb-12 border-b pb-6">
     <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight">
      Privacy <span className={`text-primary`}>Policy</span>
     </h1>
     <p className="mt-2 text-sm text-gray-500">
      Effective Date: 01 December 2025
     </p>
     <p className="mt-4 text-lg text-gray-600">
      This Privacy Policy explains how we collect, use, disclose, and protect
      your personal information when you use the DOSTA application, website,
      vending machines, catering services, or subscription plans for healthy
      meals.
     </p>
    </header>

    {/* 1. Introduction */}
    <section className="mb-10">
     <h2 className="text-3xl font-bold text-gray-900 mb-4">1. Introduction</h2>
     <p className="text-gray-700 mb-4">
      DOSTA is a registered brand operating through its licensed entities, all
      registered in Dubai, United Arab Emirates:
     </p>
     <ul className="list-disc list-inside ml-4 text-gray-700 space-y-1">
      <li>Dosta For Events Managing LLC</li>
      <li>DOSTA CATERING SERVICES L.L.C</li>
      <li>DOSTA VENDING MACHINES L.L.C</li>
     </ul>
    </section>

    {/* 2. Information We Collect */}
    <section className="mb-10">
     <h2 className={`text-3xl font-bold mb-6 text-primary`}>
      2. Information We Collect
     </h2>

     {/* 2.1 Personal Information (PII) */}
     <div className="mb-6 border-l-4 border-gray-300 pl-4">
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
       2.1 Personal Information (PII)
      </h3>
      <p className="text-gray-700 mb-2">
       This includes information that identifies you directly or indirectly:
      </p>
      <ul className="list-disc list-inside ml-4 text-gray-600 space-y-1">
       <li>Full name</li>
       <li>Delivery address</li>
       <li>Phone number and email</li>
       <li>Location (GPS) if using the mobile app</li>
       <li>Order history and preferences</li>
       <li>Medical info (if subscribing to dietary plans)</li>
      </ul>
     </div>

     {/* 2.2 Non-Personal Information (Non-PII) */}
     <div className="mb-6 border-l-4 border-gray-300 pl-4">
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
       2.2 Non-Personal Information (Non-PII)
      </h3>
      <p className="text-gray-700 mb-2">
       This includes technical data that cannot identify you:
      </p>
      <ul className="list-disc list-inside ml-4 text-gray-600 space-y-1">
       <li>Device type, OS, browser, screen resolution</li>
       <li>IP address</li>
       <li>Usage analytics, clicks, page views</li>
      </ul>
     </div>

     {/* 2.3 Cookies & Tracking */}
     <div className="mb-6 border-l-4 border-gray-300 pl-4">
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
       2.3 Cookies & Tracking
      </h3>
      <p className="text-gray-700">
       We use cookies, pixels, and similar technologies to enhance user
       experience, remember preferences, and analyze usage. Please refer to our
       separate <strong>Cookies Policy</strong> for detailed information.
      </p>
     </div>
    </section>

    {/* 3. Use of Information */}
    <section className="mb-10">
     <h2 className="text-3xl font-bold text-gray-900 mb-4">
      3. Use of Information
     </h2>
     <p className="text-gray-700 mb-4">
      We use the collected information for the following core purposes:
     </p>
     <ul className="list-disc list-inside ml-4 text-gray-600 space-y-1">
      <li>Account creation and authentication</li>
      <li>Process and deliver orders</li>
      <li>Send promotional communications (if consented)</li>
      <li>Improve services and app functionality</li>
      <li>Legal compliance and fraud prevention</li>
     </ul>
    </section>

    {/* 4. Sharing Information */}
    <section className="mb-10">
     <h2 className="text-3xl font-bold text-gray-900 mb-4">
      4. Sharing Information
     </h2>
     <p className="text-gray-700 mb-4">
      We may share your data with third parties necessary to operate our
      business or as required by law:
     </p>
     <ul className="list-disc list-inside ml-4 text-gray-600 space-y-1">
      <li>Service providers (hosting, analytics, payment, delivery)</li>
      <li>Partners involved in fulfilling your order</li>
      <li>Legal authorities if required</li>
      <li>In case of business transfer or merger</li>
     </ul>
    </section>

    {/* 5. Retention & Deletion */}
    <section className="mb-10">
     <h2 className="text-3xl font-bold text-gray-900 mb-4">
      5. Retention & Deletion
     </h2>
     <ul className="list-disc list-inside ml-4 text-gray-600 space-y-2">
      <li>
       Users can request account deletion; pending transactions may delay
       deletion.
      </li>
      <li>
       Data may be retained to comply with legal obligations (e.g., financial
       records).
      </li>
     </ul>
    </section>

    {/* 6. Security */}
    <section className="mb-10">
     <h2 className="text-3xl font-bold text-gray-900 mb-4">6. Security</h2>
     <p className="text-gray-700 mb-4">
      We use industry-standard measures to protect your data, including SSL
      encryption and access controls.
     </p>
     <p className="text-sm italic text-red-600 font-medium">
      <strong>Important:</strong> No system is 100% secure; users should avoid transmitting
      highly sensitive data (like financial passwords) through insecure
      channels.
     </p>
    </section>

    {/* 7. Your Rights */}
    <section className="mb-10">
     <h2 className="text-3xl font-bold text-gray-900 mb-4">7. Your Rights</h2>
     <p className="text-gray-700 mb-4">As a user, you have the right to:</p>
     <ul className="list-disc list-inside ml-4 text-gray-600 space-y-1">
      <li>Access, correct, or request deletion of your personal data.</li>
      <li>Opt-out from marketing communications at any time.</li>
     </ul>
    </section>

    {/* 8. Changes to Privacy Policy */}
    <section className="pt-6 border-t border-gray-200">
     <h2 className="text-3xl font-bold text-gray-900 mb-4">
      8. Changes to Privacy Policy
     </h2>
     <p className="text-gray-700">
      We reserve the right to update this policy periodically. Updates will be
      posted on the app/website, and users are encouraged to review it
      regularly.
     </p>
    </section>
   </div>
  </main>
 );
};

export default PrivacyPolicyContent;
