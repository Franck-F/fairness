import './globals.css'
import { Inter, Space_Grotesk } from 'next/font/google'
import { Toaster } from '@/components/ui/sonner'
import { ThemeProvider } from '@/components/theme-provider'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-space-grotesk' })

export const metadata = {
  title: 'AuditIQ - AI Fairness Auditing Platform',
  description: 'Plateforme SaaS d\'audit de fairness et de detection de biais dans les systemes d\'IA',
}

export default function RootLayout({ children }) {
  return (
    <html lang="fr" suppressHydrationWarning className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body className={`${inter.className} font-sans selection:bg-brand-primary/30`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          {/* Background Orbs from Redesign */}
          <div className="bg-orb -top-20 -left-20 opacity-40"></div>
          <div className="bg-orb bottom-0 right-0 opacity-20"></div>

          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
