/* ============================================================
   Jomin & Malu Expense Diary — shared app logic (multi-page)
   Data lives in Supabase (Postgres). See js/config.js for setup.
   ============================================================ */

/* ===================== Icons & categories ===================== */
const ICONS = {
  "Groceries": '<circle cx="9" cy="20" r="1.3"/><circle cx="17" cy="20" r="1.3"/><path d="M2 3h2l2.4 12.2a2 2 0 0 0 2 1.6h7.4a2 2 0 0 0 2-1.6L20 7H6"/>',
  "Bills & Utilities": '<polygon points="12,2 4,14 11,14 10,22 20,9 13,9"/>',
  "Food & Dining": '<path d="M6 2v7a2 2 0 0 0 4 0V2M8 2v20M16 2c-1.2 1.5-2 3-2 5s.8 3.5 2 5v10"/>',
  "Transport": '<path d="M3 13l1.5-4.5A2 2 0 0 1 6.4 7h11.2a2 2 0 0 1 1.9 1.5L21 13"/><rect x="2" y="13" width="20" height="6" rx="1.5"/><circle cx="7" cy="19" r="1.4"/><circle cx="17" cy="19" r="1.4"/>',
  "Shopping": '<path d="M6 8h12l-1 12H7L6 8z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>',
  "Entertainment": '<circle cx="12" cy="12" r="9"/><polygon points="10,8.5 16,12 10,15.5"/>',
  "Health": '<path d="M12 20s-7-4.6-9.3-9.1C1.2 7.9 2.9 4.7 6 4.2c2-.3 3.6.9 6 3.5 2.4-2.6 4-3.8 6-3.5 3.1.5 4.8 3.7 3.3 6.7C19 15.4 12 20 12 20z"/>',
  "Rent": '<path d="M4 11l8-7 8 7"/><path d="M6 10v10h12V10"/>',
  "Subscriptions": '<path d="M4 4v5h5M20 20v-5h-5"/><path d="M20 9a8 8 0 0 0-14.3-4.3M4 15a8 8 0 0 0 14.3 4.3"/>',
  "Education": '<path d="M4 5a2 2 0 0 1 2-2h6v18H6a2 2 0 0 1-2-2z"/><path d="M20 5a2 2 0 0 0-2-2h-6v18h6a2 2 0 0 0 2-2z"/>',
  "Miscellaneous": '<circle cx="6" cy="6" r="1.5"/><circle cx="12" cy="6" r="1.5"/><circle cx="18" cy="6" r="1.5"/><circle cx="6" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="18" cy="12" r="1.5"/><circle cx="6" cy="18" r="1.5"/><circle cx="12" cy="18" r="1.5"/><circle cx="18" cy="18" r="1.5"/>',
  "Salary": '<rect x="3" y="8" width="18" height="12" rx="2"/><path d="M8 8V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>',
  "Freelance": '<rect x="4" y="4" width="16" height="10" rx="1"/><path d="M2 20h20l-2-4H4l-2 4z"/>',
  "Business": '<rect x="4" y="3" width="16" height="18"/><path d="M8 7h2M14 7h2M8 11h2M14 11h2M8 15h2M14 15h2"/>',
  "Gifts": '<rect x="3" y="8" width="18" height="13"/><path d="M3 8h18M12 8v13"/><path d="M12 8c-1.5-4-6-4-6 0M12 8c1.5-4 6-4 6 0"/>',
  "Other Income": '<polygon points="12,2 14.9,8.6 22,9.3 16.7,14 18.2,21 12,17.3 5.8,21 7.3,14 2,9.3 9.1,8.6"/>'
};
const EXPENSE_CATS = ["Groceries","Bills & Utilities","Food & Dining","Transport","Shopping","Entertainment","Health","Rent","Subscriptions","Education","Miscellaneous"];
const INCOME_CATS = ["Salary","Freelance","Business","Gifts","Other Income"];
const CAT_COLORS = ["#1E6B4E","#C97452","#C9A03D","#4C7A94","#8B6BB0","#3E8E7E","#B0574F","#6E8C4A","#A88B3F","#4E6E8C","#7A6E5E"];
function iconSvg(name, size=16){ return `<svg viewBox="0 0 24 24" width="${size}" height="${size}">${ICONS[name]||ICONS["Miscellaneous"]}</svg>`; }

