'use client'

import { createContext, useContext, useState, useCallback } from 'react'
import fr from './fr'
import en from './en'

const translations = { fr, en }

const I18nContext = createContext(null)

export function I18nProvider({ children, defaultLocale = 'fr' }) {
  const [locale, setLocale] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auditiq_locale') || defaultLocale
    }
    return defaultLocale
  })

  const changeLocale = useCallback((newLocale) => {
    if (translations[newLocale]) {
      setLocale(newLocale)
      if (typeof window !== 'undefined') {
        localStorage.setItem('auditiq_locale', newLocale)
      }
    }
  }, [])

  const t = useCallback((key) => {
    const keys = key.split('.')
    let value = translations[locale]
    for (const k of keys) {
      value = value?.[k]
    }
    return value || key
  }, [locale])

  return (
    <I18nContext.Provider value={{ locale, setLocale: changeLocale, t, availableLocales: ['fr', 'en'] }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (!context) {
    // Fallback for when provider is not mounted
    return {
      locale: 'fr',
      setLocale: () => {},
      t: (key) => {
        const keys = key.split('.')
        let value = fr
        for (const k of keys) {
          value = value?.[k]
        }
        return value || key
      },
      availableLocales: ['fr', 'en'],
    }
  }
  return context
}
