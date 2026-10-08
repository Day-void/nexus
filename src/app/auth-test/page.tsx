"use client";

import { FormEvent, useState } from "react";

import { authClient } from "@/lib/auth-client";

export default function AuthTestPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function handleRegister(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("Creating account...");

    const { data, error } = await authClient.signUp.email({
      name,
      email,
      password,
    });

    if (error) {
      setMessage(error.message ?? "Registration failed.");
      return;
    }

    setMessage(`Account created: ${data?.user.email ?? email}`);
  }

  async function handleLogout() {
    const { error } = await authClient.signOut();

    setMessage(error ? error.message ?? "Logout failed." : "Logged out.");
  }

  return (
    <main>
      <h1>Nexus Auth Test</h1>

      <form onSubmit={handleRegister}>
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Name"
          required
        />

        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Email"
          required
        />

        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Password"
          minLength={8}
          required
        />

        <button type="submit">Create account</button>
      </form>

      <button type="button" onClick={handleLogout}>
        Logout
      </button>

      <p>{message}</p>
    </main>
  );
}