const fmt = n => '₹' + Number(n||0).toLocaleString('en-IN',{maximumFractionDigits:0});
const monthKey = d => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
const monthLabelStr = d => d.toLocaleDateString('en-IN',{month:'long', year:'numeric'});

/* ===================== View month (persisted locally per device) ===================== */
function getViewMonth(){
  const saved = localStorage.getItem('jm-diary:viewMonth');
  const d = saved ? new Date(saved+'-01T00:00:00') : new Date();
  d.setDate(1);
  return d;
}
function setViewMonthState(d){ localStorage.setItem('jm-diary:viewMonth', monthKey(d)); }
let viewMonth = getViewMonth();

/* ===================== Supabase data layer ===================== */
const CONFIG_OK = window.SUPABASE_URL && window.SUPABASE_ANON_KEY &&
  !window.SUPABASE_URL.includes('PASTE_YOUR') && !window.SUPABASE_ANON_KEY.includes('PASTE_YOUR');
const sb = CONFIG_OK && window.supabase ? window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY) : null;

let transactions = [];
let budgets = {};

async function loadAllData(){
  if(!sb) return;
  const [{data: txRows, error: txErr}, {data: bgRows, error: bgErr}] = await Promise.all([
    sb.from('transactions').select('*').order('date', {ascending:false}),
    sb.from('budgets').select('*')
  ]);
  if(txErr) console.error('Load transactions failed:', txErr);
  if(bgErr) console.error('Load budgets failed:', bgErr);
  transactions = (txRows||[]).map(r=>({id:r.id, type:r.type, amount:Number(r.amount), category:r.category, date:r.date, note:r.note||''}));
  budgets = {};
  (bgRows||[]).forEach(r=>{ budgets[r.category] = Number(r.amount); });
}

async function dbAddTransaction(tx){
  const {data, error} = await sb.from('transactions').insert({
    type: tx.type, amount: tx.amount, category: tx.category, date: tx.date, note: tx.note||null
  }).select().single();
  if(error){ console.error(error); throw error; }
  return data;
}
async function dbUpdateTransaction(id, tx){
  const {error} = await sb.from('transactions').update({
    type: tx.type, amount: tx.amount, category: tx.category, date: tx.date, note: tx.note||null
  }).eq('id', id);
  if(error){ console.error(error); throw error; }
}
async function dbDeleteTransaction(id){
  const {error} = await sb.from('transactions').delete().eq('id', id);
  if(error){ console.error(error); throw error; }
}
async function dbSaveBudgets(newBudgets){
  const upserts = Object.entries(newBudgets).map(([category, amount])=>({category, amount}));
  const keep = Object.keys(newBudgets);
  if(upserts.length){
    const {error} = await sb.from('budgets').upsert(upserts, {onConflict:'category'});
    if(error){ console.error(error); throw error; }
  }
  const toRemove = EXPENSE_CATS.filter(c=>!keep.includes(c));
  if(toRemove.length){
    const {error} = await sb.from('budgets').delete().in('category', toRemove);
    if(error) console.error(error);
  }
}

/* ===================== Toast ===================== */
function showToast(msg){
  let el = document.getElementById('appToast');
  if(!el){
    el = document.createElement('div');
    el.id = 'appToast';
    el.className = 'toast';
    document.body.appendChild(el);
  }
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(el._t);
  el._t = setTimeout(()=>el.classList.remove('show'), 2200);
}

