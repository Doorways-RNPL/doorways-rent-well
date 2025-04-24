
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

// Fallback placeholder images
const PLACEHOLDER_IMAGES = [
  "https://via.placeholder.com/40",
  "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b/40x40",
  "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d/40x40"
];

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [logoSrc, setLogoSrc] = useState("https://lovable-uploads.s3.amazonaws.com/53350b8e-5dd6-415e-9124-93bf1de175ff.png");

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogoError = () => {
    // Cycle through placeholder images if logo fails to load
    const currentIndex = PLACEHOLDER_IMAGES.indexOf(logoSrc);
    const nextIndex = (currentIndex + 1) % PLACEHOLDER_IMAGES.length;
    setLogoSrc(PLACEHOLDER_IMAGES[nextIndex]);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-sm border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center space-x-3">
              <img 
                src={logoSrc} 
                alt="Doorways Logo" 
                className="h-10 w-10 object-contain"
                onError={handleLogoError}
              />
              <span className="text-2xl font-bold text-primary">Doorways</span>
            </Link>
          </div>
          
          
          
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/how-it-works" className="text-white/70 hover:text-primary transition-colors">How It Works</Link>
            <Link to="/landlords" className="text-white/70 hover:text-primary transition-colors">For Landlords</Link>
            <Link to="/tenants" className="text-white/70 hover:text-primary transition-colors">For Tenants</Link>
            <Link to="/about" className="text-white/70 hover:text-primary transition-colors">About Us</Link>
          </div>
          
          
          
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="outline" asChild className="border-white/20 text-white hover:bg-white/10">
              <Link to="/login">Log in</Link>
            </Button>
            <Button asChild className="bg-primary text-background hover:bg-primary/90">
              <Link to="/signup">Sign up</Link>
            </Button>
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
            <Link to="/how-it-works" className="block px-3 py-2 rounded-md text-base font-medium text-white/70 hover:text-primary hover:bg-white/10">
              How It Works
            </Link>
            <Link to="/landlords" className="block px-3 py-2 rounded-md text-base font-medium text-white/70 hover:text-primary hover:bg-white/10">
              For Landlords
            </Link>
            <Link to="/tenants" className="block px-3 py-2 rounded-md text-base font-medium text-white/70 hover:text-primary hover:bg-white/10">
              For Tenants
            </Link>
            <Link to="/about" className="block px-3 py-2 rounded-md text-base font-medium text-white/70 hover:text-primary hover:bg-white/10">
              About Us
            </Link>
            <div className="mt-4 flex flex-col space-y-2 px-3">
              <Button variant="outline" asChild className="w-full justify-center border-white/20 text-white hover:bg-white/10">
                <Link to="/login">Log in</Link>
              </Button>
              <Button asChild className="w-full justify-center bg-primary text-background hover:bg-primary/90">
                <Link to="/signup">Sign up</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
