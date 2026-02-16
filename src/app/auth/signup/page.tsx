'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { signIn } from 'next-auth/react'

export default function SignupPage() {
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState('')
  const router = useRouter()

  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('Пароли не совпадают')
      setIsLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError('Пароль должен быть не менее 6 символов')
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Ошибка регистрации')
      }

      await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      })

      router.push('/dashboard')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#030014] text-white font-sans selection:bg-purple-500 selection:text-white">

      {/* ====== AMBIENT BACKGROUND ====== */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-15%] right-[-10%] w-[600px] h-[600px] bg-blue-700/20 rounded-full blur-[160px] animate-[auth-blob-1_20s_ease-in-out_infinite]"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-purple-700/15 rounded-full blur-[140px] animate-[auth-blob-2_24s_ease-in-out_infinite]"></div>
        <div className="absolute top-[30%] left-[10%] w-[400px] h-[400px] bg-violet-700/10 rounded-full blur-[120px] animate-[auth-blob-3_28s_ease-in-out_infinite]"></div>
        <div className="absolute bottom-[30%] right-[15%] w-[350px] h-[350px] bg-indigo-800/10 rounded-full blur-[130px] animate-[auth-blob-4_22s_ease-in-out_infinite]"></div>
      </div>

      {/* ====== FIXED HEADER ====== */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-4 bg-transparent backdrop-blur-[10px] border-b border-white/5">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-white font-bold shadow-lg">Q</div>
          <span className="text-lg font-bold tracking-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">Q-Habit</span>
          </span>
        </Link>
        <Link
          href="/"
          className="text-sm text-gray-400 hover:text-white transition-colors relative group"
        >
          На главную
          <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-white/60 transition-all duration-300 group-hover:w-full"></span>
        </Link>
      </header>

      {/* ====== FORM ====== */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-24">
        <div className="w-full max-w-[420px] animate-[auth-entrance_0.6s_ease-out_both]">
          {/* Card Header */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-white font-bold text-xl mx-auto mb-5 shadow-[0_0_30px_rgba(168,85,247,0.3)]">
              Q
            </div>
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-b from-white to-gray-400 text-transparent bg-clip-text tracking-tight" style={{ letterSpacing: '-0.02em' }}>
              Создайте аккаунт
            </h1>
            <p className="text-gray-500 text-sm mt-2">Начните свой путь к лучшим привычкам</p>
          </div>

          {/* Glassmorphism Card */}
          <div className="rounded-2xl p-8 border border-white/10" style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }}>
            <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
              {/* Name */}
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-2 tracking-wide uppercase">Имя</label>
                <input
                  name="name"
                  placeholder="Как вас зовут?"
                  onChange={handleChange}
                  required
                  className="auth-input w-full h-12 rounded-xl px-4 text-sm text-white placeholder-gray-600 transition-all duration-300 outline-none"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-2 tracking-wide uppercase">Email</label>
                <input
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  onChange={handleChange}
                  required
                  className="auth-input w-full h-12 rounded-xl px-4 text-sm text-white placeholder-gray-600 transition-all duration-300 outline-none"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-2 tracking-wide uppercase">Пароль</label>
                <input
                  name="password"
                  type="password"
                  placeholder="Минимум 6 символов"
                  onChange={handleChange}
                  required
                  className="auth-input w-full h-12 rounded-xl px-4 text-sm text-white placeholder-gray-600 transition-all duration-300 outline-none"
                />
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-2 tracking-wide uppercase">Подтверждение пароля</label>
                <input
                  name="confirmPassword"
                  type="password"
                  placeholder="Повторите пароль"
                  onChange={handleChange}
                  required
                  className="auth-input w-full h-12 rounded-xl px-4 text-sm text-white placeholder-gray-600 transition-all duration-300 outline-none"
                />
              </div>

              {/* Error */}
              {error && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm py-3 px-4 rounded-xl">
                  {error}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                className="w-full h-12 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold text-sm hover:opacity-90 transition-all shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] disabled:opacity-40 disabled:cursor-not-allowed mt-1"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Создание...
                  </span>
                ) : 'Зарегистрироваться'}
              </button>

              {/* Links */}
              <div className="flex justify-center text-sm mt-1 gap-2">
                <span className="text-gray-600">Уже есть аккаунт?</span>
                <Link href="/auth/signin" className="text-purple-400 hover:text-purple-300 transition-colors font-medium">
                  Войти
                </Link>
              </div>
            </form>
          </div>

          {/* Footer */}
          <p className="text-center text-gray-600 text-xs mt-8">
            &copy; {new Date().getFullYear()} Q-Habit. Твой путь к совершенству.
          </p>
        </div>
      </div>
    </div>
  )
}