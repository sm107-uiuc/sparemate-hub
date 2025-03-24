
import { useState, useEffect } from "react";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, Check, Key, Plus, Trash2 } from "lucide-react";
import { ApiKey, sampleApiKeys } from "@/lib/data";

const ApiDocs = () => {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [newKeyName, setNewKeyName] = useState("");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  
  useEffect(() => {
    // Simulate fetching API keys
    setApiKeys(sampleApiKeys);
  }, []);
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(text);
    
    setTimeout(() => {
      setCopiedKey(null);
    }, 2000);
  };
  
  const handleCreateKey = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newKeyName.trim()) {
      toast.error("Please enter a name for the API key", {
        description: "A descriptive name helps identify your API key's purpose.",
      });
      return;
    }
    
    setIsGenerating(true);
    
    // Simulate key generation
    setTimeout(() => {
      const newKey: ApiKey = {
        id: `key-${apiKeys.length + 1}`,
        name: newKeyName,
        key: `sk_dev_${Math.random().toString(36).substring(2, 15)}`,
        created: new Date().toISOString(),
        lastUsed: null,
        status: "active",
      };
      
      setApiKeys([...apiKeys, newKey]);
      setNewKeyName("");
      setIsGenerating(false);
      
      toast.success("API key created", {
        description: "Your new API key has been generated successfully.",
      });
    }, 1500);
  };
  
  const handleToggleStatus = (keyId: string) => {
    setApiKeys(
      apiKeys.map((key) =>
        key.id === keyId
          ? { ...key, status: key.status === "active" ? "inactive" : "active" }
          : key
      )
    );
    
    const key = apiKeys.find((k) => k.id === keyId);
    const newStatus = key?.status === "active" ? "inactive" : "active";
    
    toast.success(`API key ${newStatus}`, {
      description: `The API key has been ${newStatus === "active" ? "activated" : "deactivated"}.`,
    });
  };
  
  const handleDeleteKey = (keyId: string) => {
    setApiKeys(apiKeys.filter((key) => key.id !== keyId));
    
    toast.success("API key deleted", {
      description: "The API key has been permanently deleted.",
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <h1 className="text-3xl font-bold mb-2">API Documentation</h1>
          <p className="text-muted-foreground mb-8">
            Integrate directly with our parts inventory using our RESTful API.
          </p>
          
          <Tabs defaultValue="overview" className="space-y-8">
            <div className="glass-morphism rounded-xl overflow-hidden">
              <TabsList className="p-2 w-full bg-secondary/30 border-b border-border rounded-none">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="parts">Parts API</TabsTrigger>
                <TabsTrigger value="orders">Orders API</TabsTrigger>
                <TabsTrigger value="keys">API Keys</TabsTrigger>
              </TabsList>
              
              <div className="p-6">
                <TabsContent value="overview" className="mt-0 animate-fade-in">
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-xl font-medium mb-3">Introduction</h2>
                      <p className="text-muted-foreground">
                        The SpareMate Hub API gives you programmatic access to our entire parts inventory,
                        allowing you to integrate our catalog with your own systems or create custom
                        experiences for your users.
                      </p>
                    </div>
                    
                    <div>
                      <h2 className="text-xl font-medium mb-3">Authentication</h2>
                      <p className="text-muted-foreground mb-4">
                        All API requests require authentication using an API key. You can generate and
                        manage your API keys in the API Keys tab.
                      </p>
                      
                      <div className="bg-secondary/30 rounded-lg p-4 font-mono text-sm">
                        <pre>
{`// Include your API key in the request headers
const headers = {
  'Authorization': 'Bearer YOUR_API_KEY',
  'Content-Type': 'application/json'
};`}
                        </pre>
                      </div>
                    </div>
                    
                    <div>
                      <h2 className="text-xl font-medium mb-3">Base URL</h2>
                      <p className="text-muted-foreground mb-4">
                        All API endpoints are relative to the following base URL:
                      </p>
                      
                      <div className="flex bg-secondary/30 rounded-lg overflow-hidden">
                        <div className="bg-secondary/50 p-3 whitespace-nowrap">
                          <code className="font-mono text-sm">
                            Base URL
                          </code>
                        </div>
                        <div className="p-3 flex-grow">
                          <code className="font-mono text-sm">
                            https://api.sparemate-hub.com/v1
                          </code>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h2 className="text-xl font-medium mb-3">Rate Limiting</h2>
                      <p className="text-muted-foreground">
                        The API is rate limited to prevent abuse. By default, you can make up to 100 requests per minute.
                        If you exceed this limit, your requests will be throttled and you'll receive a 429 Too Many
                        Requests response.
                      </p>
                    </div>
                    
                    <div>
                      <h2 className="text-xl font-medium mb-3">Error Handling</h2>
                      <p className="text-muted-foreground mb-4">
                        The API returns standard HTTP status codes to indicate success or failure of a request.
                        Error responses include a JSON body with additional information.
                      </p>
                      
                      <div className="bg-secondary/30 rounded-lg p-4 font-mono text-sm">
                        <pre>
{`// Example error response
{
  "error": {
    "code": "invalid_request",
    "message": "Invalid API key provided",
    "status": 401
  }
}`}
                        </pre>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="parts" className="mt-0 animate-fade-in">
                  <div className="space-y-8">
                    <div>
                      <h2 className="text-xl font-medium mb-3">Parts API</h2>
                      <p className="text-muted-foreground">
                        The Parts API allows you to retrieve information about all available parts
                        in our inventory, search for specific parts, and get detailed information
                        about individual parts.
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-3">List All Parts</h3>
                      <div className="flex bg-secondary/30 rounded-lg overflow-hidden mb-4">
                        <div className="bg-secondary/50 p-3 whitespace-nowrap">
                          <code className="font-mono text-sm">GET</code>
                        </div>
                        <div className="p-3 flex-grow">
                          <code className="font-mono text-sm">/parts</code>
                        </div>
                      </div>
                      
                      <h4 className="text-sm font-medium mb-2">Query Parameters</h4>
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                          <thead>
                            <tr className="bg-secondary/30">
                              <th className="text-left p-2 text-sm">Parameter</th>
                              <th className="text-left p-2 text-sm">Type</th>
                              <th className="text-left p-2 text-sm">Description</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="border-b border-border">
                              <td className="p-2 text-sm">limit</td>
                              <td className="p-2 text-sm">integer</td>
                              <td className="p-2 text-sm">Maximum number of parts to return (default: 20, max: 100)</td>
                            </tr>
                            <tr className="border-b border-border">
                              <td className="p-2 text-sm">offset</td>
                              <td className="p-2 text-sm">integer</td>
                              <td className="p-2 text-sm">Number of parts to skip (default: 0)</td>
                            </tr>
                            <tr className="border-b border-border">
                              <td className="p-2 text-sm">category</td>
                              <td className="p-2 text-sm">string</td>
                              <td className="p-2 text-sm">Filter by category</td>
                            </tr>
                            <tr className="border-b border-border">
                              <td className="p-2 text-sm">manufacturer</td>
                              <td className="p-2 text-sm">string</td>
                              <td className="p-2 text-sm">Filter by manufacturer</td>
                            </tr>
                            <tr>
                              <td className="p-2 text-sm">query</td>
                              <td className="p-2 text-sm">string</td>
                              <td className="p-2 text-sm">Search query to filter parts by name, description, or SKU</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      
                      <h4 className="text-sm font-medium mt-4 mb-2">Example Response</h4>
                      <div className="bg-secondary/30 rounded-lg p-4 font-mono text-sm">
                        <pre>
{`{
  "data": [
    {
      "id": "part-1",
      "name": "TechPart Air Filter",
      "description": "High-performance air filter for improved airflow",
      "price": 34.99,
      "category": "Engine",
      "compatibility": ["Toyota Camry (2018-2023)"],
      "manufacturer": "TechPart",
      "stock": 45,
      "sku": "ENG-TEC-00001",
      "rating": 4.7,
      "reviews": 128
    },
    // Additional parts...
  ],
  "meta": {
    "total": 100,
    "limit": 20,
    "offset": 0
  }
}`}
                        </pre>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-3">Get a Specific Part</h3>
                      <div className="flex bg-secondary/30 rounded-lg overflow-hidden mb-4">
                        <div className="bg-secondary/50 p-3 whitespace-nowrap">
                          <code className="font-mono text-sm">GET</code>
                        </div>
                        <div className="p-3 flex-grow">
                          <code className="font-mono text-sm">/parts/:id</code>
                        </div>
                      </div>
                      
                      <h4 className="text-sm font-medium mb-2">Path Parameters</h4>
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                          <thead>
                            <tr className="bg-secondary/30">
                              <th className="text-left p-2 text-sm">Parameter</th>
                              <th className="text-left p-2 text-sm">Type</th>
                              <th className="text-left p-2 text-sm">Description</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="p-2 text-sm">id</td>
                              <td className="p-2 text-sm">string</td>
                              <td className="p-2 text-sm">The unique identifier of the part</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      
                      <h4 className="text-sm font-medium mt-4 mb-2">Example Response</h4>
                      <div className="bg-secondary/30 rounded-lg p-4 font-mono text-sm">
                        <pre>
{`{
  "data": {
    "id": "part-1",
    "name": "TechPart Air Filter",
    "description": "High-performance air filter for improved airflow",
    "price": 34.99,
    "category": "Engine",
    "compatibility": ["Toyota Camry (2018-2023)"],
    "manufacturer": "TechPart",
    "stock": 45,
    "sku": "ENG-TEC-00001",
    "rating": 4.7,
    "reviews": 128
  }
}`}
                        </pre>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="orders" className="mt-0 animate-fade-in">
                  <div className="space-y-8">
                    <div>
                      <h2 className="text-xl font-medium mb-3">Orders API</h2>
                      <p className="text-muted-foreground">
                        The Orders API allows you to manage orders, including creating new orders,
                        retrieving order information, and updating order status.
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-3">Create an Order</h3>
                      <div className="flex bg-secondary/30 rounded-lg overflow-hidden mb-4">
                        <div className="bg-secondary/50 p-3 whitespace-nowrap">
                          <code className="font-mono text-sm">POST</code>
                        </div>
                        <div className="p-3 flex-grow">
                          <code className="font-mono text-sm">/orders</code>
                        </div>
                      </div>
                      
                      <h4 className="text-sm font-medium mb-2">Request Body</h4>
                      <div className="bg-secondary/30 rounded-lg p-4 font-mono text-sm mb-4">
                        <pre>
{`{
  "items": [
    {
      "partId": "part-1",
      "quantity": 2
    },
    {
      "partId": "part-8",
      "quantity": 1
    }
  ],
  "shippingAddress": {
    "name": "John Doe",
    "address": "123 Main St",
    "city": "San Francisco",
    "state": "CA",
    "zipCode": "94105",
    "country": "US"
  },
  "paymentMethodId": "pm_123456789"
}`}
                        </pre>
                      </div>
                      
                      <h4 className="text-sm font-medium mb-2">Example Response</h4>
                      <div className="bg-secondary/30 rounded-lg p-4 font-mono text-sm">
                        <pre>
{`{
  "data": {
    "id": "ORD-12348",
    "date": "2023-06-21T15:30:42Z",
    "status": "processing",
    "items": [
      {
        "partId": "part-1",
        "quantity": 2,
        "price": 34.99
      },
      {
        "partId": "part-8",
        "quantity": 1,
        "price": 249.99
      }
    ],
    "total": 319.97,
    "shippingAddress": {
      "name": "John Doe",
      "address": "123 Main St",
      "city": "San Francisco",
      "state": "CA",
      "zipCode": "94105",
      "country": "US"
    }
  }
}`}
                        </pre>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-3">Get Order Status</h3>
                      <div className="flex bg-secondary/30 rounded-lg overflow-hidden mb-4">
                        <div className="bg-secondary/50 p-3 whitespace-nowrap">
                          <code className="font-mono text-sm">GET</code>
                        </div>
                        <div className="p-3 flex-grow">
                          <code className="font-mono text-sm">/orders/:id</code>
                        </div>
                      </div>
                      
                      <h4 className="text-sm font-medium mb-2">Path Parameters</h4>
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                          <thead>
                            <tr className="bg-secondary/30">
                              <th className="text-left p-2 text-sm">Parameter</th>
                              <th className="text-left p-2 text-sm">Type</th>
                              <th className="text-left p-2 text-sm">Description</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="p-2 text-sm">id</td>
                              <td className="p-2 text-sm">string</td>
                              <td className="p-2 text-sm">The unique identifier of the order</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      
                      <h4 className="text-sm font-medium mt-4 mb-2">Example Response</h4>
                      <div className="bg-secondary/30 rounded-lg p-4 font-mono text-sm">
                        <pre>
{`{
  "data": {
    "id": "ORD-12345",
    "date": "2023-06-10T14:23:10Z",
    "status": "delivered",
    "items": [
      {
        "partId": "part-12",
        "quantity": 2,
        "price": 129.99
      },
      {
        "partId": "part-35",
        "quantity": 1,
        "price": 79.50
      }
    ],
    "total": 339.48,
    "trackingNumber": "TRK-987654321",
    "estimatedDelivery": "2023-06-14T00:00:00Z",
    "deliveredAt": "2023-06-13T14:25:18Z"
  }
}`}
                        </pre>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="keys" className="mt-0 animate-fade-in">
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-xl font-medium mb-3">API Keys</h2>
                      <p className="text-muted-foreground">
                        Manage your API keys to authenticate requests to the SpareMate Hub API.
                        Keep your API keys secure and never share them publicly.
                      </p>
                    </div>
                    
                    <div className="glass-morphism rounded-lg p-6">
                      <h3 className="text-lg font-medium mb-4">Your API Keys</h3>
                      
                      {apiKeys.length === 0 ? (
                        <div className="text-center py-8">
                          <Key className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                          <p className="text-muted-foreground">
                            You don't have any API keys yet. Create one to get started.
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {apiKeys.map((apiKey) => (
                            <div 
                              key={apiKey.id}
                              className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-4 border border-border rounded-lg"
                            >
                              <div>
                                <div className="flex items-center gap-2">
                                  <h4 className="font-medium">{apiKey.name}</h4>
                                  <span 
                                    className={`text-xs px-2 py-1 rounded ${
                                      apiKey.status === "active"
                                        ? "bg-green-100 text-green-800"
                                        : "bg-gray-100 text-gray-800"
                                    }`}
                                  >
                                    {apiKey.status}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 mt-1">
                                  <code className="text-xs text-muted-foreground font-mono">
                                    {apiKey.key.substring(0, 12)}...
                                  </code>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6"
                                    onClick={() => copyToClipboard(apiKey.key)}
                                  >
                                    {copiedKey === apiKey.key ? (
                                      <Check className="h-3 w-3 text-green-500" />
                                    ) : (
                                      <Copy className="h-3 w-3" />
                                    )}
                                  </Button>
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">
                                  Created on {new Date(apiKey.created).toLocaleDateString()}
                                  {apiKey.lastUsed && (
                                    <> · Last used {new Date(apiKey.lastUsed).toLocaleDateString()}</>
                                  )}
                                </p>
                              </div>
                              
                              <div className="flex items-center gap-2 self-end md:self-auto">
                                <Button
                                  variant={apiKey.status === "active" ? "outline" : "default"}
                                  size="sm"
                                  onClick={() => handleToggleStatus(apiKey.id)}
                                >
                                  {apiKey.status === "active" ? "Deactivate" : "Activate"}
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => handleDeleteKey(apiKey.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <div className="glass-morphism rounded-lg p-6">
                      <h3 className="text-lg font-medium mb-4">Create a New API Key</h3>
                      
                      <form onSubmit={handleCreateKey} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="keyName">API Key Name</Label>
                          <Input
                            id="keyName"
                            placeholder="e.g., Development, Production, Testing"
                            value={newKeyName}
                            onChange={(e) => setNewKeyName(e.target.value)}
                          />
                          <p className="text-xs text-muted-foreground">
                            Give your API key a descriptive name to easily identify its purpose.
                          </p>
                        </div>
                        
                        <Button 
                          type="submit"
                          disabled={isGenerating}
                          className="flex items-center gap-1"
                        >
                          {isGenerating ? (
                            <div className="flex items-center">
                              <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                              Generating...
                            </div>
                          ) : (
                            <>
                              <Plus className="h-4 w-4" />
                              Create API Key
                            </>
                          )}
                        </Button>
                      </form>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-3">Security Best Practices</h3>
                      <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                        <li>Never share your API keys in public repositories or client-side code.</li>
                        <li>Use different API keys for development and production environments.</li>
                        <li>Rotate your API keys periodically for enhanced security.</li>
                        <li>Deactivate or delete API keys that are no longer needed.</li>
                        <li>Monitor your API key usage for any suspicious activity.</li>
                      </ul>
                    </div>
                  </div>
                </TabsContent>
              </div>
            </div>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ApiDocs;
