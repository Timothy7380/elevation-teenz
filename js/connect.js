/* =====================================================================
   Elevation Teenz · Connect
   Mentors (approved counselors) ↔ teens, teen friendships across every
   TEC expression, and moderated expression groups. Backed by Supabase;
   every rule that matters is enforced in supabase/schema.sql (RLS).
   ===================================================================== */
const CFG = window.ET_CONFIG || {};
const SB = (window.supabase && CFG.supabaseUrl && CFG.supabaseAnonKey)
  ? window.supabase.createClient(CFG.supabaseUrl, CFG.supabaseAnonKey, {auth:{persistSession:true, autoRefreshToken:true, detectSessionInUrl:true}})
  : null;
const C = {session:null, me:null, priv:null, ready:!SB, chat:null, poll:null};
const FOCUS = ["Identity","Anxiety & stress","Friendships","Faith questions","Family","School & career","Purpose","Peer pressure","Grief","Leadership"];
const AV_COLS = ["#2F8CFA","#FF7B35","#22C59A","#5B4BFF","#FF4F8B","#E0A100"];
const avatar = (name,size=44)=>{const s=String(name||"?");const h=[...s].reduce((a,c)=>a+c.charCodeAt(0),0)%AV_COLS.length;
  return `<span class="av-i" style="width:${size}px;height:${size}px;font-size:${Math.round(size*.42)}px;background:${AV_COLS[h]}">${esc(s.trim()[0]||"?").toUpperCase()}</span>`};
const exprName = id=>(expressionById(id)||{name:id||"—"}).name;
const exprCountry = id=>(expressionById(id)||{}).country||"";
const hasContact = t=>/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i.test(t)||/[0-9]([ ().-]?[0-9]){6,}/.test(t)||/(https?:\/\/|www\.|wa\.me|t\.me|snapchat|whatsapp|telegram|instagram\.com|tiktok\.com)/i.test(t);
const CONTACT_MSG = "For safety, please keep phone numbers, emails, links and social handles out of messages.";
const timeAgo = iso=>{const s=(Date.now()-new Date(iso))/1000;if(s<60)return "just now";if(s<3600)return Math.floor(s/60)+"m ago";if(s<86400)return Math.floor(s/3600)+"h ago";return new Date(iso).toLocaleDateString("en",{day:"numeric",month:"short"})};
const errText = e=>{const m=(e&&(e.message||e.error_description))||String(e||"Something went wrong");
  if(/row-level security/i.test(m))return "You don't have permission to do that yet.";
  if(/Invalid login/i.test(m))return "That email and password don't match. Check them and try again.";
  if(/Email not confirmed/i.test(m))return "Please confirm your email first. Check your inbox for the link we sent.";
  if(/duplicate key/i.test(m))return "You've already sent that request.";
  return m.replace(/^.*?ERROR:\s*/,"")};
const roleLabel = p=>p.role==="teen"?"Teen":p.role==="admin"?"Leader":"Counselor";
const isTeen = ()=>C.me&&C.me.role==="teen", isCounselor=()=>C.me&&C.me.role==="counselor", isAdmin=()=>C.me&&C.me.role==="admin";

const DIAL=[["+234","🇳🇬"],["+44","🇬🇧"],["+1","🇺🇸/🇨🇦"],["+32","🇧🇪"],["+357","🇨🇾"],["+233","🇬🇭"],["+27","🇿🇦"],["+254","🇰🇪"],["+353","🇮🇪"],["+49","🇩🇪"],["+971","🇦🇪"]];
function normPhone(code,num){let d=String(num||"").replace(/[^0-9+]/g,"");if(!d)return "";if(d.startsWith("+"))d=d.slice(1);else{d=d.replace(/^0+/,"");d=code.replace("+","")+d}return /^[0-9]{8,15}$/.test(d)?"+"+d:""}
const WA_ICON='<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 00-8.6 15.1L2 22l5-1.3A10 10 0 1012 2zm0 18.2a8.2 8.2 0 01-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1112 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 01-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 00-.7.3 3 3 0 00-.9 2.2 5.2 5.2 0 001.1 2.8 11.9 11.9 0 004.6 4c1.7.7 2.4.8 3.2.7a2.8 2.8 0 001.8-1.3 2.3 2.3 0 00.2-1.3c-.1-.1-.2-.2-.4-.3z"/></svg>';
function consentMsg(parent,t){const first=String(t.display_name||"").split(" ")[0];return `Hello ${parent||""}, this is ${C.me?C.me.display_name:"a leader"} from Elevation Teenz (Teenz Nation), the teens ministry of The Elevation Church. ${first} has signed up for Elevation Teenz Connect at ${exprName(t.expression)}. Connect lets teens study the Bible, join moderated groups and be mentored by church-approved counselors. Leaders can see all chats, and phone numbers and links are blocked. Are you happy for ${first} to take part? Thank you!`}

/* ---------- session ---------- */
async function loadMe(){
  if(!SB||!C.session){C.me=null;C.priv=null;return}
  const uid=C.session.user.id;
  const [{data:p},{data:q}]=await Promise.all([SB.from("profiles").select("*").eq("id",uid).maybeSingle(),SB.from("profile_private").select("*").eq("id",uid).maybeSingle()]);
  C.me=p||null;C.priv=q||null;
}
function navCta(){
  const b=document.querySelector(".nav-cta");if(!b)return;
  if(C.session&&C.me){b.textContent="My space";b.dataset.go="me"}else{b.textContent="Log in";b.dataset.go="auth-login"}
}
const CONNECT_ROUTES=["connect","auth","me","mentors","teens","chat","groups","group","admin","account"];
const onConnectRoute=()=>CONNECT_ROUTES.includes(route().split("-")[0]);
if(SB){
  const fromEmail=/access_token=|error_description=|type=recovery/.test(location.hash);
  SB.auth.onAuthStateChange(async(ev,session)=>{
    C.session=session;await loadMe();C.ready=true;navCta();
    if(ev==="PASSWORD_RECOVERY"){go("auth-reset");return}
    if(fromEmail&&ev==="SIGNED_IN"&&/access_token=/.test(location.hash)){history.replaceState(null,"",location.pathname+"#me");render();return}
    if(onConnectRoute())render();
  });
}
setTimeout(navCta,0);

/* ---------- shared UI ---------- */
const setupNotice=()=>`<section class="sheet stack" style="max-width:720px;margin:0 auto"><span class="eyebrow">Connect</span><h2>Almost ready</h2><p class="muted">Connect needs its secure database before people can sign up. Add the Supabase URL and anon key to <code>js/config.js</code> and run <code>supabase/schema.sql</code> once. The README explains each step.</p></section>`;
const loadingCard=(t="Loading…")=>`<section class="sheet"><p class="muted">${t}</p></section>`;
function needAuth(){
  if(!SB)return setupNotice();
  if(!C.ready)return loadingCard();
  if(!C.session)return `<section class="sheet stack center" style="max-width:560px;margin:0 auto;align-items:center"><h2>Log in to continue</h2><p class="muted">You need an Elevation Teenz account for this page.</p><div class="row" style="justify-content:center"><button class="btn blue" data-go="auth-login">Log in</button><button class="btn ghost" data-go="auth-signup">Create an account</button></div></section>`;
  if(!C.me)return `<section class="sheet stack" style="max-width:640px;margin:0 auto"><h2>We couldn't load your profile</h2><p class="muted">Try signing out and back in. If it keeps happening, contact a leader.</p><button class="btn ghost" id="soBtn" style="align-self:flex-start">Sign out</button></section>`;
  if(C.me.suspended)return `<section class="sheet stack" style="max-width:640px;margin:0 auto"><h2>Your account is paused</h2><p class="muted">A leader has paused this account. Please speak to your expression's teens leader.</p><button class="btn ghost" id="soBtn" style="align-self:flex-start">Sign out</button></section>`;
  return null;
}
function bindSignOut(){const b=$("#soBtn");if(b)b.onclick=async()=>{await SB.auth.signOut();toast("Signed out");go("connect")}}
const subnav=(on)=>`<div class="scroller" style="margin-bottom:14px">${[["me","My space"],["mentors","Mentors"],...(isTeen()||isAdmin()?[["teens","Teens worldwide"]]:[]),["groups","Groups"],...(isAdmin()?[["admin","Leader tools"]]:[]),["account","Account"]].map(([k,l])=>`<button class="chip ${k===on?"on":""}" data-go="${k}">${l}</button>`).join("")}</div>`;
const statusPill=s=>({requested:'<span class="pill warn">Requested</span>',active:'<span class="pill done">Active</span>',declined:'<span class="pill">Declined</span>',ended:'<span class="pill">Ended</span>',pending:'<span class="pill warn">Pending</span>',accepted:'<span class="pill done">Friends</span>',approved:'<span class="pill done">Approved</span>',rejected:'<span class="pill">Not approved</span>',suspended:'<span class="pill warn">Suspended</span>'}[s]||`<span class="pill">${esc(s)}</span>`);
const personRow=(p,right="",sub="")=>`<div class="lrow" style="cursor:default">${avatar(p.display_name)}<span class="tx"><b>${esc(p.display_name)}</b><small>${roleLabel(p)} · ${esc(exprName(p.expression))}${sub?` · ${sub}`:""}</small></span>${right}</div>`;

/* =====================================================================
   VIEWS
   ===================================================================== */
const CONNECT_VIEWS = {
connect(){
  const byCountry=EXPRESSION_COUNTRIES.map(c=>[c,EXPRESSIONS.filter(e=>e.country===c)]);
  const cta=C.session&&C.me?`<button class="btn blue" data-go="me">Go to my space</button>`:`<button class="btn blue" data-go="auth-signup">Create an account</button><button class="btn ink" data-go="auth-login">Log in</button>`;
  return `
  <section class="sheet hero stack" style="gap:18px">
    <span class="eyebrow">Connect · ${EXPRESSIONS.filter(e=>e.country!=="Online").length} expressions in ${EXPRESSION_COUNTRIES.length-1} countries + online</span>
    <h1>One Teenz Nation, <span class="mark">every</span> expression.</h1>
    <p class="lede">Find a trusted counselor to mentor you, make friends with teens from Lagos to London to Toronto, and join your expression's group. Every counselor is approved by church leaders first.</p>
    <div class="row" style="gap:12px">${cta}</div>
  </section>
  <section class="grid3">
    <div class="sheet stack"><span class="eyebrow">For teens</span><h3>Get a mentor</h3><p class="muted">Browse approved counselors from any expression, see what they help with, and send a mentorship request.</p></div>
    <div class="sheet stack"><span class="eyebrow">Across the globe</span><h3>Make friends</h3><p class="muted">Find teens in other expressions, send a friend request, and chat once they accept.</p></div>
    <div class="sheet stack"><span class="eyebrow">Together</span><h3>Join groups</h3><p class="muted">Every expression has a group, plus a global one for all of Teenz Nation. Posts are checked by a leader.</p></div>
  </section>
  <section class="sheet stack">
    <span class="eyebrow">How we keep you safe</span>
    <div class="grid2">
      ${[["Counselors are vetted","Counselors can't see or contact teens until a church leader approves them."],["Chats stay in the app","Messages can't include phone numbers, emails, links or social handles."],["Leaders can see chats","Church leaders can read mentoring and friend chats to keep everyone safe."],["Parents are involved","Teens under 18 can message only after a leader confirms a parent or guardian's OK."],["Report and block","Report any message or post, and block anyone, in one tap."],["Your details stay private","Birth year and parent details are visible only to you and church leaders."]]
      .map(([h,p])=>`<div class="tile"><h4>${h}</h4><p class="muted" style="font-size:.92rem;margin-top:4px">${p}</p></div>`).join("")}
    </div>
  </section>
  <section class="sheet stack" id="exprDir">
    <div class="row" style="justify-content:space-between"><span class="eyebrow">The Elevation Church expressions</span><span class="muted" style="font-size:.86rem">Global Lead Pastor: Godman Akinlabi</span></div>
    <div class="search" style="max-width:520px">${I.search}<input type="text" id="exQ" placeholder="Search a city or expression" aria-label="Search expressions"></div>
    <div id="exList" class="stack" style="gap:18px">${byCountry.map(([c,list])=>`<div class="stack ex-group" style="gap:8px"><b>${c} <span class="muted" style="font-weight:400">· ${list.length}</span></b><div class="grid3">${list.map(e=>`<div class="tile ex-item" data-s="${esc((e.name+" "+e.city+" "+e.country).toLowerCase())}"><b style="display:block">${esc(e.name)}</b><small class="muted">${esc(e.city)}</small><small class="muted" style="display:block;margin-top:6px">${esc(e.times)}</small></div>`).join("")}</div></div>`).join("")}</div>
    <p class="note">${I.info}<span>From elevationng.org/locations. Tell us if an expression's details change.</span></p>
  </section>`;
},

auth(sub){
  if(!SB)return setupNotice();
  if(sub==="reset")return `<section class="sheet stack auth-card"><h2>Set a new password</h2><form id="resetForm" class="stack" style="gap:12px"><label class="f" for="npw">New password<input type="password" id="npw" minlength="8" required autocomplete="new-password"></label><button class="btn blue" type="submit" style="align-self:flex-start">Save password</button><p class="callout" id="authMsg" hidden></p></form></section>`;
  if(sub==="forgot")return `<section class="sheet stack auth-card"><h2>Reset your password</h2><p class="muted">We'll email you a link to set a new one.</p><form id="forgotForm" class="stack" style="gap:12px"><label class="f" for="fEmail">Email<input type="email" id="fEmail" required autocomplete="email"></label><button class="btn blue" type="submit" style="align-self:flex-start">Send reset link</button><p class="callout" id="authMsg" hidden></p></form><button class="btn ghost sm" data-go="auth-login" style="align-self:flex-start">Back to log in</button></section>`;
  if(sub==="signup"){
    const yNow=new Date().getFullYear();
    const teenYears=Array.from({length:8},(_,i)=>yNow-12-i), adultYears=Array.from({length:70},(_,i)=>yNow-18-i);
    return `<section class="sheet stack auth-card" style="gap:18px">
    <div class="stack" style="gap:6px"><span class="eyebrow">Join Connect</span><h2>Create your account</h2></div>
    <div class="seg" role="tablist" aria-label="I am a"><button type="button" class="on" data-role="teen" role="tab" aria-selected="true">I'm a teen</button><button type="button" data-role="counselor" role="tab" aria-selected="false">I'm a counselor</button></div>
    <form id="signupForm" class="stack" style="gap:12px" novalidate>
      <label class="f" for="suName"><span id="nameLbl">First name and last initial</span><input type="text" id="suName" required maxlength="40" placeholder="e.g. Tola A." autocomplete="nickname"></label>
      <label class="f" for="suEmail">Email<input type="email" id="suEmail" required autocomplete="email"></label>
      <label class="f" for="suPw">Password<input type="password" id="suPw" required minlength="8" autocomplete="new-password" placeholder="At least 8 characters"></label>
      <label class="f" for="suExpr">Your expression<select id="suExpr" required>${expressionOptions("")}</select></label>
      <label class="f" for="suYear">Year you were born<select id="suYear" required><option value="">Choose</option>${teenYears.map(y=>`<option>${y}</option>`).join("")}</select></label>
      <div id="teenBox" class="stack" style="gap:12px">
        <div id="parentBox" class="stack" style="gap:12px" hidden>
          <div class="callout">You're under 18, so a parent or guardian needs to know. A leader will confirm with them before you can send messages.</div>
          <label class="f" for="suPName">Parent or guardian's name<input type="text" id="suPName" maxlength="60"></label>
          <label class="f" for="suPEmail">Parent or guardian's email<input type="email" id="suPEmail" autocomplete="off"></label>
          <div class="stack" style="gap:6px"><label for="suPPhone" style="font-weight:500;font-size:.92rem">Parent or guardian's phone (for a call or WhatsApp)</label>
            <div class="row" style="gap:8px;flex-wrap:nowrap"><select id="suPCode" aria-label="Country code" style="width:auto;flex:none">${DIAL.map(([c,n])=>`<option value="${c}">${n} ${c}</option>`).join("")}</select><input type="tel" id="suPPhone" inputmode="tel" placeholder="803 123 4567" autocomplete="off" style="flex:1;min-width:0"></div>
            <label class="check" style="font-size:.88rem"><input type="checkbox" id="suPWa" checked> This number is on WhatsApp</label></div>
          <label class="check"><input type="checkbox" id="suConsent"> My parent or guardian knows I'm joining Elevation Teenz Connect.</label>
        </div>
      </div>
      <div id="counselorBox" class="stack" style="gap:12px" hidden>
        <label class="f" for="suBio">About you (what you'd love to help teens with)<textarea id="suBio" maxlength="400" style="min-height:90px"></textarea></label>
        <div class="stack" style="gap:6px"><span style="font-weight:500;font-size:.92rem">Areas you can mentor in</span><div class="row" id="focusChips">${FOCUS.map(f=>`<button type="button" class="chip" data-focus="${esc(f)}">${esc(f)}</button>`).join("")}</div></div>
        <label class="f" for="suPhone">Phone number (only leaders see this, for vetting)<input type="tel" id="suPhone" maxlength="25"></label>
        <label class="check"><input type="checkbox" id="suSafe"> I agree to the church's safeguarding policy and to a background check before I'm approved.</label>
      </div>
      <label class="check"><input type="checkbox" id="suRules"> I'll be kind, keep chats in the app and report anything that feels wrong.</label>
      <button class="btn blue" type="submit" style="align-self:flex-start" id="suBtn">Create account</button>
      <p class="callout" id="authMsg" hidden></p>
    </form>
    <p class="muted" style="font-size:.92rem">Already have an account? <a href="javascript:void 0" data-go="auth-login">Log in</a></p>
    <template id="yrsTeen">${teenYears.map(y=>`<option>${y}</option>`).join("")}</template><template id="yrsAdult">${adultYears.map(y=>`<option>${y}</option>`).join("")}</template>
  </section>`;
  }
  return `<section class="sheet stack auth-card" style="gap:18px">
    <div class="stack" style="gap:6px"><span class="eyebrow">Welcome back</span><h2>Log in</h2></div>
    <form id="loginForm" class="stack" style="gap:12px">
      <label class="f" for="liEmail">Email<input type="email" id="liEmail" required autocomplete="email"></label>
      <label class="f" for="liPw">Password<input type="password" id="liPw" required autocomplete="current-password"></label>
      <button class="btn blue" type="submit" style="align-self:flex-start" id="liBtn">Log in</button>
      <p class="callout" id="authMsg" hidden></p>
    </form>
    <div class="row" style="justify-content:space-between;font-size:.92rem"><a href="javascript:void 0" data-go="auth-forgot">Forgot password?</a><span class="muted">New here? <a href="javascript:void 0" data-go="auth-signup">Create an account</a></span></div>
  </section>`;
},

me(){
  const g=needAuth();if(g)return g;const m=C.me,p=C.priv||{};
  let banner="";
  if(isCounselor()&&m.counselor_status==="pending")banner=`<div class="callout">Thanks for offering to mentor! A church leader will review your details and run a safeguarding check. You'll appear to teens once you're approved.</div>`;
  if(isCounselor()&&m.counselor_status==="rejected")banner=`<div class="callout">Your counselor application wasn't approved. Speak to your expression's teens leader if you have questions.</div>`;
  if(isTeen()&&!m.can_message)banner=`<div class="callout">Welcome! A leader will confirm with ${esc(p.parent_name||"your parent or guardian")} soon. Until then you can browse, send requests and read groups, but not send messages.</div>`;
  return `${subnav("me")}
  <section class="sheet stack">
    <div class="row" style="gap:16px">${avatar(m.display_name,64)}<div class="stack" style="gap:4px"><h2 style="font-size:2rem">Hi, ${esc(m.display_name.split(" ")[0])}</h2><span class="muted">${roleLabel(m)} · ${esc(exprName(m.expression))}${m.role==="counselor"?" · "+statusPill(m.counselor_status):""}</span></div></div>
    ${banner}
  </section>
  <div class="grid2" id="meGrid" style="margin-top:16px">${loadingCard()}</div>`;
},

mentors(){
  const g=needAuth();if(g)return g;
  return `${subnav("mentors")}
  <section class="sheet stack">
    <h2>Find a mentor</h2>
    <p class="muted">Every counselor here has been approved by church leaders. Choose someone from your expression or anywhere in the world.</p>
    <div class="row" style="gap:10px"><select id="mExpr" style="max-width:360px">${expressionOptions("",{withAll:true})}</select><select id="mFocus" style="max-width:240px"><option value="">Any topic</option>${FOCUS.map(f=>`<option>${esc(f)}</option>`).join("")}</select></div>
    <div id="mList" class="grid2">${loadingCard()}</div>
  </section>`;
},

teens(){
  const g=needAuth();if(g)return g;
  if(!(isTeen()||isAdmin()))return `${subnav("teens")}<section class="sheet"><p class="muted">The teen directory is only for teens.</p></section>`;
  return `${subnav("teens")}
  <section class="sheet stack">
    <h2>Teens worldwide</h2>
    <p class="muted">Find teens in your expression or across the globe. They'll need to accept your request before you can chat.</p>
    <div class="row" style="gap:10px"><select id="tExpr" style="max-width:360px">${expressionOptions("",{withAll:true})}</select><div class="search" style="flex:1;min-width:200px;max-width:340px">${I.search}<input type="text" id="tQ" placeholder="Search by name" aria-label="Search teens"></div></div>
    <div id="tList" class="grid2">${loadingCard()}</div>
  </section>`;
},

chat(id){
  const g=needAuth();if(g)return g;
  return `${subnav("me")}
  <section class="sheet stack chat-wrap">
    <div class="row" id="chatHead" style="justify-content:space-between">${loadingCard("Opening chat…")}</div>
    <p class="note">${I.lock}<span>Church leaders can read this chat to keep everyone safe. Don't share phone numbers, emails, links or social handles.</span></p>
    <div class="chat" id="chatList" aria-live="polite"></div>
    <form id="chatForm" class="chat-form"><textarea id="chatIn" maxlength="1000" placeholder="Write a message…" aria-label="Message" required></textarea><button class="btn blue" type="submit">Send</button></form>
    <p class="callout" id="chatMsg" hidden></p>
  </section>`;
},

groups(){
  const g=needAuth();if(g)return g;const mine=C.me.expression;
  return `${subnav("groups")}
  <section class="sheet stack">
    <h2>Groups</h2>
    <p class="muted">Share encouragement, prayer points and wins. A leader checks every post before it appears.</p>
    <div class="grid2">
      <button class="tile group-card" data-go="group-global"><span class="eyebrow">Everyone</span><b>Teenz Nation Global</b><small class="muted">Teens and counselors from every expression</small></button>
      <button class="tile group-card" data-go="group-${esc(mine)}"><span class="eyebrow">Your expression</span><b>${esc(exprName(mine))}</b><small class="muted">${esc((expressionById(mine)||{}).city||"")}</small></button>
    </div>
    <span class="eyebrow" style="margin-top:8px">All expression groups</span>
    <div class="grid3">${EXPRESSIONS.map(e=>`<button class="tile group-card" data-go="group-${e.id}"><b>${esc(e.name)}</b><small class="muted">${esc(e.city)} · ${esc(e.country)}</small></button>`).join("")}</div>
  </section>`;
},

group(key){
  const g=needAuth();if(g)return g;
  const name=key==="global"?"Teenz Nation Global":exprName(key);
  return `${subnav("groups")}
  <section class="sheet stack">
    <button class="btn ghost sm" data-go="groups" style="align-self:flex-start">${I.back} All groups</button>
    <h2>${esc(name)}</h2>
    ${C.me.can_message?`<form id="postForm" class="stack" style="gap:10px"><textarea id="postIn" maxlength="600" placeholder="Share an encouragement, a prayer point or a win…" style="min-height:90px" required></textarea><div class="row" style="justify-content:space-between"><span class="muted" style="font-size:.86rem">A leader reviews posts before they appear.</span><button class="btn blue sm" type="submit">Post</button></div></form>`:`<div class="callout">You can post once a leader has confirmed your parent or guardian's OK.</div>`}
    <div id="postList" class="stack" style="gap:10px">${loadingCard()}</div>
  </section>`;
},

account(){
  const g=needAuth();if(g)return g;const m=C.me;
  return `${subnav("account")}
  <section class="sheet stack" style="max-width:720px">
    <h2>Your account</h2>
    <form id="accForm" class="stack" style="gap:12px">
      <label class="f" for="acName">Display name<input type="text" id="acName" maxlength="40" value="${esc(m.display_name)}" required></label>
      <label class="f" for="acExpr">Expression<select id="acExpr" required>${expressionOptions(m.expression)}</select></label>
      <label class="f" for="acBio">About you<textarea id="acBio" maxlength="400" style="min-height:90px">${esc(m.bio||"")}</textarea></label>
      ${isCounselor()?`<div class="stack" style="gap:6px"><span style="font-weight:500;font-size:.92rem">Areas you mentor in</span><div class="row" id="focusChips">${FOCUS.map(f=>`<button type="button" class="chip ${(m.focus_areas||[]).includes(f)?"on":""}" data-focus="${esc(f)}">${esc(f)}</button>`).join("")}</div></div>`:""}
      <button class="btn blue" type="submit" style="align-self:flex-start">Save changes</button>
    </form>
    <p class="muted" style="font-size:.9rem">Signed in as ${esc(C.session.user.email)}</p>
    <div class="row"><button class="btn ghost" id="soBtn">Sign out</button></div>
    <p class="note">${I.info}<span>To delete your account, ask a leader at your expression. They'll remove your profile and messages.</span></p>
  </section>`;
},

admin(){
  const g=needAuth();if(g)return g;
  if(!isAdmin())return `${subnav("admin")}<section class="sheet"><p class="muted">Leader tools are only for church leaders.</p></section>`;
  return `${subnav("admin")}
  <section class="sheet stack">
    <h2>Leader tools</h2>
    <div class="scroller" id="admTabs">${[["counselors","Counselors to review"],["consent","Parent consent"],["posts","Posts to review"],["reports","Reports"],["chats","Mentoring chats"],["people","People"]].map(([k,l],i)=>`<button class="chip ${i?"":"on"}" data-adm="${k}">${l}</button>`).join("")}</div>
    <div id="admBody" class="stack" style="gap:10px">${loadingCard()}</div>
  </section>`;
}
};

/* =====================================================================
   BEHAVIOUR
   ===================================================================== */
function showMsg(id,txt,ok){const el=$("#"+id);if(!el)return;el.hidden=false;el.textContent=txt;el.style.background=ok?"var(--green-soft)":"#FFF0E6"}

const CONNECT_AFTER = {
connect(){
  const q=$("#exQ");if(!q)return;
  q.oninput=()=>{const v=q.value.trim().toLowerCase();document.querySelectorAll(".ex-item").forEach(i=>i.hidden=v&&!i.dataset.s.includes(v));document.querySelectorAll(".ex-group").forEach(gp=>gp.hidden=![...gp.querySelectorAll(".ex-item")].some(i=>!i.hidden))};
},

auth(r){
  if(!SB)return;const sub=r.split("-")[1]||"login";
  if(sub==="login"){
    $("#loginForm").onsubmit=async e=>{e.preventDefault();const b=$("#liBtn");b.disabled=true;
      const {error}=await SB.auth.signInWithPassword({email:$("#liEmail").value.trim(),password:$("#liPw").value});
      b.disabled=false;if(error)return showMsg("authMsg",errText(error));toast("Welcome back!");go("me")};
  }
  if(sub==="forgot"){
    $("#forgotForm").onsubmit=async e=>{e.preventDefault();
      const {error}=await SB.auth.resetPasswordForEmail($("#fEmail").value.trim(),{redirectTo:location.origin+location.pathname});
      showMsg("authMsg",error?errText(error):"If that email has an account, a reset link is on its way.",!error)};
  }
  if(sub==="reset"){
    $("#resetForm").onsubmit=async e=>{e.preventDefault();const {error}=await SB.auth.updateUser({password:$("#npw").value});
      if(error)return showMsg("authMsg",errText(error));toast("Password updated");go("me")};
  }
  if(sub==="signup"){
    let role="teen";const focus=new Set();const yNow=new Date().getFullYear();
    const sync=()=>{
      $("#teenBox").hidden=role!=="teen";$("#counselorBox").hidden=role!=="counselor";
      $("#nameLbl").textContent=role==="teen"?"First name and last initial":"Full name";
      $("#suName").placeholder=role==="teen"?"e.g. Tola A.":"e.g. Funmi Adeyemi";
      const y=$("#suYear"),keep=y.value;y.innerHTML=`<option value="">Choose</option>`+$(role==="teen"?"#yrsTeen":"#yrsAdult").innerHTML;if([...y.options].some(o=>o.value===keep))y.value=keep;
      const age=y.value?yNow-+y.value:null;$("#parentBox").hidden=!(role==="teen"&&age!==null&&age<18);
    };
    document.querySelectorAll("[data-role]").forEach(b=>b.onclick=()=>{role=b.dataset.role;document.querySelectorAll("[data-role]").forEach(x=>{x.classList.toggle("on",x===b);x.setAttribute("aria-selected",x===b)});sync()});
    $("#suYear").onchange=sync;
    $("#suExpr").addEventListener("change",()=>{const c=exprCountry($("#suExpr").value);const code={"Nigeria":"+234","United Kingdom":"+44","United States":"+1","Canada":"+1","Belgium":"+32"}[c];if(code)$("#suPCode").value=code});
    document.querySelectorAll("[data-focus]").forEach(c=>c.onclick=()=>{const f=c.dataset.focus;focus.has(f)?focus.delete(f):focus.add(f);c.classList.toggle("on",focus.has(f))});
    sync();
    $("#signupForm").onsubmit=async e=>{e.preventDefault();
      const name=$("#suName").value.trim(),email=$("#suEmail").value.trim(),pw=$("#suPw").value,expr=$("#suExpr").value,year=$("#suYear").value;
      const age=year?yNow-+year:null;
      if(name.length<2)return showMsg("authMsg","Add your name.");
      if(!/^\S+@\S+\.\S+$/.test(email))return showMsg("authMsg","Enter a valid email address.");
      if(pw.length<8)return showMsg("authMsg","Use a password of at least 8 characters.");
      if(!expr)return showMsg("authMsg","Choose your expression.");
      if(!year)return showMsg("authMsg","Choose the year you were born.");
      const meta={role,display_name:name,expression:expr,birth_year:String(year)};
      if(role==="teen"&&age<18){
        const pe=$("#suPEmail").value.trim();const pp=normPhone($("#suPCode").value,$("#suPPhone").value);
        if(!$("#suPName").value.trim()||!/^\S+@\S+\.\S+$/.test(pe))return showMsg("authMsg","Add your parent or guardian's name and email.");
        if(pe.toLowerCase()===email.toLowerCase())return showMsg("authMsg","Your parent or guardian's email needs to be different from yours.");
        if(!pp)return showMsg("authMsg","Add your parent or guardian's phone number so a leader can call or WhatsApp them.");
        if(!$("#suConsent").checked)return showMsg("authMsg","Tick the box to confirm your parent or guardian knows.");
        meta.parent_name=$("#suPName").value.trim();meta.parent_email=pe;meta.parent_phone=pp;meta.parent_whatsapp=$("#suPWa").checked?"yes":"no";
      }
      if(role==="counselor"){
        if(!$("#suSafe").checked)return showMsg("authMsg","Please agree to the safeguarding policy and background check.");
        meta.bio=$("#suBio").value.trim();meta.focus_areas=[...focus];meta.phone=$("#suPhone").value.trim();
      }
      if(!$("#suRules").checked)return showMsg("authMsg","Tick the box to agree to keep Connect kind and safe.");
      const b=$("#suBtn");b.disabled=true;
      const {data,error}=await SB.auth.signUp({email,password:pw,options:{data:meta,emailRedirectTo:location.origin+location.pathname}});
      b.disabled=false;
      if(error)return showMsg("authMsg",errText(error));
      if(data.session){toast("Account created");go("me")}
      else showMsg("authMsg","Almost done! We've sent a confirmation link to "+email+". Open it to finish signing up.",true);
    };
  }
},

async me(){
  bindSignOut();if(!C.me||!$("#meGrid"))return;const uid=C.me.id;
  const [{data:ms},{data:fs}]=await Promise.all([
    SB.from("mentorships").select("*").or(`teen_id.eq.${uid},counselor_id.eq.${uid}`).order("updated_at",{ascending:false}),
    isTeen()?SB.from("friendships").select("*").or(`requester.eq.${uid},addressee.eq.${uid}`).order("created_at",{ascending:false}):Promise.resolve({data:[]})
  ]);
  const ids=new Set();(ms||[]).forEach(m=>{ids.add(m.teen_id);ids.add(m.counselor_id)});(fs||[]).forEach(f=>{ids.add(f.requester);ids.add(f.addressee)});ids.delete(uid);
  const {data:people}=ids.size?await SB.from("profiles").select("id,display_name,role,expression,counselor_status").in("id",[...ids]):{data:[]};
  const P=Object.fromEntries((people||[]).map(p=>[p.id,p]));const other=(a,b)=>P[a===uid?b:a];
  const M=ms||[],F=fs||[];
  let html="";
  if(isTeen()){
    const act=M.filter(m=>m.status==="active"),req=M.filter(m=>m.status==="requested");
    html+=`<section class="sheet stack"><div class="row" style="justify-content:space-between"><h3>My mentors</h3><button class="btn ghost sm" data-go="mentors">Find a mentor</button></div>
      ${act.length?act.map(m=>{const o=P[m.counselor_id];return o?personRow(o,`<button class="btn blue sm" data-go="chat-m-${m.id}">Chat</button>`):""}).join(""):`<p class="muted">No mentor yet. Browse counselors and send a request.</p>`}
      ${req.length?`<span class="eyebrow" style="margin-top:8px">Waiting for reply</span>`+req.map(m=>{const o=P[m.counselor_id];return o?personRow(o,statusPill("requested")):""}).join(""):""}</section>`;
    const fr=F.filter(f=>f.status==="accepted"),inc=F.filter(f=>f.status==="pending"&&f.addressee===uid),out=F.filter(f=>f.status==="pending"&&f.requester===uid);
    html+=`<section class="sheet stack"><div class="row" style="justify-content:space-between"><h3>Friends</h3><button class="btn ghost sm" data-go="teens">Find teens</button></div>
      ${inc.length?`<span class="eyebrow">Friend requests</span>`+inc.map(f=>{const o=P[f.requester];return o?personRow(o,`<span class="row" style="gap:6px"><button class="btn blue sm" data-fr-acc="${f.id}">Accept</button><button class="btn ghost sm" data-fr-dec="${f.id}">Decline</button></span>`):""}).join(""):""}
      ${fr.length?fr.map(f=>{const o=other(f.requester,f.addressee);return o?personRow(o,`<button class="btn blue sm" data-go="chat-f-${f.id}">Chat</button>`):""}).join(""):(!inc.length?`<p class="muted">No friends yet. Find teens from any expression.</p>`:"")}
      ${out.length?`<span class="eyebrow" style="margin-top:8px">Sent</span>`+out.map(f=>{const o=P[f.addressee];return o?personRow(o,statusPill("pending")):""}).join(""):""}</section>`;
  } else if(isCounselor()){
    const req=M.filter(m=>m.status==="requested"),act=M.filter(m=>m.status==="active");
    html+=`<section class="sheet stack"><h3>Mentorship requests</h3>${req.length?req.map(m=>{const o=P[m.teen_id];return o?`<div class="stack" style="gap:6px;border-top:1px solid var(--line);padding-top:10px">${personRow(o,"",esc(o.age_group||""))}${m.note?`<p class="muted" style="font-size:.92rem">“${esc(m.note)}”</p>`:""}<div class="row" style="gap:6px"><button class="btn blue sm" data-m-acc="${m.id}">Accept</button><button class="btn ghost sm" data-m-dec="${m.id}">Decline</button></div></div>`:""}).join(""):`<p class="muted">${C.me.counselor_status==="approved"?"No new requests.":"Requests will appear here once you're approved."}</p>`}</section>
      <section class="sheet stack"><h3>My mentees</h3>${act.length?act.map(m=>{const o=P[m.teen_id];return o?personRow(o,`<button class="btn blue sm" data-go="chat-m-${m.id}">Chat</button>`):""}).join(""):`<p class="muted">No mentees yet.</p>`}</section>`;
  } else if(isAdmin()){
    html+=`<section class="sheet stack"><h3>You're a leader</h3><p class="muted">Review counselors, confirm parent consent, moderate posts and handle reports.</p><button class="btn blue" data-go="admin" style="align-self:flex-start">Open leader tools</button></section>`;
  }
  html+=`<section class="sheet stack"><h3>Groups</h3><button class="lrow" data-go="group-global"><span class="ic" style="background:var(--blue-soft);color:var(--blue)">${I.book}</span><span class="tx"><b>Teenz Nation Global</b><small>Every expression</small></span>${I.arrow}</button><button class="lrow" data-go="group-${esc(C.me.expression)}"><span class="ic" style="background:#FFF0E6;color:var(--orange)">${I.home}</span><span class="tx"><b>${esc(exprName(C.me.expression))}</b><small>Your expression</small></span>${I.arrow}</button></section>`;
  $("#meGrid").innerHTML=html;
  const upd=async(t,id,st,msg)=>{const {error}=await SB.from(t).update({status:st}).eq("id",id);if(error)return toast(errText(error));toast(msg);render()};
  document.querySelectorAll("[data-fr-acc]").forEach(b=>b.onclick=()=>upd("friendships",b.dataset.frAcc,"accepted","You're now friends"));
  document.querySelectorAll("[data-fr-dec]").forEach(b=>b.onclick=()=>upd("friendships",b.dataset.frDec,"declined","Request declined"));
  document.querySelectorAll("[data-m-acc]").forEach(b=>b.onclick=()=>upd("mentorships",b.dataset.mAcc,"active","You're now mentoring this teen"));
  document.querySelectorAll("[data-m-dec]").forEach(b=>b.onclick=()=>upd("mentorships",b.dataset.mDec,"declined","Request declined"));
},

