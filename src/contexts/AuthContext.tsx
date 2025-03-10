'use client'

import { createContext, useContext } from 'react';
import { 
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  deleteUser,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword as firebaseUpdatePassword
} from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';  // Import Firestore instance

type AuthContextType = {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  deleteAccount: () => Promise<void>;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, loading] = useAuthState(auth);

  const signIn = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signUp = async (email: string, password: string) => {
    await createUserWithEmailAndPassword(auth, email, password);
  };
const router = useRouter()
  const logout = async () => {
    await signOut(auth);
    router.push("/")
  };

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const deleteAccount = async () => {
    if (!auth.currentUser) return
    
    try {
      await deleteUser(auth.currentUser)
      // You might want to also delete user data from Firestore here
    } catch (error) {
      console.error('Error deleting account:', error)
      throw error
    }
  }

  const updatePassword = async (currentPassword: string, newPassword: string) => {
    if (!auth.currentUser || !auth.currentUser.email) return;

    try {
      // Re-authenticate user before changing password
      const credential = EmailAuthProvider.credential(
        auth.currentUser.email,
        currentPassword
      );
      await reauthenticateWithCredential(auth.currentUser, credential);
      
      // Update password
      await firebaseUpdatePassword(auth.currentUser, newPassword);
    } catch (error) {
      console.error('Error updating password:', error);
      throw error;
    }
  };

  // const value = {
  //   user: user || null,
  //   loading,
  //   signIn,
  //   signUp,
  //   logout,
  //   signInWithGoogle,
  //   deleteAccount,
  //   updatePassword,
  // };
  const getUserProfile = async () => {
    if (!auth.currentUser) return null;
  
    const userRef = doc(db, 'users', auth.currentUser.uid);
    const userSnap = await getDoc(userRef);
  
    if (userSnap.exists()) {
      return { userId: auth.currentUser.uid, ...userSnap.data() };
    } else {
      console.error("No user data found in Firestore");
      return null;
    }
  };
  
  const value = {
    user: user || null,
    loading,
    signIn,
    signUp,
    logout,
    signInWithGoogle,
    deleteAccount,
    updatePassword,
    getUserProfile, // Add this function to the context
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext); 