import type { Metadata } from "next";
import "../../admin/admin.css";
import "../../admin/growth/growth.css";
import { portalSignIn } from "../actions";
export const metadata: Metadata = { title: "Client portal sign in | Burify", robots: { index:false, follow:false } };
export default async function PortalLogin({searchParams}:{searchParams:Promise<{error?:string}>}) {
 const {error}=await searchParams;
 const message=error==="invalid"?"Email or password is incorrect.":error==="not-linked"?"This account has not been invited to a Burify client workspace.":error==="missing"?"Enter your email and password.":"";
 return <main className="admin-login-shell"><form action={portalSignIn} className="admin-login-card">
  <a className="admin-brand" href="/">BURIFY<span>LABS</span></a><p className="admin-eyebrow">CLIENT WORKSPACE</p><h1>Client portal</h1><p className="admin-muted">Sign in to view your project progress, proposals and monthly performance reports.</p>
  {message?<p className="admin-error" role="alert">{message}</p>:null}
  <label htmlFor="email">Email address</label><input id="email" name="email" type="email" autoComplete="username" required/>
  <label htmlFor="password">Password</label><input id="password" name="password" type="password" autoComplete="current-password" required/>
  <button className="admin-primary" type="submit">Sign in</button><a className="admin-back" href="/">← Back to Burify</a>
 </form></main>;
}