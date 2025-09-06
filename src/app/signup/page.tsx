"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import { signupUser } from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Header } from "@/components/ui/Header"; // Import the header

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const { login, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();

  // Redirect if user is already logged in
  useEffect(() => {
    if (isAuthLoading) return;
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, isAuthLoading, router]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Step 1: Create the new user account
      await signupUser(email, password);

      // Step 2: Automatically log the new user in
      await login(email, password);
      
      // The login() function will handle the redirect to the dashboard

    } catch (error) {
      console.error("Signup failed:", error);
      setError("Failed to create account. The email may already be in use.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isAuthLoading || isAuthenticated) {
    return <main className="flex min-h-screen items-center justify-center"><p>Loading...</p></main>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header /> {/* Use the consistent header */}
      <main className="flex-1 flex flex-col items-center justify-center">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle className="text-2xl">Create an account</CardTitle>
            <CardDescription>
              Enter your email below to create your account.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
            </CardContent>
            <CardFooter className="flex-col items-start gap-4">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Creating account..." : "Sign up"}
              </Button>
               <p className="text-xs text-center w-full text-gray-600">
                Already have an account?{" "}
                <Link href="/login" className="underline hover:text-indigo-600">
                  Log in
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </main>
      <footer className="w-full py-6 px-4 md:px-6">
        <p className="text-center text-xs text-gray-500">
          © 2025 API Sentinel. Product of aimrrs.
        </p>
      </footer>
    </div>
  );
}

