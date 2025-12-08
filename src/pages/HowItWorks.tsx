import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { CheckCircle, Search, ShoppingCart, Truck } from "lucide-react";

const HowItWorks = () => {
 const steps = [
  {
   icon: <CheckCircle className="w-12 h-12 text-primary mb-4" />,
   title: "1. Sign Up",
   description: "Create an account to get started. It's quick, easy, and free.",
  },
  {
   icon: <Search className="w-12 h-12 text-primary mb-4" />,
   title: "2. Browse Services",
   description:
    "Explore our wide range of services and products tailored for you.",
  },
  {
   icon: <ShoppingCart className="w-12 h-12 text-primary mb-4" />,
   title: "3. Place Order",
   description:
    "Select what you need and place your order with just a few clicks.",
  },
  {
   icon: <Truck className="w-12 h-12 text-primary mb-4" />,
   title: "4. Enjoy",
   description:
    "Sit back and relax while we deliver your order straight to your doorstep.",
  },
 ];

 return (
  <div className="min-h-screen flex flex-col relative">
   <Header />
   <main className="flex-1 relative">
    {/* Hero Section */}
    <section className="bg-primary-light py-20 text-center px-4">
     <div className="main-container">
      <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">
       How Dosta Works
      </h1>
      <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
       Discover how easy it is to use our platform. From signing up to receiving
       your order, we've streamlined every step for your convenience.
      </p>
     </div>
    </section>

    {/* Steps Section */}
    <section className="py-16 px-4">
     <div className="main-container">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
       {steps.map((step, index) => (
        <Card
         key={index}
         className="text-center hover:shadow-lg transition-shadow border-none shadow-md">
         <CardHeader className="flex flex-col items-center pb-2">
          {step.icon}
          <CardTitle className="text-xl font-semibold text-foreground">
           {step.title}
          </CardTitle>
         </CardHeader>
         <CardContent>
          <p className="text-muted-foreground">{step.description}</p>
         </CardContent>
        </Card>
       ))}
      </div>
     </div>
    </section>

    {/* CTA Section */}
    <section className="bg-primary py-16 text-center px-4 text-primary-foreground">
     <div className="main-container">
      <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
      <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
       Join thousands of satisfied users today and experience the difference.
      </p>
      <Button
       size="lg"
       variant="secondary"
       className="font-semibold px-8"
       onClick={() => (window.location.href = "/signup")}>
       Create Account
      </Button>
     </div>
    </section>
   </main>
   <Footer />
  </div>
 );
};

export default HowItWorks;
