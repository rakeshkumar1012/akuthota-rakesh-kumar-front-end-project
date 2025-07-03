"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Search } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { redirect } from "next/navigation"
import { collection, getDocs, limit, query } from "firebase/firestore"
import { db, isFirebaseAvailable } from "@/lib/firebase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { UserCard } from "@/components/ui/user-card"
import { CreatorSection } from "@/components/creator-section"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"

// Fallback demo data
const demoUsers = [
  {
    uid: "demo-1",
    displayName: "Alex Morgan",
    photoURL: "/placeholder.svg?height=100&width=100",
    rating: 4.8,
    canTeach: ["Web Development", "React", "UI Design"],
    wantsToLearn: ["Spanish", "Photography"],
    bio: "Full-stack developer passionate about creating beautiful user experiences.",
  },
  {
    uid: "demo-2",
    displayName: "Jamie Chen",
    photoURL: "/placeholder.svg?height=100&width=100",
    rating: 4.9,
    canTeach: ["Mandarin", "Cooking", "Photography"],
    wantsToLearn: ["JavaScript", "Guitar"],
    bio: "Professional photographer and cooking enthusiast from Taiwan.",
  },
  {
    uid: "demo-3",
    displayName: "Sam Taylor",
    photoURL: "/placeholder.svg?height=100&width=100",
    rating: 4.7,
    canTeach: ["Yoga", "Meditation", "Nutrition"],
    wantsToLearn: ["Digital Marketing", "SEO"],
    bio: "Certified yoga instructor helping people find balance in their lives.",
  },
  {
    uid: "demo-4",
    displayName: "Jordan Lee",
    photoURL: "/placeholder.svg?height=100&width=100",
    rating: 4.6,
    canTeach: ["Guitar", "Music Theory", "Songwriting"],
    wantsToLearn: ["Public Speaking", "Video Editing"],
    bio: "Musician and songwriter with 10+ years of experience.",
  },
  {
    uid: "demo-5",
    displayName: "Riley Johnson",
    photoURL: "/placeholder.svg?height=100&width=100",
    rating: 4.9,
    canTeach: ["Data Science", "Python", "Machine Learning"],
    wantsToLearn: ["Drawing", "French"],
    bio: "Data scientist passionate about using AI to solve real-world problems.",
  },
  {
    uid: "demo-6",
    displayName: "Casey Wilson",
    photoURL: "/placeholder.svg?height=100&width=100",
    rating: 4.7,
    canTeach: ["Digital Marketing", "Content Creation", "SEO"],
    wantsToLearn: ["Coding", "Yoga"],
    bio: "Digital marketing expert helping businesses grow their online presence.",
  },
]

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("")
  const [featuredUsers, setFeaturedUsers] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { isAuthenticated, loading } = useAuth()
  const router = useRouter()

  // Redirect to sign in if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      redirect("/auth/signin")
    }
  }, [isAuthenticated, loading])

  useEffect(() => {
    const fetchFeaturedUsers = async () => {
      setIsLoading(true)

      if (!isFirebaseAvailable()) {
        console.log("Firebase not available, using demo data")
        setFeaturedUsers(demoUsers)
        setIsLoading(false)
        return
      }

      try {
        const usersQuery = query(collection(db, "users"), limit(6))
        const querySnapshot = await getDocs(usersQuery)
        const users = querySnapshot.docs.map((doc) => ({ uid: doc.id, ...doc.data() }))

        if (users.length > 0) {
          setFeaturedUsers(users)
        } else {
          setFeaturedUsers(demoUsers)
        }
      } catch (error) {
        console.warn("Error fetching featured users, using demo data:", error)
        setFeaturedUsers(demoUsers)
      } finally {
        setIsLoading(false)
      }
    }

    if (isAuthenticated) {
      fetchFeaturedUsers()
    }
  }, [isAuthenticated])

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  useEffect(() => {
    // Redirect to home page by default
    router.replace("/home")
  }, [router])

  if (loading) {
    return (
      <div className="container flex items-center justify-center min-h-screen">
        <div className="animate-pulse space-y-4 text-center">
          <div className="h-8 bg-muted rounded w-48 mx-auto"></div>
          <div className="h-4 bg-muted rounded w-32 mx-auto"></div>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null // Will redirect
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="container py-12 md:py-24 lg:py-32">
        <motion.div
          className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col justify-center space-y-4">
            <motion.div
              className="space-y-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                Learn From Each Other. <br />
                Share Your Skills.
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                Connect with people around the world to exchange knowledge and learn new skills. Teach what you know,
                learn what you don't.
              </p>
            </motion.div>
            <motion.div
              className="flex flex-col gap-2 min-[400px]:flex-row"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <Link href="/browse">
                <Button size="lg" className="px-8">
                  Browse Skills
                </Button>
              </Link>
              <Link href="/profile">
                <Button size="lg" variant="outline" className="px-8">
                  Update Profile
                </Button>
              </Link>
            </motion.div>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mx-auto w-full max-w-[500px] lg:ml-auto"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-lg">
              <Image
                src="/placeholder.svg?height=500&width=500&text=SkillSwap+Community"
                alt="People collaborating and sharing skills in a modern workspace"
                width={500}
                height={500}
                className="w-full h-auto object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <h3 className="text-lg font-semibold mb-1">Join Our Community</h3>
                <p className="text-sm opacity-90">Connect with learners and teachers worldwide</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Search Section */}
      <section className="bg-muted py-12">
        <div className="container">
          <motion.div
            className="mx-auto max-w-2xl text-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold tracking-tight mb-4">Find Your Perfect Skill Match</h2>
            <p className="text-muted-foreground">
              Search for skills you want to learn or people you want to connect with
            </p>
          </motion.div>
          <motion.div
            className="mx-auto max-w-md relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search skills or users..."
              className="pl-10 rounded-2xl"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </motion.div>
        </div>
      </section>

      {/* User Skills Section */}
      <section className="container py-12 md:py-24">
        <motion.div
          className="mx-auto max-w-2xl text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold tracking-tight mb-4">Featured Skill Swappers</h2>
          <p className="text-muted-foreground">
            Connect with our top-rated community members and start exchanging skills today
          </p>
        </motion.div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-muted rounded-2xl h-64"></div>
              </div>
            ))}
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {featuredUsers.map((user) => (
              <motion.div key={user.uid} variants={item}>
                <UserCard user={user} />
              </motion.div>
            ))}
          </motion.div>
        )}

        <div className="mt-12 text-center">
          <Link href="/browse">
            <Button size="lg" variant="outline" className="rounded-2xl">
              View All Skill Swappers
            </Button>
          </Link>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-muted py-12 md:py-24">
        <div className="container">
          <motion.div
            className="mx-auto max-w-2xl text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold tracking-tight mb-4">How SkillSwap Works</h2>
            <p className="text-muted-foreground">Exchange skills in three simple steps</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              className="flex flex-col items-center text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <div className="bg-background h-16 w-16 rounded-full flex items-center justify-center mb-4 shadow-md">
                <span className="text-2xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Create Your Profile</h3>
              <p className="text-muted-foreground">List the skills you can teach and the ones you want to learn</p>
            </motion.div>

            <motion.div
              className="flex flex-col items-center text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <div className="bg-background h-16 w-16 rounded-full flex items-center justify-center mb-4 shadow-md">
                <span className="text-2xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Match With Others</h3>
              <p className="text-muted-foreground">
                Find people who want to learn what you teach and teach what you want to learn
              </p>
            </motion.div>

            <motion.div
              className="flex flex-col items-center text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <div className="bg-background h-16 w-16 rounded-full flex items-center justify-center mb-4 shadow-md">
                <span className="text-2xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Start Exchanging</h3>
              <p className="text-muted-foreground">Schedule sessions and start learning from each other</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Creator Section */}
      <CreatorSection />

      {/* CTA Section */}
      <section className="container py-12 md:py-24">
        <motion.div
          className="rounded-2xl bg-primary/5 p-8 md:p-12 shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold tracking-tight mb-4">Ready to Start Swapping Skills?</h2>
              <p className="text-muted-foreground mb-6">
                Join our community of skill swappers today and start learning something new while sharing your
                expertise.
              </p>
              <Link href="/profile">
                <Button size="lg" className="rounded-2xl">
                  Update Your Profile
                </Button>
              </Link>
            </div>
            <div className="lg:ml-auto">
              <Image
                src="/placeholder.svg?height=300&width=400"
                alt="People learning together"
                width={400}
                height={300}
                className="rounded-2xl shadow-md"
              />
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  )
}
