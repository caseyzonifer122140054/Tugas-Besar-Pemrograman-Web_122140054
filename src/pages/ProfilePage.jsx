import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { trips } from "@/data/mockData";
import { TripCard } from "@/components/TripCard";
import api from "@/utils/api";
import { toast } from "sonner";

const ProfilePage = () => {
  const [user, setUser] = useState({
    username: "",
    email: "",
  });
  const [dashboardData, setDashboardData] = useState<{
    total_trips: number,
    upcoming_trips: number,
    completed_trips: number
  }>({
    total_trips: 0,
    upcoming_trips: 0,
    completed_trips: 9
  });
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordconfirmation, setNewPasswordConfirmation] = useState("");

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
  const userTrips = trips.slice(0, 3);

  useEffect(() => {
    const fetchUserData = async () => {
      api.get('/api/profile')
        .then((response) => {
          setUser(response.data.data);
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
        });
    }
    fetchUserData();
  }, []);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.put('/api/profile/update', user);
      console.log("Profile updated:", response.data);
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  }

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== newPasswordconfirmation) {
      toast.error("Password confirmation does not match");
      return;
    }

    try {
      const response = await api.put('/api/profile/update/password', {
        new_password: newPassword
      });
      console.log("Password updated:", response.data);
      toast.success("Password updated successfully");
    } catch (error) {
      console.error("Error updating password:", error);
    }
  }

  return (
    <div className="container mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-travelmate-charcoal">Profile</h1>
        <p className="text-muted-foreground">Manage your account and view your trips</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Profile Summary Card */}
            <Card>
              <CardContent className="pt-6 flex flex-col items-center text-center">
                <Avatar className="h-24 w-24 mb-4">

                  <AvatarFallback>{user.username.charAt(0)}</AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-bold">{user.username}</h2>
                <p className="text-muted-foreground">{user.email}</p>
                <Separator className="my-4" />
                <div className="w-full">
                  <div className="flex justify-between py-2">
                    <span className="text-muted-foreground">Total Trips</span>
                    <span className="font-medium">{dashboardData.total_trips}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-muted-foreground">Upcoming</span>
                    <span className="font-medium">{dashboardData.upcoming_trips}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-muted-foreground">Completed</span>
                    <span className="font-medium">{dashboardData.completed_trips}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Edit Profile Form */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Edit Profile</CardTitle>
                <CardDescription>Update your personal information</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">username</Label>
                    <Input
                      id="name"
                      value={user.username}
                      onChange={(e) => setUser({ ...user, username: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={user.email}
                      onChange={(e) => setUser({ ...user, email: e.target.value })}
                    />
                  </div>

                  <Button type="submit" onClick={handleSubmit}>Save Changes</Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trips">
          <Card>
            <CardHeader>
              <CardTitle>My Recent Trips</CardTitle>
              <CardDescription>View and manage your travel plans</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userTrips.map(trip => (
                  <TripCard key={trip.id} trip={trip} />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>Manage your account preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Change Password</Label>
                <Input id="password" type="password" name="new_password" onChange={(e) => setNewPassword(e.target.value)} placeholder="New password" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input id="confirmPassword" type="password" onChange={(e) => setNewPasswordConfirmation(e.target.value)} name="new_password_confirmation" placeholder="Confirm new password" />
              </div>

              <Button onClick={handleUpdatePassword}>Update Password</Button>


            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfilePage;