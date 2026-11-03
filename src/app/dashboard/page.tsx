import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import Nav from "@/components/Nav";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const products = await prisma.product.findMany({
    where: { organizationId: user.organizationId },
    orderBy: { quantityOnHand: "asc" },
  });

  const defaultThreshold = user.organization.defaultLowStockThreshold;
  const totalProducts = products.length;
  const totalUnits = products.reduce((sum, p) => sum + p.quantityOnHand, 0);
  const inventoryValue = products.reduce((sum, p) => sum + (p.costPrice ?? 0) * p.quantityOnHand, 0);

  const lowStock = products
    .map((p) => ({ ...p, threshold: p.lowStockThreshold ?? defaultThreshold }))
    .filter((p) => p.quantityOnHand <= p.threshold);

  return (
    <div className="min-h-screen bg-gray-50">
      <Nav orgName={user.organization.name} />
      <main className="max-w-5xl mx-auto p-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Dashboard</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-5"><p className="text-sm text-gray-500">Inventory value (at cost)</p><p className="text-3xl font-bold text-gray-900">{inventoryValue.toFixed(2)}</p></div>
          <div className="bg-white rounded-lg shadow p-5">
            <p className="text-sm text-gray-500">Total products</p>
            <p className="text-3xl font-bold text-gray-900">{totalProducts}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-5">
            <p className="text-sm text-gray-500">Total units in stock</p>
            <p className="text-3xl font-bold text-gray-900">{totalUnits}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-5">
            <p className="text-sm text-gray-500">Low stock items</p>
            <p className="text-3xl font-bold text-red-600">{lowStock.length}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="px-4 py-3 border-b border-gray-200 font-semibold text-gray-900">
            Low stock items
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">SKU</th>
                  <th className="px-4 py-3">Quantity on hand</th>
                  <th className="px-4 py-3">Low stock threshold</th>
                </tr>
              </thead>
              <tbody className="text-gray-900">
                {lowStock.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-4 py-6 text-center text-gray-500">
                      Nothing is running low.{" "}
                      <Link href="/products" className="text-blue-600 hover:underline">
                        Manage products
                      </Link>
                    </td>
                  </tr>
                )}
                {lowStock.map((p) => (
                  <tr key={p.id} className="border-t border-gray-200">
                    <td className="px-4 py-3">{p.name}</td>
                    <td className="px-4 py-3">{p.sku}</td>
                    <td className="px-4 py-3 text-red-600 font-medium">{p.quantityOnHand}</td>
                    <td className="px-4 py-3">{p.threshold}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

