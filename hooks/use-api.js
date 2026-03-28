import useSWR from 'swr'
import { useAuth } from '@/lib/auth-context'

function createFetcher(token) {
  return async (url) => {
    const res = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
    if (!res.ok) {
      const error = new Error('Erreur lors du chargement')
      error.status = res.status
      throw error
    }
    return res.json()
  }
}

export function useApi(url, options = {}) {
  const { session } = useAuth()
  const token = session?.access_token

  const { data, error, isLoading, isValidating, mutate } = useSWR(
    token && url ? url : null,
    createFetcher(token),
    {
      revalidateOnFocus: false,
      dedupingInterval: 5000,
      ...options,
    }
  )

  return {
    data,
    error,
    isLoading,
    isValidating,
    mutate,
  }
}

export function useAudits(page = 1, limit = 20) {
  return useApi(`/api/audits?page=${page}&limit=${limit}`)
}

export function useAudit(id) {
  return useApi(id ? `/api/audits/${id}` : null)
}

export function useDatasets(page = 1, limit = 20) {
  return useApi(`/api/datasets?page=${page}&limit=${limit}`)
}
