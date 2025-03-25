
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CopyIcon, CheckIcon } from "lucide-react";
import { toast } from "sonner";

interface ApiCurlExamplesProps {
  apiKey: string;
}

const ApiCurlExamples = ({ apiKey }: ApiCurlExamplesProps) => {
  const [copiedCommand, setCopiedCommand] = useState<string | null>(null);
  
  // Base URL for API requests
  const baseUrl = window.location.origin;
  
  const curlCommands = [
    {
      id: "get-cart",
      title: "Get Cart",
      description: "Retrieve the current cart for this API key",
      command: `curl -X GET "${baseUrl}/api/cart" \\
  -H "X-API-Key: ${apiKey}" \\
  -H "Accept: application/json"`
    },
    {
      id: "add-to-cart",
      title: "Add to Cart",
      description: "Add a part to the cart",
      command: `curl -X POST "${baseUrl}/api/cart" \\
  -H "X-API-Key: ${apiKey}" \\
  -H "Content-Type: application/json" \\
  -H "Accept: application/json" \\
  -d '{
    "partId": "part-1",
    "quantity": 2
  }'`
    },
    {
      id: "remove-from-cart",
      title: "Remove from Cart",
      description: "Remove a part from the cart",
      command: `curl -X DELETE "${baseUrl}/api/cart/part-1" \\
  -H "X-API-Key: ${apiKey}" \\
  -H "Accept: application/json"`
    }
  ];

  const copyToClipboard = (command: string, id: string) => {
    navigator.clipboard.writeText(command);
    setCopiedCommand(id);
    toast.success("Command copied to clipboard");
    
    setTimeout(() => {
      setCopiedCommand(null);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">Test Commands</h3>
      <div className="space-y-4">
        {curlCommands.map((curl) => (
          <div key={curl.id} className="border rounded-lg overflow-hidden">
            <div className="flex justify-between items-center p-3 bg-secondary/20">
              <div>
                <span className="font-medium">{curl.title}</span>
                <p className="text-sm text-muted-foreground">{curl.description}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(curl.command, curl.id)}
                className="flex items-center gap-1"
              >
                {copiedCommand === curl.id ? (
                  <>
                    <CheckIcon className="h-4 w-4" />
                    Copied
                  </>
                ) : (
                  <>
                    <CopyIcon className="h-4 w-4" />
                    Copy
                  </>
                )}
              </Button>
            </div>
            <div className="bg-secondary/10 p-3 overflow-x-auto">
              <pre className="text-xs whitespace-pre-wrap">{curl.command}</pre>
            </div>
          </div>
        ))}
      </div>
      
      <div className="rounded-lg p-4 bg-blue-50 border border-blue-200 text-blue-700 text-sm">
        <p><strong>Note:</strong> These commands can be run from your terminal to test the API endpoints.</p>
      </div>
    </div>
  );
};

export default ApiCurlExamples;
