// Switch to the free hosted backend by filling these in (see README.md).
window.RDI_CONFIG = {
  backend: "supabase",        // "local" (this device only) or "supabase"
  supabaseUrl: "https://vwepvybfpoftwbivkaet.supabase.co",           // e.g. "https://abcd1234.supabase.co"
  supabaseAnonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ3ZXB2eWJmcG9mdHdiaXZrYWV0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI1NTA1NzUsImV4cCI6MjEwODEyNjU3NX0.GBXzPSfVnRdCkKht_ZN3lVJOFKfD_mZV6lnU1sH3ulE",       // the public "anon" key (safe to publish; table is protected by RLS)
  resultsPin: "",            // optional: if set, the Results page asks for this PIN (light deterrent only)
};
