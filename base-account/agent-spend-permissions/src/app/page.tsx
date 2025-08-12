'use client'

import React, { useState, useEffect } from 'react'
import { SignInWithBaseButton } from '@/components/SignInWithBase'
import { ChatInterface } from '@/components/ChatInterface'
import { SpendPermissionSetup } from '@/components/SpendPermissionSetup'

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userAddress, setUserAddress] = useState<string>()
  const [hasSpendPermission, setHasSpendPermission] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is already authenticated
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      // This would typically check for a valid session
      // For now, we'll just set loading to false
      setIsLoading(false)
    } catch (error) {
      console.error('Auth check error:', error)
      setIsLoading(false)
    }
  }

  const handleSignIn = async (address: string) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          address,
        }),
      })

      const data = await response.json()

      if (data.ok) {
        setIsAuthenticated(true)
        setUserAddress(address)
      } else {
        console.error('Authentication failed:', data.error)
      }
    } catch (error) {
      console.error('Sign in error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handlePermissionGranted = () => {
    setHasSpendPermission(true)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-base-blue"></div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Zora Coins Agent</h1>
              <p className="text-gray-600">Buy any creator coin with your Base Account</p>
            </div>
            <div className="flex items-center space-x-4">
              {isAuthenticated && (
                <div className="text-sm text-gray-600">
                  {userAddress?.slice(0, 6)}...{userAddress?.slice(-4)}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!isAuthenticated ? (
          <div className="text-center">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Welcome to Zora Coins Agent
              </h2>
              <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                Start buying creator coins with your Base Account.
              </p>
              <div className="mb-8 flex justify-center">
                <SignInWithBaseButton onSignIn={handleSignIn} colorScheme="light" />
              </div>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="w-12 h-12 bg-base-blue rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <span className="text-white font-bold">1</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Sign In</h3>
                <p className="text-sm text-gray-600">Sign in with your Base Account</p>
              </div>
              
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="w-12 h-12 bg-base-blue rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <span className="text-white font-bold">2</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Set Limits</h3>
                <p className="text-sm text-gray-600">Configure your daily spending limits ($20-$100)</p>
              </div>
              
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="w-12 h-12 bg-base-blue rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <span className="text-white font-bold">3</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Buy Coins</h3>
                <p className="text-sm text-gray-600">Chat with the agent to buy Zora creator coins</p>
              </div>
            </div>
          </div>
        ) : !hasSpendPermission ? (
          <div className="text-center">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Almost Ready!
              </h2>
              <p className="text-gray-600 mb-8">
                Set up your spending permissions to start using the agent.
              </p>
            </div>
            <SpendPermissionSetup 
              userAddress={userAddress!} 
              onPermissionGranted={handlePermissionGranted} 
            />
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 chat-container overflow-hidden">
            <ChatInterface isAuthenticated={isAuthenticated} userAddress={userAddress} />
          </div>
        )}
      </div>
    </main>
  )
}