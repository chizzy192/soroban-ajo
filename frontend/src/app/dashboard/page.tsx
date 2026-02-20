'use client'

import { WalletConnector } from '@/components/WalletConnector'
import { DashboardLayout } from '@/components/DashboardLayout'
import { useAuth } from '@/hooks/useAuth'

export default function DashboardPage() {
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full">
          <h1 className="text-3xl font-bold text-center mb-8">Connect Your Wallet</h1>
          <WalletConnector />
        </div>
      </div>
    )
  }

  return <DashboardLayout />
}