/* ===================== Navigation shell ===================== */
const PAGES = [
  {id:'dashboard', href:'index.html', label:'Dashboard', short:'Home', icon:'<rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/>'},
  {id:'budgets', href:'budgets.html', label:'Budgets', short:'Budgets', icon:'<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 10h18"/>'},
  {id:'transactions', href:'transactions.html', label:'Transactions', short:'Entries', icon:'<path d="M4 5a2 2 0 0 1 2-2h6v18H6a2 2 0 0 1-2-2z"/><path d="M20 5a2 2 0 0 0-2-2h-6v18h6a2 2 0 0 0 2-2z"/>'},
  {id:'insights', href:'insights.html', label:'Insights', short:'Insights', icon:'<path d="M12 20s-7-4.6-9.3-9.1C1.2 7.9 2.9 4.7 6 4.2c2-.3 3.6.9 6 3.5 2.4-2.6 4-3.8 6-3.5 3.1.5 4.8 3.7 3.3 6.7C19 15.4 12 20 12 20z"/>'}
];

function buildShell(activePage){
  // Desktop sidebar
  const sidebar = document.getElementById('shell-sidebar');
  if(sidebar){
    sidebar.innerHTML = `
      <div class="brand">
        <div class="brand-mark"><svg viewBox="0 0 24 24"><path d="M12 19c-4-2-6-6-5-11 5-1 9 1 10 6 .7 3.6-2 6-5 5z"/><path d="M9.5 14c2-2.7 4-4 6-6"/></svg></div>
        <div class="brand-text"><div class="t1">Jomin &amp; Malu</div><div class="t2">Expense Diary</div></div>
      </div>
      <nav class="nav">
        ${PAGES.map(p=>`<a class="nav-item ${p.id===activePage?'active':''}" href="${p.href}"><svg viewBox="0 0 24 24">${p.icon}</svg>${p.label}</a>`).join('')}
      </nav>
      <div class="sidebar-spacer"></div>
      <div class="month-nav">
        <div class="label">Viewing</div>
        <div class="row">
          <button onclick="shiftMonth(-1)" aria-label="Previous month"><svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg></button>
          <span id="monthLabel">—</span>
          <button onclick="shiftMonth(1)" aria-label="Next month"><svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg></button>
        </div>
      </div>
      <button class="add-btn" onclick="handleAddClick()">
        <svg viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        Add entry
      </button>`;
  }
  // Mobile top bar
  const topbar = document.getElementById('shell-mobile-topbar');
  if(topbar){
    topbar.innerHTML = `
      <div class="mt-brand">
        <div class="mt-mark"><svg viewBox="0 0 24 24"><path d="M12 19c-4-2-6-6-5-11 5-1 9 1 10 6 .7 3.6-2 6-5 5z"/><path d="M9.5 14c2-2.7 4-4 6-6"/></svg></div>
        <div><div class="t1">Jomin &amp; Malu</div><div class="t2">Expense Diary</div></div>
      </div>
      <div class="mt-month">
        <button onclick="shiftMonth(-1)" aria-label="Previous month"><svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg></button>
        <span id="monthLabelMobile">—</span>
        <button onclick="shiftMonth(1)" aria-label="Next month"><svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg></button>
      </div>`;
  }
  // Bottom nav: Home, Budgets, [FAB], Transactions, Insights
  const bottomNav = document.getElementById('shell-bottom-nav');
  if(bottomNav){
    const link = p => `<a class="bn-item ${p.id===activePage?'active':''}" href="${p.href}"><svg viewBox="0 0 24 24">${p.icon}</svg>${p.short}</a>`;
    const fab = `<button class="bn-fab" onclick="handleAddClick()" aria-label="Add entry"><svg viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg></button>`;
    const byId = id => PAGES.find(p=>p.id===id);
    bottomNav.innerHTML = link(byId('dashboard')) + link(byId('budgets')) + fab + link(byId('transactions')) + link(byId('insights'));
  }
  updateMonthLabels();
}
function updateMonthLabels(){
  const l1 = document.getElementById('monthLabel');
  const l2 = document.getElementById('monthLabelMobile');
  if(l1) l1.textContent = monthLabelStr(viewMonth);
  if(l2) l2.textContent = viewMonth.toLocaleDateString('en-IN',{month:'short', year:'numeric'});
}
function handleAddClick(){
  if(typeof openTxModal === 'function' && document.getElementById('txOverlay')){
    openTxModal();
  } else {
    window.location.href = 'transactions.html?add=1';
  }
}
async function shiftMonth(delta){
  viewMonth.setMonth(viewMonth.getMonth()+delta);
  setViewMonthState(viewMonth);
  updateMonthLabels();
  if(typeof onMonthChanged === 'function') await onMonthChanged();
}

