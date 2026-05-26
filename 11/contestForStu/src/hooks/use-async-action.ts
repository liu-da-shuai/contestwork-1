import { useCallback, useState } from 'react'

export function useAsyncAction() {
  const [loadingAction, setLoadingAction] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const runQuery = useCallback(async function runQuery(label: string, query: () => Promise<void>) {
    try {
      setLoadingAction(label)
      setError('')
      await query()
    } catch (err) {
      setError(err instanceof Error ? err.message : `${label}失败`)
    } finally {
      setLoadingAction('')
    }
  }, [])

  const runSubmit = useCallback(async function runSubmit(
    action: () => Promise<string | void>,
    onSuccess?: (msg: string | void) => void
  ) {
    setMessage('')
    setError('')
    try {
      setSubmitting(true)
      const result = await action()
      if (typeof result === 'string') {
        setMessage(result)
      }
      onSuccess?.(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : '提交失败')
    } finally {
      setSubmitting(false)
    }
  }, [])

  return {
    loadingAction,
    error,
    message,
    submitting,
    setMessage,
    setError,
    runQuery,
    runSubmit,
  }
}
