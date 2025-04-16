"use client"

import * as React from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useIsMobile } from "@/hooks/use-mobile"

const navigationItems = [
  {
    title: "Accueil",
    href: "/",
  },
  {
    title: "Services",
    href: "/services",
  },
  {
    title: "Portfolio",
    href: "/portfolio",
  },
  {
    title: "À propos",
    href: "/about",
  },
  {
    title: "Contact",
    href: "/contact",
  },
]

export function Navbar() {
  const isMobile = useIsMobile()
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)

  return (
    <nav className="w-full border-b bg-background">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
              <span className="text-lg font-bold text-primary-foreground">L</span>
            </div>
            <span className="text-xl font-bold">Logo</span>
          </Link>

          {!isMobile && (
            <div className="hidden md:flex md:items-center md:gap-6">
              {navigationItems.map((item) => (
                <Link
                  key={item.title}
                  href={item.href}
                  className="text-sm font-medium transition-colors hover:text-primary"
                >
                  {item.title}
                </Link>
              ))}
            </div>
          )}
        </div>

        {!isMobile && (
          <div className="hidden md:flex md:items-center md:gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/auth/signup">Se connecter</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/auth/signin">S'inscrire</Link>
            </Button>
          </div>
        )}

        
        {isMobile && (
          <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Menu">
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        )}
      </div>

      
      {isMobile && isMenuOpen && (
        <div className="container pb-4">
          <div className="flex flex-col space-y-3">
            {navigationItems.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className="text-sm font-medium transition-colors hover:text-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.title}
              </Link>
            ))}
            <div className="flex flex-col gap-2 pt-3">
              <Button variant="ghost" size="sm" className="justify-start" asChild>
                <Link href="/auth/login/signup">Se connecter</Link>
              </Button>
              <Button size="sm" className="justify-start" asChild>
                <Link href="/auth/signin">S'inscrire</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
