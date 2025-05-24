import { AppSidebar } from "./AppSidebar"
import { useIsMobile } from "@/hooks/use-mobile"

export function Layout({ children }) {
  const isMobile = useIsMobile()

  return (
    <div className="flex min-h-screen w-full bg-background">
      <AppSidebar />
      <main className={`flex-1 p-6 ${!isMobile ? "ml-64" : ""}`}>
        {children}
      </main>
    </div>
  )
}
