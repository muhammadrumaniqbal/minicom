
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LockKeyhole, UserRound, LoaderCircle } from "lucide-react";

export default function LoginForm({ role }) {
  const router = useRouter();
  const isAdmin = role === "admin";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Login failed. Please try again.");
        return;
      }

      // Customers go to the homepage; admins go to the admin dashboard.
      router.replace(isAdmin ? "/admin" : "/");
      router.refresh();
    } catch {
      setError("Could not connect to the server. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md rounded-2xl border border-[#e5dacb] bg-white p-7 shadow-sm sm:p-9">
      <div className="mb-7">
        <p className="mb-2 text-xs font-bold uppercase tracking-[3px] text-[#9b7956]">
          Minicom
        </p>

        <h1 className="text-3xl font-semibold tracking-tight text-[#30251e]">
          {isAdmin ? "Admin sign in" : "Customer sign in"}
        </h1>

        <p className="mt-2 text-sm leading-6 text-neutral-500">
          {isAdmin
            ? "Sign in to manage your Minicom store."
            : "Sign in to explore Minicom and continue shopping."}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label
            htmlFor={`${role}-username`}
            className="mb-2 block text-sm font-medium text-[#30251e]"
          >
            Username
          </label>

          <div className="flex items-center gap-3 rounded-xl border border-[#e5dacb] px-4 focus-within:border-[#8a6b4e]">
            <UserRound size={18} className="shrink-0 text-neutral-400" />

            <input
              id={`${role}-username`}
              type="text"
              autoComplete="username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              required
              maxLength={100}
              className="w-full bg-transparent py-3.5 text-sm text-[#30251e] outline-none"
              placeholder="Enter your username"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor={`${role}-password`}
            className="mb-2 block text-sm font-medium text-[#30251e]"
          >
            Password
          </label>

          <div className="flex items-center gap-3 rounded-xl border border-[#e5dacb] px-4 focus-within:border-[#8a6b4e]">
            <LockKeyhole size={18} className="shrink-0 text-neutral-400" />

            <input
              id={`${role}-password`}
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              maxLength={200}
              className="w-full bg-transparent py-3.5 text-sm text-[#30251e] outline-none"
              placeholder="Enter your password"
            />
          </div>
        </div>

        {error && (
          <p
            role="alert"
            className="rounded-lg bg-red-50 px-3 py-2.5 text-sm text-red-700"
          >
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#30251e] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-[#493728] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading && <LoaderCircle size={18} className="animate-spin" />}
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </div>
  );
}