/* ===================== Shared computation ===================== */
function txForMonth(d){
  const k = monthKey(d);
  return transactions.filter(t => t.date && t.date.slice(0,7)===k);
}
function computeTotals(list){
  const income = list.filter(t=>t.type==='income').reduce((s,t)=>s+t.amount,0);
  const expense = list.filter(t=>t.type==='expense').reduce((s,t)=>s+t.amount,0);
  return {income, expense, net: income-expense};
}
function categoryBreakdown(list){
  const map = {};
  list.filter(t=>t.type==='expense').forEach(t=>{ map[t.category]=(map[t.category]||0)+t.amount; });
  return Object.entries(map).sort((a,b)=>b[1]-a[1]);
}

/* ===================== Shared chart renderers ===================== */
function renderPlant(rate){
  const el = document.getElementById('plantSvgWrap');
  if(!el) return;
  const clamped = Math.max(0, Math.min(100, rate));
  const leafOpacity = i => clamped >= i*20 ? 1 : 0.18;
  const stemH = 8 + Math.min(30, clamped*0.3);
  el.innerHTML = `
  <svg viewBox="0 0 56 64" width="56" height="64">
    <ellipse cx="28" cy="58" rx="16" ry="4" fill="#E4F1E7"/>
    <path d="M16 58 L20 40 L36 40 L40 58 Z" fill="#1E6B4E"/>
    <rect x="16" y="36" width="24" height="6" rx="2" fill="#164F3A"/>
    <line x1="28" y1="${40-stemH}" x2="28" y2="40" stroke="#2F9160" stroke-width="2.4" stroke-linecap="round"/>
    <path opacity="${leafOpacity(1)}" d="M28 ${37-stemH*0.3} q-9 -2 -11 -9 q9 -1 12 6 z" fill="#3E9E6F"/>
    <path opacity="${leafOpacity(2)}" d="M28 ${34-stemH*0.55} q9 -2 11 -9 q-9 -1 -12 6 z" fill="#2F9160"/>
    <path opacity="${leafOpacity(3)}" d="M28 ${30-stemH*0.8} q-8 -1 -10 -7 q8 -1 11 5 z" fill="#57B187"/>
    <path opacity="${leafOpacity(4)}" d="M28 ${40-stemH} q0 -6 4 -9 q3 5 -1 10 z" fill="#2F9160"/>
    <path opacity="${leafOpacity(5)}" d="M28 ${40-stemH} q0 -6 -4 -9 q-3 5 1 10 z" fill="#3E9E6F"/>
  </svg>`;
}
function renderDonut(breakdown, total){
  const area = document.getElementById('donutArea');
  if(!area) return;
  if(breakdown.length===0){
    area.innerHTML = '<div class="empty-note">No expenses logged this month yet.</div>';
    return;
  }
  const r = 52, cx=64, cy=64, C = 2*Math.PI*r;
  let offset = 0;
  let circles = '';
  breakdown.forEach((entry,i)=>{
    const [cat, amt] = entry;
    const frac = amt/total;
    const len = frac*C;
    circles += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${CAT_COLORS[i%CAT_COLORS.length]}" stroke-width="16" stroke-dasharray="${len} ${C-len}" stroke-dashoffset="${-offset}" transform="rotate(-90 ${cx} ${cy})"/>`;
    offset += len;
  });
  const legend = breakdown.map((entry,i)=>{
    const [cat,amt] = entry;
    return `<div class="legend-row"><span class="legend-dot" style="background:${CAT_COLORS[i%CAT_COLORS.length]}"></span><span class="name">${cat}</span><span class="amt">${fmt(amt)}</span></div>`;
  }).join('');
  area.innerHTML = `
    <div class="donut-wrap">
      <svg viewBox="0 0 128 128" width="140" height="140">${circles}
        <text x="64" y="60" text-anchor="middle" font-family="IBM Plex Mono" font-size="11" fill="#6E7C73">Total</text>
        <text x="64" y="76" text-anchor="middle" font-family="Fraunces" font-weight="600" font-size="15" fill="#1C2B22">${fmt(total)}</text>
      </svg>
      <div class="legend">${legend}</div>
    </div>`;
}
function renderTrend(){
  const area = document.getElementById('trendArea');
  if(!area) return;
  const months = [];
  for(let i=5;i>=0;i--){
    const d = new Date(viewMonth.getFullYear(), viewMonth.getMonth()-i, 1);
    months.push(d);
  }
  const data = months.map(d=>({d, ...computeTotals(txForMonth(d))}));
  const max = Math.max(1, ...data.map(x=>Math.max(x.income,x.expense)));
  const w=440,h=160,barW=22,gap=48;
  let bars = '';
  data.forEach((x,i)=>{
    const gx = 20 + i*gap*1.35;
    const incH = (x.income/max)*120;
    const expH = (x.expense/max)*120;
    bars += `
      <rect x="${gx}" y="${130-incH}" width="${barW}" height="${incH}" rx="3" fill="#1E6B4E"/>
      <rect x="${gx+barW+4}" y="${130-expH}" width="${barW}" height="${expH}" rx="3" fill="#C97452"/>
      <text x="${gx+barW+2}" y="148" text-anchor="middle" font-family="Public Sans" font-size="10" fill="#6E7C73">${x.d.toLocaleDateString('en-IN',{month:'short'})}</text>
    `;
  });
  area.innerHTML = `<svg viewBox="0 0 ${w} 160" width="100%" height="170">${bars}</svg>`;
}
function renderBudgets(list){
  const area = document.getElementById('budgetsArea');
  if(!area) return;
  const spend = {};
  list.filter(t=>t.type==='expense').forEach(t=>{ spend[t.category]=(spend[t.category]||0)+t.amount; });
  const catsWithBudget = EXPENSE_CATS.filter(c=>budgets[c]);
  if(catsWithBudget.length===0){
    area.innerHTML = `<div class="empty-note" style="text-align:left;padding:6px 0 4px;">No budgets set yet. Add one so your diary can tell you when to slow down.</div>`;
    return;
  }
  area.innerHTML = catsWithBudget.map(c=>{
    const spent = spend[c]||0;
    const budget = budgets[c];
    const pct = Math.min(100, Math.round((spent/budget)*100));
    const color = pct>=100 ? 'var(--danger)' : pct>=80 ? 'var(--clay)' : 'var(--primary)';
    return `
      <div class="budget-row">
        <div class="budget-top">
          <span class="cat">${iconSvg(c,15)}${c}</span>
          <span class="amt">${fmt(spent)} / ${fmt(budget)}</span>
        </div>
        <div class="bar-track"><div class="bar-fill" style="width:${pct}%;background:${color};"></div></div>
      </div>`;
  }).join('');
}

