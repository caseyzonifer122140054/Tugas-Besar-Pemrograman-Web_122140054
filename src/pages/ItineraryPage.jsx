
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd";
import { Plus, GripVertical, MapPin, Clock, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { itineraryItems as initialItems, Trip } from "@/data/mockData";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Interface } from "readline";
import LoadingComponent from "@/components/LoadingComponent";
import api from "@/utils/api";
import { set } from "date-fns";
import { toast } from "sonner";
import { closeWebSocket, connectWebSocket } from "@/utils/websocket";

const getDaysFromItems = (items: Activity[]) => {
  const days = [...new Set(items.map(item => item.order))].sort((a, b) => a - b);
  return days;
};

interface Activity {
  id: number
  itinerary_id: number;
  title: string;
  description: string;
  time: string;
  category: string;
  location: string;
  order: number;
}

interface ItineraryItem {
  id: number;
  day_number: number;
  activities: Array<Activity>;
}

const ItineraryPage = () => {
  const { tripId } = useParams<{ tripId: string }>();
  const [itineraryItems, setItineraryItems] = useState<ItineraryItem[]>([]);
  const [days, setDays] = useState<ItineraryItem[]>([]);
  const [currentDay, setCurrentDay] = useState<number>(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filteredItems, setFilteredItems] = useState<Activity[]>(itineraryItems.filter(item => item.day_number === currentDay)[0]?.activities || []);

  const [formData, setFormData] = useState({
    order: 1,
    title: "",
    description: "",
    time: "",
    category: "",
    location: ""
  });

  useEffect(() => {
    const fetchItineraryItems = async () => {
      const response = await api.get(`/api/trips/${tripId}/itinerary`)
      const data = response.data.data as ItineraryItem[];
      setItineraryItems(data);
      setDays(response.data.data as ItineraryItem[]);
      setFilteredItems(data.filter(item => item.day_number === currentDay)[0]?.activities.sort((a, b) => a.order - b.order) || []);
      setLoading(false);
    };

    fetchItineraryItems();

    connectWebSocket(tripId, (message) => {
      if (message.event === "activity_created" || message.event === "activity_deleted" || message.event === "activity_updated") {
        fetchItineraryItems();
        console.log("WebSocket message received:", message.event);
      }
      console.log("WebSocket message received:", message.event);
    });

    return () => {
      closeWebSocket();
    };
  }, [tripId, currentDay]);

  useEffect(() => {
    const filtered = itineraryItems.filter(item => item.day_number === currentDay)[0]?.activities || [];
    setFilteredItems(filtered);
  }, [currentDay, itineraryItems]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddActivity = async () => {
    const newItem = {
      ...formData,
      order: filteredItems.length + 1,
    };
    console.log(newItem)
    try {
      const add = await api.post(`/api/itinerary/${currentDay}/activities`, newItem);

      const response = await api.get(`/api/trips/${tripId}/itinerary`)
      setItineraryItems(response.data.data as ItineraryItem[]);
      setDays(response.data.data as ItineraryItem[]);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error adding activity:", error);
    }
    // setFormData({ order: 1, title: "", description: "", time: "", category: "", location: "" });
  };



  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'activity':
        return "bg-blue-100 text-blue-800";
      case 'transportation':
        return "bg-green-100 text-green-800";
      case 'accommodation':
        return "bg-purple-100 text-purple-800";
      case 'food':
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleDragEnd = (result: DropResult) => {
    const { destination, source } = result;

    if (!destination || destination.index === source.index) return;

    // Salin array itineraryItems
    const reordered = [...filteredItems];

    // Ambil item yang di-drag
    const [movedItem] = reordered.splice(source.index, 1);

    reordered.splice(destination.index, 0, movedItem);

    const updatedWithOrder = reordered.map((item, index) => ({
      ...item,
      order: index + 1,
    }));
    const newOrder = updatedWithOrder.sort((a, b) => a.order - b.order);
    console.log(newOrder);
    setFilteredItems(newOrder);

    updateOrder(newOrder);
  };

  const updateOrder = async (newOrder: Activity[]) => {
    try {
      await api.put(`/api/activities/bulk-update`, newOrder);
      setFilteredItems(newOrder);
    } catch (error) {
      toast("Error updating order:", error);
    }
  }

  const handleDeleteItem = (id: number) => {
    setFilteredItems(prev => prev.filter(item => item.id !== id));
    handleDeleteActivity(id);
  };

  const handleDeleteActivity = async (id: number) => {
    try {
      await api.delete(`/api/activities/delete/${id}`);
      toast("Activity deleted successfully");
    } catch (error) {
      console.error("Error deleting activity:", error);
      toast("Error deleting activity");
    }
  }

  if (loading) {
    return <LoadingComponent message="Jadwal sedang di ambil..." />;
  }

  return (
    <div className="container mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-travelmate-charcoal">Jadwal Perjalanan</h1>
          <p className="text-muted-foreground">Rancang aktivitas harian mu</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Tambah Aktivitas
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Day Selection Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Hari</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Mobile Day Selector */}
              <div className="block md:hidden mb-4">
                <Select
                  value={currentDay.toString()}
                  onValueChange={(value) => setCurrentDay(parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Day" />
                  </SelectTrigger>
                  <SelectContent>
                    {days.map(day => (
                      <SelectItem key={day.id} value={day.toString()}>
                        Day {day.day_number}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Desktop Day List */}
              <div className="hidden md:flex md:flex-col space-y-2">
                {days.map(day => (
                  <Button
                    key={day.id}
                    variant={currentDay === day.day_number ? "default" : "outline"}
                    className="justify-start"
                    onClick={() => setCurrentDay(day.id)}
                  >
                    Day {day.day_number}
                  </Button>
                ))}

              </div>
            </CardContent>
          </Card>
        </div>

        {/* Itinerary Content */}
        <div className="lg:col-span-3">
          {
            days.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">No itinerary items available</p>
                <Button onClick={() => setIsModalOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" /> Add Activity
                </Button>
              </div>
            ) : <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Jadwal Hari {currentDay}</CardTitle>
                <Badge variant="outline" className="ml-2">
                  {new Date().toLocaleDateString('en-US', { weekday: 'long' })}
                </Badge>
              </CardHeader>
              <CardContent>
                <DragDropContext onDragEnd={handleDragEnd}>
                  {
                    filteredItems.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-gray-500 mb-4">No activities available for this day</p>
                      </div>
                    ) : (
                      <Droppable droppableId="itinerary-items">
                        {(provided) => (
                          <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            className="space-y-4"
                          >
                            {
                              filteredItems.map((item, index) => (
                                <Draggable key={item.id} draggableId={item.id.toString()} index={index}>
                                  {(provided) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      className="bg-white border rounded-lg p-4 flex gap-3"
                                    >
                                      <div {...provided.dragHandleProps} className="flex items-center cursor-grab">
                                        <GripVertical className="h-5 w-5 text-gray-400" />
                                      </div>
                                      <div className="flex-1">
                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                                          <div className="flex items-center gap-2">
                                            <Badge className={getCategoryColor(item.category)}>
                                              {item.category}
                                            </Badge>
                                            <div className="flex items-center text-muted-foreground">
                                              <Clock className="mr-1 h-3.5 w-3.5" />
                                              <span className="text-sm">{item.time}</span>
                                            </div>
                                          </div>
                                          <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 shrink-0"
                                            onClick={() => handleDeleteItem(item.id)}
                                          >
                                            <X className="h-4 w-4" />
                                          </Button>
                                        </div>
                                        <h3 className="font-medium mb-1">{item.title}</h3>
                                        <div className="flex items-center text-muted-foreground mb-2">
                                          <MapPin className="mr-1 h-3.5 w-3.5" />
                                          <span className="text-sm">{item.location}</span>
                                        </div>
                                        <p className="text-sm text-gray-600">{item.description}</p>
                                      </div>
                                    </div>
                                  )}
                                </Draggable>
                              ))
                            }
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    )
                  }

                </DragDropContext>
              </CardContent>
            </Card>
          }

        </div>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tambah Aktivitas</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input name="title" placeholder="Judul" value={formData.title} onChange={handleInputChange} />
            <Textarea name="description" placeholder="Deskripsi" value={formData.description} onChange={handleInputChange} />
            <Input name="time" type="time" value={formData.time} onChange={handleInputChange} />
            <Input name="category" placeholder="Kategori (activity, transportation, etc.)" value={formData.category} onChange={handleInputChange} />
            <Input name="location" placeholder="Lokasi" value={formData.location} onChange={handleInputChange} />
            {/* <Input name="order" type="number" placeholder="Urutan" value={formData.order} onChange={handleInputChange} /> */}
            <Button className="w-full" onClick={handleAddActivity}>Simpan</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ItineraryPage;
