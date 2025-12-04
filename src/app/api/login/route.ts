import { NextResponse } from "next/server";
import { SignJWT } from "jose";
import fs from "fs/promises";
import path from "path";
import { verifyUser } from "@/lib/users";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "dev-secret-key-please-change",
);

async function createToken(payload: Record<string, unknown>) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("2h")
    .sign(JWT_SECRET);
}

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Correo y contraseña son obligatorios" },
        { status: 400 },
      );
    }

    const user = await verifyUser(String(email), String(password));
    if (!user) {
      return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 });
    }

    const token = await createToken({ sub: user.id, email: user.email });

    const dataDir = path.join(process.cwd(), "data");
    await fs.mkdir(dataDir, { recursive: true });
    await fs.writeFile(
      path.join(dataDir, "last-token.json"),
      JSON.stringify(
        { token, issuedAt: new Date().toISOString(), email: user.email },
        null,
        2,
      ),
      "utf8",
    );

    return NextResponse.json({
      message: "Login correcto",
      token,
      user: { id: user.id, email: user.email, name: user.name },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "No pudimos iniciar sesión";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
