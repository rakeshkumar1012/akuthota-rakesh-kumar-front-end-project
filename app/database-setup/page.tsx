"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Copy, Check, ExternalLink, Database, Cloud, Server } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function DatabaseSetup() {
  const [copiedText, setCopiedText] = useState<string | null>(null)
  const { toast } = useToast()

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedText(label)
      toast({
        title: "Copied!",
        description: `${label} copied to clipboard`,
      })
      setTimeout(() => setCopiedText(null), 2000)
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please copy the text manually",
        variant: "destructive",
      })
    }
  }

  const CopyButton = ({ text, label }: { text: string; label: string }) => (
    <Button variant="outline" size="sm" onClick={() => copyToClipboard(text, label)} className="ml-2">
      {copiedText === label ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
    </Button>
  )

  return (
    <div className="container py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto space-y-8"
      >
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold tracking-tight">Database Integration Guide</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Choose and set up your preferred database solution for SkillSwap Hub. Currently running in demo mode with
            local storage.
          </p>
        </div>

        <Alert>
          <Database className="h-4 w-4" />
          <AlertDescription>
            <strong>Current Status:</strong> Running in demo mode with localStorage. User data will not persist between
            browser sessions or devices.
          </AlertDescription>
        </Alert>

        <Tabs defaultValue="supabase" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="supabase">Supabase</TabsTrigger>
            <TabsTrigger value="firebase">Firebase</TabsTrigger>
            <TabsTrigger value="mongodb">MongoDB</TabsTrigger>
            <TabsTrigger value="postgresql">PostgreSQL</TabsTrigger>
          </TabsList>

          {/* Supabase Setup */}
          <TabsContent value="supabase">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Cloud className="h-5 w-5" />
                  <CardTitle>Supabase Integration</CardTitle>
                  <Badge variant="secondary">Recommended</Badge>
                </div>
                <CardDescription>
                  Open-source Firebase alternative with PostgreSQL database, real-time subscriptions, and built-in
                  authentication.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Setup Steps:</h3>
                  <ol className="list-decimal list-inside space-y-2 text-sm">
                    <li>
                      Create a new project at{" "}
                      <a
                        href="https://supabase.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        supabase.com
                      </a>
                    </li>
                    <li>Copy your project URL and anon key from Settings → API</li>
                    <li>Add the environment variables below to your .env.local file</li>
                    <li>
                      Install the Supabase client:{" "}
                      <code className="bg-muted px-2 py-1 rounded">npm install @supabase/supabase-js</code>
                    </li>
                    <li>Run the SQL schema provided below in your Supabase SQL editor</li>
                  </ol>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Environment Variables:</h4>
                  <div className="bg-muted p-4 rounded-lg font-mono text-sm space-y-2">
                    <div className="flex items-center justify-between">
                      <span>NEXT_PUBLIC_SUPABASE_URL=your_project_url</span>
                      <CopyButton text="NEXT_PUBLIC_SUPABASE_URL=your_project_url" label="Supabase URL" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key</span>
                      <CopyButton text="NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key" label="Supabase Key" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>NEXT_PUBLIC_USE_SUPABASE=true</span>
                      <CopyButton text="NEXT_PUBLIC_USE_SUPABASE=true" label="Supabase Flag" />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Database Schema (SQL):</h4>
                  <div className="bg-muted p-4 rounded-lg font-mono text-sm max-h-64 overflow-y-auto">
                    <pre>{`-- Users table
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  bio TEXT,
  avatar_url TEXT,
  skills TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Skill swap requests table
CREATE TABLE skill_swap_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  from_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  to_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  message TEXT,
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE skill_swap_requests ENABLE ROW LEVEL SECURITY;

-- Users can read all profiles but only update their own
CREATE POLICY "Users can view all profiles" ON users FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);

-- Skill swap request policies
CREATE POLICY "Users can view their own requests" ON skill_swap_requests FOR SELECT USING (auth.uid() = from_user_id OR auth.uid() = to_user_id);
CREATE POLICY "Users can create requests" ON skill_swap_requests FOR INSERT WITH CHECK (auth.uid() = from_user_id);
CREATE POLICY "Users can update requests they received" ON skill_swap_requests FOR UPDATE USING (auth.uid() = to_user_id);`}</pre>
                  </div>
                  <CopyButton
                    text={`-- Users table
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  bio TEXT,
  avatar_url TEXT,
  skills TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Skill swap requests table
CREATE TABLE skill_swap_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  from_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  to_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  message TEXT,
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE skill_swap_requests ENABLE ROW LEVEL SECURITY;

-- Users can read all profiles but only update their own
CREATE POLICY "Users can view all profiles" ON users FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);

-- Skill swap request policies
CREATE POLICY "Users can view their own requests" ON skill_swap_requests FOR SELECT USING (auth.uid() = from_user_id OR auth.uid() = to_user_id);
CREATE POLICY "Users can create requests" ON skill_swap_requests FOR INSERT WITH CHECK (auth.uid() = from_user_id);
CREATE POLICY "Users can update requests they received" ON skill_swap_requests FOR UPDATE USING (auth.uid() = to_user_id);`}
                    label="SQL Schema"
                  />
                </div>

                <div className="flex gap-2">
                  <Button asChild>
                    <a href="https://supabase.com" target="_blank" rel="noopener noreferrer">
                      Get Started with Supabase <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Firebase Setup */}
          <TabsContent value="firebase">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Cloud className="h-5 w-5" />
                  <CardTitle>Firebase Integration</CardTitle>
                </div>
                <CardDescription>
                  Google's mobile and web application development platform with real-time database and authentication.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Setup Steps:</h3>
                  <ol className="list-decimal list-inside space-y-2 text-sm">
                    <li>
                      Create a new project at{" "}
                      <a
                        href="https://console.firebase.google.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        Firebase Console
                      </a>
                    </li>
                    <li>Enable Authentication and Firestore Database</li>
                    <li>Copy your config from Project Settings → General → Your apps</li>
                    <li>
                      Install Firebase: <code className="bg-muted px-2 py-1 rounded">npm install firebase</code>
                    </li>
                    <li>Set up Firestore security rules</li>
                  </ol>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Environment Variables:</h4>
                  <div className="bg-muted p-4 rounded-lg font-mono text-sm space-y-2">
                    <div className="flex items-center justify-between">
                      <span>NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key</span>
                      <CopyButton text="NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key" label="Firebase API Key" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com</span>
                      <CopyButton
                        text="NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com"
                        label="Firebase Auth Domain"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id</span>
                      <CopyButton text="NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id" label="Firebase Project ID" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>NEXT_PUBLIC_USE_FIREBASE=true</span>
                      <CopyButton text="NEXT_PUBLIC_USE_FIREBASE=true" label="Firebase Flag" />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Firestore Security Rules:</h4>
                  <div className="bg-muted p-4 rounded-lg font-mono text-sm max-h-64 overflow-y-auto">
                    <pre>{`rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read all profiles but only write their own
    match /users/{userId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Skill swap requests
    match /skillSwapRequests/{requestId} {
      allow read: if request.auth != null && 
        (request.auth.uid == resource.data.fromUserId || 
         request.auth.uid == resource.data.toUserId);
      allow create: if request.auth != null && 
        request.auth.uid == request.resource.data.fromUserId;
      allow update: if request.auth != null && 
        request.auth.uid == resource.data.toUserId;
    }
  }
}`}</pre>
                  </div>
                  <CopyButton
                    text={`rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read all profiles but only write their own
    match /users/{userId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Skill swap requests
    match /skillSwapRequests/{requestId} {
      allow read: if request.auth != null && 
        (request.auth.uid == resource.data.fromUserId || 
         request.auth.uid == resource.data.toUserId);
      allow create: if request.auth != null && 
        request.auth.uid == request.resource.data.fromUserId;
      allow update: if request.auth != null && 
        request.auth.uid == resource.data.toUserId;
    }
  }
}`}
                    label="Firestore Rules"
                  />
                </div>

                <div className="flex gap-2">
                  <Button asChild>
                    <a href="https://console.firebase.google.com" target="_blank" rel="noopener noreferrer">
                      Get Started with Firebase <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* MongoDB Setup */}
          <TabsContent value="mongodb">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  <CardTitle>MongoDB Integration</CardTitle>
                </div>
                <CardDescription>
                  NoSQL document database with flexible schema and powerful querying capabilities.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Setup Steps:</h3>
                  <ol className="list-decimal list-inside space-y-2 text-sm">
                    <li>
                      Create a cluster at{" "}
                      <a
                        href="https://cloud.mongodb.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        MongoDB Atlas
                      </a>
                    </li>
                    <li>Create a database user and get your connection string</li>
                    <li>
                      Install MongoDB driver:{" "}
                      <code className="bg-muted px-2 py-1 rounded">npm install mongodb mongoose</code>
                    </li>
                    <li>Set up your database models and connection</li>
                  </ol>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Environment Variables:</h4>
                  <div className="bg-muted p-4 rounded-lg font-mono text-sm space-y-2">
                    <div className="flex items-center justify-between">
                      <span>MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/skillswap</span>
                      <CopyButton
                        text="MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/skillswap"
                        label="MongoDB URI"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>MONGODB_DB_NAME=skillswap</span>
                      <CopyButton text="MONGODB_DB_NAME=skillswap" label="MongoDB DB Name" />
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button asChild>
                    <a href="https://cloud.mongodb.com" target="_blank" rel="noopener noreferrer">
                      Get Started with MongoDB <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* PostgreSQL Setup */}
          <TabsContent value="postgresql">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Server className="h-5 w-5" />
                  <CardTitle>PostgreSQL Integration</CardTitle>
                </div>
                <CardDescription>
                  Powerful, open-source relational database with advanced features and strong consistency.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Setup Steps:</h3>
                  <ol className="list-decimal list-inside space-y-2 text-sm">
                    <li>
                      Set up a PostgreSQL database (locally or with a provider like Neon, Railway, or Vercel Postgres)
                    </li>
                    <li>
                      Install Prisma:{" "}
                      <code className="bg-muted px-2 py-1 rounded">npm install prisma @prisma/client</code>
                    </li>
                    <li>
                      Initialize Prisma: <code className="bg-muted px-2 py-1 rounded">npx prisma init</code>
                    </li>
                    <li>Set up your schema and run migrations</li>
                  </ol>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Environment Variables:</h4>
                  <div className="bg-muted p-4 rounded-lg font-mono text-sm space-y-2">
                    <div className="flex items-center justify-between">
                      <span>DATABASE_URL=postgresql://username:password@localhost:5432/skillswap</span>
                      <CopyButton
                        text="DATABASE_URL=postgresql://username:password@localhost:5432/skillswap"
                        label="Database URL"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Prisma Schema Example:</h4>
                  <div className="bg-muted p-4 rounded-lg font-mono text-sm max-h-64 overflow-y-auto">
                    <pre>{`model User {
  id        String   @id @default(cuid())
  email     String   @unique
  fullName  String
  bio       String?
  avatarUrl String?
  skills    String[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  sentRequests     SkillSwapRequest[] @relation("FromUser")
  receivedRequests SkillSwapRequest[] @relation("ToUser")

  @@map("users")
}

model SkillSwapRequest {
  id         String   @id @default(cuid())
  fromUserId String
  toUserId   String
  message    String?
  status     String   @default("pending")
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  fromUser User @relation("FromUser", fields: [fromUserId], references: [id], onDelete: Cascade)
  toUser   User @relation("ToUser", fields: [toUserId], references: [id], onDelete: Cascade)

  @@map("skill_swap_requests")
}`}</pre>
                  </div>
                  <CopyButton
                    text={`model User {
  id        String   @id @default(cuid())
  email     String   @unique
  fullName  String
  bio       String?
  avatarUrl String?
  skills    String[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  sentRequests     SkillSwapRequest[] @relation("FromUser")
  receivedRequests SkillSwapRequest[] @relation("ToUser")

  @@map("users")
}

model SkillSwapRequest {
  id         String   @id @default(cuid())
  fromUserId String
  toUserId   String
  message    String?
  status     String   @default("pending")
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  fromUser User @relation("FromUser", fields: [fromUserId], references: [id], onDelete: Cascade)
  toUser   User @relation("ToUser", fields: [toUserId], references: [id], onDelete: Cascade)

  @@map("skill_swap_requests")
}`}
                    label="Prisma Schema"
                  />
                </div>

                <div className="flex gap-2">
                  <Button asChild>
                    <a href="https://www.prisma.io" target="_blank" rel="noopener noreferrer">
                      Get Started with Prisma <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">💡 Next Steps After Database Setup</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p>• Update the authentication context to use your chosen database adapter</p>
            <p>
              • Implement the database service methods in <code>lib/database.ts</code>
            </p>
            <p>• Test the authentication flow with your new database</p>
            <p>• Set up proper error handling and validation</p>
            <p>• Configure production environment variables</p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
