import { supabase } from './supabase'
import { Database } from './database.types'

export type Book = Database['public']['Tables']['books']['Row']
export type UserBook = Database['public']['Tables']['user_books']['Row']
export type BookStatus = 'reading' | 'queued' | 'completed' | 'recommended' | 'on_hold'

// Get all books for a user with a specific status
export async function getUserBooks(userId: string, status?: BookStatus) {
  let query = supabase
    .from('user_books')
    .select(`
      id,
      status,
      rating,
      notes,
      start_date,
      finish_date,
      books (
        id,
        title,
        author,
        cover_image,
        description
      )
    `)
    .eq('user_id', userId)
  
  if (status) {
    query = query.eq('status', status)
  }
  
  const { data, error } = await query
  
  if (error) {
    console.error('Error fetching user books:', error)
    throw error
  }
  
  return data
}

// Add a book to user's collection
export async function addBookToUserCollection(
  userId: string,
  bookData: {
    title: string
    author: string
    cover_image?: string
    description?: string
  },
  userBookData: {
    status: BookStatus
    rating?: number
    notes?: string
    start_date?: string
    finish_date?: string
  }
) {
  // First, check if the book already exists
  const { data: existingBooks, error: searchError } = await supabase
    .from('books')
    .select('id')
    .eq('title', bookData.title)
    .eq('author', bookData.author)
    .limit(1)
  
  if (searchError) {
    console.error('Error searching for book:', searchError)
    throw searchError
  }
  
  let bookId: string
  
  // If book doesn't exist, create it
  if (!existingBooks || existingBooks.length === 0) {
    const { data: newBook, error: insertError } = await supabase
      .from('books')
      .insert(bookData)
      .select('id')
      .single()
    
    if (insertError) {
      console.error('Error creating book:', insertError)
      throw insertError
    }
    
    bookId = newBook.id
  } else {
    bookId = existingBooks[0].id
  }
  
  // Now add the book to user's collection
  const { data, error } = await supabase
    .from('user_books')
    .insert({
      user_id: userId,
      book_id: bookId,
      ...userBookData
    })
    .select()
    .single()
  
  if (error) {
    console.error('Error adding book to collection:', error)
    throw error
  }
  
  return data
}

// Update a user book
export async function updateUserBook(
  userBookId: string,
  userId: string,
  updateData: {
    status?: BookStatus
    rating?: number | null
    notes?: string | null
    start_date?: string | null
    finish_date?: string | null
  }
) {
  const { data, error } = await supabase
    .from('user_books')
    .update(updateData)
    .eq('id', userBookId)
    .eq('user_id', userId) // Extra security check
    .select()
    .single()
  
  if (error) {
    console.error('Error updating user book:', error)
    throw error
  }
  
  return data
}

// Remove a book from user's collection
export async function removeUserBook(userBookId: string, userId: string) {
  const { error } = await supabase
    .from('user_books')
    .delete()
    .eq('id', userBookId)
    .eq('user_id', userId) // Extra security check
  
  if (error) {
    console.error('Error removing book from collection:', error)
    throw error
  }
  
  return true
}

// Search for books in the database
export async function searchBooks(query: string) {
  const { data, error } = await supabase
    .from('books')
    .select('*')
    .or(`title.ilike.%${query}%,author.ilike.%${query}%`)
    .limit(10)
  
  if (error) {
    console.error('Error searching books:', error)
    throw error
  }
  
  return data
}
