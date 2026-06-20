import { promises as fs } from "fs";
import path from "path";
import { normalizeItem, seedItems, type Item } from "@/lib/items";
import { defaultSiteSettings, type SiteSettings } from "@/lib/site-settings";

const DATA_DIR = path.join(process.cwd(), "data");
const ITEMS_FILE = path.join(DATA_DIR, "items.json");
const SETTINGS_FILE = path.join(DATA_DIR, "site-settings.json");
const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

type StoredItem = Partial<Item> & { image?: string };

async function ensureStorage() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.mkdir(UPLOAD_DIR, { recursive: true });
}

export async function readItems(): Promise<Item[]> {
  await ensureStorage();
  try {
    const raw = await fs.readFile(ITEMS_FILE, "utf8");
    const parsed = JSON.parse(raw) as StoredItem[];
    return parsed.map(normalizeItem);
  } catch {
    await writeItems(seedItems);
    return seedItems;
  }
}

export async function writeItems(items: Item[]) {
  await ensureStorage();
  await fs.writeFile(ITEMS_FILE, JSON.stringify(items, null, 2), "utf8");
}

export async function readSiteSettings(): Promise<SiteSettings> {
  await ensureStorage();
  try {
    const raw = await fs.readFile(SETTINGS_FILE, "utf8");
    return { ...defaultSiteSettings, ...(JSON.parse(raw) as Partial<SiteSettings>) };
  } catch {
    await writeSiteSettings(defaultSiteSettings);
    return defaultSiteSettings;
  }
}

export async function writeSiteSettings(settings: SiteSettings) {
  await ensureStorage();
  await fs.writeFile(SETTINGS_FILE, JSON.stringify(settings, null, 2), "utf8");
}

export async function saveUpload(file: File) {
  await ensureStorage();
  const buffer = Buffer.from(await file.arrayBuffer());
  const safeName = `${crypto.randomUUID()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
  const relativePath = `/uploads/${safeName}`;
  await fs.writeFile(path.join(UPLOAD_DIR, safeName), buffer);
  return relativePath;
}

export async function deleteUpload(relativePath: string) {
  if (!relativePath.startsWith("/uploads/")) return;
  const filePath = path.join(process.cwd(), "public", relativePath);
  try {
    await fs.unlink(filePath);
  } catch {
    // Ignore missing files so deleting a listing never fails because of a stale image.
  }
}
