import { defaultUrl } from "@/lib/utils";
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

export async function getAccessToken(): Promise<string> {
  const credentials = btoa(
    `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET}`
  );

  const response = await fetch(
    "https://api-m.sandbox.paypal.com/v1/oauth2/token",
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${credentials}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "client_credentials",
      }),
      cache: "no-store",
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Error ${response.status}: ${errorText}`);
  }

  const data = await response.json();
  console.log("Access Token:", data.access_token);
  return data.access_token;
}

export async function createPartnerReferral() {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    return null;
  }
  const accessToken = await getAccessToken();

  const response = await fetch(
    "https://api-m.sandbox.paypal.com/v2/customer/partner-referrals",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`, // Make sure this is valid
      },
      body: JSON.stringify({
        tracking_id: userData.user.id, // Replace with your actual tracking ID
        partner_config_override: {
          return_url: `${defaultUrl}/onboarding`,
          return_url_description:
            "the url to return the merchant after the paypal onboarding process.",
        },
        operations: [
          {
            operation: "API_INTEGRATION",
            api_integration_preference: {
              rest_api_integration: {
                integration_method: "PAYPAL",
                integration_type: "THIRD_PARTY",
                third_party_details: {
                  features: ["PAYMENT", "REFUND"],
                },
              },
            },
          },
        ],
        products: ["EXPRESS_CHECKOUT"],
        legal_consents: [
          {
            type: "SHARE_DATA_CONSENT",
            granted: true,
          },
        ],
      }),
    }
  );

  // const response = await fetch(
  //   "https://api-m.sandbox.paypal.com/v2/customer/partner-referrals",
  //   {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: `Bearer ${accessToken}`,
  //     },
  //     body: JSON.stringify({
  //       tracking_id: userData.user.id,
  //       partner_config_override: {
  //         return_url: `${defaultUrl}/onboarding`,
  //         return_url_description:
  //           "the url to return the merchant after the paypal onboarding process.",
  //       },
  //       operations: [
  //         {
  //           operation: "API_INTEGRATION",
  //           api_integration_preference: {
  //             rest_api_integration: {
  //               integration_method: "PAYPAL",
  //               integration_type: "THIRD_PARTY",
  //               third_party_details: {
  //                 features: ["PAYMENT", "REFUND"],
  //               },
  //             },
  //           },
  //         },
  //       ],
  //       products: ["EXPRESS_CHECKOUT"],
  //       legal_consents: [
  //         {
  //           type: "SHARE_DATA_CONSENT",
  //           granted: true,
  //         },
  //       ],
  //     }),
  //   }
  // );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Error ${response.status}: ${errorText}`);
  }

  const data = await response.json();
  return data;
}
