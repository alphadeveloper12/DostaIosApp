import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import {
 CreditCard,
 HelpCircle,
 Package,
 Search,
 ShieldCheck,
 User,
} from "lucide-react";

const HelpCenter = () => {
 const categories = [
  {
   icon: <User className="w-8 h-8 text-primary mb-2" />,
   title: "Account & Settings",
   description: "Manage your account details and preferences.",
  },
  {
   icon: <Package className="w-8 h-8 text-primary mb-2" />,
   title: "Orders & Tracking",
   description: "Track your orders and view order history.",
  },
  {
   icon: <CreditCard className="w-8 h-8 text-primary mb-2" />,
   title: "Payments & Billing",
   description: "Payment methods, invoices, and refunds.",
  },
  {
   icon: <ShieldCheck className="w-8 h-8 text-primary mb-2" />,
   title: "Safety & Security",
   description: "Learn how we keep your data safe.",
  },
  {
   icon: <HelpCircle className="w-8 h-8 text-primary mb-2" />,
   title: "General FAQs",
   description: "Common questions about our platform.",
  },
 ];

 return (
  <div className="min-h-screen flex flex-col relative">
   <Header />
   <main className="flex-1 relative">
    {/* Hero Section */}
    <section className="bg-primary py-20 text-center px-4 text-primary-foreground">
     <div className="main-container">
      <h1 className="text-4xl md:text-5xl font-bold mb-6">How can we help?</h1>
      <div className="max-w-xl mx-auto relative">
       <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
       <Input
        type="text"
        placeholder="Search for answers..."
        className="pl-10 py-6 text-lg rounded-full bg-background text-foreground border-none shadow-lg focus-visible:ring-2 focus-visible:ring-secondary"
       />
      </div>
     </div>
    </section>

    {/* Categories Section */}
    <section className="py-16 px-4">
     <div className="main-container">
      <h2 className="text-2xl font-bold text-center mb-10 text-foreground">
       Browse by Category
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
       {categories.map((category, index) => (
        <Card
         key={index}
         className="hover:shadow-lg transition-shadow cursor-pointer border-none shadow-md group">
         <CardHeader>
          <div className="group-hover:scale-110 transition-transform duration-300 origin-left">
           {category.icon}
          </div>
          <CardTitle className="text-lg font-semibold text-foreground">
           {category.title}
          </CardTitle>
         </CardHeader>
         <CardContent>
          <p className="text-muted-foreground">{category.description}</p>
         </CardContent>
        </Card>
       ))}
      </div>
     </div>
    </section>

    {/* Contact Section */}
    <section className="bg-muted/30 py-16 text-center px-4">
     <div className="main-container">
      <h2 className="text-2xl font-bold mb-4 text-foreground">
       Still need help?
      </h2>
      <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
       Our support team is available 24/7 to assist you with any issues or
       questions you may have.
      </p>
      <Button
       size="lg"
       className="font-semibold px-8"
       onClick={() => (window.location.href = "/contact-us")}>
       Contact Support
      </Button>
     </div>
    </section>
   </main>
   <Footer />
  </div>
 );
};

export default HelpCenter;
