
import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Part } from "@/lib/data";

interface CartItemProps {
  part: Part;
  quantity: number;
  onUpdateQuantity: (partId: string, newQuantity: number) => void;
  onRemove: (partId: string) => void;
}

const CartItem = ({ part, quantity, onUpdateQuantity, onRemove }: CartItemProps) => {
  const handleDecrement = () => {
    if (quantity > 1) {
      onUpdateQuantity(part.id, quantity - 1);
    } else {
      onRemove(part.id);
    }
  };

  const handleIncrement = () => {
    if (quantity < part.stock) {
      onUpdateQuantity(part.id, quantity + 1);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 py-6 border-b border-border animate-fade-in">
      <div className="h-24 w-24 sm:h-32 sm:w-32 bg-secondary/50 rounded-lg overflow-hidden">
        <img 
          src={part.imageUrl} 
          alt={part.name} 
          className="h-full w-full object-cover" 
        />
      </div>
      
      <div className="flex-1 flex flex-col">
        <div className="flex justify-between">
          <div>
            <h3 className="font-medium">{part.name}</h3>
            <p className="text-sm text-muted-foreground">SKU: {part.sku}</p>
          </div>
          <div className="text-right">
            <span className="font-semibold">${part.price.toFixed(2)}</span>
          </div>
        </div>
        
        <div className="mt-4 flex items-end justify-between">
          <div className="flex items-center space-x-1">
            <Button 
              variant="outline" 
              size="icon" 
              className="h-8 w-8" 
              onClick={handleDecrement}
            >
              <Minus className="h-3 w-3" />
            </Button>
            
            <span className="w-8 text-center">{quantity}</span>
            
            <Button 
              variant="outline" 
              size="icon" 
              className="h-8 w-8" 
              onClick={handleIncrement}
              disabled={quantity >= part.stock}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-muted-foreground" 
            onClick={() => onRemove(part.id)}
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Remove
          </Button>
        </div>
        
        <div className="mt-2 text-right">
          <span className="text-sm font-medium">
            Subtotal: ${(part.price * quantity).toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
