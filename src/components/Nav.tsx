import Link from "next/link";
import { logout } from "@/app/actions/auth";

export default function Nav({ orgName }: { orgName: string }) {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <span className="font-bold text-gray-900">
            StockFlow <span className="font-normal text-gray-500">| {orgName}</span>
          </span>
          <nav className="flex gap-4 text-sm text-gray-700">
            <Link href="/dashboard" className="hover:text-blue-600">Dashboard</Link>
            <Link href="/products" className="hover:text-blue-600">Products</Link>
            <Link href="/settings" className="hover:text-blue-600">Settings</Link>
          </nav>
        </div>
        <form action={logout}>
          <button className="text-sm text-gray-700 border border-gray-300 rounded px-3 py-1 hover:bg-gray-100">
            Log out
          </button>
        </form>
      </div>
    </header>
  );
}
