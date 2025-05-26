"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { UserCard } from "@/components/ui/user-card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProtectedRoute } from "@/components/protected-route"

// Demo data with diverse profile photos
const demoUsers = [
  {
    uid: "demo-1",
    displayName: "Alex Morgan",
    photoURL: "https://ts2.mm.bing.net/th?id=OIP.Kk4i-k-7bOfsgPv0SJtj5AHaHa&pid=15.1",
    rating: 4.8,
    canTeach: ["Web Development", "React", "UI Design"],
    wantsToLearn: ["Spanish", "Photography"],
    bio: "Full-stack developer passionate about creating beautiful user experiences.",
  },
  {
    uid: "demo-2",
    displayName: "Jamie Chen",
    photoURL: "https://bing.com/th/id/BCO.9e0bdbb6-56a6-4d67-ba1a-0bd3850da5c7.png",
    rating: 4.9,
    canTeach: ["Mandarin", "Cooking", "Photography"],
    wantsToLearn: ["JavaScript", "Guitar"],
    bio: "Professional photographer and cooking enthusiast from Taiwan.",
  },
  {
    uid: "demo-3",
    displayName: "Sam Taylor",
    photoURL: "https://bing.com/th/id/BCO.e02f2146-78ab-4bf8-b1a2-5895f1def003.png",
    rating: 4.7,
    canTeach: ["Yoga", "Meditation", "Nutrition"],
    wantsToLearn: ["Digital Marketing", "SEO"],
    bio: "Certified yoga instructor helping people find balance in their lives.",
  },
  {
    uid: "demo-4",
    displayName: "Jordan Lee",
    photoURL: "https://bing.com/th/id/BCO.7ccec93e-a924-4272-9853-66e820d62e18.png",
    rating: 4.6,
    canTeach: ["Guitar", "Music Theory", "Songwriting"],
    wantsToLearn: ["Public Speaking", "Video Editing"],
    bio: "Musician and songwriter with 10+ years of experience.",
  },
  {
    uid: "demo-5",
    displayName: "Riley Johnson",
    photoURL: "/placeholder.svg?height=100&width=100&text=👨‍🔬",
    rating: 4.9,
    canTeach: ["Data Science", "Python", "Machine Learning"],
    wantsToLearn: ["Drawing", "French"],
    bio: "Data scientist passionate about using AI to solve real-world problems.",
  },
  {
    uid: "demo-6",
    displayName: "Casey Wilson",
    photoURL: "/placeholder.svg?height=100&width=100&text=👩‍🍳",
    rating: 4.7,
    canTeach: ["Digital Marketing", "Content Creation", "SEO"],
    wantsToLearn: ["Coding", "Yoga"],
    bio: "Digital marketing expert helping businesses grow their online presence.",
  },
]

export default function Browse() {
  const [users, setUsers] = useState<any[]>([])
  const [filteredUsers, setFilteredUsers] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTab, setSelectedTab] = useState("all")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setUsers(demoUsers)
      setFilteredUsers(demoUsers)
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    let result = [...users]

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (user) =>
          user.displayName?.toLowerCase().includes(query) ||
          user.canTeach?.some((skill: string) => skill.toLowerCase().includes(query)) ||
          user.wantsToLearn?.some((skill: string) => skill.toLowerCase().includes(query)),
      )
    }

    // Filter by tab
    if (selectedTab === "teaching") {
      result = result.filter((user) => user.canTeach && user.canTeach.length > 0)
    } else if (selectedTab === "learning") {
      result = result.filter((user) => user.wantsToLearn && user.wantsToLearn.length > 0)
    }

    setFilteredUsers(result)
  }, [searchQuery, selectedTab, users])

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

  return (
    <ProtectedRoute>
      <div className="container py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Browse Skill Swappers</h1>
            <p className="text-muted-foreground">
              Find people with skills you want to learn or who want to learn what you can teach
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="search">Search</Label>
              <Input
                id="search"
                placeholder="Search by name or skill..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="rounded-xl"
              />
            </div>

            <Tabs defaultValue="all" onValueChange={setSelectedTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="all">All Users</TabsTrigger>
                <TabsTrigger value="teaching">Teaching</TabsTrigger>
                <TabsTrigger value="learning">Learning</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="bg-muted rounded-2xl h-64"></div>
                </div>
              ))}
            </div>
          ) : filteredUsers.length > 0 ? (
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={container}
              initial="hidden"
              animate="show"
            >
              {filteredUsers.map((user) => (
                <motion.div key={user.uid} variants={item}>
                  <UserCard user={user} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium">No users found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filters</p>
            </div>
          )}
        </motion.div>
      </div>
    </ProtectedRoute>
  )
}
