"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";

// Kiểu dữ liệu người dùng
export interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  gender: string;
  dob: string;
}

// Dữ liệu đăng ký
export interface RegisterData {
  name: string;
  phone: string;
  gender: string;
  dob: string;
  email: string;
  password: string;
}

// Dữ liệu đăng nhập
export interface LoginData {
  email: string;
  password: string;
}

// Dữ liệu phản hồi từ API
interface LoginResponse {
  token: string;
  user: User;
}

interface ErrorResponse {
  error: string;
}

interface AuthContextType {
  currentUser: User | null;
  register: (data: RegisterData) => Promise<void>;
  login: (data: LoginData) => Promise<void>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const router = useRouter();

  // Load user từ localStorage khi reload trang
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      setCurrentUser(JSON.parse(user));
    }
  }, []);

  // Đăng ký người dùng
  const register = async (data: RegisterData): Promise<void> => {
    try {
      const res = await fetch("http://localhost:3000/user/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result: ErrorResponse = await res.json();
      if (!res.ok) throw new Error(result.error || "Đăng ký thất bại");

      alert("Đăng ký thành công!");
      router.push("/login");
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("Đã xảy ra lỗi không xác định.");
      }
    }
  };

  // Đăng nhập người dùng
  const login = async (data: LoginData): Promise<void> => {
    try {
      const res = await fetch("http://localhost:3000/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result: LoginResponse & Partial<ErrorResponse> = await res.json();

      if (!res.ok) throw new Error(result.error || "Đăng nhập thất bại");

      if (result.token) {
        localStorage.setItem("token", result.token);
      }

      setCurrentUser(result.user);
      localStorage.setItem("user", JSON.stringify(result.user));

      alert("Đăng nhập thành công!");
      router.push("/");
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("Đã xảy ra lỗi không xác định.");
      }
    }
  };

  // Đăng xuất
  const logout = (): void => {
    setCurrentUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    router.push("/login");
  };

  // Quên mật khẩu
  const forgotPassword = async (email: string): Promise<void> => {
    try {
      const res = await fetch("http://localhost:3000/user/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const result: ErrorResponse = await res.json();
      if (!res.ok) throw new Error(result.error || "Gửi email thất bại");

      alert("Đã gửi email khôi phục mật khẩu. Vui lòng kiểm tra hộp thư.");
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("Đã xảy ra lỗi không xác định.");
      }
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

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
