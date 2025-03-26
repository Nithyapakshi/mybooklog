"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { addBookToUserCollection } from "@/lib/book-service"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle } from 'lucide-react'
import { Alert, AlertDescription } from "@/components/ui/alert"

export function AddBookForm() {
  const { user } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [title, setTitle] = useState("")
  const [author, setAuthor] = useState("")
  const [coverImage, setCoverImage] = useState("")
  const [description, setDescription] = useState("")
  const [status, setStatus] = useState<string>("reading")
  const [notes, setNotes] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      setError("You must be logged in to add a book")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      await addBookToUserCollection(
        user.id,
        {
          title,
          author,
          cover_image: coverImage || undefined,
          description: description || undefined,
        },
        {
          status: status as any,
          notes: notes || undefined,
        },
      )

      router.push("/dashboard")
      router.refresh()
    } catch (err) {
      console.error("Error adding book:", err)
      setError("Failed to add book. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle>Add a New Book</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Book Title *</Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="author">Author *</Label>
            <Input id="author" value={author} onChange={(e) => setAuthor(e.target.value)} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cover">Cover Image URL</Label>
            <Input
              id="cover"
              type="url"
              placeholder="https://example.com/book-cover.jpg"
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Book Description</Label>
            <Textarea
              id="description"
              placeholder="What's this book about?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[100px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status *</Label>
            <Select value={status} onValueChange={setStatus} required>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="reading">Currently Reading</SelectItem>
                <SelectItem value="queued">Want to Read</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="recommended">My Recommendation</SelectItem>
                <SelectItem value="on_hold">On Hold</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Your Notes</Label>
            <Textarea
              id="notes"
              placeholder="Any thoughts about this book?"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-[100px]"
            />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Adding Book..." : "Add Book"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
