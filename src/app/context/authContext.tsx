"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  gender: string;
  dob: string;
}

interface RegisterData {
  name: string;
  phone: string;
  gender: string;
  dob: string;
  email: string;
  password: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface AuthContextType {
  currentUser: User | null;
  register: (data: RegisterData) => Promise<void>;
  login: (data: LoginData) => Promise<void>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const router = useRouter();

  // Load user từ localStorage khi reload trang
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      setCurrentUser(JSON.parse(user));
    }
  }, []);

  const register = async (data: RegisterData) => {
    try {
      const res = await fetch("http://localhost:3000/user/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Đăng ký thất bại");

      alert("Đăng ký thành công!");
      router.push("/login");
    } catch (error: any) {
      alert(error.message);
    }
  };

  const login = async (data: LoginData) => {
    try {
      const res = await fetch("http://localhost:3000/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      if (result.token) {
        localStorage.setItem("token", result.token);
      }
      if (!res.ok) throw new Error(result.error || "Đăng nhập thất bại");

      setCurrentUser(result.user);
      localStorage.setItem("user", JSON.stringify(result.user));

      alert("Đăng nhập thành công!");
      router.push("/");
    } catch (error: any) {
      alert(error.message);
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("user");
    router.push("/login");
  };

  const forgotPassword = async (email: string) => {
    try {
      const res = await fetch("http://localhost:3000/user/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Gửi email thất bại");
      alert("Đã gửi email khôi phục mật khẩu. Vui lòng kiểm tra hộp thư.");
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <AuthContext.Provider
      value={{ currentUser, register, login, logout, forgotPassword }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
