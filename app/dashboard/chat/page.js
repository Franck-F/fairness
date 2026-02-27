'use client'

import { useState, useRef, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import { DashboardShell } from '@/components/dashboard/shell'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { PageHeader } from '@/components/dashboard/page-header'
import {
  MessageSquare,
  Send,
  Bot,
  User,
  Loader2,
  Sparkles,
  Zap,
  Shield,
  Search,
  ArrowRight,
  Clock,
  Terminal
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { useAuth } from '@/lib/auth-context'

// Custom components for markdown rendering with theme-aware styling
const MarkdownComponents = {
  p: ({ children }) => <p className="mb-4 last:mb-0 leading-relaxed text-foreground/80">{children}</p>,
  h1: ({ children }) => <h1 className="text-2xl font-display font-bold mb-4 mt-6 text-foreground tracking-tight">{children}</h1>,
  h2: ({ children }) => <h2 className="text-xl font-display font-bold mb-3 mt-5 text-foreground tracking-tight">{children}</h2>,
  h3: ({ children }) => <h3 className="text-lg font-display font-semibold mb-2 mt-4 text-foreground">{children}</h3>,
  ul: ({ children }) => <ul className="list-disc list-inside mb-4 space-y-2 text-muted-foreground">{children}</ul>,
  ol: ({ children }) => <ol className="list-decimal list-inside mb-4 space-y-2 text-muted-foreground">{children}</ol>,
  li: ({ children }) => <li className="ml-2 pl-2">{children}</li>,
  code: ({ inline, children }) =>
    inline ? (
      <code className="bg-accent px-2 py-0.5 rounded-md text-sm font-mono text-primary border border-border">{children}</code>
    ) : (
      <div className="my-6">
        <pre className="bg-background p-5 rounded-xl overflow-x-auto border border-border">
          <code className="text-xs font-mono text-foreground/80 leading-relaxed">{children}</code>
        </pre>
      </div>
    ),
  pre: ({ children }) => <div className="w-full">{children}</div>,
  blockquote: ({ children }) => (
    <blockquote className="border-l-4 border-primary bg-primary/5 px-6 py-4 my-6 italic text-muted-foreground rounded-r-xl">
      {children}
    </blockquote>
  ),
  strong: ({ children }) => <strong className="font-bold text-foreground">{children}</strong>,
  em: ({ children }) => <em className="italic text-foreground/80">{children}</em>,
  a: ({ href, children }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-primary/80 transition-colors">
      {children}
    </a>
  ),
  table: ({ children }) => (
    <div className="overflow-x-auto my-6 rounded-xl border border-border">
      <table className="min-w-full bg-muted/50">{children}</table>
    </div>
  ),
  th: ({ children }) => <th className="px-4 py-3 bg-accent font-bold text-left text-xs uppercase tracking-widest text-muted-foreground">{children}</th>,
  td: ({ children }) => <td className="px-4 py-3 border-t border-border text-sm text-muted-foreground">{children}</td>,
}

export default function ChatPage() {
  const { session } = useAuth()
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [auditContext, setAuditContext] = useState(null)
  const scrollRef = useRef(null)

  const welcomeMessage = {
    role: 'assistant',
    content: 'Bonjour ! Je suis votre **Assistant AuditIQ**, l\'ingenieur de fairness dedie a votre plateforme. \n\nJe peux vous accompagner sur :\n- L\'interpretation des scores de **Demographic Parity**.\n- La mise en conformite avec l\'**AI Act**.\n- La generation de scripts de **mitigation de biais**.\n\nQuelle dimension de votre gouvernance IA souhaitez-vous explorer ?',
  }

  useEffect(() => {
    async function fetchLatestAudit() {
      if (!session?.access_token) return
      try {
        const response = await fetch('/api/audits', {
          headers: { 'Authorization': `Bearer ${session.access_token}` }
        })
        const data = await response.json()
        const completed = data.audits?.filter(a => a.status === 'completed')
        if (completed && completed.length > 0) {
          setAuditContext(completed[0])
        }
      } catch (error) {
        // Silently handle context fetch errors
      }
    }
    fetchLatestAudit()
  }, [session])

  useEffect(() => {
    if (scrollRef.current) {
      const scrollElement = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]')
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight
      }
    }
  }, [messages, loading])

  const handleSend = async () => {
    if (!input.trim() || loading) return

    const userMessage = input.trim()
    setInput('')

    const newMessages = [...messages, { role: 'user', content: userMessage }]
    setMessages(newMessages)
    setLoading(true)

    try {
      const token = session?.access_token
      if (!token) throw new Error('Session expiree. Veuillez vous reconnecter.')

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          messages: newMessages,
          context: auditContext
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
      toast.error(error.message || 'Erreur lors de la generation')
      setMessages([...newMessages, {
        role: 'assistant',
        content: '> [!CAUTION]\n> **Erreur de Connexion**\n> Impossible de joindre l\'Assistant AuditIQ. Veuillez verifier votre connexion ou reessayer ulterieurement.',
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
      <div className="space-y-8 max-w-5xl mx-auto py-8 animate-in fade-in slide-in-from-bottom-6 duration-1000">
        {/* Header */}
        <PageHeader
          icon={Bot}
          title="AuditIQ"
          titleHighlight="Assistant"
          description="Votre copilote IA expert en fairness et conformite algorithmique securisee."
          actions={
            <div className="bg-card border border-border px-4 py-2 rounded-xl flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Gemini Pro 1.5 Active</span>
            </div>
          }
        />

        {/* Chat Interface Hub */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[700px]">
          {/* Main Chat Stage */}
          <div className="lg:col-span-3 flex flex-col h-full gap-4">
            <Card className="flex-1 flex flex-col overflow-hidden relative">
              <CardContent className="flex-1 flex flex-col min-h-0 p-6 pt-6">
                <ScrollArea className="flex-1 pr-4" ref={scrollRef}>
                  <div className="space-y-8 pb-4 pt-2">
                    {/* Welcome Message */}
                    <div className="flex gap-4 justify-start">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                        <Bot className="h-5 w-5 text-primary" />
                      </div>
                      <div className="rounded-xl rounded-tl-none px-5 py-4 max-w-[85%] bg-muted border border-border">
                        <div className="text-foreground/80 font-display font-medium leading-relaxed">
                          <ReactMarkdown components={MarkdownComponents}>
                            {welcomeMessage.content}
                          </ReactMarkdown>
                        </div>
                      </div>
                    </div>

                    {/* Conversation Flow */}
                    {messages.map((message, idx) => (
                      <div
                        key={idx}
                        className={cn(
                          'flex gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500',
                          message.role === 'user' ? 'justify-end' : 'justify-start'
                        )}
                      >
                        {message.role === 'assistant' && (
                          <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                            <Bot className="h-5 w-5 text-primary" />
                          </div>
                        )}
                        <div
                          className={cn(
                            'rounded-xl px-5 py-4 max-w-[85%] font-display transition-all border',
                            message.role === 'user'
                              ? 'bg-primary text-primary-foreground rounded-tr-none'
                              : 'bg-muted border-border text-foreground/80 rounded-tl-none'
                          )}
                        >
                          {message.role === 'assistant' ? (
                            <ReactMarkdown components={MarkdownComponents}>
                              {message.content}
                            </ReactMarkdown>
                          ) : (
                            <p className="whitespace-pre-wrap font-medium leading-relaxed">{message.content}</p>
                          )}
                        </div>
                        {message.role === 'user' && (
                          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
                            <User className="h-5 w-5 text-primary-foreground" />
                          </div>
                        )}
                      </div>
                    ))}

                    {/* Loading State */}
                    {loading && (
                      <div className="flex gap-4 justify-start animate-in fade-in">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0 animate-pulse">
                          <Bot className="h-5 w-5 text-primary" />
                        </div>
                        <div className="rounded-xl rounded-tl-none px-6 py-4 bg-muted border border-border">
                          <div className="flex gap-2">
                            <div className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]" />
                            <div className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]" />
                            <div className="w-2 h-2 rounded-full bg-primary animate-bounce" />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollArea>

                {/* Input Section */}
                <div className="mt-6 pt-6 border-t border-border">
                  <div className="flex gap-3 bg-card p-3 rounded-xl border border-border">
                    <div className="flex-1 px-3 flex items-center">
                      <Terminal className="h-4 w-4 text-muted-foreground/50 mr-3" />
                      <Input
                        placeholder="Posez une question sur vos audits..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        disabled={loading}
                        className="bg-transparent border-none text-foreground font-display font-medium focus-visible:ring-0 placeholder:text-muted-foreground/50 h-10 w-full"
                      />
                    </div>
                    <Button
                      onClick={handleSend}
                      disabled={loading || !input.trim()}
                      className="h-10 w-10 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground transition-all"
                    >
                      {loading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-center mt-3 text-muted-foreground/50 font-medium">AuditIQ -- Vos donnees restent confidentielles</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Modules */}
          <div className="space-y-6 flex flex-col h-full">
            {/* Quick Actions Hub */}
            <Card className="overflow-hidden flex flex-col">
              <div className="p-5 border-b border-border flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-display font-semibold text-foreground">Suggestions</h3>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mt-1">Questions frequentes</p>
                </div>
                <Zap className="h-4 w-4 text-primary" />
              </div>
              <div className="p-5 space-y-3">
                {[
                  { q: 'Derive du Demographic Parity', icon: Shield },
                  { q: 'Interpretation Score Fairness', icon: Search },
                  { q: 'Techniques de Mitigation', icon: Zap },
                  { q: 'Conformite AI Act 2024', icon: ArrowRight },
                ].map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => setInput(item.q)}
                    disabled={loading}
                    className="w-full text-left p-3 rounded-lg bg-muted/50 border border-border hover:border-primary/40 hover:bg-accent transition-all group flex items-start gap-3"
                  >
                    <item.icon className="h-4 w-4 mt-0.5 text-muted-foreground/70 group-hover:text-primary transition-colors" />
                    <span className="text-xs font-display font-medium text-muted-foreground group-hover:text-foreground transition-colors leading-tight">{item.q}</span>
                  </button>
                ))}
              </div>
            </Card>

            {/* AI Core Specs */}
            <Card className="p-5 flex-1 relative overflow-hidden">
              <p className="text-xs font-medium uppercase tracking-wider text-primary mb-4 flex items-center gap-2">
                <Shield className="h-3 w-3" /> Specifications
              </p>
              <div className="space-y-4">
                {[
                  { label: 'Latence', val: '240ms', color: 'text-foreground' },
                  { label: 'Confidentialite', val: 'Aucun acces', color: 'text-green-500' },
                  { label: 'Synchronisation', val: 'Active', color: 'text-primary' }
                ].map((spec, i) => (
                  <div key={i} className="flex justify-between items-center gap-2 border-b border-border pb-2">
                    <span className="text-[10px] font-medium text-muted-foreground/70 uppercase tracking-wider shrink-0">{spec.label}</span>
                    <span className={cn("text-[10px] font-bold uppercase tracking-wider text-right", spec.color)}>{spec.val}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6">
                <p className="text-xs text-muted-foreground/70 leading-relaxed font-medium italic">
                  "L'intelligence sans ethique n'est que derive. AuditIQ garantit votre integrite algorithmique."
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </DashboardShell>
  )
}
