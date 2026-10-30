"use server";

import { createHash, randomBytes, randomUUID } from "node:crypto";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

export type InvoiceActionResult = { ok: boolean; link?: string; invoiceNumber?: string; error?: string };

export async function createInvoice(formData: FormData): Promise<InvoiceActionResult> {
  const session = await createClient();
  const { data: { user } } = await session.auth.getUser();
  if (!user) return { ok: false, error: "Please sign in again." };
  const { data: profile } = await session.from("profiles").select("role").eq("id", user.id).maybeSingle();
  if (profile?.role !== "admin") return { ok: false, error: "Administrator access is required." };

  const name = String(formData.get("customer_name") || "").trim().slice(0, 160);
  const email = String(formData.get("customer_email") || "").trim().toLowerCase();
  const company = String(formData.get("company_name") || "").trim().slice(0, 180);
  const description = String(formData.get("description") || "").trim().slice(0, 500);
  const currency = String(formData.get("currency") || "KES");
  const amountText = String(formData.get("amount") || "").trim();
  const dueDate = String(formData.get("due_at") || "").trim();
  const parsedDueDate = dueDate ? new Date(`${dueDate}T23:59:59.000Z`) : null;
  const amountMajor = Number(amountText);
  if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !description || !["KES", "USD"].includes(currency) || !Number.isFinite(amountMajor) || amountMajor <= 0 || amountMajor > 100000000 || (parsedDueDate && Number.isNaN(parsedDueDate.getTime()))) {
    return { ok: false, error: "Check the customer, description, currency and amount." };
  }
  const amount = Math.round(amountMajor * 100);
  if (!Number.isSafeInteger(amount) || amount <= 0) return { ok: false, error: "Enter a valid amount." };

  const admin = createAdminClient();
  let { data: customer } = await admin.from("customers").select("id").eq("email", email).maybeSingle();
  if (!customer) {
    const { data, error } = await admin.from("customers").insert({ name, email, company_name: company || null }).select("id").single();
    if (error || !data) return { ok: false, error: "Could not create the customer record." };
    customer = data;
  } else {
    await admin.from("customers").update({ name, company_name: company || null, updated_at: new Date().toISOString() }).eq("id", customer.id);
  }

  const token = randomBytes(32).toString("hex");
  const invoiceNumber = `BUR-${new Date().getUTCFullYear()}-${randomUUID().slice(0, 8).toUpperCase()}`;
  const { data: invoice, error: invoiceError } = await admin.from("invoices").insert({
    customer_id: customer.id,
    invoice_number: invoiceNumber,
    public_token_hash: createHash("sha256").update(token).digest("hex"),
    currency,
    subtotal_amount: amount,
    total_amount: amount,
    status: "sent",
    description,
    due_at: parsedDueDate ? parsedDueDate.toISOString() : null,
    sent_at: new Date().toISOString(),
  }).select("id").single();
  if (invoiceError || !invoice) return { ok: false, error: "Could not create the invoice." };

  const { error: itemError } = await admin.from("invoice_items").insert({
    invoice_id: invoice.id, description, quantity: 1, unit_amount: amount,
  });
  if (itemError) {
    await admin.from("invoices").delete().eq("id", invoice.id);
    return { ok: false, error: "Could not add the invoice line item." };
  }
  revalidatePath("/admin/payments");
  const base = (process.env.NEXT_PUBLIC_SITE_URL || "https://burifylabs.com").replace(/\/$/, "");
  return { ok: true, invoiceNumber, link: `${base}/invoice/${token}` };
}
