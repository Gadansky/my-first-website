import fs from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";

const DATA_DIR = path.join(process.cwd(), "data");
const USERS_FILE = path.join(DATA_DIR, "users.json");
const LAST_TOKEN_FILE = path.join(DATA_DIR, "last-token.json");

export async function POST() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(USERS_FILE, "[]", "utf8");
    await fs.writeFile(
      LAST_TOKEN_FILE,
      JSON.stringify({ token: null, wipedAt: new Date().toISOString() }, null, 2),
      "utf8",
    );
    return NextResponse.json({ message: "Datos de usuarios borrados" });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "No pudimos borrar los datos";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
