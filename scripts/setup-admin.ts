import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { Timestamp, doc, setDoc } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyD2ZeFKBfqqZ0Qxvz_6wMWXlpf0LRiFLzQ",
  authDomain: "webdesigntest-12d11.firebaseapp.com",
  projectId: "webdesigntest-12d11",
  storageBucket: "webdesigntest-12d11.firebasestorage.app",
  messagingSenderId: "504944796544",
  appId: "1:504944796544:web:b14fcaa569d03ce2499765"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

// Run this script to set up the first admin user
const ADMIN_USER_ID = 'HVXDKgHn99hxq8XRMKz5oORoVAd2' // Your user ID
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