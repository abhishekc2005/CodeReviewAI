import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";

export interface User {
  id: string;
  name: string;
  email?: string;
  mobile?: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (identifier: string, password: string) => Promise<any>;
  signup: (name: string, email: string, mobile: string, password: string) => Promise<any>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

const API_URL = import.meta.env.VITE_API_URL;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check auth state on app startup
  useEffect(() => {
    refreshUser();
  }, []);

  async function refreshUser() {
    try {
      const response = await axios.get(`${API_URL}/api/auth/me`, {
        withCredentials: true,
      });
      if (response.data?.success) {
        setUser(response.data.user);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  async function login(identifier: string, password: string) {
    const response = await axios.post(
      `${API_URL}/api/auth/login`,
      { identifier, password },
      { withCredentials: true }
    );
    if (response.data?.success) {
      setUser(response.data.user);
    }
    return response.data;
  }

  async function signup(name: string, email: string, mobile: string, password: string) {
    const response = await axios.post(
      `${API_URL}/api/auth/signup`,
      { name, email, mobile, password },
      { withCredentials: true }
    );
    if (response.data?.success) {
      setUser(response.data.user);
    }
    return response.data;
  }

  async function logout() {
    try {
      await axios.post(
        `${API_URL}/api/auth/logout`,
        {},
        { withCredentials: true }
      );
    } catch {
      // Logout should work even if request fails
    }
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{ user, loading, login, signup, logout, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
