import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { updateProduct } from "@/app/actions/products";
import Nav from "@/components/Nav";
import ProductForm from "@/components/ProductForm";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const product = await prisma.product.findFirst({
    where: { id, organizationId: user.organizationId },
  });
  if (!product) notFound();

  return (
    <div className="min-h-screen bg-gray-50">
      <Nav orgName={user.organization.name} />
      <main className="max-w-5xl mx-auto p-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Edit Product</h1>
        <ProductForm
          action={updateProduct.bind(null, product.id)}
          initial={product}
          submitLabel="Save changes"
        />
      </main>
    </div>
  );
}
