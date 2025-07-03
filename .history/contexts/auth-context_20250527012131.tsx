"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"

interface UserProfile {
  id: string
  fullName: string
  email: string
  skills: string[]
  bio?: string
  avatar?: string
  createdAt: string
}

interface AuthContextType {
  user: UserProfile | null
  isAuthenticated: boolean
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (fullName: string, email: string, password: string) => Promise<void>
  logout: () => void
  updateProfile: (data: Partial<UserProfile>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Demo users database - Fixed and working
const demoUsers: { [email: string]: { password: string; profile: UserProfile } } = {
  "demo@example.com": {
    password: "demo123",
    profile: {
      id: "demo-user-1",
      fullName: "Demo User",
      email: "demo@example.com",
      skills: ["Web Development", "React", "JavaScript"],
      bio: "Demo user for testing the SkillSwap Hub platform",
      createdAt: "2024-01-01T00:00:00.000Z",
    },
  },
  "john@example.com": {
    password: "Password123!",
    profile: {
      id: "user-2",
      fullName: "John Doe",
      email: "john@example.com",
      skills: ["Python", "Data Science", "Machine Learning"],
      bio: "Data scientist passionate about AI and machine learning",
      createdAt: "2024-01-01T00:00:00.000Z",
    },
  },
  "sarah@example.com": {
    password: "Sarah123!",
    profile: {
      id: "user-3",
      fullName: "Sarah Wilson",
      email: "sarah@example.com",
      skills: ["UI/UX Design", "Figma", "Adobe Creative Suite"],
      bio: "Creative designer with 5+ years of experience in digital design",
      createdAt: "2024-01-01T00:00:00.000Z",
    },
  },
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  // Load user from localStorage on mount
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("skillswap_user")
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser)
        setUser(parsedUser)
        console.log("Loaded user from localStorage:", parsedUser)
      }
    } catch (error) {
      console.error("Error parsing stored user:", error)
      localStorage.removeItem("skillswap_user")
    } finally {
      setLoading(false)
    }
  }, [])

  const signIn = async (email: string, password: string) => {
    console.log("Attempting sign in with:", email)

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const normalizedEmail = email.toLowerCase().trim()
    const userRecord = demoUsers[normalizedEmail]

    console.log("Looking for user:", normalizedEmail)
    console.log("Available users:", Object.keys(demoUsers))
    console.log("Found user record:", !!userRecord)

    if (!userRecord) {
      throw new Error("No account found with this email address")
    }

    if (userRecord.password !== password) {
      console.log("Password mismatch. Expected:", userRecord.password, "Got:", password)
      throw new Error("Incorrect password")
    }

    console.log("Sign in successful for:", userRecord.profile.fullName)
    setUser(userRecord.profile)
    localStorage.setItem("skillswap_user", JSON.stringify(userRecord.profile))
  }

  const signUp = async (fullName: string, email: string, password: string) => {
    console.log("Attempting sign up with:", email)

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const normalizedEmail = email.toLowerCase().trim()

    // Check if user already exists
    if (demoUsers[normalizedEmail]) {
      throw new Error("An account with this email already exists")
    }

    const newUser: UserProfile = {
      id: `user-${Date.now()}`,
      fullName: fullName.trim(),
      email: normalizedEmail,
      skills: [], // Start with empty skills
      bio: "",
      createdAt: new Date().toISOString(),
    }

    // Add to demo database
    demoUsers[normalizedEmail] = {
      password,
      profile: newUser,
    }

    console.log("Sign up successful for:", newUser.fullName)
    setUser(newUser)
    localStorage.setItem("skillswap_user", JSON.stringify(newUser))
  }

  const logout = () => {
    console.log("Logging out user")
    setUser(null)
    localStorage.removeItem("skillswap_user")
  }

  const updateProfile = (data: Partial<UserProfile>) => {
    if (!user) return

    const updatedUser = { ...user, ...data }
    setUser(updatedUser)
    localStorage.setItem("skillswap_user", JSON.stringify(updatedUser))

    // Update in demo database if exists
    if (demoUsers[user.email]) {
      demoUsers[user.email].profile = updatedUser
    }

    console.log("Profile updated:", updatedUser)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        signIn,
        signUp,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
