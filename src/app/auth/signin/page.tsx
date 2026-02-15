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
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#000000] text-gray-200">
      <div className="mb-8 text-center">
        <div className="w-12 h-12 bg-[#1677ff] rounded-md flex items-center justify-center text-white font-bold text-xl mx-auto mb-4 shadow-[0_0_12px_rgba(22,119,255,0.4)]">
          H
        </div>
        <h1 className="text-[24px] font-semibold text-white">Ant Design Habit Tracker</h1>
        <p className="text-[#8c8c8c] mt-2">Вход в систему</p>
      </div>

      <div className="ant-card w-[380px] p-8 shadow-2xl">
        <form className="flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <input
              {...register('email')}
              type="email"
              placeholder="Email"
              className={`w-full h-[32px] bg-[#141414] border ${errors.email ? 'border-[#dc4446]' : 'border-[#424242]'} rounded-[6px] px-3 text-white placeholder-[#5c5c5c] focus:outline-none focus:border-[#1677ff] transition-colors`}
            />
            {errors.email && (
              <span className="text-[#dc4446] text-xs mt-1 block">{errors.email.message}</span>
            )}
          </div>

          <div>
            <input
              {...register('password')}
              type="password"
              placeholder="Пароль"
              className={`w-full h-[32px] bg-[#141414] border ${errors.password ? 'border-[#dc4446]' : 'border-[#424242]'} rounded-[6px] px-3 text-white placeholder-[#5c5c5c] focus:outline-none focus:border-[#1677ff] transition-colors`}
            />
            {errors.password && (
              <span className="text-[#dc4446] text-xs mt-1 block">{errors.password.message}</span>
            )}
          </div>

          {error && (
            <div className="bg-[#dc4446]/10 border border-[#dc4446] text-[#dc4446] text-sm py-2 px-3 rounded-[6px]">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="ant-btn ant-btn-primary w-full h-[32px]"
            disabled={isLoading}
          >
            {isLoading ? 'Загрузка...' : 'Войти'}
          </button>

          <div className="flex justify-between text-sm mt-2">
            <span className="text-[#5c5c5c]">Забыли пароль?</span>
            <Link href="/auth/signup" className="text-[#1677ff] hover:text-[#4096ff]">Зарегистрироваться</Link>
          </div>
        </form>
      </div>

      <footer className="mt-12 text-[#5c5c5c] text-xs">
        Powered by Ant Design Pro
      </footer>
    </div>
  )
}