var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// src/index.js
var KINDS = ["cookie", "pet", "play"];
var nzDate = /* @__PURE__ */ __name((ms) => new Date(ms).toLocaleDateString("en-CA", { timeZone: "Pacific/Auckland" }), "nzDate");
var BORN = "2026-09-02";
var Counter = class {
  static {
    __name(this, "Counter");
  }
  constructor(state) {
    this.state = state;
  }
  async fetch(request) {
    const u = new URL(request.url), st = this.state.storage, now = Date.now();
    const m = await st.get(["n", "pets", "plays", "last", "lastAt", "days", "pending"]);
    let n = m.get("n") || 0, pets = m.get("pets") || 0, plays = m.get("plays") || 0, last = m.get("last") || 0;
    let lastAt = m.get("lastAt") || {}, days = m.get("days") || {}, pending = m.get("pending") || null;
    if (u.pathname === "/inc") {
      const kind = KINDS.includes(u.searchParams.get("kind")) ? u.searchParams.get("kind") : "cookie";
      if (kind === "cookie") n += 1;
      else if (kind === "pet") pets += 1;
      else plays += 1;
      last = now;
      lastAt = { ...lastAt, [kind]: now };
      const day = nzDate(now);
      days = { ...days, [day]: (days[day] || 0) + 1 };
      for (const k of Object.keys(days).sort().slice(0, -60)) delete days[k];
      pending = { kind, t: now, panel: false, btn: false };
      await st.put({ n, pets, plays, last, lastAt, days, pending });
    }
    let fed = null;
    if (u.pathname === "/take" && pending && typeof pending === "object" && now - pending.t < 6e4) {
      const who = u.searchParams.get("who") === "btn" ? "btn" : "panel", kind = u.searchParams.get("kind");
      if (!pending[who] && (who === "panel" || kind === pending.kind)) {
        fed = pending.kind;
        pending = { ...pending, [who]: true };
        await st.put("pending", pending);
      }
    }
    return Response.json({ n, pets, plays, last, lastAt, days, fed });
  }
};
var NOCACHE = "no-store, no-cache, must-revalidate, max-age=0";
var PROFILE = "https://github.com/Sheldon715";
var BLIP_STATE = null;
function isRealClick(req) {
  const h = req.headers;
  const purpose = (h.get("Sec-Purpose") || h.get("Purpose") || "").toLowerCase();
  if (purpose.includes("prefetch") || purpose.includes("prerender")) return false;
  if (h.get("Sec-Fetch-User") !== "?1") return false;
  if ((h.get("Sec-Fetch-Mode") || "").toLowerCase() !== "navigate") return false;
  const ua = (h.get("User-Agent") || "").toLowerCase();
  if (!ua) return false;
  if (/bot|crawl|spider|slurp|scan|preview|curl|wget|python|go-http|node-fetch|libwww|httpclient|monitor|uptime|headless|facebookexternalhit|slackbot|twitterbot|discordbot|telegrambot|whatsapp|linkedinbot|embedly|camo|github/.test(ua)) return false;
  return true;
}
__name(isRealClick, "isRealClick");
async function counter(stub, op) {
  try {
    const j = await (await stub.fetch("https://do/" + op)).json();
    return j && typeof j === "object" ? j : { n: Number(j) || 0 };
  } catch (e) {
    return { n: 0 };
  }
}
__name(counter, "counter");
async function blipState() {
  if (!BLIP_STATE) return {};
  try {
    const r = await fetch(BLIP_STATE, { cf: { cacheTtl: 30, cacheEverything: true } });
    if (r.ok) return await r.json();
  } catch (e) {
  }
  return {};
}
__name(blipState, "blipState");
var svgResponse = /* @__PURE__ */ __name((body) => new Response(body, { headers: { "Content-Type": "image/svg+xml; charset=utf-8", "Cache-Control": NOCACHE } }), "svgResponse");
var src_default = {
  async fetch(request, env) {
    const url = new URL(request.url);
    const stub = env.COUNTER.get(env.COUNTER.idFromName("cookies-v2"));
    const p = url.pathname.replace(/\/$/, "");
    const ACT = { "/globe/treat": "cookie", "/globe/click": "cookie", "/globe/pet": "pet", "/globe/play": "play" };
    if (ACT[p]) {
      if (isRealClick(request)) await counter(stub, "inc?kind=" + ACT[p]);
      return new Response(null, { status: 302, headers: { Location: PROFILE, "Cache-Control": NOCACHE } });
    }
    if (p === "/globe/blip.svg") {
      const [c, s] = await Promise.all([counter(stub, "take?who=panel"), blipState()]);
      return svgResponse(blipSVG(s, c));
    }
    const b = /^\/globe\/btn-(cookie|pet|play)\.svg$/.exec(p);
    if (b) {
      const [c, s] = await Promise.all([counter(stub, `take?who=btn&kind=${b[1]}`), blipState()]);
      return svgResponse(buttonSVG(b[1], c, s));
    }
    if (p === "/globe/cookie.svg") return svgResponse(cookieSVG((await counter(stub, "get")).n));
    if (p === "/globe/count") {
      const c = await counter(stub, "get");
      return Response.json({ n: c.n || 0, pets: c.pets || 0, plays: c.plays || 0, last: c.last || 0 }, { headers: { "Cache-Control": NOCACHE } });
    }
    return new Response("not found", { status: 404 });
  }
};
var FONT = "'JetBrains Mono','Fira Code','SF Mono',ui-monospace,Menlo,Consolas,monospace";
var CAT_FONT = "'Roboto',sans-serif";
var BG = "#0d1117";
var PANEL = "#010409";
var BORDER = "#30363d";
var GREEN = "#3fb950";
var TXT = "#c9d1d9";
var DIM = "#6e7681";
var YEL = "#d29922";
var PUR = "#bc8cff";
var CAT_COL = "#8292a1";
var PINK = "#ff7b9c";
var BLUE = "#58a6ff";
var TB = 34;
var CAT = "    \u2571|\u3001   \n  (\u02DA\u02CE \u30027  \n   |\u3001\u02DC\u3035  \n  \u3058\u3057\u02CD,)\u30CE";
var esc = /* @__PURE__ */ __name((s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"), "esc");
function windowChrome(W, H, title) {
  const dots = ["#ff5f56", "#ffbd2e", "#27c93f"].map((c, i) => `<circle cx="${22 + i * 20}" cy="18" r="6" fill="${c}"/>`).join("");
  return `<rect x="1" y="1" width="${W - 2}" height="${H - 2}" rx="12" fill="${BG}" stroke="${BORDER}"/><rect x="1" y="1" width="${W - 2}" height="${TB}" rx="12" fill="${PANEL}"/><rect x="1" y="20" width="${W - 2}" height="${TB - 19}" fill="${PANEL}"/>` + dots + `<text x="${W / 2}" y="23" font-size="13" fill="${DIM}" text-anchor="middle">${esc(title)}</text>`;
}
__name(windowChrome, "windowChrome");
function catText(fx, fs, lh) {
  const EYE = "\u02DA", EYE_SCALE = 1.18, EYE_DX = 1, EYE_DY = 8, EYE_TAIL_DX = -1.5;
  return CAT.split("\n").map((l, i) => {
    const dy = i === 0 ? "0" : lh.toFixed(2);
    if (i === 1 && l.includes(EYE)) {
      const k = l.indexOf(EYE), head = l.slice(0, k), tail = l.slice(k + 1);
      return `<tspan fill="${CAT_COL}" x="${fx}" dy="${dy}">${esc(head)}</tspan><tspan fill="${CAT_COL}" font-size="${(fs * EYE_SCALE).toFixed(1)}" dx="${EYE_DX}" dy="${EYE_DY}">${esc(EYE)}</tspan><tspan fill="${CAT_COL}" dx="${EYE_TAIL_DX}" dy="${-EYE_DY}">${esc(tail)}</tspan>`;
    }
    return `<tspan fill="${CAT_COL}" x="${fx}" dy="${dy}">${esc(l)}</tspan>`;
  }).join("");
}
__name(catText, "catText");
function miniCookie(cx, cy, r, id) {
  let seed = 11;
  const rnd = /* @__PURE__ */ __name(() => (seed = (seed * 9301 + 49297) % 233280) / 233280, "rnd");
  const pts = [];
  for (let i = 0; i < 18; i++) {
    const a = i / 18 * Math.PI * 2, rr = r + (rnd() - 0.5) * r * 0.12;
    pts.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr]);
  }
  const body = "M" + pts.map((p) => p[0].toFixed(1) + " " + p[1].toFixed(1)).join("L") + "Z";
  const chips = [[-0.35, -0.3], [0.3, -0.4], [-0.05, 0.1], [0.35, 0.3], [-0.45, 0.25], [0.05, 0.5]].map(([dx, dy]) => `<circle cx="${(cx + dx * r).toFixed(1)}" cy="${(cy + dy * r).toFixed(1)}" r="${(r * 0.14).toFixed(1)}" fill="#3a2210"/>`).join("");
  return `<g mask="url(#${id})"><path d="${body}" fill="url(#dough)" stroke="#7a4a1e" stroke-width="1.2" stroke-linejoin="round"/>${chips}</g>`;
}
__name(miniCookie, "miniCookie");
var DEFS = /* @__PURE__ */ __name((W, H) => `<defs><radialGradient id="dough" cx="38%" cy="32%" r="72%"><stop offset="0" stop-color="#e9bd72"/><stop offset="0.55" stop-color="#cf914a"/><stop offset="1" stop-color="#8e5622"/></radialGradient><mask id="bite1"><rect width="${W}" height="${H}" fill="#fff"/></mask><mask id="bite2"><rect x="-40" y="-40" width="80" height="80" fill="#fff"/></mask></defs>`, "DEFS");
var iconCookie = /* @__PURE__ */ __name((x, y) => miniCookie(x, y, 12, "bite1"), "iconCookie");
var iconHand = /* @__PURE__ */ __name((x, y) => `<path transform="translate(${x - 9} ${y - 10}) scale(0.75)" d="M6 10 V4 a2 2 0 0 1 4 0 v6 M10 10 V2 a2 2 0 0 1 4 0 v8 M14 10 V4 a2 2 0 0 1 4 0 v6 M18 12 V8 a2 2 0 0 1 4 0 v8 c0 6 -4 10 -9 10 h-2 c-3 0 -5 -1 -7 -4 l-4 -6 a2 2 0 0 1 3 -2.5 l3 3" fill="none" stroke="${PINK}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>`, "iconHand");
var iconYarn = /* @__PURE__ */ __name((x, y) => `<circle cx="${x}" cy="${y}" r="11" fill="${BLUE}"/><path d="M${x - 8} ${y - 5} Q${x} ${y} ${x + 8} ${y - 5} M${x - 8} ${y + 5} Q${x} ${y} ${x + 8} ${y + 5} M${x - 5} ${y - 9} Q${x} ${y} ${x - 5} ${y + 9}" stroke="#0d1117" stroke-width="1.5" fill="none"/>`, "iconYarn");
var SPEC = { cookie: ["give a cookie", iconCookie, GREEN, YEL], pet: ["pet Blip", iconHand, PINK, PINK], play: ["play with Blip", iconYarn, BLUE, BLUE] };
var plus1 = /* @__PURE__ */ __name((x, y, col) => `<g><animate attributeName="opacity" begin="5s" dur="0.4s" from="1" to="0" fill="freeze"/><rect x="${x}" y="${y - 16}" width="34" height="22" rx="11" fill="${col}"/><text x="${x + 17}" y="${y}" font-size="14" font-weight="bold" fill="#0d1117" text-anchor="middle">+1</text></g>`, "plus1");
function levelOf(xp) {
  let level = 1, need = 6;
  while (xp >= need) {
    xp -= need;
    level += 1;
    need = 5 + level;
  }
  return { level, into: xp, need };
}
__name(levelOf, "levelOf");
function wants(c) {
  const at = c.lastAt || {};
  let best = "cookie", bt = Infinity;
  for (const k of KINDS) {
    const t = Number(at[k]) || 0;
    if (t < bt) {
      bt = t;
      best = k;
    }
  }
  return best;
}
__name(wants, "wants");
function streakOf(days) {
  const d = days || {};
  const day = /* @__PURE__ */ new Date();
  let cur = nzDate(day.getTime());
  if (!d[cur]) day.setTime(day.getTime() - 864e5), cur = nzDate(day.getTime());
  let s = 0;
  while (d[cur]) {
    s += 1;
    day.setTime(day.getTime() - 864e5);
    cur = nzDate(day.getTime());
  }
  return s;
}
__name(streakOf, "streakOf");
function ago(ms) {
  if (!ms) return "never";
  const s = (Date.now() - ms) / 1e3;
  if (s < 60) return "just now";
  if (s < 3600) {
    const m = Math.floor(s / 60);
    return `${m} min${m === 1 ? "" : "s"} ago`;
  }
  if (s < 86400) {
    const h = Math.floor(s / 3600);
    return `${h} hour${h === 1 ? "" : "s"} ago`;
  }
  const d = Math.floor(s / 86400);
  return `${d} day${d === 1 ? "" : "s"} ago`;
}
__name(ago, "ago");
function ageDays() {
  const [y, mo, d] = BORN.split("-").map(Number), [ty, tm, td] = nzDate(Date.now()).split("-").map(Number);
  return Math.max(0, Math.round((Date.UTC(ty, tm - 1, td) - Date.UTC(y, mo - 1, d)) / 864e5));
}
__name(ageDays, "ageDays");
var crown = /* @__PURE__ */ __name((x, y) => `<path d="M${x} ${y + 12} L${x} ${y} L${x + 6} ${y + 6} L${x + 11} ${y - 2} L${x + 16} ${y + 6} L${x + 22} ${y} L${x + 22} ${y + 12} Z" fill="${YEL}" stroke="#8a6414" stroke-width="1"/>`, "crown");
var bow = /* @__PURE__ */ __name((x, y) => `<path d="M${x} ${y} l-9 -6 v12 z M${x} ${y} l9 -6 v12 z" fill="${PINK}"/><circle cx="${x}" cy="${y}" r="2.4" fill="#ff9fb6"/>`, "bow");
var sparkle = /* @__PURE__ */ __name((x, y, d) => `<path d="M${x} ${y - 5} L${x + 1.5} ${y - 1.5} L${x + 5} ${y} L${x + 1.5} ${y + 1.5} L${x} ${y + 5} L${x - 1.5} ${y + 1.5} L${x - 5} ${y} L${x - 1.5} ${y - 1.5} Z" fill="#fff3b0"><animate attributeName="opacity" values="0.2;1;0.2" dur="1.8s" begin="${d}s" repeatCount="indefinite"/></path>`, "sparkle");
function accessory(level) {
  if (level >= 20) return crown(90, TB + 30) + sparkle(80, TB + 24, 0) + sparkle(122, TB + 30, 0.9);
  if (level >= 10) return crown(90, TB + 30);
  if (level >= 5) return bow(120, TB + 44);
  return "";
}
__name(accessory, "accessory");
function rows(x, y, w, items, fs = 14, lh = 24) {
  let o = "";
  items.forEach(([k, v, col], i) => {
    const yy = y + i * lh, x1 = x + k.length * 8.6 + 10, x2 = x + w - String(v).length * 8.6 - 10;
    o += `<text x="${x}" y="${yy}" font-size="${fs}" fill="${DIM}">${esc(k)}</text>` + (x2 > x1 + 8 ? `<line x1="${x1.toFixed(1)}" y1="${yy - 4}" x2="${x2.toFixed(1)}" y2="${yy - 4}" stroke="#30363d" stroke-width="1" stroke-dasharray="1 4"/>` : "") + `<text x="${x + w}" y="${yy}" font-size="${fs}" fill="${col || TXT}" text-anchor="end">${esc(v)}</text>`;
  });
  return o;
}
__name(rows, "rows");
function starLayer(stars, win, lag = 0, col = "#e8f1ff") {
  if (!Array.isArray(stars) || !Array.isArray(win)) return "";
  const [ox, oy, k] = win;
  let out = `<g transform="scale(${Number(k).toFixed(5)}) translate(${(-ox).toFixed(2)},${(-oy).toFixed(2)})"><defs>`;
  stars.forEach((s, i) => {
    out += `<linearGradient id="sk${i}" gradientUnits="userSpaceOnUse" x1="${-s.L}" y1="0" x2="0" y2="0"><stop offset="0" stop-color="${col}" stop-opacity="0"/><stop offset="1" stop-color="${col}" stop-opacity="0.95"/></linearGradient>`;
  });
  out += `</defs>`;
  stars.forEach((s, i) => {
    const x1 = s.x + s.dx * s.v * s.T, y1 = s.y + s.dy * s.v * s.T, b = (s.b + (Number(lag) || 0)).toFixed(2);
    out += `<g opacity="0"><animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.06;0.9;1" begin="${b}s" dur="${s.T}s" fill="freeze"/><animateTransform attributeName="transform" type="translate" from="${s.x} ${s.y}" to="${x1.toFixed(1)} ${y1.toFixed(1)}" begin="${b}s" dur="${s.T}s" fill="freeze"/><g transform="rotate(${s.a})"><line x1="${-s.L}" y1="0" x2="0" y2="0" stroke="url(#sk${i})" stroke-width="2.2" stroke-linecap="round"/><circle r="${(s.r * 2.6).toFixed(1)}" fill="${col}" opacity="0.22"/><circle r="${s.r}" fill="#ffffff"/></g></g>`;
  });
  return out + `</g>`;
}
__name(starLayer, "starLayer");
function blipSVG(s, c) {
  const W = 900, H = TB + 230;
  const n = Number(c.n) || 0, pets = Number(c.pets) || 0, plays = Number(c.plays) || 0, last = Number(c.last) || 0;
  const xp = n + pets + plays, lv = levelOf(xp);
  const fed = KINDS.includes(c.fed) ? c.fed : null;
  const sleepy = !!s.sleepy && !fed, want = wants(c), bob = Number(s.bob) || 2.4;
  const fx = 46, y0 = TB + 58, fs = 30, lh = fs * 1.15;
  let out = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" font-family="${FONT}">` + DEFS(W, H) + windowChrome(W, H, "blip.svg");
  out += `<g><animateTransform attributeName="transform" type="translate" values="0 0;0 -7;0 0" keyTimes="0;0.5;1" calcMode="spline" keySplines="0.42 0 0.58 1;0.42 0 0.58 1" dur="${bob}s" repeatCount="indefinite"/><text y="${y0}" font-family="${CAT_FONT}" font-size="${fs}" xml:space="preserve" style="white-space:pre">${catText(fx, fs, lh)}</text>` + accessory(lv.level);
  if (fed === "cookie") out += `<g transform="translate(150 ${TB + 118})">${miniCookie(0, 0, 11, "bite2")}</g>`;
  if (fed === "pet") [[150, TB + 60, 9, 0], [170, TB + 44, 12, 0.5], [138, TB + 36, 8, 1]].forEach(([x, y, r, b]) => (
    // floating hearts
    out += `<path transform="translate(${x} ${y}) scale(${r / 10})" d="M0 6 C-10 -4 -6 -14 0 -8 C6 -14 10 -4 0 6Z" fill="${PINK}" opacity="0"><animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.2;0.7;1" dur="2.4s" begin="${b}s" repeatCount="indefinite"/></path>`
  ));
  if (fed === "play") out += `<g transform="translate(176 ${TB + 126})"><g><animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="3s" repeatCount="indefinite"/><circle r="10" fill="${BLUE}"/><path d="M-7 -5 Q0 0 7 -5 M-7 5 Q0 0 7 5 M-5 -8 Q0 0 -5 8" stroke="#0d1117" stroke-width="1.4" fill="none"/></g></g>`;
  if (sleepy) [[152, TB + 52, 11, 0], [166, TB + 38, 14, 0.7], [182, TB + 22, 17, 1.4]].forEach(([x, y, size, beg]) => (
    // z z z
    out += `<text x="${x}" y="${y}" font-size="${size}" fill="${DIM}" opacity="0">z<animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.25;0.6;1" dur="3s" begin="${beg}s" repeatCount="indefinite"/></text>`
  ));
  out += `</g>`;
  const capY = y0 + 3 * lh + 30, xpw = 200;
  out += `<text x="30" y="${capY.toFixed(1)}" font-size="13" fill="${DIM}">Blip \xB7 Lv.${lv.level}</text><text x="${30 + xpw}" y="${capY.toFixed(1)}" font-size="11" fill="${DIM}" text-anchor="end">${lv.into}/${lv.need} xp</text><rect x="30" y="${(capY + 7).toFixed(1)}" width="${xpw}" height="2" rx="1" fill="#21262d"/><rect x="30" y="${(capY + 7).toFixed(1)}" width="${(xpw * lv.into / lv.need).toFixed(1)}" height="2" rx="1" fill="${GREEN}"/>`;
  const WANT = { cookie: "wants a cookie", pet: "wants pats", play: "wants to play" };
  let mood, moodCol = TXT;
  if (fed === "cookie") {
    mood = "nom nom \xB7 thanks :3";
    moodCol = PUR;
  } else if (fed === "pet") {
    mood = "purring \xB7 \u2665";
    moodCol = PINK;
  } else if (fed === "play") {
    mood = "zoomies!!";
    moodCol = BLUE;
  } else if (sleepy) mood = "zzz \xB7 asleep in NZ";
  else if (!last) mood = "waiting for a visitor";
  else {
    const h = (Date.now() - last) / 36e5;
    mood = `${h < 1 ? "purring" : h < 6 ? "content" : h < 24 ? "chill" : h < 72 ? "lonely" : "sad"} \xB7 ${WANT[want]}`;
  }
  const age = ageDays(), streak = streakOf(c.days);
  const fav = s.fav ? (String(s.fav).length > 20 ? String(s.fav).slice(0, 19) + "\u2026" : String(s.fav)) + " \u266A" : "cookies";
  out += rows(280, TB + 66, 290, [
    // rows end at x=570; scoreboard starts ~640
    ["mood", mood, moodCol],
    ["age", `${age} day${age === 1 ? "" : "s"}`],
    ["streak", streak ? `${streak} day${streak === 1 ? "" : "s"} of visitors` : "none yet"],
    ["favourite", fav],
    ["last visitor", ago(last)]
  ]);
  const sx = 668, cols = [[n, "cookie", YEL, "cookie"], [pets, "pet", PINK, "pet"], [plays, "play", BLUE, "play"]];
  cols.forEach(([v, l, col, kind], i) => {
    const x = sx + i * 88, txt = v.toLocaleString("en-US"), size = txt.length > 4 ? 22 : txt.length > 2 ? 28 : 34;
    out += `<text x="${x}" y="${TB + 110}" font-size="${size}" font-weight="bold" fill="${col}" text-anchor="middle">${txt}</text><text x="${x}" y="${TB + 130}" font-size="12" fill="${DIM}" text-anchor="middle">${l}${v === 1 ? "" : "s"}</text>`;
    if (fed === kind) out += plus1(x - 17, TB + 78, col);
  });
  out += `<text x="${sx + 88}" y="${TB + 176}" font-size="12" fill="${DIM}" text-anchor="middle">click a button below \u2193</text>`;
  if (s.stars) out += starLayer(s.stars.list, s.stars.blip, s.stars.lag && s.stars.lag.blip);
  return out + `</svg>`;
}
__name(blipSVG, "blipSVG");
function buttonSVG(kind, c, s = {}) {
  const W = 280, H = 60, [label, icon, col] = SPEC[kind] || SPEC.cookie;
  const pulse = wants(c) === kind, fed = c.fed === kind;
  const x = 8, y = 8, w = W - 16, h = H - 16;
  let out = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" font-family="${FONT}">` + DEFS(W, H);
  if (pulse) out += `<rect x="${x - 4}" y="${y - 4}" width="${w + 8}" height="${h + 8}" rx="${h / 2 + 4}" fill="none" stroke="${col}" stroke-width="2.5"><animate attributeName="opacity" values="0.1;1;0.1" dur="1.6s" repeatCount="indefinite"/></rect>`;
  out += `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${h / 2}" fill="#161b22" stroke="${col}" stroke-width="1.5"/>` + icon(x + 26, y + h / 2) + `<text x="${x + 48}" y="${y + h / 2 + 5}" font-size="15" font-weight="bold" fill="${col}">${esc(label)}</text>`;
  if (fed) out += plus1(W - 52, 24, col);
  if (s.stars && s.stars.btn) out += starLayer(s.stars.list, s.stars.btn[KINDS.indexOf(kind)], s.stars.lag && s.stars.lag.btn);
  return out + `</svg>`;
}
__name(buttonSVG, "buttonSVG");
function cookieSVG(n) {
  const count = Number(n).toLocaleString("en-US");
  const W = 900, H = 150 + TB, cx = 96, cy = TB + 76, r = 48, my = TB + 75;
  let seed = 7;
  const rnd = /* @__PURE__ */ __name(() => (seed = (seed * 9301 + 49297) % 233280) / 233280, "rnd");
  const pts = [];
  for (let i = 0; i < 28; i++) {
    const a = i / 28 * Math.PI * 2, rr = r + (rnd() - 0.5) * 5;
    pts.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr]);
  }
  const body = "M" + pts.map((p) => p[0].toFixed(1) + " " + p[1].toFixed(1)).join("L") + "Z";
  const chips = [[-18, -16, 6, 4.5, 20], [12, -22, 5, 4, -30], [-4, 4, 6.5, 5, 60], [18, 12, 5.5, 4.5, -15], [-24, 12, 5, 4, 35], [2, 26, 5.5, 4, -50], [26, -6, 4.5, 4, 10], [-8, -30, 4, 3.5, -40], [-30, -4, 4, 3.5, 75]];
  const chipEls = chips.map(([dx, dy, rx, ry, rot]) => `<ellipse cx="${cx + dx}" cy="${cy + dy}" rx="${rx}" ry="${ry}" transform="rotate(${rot} ${cx + dx} ${cy + dy})" fill="url(#chip)"/><ellipse cx="${cx + dx - 1.5}" cy="${cy + dy - 1.5}" rx="${rx * 0.35}" ry="${ry * 0.3}" transform="rotate(${rot} ${cx + dx} ${cy + dy})" fill="#7a4d27" opacity="0.7"/>`).join("");
  const crumbs = [[cx + 50, cy - 44, 2.2], [cx + 58, cy - 34, 1.6], [cx + 44, cy - 56, 1.4]].map(([x, y, cr]) => `<circle cx="${x}" cy="${y}" r="${cr}" fill="#b07a3e"/>`).join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" font-family="${FONT}"><defs><radialGradient id="dough" cx="38%" cy="32%" r="72%"><stop offset="0" stop-color="#e9bd72"/><stop offset="0.55" stop-color="#cf914a"/><stop offset="1" stop-color="#8e5622"/></radialGradient><radialGradient id="chip" cx="35%" cy="30%" r="70%"><stop offset="0" stop-color="#6a4120"/><stop offset="1" stop-color="#2e1a0a"/></radialGradient><mask id="bite"><rect x="0" y="0" width="${W}" height="${H}" fill="#fff"/><circle cx="${cx + 40}" cy="${cy - 34}" r="21" fill="#000"/><circle cx="${cx + 22}" cy="${cy - 46}" r="11" fill="#000"/><circle cx="${cx + 50}" cy="${cy - 16}" r="9" fill="#000"/></mask><filter id="shadow" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="0" dy="4" stdDeviation="4" flood-color="#000" flood-opacity="0.55"/></filter></defs>` + windowChrome(W, H, "cookie jar \u2014 shared counter") + `<g transform-origin="${cx} ${cy}"><animateTransform attributeName="transform" type="rotate" values="-3 ${cx} ${cy};3 ${cx} ${cy};-3 ${cx} ${cy}" dur="2.6s" repeatCount="indefinite"/><g filter="url(#shadow)"><g mask="url(#bite)"><path d="${body}" fill="url(#dough)" stroke="#7a4a1e" stroke-width="2" stroke-linejoin="round"/><path d="${body}" fill="none" stroke="#f3d18e" stroke-width="1.5" opacity="0.35" transform="translate(-1.5 -1.5)"/>` + chipEls + `</g></g>` + crumbs + `</g><text x="190" y="${my - 8}" font-size="44" font-weight="bold" fill="${YEL}">${count}</text><text x="192" y="${my + 20}" font-size="16" fill="${TXT}">cookies baked</text><text x="192" y="${my + 44}" font-size="12" fill="${DIM}">click the cookie to bake one</text></svg>`;
}
__name(cookieSVG, "cookieSVG");

