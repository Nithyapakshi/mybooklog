import Image from 'next/image'
import Link from 'next/link'
import { Star } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

type BookListProps = {
  books: any[]
  emptyMessage: string
}

export function BookList({ books, emptyMessage }: BookListProps) {
  if (!books || books.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        {emptyMessage}
      </div>
    )
  }
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {books.map((userBook) => (
        <Link href={`/books/${userBook.id}`} key={userBook.id}>
          <Card className="h-full hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="aspect-[2/3] relative mb-3 bg-muted rounded-md overflow-hidden">
                {userBook.books.cover_image ? (
                  <Image
                    src={userBook.books.cover_image || "/placeholder.svg"}
                    alt={userBook.books.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    No Cover
                  </div>
                )}
              </div>
              <h3 className="font-medium line-clamp-2">{userBook.books.title}</h3>
              <p className="text-sm text-muted-foreground">{userBook.books.author}</p>
              
              {userBook.rating && (
                <div className="flex items-center mt-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < userBook.rating ? 'text-yellow-500 fill-yellow-500' : 'text-muted-foreground'
                      }`}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}
