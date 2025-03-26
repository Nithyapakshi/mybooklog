export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      books: {
        Row: {
          id: string
          title: string
          author: string
          cover_image: string | null
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          author: string
          cover_image?: string | null
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          author?: string
          cover_image?: string | null
          description?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      user_books: {
        Row: {
          id: string
          user_id: string
          book_id: string
          status: "reading" | "queued" | "completed" | "recommended" | "on_hold"
          rating: number | null
          notes: string | null
          start_date: string | null
          finish_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          book_id: string
          status: "reading" | "queued" | "completed" | "recommended" | "on_hold"
          rating?: number | null
          notes?: string | null
          start_date?: string | null
          finish_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          book_id?: string
          status?: "reading" | "queued" | "completed" | "recommended" | "on_hold"
          rating?: number | null
          notes?: string | null
          start_date?: string | null
          finish_date?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
