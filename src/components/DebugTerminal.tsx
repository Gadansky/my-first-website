"use client";

import { useEffect, useState } from "react";
import styles from "./debug-terminal.module.css";

type DebugState = {
  users: unknown;
  lastToken: unknown;
  localToken: string | null;
  error?: string;
};

export function DebugTerminal() {
  const [debug, setDebug] = useState<DebugState>({
    users: [],
    lastToken: null,
    localToken: null,
  });
  const [loading, setLoading] = useState(false);
  const [wiping, setWiping] = useState(false);

  async function loadDebug() {
    setLoading(true);
    try {
      const res = await fetch("/api/debug", { cache: "no-store" });
      const data = await res.json();
      const localToken =
        typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;
      setDebug({ ...data, localToken });
    } catch (error) {
      setDebug((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : "No se pudo leer debug",
      }));
    } finally {
      setLoading(false);
    }
  }

  async function wipeData() {
    setWiping(true);
    try {
      await fetch("/api/debug/wipe", { method: "POST" });
      await loadDebug();
    } catch (error) {
      setDebug((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : "No se pudo limpiar datos",
      }));
    } finally {
      setWiping(false);
    }
  }

  useEffect(() => {
    void loadDebug();
  }, []);

  return (
    <div className={styles.dock} aria-label="terminal-debug">
      <div className={styles.header}>
        <span>Debug (no seguro, solo demo)</span>
        <div className={styles.actions}>
          <button className={styles.button} onClick={loadDebug} disabled={loading}>
            {loading ? "Actualizando..." : "Refrescar"}
          </button>
          <button
            className={`${styles.button} ${styles.wipe}`}
            onClick={wipeData}
            disabled={wiping}
            title="Borra usuarios y último token guardado"
          >
            {wiping ? "Limpiando..." : "Wipe data"}
          </button>
        </div>
      </div>
      <div className={styles.body}>
        <pre>
{`users: ${JSON.stringify(debug.users, null, 2) || "[]"}

lastToken: ${JSON.stringify(debug.lastToken, null, 2) || "null"}

localStorage.auth_token: ${debug.localToken ?? "null"}
`}
        </pre>
        {debug.error && <p className={styles.error}>Error: {debug.error}</p>}
      </div>
    </div>
  );
}
