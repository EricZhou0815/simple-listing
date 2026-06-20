"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ItemForm, type ItemDraft } from "@/components/item-form";

const AUTH_KEY = "simple-listing-auth";

export function AddListingPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [authed, setAuthed] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setAuthed(window.localStorage.getItem(AUTH_KEY) === "1");
    setReady(true);
  }, []);

  async function createItem(draft: ItemDraft, files: File[]) {
    const formData = new FormData();
    formData.set("status", "available");
    formData.set("title", draft.title);
    formData.set("price", String(draft.price));
    formData.set("category", draft.category);
    formData.set("condition", draft.condition);
    formData.set("location", draft.location);
    formData.set("description", draft.description);
    files.forEach((file) => formData.append("images", file));

    const res = await fetch("/api/items", { method: "POST", body: formData });
    if (!res.ok) {
      throw new Error("Failed to create item");
    }
  }

  if (!ready) {
    return <div className="mx-auto max-w-4xl px-4 py-24 text-center text-muted-foreground">Loading...</div>;
  }

  if (!authed) {
    router.replace("/admin");
    return null;
  }

  return (
    <div className="mx-auto max-w-4xl px-4 pb-16 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between gap-4 rounded-3xl border bg-white/80 p-4 shadow-sm backdrop-blur">
        <div>
          <h1 className="text-2xl font-semibold">Add Listing</h1>
          <p className="text-sm text-muted-foreground">Create a new product, then return to the dashboard.</p>
        </div>
        <Button variant="outline" onClick={() => router.push("/admin")}>
          Back to admin
        </Button>
      </div>

      <Card className="bg-white/90">
        <CardHeader>
          <CardTitle>New Product</CardTitle>
        </CardHeader>
        <CardContent>
          <ItemForm
            submitLabel="Add listing"
            onSubmit={async (draft, files) => {
              try {
                await createItem(draft, files);
                router.push("/admin");
                router.refresh();
              } catch {
                setError("Failed to create item");
              }
            }}
          />
          {error ? <p className="mt-3 text-sm text-destructive">{error}</p> : null}
        </CardContent>
      </Card>
    </div>
  );
}
