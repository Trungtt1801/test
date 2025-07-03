"use client";

import React, { useState, useEffect } from "react";
import styles from "./login.module.css";
import { useAuth } from "../context/authContext";
import { GoogleLogin } from "@react-oauth/google";

export default function LoginPage() {
  const { login, loginWithGoogle } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  // Load Facebook SDK
  useEffect(() => {
    if (typeof window !== "undefined" && !window.FB) {
      window.fbAsyncInit = function () {
        window.FB.init({
          appId: "736997475486550", 
          cookie: true,
          xfbml: true,
          version: "v18.0",
        });
      };

      const script = document.createElement("script");
      script.src = "https://connect.facebook.net/en_US/sdk.js";
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const { email, password } = formData;

    if (!email || !password) {
      setError("Vui lòng nhập đầy đủ email và mật khẩu.");
      return;
    }

    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      setError("Email không hợp lệ.");
      return;
    }

    login(formData).catch(() => {
      setError("Sai email hoặc mật khẩu.");
    });
  };

  const handleGoogleLogin = async (credentialResponse: any) => {
    try {
      const token = credentialResponse.credential;
      if (!token) return;

      await loginWithGoogle(token);
    } catch (err) {
      console.error("Google login error:", err);
      setError("Đăng nhập Google thất bại.");
    }
  };

  const handleFacebookLogin = () => {
    if (!window.FB) return;

    window.FB.login(
      function (response: any) {
        if (response.authResponse) {
          const accessToken = response.authResponse.accessToken;
          // Gửi accessToken tới backend của bạn tại /user/login-facebook
          fetch("http://localhost:3000/user/login-facebook", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token: accessToken }),
          })
            .then((res) => res.json())
            .then((result) => {
              if (result.token) {
                localStorage.setItem("token", result.token);
                localStorage.setItem("user", JSON.stringify(result.user));
                alert("Đăng nhập Facebook thành công!");
                window.location.href = "/";
              } else {
                throw new Error("Đăng nhập Facebook thất bại");
              }
            })
            .catch((err) => {
              console.error("Facebook login error:", err);
              setError("Đăng nhập Facebook thất bại.");
            });
        } else {
          setError("Đăng nhập Facebook bị huỷ hoặc thất bại.");
        }
      },
      { scope: "email,public_profile" }
    );
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
                <div className={styles.googleButton}>
                  <GoogleLogin
                    onSuccess={handleGoogleLogin}
                    onError={() => {
                      setError("Đăng nhập Google thất bại.");
                    }}
                  />
                </div>

                <button
                  type="button"
                  className={`${styles.socialButton} ${styles.facebookButton}`}
                  onClick={handleFacebookLogin}
                >
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/0/05/Facebook_Logo_%282019%29.png"
                    alt="Facebook"
                  />
                  Đăng nhập bằng Facebook
                </button>
              </div>

              <div style={{ marginTop: "10px", fontSize: "12px", color: "#333" }}>
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
                <strong style={{ fontSize: "14px", marginRight: "10px" }}>←</strong>
                Quay lại trang chủ
              </a>
            </form>
          </div>
        </aside>
      </div>
    </div>
  );
}
