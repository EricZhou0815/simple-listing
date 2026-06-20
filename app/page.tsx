import Header from "@/components/header";
import { ItemCard } from "@/components/item-card";
import { readItems, readSiteSettings } from "@/lib/storage";

export default async function HomePage() {
  const items = (await readItems()).filter((item) => item.status !== "sold");
  const settings = await readSiteSettings();

  return (
    <main>
      <Header />
      <section className="mx-auto max-w-7xl px-4 pb-16 pt-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="mb-3 inline-flex rounded-full bg-white/80 px-4 py-2 text-sm text-muted-foreground shadow-sm">
            {settings.heroBadge}
          </p>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            {settings.pageTitle}
          </h1>
          <p className="mt-4 text-base leading-7 text-muted-foreground">
            {settings.heroDescription}
          </p>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      </section>
    </main>
  );
}
