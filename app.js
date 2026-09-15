const STORAGE_KEY = "poker_sessions_v1";
const MONTH_NAMES = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const SEED_SESSIONS = [{"id": "s1", "location": "Danville", "monthKey": "2025-07", "monthLabel": "Jul 2025", "amount": -300.0, "notes": ""}, {"id": "s2", "location": "Home game", "monthKey": "2025-07", "monthLabel": "Jul 2025", "amount": 150.0, "notes": ""}, {"id": "s3", "location": "Office game", "monthKey": "2025-08", "monthLabel": "Aug 2025", "amount": 40.0, "notes": ""}, {"id": "s4", "location": "Panchams game", "monthKey": "2025-07", "monthLabel": "Jul 2025", "amount": 200.0, "notes": ""}, {"id": "s5", "location": "Panchams game", "monthKey": "2025-08", "monthLabel": "Aug 2025", "amount": 150.0, "notes": ""}, {"id": "s6", "location": "Grants game", "monthKey": "2025-08", "monthLabel": "Aug 2025", "amount": -180.0, "notes": ""}, {"id": "s7", "location": "Grants game", "monthKey": "2025-08", "monthLabel": "Aug 2025", "amount": -395.0, "notes": ""}, {"id": "s8", "location": "Tims game", "monthKey": "2025-08", "monthLabel": "Aug 2025", "amount": 280.0, "notes": ""}, {"id": "s9", "location": "Office game", "monthKey": "2025-08", "monthLabel": "Aug 2025", "amount": -27.0, "notes": ""}, {"id": "s10", "location": "Narens game", "monthKey": "2025-09", "monthLabel": "Sep 2025", "amount": 1150.0, "notes": ""}, {"id": "s11", "location": "Tims game", "monthKey": "2025-09", "monthLabel": "Sep 2025", "amount": 800.0, "notes": ""}, {"id": "s12", "location": "Tims game", "monthKey": "2025-10", "monthLabel": "Oct 2025", "amount": 500.0, "notes": ""}, {"id": "s13", "location": "Panchams game", "monthKey": "2025-10", "monthLabel": "Oct 2025", "amount": 260.0, "notes": ""}, {"id": "s14", "location": "Prasads game", "monthKey": "2025-10", "monthLabel": "Oct 2025", "amount": 100.0, "notes": ""}, {"id": "s15", "location": "Office game", "monthKey": "2025-10", "monthLabel": "Oct 2025", "amount": -100.0, "notes": ""}, {"id": "s16", "location": "Prasads game", "monthKey": "2025-10", "monthLabel": "Oct 2025", "amount": -300.0, "notes": ""}, {"id": "s17", "location": "Office game", "monthKey": "2025-11", "monthLabel": "Nov 2025", "amount": -100.0, "notes": ""}, {"id": "s18", "location": "Prasads game", "monthKey": "2025-11", "monthLabel": "Nov 2025", "amount": 650.0, "notes": ""}, {"id": "s19", "location": "Panchams game", "monthKey": "2025-11", "monthLabel": "Nov 2025", "amount": 550.0, "notes": ""}, {"id": "s20", "location": "Office game", "monthKey": "2025-11", "monthLabel": "Nov 2025", "amount": 64.0, "notes": ""}, {"id": "s21", "location": "Prasads game", "monthKey": "2025-11", "monthLabel": "Nov 2025", "amount": 0.0, "notes": ""}, {"id": "s22", "location": "Grants game", "monthKey": "2025-11", "monthLabel": "Nov 2025", "amount": 270.0, "notes": ""}, {"id": "s23", "location": "Diwakars game", "monthKey": "2025-11", "monthLabel": "Nov 2025", "amount": -500.0, "notes": ""}, {"id": "s24", "location": "Danville", "monthKey": "2025-11", "monthLabel": "Nov 2025", "amount": -370.0, "notes": ""}, {"id": "s25", "location": "Tampa Hard Rock", "monthKey": "2025-11", "monthLabel": "Nov 2025", "amount": 110.0, "notes": ""}, {"id": "s26", "location": "Tampa Hard Rock", "monthKey": "2025-11", "monthLabel": "Nov 2025", "amount": 350.0, "notes": ""}, {"id": "s27", "location": "Tampa Hard Rock", "monthKey": "2025-11", "monthLabel": "Nov 2025", "amount": 1275.0, "notes": ""}, {"id": "s28", "location": "Masons game", "monthKey": "2025-12", "monthLabel": "Dec 2025", "amount": 0.0, "notes": ""}, {"id": "s29", "location": "Diwakars game", "monthKey": "2025-12", "monthLabel": "Dec 2025", "amount": 600.0, "notes": ""}, {"id": "s30", "location": "Prasads game", "monthKey": "2025-12", "monthLabel": "Dec 2025", "amount": -400.0, "notes": ""}, {"id": "s31", "location": "Ballantyne game", "monthKey": "2025-12", "monthLabel": "Dec 2025", "amount": 855.0, "notes": ""}, {"id": "s32", "location": "Office game", "monthKey": "2025-12", "monthLabel": "Dec 2025", "amount": 80.0, "notes": ""}, {"id": "s33", "location": "Ballantyne game", "monthKey": "2025-12", "monthLabel": "Dec 2025", "amount": -250.0, "notes": ""}, {"id": "s34", "location": "Diwakars game", "monthKey": "2025-12", "monthLabel": "Dec 2025", "amount": 2620.0, "notes": ""}, {"id": "s35", "location": "Prasads game", "monthKey": "2025-12", "monthLabel": "Dec 2025", "amount": 300.0, "notes": ""}, {"id": "s36", "location": "Hard rock", "monthKey": "2026-01", "monthLabel": "Jan 2026", "amount": -540.0, "notes": ""}, {"id": "s37", "location": "Ballantyne game", "monthKey": "2026-01", "monthLabel": "Jan 2026", "amount": -900.0, "notes": ""}, {"id": "s38", "location": "Diwakars game", "monthKey": "2026-02", "monthLabel": "Feb 2026", "amount": -1500.0, "notes": ""}, {"id": "s39", "location": "Ballantyne game", "monthKey": "2026-04", "monthLabel": "Apr 2026", "amount": 800.0, "notes": ""}, {"id": "s40", "location": "Ballantyne game", "monthKey": "2026-04", "monthLabel": "Apr 2026", "amount": 1600.0, "notes": ""}, {"id": "s41", "location": "Cheswyck game", "monthKey": "2026-04", "monthLabel": "Apr 2026", "amount": -540.0, "notes": ""}, {"id": "s42", "location": "Ballantyne game", "monthKey": "2026-04", "monthLabel": "Apr 2026", "amount": -300.0, "notes": ""}, {"id": "s43", "location": "Cheswyck game", "monthKey": "2026-04", "monthLabel": "Apr 2026", "amount": -100.0, "notes": ""}, {"id": "s44", "location": "Ballantyne game", "monthKey": "2026-04", "monthLabel": "Apr 2026", "amount": 571.0, "notes": ""}, {"id": "s45", "location": "Harish game", "monthKey": "2026-04", "monthLabel": "Apr 2026", "amount": -175.0, "notes": ""}, {"id": "s46", "location": "Ballantyne game", "monthKey": "2026-04", "monthLabel": "Apr 2026", "amount": 675.0, "notes": ""}, {"id": "s47", "location": "Raghu game", "monthKey": "2026-05", "monthLabel": "May 2026", "amount": 1130.0, "notes": ""}, {"id": "s48", "location": "Ballantyne game", "monthKey": "2026-05", "monthLabel": "May 2026", "amount": 580.0, "notes": ""}, {"id": "s49", "location": "Monarch", "monthKey": "2026-05", "monthLabel": "May 2026", "amount": -300.0, "notes": ""}, {"id": "s50", "location": "Monarch", "monthKey": "2026-05", "monthLabel": "May 2026", "amount": -760.0, "notes": ""}, {"id": "s51", "location": "Prasads game", "monthKey": "2026-06", "monthLabel": "Jun 2026", "amount": -1000.0, "notes": ""}, {"id": "s52", "location": "Raghu game", "monthKey": "2026-06", "monthLabel": "Jun 2026", "amount": 1000.0, "notes": ""}, {"id": "s53", "location": "Raghu game", "monthKey": "2026-06", "monthLabel": "Jun 2026", "amount": 535.0, "notes": ""}, {"id": "s54", "location": "Raghu game", "monthKey": "2026-06", "monthLabel": "Jun 2026", "amount": 600.0, "notes": ""}, {"id": "s55", "location": "Atlanta game", "monthKey": "2026-06", "monthLabel": "Jun 2026", "amount": -650.0, "notes": ""}, {"id": "s56", "location": "Raghu game", "monthKey": "2026-06", "monthLabel": "Jun 2026", "amount": -390.0, "notes": ""}, {"id": "s57", "location": "Davids game", "monthKey": "2026-07", "monthLabel": "Jul 2026", "amount": 250.0, "notes": ""}, {"id": "s58", "location": "Pramodhs game", "monthKey": "2026-07", "monthLabel": "Jul 2026", "amount": -509.0, "notes": ""}, {"id": "s59", "location": "Danville", "monthKey": "2026-07", "monthLabel": "Jul 2026", "amount": 350.0, "notes": ""}, {"id": "s60", "location": "Raghu game", "monthKey": "2026-07", "monthLabel": "Jul 2026", "amount": 3000.0, "notes": ""}, {"id": "s61", "location": "Seans game", "monthKey": "2026-07", "monthLabel": "Jul 2026", "amount": 300.0, "notes": ""}, {"id": "s62", "location": "Seans game", "monthKey": "2026-07", "monthLabel": "Jul 2026", "amount": 160.0, "notes": ""}, {"id": "s63", "location": "Davids game", "monthKey": "2026-07", "monthLabel": "Jul 2026", "amount": -160.0, "notes": ""}, {"id": "s64", "location": "Raghu game", "monthKey": "2026-07", "monthLabel": "Jul 2026", "amount": 940.0, "notes": ""}, {"id": "s65", "location": "Masons game", "monthKey": "2026-07", "monthLabel": "Jul 2026", "amount": 535.0, "notes": ""}, {"id": "s66", "location": "Todds game", "monthKey": "2026-07", "monthLabel": "Jul 2026", "amount": 600.0, "notes": ""}, {"id": "s67", "location": "Seans game", "monthKey": "2026-07", "monthLabel": "Jul 2026", "amount": 665.0, "notes": ""}, {"id": "s68", "location": "Bobba game", "monthKey": "2026-08", "monthLabel": "Aug 2026", "amount": 320.0, "notes": ""}, {"id": "s69", "location": "Todds game", "monthKey": "2026-08", "monthLabel": "Aug 2026", "amount": 850.0, "notes": ""}, {"id": "s70", "location": "Seans game", "monthKey": "2026-08", "monthLabel": "Aug 2026", "amount": -535.0, "notes": ""}, {"id": "s71", "location": "Masons game", "monthKey": "2026-08", "monthLabel": "Aug 2026", "amount": 2235.0, "notes": ""}, {"id": "s72", "location": "Davids game", "monthKey": "2026-08", "monthLabel": "Aug 2026", "amount": -1800.0, "notes": ""}, {"id": "s73", "location": "Davids game", "monthKey": "2026-08", "monthLabel": "Aug 2026", "amount": -380.0, "notes": ""}, {"id": "s74", "location": "Seans game", "monthKey": "2026-08", "monthLabel": "Aug 2026", "amount": -600.0, "notes": ""}, {"id": "s75", "location": "Bobba game", "monthKey": "2026-08", "monthLabel": "Aug 2026", "amount": 115.0, "notes": ""}, {"id": "s76", "location": "Todds game", "monthKey": "2026-08", "monthLabel": "Aug 2026", "amount": -1000.0, "notes": ""}, {"id": "s77", "location": "Johns game", "monthKey": "2026-08", "monthLabel": "Aug 2026", "amount": -1250.0, "notes": ""}, {"id": "s78", "location": "Johns game", "monthKey": "2026-08", "monthLabel": "Aug 2026", "amount": 150.0, "notes": ""}, {"id": "s79", "location": "Zeeks game", "monthKey": "2026-08", "monthLabel": "Aug 2026", "amount": 580.0, "notes": ""}, {"id": "s80", "location": "Zeeks game", "monthKey": "2026-08", "monthLabel": "Aug 2026", "amount": -1000.0, "notes": ""}, {"id": "s81", "location": "Zeeks game", "monthKey": "2026-09", "monthLabel": "Sep 2026", "amount": 1450.0, "notes": ""}, {"id": "s82", "location": "Masons game", "monthKey": "2026-09", "monthLabel": "Sep 2026", "amount": -1500.0, "notes": ""}, {"id": "s83", "location": "Zeeks game", "monthKey": "2026-09", "monthLabel": "Sep 2026", "amount": 220.0, "notes": ""}, {"id": "s84", "location": "Danville", "monthKey": "2026-09", "monthLabel": "Sep 2026", "amount": 500.0, "notes": ""}, {"id": "s85", "location": "Zeeks game", "monthKey": "2026-09", "monthLabel": "Sep 2026", "amount": 1100.0, "notes": ""}, {"id": "s86", "location": "Zeeks game", "monthKey": "2026-09", "monthLabel": "Sep 2026", "amount": -1000.0, "notes": ""}, {"id": "s87", "location": "Danville", "monthKey": "2026-09", "monthLabel": "Sep 2026", "amount": -1000.0, "notes": ""}];

