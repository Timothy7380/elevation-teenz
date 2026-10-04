/* ===================== STATE (saved on this device only) ===================== */
const KEY="elevation-teens-v1";
const blank=()=>({done:{},journal:{},quiz:{},activity:[],memorized:{},reminders:{},prayed:{},myPrayers:[],myStories:[]});
let S=blank();
try{const raw=localStorage.getItem(KEY); if(raw) S=Object.assign(blank(),JSON.parse(raw));}catch(e){}
function save(){try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}}
const IG={handle:"elevationteenz",url:LINKS.ig};

/* ===================== HELPERS ===================== */
const $=s=>document.querySelector(s);
const esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const today=()=>{const d=new Date();return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0")};
const dayNum=s=>Math.round(new Date(s+"T12:00:00").getTime()/864e5);
function streak(){const set=new Set(S.activity.map(dayNum));let n=dayNum(today());if(!set.has(n))n--;let c=0;while(set.has(n)){c++;n--}return c}
function logActivity(){const t=today();if(!S.activity.includes(t))S.activity.push(t);save()}
function toast(msg){const t=$("#toast");t.textContent=msg;t.hidden=false;clearTimeout(toast.t);toast.t=setTimeout(()=>t.hidden=true,2600)}
const topic=id=>TOPICS.find(t=>t.id===id);
const fmtDate=s=>{const d=new Date(s+"T12:00:00");return{day:d.getDate(),mon:d.toLocaleString("en",{month:"short"}),wd:d.toLocaleString("en",{weekday:"long"}),full:d.toLocaleDateString("en",{weekday:"short",day:"numeric",month:"long"})}};
const I={
 spark:'<svg viewBox="0 0 60 60" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M30 6v10M30 44v10M6 30h10M44 30h10M13 13l7 7M40 40l7 7M47 13l-7 7M20 40l-7 7"/><path d="M30 22l2.4 5.6L38 30l-5.6 2.4L30 38l-2.4-5.6L22 30l5.6-2.4z" fill="currentColor" stroke="none"/></svg>',
 home:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M4 10.5L12 4l8 6.5V20h-5v-6H9v6H4z"/></svg>',
 book:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M4 5.5C6.5 4 9.5 4 12 6c2.5-2 5.5-2 8-.5V19c-2.5-1.5-5.5-1.5-8 .5-2.5-2-5.5-2-8-.5z"/><path d="M12 6v13.5"/></svg>',
 cal:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="4" y="5" width="16" height="15" rx="3"/><path d="M4 10h16M9 3v4M15 3v4"/></svg>',
 flame:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M12 3c1 4 6 6 6 11a6 6 0 01-12 0c0-3 2-4.5 2-7 1.5 1 2.5 2.5 2.5 4C12 9 11 6 12 3z"/></svg>',
 more:'<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/></svg>',
 search:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="6.5"/><path d="M20 20l-4.2-4.2"/></svg>',
 arrow:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
 back:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M11 6l-6 6 6 6"/></svg>',
 check:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
 lock:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 018 0v3"/></svg>',
 info:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8v.01"/></svg>',
 play:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.5v13l11-6.5z"/></svg>',
 mic:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0014 0M12 18v3"/></svg>',
 star:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/></svg>'
};
const ridge='<svg class="ridge" viewBox="0 0 400 200" preserveAspectRatio="none" aria-hidden="true"><path d="M0 200L0 140 70 80 120 120 190 40 250 110 300 75 400 150 400 200z" fill="rgba(255,255,255,.10)"/><path d="M0 200L0 170 90 120 150 155 230 90 300 140 350 115 400 160 400 200z" fill="rgba(255,255,255,.16)"/></svg>';
const placeholder=t=>`<span class="pill warn" title="Placeholder content">${t||"Placeholder"}</span>`;

/* ===================== ROUTER ===================== */
const NAV=[["about","About"],["programs","Programs"],["hub","Study Hub"],["connect","Connect"],["grow","Grow"],["media","Media"],["events","Events"],["involved","Get involved"]];
const TABS=[["home","Home",I.home],["hub","Study",I.book],["events","Events",I.cal],["grow","Grow",I.flame],["__more","More",I.more]];
function route(){return (location.hash||"#home").slice(1)||"home"}
function go(r){if(route()===r)render();else location.hash=r;window.scrollTo(0,0)}
function render(){
  const r=route();const v=$("#view");
  let html;
  if(r.startsWith("lesson-")) html=viewLesson(r.slice(7));
  else if(r.startsWith("series-")) html=viewSeries(r.slice(7));
  else if(r.startsWith("program-")) html=viewProgram(r.slice(8));
  else if(typeof CONNECT_VIEWS!=="undefined"&&CONNECT_VIEWS[r.split("-")[0]]){const pre=r.split("-")[0];html=CONNECT_VIEWS[pre](r.slice(pre.length+1))}
  else html=(VIEWS[r]||VIEWS.home)();
  v.innerHTML=html;
  const isConn=typeof CONNECT_ROUTES!=="undefined"&&CONNECT_ROUTES.includes(r.split("-")[0]);
  const base=r.startsWith("lesson-")||r.startsWith("series-")?"hub":r.startsWith("program-")?"programs":isConn?"connect":r;
  $("#toplinks").innerHTML=NAV.map(([k,l])=>`<button data-go="${k}" class="${k===base?"on":""}">${l}</button>`).join("");
  $("#foot").innerHTML=footerHTML();
  $("#tabs").innerHTML=TABS.map(([k,l,ic])=>`<button data-go="${k}" class="${k===base?"on":""}" aria-label="${l}">${ic}<span>${l}</span></button>`).join("");
  document.title=(r==="home"?"":((NAV.find(n=>n[0]===base)||[])[1]||"")+" · ")+"Elevation Teenz";
  if(typeof navCta==="function")navCta();
  const pre=r.split("-")[0];
  if(isConn&&typeof CONNECT_AFTER!=="undefined"){bindSignOut();(CONNECT_AFTER[pre]||(()=>{}))(r)}
  else (AFTER[pre]||(()=>{}))(r);
}
window.addEventListener("hashchange",()=>{render();window.scrollTo(0,0)});
document.addEventListener("click",e=>{
  const g=e.target.closest("[data-go]");
  if(g){e.preventDefault();const k=g.dataset.go;closeDrawer();if(k==="__more")openDrawer();else go(k);return}
});
window.addEventListener("scroll",()=>$("#top").classList.toggle("scrolled",scrollY>4),{passive:true});
const setHead=()=>document.documentElement.style.setProperty("--head-h",$("#top").offsetHeight+"px");setHead();window.addEventListener("resize",setHead);if(window.ResizeObserver)new ResizeObserver(setHead).observe($("#top"));
function openDrawer(){
  $("#drawerPanel").innerHTML=`<div class="row" style="justify-content:space-between;margin-bottom:8px"><span class="eyebrow">Menu</span><button class="btn ghost sm" id="closeDrawer">Close</button></div>`+
  [["home","Home","Welcome & verse of the day"],["about","About us","Vision, beliefs, leaders"],["programs","Programs","Navigate, Accelerate"],["hub","Study Hub","Topics, series, search"],["grow","Grow","Streaks, badges, prayer wall"],["media","Media","Sermons, podcasts, photos"],["events","Events","Calendar & reminders"],["involved","Get involved","Join, volunteer, give, contact"]]
  .map(([k,l,s])=>`<button class="item" data-go="${k}">${l}<span>${s}</span></button>`).join("");
  $("#drawer").hidden=false;$("#closeDrawer").onclick=closeDrawer;$("#closeDrawer").focus();
}
function closeDrawer(){$("#drawer").hidden=true}
$("#drawer").addEventListener("click",e=>{if(e.target.id==="drawer")closeDrawer()});
$("#menuBtn").onclick=openDrawer;
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeDrawer()});
/* ===================== SHARED BITS ===================== */
const votd=()=>VOTD[dayNum(today())%VOTD.length];
const lessonCount=()=>TOPICS.filter(t=>t.lesson).length;
const doneCount=()=>Object.keys(S.done).length;
function seriesProgress(s){const w=s.days.filter(d=>d.l);const d=w.filter(x=>S.done[x.l]).length;return{done:s.days.filter(x=>x.l&&S.done[x.l]).length,total:s.days.length,next:s.days.find(x=>x.l&&!S.done[x.l])}}
function topicCard(t){
  const c=CATS[t.cat];const done=S.done[t.id];
  if(!t.lesson) return `<div class="topic soon" aria-disabled="true"><div class="row" style="justify-content:space-between"><span class="row" style="gap:6px"><i class="cat-dot" style="background:${c.color}"></i><span class="eyebrow">${c.name}</span></span><span class="pill">Coming soon</span></div><h4>${esc(t.title)}</h4><p class="muted" style="font-size:.9rem">${esc(t.blurb)}</p></div>`;
  return `<button class="topic" data-go="lesson-${t.id}"><div class="row" style="justify-content:space-between"><span class="row" style="gap:6px"><i class="cat-dot" style="background:${c.color}"></i><span class="eyebrow">${c.name}</span></span>${done?'<span class="pill done">Completed</span>':`<span class="pill blue">${t.mins} min</span>`}</div><h4>${esc(t.title)}</h4><p class="muted" style="font-size:.9rem">${esc(t.blurb)}</p></button>`;
}
function eventRow(e,kind){const f=fmtDate(e.d);const on=S.reminders[e.id];
  return `<div class="lrow" style="cursor:default"><div class="date-badge"><b>${f.day}</b><small>${f.mon}</small></div><div class="tx">${kind?`<span class="pill blue" style="margin-bottom:4px">${esc(e.kind)}</span>`:""}<b>${esc(e.title)}</b><small>${f.wd} · ${esc(e.time)} · ${esc(e.where)}</small></div><button class="pray-btn ${on?"on":""}" data-remind="${e.id}" aria-pressed="${!!on}">${on?"Reminder on":"Remind me"}</button></div>`}
function bindReminders(){document.querySelectorAll("[data-remind]").forEach(b=>b.onclick=()=>{const id=b.dataset.remind;S.reminders[id]=!S.reminders[id];if(!S.reminders[id])delete S.reminders[id];save();b.classList.toggle("on",!!S.reminders[id]);b.setAttribute("aria-pressed",!!S.reminders[id]);b.textContent=S.reminders[id]?"Reminder on":"Remind me";toast(S.reminders[id]?"Reminder saved on this device":"Reminder removed")})}
const upcoming=()=>EVENTS.filter(e=>e.d>=today()).sort((a,b)=>a.d<b.d?-1:1);


