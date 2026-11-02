import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { logout } from "@/app/actions/auth";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Dashboard - {user.organization.name}
          </h1>
          <form action={logout}>
            <button className="text-sm text-gray-700 border border-gray-300 rounded px-3 py-1 hover:bg-gray-100">
              Log out
            </button>
          </form>
        </div>
        <p className="text-gray-600">Logged in as {user.email}</p>
      </div>
    </main>
  );
}
