
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/hooks/use-redux.ts";
import { login, clearError } from "@/store/authSlice";
import api from "@/utils/api";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const { loading, error, isAuthenticated } = useAppSelector((state) => state.auth);


  if (isAuthenticated) {
    navigate('/dashboard');
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(clearError());

    const resultAction = await dispatch(login({ username, password }));

    if (login.fulfilled.match(resultAction)) {
      navigate('/dashboard');
    } else {
      toast.error("Login failed", {
        description: error || "Invalid credentials. Try email: user@mail.com, password: password",
      });
    }

    // toast.info("Registration is not implemented yet", {
    //   description: "This is a prototype. Try logging in with email: user@mail.com, password: password",
    // });
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    api.post("/api/register", {
      username,
      email,
      password,
    })
      .then((response) => {
        toast.success("Registration successful", {
          description: "You can now log in with your credentials",
        });
        setIsLoading(false);
        navigate("/login");
      })
      .catch((error) => {
        toast.error("Registration failed", {
          description: error.response.data.message,
        });
        setIsLoading(false);
      }
      )

  };

  return (
    <div className="container flex items-center justify-center min-h-[80vh]">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-full bg-travelmate-blue flex items-center justify-center">
              <span className="text-white font-bold text-xl">T</span>
            </div>
            <span className="font-bold text-2xl text-travelmate-blue">TravelMate</span>
          </div>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle>Login</CardTitle>
                <CardDescription>
                  Enter your credentials to access your account
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin}>
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        type="text"
                        placeholder="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="password">Password</Label>
                        <Link to="#" className="text-sm text-travelmate-blue hover:underline">
                          Forgot password?
                        </Link>
                      </div>
                      <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? "Logging in..." : "Login"}
                    </Button>
                  </div>
                </form>
              </CardContent>
              <CardFooter>
                <div className="text-center text-sm text-gray-500 w-full">
                  Don't have an account?
                  <Link to="#" className="text-travelmate-blue hover:underline ml-1">
                    Sign up
                  </Link>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="register">
            <Card>
              <CardHeader>
                <CardTitle>Create an account</CardTitle>
                <CardDescription>
                  Enter your information to create your account
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleRegister}>
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="register-email">Username</Label>
                      <Input id="register-username" value={username} onChange={(e) => setUsername(e.target.value)} type="text" placeholder="xcom" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="register-email">Email</Label>
                      <Input id="register-email" value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="name@example.com" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="register-password">Password</Label>
                      <Input id="register-password" onChange={(e) => setPassword(e.target.value)} type="password" />
                    </div>

                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? "Register in..." : "Register"}
                    </Button>
                  </div>
                </form>
              </CardContent>
              <CardFooter>
                <div className="text-center text-sm text-gray-500 w-full">
                  Already have an account?
                  <Link to="#" className="text-travelmate-blue hover:underline ml-1">
                    Sign in
                  </Link>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-8 text-center">
          <Link to="/" className="text-travelmate-blue hover:underline">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
