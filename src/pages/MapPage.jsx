
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { trips } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import { DialogHeader } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import api from "@/utils/api";
import { toast } from "sonner";
import { t } from "node_modules/framer-motion/dist/types.d-CtuPurYT";


interface Location {
  id: number;
  trip_id: number;
  name: string;
  latitude: number;
  longitude: number;
  address?: string;
  description?: string;
  notes?: string;
}

const MapPage = () => {
  const { tripId } = useParams<{ tripId: string }>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [locations, setLocations] = useState<Location[]>([

  ]);


  const [form, setForm] = useState({
    name: "",
    latitude: "",
    longitude: "",
    address: "",
    description: "",
    notes: "",
  });
  const trip = trips[0];

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };


  useEffect(() => {
    // fetch locations from API
    const fetchLocations = async () => {
      try {
        const response = await api.get(`/api/destinations/` + tripId);
        setLocations(response.data.data);
      } catch (error) {
        console.error("Error fetching locations:", error);
      }
    };
    fetchLocations();
  }, [tripId]);

  // Handle submit tambah lokasi
  const handleAddLocation = (e: React.FormEvent) => {
    e.preventDefault();

    // Validasi sederhana
    if (!form.name || !form.latitude || !form.longitude) {
      alert("Name, Latitude, dan Longitude wajib diisi!");
      return;
    }

    const newLocation: Location = {
      id: locations.length + 1,
      trip_id: Number(tripId || trip.id),
      name: form.name,
      latitude: parseFloat(form.latitude),
      longitude: parseFloat(form.longitude),
      address: form.address,
      description: form.description,
      notes: form.notes,
    };

    setLocations(prev => [...prev, newLocation]);
    api.post("/api/destinations/store", newLocation).then((_) => {

      setForm({
        name: "",
        latitude: "",
        longitude: "",
        address: "",
        description: "",
        notes: "",
      });
      setIsModalOpen(false);
      toast.success("Location added successfully!");
    })
  };

  return (
    <>
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-travelmate-charcoal">Trip Map</h1>
            <p className="text-muted-foreground">Explore your destination: {trip.destination}</p>
          </div>


          <Button onClick={() => setIsModalOpen(true)} className="whitespace-nowrap">
            <Plus className="mr-2 h-4 w-4" /> Add Location
          </Button>



        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Map Container */}
          <div className="lg:col-span-3">
            <Card className="overflow-hidden">
              <CardHeader className="pb-0">
                <CardTitle>Map View</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {/* Static Map Image - Replace this with an actual embed in a real application */}
                <div className="h-[500px] w-full bg-gray-200 relative">
                  {/* This would be a Google Maps iframe or similar in a real application */}
                  <iframe
                    title="Map View"
                    className="w-full h-full"
                    src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBhKr0Jd85WNgIGVzwMc2_ZIaA-i7vXZqM&q=${encodeURIComponent(trip.destination)}`}
                    allowFullScreen
                  ></iframe>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Points of Interest */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Points of Interest</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">

                  {locations.map((location) => (
                    <div key={location.id} className="p-3 bg-muted/50 rounded-lg">
                      <h3 className="font-medium">{location.name}</h3>
                      <p className="text-sm text-muted-foreground">{location.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Dialog.Root open={isModalOpen} onOpenChange={setIsModalOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 max-w-md w-full -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-lg focus:outline-none">
            <Dialog.Title className="text-lg font-bold mb-4">Add New Location</Dialog.Title>
            <form onSubmit={handleAddLocation} className="space-y-4">
              <Input
                placeholder="Name"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
              />
              <Input
                placeholder="Latitude"
                name="latitude"
                type="number"
                step="any"
                value={form.latitude}
                onChange={handleChange}
                required
              />
              <Input
                placeholder="Longitude"
                name="longitude"
                type="number"
                step="any"
                value={form.longitude}
                onChange={handleChange}
                required
              />
              <Input
                placeholder="Address"
                name="address"
                value={form.address}
                onChange={handleChange}
              />
              <Textarea
                placeholder="Description"
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={3}
              />
              <Textarea
                placeholder="Notes"
                name="notes"
                value={form.notes}
                onChange={handleChange}
                rows={3}
              />
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Add Location</Button>
              </div>
            </form>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
};

export default MapPage;
