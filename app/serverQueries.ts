import { createClient } from "@/utils/supabase/server";

export async function findProducts(query: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("cards")
    .select("*")
    .ilike("name", `%${query}%`)
    .order("name", { ascending: true });

  if (error || !data) {
    console.error("Error fetching products:", error);
    return [];
  }

  return data;
}

export async function findProduct(id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("cards")
    .select()
    .eq("id", Number(id))
    .single();

  if (error || !data) {
    console.error("Error fetching products:", error);
    return null;
  }

  return data;
}
