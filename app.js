:root{
  --bg:#F6F9F4;
  --surface:#FFFFFF;
  --surface-alt:#EEF4EA;
  --primary:#1E6B4E;
  --primary-dark:#164F3A;
  --primary-light:#E4F1E7;
  --clay:#C97452;
  --clay-light:#F7E9E1;
  --gold:#C9A03D;
  --ink:#1C2B22;
  --muted:#6E7C73;
  --border:#E1E8DC;
  --danger:#C4553E;
  --success:#2F9160;
  --radius-lg:20px;
  --radius-md:14px;
  --radius-sm:9px;
  --shadow:0 2px 10px rgba(28,43,34,0.05), 0 10px 30px rgba(28,43,34,0.04);
  --bottom-nav-h:64px;
  --safe-top:env(safe-area-inset-top,0px);
  --safe-bottom:env(safe-area-inset-bottom,0px);
}
*{box-sizing:border-box;-webkit-tap-highlight-color:transparent;}
html,body{margin:0;padding:0;}
html{-webkit-text-size-adjust:100%;}
body{
  background:var(--bg);
  color:var(--ink);
  font-family:'Public Sans', sans-serif;
  -webkit-font-smoothing:antialiased;
  min-height:100vh;
  overscroll-behavior-y:none;
  overflow-x:hidden;
}
.mobile-topbar,.bottom-nav{display:none;}
.app{
  display:grid;
  grid-template-columns:240px 1fr;
  min-height:100vh;
}
::selection{background:var(--primary-light);}
button{font-family:inherit;cursor:pointer;}
input,select{font-family:inherit;}