const FAQ=[
 ["Who can join Elevation Teenz?","Teenagers aged 12–19. Most of our teens are part of The Elevation Church, but every teen is welcome at Sunday services, Navigate and the Study Hub."],
 ["When and where is the Sunday teen service?","Teenz Nation Sunday Service runs at 7:00, 9:00 and 11:30 AM (WAT) at Pistis Conference Centre, Lekki-Epe Expressway, Lagos. Check the events page or Instagram for upcoming dates."],
 ["Is the Study Hub free?","Yes. Every study, series, quiz and memory verse is free to use."],
 ["Do I need an account to study?","Not to read. Your progress, streaks and journal are saved on your device for now. Accounts will let you keep them across devices."],
 ["How do I register for Navigate?","Registration happens on the Navigate website. Open the Navigate page here and tap Register."],
 ["Is it safe for my teen?","Counselors are approved by church leaders before teens can see them. Chats stay inside the site, can't include phone numbers or links, and leaders can read them. Teens under 18 can only send messages after a leader confirms a parent or guardian's OK."],
 ["How does Connect work?","Teens and counselors sign up, choose their expression from every TEC expression worldwide, and connect: teens can request an approved mentor, add teen friends from any expression and join expression groups."],
 ["Who writes the studies?","Studies are written by the Teenz Nation team. New topics are added regularly. Suggest one on the Get involved page."]
];
const QUOTES=[
 {q:"Navigate Lagos was more than a camp. It was an encounter. From changed mindsets to a deeper hunger for God, new confidence, meaningful friendships…",who:"The Elevation Church",src:"@elevationng"},
 {q:"Last Sunday, our teenagers took over the pulpit at different services, and honestly, my heart was full.",who:"Church leader",src:"@pgeeman"},
 {q:"500+ teenagers equipped with life-saving self-defense skills. Thank you @elevationteenz for the opportunity.",who:"Navigate trainer",src:"@specfitness_ng"},
 {q:"Out of the mouths of these teenagers were we refreshed, strengthened, and renewed in service.",who:"TEC Ikorodu North",src:"@elevationikorodunorth"}
];


/* Colourful faith & teen icons (decorative) */
const ICON={
 cross:'<svg viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="27" fill="#FFF1B8"/><g stroke="#FFC93C" stroke-width="3" stroke-linecap="round"><path d="M32 2v4M58 32h4M6 32H2M51 13l3-3M13 13l-3-3"/></g><path d="M28 10h8v14h12v8H36v24h-8V32H16v-8h12z" fill="#FF8A3D"/><path d="M28 10h3v46h-3zM16 24h12v3H16z" fill="#F0661E"/></svg>',
 bible:'<svg viewBox="0 0 64 64" aria-hidden="true"><rect x="12" y="8" width="40" height="48" rx="6" fill="#2F6BF0"/><rect x="17" y="8" width="35" height="43" rx="5" fill="#4FA3FF"/><rect x="12" y="50" width="40" height="6" rx="3" fill="#E6EEFB"/><path d="M33 17h4v8h7v4h-7v12h-4V29h-7v-4h7z" fill="#FFD84A"/><path d="M20 8h5v18l-2.5-2.5L20 26z" fill="#FF4F6D"/></svg>',
 dove:'<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M6 34c9 1 16-3 21-10 3 7 10 11 18 10l11-8-2 10c-4 9-13 14-24 14-9 0-17-5-24-16z" fill="#fff" stroke="#8EC1FF" stroke-width="2.4" stroke-linejoin="round"/><path d="M27 24c-3-9 2-16 11-18-1 7 1 13 6 17" fill="#DDEBFF" stroke="#8EC1FF" stroke-width="2.4" stroke-linejoin="round"/><circle cx="47" cy="29" r="1.8" fill="#0B1230"/><path d="M53 29l7 1-7 3z" fill="#FFB020"/><path d="M18 46c-4 3-6 7-5 12" stroke="#2EC28B" stroke-width="3" fill="none" stroke-linecap="round"/><ellipse cx="13" cy="51" rx="4" ry="2.2" transform="rotate(-40 13 51)" fill="#2EE0B5"/><ellipse cx="20" cy="52" rx="4" ry="2.2" transform="rotate(30 20 52)" fill="#2EE0B5"/></svg>',
 flame:'<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M32 4c4 11 17 17 17 32a17 17 0 01-34 0c0-9 6-13 6-21 4 2 7 6 7 11 0-9 2-15 4-22z" fill="#FF5A36"/><path d="M32 26c3 7 10 10 10 17a10 10 0 01-20 0c0-5 3-7 3-12 3 1 4 4 4 6 0-5 1-8 3-11z" fill="#FFB020"/><path d="M32 40c1 3 4 4 4 7a4 4 0 01-8 0c0-2 2-4 4-7z" fill="#FFF1B8"/></svg>',
 headphones:'<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M12 38v-6a20 20 0 0140 0v6" fill="none" stroke="#5B4BFF" stroke-width="5" stroke-linecap="round"/><rect x="7" y="35" width="13" height="20" rx="6" fill="#2EE0B5"/><rect x="44" y="35" width="13" height="20" rx="6" fill="#2EE0B5"/><path d="M29 24V12l9-2v10" stroke="#FF4F8B" stroke-width="3" fill="none" stroke-linejoin="round"/><circle cx="26.5" cy="24.5" r="3.5" fill="#FF4F8B"/><circle cx="35.5" cy="21" r="3.5" fill="#FF4F8B"/></svg>',
 music:'<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M27 46V14l23-6v32" stroke="#B57BFF" stroke-width="5" fill="none" stroke-linejoin="round"/><path d="M27 14l23-6v8l-23 6z" fill="#B57BFF"/><circle cx="20" cy="46" r="9" fill="#FF4F8B"/><circle cx="43" cy="40" r="9" fill="#FF8A3D"/></svg>',
 heart:'<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M32 56S7 41 7 24a13 13 0 0125-5 13 13 0 0125 5c0 17-25 32-25 32z" fill="#FF4F6D"/><path d="M17 20a7 7 0 017-5" stroke="#fff" stroke-width="3.5" fill="none" stroke-linecap="round" opacity=".75"/><path d="M50 6l1.6 4.4L56 12l-4.4 1.6L50 18l-1.6-4.4L44 12l4.4-1.6z" fill="#FFD84A"/></svg>',
 chat:'<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M10 12h44a5 5 0 015 5v24a5 5 0 01-5 5H29L18 56V46h-8a5 5 0 01-5-5V17a5 5 0 015-5z" fill="#2F8CFA"/><path d="M32 39s-10-6-10-12a5 5 0 0110-2 5 5 0 0110 2c0 6-10 12-10 12z" fill="#fff"/><circle cx="54" cy="12" r="7" fill="#FFD84A"/><path d="M51 12h6M54 9v6" stroke="#0B1230" stroke-width="2" stroke-linecap="round"/></svg>',
 phone:'<svg viewBox="0 0 64 64" aria-hidden="true"><rect x="17" y="5" width="30" height="54" rx="7" fill="#0B1230"/><rect x="20.5" y="11" width="23" height="40" rx="3" fill="url(#ph)"/><defs><linearGradient id="ph" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#4FA3FF"/><stop offset="1" stop-color="#B57BFF"/></linearGradient></defs><path d="M30 18h4v7h6v4h-6v13h-4V29h-6v-4h6z" fill="#fff"/><circle cx="32" cy="55" r="1.8" fill="#4FA3FF"/><circle cx="52" cy="14" r="6" fill="#FF4F6D"/><path d="M52 17.5s-3.2-2-3.2-4a1.6 1.6 0 013.2-.6 1.6 1.6 0 013.2.6c0 2-3.2 4-3.2 4z" fill="#fff"/></svg>',
 sparkle:'<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M24 4l5 16 16 5-16 5-5 16-5-16-16-5 16-5z" fill="#FFD84A"/><path d="M48 34l2.6 8.4L59 45l-8.4 2.6L48 56l-2.6-8.4L37 45l8.4-2.6z" fill="#FF8A3D"/><circle cx="52" cy="14" r="4" fill="#2EE0B5"/></svg>'
};
const PAGE_ICON={home:"cross",about:"dove",programs:"flame",program:"flame",hub:"bible",lesson:"bible",series:"flame",grow:"heart",media:"headphones",events:"phone",involved:"chat"};
/* Social icons */
const SOC={
 ig:{n:"Instagram",u:()=>LINKS.ig,c:"#E1306C",s:'<svg class="si" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" stroke="none"/></svg>'},
 yt:{n:"YouTube",u:()=>LINKS.yt,c:"#FF0000",s:'<svg class="si" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" fill-rule="evenodd" d="M6 5h12a4 4 0 014 4v6a4 4 0 01-4 4H6a4 4 0 01-4-4V9a4 4 0 014-4zm4 4v6l5-3z"/></svg>'},
 tt:{n:"TikTok",u:()=>LINKS.tiktok,c:"#111111",s:'<svg class="si" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M14 3h3c0 2.2 1.8 4 4 4v3c-1.5 0-2.9-.5-4-1.2V15a6 6 0 11-6-6v3.2a2.8 2.8 0 102.8 2.8V3z"/></svg>'},
 fb:{n:"Facebook",u:()=>LINKS.fb,c:"#1877F2",s:'<svg class="si" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 00-1.6 19.9v-7H8v-2.9h2.4V9.8c0-2.4 1.4-3.7 3.6-3.7 1 0 2.1.2 2.1.2v2.3h-1.2c-1.2 0-1.5.7-1.5 1.5v1.9h2.6l-.4 2.9h-2.2v7A10 10 0 0012 2z"/></svg>'},
 th:{n:"Threads",u:()=>LINKS.threads,c:"#111111",s:'<svg class="si" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M17.5 8.5C16.6 5.9 14.6 4 11.8 4 7.6 4 5 7.4 5 12s2.6 8 6.8 8c3.4 0 5.7-2 5.7-4.7 0-2.6-2.2-4-5.2-4-2.2 0-3.6 1.1-3.6 2.6s1.3 2.3 2.8 2.3c2.6 0 3.8-2.1 3.8-5.6"/></svg>'}
};
function footerHTML(){
  const g=GALLERY;
  return `<div class="footer">
    <div class="r1"><button class="logo" data-go="home" style="color:#fff"><img src="assets/logo.png" alt="" style="background:#fff">Elevation Teenz</button>
      <nav class="links">${NAV.map(([k,l])=>`<button data-go="${k}">${l}</button>`).join("")}</nav>
      <div class="soc">${["ig","yt","tt","fb","th"].map(k=>`<a href="${SOC[k].u()}" target="_blank" rel="noopener" aria-label="${SOC[k].n}" title="${SOC[k].n}">${SOC[k].s}</a>`).join("")}</div></div>
    <div class="r2"><span>Teenage ministry of The Elevation Church · We know God. We love God. We serve God.</span><span>© 2026 Elevation Teenz</span></div>
  </div>`;
}
function toolkitScreen(k){
  const ready=TOPICS.filter(t=>t.lesson);
  const S1={
   library:[`<div class="tilegrid">${Object.values(CATS).slice(0,4).map((c,i)=>`<div class="gtile"><i>+</i>${c.name}</div>`).join("")}</div>
     <div class="row" style="margin:18px 0 8px;gap:18px;font-size:.88rem"><span class="pill">Topics ${TOPICS.length}</span><span class="pill blue">Ready ${ready.length}</span><span class="search" style="flex:1;min-width:180px;padding:4px 4px 4px 14px">${I.search}<input type="text" id="tkQ" placeholder="Try “I feel lonely”" aria-label="Search studies"><button class="btn blue sm" id="tkGo">Search</button></span></div>
     ${ready.map(t=>`<div class="mini-row"><span><b>${t.title}</b> <span class="muted">· ${CATS[t.cat].name}</span></span><button class="btn ghost sm" data-go="lesson-${t.id}">Open</button></div>`).join("")}`,
     "Topic library","Browse studies by Character, Identity, Real life, Faith basics and Relationships, or search by how you feel."],
   series:[SERIES.map(s=>{const p=seriesProgress(s);return `<div class="mini-row" style="padding:16px 0"><span style="flex:1;min-width:0"><b>${s.title}</b><div class="bar" style="margin-top:8px;max-width:360px"><i style="width:${Math.max(4,p.done/p.total*100)}%"></i></div></span><span class="muted" style="font-size:.85rem">${p.done}/${p.total} days</span><button class="btn ghost sm" data-go="series-${s.id}">View</button></div>`}).join(""),
     "Study series","Multi-day plans like 7 Days on the Fruit of the Spirit and Identity in 5 Days, with progress tracking."],
   lesson:[`<div class="tilegrid" style="grid-template-columns:repeat(5,1fr)">${PARTS.map((p,i)=>`<div class="gtile" style="padding:14px 8px;font-size:.78rem;background:linear-gradient(135deg,${i%2?"#4A55C9":"#3D8BFD"},${i%2?"#3D8BFD":"#4A55C9"})"><i style="width:30px;height:30px">${i+1}</i>${p}</div>`).join("")}</div><p class="muted" style="margin-top:16px;font-size:.92rem">Every lesson follows the same ten steps, from a relatable hook to a quick quiz.</p>`,
     "Lessons","Hook, key scriptures, teaching, a Bible character, reflection, memory verse, challenge, prayer, journal and quiz."],
   journal:[`<div class="stack" style="gap:12px"><span class="note">${I.lock}<span>Private, saved on your device only.</span></span><div class="tile"><b style="font-size:.92rem">Who is hardest for me to be patient with, and why?</b><p class="muted" style="margin-top:8px;font-size:.92rem;font-style:italic">Your answer goes here…</p></div><div class="tile"><b style="font-size:.92rem">What situation am I waiting on right now?</b><p class="muted" style="margin-top:8px;font-size:.92rem;font-style:italic">Your answer goes here…</p></div></div>`,
     "Journal","A private space under every lesson to answer the reflection questions in your own words."],
   quiz:[`<div class="q"><b>In Galatians 5:22, long-suffering is part of…</b><button class="opt">The armour of God</button><button class="opt right">The fruit of the Spirit</button><button class="opt">The Ten Commandments</button></div><p class="muted" style="margin-top:12px;font-size:.88rem">3 quick questions at the end of each study. Perfect scores earn the Quiz ace badge.</p>`,
     "Quizzes","Quick questions that check what you've learned, with instant feedback."],
   prayer:[`<div class="stack" style="gap:10px">${PRAYERS.slice(0,2).map(p=>`<div class="prayer"><p>${esc(p.text)}</p><div class="row"><span class="pill">Sample</span><span class="pill blue">${p.n} praying</span></div></div>`).join("")}<span class="pill blue" style="align-self:flex-start">Every request is reviewed by a leader</span></div>`,
     "Prayer wall","Share a request and pray for others. Moderated, with no private messaging."]
  };
  return S1[k];
}

