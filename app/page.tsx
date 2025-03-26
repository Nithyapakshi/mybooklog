import { redirect } from "next/navigation"

export default function HomePage() {
  // Redirect to dashboard or login page
  redirect("/dashboard")
  
  // This won't be reached, but is needed for TypeScript
  return null
}