/* ===================== Insights & tips ===================== */
function generateInsights(list, prevList, totals){
  const notes = [];
  const spend = {};
  list.filter(t=>t.type==='expense').forEach(t=>{ spend[t.category]=(spend[t.category]||0)+t.amount; });
  const prevSpend = {};
  prevList.filter(t=>t.type==='expense').forEach(t=>{ prevSpend[t.category]=(prevSpend[t.category]||0)+t.amount; });

  const now = new Date();
  const isCurrentMonth = monthKey(viewMonth)===monthKey(now);
  const daysInMonth = new Date(viewMonth.getFullYear(), viewMonth.getMonth()+1, 0).getDate();
  const daysLeft = isCurrentMonth ? Math.max(0, daysInMonth - now.getDate()) : null;

  EXPENSE_CATS.forEach(c=>{
    if(!budgets[c]) return;
    const spent = spend[c]||0;
    const pct = Math.round((spent/budgets[c])*100);
    if(pct>=100){
      notes.push({tag:'Over budget', cls:'warn', text:`You've gone past your ${c} budget by ${fmt(spent-budgets[c])}. Might be worth a closer look before month-end.`});
    } else if(pct>=80){
      const dayText = daysLeft!==null ? ` with ${daysLeft} day${daysLeft===1?'':'s'} left` : '';
      notes.push({tag:'Getting close', cls:'warn', text:`${c} is already at ${pct}% of its ${fmt(budgets[c])} budget${dayText}.`});
    }
  });

  const topCats = Object.entries(spend).sort((a,b)=>b[1]-a[1]).slice(0,2);
  topCats.forEach(([cat, amt])=>{
    const prevAmt = prevSpend[cat]||0;
    if(prevAmt>0){
      const change = Math.round(((amt-prevAmt)/prevAmt)*100);
      if(Math.abs(change)>=15){
        notes.push({tag: change>0?'Trending up':'Trending down', cls: change>0?'warn':'', text:`${cat} spending is ${change>0?'up':'down'} ${Math.abs(change)}% compared to last month.`});
      }
    }
  });

  if(totals.income>0){
    const rate = Math.round((totals.net/totals.income)*100);
    if(rate>=20){
      notes.push({tag:'Nicely done', cls:'gold', text:`You're saving ${rate}% of your income this month — well above the 20% mark most planners aim for.`});
    } else if(rate>=0){
      notes.push({tag:'Room to grow', cls:'', text:`You're keeping ${rate}% of your income this month. Trimming your top category a little could push this higher.`});
    } else {
      notes.push({tag:'Spending more than earning', cls:'warn', text:`Expenses are ${fmt(Math.abs(totals.net))} more than income this month. Worth pausing non-essential spending.`});
    }
  } else if(totals.expense>0){
    notes.push({tag:'No income logged', cls:'warn', text:`You've logged ${fmt(totals.expense)} in expenses but no income yet for this month.`});
  }

  if(Object.keys(budgets).length===0){
    notes.push({tag:'Tip', cls:'gold', text:`You haven't set any budgets yet. Add a few and your diary will start flagging overspending automatically.`});
  }
  if(notes.length===0){
    notes.push({tag:'All quiet', cls:'', text:`Nothing to flag this month. Keep logging entries and I'll keep watching your numbers.`});
  }
  return notes;
}
function renderInsights(notes){
  const el = document.getElementById('insightsArea');
  if(!el) return;
  el.innerHTML = notes.map(n=>`
    <div class="note ${n.cls}">
      <span class="tag">${n.tag}</span>
      <p>${n.text}</p>
    </div>`).join('');
}
const TIP_LIBRARY = {
  "Groceries":"Plan meals for the week and shop with a list — impulse buys often add 15–20% to grocery bills.",
  "Food & Dining":"Try cooking at home a couple of extra days a week; eating out usually costs 3–5x more per meal.",
  "Bills & Utilities":"Switch off standby appliances and compare utility plans once a year.",
  "Shopping":"Give non-essential purchases a 24-hour wait before buying.",
  "Entertainment":"Rotate subscriptions instead of running several at once.",
  "Transport":"Combine errands into one trip, or explore carpooling for regular commutes.",
  "Subscriptions":"Audit subscriptions every quarter — cancel anything unused in the last 30 days.",
  "Health":"Preventive check-ups can be cheaper than treatment later — compare routine costs across providers.",
  "Rent":"If rent is over 30% of income, it may be worth reviewing housing options at your next renewal.",
  "Education":"Look for annual plans or scholarships instead of paying monthly.",
  "Miscellaneous":"Track 'miscellaneous' closely — vague categories often hide the most avoidable spending."
};
const GENERAL_TIPS = [
  "Automate a fixed transfer to savings right after you're paid, before spending starts.",
  "Review your top 3 spending categories every Sunday — five minutes is usually enough.",
  "Keep a small buffer for irregular costs (birthdays, repairs) so they don't derail your budget."
];
function renderTips(list){
  const el = document.getElementById('tipsArea');
  if(!el) return;
  const spend = {};
  list.filter(t=>t.type==='expense').forEach(t=>{ spend[t.category]=(spend[t.category]||0)+t.amount; });
  const top = Object.entries(spend).sort((a,b)=>b[1]-a[1])[0];
  const tips = [];
  if(top && TIP_LIBRARY[top[0]]) tips.push(TIP_LIBRARY[top[0]]);
  tips.push(...GENERAL_TIPS.slice(0, top ? 2 : 3));
  el.innerHTML = tips.map(t=>`
    <div class="tip"><svg viewBox="0 0 24 24"><path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="9"/></svg><span>${t}</span></div>
  `).join('');
}

