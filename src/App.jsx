import React, { useEffect, useState } from 'react'
import { useWallet } from './hooks/useWallet'
import { useStellar } from './hooks/useStellar'
import styles from './App.module.css'

function shortAddr(addr) {
  return addr ? addr.slice(0, 6) + '...' + addr.slice(-6) : ''
}

export default function App() {
  const { address, isConnecting, error: walletError, connect, disconnect, sign } = useWallet()
  const { balance, isFetching, fetchBalance, fundAccount, sendPayment } = useStellar()

  const [dest, setDest] = useState('')
  const [amount, setAmount] = useState('')
  const [memo, setMemo] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [isFunding, setIsFunding] = useState(false)
  const [toast, setToast] = useState(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (address) fetchBalance(address)
  }, [address])

  function showToast(type, title, detail, hash) {
    setToast({ type, title, detail, hash })
    if (type === 'success') setTimeout(() => setToast(null), 12000)
  }

  async function handleConnect() {
    try {
      await connect()
    } catch (e) {
      // error already set in hook
    }
  }

  async function handleFund() {
    setIsFunding(true)
    try {
      await fundAccount(address)
      await fetchBalance(address)
      showToast('success', 'Funded!', '10,000 testnet XLM added to your account.')
    } catch (e) {
      showToast('error', 'Funding failed', e.message)
    } finally {
      setIsFunding(false)
    }
  }

  async function handleSend() {
    if (!dest.startsWith('G') || dest.length !== 56) {
      showToast('error', 'Invalid address', 'Must be a valid Stellar public key starting with G (56 chars)')
      return
    }
    const amt = parseFloat(amount)
    if (!amt || amt <= 0) {
      showToast('error', 'Invalid amount', 'Enter a positive XLM amount')
      return
    }
    if (amt > parseFloat(balance || 0)) {
      showToast('error', 'Insufficient balance', `You have ${parseFloat(balance).toFixed(4)} XLM`)
      return
    }

    setIsSending(true)
    try {
      const result = await sendPayment({ from: address, to: dest, amount: amt.toFixed(7), memo, signFn: sign })
      showToast('success', 'Transaction sent!', `${amt} XLM sent to ${shortAddr(dest)}`, result.hash)
      setDest('')
      setAmount('')
      setMemo('')
      await fetchBalance(address)
    } catch (e) {
      showToast('error', 'Transaction failed', e.message || 'Something went wrong')
    } finally {
      setIsSending(false)
    }
  }

  function copyAddress() {
    navigator.clipboard.writeText(address)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>

        {/* ── Header ── */}
        <header className={styles.header}>
          <div className={styles.logoRow}>
            <div className={styles.logoIcon}>✦</div>
            <span className={styles.logoText}>STELLARPAY</span>
          </div>
          <span className={styles.testnetBadge}>✦ TESTNET</span>
          <p className={styles.tagline}>XLM Payments on Stellar</p>
        </header>

        {/* ── Wallet not connected ── */}
        {!address ? (
          <div className={styles.card}>
            <div className={styles.connectBox}>
              <div className={styles.connectIcon}>◈</div>
              <h2 className={styles.connectTitle}>Connect Your Wallet</h2>
              <p className={styles.connectSub}>
                Use the Freighter browser extension to connect to the Stellar
                testnet and start sending XLM.
              </p>
              {walletError && <div className={styles.errorBox}>{walletError}</div>}
              <button className={styles.btnPrimary} onClick={handleConnect} disabled={isConnecting}>
                {isConnecting ? <><span className={styles.spinner} /> Connecting...</> : '◈  Connect Freighter Wallet'}
              </button>
              <p className={styles.hint}>
                Don't have Freighter?{' '}
                <a href="https://freighter.app" target="_blank" rel="noopener noreferrer" className={styles.link}>
                  Install it here →
                </a>
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* ── Wallet header bar ── */}
            <div className={styles.card}>
              <div className={styles.walletRow}>
                <div>
                  <div className={styles.liveRow}>
                    <span className={styles.dot} /> Connected
                  </div>
                  <div className={styles.walletAddr}>{shortAddr(address)}</div>
                </div>
                <div className={styles.walletBtns}>
                  <button className={styles.btnIcon} onClick={copyAddress}>{copied ? '✓ Copied' : '⧉ Copy'}</button>
                  <button className={styles.btnDanger} onClick={disconnect}>✕ Disconnect</button>
                </div>
              </div>
            </div>

            {/* ── Balance ── */}
            <div className={styles.card}>
              <div className={styles.balanceHeader}>
                <span className={styles.sectionLabel}>XLM Balance</span>
                <button className={styles.refreshBtn} onClick={() => fetchBalance(address)} disabled={isFetching}>
                  {isFetching ? <span className={styles.spinnerSm} /> : '↻'}
                </button>
              </div>
              <div className={styles.balanceDisplay}>
                {balance === null
                  ? <span className={styles.muted}>loading...</span>
                  : <><span className={styles.balAmount}>{parseFloat(balance).toFixed(4)}</span><span className={styles.balUnit}>XLM</span></>
                }
              </div>
              {balance !== null && (
                <div className={styles.usdEst}>≈ ${(parseFloat(balance) * 0.11).toFixed(2)} USD (estimated)</div>
              )}
              <div className={styles.divider} />
              <div className={styles.infoRow}>
                <span className={styles.muted}>Network</span>
                <span className={styles.goldBadge}>✦ Testnet</span>
              </div>
              <button className={styles.friendbotBtn} onClick={handleFund} disabled={isFunding}>
                {isFunding ? <><span className={styles.spinner} /> Requesting...</> : '✦  Fund via Friendbot (free testnet XLM)'}
              </button>
            </div>

            {/* ── Send ── */}
            <div className={styles.card}>
              <div className={styles.sectionLabel} style={{ marginBottom: '1.25rem' }}>Send XLM</div>

              <label className={styles.fieldLabel}>Recipient Address</label>
              <input
                className={styles.input}
                type="text"
                placeholder="G... (Stellar public key, 56 chars)"
                value={dest}
                onChange={e => setDest(e.target.value)}
              />

              <label className={styles.fieldLabel}>Amount (XLM)</label>
              <input
                className={styles.input}
                type="number"
                placeholder="0.00"
                min="0.0000001"
                step="0.1"
                value={amount}
                onChange={e => setAmount(e.target.value)}
              />

              <label className={styles.fieldLabel}>Memo <span className={styles.muted}>(optional, max 28 chars)</span></label>
              <input
                className={styles.input}
                type="text"
                placeholder="Payment note"
                maxLength={28}
                value={memo}
                onChange={e => setMemo(e.target.value)}
              />

              <button className={styles.btnSend} onClick={handleSend} disabled={isSending}>
                {isSending ? <><span className={styles.spinner} /> Sending...</> : '✦  Send XLM'}
              </button>
            </div>

            {/* ── Toast ── */}
            {toast && (
              <div className={`${styles.toast} ${toast.type === 'success' ? styles.toastSuccess : styles.toastError}`}>
                <span className={styles.toastIcon}>{toast.type === 'success' ? '✓' : '✕'}</span>
                <div>
                  <strong>{toast.title}</strong>
                  <div className={styles.toastDetail}>{toast.detail}</div>
                  {toast.hash && (
                    <a
                      className={styles.txLink}
                      href={`https://stellar.expert/explorer/testnet/tx/${toast.hash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View on Stellar Expert: {toast.hash.slice(0, 16)}...
                    </a>
                  )}
                </div>
                <button className={styles.toastClose} onClick={() => setToast(null)}>✕</button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
