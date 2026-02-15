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

    // Basic Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Пароли не совпадают')
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#000000] text-gray-200">
      <div className="mb-8 text-center">
        <div className="w-12 h-12 bg-[#1677ff] rounded-md flex items-center justify-center text-white font-bold text-xl mx-auto mb-4 shadow-[0_0_12px_rgba(22,119,255,0.4)]">
          H
        </div>
        <h1 className="text-[24px] font-semibold text-white">Регистрация</h1>
        <p className="text-[#8c8c8c] mt-2">Создайте аккаунт Ant Design</p>
      </div>

      <div className="ant-card w-[380px] p-8 shadow-2xl">
        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>

          <input
            name="name"
            placeholder="Имя пользователя"
            onChange={handleChange}
            className="w-full h-[32px] bg-[#141414] border border-[#424242] rounded-[6px] px-3 text-white placeholder-[#5c5c5c] focus:outline-none focus:border-[#1677ff] transition-colors"
          />

          <input
            name="email"
            type="email"
            placeholder="Email"
            onChange={handleChange}
            className="w-full h-[32px] bg-[#141414] border border-[#424242] rounded-[6px] px-3 text-white placeholder-[#5c5c5c] focus:outline-none focus:border-[#1677ff] transition-colors"
          />

          <input
            name="password"
            type="password"
            placeholder="Пароль"
            onChange={handleChange}
            className="w-full h-[32px] bg-[#141414] border border-[#424242] rounded-[6px] px-3 text-white placeholder-[#5c5c5c] focus:outline-none focus:border-[#1677ff] transition-colors"
          />

          <input
            name="confirmPassword"
            type="password"
            placeholder="Повторите пароль"
            onChange={handleChange}
            className="w-full h-[32px] bg-[#141414] border border-[#424242] rounded-[6px] px-3 text-white placeholder-[#5c5c5c] focus:outline-none focus:border-[#1677ff] transition-colors"
          />

          {error && (
            <div className="bg-[#dc4446]/10 border border-[#dc4446] text-[#dc4446] text-sm py-2 px-3 rounded-[6px]">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="ant-btn ant-btn-primary w-full h-[32px] mt-2"
            disabled={isLoading}
          >
            {isLoading ? 'Загрузка...' : 'Зарегистрироваться'}
          </button>

          <div className="flex justify-center text-sm mt-4">
            <span className="text-[#5c5c5c] mr-2">Уже есть аккаунт?</span>
            <Link href="/auth/signin" className="text-[#1677ff] hover:text-[#4096ff]">Войти</Link>
          </div>
        </form>
      </div>
    </div>
  )
}