/* ===================== Transaction table ===================== */
function renderTable(list){
  const body = document.getElementById('txTableBody');
  const empty = document.getElementById('txEmpty');
  if(!body) return;
  const sorted = [...list].sort((a,b)=> b.date.localeCompare(a.date));
  if(sorted.length===0){
    body.innerHTML=''; if(empty) empty.style.display='block'; return;
  }
  if(empty) empty.style.display='none';
  body.innerHTML = sorted.map(t=>`
    <tr>
      <td><div class="tx-cat"><span class="ic">${iconSvg(t.category,14)}</span>${t.category}</div></td>
      <td>${new Date(t.date+'T00:00:00').toLocaleDateString('en-IN',{day:'2-digit',month:'short'})}</td>
      <td class="tx-note">${t.note||''}</td>
      <td class="tx-amt ${t.type==='income'?'in':'out'}">${t.type==='income'?'+':'-'}${fmt(t.amount)}</td>
      <td>
        <div class="tx-actions">
          <button class="icon-btn" onclick='editTx("${t.id}")' aria-label="Edit"><svg viewBox="0 0 24 24"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/></svg></button>
          <button class="icon-btn" onclick='deleteTx("${t.id}")' aria-label="Delete"><svg viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/></svg></button>
        </div>
      </td>
    </tr>
  `).join('');
}

