
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  Globe,
  Lock,
  ChevronLeft,
  MapPin
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { useAppDispatch, useAppSelector } from "@/hooks/use-redux.ts";
import { addTrip } from '@/store/tripSlice';


const AddNewTripPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [image, setImage] = useState<File | null>(null);
  const { toast } = useToast();
  const [formState, setFormState] = useState({
    name: "",
    destination: "",
    startDate: "",
    endDate: "",
    description: "",
    privacy: "public",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handlePrivacyChange = (value: string) => {
    setFormState((prev) => ({ ...prev, privacy: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", formState.name);
    formData.append("destination", formState.destination);
    formData.append("start_date", formState.startDate);
    formData.append("end_date", formState.endDate);
    formData.append("description", formState.description);
    formData.append("is_private", formState.privacy);
    if (image) {
      formData.append("thumbnail", image);
    }

    try {
      console.log(formData.get("thumbnail"));
      await dispatch(addTrip(formData)).unwrap(); // pakai redux thunk (lihat bawah)
      toast({
        title: "Berhasil",
        description: "Trip berhasil dibuat!",
      });
      navigate("/mytrips");
    } catch (err) {
      toast({
        title: "Gagal",
        description: err as string,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <Button
        variant="ghost"
        className="mb-6 -ml-4 text-muted-foreground"
        onClick={() => navigate(-1)}
      >
        <ChevronLeft className="mr-2 h-4 w-4" />
        Kembali
      </Button>

      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-2 text-travelmate-charcoal">Buat Perjalanan Baru</h1>
        <p className="text-muted-foreground mb-8">Isi detail informasi dibawah ini</p>

        <form onSubmit={handleSubmit}>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Informasi Dasar</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Nama Perjalanan</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Menaklukan Ranu Kumbolo"
                  value={formState.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="destination">Destination</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    id="destination"
                    name="destination"
                    placeholder="Paris, France"
                    className="pl-10"
                    value={formState.destination}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">Gambar Perjalanan</Label>
                <Input
                  id="image"
                  name="image"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImage(e.target.files?.[0] || null)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Mulai Tanggal</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      id="startDate"
                      name="startDate"
                      type="date"
                      className="pl-10"
                      value={formState.startDate}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">Sampai Tanggal</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      id="endDate"
                      name="endDate"
                      type="date"
                      className="pl-10"
                      value={formState.endDate}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Deskripsi</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Tentang apakah perjalanan ini? tambah beberapa detail yang menarik"
                  rows={4}
                  value={formState.description}
                  onChange={handleChange}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Pengaturan privasi</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup
                defaultValue={formState.privacy}
                onValueChange={handlePrivacyChange}
                className="space-y-4"
              >
                <div className="flex items-center space-x-3 border rounded-lg p-4 cursor-pointer hover:bg-muted/30">
                  <RadioGroupItem value="public" id="public" />
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-travelmate-purple/20">
                    <Globe className="h-4 w-4 text-travelmate-blue" />
                  </div>
                  <div>
                    <Label htmlFor="public" className="font-medium cursor-pointer">Public</Label>
                    <p className="text-sm text-muted-foreground">Semua orang dapat melihat</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 border rounded-lg p-4 cursor-pointer hover:bg-muted/30">
                  <RadioGroupItem value="private" id="private" />
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-travelmate-green/30">
                    <Lock className="h-4 w-4 text-travelmate-charcoal" />
                  </div>
                  <div>
                    <Label htmlFor="private" className="font-medium cursor-pointer">Private</Label>
                    <p className="text-sm text-muted-foreground">Hanya kamu dan yg di invite yang bisa lihat</p>
                  </div>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          <div className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/trips")}
            >
              Cancel
            </Button>
            <Button type="submit" className="px-8">
              Buat Perjalanan
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddNewTripPage;