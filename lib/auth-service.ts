export interface User {
  id: string
  email: string
  fullName: string
  skills: string[]
  bio?: string
  avatar?: string
  createdAt: string
}

export interface AuthService {
  signUp(fullName: string, email: string, password: string): Promise<User>
  signIn(email: string, password: string): Promise<User>
  signOut(): Promise<void>
  getCurrentUser(): Promise<User | null>
  updateProfile(userId: string, data: Partial<User>): Promise<User>
}

// Demo implementation (current)
export class DemoAuthService implements AuthService {
  private users: Map<string, { password: string; user: User }> = new Map()

  constructor() {
    // Initialize with demo users
    this.users.set("demo@example.com", {
      password: "Demo123!",
      user: {
        id: "demo-1",
        email: "demo@example.com",
        fullName: "Demo User",
        skills: ["Web Development", "React", "JavaScript"],
        bio: "Demo user for testing the SkillSwap Hub platform",
        createdAt: "2024-01-01T00:00:00.000Z",
      },
    })

    this.users.set("john@example.com", {
      password: "Password123!",
      user: {
        id: "user-2",
        email: "john@example.com",
        fullName: "John Doe",
        skills: ["Python", "Data Science", "Machine Learning"],
        bio: "Data scientist passionate about AI and machine learning",
        createdAt: "2024-01-01T00:00:00.000Z",
      },
    })
  }

  async signUp(fullName: string, email: string, password: string): Promise<User> {
    const normalizedEmail = email.toLowerCase().trim()

    if (this.users.has(normalizedEmail)) {
      throw new Error("User already exists")
    }

    const user: User = {
      id: `user-${Date.now()}`,
      email: normalizedEmail,
      fullName: fullName.trim(),
      skills: [],
      bio: "",
      createdAt: new Date().toISOString(),
    }

    this.users.set(normalizedEmail, { password, user })
    return user
  }

  async signIn(email: string, password: string): Promise<User> {
    const normalizedEmail = email.toLowerCase().trim()
    const userRecord = this.users.get(normalizedEmail)

    if (!userRecord) {
      throw new Error("User not found")
    }

    if (userRecord.password !== password) {
      throw new Error("Invalid password")
    }

    return userRecord.user
  }

  async signOut(): Promise<void> {
    // In a real implementation, this would invalidate tokens
    return Promise.resolve()
  }

  async getCurrentUser(): Promise<User | null> {
    // In a real implementation, this would validate the current session
    const stored = localStorage.getItem("skillswap_user")
    return stored ? JSON.parse(stored) : null
  }

  async updateProfile(userId: string, data: Partial<User>): Promise<User> {
    // Find user by ID and update
    for (const [email, record] of this.users.entries()) {
      if (record.user.id === userId) {
        record.user = { ...record.user, ...data }
        return record.user
      }
    }
    throw new Error("User not found")
  }
}

// Supabase implementation
export class SupabaseAuthService implements AuthService {
  async signUp(fullName: string, email: string, password: string): Promise<User> {
    // TODO: Implement Supabase auth
    throw new Error("Supabase integration not implemented")
  }

  async signIn(email: string, password: string): Promise<User> {
    // TODO: Implement Supabase auth
    throw new Error("Supabase integration not implemented")
  }

  async signOut(): Promise<void> {
    // TODO: Implement Supabase auth
    throw new Error("Supabase integration not implemented")
  }

  async getCurrentUser(): Promise<User | null> {
    // TODO: Implement Supabase auth
    throw new Error("Supabase integration not implemented")
  }

  async updateProfile(userId: string, data: Partial<User>): Promise<User> {
    // TODO: Implement Supabase database
    throw new Error("Supabase integration not implemented")
  }
}

// Firebase implementation
export class FirebaseAuthService implements AuthService {
  async signUp(fullName: string, email: string, password: string): Promise<User> {
    // TODO: Implement Firebase auth
    throw new Error("Firebase integration not implemented")
  }

  async signIn(email: string, password: string): Promise<User> {
    // TODO: Implement Firebase auth
    throw new Error("Firebase integration not implemented")
  }

  async signOut(): Promise<void> {
    // TODO: Implement Firebase auth
    throw new Error("Firebase integration not implemented")
  }

  async getCurrentUser(): Promise<User | null> {
    // TODO: Implement Firebase auth
    throw new Error("Firebase integration not implemented")
  }

  async updateProfile(userId: string, data: Partial<User>): Promise<User> {
    // TODO: Implement Firebase database
    throw new Error("Firebase integration not implemented")
  }
}

// Factory function to get the appropriate auth service
export function getAuthService(): AuthService {
  // Check environment variables to determine which service to use
  if (process.env.NEXT_PUBLIC_USE_SUPABASE === "true") {
    return new SupabaseAuthService()
  }

  if (process.env.NEXT_PUBLIC_USE_FIREBASE === "true") {
    return new FirebaseAuthService()
  }

  // Default to demo service
  return new DemoAuthService()
}
