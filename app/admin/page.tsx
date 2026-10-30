import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { signOut, updateLeadStatus, updateContactStatus, inviteDashboardUser, removeDashboardUser } from "./actions";
import { createAdminClient } from "@/lib/supabase/admin";

export const metadata = { title: "Admin dashboard | Burify Labs", robots: { index: false, follow: false } };

export default async function AdminDashboard({ searchParams }: { searchParams: Promise<{ error?: string; updated?: string; contactUpdated?: string; userAdded?: string; userRemoved?: string; usersError?: string }> }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
  if (profile?.role !== "admin") { await supabase.auth.signOut(); redirect("/admin/login?error=unauthorized"); }

  const admin = createAdminClient();
  const [leadResult, contactResult, projectResult, postResult, serviceResult, userResult, profileResult, params] = await Promise.all([
    supabase.from("leads").select("id,full_name,email,company,industry,source,status,next_follow_up_at,created_at", { count: "exact" }).order("created_at", { ascending: false }).limit(50),
    supabase.from("contact_submissions").select("id,name,email,company,service_interest,message,status,created_at", { count: "exact" }).order("created_at", { ascending: false }).limit(8),
    supabase.from("projects").select("id", { count: "exact", head: true }),
    supabase.from("blog_posts").select("id", { count: "exact", head: true }),
    supabase.from("services").select("id", { count: "exact", head: true }),
    searchParams
  ]);
  const leads = leadResult.data ?? [];
  const contacts = contactResult.data ?? [];\n  const profiles = new Map((profileResult.data ?? []).map(profile => [profile.id, profile]));\n  const users = (userResult.data?.users ?? []).map(authUser => ({ ...authUser, profile: profiles.get(authUser.id) }));
  const date = (value: string | null) => value ? new Date(value).toLocaleDateString() : "—";

  return <main className="admin-shell">
    <aside className="admin-sidebar">
      <a className="admin-brand" href="/">BURIFY<span>LABS</span></a>
      <p className="admin-side-label">WORKSPACE</p>
      <a className="admin-nav active" href="/admin">Overview</a>
      <a className="admin-nav" href="#leads">Lead pipeline</a>
      <a className="admin-nav" href="#contacts">Contact inbox</a>\n      <a className="admin-nav" href="#users">User management</a>
      <div className="admin-sidebar-bottom"><span className="admin-avatar">{(user.email?.[0] ?? "A").toUpperCase()}</span><div><strong>Administrator</strong><small>{user.email}</small></div></div>
    </aside>
    <section className="admin-main">
      <header className="admin-topbar"><div><p className="admin-eyebrow">BURIFY / WORKSPACE</p><h1>Overview</h1></div><form action={signOut}><button className="admin-logout" type="submit">Sign out</button></form></header>
      {params.error && <p className="admin-error">The update failed. Check the status and database permissions.</p>}
      {params.updated && <p className="admin-success">Lead status updated.</p>}{params.contactUpdated && <p className="admin-success">Contact enquiry status updated.</p>}\n      {params.userAdded && <p className="admin-success">Invitation sent and user added.</p>}\n      {params.userRemoved && <p className="admin-success">User removed.</p>}\n      {params.usersError && <p className="admin-error">{({invalid:"Enter a valid name, email and role.", "invite-failed":"Could not send invitation. The email may already be registered.", "profile-failed":"Invitation created, but profile setup failed; the invited account was rolled back.", "invalid-removal":"You cannot remove your own administrator account.", "user-not-found":"That user could not be found.", "last-admin":"The last administrator cannot be removed.", "remove-failed":"Could not remove this account."} as Record<string,string>)[params.usersError] ?? "User management action failed."}</p>}
      <section className="admin-welcome"><div><p className="admin-eyebrow">BUSINESS OVERVIEW</p><h2>Welcome back.</h2><p>Manage enquiries, leads and content from one place.</p></div><span className="admin-live">● Authenticated admin</span></section>
      <div className="admin-stats">
        <article className="admin-stat"><span>Total leads</span><strong>{leadResult.count ?? leads.length}</strong><small>Latest 50 displayed below</small></article>
        <article className="admin-stat"><span>New leads</span><strong>{leads.filter(x => x.status === "new").length}</strong><small>Among latest 50</small></article>
        <article className="admin-stat"><span>Contact enquiries</span><strong>{contactResult.count ?? contacts.length}</strong><small>Latest 8 displayed below</small></article>
        <article className="admin-stat"><span>Projects / posts</span><strong>{projectResult.count ?? 0} / {postResult.count ?? 0}</strong><small>{serviceResult.count ?? 0} services configured</small></article>
      </div>
      <section id="leads" className="admin-panel">
        <div className="admin-panel-heading"><div><p className="admin-eyebrow">SALES PIPELINE</p><h2>Recent leads</h2></div><span className="admin-count">{leads.length} records</span></div>
        {leadResult.error ? <p className="admin-muted">Could not load leads. Check Supabase RLS and column names.</p> : leads.length === 0 ? <div className="admin-empty"><strong>No leads yet</strong><p>New records will appear when leads are added to Supabase.</p></div> :
        <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Lead</th><th>Industry</th><th>Source</th><th>Created</th><th>Status</th><th>Update</th></tr></thead><tbody>
        {leads.map(lead => <tr key={lead.id}><td><strong>{lead.full_name}</strong><small>{lead.email}{lead.company ? " · " + lead.company : ""}</small></td><td>{lead.industry || "—"}</td><td>{lead.source}</td><td>{date(lead.created_at)}</td><td><span className={"admin-status status-" + lead.status}>{lead.status}</span></td><td><form action={updateLeadStatus} className="admin-status-form"><input type="hidden" name="id" value={lead.id}/><select name="status" defaultValue={lead.status} aria-label={"Status for " + lead.full_name}><option value="new">New</option><option value="contacted">Contacted</option><option value="qualified">Qualified</option><option value="proposal">Proposal</option><option value="won">Won</option><option value="lost">Lost</option><option value="nurture">Nurture</option></select><button type="submit">Save</button></form></td></tr>)}
        </tbody></table></div>}
      </section>
      <section id="contacts" className="admin-panel admin-contact-panel">
        <div className="admin-panel-heading"><div><p className="admin-eyebrow">WEBSITE INBOX</p><h2>Recent contact enquiries</h2></div><span className="admin-count">{contacts.length} shown</span></div>
        {contactResult.error ? <p className="admin-muted">Unable to read contact submissions. Check the contact admin RLS policy.</p> : contacts.length === 0 ? <div className="admin-empty"><strong>Your inbox is clear</strong><p>Website contact submissions will show up here when stored in this table.</p></div> :
        <div className="admin-contact-list">{contacts.map(item => <article className="admin-contact-item" key={item.id}><div><strong>{item.name}</strong><small>{item.email}{item.company ? " · " + item.company : ""}</small></div><span className="admin-status">{item.status}</span><p>{item.service_interest || "General enquiry"} · {date(item.created_at)}</p><form action={updateContactStatus} className="admin-status-form"><input type="hidden" name="id" value={item.id}/><select name="status" defaultValue={item.status} aria-label={"Status for enquiry from " + item.name}><option value="new">New</option><option value="read">Read</option><option value="replied">Replied</option><option value="archived">Archived</option><option value="spam">Spam</option></select><button type="submit">Save status</button></form><details><summary>Read message</summary><p>{item.message}</p></details></article>)}</div>}
      </section>
      <section className="admin-content-note"><div><p className="admin-eyebrow">CONTENT & DELIVERY</p><h2>Content overview</h2><p>Project, service and blog counts are connected to the verified database schema. Full editing screens can be added as a next step.</p></div><a href="https://supabase.com/dashboard/project/fsgmowsvwwtjmvmyaijj" target="_blank" rel="noreferrer">Open Supabase ↗</a></section>

      <section id="users" className="admin-panel admin-users-panel">
        <div className="admin-panel-heading"><div><p className="admin-eyebrow">ACCESS CONTROL</p><h2>Users & permissions</h2></div><span className="admin-count">{users.length} accounts shown</span></div>
        <form action={inviteDashboardUser} className="admin-user-invite">
          <label>Full name<input name="full_name" type="text" required maxLength={120} placeholder="Team member name"/></label>
          <label>Email address<input name="email" type="email" required placeholder="name@company.com"/></label>
          <label>Role<select name="role" defaultValue="member"><option value="member">Member</option><option value="admin">Administrator</option></select></label>
          <button type="submit">Invite user</button>
          <p>Invitations are sent by email. Members cannot access administrator-only tools.</p>
        </form>
        {userResult.error || profileResult.error ? <p className="admin-muted">Could not load user accounts. Check the server secret key and profiles permissions.</p> : users.length === 0 ? <div className="admin-empty"><strong>No user accounts found</strong></div> :
          <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>User</th><th>Role</th><th>Joined</th><th>Action</th></tr></thead><tbody>
            {users.map(item => <tr key={item.id}><td><strong>{item.profile?.full_name || item.user_metadata?.full_name || "Unnamed user"}</strong><small>{item.email || "No email"}{item.id === user.id ? " · You" : ""}</small></td><td><span className="admin-status">{item.profile?.role || "No profile"}</span></td><td>{date(item.created_at)}</td><td>{item.id === user.id ? <span className="admin-muted">Current account</span> : <form action={removeDashboardUser}><input type="hidden" name="user_id" value={item.id}/><button className="admin-danger-button" type="submit">Remove</button></form>}</td></tr>)}
          </tbody></table></div>}
        {userResult.data?.users && userResult.data.users.length >= 100 && <p className="admin-muted">Showing the first 100 accounts.</p>}
      </section>
      <footer className="admin-footer">Burify Labs · Private administrator workspace</footer>
    </section>
  </main>;
}
