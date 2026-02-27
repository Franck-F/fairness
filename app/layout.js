import './globals.css'
import { Inter, Signika } from 'next/font/google'
import { Toaster } from '@/components/ui/sonner'
import { ThemeProvider } from '@/components/theme-provider'
import { CookieConsent } from '@/components/ui/cookie-consent'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const signika = Signika({ subsets: ['latin'], variable: '--font-signika' })

const APP_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://auditiq.app'

export const metadata = {
  metadataBase: new URL(APP_URL.startsWith('http') ? APP_URL : 'https://auditiq.app'),
  title: {
    default: 'AuditIQ - Plateforme d\'Audit d\'Equite IA',
    template: '%s | AuditIQ',
  },
  description:
    'Detectez et corrigez les biais algorithmiques dans vos systemes d\'IA. Audit automatise, metriques de fairness, et recommandations actionables conformes EU AI Act.',
  keywords: [
    'audit IA', 'fairness', 'biais algorithmique', 'equite',
    'AI bias detection', 'disparate impact', 'machine learning audit',
    'EU AI Act', 'compliance', 'ethical AI',
  ],
  authors: [{ name: 'AuditIQ' }],
  creator: 'AuditIQ',
  publisher: 'AuditIQ',
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: APP_URL,
    siteName: 'AuditIQ',
    title: 'AuditIQ - Plateforme d\'Audit d\'Equite IA',
    description:
      'Detectez et corrigez les biais algorithmiques. Audit automatise, metriques de fairness, conformite EU AI Act.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'AuditIQ - AI Fairness Auditing Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AuditIQ - Plateforme d\'Audit d\'Equite IA',
    description:
      'Detectez et corrigez les biais algorithmiques dans vos systemes d\'IA.',
    images: ['/og-image.png'],
  },
  alternates: {
    canonical: APP_URL,
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
}

export const viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'AuditIQ',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    description: 'Plateforme SaaS d\'audit de fairness et de detection de biais dans les systemes d\'IA',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'EUR',
    },
  }

  return (
    <html lang="fr" suppressHydrationWarning className={`${inter.variable} ${signika.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${inter.className} font-sans selection:bg-brand-primary/30`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
          <Toaster />
          <CookieConsent />
        </ThemeProvider>
      </body>
    </html>
  )
}
