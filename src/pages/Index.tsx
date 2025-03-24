
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <Hero />
        
        <Features />
        
        <section className="py-24 px-4">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <span className="inline-block text-xs font-medium px-3 py-1 bg-primary/10 text-primary rounded-full mb-4">
                API Access
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Integrate with Our API
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Access our entire parts catalog programmatically with our developer-friendly API.
                Perfect for building custom inventory systems or e-commerce integrations.
              </p>
            </div>
            
            <div 
              className={`glass-morphism max-w-4xl mx-auto rounded-xl overflow-hidden transition-all duration-1000 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
            >
              <div className="p-6 bg-secondary/30 border-b border-border">
                <code className="text-sm font-mono">GET /api/v1/parts</code>
              </div>
              <div className="p-6 bg-background/50">
                <pre className="text-sm font-mono bg-secondary/30 p-4 rounded-lg overflow-auto">
{`{
  "parts": [
    {
      "id": "part-1",
      "name": "TechPart Air Filter",
      "price": 34.99,
      "category": "Engine",
      "compatibility": ["Toyota Camry (2018-2023)"]
      // ...
    },
    // Additional parts
  ]
}`}
                </pre>
              </div>
              <div className="p-6 flex justify-end border-t border-border">
                <Link to="/api-docs">
                  <Button>
                    View API Documentation
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
        
        <section className="py-24 px-4 bg-secondary/50">
          <div className="container mx-auto max-w-5xl">
            <div className="text-center mb-16">
              <span className="inline-block text-xs font-medium px-3 py-1 bg-primary/10 text-primary rounded-full mb-4">
                Shop Now
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Find the Perfect Part
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Browse our extensive catalog of premium quality parts for all major vehicle makes and models.
              </p>
            </div>
            
            <div className="flex flex-col md:flex-row justify-center items-center gap-8">
              <Link to="/inventory" className="w-full md:w-auto">
                <Button size="lg" className="w-full">
                  Browse All Parts
                </Button>
              </Link>
              <Link to="/order-status" className="w-full md:w-auto">
                <Button variant="outline" size="lg" className="w-full">
                  Track Your Order
                </Button>
              </Link>
              <Link to="/login" className="w-full md:w-auto">
                <Button variant="secondary" size="lg" className="w-full">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
