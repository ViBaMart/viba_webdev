"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from "firebase/auth";
import { getClientFirebase } from "@/lib/firebase/client";

export interface CustomerAuthUser {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  isDemo?: boolean;
}

interface CustomerAuthContextType {
  user: CustomerAuthUser | null;
  isLoading: boolean;
  error: string | null;
  signIn: (email: string, pass: string) => Promise<void>;
  signUp: (data: {
    email: string;
    pass: string;
    fullName: string;
    businessName: string;
    mobileNumber: string;
    businessAddress?: string;
  }) => Promise<void>;
  signOutCustomer: () => Promise<void>;
  signInDemoUser: (sampleEmail?: string, sampleName?: string, sampleBusiness?: string) => Promise<void>;
  getToken: () => Promise<string | null>;
  clearError: () => void;
}

const CustomerAuthContext = createContext<CustomerAuthContextType | undefined>(undefined);

export function CustomerAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<CustomerAuthUser | null>(() => {
    if (typeof window === "undefined") return null;
    try {
      const stored = localStorage.getItem("viba_demo_customer");
      if (stored) return JSON.parse(stored);
    } catch {
      // Ignore
    }
    return null;
  });
  const [isLoading, setIsLoading] = useState(() => typeof window !== "undefined" && Boolean(getClientFirebase().auth));
  const [error, setError] = useState<string | null>(null);

  // Set or remove session cookie for server communication
  const setSessionCookie = useCallback((token: string | null) => {
    if (typeof document === "undefined") return;
    if (token) {
      document.cookie = `viba_customer_token=${token}; Path=/; SameSite=Lax; Max-Age=86400`;
    } else {
      document.cookie = `viba_customer_token=; Path=/; SameSite=Lax; Max-Age=0`;
    }
  }, []);

  // Listen to Firebase Auth state
  useEffect(() => {
    const { auth } = getClientFirebase();
    if (!auth) {
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser && firebaseUser.email) {
        const token = await firebaseUser.getIdToken();
        setSessionCookie(token);
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName || "Valued Client",
          photoURL: firebaseUser.photoURL || undefined,
        });

        // Background sync to ensure Firestore profile & record links exist
        try {
          await fetch("/api/customer/sync", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              displayName: firebaseUser.displayName,
            }),
          });
        } catch {
          // Non-blocking
        }
      } else {
        setSessionCookie(null);
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [setSessionCookie]);

  // Sign In
  const signIn = async (email: string, pass: string) => {
    setError(null);
    setIsLoading(true);
    const { auth } = getClientFirebase();

    if (!auth) {
      // Fallback in dev when Firebase API key is unconfigured
      const mockUid = `dev-user-${Date.now()}`;
      const mockUser: CustomerAuthUser = {
        uid: mockUid,
        email: email.trim().toLowerCase(),
        displayName: email.split("@")[0],
        isDemo: true,
      };
      localStorage.setItem("viba_demo_customer", JSON.stringify(mockUser));
      const mockToken = `dev-token-${mockUid}-${encodeURIComponent(mockUser.email)}`;
      setSessionCookie(mockToken);
      setUser(mockUser);

      // Sync mock user on backend
      await fetch("/api/customer/sync", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${mockToken}`,
        },
        body: JSON.stringify({
          displayName: mockUser.displayName,
        }),
      });

      setIsLoading(false);
      return;
    }

    try {
      const cred = await signInWithEmailAndPassword(auth, email.trim(), pass);
      const token = await cred.user.getIdToken();
      setSessionCookie(token);
      localStorage.removeItem("viba_demo_customer");
      setUser({
        uid: cred.user.uid,
        email: cred.user.email || email,
        displayName: cred.user.displayName || email.split("@")[0],
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to sign in. Please verify your credentials.";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Sign Up
  const signUp = async (data: {
    email: string;
    pass: string;
    fullName: string;
    businessName: string;
    mobileNumber: string;
    businessAddress?: string;
  }) => {
    setError(null);
    setIsLoading(true);
    const { auth } = getClientFirebase();

    if (!auth) {
      // Dev mode fallback
      const mockUid = `dev-cust-${Date.now()}`;
      const mockUser: CustomerAuthUser = {
        uid: mockUid,
        email: data.email.trim().toLowerCase(),
        displayName: data.fullName.trim(),
        isDemo: true,
      };
      localStorage.setItem("viba_demo_customer", JSON.stringify(mockUser));
      const mockToken = `dev-token-${mockUid}-${encodeURIComponent(mockUser.email)}`;
      setSessionCookie(mockToken);
      setUser(mockUser);

      await fetch("/api/customer/sync", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${mockToken}`,
        },
        body: JSON.stringify({
          displayName: data.fullName,
          businessName: data.businessName,
          mobileNumber: data.mobileNumber,
          businessAddress: data.businessAddress,
        }),
      });

      setIsLoading(false);
      return;
    }

    try {
      const cred = await createUserWithEmailAndPassword(auth, data.email.trim(), data.pass);
      await updateProfile(cred.user, {
        displayName: data.fullName.trim(),
      });
      const token = await cred.user.getIdToken();
      setSessionCookie(token);
      localStorage.removeItem("viba_demo_customer");

      setUser({
        uid: cred.user.uid,
        email: cred.user.email || data.email,
        displayName: data.fullName.trim(),
      });

      // Synchronize profile details to Firestore
      await fetch("/api/customer/sync", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          displayName: data.fullName.trim(),
          businessName: data.businessName.trim(),
          mobileNumber: data.mobileNumber.trim(),
          businessAddress: data.businessAddress?.trim(),
        }),
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to register account. Please try again.";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Sign Out
  const signOutCustomer = async () => {
    setIsLoading(true);
    const { auth } = getClientFirebase();
    if (auth) {
      try {
        await signOut(auth);
      } catch {
        // Ignore
      }
    }
    localStorage.removeItem("viba_demo_customer");
    setSessionCookie(null);
    setUser(null);
    setIsLoading(false);
  };

  // Instant Demo Sign-in for testing
  const signInDemoUser = async (
    sampleEmail = "alex.rivera@apexfitness.in",
    sampleName = "Alex Rivera",
    sampleBusiness = "Apex Fitness Studios"
  ) => {
    setError(null);
    setIsLoading(true);
    const mockUid = `demo-uid-${sampleEmail.replace(/[^a-zA-Z0-9]/g, "")}`;
    const mockUser: CustomerAuthUser = {
      uid: mockUid,
      email: sampleEmail.toLowerCase(),
      displayName: sampleName,
      isDemo: true,
    };

    localStorage.setItem("viba_demo_customer", JSON.stringify(mockUser));
    const token = `dev-token-${mockUid}-${encodeURIComponent(mockUser.email)}`;
    setSessionCookie(token);
    setUser(mockUser);

    try {
      await fetch("/api/customer/sync", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          displayName: sampleName,
          businessName: sampleBusiness,
          mobileNumber: "+91 98765 43210",
        }),
      });
    } catch {
      // Ignore
    } finally {
      setIsLoading(false);
    }
  };

  // Get current token
  const getToken = async (): Promise<string | null> => {
    const { auth } = getClientFirebase();
    if (auth?.currentUser) {
      return await auth.currentUser.getIdToken();
    }
    if (user) {
      return `dev-token-${user.uid}-${encodeURIComponent(user.email)}`;
    }
    return null;
  };

  const clearError = () => setError(null);

  return (
    <CustomerAuthContext.Provider
      value={{
        user,
        isLoading,
        error,
        signIn,
        signUp,
        signOutCustomer,
        signInDemoUser,
        getToken,
        clearError,
      }}
    >
      {children}
    </CustomerAuthContext.Provider>
  );
}

export function useCustomerAuth() {
  const context = useContext(CustomerAuthContext);
  if (!context) {
    throw new Error("useCustomerAuth must be used within a CustomerAuthProvider");
  }
  return context;
}
