/* eslint-disable react/prop-types */
import { createContext, useContext, useEffect, useState } from "react";
import fetcher from "../helpers/fetcher";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); // Track loading status

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        await fetcher("/auth/check");
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Error checking auth status:", error);
        setIsAuthenticated(false);
      } finally {
        setLoading(false); // Set loading to false after check completes
      }
    };
    checkAuthStatus();
  }, []);

  // If authenticated, render children
  return (
    <AuthContext.Provider
      value={{ isAuthenticated, loading, setIsAuthenticated }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Hook to use the AuthContext in other components
export function useAuth() {
  return useContext(AuthContext);
}
