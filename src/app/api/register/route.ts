import { NextResponse } from "next/server";
import { addUser } from "@/lib/users";

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Correo y contraseña son obligatorios" },
        { status: 400 },
      );
    }

    await addUser({
      name: typeof name === "string" ? name : undefined,
      email: String(email),
      password: String(password),
    });

    return NextResponse.json({ message: "Usuario registrado" }, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "No pudimos registrar al usuario";
    const status = message.includes("registrado") ? 409 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