// ---------- state ----------
let sessions = [];
let activeTab = "overview";
let locFilter = "all";
let expandedId = null;
let editingId = null;
let showAddForm = false;
let formError = "";
let cumulativeChart = null;
let monthlyChart = null;

// ---------- helpers ----------
function monthKeyToLabel(key){
  if(!key) return "";
  const [y,m] = key.split("-");
  const idx = parseInt(m,10)-1;
  return `${MONTH_NAMES[idx]||m} ${y}`;
}
function currentMonthKey(){
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}`;
}
function fmtMoney(n, showPlus){
  const val = Math.round(n);
  const sign = val < 0 ? "-" : (showPlus ? "+" : "");
  return `${sign}$${Math.abs(val).toLocaleString("en-US")}`;
}
function normLoc(loc){ return loc.trim().toLowerCase().replace(/\s+/g," "); }
function uid(){ return "s"+Date.now().toString(36)+Math.random().toString(36).slice(2,7); }
function esc(str){
  const d = document.createElement("div");
  d.innerText = str;
  return d.innerHTML;
}

// Known name variants that refer to the same place, so old cached data
// (or a future typo) always rolls up under one canonical name.
const LOCATION_ALIASES = {
  "balantyne game": "Ballantyne game",
  "danville game": "Danville",
  "david game": "Davids game",
  "divakar game": "Diwakars game",
  "diwakar game": "Diwakars game",
  "sean game": "Seans game",
  "tod game": "Todds game",
};
function normalizeLocations(list){
  let changed = false;
  list.forEach(s=>{
    const canonical = LOCATION_ALIASES[normLoc(s.location)];
    if(canonical && s.location !== canonical){
      s.location = canonical;
      changed = true;
    }
  });
  return changed;
}

// One-time correction: these 5 rows sat at the bottom of the original sheet,
// after the Sep 2026 entries, but were mislabeled "Sep 2025" (a year typo).
const DATE_FIXES = { s83: "2026-09", s84: "2026-09", s85: "2026-09", s86: "2026-09", s87: "2026-09" };
function normalizeDates(list){
  let changed = false;
  list.forEach(s=>{
    const fixedKey = DATE_FIXES[s.id];
    if(fixedKey && s.monthKey !== fixedKey){
      s.monthKey = fixedKey;
      s.monthLabel = monthKeyToLabel(fixedKey);
      changed = true;
    }
  });
  return changed;
}

// ---------- persistence ----------
function loadData(){
  try{
    const raw = localStorage.getItem(STORAGE_KEY);
    if(raw){
      const parsed = JSON.parse(raw);
      if(Array.isArray(parsed) && parsed.length){
        sessions = parsed;
        const locChanged = normalizeLocations(sessions);
        const dateChanged = normalizeDates(sessions);
        if(locChanged || dateChanged) saveData();
        return;
      }
    }
  }catch(e){}
  sessions = JSON.parse(JSON.stringify(SEED_SESSIONS));
  normalizeLocations(sessions);
  normalizeDates(sessions);
  saveData();
}
function saveData(){
  try{ localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions)); }catch(e){}
}

// ---------- stats ----------
function computeStats(){
  if(!sessions.length) return null;
  const net = sessions.reduce((s,x)=>s+x.amount,0);
  const wins = sessions.filter(s=>s.amount>0).length;
  const losses = sessions.filter(s=>s.amount<0).length;
  const winRate = (wins/sessions.length)*100;
  const avg = net/sessions.length;

  const byMonth = {};
  sessions.forEach(s=>{ byMonth[s.monthKey] = (byMonth[s.monthKey]||0)+s.amount; });
  const monthKeys = Object.keys(byMonth).sort();
  let running = 0;
  const cumulative = monthKeys.map(k=>{
    running += byMonth[k];
    return { monthKey:k, label:monthKeyToLabel(k), monthTotal:byMonth[k], cumulative:running };
  });
  const bestMonth = cumulative.reduce((a,b)=> b.monthTotal>a.monthTotal?b:a, cumulative[0]);
  const worstMonth = cumulative.reduce((a,b)=> b.monthTotal<a.monthTotal?b:a, cumulative[0]);

  const byLoc = {};
  sessions.forEach(s=>{
    const key = normLoc(s.location);
    if(!byLoc[key]) byLoc[key] = { display:s.location.trim(), total:0, count:0 };
    byLoc[key].total += s.amount;
    byLoc[key].count += 1;
  });
  const locArr = Object.values(byLoc).sort((a,b)=>b.total-a.total);

  const bestSession = sessions.reduce((a,b)=> b.amount>a.amount?b:a, sessions[0]);
  const worstSession = sessions.reduce((a,b)=> b.amount<a.amount?b:a, sessions[0]);

  return { net, wins, losses, winRate, avg, cumulative, bestMonth, worstMonth, locArr, bestSession, worstSession, total: sessions.length };
}

function getLocations(){
  const seen = new Map();
  sessions.forEach(s=>{
    const key = normLoc(s.location);
    if(!seen.has(key)) seen.set(key, s.location.trim());
  });
  return Array.from(seen.values()).sort((a,b)=>a.localeCompare(b));
}

// ---------- chip icon ----------
function chipSVG(size){
  return `<svg width="${size}" height="${size}" viewBox="0 0 40 40" fill="none">
    <circle cx="20" cy="20" r="18" stroke="var(--gold)" stroke-width="2"/>
    <circle cx="20" cy="20" r="12.5" stroke="var(--gold)" stroke-width="1.2" stroke-dasharray="3 4"/>
    ${[0,45,90,135,180,225,270,315].map(deg=>`<rect x="19.1" y="1.5" width="1.8" height="6" rx="0.9" fill="var(--gold)" transform="rotate(${deg} 20 20)"/>`).join("")}
    <circle cx="20" cy="20" r="4.5" fill="var(--gold)"/>
  </svg>`;
}

// ---------- render ----------
function render(){
  const app = document.getElementById("app");
  const stats = computeStats();

  let html = `
    <header>
      <div class="pl-header-title">
        ${chipSVG(34)}
        <div><h1>The Ledger</h1><p>Home game &amp; casino sessions, tracked month to month</p></div>
      </div>
    </header>
    <nav class="pl-tabs">
      <button class="pl-tab ${activeTab==='overview'?'active':''}" data-action="tab" data-tab="overview">Overview</button>
      <button class="pl-tab ${activeTab==='log'?'active':''}" data-action="tab" data-tab="log">Session log</button>
    </nav>
  `;

  if(activeTab==="overview" && stats){
    const maxAbsLoc = Math.max(...stats.locArr.map(l=>Math.abs(l.total)),1);
    html += `
    <main>
      <section class="pl-hero">
        <span class="pl-hero-label">Net result across ${stats.total} sessions</span>
        <span class="pl-hero-number ${stats.net>=0?'win':'loss'}">${fmtMoney(stats.net,true)}</span>
        <span class="pl-hero-sub">${stats.wins} winning &middot; ${stats.losses} losing &middot; ${stats.total-stats.wins-stats.losses} even</span>
      </section>

      <section class="pl-stat-grid">
        <div class="pl-stat-card"><span class="pl-stat-label">Win rate</span><span class="pl-stat-value">${stats.winRate.toFixed(0)}%</span></div>
        <div class="pl-stat-card"><span class="pl-stat-label">Average session</span><span class="pl-stat-value ${stats.avg>=0?'win':'loss'}">${fmtMoney(stats.avg)}</span></div>
        <div class="pl-stat-card"><span class="pl-stat-label">Best month</span><span class="pl-stat-value win">${stats.bestMonth.label}</span><span class="pl-stat-footnote win">${fmtMoney(stats.bestMonth.monthTotal,true)}</span></div>
        <div class="pl-stat-card"><span class="pl-stat-label">Toughest month</span><span class="pl-stat-value loss">${stats.worstMonth.label}</span><span class="pl-stat-footnote loss">${fmtMoney(stats.worstMonth.monthTotal,true)}</span></div>
        <div class="pl-stat-card"><span class="pl-stat-label">Best single session</span><span class="pl-stat-value win">${fmtMoney(stats.bestSession.amount,true)}</span><span class="pl-stat-footnote">${esc(stats.bestSession.location)} &middot; ${stats.bestSession.monthLabel}</span></div>
        <div class="pl-stat-card"><span class="pl-stat-label">Worst single session</span><span class="pl-stat-value loss">${fmtMoney(stats.worstSession.amount,true)}</span><span class="pl-stat-footnote">${esc(stats.worstSession.location)} &middot; ${stats.worstSession.monthLabel}</span></div>
      </section>

      <section class="pl-panel">
        <h2>Bankroll over time</h2>
        <div class="pl-chart-wrap"><canvas id="chart-cumulative" height="90"></canvas></div>
      </section>

      <section class="pl-panel">
        <h2>Result by month</h2>
        <div class="pl-chart-wrap"><canvas id="chart-monthly" height="80"></canvas></div>
      </section>

      <section class="pl-panel">
        <h2>Where you play</h2>
        <div class="pl-loc-list">
          ${stats.locArr.map(l=>`
            <div class="pl-loc-row">
              <div class="pl-loc-meta"><span class="pl-loc-name">${esc(l.display)}</span><span class="pl-loc-count">${l.count} session${l.count===1?'':'s'}</span></div>
              <div class="pl-loc-bar-track"><div class="pl-loc-bar ${l.total>=0?'win':'loss'}" style="width:${Math.max((Math.abs(l.total)/maxAbsLoc)*100,3)}%; background:${l.total>=0?'var(--win)':'var(--loss)'}"></div></div>
              <span class="pl-loc-total ${l.total>=0?'win':'loss'}">${fmtMoney(l.total,true)}</span>
            </div>`).join("")}
        </div>
      </section>
    </main>`;
  }

  if(activeTab==="log"){
    const locations = getLocations();
    let list = sessions;
    if(locFilter!=="all") list = list.filter(s=>normLoc(s.location)===locFilter);
    list = [...list].sort((a,b)=> a.monthKey!==b.monthKey ? b.monthKey.localeCompare(a.monthKey) : b.id.localeCompare(a.id));

    html += `
    <main>
      <section class="pl-log-controls">
        <select class="pl-select" id="loc-filter">
          <option value="all" ${locFilter==='all'?'selected':''}>All locations</option>
          ${locations.map(l=>`<option value="${esc(normLoc(l))}" ${locFilter===normLoc(l)?'selected':''}>${esc(l)}</option>`).join("")}
        </select>
        <button class="pl-btn-primary" data-action="toggle-add">${showAddForm? '&times; Cancel' : '+ Log a session'}</button>
      </section>

      ${showAddForm ? `
      <section class="pl-panel pl-add-form">
        <h2>New session</h2>
        <div class="pl-form-grid">
          <label><span>Where</span>
            <input list="pl-locations" type="text" id="new-location" placeholder="e.g. Ballantyne game">
            <datalist id="pl-locations">${locations.map(l=>`<option value="${esc(l)}">`).join("")}</datalist>
          </label>
          <label><span>Month</span><input type="month" id="new-month" value="${currentMonthKey()}"></label>
          <label><span>Result ($)</span><input type="number" step="1" id="new-amount" placeholder="-150 or 300"></label>
        </div>
        <label class="pl-notes-label"><span>Notes — what worked, what to fix next time</span>
          <textarea rows="3" id="new-notes" placeholder="e.g. Played too many hands out of position after the first hour."></textarea>
        </label>
        ${formError ? `<p class="pl-form-error">${esc(formError)}</p>` : ""}
        <button class="pl-btn-primary" data-action="save-new">Save session</button>
      </section>` : ""}

      <section class="pl-list">
        ${list.length===0 ? `<p class="pl-empty">No sessions logged for this filter yet.</p>` : ""}
        ${list.map(s=>{
          const isExpanded = expandedId===s.id;
          const isEditing = editingId===s.id;
          return `
          <div class="pl-row">
            <button class="pl-row-head" data-action="expand" data-id="${s.id}">
              <span class="pl-row-month">${s.monthLabel}</span>
              <span class="pl-row-location">${esc(s.location)}</span>
              ${s.notes ? `<span class="pl-note-flag">&#9998;</span>` : `<span></span>`}
              <span class="pl-row-amount ${s.amount>=0?'win':'loss'}">${fmtMoney(s.amount,true)}</span>
              <span class="pl-chevron ${isExpanded?'open':''}">&#9660;</span>
            </button>
            ${isExpanded ? `
            <div class="pl-row-body">
              ${isEditing ? `
              <div class="pl-edit-grid">
                <label><span>Month</span><input type="month" id="edit-month" value="${s.monthKey}"></label>
                <label><span>Result ($)</span><input type="number" id="edit-amount" value="${s.amount}"></label>
                <div class="pl-edit-actions">
                  <button class="pl-btn-small" data-action="save-edit" data-id="${s.id}">Save</button>
                  <button class="pl-btn-small ghost" data-action="cancel-edit">Cancel</button>
                </div>
              </div>
              <div style="margin-top:10px;">
                <label class="pl-notes-label"><span>Where</span><input type="text" id="edit-location" value="${esc(s.location)}"></label>
              </div>
              ` : `
              <label class="pl-notes-label"><span>Notes for next time</span>
                <textarea rows="2" data-action="notes" data-id="${s.id}" placeholder="What to improve, reads to remember, anything worth noting…">${esc(s.notes||"")}</textarea>
              </label>
              <div class="pl-row-actions">
                <button class="pl-btn-small ghost" data-action="start-edit" data-id="${s.id}">Edit</button>
                <button class="pl-btn-small danger" data-action="delete" data-id="${s.id}">Delete</button>
              </div>
              `}
            </div>` : ""}
          </div>`;
        }).join("")}
      </section>
    </main>`;
  }

  app.innerHTML = html;
  attachHandlers();
  if(activeTab==="overview" && stats) drawCharts(stats);
}

// ---------- charts ----------
function drawCharts(stats){
  const gold = "#c9a24b", win = "#66bd90", loss = "#d0685c", ivoryDim="rgba(244,239,226,0.58)", line="rgba(244,239,226,0.14)";
  const labels = stats.cumulative.map(c=>c.label);

  if(cumulativeChart) cumulativeChart.destroy();
  const ctx1 = document.getElementById("chart-cumulative").getContext("2d");
  const gradient = ctx1.createLinearGradient(0,0,0,220);
  gradient.addColorStop(0, "rgba(102,189,144,0.45)");
  gradient.addColorStop(1, "rgba(102,189,144,0.02)");
  cumulativeChart = new Chart(ctx1, {
    type: "line",
    data: { labels, datasets: [{ data: stats.cumulative.map(c=>c.cumulative), borderColor: gold, backgroundColor: gradient, fill:true, tension:0.35, pointRadius:0, borderWidth:2 }] },
    options: {
      responsive:true,
      plugins:{ legend:{display:false}, tooltip:{ callbacks:{ label:(c)=>` ${fmtMoney(c.parsed.y,true)}` }, backgroundColor:"#17493a", borderColor:"rgba(201,162,75,0.4)", borderWidth:1, titleFont:{family:"IBM Plex Mono"}, bodyFont:{family:"IBM Plex Mono"} } },
      scales:{
        x:{ ticks:{ color: ivoryDim, font:{family:"IBM Plex Mono", size:11} }, grid:{ color:"transparent" } },
        y:{ ticks:{ color: ivoryDim, font:{family:"IBM Plex Mono", size:11}, callback:(v)=>"$"+v.toLocaleString() }, grid:{ color: line } }
      }
    }
  });

  if(monthlyChart) monthlyChart.destroy();
  const ctx2 = document.getElementById("chart-monthly").getContext("2d");
  monthlyChart = new Chart(ctx2, {
    type: "bar",
    data: { labels, datasets: [{ data: stats.cumulative.map(c=>c.monthTotal), backgroundColor: stats.cumulative.map(c=>c.monthTotal>=0?win:loss), borderRadius:3 }] },
    options: {
      responsive:true,
      plugins:{ legend:{display:false}, tooltip:{ callbacks:{ label:(c)=>` ${fmtMoney(c.parsed.y,true)}` }, backgroundColor:"#17493a", borderColor:"rgba(201,162,75,0.4)", borderWidth:1, titleFont:{family:"IBM Plex Mono"}, bodyFont:{family:"IBM Plex Mono"} } },
      scales:{
        x:{ ticks:{ color: ivoryDim, font:{family:"IBM Plex Mono", size:11} }, grid:{ color:"transparent" } },
        y:{ ticks:{ color: ivoryDim, font:{family:"IBM Plex Mono", size:11}, callback:(v)=>"$"+v.toLocaleString() }, grid:{ color: line } }
      }
    }
  });
}

// ---------- handlers ----------
function attachHandlers(){
  const app = document.getElementById("app");

  app.querySelectorAll('[data-action="tab"]').forEach(btn=>{
    btn.onclick = ()=>{ activeTab = btn.dataset.tab; expandedId=null; editingId=null; render(); };
  });

  const filterSel = document.getElementById("loc-filter");
  if(filterSel) filterSel.onchange = (e)=>{ locFilter = e.target.value; render(); };

  const toggleAdd = app.querySelector('[data-action="toggle-add"]');
  if(toggleAdd) toggleAdd.onclick = ()=>{ showAddForm = !showAddForm; formError=""; render(); };

  const saveNew = app.querySelector('[data-action="save-new"]');
  if(saveNew) saveNew.onclick = ()=>{
    const location = document.getElementById("new-location").value.trim();
    const monthKey = document.getElementById("new-month").value;
    const amountRaw = document.getElementById("new-amount").value;
    const notes = document.getElementById("new-notes").value.trim();
    const amt = parseFloat(amountRaw);
    if(!location){ formError = "Enter where you played."; render(); return; }
    if(!monthKey){ formError = "Pick a month."; render(); return; }
    if(amountRaw==="" || isNaN(amt)){ formError = "Enter a result (use a minus sign for a loss)."; render(); return; }
    sessions.push({ id: uid(), location, monthKey, monthLabel: monthKeyToLabel(monthKey), amount: amt, notes });
    saveData();
    formError = ""; showAddForm = false;
    render();
  };

  app.querySelectorAll('[data-action="expand"]').forEach(btn=>{
    btn.onclick = ()=>{ const id = btn.dataset.id; expandedId = expandedId===id?null:id; editingId=null; render(); };
  });

  app.querySelectorAll('[data-action="delete"]').forEach(btn=>{
    btn.onclick = ()=>{
      sessions = sessions.filter(s=>s.id!==btn.dataset.id);
      saveData();
      if(expandedId===btn.dataset.id) expandedId=null;
      render();
    };
  });

  app.querySelectorAll('[data-action="start-edit"]').forEach(btn=>{
    btn.onclick = ()=>{ editingId = btn.dataset.id; render(); };
  });

  const cancelEdit = app.querySelector('[data-action="cancel-edit"]');
  if(cancelEdit) cancelEdit.onclick = ()=>{ editingId = null; render(); };

  app.querySelectorAll('[data-action="save-edit"]').forEach(btn=>{
    btn.onclick = ()=>{
      const id = btn.dataset.id;
      const location = document.getElementById("edit-location").value.trim();
      const monthKey = document.getElementById("edit-month").value;
      const amt = parseFloat(document.getElementById("edit-amount").value);
      if(!location || !monthKey || isNaN(amt)) return;
      sessions = sessions.map(s=> s.id===id ? {...s, location, monthKey, monthLabel: monthKeyToLabel(monthKey), amount: amt} : s);
      saveData();
      editingId = null;
      render();
    };
  });

  app.querySelectorAll('[data-action="notes"]').forEach(ta=>{
    ta.oninput = ()=>{
      const id = ta.dataset.id;
      const s = sessions.find(s=>s.id===id);
      if(s) s.notes = ta.value;
    };
    ta.onblur = ()=>{ saveData(); };
  });
}

// ---------- init ----------
loadData();
render();
