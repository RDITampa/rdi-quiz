(() => {
const EPS = window.EPISODES, DB = window.getBackend(), CFG = window.RDI_CONFIG || {};
const NAME = { R: "Republican", D: "Democrat", I: "Independent" };
const $ = s => document.querySelector(s), app = $("#app");
const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const ep = id => EPS.find(e => e.id === id);
let user = localStorage.getItem("rdi_user") || "";
let quiz = null; // {epId, idx, answers[]}

// Scoring exactly as the videos explain it.
function score(e, answers) {
  const parties = answers.map((a, i) => e.questions[i].key["ABC".indexOf(a)]);
  const counts = { R: 0, D: 0, I: 0 }; parties.forEach(p => counts[p]++);
  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  const [top, n] = sorted[0], tie = sorted[1][1] === n;
  let label, kind;
  if (tie || n <= 4) { kind = "Mixed"; label = "Mixed" + (tie ? ` (${NAME[sorted[0][0]]}/${NAME[sorted[1][0]]} tie)` : ""); }
  else if (n >= 7) { kind = "Strong"; label = "Strong " + NAME[top]; }
  else { kind = "Lean"; label = "Lean " + NAME[top]; }
  return { parties, counts, label, kind, top: kind === "Mixed" ? null : top };
}
const bars = (c, total) => ["R", "D", "I"].map(p => {
  const pct = total ? Math.round(100 * c[p] / total) : 0;
  return `<div class="bar"><span class="lab ${p.toLowerCase()}">${NAME[p]}</span><span class="tr"><i style="width:${pct}%;background:var(--${p})"></i></span><span class="n">${c[p]} · ${pct}%</span></div>`;
}).join("");

function nav() { document.querySelectorAll("nav a").forEach(a => a.classList.toggle("on", location.hash.startsWith(a.getAttribute("href")))); }

const views = {
  home() {
    app.innerHTML = `<div class="tiles"><div class="tile R">R</div><div class="tile D">D</div><div class="tile I">I</div></div>
    <h1>Republican, Democrat, or Independent?</h1>
    <p class="muted">Play along with each episode: tap your answers instead of writing them on paper. We'll add them up for you.</p>
    <div class="card"><label for="u"><b>Pick a username</b></label>
    <p class="muted small">Use the same one every week to keep your history. No email or real name needed.</p>
    <input id="u" type="text" maxlength="24" autocomplete="off" autocapitalize="off" placeholder="e.g. tampa_voter" value="${esc(user)}">
    <div class="err" id="e"></div><button class="btn" id="go">Continue</button></div>
    ${matchMedia("(display-mode: standalone)").matches || navigator.standalone ? "" : `<div class="card small" id="inst"><b>Add to your home screen</b><br>
    <span class="muted">iPhone/iPad (Safari): tap Share, then "Add to Home Screen". Android (Chrome): tap ⋮, then "Install app". Computer (Chrome/Edge): click the install icon in the address bar.</span>
    <button class="btn ghost" id="instbtn" hidden>Install app</button></div>`}`;
    if (window._bip && $("#instbtn")) { $("#instbtn").hidden = false; $("#instbtn").onclick = () => window._bip.prompt(); }
    const go = () => {
      const v = $("#u").value.trim();
      if (!/^[A-Za-z0-9_.-]{2,24}$/.test(v)) { $("#e").textContent = "2–24 letters, numbers, _ . or -"; return; }
      user = v.toLowerCase(); localStorage.setItem("rdi_user", user); location.hash = "#/episodes";
    };
    $("#go").onclick = go; $("#u").onkeydown = ev => { if (ev.key === "Enter") go(); };
  },
  async episodes() {
    if (!user) return (location.hash = "#/");
    const hist = await DB.getHistory(user), done = Object.fromEntries(hist.map(h => [h.episode, h]));
    app.innerHTML = `<p class="muted small">Playing as <b>${esc(user)}</b> · <a href="#/" >change</a></p><h1>Pick your episode</h1>` +
      [...EPS].reverse().map(e => `<a class="card ep" href="#/quiz/${e.id}"><span class="tag">${done[e.id] ? "✓ " + esc(done[e.id].label) : e.questions.length + " questions"}</span>
      <span class="muted small">EPISODE ${e.number}</span><br><b>${esc(e.title)}</b><br><span class="muted small">${esc(e.short)}</span></a>`).join("");
  },
  quiz(id) {
    const e = ep(id); if (!e) return (location.hash = "#/episodes"); if (!user) return (location.hash = "#/");
    if (!quiz || quiz.epId !== id) quiz = { epId: id, idx: 0, answers: [] };
    const q = e.questions[quiz.idx], sel = quiz.answers[quiz.idx], last = quiz.idx === e.questions.length - 1;
    app.innerHTML = `<div class="qmeta">Episode ${e.number} · Q${q.n} of ${e.questions.length} · ${esc(q.topic)}</div>
      <div class="prog"><i style="width:${100 * quiz.idx / e.questions.length}%"></i></div>
      <div class="stem">${esc(q.stem)}</div>
      ${q.choices.map((c, i) => { const L = "ABC"[i]; return `<button class="choice ${sel === L ? "sel" : ""}" data-l="${L}"><span class="L">${L}</span><span>${esc(c)}</span></button>`; }).join("")}
      <div class="row"><button class="btn ghost" id="back" ${quiz.idx ? "" : "disabled"}>Back</button>
      <button class="btn" id="next" ${sel ? "" : "disabled"}>${last ? "See my result" : "Next"}</button></div>
      <p class="muted small">Pick the closest answer. Not perfect, just closest. Letters are shuffled.</p>`;
    app.querySelectorAll(".choice").forEach(b => b.onclick = () => { quiz.answers[quiz.idx] = b.dataset.l; views.quiz(id); });
    $("#back").onclick = () => { quiz.idx--; views.quiz(id); };
    $("#next").onclick = async () => {
      if (!last) { quiz.idx++; window.scrollTo(0, 0); return views.quiz(id); }
      const s = score(e, quiz.answers);
      $("#next").disabled = true;
      try { await DB.saveResult({ username: user, episode: id, answers: quiz.answers, parties: s.parties, counts: s.counts, label: s.label, ts: Date.now() }); }
      catch (err) { alert("Couldn't save your result. Check your connection and try again."); $("#next").disabled = false; return; }
      quiz = null; location.hash = "#/result/" + id;
    };
    window.scrollTo(0, 0);
  },
  async result(id) {
    const e = ep(id), r = (await DB.getHistory(user)).find(h => h.episode === id);
    if (!e || !r) return (location.hash = "#/episodes");
    const s = score(e, r.answers);
    const color = s.top ? `var(--${s.top})` : "var(--hil)";
    app.innerHTML = `<div class="qmeta">Episode ${e.number} result · ${esc(user)}</div>
      <div class="card" style="border-color:${color}"><div class="muted small">Your result</div><div class="big" style="color:${color}">${esc(s.label)}</div>
      ${bars(s.counts, e.questions.length)}
      <p class="muted small">7+ of one letter = Strong · 5–6 = Lean · no letter above 4, or a tie = Mixed. Mixed is common, and every result is a legit place to be.</p></div>
      <h2>Your answers, with the key</h2><div class="card keygrid">${e.questions.map((q, i) =>
        `<b>${q.n}</b><span>${esc(q.topic)}: <b>${r.answers[i]}</b></span><span class="pill ${s.parties[i]}">${s.parties[i]}</span>`).join("")}</div>
      <a class="btn" href="#/history">See my history</a><a class="btn ghost" href="#/quiz/${id}" id="retake">Retake</a>
      <p class="muted small">Now vote in the channel poll (link in the pinned comment) and tell us which question was hardest!</p>`;
    $("#retake").onclick = () => { quiz = null; };
  },
  async history() {
    if (!user) return (location.hash = "#/");
    const h = await DB.getHistory(user);
    const tot = { R: 0, D: 0, I: 0 }; h.forEach(r => ["R", "D", "I"].forEach(p => tot[p] += r.counts[p]));
    const n = tot.R + tot.D + tot.I;
    app.innerHTML = `<h1>${esc(user)}'s history</h1>` + (h.length ? `
      <div class="card"><div class="muted small">All episodes combined (${h.length} quiz${h.length > 1 ? "zes" : ""}, ${n} answers)</div>${bars(tot, n)}</div>
      <table><tr><th>Episode</th><th>Result</th><th>R·D·I</th></tr>${h.map(r => { const e = ep(r.episode);
        return `<tr><td><a href="#/result/${r.episode}">Ep ${e ? e.number : "?"}</a><div class="muted small">${new Date(r.ts).toLocaleDateString()}</div></td><td>${esc(r.label)}</td><td>${r.counts.R}·${r.counts.D}·${r.counts.I}</td></tr>`; }).join("")}</table>`
      : `<p class="muted">No quizzes yet.</p>`) + `<a class="btn" href="#/episodes">Take a quiz</a>`;
  },
  async results(id) {
    if (CFG.resultsPin && sessionStorage.getItem("rdi_pin") !== CFG.resultsPin) {
      app.innerHTML = `<h1>Results</h1><input id="p" type="password" placeholder="PIN"><button class="btn" id="ok">Open</button>`;
      $("#ok").onclick = () => { sessionStorage.setItem("rdi_pin", $("#p").value); views.results(id); }; return;
    }
    const e = ep(id) || EPS[EPS.length - 1], all = await DB.getAllResults(e.id), N = all.length;
    const lab = { R: 0, D: 0, I: 0, M: 0 };
    all.forEach(r => { const s = score(e, r.answers); s.top ? lab[s.top]++ : lab.M++; });
    const pct = x => N ? Math.round(100 * x / N) + "%" : "0%";
    const quote = `Episode ${e.number}: ${N} players. ${pct(lab.R)} Republican, ${pct(lab.D)} Democrat, ${pct(lab.I)} Independent` + (lab.M ? `, ${pct(lab.M)} mixed.` : ".");
    app.innerHTML = `<h1>Poll results</h1><select id="s">${EPS.map(x => `<option value="${x.id}" ${x.id === e.id ? "selected" : ""}>Episode ${x.number}: ${esc(x.title)}</option>`).join("")}</select>
      <div class="card"><div class="muted small">Overall result · ${N} player${N === 1 ? "" : "s"}</div>${bars({ R: lab.R, D: lab.D, I: lab.I }, N)}
      <div class="bar"><span class="lab">Mixed</span><span class="tr"><i style="width:${N ? 100 * lab.M / N : 0}%;background:var(--hil)"></i></span><span class="n">${lab.M} · ${pct(lab.M)}</span></div>
      <div class="muted small" style="margin-top:8px">For "last week's results":</div><div class="copy">${esc(quote)}</div></div>
      <h2>Per question</h2>${e.questions.map(q => { const c = { A: 0, B: 0, C: 0 }; all.forEach(r => c[r.answers[q.n - 1]]++);
        return `<div class="card"><div class="qmeta">Q${q.n} · ${esc(q.topic)}</div><div style="font-weight:700;margin:4px 0 6px">${esc(q.stem)}</div>${["A", "B", "C"].map((L, i) => {
          const p = q.key[i], w = N ? Math.round(100 * c[L] / N) : 0;
          return `<div class="bar"><span class="lab"><span class="pill ${p}">${L}·${p}</span></span><span class="tr"><i style="width:${w}%;background:var(--${p})"></i></span><span class="n">${c[L]} · ${w}%</span></div>`; }).join("")}</div>`; }).join("")}
      <a class="btn ghost" id="csv" href="#">Download CSV</a>
      <p class="muted small">Storage: ${DB.name === "local" ? "this device only (demo). Switch to Supabase in config.js to collect everyone's answers." : "shared online database"}.</p>`;
    $("#s").onchange = ev => location.hash = "#/results/" + ev.target.value;
    $("#csv").onclick = ev => { ev.preventDefault();
      const rows = [["username", "episode", "date", ...e.questions.map(q => "Q" + q.n), "R", "D", "I", "result"],
        ...all.map(r => [r.username, r.episode, new Date(r.ts).toISOString(), ...r.answers, r.counts.R, r.counts.D, r.counts.I, r.label])];
      const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([rows.map(x => x.map(v => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n")], { type: "text/csv" }));
      a.download = `rdi-${e.id}-results.csv`; a.click(); };
  },
};
function route() {
  const [, v = "", arg] = location.hash.split("/");
  (views[v] || views.home)(arg); nav();
}
window.addEventListener("beforeinstallprompt", ev => { ev.preventDefault(); window._bip = ev; const b = $("#instbtn"); if (b) { b.hidden = false; b.onclick = () => ev.prompt(); } });
window.addEventListener("hashchange", route); route();
})();
