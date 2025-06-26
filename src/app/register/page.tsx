'use client'

import React, { useState } from 'react'
import styles from './register.module.css'
import { useAuth } from '@/app/context/authContext'

export default function RegisterPage() {
  const { register } = useAuth()

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    gender: '',
    dob: '',
    email: '',
    password: '',
  })

  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'radio' ? value : value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const { name, phone, gender, dob, email, password } = formData

    // Validate các trường bắt buộc
    if (!name || !phone || !gender || !dob || !email || !password) {
      setError('Vui lòng điền đầy đủ tất cả các trường.')
      return
    }

    // Validate email
    const emailRegex = /\S+@\S+\.\S+/
    if (!emailRegex.test(email)) {
      setError('Email không hợp lệ.')
      return
    }

    // Validate số điện thoại
    const phoneRegex = /^[0-9]{9,15}$/
    if (!phoneRegex.test(phone)) {
      setError('Số điện thoại không hợp lệ (từ 9 đến 15 chữ số).')
      return
    }

    // Validate mật khẩu tối thiểu
    if (password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự.')
      return
    }

    // Gọi API đăng ký
    register(formData).catch(() => {
      setError('Đăng ký thất bại. Vui lòng thử lại.')
    })
  }

  return (
    <div className={styles.containerDefault}>
      <article>
        <h1>Tạo tài khoản</h1>
        <h2>____</h2>
      </article>

      <aside>
        <div className={styles.formContainer}>
          <form onSubmit={handleSubmit}>
            {/* Hiển thị lỗi nếu có */}
            {error && <div className={styles.errorMessage}>{error}</div>}

            <div className={styles.formGroup}>
              <input
                type="text"
                name="name"
                placeholder="Nhập tên của bạn"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div className={styles.formGroup}>
              <input
                type="number"
                name="phone"
                placeholder="Nhập số điện thoại"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <div className={styles.formGroup}>
              <label>
                <input
                  type="radio"
                  name="gender"
                  value="nu"
                  checked={formData.gender === 'nu'}
                  onChange={handleChange}
                /> Nữ
                <input
                  type="radio"
                  name="gender"
                  value="nam"
                  checked={formData.gender === 'nam'}
                  onChange={handleChange}
                  style={{ marginLeft: '10px' }}
                /> Nam
              </label>
            </div>

            <div className={styles.formGroup}>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
              />
            </div>

            <div className={styles.formGroup}>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className={styles.formGroup}>
              <input
                type="password"
                name="password"
                placeholder="Mật khẩu"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            {/* Ghi chú bảo mật */}
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

            {/* Nút đăng ký & đăng nhập */}
            <div className={styles.buttonGroup}>
              <button type="submit" className={styles.submitBtn}>
                ĐĂNG KÝ
              </button>
              <a href="/login" className={styles.loginBtn}>
                ĐĂNG NHẬP
              </a>
            </div>

            {/* Link quay lại */}
            <a href="/" className={styles.backLink}>
              <strong style={{ fontSize: '14px', marginRight: '10px' }}>←</strong>
              Quay lại trang chủ
            </a>
          </form>
        </div>
      </aside>
    </div>
  )
}
