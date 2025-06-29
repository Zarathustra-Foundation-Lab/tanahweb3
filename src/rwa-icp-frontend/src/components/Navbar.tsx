import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { User, Map } from "lucide-react";
import { useAuthContext } from "@/services/auth";

const Navbar = () => {
  const { login, logout, isAuthenticated, isInitializing, principal } =
    useAuthContext();

  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center space-x-2">
            <Map className="h-8 w-8 text-web3-cyan" />
            <span className="text-2xl font-bold web3-gradient font-mono">
              LandChain
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors hover:text-web3-cyan ${
                isActive("/") ? "text-web3-cyan" : "text-muted-foreground"
              }`}
            >
              Marketplace
            </Link>
            <Link
              to="/sell"
              className={`text-sm font-medium transition-colors hover:text-web3-cyan ${
                isActive("/sell") ? "text-web3-cyan" : "text-muted-foreground"
              }`}
            >
              Sell Land
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Button variant="outline" size="sm" asChild>
                  <Link
                    to="/profile/demo-user"
                    className="flex items-center space-x-2"
                  >
                    <User className="h-4 w-4" />
                    <span className="hidden sm:block">Profile</span>
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="hover:bg-transparent hover:text-black"
                >
                  {principal.slice(0, 9)}
                </Button>
                <Button onClick={logout} variant={"destructive"} size="sm">
                  Logout
                </Button>
              </>
            ) : (
              <Button onClick={login} className="btn-web3" size="sm">
                Login
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
