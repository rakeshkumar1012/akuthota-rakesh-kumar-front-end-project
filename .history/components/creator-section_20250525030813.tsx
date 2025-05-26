"use client"

import { motion } from "framer-motion"
import { Github, Linkedin } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"

export function CreatorSection() {
  return (
    <section className="container py-12 md:py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-4xl"
      >
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight mb-4">Crafted with Purpose</h2>
          <p className="text-muted-foreground">Meet the visionary behind SkillSwap Hub</p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-2xl p-8 md:p-12 shadow-lg"
        >
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="flex justify-center md:justify-start">
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="relative"
              >
                <div className="w-48 h-48 md:w-56 md:h-56 rounded-2xl overflow-hidden shadow-xl">
                  <Image
                    src="/images/creator-photo.png"
                    alt="Akuthota Rakesh Kumar - Creator of SkillSwap Hub"
                    width={224}
                    height={224}
                    className="w-full h-full object-cover"
                    priority
                  />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-primary text-primary-foreground rounded-full p-2">
                  <span className="text-lg">👨‍💻</span>
                </div>
              </motion.div>
            </div>

            <div className="text-center md:text-left space-y-6">
              <div>
                <h3 className="text-2xl md:text-3xl font-bold mb-2">Akuthota Rakesh Kumar</h3>
                <p className="text-primary font-medium mb-4">Founder & Developer</p>
                <blockquote className="text-lg italic text-muted-foreground border-l-4 border-primary pl-4">
                  "Building bridges through shared skills and learning."
                </blockquote>
              </div>

              <div className="space-y-4">
                <p className="text-muted-foreground">
                  Passionate about creating platforms that connect people and foster collaborative learning. SkillSwap
                  Hub is my vision of a world where knowledge flows freely between individuals.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button asChild variant="default" className="rounded-xl flex items-center gap-2">
                      <a href="https://github.com/rakeshkumar1012" target="_blank" rel="noopener noreferrer">
                        <Github className="h-4 w-4" />
                        Connect on GitHub
                      </a>
                    </Button>
                  </motion.div>

                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button asChild variant="outline" className="rounded-xl flex items-center gap-2">
                      <a
                        href="https://www.linkedin.com/in/akuthota-rakesh-kumar-863053241/"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Linkedin className="h-4 w-4" />
                        Connect on LinkedIn
                      </a>
                    </Button>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}
