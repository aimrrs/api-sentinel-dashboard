"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import { getProjectStats, getProjectAnalytics } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts';

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
      
      {/* --- NEW: Stat Cards --- */}
      <div className="grid gap-6 md:grid-cols-3 mb-6">
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
            </CardContent>
         </Card>
         <Card>
            <CardHeader><CardTitle>Avg. Cost Per Request</CardTitle></CardHeader>
            <CardContent>
                <div className="text-4xl font-bold">₹{analytics.average_cost_per_request.toFixed(4)}</div>
            </CardContent>
         </Card>
      </div>

      {/* --- NEW: Line Chart for Usage Over Time --- */}
      <Card>
        <CardHeader>
          <CardTitle>Usage (Last 30 Days)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={formattedLineChartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <Line type="monotone" dataKey="cost" stroke="#4f46e5" strokeWidth={2} />
                <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                <XAxis dataKey="date" fontSize={12} />
                <YAxis fontSize={12} tickFormatter={(value) => `₹${value}`} />
                <Tooltip formatter={(value) => `₹${Number(value).toFixed(2)}`} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

