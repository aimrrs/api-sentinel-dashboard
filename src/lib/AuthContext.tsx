"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { loginUser as apiLoginUser } from '@/lib/api';

// Define the shape of the context
interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void; // <-- ADD a logout function
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create the Provider component
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get('access_token');
    if (token) {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const data = await apiLoginUser(email, password);
    if (data.access_token) {
      Cookies.set("access_token", data.access_token, {
        secure: process.env.NODE_ENV === 'production',
        sameSite: "strict",
      });
      setIsAuthenticated(true);
      router.push("/dashboard");
    }
  };

  // --- THE NEW LOGOUT FUNCTION ---
  const logout = () => {
    // 1. Remove the cookie from the browser
    Cookies.remove("access_token");
    // 2. Update the application's global state
    setIsAuthenticated(false);
    // 3. Redirect the user to the login page
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Create a custom hook to easily use the context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