// ../../../../../AppData/Local/npm-cache/_npx/32026684e21afda6/node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
var drainBody = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;

// ../../../../../AppData/Local/npm-cache/_npx/32026684e21afda6/node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
function reduceError(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError(e.cause)
  };
}
__name(reduceError, "reduceError");
var jsonError = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } catch (e) {
    const error = reduceError(e);
    const body = JSON.stringify(error);
    const headers = {
      "Content-Type": "application/json",
      "MF-Experimental-Error-Stack": "true"
    };
    const encoded = encodeURIComponent(body);
    if (encoded.length <= 8192) {
      headers["MF-Experimental-Error-Stack-Payload"] = encoded;
    }
    return new Response(body, { status: 500, headers });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError;

// .wrangler/tmp/bundle-fFQygR/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = src_default;

// ../../../../../AppData/Local/npm-cache/_npx/32026684e21afda6/node_modules/wrangler/templates/middleware/common.ts
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");

// .wrangler/tmp/bundle-fFQygR/middleware-loader.entry.ts
var __Facade_ScheduledController__ = class ___Facade_ScheduledController__ {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  scheduledTime;
  cron;
  static {
    __name(this, "__Facade_ScheduledController__");
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof ___Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = /* @__PURE__ */ __name((request, env, ctx) => {
      this.env = env;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    }, "#fetchDispatcher");
    #dispatcher = /* @__PURE__ */ __name((type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    }, "#dispatcher");
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;
export {
  Counter,
  __INTERNAL_WRANGLER_MIDDLEWARE__,
  blipSVG,
  buttonSVG,
  cookieSVG,
  middleware_loader_entry_default as default
};
//# sourceMappingURL=index.js.map
