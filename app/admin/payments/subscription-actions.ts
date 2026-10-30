"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

export async function createSubscription(formData: FormData): Promise<{ ok: boolean; error?: string }> {
  const session = await createClient();
  const { data: { user } } = await session.auth.getUser();
  if (!user) return { ok: false, error: "Please sign in again." };
  const { data: profile } = await session.from("profiles").select("role").eq("id", user.id).maybeSingle();
  if (profile?.role !== "admin") return { ok: false, error: "Administrator access is required." };

  const name = String(formData.get("customer_name") || "").trim().slice(0, 160);
  const email = String(formData.get("customer_email") || "").trim().toLowerCase();
  const description = String(formData.get("description") || "").trim().slice(0, 500);
  const currency = String(formData.get("currency") || "KES");
  const interval = String(formData.get("interval_unit") || "monthly");
  const amountMajor = Number(String(formData.get("amount") || ""));
  const nextDate = String(formData.get("next_billing_at") || "");
  const nextBilling = nextDate ? new Date(`${nextDate}T00:00:00.000Z`) : null;
  if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !description ||
      !["KES", "USD"].includes(currency) || !["weekly", "monthly", "quarterly", "yearly"].includes(interval) ||
      !Number.isFinite(amountMajor) || amountMajor <= 0 || amountMajor > 100000000 ||
      !nextBilling || Number.isNaN(nextBilling.getTime())) {
    return { ok: false, error: "Check the customer, description, amount, frequency and next billing date." };
  }
  const amount = Math.round(amountMajor * 100);
  if (!Number.isSafeInteger(amount) || amount <= 0) return { ok: false, error: "Enter a valid amount." };

  const admin = createAdminClient();
  let { data: customer } = await admin.from("customers").select("id").eq("email", email).maybeSingle();
  if (!customer) {
    const { data, error } = await admin.from("customers").insert({ name, email }).select("id").single();
    if (error || !data) return { ok: false, error: "Could not create the customer record." };
    customer = data;
  }
  const { error } = await admin.from("subscriptions").insert({
    customer_id: customer.id, description, amount, currency, interval_unit: interval,
    billing_mode: "manual", status: "active", next_billing_at: nextBilling.toISOString(),
  });
  if (error) return { ok: false, error: "Could not create the retainer record." };
  revalidatePath("/admin/payments");
  return { ok: true };
}
