"use client";

import { signIn } from "next-auth/react";
import dynamic from "next/dynamic";
import { useState } from "react";

function LoginPage() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    setError(null);
    if (mode === "register") {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(
          typeof data.error === "string" ? data.error : "Falha ao registrar"
        );
        return;
      }
    }
    try {
      await signIn("credentials", { email, password, callbackUrl: "/" });
    } catch (e: any) {
      setError("Credenciais inválidas");
    }
  };

  return (
    <div
      className="min-h-screen bg-zinc-900 text-white flex items-center justify-center p-6"
      suppressHydrationWarning
    >
      <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-6 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">
          {mode === "login" ? "Entrar" : "Registrar"}
        </h1>

        {mode === "register" && (
          <div className="mb-3">
            <label className="block text-sm mb-1">Nome</label>
            <input
              className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded"
              value={name}
              onChange={(e) => setName(e.target.value)}
              suppressHydrationWarning
            />
          </div>
        )}

        <div className="mb-3">
          <label className="block text-sm mb-1">Email</label>
          <input
            type="email"
            className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            suppressHydrationWarning
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm mb-1">Senha</label>
          <input
            type="password"
            className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            suppressHydrationWarning
          />
        </div>

        {error && <p className="text-red-400 text-sm mb-3">{error}</p>}

        <button
          onClick={submit}
          className="w-full px-4 py-2 bg-pink-500 hover:bg-pink-600 rounded text-white"
        >
          {mode === "login" ? "Entrar" : "Registrar"}
        </button>

        <div className="mt-4 text-sm text-zinc-300 text-center">
          {mode === "login" ? (
            <button className="underline" onClick={() => setMode("register")}>
              Criar conta
            </button>
          ) : (
            <button className="underline" onClick={() => setMode("login")}>
              Já tenho conta
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default dynamic(() => Promise.resolve(LoginPage), { ssr: false });