async mentors(){
  if(!C.me||!$("#mList"))return;const uid=C.me.id;
  const [{data:cs},{data:mine}]=await Promise.all([
    SB.from("profiles").select("id,display_name,role,expression,bio,focus_areas").eq("role","counselor").eq("counselor_status","approved").order("display_name"),
    isTeen()?SB.from("mentorships").select("counselor_id,status").eq("teen_id",uid):Promise.resolve({data:[]})]);
  const st=Object.fromEntries((mine||[]).map(m=>[m.counselor_id,m.status]));
  const draw=()=>{const ex=$("#mExpr").value,fo=$("#mFocus").value;
    const list=(cs||[]).filter(c=>(!ex||c.expression===ex)&&(!fo||(c.focus_areas||[]).includes(fo)));
    $("#mList").innerHTML=list.length?list.map(c=>`<div class="tile stack" style="gap:10px">
      <div class="row" style="gap:12px">${avatar(c.display_name,52)}<div><b style="display:block">${esc(c.display_name)}</b><small class="muted">${esc(exprName(c.expression))} · ${esc(exprCountry(c.expression))}</small></div></div>
      ${c.bio?`<p style="font-size:.94rem">${esc(c.bio)}</p>`:""}
      ${(c.focus_areas||[]).length?`<div class="row" style="gap:6px">${c.focus_areas.map(f=>`<span class="pill blue">${esc(f)}</span>`).join("")}</div>`:""}
      ${isTeen()?(st[c.id]&&st[c.id]!=="declined"&&st[c.id]!=="ended"?statusPill(st[c.id]):`<button class="btn blue sm" data-req="${c.id}" style="align-self:flex-start">Ask to be my mentor</button>`):""}
    </div>`).join(""):`<p class="muted">No approved counselors match yet. Try “All expressions worldwide”.</p>`;
    document.querySelectorAll("[data-req]").forEach(b=>b.onclick=()=>openRequest(b.dataset.req,(cs||[]).find(c=>c.id===b.dataset.req)));
  };
  $("#mExpr").onchange=draw;$("#mFocus").onchange=draw;if(C.me.expression&&(cs||[]).some(c=>c.expression===C.me.expression))$("#mExpr").value=C.me.expression;draw();
  async function openRequest(cid,c){
    const box=document.createElement("div");box.className="modal";box.innerHTML=`<div class="modal-card stack" role="dialog" aria-label="Request a mentor"><h3>Ask ${esc(c.display_name)} to mentor you</h3><p class="muted" style="font-size:.94rem">Say a little about what you'd like help with. Keep contact details out.</p><textarea id="reqNote" maxlength="300" style="min-height:100px" placeholder="e.g. I'd love help with confidence and reading my Bible."></textarea><p class="callout" id="reqMsg" hidden></p><div class="row" style="justify-content:flex-end"><button class="btn ghost" id="reqCancel">Cancel</button><button class="btn blue" id="reqSend">Send request</button></div></div>`;
    document.body.appendChild(box);$("#reqNote").focus();
    $("#reqCancel").onclick=()=>box.remove();box.onclick=e=>{if(e.target===box)box.remove()};
    $("#reqSend").onclick=async()=>{const note=$("#reqNote").value.trim();if(hasContact(note))return showMsg("reqMsg",CONTACT_MSG);
      const prev=(mine||[]).find(m=>m.counselor_id===cid);
      const {error}=prev?await SB.from("mentorships").update({status:"requested",note}).eq("teen_id",uid).eq("counselor_id",cid):await SB.from("mentorships").insert({teen_id:uid,counselor_id:cid,note});
      if(error)return showMsg("reqMsg",errText(error));box.remove();toast("Request sent to "+c.display_name);render()};
  }
},

