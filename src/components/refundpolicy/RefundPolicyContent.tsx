import React from "react";

const RefundPolicyContent = () => {
 return (
  <main className="flex-grow py-16 sm:py-24 bg-white">
   <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
    {/* Header */}
    <header className="mb-12 border-b pb-6">
     <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight">
      Refund <span className="text-primary">Policy</span>
     </h1>
     <p className="mt-2 text-sm text-gray-500">
      Effective Date: 01 December 2025
     </p>
     <p className="mt-4 text-lg text-gray-600">
      This Refund Policy governs requests for refunds or cancellations for any
      services purchased through DOSTA, ensuring transparency and fairness in
      all transactions.
     </p>
     <p className="text-sm italic text-gray-500 mt-2">
      Note: App Launching Date may differ from the Effective Date.
     </p>
    </header>

    {/* 1. Introduction */}
    <section className="mb-10">
     <h2 className="text-3xl font-bold text-gray-900 mb-4">1. Introduction</h2>
     <p className="text-gray-700 mb-4">
      1.1 This Refund Policy governs requests for refunds or cancellations for
      any services purchased through DOSTA, including:
     </p>
     <ul className="list-disc list-inside ml-4 text-gray-700 space-y-1">
      <li>Online orders via the app or website</li>
      <li>Vending machine purchases</li>
      <li>Catering services</li>
      <li>Subscription meal plans</li>
     </ul>
     <p className="text-gray-700 mt-4">
      1.2 By making a purchase, you agree to the terms of this Refund Policy.
     </p>
    </section>

    {/* 2. General Conditions */}
    <section className="mb-10 border-l-4 border-gray-300 pl-4">
     <h2 className="text-3xl font-bold text-primary mb-4">
      2. General Conditions
     </h2>
     <ul className="list-disc list-inside ml-4 text-gray-700 space-y-2">
      <li>
       Refunds are considered only for eligible purchases that meet the
       conditions outlined in the subsequent sections.
      </li>
      <li>
       Requests must be submitted within the specified timeframes depending on
       the service type.
      </li>
      <li>
       Refunds are issued using the original payment method unless otherwise
       agreed.
      </li>
     </ul>
    </section>

    {/* 3. Online Orders (App / Website) */}
    <section className="mb-10 border-l-4 border-gray-300 pl-4">
     <h2 className="text-3xl font-bold text-primary mb-4">
      3. Online Orders (App / Website)
     </h2>
     <ul className="list-disc list-inside ml-4 text-gray-700 space-y-2">
      <li>Cancellations before order confirmation may be fully refunded.</li>
      <li>
       Once an order is confirmed or prepared, refunds may not be possible
       unless:
       <ul className="list-circle list-inside ml-6 mt-1 space-y-1">
        <li>The wrong item was delivered.</li>
        <li>The item was damaged or spoiled.</li>
       </ul>
      </li>
      <li>
       Claims must be reported within <strong>24 hours of delivery</strong>.
      </li>
     </ul>
    </section>

    {/* 4. Vending Machine Purchases */}
    <section className="mb-10 border-l-4 border-gray-300 pl-4">
     <h2 className="text-3xl font-bold text-primary mb-4">
      4. Vending Machine Purchases
     </h2>
     <ul className="list-disc list-inside ml-4 text-gray-700 space-y-2">
      <li>
       Refunds are provided only in case of:
       <ul className="list-circle list-inside ml-6 mt-1 space-y-1">
        <li>Machine malfunction preventing product delivery.</li>
        <li>Expired or damaged products.</li>
       </ul>
      </li>
      <li>
       Claims must be submitted within <strong>24 hours</strong> using the
       in-app form or customer support.
      </li>
     </ul>
    </section>

    {/* 5. Catering Services */}
    <section className="mb-10 border-l-4 border-gray-300 pl-4">
     <h2 className="text-3xl font-bold text-primary mb-4">
      5. Catering Services
     </h2>
     <ul className="list-disc list-inside ml-4 text-gray-700 space-y-2">
      <li>
       Refunds are subject to the specific terms agreed during the booking
       process.
      </li>
      <li>
       A <strong>full refund</strong> is only possible if the cancellation is
       made at least
       <strong>48 hours before the confirmed service date</strong>.
      </li>
      <li>
       Partial refunds or credits may be offered for cancellations less than 48
       hours before the event, at DOSTA’s discretion.
      </li>
     </ul>
    </section>

    {/* 6. Subscription Meal Plans */}
    <section className="mb-10 border-l-4 border-gray-300 pl-4">
     <h2 className="text-3xl font-bold text-primary mb-4">
      6. Subscription Meal Plans
     </h2>
     <ul className="list-disc list-inside ml-4 text-gray-700 space-y-2">
      <li>
       Refunds or pauses are allowed according to the subscription policy stated
       in the app.
      </li>
      <li>
       Users must notify DOSTA in advance to stop or modify the subscription.
      </li>
      <li>
       Refunds are calculated proportionally based on the remaining unused
       portion of the plan.
      </li>
     </ul>
    </section>

    {/* 7. Exceptions */}
    <section className="mb-10">
     <h2 className="text-3xl font-bold text-gray-900 mb-4">7. Exceptions</h2>
     <ul className="list-disc list-inside ml-4 text-gray-700 space-y-2">
      <li>
       DOSTA is <strong>not responsible for refunds due to user error</strong>,
       such as incorrect order selection, wrong address entry, or failure to
       pick up items from the vending machine.
      </li>
      <li>
       Refunds for promotional or discounted items are subject to specific terms
       stated at the time of purchase.
      </li>
     </ul>
    </section>

    {/* 8. Contact for Refunds */}
    <section className="pt-6 border-t border-gray-200">
     <h2 className="text-3xl font-bold text-gray-900 mb-4">
      8. Contact for Refunds
     </h2>
     <p className="text-gray-700 mb-2">Users can submit refund requests via:</p>
     <ul className="list-disc list-inside ml-4 text-gray-700 space-y-1 mb-4">
      <li>
       <span className="font-semibold">Email:</span>{" "}
       <a
        href="mailto:support@dosta.com"
        className="text-primary hover:text-gray-900 transition duration-300">
        support@dosta.com
       </a>
      </li>
      <li>In-app support form</li>
     </ul>
     <p className="text-sm italic text-gray-500">
      All refund decisions are at DOSTA’s discretion, in line with this policy.
     </p>
    </section>
   </div>
  </main>
 );
};

export default RefundPolicyContent;
