import { YugiohCardsTable } from "@/components/yugioh-cards-table";
import { findProducts } from "../../serverQueries";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { search } = await searchParams;
  const cards = await findProducts(search ?? "");

  return <YugiohCardsTable cards={cards} />;
}
