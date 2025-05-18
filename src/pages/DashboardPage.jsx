import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trips } from "@/data/mockData";
import api from "@/utils/api";
import { CalendarDays, Map, PieChart, CheckSquare, Users, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const DashboardPage = () => {
  // Calculate some statistics for the dashboard
  const totalTrips = trips.length;
  const upcomingTrips = trips.filter(trip => trip.status === 'upcoming').length;
  const pastTrips = trips.filter(trip => trip.status === 'past').length;

  const [dashboardData, setDashboardData] = useState<{
    total_trips: number,
    upcoming_trips: number,
    completed_trips: number
  }>({
    total_trips: 0,
    upcoming_trips: 0,
    completed_trips: 9
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        api.get('/api/dashboard')
          .then((response) => {
            console.log("Dashboard data:", response.data.data);
            setDashboardData(response.data.data);
          })
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchDashboardData();
  }, []);


  return (
    <div className="container mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-travelmate-charcoal">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's an overview of your travel plans</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Trips</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{dashboardData.total_trips}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Upcoming Trips</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{dashboardData.upcoming_trips}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Completed Trips</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{dashboardData.completed_trips}</div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity and Quick Links */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Quick Links */}
        <div>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Shortcuts to common tasks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link
                to="/mytrips/new"
                className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-travelmate-blue/10">
                  <TrendingUp className="h-4 w-4 text-travelmate-blue" />
                </div>
                <div>
                  <p className="font-medium">Create New Trip</p>
                  <p className="text-sm text-muted-foreground">Plan your next adventure</p>
                </div>
              </Link>

              <Link
                to="/mytrips"
                className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-travelmate-purple/10">
                  <Users className="h-4 w-4 text-travelmate-purple" />
                </div>
                <div>
                  <p className="font-medium">My Trips</p>
                  <p className="text-sm text-muted-foreground">View your travel plans</p>
                </div>
              </Link>

              <Link
                to="/profile"
                className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-travelmate-green/10">
                  <Users className="h-4 w-4 text-travelmate-green" />
                </div>
                <div>
                  <p className="font-medium">Profile Settings</p>
                  <p className="text-sm text-muted-foreground">Update your information</p>
                </div>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;