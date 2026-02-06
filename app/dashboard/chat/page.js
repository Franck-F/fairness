'use client'

import { useState, useRef, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import { DashboardShell } from '@/components/dashboard/shell'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { MessageSquare, Send, Bot, User, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { useAuth } from '@/lib/auth-context'

// Custom components for markdown rendering
const MarkdownComponents = {
  p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
  h1: ({ children }) => <h1 className="text-xl font-bold mb-2 mt-3">{children}</h1>,
  h2: ({ children }) => <h2 className="text-lg font-bold mb-2 mt-3">{children}</h2>,
  h3: ({ children }) => <h3 className="text-md font-bold mb-2 mt-2">{children}</h3>,
  ul: ({ children }) => <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>,
  ol: ({ children }) => <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>,
  li: ({ children }) => <li className="ml-2">{children}</li>,
  code: ({ inline, children }) => 
    inline ? (
      <code className="bg-black/30 px-1.5 py-0.5 rounded text-sm font-mono text-primary">{children}</code>
    ) : (
      <pre className="bg-black/30 p-3 rounded-lg overflow-x-auto my-2">
        <code className="text-sm font-mono text-green-400">{children}</code>
      </pre>
    ),
  pre: ({ children }) => <div className="my-2">{children}</div>,
  blockquote: ({ children }) => (
    <blockquote className="border-l-4 border-primary pl-4 my-2 italic text-muted-foreground">
      {children}
    </blockquote>
  ),
  strong: ({ children }) => <strong className="font-bold text-primary">{children}</strong>,
  em: ({ children }) => <em className="italic">{children}</em>,
  a: ({ href, children }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-primary underline hover:no-underline">
      {children}
    </a>
  ),
  table: ({ children }) => (
    <div className="overflow-x-auto my-2">
      <table className="min-w-full border border-border rounded">{children}</table>
    </div>
  ),
  th: ({ children }) => <th className="border border-border px-3 py-2 bg-muted font-semibold text-left">{children}</th>,
  td: ({ children }) => <td className="border border-border px-3 py-2">{children}</td>,
}

export default function ChatPage() {
  const { session } = useAuth()
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const scrollRef = useRef(null)

  // Welcome message displayed separately (not sent to API)
  const welcomeMessage = {
    role: 'assistant',
    content: 'Bonjour ! Je suis votre assistant IA expert en audit de fairness. Comment puis-je vous aider aujourd\'hui ? Je peux vous aider a comprendre les metriques de fairness, interpreter vos resultats d\'audit, ou generer du code Python pour corriger les biais.',
  }

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || loading) return

    const userMessage = input.trim()
    setInput('')
    
    // Add user message
    const newMessages = [...messages, { role: 'user', content: userMessage }]
    setMessages(newMessages)
    setLoading(true)

    try {
      const token = session?.access_token
      if (!token) {
        throw new Error('Session expiree. Veuillez vous reconnecter.')
      }

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          messages: newMessages, // Only send actual conversation, not welcome message
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erreur lors de la communication avec l\'IA')
      }

      const data = await response.json()
      
      if (data.success && data.message) {
        setMessages([...newMessages, data.message])
      } else {
        throw new Error('Reponse invalide de l\'API')
      }
    } catch (error) {
      console.error('Chat error:', error)
      toast.error(error.message || 'Erreur lors de la generation de la reponse')
      setMessages([...newMessages, {
        role: 'assistant',
        content: 'Desole, une erreur s\'est produite. Veuillez reessayer. ' + error.message,
      }])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <DashboardShell>
      <div className="space-y-6 max-w-4xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold">Chat AI Assistant</h1>
          <p className="text-muted-foreground mt-1">
            Posez vos questions sur la fairness et les audits - Propulsé par Gemini AI
          </p>
        </div>

        <Card className="h-[600px] flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              Assistant IA
            </CardTitle>
            <CardDescription>
              Expert en fairness, biais algorithmiques et conformité AI
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col min-h-0">
            <ScrollArea className="flex-1 pr-4" ref={scrollRef}>
              <div className="space-y-4 pb-4">
                {/* Welcome message - always shown first but not sent to API */}
                <div className="flex gap-3 justify-start animate-in fade-in slide-in-from-bottom-2">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Bot className="h-5 w-5 text-primary" />
                  </div>
                  <div className="rounded-lg px-4 py-3 max-w-[80%] break-words bg-muted">
                    <p className="whitespace-pre-wrap">{welcomeMessage.content}</p>
                  </div>
                </div>

                {/* Conversation messages */}
                {messages.map((message, idx) => (
                  <div
                    key={idx}
                    className={cn(
                      'flex gap-3 animate-in fade-in slide-in-from-bottom-2',
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    )}
                  >
                    {message.role === 'assistant' && (
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Bot className="h-5 w-5 text-primary" />
                      </div>
                    )}
                    <div
                      className={cn(
                        'rounded-lg px-4 py-3 max-w-[85%] break-words',
                        message.role === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      )}
                    >
                      {message.role === 'assistant' ? (
                        <ReactMarkdown components={MarkdownComponents}>
                          {message.content}
                        </ReactMarkdown>
                      ) : (
                        <p className="whitespace-pre-wrap">{message.content}</p>
                      )}
                    </div>
                    {message.role === 'user' && (
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                        <User className="h-5 w-5 text-primary-foreground" />
                      </div>
                    )}
                  </div>
                ))}
                {loading && (
                  <div className="flex gap-3 justify-start animate-in fade-in">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Bot className="h-5 w-5 text-primary" />
                    </div>
                    <div className="rounded-lg px-4 py-3 bg-muted">
                      <Loader2 className="h-5 w-5 animate-spin text-primary" />
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            <div className="flex gap-2 mt-4 pt-4 border-t">
              <Input
                placeholder="Posez votre question sur la fairness IA..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={loading}
                className="flex-1"
              />
              <Button onClick={handleSend} disabled={loading || !input.trim()}>
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Questions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Questions suggérées</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {[
                'Qu\'est-ce que le Demographic Parity ?',
                'Comment interpréter un score de fairness de 65% ?',
                'Quelles sont les meilleures techniques de mitigation ?',
                'Comment améliorer la conformité AI Act ?',
              ].map((question, idx) => (
                <Button
                  key={idx}
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setInput(question)
                  }}
                  disabled={loading}
                >
                  {question}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  )
}
