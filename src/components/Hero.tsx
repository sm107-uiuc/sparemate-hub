
import { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Hero = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="relative min-h-screen flex items-center">
      <div 
        className="absolute inset-0 bg-gradient-to-r from-background via-background to-transparent z-10"
        style={{ backdropFilter: "blur(4px)" }}
      ></div>
      
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=2883&auto=format&fit=crop&ixlib=rb-4.0.3')] bg-cover bg-center opacity-10"></div>
      </div>
      
      <div className="container mx-auto px-4 pt-32 md:pt-0 z-20">
        <div className="max-w-3xl space-y-6">
          <div 
            className={`transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          >
            <span className="inline-block text-xs font-medium px-3 py-1 bg-secondary text-foreground rounded-full mb-6">
              Premium Auto Parts
            </span>
          </div>
          
          <h1 
            className={`text-4xl md:text-6xl font-bold leading-tight transition-transform duration-1000 ease-out ${
              isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
          >
            Quality parts for every vehicle, delivered precisely when you need them
          </h1>
          
          <p 
            className={`text-lg md:text-xl text-muted-foreground transition-transform duration-1000 delay-100 ease-out ${
              isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
          >
            Find the exact parts you need with our industry-leading catalog and 
            enjoy fast, reliable shipping directly to your workshop.
          </p>
          
          <div 
            className={`pt-4 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 transition-transform duration-1000 delay-200 ease-out ${
              isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
          >
            <Link to="/inventory">
              <Button size="lg" className="w-full sm:w-auto">
                Browse Inventory
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/order-status">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Track Your Order
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
