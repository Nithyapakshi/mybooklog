"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { BookOpen, PlusCircle, LogOut } from 'lucide-react'

export function NavBar() {
  const pathname = usePathname()
  const { user, signOut } = useAuth()

  // Don't show navbar on login page
  if (pathname === "/login") return null

  // Don't show navbar if user is not logged in
  if (!user) return null

  return (
    <header className="border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
            <BookOpen className="h-5 w-5" />
            <span>BookLog</span>
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link
              href="/dashboard"
              className={`text-sm font-medium ${
                pathname === "/dashboard" ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Dashboard
            </Link>
            <Link
              href="/books/add"
              className={`text-sm font-medium ${
                pathname === "/books/add" ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Add Book
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:block text-sm text-muted-foreground">
            {user.name || user.email}
          </div>
          <div className="flex md:hidden">
            <Link href="/books/add">
              <Button variant="ghost" size="icon">
                <PlusCircle className="h-5 w-5" />
                <span className="sr-only">Add Book</span>
              </Button>
            </Link>
          </div>
          <Button variant="ghost" size="icon" onClick={() => signOut()}>
            <LogOut className="h-5 w-5" />
            <span className="sr-only">Log out</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
