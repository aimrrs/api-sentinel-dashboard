import Link from "next/link";
import { Button } from "@/components/ui/button";

// A simple SVG for the logo
const Logo = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="logoGradient" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#6EE7B7" />
        <stop offset="100%" stopColor="#3B82F6" />
      </linearGradient>
    </defs>
    <circle cx="16" cy="16" r="16" fill="url(#logoGradient)" />
    <path d="M16.125 7.5L9.375 12.375V22.125L16.125 27L22.875 22.125V12.375L16.125 7.5Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9.375 12.375L16.125 17.25L22.875 12.375" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M16.125 27V17.25" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export function Header() {
  return (
    // Clean, light theme header
    <header className="sticky top-0 z-50 px-6 h-16 flex items-center justify-between border-b bg-white">
      <Link href="/" className="flex items-center gap-2">
        <Logo />
        <span className="font-semibold text-lg text-gray-900">API Sentinel</span>
      </Link>
      <nav className="flex items-center gap-6 text-sm font-medium">
        <Link href="/features" className="text-gray-500 hover:text-gray-900 transition-colors">
          Features
        </Link>
        <Link href="/login" className="text-gray-500 hover:text-gray-900 transition-colors">
          Login
        </Link>
        <Button asChild className="bg-blue-600 hover:bg-blue-500 text-white">
          <Link href="/signup">Get Started</Link>
        </Button>
      </nav>
    </header>
  );
}

