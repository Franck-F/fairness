'use client'

import Link from 'next/link'
import Image from 'next/image'
import { FaLinkedin, FaTwitter, FaGithub, FaYoutube } from 'react-icons/fa'

const sections = [
  {
    title: 'Produit',
    links: [
      { name: 'Fonctionnalites', href: '/#features' },
      { name: 'Tarifs', href: '/pricing' },
      { name: 'Demo', href: '/contact' },
      { name: 'Changelog', href: '/blog' },
    ],
  },
  {
    title: 'Entreprise',
    links: [
      { name: 'A propos', href: '/about' },
      { name: 'Blog', href: '/blog' },
      { name: 'Carrieres', href: '/careers' },
      { name: 'Contact', href: '/contact' },
    ],
  },
  {
    title: 'Ressources',
    links: [
      { name: 'Documentation', href: '/blog' },
      { name: 'API Reference', href: '/blog' },
      { name: 'Support', href: '/contact' },
      { name: 'Statut', href: '/contact' },
    ],
  },
]

const socialLinks = [
  { icon: FaLinkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
  { icon: FaTwitter, href: 'https://twitter.com', label: 'Twitter' },
  { icon: FaGithub, href: 'https://github.com', label: 'GitHub' },
  { icon: FaYoutube, href: 'https://youtube.com', label: 'YouTube' },
]

const legalLinks = [
  { name: 'Conditions Generales', href: '/legal/terms' },
  { name: 'Politique de Confidentialite', href: '/legal/privacy' },
  { name: 'Mentions Legales', href: '/legal/cgu' },
]

export function AuditIQFooter() {
  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-16">
        <div className="flex w-full flex-col justify-between gap-10 lg:flex-row lg:items-start">
          {/* Logo & Description */}
          <div className="flex w-full flex-col gap-6 lg:max-w-sm">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="https://customer-assets.emergentagent.com/job_auditiq/artifacts/snxql2e8_logo%20audiot-iq%20big%20without%20bg.png.png"
                alt="AuditIQ Logo"
                width={140}
                height={56}
                className="object-contain"
              />
            </Link>
            <p className="text-sm text-muted-foreground">
              La plateforme SaaS leader pour l'audit de fairness et la detection de biais 
              dans les systemes d'Intelligence Artificielle. Conforme AI Act 2024.
            </p>
            <ul className="flex items-center space-x-4">
              {socialLinks.map((social, idx) => (
                <li key={idx}>
                  <a 
                    href={social.href} 
                    aria-label={social.label}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-2 rounded-lg transition-colors text-muted-foreground hover:text-primary hover:bg-primary/10"
                  >
                    <social.icon className="size-5" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Navigation Sections */}
          <div className="grid w-full gap-8 sm:grid-cols-3 lg:gap-16">
            {sections.map((section, sectionIdx) => (
              <div key={sectionIdx}>
                <h3 className="mb-4 font-bold text-foreground">
                  {section.title}
                </h3>
                <ul className="space-y-3">
                  {section.links.map((link, linkIdx) => (
                    <li key={linkIdx}>
                      <Link 
                        href={link.href}
                        className="text-sm transition-colors text-muted-foreground hover:text-primary"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col justify-between gap-4 border-t border-border pt-8 text-xs md:flex-row md:items-center">
          <p className="order-2 lg:order-1 text-muted-foreground">
            2026 AuditIQ SaaS. Tous droits reserves.
          </p>
          <ul className="order-1 flex flex-wrap gap-4 md:order-2">
            {legalLinks.map((link, idx) => (
              <li key={idx}>
                <Link 
                  href={link.href}
                  className="transition-colors text-muted-foreground hover:text-primary"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  )
}

export default AuditIQFooter
