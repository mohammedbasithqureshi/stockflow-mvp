"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";

export type SettingsState = { error?: string; success?: boolean } | undefined;

export async function updateSettings(
  _prev: SettingsState,
  formData: FormData
): Promise<SettingsState> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const raw = String(formData.get("defaultLowStockThreshold") ?? "").trim();
  const value = Number(raw);

  if (raw === "" || !Number.isInteger(value) || value < 0)
    return { error: "Enter a whole number, 0 or more." };

  await prisma.organization.update({
    where: { id: user.organizationId },
    data: { defaultLowStockThreshold: value },
  });

  revalidatePath("/dashboard");
  revalidatePath("/products");
  revalidatePath("/settings");
  return { success: true };
}
