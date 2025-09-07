import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/ui/Header";

export default function LandingPage() {
  return (
    // Simple, light gray background for the whole page
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />

      <main className="flex-1 flex items-center justify-center p-4">
        {/* The distinct, floating "card" from your original design */}
        <div className="w-full max-w-5xl mx-auto bg-white rounded-2xl shadow-sm border">
          
          {/* Hero Section */}
          <section className="w-full py-20 md:py-28 text-center">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-gray-900">
              API Sentinel
            </h1>
            <p className="mt-4 text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              Your Financial Guardian for the API Economy.
            </p>
            <div className="mt-8">
              <Button asChild size="lg" className="bg-gradient-to-r from-teal-400 to-emerald-500 hover:opacity-90 text-white shadow-lg shadow-teal-500/20">
                <Link href="/signup">Get Started for Free</Link>
              </Button>
            </div>
          </section>

          {/* The Features Section has been removed */}

        </div>
      </main>

      {/* --- Simple Footer --- */}
      <footer className="w-full py-6 px-4 md:px-6">
        <p className="text-center text-xs text-gray-500">
          © 2025 API Sentinel. Product of aimrrs.
        </p>
      </footer>
    </div>
  );
}

