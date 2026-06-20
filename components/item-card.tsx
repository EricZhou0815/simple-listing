import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { fallbackImage, type Item } from "@/lib/items";

export function ItemCard({ item }: { item: Item }) {
  return (
    <Link href={`/items/${item.id}`} className="group block">
      <Card className="overflow-hidden border-white/60 bg-white/90 transition-transform duration-200 group-hover:-translate-y-1 group-hover:shadow-lg">
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={item.images[0] ?? fallbackImage}
            alt={item.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {item.status === "sold" ? (
            <div className="absolute left-3 top-3 rounded-full bg-black/70 px-3 py-1 text-xs font-medium text-white">
              Sold
            </div>
          ) : null}
        </div>
        <CardContent className="space-y-3 pt-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="line-clamp-1 text-lg font-semibold">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.location}</p>
            </div>
            <div className="rounded-full bg-accent px-3 py-1 text-sm font-semibold text-accent-foreground">
              ${item.price}
            </div>
          </div>
          <p className="line-clamp-2 text-sm text-muted-foreground">{item.description}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
