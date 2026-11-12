export default function SetupNeeded() {
  return <section className="gw-card gw-setup">
    <p className="gw-kicker">ONE-TIME SETUP</p>
    <h2>The growth engine database isn’t set up yet</h2>
    <p>Apply the migration <code>supabase/migrations/20261112090000_growth_engine.sql</code> to your Supabase project. It adds the plan, scorecard and outreach tables, all locked to administrators. Then refresh this page.</p>
  </section>;
}
