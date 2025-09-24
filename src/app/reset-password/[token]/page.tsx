"use client";

import { useState } from "react";
import { resetPassword } from "@/lib/api";
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
import { Header } from "@/components/ui/Header";
import axios from "axios"; // Import axios to check for its error type

export default function ResetPasswordPage({ params }: { params: { token: string } }) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { token } = params;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setError("");
    setMessage("");
    setIsLoading(true);

    try {
      const response = await resetPassword(token, newPassword);
      setMessage(response.message);
    } catch (error: unknown) { // <-- FIX: Changed 'any' to 'unknown'
      // --- FIX: Type check for the error ---
      if (axios.isAxiosError(error) && error.response) {
        setError(error.response.data.detail || "An unexpected error occurred.");
      } else {
        setError("An unexpected error occurred.");
      }
      console.error("Reset password failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle className="text-2xl">Reset Your Password</CardTitle>
            <CardDescription>
              Enter and confirm your new password below.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="grid gap-4">
              {message ? (
                <p className="text-sm text-green-600 bg-green-50 p-3 rounded-md">{message}</p>
              ) : (
                <>
                  <div className="grid gap-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input
                      id="new-password"
                      type="password"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                </>
              )}
              {error && <p className="text-sm text-red-500">{error}</p>}
            </CardContent>
            <CardFooter className="flex-col items-start gap-4">
              {message ? (
                <Button asChild className="w-full">
                  <Link href="/login">Back to Login</Link>
                </Button>
              ) : (
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Resetting..." : "Reset Password"}
                </Button>
              )}
            </CardFooter>
          </form>
        </Card>
      </main>
    </div>
  );
}

