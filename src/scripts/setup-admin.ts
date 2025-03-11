import { initializeApp } from 'firebase/app'
import { getFirestore, serverTimestamp } from 'firebase/firestore'
import { doc, setDoc } from 'firebase/firestore'
import type { UserProfile } from '@/lib/firebase/schema'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

// Run this script to set up the first admin user
const ADMIN_USER_ID = 'default-admin'
const DEFAULT_ORG_ID = 'default-org'
const ADMIN_EMAIL = 'admin@example.com' // Add your admin email here

export async function setupAdmin() {
  try {
    // Create default organization
    const orgRef = doc(db, 'organizations', DEFAULT_ORG_ID)
    await setDoc(orgRef, {
      name: 'Default Organization',
      createdBy: ADMIN_USER_ID,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    })

    // Create admin user
    const userRef = doc(db, 'users', ADMIN_USER_ID)
    const userData: UserProfile = {
      userId: ADMIN_USER_ID,
      email: ADMIN_EMAIL,
      role: 'admin',
      organizationId: DEFAULT_ORG_ID,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    }
    await setDoc(userRef, userData)
    
    console.log('Admin user and organization created successfully')
  } catch (error) {
    console.error('Error creating admin:', error)
    throw error
  }
}