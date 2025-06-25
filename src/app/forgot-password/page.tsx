'use client'

import React, { useState } from 'react'
import styles from './forgot.module.css'
import { useAuth } from '../context/authContext'

export default function ForgotPasswordPage() {
  const { forgotPassword } = useAuth()
  const [email, setEmail] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return alert('Vui lòng nhập email')
    await forgotPassword(email)
  }

  return (
    <div className="main-content">
      <div className={styles.containerDefault}>
        <article>
          <h1>Quên mật khẩu</h1>
          <h2>____</h2>
        </article>

        <aside>
          <div className={styles.formContainer}>
            <form onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <h2>Nhập email để khôi phục mật khẩu</h2>
              </div>

              <div className={styles.formGroup}>
                <input
                  type="email"
                  placeholder="Nhập email của bạn"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <p className={styles.note}>
                This site is protected by reCAPTCHA and the Google{' '}
                <a
                  href="https://policies.google.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Privacy Policy
                </a>{' '}
                and{' '}
                <a
                  href="https://policies.google.com/terms"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Terms of Service
                </a>{' '}
                apply.
              </p>

              <button type="submit" className={styles.submitBtn}>
                Gửi liên kết khôi phục
              </button>

              <a href="/" className={styles.backLink}>
                <strong style={{ fontSize: '14px', marginRight: '10px' }}>←</strong>
                Quay lại trang chủ
              </a>
            </form>
          </div>
        </aside>
      </div>
    </div>
  )
}
