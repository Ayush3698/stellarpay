import { useState, useCallback } from 'react'
import {
  Horizon,
  TransactionBuilder,
  Networks,
  BASE_FEE,
  Asset,
  Operation,
  Memo,
} from '@stellar/stellar-sdk'

const server = new Horizon.Server('https://horizon-testnet.stellar.org')
const NETWORK = Networks.TESTNET

export function useStellar() {
  const [balance, setBalance] = useState(null)
  const [isFetching, setIsFetching] = useState(false)

  const fetchBalance = useCallback(async (address) => {
    if (!address) return
    setIsFetching(true)
    try {
      const account = await server.loadAccount(address)
      const xlm = account.balances.find((b) => b.asset_type === 'native')
      const bal = xlm ? xlm.balance : '0'
      setBalance(bal)
      return bal
    } catch {
      setBalance('0')
      return '0'
    } finally {
      setIsFetching(false)
    }
  }, [])

  const fundAccount = useCallback(async (address) => {
    const res = await fetch(`https://friendbot.stellar.org?addr=${encodeURIComponent(address)}`)
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err?.detail || 'Friendbot request failed')
    }
    return true
  }, [])

  const sendPayment = useCallback(async ({ from, to, amount, memo, signFn }) => {
    // Load source account
    const sourceAccount = await server.loadAccount(from)

    // Check if destination exists
    let destExists = true
    try { await server.loadAccount(to) } catch { destExists = false }

    const builder = new TransactionBuilder(sourceAccount, {
      fee: BASE_FEE,
      networkPassphrase: NETWORK,
    }).setTimeout(300)

    if (memo?.trim()) {
      builder.addMemo(Memo.text(memo.trim().slice(0, 28)))
    }

    if (!destExists) {
      builder.addOperation(
        Operation.createAccount({ destination: to, startingBalance: String(amount) })
      )
    } else {
      builder.addOperation(
        Operation.payment({ destination: to, asset: Asset.native(), amount: String(amount) })
      )
    }

    const tx = builder.build()
    const signedXdr = await signFn(tx.toXDR(), NETWORK)
    const result = await server.submitTransaction(
      TransactionBuilder.fromXDR(signedXdr, NETWORK)
    )
    return { hash: result.hash, ledger: result.ledger }
  }, [])

  return { balance, isFetching, fetchBalance, fundAccount, sendPayment }
}
