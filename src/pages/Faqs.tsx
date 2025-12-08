import {
 Accordion,
 AccordionContent,
 AccordionItem,
 AccordionTrigger,
} from "@/components/ui/accordion";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const Faqs = () => {
 const faqs = [
  {
   question: "How do I create an account?",
   answer:
    "To create an account, click on the 'Sign Up' button at the top right corner of the page. Fill in your details, including your name, email, and password, and click 'Create Account'.",
  },
  {
   question: "What payment methods do you accept?",
   answer:
    "We accept all major credit and debit cards, including Visa, MasterCard, and American Express. We also support digital wallets like PayPal and Apple Pay.",
  },
  {
   question: "Can I track my order?",
   answer:
    "Yes, you can track your order in real-time. Once your order is placed, go to 'My Orders' in your account dashboard to view the status and tracking details.",
  },
  {
   question: "What is your refund policy?",
   answer:
    "We offer a full refund for orders cancelled within 24 hours of purchase. For delivered items, please refer to our Refund Policy page for detailed information on returns and exchanges.",
  },
  {
   question: "How can I contact customer support?",
   answer:
    "You can reach our customer support team via the 'Contact Us' page. We are available 24/7 to assist you with any inquiries or issues.",
  },
  {
   question: "Do you offer international shipping?",
   answer:
    "Currently, we only ship within the country. We are working on expanding our services to international locations in the near future.",
  },
 ];

 return (
  <div className="min-h-screen flex flex-col relative">
   <Header />
   <main className="flex-1 relative py-16 px-4">
    <div className="main-container max-w-3xl">
     <div className="text-center mb-12">
      <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
       Frequently Asked Questions
      </h1>
      <p className="text-muted-foreground">
       Find answers to common questions about our services and platform.
      </p>
     </div>

     <div className="bg-card border rounded-lg p-6 md:p-8 shadow-sm">
      <Accordion type="single" collapsible className="w-full">
       {faqs.map((faq, index) => (
        <AccordionItem key={index} value={`item-${index}`}>
         <AccordionTrigger className="text-left text-lg font-medium">
          {faq.question}
         </AccordionTrigger>
         <AccordionContent className="text-muted-foreground">
          {faq.answer}
         </AccordionContent>
        </AccordionItem>
       ))}
      </Accordion>
     </div>
    </div>
   </main>
   <Footer />
  </div>
 );
};

export default Faqs;
