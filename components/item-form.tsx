"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { fallbackImage } from "@/lib/items";
import type { Item } from "@/lib/items";

export type ItemDraft = Omit<Item, "id" | "createdAt">;

const emptyDraft: ItemDraft = {
  status: "available",
  title: "",
  price: 0,
  category: "",
  condition: "",
  location: "",
  description: "",
  images: []
};

export function ItemForm({
  initialValue,
  onSubmit,
  submitLabel,
  mode = "create"
}: {
  initialValue?: ItemDraft;
  onSubmit: (value: ItemDraft, files: File[], replaceImages: boolean) => void;
  submitLabel: string;
  mode?: "create" | "edit";
}) {
  const [form, setForm] = useState<ItemDraft>(initialValue ?? emptyDraft);
  const [files, setFiles] = useState<Array<{ id: string; file: File }>>([]);
  const [keepExistingImages, setKeepExistingImages] = useState(true);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  useEffect(() => {
    if (initialValue) setForm(initialValue);
  }, [initialValue]);

  useEffect(() => {
    setSelectedIds(files.map((entry) => entry.id));
  }, [files]);

  const [previews, setPreviews] = useState<{ id: string; name: string; preview: string }[]>([]);

  useEffect(() => {
    const nextPreviews = files.map(({ file, id }) => ({
      id,
      name: file.name,
      preview: URL.createObjectURL(file)
    }));
    setPreviews(nextPreviews);
    return () => {
      nextPreviews.forEach(({ preview }) => URL.revokeObjectURL(preview));
    };
  }, [files]);

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(
          form,
          files.filter((entry) => selectedIds.includes(entry.id)).map((entry) => entry.file),
          mode === "edit" ? keepExistingImages : false
        );
      }}
    >
      <div className="grid gap-2">
        <Label htmlFor="title">Title</Label>
        <Input id="title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="price">Price</Label>
          <Input
            id="price"
            type="number"
            min={0}
            value={form.price}
            onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="category">Category</Label>
          <Input id="category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
        </div>
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="condition">Condition</Label>
          <Input id="condition" value={form.condition} onChange={(e) => setForm({ ...form, condition: e.target.value })} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="location">Location</Label>
          <Input id="location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
        </div>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="images">Photos</Label>
          <Input
            id="images"
            type="file"
            accept="image/*"
            multiple
            onChange={(e) =>
              setFiles((current) => [
                ...current,
                ...Array.from(e.target.files ?? []).map((file) => ({
                  id: crypto.randomUUID(),
                  file
                }))
              ])
            }
          />
        {files.length ? (
          <div className="space-y-2 rounded-2xl border bg-muted/40 p-3">
            <p className="text-sm font-medium">Selected photos</p>
            <div className="space-y-2">
              {previews.map(({ id, name, preview }) => {
                const checked = selectedIds.includes(id);
                return (
                  <label
                    key={id}
                    className="flex items-center gap-3 rounded-xl bg-white p-2 text-sm shadow-sm"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={(e) => {
                        setSelectedIds((current) =>
                          e.target.checked
                            ? [...current, id]
                            : current.filter((value) => value !== id)
                        );
                      }}
                    />
                    <div className="relative h-14 w-14 flex-none overflow-hidden rounded-lg bg-muted">
                      <Image src={preview || fallbackImage} alt={name} fill className="object-cover" />
                    </div>
                    <span className="min-w-0 flex-1 truncate">{name}</span>
                    <button
                      type="button"
                      className="rounded-full px-2 py-1 text-xs text-muted-foreground hover:bg-muted hover:text-foreground"
                      onClick={() => {
                        setFiles((current) => current.filter((entry) => entry.id !== id));
                        setSelectedIds((current) => current.filter((value) => value !== id));
                      }}
                    >
                      Remove
                    </button>
                  </label>
                );
              })}
            </div>
          </div>
        ) : null}
        {mode === "edit" ? (
          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            <input
              type="checkbox"
              checked={keepExistingImages}
              onChange={(e) => setKeepExistingImages(e.target.checked)}
            />
            Keep existing photos and add new ones
          </label>
        ) : null}
        <p className="text-xs text-muted-foreground">
          Upload one or more image files. They will be saved inside the project.
        </p>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
      </div>
      <Button type="submit" className="w-full">
        {submitLabel}
      </Button>
    </form>
  );
}
