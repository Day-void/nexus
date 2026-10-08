import { requirePlatformAdmin } from "@/lib/auth-guard";

export default async function AdminPage() {
  const currentUser = await requirePlatformAdmin();

  return (
    <main>
      <h1>Nexus Admin</h1>
      <p>Administrator: {currentUser.name}</p>
    </main>
  );
}