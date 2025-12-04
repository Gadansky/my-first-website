import fs from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import { readUsers } from "@/lib/users";

export async function GET() {
  try {
    const users = await readUsers();
    const dataDir = path.join(process.cwd(), "data");
    let lastToken: unknown = null;

    try {
      const raw = await fs.readFile(path.join(dataDir, "last-token.json"), "utf8");
      lastToken = JSON.parse(raw);
    } catch {
      lastToken = null;
    }

    return NextResponse.json({ users, lastToken });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "No pudimos leer el estado";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
