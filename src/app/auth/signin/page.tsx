'use client'

import { useState } from 'react'
import { signIn, getSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const signinSchema = z.object({
  email: z.string().email('Некорректный email'),
  password: z.string().min(1, 'Пароль обязателен'),
})

type SigninFormData = z.infer<typeof signinSchema>

export default function SigninPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SigninFormData>()

  const onSubmit = async (data: SigninFormData) => {
    setIsLoading(true)
    setError('')

    try {
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      })

      if (result?.error) {
        setError('Неверный email или пароль')
      } else {
        await getSession()
        router.push('/dashboard')
        router.refresh()
      }
    } catch (error) {
      setError('Произошла ошибка при входе')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#030014] text-white font-sans selection:bg-purple-500 selection:text-white">

      {/* ====== AMBIENT BACKGROUND ====== */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-15%] left-[-10%] w-[600px] h-[600px] bg-purple-700/20 rounded-full blur-[160px] animate-[auth-blob-1_18s_ease-in-out_infinite]"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-blue-700/15 rounded-full blur-[140px] animate-[auth-blob-2_22s_ease-in-out_infinite]"></div>
        <div className="absolute top-[40%] right-[15%] w-[400px] h-[400px] bg-indigo-700/10 rounded-full blur-[120px] animate-[auth-blob-3_26s_ease-in-out_infinite]"></div>
        <div className="absolute bottom-[20%] left-[20%] w-[350px] h-[350px] bg-violet-800/10 rounded-full blur-[130px] animate-[auth-blob-4_20s_ease-in-out_infinite]"></div>
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
              Добро пожаловать
            </h1>
            <p className="text-gray-500 text-sm mt-2">Войдите в свой аккаунт Q-Habit</p>
          </div>

          {/* Glassmorphism Card */}
          <div className="rounded-2xl p-8 border border-white/10" style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }}>
            <form className="flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)}>
              {/* Email */}
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-2 tracking-wide uppercase">Email</label>
                <input
                  {...register('email')}
                  type="email"
                  placeholder="you@example.com"
                  className={`auth-input w-full h-12 rounded-xl px-4 text-sm text-white placeholder-gray-600 transition-all duration-300 outline-none ${errors.email ? 'border-red-500/60' : ''}`}
                />
                {errors.email && (
                  <span className="text-red-400 text-xs mt-1.5 block">{errors.email.message}</span>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-2 tracking-wide uppercase">Пароль</label>
                <input
                  {...register('password')}
                  type="password"
                  placeholder="••••••••"
                  className={`auth-input w-full h-12 rounded-xl px-4 text-sm text-white placeholder-gray-600 transition-all duration-300 outline-none ${errors.password ? 'border-red-500/60' : ''}`}
                />
                {errors.password && (
                  <span className="text-red-400 text-xs mt-1.5 block">{errors.password.message}</span>
                )}
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
                    Вход...
                  </span>
                ) : 'Войти'}
              </button>

              {/* Links */}
              <div className="flex justify-between text-sm mt-1">
                <span className="text-gray-600">Забыли пароль?</span>
                <Link href="/auth/signup" className="text-purple-400 hover:text-purple-300 transition-colors font-medium">
                  Регистрация
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