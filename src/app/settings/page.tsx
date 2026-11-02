import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import Nav from "@/components/Nav";
import SettingsForm from "./SettingsForm";

export default async function SettingsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return (
    <div className="min-h-screen bg-gray-50">
      <Nav orgName={user.organization.name} />
      <main className="max-w-5xl mx-auto p-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Settings</h1>
        <SettingsForm current={user.organization.defaultLowStockThreshold} />
      </main>
    </div>
  );
}
