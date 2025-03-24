
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, ShoppingCart, User, Search, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Inventory", path: "/inventory" },
    ...(isAuthenticated ? [
      { name: "API Docs", path: "/api-docs" },
      { name: "Order Status", path: "/order-status" },
    ] : []),
  ];

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "glass-morphism py-3" : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-xl font-semibold tracking-tight">SpareMate</span>
          <div className="hidden md:block h-5 w-px bg-gray-300 mx-1"></div>
          <span className="hidden md:block text-xs text-muted-foreground tracking-widest uppercase">Hub</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-sm transition-colors hover:text-primary ${
                location.pathname === link.path
                  ? "text-primary font-medium"
                  : "text-muted-foreground"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" className="hidden md:flex">
            <Search className="h-5 w-5" />
          </Button>
          
          {isAuthenticated && (
            <Link to="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center rounded-full bg-primary text-[10px] text-white">
                  0
                </span>
              </Button>
            </Link>
          )}
          
          {isAuthenticated ? (
            <div className="hidden md:flex items-center space-x-4">
              <div className="text-sm">
                <span className="font-medium">{user?.name}</span>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleLogout}
                className="text-muted-foreground hover:text-primary"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="icon" className="hidden md:flex">
                  <User className="h-5 w-5" />
                </Button>
              </Link>
              <Link to="/login">
                <Button
                  variant="outline"
                  size="sm"
                  className="hidden md:inline-flex"
                >
                  Log in
                </Button>
              </Link>
              <Link to="/login?tab=signup">
                <Button
                  size="sm"
                  className="hidden md:inline-flex"
                >
                  Sign up
                </Button>
              </Link>
            </>
          )}
          
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-background z-50 animate-fade-in">
          <div className="container mx-auto px-4 py-5 h-full flex flex-col">
            <div className="flex justify-between items-center">
              <Link to="/" className="flex items-center space-x-2">
                <span className="text-xl font-semibold tracking-tight">SpareMate</span>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <X className="h-6 w-6" />
              </Button>
            </div>
            <nav className="flex flex-col space-y-6 mt-10">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="text-lg py-2 border-b border-border"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              
              {isAuthenticated ? (
                <>
                  <Link to="/cart" className="text-lg py-2 border-b border-border" onClick={() => setIsMobileMenuOpen(false)}>
                    Cart
                  </Link>
                  <Button 
                    variant="ghost" 
                    className="text-lg justify-start py-2 h-auto border-b border-border"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      handleLogout();
                    }}
                  >
                    <LogOut className="h-5 w-5 mr-2" />
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-lg py-2 border-b border-border" onClick={() => setIsMobileMenuOpen(false)}>
                    Login
                  </Link>
                  <Link to="/login?tab=signup" className="text-lg py-2 border-b border-border" onClick={() => setIsMobileMenuOpen(false)}>
                    Sign Up
                  </Link>
                </>
              )}
            </nav>
            {!isAuthenticated && (
              <div className="mt-auto pb-10">
                <Link to="/login?tab=signup" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button className="w-full" size="lg">
                    Sign up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
