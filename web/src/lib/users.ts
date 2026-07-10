import fs from "fs";
import path from "path";
import crypto from "crypto";

const DB_PATH = path.join(process.cwd(), "data", "users.json");

interface StoredUser {
  id: string;
  name: string;
  email: string;
  mobile: string;
  passwordHash: string;
  createdAt: string;
}

function readUsers(): StoredUser[] {
  try {
    if (!fs.existsSync(DB_PATH)) return [];
    return JSON.parse(fs.readFileSync(DB_PATH, "utf-8"));
  } catch {
    return [];
  }
}

function writeUsers(users: StoredUser[]) {
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(DB_PATH, JSON.stringify(users, null, 2));
}

export async function hashPassword(password: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const salt = crypto.randomBytes(16).toString("hex");
    crypto.pbkdf2(password, salt, 100000, 64, "sha512", (err, key) => {
      if (err) reject(err);
      else resolve(`${salt}:${key.toString("hex")}`);
    });
  });
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const [salt, stored] = hash.split(":");
    crypto.pbkdf2(password, salt, 100000, 64, "sha512", (err, key) => {
      if (err) reject(err);
      else resolve(key.toString("hex") === stored);
    });
  });
}

export function getUserByEmail(email: string): StoredUser | null {
  const users = readUsers();
  return users.find((u) => u.email.toLowerCase() === email.toLowerCase()) ?? null;
}

export function getUserByMobile(mobile: string): StoredUser | null {
  const users = readUsers();
  return users.find((u) => u.mobile === mobile) ?? null;
}

export function createUser(data: { name: string; email: string; mobile: string; passwordHash: string }): StoredUser {
  const users = readUsers();
  const user: StoredUser = {
    id: crypto.randomUUID(),
    ...data,
    createdAt: new Date().toISOString(),
  };
  users.push(user);
  writeUsers(users);
  return user;
}

export function userExists(email: string, mobile: string): boolean {
  const users = readUsers();
  return users.some(
    (u) => u.email.toLowerCase() === email.toLowerCase() || u.mobile === mobile
  );
}

export function updateUserPassword(email: string, passwordHash: string): boolean {
  const users = readUsers();
  const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (!user) return false;
  user.passwordHash = passwordHash;
  writeUsers(users);
  return true;
}
