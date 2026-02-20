import React, { useState } from 'react'
import { useAuthContext } from '../context/AuthContext'
import type { WalletProvider } from '../types/auth'

const WALLET_OPTIONS: { provider: WalletProvider; label: string; description: string }[] = [
  {
    provider: 'freighter',
    label: 'Freighter',
    description: 'Browser extension for Stellar',
  },
  {
    provider: 'albedo',
    label: 'Albedo',
    description: 'Web-based Stellar wallet (coming soon)',
  },
  {
    provider: 'xbull',
    label: 'xBull',
    description: 'Multi-platform Stellar wallet (coming soon)',
  },
]

export const Login: React.FC = () => {
  const { login, isLoading, error, clearError } = useAuthContext()
  const [rememberMe, setRememberMe] = useState(false)
  const [selectedProvider, setSelectedProvider] = useState<WalletProvider | null>(null)

  const handleLogin = async (provider: WalletProvider) => {
    setSelectedProvider(provider)
    clearError()

    try {
      await login({ provider, rememberMe })
    } catch {
      // Error state is managed by the store
    } finally {
      setSelectedProvider(null)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-[70vh] px-4">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-3xl mb-4 shadow-lg">
            🪙
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome to Soroban Ajo</h1>
          <p className="mt-2 text-gray-600">
            Connect your Stellar wallet to start saving with your community
          </p>
        </div>

        {/* Error banner */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 flex items-start gap-3">
            <svg className="w-5 h-5 text-red-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="flex-1">
              <p className="text-sm text-red-800 font-medium">Connection failed</p>
              <p className="text-sm text-red-600 mt-0.5">{error}</p>
            </div>
            <button
              onClick={clearError}
              className="text-red-400 hover:text-red-600 transition"
              aria-label="Dismiss error"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {/* Wallet options */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Connect Wallet</h2>
            <p className="text-sm text-gray-500 mt-1">
              Choose a wallet provider to sign in securely
            </p>
          </div>

          <div className="p-4 space-y-3">
            {WALLET_OPTIONS.map(({ provider, label, description }) => {
              const isConnecting = isLoading && selectedProvider === provider
              const isDisabled = isLoading || (provider !== 'freighter')

              return (
                <button
                  key={provider}
                  onClick={() => handleLogin(provider)}
                  disabled={isDisabled}
                  className={`
                    w-full flex items-center gap-4 p-4 rounded-xl border transition
                    ${isDisabled && provider !== 'freighter'
                      ? 'border-gray-100 bg-gray-50 opacity-60 cursor-not-allowed'
                      : isConnecting
                        ? 'border-blue-300 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50 cursor-pointer'
                    }
                  `}
                >
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center shrink-0">
                    <WalletIcon provider={provider} />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-medium text-gray-900">{label}</p>
                    <p className="text-xs text-gray-500">{description}</p>
                  </div>
                  {isConnecting ? (
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
                  ) : (
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  )}
                </button>
              )
            })}
          </div>

          {/* Remember me */}
          <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <div>
                <span className="text-sm font-medium text-gray-700">Remember me</span>
                <p className="text-xs text-gray-500">Stay signed in for 7 days on this device</p>
              </div>
            </label>
          </div>
        </div>

        {/* Security note */}
        <div className="mt-6 flex items-start gap-2 text-xs text-gray-500">
          <svg className="w-4 h-4 mt-0.5 shrink-0 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <p>
            Your private keys never leave your wallet. We only request your public
            address and a signature to verify ownership.
          </p>
        </div>
      </div>
    </div>
  )
}

/** Simple icon component for each wallet provider */
const WalletIcon: React.FC<{ provider: WalletProvider }> = ({ provider }) => {
  switch (provider) {
    case 'freighter':
      return (
        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    case 'albedo':
      return (
        <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      )
    case 'xbull':
      return (
        <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    default:
      return null
  }
}