/* ---------- Sidebar ---------- */
.sidebar{
  background:var(--primary-dark);
  color:#EAF4EE;
  padding:28px 20px;
  display:flex;
  flex-direction:column;
  gap:36px;
  position:sticky;
  top:0;
  height:100vh;
}
.brand{display:flex;align-items:center;gap:11px;}
.brand-mark{
  width:38px;height:38px;border-radius:11px;
  background:rgba(255,255,255,0.12);
  display:flex;align-items:center;justify-content:center;
  flex-shrink:0;
}
.brand-mark svg{width:22px;height:22px;stroke:#EAF4EE;fill:none;stroke-width:1.6;stroke-linecap:round;stroke-linejoin:round;}
.brand-text{line-height:1.15;}
.brand-text .t1{font-family:'Fraunces',serif;font-weight:600;font-size:15.5px;letter-spacing:0.2px;}
.brand-text .t2{font-family:'Fraunces',serif;font-style:italic;font-weight:400;font-size:12px;color:#B9D6C4;}

.nav{display:flex;flex-direction:column;gap:4px;margin-top:-8px;}
.nav-item{
  display:flex;align-items:center;gap:11px;
  padding:10px 12px;border-radius:10px;
  color:#CFE4D8;font-size:14px;font-weight:600;
  background:transparent;border:none;text-align:left;
  transition:background 0.15s ease, color 0.15s ease;
}
.nav-item svg{width:17px;height:17px;stroke:currentColor;fill:none;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round;flex-shrink:0;}
.nav-item:hover{background:rgba(255,255,255,0.08);color:#fff;}
.nav-item.active{background:rgba(255,255,255,0.14);color:#fff;}

.sidebar-spacer{flex:1;}
.month-nav{
  background:rgba(255,255,255,0.07);
  border-radius:12px;padding:12px 14px;
}
.month-nav .label{font-size:10.5px;text-transform:uppercase;letter-spacing:0.09em;color:#9FC4AF;font-weight:700;margin-bottom:6px;}
.month-nav .row{display:flex;align-items:center;justify-content:space-between;}
.month-nav .row span{font-family:'Fraunces',serif;font-weight:600;font-size:15px;}
.month-nav button{
  width:26px;height:26px;border-radius:50%;border:none;
  background:rgba(255,255,255,0.1);color:#EAF4EE;
  display:flex;align-items:center;justify-content:center;
}
.month-nav button:hover{background:rgba(255,255,255,0.2);}
.month-nav button svg{width:14px;height:14px;stroke:currentColor;fill:none;stroke-width:2.2;}

.add-btn{
  display:flex;align-items:center;justify-content:center;gap:8px;
  background:#EAF4EE;color:var(--primary-dark);
  border:none;border-radius:12px;padding:12px;
  font-weight:700;font-size:14px;
}
.add-btn:hover{background:#fff;}
.add-btn svg{width:16px;height:16px;stroke:currentColor;fill:none;stroke-width:2.4;}

/* ---------- Main ---------- */
.main{padding:34px 40px 60px;max-width:1180px;}
.topbar{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:26px;flex-wrap:wrap;gap:16px;}
.greeting .eyebrow{font-size:11.5px;text-transform:uppercase;letter-spacing:0.1em;color:var(--muted);font-weight:700;margin-bottom:6px;}
.greeting h1{font-family:'Fraunces',serif;font-weight:600;font-size:30px;margin:0;color:var(--ink);}
.greeting h1 em{font-style:italic;color:var(--primary);}

/* Plant signature */
.plant-card{
  background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-lg);
  box-shadow:var(--shadow);padding:16px 22px;display:flex;align-items:center;gap:16px;min-width:230px;
}
.plant-svg-wrap{width:56px;height:64px;flex-shrink:0;}
.plant-caption .k{font-size:11px;color:var(--muted);text-transform:uppercase;letter-spacing:0.08em;font-weight:700;}
.plant-caption .v{font-family:'Fraunces',serif;font-weight:600;font-size:18px;margin-top:2px;}
.plant-caption .v.good{color:var(--success);}
.plant-caption .v.bad{color:var(--danger);}

/* Summary cards */
.cards-row{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:26px;}
.stat-card{
  background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-md);
  padding:18px 18px 16px;box-shadow:var(--shadow);
}
.stat-card .icon{
  width:34px;height:34px;border-radius:9px;display:flex;align-items:center;justify-content:center;margin-bottom:12px;
}
.stat-card .icon svg{width:17px;height:17px;stroke-width:2;fill:none;stroke-linecap:round;stroke-linejoin:round;}
.stat-card.income .icon{background:var(--primary-light);}
.stat-card.income .icon svg{stroke:var(--primary);}
.stat-card.expense .icon{background:var(--clay-light);}
.stat-card.expense .icon svg{stroke:var(--clay);}
.stat-card.net .icon{background:#EFF4E7;}
.stat-card.net .icon svg{stroke:var(--gold);}
.stat-card.budget .icon{background:var(--surface-alt);}
.stat-card.budget .icon svg{stroke:var(--primary-dark);}
.stat-card .label{font-size:12px;color:var(--muted);font-weight:600;margin-bottom:4px;}
.stat-card .value{font-family:'IBM Plex Mono',monospace;font-size:22px;font-weight:600;}
.stat-card .sub{font-size:11.5px;color:var(--muted);margin-top:4px;}

/* Layout grid */
.grid-2{display:grid;grid-template-columns:1.15fr 1fr;gap:18px;margin-bottom:18px;align-items:start;}
.panel{
  background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-lg);
  box-shadow:var(--shadow);padding:22px 24px;
}
.panel h2{font-family:'Fraunces',serif;font-weight:600;font-size:17px;margin:0 0 3px;}
.panel .panel-sub{font-size:12.5px;color:var(--muted);margin-bottom:16px;}

/* Donut + legend */
.donut-wrap{display:flex;align-items:center;gap:22px;}
.legend{display:flex;flex-direction:column;gap:9px;flex:1;}
.legend-row{display:flex;align-items:center;gap:9px;font-size:12.5px;}
.legend-dot{width:9px;height:9px;border-radius:50%;flex-shrink:0;}
.legend-row .name{flex:1;color:var(--ink);font-weight:600;}
.legend-row .amt{font-family:'IBM Plex Mono',monospace;color:var(--muted);}
.empty-note{color:var(--muted);font-size:13px;padding:20px 0;text-align:center;}

/* Trend chart */
.trend-legend{display:flex;gap:16px;margin-bottom:10px;}
.trend-legend span{display:flex;align-items:center;gap:6px;font-size:12px;color:var(--muted);font-weight:600;}
.trend-legend i{width:8px;height:8px;border-radius:2px;display:inline-block;}

/* Budgets */
.budget-row{margin-bottom:16px;}
.budget-row:last-child{margin-bottom:0;}
.budget-top{display:flex;justify-content:space-between;align-items:baseline;margin-bottom:6px;}
.budget-top .cat{display:flex;align-items:center;gap:8px;font-weight:600;font-size:13.5px;}
.budget-top .cat svg{width:15px;height:15px;stroke:var(--primary-dark);fill:none;stroke-width:2;}
.budget-top .amt{font-family:'IBM Plex Mono',monospace;font-size:12.5px;color:var(--muted);}
.bar-track{height:8px;background:var(--surface-alt);border-radius:6px;overflow:hidden;}
.bar-fill{height:100%;border-radius:6px;transition:width 0.4s ease;}
.no-budget{font-size:11.5px;color:var(--muted);font-style:italic;}
.panel-foot-link{display:inline-block;margin-top:16px;font-size:12.5px;font-weight:700;color:var(--primary);background:none;border:none;padding:0;}

/* Insights - diary sticky notes */
.insights-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:14px;}
.note{
  background:var(--primary-light);border-radius:var(--radius-md);
  padding:16px 17px;position:relative;border:1px solid #D7E9DC;
}
.note.warn{background:var(--clay-light);border-color:#EFD9CB;}
.note.gold{background:#FBF4E3;border-color:#EFDFB0;}
.note p{font-family:'Fraunces',serif;font-style:italic;font-weight:500;font-size:14.5px;line-height:1.5;margin:0;color:var(--ink);}
.note .tag{font-size:10px;text-transform:uppercase;letter-spacing:0.08em;font-weight:700;color:var(--primary);margin-bottom:8px;display:block;}
.note.warn .tag{color:var(--clay);}
.note.gold .tag{color:var(--gold);}

/* Tips */
.tips-list{display:flex;flex-direction:column;gap:10px;margin-top:6px;}
.tip{display:flex;gap:10px;align-items:flex-start;font-size:13px;line-height:1.5;color:var(--ink);}
.tip svg{width:15px;height:15px;stroke:var(--primary);fill:none;stroke-width:2;flex-shrink:0;margin-top:1px;}

/* Transactions table */
.table-wrap{overflow-x:auto;}
table{width:100%;border-collapse:collapse;font-size:13.5px;}
thead th{text-align:left;font-size:11px;text-transform:uppercase;letter-spacing:0.06em;color:var(--muted);font-weight:700;padding:0 10px 10px;border-bottom:1px solid var(--border);}
tbody td{padding:12px 10px;border-bottom:1px solid var(--border);vertical-align:middle;}
tbody tr:last-child td{border-bottom:none;}
.tx-cat{display:flex;align-items:center;gap:9px;font-weight:600;}
.tx-cat .ic{width:28px;height:28px;border-radius:8px;background:var(--surface-alt);display:flex;align-items:center;justify-content:center;flex-shrink:0;}
.tx-cat .ic svg{width:14px;height:14px;stroke:var(--primary-dark);fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;}
.tx-note{color:var(--muted);font-size:12px;}
.tx-amt{font-family:'IBM Plex Mono',monospace;font-weight:600;text-align:right;}
.tx-amt.in{color:var(--success);}
.tx-amt.out{color:var(--clay);}
.tx-actions{display:flex;gap:6px;justify-content:flex-end;}
.icon-btn{width:28px;height:28px;border-radius:8px;border:none;background:transparent;display:flex;align-items:center;justify-content:center;color:var(--muted);}
.icon-btn:hover{background:var(--surface-alt);color:var(--ink);}
.icon-btn svg{width:14px;height:14px;stroke:currentColor;fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;}

/* Modal */
.overlay{position:fixed;inset:0;background:rgba(20,30,24,0.4);display:none;align-items:center;justify-content:center;z-index:50;padding:20px;}
.overlay.show{display:flex;}
.modal{background:var(--surface);border-radius:var(--radius-lg);padding:26px 28px 24px;width:100%;max-width:420px;box-shadow:0 20px 60px rgba(0,0,0,0.2);max-height:88vh;overflow-y:auto;}
.modal h3{font-family:'Fraunces',serif;font-weight:600;font-size:19px;margin:0 0 18px;}
.type-toggle{display:flex;background:var(--surface-alt);border-radius:10px;padding:4px;margin-bottom:16px;}
.type-toggle button{flex:1;border:none;background:none;padding:9px;border-radius:8px;font-weight:700;font-size:13px;color:var(--muted);}
.type-toggle button.active-in{background:var(--primary);color:#fff;}
.type-toggle button.active-out{background:var(--clay);color:#fff;}
.field{margin-bottom:14px;}
.field label{display:block;font-size:12px;font-weight:700;color:var(--muted);margin-bottom:6px;}
.field input,.field select{width:100%;padding:10px 12px;border-radius:9px;border:1px solid var(--border);background:var(--bg);font-size:13.5px;color:var(--ink);}
.field input:focus,.field select:focus{outline:2px solid var(--primary-light);border-color:var(--primary);}
.modal-actions{display:flex;gap:10px;margin-top:18px;}
.btn{padding:11px 16px;border-radius:10px;border:none;font-weight:700;font-size:13.5px;}
.btn-primary{background:var(--primary);color:#fff;flex:1;}
.btn-primary:hover{background:var(--primary-dark);}
.btn-ghost{background:var(--surface-alt);color:var(--ink);}
.budget-field{display:flex;align-items:center;gap:10px;margin-bottom:12px;}
.budget-field .ic{width:30px;height:30px;border-radius:8px;background:var(--surface-alt);display:flex;align-items:center;justify-content:center;flex-shrink:0;}
.budget-field .ic svg{width:15px;height:15px;stroke:var(--primary-dark);fill:none;stroke-width:2;}
.budget-field .name{flex:1;font-size:13px;font-weight:600;}
.budget-field input{width:110px;padding:8px 10px;border-radius:8px;border:1px solid var(--border);background:var(--bg);font-family:'IBM Plex Mono',monospace;font-size:13px;}

.section-title{font-family:'Fraunces',serif;font-weight:600;font-size:17px;margin:0 0 16px;}
.close-x{position:absolute;top:16px;right:16px;background:none;border:none;color:var(--muted);}

/* ---------- Mobile app shell ---------- */
.mobile-topbar{
  position:sticky;top:0;z-index:40;
  background:var(--primary-dark);color:#EAF4EE;
  padding:calc(12px + var(--safe-top)) 16px 12px;
  display:flex;align-items:center;justify-content:space-between;gap:10px;
  box-shadow:0 4px 16px rgba(22,79,58,0.16);
}
.mt-brand{display:flex;align-items:center;gap:9px;}
.mt-mark{width:30px;height:30px;border-radius:9px;background:rgba(255,255,255,0.14);display:flex;align-items:center;justify-content:center;flex-shrink:0;}
.mt-mark svg{width:17px;height:17px;stroke:#EAF4EE;fill:none;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round;}
.mt-brand .t1{font-family:'Fraunces',serif;font-weight:600;font-size:14.5px;line-height:1.15;}
.mt-brand .t2{font-family:'Fraunces',serif;font-style:italic;font-weight:400;font-size:10.5px;color:#B9D6C4;}
.mt-month{display:flex;align-items:center;gap:8px;background:rgba(255,255,255,0.1);border-radius:20px;padding:5px 6px;}
.mt-month span{font-family:'Fraunces',serif;font-weight:600;font-size:12.5px;min-width:82px;text-align:center;}
.mt-month button{width:24px;height:24px;border-radius:50%;border:none;background:rgba(255,255,255,0.14);color:#EAF4EE;display:flex;align-items:center;justify-content:center;}
.mt-month button svg{width:12px;height:12px;stroke:currentColor;fill:none;stroke-width:2.4;}
.mt-month button:active{background:rgba(255,255,255,0.28);}

.bottom-nav{
  position:fixed;left:0;right:0;bottom:0;z-index:40;
  background:var(--surface);
  border-top:1px solid var(--border);
  padding:8px 6px calc(6px + var(--safe-bottom));
  display:flex;align-items:flex-end;justify-content:space-between;
  box-shadow:0 -6px 20px rgba(28,43,34,0.08);
}
.bn-item{
  flex:1;display:flex;flex-direction:column;align-items:center;gap:3px;
  background:none;border:none;color:var(--muted);padding:6px 2px;border-radius:10px;
  font-size:10px;font-weight:600;
}
.bn-item svg{width:20px;height:20px;stroke:currentColor;fill:none;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round;}
.bn-item.active{color:var(--primary);}
.bn-item:active{background:var(--surface-alt);}
.bn-fab{
  flex:0 0 auto;width:52px;height:52px;border-radius:50%;
  background:var(--primary);color:#fff;border:none;
  display:flex;align-items:center;justify-content:center;
  margin-top:-26px;box-shadow:0 6px 16px rgba(30,107,78,0.4);
  border:4px solid var(--bg);
}
.bn-fab svg{width:22px;height:22px;stroke:currentColor;fill:none;stroke-width:2.6;stroke-linecap:round;}
.bn-fab:active{background:var(--primary-dark);}

@media(max-width:900px){
  .app{grid-template-columns:1fr;}
  .sidebar{display:none;}
  .mobile-topbar{display:flex;}
  .bottom-nav{display:flex;}
  body{padding-bottom:calc(var(--bottom-nav-h) + var(--safe-bottom));}
  .main{padding:18px 16px calc(30px);max-width:100%;}
  .topbar{flex-direction:column;align-items:stretch;margin-bottom:20px;gap:14px;}
  .greeting h1{font-size:23px;}
  .plant-card{width:100%;min-width:0;}
  .cards-row{grid-template-columns:repeat(2,1fr);gap:12px;margin-bottom:20px;}
  .stat-card{padding:14px 14px 13px;}
  .stat-card .value{font-size:18px;}
  .grid-2{grid-template-columns:1fr;gap:14px;margin-bottom:14px;}
  .panel{padding:18px 16px;border-radius:var(--radius-md);}
  .donut-wrap{flex-direction:column;align-items:flex-start;gap:16px;}
  .donut-wrap svg{align-self:center;}

  /* Modal becomes a bottom sheet */
  .overlay{align-items:flex-end;padding:0;}
  .modal{
    max-width:100%;width:100%;border-radius:20px 20px 0 0;
    max-height:88vh;padding:22px 20px calc(20px + var(--safe-bottom));
    animation:sheetUp 0.22s ease-out;
  }
  @keyframes sheetUp{from{transform:translateY(100%);}to{transform:translateY(0);}}
  .field input,.field select{padding:12px 13px;font-size:16px;}
  .icon-btn{width:34px;height:34px;}

  /* Transactions become cards */
  .table-wrap{overflow-x:visible;}
  table,thead,tbody,tr,td{display:block;width:100%;}
  thead{display:none;}
  tbody tr{
    position:relative;background:var(--surface-alt);border:1px solid var(--border);
    border-radius:var(--radius-md);padding:13px 46px 12px 13px;margin-bottom:10px;
  }
  tbody tr:last-child{margin-bottom:0;}
  tbody td{border-bottom:none;padding:0;}
  td.tx-cat{margin-bottom:5px;font-size:13.5px;}
  td:nth-child(2){display:inline-block;width:auto;font-size:11.5px;color:var(--muted);}
  td.tx-note{display:inline-block;width:auto;margin-left:7px;font-size:11.5px;}
  td.tx-note:not(:empty)::before{content:"· ";}
  td.tx-amt{
    position:absolute;top:13px;right:46px;text-align:right;
    font-size:14.5px;padding:0;
  }
  td.tx-amt + td{position:absolute;top:8px;right:6px;width:auto;}
  .tx-actions{gap:2px;}
}
@media(max-width:420px){
  .cards-row{grid-template-columns:1fr 1fr;}
  .mt-month span{min-width:70px;font-size:11.5px;}
}

/* ---------- Multi-page nav-as-links tweaks ---------- */
.nav-item, .bn-item{text-decoration:none;}
a.icon-btn{text-decoration:none;}

/* ---------- Toasts & banners ---------- */
.toast{
  position:fixed;left:50%;bottom:calc(var(--bottom-nav-h) + 22px);transform:translateX(-50%);
  background:var(--primary-dark);color:#EAF4EE;padding:11px 18px;border-radius:12px;
  font-size:13px;font-weight:600;box-shadow:0 8px 24px rgba(0,0,0,0.18);
  z-index:60;opacity:0;pointer-events:none;transition:opacity 0.25s ease, transform 0.25s ease;
}
.toast.show{opacity:1;}
@media(min-width:901px){ .toast{bottom:26px;} }

.config-banner{
  background:var(--clay-light);border:1px solid #EFD9CB;color:var(--ink);
  border-radius:var(--radius-md);padding:14px 16px;margin-bottom:20px;font-size:13px;line-height:1.5;
}
.config-banner code{background:rgba(0,0,0,0.06);padding:1px 5px;border-radius:4px;font-family:'IBM Plex Mono',monospace;font-size:12px;}
.config-banner a{color:var(--clay);font-weight:700;}

.page-loading{padding:40px 0;text-align:center;color:var(--muted);font-size:13px;}

.btn-danger{background:var(--danger);color:#fff;}
.btn-danger:hover{background:#a8452f;}
