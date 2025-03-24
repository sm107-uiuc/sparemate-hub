import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PartCard from "@/components/PartCard";
import { parts as allParts, Part } from "@/lib/data";
import { 
  Search, 
  Filter, 
  ChevronDown, 
  X, 
  ShoppingCart, 
  SlidersHorizontal 
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const Inventory = () => {
  const navigate = useNavigate();
  const [parts, setParts] = useState<Part[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState<{ part: Part; quantity: number }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilters, setActiveFilters] = useState<{
    categories: string[];
    manufacturers: string[];
    priceRange: [number, number];
    compatibility: string;
    inStock: boolean;
  }>({
    categories: [],
    manufacturers: [],
    priceRange: [0, 1000],
    compatibility: "",
    inStock: false,
  });
  
  const [sortOption, setSortOption] = useState("relevance");
  const categories = [...new Set(allParts.map((part) => part.category))];
  const manufacturers = [...new Set(allParts.map((part) => part.manufacturer))];
  
  // Find min and max prices
  const minPrice = Math.min(...allParts.map((part) => part.price));
  const maxPrice = Math.max(...allParts.map((part) => part.price));
  
  const filterParts = () => {
    let filtered = [...allParts];
    
    // Search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (part) =>
          part.name.toLowerCase().includes(query) ||
          part.description.toLowerCase().includes(query) ||
          part.category.toLowerCase().includes(query) ||
          part.sku.toLowerCase().includes(query)
      );
    }
    
    // Categories
    if (activeFilters.categories.length > 0) {
      filtered = filtered.filter((part) =>
        activeFilters.categories.includes(part.category)
      );
    }
    
    // Manufacturers
    if (activeFilters.manufacturers.length > 0) {
      filtered = filtered.filter((part) =>
        activeFilters.manufacturers.includes(part.manufacturer)
      );
    }
    
    // Price range
    filtered = filtered.filter(
      (part) =>
        part.price >= activeFilters.priceRange[0] &&
        part.price <= activeFilters.priceRange[1]
    );
    
    // Vehicle compatibility
    if (activeFilters.compatibility) {
      filtered = filtered.filter((part) =>
        part.compatibility.some((vehicle) =>
          vehicle.toLowerCase().includes(activeFilters.compatibility.toLowerCase())
        )
      );
    }
    
    // In stock
    if (activeFilters.inStock) {
      filtered = filtered.filter((part) => part.stock > 0);
    }
    
    // Sorting
    switch (sortOption) {
      case "price-asc":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "name-asc":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "rating-desc":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      default:
        // Default sort by relevance (keep original order)
        break;
    }
    
    return filtered;
  };

  useEffect(() => {
    // Simulate data loading
    setIsLoading(true);
    const timer = setTimeout(() => {
      setParts(filterParts());
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [searchQuery, activeFilters, sortOption]);

  const addToCart = (part: Part) => {
    setCart((prev) => {
      const existingItem = prev.find((item) => item.part.id === part.id);
      
      if (existingItem) {
        return prev.map((item) =>
          item.part.id === part.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prev, { part, quantity: 1 }];
      }
    });
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  
  const handleCartClick = () => {
    // Simulate saving cart to session/localStorage and navigate
    if (cartCount > 0) {
      navigate("/cart");
    } else {
      toast.info("Your cart is empty", {
        description: "Browse our inventory to add parts to your cart.",
      });
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const handleCategoryChange = (category: string) => {
    setActiveFilters((prev) => {
      const categories = prev.categories.includes(category)
        ? prev.categories.filter((c) => c !== category)
        : [...prev.categories, category];
      
      return {
        ...prev,
        categories,
      };
    });
  };

  const handleManufacturerChange = (manufacturer: string) => {
    setActiveFilters((prev) => {
      const manufacturers = prev.manufacturers.includes(manufacturer)
        ? prev.manufacturers.filter((m) => m !== manufacturer)
        : [...prev.manufacturers, manufacturer];
      
      return {
        ...prev,
        manufacturers,
      };
    });
  };

  const handlePriceChange = (value: number[]) => {
    setActiveFilters((prev) => ({
      ...prev,
      priceRange: [value[0], value[1]] as [number, number],
    }));
  };

  const handleInStockChange = (checked: boolean) => {
    setActiveFilters((prev) => ({
      ...prev,
      inStock: checked,
    }));
  };

  const handleCompatibilityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setActiveFilters((prev) => ({
      ...prev,
      compatibility: e.target.value,
    }));
  };

  const clearAllFilters = () => {
    setActiveFilters({
      categories: [],
      manufacturers: [],
      priceRange: [minPrice, maxPrice],
      compatibility: "",
      inStock: false,
    });
    setSearchQuery("");
  };

  const activeFilterCount =
    activeFilters.categories.length +
    activeFilters.manufacturers.length +
    (activeFilters.compatibility ? 1 : 0) +
    (activeFilters.inStock ? 1 : 0) +
    (activeFilters.priceRange[0] > minPrice || activeFilters.priceRange[1] < maxPrice ? 1 : 0);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col space-y-6">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold">Parts Inventory</h1>
                <p className="text-muted-foreground">
                  Find the perfect parts for your vehicle
                </p>
              </div>
              
              <div className="flex items-center space-x-2">
                <form 
                  onSubmit={handleSearchSubmit}
                  className="relative w-full md:w-64 lg:w-80"
                >
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search parts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </form>
                
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="icon" className="md:hidden">
                      <Filter className="h-4 w-4" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                    <SheetHeader>
                      <SheetTitle>Filters</SheetTitle>
                    </SheetHeader>
                    <div className="py-4">
                      <Accordion type="multiple" className="w-full">
                        <AccordionItem value="categories">
                          <AccordionTrigger>Categories</AccordionTrigger>
                          <AccordionContent>
                            <div className="space-y-2">
                              {categories.map((category) => (
                                <div key={category} className="flex items-center space-x-2">
                                  <Checkbox
                                    id={`category-${category}`}
                                    checked={activeFilters.categories.includes(category)}
                                    onCheckedChange={() => handleCategoryChange(category)}
                                  />
                                  <label
                                    htmlFor={`category-${category}`}
                                    className="text-sm cursor-pointer"
                                  >
                                    {category}
                                  </label>
                                </div>
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                        
                        <AccordionItem value="manufacturers">
                          <AccordionTrigger>Manufacturers</AccordionTrigger>
                          <AccordionContent>
                            <div className="space-y-2">
                              {manufacturers.map((manufacturer) => (
                                <div key={manufacturer} className="flex items-center space-x-2">
                                  <Checkbox
                                    id={`manufacturer-${manufacturer}`}
                                    checked={activeFilters.manufacturers.includes(manufacturer)}
                                    onCheckedChange={() => handleManufacturerChange(manufacturer)}
                                  />
                                  <label
                                    htmlFor={`manufacturer-${manufacturer}`}
                                    className="text-sm cursor-pointer"
                                  >
                                    {manufacturer}
                                  </label>
                                </div>
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                        
                        <AccordionItem value="price">
                          <AccordionTrigger>Price Range</AccordionTrigger>
                          <AccordionContent>
                            <div className="space-y-6">
                              <Slider
                                value={[activeFilters.priceRange[0], activeFilters.priceRange[1]]}
                                min={minPrice}
                                max={maxPrice}
                                step={10}
                                onValueChange={handlePriceChange}
                              />
                              <div className="flex items-center justify-between">
                                <span className="text-sm">
                                  ${activeFilters.priceRange[0]}
                                </span>
                                <span className="text-sm">
                                  ${activeFilters.priceRange[1]}
                                </span>
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                        
                        <AccordionItem value="compatibility">
                          <AccordionTrigger>Vehicle Compatibility</AccordionTrigger>
                          <AccordionContent>
                            <div className="space-y-2">
                              <Input
                                placeholder="Enter make, model, year..."
                                value={activeFilters.compatibility}
                                onChange={handleCompatibilityChange}
                              />
                              <p className="text-xs text-muted-foreground">
                                Example: "Toyota Camry 2020" or "Honda Civic"
                              </p>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                        
                        <AccordionItem value="stock">
                          <AccordionTrigger>Availability</AccordionTrigger>
                          <AccordionContent>
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id="in-stock-mobile"
                                checked={activeFilters.inStock}
                                onCheckedChange={handleInStockChange}
                              />
                              <label
                                htmlFor="in-stock-mobile"
                                className="text-sm cursor-pointer"
                              >
                                In Stock Only
                              </label>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                      
                      <div className="mt-6 flex justify-end">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={clearAllFilters}
                        >
                          Clear All Filters
                        </Button>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
                
                <Button
                  variant="outline"
                  size="icon"
                  className="relative"
                  onClick={handleCartClick}
                >
                  <ShoppingCart className="h-4 w-4" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center rounded-full bg-primary text-[10px] text-white">
                      {cartCount}
                    </span>
                  )}
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Desktop Filters */}
              <div className="hidden lg:block">
                <div className="glass-morphism rounded-xl p-6 sticky top-24">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-medium flex items-center">
                      <SlidersHorizontal className="h-4 w-4 mr-2" />
                      Filters
                    </h3>
                    {activeFilterCount > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 text-xs"
                        onClick={clearAllFilters}
                      >
                        Clear All
                      </Button>
                    )}
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-sm font-medium mb-3">Categories</h4>
                      <div className="space-y-2">
                        {categories.map((category) => (
                          <div key={category} className="flex items-center space-x-2">
                            <Checkbox
                              id={`category-${category}`}
                              checked={activeFilters.categories.includes(category)}
                              onCheckedChange={() => handleCategoryChange(category)}
                            />
                            <label
                              htmlFor={`category-${category}`}
                              className="text-sm cursor-pointer"
                            >
                              {category}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-3">Manufacturers</h4>
                      <div className="space-y-2">
                        {manufacturers.map((manufacturer) => (
                          <div key={manufacturer} className="flex items-center space-x-2">
                            <Checkbox
                              id={`manufacturer-${manufacturer}`}
                              checked={activeFilters.manufacturers.includes(manufacturer)}
                              onCheckedChange={() => handleManufacturerChange(manufacturer)}
                            />
                            <label
                              htmlFor={`manufacturer-${manufacturer}`}
                              className="text-sm cursor-pointer"
                            >
                              {manufacturer}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-3">Price Range</h4>
                      <div className="space-y-6">
                        <Slider
                          value={[activeFilters.priceRange[0], activeFilters.priceRange[1]]}
                          min={minPrice}
                          max={maxPrice}
                          step={10}
                          onValueChange={handlePriceChange}
                        />
                        <div className="flex items-center justify-between">
                          <span className="text-sm">
                            ${activeFilters.priceRange[0]}
                          </span>
                          <span className="text-sm">
                            ${activeFilters.priceRange[1]}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-3">Vehicle Compatibility</h4>
                      <Input
                        placeholder="Enter make, model, year..."
                        value={activeFilters.compatibility}
                        onChange={handleCompatibilityChange}
                      />
                      <p className="text-xs text-muted-foreground mt-2">
                        Example: "Toyota Camry 2020" or "Honda Civic"
                      </p>
                    </div>
                    
                    <div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="in-stock"
                          checked={activeFilters.inStock}
                          onCheckedChange={handleInStockChange}
                        />
                        <label
                          htmlFor="in-stock"
                          className="text-sm cursor-pointer"
                        >
                          In Stock Only
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="lg:col-span-3 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {activeFilterCount > 0 && (
                      <Badge variant="secondary" className="h-6">
                        {activeFilterCount} Filter{activeFilterCount !== 1 ? "s" : ""} Applied
                      </Badge>
                    )}
                    {activeFilters.categories.map((category) => (
                      <Badge
                        key={category}
                        variant="outline"
                        className="flex items-center gap-1 h-6"
                      >
                        {category}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-4 w-4 p-0"
                          onClick={() => handleCategoryChange(category)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                    {activeFilters.manufacturers.map((manufacturer) => (
                      <Badge
                        key={manufacturer}
                        variant="outline"
                        className="flex items-center gap-1 h-6"
                      >
                        {manufacturer}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-4 w-4 p-0"
                          onClick={() => handleManufacturerChange(manufacturer)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex items-center">
                    <Select
                      value={sortOption}
                      onValueChange={setSortOption}
                    >
                      <SelectTrigger className="w-[160px] h-8 text-xs">
                        <SelectValue placeholder="Sort By" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="relevance">Relevance</SelectItem>
                        <SelectItem value="price-asc">Price: Low to High</SelectItem>
                        <SelectItem value="price-desc">Price: High to Low</SelectItem>
                        <SelectItem value="name-asc">Name: A to Z</SelectItem>
                        <SelectItem value="rating-desc">Highest Rated</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                {isLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: 6 }).map((_, index) => (
                      <div
                        key={index}
                        className="glass-morphism rounded-xl overflow-hidden animate-pulse"
                      >
                        <div className="aspect-square bg-secondary/50"></div>
                        <div className="p-4 space-y-3">
                          <div className="h-4 bg-secondary/70 rounded w-3/4"></div>
                          <div className="h-6 bg-secondary/70 rounded w-4/5"></div>
                          <div className="h-4 bg-secondary/70 rounded w-1/2"></div>
                          <div className="flex justify-between">
                            <div className="h-6 bg-secondary/70 rounded w-1/4"></div>
                            <div className="h-8 bg-secondary/70 rounded w-1/4"></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : parts.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="mb-4 p-4 rounded-full bg-secondary">
                      <Search className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-xl font-medium mb-2">No parts found</h3>
                    <p className="text-muted-foreground max-w-md">
                      We couldn't find any parts matching your search criteria. Try adjusting your filters or search query.
                    </p>
                    <Button
                      variant="outline"
                      className="mt-4"
                      onClick={clearAllFilters}
                    >
                      Clear All Filters
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {parts.map((part) => (
                      <PartCard key={part.id} part={part} onAddToCart={addToCart} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Inventory;
