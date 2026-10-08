import { requireSession } from "@/lib/auth-guard";
import LogoutButton from "@/components/auth/logout-button";

export default async function NexusPage() {
  const currentUser = await requireSession();

  return (
    <main>
      <h1>Nexus</h1>

      <p>Welcome, {currentUser.name}.</p>

      <LogoutButton />
    </main>
  );
}