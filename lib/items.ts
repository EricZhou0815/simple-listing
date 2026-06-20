export type Item = {
  id: string;
  status: "available" | "sold";
  title: string;
  price: number;
  category: string;
  condition: string;
  location: string;
  description: string;
  images: string[];
  createdAt: string;
};

export const fallbackImage =
  "https://images.unsplash.com/photo-1484101403633-562f891dc89a?auto=format&fit=crop&w=1200&q=80";

export function normalizeItem(item: Partial<Item> & { image?: string }): Item {
  return {
    id: item.id ?? crypto.randomUUID(),
    status: item.status === "sold" ? "sold" : "available",
    title: item.title ?? "",
    price: item.price ?? 0,
    category: item.category ?? "",
    condition: item.condition ?? "",
    location: item.location ?? "",
    description: item.description ?? "",
    images: item.images?.length ? item.images : item.image ? [item.image] : [fallbackImage],
    createdAt: item.createdAt ?? new Date().toISOString().slice(0, 10)
  };
}

export const seedItems: Item[] = [
  {
    id: "1",
    status: "available",
    title: "Scandinavian Armchair",
    price: 680,
    category: "Furniture",
    condition: "Like new",
    location: "Shanghai · Xuhui",
    description: "Soft fabric upholstery with a comfortable seat, ideal for a small living room or study.",
    images: [
      "https://images.unsplash.com/photo-1484101403633-562f891dc89a?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80"
    ],
    createdAt: "2026-06-18"
  },
  {
    id: "2",
    status: "available",
    title: "iPad Air 5 64GB",
    price: 2799,
    category: "Electronics",
    condition: "Excellent",
    location: "Hangzhou · West Lake",
    description: "Clean condition, fully functional, comes with original charger and protective case.",
    images: [
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1518441902117-f0a22d0bf77f?auto=format&fit=crop&w=1200&q=80"
    ],
    createdAt: "2026-06-17"
  },
  {
    id: "3",
    status: "available",
    title: "Wood Dining Set",
    price: 1200,
    category: "Furniture",
    condition: "Minor wear",
    location: "Shenzhen · Nanshan",
    description: "Includes one table and four chairs. Stable and durable, suitable for everyday home use.",
    images: [
      "https://images.unsplash.com/photo-1444418776041-9c7e33cc5a9c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80"
    ],
    createdAt: "2026-06-16"
  }
];
