'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useParams } from 'next/navigation'
import styles from '@/app/reset-password/reset.module.css'

export default function ResetPasswordPage() {
  const router = useRouter()
  const { token } = useParams() // lấy token từ URL

  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (newPassword !== confirmPassword) {
      alert('Mật khẩu không khớp')
      return
    }

    try {
      const res = await fetch('http://localhost:3000/user/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword }),
      })

      const result = await res.json()
      if (!res.ok) throw new Error(result.message || 'Lỗi đặt lại mật khẩu')

      alert('Đặt lại mật khẩu thành công!')
      router.push('/login')
    } catch (error: any) {
      alert(error.message)
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
              <div className={styles.formGroup}>
                <input
                  type="password"
                  placeholder="Mật khẩu mới"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <input
                  type="password"
                  placeholder="Xác nhận mật khẩu"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
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
