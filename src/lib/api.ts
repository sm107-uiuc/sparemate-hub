import { parts as allParts } from "./data";

// Function to get the cart for a specific user
export const getUserCart = (userId: string) => {
  const userCartKey = `cart-${userId}`;
  const storedCart = localStorage.getItem(userCartKey);
  
  if (storedCart) {
    return JSON.parse(storedCart);
  }
  
  return []; // Return empty cart by default
};

// Function to save cart for a specific user
export const saveUserCart = (userId: string, cart: any[]) => {
  const userCartKey = `cart-${userId}`;
  localStorage.setItem(userCartKey, JSON.stringify(cart));
};

// Function to get user by API key
export const getUserByApiKey = (apiKey: string) => {
  // Check all users in localStorage (in a real app, this would be a database query)
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith("user")) {
      const userData = JSON.parse(localStorage.getItem(key) || "{}");
      if (userData.apiKey === apiKey) {
        return userData;
      }
    }
  }
  
  return null;
};

// API functions for cart operations
export const addToCart = (apiKey: string, partId: string, quantity: number) => {
  const user = getUserByApiKey(apiKey);
  
  if (!user) {
    return { success: false, error: "Invalid API key" };
  }
  
  // Find the part
  const part = allParts.find(p => p.id === partId);
  if (!part) {
    return { success: false, error: "Part not found" };
  }
  
  // Get current cart
  const cart = getUserCart(user.id);
  
  // Check if item already exists in cart
  const existingItemIndex = cart.findIndex((item: any) => item.partId === partId);
  
  if (existingItemIndex >= 0) {
    // Update quantity if item exists
    cart[existingItemIndex].quantity += quantity;
  } else {
    // Add new item if it doesn't exist
    cart.push({ partId, quantity });
  }
  
  // Save the updated cart
  saveUserCart(user.id, cart);
  
  return { success: true, cart };
};

export const removeFromCart = (apiKey: string, partId: string) => {
  const user = getUserByApiKey(apiKey);
  
  if (!user) {
    return { success: false, error: "Invalid API key" };
  }
  
  // Get current cart
  const cart = getUserCart(user.id);
  
  // Filter out the item
  const updatedCart = cart.filter((item: any) => item.partId !== partId);
  
  // Save the updated cart
  saveUserCart(user.id, updatedCart);
  
  return { success: true, cart: updatedCart };
};

export const getCart = (apiKey: string) => {
  const user = getUserByApiKey(apiKey);
  
  if (!user) {
    return { success: false, error: "Invalid API key" };
  }
  
  // Get current cart
  const cart = getUserCart(user.id);
  
  // Map cart items to include part details
  const cartWithDetails = cart.map((item: any) => {
    const part = allParts.find(p => p.id === item.partId);
    return {
      ...item,
      part: part ? {
        id: part.id,
        name: part.name,
        price: part.price,
        category: part.category
      } : null
    };
  });
  
  return { success: true, cart: cartWithDetails };
};

// Create a middleware to intercept API requests
export const setupApiInterceptor = () => {
  const originalFetch = window.fetch;
  
  window.fetch = async function(input, init) {
    const url = typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url;
    
    // Check if this is an API request
    if (url.includes('/api/')) {
      const headers = init?.headers instanceof Headers 
        ? init.headers 
        : new Headers(init?.headers || {});
      
      const authHeader = headers.get('Authorization');
      if (!authHeader) {
        return new Response(JSON.stringify({ success: false, error: "API key required" }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      const apiKey = authHeader.replace('Bearer ', '');
      const method = init?.method || 'GET';
      let body;
      
      try {
        if (init?.body) {
          body = typeof init.body === 'string' ? JSON.parse(init.body) : init.body;
        }
      } catch (e) {
        console.error('Error parsing request body:', e);
      }
      
      // Cart endpoint handlers
      if (url.endsWith('/api/cart')) {
        if (method === 'GET') {
          const result = getCart(apiKey);
          return new Response(JSON.stringify(result), {
            status: result.success ? 200 : 400,
            headers: { 'Content-Type': 'application/json' }
          });
        } 
        else if (method === 'POST' && body?.partId && body?.quantity) {
          const result = addToCart(apiKey, body.partId, body.quantity);
          return new Response(JSON.stringify(result), {
            status: result.success ? 200 : 400,
            headers: { 'Content-Type': 'application/json' }
          });
        }
      } 
      // Delete from cart endpoint
      else if (url.match(/\/api\/cart\/[\w-]+/) && method === 'DELETE') {
        const partId = url.split('/').pop();
        if (partId) {
          const result = removeFromCart(apiKey, partId);
          return new Response(JSON.stringify(result), {
            status: result.success ? 200 : 400,
            headers: { 'Content-Type': 'application/json' }
          });
        }
      }
      
      // If we've reached here, it's an unknown API endpoint
      return new Response(JSON.stringify({ success: false, error: "Endpoint not found" }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // For non-API requests, pass through to the original fetch
    return originalFetch.apply(this, [input, init]);
  };
};

// For backward compatibility, keep the original functions
export const handleApiRequest = (endpoint: string, method: string, body?: any, apiKey?: string) => {
  // Simulate network delay
  return new Promise(resolve => {
    setTimeout(() => {
      // Validate API key presence
      if (!apiKey) {
        resolve({ success: false, error: "API key required" });
        return;
      }
      
      // Cart endpoints
      if (endpoint === "/api/cart") {
        if (method === "GET") {
          resolve(getCart(apiKey));
        } else if (method === "POST" && body?.partId && body?.quantity) {
          resolve(addToCart(apiKey, body.partId, body.quantity));
        } else {
          resolve({ success: false, error: "Invalid request" });
        }
      } else if (endpoint.startsWith("/api/cart/") && method === "DELETE") {
        const partId = endpoint.split("/").pop();
        if (partId) {
          resolve(removeFromCart(apiKey, partId));
        } else {
          resolve({ success: false, error: "Invalid part ID" });
        }
      }
      // Parts endpoints could be added here
      else {
        resolve({ success: false, error: "Endpoint not found" });
      }
    }, 300);
  });
};
