'use client'

import { useSession } from 'next-auth/react'
import { useState } from 'react'
import NextLink from 'next/link'
import { Button, Textarea, Card, CardBody, Spinner, Link } from "@heroui/react"

export default function InlineChat() {
  const { data: session, status } = useSession()
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [answer, setAnswer] = useState<string | null>(null)
  const [conversationId, setConversationId] = useState<string | null>(null)

  const send = async () => {
    if (!input.trim() || loading) return
    setLoading(true)
    setAnswer(null)
    try {
      const body: any = { message: input.trim() }
      if (conversationId) body.conversationId = conversationId

      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.message || 'Ошибка')
      setAnswer(data.message)
      if (data.conversationId) setConversationId(data.conversationId)
      setInput('')
    } catch (e: any) {
      setAnswer(e.message || 'Извините, не удалось получить ответ')
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading') {
    return <div className="flex justify-center p-4"><Spinner label="Загрузка..." /></div>
  }

  if (!session) {
    return (
      <div className="text-center py-6">
        <p className="text-default-700 mb-4 text-lg">Войдите, чтобы пообщаться с ИИ-консультантом.</p>
        <Button
          as={NextLink}
          href="/auth/signin"
          color="primary"
          variant="shadow"
        >
          Войти
        </Button>
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="flex flex-col gap-4">
        <Textarea
          value={input}
          onValueChange={setInput}
          label="ИИ-Консультант"
          placeholder="Задайте вопрос про привычки..."
          variant="bordered"
          minRows={2}
          maxRows={4}
          isDisabled={loading}
          className="w-full"
          endContent={
            <div className="flex items-center h-full pb-2">
              <Button
                isIconOnly
                color="primary"
                aria-label="Send"
                onClick={send}
                isLoading={loading}
                isDisabled={!input.trim()}
                size="sm"
                className="bg-primary/90"
              >
                {!loading && (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2.01 21L23 12L2.01 3L2 10L17 12L2 14L2.01 21Z" fill="currentColor" />
                  </svg>
                )}
              </Button>
            </div>
          }
        />

        {answer && (
          <Card className="bg-default-50 border-default-200 border-1 shadow-sm">
            <CardBody>
              <p className="text-default-700 whitespace-pre-wrap">{answer}</p>
            </CardBody>
          </Card>
        )}
      </div>
    </div>
  )
}
