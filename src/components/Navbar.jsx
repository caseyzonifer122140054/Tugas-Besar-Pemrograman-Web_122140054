import { Link } from "react-router-dom";
import { Menu, X, User, LogOut } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-xl font-bold text-travelmate-blue">TravelMate</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-sm font-medium hover:text-travelmate-blue transition-colors">
            Home
          </Link>
          <Link to="/trips" className="text-sm font-medium hover:text-travelmate-blue transition-colors">
            Explore
          </Link>
          <Link to="/mytrips" className="text-sm font-medium hover:text-travelmate-blue transition-colors">
            My Trips
          </Link>
          <div className="flex items-center gap-4">
            <Avatar className="h-8 w-8">
              <AvatarImage src="https://i.pravatar.cc/150?img=1" alt="User" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
          </div>
        </nav>

        {/* Mobile Navigation */}
        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" aria-label="Menu">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[400px]">
            <nav className="flex flex-col gap-6 mt-8">
              <Link
                to="/"
                className="text-lg font-medium hover:text-travelmate-blue transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/trips"
                className="text-lg font-medium hover:text-travelmate-blue transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Explore
              </Link>
              <Link
                to="/mytrips"
                className="text-lg font-medium hover:text-travelmate-blue transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                My Trips
              </Link>
              <div className="flex items-center gap-4 mt-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="https://i.pravatar.cc/150?img=1" alt="User" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">John Doe</p>
                  <p className="text-xs text-muted-foreground">john.doe@example.com</p>
                </div>
              </div>
              <Button variant="outline" className="mt-4 w-full justify-start" size="sm">
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}