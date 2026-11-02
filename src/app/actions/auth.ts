"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { createSession, destroySession } from "@/lib/session";

export type FormState = { error?: string } | undefined;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function signup(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirmPassword") ?? "");
  const orgName = String(formData.get("organizationName") ?? "").trim();

  if (!emailPattern.test(email)) return { error: "Enter a valid email." };
  if (password.length < 6)
    return { error: "Password must be at least 6 characters." };
  if (password !== confirm) return { error: "Passwords do not match." };
  if (!orgName) return { error: "Organization name is required." };

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return { error: "An account with this email already exists." };

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      organization: { create: { name: orgName } },
    },
  });

  await createSession(user.id);
  redirect("/dashboard");
}

export async function login(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!emailPattern.test(email) || !password)
    return { error: "Enter your email and password." };

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return { error: "Invalid email or password." };

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return { error: "Invalid email or password." };

  await createSession(user.id);
  redirect("/dashboard");
}

export async function logout() {
  await destroySession();
  redirect("/login");
}
