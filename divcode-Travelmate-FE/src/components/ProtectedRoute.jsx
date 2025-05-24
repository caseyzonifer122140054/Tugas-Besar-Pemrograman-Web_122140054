import { Navigate } from "react-router-dom"
import { useAppSelector } from "../hooks/use-redux"

export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAppSelector(state => state.auth)

  if (!isAuthenticated) {
    // Redirect to login page if not authenticated
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}
