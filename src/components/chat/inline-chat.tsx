'use client'

import React from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'

export default function InlineChat() {
  const { data: session, status } = useSession()
  const [input, setInput] = React.useState('')
  const [loading, setLoading] = React.useState(false)
  const [answer, setAnswer] = React.useState<string | null>(null)

  // Hard/motivaitonal welcome message
  React.useEffect(() => {
    if (!answer && !session) {
      setAnswer("ЧТО ТЕБЕ МЕШАЕТ НАЧАТЬ ПРЯМО СЕЙЧАС? СКАЖИ МНЕ.")
    }
  }, [])

  const send = async () => {
    if (!input.trim() || loading) return
    setLoading(true)
    setAnswer(null)
    try {
      const body: any = { message: input.trim() }
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.message || 'СЛАБАК. ОШИБКА.')
      setAnswer(data.message)
      setInput('')
    } catch (e: any) {
      setAnswer(e.message || 'СВЯЗЬ ПОТЕРЯНА. ИДИ ТРЕНИРУЙСЯ.')
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading') {
    return <div className="text-center font-black animate-pulse text-primary tracking-widest">ЗАГРУЗКА МЫШЦ...</div>
  }

  if (!session) {
    return (
      <div className="w-full text-center py-6">
        <h3 className="text-3xl font-black mb-4 uppercase text-primary tracking-tighter">
          {answer}
        </h3>
        <p className="mb-6 font-bold uppercase tracking-wide opacity-70">
          Войди в систему, чтобы получить программу тренировок.
        </p>
        <Link
          href="/auth/signin"
          className="btn btn-outline btn-lg font-black tracking-widest uppercase hover:bg-primary hover:text-black hover:border-transparent transition-all"
        >
          ВОЙТИ В ЗАЛ
        </Link>
      </div>
    )
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="flex flex-col gap-6">
        <div className="chat chat-start">
          <div className="chat-image avatar place-items-center bg-primary text-black font-black rounded-full w-12 h-12 text-xl border-2 border-black">
            AI
          </div>
          <div className="chat-bubble chat-bubble-primary font-bold text-lg text-black uppercase tracking-tight shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)]">
            {answer || "ЖДУ КОМАНДЫ. ЧТО ДЕЛАЕМ СЕГОДНЯ?"}
          </div>
        </div>

        <div className="join w-full shadow-xl">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            className="input input-bordered join-item w-full bg-base-100 font-bold uppercase tracking-wide focus:outline-none focus:border-primary border-2"
            placeholder="ВВЕДИ ВОПРОС..."
          />
          <button
            onClick={send}
            disabled={!input.trim() || loading}
            className="btn btn-primary join-item font-black tracking-widest border-l-0"
          >
            {loading ? '...' : 'ОТПРАВИТЬ'}
          </button>
        </div>
      </div>
    </div>
  )
}
