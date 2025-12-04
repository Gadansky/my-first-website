"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { registerUser } from "@/lib/api";
import styles from "../auth.module.css";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
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
      const res = await registerUser({ name, email, password });
      const label = res.message || "Usuario registrado";
      setMessage(label);
      router.push("/");
    } catch (err) {
      const label =
        err instanceof Error ? err.message : "No pudimos registrar al usuario";
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
            <p>Registro</p>
            <span />
          </div>
          <h1 className={styles.title}>Crea tu cuenta</h1>
        </header>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <div className={styles.labelRow}>
              <label htmlFor="name">Nombre</label>
              <span className={styles.helper}>Opcional</span>
            </div>
            <input
              id="name"
              className={styles.input}
              name="name"
              placeholder="Ana Programadora"
              value={name}
              onChange={(event) => setName(event.target.value)}
              autoComplete="name"
            />
          </div>

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
              autoComplete="new-password"
              required
            />
          </div>

          <div className={styles.actions}>
            <button className={styles.button} type="submit" disabled={loading}>
              {loading ? "Enviando..." : "Crear cuenta"}
            </button>
            <Link className={styles.mutedLink} href="/login">
              ¿Ya tienes cuenta? Inicia sesión
            </Link>
          </div>
        </form>

        {message && <p className={styles.status}>{message}</p>}
        {error && <p className={`${styles.status} ${styles.error}`}>{error}</p>}
      </div>
    </div>
  );
}
