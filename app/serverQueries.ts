import { defaultUrl } from "@/lib/utils";
import { createClient } from "@/utils/supabase/server";
import Stripe from "stripe";

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

export async function createStripeOnboardingLink() {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
    apiVersion: "2025-03-31.basil", // Optional, set the API version you're using
  });

  // 1. Create Express account
  const account = await stripe.accounts.create({
    country: "DE",
    type: "express",
    capabilities: {
      card_payments: {
        requested: true,
      },
      transfers: {
        requested: true,
      },
    },
    business_type: "individual",
    business_profile: {
      mcc: "5691",
      url: "https://someurl.de",
      product_description: "https://example.com",
    },
  });
  // 2. Generate onboarding link
  const accountLink = await stripe.accountLinks.create({
    account: account.id,
    refresh_url: defaultUrl,
    return_url: `${defaultUrl}/onboarding`,
    type: "account_onboarding",
  });

  return accountLink;
}
