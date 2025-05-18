
import { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { Home, Bell, LogOut, Menu, X, LocateIcon, PersonStanding, LocateFixedIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAppDispatch, useAppSelector } from "@/hooks/use-redux";
import { logout } from "@/store/authSlice";
import { toast } from "sonner";
import api from "@/utils/api";

interface SidebarLinkProps {
  to: string;
  icon: React.ElementType;
  label: string;
  isActive: boolean;
  badgeCount?: number;
  onClick?: () => void;
}

const SidebarLink = ({ to, icon: Icon, label, badgeCount, isActive, onClick }: SidebarLinkProps) => {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors relative",
        isActive
          ? "bg-sidebar-primary text-sidebar-primary-foreground"
          : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
      )}
    >
      <Icon size={20} />
      <span>{label}</span>

      {/* Badge */}
      {badgeCount && badgeCount > 0 && (
        <span className="absolute right-4 top-1/2 -translate-y-1/2 inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
          {badgeCount}
        </span>
      )}
    </NavLink>
  );
};

export function AppSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const dispatch = useAppDispatch();
  const [notificationCount, setNotificationCount] = useState(3);
  const { isAuthenticated } = useAppSelector(state => state.auth);


  useEffect(() => {
    const fetchNotifications = async () => {
      api.get("/api/notifications")
        .then((response) => {
          const notifications = response.data;
          setNotificationCount(notifications.filter((notif) => !notif.read).length);
        })
        .catch((error) => {
          console.error("Error fetching notifications:", error);
        });
    }

    fetchNotifications();
  }, []);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const closeSidebarOnMobile = () => {
    if (isMobile) {
      setIsOpen(false);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged out successfully");
    navigate("/login");
    closeSidebarOnMobile();
  };

  const links = [
    { to: "/dashboard", icon: Home, label: "Dashboard" },
    { to: "/mytrips", icon: LocateFixedIcon, label: "Perjalanan Saya" },
    { to: "/profile", icon: PersonStanding, label: "Profile" },
    { to: "/notifications", icon: Bell, label: "Notifikasi", hasBadge: true },
  ];

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleSidebar}
        className="fixed top-4 right-4 z-50 lg:hidden"
      >
        {isOpen ? <X /> : <Menu />}
      </Button>

      <div className={cn(
        "fixed top-0 left-0 z-40 h-full w-64 bg-sidebar transition-transform duration-300 ease-in-out",
        "shadow-lg flex flex-col border-r",
        isMobile ? (isOpen ? "translate-x-0" : "-translate-x-full") : "translate-x-0"
      )}>
        <div className="p-4 border-b">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-travelmate-blue flex items-center justify-center">
              <span className="text-white font-bold text-lg">T</span>
            </div>
            <span className="font-bold text-xl text-travelmate-blue">TravelMate</span>
          </div>
        </div>

        <div className="flex-1 py-6 space-y-2 px-2">
          {links.map((link) => (
            <SidebarLink
              key={link.to}
              to={link.to}
              icon={link.icon}
              label={link.label}
              isActive={
                link.to === "/"
                  ? location.pathname === "/"
                  : location.pathname.includes(link.to)
              }
              onClick={closeSidebarOnMobile}
              badgeCount={link.hasBadge ? notificationCount : undefined}
            />
          ))}
        </div>

        <div className="p-4 border-t mt-auto">
          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 text-sidebar-foreground hover:text-sidebar-primary w-full"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          ) : (
            <NavLink
              to="/login"
              onClick={closeSidebarOnMobile}
              className="flex items-center gap-3 text-sidebar-foreground hover:text-sidebar-primary"
            >
              <LogOut size={20} />
              <span>Login / Register</span>
            </NavLink>
          )}
        </div>
      </div>
    </>
  );
}