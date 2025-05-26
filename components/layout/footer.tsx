"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { Github, Linkedin, Mail, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

export function Footer() {
  const [contactModalOpen, setContactModalOpen] = useState(false)
  const [helpModalOpen, setHelpModalOpen] = useState(false)
  const [termsModalOpen, setTermsModalOpen] = useState(false)
  const [privacyModalOpen, setPrivacyModalOpen] = useState(false)
  const { toast } = useToast()

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: "Message sent!",
      description: "Thank you for contacting us. We'll get back to you soon.",
    })
    setContactModalOpen(false)
  }

  const handleFeedbackClick = () => {
    toast({
      title: "Feature coming soon",
      description: "The feedback feature will be available in the next update.",
    })
  }

  return (
    <>
      <footer className="border-t bg-muted/40">
        <div className="container py-8 md:py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold mb-4">Navigation</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/home" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    href="/browse"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Browse
                  </Link>
                </li>
                <li>
                  <Link
                    href="/profile"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    My Profile
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Blog
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => setContactModalOpen(true)}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Contact
                  </button>
                </li>
                <li>
                  <button
                    onClick={handleFeedbackClick}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Feedback
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setHelpModalOpen(true)}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Help
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => setTermsModalOpen(true)}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Terms & Conditions
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setPrivacyModalOpen(true)}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Privacy Policy
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Connect</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="https://github.com/rakeshkumar1012"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-2 transition-colors"
                  >
                    <Github className="h-4 w-4" />
                    GitHub
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.linkedin.com/in/akuthota-rakesh-kumar-863053241/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-2 transition-colors"
                  >
                    <Linkedin className="h-4 w-4" />
                    LinkedIn
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center">
            <p className="text-lg font-bold text-primary mb-2">Crafted by Akuthota Rakesh Kumar</p>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} SkillSwap Hub. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Contact Modal */}
      <Dialog open={contactModalOpen} onOpenChange={setContactModalOpen}>
        <DialogContent className="sm:max-w-[425px] rounded-2xl">
          <DialogHeader>
            <DialogTitle>Contact Us</DialogTitle>
            <DialogDescription>Send us a message and we'll get back to you as soon as possible.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleContactSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="contact-name">Name</Label>
              <Input id="contact-name" placeholder="Your name" required className="rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact-email">Email</Label>
              <Input
                id="contact-email"
                type="email"
                placeholder="your.email@example.com"
                required
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact-message">Message</Label>
              <Textarea
                id="contact-message"
                placeholder="How can we help you?"
                required
                className="rounded-xl min-h-[100px]"
              />
            </div>
            <Button type="submit" className="w-full rounded-xl">
              Send Message
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Help Modal */}
      <Dialog open={helpModalOpen} onOpenChange={setHelpModalOpen}>
        <DialogContent className="sm:max-w-[425px] rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Help & Support
            </DialogTitle>
            <DialogDescription>Coming soon! We're working on comprehensive help documentation.</DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
              <Mail className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">Email Support</p>
                <p className="text-sm text-muted-foreground">support@skillswaphub.com</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
              <Phone className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">Phone Support</p>
                <p className="text-sm text-muted-foreground">+91-1234567890</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Our support team is available Monday to Friday, 9 AM to 6 PM IST.
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Terms Modal */}
      <Dialog open={termsModalOpen} onOpenChange={setTermsModalOpen}>
        <DialogContent className="sm:max-w-[600px] rounded-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Terms & Conditions</DialogTitle>
            <DialogDescription>
              Please read these terms and conditions carefully before using SkillSwap Hub.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4 text-sm">
            <p>
              <strong>SkillSwap Hub</strong> is a peer-to-peer learning platform that connects individuals who want to
              share and learn skills from each other.
            </p>
            <p>
              Users are responsible for the content they share and the accuracy of their skill descriptions. We do not
              guarantee the quality of any skill shared on our platform.
            </p>
            <p>By using SkillSwap Hub, you agree to:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Provide accurate information about your skills and learning goals</li>
              <li>Treat other users with respect and professionalism</li>
              <li>Not share inappropriate or harmful content</li>
              <li>Respect intellectual property rights</li>
            </ul>
            <p>
              We reserve the right to suspend or terminate accounts that violate these terms or engage in harmful
              behavior.
            </p>
            <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Privacy Modal */}
      <Dialog open={privacyModalOpen} onOpenChange={setPrivacyModalOpen}>
        <DialogContent className="sm:max-w-[600px] rounded-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Privacy Policy</DialogTitle>
            <DialogDescription>
              Your privacy is important to us. Here's how we handle your information.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4 text-sm">
            <p>
              We collect user data such as email addresses, profile details, and skill information to personalize your
              experience on SkillSwap Hub.
            </p>
            <p>
              <strong>Information we collect:</strong>
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Email address and display name</li>
              <li>Skills you can teach and want to learn</li>
              <li>Profile bio and preferences</li>
              <li>Usage data to improve our services</li>
            </ul>
            <p>
              <strong>How we use your information:</strong>
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>To match you with relevant skill partners</li>
              <li>To improve our platform and services</li>
              <li>To communicate important updates</li>
            </ul>
            <p>
              Your information is never shared with third parties without your explicit consent. We use
              industry-standard security measures to protect your data.
            </p>
            <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
