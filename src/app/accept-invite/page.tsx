'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { doc, getDoc, updateDoc, Timestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { auth } from '@/lib/firebase'

export default function AcceptInvite() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const acceptInvite = async () => {
      const invitationId = searchParams.get('id')
      if (!invitationId) {
        setError('Invalid invitation link')
        setIsLoading(false)
        return
      }

      try {
        const invitationRef = doc(db, 'invitations', invitationId)
        const invitationDoc = await getDoc(invitationRef)

        if (!invitationDoc.exists()) {
          setError('Invitation not found')
          setIsLoading(false)
          return
        }

        const invitationData = invitationDoc.data()
        if (invitationData.accepted) {
          setError('Invitation has already been accepted')
          setIsLoading(false)
          return
        }

        // Create user account
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          invitationData.email,
          'temporary-password' // User should change this immediately
        )

        // Update user profile in Firestore
        await updateDoc(doc(db, 'users', userCredential.user.uid), {
          email: invitationData.email,
          role: 'team',
          organizationId: invitationData.organizationId,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now()
        })

        // Mark invitation as accepted
        await updateDoc(invitationRef, {
          accepted: true,
          acceptedAt: Timestamp.now()
        })

        // Redirect to dashboard
        router.push('/dashboard')
      } catch (error) {
        console.error('Error accepting invitation:', error)
        setError('Failed to accept invitation')
        setIsLoading(false)
      }
    }

    acceptInvite()
  }, [router, searchParams])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Processing Invitation</h2>
          <p className="text-gray-600">Please wait...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2 text-red-600">Error</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    )
  }

  return null
} 