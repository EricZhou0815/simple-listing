import Header from "@/components/header";
import { ItemDetailView } from "@/components/item-detail-view";
import { readItems } from "@/lib/storage";

export default async function ItemDetailPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = (await readItems()).find((v) => v.id === id);
  const messengerUrl = process.env.SELLER_MESSENGER_URL ?? "";

  return (
    <main>
      <Header />
      {item ? (
        <ItemDetailView item={item} messengerUrl={messengerUrl} />
      ) : (
        <div className="mx-auto max-w-6xl px-4 py-16">Listing not found.</div>
      )}
    </main>
  );
}