/* ===================== Transaction modal (present on index.html & transactions.html) ===================== */
let txType = 'expense';
let editingTxId = null;
function populateCategorySelect(){
  const sel = document.getElementById('txCategory');
  if(!sel) return;
  const cats = txType === 'income' ? INCOME_CATS : EXPENSE_CATS;
  sel.innerHTML = cats.map(c=>`<option value="${c}">${c}</option>`).join('');
}
function setTxType(type){
  txType = type;
  document.getElementById('toggleIncome').className = type==='income' ? 'active-in' : '';
  document.getElementById('toggleExpense').className = type==='expense' ? 'active-out' : '';
  populateCategorySelect();
}
function openTxModal(existing){
  editingTxId = existing ? existing.id : null;
  document.getElementById('txModalTitle').textContent = existing ? 'Edit entry' : 'New entry';
  setTxType(existing ? existing.type : 'expense');
  document.getElementById('txAmount').value = existing ? existing.amount : '';
  document.getElementById('txDate').value = existing ? existing.date : new Date().toISOString().slice(0,10);
  document.getElementById('txNote').value = existing ? (existing.note||'') : '';
  populateCategorySelect();
  if(existing) document.getElementById('txCategory').value = existing.category;
  document.getElementById('txOverlay').classList.add('show');
}
function closeTxModal(){ document.getElementById('txOverlay').classList.remove('show'); }
async function saveTx(){
  const amount = parseFloat(document.getElementById('txAmount').value);
  const category = document.getElementById('txCategory').value;
  const date = document.getElementById('txDate').value;
  const note = document.getElementById('txNote').value.trim();
  if(!amount || amount<=0 || !date){ alert('Please enter a valid amount and date.'); return; }
  const btn = document.querySelector('#txOverlay .btn-primary');
  if(btn){ btn.disabled = true; btn.textContent = 'Saving…'; }
  try{
    if(editingTxId){
      await dbUpdateTransaction(editingTxId, {type:txType, amount, category, date, note});
      const t = transactions.find(t=>t.id===editingTxId);
      if(t) Object.assign(t,{type:txType, amount, category, date, note});
    } else {
      const row = await dbAddTransaction({type:txType, amount, category, date, note});
      transactions.push({id:row.id, type:row.type, amount:Number(row.amount), category:row.category, date:row.date, note:row.note||''});
    }
    closeTxModal();
    showToast(editingTxId ? 'Entry updated' : 'Entry added');
    if(typeof onDataChanged === 'function') await onDataChanged();
  }catch(e){
    alert('Could not save this entry. Check your Supabase setup and try again.');
  }finally{
    if(btn){ btn.disabled = false; btn.textContent = 'Save entry'; }
  }
}
async function deleteTx(id){
  if(!confirm('Delete this entry?')) return;
  try{
    await dbDeleteTransaction(id);
    transactions = transactions.filter(t=>t.id!==id);
    showToast('Entry deleted');
    if(typeof onDataChanged === 'function') await onDataChanged();
  }catch(e){
    alert('Could not delete this entry.');
  }
}
function editTx(id){ openTxModal(transactions.find(t=>t.id===id)); }

