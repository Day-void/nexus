import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getCurrentUser() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return null;
  }

  return session.user;
}

export async function requireSession() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/auth/login");
  }

  return currentUser;
}

export async function requirePlatformAdmin() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/auth/login");
  }

  const [account] = await db
    .select({
      id: user.id,
      platformRole: user.platformRole,
    })
    .from(user)
    .where(eq(user.id, currentUser.id))
    .limit(1);

  if (!account || account.platformRole !== "admin") {
    redirect("/nexus");
  }

  return currentUser;
}