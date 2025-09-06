"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import { getProjectStats } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface ProjectStats {
  project_name: string;
  monthly_budget: number;
  current_usage: number;
}

export default function ProjectDetailPage({ params }: { params: Promise<{ projectId: string }> }) {
  const router = useRouter();
  const { isAuthenticated, isLoading: isAuthLoading, logout } = useAuth();
  const [stats, setStats] = useState<ProjectStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const resolvedParams = use(params);
  const projectId = parseInt(resolvedParams.projectId, 10);

  useEffect(() => {
    if (isAuthLoading) return;
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    
    const fetchStats = async () => {
      try {
        const projectStats = await getProjectStats(projectId);
        setStats(projectStats);
      } catch (error) {
        console.error("Failed to fetch project stats:", error);
        router.push("/dashboard");
      } finally {
        setIsLoading(false);
      }
    };

    // THE FIX: Only fetch if projectId is a valid number
    if (!isNaN(projectId)) {
      fetchStats();
    }
  }, [isAuthenticated, isAuthLoading, router, logout, projectId]);

  if (isAuthLoading || isLoading || !stats) {
    return <div className="flex h-full w-full items-center justify-center"><p>Loading project analytics...</p></div>;
  }

  const chartData = [
    { name: 'Usage', usage: stats.current_usage, budget: stats.monthly_budget - stats.current_usage }
  ];

  return (
    <div className="w-full">
      <h1 className="text-3xl font-bold mb-2">{stats.project_name}</h1>
      <p className="text-gray-500 mb-6">Real-time cost and usage analytics.</p>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Spend</CardTitle>
            <CardDescription>Your current usage vs. your total budget for the month.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">₹{stats.current_usage.toFixed(2)}</div>
            <p className="text-xs text-gray-500">out of ₹{stats.monthly_budget.toFixed(2)} budget</p>
            <div className="w-full h-48 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <XAxis type="number" hide />
                  <YAxis type="category" dataKey="name" hide />
                  <Tooltip formatter={(value) => `₹${Number(value).toFixed(2)}`} />
                  <Bar dataKey="usage" stackId="a" fill="#4f46e5" radius={[4, 0, 0, 4]} />
                  <Bar dataKey="budget" stackId="a" fill="#e5e7eb" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

