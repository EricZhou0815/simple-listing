"use client";

import { useEffect, useMemo, useState } from "react";
import { LogOut } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { fallbackImage, seedItems, type Item } from "@/lib/items";
import { defaultSiteSettings, type SiteSettings } from "@/lib/site-settings";

const AUTH_KEY = "simple-listing-auth";

async function fetchItems() {
  const res = await fetch("/api/items", { cache: "no-store" });
  if (!res.ok) return seedItems;
  return (await res.json()) as Item[];
}

async function fetchSiteSettings() {
  const res = await fetch("/api/site-settings", { cache: "no-store" });
  if (!res.ok) return defaultSiteSettings;
  return (await res.json()) as SiteSettings;
}

export function AppShell() {
  const [items, setItems] = useState<Item[]>(seedItems);
  const [ready, setReady] = useState(false);
  const [authed, setAuthed] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(defaultSiteSettings);

  useEffect(() => {
    const boot = async () => {
      setItems(await fetchItems());
      setSiteSettings(await fetchSiteSettings());
      setAuthed(window.localStorage.getItem(AUTH_KEY) === "1");
      setReady(true);
    };
    boot();
  }, []);

  const sortedItems = useMemo(() => [...items].sort((a, b) => b.createdAt.localeCompare(a.createdAt)), [items]);

  async function refresh() {
    setItems(await fetchItems());
  }

  async function refreshSettings() {
    setSiteSettings(await fetchSiteSettings());
  }

  async function markSold(id: string, status: "available" | "sold") {
    const res = await fetch("/api/items", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status })
    });
    if (!res.ok) throw new Error("Failed to update status");
    await refresh();
  }

  async function updateSiteSettings(nextSettings: SiteSettings) {
    const res = await fetch("/api/site-settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nextSettings)
    });
    if (!res.ok) throw new Error("Failed to update site settings");
    await refreshSettings();
  }

  if (!ready) {
    return <div className="mx-auto max-w-7xl px-4 py-24 text-center text-muted-foreground">Loading...</div>;
  }

  if (!authed) {
    return (
      <LoginView
        error={loginError}
        onLogin={async (user, pass) => {
          const res = await fetch("/api/admin/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username: user, password: pass })
          });

          if (res.ok) {
            window.localStorage.setItem(AUTH_KEY, "1");
            setLoginError("");
            setAuthed(true);
            return;
          }

          const payload = (await res.json().catch(() => null)) as { error?: string } | null;
          setLoginError(payload?.error ?? "Invalid username or password");
        }}
      />
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between gap-4 rounded-3xl border bg-white/80 p-4 shadow-sm backdrop-blur">
        <div>
          <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
          <p className="text-sm text-muted-foreground">Add, edit, and delete listings.</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/admin/add">
            <Button>Add listing</Button>
          </Link>
          <Button
            variant="outline"
            onClick={() => {
              window.localStorage.removeItem(AUTH_KEY);
              setAuthed(false);
            }}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Log out
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <Card className="bg-white/90">
          <CardHeader>
            <CardTitle>Homepage Text</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium">Page title</label>
              <Input
                value={siteSettings.pageTitle}
                onChange={(e) => setSiteSettings({ ...siteSettings, pageTitle: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Badge</label>
              <Input
                value={siteSettings.heroBadge}
                onChange={(e) => setSiteSettings({ ...siteSettings, heroBadge: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Title</label>
              <Input
                value={siteSettings.heroTitle}
                onChange={(e) => setSiteSettings({ ...siteSettings, heroTitle: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Description</label>
              <textarea
                className="min-h-24 rounded-2xl border border-input bg-background px-4 py-3 text-sm"
                value={siteSettings.heroDescription}
                onChange={(e) => setSiteSettings({ ...siteSettings, heroDescription: e.target.value })}
              />
            </div>
            <Button
              className="w-full"
              onClick={async () => {
                try {
                  await updateSiteSettings(siteSettings);
                } catch {
                  // Keep the admin flow simple; retry after fixing server issues.
                }
              }}
            >
              Save homepage text
            </Button>
          </CardContent>
        </Card>

        {sortedItems.map((item) => (
          <Card key={item.id} className="overflow-hidden bg-white/90">
            <div className="flex items-start justify-between gap-3 border-b px-4 py-3">
              <div className="min-w-0">
                <h3 className="truncate text-base font-semibold">{item.title}</h3>
                <p className="text-xs text-muted-foreground">
                  {item.category} · {item.condition} · {item.location}
                </p>
              </div>
            </div>
            <div className="grid gap-0 md:grid-cols-[120px_1fr_auto]">
              <div className="relative min-h-32">
                <Image src={item.images[0] ?? fallbackImage} alt={item.title} fill className="object-cover" />
              </div>
              <CardContent className="py-4">
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{item.description}</p>
                <p className="mt-3 text-base font-semibold text-primary">${item.price}</p>
                {item.status === "sold" ? (
                  <p className="mt-2 inline-flex rounded-full bg-black px-2 py-1 text-[11px] font-medium text-white">
                    Sold
                  </p>
                ) : null}
                <Button
                  variant="destructive"
                  className="mt-4 w-full md:w-auto"
                  onClick={async () => {
                    if (window.confirm(`Delete ${item.title} and all related images?`)) {
                      const res = await fetch("/api/items", {
                        method: "DELETE",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ id: item.id })
                      });
                      if (res.ok) await refresh();
                    }
                  }}
                >
                  Delete product
                </Button>
              </CardContent>
              <div className="flex gap-2 p-4 md:flex-col md:justify-center">
                <Link href={`/items/${item.id}`}>
                  <Button variant="outline" size="sm" className="w-full">
                    View
                  </Button>
                </Link>
                {item.status === "sold" ? (
                  <Button variant="secondary" size="sm" onClick={() => markSold(item.id, "available")}>
                    Mark available
                  </Button>
                ) : (
                  <Button variant="secondary" size="sm" onClick={() => markSold(item.id, "sold")}>
                    Mark sold
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function LoginView({
  onLogin,
  error
}: {
  onLogin: (username: string, password: string) => Promise<void>;
  error: string;
}) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="mx-auto flex min-h-[calc(100vh-96px)] max-w-md items-center px-4">
      <Card className="w-full bg-white/90 p-2">
        <CardHeader>
          <CardTitle>Admin Login</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
            <Input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              type="password"
            />
            {error ? <p className="text-sm text-destructive">{error}</p> : null}
          </div>
          <Button
            className="w-full"
            onClick={async () => {
              await onLogin(username, password);
            }}
          >
            Sign in
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
