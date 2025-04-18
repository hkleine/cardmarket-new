import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

enum ON_BOARDING_EVENTS {
  MERCHANT_ONBOARDING_COMPLETED = "MERCHANT.ONBOARDING.COMPLETED",
  MERCHANT_ONBOARDING_REVOKED = "MERCHANT.ONBOARDING.REVOKED",
  MERCHANT_ONBOARDING_SELLER_STARTED = "CUSTOMER.MERCHANT-INTEGRATION.SELLER-ONBOARDING-STARTED",
  MERCHANT_ONBOARDING_STARTED = "MERCHANT.ONBOARDING.STARTED",
  MERCHANT_ONBOARDING_APPLICATION_DENIED = "MERCHANT.ONBOARDING.APPLICATION.DENIED",
}

export const POST = async (req: Request) => {
  const supabase = await createClient();

  try {
    const payload = await req.json(); // Parse JSON payload from PayPal
    const { event_type, resource } = payload; // Extract event type and resource from payload

    switch (event_type) {
      case ON_BOARDING_EVENTS.MERCHANT_ONBOARDING_COMPLETED:
        const userId = resource.tracking_id;
        const merchantId = resource.merchant_id;

        const { error } = await supabase
          .from("profiles")
          .update({
            paypal_merchant_id: merchantId,
            paypal_onboarding_state: "Completed",
          })
          .eq("id", userId);

        if (error) {
          throw error;
        }

        break;
      case ON_BOARDING_EVENTS.MERCHANT_ONBOARDING_REVOKED:
        const { error: revokeError } = await supabase
          .from("profiles")
          .update({
            paypal_merchant_id: null,
            paypal_onboarding_state: "Revoked",
          })
          .eq("id", userId);

        if (revokeError) {
          throw revokeError;
        }
        break;
      case ON_BOARDING_EVENTS.MERCHANT_ONBOARDING_APPLICATION_DENIED:
        const { error: deniedError } = await supabase
          .from("profiles")
          .update({
            paypal_onboarding_state: "Failed",
          })
          .eq("id", userId);

        if (deniedError) {
          throw deniedError;
        }
        break;
      case ON_BOARDING_EVENTS.MERCHANT_ONBOARDING_SELLER_STARTED:
      case ON_BOARDING_EVENTS.MERCHANT_ONBOARDING_STARTED:
        const { error: startedError } = await supabase
          .from("profiles")
          .update({ paypal_onboarding_state: "Started" })
          .eq("id", userId);

        if (startedError) {
          throw startedError;
        }
        break;
      default:
        console.log(`Unhandled event type: ${event_type}`);
        break;
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error handling webhook:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
};
