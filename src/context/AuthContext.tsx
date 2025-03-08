import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../services/api';
import axios from "axios";

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const { data } = await auth.getCurrentUser();
        setUser(data.user);
      }
    } catch (error) {
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    const { data } = await auth.login(email, password);
    localStorage.setItem('token', data.token);
    setUser(data.user);
  };

  const signUp = async (name: string, email: string, password: string) => {
    console.log("Sending signup request with:", { name, email, password }); // Debugging
  
    try {
      const { data } = await auth.signup(name, email, password);
      console.log("Signup response:", data);
      localStorage.setItem("token", data.token);
      setUser(data.user);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Signup error:", error.message);
      }
      // If using Axios, you can also handle AxiosError explicitly:
      if (axios.isAxiosError(error)) {
        console.error("Axios error:", error.response?.data || error.message);
      }
    }
  };
  
  
  const signOut = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}