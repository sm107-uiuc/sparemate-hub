
import { useState } from "react";
import { ShoppingCart, Heart, Star, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Part } from "@/lib/data";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

interface PartCardProps {
  part: Part;
  onAddToCart: (part: Part) => void;
}

const PartCard = ({ part, onAddToCart }: PartCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  const handleAddToCart = () => {
    setIsLoading(true);
    
    // Simulate network request
    setTimeout(() => {
      onAddToCart(part);
      setIsLoading(false);
      toast.success("Added to cart", {
        description: `${part.name} has been added to your cart.`,
      });
    }, 600);
  };

  const handleImageError = () => {
    setImageError(true);
    setIsImageLoading(false);
  };

  const handleImageLoad = () => {
    setIsImageLoading(false);
  };

  // Use a placeholder image from the uploaded image
  const placeholderImage = "/lovable-uploads/67b116ed-7d38-46a4-92b8-b4d054966c83.png";

  return (
    <div 
      className="group relative glass-morphism rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="aspect-square overflow-hidden bg-secondary/50 flex items-center justify-center relative">
        {isImageLoading && !imageError && (
          <Skeleton className="absolute inset-0 w-full h-full" />
        )}
        
        {imageError ? (
          <div className="flex flex-col items-center justify-center h-full w-full bg-muted">
            <ImageIcon className="h-12 w-12 text-muted-foreground" />
            <span className="text-xs text-muted-foreground mt-2">Image unavailable</span>
          </div>
        ) : (
          <img
            src={part.imageUrl || placeholderImage}
            alt={part.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={handleImageError}
            onLoad={handleImageLoad}
          />
        )}
      </div>
      
      <div className="absolute top-3 right-3">
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 rounded-full bg-white shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Heart className="h-4 w-4" />
          <span className="sr-only">Add to wishlist</span>
        </Button>
      </div>
      
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-muted-foreground">{part.category}</span>
          <div className="flex items-center space-x-1">
            <Star className="h-3 w-3 fill-primary text-primary" />
            <span className="text-xs font-medium">{part.rating.toFixed(1)}</span>
          </div>
        </div>
        
        <h3 className="font-medium line-clamp-1 mb-1">{part.name}</h3>
        
        <div className="flex items-center mb-2">
          <span className="text-xs text-muted-foreground">SKU: {part.sku}</span>
        </div>
        
        <div className="mb-3">
          <div className="text-xs space-y-1">
            {part.compatibility.map((vehicle, index) => (
              <div key={index} className="line-clamp-1 text-muted-foreground">
                • {vehicle}
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="font-semibold">${part.price.toFixed(2)}</span>
          
          <Button 
            onClick={handleAddToCart}
            disabled={isLoading || part.stock === 0}
            size="sm" 
            className="h-8 gap-1"
          >
            {isLoading ? (
              <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
              <ShoppingCart className="h-4 w-4" />
            )}
            {part.stock > 0 ? "Add" : "Out of Stock"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PartCard;
