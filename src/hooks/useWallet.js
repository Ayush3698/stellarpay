import { useState, useCallback } from 'react'
import {
  isConnected,
  requestAccess,
  getPublicKey,
  signTransaction,
} from '@stellar/freighter-api'

export function useWallet() {
  const [address, setAddress] = useState(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState(null)

  const connect = useCallback(async () => {
    setIsConnecting(true)
    setError(null)
    try {
      // Check extension is installed
      const connected = await isConnected()
      if (!connected) {
        throw new Error(
          'Freighter not found. Please install it from freighter.app'
        )
      }

      // requestAccess() triggers the Freighter permission popup
      // This is required before getPublicKey() will return a value
      const accessResult = await requestAccess()

      // Freighter v2 API: requestAccess returns { address } or { error }
      if (accessResult?.error) {
        throw new Error(accessResult.error)
      }

      // Try address from requestAccess first, then fallback to getPublicKey
      let pubKey = accessResult?.address || accessResult
      if (!pubKey || typeof pubKey !== 'string') {
        pubKey = await getPublicKey()
      }

      if (!pubKey || typeof pubKey !== 'string') {
        throw new Error('Could not get public key. Please unlock Freighter and try again.')
      }

      setAddress(pubKey)
      return pubKey
    } catch (e) {
      const msg = e?.message || String(e)
      setError(msg)
      throw e
    } finally {
      setIsConnecting(false)
    }
  }, [])

  const disconnect = useCallback(() => {
    setAddress(null)
    setError(null)
  }, [])

  const sign = useCallback(async (xdr, networkPassphrase) => {
    return await signTransaction(xdr, { networkPassphrase })
  }, [])

  return { address, isConnecting, error, connect, disconnect, sign }
}
