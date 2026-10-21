// Switch to the free hosted backend by filling these in (see README.md).
window.RDI_CONFIG = {
  backend: "local",          // "local" (this device only) or "supabase"
  supabaseUrl: "",           // e.g. "https://abcd1234.supabase.co"
  supabaseAnonKey: "",       // the public "anon" key (safe to publish; table is protected by RLS)
  resultsPin: "",            // optional: if set, the Results page asks for this PIN (light deterrent only)
};
