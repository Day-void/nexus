import { requireSession } from "@/lib/auth-guard";

export default async function NexusPage() {
  const currentUser = await requireSession();

  return (
    <main>
      <h1>Nexus</h1>
      <p>Welcome, {currentUser.name}.</p>
    </main>
  );
}