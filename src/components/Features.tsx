
import { useState, useEffect, useRef } from "react";
import { 
  Truck, 
  Search, 
  PackageCheck, 
  ShieldCheck 
} from "lucide-react";

const features = [
  {
    title: "Precise Part Matching",
    description: "Our advanced catalog system ensures you get the exact part for your vehicle make and model.",
    icon: Search,
  },
  {
    title: "Expedited Shipping",
    description: "Same-day dispatch on orders placed before 2pm with real-time tracking.",
    icon: Truck,
  },
  {
    title: "Quality Assurance",
    description: "Every part is inspected and verified to meet OEM specifications.",
    icon: ShieldCheck,
  },
  {
    title: "Hassle-free Returns",
    description: "Simple 30-day return process if a part doesn't meet your expectations.",
    icon: PackageCheck,
  },
];

const FeatureCard = ({ feature, index }) => {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(cardRef.current);
        }
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, []);

  const Icon = feature.icon;

  return (
    <div
      ref={cardRef}
      className={`glass-morphism p-8 rounded-xl transition-all duration-700 ease-out ${
        isVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-10"
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div className="flex flex-col h-full">
        <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-5">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        <h3 className="text-xl font-medium mb-3">{feature.title}</h3>
        <p className="text-muted-foreground flex-grow">{feature.description}</p>
      </div>
    </div>
  );
};

const Features = () => {
  return (
    <section className="py-24 px-4 bg-secondary/50">
      <div className="container mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block text-xs font-medium px-3 py-1 bg-primary/10 text-primary rounded-full mb-4">
            Why Choose Us
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Engineered for Reliability
          </h2>
          <p className="text-muted-foreground">
            We've optimized every aspect of the auto parts supply chain to deliver an
            exceptional experience for mechanics and vehicle owners alike.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <FeatureCard 
              key={feature.title} 
              feature={feature} 
              index={index} 
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