/* ===================== Budget modal (budgets.html only) ===================== */
function openBudgetModal(){
  const area = document.getElementById('budgetFieldsArea');
  area.innerHTML = EXPENSE_CATS.map(c=>`
    <div class="budget-field">
      <div class="ic">${iconSvg(c,15)}</div>
      <div class="name">${c}</div>
      <input type="number" min="0" step="1" data-cat="${c}" value="${budgets[c]||''}" placeholder="0">
    </div>
  `).join('');
  document.getElementById('budgetOverlay').classList.add('show');
}
function closeBudgetModal(){ document.getElementById('budgetOverlay').classList.remove('show'); }
async function saveBudgets(){
  const newBudgets = {};
  document.querySelectorAll('#budgetFieldsArea input').forEach(inp=>{
    const v = parseFloat(inp.value);
    if(v>0) newBudgets[inp.dataset.cat] = v;
  });
  const btn = document.querySelector('#budgetOverlay .btn-primary');
  if(btn){ btn.disabled = true; btn.textContent = 'Saving…'; }
  try{
    await dbSaveBudgets(newBudgets);
    budgets = newBudgets;
    closeBudgetModal();
    showToast('Budgets saved');
    if(typeof onDataChanged === 'function') await onDataChanged();
  }catch(e){
    alert('Could not save budgets. Check your Supabase setup and try again.');
  }finally{
    if(btn){ btn.disabled = false; btn.textContent = 'Save budgets'; }
  }
}

/* ===================== Config banner ===================== */
function renderConfigBannerIfNeeded(){
  if(CONFIG_OK) return;
  const holder = document.getElementById('configBanner');
  if(!holder) return;
  holder.innerHTML = `<div class="config-banner">
    <strong>Not connected to a database yet.</strong> Open <code>js/config.js</code> and paste in your Supabase
    Project URL and anon key (Settings → API in your Supabase dashboard), then reload this page.
    Until then your entries won't be saved.
  </div>`;
}
