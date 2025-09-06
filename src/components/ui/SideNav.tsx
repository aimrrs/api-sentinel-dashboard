"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Settings, LogOut, ShieldCheck } from "lucide-react";

export function SideNav() {
  const { logout } = useAuth();
  const pathname = usePathname();

  const navItems = [
    { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/settings", icon: Settings, label: "Settings" },
  ];

  return (
    // THE FIX: Ensure this container is a flex column
    <aside className="w-64 flex flex-col border-r bg-white">
      <div className="p-4 border-b">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <ShieldCheck className="text-indigo-600" />
          API Sentinel
        </h1>
      </div>

      {/* THE FIX: Make this navigation section grow to fill all available space */}
      <nav className="flex-grow p-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.label}>
              <Button
                variant={pathname === item.href ? "secondary" : "ghost"}
                className="w-full justify-start"
                asChild
              >
                <Link href={item.href}>
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.label}
                </Link>
              </Button>
            </li>
          ))}
        </ul>
      </nav>

      {/* This section is now pushed to the bottom by the growing nav section */}
      <div className="p-4 border-t">
        <Button variant="outline" className="w-full" onClick={logout}>
          <LogOut className="mr-2 h-4 w-4" />
          Log Out
        </Button>
      </div>
    </aside>
  );
}

