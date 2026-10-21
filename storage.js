// Swappable storage. Every backend implements:
//   saveResult(rec) -> Promise   rec = {username, episode, answers:[A|B|C...], parties:[R|D|I...], counts:{R,D,I}, label, ts}
//   getHistory(username) -> Promise<rec[]>
//   getAllResults(episodeId?) -> Promise<rec[]>
// Choose backend in config.js (window.RDI_CONFIG.backend = "local" | "supabase").

const LocalBackend = {
  name: "local",
  _all() { try { return JSON.parse(localStorage.getItem("rdi_results") || "[]"); } catch { return []; } },
  async saveResult(rec) {
    const all = this._all().filter(r => !(r.username === rec.username && r.episode === rec.episode));
    all.push(rec); localStorage.setItem("rdi_results", JSON.stringify(all));
  },
  async getHistory(u) { return this._all().filter(r => r.username === u).sort((a, b) => a.ts - b.ts); },
  async getAllResults(ep) { return this._all().filter(r => !ep || r.episode === ep); },
};

// Supabase free tier via its REST API (no SDK needed). Run supabase-setup.sql first.
// One row per (username, episode); retaking an episode overwrites the earlier answers.
function SupabaseBackend(url, anonKey) {
  const h = { apikey: anonKey, Authorization: "Bearer " + anonKey, "Content-Type": "application/json" };
  const base = url.replace(/\/$/, "") + "/rest/v1/results";
  const fromRow = r => ({ username: r.username, episode: r.episode, answers: r.answers, parties: r.parties,
    counts: r.counts, label: r.label, ts: Date.parse(r.created_at) });
  return {
    name: "supabase",
    async saveResult(rec) {
      const res = await fetch(base + "?on_conflict=username,episode", {
        method: "POST", headers: { ...h, Prefer: "resolution=merge-duplicates" },
        body: JSON.stringify({ username: rec.username, episode: rec.episode, answers: rec.answers,
          parties: rec.parties, counts: rec.counts, label: rec.label, created_at: new Date(rec.ts).toISOString() }) });
      if (!res.ok) throw new Error("Save failed: " + res.status);
    },
    async getHistory(u) {
      const res = await fetch(base + "?username=eq." + encodeURIComponent(u) + "&order=created_at", { headers: h });
      return (await res.json()).map(fromRow);
    },
    async getAllResults(ep) {
      const res = await fetch(base + "?select=*" + (ep ? "&episode=eq." + encodeURIComponent(ep) : ""), { headers: h });
      return (await res.json()).map(fromRow);
    },
  };
}

window.getBackend = function () {
  const c = window.RDI_CONFIG || {};
  if (c.backend === "supabase" && c.supabaseUrl && c.supabaseAnonKey) return SupabaseBackend(c.supabaseUrl, c.supabaseAnonKey);
  return LocalBackend;
};
