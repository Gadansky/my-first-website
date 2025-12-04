"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function InternoPage() {
  const router = useRouter();
  const [userName] = useState<string>(() => {
    if (typeof window === "undefined") return "Amig@";
    const stored = localStorage.getItem("auth_user_name");
    return stored && stored.trim() ? stored : "Amig@";
  });

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;
    if (!token) {
      router.replace("/login");
    }
  }, [router]);

  function handleSignOut() {
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("auth_user_name");
    }
    router.push("/");
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        background: "var(--background)",
      }}
    >
      <div style={{ position: "absolute", top: 20, right: 20 }}>
        <button
          type="button"
          onClick={handleSignOut}
          style={{
            padding: "10px 14px",
            borderRadius: 12,
            border: "1px solid var(--stroke)",
            background: "var(--card)",
            color: "var(--text)",
            cursor: "pointer",
            fontWeight: 700,
          }}
        >
          Cerrar sesión
        </button>
      </div>
      <div style={{ position: "relative", textAlign: "center" }}>
        <div
          style={{
            position: "absolute",
            top: -40,
            left: "50%",
            transform: "translateX(-50%)",
            padding: "10px 14px",
            borderRadius: 12,
            border: "1px solid var(--stroke)",
            background: "var(--card)",
            color: "var(--text)",
            minWidth: 180,
            boxShadow: "var(--shadow)",
            fontWeight: 700,
          }}
        >
          Hola {userName}
        </div>
        <Image
          src="/gato_cool.png"
          alt="Gato cool"
          width={480}
          height={480}
          style={{ objectFit: "contain" }}
        />
      </div>
    </div>
  );
}
