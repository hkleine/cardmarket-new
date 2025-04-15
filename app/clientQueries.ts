import { SearchItem } from "@/components/async-search";
import { createClient as createClientClient } from "@/utils/supabase/client";

export async function findSearchProducts(
  query: string
): Promise<Array<SearchItem>> {
  const supabase = await createClientClient();

  const { data, error } = await supabase
    .from("cards")
    .select("*")
    .ilike("name", `%${query}%`)
    .order("name", { ascending: true });

  if (error || !data) {
    console.error("Error fetching products:", error);
    return [];
  }

  return data.map((card) => {
    return {
      imageUrl: card.card_image,
      name: card.name,
      setCode: card.set_code,
      value: card.id.toString(),
      rarity: card.set_rarity_code,
    };
  });
}
