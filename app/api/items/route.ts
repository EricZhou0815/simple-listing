import { NextResponse } from "next/server";
import { deleteUpload, readItems, saveUpload, writeItems } from "@/lib/storage";
import { normalizeItem, type Item } from "@/lib/items";

export async function GET() {
  const items = await readItems();
  return NextResponse.json(items);
}

export async function POST(req: Request) {
  const formData = await req.formData();
  const item = normalizeItem({
    status: "available",
    title: String(formData.get("title") ?? ""),
    price: Number(formData.get("price") ?? 0),
    category: String(formData.get("category") ?? ""),
    condition: String(formData.get("condition") ?? ""),
    location: String(formData.get("location") ?? ""),
    description: String(formData.get("description") ?? "")
  });

  const files = formData.getAll("images").filter((value): value is File => value instanceof File && value.size > 0);
  item.images = files.length ? await Promise.all(files.map((file) => saveUpload(file))) : item.images;

  const items = await readItems();
  const nextItems = [item, ...items];
  await writeItems(nextItems);
  return NextResponse.json(item, { status: 201 });
}

export async function PUT(req: Request) {
  const formData = await req.formData();
  const id = String(formData.get("id") ?? "");
  const current = await readItems();
  const existing = current.find((item) => item.id === id);
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const replaceImages = formData.get("replaceImages") === "1";
  const uploadedFiles = formData.getAll("images").filter((value): value is File => value instanceof File && value.size > 0);
  const nextImages = replaceImages
    ? uploadedFiles.length
      ? await Promise.all(uploadedFiles.map((file) => saveUpload(file)))
      : []
    : [
        ...existing.images,
        ...(uploadedFiles.length ? await Promise.all(uploadedFiles.map((file) => saveUpload(file))) : [])
      ];

  const updated: Item = {
    ...existing,
    status: String(formData.get("status") ?? existing.status) === "sold" ? "sold" : "available",
    title: String(formData.get("title") ?? existing.title),
    price: Number(formData.get("price") ?? existing.price),
    category: String(formData.get("category") ?? existing.category),
    condition: String(formData.get("condition") ?? existing.condition),
    location: String(formData.get("location") ?? existing.location),
    description: String(formData.get("description") ?? existing.description),
    images: nextImages.length ? nextImages : existing.images
  };

  await writeItems(current.map((item) => (item.id === id ? updated : item)));
  return NextResponse.json(updated);
}

export async function DELETE(req: Request) {
  const { id } = (await req.json()) as { id?: string };
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const current = await readItems();
  const target = current.find((item) => item.id === id);
  if (!target) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await Promise.all(target.images.map((img) => deleteUpload(img)));
  await writeItems(current.filter((item) => item.id !== id));
  return NextResponse.json({ ok: true });
}

export async function PATCH(req: Request) {
  const { id, status } = (await req.json()) as { id?: string; status?: Item["status"] };
  if (!id || (status !== "available" && status !== "sold")) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const current = await readItems();
  const updated = current.map((item) => (item.id === id ? { ...item, status } : item));
  await writeItems(updated);
  return NextResponse.json({ ok: true });
}
