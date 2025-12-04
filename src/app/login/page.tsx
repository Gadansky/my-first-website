"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { loginUser } from "@/lib/api";
import styles from "../auth.module.css";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    try {
      const res = await loginUser({ email, password });
      const label = res.message || "Login correcto. Ya puedes usar tu token.";
      setMessage(label);
      if (res.token) {
        localStorage.setItem("auth_token", res.token);
      } else {
        localStorage.setItem("auth_token", "ok");
      }
      const displayName =
        (res as { user?: { name?: string; email?: string } })?.user?.name ||
        (res as { user?: { email?: string } })?.user?.email ||
        "";
      if (displayName) {
        localStorage.setItem("auth_user_name", displayName);
      } else {
        localStorage.removeItem("auth_user_name");
      }
      router.push("/interno");
    } catch (err) {
      const label =
        err instanceof Error ? err.message : "No pudimos iniciar sesión";
      setError(label);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.shell}>
        <div className={styles.backRow}>
          <button
            type="button"
            className={styles.backButton}
            onClick={() => router.push("/")}
          >
            ← Volver al inicio
          </button>
        </div>

        <header className={styles.header}>
          <div className={styles.eyebrow}>
            <span />
            <p>Login</p>
            <span />
          </div>
          <h1 className={styles.title}>Accede a tu cuenta</h1>
        </header>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <div className={styles.labelRow}>
              <label htmlFor="email">Correo</label>
            </div>
            <input
              id="email"
              className={styles.input}
              name="email"
              type="email"
              placeholder="correo@dominio.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              required
            />
          </div>

          <div className={styles.field}>
            <div className={styles.labelRow}>
              <label htmlFor="password">Contraseña</label>
            </div>
            <input
              id="password"
              className={styles.input}
              name="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              required
            />
          </div>

          <div className={styles.actions}>
            <button className={styles.button} type="submit" disabled={loading}>
              {loading ? "Comprobando..." : "Entrar"}
            </button>
            <Link className={styles.mutedLink} href="/register">
              ¿Necesitas una cuenta? Regístrate
            </Link>
          </div>
        </form>

        {message && <p className={styles.status}>{message}</p>}
        {error && <p className={`${styles.status} ${styles.error}`}>{error}</p>}
      </div>
    </div>
  );
}
