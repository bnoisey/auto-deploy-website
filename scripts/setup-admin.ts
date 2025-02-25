import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { Timestamp, doc, setDoc } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: REDACTED,
  authDomain: REDACTED,
  projectId: REDACTED,
  storageBucket: REDACTED,
  messagingSenderId: REDACTED,
  appId: REDACTED
};

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

// Run this script to set up the first admin user
const ADMIN_USER_ID = REDACTED // Your user ID
const DEFAULT_ORG_ID = 'default-org'

async function setupAdmin() {
  try {
    // Create default organization
    const orgRef = doc(db, 'organizations', DEFAULT_ORG_ID)
    await setDoc(orgRef, {
      name: 'Default Organization',
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    })

    // Create admin user
    const userRef = doc(db, 'users', ADMIN_USER_ID)
    await setDoc(userRef, {
      userId: ADMIN_USER_ID,
      role: 'admin',
      organizationId: DEFAULT_ORG_ID,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    })
    console.log('Admin user and organization created successfully')
  } catch (error) {
    console.error('Error creating admin:', error)
  }
}

setupAdmin() 
