
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  Package, 
  Truck, 
  CheckCircle, 
  Clock, 
  XCircle, 
  ArrowRight,
  Search
} from "lucide-react";
import { toast } from "sonner";
import { sampleOrders, Order, parts } from "@/lib/data";

const OrderStatus = () => {
  const [orderId, setOrderId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!orderId.trim()) {
      toast.error("Please enter an order ID", {
        description: "Enter your order ID to track your order status.",
      });
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const foundOrder = sampleOrders.find(
        (o) => o.id.toLowerCase() === orderId.toLowerCase()
      );
      
      if (foundOrder) {
        setOrder(foundOrder);
        toast.success("Order found", {
          description: `We found your order ${foundOrder.id}.`,
        });
      } else {
        setOrder(null);
        toast.error("Order not found", {
          description: "Please check your order ID and try again.",
        });
      }
      
      setIsLoading(false);
    }, 1500);
  };
  
  const getOrderStatusIcon = (status: Order["status"]) => {
    switch (status) {
      case "processing":
        return <Clock className="h-5 w-5 text-amber-500" />;
      case "shipped":
        return <Truck className="h-5 w-5 text-blue-500" />;
      case "delivered":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "cancelled":
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };
  
  const getOrderStatusText = (status: Order["status"]) => {
    switch (status) {
      case "processing":
        return "Processing";
      case "shipped":
        return "Shipped";
      case "delivered":
        return "Delivered";
      case "cancelled":
        return "Cancelled";
      default:
        return "Unknown";
    }
  };
  
  const getOrderStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "processing":
        return "bg-amber-500 text-white";
      case "shipped":
        return "bg-blue-500 text-white";
      case "delivered":
        return "bg-green-500 text-white";
      case "cancelled":
        return "bg-red-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };
  
  const getOrderSteps = (status: Order["status"]) => {
    const steps = [
      { label: "Ordered", icon: Package, completed: true },
      { label: "Processing", icon: Clock, completed: ["shipped", "delivered"].includes(status) },
      { label: "Shipped", icon: Truck, completed: status === "delivered" },
      { label: "Delivered", icon: CheckCircle, completed: status === "delivered" },
    ];
    
    if (status === "cancelled") {
      return [steps[0], { label: "Cancelled", icon: XCircle, completed: true }];
    }
    
    return steps;
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-5xl">
          <h1 className="text-3xl font-bold mb-8">Track Your Order</h1>
          
          <div className="glass-morphism rounded-xl p-6 mb-8 animate-fade-in">
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-3">
                  <Label htmlFor="orderId">Order ID</Label>
                  <Input
                    id="orderId"
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                    placeholder="Enter your order ID (e.g., ORD-12345)"
                  />
                </div>
                
                <div className="flex items-end">
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center">
                        <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                        Searching...
                      </div>
                    ) : (
                      <>
                        <Search className="h-4 w-4 mr-2" />
                        Track Order
                      </>
                    )}
                  </Button>
                </div>
              </div>
              
              <p className="text-xs text-muted-foreground">
                Enter the order ID from your confirmation email to check the status of your order.
              </p>
            </form>
          </div>
          
          {order ? (
            <div className="glass-morphism rounded-xl overflow-hidden animate-fade-in">
              <div className="p-6 bg-secondary/30 border-b border-border">
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                  <div>
                    <h2 className="text-xl font-medium">Order {order.id}</h2>
                    <p className="text-sm text-muted-foreground">
                      Placed on {new Date(order.date).toLocaleDateString()} at{" "}
                      {new Date(order.date).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  
                  <Badge className={getOrderStatusColor(order.status)}>
                    {getOrderStatusText(order.status)}
                  </Badge>
                </div>
              </div>
              
              <div className="p-6">
                <div className="mb-8">
                  <h3 className="font-medium mb-4">Order Progress</h3>
                  
                  <div className="relative">
                    <div className="flex items-center justify-between mb-8">
                      {getOrderSteps(order.status).map((step, index, steps) => (
                        <div 
                          key={step.label} 
                          className="flex flex-col items-center relative z-10"
                        >
                          <div 
                            className={`flex items-center justify-center w-10 h-10 rounded-full mb-2 ${
                              step.completed
                                ? "bg-primary text-primary-foreground"
                                : "bg-secondary text-muted-foreground"
                            }`}
                          >
                            <step.icon className="h-5 w-5" />
                          </div>
                          <span 
                            className={`text-xs text-center ${
                              step.completed ? "font-medium" : "text-muted-foreground"
                            }`}
                          >
                            {step.label}
                          </span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="absolute top-5 left-0 right-0 h-px bg-border -z-10">
                      <div 
                        className="h-full bg-primary transition-all duration-500" 
                        style={{ 
                          width: order.status === "processing"
                            ? "33%"
                            : order.status === "shipped"
                            ? "66%"
                            : order.status === "delivered"
                            ? "100%"
                            : "0%"
                        }}
                      />
                    </div>
                  </div>
                </div>
                
                {order.trackingNumber && (
                  <div className="mb-8">
                    <h3 className="font-medium mb-4">Shipping Information</h3>
                    <div className="bg-secondary/30 rounded-lg p-4">
                      <div className="flex flex-col md:flex-row justify-between gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Tracking Number</p>
                          <p className="font-medium">{order.trackingNumber}</p>
                        </div>
                        
                        {order.estimatedDelivery && (
                          <div>
                            <p className="text-sm text-muted-foreground mb-1">Estimated Delivery</p>
                            <p className="font-medium">
                              {new Date(order.estimatedDelivery).toLocaleDateString()}
                            </p>
                          </div>
                        )}
                        
                        <div className="md:self-end">
                          <Button variant="outline" size="sm">
                            Track Package
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div>
                  <h3 className="font-medium mb-4">Order Details</h3>
                  
                  <div className="space-y-4">
                    {order.items.map((item) => {
                      const part = parts.find((p) => p.id === item.partId);
                      if (!part) return null;
                      
                      return (
                        <div 
                          key={item.partId}
                          className="flex items-center gap-4 border-b border-border pb-4"
                        >
                          <div className="h-16 w-16 bg-secondary/50 rounded-lg overflow-hidden">
                            <img
                              src={part.imageUrl}
                              alt={part.name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          
                          <div className="flex-1">
                            <h4 className="font-medium">{part.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              Quantity: {item.quantity}
                            </p>
                          </div>
                          
                          <div className="text-right">
                            <p className="font-medium">
                              ${(item.price * item.quantity).toFixed(2)}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              ${item.price.toFixed(2)} each
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  <div className="flex justify-end mt-6">
                    <div className="w-full max-w-xs">
                      <div className="flex justify-between py-2">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span>${order.total.toFixed(2)}</span>
                      </div>
                      
                      <Separator />
                      
                      <div className="flex justify-between py-2 font-medium">
                        <span>Total</span>
                        <span>${order.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="glass-morphism rounded-xl p-8 text-center animate-fade-in">
              <div className="mx-auto w-16 h-16 rounded-full bg-secondary/50 flex items-center justify-center mb-4">
                <Package className="h-8 w-8 text-muted-foreground" />
              </div>
              
              <h2 className="text-2xl font-semibold mb-3">Enter your order ID</h2>
              
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Enter your order ID above to check the status of your order, or browse our sample orders below.
              </p>
              
              <div className="flex flex-col md:flex-row justify-center gap-4 mt-8">
                {sampleOrders.map((sampleOrder) => (
                  <Button
                    key={sampleOrder.id}
                    variant="outline"
                    onClick={() => {
                      setOrderId(sampleOrder.id);
                      setOrder(sampleOrder);
                    }}
                    className="flex items-center gap-2"
                  >
                    {getOrderStatusIcon(sampleOrder.status)}
                    {sampleOrder.id}
                  </Button>
                ))}
              </div>
              
              <div className="mt-8">
                <Link to="/inventory">
                  <Button>
                    Shop New Parts
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default OrderStatus;
