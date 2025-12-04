import fs from "fs/promises";
import path from "path";
import bcrypt from "bcryptjs";

export type User = {
  id: string;
  name?: string;
  email: string;
  passwordHash: string;
  createdAt: string;
};

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "users.json");

async function ensureStorage() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(DATA_FILE);
  } catch {
    await fs.writeFile(DATA_FILE, "[]", "utf8");
  }
}

export async function readUsers(): Promise<User[]> {
  await ensureStorage();
  const raw = await fs.readFile(DATA_FILE, "utf8");
  if (!raw.trim()) return [];
  return JSON.parse(raw) as User[];
}

async function writeUsers(users: User[]) {
  await ensureStorage();
  await fs.writeFile(DATA_FILE, JSON.stringify(users, null, 2), "utf8");
}

export async function findUserByEmail(email: string) {
  const users = await readUsers();
  return users.find(
    (u) => u.email.trim().toLowerCase() === email.trim().toLowerCase(),
  );
}

export async function addUser(params: {
  name?: string;
  email: string;
  password: string;
}) {
  const { name, email, password } = params;
  const existing = await findUserByEmail(email);
  if (existing) throw new Error("El correo ya está registrado");

  const passwordHash = await bcrypt.hash(password, 10);
  const user: User = {
    id: crypto.randomUUID(),
    name,
    email,
    passwordHash,
    createdAt: new Date().toISOString(),
  };

  const users = await readUsers();
  users.push(user);
  await writeUsers(users);
  return user;
}

export async function verifyUser(email: string, password: string) {
  const user = await findUserByEmail(email);
  if (!user) return null;
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return null;
  return user;
}
