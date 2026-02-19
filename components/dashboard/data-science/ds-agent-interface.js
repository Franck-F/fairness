'use client'

import { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loader2, Send, Sparkles, Brain, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

export function DSAgentInterface({ datasetId, targetColumn, onActionTriggered, token }) {
    const [prompt, setPrompt] = useState('')
    const [loading, setLoading] = useState(false)
    const [messages, setMessages] = useState([
        {
            role: 'assistant',
            content: "Bonjour ! Je suis votre assistant Data Science. Que souhaitez-vous analyser aujourd'hui ?",
            actions: []
        }
    ])
    const scrollRef = useRef(null)

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [messages, loading])

    const handleSend = async () => {
        if (!prompt.trim() || loading) return

        if (!token) {
            toast.error("Session expirée. Veuillez vous reconnecter.")
            return
        }

        const userMessage = { role: 'user', content: prompt }
        setMessages(prev => [...prev, userMessage])
        setPrompt('')
        setLoading(true)

        try {
            const response = await fetch('/api/ds/agent/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    prompt,
                    dataset_id: datasetId,
                    target_column: targetColumn
                })
            })

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}))
                throw new Error(errorData.error || `Erreur serveur (${response.status})`)
            }

            const data = await response.json()
            if (data.status === 'success') {
                setMessages(prev => [...prev, {
                    role: 'assistant',
                    content: data.message,
                    actions: data.actions || []
                }])
            } else {
                throw new Error(data.error || 'Erreur agent')
            }
        } catch (error) {
            console.error('Agent chat error:', error)
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: `Désolé, j'ai rencontré une difficulté : ${error.message || "erreur inconnue"}.`
            }])
        } finally {
            setLoading(false)
        }
    }

    return (
        <Card className="glass-card border-brand-primary/20 bg-[#0A0A0B]/60 backdrop-blur-xl h-[500px] flex flex-col overflow-hidden shadow-2xl shadow-brand-primary/5">
            <CardHeader className="border-b border-white/5 py-4 flex flex-row items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-primary/20 flex items-center justify-center">
                    <Brain className="h-5 w-5 text-brand-primary" />
                </div>
                <div>
                    <CardTitle className="text-lg font-display font-black text-white">IA Copilot</CardTitle>
                    <p className="text-[10px] text-white/40 uppercase tracking-widest font-black">Expert Senior Agent</p>
                </div>
                <div className="ml-auto flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[10px] text-white/40 font-bold uppercase tracking-tight">En ligne</span>
                </div>
            </CardHeader>

            <CardContent className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide" ref={scrollRef}>
                {messages.map((msg, i) => (
                    <div key={i} className={cn(
                        "flex flex-col gap-2 max-w-[85%] animate-in fade-in slide-in-from-bottom-2 duration-300",
                        msg.role === 'user' ? "ml-auto items-end" : "mr-auto items-start"
                    )}>
                        <div className={cn(
                            "p-4 rounded-2xl text-sm font-medium leading-relaxed shadow-lg",
                            msg.role === 'user'
                                ? "bg-brand-primary text-white rounded-tr-none"
                                : "bg-white/5 border border-white/10 text-white/90 rounded-tl-none"
                        )}>
                            {msg.content}
                        </div>

                        {msg.actions && msg.actions.length > 0 && (
                            <div className="grid grid-cols-1 gap-3 w-full mt-2">
                                {msg.actions.map((action, j) => (
                                    <button
                                        key={j}
                                        onClick={() => onActionTriggered(action)}
                                        className="text-left p-4 rounded-2xl bg-brand-cotton/10 border border-brand-cotton/20 hover:bg-brand-cotton/20 transition-all group flex items-center gap-4 animate-in zoom-in-95 duration-500 delay-150"
                                    >
                                        <div className="w-10 h-10 rounded-xl bg-brand-cotton/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                                            <Sparkles className="h-5 w-5 text-brand-cotton" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-sm font-bold text-white truncate">{action.label}</h4>
                                            <p className="text-[10px] text-white/40 truncate">{action.description}</p>
                                        </div>
                                        <ArrowRight className="h-4 w-4 text-brand-cotton opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
                {loading && (
                    <div className="flex items-center gap-2 text-brand-primary animate-pulse">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="text-xs font-black uppercase tracking-widest">IA réfléchit...</span>
                    </div>
                )}
            </CardContent>

            <div className="p-4 border-t border-white/5 bg-white/[0.02]">
                <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="relative">
                    <Input
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Posez votre question Data Science..."
                        className="bg-white/5 border-white/10 h-14 pl-6 pr-14 rounded-2xl text-white placeholder:text-white/20 focus-visible:ring-brand-primary/50"
                    />
                    <Button
                        type="submit"
                        disabled={!prompt.trim() || loading}
                        size="icon"
                        className="absolute right-2 top-2 h-10 w-10 rounded-xl bg-brand-primary hover:bg-brand-primary/90 text-white shadow-lg shadow-brand-primary/20 transition-all hover:scale-110 active:scale-95"
                    >
                        {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                    </Button>
                </form>
            </div>
        </Card>
    )
}
