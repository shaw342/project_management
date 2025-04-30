"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { User, Mail, Lock } from "lucide-react";
import { setCookie } from "cookies-next";
import axios from "axios";

export default function SignUpForm() {
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState(""); // State for error messages
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
    setError(""); // Clear error on input change
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate password match
    if (user.password !== user.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // Validate password strength (optional, customize as needed)
    if (user.password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8080/api/v1/register",
        user,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Assuming the API returns { email: "user@example.com", ... }
      if (response.data.email) {
        setCookie("email", response.data.email, { maxAge: 60 * 60 * 24 }); // 1 day
        router.push("/auth/signup/verification");
      } else {
        setError("Registration successful, but no email returned");
      }
    } catch (err: any) {
      console.error("Registration error:", err);
      setError(
        err.response?.data?.message ||
          "Failed to register. Please try again later."
      );
    }
  };

  return (
    <Card className="w-[400px] max-w-md mx-auto mt-8">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">
          Sign Up
        </CardTitle>
        <CardDescription className="text-center">
          Enter your details to create an account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          {error && (
            <div className="mb-4 text-red-500 text-sm text-center">{error}</div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <div className="relative">
                <User className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="firstName"
                  name="firstName"
                  placeholder="John"
                  value={user.firstName}
                  onChange={handleChange}
                  className="pl-8"
                  required
                  aria-label="First Name"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <div className="relative">
                <User className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="lastName"
                  name="lastName"
                  placeholder="Doe"
                  value={user.lastName}
                  onChange={handleChange}
                  className="pl-8"
                  required
                  aria-label="Last Name"
                />
              </div>
            </div>
          </div>
          <div className="space-y-2 mt-4">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="john.doe@example.com"
                value={user.email}
                onChange={handleChange}
                className="pl-8"
                required
                aria-label="Email"
              />
            </div>
          </div>
          <div className="space-y-2 mt-4">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={user.password}
                onChange={handleChange}
                className="pl-8"
                required
                aria-label="Password"
              />
            </div>
          </div>
          <div className="space-y-2 mt-4">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <div className="relative">
              <Lock className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={user.confirmPassword}
                onChange={handleChange}
                className="pl-8"
                required
                aria-label="Confirm Password"
              />
            </div>
          </div>
          <Button
            type="submit"
            className="w-full mt-6 text-white font-semibold py-2 px-4 rounded-md transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg"
          >
            Sign Up
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p>
          Already have an account?{" "}
          <Link href="/auth/login" className="underline">
            Log in
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}