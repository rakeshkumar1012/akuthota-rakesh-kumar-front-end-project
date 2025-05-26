"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"

interface UserCardProps {
  user: {
    uid: string
    displayName?: string | null
    photoURL?: string | null
    rating?: number
    canTeach?: string[]
    wantsToLearn?: string[]
    bio?: string
  }
}

// Array of diverse profile photos for demo users
const profilePhotos = [
  "/placeholder.svg?height=100&width=100&text=👨‍💻",
  "/placeholder.svg?height=100&width=100&text=👩‍🎨",
  "/placeholder.svg?height=100&width=100&text=👨‍🏫",
  "/placeholder.svg?height=100&width=100&text=👩‍💼",
  "/placeholder.svg?height=100&width=100&text=👨‍🔬",
  "/placeholder.svg?height=100&width=100&text=👩‍🍳",
]

export function UserCard({ user }: UserCardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  // Get a consistent photo for each user based on their uid
  const getProfilePhoto = (uid: string) => {
    if (user.photoURL && user.photoURL !== "/placeholder.svg?height=100&width=100") {
      return user.photoURL
    }
    const index = uid.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) % profilePhotos.length
    return profilePhotos[index]
  }

  const handleRequestSwap = () => {
    setIsLoading(true)

    // Simulate network delay
    setTimeout(() => {
      toast({
        title: "🎉 Swap request sent!",
        description: `Your skill swap request has been sent to ${user.displayName}! They'll be notified and can respond soon.`,
      })
      setIsDialogOpen(false)
      setIsLoading(false)
    }, 1000)
  }

  return (
    <>
      <Card className="h-full overflow-hidden rounded-2xl shadow-md hover:shadow-lg transition-shadow">
        <CardHeader className="pb-0">
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={getProfilePhoto(user.uid) || "/placeholder.svg"} alt={user.displayName || "User"} />
              <AvatarFallback>{user.displayName?.charAt(0) || "U"}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold">{user.displayName || "Anonymous User"}</h3>
              {user.rating && (
                <div className="flex items-center text-sm text-yellow-500">{user.rating.toFixed(1)} ★</div>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          {user.bio && <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{user.bio}</p>}
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium mb-2">Can Teach:</h4>
              <div className="flex flex-wrap gap-2">
                {user.canTeach && user.canTeach.length > 0 ? (
                  user.canTeach.map((skill) => (
                    <Badge key={skill} variant="secondary" className="rounded-2xl">
                      {skill}
                    </Badge>
                  ))
                ) : (
                  <span className="text-xs text-muted-foreground">No skills listed</span>
                )}
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium mb-2">Wants to Learn:</h4>
              <div className="flex flex-wrap gap-2">
                {user.wantsToLearn && user.wantsToLearn.length > 0 ? (
                  user.wantsToLearn.map((skill) => (
                    <Badge key={skill} variant="outline" className="rounded-2xl">
                      {skill}
                    </Badge>
                  ))
                ) : (
                  <span className="text-xs text-muted-foreground">No skills listed</span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full rounded-2xl" onClick={() => setIsDialogOpen(true)}>
            Request Swap
          </Button>
        </CardFooter>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px] rounded-2xl">
          <DialogHeader>
            <DialogTitle>Request Skill Swap with {user.displayName}</DialogTitle>
            <DialogDescription>
              Send a skill swap request to connect and start exchanging knowledge. Once they accept, you can coordinate
              your learning sessions.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4 space-y-4">
            <div className="bg-muted/50 rounded-lg p-4">
              <h4 className="text-sm font-medium mb-2 text-green-700 dark:text-green-400">🎓 They can teach you:</h4>
              <div className="flex flex-wrap gap-2">
                {user.canTeach && user.canTeach.length > 0 ? (
                  user.canTeach.map((skill) => (
                    <Badge key={skill} variant="secondary" className="rounded-2xl">
                      {skill}
                    </Badge>
                  ))
                ) : (
                  <span className="text-xs text-muted-foreground">No skills listed</span>
                )}
              </div>
            </div>

            <div className="bg-muted/50 rounded-lg p-4">
              <h4 className="text-sm font-medium mb-2 text-blue-700 dark:text-blue-400">📚 They want to learn:</h4>
              <div className="flex flex-wrap gap-2">
                {user.wantsToLearn && user.wantsToLearn.length > 0 ? (
                  user.wantsToLearn.map((skill) => (
                    <Badge key={skill} variant="outline" className="rounded-2xl">
                      {skill}
                    </Badge>
                  ))
                ) : (
                  <span className="text-xs text-muted-foreground">No skills listed</span>
                )}
              </div>
            </div>

            <div className="text-sm text-muted-foreground bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
              💡 <strong>Tip:</strong> Make sure you have skills they want to learn, or skills you want to learn that
              they can teach for the best swap experience!
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleRequestSwap} className="flex-1" disabled={isLoading}>
              {isLoading ? "Sending..." : "Send Request"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
