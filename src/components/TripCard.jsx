
import { Link } from "react-router-dom";
import { Calendar, MapPin, Users } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trip } from "@/data/mockData";

interface TripCardProps {
  trip: Trip;
}

function formatDateRange(startDate: string, endDate: string): string {
  const start = new Date(startDate);
  const end = new Date(endDate);

  const startMonth = start.toLocaleString('default', { month: 'short' });
  const endMonth = end.toLocaleString('default', { month: 'short' });

  if (startMonth === endMonth) {
    return `${startMonth} ${start.getDate()} - ${end.getDate()}, ${start.getFullYear()}`;
  }

  return `${startMonth} ${start.getDate()} - ${endMonth} ${end.getDate()}, ${start.getFullYear()}`;
}

export function TripCard({ trip }: TripCardProps) {
  const { id, name, destination, start_date, end_date, thumbnail, members } = trip;

  // status by date
  const now = new Date();
  const isUpcoming = new Date(start_date) > now;
  const isPast = new Date(end_date) < now;
  const status = isUpcoming ? 'upcoming' : isPast ? 'past' : 'ongoing';

  return (
    <Card className="h-full overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative h-48 overflow-hidden">
        <img
          src={thumbnail}
          alt={name}
          className="w-full h-full object-cover"
        />
        <Badge
          variant={status === 'upcoming' ? "default" : "secondary"}
          className="absolute top-3 right-3"
        >
          {status === 'upcoming' ? 'Upcoming' : 'Past'}
        </Badge>
      </div>

      <CardHeader className="pb-2">
        <CardTitle className="text-xl line-clamp-1">{name}</CardTitle>
        <CardDescription className="flex items-center gap-1">
          <MapPin className="h-3.5 w-3.5" />
          {destination}
        </CardDescription>
      </CardHeader>

      <CardContent className="pb-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
          <Calendar className="h-3.5 w-3.5" />
          <span>{formatDateRange(start_date, end_date)}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex -space-x-2">
            {members.slice(0, 3).map((member) => (
              <Avatar key={member.id} className="border-2 border-background w-8 h-8">
                <AvatarImage src={member.avatar} />
                <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
              </Avatar>
            ))}
            {members.length > 3 && (
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center border-2 border-background text-xs font-medium">
                +{members.length - 3}
              </div>
            )}
          </div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Users className="h-3.5 w-3.5" />
            {members.length}
          </div>
        </div>
      </CardContent>

      <CardFooter>
        <Link
          to={`/mytrips/${id}`}
          className="text-travelmate-blue hover:text-travelmate-blue/80 text-sm font-medium"
        >
          View Details
        </Link>
      </CardFooter>
    </Card>
  );
}
