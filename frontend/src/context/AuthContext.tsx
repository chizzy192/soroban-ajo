import React, { createContext, useContext, useEffect, useMemo } from 'react'
import { useAuth } from '../hooks/useAuth'
import type { StellarNetwork, WalletProvider, LoginParams, AuthSession } from '../types/auth'

interface AuthContextValue {
  isAuthenticated: boolean
  isLoading: boolean
  address: string | null
  network: StellarNetwork
  provider: WalletProvider | null
  session: AuthSession | null
  error: string | null
  login: (params: LoginParams) => Promise<void>
  logout: () => Promise<void>
  logoutAllDevices: () => Promise<void>
  refreshSession: () => Promise<boolean>
  setNetwork: (network: StellarNetwork) => void
  setRememberMe: (remember: boolean) => void
  clearError: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

interface AuthProviderProps {
  children: React.ReactNode
}

/**
 * Provides authentication state and actions to the component tree.
 * Wraps the Zustand-based useAuth hook in a React context so that
 * components can access auth without directly importing the store.
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const auth = useAuth()

  useEffect(() => {
    // Proactively refresh the session when it's close to expiring.
    // If the session has less than 5 minutes left, trigger a refresh.
    if (!auth.session) return

    const expiresAt = new Date(auth.session.expiresAt).getTime()
    const msUntilExpiry = expiresAt - Date.now()
    const refreshThreshold = 5 * 60 * 1000

    if (msUntilExpiry <= 0) return

    const refreshDelay = Math.max(msUntilExpiry - refreshThreshold, 0)
    const timer = setTimeout(() => {
      auth.refreshSession()
    }, refreshDelay)

    return () => clearTimeout(timer)
  }, [auth.session, auth.refreshSession])

  const value = useMemo<AuthContextValue>(
    () => ({
      isAuthenticated: auth.isAuthenticated,
      isLoading: auth.isLoading,
      address: auth.address,
      network: auth.network,
      provider: auth.provider,
      session: auth.session,
      error: auth.error,
      login: auth.login,
      logout: auth.logout,
      logoutAllDevices: auth.logoutAllDevices,
      refreshSession: auth.refreshSession,
      setNetwork: auth.setNetwork,
      setRememberMe: auth.setRememberMe,
      clearError: auth.clearError,
    }),
    [
      auth.isAuthenticated,
      auth.isLoading,
      auth.address,
      auth.network,
      auth.provider,
      auth.session,
      auth.error,
      auth.login,
      auth.logout,
      auth.logoutAllDevices,
      auth.refreshSession,
      auth.setNetwork,
      auth.setRememberMe,
      auth.clearError,
    ],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

/**
 * Hook to consume the AuthContext. Throws if used outside AuthProvider.
 */
export function useAuthContext(): AuthContextValue {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider')
  }
  return context
}
