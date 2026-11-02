"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import type { FormState } from "@/app/actions/auth";

async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}

function parseProduct(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const sku = String(formData.get("sku") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim() || null;
  const qtyRaw = String(formData.get("quantityOnHand") ?? "").trim();
  const costRaw = String(formData.get("costPrice") ?? "").trim();
  const sellRaw = String(formData.get("sellingPrice") ?? "").trim();
  const lowRaw = String(formData.get("lowStockThreshold") ?? "").trim();

  if (!name) return { error: "Name is required." };
  if (!sku) return { error: "SKU is required." };

  const quantityOnHand = qtyRaw === "" ? 0 : Number(qtyRaw);
  if (!Number.isInteger(quantityOnHand) || quantityOnHand < 0)
    return { error: "Quantity must be a whole number, 0 or more." };

  const costPrice = costRaw === "" ? null : Number(costRaw);
  if (costPrice !== null && (Number.isNaN(costPrice) || costPrice < 0))
    return { error: "Cost price must be a number, 0 or more." };

  const sellingPrice = sellRaw === "" ? null : Number(sellRaw);
  if (sellingPrice !== null && (Number.isNaN(sellingPrice) || sellingPrice < 0))
    return { error: "Selling price must be a number, 0 or more." };

  const lowStockThreshold = lowRaw === "" ? null : Number(lowRaw);
  if (
    lowStockThreshold !== null &&
    (!Number.isInteger(lowStockThreshold) || lowStockThreshold < 0)
  )
    return { error: "Low stock threshold must be a whole number, 0 or more." };

  return {
    data: {
      name,
      sku,
      description,
      quantityOnHand,
      costPrice,
      sellingPrice,
      lowStockThreshold,
    },
  };
}

function refresh() {
  revalidatePath("/products");
  revalidatePath("/dashboard");
}

export async function createProduct(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  const user = await requireUser();
  const parsed = parseProduct(formData);
  if ("error" in parsed) return { error: parsed.error };

  const exists = await prisma.product.findUnique({
    where: {
      organizationId_sku: {
        organizationId: user.organizationId,
        sku: parsed.data.sku,
      },
    },
  });
  if (exists) return { error: "A product with this SKU already exists." };

  await prisma.product.create({
    data: {
      ...parsed.data,
      organizationId: user.organizationId,
      lastUpdatedBy: user.email,
    },
  });

  refresh();
  redirect("/products");
}

export async function updateProduct(
  id: string,
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  const user = await requireUser();
  const parsed = parseProduct(formData);
  if ("error" in parsed) return { error: parsed.error };

  const product = await prisma.product.findFirst({
    where: { id, organizationId: user.organizationId },
  });
  if (!product) return { error: "Product not found." };

  const clash = await prisma.product.findFirst({
    where: {
      organizationId: user.organizationId,
      sku: parsed.data.sku,
      NOT: { id },
    },
  });
  if (clash) return { error: "Another product already uses this SKU." };

  await prisma.product.update({
    where: { id },
    data: { ...parsed.data, lastUpdatedBy: user.email },
  });

  refresh();
  redirect("/products");
}

export async function deleteProduct(formData: FormData) {
  const user = await requireUser();
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  await prisma.product.deleteMany({
    where: { id, organizationId: user.organizationId },
  });

  refresh();
}

export async function adjustStock(formData: FormData) {
  const user = await requireUser();
  const id = String(formData.get("id") ?? "");
  const delta = Number(formData.get("delta"));
  if (!id || !Number.isInteger(delta) || delta === 0) return;

  const product = await prisma.product.findFirst({
    where: { id, organizationId: user.organizationId },
  });
  if (!product) return;

  await prisma.product.update({
    where: { id },
    data: {
      quantityOnHand: Math.max(0, product.quantityOnHand + delta),
      lastUpdatedBy: user.email,
    },
  });

  refresh();
}
