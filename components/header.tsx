import Link from "next/link";
import { Button } from "@/components/ui/button";
import { readSiteSettings } from "@/lib/storage";

export default async function Header() {
  const settings = await readSiteSettings();

  return (
    <header className="mx-auto flex max-w-7xl items-center justify-between px-4 py-6 sm:px-6 lg:px-8">
      <Link href="/" className="text-lg font-semibold tracking-tight">
        {settings.pageTitle}
      </Link>
      <nav className="flex items-center gap-2">
        <Link href="/admin">
          <Button variant="outline" size="sm">
            Admin
          </Button>
        </Link>
      </nav>
    </header>
  );
}
