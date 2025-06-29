import { useAuthContext } from "@/services/auth";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated, isInitializing } = useAuthContext();

  if (isInitializing) {
    return <div>Loading...</div>; // bisa spinner juga
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
