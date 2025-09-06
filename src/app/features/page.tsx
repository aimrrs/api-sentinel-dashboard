import { Header } from "@/components/ui/Header";
import { FeatureCard } from "@/components/ui/FeatureCard";
import { ShieldCheck, Zap, BarChart3, LockKeyhole, Terminal, LayoutDashboard } from "lucide-react";

// A simple component to render code blocks with syntax highlighting
const CodeBlock = ({ code }: { code: string }) => (
  <pre className="p-4 mt-4 text-sm bg-gray-900 text-white rounded-lg overflow-x-auto">
    <code>{code}</code>
  </pre>
);

export default function FeaturesPage() {
  const sdkInstallCode = `pip install api-sentinel`;
  const sdkUsageCode = `import sentinel
from openai import OpenAI
from sentinel.adapters import OpenAIAdapter

# 1. Initialize with your key from the dashboard
sentinel.init(api_key="sentinel_pk_...")

# 2. Wrap your existing client
client = sentinel.wrap(
    OpenAI(api_key="sk-..."),
    adapter=OpenAIAdapter()
)

# 3. Use it exactly as before!
response = client.chat.completions.create(...)
`;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />

      <main className="flex-1">
        <div className="container mx-auto px-4 md:px-6 py-12 md:py-20">
          {/* --- Header Section --- */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tighter">
              Powerful Features, Simple Integration
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
              API Sentinel gives you the tools to control costs and understand usage without compromising on security or performance.
            </p>
          </div>

          {/* --- Dashboard Features --- */}
          <div className="mb-20">
            <h2 className="text-3xl font-bold text-center mb-10 flex items-center justify-center gap-2">
              <LayoutDashboard className="h-8 w-8 text-indigo-600" /> Your Mission Control
            </h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <FeatureCard
                icon={<BarChart3 className="h-6 w-6 text-indigo-600" />}
                title="Real-Time Analytics"
                description="See your spending update instantly on your project dashboard. No more waiting hours for billing data to sync."
              />
              <FeatureCard
                icon={<Zap className="h-6 w-6 text-indigo-600" />}
                title="Budget Circuit Breaker"
                description="Set a hard monthly budget. Our SDK's circuit breaker stops requests before you go over, preventing surprise bills."
              />
              <FeatureCard
                icon={<ShieldCheck className="h-6 w-6 text-indigo-600" />}
                title="Centralized Management"
                description="Manage all your projects, generate Sentinel Keys, and control your account from one clean, simple interface."
              />
            </div>
          </div>

          {/* --- SDK Features --- */}
          <div>
            <h2 className="text-3xl font-bold text-center mb-10 flex items-center justify-center gap-2">
              <Terminal className="h-8 w-8 text-indigo-600" /> Easy for Developers
            </h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2 items-start">
              <div className="grid gap-8">
                <FeatureCard
                  icon={<LockKeyhole className="h-6 w-6 text-indigo-600" />}
                  title="Privacy by Design"
                  description="Our SDK-first approach means your secret API keys and sensitive request data never touch our servers, period."
                />
                <FeatureCard
                  icon={<Zap className="h-6 w-6 text-indigo-600" />}
                  title="Zero Performance Impact"
                  description="Usage data is sent asynchronously in the background. Our wrapper adds negligible latency to your API calls."
                />
              </div>
              <div className="bg-white p-6 border rounded-lg shadow-sm">
                <h3 className="text-xl font-bold">Get Started in 2 Minutes</h3>
                <p className="mt-2 text-gray-600">Install the package via pip:</p>
                <CodeBlock code={sdkInstallCode} />
                <p className="mt-4 text-gray-600">Then, wrap your client in just two lines of code:</p>
                <CodeBlock code={sdkUsageCode} />
              </div>
            </div>
          </div>
        </div>
      </main>

       {/* --- Simple Footer --- */}
       <footer className="w-full py-6 px-4 md:px-6 border-t mt-auto">
        <p className="text-center text-xs text-gray-500">
          © 2025 API Sentinel. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
