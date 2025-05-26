"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { SkillInput } from "@/components/ui/skill-input"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { ProtectedRoute } from "@/components/protected-route"

export default function Profile() {
  const { user, updateProfile } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    fullName: "",
    bio: "",
    skills: [] as string[],
  })
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || "",
        bio: user.bio || "",
        skills: user.skills || [],
      })
    }
  }, [user])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSkillsChange = (skills: string[]) => {
    setFormData((prev) => ({ ...prev, skills }))
  }

  const handleSave = async () => {
    if (!formData.fullName.trim()) {
      toast({
        title: "Name required",
        description: "Please enter your full name",
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)
    try {
      updateProfile({
        fullName: formData.fullName.trim(),
        bio: formData.bio.trim(),
        skills: formData.skills,
      })
      setIsEditing(false)
      toast({
        title: "Profile updated successfully!",
        description: "Your changes have been saved and the header has been updated.",
      })
    } catch (error) {
      toast({
        title: "Update failed",
        description: "There was an error updating your profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <ProtectedRoute>
      <div className="container py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto space-y-8"
        >
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
            <p className="text-muted-foreground">Manage your profile information and skills</p>
          </div>

          <Card className="rounded-2xl shadow-md">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src="/images/creator-photo.png" alt={user?.fullName || "User"} />
                  <AvatarFallback className="text-lg">{user?.fullName?.charAt(0) || "U"}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle>{user?.fullName || "Your Name"}</CardTitle>
                  <CardDescription>{user?.email}</CardDescription>
                  <p className="text-xs text-muted-foreground mt-1">
                    Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Unknown"}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {isEditing ? (
                <form className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="rounded-xl"
                      placeholder="Enter your full name"
                    />
                    <p className="text-xs text-muted-foreground">
                      This name will be visible to other users and shown in the header.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      placeholder="Tell others about yourself, your experience, and what you're passionate about..."
                      className="rounded-xl min-h-[100px]"
                    />
                    <p className="text-xs text-muted-foreground">Share your background and what makes you unique.</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="skills">Your Skills</Label>
                    <SkillInput
                      skills={formData.skills}
                      onChange={handleSkillsChange}
                      placeholder="Add your skills..."
                    />
                    <p className="text-xs text-muted-foreground">
                      Add skills you can teach or want to learn. Press Enter to add each skill.
                    </p>
                  </div>
                </form>
              ) : (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium mb-2">Email Address</h3>
                    <p className="text-sm text-muted-foreground">{user?.email}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium mb-2">Bio</h3>
                    <p className="text-sm text-muted-foreground">
                      {user?.bio ||
                        "No bio provided yet. Click 'Edit Profile' to add one and tell others about yourself."}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium mb-2">Your Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {user?.skills && user.skills.length > 0 ? (
                        user.skills.map((skill) => (
                          <Badge key={skill} variant="secondary" className="rounded-2xl">
                            {skill}
                          </Badge>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          No skills added yet. Click 'Edit Profile' to add your skills.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter>
              {isEditing ? (
                <div className="flex gap-2 w-full">
                  <Button variant="outline" onClick={() => setIsEditing(false)} className="flex-1" disabled={isSaving}>
                    Cancel
                  </Button>
                  <Button onClick={handleSave} className="flex-1" disabled={isSaving}>
                    {isSaving ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              ) : (
                <Button onClick={() => setIsEditing(true)} className="w-full">
                  Edit Profile
                </Button>
              )}
            </CardFooter>
          </Card>

          {/* Profile Tips */}
          <Card className="rounded-2xl bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">💡 Profile Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p>
                • <strong>Keep your name updated:</strong> This appears in the header and helps others recognize you
              </p>
              <p>
                • <strong>Write a compelling bio:</strong> Share your experience, passion, and what makes you unique
              </p>
              <p>
                • <strong>Add relevant skills:</strong> Include both skills you can teach and want to learn
              </p>
              <p>
                • <strong>Be specific:</strong> Instead of "Programming", try "React Development" or "Python for Data
                Science"
              </p>
              <p>
                • <strong>Regular updates:</strong> Keep your skills current to attract the right connections
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </ProtectedRoute>
  )
}
