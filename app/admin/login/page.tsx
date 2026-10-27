import { signIn } from "../actions";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export const metadata = { title: "Admin sign in | Burify Labs", robots: { index: false, follow: false } };

export default async function AdminLogin({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
    if (profile?.role === "admin") redirect("/admin");
  }
  const { error } = await searchParams;
  const message = error === "invalid" ? "Email or password is incorrect."
    : error === "unauthorized" ? "This account does not have administrator access."
    : error === "missing" ? "Enter your email and password." : "";
  return (
    <main className="admin-login-shell">
      <form action={signIn} className="admin-login-card">
        <a className="admin-brand" href="/">BURIFY<span>LABS</span></a>
        <p className="admin-eyebrow">SECURE WORKSPACE</p>
        <h1>Admin sign in</h1>
        <p className="admin-muted">Sign in with your authorized administrator account.</p>
        {message && <p className="admin-error" role="alert">{message}</p>}
        <label htmlFor="email">Email address</label>
        <input id="email" name="email" type="email" autoComplete="username" required />
        <label htmlFor="password">Password</label>
        <input id="password" name="password" type="password" autoComplete="current-password" required />
        <button className="admin-primary" type="submit">Sign in securely</button>
        <a className="admin-back" href="/">← Back to website</a>
      </form>
    </main>
  );
}
