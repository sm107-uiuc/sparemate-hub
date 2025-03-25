
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartItem from "@/components/CartItem";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, ShoppingCart, Package, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { Part, parts as allParts } from "@/lib/data";
import { useAuth } from "@/context/AuthContext";

// Function to get the cart for a specific user
const getUserCart = (userId: string) => {
  const userCartKey = `cart-${userId}`;
  const storedCart = localStorage.getItem(userCartKey);
  
  if (storedCart) {
    return JSON.parse(storedCart);
  }
  
  return []; // Return empty cart by default
};

// Function to save cart for a specific user
const saveUserCart = (userId: string, cart: any[]) => {
  const userCartKey = `cart-${userId}`;
  localStorage.setItem(userCartKey, JSON.stringify(cart));
};

const Cart = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [cartItems, setCartItems] = useState<{ part: Part; quantity: number }[]>([]);
  
  useEffect(() => {
    if (!user) return;
    
    // Load cart data for the current user
    setIsLoading(true);
    
    setTimeout(() => {
      const savedCart = getUserCart(user.id);
      
      // Map saved cart IDs to actual part objects
      const items = savedCart.map(({ partId, quantity }: { partId: string, quantity: number }) => {
        const part = allParts.find((p) => p.id === partId);
        return { part, quantity };
      }).filter(({ part }: { part: Part | undefined }) => part !== undefined) as { part: Part; quantity: number }[];
      
      setCartItems(items);
      setIsLoading(false);
    }, 800);
  }, [user]);
  
  const updateQuantity = (partId: string, newQuantity: number) => {
    if (!user) return;
    
    const updatedCart = cartItems.map((item) =>
      item.part.id === partId ? { ...item, quantity: newQuantity } : item
    );
    
    setCartItems(updatedCart);
    
    // Save updated cart to localStorage for this user
    const cartToSave = updatedCart.map(({ part, quantity }) => ({
      partId: part.id,
      quantity
    }));
    
    saveUserCart(user.id, cartToSave);
  };
  
  const removeItem = (partId: string) => {
    if (!user) return;
    
    const updatedCart = cartItems.filter((item) => item.part.id !== partId);
    setCartItems(updatedCart);
    
    // Save updated cart to localStorage for this user
    const cartToSave = updatedCart.map(({ part, quantity }) => ({
      partId: part.id,
      quantity
    }));
    
    saveUserCart(user.id, cartToSave);
    
    toast.success("Item removed", {
      description: "The item has been removed from your cart.",
    });
  };
  
  const handleCheckout = () => {
    if (!user) return;
    
    toast.success("Order placed successfully!", {
      description: "Your order has been received and is being processed.",
    });
    
    // Clear cart for this user
    setCartItems([]);
    saveUserCart(user.id, []);
    
    navigate("/order-status");
  };
  
  const getSubtotal = () => {
    return cartItems.reduce(
      (total, { part, quantity }) => total + part.price * quantity,
      0
    );
  };
  
  const subtotal = getSubtotal();
  const shipping = subtotal > 0 ? 12.99 : 0;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="flex flex-col space-y-8">
            <div>
              <Link
                to="/inventory"
                className="inline-flex items-center text-sm hover:text-primary transition-colors"
              >
                <ArrowLeft className="mr-1 h-4 w-4" />
                Continue Shopping
              </Link>
              
              <h1 className="text-3xl font-bold mt-4">Your Cart</h1>
            </div>
            
            {isLoading ? (
              <div className="space-y-6">
                {[1, 2, 3].map((index) => (
                  <div
                    key={index}
                    className="flex gap-4 py-6 border-b border-border animate-pulse"
                  >
                    <div className="h-24 w-24 sm:h-32 sm:w-32 bg-secondary/50 rounded-lg"></div>
                    <div className="flex-1 space-y-3">
                      <div className="h-6 bg-secondary/50 rounded w-3/4"></div>
                      <div className="h-4 bg-secondary/50 rounded w-1/4"></div>
                      <div className="h-4 bg-secondary/50 rounded w-1/2"></div>
                      <div className="flex justify-between pt-4">
                        <div className="h-8 bg-secondary/50 rounded w-24"></div>
                        <div className="h-6 bg-secondary/50 rounded w-20"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : cartItems.length === 0 ? (
              <div className="glass-morphism rounded-xl p-8 text-center animate-fade-in">
                <div className="mx-auto w-16 h-16 rounded-full bg-secondary/50 flex items-center justify-center mb-4">
                  <ShoppingCart className="h-8 w-8 text-muted-foreground" />
                </div>
                
                <h2 className="text-2xl font-semibold mb-3">Your cart is empty</h2>
                
                <p className="text-muted-foreground mb-6">
                  Looks like you haven't added any parts to your cart yet.
                </p>
                
                <Link to="/inventory">
                  <Button>
                    Browse Inventory
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <div className="glass-morphism rounded-xl overflow-hidden animate-fade-in">
                    <div className="p-6">
                      <h2 className="text-lg font-medium mb-6 flex items-center">
                        <Package className="mr-2 h-5 w-5" />
                        Cart Items ({cartItems.length})
                      </h2>
                      
                      <div className="space-y-1">
                        {cartItems.map(({ part, quantity }) => (
                          <CartItem
                            key={part.id}
                            part={part}
                            quantity={quantity}
                            onUpdateQuantity={updateQuantity}
                            onRemove={removeItem}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="lg:col-span-1">
                  <div className="glass-morphism rounded-xl overflow-hidden animate-fade-in sticky top-24">
                    <div className="p-6">
                      <h2 className="text-lg font-medium mb-6">Order Summary</h2>
                      
                      <div className="space-y-4">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Subtotal</span>
                          <span>${subtotal.toFixed(2)}</span>
                        </div>
                        
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Shipping</span>
                          <span>${shipping.toFixed(2)}</span>
                        </div>
                        
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Estimated Tax</span>
                          <span>${tax.toFixed(2)}</span>
                        </div>
                        
                        <Separator />
                        
                        <div className="flex justify-between font-medium">
                          <span>Total</span>
                          <span>${total.toFixed(2)}</span>
                        </div>
                      </div>
                      
                      <Button
                        onClick={handleCheckout}
                        className="w-full mt-6"
                        size="lg"
                      >
                        Proceed to Checkout
                      </Button>
                      
                      <div className="mt-4 text-center">
                        <Link
                          to="/inventory"
                          className="text-sm text-primary hover:underline"
                        >
                          Continue Shopping
                        </Link>
                      </div>
                      
                      <div className="mt-6 text-xs text-muted-foreground text-center">
                        By completing your purchase, you agree to our{" "}
                        <Link to="#" className="text-primary hover:underline">
                          Terms of Service
                        </Link>.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Cart;
