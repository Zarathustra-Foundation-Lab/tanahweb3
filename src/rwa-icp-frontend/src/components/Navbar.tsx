import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { User, Map } from "lucide-react";
import { useAuthContext } from "@/services/auth";
import { useEffect, useState } from "react";

import { createUserService } from "@/services/UserService";

const Navbar = () => {
  const {
    logout,
    isAuthenticated,
    principal: currentPrincipal,
  } = useAuthContext();

  const location = useLocation();

  const [user, setUser] = useState({
    username: "",
    principal: "",
    first_name: "",
    last_name: "",
  });

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  useEffect(() => {
    (async () => {
      const data = await createUserService().getUserByPrincipal(
        currentPrincipal
      );
      if (data.length > 0) {
        const userData = data[0];
        setUser({
          username: userData.username,
          principal: userData.principal_id.toText(),
          first_name: userData.detail.first_name,
          last_name: userData.detail.last_name,
        });
      }
    })();
  }, [currentPrincipal, createUserService]);

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
              Home
            </Link>

            {/* guard routes */}
            {isAuthenticated && user && (
              <>
                <Link
                  to="/item/create"
                  className={`text-sm font-medium transition-colors hover:text-web3-cyan ${
                    isActive("/item/create")
                      ? "text-web3-cyan"
                      : "text-muted-foreground"
                  }`}
                >
                  Add Item
                </Link>
                <Link
                  to="/profile/collection"
                  className={`text-sm font-medium transition-colors hover:text-web3-cyan ${
                    isActive("/profile/collection")
                      ? "text-web3-cyan"
                      : "text-muted-foreground"
                  }`}
                >
                  My Collection
                </Link>
                <Link
                  to="/sell"
                  className={`text-sm font-medium transition-colors hover:text-web3-cyan ${
                    isActive("/sell")
                      ? "text-web3-cyan"
                      : "text-muted-foreground"
                  }`}
                >
                  Sell Land
                </Link>
              </>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Button
                  className="hidden md:flex"
                  variant="outline"
                  size="sm"
                  asChild
                >
                  <Link
                    to="/profile/demo-user"
                    className="flex items-center space-x-2"
                  >
                    <User className="h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="hover:bg-transparent hover:text-black md:block hidden"
                >
                  {user.principal.slice(0, 8) ?? ""}
                </Button>
                <Button onClick={logout} variant={"destructive"} size="sm">
                  Logout
                </Button>
              </>
            ) : (
              <Link to={"/login"}>
                <Button className="btn-web3" size="sm">
                  Login
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
