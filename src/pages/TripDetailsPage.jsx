import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store"; // pastikan path sesuai
import { fetchTripById } from "@/store/tripSlice";

import {
  CalendarDays, Map, PieChart, CheckSquare, Edit, Globe, Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import TripContent from "@/components/trip-details/TripContent";
import ItineraryPage from "./ItineraryPage";
import BudgetPage from "./BudgetPage";
import ChecklistPage from "./ChecklistPage";
import MapPage from "./MapPage";


const TripDetailsPage = () => {
  const { tripId } = useParams<{ tripId: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const [pgId, setPgId] = useState(0);

  const { trip, loading, error } = useSelector((state: RootState) => state.trip);

  useEffect(() => {
    if (tripId) {
      dispatch(fetchTripById(tripId));
    }
  }, [dispatch, tripId]);

  if (loading) return
  <p className="text-center py-12">Loading trip data...</p>;

  if (error) return (
    <div className="text-center py-12">
      <h1 className="text-2xl font-bold mb-4">{error}</h1>
      <Link to="/trips" className="text-travelmate-blue hover:underline">
        Back to Dashboard
      </Link>
    </div>
  );

  if (!trip) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: number) => {
    e.preventDefault();
    setPgId(id);
  };

  return (
    <div className="container mx-auto">
      {/* Header */}
      <div className="relative rounded-xl overflow-hidden h-64 mb-8">
        <img
          src={trip.thumbnail}
          alt={trip.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">{trip.name}</h1>
              <div className="flex items-center gap-4">
                <Badge variant={trip.is_private ? "default" : "secondary"}>
                  {trip.is_private ?
                    <><Globe className="mr-1 h-3 w-3" /> Public</> :
                    <><Lock className="mr-1 h-3 w-3" /> Private</>
                  }
                </Badge>
                <span className="text-white/90 text-sm">
                  {formatDate(trip.start_date)} - {formatDate(trip.end_date)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex overflow-x-auto pb-4 mb-8 gap-2">
        <Button asChild variant="outline">
          <Link to={`/mytrips/${tripId}`} onClick={(e) => handleClick(e, 0)} className="whitespace-nowrap">Overview</Link>
        </Button>
        <Button asChild variant="outline">
          <Link to={`/mytrips/${tripId}/itinerary`} onClick={(e) => handleClick(e, 1)} className="whitespace-nowrap">
            <CalendarDays className="mr-2 h-4 w-4" /> Jadwal
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link to={`/mytrips/${tripId}/budget`} onClick={(e) => handleClick(e, 2)} className="whitespace-nowrap">
            <PieChart className="mr-2 h-4 w-4" /> Anggaran
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link to={`/mytrips/${tripId}/checklist`} onClick={(e) => handleClick(e, 3)} className="whitespace-nowrap">
            <CheckSquare className="mr-2 h-4 w-4" /> Checklist
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link to={`/mytrips/${tripId}/map`} onClick={(e) => handleClick(e, 4)} className="whitespace-nowrap">
            <Map className="mr-2 h-4 w-4" /> Destinasi Map
          </Link>
        </Button>
      </div>

      {/* Content */}

      {
        pgId === 0 ? (
          <TripContent trip={trip} />
        ) : pgId === 1 ? (
          <ItineraryPage />
        ) : pgId === 2 ? (
          <BudgetPage />
        ) : pgId === 3 ? (
          <ChecklistPage />
        ) : pgId === 4 ? (
          <MapPage />
        ) : null
      }
    </div>
  );
};

export default TripDetailsPage;
