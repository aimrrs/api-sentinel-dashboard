"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import { getProjectStats, getProjectAnalytics, updateProjectBudget } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

// --- Interface Definitions ---
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
  
  const formattedLineChartData = analytics.usage_last_30_days.map(d => ({
      date: new Date(d.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
      cost: d.cost
  }));

  return (
    <div className="w-full space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{stats.project_name}</h1>
        <p className="text-gray-500">Real-time cost and usage analytics.</p>
      </div>
      
      {/* --- The 3 High-Level Stat Cards --- */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
         <Card>
            <CardHeader><CardTitle>Current Monthly Spend</CardTitle></CardHeader>
            <CardContent>
                <div className="text-4xl font-bold">₹{stats.current_usage.toFixed(2)}</div>
                <p className="text-xs text-gray-500">of ₹{stats.monthly_budget.toFixed(2)} budget</p>
            </CardContent>
         </Card>
         <Card>
            <CardHeader><CardTitle>Total Requests (All Time)</CardTitle></CardHeader>
            <CardContent>
                <div className="text-4xl font-bold">{analytics.total_requests}</div>
                <p className="text-xs text-gray-500">Successful API calls logged</p>
            </CardContent>
         </Card>
         <Card>
            <CardHeader><CardTitle>Avg. Cost Per Request</CardTitle></CardHeader>
            <CardContent>
                <div className="text-4xl font-bold">₹{analytics.average_cost_per_request.toFixed(4)}</div>
                 <p className="text-xs text-gray-500">Based on all historical data</p>
            </CardContent>
         </Card>
      </div>

      {/* --- The Main Analytics & Control Grid --- */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* --- Usage Over Time Line Chart --- */}
        <Card className="lg:col-span-2">
            <CardHeader>
                <CardTitle>Usage (Last 30 Days)</CardTitle>
                <CardDescription>Daily spending in Rupees.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="w-full h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={formattedLineChartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                      <Line type="monotone" dataKey="cost" stroke="#4f46e5" strokeWidth={2} dot={false} />
                      <CartesianGrid stroke="#e5e7eb" strokeDasharray="5 5" />
                      <XAxis dataKey="date" fontSize={12} />
                      <YAxis fontSize={12} tickFormatter={(value) => `₹${value}`} />
                      <Tooltip formatter={(value: number) => `₹${value.toFixed(2)}`} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>

        {/* --- Budget Management Card --- */}
        <Card>
            <CardHeader>
                <CardTitle>Manage Budget</CardTitle>
                <CardDescription>Set your total monthly spending limit.</CardDescription>
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
                <Button onClick={handleUpdateBudget} disabled={isUpdatingBudget} className="w-full">
                    {isUpdatingBudget ? "Saving..." : "Save Budget"}
                </Button>
            </CardFooter>
        </Card>
      </div>
    </div>
  );
}

