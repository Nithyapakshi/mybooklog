import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { BookList } from '@/components/book/book-list'

export default async function DashboardPage() {
  const supabase = createServerComponentClient({ cookies })
  
  // Check if user is authenticated
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session) {
    redirect('/login')
  }
  
  // Fetch user's books
  const { data: readingBooks } = await supabase
    .from('user_books')
    .select(`
      id,
      status,
      rating,
      books (
        id,
        title,
        author,
        cover_image
      )
    `)
    .eq('user_id', session.user.id)
    .eq('status', 'reading')
  
  const { data: queuedBooks } = await supabase
    .from('user_books')
    .select(`
      id,
      status,
      books (
        id,
        title,
        author,
        cover_image
      )
    `)
    .eq('user_id', session.user.id)
    .eq('status', 'queued')
    .limit(5)
  
  const { data: completedBooks } = await supabase
    .from('user_books')
    .select(`
      id,
      status,
      rating,
      books (
        id,
        title,
        author,
        cover_image
      )
    `)
    .eq('user_id', session.user.id)
    .eq('status', 'completed')
    .order('finish_date', { ascending: false })
    .limit(5)
  
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Your Reading Dashboard</h1>
      
      <div className="space-y-10">
        <section>
          <h2 className="text-2xl font-semibold mb-4">Currently Reading</h2>
          <BookList books={readingBooks || []} emptyMessage="You're not reading any books right now." />
        </section>
        
        <section>
          <h2 className="text-2xl font-semibold mb-4">Up Next</h2>
          <BookList books={queuedBooks || []} emptyMessage="Your reading queue is empty." />
        </section>
        
        <section>
          <h2 className="text-2xl font-semibold mb-4">Recently Completed</h2>
          <BookList books={completedBooks || []} emptyMessage="You haven't completed any books yet." />
        </section>
      </div>
    </div>
  )
}
