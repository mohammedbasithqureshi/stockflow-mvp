import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { createProduct } from "@/app/actions/products";
import Nav from "@/components/Nav";
import ProductForm from "@/components/ProductForm";

export default async function NewProductPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return (
    <div className="min-h-screen bg-gray-50">
      <Nav orgName={user.organization.name} />
      <main className="max-w-5xl mx-auto p-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Add Product</h1>
        <ProductForm action={createProduct} submitLabel="Create product" />
      </main>
    </div>
  );
}