async teens(){
  if(!C.me||!$("#tList"))return;const uid=C.me.id;
  const [{data:ts},{data:fs}]=await Promise.all([
    SB.from("profiles").select("id,display_name,role,expression,age_group,bio").eq("role","teen").neq("id",uid).order("created_at",{ascending:false}).limit(500),
    SB.from("friendships").select("*").or(`requester.eq.${uid},addressee.eq.${uid}`)]);
  const rel={};(fs||[]).forEach(f=>rel[f.requester===uid?f.addressee:f.requester]=f);
  const draw=()=>{const ex=$("#tExpr").value,q=$("#tQ").value.trim().toLowerCase();
    const list=(ts||[]).filter(t=>(!ex||t.expression===ex)&&(!q||t.display_name.toLowerCase().includes(q)));
    $("#tList").innerHTML=list.length?list.map(t=>{const f=rel[t.id];let right;
      if(!f)right=isTeen()?`<button class="btn blue sm" data-add="${t.id}">Add friend</button>`:"";
      else if(f.status==="accepted")right=`<button class="btn ghost sm" data-go="chat-f-${f.id}">Chat</button>`;
      else if(f.status==="pending")right=f.addressee===uid?`<button class="btn blue sm" data-acc="${f.id}">Accept</button>`:statusPill("pending");
      else right="";
      return `<div class="tile">${personRow(t,right,esc(t.age_group||""))}</div>`}).join(""):`<p class="muted">No teens match that search yet.</p>`;
    document.querySelectorAll("[data-add]").forEach(b=>b.onclick=async()=>{b.disabled=true;const {error}=await SB.from("friendships").insert({requester:uid,addressee:b.dataset.add});if(error){b.disabled=false;return toast(errText(error))}toast("Friend request sent");render()});
    document.querySelectorAll("[data-acc]").forEach(b=>b.onclick=async()=>{const {error}=await SB.from("friendships").update({status:"accepted"}).eq("id",b.dataset.acc);if(error)return toast(errText(error));toast("You're now friends");render()});
  };
  $("#tExpr").onchange=draw;$("#tQ").oninput=draw;draw();
},

