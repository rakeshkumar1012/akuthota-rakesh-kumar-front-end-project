"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { Menu, X, Sun, Moon } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/contexts/auth-context"

export function Navbar() {
  const { theme, setTheme } = useTheme()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()
  const { user, logout, isAuthenticated } = useAuth()

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)
  const closeMenu = () => setIsMenuOpen(false)

  const navLinks = [
    { href: "/home", label: "Home" },
    { href: "/browse", label: "Browse", protected: true },
    { href: "/profile", label: "My Profile", protected: true },
    { href: "/blog", label: "Blog", protected: true },
  ]

  const filteredLinks = navLinks.filter((link) => !link.protected || isAuthenticated)

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/home" className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src="https://bing.com/th/id/BCO.237b06fa-fc8e-4494-9779-0ee5e6d54a32.png" alt="SkillSwap Hub Logo" />
              <AvatarFallback>SH</AvatarFallback>
            </Avatar>
            <span className="text-xl font-bold">SkillSwap Hub</span>
          </Link>
        </div>

        {/* Welcome Message */}
        {isAuthenticated && user && (
          <div className="hidden md:block">
            <p className="text-sm text-muted-foreground">
              Welcome, <span className="font-medium text-foreground">{user.fullName}</span>
            </p>
          </div>
        )}

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {filteredLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname === link.href ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Toggle Theme"
            className="mr-2"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <Link href="/profile">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/images/creator-photo.png" alt={user?.fullName || "User"} />
                  <AvatarFallback>{user?.fullName?.charAt(0) || "U"}</AvatarFallback>
                </Avatar>
              </Link>
              <Button variant="outline" size="sm" onClick={logout}>
                Logout
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/signin">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link href="/signup">
                <Button variant="default" size="sm">
                  Sign Up
                </Button>
              </Link>
            </div>
          )}

          {/* Mobile Menu Button */}
          <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleMenu} aria-label="Toggle Menu">
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="md:hidden border-t"
        >
          <div className="container py-4 space-y-3">
            {isAuthenticated && user && (
              <div className="pb-3 border-b">
                <p className="text-sm text-muted-foreground">
                  Welcome, <span className="font-medium text-foreground">{user.fullName}</span>
                </p>
              </div>
            )}
            {filteredLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block py-2 text-sm font-medium transition-colors hover:text-primary ${
                  pathname === link.href ? "text-primary" : "text-muted-foreground"
                }`}
                onClick={closeMenu}
              >
                {link.label}
              </Link>
            ))}
            {!isAuthenticated && (
              <div className="pt-3 border-t space-y-2">
                <Link href="/signin" onClick={closeMenu}>
                  <Button variant="ghost" size="sm" className="w-full justify-start">
                    Sign In
                  </Button>
                </Link>
                <Link href="/signup" onClick={closeMenu}>
                  <Button variant="default" size="sm" className="w-full">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </header>
  )
}
