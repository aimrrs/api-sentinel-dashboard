"use client";

import React, { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "@/lib/AuthContext";
import { getProjectStats, getProjectAnalytics, updateProjectBudget } from "@/lib/api";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ProjectStats {
  project_name: string;
  monthly_budget: number;
  current_usage: number;
}
interface DailyUsage {
  date: string;
  cost: number;
}
interface ProjectAnalytics {
    total_requests: number;
    average_cost_per_request: number;
    usage_last_30_days: DailyUsage[];
}

export default function ProjectDetailPage({ params }: { params: Promise<{ projectId: string }> }) {
  const router = useRouter();
  const { isAuthenticated, isLoading: isAuthLoading, logout } = useAuth();
  const [stats, setStats] = useState<ProjectStats | null>(null);
  const [analytics, setAnalytics] = useState<ProjectAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [budgetInput, setBudgetInput] = useState("");
  const [isUpdatingBudget, setIsUpdatingBudget] = useState(false);
  
  const resolvedParams = use(params);
  const projectId = parseInt(resolvedParams.projectId, 10);

  useEffect(() => {
    if (isAuthLoading) return;
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    
    const fetchAllData = async () => {
      try {
        // Fetch both sets of data in parallel for speed
        const [statsData, analyticsData] = await Promise.all([
          getProjectStats(projectId),
          getProjectAnalytics(projectId)
        ]);
        setStats(statsData);
        setAnalytics(analyticsData);
        setBudgetInput(statsData.monthly_budget.toString());
      } catch (error) {
        console.error("Failed to fetch project data:", error);
        router.push("/dashboard");
      } finally {
        setIsLoading(false);
      }
    };

    if (!isNaN(projectId)) {
      fetchAllData();
    }
  }, [isAuthenticated, isAuthLoading, router, logout, projectId]);

  const handleUpdateBudget = async () => {
    const newBudgetInt = parseInt(budgetInput, 10);
    if (isNaN(newBudgetInt) || newBudgetInt < 0) {
        toast.error("Please enter a valid budget amount.");
        return;
    }
    setIsUpdatingBudget(true);
    try {
        await updateProjectBudget(projectId, newBudgetInt);
        // Refresh stats to show the new budget
        const updatedStats = await getProjectStats(projectId);
        setStats(updatedStats);
        toast.success("Budget updated successfully!");
    } catch (error) {
        toast.error("Failed to update budget.");
    } finally {
        setIsUpdatingBudget(false);
    }
  };


  if (isAuthLoading || isLoading || !stats || !analytics) {
    return <div className="flex h-full w-full items-center justify-center"><p>Loading project analytics...</p></div>;
  }
  
  // Format data for the line chart
  const formattedLineChartData = analytics.usage_last_30_days.map(d => ({
      date: new Date(d.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
      cost: d.cost.toFixed(2)
  }));

  return (
    <div className="w-full">
      <h1 className="text-3xl font-bold mb-2">{stats.project_name}</h1>
      <p className="text-gray-500 mb-6">Real-time cost and usage analytics.</p>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-6">
         {/* ... (Keep the 3 stat cards: Spend, Total Requests, Avg. Cost) ... */}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* --- NEW: Budget Management Card --- */}
        <Card>
            <CardHeader>
                <CardTitle>Manage Budget</CardTitle>
                <CardDescription>Set your total monthly spending limit in Rupees.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex items-center gap-2">
                    <Label htmlFor="budget" className="text-lg">₹</Label>
                    <Input 
                        id="budget" 
                        type="number" 
                        value={budgetInput}
                        onChange={(e) => setBudgetInput(e.target.value)}
                    />
                </div>
            </CardContent>
            <CardFooter>
                <Button onClick={handleUpdateBudget} disabled={isUpdatingBudget}>
                    {isUpdatingBudget ? "Saving..." : "Save Budget"}
                </Button>
            </CardFooter>
        </Card>

        {/* --- Usage Over Time Chart Card --- */}
        <Card>
            <CardHeader>
                <CardTitle>Usage (Last 30 Days)</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="w-full h-72">
                    {/* ... (The LineChart component remains here) ... */}
                </div>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}

