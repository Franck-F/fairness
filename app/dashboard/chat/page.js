'use client'

import { useState, useRef, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import { DashboardShell } from '@/components/dashboard/shell'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
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

// Custom components for markdown rendering with premium styling
const MarkdownComponents = {
  p: ({ children }) => <p className="mb-4 last:mb-0 leading-relaxed text-white/80">{children}</p>,
  h1: ({ children }) => <h1 className="text-2xl font-display font-black mb-4 mt-6 text-white tracking-tight">{children}</h1>,
  h2: ({ children }) => <h2 className="text-xl font-display font-black mb-3 mt-5 text-white tracking-tight">{children}</h2>,
  h3: ({ children }) => <h3 className="text-lg font-display font-bold mb-2 mt-4 text-white/90">{children}</h3>,
  ul: ({ children }) => <ul className="list-disc list-inside mb-4 space-y-2 text-white/70">{children}</ul>,
  ol: ({ children }) => <ol className="list-decimal list-inside mb-4 space-y-2 text-white/70">{children}</ol>,
  li: ({ children }) => <li className="ml-2 pl-2">{children}</li>,
  code: ({ inline, children }) =>
    inline ? (
      <code className="bg-white/10 px-2 py-0.5 rounded-md text-sm font-mono text-brand-primary border border-white/5">{children}</code>
    ) : (
      <div className="relative group my-6">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-brand-primary/20 to-brand-cotton/20 rounded-2xl blur opacity-50 group-hover:opacity-100 transition duration-1000"></div>
        <pre className="relative bg-[#0A0A0B] p-5 rounded-xl overflow-x-auto border border-white/10">
          <code className="text-xs font-mono text-brand-cotton leading-relaxed">{children}</code>
        </pre>
      </div>
    ),
  pre: ({ children }) => <div className="w-full">{children}</div>,
  blockquote: ({ children }) => (
    <blockquote className="border-l-4 border-brand-primary bg-brand-primary/5 px-6 py-4 my-6 italic text-white/60 rounded-r-2xl">
      {children}
    </blockquote>
  ),
  strong: ({ children }) => <strong className="font-black text-white">{children}</strong>,
  em: ({ children }) => <em className="italic text-white/80">{children}</em>,
  a: ({ href, children }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-brand-primary underline hover:text-brand-cotton transition-colors">
      {children}
    </a>
  ),
  table: ({ children }) => (
    <div className="overflow-x-auto my-6 rounded-2xl border border-white/5">
      <table className="min-w-full bg-white/5">{children}</table>
    </div>
  ),
  th: ({ children }) => <th className="px-4 py-3 bg-white/10 font-bold text-left text-xs uppercase tracking-widest text-white/40">{children}</th>,
  td: ({ children }) => <td className="px-4 py-3 border-t border-white/5 text-sm text-white/70">{children}</td>,
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
    content: 'Bonjour ! Je suis votre **Assistant AuditIQ**, l\'ingénieur de fairness dédié à votre plateforme. \n\nJe peux vous accompagner sur :\n- L\'interprétation des scores de **Demographic Parity**.\n- La mise en conformité avec l\'**AI Act**.\n- La génération de scripts de **mitigation de biais**.\n\nQuelle dimension de votre gouvernance IA souhaitez-vous explorer ?',
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
          // Take the most recent completed audit
          setAuditContext(completed[0])
        }
      } catch (error) {
        console.error('Error fetching context audit:', error)
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
      if (!token) throw new Error('Session expirée. Veuillez vous reconnecter.')

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
        throw new Error('Réponse invalide de l\'API')
      }
    } catch (error) {
      console.error('Chat error:', error)
      toast.error(error.message || 'Erreur lors de la génération')
      setMessages([...newMessages, {
        role: 'assistant',
        content: '> [!CAUTION]\n> **Erreur de Connexion**\n> Impossible de joindre l\'Assistant AuditIQ. Veuillez vérifier votre connexion ou réessayer ultérieurement.',
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
      <div className="space-y-10 max-w-5xl mx-auto py-8 animate-in fade-in slide-in-from-bottom-6 duration-1000">
        {/* Premium Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/5">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center">
                <Bot className="h-6 w-6 text-brand-primary animate-pulse" />
              </div>
              <h1 className="text-4xl md:text-5xl font-display font-black tracking-tighter text-white leading-none">
                AuditIQ <span className="text-brand-primary">Assistant</span>
              </h1>
            </div>
            <p className="text-white/40 font-display font-medium text-lg max-w-2xl">
              Votre copilote IA expert en fairness et conformité algorithmique sécurisée.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="glass-card px-4 py-2 rounded-xl border-white/5 bg-white/5 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[9px] font-black uppercase tracking-widest text-white/60">Gemini Pro 1.5 Active</span>
            </div>
          </div>
        </div>

        {/* Chat Interface Hub */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 h-[700px]">
          {/* Main Chat Stage */}
          <div className="lg:col-span-3 flex flex-col h-full gap-6">
            <Card className="flex-1 flex flex-col glass-card border-white/10 bg-[#0A0A0B]/40 backdrop-blur-3xl rounded-[2.5rem] overflow-hidden relative border-2 ring-1 ring-white/5">
              {/* Subtle background glow */}
              <div className="absolute top-1/4 -right-20 w-64 h-64 bg-brand-primary/5 rounded-full blur-[100px] pointer-events-none" />
              <div className="absolute bottom-1/4 -left-20 w-64 h-64 bg-brand-cotton/5 rounded-full blur-[100px] pointer-events-none" />

              <CardContent className="flex-1 flex flex-col min-h-0 p-8">
                <ScrollArea className="flex-1 pr-6" ref={scrollRef}>
                  <div className="space-y-10 pb-6 pt-2">
                    {/* Welcome Message */}
                    <div className="flex gap-5 justify-start group">
                      <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform">
                        <Bot className="h-6 w-6 text-brand-primary" />
                      </div>
                      <div className="glass-card rounded-3xl rounded-tl-none px-6 py-5 max-w-[85%] border-white/10 bg-white/5 relative">
                        <div className="absolute top-0 left-0 w-4 h-4 -translate-x-full border-t border-r border-white/10 bg-[#0A0A0B]/20" style={{ clipPath: 'polygon(100% 0, 0 0, 100% 100%)' }} />
                        <div className="text-white/80 font-display font-medium leading-relaxed">
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
                          'flex gap-5 animate-in fade-in slide-in-from-bottom-4 duration-500',
                          message.role === 'user' ? 'justify-end' : 'justify-start'
                        )}
                      >
                        {message.role === 'assistant' && (
                          <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center flex-shrink-0 shadow-lg">
                            <Bot className="h-6 w-6 text-brand-primary" />
                          </div>
                        )}
                        <div
                          className={cn(
                            'rounded-3xl px-6 py-5 max-w-[85%] font-display transition-all border shadow-2xl relative',
                            message.role === 'user'
                              ? 'bg-brand-primary border-brand-primary/30 text-white rounded-tr-none shadow-brand-primary/20'
                              : 'glass-card border-white/10 bg-white/5 text-white/80 rounded-tl-none'
                          )}
                        >
                          {/* Chat Bubble Arrow */}
                          <div
                            className={cn(
                              "absolute top-0 w-4 h-4",
                              message.role === 'user' ? "right-0 translate-x-full" : "left-0 -translate-x-full"
                            )}
                            style={{
                              clipPath: message.role === 'user' ? 'polygon(0 0, 100% 0, 0 100%)' : 'polygon(100% 0, 0 0, 100% 100%)',
                              background: message.role === 'user' ? 'var(--brand-primary)' : 'rgba(255,255,255,0.05)',
                              opacity: message.role === 'user' ? 1 : 0.5
                            }}
                          />

                          {message.role === 'assistant' ? (
                            <ReactMarkdown components={MarkdownComponents}>
                              {message.content}
                            </ReactMarkdown>
                          ) : (
                            <p className="whitespace-pre-wrap font-bold leading-relaxed">{message.content}</p>
                          )}
                        </div>
                        {message.role === 'user' && (
                          <div className="w-12 h-12 rounded-2xl bg-brand-primary border border-brand-primary/50 flex items-center justify-center flex-shrink-0 shadow-[0_0_20px_rgba(255,105,180,0.3)]">
                            <User className="h-6 w-6 text-white" />
                          </div>
                        )}
                      </div>
                    ))}

                    {/* Loading State */}
                    {loading && (
                      <div className="flex gap-5 justify-start animate-in fade-in">
                        <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center flex-shrink-0 animate-pulse">
                          <Bot className="h-6 w-6 text-brand-primary" />
                        </div>
                        <div className="glass-card rounded-3xl rounded-tl-none px-8 py-5 border-white/10 bg-white/5">
                          <div className="flex gap-2">
                            <div className="w-2 h-2 rounded-full bg-brand-primary animate-bounce [animation-delay:-0.3s]" />
                            <div className="w-2 h-2 rounded-full bg-brand-primary animate-bounce [animation-delay:-0.15s]" />
                            <div className="w-2 h-2 rounded-full bg-brand-primary animate-bounce" />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollArea>

                {/* Glass Input Section */}
                <div className="mt-8 pt-8 border-t border-white/5">
                  <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-brand-primary/20 to-brand-cotton/20 rounded-[2rem] blur opacity-30 group-focus-within:opacity-100 transition duration-500" />
                    <div className="relative flex gap-4 bg-[#111114]/80 p-3 rounded-[1.8rem] border border-white/10 ring-1 ring-white/5 backdrop-blur-3xl">
                      <div className="flex-1 px-4 flex items-center">
                        <Terminal className="h-4 w-4 text-white/20 mr-4" />
                        <Input
                          placeholder="Initier une commande analytique ou une question..."
                          value={input}
                          onChange={(e) => setInput(e.target.value)}
                          onKeyPress={handleKeyPress}
                          disabled={loading}
                          className="bg-transparent border-none text-white font-display font-medium focus-visible:ring-0 placeholder:text-white/10 h-10 w-full"
                        />
                      </div>
                      <Button
                        onClick={handleSend}
                        disabled={loading || !input.trim()}
                        className="h-12 w-12 rounded-2xl bg-brand-primary hover:bg-brand-primary/90 text-white shadow-xl shadow-brand-primary/30 transition-all hover:scale-105 active:scale-95 group/send"
                      >
                        {loading ? (
                          <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                          <Send className="h-5 w-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <p className="text-[9px] text-center mt-4 text-white/20 font-black uppercase tracking-widest italic">AuditIQ Intelligence System • Privacy Guaranteed</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Modules */}
          <div className="space-y-8 flex flex-col h-full">
            {/* Quick Actions Hub */}
            <div className="glass-card rounded-[2.5rem] border-white/10 bg-white/5 overflow-hidden flex flex-col">
              <div className="p-6 border-b border-white/5 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-display font-black text-white">Suggestions</h3>
                  <p className="text-[9px] text-white/30 uppercase font-black tracking-widest mt-1">Prompt Engineering</p>
                </div>
                <Zap className="h-4 w-4 text-brand-cotton animate-pulse" />
              </div>
              <div className="p-6 space-y-4">
                {[
                  { q: 'Dérive du Demographic Parity', icon: Shield },
                  { q: 'Interprétation Score Fairness', icon: Search },
                  { q: 'Techniques de Mitigation', icon: Zap },
                  { q: 'Conformité AI Act 2024', icon: ArrowRight },
                ].map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => setInput(item.q)}
                    disabled={loading}
                    className="w-full text-left p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-brand-primary/40 hover:bg-brand-primary/5 transition-all group flex items-start gap-3"
                  >
                    <item.icon className="h-4 w-4 mt-1 text-white/20 group-hover:text-brand-primary transition-colors" />
                    <span className="text-xs font-display font-bold text-white/50 group-hover:text-white transition-colors leading-tight">{item.q}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* AI Core Specs */}
            <div className="glass-card p-6 rounded-[2.5rem] border-white/10 bg-brand-primary/5 flex-1 relative overflow-hidden group">
              <div className="absolute -bottom-10 -right-10 opacity-5 group-hover:opacity-10 transition-opacity">
                <Bot className="h-40 w-40" />
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-brand-primary mb-4 flex items-center gap-2">
                <Shield className="h-3 w-3" /> System Specs
              </p>
              <div className="space-y-4">
                {[
                  { label: 'Latency', val: '240ms', color: 'text-brand-cotton' },
                  { label: 'Privacy', val: 'Zero-Access', color: 'text-green-500' },
                  { label: 'Dataset Sync', val: 'Active', color: 'text-brand-primary' }
                ].map((spec, i) => (
                  <div key={i} className="flex justify-between items-center border-b border-white/5 pb-2">
                    <span className="text-[10px] font-bold text-white/30 uppercase tracking-tighter">{spec.label}</span>
                    <span className={cn("text-[10px] font-black uppercase tracking-widest", spec.color)}>{spec.val}</span>
                  </div>
                ))}
              </div>
              <div className="mt-8">
                <p className="text-[10px] text-white/30 leading-relaxed font-medium italic">
                  "L'intelligence sans éthique n'est que dérive. AuditIQ garantit votre intégrité algorithmique."
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  )
}
