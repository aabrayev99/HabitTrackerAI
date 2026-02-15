'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Lock, Bot, MessageCircle } from 'lucide-react'

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

export default function ChatPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [conversationId, setConversationId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return

    const userMessage: Message = {
      role: 'user',
      content: inputMessage.trim(),
      timestamp: new Date().toISOString(),
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage.content,
          conversationId,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        const aiMessage: Message = {
          role: 'assistant',
          content: data.message,
          timestamp: new Date().toISOString(),
        }

        setMessages(prev => [...prev, aiMessage])

        if (data.conversationId && !conversationId) {
          setConversationId(data.conversationId)
        }
      } else {
        const errorData = await response.json()
        const errorMessage: Message = {
          role: 'assistant',
          content: errorData.message || 'Произошла ошибка при обращении к ИИ-консультанту',
          timestamp: new Date().toISOString(),
        }
        setMessages(prev => [...prev, errorMessage])
      }
    } catch (error) {
      const errorMessage: Message = {
        role: 'assistant',
        content: 'Не удалось связаться с ИИ-консультантом. Проверьте подключение к интернету.',
        timestamp: new Date().toISOString(),
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const startNewConversation = () => {
    setMessages([])
    setConversationId(null)
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#030014]">
        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#030014] p-6">
        <div className="rounded-2xl bg-[#0a0a0a] border border-white/10 p-8 text-center max-w-md">
          <div className="flex justify-center mb-4"><Lock className="w-10 h-10 text-gray-500" strokeWidth={1.5} /></div>
          <h2 className="text-xl font-semibold text-white mb-2">Требуется вход</h2>
          <p className="text-gray-400 mb-6 text-sm">Пожалуйста, войдите, чтобы общаться с ИИ-консультантом.</p>
          <Link href="/auth/signin" className="inline-block bg-purple-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-purple-700 transition-colors">
            Войти
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#030014] flex flex-col font-sans selection:bg-purple-500 selection:text-white">

      {/* Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 right-[-10%] w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-0 left-[-5%] w-[300px] h-[300px] bg-blue-600/10 rounded-full blur-[100px]"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-white/5 bg-[#030014]/80 backdrop-blur-md">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard"
                className="text-gray-400 hover:text-white transition-colors text-sm flex items-center gap-1"
              >
                <span>←</span> Дашборд
              </Link>
              <div className="h-4 w-px bg-white/10"></div>
              <h1 className="text-lg font-semibold text-white flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-[0_0_12px_rgba(168,85,247,0.4)]"><Bot className="w-4 h-4 text-white" strokeWidth={1.5} /></span>
                AI Консультант
              </h1>
            </div>
            <button
              onClick={startNewConversation}
              className="text-sm text-gray-400 hover:text-white px-4 py-1.5 rounded-lg border border-white/10 hover:border-white/20 transition-colors hover:bg-white/5"
            >
              + Новый диалог
            </button>
          </div>
        </div>
      </header>

      {/* Chat Container */}
      <div className="relative z-10 flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 flex flex-col">
        <div className="flex-1 rounded-2xl border border-white/5 bg-[#0a0a0a]/70 backdrop-blur-sm flex flex-col overflow-hidden">

          {/* Welcome */}
          {messages.length === 0 && (
            <div className="flex-1 flex items-center justify-center p-8">
              <div className="text-center max-w-md">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-3xl mx-auto mb-6 shadow-[0_0_30px_rgba(168,85,247,0.3)]">
                  <Bot className="w-8 h-8 text-white" strokeWidth={1.5} />
                </div>
                <h2 className="text-2xl font-bold text-white mb-3">
                  Привет! Я ваш AI-консультант
                </h2>
                <p className="text-gray-400 mb-8 text-sm leading-relaxed">
                  Я помогу вам формировать полезные привычки, дам персональные советы
                  и буду мотивировать на пути к вашим целям.
                </p>
                <div className="space-y-2 text-left">
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-3">Примеры вопросов:</p>
                  {[
                    "Как лучше начать заниматься спортом?",
                    "Мне тяжело просыпаться рано, что делать?",
                    "Какие привычки помогут стать продуктивнее?"
                  ].map((q, i) => (
                    <button
                      key={i}
                      onClick={() => { setInputMessage(q) }}
                      className="w-full text-left text-sm text-gray-300 p-3 rounded-xl bg-white/5 border border-white/5 hover:border-purple-500/30 hover:bg-white/10 transition-colors cursor-pointer"
                    >
                      <span className="inline-flex items-center gap-1.5"><MessageCircle className="w-3.5 h-3.5 text-purple-400 shrink-0" strokeWidth={1.5} /> {q}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Messages */}
          {messages.length > 0 && (
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex gap-3 max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    {/* Avatar */}
                    <div className={`w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center text-xs font-bold
                        ${message.role === 'user'
                        ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white'
                        : 'bg-gradient-to-br from-blue-500 to-cyan-500 text-white'
                      }`}>
                      {message.role === 'user' ? session.user?.name?.[0] || 'U' : 'AI'}
                    </div>

                    <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed
                        ${message.role === 'user'
                        ? 'bg-purple-600 text-white rounded-br-md'
                        : 'bg-white/5 text-gray-200 border border-white/5 rounded-bl-md'
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{message.content}</p>
                      <p className={`text-xs mt-2 ${message.role === 'user' ? 'text-purple-200' : 'text-gray-500'}`}>
                        {new Date(message.timestamp).toLocaleTimeString('ru-RU', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-xs text-white font-bold flex-shrink-0">AI</div>
                    <div className="bg-white/5 border border-white/5 rounded-2xl rounded-bl-md px-4 py-3">
                      <div className="flex items-center space-x-1.5">
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}

          {/* Input */}
          <div className="border-t border-white/5 p-4 bg-[#050505]/50">
            <div className="flex gap-3 items-end">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Напишите ваш вопрос..."
                rows={1}
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500/50 resize-none placeholder-gray-500 transition-colors"
                disabled={isLoading}
              />
              <button
                onClick={sendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className="px-5 py-3 bg-purple-600 text-white rounded-xl font-medium text-sm hover:bg-purple-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-[0_0_15px_rgba(168,85,247,0.3)] hover:shadow-[0_0_20px_rgba(168,85,247,0.5)] flex items-center gap-2"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <span>Отправить</span>
                )}
              </button>
            </div>
            <p className="text-[11px] text-gray-600 mt-2 pl-1">
              Enter — отправить, Shift+Enter — новая строка
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
