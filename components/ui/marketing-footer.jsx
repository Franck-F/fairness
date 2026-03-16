import Image from 'next/image'
import Link from 'next/link'

import { Button } from '@/components/ui/button'

const logoUrl = 'https://customer-assets.emergentagent.com/job_auditiq/artifacts/snxql2e8_logo%20audiot-iq%20big%20without%20bg.png.png'

export function MarketingFooter() {
  return (
    <footer className="border-t border-white/8 px-5 py-10 sm:px-8 lg:px-10">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr]">
        <div>
          <Image src={logoUrl} alt="AuditIQ" width={118} height={28} className="h-auto w-[110px] brightness-150" />
          <p className="mt-4 max-w-sm text-sm leading-7 text-white/55">
            AuditIQ structure les audits, centralise les preuves et aide les organisations a traiter la conformite IA comme un systeme operationnel.
          </p>
          <div className="mt-5 flex max-w-sm gap-2">
            <input
              type="email"
              placeholder="name@email.com"
              className="min-w-0 flex-1 rounded-full border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none placeholder:text-white/25"
            />
            <Button className="rounded-full bg-brand-primary px-5 text-white hover:bg-brand-primary/90">S abonner</Button>
          </div>
        </div>

        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/40">Liens</p>
          <div className="mt-4 space-y-3 text-sm text-white/62">
            <Link href="/about" className="block hover:text-white">À propos</Link>
            <Link href="/pricing" className="block hover:text-white">Tarifs</Link>
            <Link href="/contact" className="block hover:text-white">Contact</Link>
          </div>
        </div>

        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/40">Pages</p>
          <div className="mt-4 space-y-3 text-sm text-white/62">
            <Link href="/" className="block hover:text-white">Accueil</Link>
            <Link href="/blog" className="block hover:text-white">Blog</Link>
            <Link href="/legal/privacy" className="block hover:text-white">Confidentialité</Link>
            <Link href="/legal/terms" className="block hover:text-white">CGU</Link>
          </div>
        </div>

        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/40">Réseaux</p>
          <div className="mt-4 space-y-3 text-sm text-white/62">
            <a href="https://www.linkedin.com" target="_blank" rel="noreferrer" className="block hover:text-white">LinkedIn</a>
            <a href="https://x.com" target="_blank" rel="noreferrer" className="block hover:text-white">Twitter</a>
            <a href="https://www.instagram.com" target="_blank" rel="noreferrer" className="block hover:text-white">Instagram</a>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-10 flex max-w-7xl flex-col gap-3 border-t border-white/8 pt-5 text-xs text-white/35 sm:flex-row sm:items-center sm:justify-between">
        <p>Inspiré du template Framer, adapté pour AuditIQ.</p>
        <p>Copyright 2026 AuditIQ. Tous droits réservés.</p>
      </div>
    </footer>
  )
}

export default MarketingFooter