async chat(r){
  if(!C.me||!$("#chatList"))return;
  const [,kind,...rest]=r.split("-");const id=rest.join("-");const uid=C.me.id;
  const tbl=kind==="m"?"mentorships":"friendships",col=kind==="m"?"mentorship_id":"friendship_id";
  const {data:th,error}=await SB.from(tbl).select("*").eq("id",id).maybeSingle();
  if(error||!th){$("#chatHead").innerHTML=`<p class="muted">This chat isn't available.</p>`;$("#chatForm").hidden=true;return}
  const otherId=kind==="m"?(th.teen_id===uid?th.counselor_id:th.teen_id):(th.requester===uid?th.addressee:th.requester);
  const {data:o}=await SB.from("profiles").select("id,display_name,role,expression").eq("id",otherId).maybeSingle();
  const open=kind==="m"?th.status==="active":th.status==="accepted";
  const leaderView=isAdmin()&&!(kind==="m"?[th.teen_id,th.counselor_id]:[th.requester,th.addressee]).includes(uid);
  $("#chatHead").innerHTML=`<div class="row" style="gap:12px">${avatar(o?o.display_name:"?",48)}<div><b style="display:block">${esc(o?o.display_name:"Member")}</b><small class="muted">${o?roleLabel(o)+" · "+esc(exprName(o.expression)):""} ${statusPill(th.status)}</small></div></div>
    <div class="row" style="gap:6px">${leaderView?'<span class="pill warn">Leader view (read only)</span>':`<button class="btn ghost sm" id="repUser">Report</button>${kind==="m"?(th.status==="active"?'<button class="btn ghost sm" id="endM">End mentorship</button>':""):(th.status!=="blocked"?'<button class="btn ghost sm" id="blockF">Block</button>':"")}`}</div>`;
  if(!open||leaderView||!C.me.can_message){$("#chatForm").hidden=true;
    if(!leaderView)showMsg("chatMsg",!C.me.can_message?"You'll be able to send messages once a leader confirms your parent or guardian's OK.":"This chat is closed.",false)}
  const names={[uid]:C.me.display_name};if(o)names[o.id]=o.display_name;
  const list=$("#chatList");let last=0;
  const add=msgs=>{msgs.forEach(m=>{if(m.id<=last)return;last=m.id;const mine=m.sender_id===uid;
    list.insertAdjacentHTML("beforeend",`<div class="bubble ${mine?"me":""}" data-mid="${m.id}"><span>${esc(m.body)}</span><small>${mine?"You":esc(names[m.sender_id]||"Member")} · ${timeAgo(m.created_at)}${mine||leaderView?"":` · <button class="linkish" data-rep="${m.id}">Report</button>`}</small></div>`)});
    list.scrollTop=list.scrollHeight;
    list.querySelectorAll("[data-rep]").forEach(b=>b.onclick=()=>report({message_id:+b.dataset.rep,reported_user:otherId}))};
  const load=async()=>{const {data}=await SB.from("messages").select("*").eq(col,id).gt("id",last).order("id").limit(200);if(data&&data.length)add(data);
    if(!list.children.length)list.innerHTML=`<p class="muted chat-empty">${open?"Say hello! Keep it kind and keep contact details out.":"No messages."}</p>`;
    else{const e=list.querySelector(".chat-empty");if(e)e.remove()}};
  await load();
  stopChat();
  C.chat=SB.channel("chat-"+id).on("postgres_changes",{event:"INSERT",schema:"public",table:"messages",filter:`${col}=eq.${id}`},p=>{const e=list.querySelector(".chat-empty");if(e)e.remove();add([p.new])}).subscribe();
  C.poll=setInterval(load,15000);
  $("#chatForm").onsubmit=async e=>{e.preventDefault();const t=$("#chatIn").value.trim();if(!t)return;
    if(hasContact(t))return showMsg("chatMsg",CONTACT_MSG);
    const row={sender_id:uid,body:t};row[col]=id;const {error}=await SB.from("messages").insert(row);
    if(error)return showMsg("chatMsg",errText(error));$("#chatIn").value="";$("#chatMsg").hidden=true;load()};
  $("#chatIn").onkeydown=e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();$("#chatForm").requestSubmit()}};
  const rep=$("#repUser");if(rep)rep.onclick=()=>report({reported_user:otherId});
  const end=$("#endM");if(end)end.onclick=async()=>{if(!await confirmBox("End this mentorship? You can request again later."))return;const {error}=await SB.from("mentorships").update({status:"ended"}).eq("id",id);if(error)return toast(errText(error));toast("Mentorship ended");go("me")};
  const blk=$("#blockF");if(blk)blk.onclick=async()=>{if(!await confirmBox("Block "+(o?o.display_name:"this person")+"? They won't be able to message you."))return;const {error}=await SB.from("friendships").update({status:"blocked"}).eq("id",id);if(error)return toast(errText(error));toast("Blocked");go("me")};
},

