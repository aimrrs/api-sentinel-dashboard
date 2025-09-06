"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import { deleteUser } from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function SettingsPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: isAuthLoading, logout } = useAuth();

  useEffect(() => {
    // Protect the page: wait for auth check, then redirect if not logged in
    if (isAuthLoading) return;
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isAuthLoading, router]);

  const handleDeleteAccount = async () => {
    try {
      await deleteUser();
      // After successful deletion, the central logout function handles
      // cookie removal and redirecting to the login page.
      logout();
    } catch (error) {
      console.error("Failed to delete account:", error);
      // You could show an error message toast here
    }
  };

  // Show a loading state while the authentication is being verified
  if (isAuthLoading || !isAuthenticated) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  // The main page content is now simpler, as the layout is handled elsewhere
  return (
    <div className="w-full max-w-2xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Account Settings</h1>
      </div>
      
      <Card className="border-red-500">
        <CardHeader>
          <CardTitle>Danger Zone</CardTitle>
          <CardDescription>
            These actions are permanent and cannot be undone.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-between items-center">
          <p>Delete your account and all associated data.</p>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">Delete Account</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete your account, all of your projects,
                  all of your Sentinel Keys, and all of your usage data.
                  This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteAccount}>
                  Yes, delete my account
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </div>
  );
}
