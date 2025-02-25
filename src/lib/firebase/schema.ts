import { collection, addDoc, Timestamp, doc, setDoc, getDoc, query, where, getDocs, deleteDoc } from 'firebase/firestore'
import { db } from '../firebase'

// User Roles and Permissions
export type UserRole = 'admin' | 'team'

export interface UserProfile {
  userId: string
  email: string
  displayName?: string
  photoURL?: string
  role: UserRole
  organizationId: string
  createdAt: Timestamp
  updatedAt: Timestamp
}

// Organization
export interface Organization {
  id: string
  name: string
  createdAt: Timestamp
  updatedAt: Timestamp
}

// Invitation
export interface Invitation {
  id: string
  email: string
  organizationId: string
  role: UserRole
  status: 'pending' | 'accepted'
  invitedBy: string
  createdAt: Timestamp
  updatedAt: Timestamp
}

// Organization Management
export const createOrganization = async (name: string, creatorUserId: string): Promise<string> => {
  try {
    // Create the organization
    const orgRef = doc(collection(db, 'organizations'))
    await setDoc(orgRef, {
      name,
      createdBy: creatorUserId,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    })

    // Update the creator's profile with organization ID and admin role
    const userRef = doc(db, 'users', creatorUserId)
    await setDoc(userRef, {
      organizationId: orgRef.id,
      role: 'admin'
    }, { merge: true })

    return orgRef.id
  } catch (error) {
    console.error('Error creating organization:', error)
    throw error
  }
}

// User Management
export const createUserProfile = async ({
  userId,
  email,
  role = 'team',
  organizationId,
}: {
  userId: string
  email?: string
  role?: UserRole
  organizationId: string
}) => {
  try {
    const userRef = doc(db, 'users', userId)
    await setDoc(userRef, {
      userId,
      email,
      role,
      organizationId,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    })
  } catch (error) {
    console.error('Error creating user profile:', error)
    throw error
  }
}

// Get user's profile
export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  try {
    const userRef = doc(db, 'users', userId)
    const userDoc = await getDoc(userRef)
    
    if (userDoc.exists()) {
      return userDoc.data() as UserProfile
    }
    return null
  } catch (error) {
    console.error('Error getting user profile:', error)
    throw error
  }
}

// Get organization
export const getOrganization = async (organizationId: string): Promise<Organization | null> => {
  try {
    const orgRef = doc(db, 'organizations', organizationId)
    const orgDoc = await getDoc(orgRef)
    
    if (orgDoc.exists()) {
      return { id: orgDoc.id, ...orgDoc.data() } as Organization
    }
    return null
  } catch (error) {
    console.error('Error getting organization:', error)
    throw error
  }
}

// Reports
export const saveReport = async (userId: string, postalCode: string) => {
  try {
    const reportData = {
      userId,
      postalCode,
      searchedAt: Timestamp.now(),
    }

    await addDoc(collection(db, 'reports'), reportData)
  } catch (error) {
    console.error('Error saving report:', error)
    throw error
  }
}

// Invite team member
export const inviteTeamMember = async (email: string, organizationId: string, role: UserRole, invitedBy: string) => {
  try {
    const inviteRef = doc(collection(db, 'invitations'))
    await setDoc(inviteRef, {
      email,
      organizationId,
      role,
      status: 'pending',
      invitedBy,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    })
    return inviteRef.id
  } catch (error) {
    console.error('Error creating invitation:', error)
    throw error
  }
}

// Get organization members
export const getOrganizationMembers = async (organizationId: string): Promise<UserProfile[]> => {
  try {
    const usersRef = collection(db, 'users')
    const q = query(usersRef, where('organizationId', '==', organizationId))
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(doc => doc.data() as UserProfile)
  } catch (error) {
    console.error('Error getting organization members:', error)
    throw error
  }
}

// Get pending invitations
export const getPendingInvitations = async (organizationId: string): Promise<Invitation[]> => {
  try {
    const invitationsRef = collection(db, 'invitations')
    const q = query(
      invitationsRef, 
      where('organizationId', '==', organizationId),
      where('status', '==', 'pending')
    )
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Invitation))
  } catch (error) {
    console.error('Error getting invitations:', error)
    throw error
  }
}

// Add these functions
export const updateOrganization = async (orgId: string, updates: Partial<Organization>) => {
  try {
    const orgRef = doc(db, 'organizations', orgId)
    await setDoc(orgRef, { ...updates, updatedAt: Timestamp.now() }, { merge: true })
  } catch (error) {
    console.error('Error updating organization:', error)
    throw error
  }
}

export const deleteOrganization = async (orgId: string) => {
  try {
    // First, get all members
    const members = await getOrganizationMembers(orgId)
    
    // Remove organization ID from all members
    await Promise.all(members.map(member => 
      setDoc(doc(db, 'users', member.userId), 
        { organizationId: null, role: null }, 
        { merge: true }
      )
    ))

    // Delete all pending invitations
    const invites = await getPendingInvitations(orgId)
    await Promise.all(invites.map(invite => 
      deleteDoc(doc(db, 'invitations', invite.id))
    ))

    // Finally delete the organization
    await deleteDoc(doc(db, 'organizations', orgId))
  } catch (error) {
    console.error('Error deleting organization:', error)
    throw error
  }
}

export const updateMemberRole = async (userId: string, organizationId: string, newRole: 'admin' | 'team') => {
  try {
    await setDoc(doc(db, 'users', userId), 
      { role: newRole, updatedAt: Timestamp.now() }, 
      { merge: true }
    )
  } catch (error) {
    console.error('Error updating member role:', error)
    throw error
  }
}

// Add this function
export const resendInvitation = async (invitationId: string) => {
  try {
    // Create a resend subcollection document to trigger the Cloud Function
    const resendRef = doc(collection(db, `invitations/${invitationId}/resends`))
    await setDoc(resendRef, {
      timestamp: Timestamp.now()
    })
    return true
  } catch (error) {
    console.error('Error resending invitation:', error)
    throw error
  }
}