
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

// Mock API server handlers (simulating backend endpoints)
// In a real app, these functions would be implemented on a backend server
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