async group(r){
  if(!C.me||!$("#postList"))return;const key=r.slice(6);const uid=C.me.id;
  const load=async()=>{
    const {data:posts}=await SB.from("group_posts").select("*").eq("group_key",key).order("created_at",{ascending:false}).limit(100);
    const ids=[...new Set((posts||[]).map(p=>p.author_id))];
    const {data:people}=ids.length?await SB.from("profiles").select("id,display_name,role,expression").in("id",ids):{data:[]};
    const P=Object.fromEntries((people||[]).map(p=>[p.id,p]));
    $("#postList").innerHTML=(posts||[]).length?posts.map(p=>{const a=P[p.author_id]||{display_name:"Member",role:"teen",expression:""};return `<div class="post"><div class="row" style="gap:10px">${avatar(a.display_name,36)}<div style="flex:1;min-width:0"><b>${esc(a.display_name)}</b> <small class="muted">${roleLabel(a)}${a.expression?" · "+esc(exprName(a.expression)):""} · ${timeAgo(p.created_at)}</small></div>${p.status==="pending"?'<span class="pill warn">Waiting for review</span>':""}</div><p style="margin-top:8px;white-space:pre-wrap">${esc(p.body)}</p>${p.author_id!==uid&&!isAdmin()?`<button class="linkish" data-rp="${p.id}" data-ru="${p.author_id}">Report</button>`:""}${p.author_id===uid?`<button class="linkish" data-del="${p.id}">Delete</button>`:""}</div>`}).join(""):`<p class="muted">No posts yet. Be the first to share some encouragement.</p>`;
    document.querySelectorAll("[data-rp]").forEach(b=>b.onclick=()=>report({post_id:+b.dataset.rp,reported_user:b.dataset.ru}));
    document.querySelectorAll("[data-del]").forEach(b=>b.onclick=async()=>{const {error}=await SB.from("group_posts").delete().eq("id",b.dataset.del);if(error)return toast(errText(error));toast("Post deleted");load()});
  };
  await load();
  const f=$("#postForm");if(f)f.onsubmit=async e=>{e.preventDefault();const t=$("#postIn").value.trim();if(!t)return;if(hasContact(t))return toast(CONTACT_MSG);
    const {error}=await SB.from("group_posts").insert({group_key:key,author_id:uid,body:t});if(error)return toast(errText(error));$("#postIn").value="";toast("Posted. A leader will review it shortly.");load()};
},

