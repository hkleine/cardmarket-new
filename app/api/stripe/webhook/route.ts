import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-03-31.basil",
});

// Turn off body parsing!
export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: Request) {
  const sig = (await headers()).get("stripe-signature")!;
  const rawBody = await req.text(); // raw body as string, NOT parsed!
  const supabase = await createClient();

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error("Webhook signature verification failed.", err.message);
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    );
  }
  console.log("moin", event);

  // Process the event
  switch (event.type) {
    case "account.external_account.created": {
      return NextResponse.json({ status: 200 });
    }
    case "account.updated": {
      const account = event.data.object;
      const userId = account.metadata?.supabase_user_id;
      console.log(userId);
      if (account.charges_enabled && account.payouts_enabled) {
        if (!userId) {
          return NextResponse.json(
            { error: "No user authenticated." },
            { status: 401 }
          );
        }

        const { error } = await supabase
          .from("profiles")
          .update({ stripe_id: event.account, is_vendor: true })
          .eq("user_id", userId);

        if (error) {
          return NextResponse.json(
            { error: `Webhook Error: ${error.message}` },
            { status: 500 }
          );
        }
      }
    }
    case "payment_intent.succeeded": {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      console.log("✅ PaymentIntent was successful!", paymentIntent.id);
      break;
    }
    case "payment_method.attached": {
      const paymentMethod = event.data.object as Stripe.PaymentMethod;
      console.log("✅ PaymentMethod attached!", paymentMethod.id);
      break;
    }
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
