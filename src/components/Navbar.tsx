
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

// Define a local fallback image that's guaranteed to work
// We'll use a data URI for immediate availability with no network dependency
const DATA_URI_LOGO = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWhvbWUiPjxwYXRoIGQ9Im0zIDkgOSAtNyA5IDd2MTFhMiAyIDAgMCAxLTIgMkg1YTIgMiAwIDAgMS0yLTJWOVoiLz48cG9seWxpbmUgcG9pbnRzPSI5IDIyIDkgMTIgMTUgMTIgMTUgMjIiLz48L3N2Zz4=";
import { useAuth } from "@/components/AuthProvider";
import { useUserRole } from "@/components/UserRoleProvider";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { cn } from "@/lib/utils";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [logoLoaded, setLogoLoaded] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const { user, isLoading } = useAuth();
  const { role, isLoadingRole } = useUserRole();
  const { toast } = useToast();
  const location = useLocation();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        variant: "destructive",
        title: "Error logging out",
        description: error.message,
      });
    }
  };
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogoLoad = () => {
    setLogoLoaded(true);
  };

  const handleLogoError = () => {
    console.log('Logo failed to load, using built-in fallback');
    setLogoError(true);
  };

  const closeMenu = () => {
    if (isMenuOpen) {
      setIsMenuOpen(false);
    }
  };

  // Get the right dashboard link and menu items based on user role
  const getDashboardInfo = () => {
    if (isLoading || isLoadingRole || !user) {
      return {
        link: null,
        menuItems: []
      };
    }

    if (role === 'tenant') {
      return {
        link: (
          <Link 
            to="/tenant/dashboard" 
            onClick={closeMenu}
            className={cn(
              "text-white/70 hover:text-primary transition-colors",
              location.pathname === '/tenant/dashboard' && "text-primary font-medium"
            )}
          >
            Dashboard
          </Link>
        ),
        menuItems: [
          { label: "Dashboard", href: "/tenant/dashboard" },
          { label: "My Application", href: "/tenant/application" }
        ]
      };
    } else if (role === 'landlord') {
      return {
        link: (
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger 
                  className={cn(
                    "bg-transparent text-white/70 hover:text-primary hover:bg-transparent p-0",
                    location.pathname.includes('/landlord/') && "text-primary font-medium"
                  )}
                >
                  Dashboard
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[200px] gap-1 p-2 md:w-[300px]">
                    <li className="row-span-1">
                      <NavigationMenuLink asChild>
                        <Link to="/landlord/dashboard" onClick={closeMenu} className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                          <div className="text-sm font-medium leading-none">Dashboard</div>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li className="row-span-1">
                      <NavigationMenuLink asChild>
                        <Link to="/landlord/applications" onClick={closeMenu} className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                          <div className="text-sm font-medium leading-none">Applications</div>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li className="row-span-1">
                      <NavigationMenuLink asChild>
                        <Link to="/landlord/property/new" onClick={closeMenu} className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                          <div className="text-sm font-medium leading-none">Add Property</div>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li className="row-span-1">
                      <NavigationMenuLink asChild>
                        <Link to="/landlord/offers" onClick={closeMenu} className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                          <div className="text-sm font-medium leading-none">Offers</div>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        ),
        menuItems: [
          { label: "Dashboard", href: "/landlord/dashboard" },
          { label: "Applications", href: "/landlord/applications" },
          { label: "Add Property", href: "/landlord/property/new" },
          { label: "Offers", href: "/landlord/offers" }
        ]
      };
    } else if (role === 'admin') {
      return {
        link: (
          <Link 
            to="/admin/dashboard" 
            onClick={closeMenu}
            className={cn(
              "text-white/70 hover:text-primary transition-colors",
              location.pathname === '/admin/dashboard' && "text-primary font-medium"
            )}
          >
            Admin Panel
          </Link>
        ),
        menuItems: [
          { label: "Admin Dashboard", href: "/admin/dashboard" }
        ]
      };
    }
    
    return {
      link: null,
      menuItems: []
    };
  };
  
  const { link: dashboardLink, menuItems } = getDashboardInfo();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-sm border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center space-x-3">
              <div className="relative h-10 w-10 flex items-center justify-center">
                {/* Fallback logo (data URI - always works) */}
                {logoError && (
                  <div className="h-10 w-10 flex items-center justify-center text-primary">
                    <img 
                      src={DATA_URI_LOGO}
                      alt="Doorways Logo"
                      className="h-8 w-8"
                    />
                  </div>
                )}
                
                {/* Main logo (using uploaded SVG) */}
                {!logoError && (
                  <img 
                    src="/lovable-uploads/fcea98fc-fc7e-498e-92eb-f1631063dfdb.png"
                    alt="Doorways Logo"
                    className="h-10 w-10 object-contain rounded-md"
                    onLoad={handleLogoLoad}
                    onError={handleLogoError}
                  />
                )}
              </div>
              <span className="text-2xl font-bold text-primary">Doorways</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link to="/how-it-works" className={cn(
              "text-white/70 hover:text-primary transition-colors",
              location.pathname === '/how-it-works' && "text-primary font-medium"
            )}>
              How It Works
            </Link>
            <Link to="/landlords" className={cn(
              "text-white/70 hover:text-primary transition-colors",
              location.pathname === '/landlords' && "text-primary font-medium"
            )}>
              For Landlords
            </Link>
            <Link to="/tenants" className={cn(
              "text-white/70 hover:text-primary transition-colors",
              location.pathname === '/tenants' && "text-primary font-medium"
            )}>
              For Tenants
            </Link>
            <Link to="/about" className={cn(
              "text-white/70 hover:text-primary transition-colors",
              location.pathname === '/about' && "text-primary font-medium"
            )}>
              About Us
            </Link>
            {dashboardLink}
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <Button variant="outline" onClick={handleLogout} className="border-white/20 text-white hover:bg-white/10">
                Log out
              </Button>
            ) : (
              <>
                <Button variant="outline" asChild className="border-white/20 text-white hover:bg-white/10">
                  <Link to="/auth">Log in</Link>
                </Button>
                <Button asChild className="bg-primary text-background hover:bg-primary/90">
                  <Link to="/auth">Sign up</Link>
                </Button>
              </>
            )}
          </div>
          
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-white/70 hover:text-primary hover:bg-white/10"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="bg-background/95 backdrop-blur-sm px-2 pt-2 pb-3 space-y-1 sm:px-3 border-b border-white/10">
            <Link 
              to="/how-it-works" 
              onClick={closeMenu}
              className="block px-3 py-2 rounded-md text-base font-medium text-white/70 hover:text-primary hover:bg-white/10"
            >
              How It Works
            </Link>
            <Link 
              to="/landlords" 
              onClick={closeMenu}
              className="block px-3 py-2 rounded-md text-base font-medium text-white/70 hover:text-primary hover:bg-white/10"
            >
              For Landlords
            </Link>
            <Link 
              to="/tenants" 
              onClick={closeMenu}
              className="block px-3 py-2 rounded-md text-base font-medium text-white/70 hover:text-primary hover:bg-white/10"
            >
              For Tenants
            </Link>
            <Link 
              to="/about" 
              onClick={closeMenu}
              className="block px-3 py-2 rounded-md text-base font-medium text-white/70 hover:text-primary hover:bg-white/10"
            >
              About Us
            </Link>
            
            {menuItems.length > 0 && (
              <div className="border-t border-white/10 mt-3 pt-3">
                {menuItems.map((item, index) => (
                  <Link 
                    key={index}
                    to={item.href} 
                    onClick={closeMenu}
                    className={cn(
                      "block px-3 py-2 rounded-md text-base font-medium text-white/70 hover:text-primary hover:bg-white/10",
                      location.pathname === item.href && "text-primary bg-white/5"
                    )}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            )}

            <div className="mt-4 flex flex-col space-y-2 px-3">
              {user ? (
                <Button variant="outline" onClick={handleLogout} className="w-full justify-center border-white/20 text-white hover:bg-white/10">
                  Log out
                </Button>
              ) : (
                <>
                  <Button variant="outline" asChild className="w-full justify-center border-white/20 text-white hover:bg-white/10">
                    <Link to="/auth" onClick={closeMenu}>Log in</Link>
                  </Button>
                  <Button asChild className="w-full justify-center bg-primary text-background hover:bg-primary/90">
                    <Link to="/auth" onClick={closeMenu}>Sign up</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
