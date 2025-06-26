'use client'

import { useState, FormEvent } from 'react'
import { useRouter, useParams } from 'next/navigation'
import styles from '@/app/reset-password/reset.module.css'

export default function ResetPasswordPage() {
  const router = useRouter()
  const params = useParams()
  const token = typeof params.token === 'string' ? params.token : ''

  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const validatePasswordStrength = (password: string): boolean => {
    // Tối thiểu 8 ký tự, ít nhất 1 số, 1 chữ thường, 1 chữ in hoa, 1 ký tự đặc biệt
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/
    return regex.test(password)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!token) {
      setError('Liên kết đặt lại mật khẩu không hợp lệ.')
      return
    }

    if (!newPassword || !confirmPassword) {
      setError('Vui lòng nhập đầy đủ mật khẩu.')
      return
    }
      if (newPassword.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự.')
      return
    }
    if (newPassword !== confirmPassword) {
      setError('Mật khẩu không khớp.')
      return
    }

    if (!validatePasswordStrength(newPassword)) {
      setError(
        'Mật khẩu phải từ 8 ký tự trở lên, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt.'
      )
      return
    }

    try {
      const res = await fetch('http://localhost:3000/user/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword }),
      })

      const result: { message?: string; error?: string } = await res.json()

      if (!res.ok) {
        throw new Error(result.error || result.message || 'Lỗi đặt lại mật khẩu')
      }

      setSuccess('Đặt lại mật khẩu thành công! Chuyển hướng sau vài giây...')
      setTimeout(() => router.push('/login'), 2000)
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Đã xảy ra lỗi không xác định.')
      }
    }
  }

  return (
    <div className="main-content">
      <div className={styles.containerDefault}>
        <article>
          <h1>Đặt lại mật khẩu</h1>
          <h2>____</h2>
        </article>

        <aside>
          <div className={styles.formContainer}>
            <form onSubmit={handleSubmit}>
              {error && <div className={styles.errorMessage}>{error}</div>}
              {success && <div className={styles.successMessage}>{success}</div>}

              {/* Mật khẩu mới */}
              <div className={`${styles.formGroup} ${styles.inputWrapper}`}>
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  placeholder="Mật khẩu mới"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(prev => !prev)}
                  className={styles.eyeBtn}
                >
                  {showNewPassword ? '🙈' : '👁️'}
                </button>
              </div>

              {/* Xác nhận mật khẩu */}
              <div className={`${styles.formGroup} ${styles.inputWrapper}`}>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Xác nhận mật khẩu"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(prev => !prev)}
                  className={styles.eyeBtn}
                >
                  {showConfirmPassword ? '🙈' : '👁️'}
                </button>
              </div>

              <button type="submit" className={styles.submitBtn}>
                Đặt lại mật khẩu
              </button>
            </form>
          </div>
        </aside>
      </div>
    </div>
  )
}
