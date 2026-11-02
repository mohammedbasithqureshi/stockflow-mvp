import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import Nav from "@/components/Nav";
import ProductTable from "./ProductTable";

export default async function ProductsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const products = await prisma.product.findMany({
    where: { organizationId: user.organizationId },
    orderBy: { createdAt: "desc" },
  });

  const defaultThreshold = user.organization.defaultLowStockThreshold;

  const rows = products.map((p) => ({
    id: p.id,
    name: p.name,
    sku: p.sku,
    quantityOnHand: p.quantityOnHand,
    sellingPrice: p.sellingPrice,
    isLow: p.quantityOnHand <= (p.lowStockThreshold ?? defaultThreshold),
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      <Nav orgName={user.organization.name} />
      <main className="max-w-5xl mx-auto p-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <Link
            href="/products/new"
            className="bg-blue-600 text-white rounded px-4 py-2 font-medium hover:bg-blue-700"
          >
            Add Product
          </Link>
        </div>
        <ProductTable rows={rows} />
      </main>
    </div>
  );
}
