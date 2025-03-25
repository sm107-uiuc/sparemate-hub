
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ApiCurlExamples from "@/components/ApiCurlExamples";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Copy, 
  Check, 
  Key, 
  ShieldAlert, 
  Package, 
  ShoppingBag,
  ArrowRight
} from "lucide-react";
import { toast } from "sonner";

const ApiDocs = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    } else if (user) {
      setApiKey(user.apiKey);
    }
  }, [isAuthenticated, navigate, user]);

  const copyApiKey = () => {
    if (apiKey) {
      navigator.clipboard.writeText(apiKey);
      setCopied(true);
      toast.success("API key copied to clipboard");
      
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    }
  };

  if (!isAuthenticated || !user) {
    return null; // Redirect will happen in useEffect
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="flex flex-col gap-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">API Documentation</h1>
              <p className="text-muted-foreground mb-6">
                Integrate our parts inventory into your application with our RESTful API
              </p>
              
              <div className="glass-morphism rounded-xl p-6 mb-8">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div>
                    <Badge className="mb-2" variant="outline">
                      <Key className="h-3 w-3 mr-1" />
                      Personal API Key
                    </Badge>
                    <h2 className="text-lg font-semibold mb-1">Your API Key</h2>
                    <p className="text-sm text-muted-foreground mb-2">
                      Use this key to authenticate requests to the API
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="border rounded pl-3 pr-1 py-1 bg-background flex items-center justify-between min-w-[260px]">
                      <code className="text-xs md:text-sm font-mono">
                        {apiKey?.substring(0, 12)}...
                      </code>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={copyApiKey}
                        className="h-7"
                      >
                        {copied ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t text-sm">
                  <div className="flex items-start gap-2 text-amber-600">
                    <ShieldAlert className="h-5 w-5 flex-shrink-0 mt-0.5" />
                    <p>Never share your API key publicly or commit it to version control. Use environment variables to store this key in your application.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <Tabs defaultValue="endpoints">
                <TabsList className="grid grid-cols-3 w-full max-w-md mb-6">
                  <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
                  <TabsTrigger value="examples">Examples</TabsTrigger>
                  <TabsTrigger value="testing">Testing</TabsTrigger>
                </TabsList>
                
                <TabsContent value="endpoints">
                  <div className="space-y-6">
                    <div className="grid gap-4">
                      <div className="glass-morphism rounded-xl p-6">
                        <div className="flex items-center gap-2 mb-4">
                          <Package className="h-5 w-5 text-primary" />
                          <h3 className="text-xl font-semibold">Parts Endpoints</h3>
                        </div>
                        
                        <div className="space-y-4">
                          <div className="border-l-4 border-primary pl-4 py-2">
                            <div className="flex items-center mb-2">
                              <Badge className="mr-2 bg-green-500">GET</Badge>
                              <code className="text-sm font-mono">/api/parts</code>
                            </div>
                            <p className="text-sm mb-1">Get all parts in the inventory</p>
                            <p className="text-xs text-muted-foreground">Returns an array of all available parts with details.</p>
                          </div>
                          
                          <div className="border-l-4 border-primary pl-4 py-2">
                            <div className="flex items-center mb-2">
                              <Badge className="mr-2 bg-green-500">GET</Badge>
                              <code className="text-sm font-mono">/api/parts/{"{id}"}</code>
                            </div>
                            <p className="text-sm mb-1">Get a specific part by ID</p>
                            <p className="text-xs text-muted-foreground">Returns detailed information about a specific part.</p>
                          </div>
                          
                          <div className="border-l-4 border-primary pl-4 py-2">
                            <div className="flex items-center mb-2">
                              <Badge className="mr-2 bg-green-500">GET</Badge>
                              <code className="text-sm font-mono">/api/parts/search?q={"{query}"}</code>
                            </div>
                            <p className="text-sm mb-1">Search for parts</p>
                            <p className="text-xs text-muted-foreground">Returns parts that match the search query in name, description, or SKU.</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="glass-morphism rounded-xl p-6">
                        <div className="flex items-center gap-2 mb-4">
                          <ShoppingBag className="h-5 w-5 text-primary" />
                          <h3 className="text-xl font-semibold">Cart Endpoints</h3>
                        </div>
                        
                        <div className="space-y-4">
                          <div className="border-l-4 border-primary pl-4 py-2">
                            <div className="flex items-center mb-2">
                              <Badge className="mr-2 bg-green-500">GET</Badge>
                              <code className="text-sm font-mono">/api/cart</code>
                            </div>
                            <p className="text-sm mb-1">Get user's cart</p>
                            <p className="text-xs text-muted-foreground">Returns the current cart for the authenticated user.</p>
                          </div>
                          
                          <div className="border-l-4 border-primary pl-4 py-2">
                            <div className="flex items-center mb-2">
                              <Badge className="mr-2 bg-blue-500">POST</Badge>
                              <code className="text-sm font-mono">/api/cart</code>
                            </div>
                            <p className="text-sm mb-1">Add item to cart</p>
                            <p className="text-xs text-muted-foreground">Adds a part to the user's cart. Requires partId and quantity in request body.</p>
                          </div>
                          
                          <div className="border-l-4 border-primary pl-4 py-2">
                            <div className="flex items-center mb-2">
                              <Badge className="mr-2 bg-red-500">DELETE</Badge>
                              <code className="text-sm font-mono">/api/cart/{"{partId}"}</code>
                            </div>
                            <p className="text-sm mb-1">Remove item from cart</p>
                            <p className="text-xs text-muted-foreground">Removes a specific part from the user's cart.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="examples">
                  <div className="glass-morphism rounded-xl p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <h3 className="text-xl font-semibold">API Usage Examples</h3>
                    </div>
                    
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <h4 className="font-medium">Authentication</h4>
                        <p className="text-sm text-muted-foreground mb-3">
                          All API requests must include your API key in the Authorization header.
                        </p>
                        <pre className="bg-secondary/10 p-3 rounded-md text-xs overflow-x-auto">
                          Authorization: Bearer {user.apiKey}
                        </pre>
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="font-medium">Example: Adding an item to cart</h4>
                        <div className="space-y-4">
                          <div className="bg-secondary/10 p-3 rounded-md">
                            <p className="text-xs text-muted-foreground mb-1">Request</p>
                            <pre className="text-xs overflow-x-auto">
{`POST /api/cart
Authorization: Bearer ${user.apiKey}
Content-Type: application/json

{
  "partId": "part-1",
  "quantity": 2
}`}
                            </pre>
                          </div>
                          
                          <div className="bg-secondary/10 p-3 rounded-md">
                            <p className="text-xs text-muted-foreground mb-1">Response</p>
                            <pre className="text-xs overflow-x-auto">
{`{
  "success": true,
  "cart": [
    {
      "partId": "part-1",
      "quantity": 2,
      "part": {
        "id": "part-1",
        "name": "OEM Solutions Air Filter",
        "price": 59.99,
        "category": "Engine"
      }
    }
  ]
}`}
                            </pre>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="testing">
                  <div className="glass-morphism rounded-xl p-6">
                    <div className="space-y-6">
                      <ApiCurlExamples apiKey={user.apiKey} />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
            
            <div className="glass-morphism rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-4">Need more help?</h3>
              <p className="text-muted-foreground mb-4">
                Contact our developer support team if you have any questions or need assistance implementing our API.
              </p>
              <Button className="flex items-center gap-1">
                Contact Support
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ApiDocs;
