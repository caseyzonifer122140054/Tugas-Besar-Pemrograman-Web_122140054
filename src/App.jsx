
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout.jsx";
import { ProtectedRoute } from "./components/ProtectedRoute.jsx";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./store/store.js";
import AddNewTripPage from "./pages/AddNewTripPage.jsx";

// Pages
import HomePage from "./pages/HomePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import MyTripsPage from "./pages/MyTripsPage.jsx";
import TripDetailsPage from "./pages/TripDetailsPage.jsx";
import ItineraryPage from "./pages/ItineraryPage.jsx";
import BudgetPage from "./pages/BudgetPage.jsx";
import ChecklistPage from "./pages/ChecklistPage.jsx";
import MapPage from "./pages/MapPage.jsx";
import NotFound from "./pages/NotFound.jsx";
import TripsPage from "./pages/TripsPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import NotificationsPage from "./pages/NotificationPage.jsx";

const queryClient = new QueryClient();

const App = () => (
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />

              {/* Protected Routes */}
              <Route path="/mytrips" element={
                <ProtectedRoute>
                  <Layout><MyTripsPage /></Layout>
                </ProtectedRoute>
              } />
              <Route path="/trips" element={
                <ProtectedRoute>
                  <Layout><TripsPage /></Layout>
                </ProtectedRoute>
              } />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Layout><DashboardPage /></Layout>
                </ProtectedRoute>
              } />
              <Route path="/mytrips/new" element={
                <ProtectedRoute>
                  <Layout><AddNewTripPage /></Layout>
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Layout><ProfilePage /></Layout>
                </ProtectedRoute>
              } />
              <Route path="/mytrips/:tripId" element={
                <ProtectedRoute>
                  <Layout><TripDetailsPage /></Layout>
                </ProtectedRoute>
              } />
              <Route path="/notifications" element={
                <ProtectedRoute>
                  <Layout><NotificationsPage /></Layout>
                </ProtectedRoute>
              } />
              <Route path="/mytrips/:tripId/itinerary" element={
                <ProtectedRoute>
                  <Layout><ItineraryPage /></Layout>
                </ProtectedRoute>
              } />
              <Route path="/mytrips/:tripId/budget" element={
                <ProtectedRoute>
                  <Layout><BudgetPage /></Layout>
                </ProtectedRoute>
              } />
              <Route path="/mytrips/:tripId/checklist" element={
                <ProtectedRoute>
                  <Layout><ChecklistPage /></Layout>
                </ProtectedRoute>
              } />
              <Route path="/mytrips/:tripId/map" element={
                <ProtectedRoute>
                  <Layout><MapPage /></Layout>
                </ProtectedRoute>
              } />

              {/* Catch All Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </PersistGate>
  </Provider>
);

export default App;
