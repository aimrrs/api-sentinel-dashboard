import { SideNav } from "@/components/ui/SideNav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // THE FIX:
    // 1. h-screen: Lock the main container to the full height of the viewport.
    // 2. overflow-hidden: Prevent the main container itself from ever showing a scrollbar.
    <div className="flex h-screen overflow-hidden">
      <SideNav />
      {/* THE FIX:
          3. flex-1: Allow this area to grow and take up remaining space.
          4. overflow-y-auto: Tell THIS element to show a scrollbar if its content is too tall.
      */}
      <main className="flex-1 overflow-y-auto p-8 bg-gray-50">{children}</main>
    </div>
  );
}

