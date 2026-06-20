import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { type Item } from "@/lib/items";
import { ItemGallery } from "@/components/item-gallery";

export function ItemDetailView({ item, messengerUrl }: { item: Item; messengerUrl: string }) {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
      <div className="mb-6">
        <Link href="/">
          <Button variant="outline">Back to home</Button>
        </Link>
      </div>
      <Card className="overflow-hidden bg-white/90">
        <div className="grid gap-0 lg:grid-cols-2">
          <div className="p-4">
            <ItemGallery images={item.images} title={item.title} />
            {item.images.length > 1 ? (
              <p className="mt-3 text-sm text-muted-foreground">
                Swipe left or right, or tap a thumbnail to view the other photos.
              </p>
            ) : null}
          </div>
          <CardContent className="space-y-4 p-8">
            {item.status === "sold" ? (
              <div className="inline-flex rounded-full bg-black px-3 py-1 text-xs font-medium text-white">
                Sold
              </div>
            ) : null}
            <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <span>{item.category}</span>
              <span>·</span>
              <span>{item.condition}</span>
              <span>·</span>
              <span>{item.location}</span>
            </div>
            <h1 className="text-3xl font-semibold">{item.title}</h1>
            <p className="text-3xl font-semibold text-primary">${item.price}</p>
            <p className="text-base leading-7 text-muted-foreground">{item.description}</p>
            {messengerUrl ? (
              <div className="pt-2">
                <a href={messengerUrl} target="_blank" rel="noreferrer">
                  <Button className="w-full sm:w-auto">Talk to seller</Button>
                </a>
              </div>
            ) : null}
            <div className="rounded-2xl bg-muted p-4 text-sm text-muted-foreground">Posted on: {item.createdAt}</div>
          </CardContent>
        </div>
      </Card>
    </section>
  );
}
