'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Linkedin, Twitter, Github } from 'lucide-react'

const sections = [
  {
    title: 'Fonctionnalités',
    links: [
      { name: 'Audit Fairness', href: '/dashboard/upload' },
      { name: 'Analyse What-If', href: '/dashboard/whatif' },
      { name: 'Dé-biaisage', href: '/dashboard/audits' },
      { name: 'Assistant IA', href: '/dashboard/chat' },
    ],
  },
  {
    title: 'Entreprise',
    links: [
      { name: 'À propos', href: '/about' },
      { name: 'Tarifs', href: '/pricing' },
      { name: 'Carrières', href: '/careers' },
      { name: 'Contact', href: '/contact' },
    ],
  },
  {
    title: 'Ressources',
    links: [
      { name: 'Documentation', href: '/about' },
      { name: 'API Alpha', href: '/dashboard/connections' },
      { name: 'Status', href: '/api/health' },
      { name: 'Blog', href: '/blog' },
    ],
  },
]

const socialLinks = [
  { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
  { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
  { icon: Github, href: 'https://github.com', label: 'GitHub' },
]

const legalLinks = [
  { name: 'CGU', href: '/legal/terms' },
  { name: 'Confidentialité', href: '/legal/privacy' },
  { name: 'Mentions légales', href: '/legal/cgu' },
]

export function AuditIQFooter() {
  return (
    <footer className="bg-background text-foreground border-t border-border">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Main footer grid */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-5">
          {/* Left section - Logo, description, socials */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            <Link href="/" className="inline-block">
              <Image
                src="https://customer-assets.emergentagent.com/job_auditiq/artifacts/snxql2e8_logo%20audiot-iq%20big%20without%20bg.png.png"
                alt="AuditIQ Logo"
                width={140}
                height={56}
                style={{ width: 'auto', height: 'auto' }}
                className="object-contain"
              />
            </Link>
            <p className="text-sm leading-relaxed text-muted-foreground max-w-sm">
              Plateforme SaaS d&apos;audit de fairness et de détection de biais
              dans les systèmes d&apos;IA.
            </p>
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-primary hover:bg-primary/10"
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                )
              })}
            </div>
          </div>

          {/* 3 link columns */}
          {sections.map((section) => (
            <div key={section.title}>
              <h3 className="mb-4 text-sm font-semibold tracking-wide text-foreground">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-primary"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            &copy; 2026 AuditIQ SAS. Tous droits réservés.
          </p>
          <ul className="flex flex-wrap items-center gap-5">
            {legalLinks.map((link, idx) => (
              <li key={link.name} className="flex items-center gap-5">
                <Link
                  href={link.href}
                  className="text-sm text-foreground/70 underline underline-offset-2 decoration-foreground/30 transition-colors hover:text-primary hover:decoration-primary"
                >
                  {link.name}
                </Link>
                {idx < legalLinks.length - 1 && (
                  <span className="text-foreground/20">|</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  )
}

export default AuditIQFooter
