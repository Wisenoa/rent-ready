import { NextResponse } from "next/server";
import { getRequiredServerEnvVar } from "@/lib/config/env";
import Stripe from "stripe";

const stripe = new Stripe(getRequiredServerEnvVar("STRIPE_SECRET_KEY"), {
  apiVersion: "2025-04-30.basil",
});

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const monthlyPriceId = getRequiredServerEnvVar("STRIPE_PRO_MONTHLY_PRICE_ID");
    const annualPriceId = getRequiredServerEnvVar("STRIPE_PRO_ANNUAL_PRICE_ID");

    const [monthlyPrice, annualPrice] = await Promise.all([
      stripe.prices.retrieve(monthlyPriceId, {
        expand: ["product", "currency_options"],
      }),
      stripe.prices.retrieve(annualPriceId, {
        expand: ["product", "currency_options"],
      }),
    ]);

    const product = monthlyPrice.product as Stripe.Product;

    const plans = [
      {
        id: "pro_monthly",
        label: "Mensuel",
        interval: "month" as const,
        priceId: monthlyPriceId,
        amount: monthlyPrice.unit_amount ?? 0,
        currency: monthlyPrice.currency,
        trialDays: 14,
        pricePerMonth: monthlyPrice.unit_amount ?? 0,
        total: monthlyPrice.unit_amount ?? 0,
        annualEquivalent: null,
      },
      {
        id: "pro_annual",
        label: "Annuel",
        interval: "year" as const,
        priceId: annualPriceId,
        amount: annualPrice.unit_amount ?? 0,
        currency: annualPrice.currency,
        trialDays: 14,
        pricePerMonth: Math.round((annualPrice.unit_amount ?? 0) / 12),
        total: annualPrice.unit_amount ?? 0,
        annualEquivalent: monthlyPrice.unit_amount
          ? Math.round(((annualPrice.unit_amount ?? 0) / 12 / (monthlyPrice.unit_amount ?? 1)) * 100 - 100)
          : null,
      },
    ];

    return NextResponse.json({
      product: {
        id: product.id,
        name: product.name,
        description: product.description,
      },
      plans,
    });
  } catch (err) {
    console.error("[Stripe] Failed to fetch plans:", err);
    return NextResponse.json(
      { error: "Impossible de charger les plans tarifaires." },
      { status: 500 }
    );
  }
}
