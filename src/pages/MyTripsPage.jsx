import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/use-redux.ts";
import { getAllTrips } from "@/store/tripSlice";
import { Link } from "react-router-dom";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TripCard } from "@/components/TripCard";

interface Trip {
  id: number;
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  thumbnail: string;
}


const MyTripsPage = () => {
  const dispatch = useAppDispatch();
  const { trips, loading } = useAppSelector((state) => state.trip);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    dispatch(getAllTrips());
  }, [dispatch]);

  const now = new Date();

  const filteredTrips = trips.filter(trip =>
    trip.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    trip.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const upcomingTrips = filteredTrips.filter(trip => new Date(trip.start_date) > now);
  const pastTrips = filteredTrips.filter(trip => new Date(trip.end_date) < now);

  return (
    <div className="container mx-auto">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-travelmate-charcoal">My Trips</h1>
          <p className="text-muted-foreground">Manage and explore your travel plans</p>
        </div>

        <div className="flex w-full md:w-auto gap-3">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search trips..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button className="whitespace-nowrap" asChild>
            <Link to="/mytrips/new">
              <Plus className="mr-2 h-4 w-4" />
              New Trip
            </Link>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-6">
          {loading ? (
            <p>Loading...</p>
          ) : upcomingTrips.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl text-gray-500 mb-4">No upcoming trips found</p>
              <Button asChild>
                <Link to="/mytrips/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Your First Trip
                </Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingTrips.map(trip => (
                <TripCard key={trip.id} trip={trip} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="past" className="space-y-6">
          {loading ? (
            <p>Loading...</p>
          ) : pastTrips.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No past trips found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pastTrips.map(trip => (
                <TripCard key={trip.id} trip={trip} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MyTripsPage;