/* ===================== VIEWS ===================== */
const VIEWS={
home(){
  const v=votd();
  const rows=[
    {c:"r1",hl:"Character",l:["Love","Long-suffering","Kindness"],r:["Self-control","Humility","Joy"],cat:"character"},
    {c:"r2",hl:"Identity & real life",l:["Self-worth","Purpose","Anxiety"],r:["Friendships","Peer pressure","Social media"],cat:"life"},
    {c:"r3",hl:"Faith basics",l:["Prayer","Salvation","Holy Spirit"],r:["The Bible","Forgiveness","Parents"],cat:"faith"}];
  const word=w=>{const t=TOPICS.find(x=>x.title.toLowerCase().startsWith(w.toLowerCase().split(" ")[0]));return `<button class="w" ${t&&t.lesson?`data-go="lesson-${t.id}"`:`data-feel="${esc(w)}"`}>${esc(w)}</button>`};
  const tabs=[["library","Topic library"],["series","Study series"],["lesson","Lessons"],["journal","Journal"],["quiz","Quizzes"],["prayer","Prayer wall"]];
  const g=GALLERY;
  return `
  <section class="L-hero">
    <div class="left">
      <span class="app-ic"><img src="assets/logo.png" alt=""></span>
      <span class="burst" style="left:min(52%,430px);top:56px">${ICON.cross}</span>
      <h1>Grow your <span class="mark">faith with</span> Teenz Nation</h1>
      <p class="muted" style="font-size:1.02rem;max-width:44ch">Bible studies for real life. Sunday services. Navigate camp.<br>For teens aged 12–19 at The Elevation Church and beyond.</p>
      <div class="row" style="gap:12px"><button class="btn blue" data-go="hub">Start studying</button><button class="btn ink" data-go="program-navigate">Navigate 2026</button></div>
    </div>
    <div class="right">
      <img src="assets/hero.jpg" alt="Teens worshipping at Navigate Abuja 2026">
      <div class="chip-track"><div class="run">${[0,1].map(()=>["Bible studies","Memory verses","Private journal","Prayer wall","Quizzes","Daily streaks","Study series","Badges"].map(c=>`<span>${c}</span>`).join("")).join("")}</div></div>
    </div>
  </section>

  <section class="L-rows" style="margin-top:18px">
    ${rows.map(r=>`<div class="L-row ${r.c}"><div class="run">${r.l.map(word).join("")}<button class="hl" data-go="hub" data-cat-go="${r.cat}">${r.hl}</button>${r.r.map(word).join("")}</div></div>`).join("")}
  </section>

  <section class="L-statement center">
    <span class="burst">${ICON.dove}</span>
    <p>Scrolling for answers <span class="inl" style="background:var(--yellow)">≠</span> growing. Use the Study Hub to <span class="mark o">discover</span> what God says about what you're facing. <span class="mark b">Start</span> with one topic and build a habit that lasts <span class="inl" style="background:var(--orange);color:#fff">✦</span> <span class="mark">all year.</span></p>
  </section>

  <section class="L-globe">
    <div style="position:relative;max-width:640px;margin:0 auto">
      <canvas id="globe" width="1280" height="600" aria-hidden="true"></canvas>
      ${[[46,4,0],[24,28,1],[70,24,2],[12,62,3],[86,60,4],[36,58,5],[60,52,6]].map(([x,y,i])=>`<img class="av" src="${g[i][0]}" alt="" style="left:calc(${x}% - 26px);top:${y}%">`).join("")}
    </div>
    <div class="panel">
      <h2 style="font-size:clamp(2rem,3.6vw,2.8rem)">Over 540 teens<br>in one week</h2>
      <div class="facts">
        <div><b>541</b><small>teenagers at Navigate Lagos, 1–7 Aug</small></div>
        <div><b>116</b><small>mentors &amp; volunteers serving</small></div>
        <div><b>18</b><small>vocational skill tracks on offer</small></div>
      </div>
      <p class="muted" style="font-size:.9rem">Next stop: Navigate is expanding to four cities across Nigeria.</p>
    </div>
  </section>

  <section class="L-tool">
    <div class="head">
      <h2>Your <u>faith</u> toolkit</h2>
      <div class="tabsr" role="tablist">${tabs.map(([k,l],i)=>`<button role="tab" data-tool="${k}" class="${i?"":"on"}" aria-selected="${!i}">${l}</button>`).join("")}</div>
    </div>
    <div class="L-stage">
      <button class="peek l" id="peekPrev" aria-label="Previous tool"></button>
      <div style="min-width:0">
        <div class="L-screen"><div class="sbar"><span class="row" style="gap:8px;font-weight:600"><img src="assets/logo.png" alt="" width="24" height="24" style="border-radius:50%">Study Hub</span><span class="who"><span class="pill blue">Free</span>Teenz Nation</span></div><div class="sbody" id="toolBody"></div></div>
        <div class="L-cap"><div><h3 id="toolTitle"></h3><p id="toolText" style="margin-top:6px"></p></div><span class="cap-ic" id="toolIcon">${ICON.bible}</span></div>
        <div style="text-align:center;margin-top:18px"><button class="btn" style="background:#fff;color:var(--blue)" data-go="hub">Open the Study Hub</button></div>
      </div>
      <button class="peek r" id="peekNext" aria-label="Next tool"></button>
    </div>
  </section>

  <section class="L-who center" style="display:flex;flex-direction:column;align-items:center;gap:16px">
    <h2><span class="mark o">Who</span> it's for</h2>
    <div class="bento" style="width:100%;text-align:left">
      <div class="bcard photo b-a"><img src="${g[4][0]}" alt="Teens at Navigate camp"></div>
      <div class="bcard b-b"><h4>Teens with <span class="tag-y">real-life</span> questions about faith</h4>
        <span class="ficon" style="left:28%;top:50%">${ICON.bible}</span>
        <span class="ficon" style="right:14%;top:40%">${ICON.headphones}</span>
        <span class="ficon" style="left:10%;bottom:8%">${ICON.cross}</span><span class="ficon" style="right:30%;bottom:6%;width:44px;height:44px">${ICON.music}</span></div>
      <div class="bcard photo b-c"><img src="${g[3][0]}" alt="Praise night at Navigate"></div>
      <div class="bcard b-d" style="min-height:300px"><h4>Teens working through <span class="tag-t">challenges</span> (e.g. anxiety)</h4>
        <span class="floaty" style="left:8%;top:52%;background:var(--teal);color:var(--ink)">Anxiety</span>
        <span class="floaty" style="left:48%;top:44%;background:var(--orange)">Pressure</span>
        <span class="floaty" style="left:26%;top:74%;background:var(--blue)">Loneliness</span>
        <span class="floaty" style="left:66%;top:72%;background:var(--blue)">Comparison</span>
        <span class="ficon" style="left:37%;top:24%;width:48px;height:48px">${ICON.heart}</span></div>
      <div class="bcard b-e" style="min-height:300px"><h4><span class="tag-b">Teens</span> aged 12–19 in Lagos, Abuja and beyond</h4>
        <div class="orbit"><span class="core"><img src="assets/logo.png" alt=""></span>${[[20,8,0],[62,2,5],[-6,46,6],[88,38,7],[30,70,1]].map(([x,y,i])=>`<img class="o" src="${g[i][0]}" alt="" style="left:${x}%;top:${y}%">`).join("")}</div></div>
      <div class="bcard b-f" style="min-height:200px"><h4><span class="tag-b">Parents</span> who want their teen to grow in a safe, vibrant place</h4>
        <p class="muted" style="margin-top:12px;font-size:.95rem;max-width:40ch">Vetted counselors, chats leaders can see, and parental consent for every teen under 18.</p></div>
      <div class="bcard b-g" style="min-height:200px"><h4>Leaders looking <span class="tag-y">to disciple</span> their teens week by week</h4></div>
    </div>
  </section>

  <section class="connect-band">
    <div class="stack" style="gap:14px"><span class="eyebrow" style="color:#9AA3BC">New · Connect</span><h2 style="color:#fff">Mentors and friends across <span class="mark">every expression</span></h2><p>Teens can ask an approved counselor to mentor them and make friends with teens from Lagos to London to Toronto. Leaders vet every counselor and can see every chat.</p><div class="row"><button class="btn blue" data-go="connect">Explore Connect</button><button class="btn" style="background:#fff;color:var(--ink)" data-go="auth-signup">Create an account</button></div></div>
    <div class="stats"><div><b>${EXPRESSIONS.filter(e=>e.country!=="Online").length}</b><small>expressions worldwide</small></div><div><b>${EXPRESSION_COUNTRIES.length-1}</b><small>countries plus online</small></div><div><b>100%</b><small>counselors vetted</small></div></div>
  </section>

  <section class="L-test">
    <h2>What <span class="mark o">people</span> are saying</h2>
    <span class="ficon" style="left:9%;top:200px;width:72px;height:72px">${ICON.chat}</span><span class="ficon" style="right:9%;top:240px;width:64px;height:64px">${ICON.music}</span>
    <svg class="peaks" viewBox="0 0 1200 160" preserveAspectRatio="none" aria-hidden="true"><path d="M0 160L160 40 250 90 330 20 480 160zM760 160L900 60 970 100 1060 30 1200 160z" fill="#fff"/></svg>
    <div class="L-cards">
      <div class="back" id="backL" style="transform:translateX(-120%) rotate(-7deg)"></div>
      <div class="back" id="backR" style="transform:translateX(20%) rotate(7deg)"></div>
      <div class="L-tcard" id="tcard"></div>
    </div>
    <div class="L-arrows"><button id="tPrev" aria-label="Previous">${I.back}</button><button id="tNext" aria-label="Next">${I.arrow}</button></div>
  </section>

  <section class="L-faq">
    <h2>Frequently asked <span class="mark o">questions</span></h2>
    <div class="faq">${FAQ.map((f,i)=>`<details ${i===0?"open":""} ${i>3?'data-more hidden':""}><summary>${esc(f[0])}</summary><p>${esc(f[1])}</p></details>`).join("")}</div>
    <button class="btn ink sm" id="faqMore">View more</button>
  </section>

  <section class="sheet" style="margin-top:clamp(60px,8vw,100px);display:grid;gap:24px;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));align-items:center">
    <div class="stack" style="gap:10px"><span class="eyebrow">Verse of the day</span><p class="verse">“${esc(v[1])}”</p><span class="verse-ref">${esc(v[0])} · KJV</span></div>
    <div class="stack" style="gap:6px"><span class="eyebrow">Next Sunday service</span><h3>${upcoming()[0]?fmtDate(upcoming()[0].d).full:"See events"}</h3><p class="muted">${SERVICE.times}<br>${SERVICE.where}</p><button class="btn ghost sm" style="align-self:flex-start;margin-top:6px" data-go="events">All events</button></div>
  </section>`;
},

about(){
  return `
  <section class="sheet hero stack" style="gap:18px">
    <span class="eyebrow">About us</span>
    <h1>We know God. We love God. We <span class="mark">serve</span> God.</h1>
    <p class="lede">Elevation Teenz, also called Teenz Nation, is the teenage ministry of The Elevation Church (TEC). We gather teens to worship, study the Bible, pray and build friendships, and we send them out to lead. On some Sundays our teens take the pulpit and teach the whole church.</p>
  </section>
  <section class="grid2">
    <div class="sheet stack"><span class="eyebrow">Vision</span><h3>Unleashing teen greatness globally.</h3><p class="muted">A generation of teenagers who know who they are in God and carry that into every room they walk into.</p></div>
    <div class="sheet stack"><span class="eyebrow">Mission</span><h3>Invest in teens spiritually, emotionally and mentally.</h3><p class="muted">Through Sunday services, the Study Hub and programs like Navigate, we help teens grow in self-concept, leadership and real skills.</p></div>
  </section>
  <section class="sheet stack">
    <span class="eyebrow">What we believe</span>
    <div class="grid3">
      ${[["We know God","Knowing God personally through Jesus Christ, His Word and His presence."],["We love God","Worship, prayer and a life that responds to His love."],["We serve God","Using our gifts to serve the church and the world, starting now (1 Timothy 4:12)."]]
      .map(([h,p])=>`<div class="tile"><h4>${h}</h4><p class="muted" style="font-size:.92rem;margin-top:4px">${p}</p></div>`).join("")}
    </div>
    <p class="note">${I.info}<span>Built from the Instagram bio. Add TEC's full statement of faith here.</span></p>
  </section>
  <section class="sheet stack">
    <div class="row" style="justify-content:space-between"><span class="eyebrow">Our leaders</span></div>
    <div class="grid3">
      ${[["godman-akinlabi","Godman Akinlabi","Global Lead Pastor, The Elevation Church"],["bola-akinlabi","Bola Akinlabi","Global Co-Lead Pastor, The Elevation Church"],["olayinka-favour","Olayinka Favour","Teens Pastor, Teenz Nation"]]
        .map(([f,n,r])=>`<div class="tile row" style="gap:14px;flex-wrap:nowrap"><img class="leader-av" src="assets/leaders/${f}.jpg" alt="${n}" width="56" height="56" loading="lazy"><div style="min-width:0"><b>${n}</b><p class="muted" style="font-size:.88rem">${r}</p></div></div>`).join("")}
    </div>
  </section>
  <section class="sheet stack">
    <span class="eyebrow">Where we are</span>
    <h3>${EXPRESSIONS.filter(e=>e.country!=="Online").length} expressions, one Teenz Nation.</h3>
    <p class="muted">The Elevation Church was founded on 10 October 2010 and now meets across ${EXPRESSION_COUNTRIES.filter(c=>c!=="Online").join(", ").replace(/, ([^,]*)$/," and $1")}, plus online.</p>
    <div class="row">${EXPRESSION_COUNTRIES.map(c=>`<span class="chip" style="cursor:default">${c} · ${EXPRESSIONS.filter(e=>e.country===c).length}</span>`).join("")}</div>
    <div class="row"><button class="btn blue" data-go="connect">See every expression</button><button class="btn ghost" data-go="auth-signup">Join Connect</button></div>
  </section>`;
},

programs(){
  return `
  <section class="sheet hero stack" style="gap:16px"><span class="eyebrow">Programs</span><h1>Every year, we <span class="mark o">BURN</span>.</h1><p class="lede">Weekly services keep teens growing, and our yearly programs stretch them further. Pick one to see what it's about and how to register.</p></section>
  <section class="grid2">
    <div class="sheet stack" style="gap:12px"><span class="eyebrow">Weekly</span><h2>Sunday Service</h2><p class="muted">${SERVICE.what}</p><div class="row"><span class="pill">${SERVICE.times}</span></div><p style="font-size:.92rem"><b>Where:</b> ${SERVICE.where}</p><button class="btn ink sm" style="align-self:flex-start" data-go="events">See dates ${I.arrow}</button></div>
    ${PROGRAMS.map(p=>`
    <button class="sheet stack" style="text-align:left;border:0;cursor:pointer;gap:14px" data-go="program-${p.id}">
      ${p.flyer?`<div class="flyer"><img src="${p.flyer}" alt="${p.name} ${p.theme||""} flyer"></div>`:p.img?`<div class="hero-photo has-img" style="min-height:170px"><img class="ph" src="${p.img}" alt=""><div class="cap"><span>${p.tag}</span>${p.theme?`<span>Theme: ${p.theme}</span>`:""}</div></div>`:`<div class="hero-photo" style="min-height:150px;background:linear-gradient(150deg,${p.color},#0A1F55)">${ridge}<div class="cap"><span>${p.tag}</span></div></div>`}
      <h2>${p.name}</h2><p class="muted">${esc(p.what)}</p>
      <div class="row"><span class="pill">${esc(p.when)}</span><span class="pill">${esc(p.who)}</span>${p.confirm?placeholder("Add details"):""}</div>
      <span class="btn ink sm" style="align-self:flex-start">Details${p.register?" & registration":""} ${I.arrow}</span>
    </button>`).join("")}
    <div class="sheet stack"><span class="eyebrow">Also from Teenz Nation</span><h3>Dance Concert, RAW Praise & more</h3><p class="muted">Concerts, praise nights and teen-led Sundays happen through the year. See the highlights on Instagram.</p><a class="btn ghost sm" style="align-self:flex-start" href="${LINKS.ig}" target="_blank" rel="noopener">${SOC.ig.s}Open Instagram</a></div>
  </section>`;
},

hub(){
  const cats=Object.entries(CATS);
  return `
  <section class="sheet hero stack" style="gap:16px">
    <span class="eyebrow">Study Hub</span>
    <h1>Study the Bible <span class="mark">for real life</span>.</h1>
    <p class="lede">Short studies on the things teens actually face. Each one has scriptures, a Bible character, questions, a challenge, a prayer, a private journal and a quick quiz.</p>
    <form class="search" id="hubSearch" role="search">${I.search}<input id="hubQ" type="text" placeholder="Try “lonely”, “patience” or “Psalm 139”" aria-label="Search by topic, verse or feeling"><button class="btn blue sm" type="submit">Search</button></form>
    <div class="scroller">${FEELINGS.map(f=>`<button class="chip" data-feel="${esc(f.q)}">${esc(f.label)}</button>`).join("")}</div>
  </section>

  <section class="sheet stack" id="results" hidden></section>

  <section class="stack" style="gap:12px">
    <div class="row" style="justify-content:space-between;padding-inline:4px"><h2>Study series</h2><span class="muted" style="font-size:.9rem">Multi-day plans</span></div>
    <div class="grid3">${SERIES.map(s=>{const p=seriesProgress(s);return `
      <button class="sheet stack" style="text-align:left;border:0;cursor:pointer;gap:12px" data-go="series-${s.id}">
        <div class="row" style="justify-content:space-between"><span class="pill" style="background:${s.color};color:${s.color.includes("cyan")?"var(--on-mark)":"#fff"}">${s.days.length} days</span><span class="muted" style="font-size:.8rem">${esc(s.ref)}</span></div>
        <h3>${esc(s.title)}</h3>
        <div class="bar"><i style="width:${p.done/p.total*100}%"></i></div>
        <span class="muted" style="font-size:.85rem">${p.done} of ${p.total} days done</span>
      </button>`}).join("")}</div>
  </section>

  <section class="sheet stack">
    <div class="row" style="justify-content:space-between"><h2>Topic library</h2><span class="muted" style="font-size:.9rem">${lessonCount()} ready · more coming</span></div>
    <div class="scroller" id="catChips"><button class="chip on" data-cat="all">All</button>${cats.map(([k,c])=>`<button class="chip" data-cat="${k}"><i class="cat-dot" style="background:${c.color}"></i>${c.name}</button>`).join("")}</div>
    <div class="grid3" id="topicGrid">${TOPICS.slice().sort((a,b)=>(b.lesson?1:0)-(a.lesson?1:0)).map(topicCard).join("")}</div>
  </section>`;
},

grow(){
  const st=streak();const badges=getBadges();const mem=Object.values(LESSONS).map(l=>l.memory);
  const mine=S.myPrayers;
  return `
  <section class="sheet hero stack" style="gap:16px"><span class="eyebrow">Grow</span><h1>Keep <span class="mark o">showing up</span>.</h1><p class="lede">Track your streak, collect badges, practise memory verses and pray for each other.</p>
    <p class="note">${I.lock}<span>Your progress and journal are saved on this device only. Accounts will let you keep them across devices.</span></p></section>

  <section class="grid2">
    <div class="sheet stack">
      <span class="eyebrow">Daily streak</span>
      <div class="row" style="gap:14px"><span class="stat">${st}</span><span><b>${st===1?"day":"days"} in a row</b><br><span class="muted" style="font-size:.9rem">Complete a study to keep it going.</span></span></div>
      <div class="days" aria-label="Last 7 days">${[6,5,4,3,2,1,0].map(i=>{const n=dayNum(today())-i;const d=new Date(n*864e5);const on=S.activity.some(a=>dayNum(a)===n);return `<span class="${on?"d":i===0?"n":""}" title="${d.toDateString()}">${"SMTWTFS"[d.getUTCDay()]}</span>`}).join("")}</div>
    </div>
    <div class="sheet stack">
      <span class="eyebrow">Studies</span>
      <div class="row" style="gap:14px"><span class="stat">${doneCount()}<span class="muted" style="font-size:1.2rem">/${lessonCount()}</span></span><span class="muted" style="font-size:.9rem">studies completed</span></div>
      <div class="bar"><i style="width:${doneCount()/lessonCount()*100}%"></i></div>
      <button class="btn blue sm" style="align-self:flex-start" data-go="hub">Find a study</button>
    </div>
  </section>

  <section class="sheet stack">
    <div class="row" style="justify-content:space-between"><span class="eyebrow">Badges</span><span class="muted" style="font-size:.85rem">${badges.filter(b=>b.got).length} of ${badges.length} earned</span></div>
    <div class="badges">${badges.map(b=>`<div class="badge ${b.got?"got":""}"><span class="medal">${b.got?I.star:I.lock}</span><b>${b.name}</b><small>${b.how}</small></div>`).join("")}</div>
  </section>

  <section class="sheet stack">
    <span class="eyebrow">Memory verse tracker</span>
    <p class="muted">Tap a verse to practise. Words are hidden; tap each blank to check yourself, then mark it as memorised.</p>
    <div id="memList">${mem.map((m,i)=>`<button class="lrow" data-mem="${i}"><span class="ic" style="background:${S.memorized[m[0]]?"var(--green)":"var(--chip)"};color:${S.memorized[m[0]]?"#fff":"var(--muted)"}">${S.memorized[m[0]]?I.check:i+1}</span><span class="tx"><b>${esc(m[0])}</b><small>${esc(m[1].slice(0,58))}…</small></span>${S.memorized[m[0]]?'<span class="pill done">Memorised</span>':'<span class="pill">Practise</span>'}</button>`).join("")}</div>
    <div id="memPractice" class="tile stack" hidden></div>
  </section>

  <section class="sheet stack" id="prayer">
    <div class="row" style="justify-content:space-between"><span class="eyebrow">Prayer wall</span><span class="pill blue">Moderated</span></div>
    <h3>Pray for one another.</h3>
    <p class="muted" style="font-size:.92rem">Every request is checked by a leader before it appears. Use your first name or stay anonymous, and don't share your school, address or phone number.</p>
    <div class="stack" style="gap:10px">
      ${mine.map(p=>`<div class="prayer"><p>${esc(p.text)}</p><div class="row"><span class="pill warn">Waiting for review</span><span class="muted" style="font-size:.8rem">Only you can see this</span></div></div>`).join("")}
      ${PRAYERS.map(p=>{const on=S.prayed[p.id];return `<div class="prayer"><p>${esc(p.text)}</p><div class="row"><span class="muted" style="font-size:.82rem">${esc(p.name)} · <span class="pill">Sample</span></span><button class="pray-btn ${on?"on":""}" data-pray="${p.id}" aria-pressed="${!!on}">${on?"Prayed":"I prayed"} · ${p.n+(on?1:0)}</button></div></div>`}).join("")}
    </div>
    <form id="prayForm" class="stack" style="gap:10px">
      <label class="f" for="prayText">Share a prayer request<textarea id="prayText" maxlength="280" placeholder="What would you like prayer for?" required style="min-height:90px"></textarea></label>
      <label class="check"><input type="checkbox" id="prayAnon" checked> Post anonymously</label>
      <button class="btn blue" type="submit" style="align-self:flex-start">Send for review</button>
    </form>
  </section>

  <section class="sheet stack">
    <div class="row" style="justify-content:space-between"><span class="eyebrow">Testimonies</span>${placeholder("Add real stories with permission")}</div>
    <h3>What God is doing.</h3>
    <div class="grid2">${[1,2].map(()=>`<div class="tile stack" style="gap:8px"><p class="muted">A teen's story will go here: what happened, what they learned and how it changed them.</p><span class="muted" style="font-size:.82rem">First name, age, chapter</span></div>`).join("")}</div>
    ${S.myStories.length?`<div class="callout">You've sent ${S.myStories.length} ${S.myStories.length>1?"stories":"story"} for review.</div>`:""}
    <form id="storyForm" class="stack" style="gap:10px">
      <label class="f" for="storyText">Share your testimony<textarea id="storyText" maxlength="800" placeholder="What has God done in your life?" required></textarea></label>
      <button class="btn ink" type="submit" style="align-self:flex-start">Send for review</button>
    </form>
  </section>`;
},

media(){
  const items=[["Live on YouTube","Sunday services","Stream Teenz Nation services",LINKS.yt,SOC.yt.c,SOC.yt.s],["Reels on Instagram","Navigate '26 recaps","Day-by-day camp highlights",LINKS.ig,SOC.ig.c,SOC.ig.s],["Instagram highlight","#NavTestimonies","Stories from Navigate teens",LINKS.ig,SOC.ig.c,SOC.ig.s],["Video on Instagram","“I Am”","Teenz Nation video",LINKS.ig,SOC.ig.c,SOC.ig.s]];
  return `
  <section class="sheet hero stack" style="gap:16px"><span class="eyebrow">Media</span><h1>Watch, listen, <span class="mark">look back</span>.</h1><p class="lede">Services, recaps and photos from Teenz Nation.</p></section>
  <section class="sheet stack">
    <span class="eyebrow">Watch</span>
    <div class="grid2">${items.map(([k,t,m,u,c,ic])=>`<a class="tile media-card" href="${u}" target="_blank" rel="noopener" style="text-decoration:none"><span class="play" style="background:${c}">${ic}</span><span style="min-width:0"><span class="eyebrow">${k}</span><b style="display:block">${t}</b><small class="muted">${m}</small></span></a>`).join("")}</div>
    <p class="note">${I.info}<span>Links open YouTube or Instagram in a new tab.</span></p>
  </section>
  <section class="sheet stack">
    <div class="row" style="justify-content:space-between"><span class="eyebrow">Photo gallery · Navigate 2026</span><a class="btn ghost sm" href="${LINKS.ig}" target="_blank" rel="noopener">${SOC.ig.s}More on Instagram</a></div>
    <div class="gallery">${GALLERY.map(([s,c])=>`<figure><img src="${s}" alt="${esc(c)}" loading="lazy"><figcaption>${esc(c)}</figcaption></figure>`).join("")}</div>
  </section>`;
},

events(){
  const ev=upcoming();const months={};ev.forEach(e=>{const k=new Date(e.d+"T12:00:00").toLocaleString("en",{month:"long",year:"numeric"});(months[k]=months[k]||[]).push(e)});
  return `
  <section class="sheet hero stack" style="gap:16px"><span class="eyebrow">Events</span><h1>See you <span class="mark">there</span>.</h1><p class="lede">Sunday services, program dates and online sessions. Tap “Remind me” to save a reminder.</p>
  <p class="note">${I.info}<span>Sunday dates follow the every-other-week pattern on Instagram, so confirm each one. Reminders are saved on this device; notifications will come with accounts.</span></p></section>
  ${Object.entries(months).map(([m,list])=>`<section class="sheet stack" style="gap:4px"><span class="eyebrow" style="margin-bottom:6px">${m}</span>${list.map(e=>eventRow(e,true)).join("")}</section>`).join("")}`;
},

involved(){
  return `
  <section class="sheet hero stack" style="gap:16px"><span class="eyebrow">Get involved</span><h1>There's a <span class="mark o">place</span> for you.</h1><p class="lede">Join a chapter, serve on a team, give, or just follow along online.</p></section>
  <section class="grid3">
    <div class="sheet stack"><span class="eyebrow">Join a chapter</span><h3>Find your people</h3><p class="muted">Meet with teens near you every week. If there's no chapter yet, we'll help you start one.</p><a class="btn blue sm" style="align-self:flex-start" href="javascript:void 0" data-scroll="joinForm">Sign up below</a></div>
    <div class="sheet stack"><span class="eyebrow">Volunteer</span><h3>Serve the team</h3><p class="muted">Media, worship, hosting, outreach and more. Adults who serve with teens go through a safeguarding check.</p><a class="btn ghost sm" style="align-self:flex-start" href="javascript:void 0" data-scroll="joinForm">I want to help</a></div>
    <div class="sheet stack"><span class="eyebrow">New here?</span><h3>Just gave your life to Jesus?</h3><p class="muted">Fill the New Believer's form so a leader can walk with you on the journey.</p><a class="btn blue sm" style="align-self:flex-start" href="${LINKS.newBeliever}" target="_blank" rel="noopener">New Believer's form</a></div>
  </section>
  <section class="sheet stack" id="joinForm">
    <h2>Sign up</h2>
    <form id="signup" class="stack" style="gap:12px;max-width:560px">
      <label class="f" for="suName">First name<input type="text" id="suName" required autocomplete="given-name"></label>
      <label class="f" for="suAge">Age<select id="suAge" required><option value="">Choose</option>${[12,13,14,15,16,17,18,19].map(a=>`<option>${a}</option>`).join("")}<option value="adult">Adult volunteer</option></select></label>
      <label class="f" for="suCity">City or chapter<input type="text" id="suCity" required></label>
      <label class="f" for="suWant">I'd like to<select id="suWant"><option>Join a chapter</option><option>Volunteer</option><option>Start a chapter</option></select></label>
      <div id="parentBox" class="stack" style="gap:12px" hidden>
        <div class="callout">You're under 18, so we need a parent or guardian's OK before you join.</div>
        <label class="f" for="suParent">Parent or guardian's email<input type="email" id="suParent"></label>
        <label class="check"><input type="checkbox" id="suConsent"> My parent or guardian knows I'm signing up and will confirm by email.</label>
      </div>
      <button class="btn blue" type="submit" style="align-self:flex-start">Sign up</button>
      <p class="note">${I.info}<span>Prototype: this form doesn't send anything yet. It will be connected when accounts go live.</span></p>
    </form>
  </section>
  <section class="sheet stack">
    <span class="eyebrow">Connect</span>
    <h3>Follow Elevation Teenz</h3>
    <div class="row">${["ig","yt","tt","fb","th"].map(k=>`<a class="btn sm soc-btn" style="--sc:${SOC[k].c}" href="${SOC[k].u()}" target="_blank" rel="noopener">${SOC[k].s}${SOC[k].n}</a>`).join("")}</div>
    <p class="muted" style="font-size:.92rem">@elevationteenz on every platform. Get the Tec Teenz app and all our links from the <a href="${LINKS.app}" target="_blank" rel="noopener">app page</a> and <a href="${LINKS.linktree}" target="_blank" rel="noopener">Linktree</a>.</p>
    <div class="row">${placeholder("Add giving details")}${placeholder("Add contact email")}</div>
    <p class="note">${I.lock}<span>Connect chats stay inside the site and church leaders can read them. Counselors are approved before teens can see them.</span></p>
  </section>`;
}
};

function getBadges(){
  const st=streak(),d=doneCount(),j=Object.values(S.journal).filter(x=>Object.values(x).some(v=>v&&v.trim())).length,m=Object.keys(S.memorized).length;
  const series=SERIES.some(s=>seriesProgress(s).done>0);
  const perfect=Object.values(S.quiz).some(q=>q&&q.score===q.total);
  return [
    {name:"First step",how:"Complete your first study",got:d>=1},
    {name:"On a roll",how:"Keep a 3-day streak",got:st>=3},
    {name:"Week strong",how:"Keep a 7-day streak",got:st>=7},
    {name:"Journal keeper",how:"Write in 2 journals",got:j>=2},
    {name:"Hidden in my heart",how:"Memorise 2 verses",got:m>=2},
    {name:"Quiz ace",how:"Get a perfect quiz score",got:perfect},
    {name:"Series starter",how:"Finish a day of any series",got:series},
    {name:"All in",how:`Complete all ${lessonCount()} studies`,got:d>=lessonCount()}
  ];
}

const PARTS=["Hook","Key scriptures","Teaching","Bible character","Reflect","Memory verse","Challenge","Prayer","Journal","Quick quiz"];
function viewLesson(id){
  const t=topic(id),L=LESSONS[id];
  if(!t||!L) return `<section class="sheet stack"><h2>That study isn't ready yet.</h2><button class="btn blue" data-go="hub" style="align-self:flex-start">Back to Study Hub</button></section>`;
  const c=CATS[t.cat];const J=S.journal[id]||{};const done=S.done[id];
  const part=(i,body,extra="")=>`<section class="sheet stack part" id="p${i}" ${extra}><span class="num">${String(i+1).padStart(2,"0")} · ${PARTS[i]}</span>${body}</section>`;
  return `
  <div class="row" style="margin-bottom:12px"><button class="btn ghost sm" data-go="hub">${I.back} Study Hub</button></div>
  <section class="sheet hero lesson-head stack" style="gap:14px">
    <span class="row" style="gap:6px"><i class="cat-dot" style="background:${c.color}"></i><span class="eyebrow">${c.name} · ${t.mins} min study</span></span>
    <h1><span class="mark">${esc(t.title)}</span></h1>
    <p class="lede">${esc(t.blurb)}</p>
    ${done?`<span class="pill done" style="align-self:flex-start">Completed ${fmtDate(done).full}</span>`:""}
  </section>
  <div class="steps-nav"><div class="scroller" id="stepChips">${PARTS.map((p,i)=>`<button class="chip" data-step="${i}">${i+1}. ${p}</button>`).join("")}</div></div>
  <div class="stack">
  ${part(0,`<p class="verse" style="font-size:1.2rem;font-weight:600">${esc(L.hook)}</p>`)}
  ${part(1,`<div class="stack" style="gap:16px">${L.verses.map(v=>`<div class="scripture"><b>${esc(v[0])}</b><p>${esc(v[1])}</p></div>`).join("")}</div><p class="note">${I.info}<span>King James Version. ${esc(L.versesNote||"")}</span></p>`)}
  ${part(2,`<div class="prose">${L.teaching.map(p=>`<p>${esc(p)}</p>`).join("")}</div>`)}
  ${part(3,`<div class="row" style="gap:14px;align-items:center"><span class="ic" style="width:56px;height:56px;border-radius:18px;display:grid;place-items:center;background:var(--orange);color:#fff;font-family:var(--f-display);font-weight:800;font-size:1.4rem">${L.character.name[0]}</span><div><h3>${esc(L.character.name)}</h3><span class="verse-ref">${esc(L.character.ref)}</span></div></div><p class="prose">${esc(L.character.text)}</p>`)}
  ${part(4,`<ol class="stack" style="gap:10px;padding-left:20px;margin:0">${L.questions.map(q=>`<li>${esc(q)}</li>`).join("")}</ol><p class="muted" style="font-size:.9rem">Write your answers in the journal below.</p>`)}
  <section class="memory stack part" id="p5" style="gap:12px"><span class="eyebrow">06 · Memory verse for the week</span><p class="verse">“${esc(L.memory[1])}”</p><div class="row" style="justify-content:space-between"><span class="verse-ref" style="color:var(--cyan)">${esc(L.memory[0])}</span><button class="btn sm" style="background:var(--cyan);color:var(--on-mark)" data-go="grow">Practise it</button></div></section>
  ${part(6,`<div class="callout" style="background:color-mix(in srgb,var(--cyan) 26%,var(--sheet));font-size:1rem"><b>This week:</b> ${esc(L.challenge)}</div>`)}
  ${part(7,`<p class="prose" style="font-style:italic">${esc(L.prayer)}</p>${L.safety?`<div class="callout">${esc(L.safety)}</div>`:""}`)}
  ${part(8,`<p class="note">${I.lock}<span>Private. Saved on this device only, and never shown to anyone else.</span></p>${L.questions.map((q,i)=>`<label class="f" for="j${i}">${esc(q)}<textarea id="j${i}" data-j="${i}" placeholder="Write freely…">${esc(J[i]||"")}</textarea></label>`).join("")}<span class="muted" id="jsaved" style="font-size:.82rem"></span>`)}
  ${part(9,`<div class="stack" id="quiz">${L.quiz.map((q,qi)=>`<div class="q" data-q="${qi}"><b>${qi+1}. ${esc(q.q)}</b>${q.o.map((o,oi)=>`<button class="opt" data-o="${oi}">${esc(o)}</button>`).join("")}</div>`).join("")}<div id="quizScore" class="callout" hidden></div></div>`)}
  <section class="sheet stack" style="align-items:flex-start">
    <h3>${done?"You've completed this study.":"Finished?"}</h3>
    <p class="muted">${done?"Come back any time to reread or add to your journal.":"Mark it complete to grow your streak and earn badges."}</p>
    <div class="row"><button class="btn blue" id="completeBtn" ${done?"disabled":""}>${done?"Completed":"Mark as complete"}</button><button class="btn ghost" data-go="hub">More studies</button></div>
  </section>
  </div>`;
}

function viewSeries(id){
  const s=SERIES.find(x=>x.id===id);if(!s)return VIEWS.hub();
  const p=seriesProgress(s);
  return `
  <div class="row" style="margin-bottom:12px"><button class="btn ghost sm" data-go="hub">${I.back} Study Hub</button></div>
  <section class="sheet hero stack" style="gap:14px"><span class="eyebrow">Study series · ${s.days.length} days · ${esc(s.ref)}</span><h1>${esc(s.title)}</h1>
    <div class="bar"><i style="width:${p.done/p.total*100}%"></i></div><span class="muted">${p.done} of ${p.total} days done</span>
    ${p.next?`<button class="btn blue" style="align-self:flex-start" data-go="lesson-${p.next.l}">${p.done?"Continue":"Start"}: Day ${s.days.indexOf(p.next)+1} ${I.arrow}</button>`:""}
  </section>
  <section class="sheet">${s.days.map((d,i)=>{const done=d.l&&S.done[d.l];return d.l?
    `<button class="lrow" data-go="lesson-${d.l}"><span class="ic" style="background:${done?"var(--green)":"var(--blue-soft)"};color:${done?"#fff":"var(--blue)"}">${done?I.check:i+1}</span><span class="tx"><b>Day ${i+1}: ${esc(d.t)}</b><small>${done?"Completed":topic(d.l).mins+" min study"}</small></span>${I.arrow}</button>`:
    `<div class="lrow" style="cursor:default;opacity:.6"><span class="ic" style="background:var(--chip);color:var(--muted)">${i+1}</span><span class="tx"><b>Day ${i+1}: ${esc(d.t)}</b><small>Coming soon</small></span></div>`}).join("")}</section>`;
}

function viewProgram(id){
  const p=PROGRAMS.find(x=>x.id===id);if(!p)return VIEWS.programs();
  return `
  <div class="row" style="margin-bottom:12px"><button class="btn ghost sm" data-go="programs">${I.back} Programs</button></div>
  <section class="hero-grid">
    <div class="sheet hero stack" style="gap:14px"><span class="eyebrow">${p.tag}</span><h1><span class="mark ${p.id==="navigate"?"":"o"}">${p.name}</span>${p.theme?(p.theme.length>8?`<br><span class="mark o" style="font-size:.6em">${p.theme}</span>`:` <span class="mark o">${p.theme}</span>`):""}</h1>${p.themeLine?`<p class="verse" style="font-size:1.15rem">${esc(p.themeLine)}</p>`:""}<p class="lede">${esc(p.what)}</p>${p.confirm?placeholder("Add details"):""}
      <div class="grid2" style="gap:10px;grid-template-columns:1fr 1fr">${[["When",p.when],["Who",p.who],["Format",p.format],["Organised by","The Elevation Church"]].map(([k,v])=>`<div class="tile"><span class="eyebrow">${k}</span><b style="display:block">${esc(v)}</b></div>`).join("")}</div>
      ${p.register?`<a class="btn blue" style="align-self:flex-start" href="${p.register}" target="_blank" rel="noopener">Register on the Navigate site ${I.arrow}</a>`:""}
    </div>
    <div class="stack" id="heroSide" style="gap:16px;margin-top:16px">
      ${p.flyer?`<div class="flyer"><img src="${p.flyer}" alt="${p.name} ${p.theme||""} flyer"></div>`:p.img?`<div class="hero-photo has-img" style="min-height:280px"><img class="ph" src="${p.img}" alt=""><div class="cap"><span>${p.tag}</span></div></div>`:`<div class="hero-photo" style="min-height:240px;background:linear-gradient(150deg,${p.color},#0A1F55)">${ridge}<div class="cap"><span>Photos coming</span></div></div>`}
      ${p.editions?`<div class="sheet stack" style="gap:4px"><span class="eyebrow" style="margin-bottom:6px">${p.editions.length>1?"2026 editions":"2026 edition"}</span>${p.editions.map(e=>`<div class="lrow" style="cursor:default"><span class="ic" style="background:var(--blue-soft);color:var(--blue)">${I.cal}</span><span class="tx"><b>${e[0]}</b><small>${e[1]} · ${e[2]}</small></span></div>`).join("")}${p.id==="navigate"?'<p class="muted" style="font-size:.85rem;margin-top:6px">Navigate is expanding to four cities across Nigeria.</p>':""}</div>`:""}
    </div>
  </section>
  ${p.moments?`<section class="grid2">
    <div class="sheet stack"><span class="eyebrow">What happens at camp</span><div class="row">${p.moments.map(m=>`<span class="chip" style="cursor:default">${m}</span>`).join("")}</div></div>
    <div class="sheet stack"><span class="eyebrow">Vocational skills · 18 tracks</span><div class="row">${p.tracks.map(m=>`<span class="chip" style="cursor:default">${m}</span>`).join("")}<span class="chip soon">+ more</span></div></div>
  </section>
  <section class="sheet stack">
    <div class="row" style="justify-content:space-between"><span class="eyebrow">From Navigate 2026</span><a class="btn ghost sm" data-go="media" href="javascript:void 0">All photos</a></div>
    <div class="gallery">${GALLERY.slice(0,4).map(([s,c])=>`<figure><img src="${s}" alt="${esc(c)}" loading="lazy"><figcaption>${esc(c)}</figcaption></figure>`).join("")}</div>
    <p class="muted" style="font-size:.9rem">Past editions: ${p.past.join(" · ")}. Watch the highlights on <a href="${LINKS.ig}" target="_blank" rel="noopener" style="display:inline-flex;align-items:center;gap:4px;vertical-align:middle">${SOC.ig.s}Instagram</a>.</p>
  </section>`:""}
  ${p.register?"":`<section class="sheet stack"><h3>Registration</h3><p class="muted">Dates and registration for the next ${p.name} will be shared on <a href="${LINKS.ig}" target="_blank" rel="noopener">Instagram</a> and here.</p></section>`}`;
}

/* ===================== SEARCH ===================== */
function searchTopics(q){
  q=q.toLowerCase().trim();if(!q)return[];
  const words=q.split(/\s+/);
  return TOPICS.map(t=>{const hay=(t.title+" "+t.blurb+" "+t.tags+" "+CATS[t.cat].name+(LESSONS[t.id]?" "+LESSONS[t.id].verses.map(v=>v[0]).join(" "):"")).toLowerCase();
    let s=0;if(hay.includes(q))s+=5;words.forEach(w=>{if(w.length>1&&hay.includes(w))s+=1});if(t.lesson)s+=.5;return{t,s}})
    .filter(x=>x.s>1).sort((a,b)=>b.s-a.s).map(x=>x.t);
}
function showResults(q){
  const box=$("#results");if(!box)return;
  const r=searchTopics(q);box.hidden=false;
  box.innerHTML=`<div class="row" style="justify-content:space-between"><h3>Results for “${esc(q)}”</h3><button class="btn ghost sm" id="clearRes">Clear</button></div>`+
   (r.length?`<div class="grid3">${r.map(topicCard).join("")}</div>`:`<p class="muted">No studies match that yet. Try a feeling like “lonely” or “anxious”, or browse the library below.</p>`)+
   `<p class="note">${I.info}<span>Struggling with something heavy? Talk to a parent, youth leader or another adult you trust.</span></p>`;
  $("#clearRes").onclick=()=>{box.hidden=true;$("#hubQ").value=""};
  box.scrollIntoView({behavior:"smooth",block:"start"});
}
let pendingSearch=null,pendingCat=null;
function drawGlobe(){const c=$("#globe");if(!c)return;const x=c.getContext("2d");const W=c.width,H=c.height,cx=W/2,cy=H,R=H*.98;
  x.clearRect(0,0,W,H);let seed=7;const rnd=()=>(seed=(seed*16807)%2147483647)/2147483647;
  for(let y=14;y<H;y+=16){for(let xx=0;xx<W;xx+=16){const dx=xx-cx,dy=y-cy,d=Math.hypot(dx,dy);if(d>R)continue;
    const lon=Math.atan2(dx,-dy),lat=d/R;const n=Math.sin(lon*5.3+1)*Math.cos(lat*7.1)+Math.sin(lon*2.1+lat*9)*.8;
    if(n<-.15&&rnd()>.15)continue;const a=.25+.75*(1-lat*.6);x.fillStyle=`rgba(47,140,250,${a.toFixed(2)})`;
    const s=4.2*(0.55+0.45*Math.cos(lat*1.2));x.fillRect(xx-s/2,y-s/2,s,s)}}}

/* ===================== PAGE BINDINGS ===================== */
const AFTER={
home(){
  const setTool=k=>{const [body,t,txt]=toolkitScreen(k);const ti_=$("#toolIcon");if(ti_)ti_.innerHTML=ICON[{library:"bible",series:"flame",lesson:"cross",journal:"heart",quiz:"sparkle",prayer:"chat"}[k]];$("#toolBody").innerHTML=body;$("#toolTitle").textContent=t;$("#toolText").textContent=txt;
    document.querySelectorAll("[data-tool]").forEach(b=>{b.classList.toggle("on",b.dataset.tool===k);b.setAttribute("aria-selected",b.dataset.tool===k)});
    const go=$("#tkGo");if(go)go.onclick=()=>{pendingSearch=$("#tkQ").value||"lonely";go_("hub")};
    const q=$("#tkQ");if(q)q.onkeydown=e=>{if(e.key==="Enter"){pendingSearch=q.value;go_("hub")}};
    document.querySelectorAll("#toolBody .opt").forEach(o=>o.onclick=()=>o.classList.add(o.classList.contains("right")?"right":"wrong"));};
  const go_=r=>go(r);
  const TK=[...document.querySelectorAll("[data-tool]")].map(b=>[b.dataset.tool,b.textContent]);
  const peek=(el,k,dir)=>{const [t]=toolkitScreen(k)?[toolkitScreen(k)[1]]:[""];const i=TK.findIndex(x=>x[0]===k);
    el.innerHTML=`<span class="pk-dir">${dir<0?I.back:""}${dir<0?"Previous":"Next"}${dir>0?I.arrow:""}</span><span class="pk-num">${String(i+1).padStart(2,"0")} / ${String(TK.length).padStart(2,"0")}</span><b>${t}</b><span class="pk-txt">${toolkitScreen(k)[2]}</span>`;el.onclick=()=>setTool2(k)};
  const setTool2=k=>{setTool(k);const i=TK.findIndex(x=>x[0]===k);peek($("#peekPrev"),TK[(i-1+TK.length)%TK.length][0],-1);peek($("#peekNext"),TK[(i+1)%TK.length][0],1)};
  document.querySelectorAll("[data-tool]").forEach(b=>b.onclick=()=>setTool2(b.dataset.tool));setTool2("library");
  const qHTML=q=>`<span style="width:64px;height:64px;border-radius:50%;display:grid;place-items:center;background:var(--blue-soft);color:var(--blue);font-weight:600;font-size:1.3rem">${q.who[0]}</span><b style="font-weight:500;font-size:1.05rem">${esc(q.who)}</b><span class="muted" style="font-size:.84rem">${esc(q.src)}</span><q style="font-size:.92rem">${esc(q.q)}</q>`;
  const sideQ=()=>{const L=QUOTES[(ti+QUOTES.length-1)%QUOTES.length],R=QUOTES[(ti+1)%QUOTES.length];$("#backL").innerHTML=`<div class="bq">${qHTML(L)}</div>`;$("#backR").innerHTML=`<div class="bq">${qHTML(R)}</div>`};
  let ti=0;const showQ=()=>{sideQ();const q=QUOTES[ti];$("#tcard").innerHTML=`<span style="width:64px;height:64px;border-radius:50%;display:grid;place-items:center;background:var(--blue-soft);color:var(--blue);font-weight:600;font-size:1.3rem">${q.who[0]}</span><b style="font-weight:500;font-size:1.1rem">${esc(q.who)}</b><span class="src" style="display:inline-flex;align-items:center;gap:6px;color:${SOC.ig.c}">${SOC.ig.s}<span class="muted">${esc(q.src)} on Instagram</span></span><q style="margin-top:10px">${esc(q.q)}</q>`};
  showQ();$("#backL").onclick=()=>{ti=(ti+QUOTES.length-1)%QUOTES.length;showQ()};$("#backR").onclick=()=>{ti=(ti+1)%QUOTES.length;showQ()};$("#tPrev").onclick=()=>{ti=(ti+QUOTES.length-1)%QUOTES.length;showQ()};$("#tNext").onclick=()=>{ti=(ti+1)%QUOTES.length;showQ()};
  $("#faqMore").onclick=e=>{document.querySelectorAll("[data-more]").forEach(d=>d.hidden=false);e.target.hidden=true};
  document.querySelectorAll("[data-feel]").forEach(b=>b.onclick=()=>{pendingSearch=b.dataset.feel;go("hub")});
  document.querySelectorAll("[data-cat-go]").forEach(b=>b.addEventListener("click",()=>{pendingCat=b.dataset.catGo}));
  drawGlobe();
},
hub(){
  $("#hubSearch").onsubmit=e=>{e.preventDefault();showResults($("#hubQ").value)};
  document.querySelectorAll("[data-feel]").forEach(b=>b.onclick=()=>{$("#hubQ").value=b.dataset.feel;showResults(b.dataset.feel)});
  document.querySelectorAll("[data-cat]").forEach(b=>b.onclick=()=>{
    document.querySelectorAll("[data-cat]").forEach(x=>x.classList.toggle("on",x===b));
    const k=b.dataset.cat;$("#topicGrid").innerHTML=TOPICS.filter(t=>k==="all"||t.cat===k).sort((a,b)=>(b.lesson?1:0)-(a.lesson?1:0)).map(topicCard).join("")});
  if(pendingSearch){const q=pendingSearch;pendingSearch=null;$("#hubQ").value=q;showResults(q)}
  if(pendingCat){const b=document.querySelector(`[data-cat="${pendingCat}"]`);pendingCat=null;if(b){b.click();setTimeout(()=>$("#topicGrid").scrollIntoView({block:"center"}),50)}}
},
lesson(r){
  const id=r.slice(7);if(!LESSONS[id])return;
  document.querySelectorAll("[data-step]").forEach(b=>b.onclick=()=>$("#p"+b.dataset.step).scrollIntoView({behavior:"smooth"}));
  let tm;document.querySelectorAll("[data-j]").forEach(t=>t.oninput=()=>{S.journal[id]=S.journal[id]||{};S.journal[id][t.dataset.j]=t.value;clearTimeout(tm);tm=setTimeout(()=>{save();$("#jsaved").textContent="Saved on this device"},400)});
  const L=LESSONS[id];const ans={};
  document.querySelectorAll("#quiz .q").forEach(qd=>{const qi=+qd.dataset.q;qd.querySelectorAll(".opt").forEach(o=>o.onclick=()=>{
    if(qi in ans)return;const oi=+o.dataset.o;ans[qi]=oi;
    qd.querySelectorAll(".opt").forEach(x=>{const xi=+x.dataset.o;if(xi===L.quiz[qi].a)x.classList.add("right");else if(xi===oi)x.classList.add("wrong")});
    if(Object.keys(ans).length===L.quiz.length){const sc=L.quiz.filter((q,i)=>ans[i]===q.a).length;S.quiz[id]={score:sc,total:L.quiz.length};save();
      const box=$("#quizScore");box.hidden=false;box.innerHTML=`<b>${sc} of ${L.quiz.length} correct.</b> ${sc===L.quiz.length?"Perfect score!":"Check the green answers and look back at the scriptures."}`}
  })});
  const steps=[...document.querySelectorAll(".part")];const chips=[...document.querySelectorAll("[data-step]")];
  const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){const i=steps.indexOf(e.target);chips.forEach((c,ci)=>c.classList.toggle("on",ci===i));chips[i]&&chips[i].scrollIntoView({block:"nearest",inline:"center"})}}),{rootMargin:"-45% 0px -50% 0px"});
  steps.forEach(s=>io.observe(s));
  const cb=$("#completeBtn");if(cb)cb.onclick=()=>{if(S.done[id])return;S.done[id]=today();logActivity();save();toast("Study complete · streak "+streak()+(streak()===1?" day":" days"));render();window.scrollTo(0,document.body.scrollHeight)};
},
grow(){
  document.querySelectorAll("[data-pray]").forEach(b=>b.onclick=()=>{const id=b.dataset.pray;S.prayed[id]=!S.prayed[id];if(!S.prayed[id])delete S.prayed[id];save();const p=PRAYERS.find(x=>x.id===id);b.classList.toggle("on",!!S.prayed[id]);b.textContent=(S.prayed[id]?"Prayed":"I prayed")+" · "+(p.n+(S.prayed[id]?1:0))});
  $("#prayForm").onsubmit=e=>{e.preventDefault();const t=$("#prayText").value.trim();if(!t)return;S.myPrayers.unshift({text:t,anon:$("#prayAnon").checked,at:today()});save();render();toast("Sent to a leader for review");document.getElementById("prayer").scrollIntoView()};
  $("#storyForm").onsubmit=e=>{e.preventDefault();const t=$("#storyText").value.trim();if(!t)return;S.myStories.push({text:t,at:today()});save();render();toast("Thanks! A leader will review your story")};
  const mem=Object.values(LESSONS).map(l=>l.memory);
  document.querySelectorAll("[data-mem]").forEach(b=>b.onclick=()=>{
    const m=mem[+b.dataset.mem];const box=$("#memPractice");box.hidden=false;
    const words=m[1].split(" ");
    box.innerHTML=`<div class="row" style="justify-content:space-between"><b>${esc(m[0])}</b><button class="btn ghost sm" id="memReveal">Show all</button></div><p class="verse" style="font-size:1.15rem">${words.map((w,i)=>i%3===1||i%4===3?`<span class="memo-word" tabindex="0" role="button" aria-label="Hidden word">${esc(w)}</span>`:esc(w)).join(" ")}</p><div class="row"><button class="btn blue sm" id="memDone">${S.memorized[m[0]]?"Memorised ✓":"I've got it memorised"}</button><button class="btn ghost sm" id="memClose">Close</button></div>`;
    box.querySelectorAll(".memo-word").forEach(w=>{w.onclick=()=>w.classList.add("show");w.onkeydown=e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();w.classList.add("show")}}});
    $("#memReveal").onclick=()=>box.querySelectorAll(".memo-word").forEach(w=>w.classList.add("show"));
    $("#memClose").onclick=()=>box.hidden=true;
    $("#memDone").onclick=()=>{S.memorized[m[0]]=today();save();render();toast(m[0]+" memorised")};
    box.scrollIntoView({behavior:"smooth",block:"nearest"});
  });
},
events(){bindReminders()},
involved(){
  const age=$("#suAge"),pb=$("#parentBox");
  age.onchange=()=>{const minor=age.value&&age.value!=="adult"&&+age.value<18;pb.hidden=!minor;$("#suParent").required=minor;$("#suConsent").required=minor};
  $("#signup").onsubmit=e=>{e.preventDefault();toast("Thanks, "+$("#suName").value+"! (Prototype: nothing was sent)");e.target.reset();pb.hidden=true};
},
program(){}
};
document.addEventListener("click",e=>{const s=e.target.closest("[data-scroll]");if(s){e.preventDefault();const t=document.getElementById(s.dataset.scroll);t&&t.scrollIntoView({behavior:"smooth"})}});
render();
