"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ProtectedRoute } from "@/components/protected-route"
import ReactMarkdown from "react-markdown"

interface BlogPost {
  id: string
  title: string
  author: string
  date: string
  content: string
  excerpt: string
}

export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null)

  useEffect(() => {
    // Demo blog posts
    const dummyPosts: BlogPost[] = [
      {
        id: "1",
        title: "The Power of Peer Learning",
        author: "Alex Johnson",
        date: "May 15, 2023",
        excerpt:
          "Discover how peer-to-peer learning can accelerate your skill development and create meaningful connections.",
        content: `
# The Power of Peer Learning

In today's fast-paced world, traditional education often falls short of meeting our diverse learning needs. Enter peer learning—a powerful alternative that leverages the collective knowledge of individuals to create rich, meaningful learning experiences.

## What is Peer Learning?

Peer learning is an educational practice where individuals learn with and from each other. Unlike traditional teacher-student dynamics, peer learning creates a collaborative environment where knowledge flows in multiple directions.

## Benefits of Peer Learning

### 1. Practical, Real-World Knowledge

When you learn from peers, you gain access to practical knowledge that comes from real-world experience. This type of learning often fills the gaps left by formal education.

### 2. Increased Engagement

Learning from peers tends to be more engaging than traditional methods. The collaborative nature creates an interactive environment where participants are actively involved in the learning process.

### 3. Building Meaningful Connections

Perhaps the most valuable aspect of peer learning is the connections you build. These relationships often extend beyond the learning context, creating a network of like-minded individuals who support each other's growth.

## How to Get Started with Peer Learning

1. **Identify your learning goals** - Be clear about what you want to learn
2. **Find the right peers** - Look for individuals who have knowledge or skills you want to acquire
3. **Create a structure** - Establish regular meeting times and clear objectives
4. **Be open to reciprocity** - Be prepared to share your own knowledge and skills

Peer learning isn't just about acquiring new skills—it's about creating a community of continuous growth and mutual support.
        `,
      },
      {
        id: "2",
        title: "5 Tips for Effective Skill Exchange",
        author: "Jamie Chen",
        date: "June 3, 2023",
        excerpt:
          "Learn how to make the most of your skill exchange experiences with these practical tips for both teaching and learning.",
        content: `
# 5 Tips for Effective Skill Exchange

Skill exchange platforms offer incredible opportunities to both learn and teach. However, making these exchanges truly effective requires intention and strategy. Here are five tips to help you make the most of your skill exchange experiences.

## 1. Set Clear Expectations

Before beginning any skill exchange, have a conversation about expectations. Discuss:

- Learning goals
- Time commitment
- Teaching methods
- Preferred feedback styles

Clear expectations help prevent misunderstandings and ensure both parties get what they need from the exchange.

## 2. Prepare Structured Learning Materials

Whether you're the teacher or the learner, having structured materials enhances the learning experience:

- As a teacher: Prepare simple guides, checklists, or reference materials
- As a learner: Create a list of questions or specific areas you want to focus on

## 3. Practice Active Listening

Active listening is crucial for effective skill exchange:

- Give your full attention during sessions
- Ask clarifying questions
- Summarize what you've learned to confirm understanding
- Avoid interrupting or immediately jumping to your own experiences

## 4. Embrace the Beginner's Mindset

Even if you're an expert in one area, you'll be a beginner in others:

- Be humble and open to new perspectives
- Don't be afraid to ask "basic" questions
- Acknowledge that learning is a process that takes time

## 5. Provide Constructive Feedback

Feedback helps both parties improve:

- Be specific about what worked well
- Frame suggestions positively
- Focus on behaviors rather than personal traits
- Express appreciation for the exchange

Remember that skill exchange is a two-way street. The most successful exchanges happen when both parties approach the experience with generosity, patience, and genuine curiosity.
        `,
      },
    ]

    setPosts(dummyPosts)
    setSelectedPost(dummyPosts[0])
  }, [])

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
            <h1 className="text-3xl font-bold tracking-tight">Blog</h1>
            <p className="text-muted-foreground">Insights and articles about skill sharing and peer learning</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              {selectedPost && (
                <motion.div
                  key={selectedPost.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <Card className="rounded-2xl shadow-md overflow-hidden">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-2xl">{selectedPost.title}</CardTitle>
                      <CardDescription>
                        By {selectedPost.author} • {selectedPost.date}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="prose dark:prose-invert max-w-none">
                      <ReactMarkdown>{selectedPost.content}</ReactMarkdown>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4">Recent Posts</h2>
              <motion.div className="space-y-4" variants={container} initial="hidden" animate="show">
                {posts.map((post) => (
                  <motion.div key={post.id} variants={item}>
                    <Card
                      className={`rounded-2xl cursor-pointer transition-all hover:shadow-md ${
                        selectedPost?.id === post.id ? "border-primary" : ""
                      }`}
                      onClick={() => setSelectedPost(post)}
                    >
                      <CardHeader className="p-4">
                        <CardTitle className="text-lg">{post.title}</CardTitle>
                        <CardDescription className="text-xs">
                          {post.date} • {post.author}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <p className="text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </ProtectedRoute>
  )
}
