
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import api from "@/utils/api";
import { toast } from "sonner";
import { closeWebSocket, connectWebSocket } from "@/utils/websocket";

// Group checklist items by category
const groupItemsByCategory = (items: ChecklistItem[]) => {
  return items.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, ChecklistItem[]>);
};

const formatCategoryName = (name: string) => {
  return name.charAt(0).toUpperCase() + name.slice(1);
};

interface ChecklistItem {
  id: string;
  description: string;
  status: string;
  category: string;
}

const ChecklistPage = () => {
  const { tripId } = useParams<{ tripId: string }>();
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [open, setOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");

  const groupedItems = groupItemsByCategory(checklistItems);
  const categories = ["all", ...Object.keys(groupedItems)];




  useEffect(() => {
    const fetchChecklistItems = async () => {
      try {
        const response = await api.get(`/api/trips/${tripId}/todos`);
        setChecklistItems(response.data.data);
      } catch (error) {
        console.error("Error fetching checklist items:", error);
      }
    };
    fetchChecklistItems();


    connectWebSocket(tripId, (message) => {
      if (message.event === "todo_created" || message.event === "todo_deleted" || message.event === "todo_updated") {
        fetchChecklistItems();
        console.log("WebSocket message received:", message.event);
      }
    });

    return () => {
      closeWebSocket();
    };
  }, [tripId]);

  const filteredItems = selectedCategory === "all"
    ? checklistItems
    : checklistItems.filter(item => item.category === selectedCategory);

  const completedCount = checklistItems.filter(item => item.status == "done").length;
  const progressPercentage = Math.round((completedCount / checklistItems.length) * 100);

  const handleToggleItem = (id: string) => {
    setChecklistItems(prev =>
      prev.map(item => {
        if (item.id === id) {
          const newStatus = item.status === "done" ? "not_done" : "done";
          api.put(`/api/trips/todos/${id}/edit`, { status: newStatus }).then(() => {
            toast.success("Checklist item updated successfully!");
          })
          return { ...item, status: newStatus };
        }
        return item;
      })
    );
  };

  const handleDeleteItem = (id: string) => {
    setChecklistItems(prev => prev.filter(item => item.id !== id));
    api.delete(`/api/trips/todos/${id}/delete`).then(() => {
      toast.success("Checklist item deleted successfully!");
    }).catch(error => {
      console.error("Error deleting checklist item:", error);
    });
  };

  const handleSubmit = () => {
    if (!description.trim()) return;
    setDescription("");
    setCategory("");

    api.post("/api/trips/todos/store", {
      trip_id: tripId,
      description,
      category,
    }).then(response => {
      api.get(`/api/trips/${tripId}/todos`).then(response => {
        setChecklistItems(response.data.data);
        toast.success("Checklist item added successfully!");
        console.log(groupItemsByCategory(response.data.data));
      });
    }).catch(error => {
      console.error("Error adding checklist item:", error);
    });
    setOpen(false);
  };

  return (
    <div className="container mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-travelmate-charcoal">Trip Checklist</h1>
          <p className="text-muted-foreground">Track items to pack and tasks to complete</p>
        </div>
        <Button onClick={() => setOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Item
        </Button>
      </div>

      {/* Progress Bar */}
      <Card className="mb-6">
        <CardHeader className="pb-0">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Packing Progress</CardTitle>
            <div className="text-sm font-medium">
              {completedCount} of {checklistItems.length} items packed
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="w-full bg-muted rounded-full h-4">
            <div
              className="bg-travelmate-blue h-4 rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          <div className="text-right text-sm text-muted-foreground mt-1">
            {progressPercentage}% complete
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Category Selection */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Categories</CardTitle>
            </CardHeader>
            <CardContent className="px-2 py-1">
              <div className="space-y-1">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category === "all" ? "All Items" : formatCategoryName(category)}
                    {category !== "all" && (
                      <div className="ml-auto bg-muted rounded-full px-2 py-0.5 text-xs">
                        {groupedItems[category].length}
                      </div>
                    )}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Checklist Items */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>
                {selectedCategory === "all" ? "All Items" : formatCategoryName(selectedCategory)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {filteredItems.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">No items in this category</p>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" /> Add Item
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredItems.map((item) => (
                    <div
                      key={item.id}
                      className={`flex items-center justify-between p-3 rounded-lg border ${item.status ? 'bg-muted/50' : ''}`}
                    >
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          checked={item.status == 'done'}
                          onCheckedChange={() => handleToggleItem(item.id)}
                          id={item.id}
                        />
                        <label
                          htmlFor={item.id}
                          className={`cursor-pointer ${item.status == 'done' ? 'line-through text-muted-foreground' : ''}`}
                        >
                          {item.description}
                        </label>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleDeleteItem(item.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      <Dialog open={open} onOpenChange={setOpen}>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Checklist Item</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Description</Label>
              <Input value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
            <div>
              <Label>Category</Label>
              <Input value={category} onChange={(e) => setCategory(e.target.value)} />
            </div>
            <Button onClick={handleSubmit} className="w-full">
              Add Item
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ChecklistPage;
