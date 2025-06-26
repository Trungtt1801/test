"use client";

import React, { useState } from "react";
import styles from "./login.module.css";
import { useAuth } from "../context/authContext";

export default function LoginPage() {
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState(""); 

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // reset lỗi cũ

    const { email, password } = formData;

    if (!email || !password) {
      setError("Vui lòng nhập đầy đủ email và mật khẩu.");
      return;
    }

    // Kiểm tra định dạng email cơ bản
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      setError("Email không hợp lệ.");
      return;
    }

    // Gọi login từ context
    login(formData).catch(() => {
      setError("Sai email hoặc mật khẩu.");
    });
  };

  return (
    <div className="main-content">
      <div className={styles.containerDefault}>
        <article>
          <h1>Đăng nhập</h1>
          <h2>____</h2>
        </article>

        <aside>
          <div className={styles.formContainer}>
            <form onSubmit={handleSubmit}>
              {/* ⚠️ Hiển thị lỗi nếu có */}
              {error && <div className={styles.errorMessage}>{error}</div>}

              <div className={styles.formGroup}>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Mật khẩu"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Ghi chú bảo mật */}
              <p className={styles.note}>
                This site is protected by reCAPTCHA and the Google{" "}
                <a
                  href="https://policies.google.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Privacy Policy
                </a>{" "}
                and{" "}
                <a
                  href="https://policies.google.com/terms"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Terms of Service
                </a>{" "}
                apply.
              </p>

              <button type="submit" className={styles.submitBtn}>
                ĐĂNG NHẬP
              </button>

              <div className={styles.socialLoginContainer}>
                <button
                  type="button"
                  className={`${styles.socialButton} ${styles.googleButton}`}
                >
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/1024px-Google_%22G%22_logo.svg.png"
                    alt="Google"
                  />
                  Đăng nhập bằng Google
                </button>
                <button
                  type="button"
                  className={`${styles.socialButton} ${styles.facebookButton}`}
                >
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/0/05/Facebook_Logo_%282019%29.png"
                    alt="Facebook"
                  />
                  Đăng nhập bằng Facebook
                </button>
              </div>

              <div
                style={{ marginTop: "10px", fontSize: "12px", color: "#333" }}
              >
                <a
                  href="/forgot-password"
                  style={{
                    marginRight: "6px",
                    textDecoration: "none",
                    color: "black",
                  }}
                >
                  Quên mật khẩu?
                </a>
                <span style={{ color: "#939090" }}>hoặc</span>
                <a
                  href="/register"
                  style={{
                    marginLeft: "6px",
                    textDecoration: "none",
                    color: "black",
                  }}
                >
                  đăng ký
                </a>
              </div>

              <a href="/" className={styles.backLink}>
                <strong style={{ fontSize: "14px", marginRight: "10px" }}>
                  ←
                </strong>
                Quay lại trang chủ
              </a>
            </form>
          </div>
        </aside>
      </div>
    </div>
  );
}