account(){
  bindSignOut();const f=$("#accForm");if(!f)return;const focus=new Set(C.me.focus_areas||[]);
  document.querySelectorAll("[data-focus]").forEach(c=>c.onclick=()=>{const v=c.dataset.focus;focus.has(v)?focus.delete(v):focus.add(v);c.classList.toggle("on",focus.has(v))});
  f.onsubmit=async e=>{e.preventDefault();const upd={display_name:$("#acName").value.trim(),expression:$("#acExpr").value,bio:$("#acBio").value.trim()};
    if(isCounselor())upd.focus_areas=[...focus];if(hasContact(upd.bio))return toast(CONTACT_MSG);
    const {error}=await SB.from("profiles").update(upd).eq("id",C.me.id);if(error)return toast(errText(error));await loadMe();toast("Saved");render()};
},

async admin(){
  if(!isAdmin()||!$("#admBody"))return;let tab="counselors";
  const body=$("#admBody");
  const tabs=document.querySelectorAll("[data-adm]");tabs.forEach(b=>b.onclick=()=>{tab=b.dataset.adm;tabs.forEach(x=>x.classList.toggle("on",x===b));draw()});
  const act=async(promise,msg)=>{const {error}=await promise;if(error)return toast(errText(error));toast(msg);draw()};
  async function draw(){
    body.innerHTML=loadingCard();
    if(tab==="counselors"){
      const {data:cs}=await SB.from("profiles").select("*").eq("role","counselor").in("counselor_status",["pending","rejected","suspended"]).order("created_at");
      const {data:pv}=(cs||[]).length?await SB.from("profile_private").select("*").in("id",cs.map(c=>c.id)):{data:[]};const PV=Object.fromEntries((pv||[]).map(p=>[p.id,p]));
      body.innerHTML=(cs||[]).length?cs.map(c=>{const p=PV[c.id]||{};return `<div class="tile stack" style="gap:8px">${personRow(c,statusPill(c.counselor_status),"born "+(p.birth_year||"?"))}
        ${c.bio?`<p style="font-size:.94rem">${esc(c.bio)}</p>`:""}<small class="muted">Phone: <span style="user-select:all">${esc(p.phone||"not given")}</span> · Focus: ${esc((c.focus_areas||[]).join(", ")||"—")}</small>
        <label class="f" for="sg-${c.id}">Safeguarding note<input type="text" id="sg-${c.id}" value="${esc(p.safeguarding_note||"")}" placeholder="e.g. Background check done 12 Oct by Pastor…"></label>
        <div class="row" style="gap:6px"><button class="btn blue sm" data-ok="${c.id}">Approve</button><button class="btn ghost sm" data-no="${c.id}">Don't approve</button></div></div>`}).join(""):`<p class="muted">No counselors waiting for review.</p>`;
      body.querySelectorAll("[data-ok]").forEach(b=>b.onclick=async()=>{const id=b.dataset.ok;await SB.from("profile_private").update({safeguarding_note:$("#sg-"+id).value.trim()}).eq("id",id);act(SB.from("profiles").update({counselor_status:"approved",can_message:true}).eq("id",id),"Counselor approved")});
      body.querySelectorAll("[data-no]").forEach(b=>b.onclick=()=>act(SB.from("profiles").update({counselor_status:"rejected"}).eq("id",b.dataset.no),"Marked as not approved"));
    }
    if(tab==="consent"){
      const {data:ts}=await SB.from("profiles").select("*").eq("role","teen").eq("can_message",false).order("created_at");
      const {data:pv}=(ts||[]).length?await SB.from("profile_private").select("*").in("id",ts.map(t=>t.id)):{data:[]};const PV=Object.fromEntries((pv||[]).map(p=>[p.id,p]));
      body.innerHTML=`<p class="muted" style="font-size:.92rem">Call, WhatsApp or email each parent or guardian, then confirm. Confirming lets the teen send messages and posts.</p>`+((ts||[]).length?ts.map(t=>{const p=PV[t.id]||{};const msg=consentMsg(p.parent_name,t);const wa=(p.parent_phone||"").replace(/\D/g,"");
        return `<div class="tile stack" style="gap:8px">${personRow(t,"",esc(t.age_group||"")+" · joined "+timeAgo(t.created_at))}
        <div class="stack" style="gap:2px;font-size:.9rem"><span>Parent/guardian: <b>${esc(p.parent_name||"—")}</b></span><span class="muted">Phone: <span style="user-select:all">${esc(p.parent_phone||"not given")}</span>${p.parent_whatsapp==="yes"?" · on WhatsApp":""}</span><span class="muted">Email: <span style="user-select:all">${esc(p.parent_email||"—")}</span></span></div>
        <div class="row" style="gap:6px">
          ${p.parent_phone?`<a class="btn ghost sm" href="tel:${esc(p.parent_phone)}"><svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path fill="currentColor" d="M6.6 10.8a15.1 15.1 0 006.6 6.6l2.2-2.2a1 1 0 011-.25 11.4 11.4 0 003.6.57 1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1 11.4 11.4 0 00.57 3.6 1 1 0 01-.25 1z"/></svg>Call</a>`:""}
          ${wa?`<a class="btn sm wa-btn" href="https://wa.me/${wa}?text=${encodeURIComponent(msg)}" target="_blank" rel="noopener">${WA_ICON}WhatsApp</a>`:""}
          ${p.parent_email?`<a class="btn ghost sm" href="mailto:${esc(p.parent_email)}?subject=${encodeURIComponent("Elevation Teenz Connect: please confirm "+t.display_name.split(" ")[0]+"'s account")}&body=${encodeURIComponent(msg)}">Email</a>`:""}
          <button class="btn ghost sm" data-copy="${esc(msg)}">Copy message</button>
        </div>
        <div class="row" style="gap:6px;align-items:center"><select id="via-${t.id}" style="width:auto"><option value="call">Confirmed by call</option><option value="whatsapp" ${wa?"selected":""}>Confirmed on WhatsApp</option><option value="email">Confirmed by email</option><option value="in person">Confirmed in person</option></select><button class="btn blue sm" data-cf="${t.id}">Parent confirmed</button></div></div>`}).join(""):`<p class="muted">Nobody is waiting for consent.</p>`);
      body.querySelectorAll("[data-copy]").forEach(b=>b.onclick=async()=>{try{await navigator.clipboard.writeText(b.dataset.copy);toast("Message copied")}catch(e){toast("Couldn't copy. Select the text instead.")}});
      body.querySelectorAll("[data-cf]").forEach(b=>b.onclick=async()=>{const via=$("#via-"+b.dataset.cf).value;await SB.from("profile_private").update({consent_confirmed_at:new Date().toISOString(),consent_method:via,consent_by:C.me.display_name}).eq("id",b.dataset.cf);act(SB.from("profiles").update({can_message:true}).eq("id",b.dataset.cf),"Consent confirmed")});
    }
    if(tab==="posts"){
      const {data:ps}=await SB.from("group_posts").select("*").eq("status","pending").order("created_at");
      const ids=[...new Set((ps||[]).map(p=>p.author_id))];const {data:pp}=ids.length?await SB.from("profiles").select("id,display_name,role,expression").in("id",ids):{data:[]};const P=Object.fromEntries((pp||[]).map(p=>[p.id,p]));
      body.innerHTML=(ps||[]).length?ps.map(p=>`<div class="post"><small class="muted">${esc((P[p.author_id]||{}).display_name||"Member")} in ${esc(p.group_key==="global"?"Global":exprName(p.group_key))} · ${timeAgo(p.created_at)}</small><p style="margin:6px 0 10px;white-space:pre-wrap">${esc(p.body)}</p><div class="row" style="gap:6px"><button class="btn blue sm" data-pa="${p.id}">Approve</button><button class="btn ghost sm" data-ph="${p.id}">Hide</button></div></div>`).join(""):`<p class="muted">No posts waiting.</p>`;
      body.querySelectorAll("[data-pa]").forEach(b=>b.onclick=()=>act(SB.from("group_posts").update({status:"approved"}).eq("id",b.dataset.pa),"Post approved"));
      body.querySelectorAll("[data-ph]").forEach(b=>b.onclick=()=>act(SB.from("group_posts").update({status:"hidden"}).eq("id",b.dataset.ph),"Post hidden"));
    }
    if(tab==="reports"){
      const {data:rs}=await SB.from("reports").select("*").eq("status","open").order("created_at");
      const ids=[...new Set((rs||[]).flatMap(r=>[r.reporter_id,r.reported_user]).filter(Boolean))];const {data:pp}=ids.length?await SB.from("profiles").select("id,display_name,role,expression,suspended").in("id",ids):{data:[]};const P=Object.fromEntries((pp||[]).map(p=>[p.id,p]));
      const mids=(rs||[]).map(r=>r.message_id).filter(Boolean),pids=(rs||[]).map(r=>r.post_id).filter(Boolean);
      const [{data:mm},{data:po}]=await Promise.all([mids.length?SB.from("messages").select("id,body").in("id",mids):{data:[]},pids.length?SB.from("group_posts").select("id,body").in("id",pids):{data:[]}]);
      const MM=Object.fromEntries((mm||[]).map(m=>[m.id,m.body])),PO=Object.fromEntries((po||[]).map(m=>[m.id,m.body]));
      body.innerHTML=(rs||[]).length?rs.map(r=>{const who=P[r.reported_user];return `<div class="tile stack" style="gap:6px"><small class="muted">${esc((P[r.reporter_id]||{}).display_name||"Member")} reported ${esc(who?who.display_name:"a member")} · ${timeAgo(r.created_at)}</small><p><b>Reason:</b> ${esc(r.reason)}</p>${r.message_id&&MM[r.message_id]?`<p class="callout">Message: ${esc(MM[r.message_id])}</p>`:""}${r.post_id&&PO[r.post_id]?`<p class="callout">Post: ${esc(PO[r.post_id])}</p>`:""}<div class="row" style="gap:6px"><button class="btn ghost sm" data-res="${r.id}">Mark resolved</button>${who&&!who.suspended?`<button class="btn ghost sm" data-sus="${who.id}">Pause ${esc(who.display_name)}'s account</button>`:""}</div></div>`}).join(""):`<p class="muted">No open reports.</p>`;
      body.querySelectorAll("[data-res]").forEach(b=>b.onclick=()=>act(SB.from("reports").update({status:"resolved"}).eq("id",b.dataset.res),"Report resolved"));
      body.querySelectorAll("[data-sus]").forEach(b=>b.onclick=async()=>{if(!await confirmBox("Pause this account? They won't be able to use Connect until a leader restores it."))return;act(SB.from("profiles").update({suspended:true}).eq("id",b.dataset.sus),"Account paused")});
    }
    if(tab==="chats"){
      const {data:ms}=await SB.from("mentorships").select("*").order("updated_at",{ascending:false}).limit(200);
      const ids=[...new Set((ms||[]).flatMap(m=>[m.teen_id,m.counselor_id]))];const {data:pp}=ids.length?await SB.from("profiles").select("id,display_name").in("id",ids):{data:[]};const P=Object.fromEntries((pp||[]).map(p=>[p.id,p.display_name]));
      body.innerHTML=(ms||[]).length?ms.map(m=>`<div class="lrow" style="cursor:default"><span class="tx"><b>${esc(P[m.counselor_id]||"Counselor")} → ${esc(P[m.teen_id]||"Teen")}</b><small>${timeAgo(m.updated_at)}</small></span>${statusPill(m.status)}<button class="btn ghost sm" data-go="chat-m-${m.id}">Read</button></div>`).join(""):`<p class="muted">No mentorships yet.</p>`;
    }
    if(tab==="people"){
      const {data:ps}=await SB.from("profiles").select("*").order("created_at",{ascending:false}).limit(300);
      body.innerHTML=`<div class="row" style="gap:10px"><select id="pplExpr" style="max-width:360px">${expressionOptions("",{withAll:true})}</select></div><div id="pplList"></div>`;
      const dr=()=>{const ex=$("#pplExpr").value;$("#pplList").innerHTML=(ps||[]).filter(p=>!ex||p.expression===ex).map(p=>personRow(p,`${p.suspended?`<button class="btn ghost sm" data-un="${p.id}">Restore</button>`:p.id!==C.me.id?`<button class="btn ghost sm" data-sp="${p.id}">Pause</button>`:""}`,(p.role==="counselor"?p.counselor_status:p.age_group||"")+(p.can_message?"":" · can't message yet"))).join("");
        body.querySelectorAll("[data-un]").forEach(b=>b.onclick=()=>act(SB.from("profiles").update({suspended:false}).eq("id",b.dataset.un),"Account restored"));
        body.querySelectorAll("[data-sp]").forEach(b=>b.onclick=async()=>{if(!await confirmBox("Pause this account?"))return;act(SB.from("profiles").update({suspended:true}).eq("id",b.dataset.sp),"Account paused")})};
      $("#pplExpr").onchange=dr;dr();
    }
  }
  draw();
}
};

function stopChat(){if(C.chat){SB.removeChannel(C.chat);C.chat=null}if(C.poll){clearInterval(C.poll);C.poll=null}}
window.addEventListener("hashchange",()=>{if(!route().startsWith("chat-"))stopChat()});

function confirmBox(text){return new Promise(res=>{const box=document.createElement("div");box.className="modal";
  box.innerHTML=`<div class="modal-card stack" role="dialog" aria-label="Confirm"><p>${esc(text)}</p><div class="row" style="justify-content:flex-end"><button class="btn ghost" data-c="0">Cancel</button><button class="btn blue" data-c="1">Yes, continue</button></div></div>`;
  document.body.appendChild(box);box.querySelectorAll("[data-c]").forEach(b=>b.onclick=()=>{box.remove();res(b.dataset.c==="1")})})}
function report(target){
  const box=document.createElement("div");box.className="modal";
  box.innerHTML=`<div class="modal-card stack" role="dialog" aria-label="Report"><h3>Report to a leader</h3><p class="muted" style="font-size:.94rem">Tell us what happened. A church leader will look at it privately.</p><textarea id="repTxt" maxlength="500" style="min-height:100px" required></textarea><p class="callout" id="repMsg" hidden></p><div class="row" style="justify-content:flex-end"><button class="btn ghost" id="repC">Cancel</button><button class="btn blue" id="repS">Send report</button></div></div>`;
  document.body.appendChild(box);$("#repTxt").focus();$("#repC").onclick=()=>box.remove();
  $("#repS").onclick=async()=>{const reason=$("#repTxt").value.trim();if(reason.length<3)return showMsg("repMsg","Add a short reason.");
    const {error}=await SB.from("reports").insert({...target,reason,reporter_id:C.me.id});if(error)return showMsg("repMsg",errText(error));box.remove();toast("Thanks. A leader will look at this.")};
}
