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

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("Signing in...");

    const { data, error } = await authClient.signIn.email({
      email,
      password,
    });

    if (error) {
      setMessage(error.message ?? "Login failed.");
      return;
    }

    setMessage(`Signed in as ${data?.user.email ?? email}`);
  }

  async function handleLogout() {
    const { error } = await authClient.signOut();

    setMessage(error ? error.message ?? "Logout failed." : "Logged out.");
  }

  async function checkSession() {
    const { data, error } = await authClient.getSession();

    if (error) {
      setMessage(error.message ?? "Could not retrieve session.");
      return;
    }

    setMessage(
      data?.user
        ? `Authenticated as ${data.user.email}`
        : "No active session.",
    );
  }

  return (
    <main>
      <h1>Nexus Auth Test</h1>

      <section>
        <h2>Register</h2>

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
      </section>

      <section>
        <h2>Login</h2>

        <form onSubmit={handleLogin}>
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
            required
          />

          <button type="submit">Login</button>
        </form>
      </section>

      <section>
        <button type="button" onClick={checkSession}>
          Check session
        </button>

        <button type="button" onClick={handleLogout}>
          Logout
        </button>
      </section>

      <p>{message}</p>
    </main>
  );
}
