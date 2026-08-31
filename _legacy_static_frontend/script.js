/* =========================================================================
   SMRITI — app logic (localStorage-backed, no build step)
   ========================================================================= */

/* ---------------- persistence helpers ---------------- */
function loadJSON(key, fallback){
  try{ const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; }catch(e){ return fallback; }
}
function saveJSON(key, val){ try{ localStorage.setItem(key, JSON.stringify(val)); }catch(e){ /* storage full or unavailable */ } }

const AVATAR_COLORS = ['#1F3D33','#9C5642','#4F7671','#B8863B','#6B5B95'];

function seedReminders(){
  return [
    { id:'r'+Date.now()+Math.random(), title:'Morning Medicine', time:'8:00 AM', type:'medicine', icon:'💊', done:true },
    { id:'r'+Date.now()+Math.random(), title:'Drink Water', time:'10:30 AM', type:'hydration', icon:'💧', done:false },
    { id:'r'+Date.now()+Math.random(), title:'Afternoon Medicine', time:'1:00 PM', type:'medicine', icon:'💊', done:false },
    { id:'r'+Date.now()+Math.random(), title:'Evening Walk', time:'5:00 PM', type:'activity', icon:'🚶', done:false },
    { id:'r'+Date.now()+Math.random(), title:"Doctor's Appointment", time:'6:00 PM', type:'appointment', icon:'🏥', done:false },
  ];
}
function seedScoreHistory(){
  const base = 55 + Math.floor(Math.random()*10);
  const days = [];
  for(let i=6;i>=1;i--){ days.push({ label:`Day -${i}`, score: Math.max(30, Math.min(95, base + Math.round(Math.sin(i)*12) + i*2)) }); }
  days.push({ label:'Today', score:0 });
  return days;
}
function seedMessages(){
  return [
    { text:"Don't forget to take your afternoon medicine after lunch.", time:'Today · 9:10 AM' },
    { text:'Great job finishing your games yesterday! Keep it up.', time:'Yesterday · 6:40 PM' },
  ];
}

/* ---------------- accounts + store (localStorage) ---------------- */
let patients = loadJSON('smriti_patients', null);
let caregivers = loadJSON('smriti_caregivers', null);
let store = loadJSON('smriti_store', null);

if(!patients){
  patients = [
    { id:'p1', fullName:'Dipali Baruah', age:72, gender:'Female', lang:'Assamese', username:'dipali01', pin:'1234', initials:'DB', color:AVATAR_COLORS[0], photo:null },
    { id:'p2', fullName:'Temjen Longkumer', age:68, gender:'Male', lang:'Ao Naga', username:'temjen01', pin:'1234', initials:'TL', color:AVATAR_COLORS[1], photo:null },
    { id:'p3', fullName:'Lalrinawmi', age:75, gender:'Female', lang:'Mizo', username:'lalrin01', pin:'1234', initials:'L', color:AVATAR_COLORS[2], photo:null },
    { id:'p4', fullName:'Ibemhal Konthoujam', age:70, gender:'Female', lang:'Manipuri', username:'ibemhal01', pin:'1234', initials:'IK', color:AVATAR_COLORS[3], photo:null },
  ];
}
if(!caregivers){
  caregivers = [
    { id:'c1', fullName:'Dr. Mary Lyngdoh', email:'demo@smriti.care', phone:'9000000000', password:'demo123', photo:null },
  ];
}
if(!store) store = {};

function persistAll(){ saveJSON('smriti_patients', patients); saveJSON('smriti_caregivers', caregivers); saveJSON('smriti_store', store); }
function ensureStore(id){
  if(!store[id]){
    store[id] = { reminders: seedReminders(), scoreHistory: seedScoreHistory(), gamesPlayedToday:0, moodLog:[], lastActive:'2 hours ago', gameHistory:[], messages: seedMessages() };
  }
}
patients.forEach(p=>ensureStore(p.id));
persistAll();

let currentPatientId = null;
let currentCaregiverId = null;
let caregiverPatientId = patients[0].id;
const TYPE_ICON = { medicine:'💊', hydration:'💧', activity:'🚶', appointment:'🏥' };
const GUEST_ID = 'guest';
const GAME_SCREENS = ['memory-match','pattern-game','daily-routine','tea-sorting','rhythm-tap'];
const GAME_LABELS = { 'memory-match':'Memory Match', 'pattern-game':'Pattern Recognition', 'daily-routine':'Daily Routine Recall', 'tea-sorting':'Tea Leaf Sorting', 'rhythm-tap':'Rhythm & Tap' };
const GAME_EMOJI = { 'memory-match':'🃏', 'pattern-game':'🔷', 'daily-routine':'🪥', 'tea-sorting':'🍃', 'rhythm-tap':'🥁' };

/* ---------------- navigation ---------------- */
function go(screenId){
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
  const target = document.getElementById('screen-'+screenId);
  if(target) target.classList.add('active');
  window.scrollTo(0,0);
  if(screenId==='home') renderHome();
  if(screenId==='reminders') renderReminders();
  if(screenId==='game-select') renderChips();
  if(screenId==='mood') resetMoodScreen();
  if(screenId==='messages') renderMessages();
  if(screenId==='progress') renderProgress();
  if(screenId==='memory-match') initMemoryMatch();
  if(screenId==='pattern-game') initPatternGame();
  if(screenId==='daily-routine') initDailyRoutine();
  if(screenId==='tea-sorting') initTeaSorting();
  if(screenId==='rhythm-tap') initRhythmTap();
  if(screenId==='dashboard') renderDashboard();
  if(screenId==='auth') resetAuthScreen();
}
document.body.addEventListener('click', (e)=>{
  const btn = e.target.closest('[data-go]');
  if(btn){
    const targetScreen = btn.getAttribute('data-go');
    if(GAME_SCREENS.includes(targetScreen) && !currentPatientId){
      currentPatientId = GUEST_ID;
      ensureStore(GUEST_ID);
    }
    go(targetScreen);
  }
});

/* ---------------- LANDING → AUTH ---------------- */
document.getElementById('btn-nav-login').addEventListener('click', ()=>go('auth'));
document.getElementById('btn-cta-start').addEventListener('click', ()=>go('auth'));
document.getElementById('footer-caregiver-link').addEventListener('click', (e)=>{
  e.preventDefault(); go('auth'); setAuthRole('caregiver'); setAuthTab('login');
});

/* ---------------- AUTH SCREEN LOGIC ---------------- */
let authTab = 'login';
let authRole = 'patient';

function setAuthTab(tab){
  authTab = tab;
  document.querySelectorAll('.tab-row [data-tab]').forEach(b=>b.classList.toggle('active', b.getAttribute('data-tab')===tab));
  renderAuthForms();
}
function setAuthRole(role){
  authRole = role;
  document.querySelectorAll('.role-chip').forEach(c=>c.classList.toggle('active', c.getAttribute('data-role')===role));
  renderAuthForms();
}
document.querySelectorAll('.tab-row [data-tab]').forEach(b=>b.addEventListener('click', ()=>setAuthTab(b.getAttribute('data-tab'))));
document.querySelectorAll('.role-chip').forEach(c=>c.addEventListener('click', ()=>setAuthRole(c.getAttribute('data-role'))));
document.getElementById('auth-alt-text').addEventListener('click', (e)=>{
  const sw = e.target.closest('[data-switch-tab]');
  if(sw) setAuthTab(sw.getAttribute('data-switch-tab'));
});

function hideAllAuthBlocks(){
  ['auth-patient-login','auth-patient-register','auth-caregiver-login','auth-caregiver-register'].forEach(id=>document.getElementById(id).style.display='none');
}
function renderAuthForms(){
  hideAllAuthBlocks();
  document.getElementById('auth-forgot').style.display='none';
  document.getElementById('auth-switcher').style.display='';
  const heading = document.getElementById('auth-heading');
  const sub = document.getElementById('auth-sub');
  const alt = document.getElementById('auth-alt-text');
  alt.style.display='block';

  if(authRole==='patient' && authTab==='login'){
    document.getElementById('auth-patient-login').style.display='block';
    heading.textContent='Welcome back'; sub.textContent='Log in with your Patient ID and PIN.';
    alt.innerHTML = "New here? <b data-switch-tab='register'>Register instead</b>";
  }else if(authRole==='patient' && authTab==='register'){
    document.getElementById('auth-patient-register').style.display='block';
    heading.textContent='Create a patient profile'; sub.textContent='This takes less than a minute. No medical history needed.';
    alt.innerHTML = "Already have a profile? <b data-switch-tab='login'>Log in instead</b>";
  }else if(authRole==='caregiver' && authTab==='login'){
    document.getElementById('auth-caregiver-login').style.display='block';
    heading.textContent='Caregiver login'; sub.textContent='Log in to view patient dashboards.';
    alt.innerHTML = "New caregiver? <b data-switch-tab='register'>Register instead</b>";
  }else{
    document.getElementById('auth-caregiver-register').style.display='block';
    heading.textContent='Create a caregiver account'; sub.textContent='Monitor and support your patients.';
    alt.innerHTML = "Already have an account? <b data-switch-tab='login'>Log in instead</b>";
  }
  alt.querySelectorAll('[data-switch-tab]').forEach(el=>el.addEventListener('click', ()=>setAuthTab(el.getAttribute('data-switch-tab'))));
}
function resetAuthScreen(){
  authTab='login'; authRole='patient';
  document.querySelectorAll('.tab-row [data-tab]').forEach(b=>b.classList.toggle('active', b.getAttribute('data-tab')==='login'));
  document.querySelectorAll('.role-chip').forEach(c=>c.classList.toggle('active', c.getAttribute('data-role')==='patient'));
  renderAuthForms();
}
renderAuthForms();

/* ---- forgot password / pin mock flow ---- */
let forgotRole = 'caregiver';
document.querySelectorAll('[data-forgot]').forEach(link=>{
  link.addEventListener('click', ()=>openForgot(link.getAttribute('data-forgot')));
});
function openForgot(role){
  forgotRole = role;
  hideAllAuthBlocks();
  document.getElementById('auth-switcher').style.display='none';
  document.getElementById('auth-alt-text').style.display='none';
  document.getElementById('auth-forgot').style.display='block';
  document.getElementById('forgot-step1').style.display='block';
  document.getElementById('forgot-step2').style.display='none';
  document.getElementById('forgot-identifier').value='';
  document.getElementById('forgot-otp').value='';
  document.getElementById('forgot-newpass').value='';
  document.getElementById('forgot-error').textContent='';
  if(role==='caregiver'){
    document.getElementById('forgot-sub').textContent='Enter your registered email or phone to receive an OTP.';
    document.getElementById('forgot-id-label').textContent='Email / Phone';
    document.getElementById('forgot-identifier').placeholder='you@example.com';
    document.getElementById('forgot-newpass-label').textContent='New Password';
    document.getElementById('forgot-newpass').placeholder='Create a new password';
  }else{
    document.getElementById('forgot-sub').textContent='Enter your Patient ID / Username — an OTP will be sent to your caregiver.';
    document.getElementById('forgot-id-label').textContent='Patient ID / Username';
    document.getElementById('forgot-identifier').placeholder='e.g. dipali01';
    document.getElementById('forgot-newpass-label').textContent='New PIN / Password';
    document.getElementById('forgot-newpass').placeholder='4-digit PIN or password';
  }
}
document.getElementById('forgot-send-otp').addEventListener('click', ()=>{
  const idVal = document.getElementById('forgot-identifier').value.trim();
  if(!idVal) return;
  document.getElementById('forgot-step1').style.display='none';
  document.getElementById('forgot-step2').style.display='block';
});
document.getElementById('forgot-submit').addEventListener('click', ()=>{
  const otp = document.getElementById('forgot-otp').value.trim();
  const newpass = document.getElementById('forgot-newpass').value.trim();
  const err = document.getElementById('forgot-error');
  const idVal = document.getElementById('forgot-identifier').value.trim();
  if(otp.length<4){ err.textContent='Enter the OTP sent to you (demo: any 4+ digit code works).'; return; }
  if(!newpass){ err.textContent='Enter a new password / PIN.'; return; }
  if(forgotRole==='caregiver'){
    const acc = caregivers.find(c=>c.email===idVal || c.phone===idVal);
    if(!acc){ err.textContent='No caregiver account found with that email / phone.'; return; }
    acc.password = newpass;
  }else{
    const acc = patients.find(p=>p.username===idVal.toLowerCase());
    if(!acc){ err.textContent='No patient found with that ID / username.'; return; }
    acc.pin = newpass;
  }
  persistAll();
  err.textContent='';
  closeForgot();
  alert('Reset successful — please log in with your new credentials.');
});
document.getElementById('forgot-back').addEventListener('click', closeForgot);
function closeForgot(){
  document.getElementById('auth-forgot').style.display='none';
  document.getElementById('auth-alt-text').style.display='block';
  renderAuthForms();
}

/* ---- patient register/login ---- */
document.getElementById('auth-patient-register').addEventListener('submit', (e)=>{
  e.preventDefault();
  const fullName = document.getElementById('reg-p-name').value.trim();
  const age = document.getElementById('reg-p-age').value.trim();
  const gender = document.getElementById('reg-p-gender').value;
  const lang = document.getElementById('reg-p-lang').value;
  const username = document.getElementById('reg-p-username').value.trim().toLowerCase();
  const pin = document.getElementById('reg-p-pin').value.trim();
  const err = document.getElementById('reg-p-error');
  if(!fullName || !age || !username || !pin){ err.textContent='Please fill in all required fields.'; return; }
  if(patients.some(p=>p.username===username)){ err.textContent='This Patient ID / Username is already taken.'; return; }
  err.textContent='';
  const photoInput = document.getElementById('reg-p-photo');
  const finish = (photoDataUrl)=>{
    const id = 'p'+Date.now();
    const initials = fullName.split(' ').map(w=>w[0]).slice(0,2).join('').toUpperCase();
    const color = AVATAR_COLORS[patients.length % AVATAR_COLORS.length];
    patients.push({ id, fullName, age:Number(age), gender, lang, username, pin, initials, color, photo:photoDataUrl||null });
    ensureStore(id);
    persistAll();
    currentPatientId = id;
    document.getElementById('auth-patient-register').reset();
    go('home');
  };
  if(photoInput.files[0]){
    const reader = new FileReader();
    reader.onload = ()=>finish(reader.result);
    reader.readAsDataURL(photoInput.files[0]);
  }else finish(null);
});
document.getElementById('auth-patient-login').addEventListener('submit', (e)=>{
  e.preventDefault();
  const username = document.getElementById('login-p-username').value.trim().toLowerCase();
  const pin = document.getElementById('login-p-pin').value.trim();
  const err = document.getElementById('login-p-error');
  const acc = patients.find(p=>p.username===username && p.pin===pin);
  if(!acc){ err.textContent='Invalid Patient ID or PIN.'; return; }
  err.textContent='';
  currentPatientId = acc.id;
  document.getElementById('auth-patient-login').reset();
  go('home');
});

/* ---- caregiver register/login ---- */
document.getElementById('auth-caregiver-register').addEventListener('submit', (e)=>{
  e.preventDefault();
  const fullName = document.getElementById('cg-reg-name').value.trim();
  const email = document.getElementById('cg-reg-email').value.trim();
  const phone = document.getElementById('cg-reg-phone').value.trim();
  const password = document.getElementById('cg-reg-pass').value.trim();
  const err = document.getElementById('cg-reg-error');
  if(!fullName || !email || !phone || !password){ err.textContent='Please fill in all required fields.'; return; }
  if(caregivers.some(c=>c.email===email)){ err.textContent='An account with this email already exists.'; return; }
  err.textContent='';
  const photoInput = document.getElementById('cg-reg-photo');
  const finish = (photoDataUrl)=>{
    const newCg = { id:'c'+Date.now(), fullName, email, phone, password, photo:photoDataUrl||null };
    caregivers.push(newCg); persistAll();
    currentCaregiverId = newCg.id;
    document.getElementById('auth-caregiver-register').reset();
    go('dashboard');
  };
  if(photoInput.files[0]){
    const reader = new FileReader();
    reader.onload = ()=>finish(reader.result);
    reader.readAsDataURL(photoInput.files[0]);
  }else finish(null);
});
document.getElementById('auth-caregiver-login').addEventListener('submit', (e)=>{
  e.preventDefault();
  const idVal = document.getElementById('cg-login-email').value.trim();
  const pass = document.getElementById('cg-login-pass').value.trim();
  const err = document.getElementById('cg-login-error');
  const acc = caregivers.find(c=>(c.email===idVal || c.phone===idVal) && c.password===pass);
  if(!acc){ err.textContent='Invalid credentials. Please try again or register.'; return; }
  err.textContent='';
  currentCaregiverId = acc.id;
  document.getElementById('auth-caregiver-login').reset();
  go('dashboard');
});

document.getElementById('btn-logout-home').addEventListener('click', ()=>{ currentPatientId=null; go('landing'); });
document.getElementById('btn-logout-dash').addEventListener('click', ()=>{ currentCaregiverId=null; go('landing'); });

/* ---------------- patient chip on headers ---------------- */
function avatarHtml(p, size){
  if(p.photo) return `<img src="${p.photo}" alt="">`;
  return p.initials;
}
function renderChips(){
  const p = patients.find(x=>x.id===currentPatientId);
  if(!p) return;
  const html = `<div class="patient-chip"><div class="mini-avatar" style="background:${p.color};">${avatarHtml(p)}</div>${p.fullName.split(' ')[0]}</div>`;
  ['chip-slot-1','chip-slot-2','chip-slot-3','chip-slot-4','home-patient-chip'].forEach(id=>{ const el=document.getElementById(id); if(el) el.innerHTML = html; });
}

/* ---------------- PATIENT DASHBOARD (home) ---------------- */
const CHECKIN_LINES = ["How are you feeling today?", "Ready for a gentle activity today?", "Let's make today a good day.", "Take a moment — how's your day going?"];
function renderHome(){
  const p = patients.find(x=>x.id===currentPatientId);
  renderChips();
  const hour = new Date().getHours();
  const timeGreet = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const first = p ? p.fullName.split(' ')[0] : 'Guest';
  document.getElementById('home-greeting').textContent = `${timeGreet} 👋, ${first}!`;
  document.getElementById('home-checkin-msg').textContent = CHECKIN_LINES[Math.floor(Math.random()*CHECKIN_LINES.length)];
  speak(`${timeGreet}, ${first}!`);
}
function speak(text){
  try{
    if('speechSynthesis' in window){
      const u = new SpeechSynthesisUtterance(text);
      u.rate = 0.95; u.pitch = 1.0;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(u);
    }
  }catch(err){}
}

/* ---------------- shared game helpers ---------------- */
function shuffle(arr){ const a=arr.slice(); for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; }
function showPhase(prefix, phase){
  ['diff','play','results'].forEach(ph=>{
    const el = document.getElementById(`${prefix}-${ph}-phase`);
    if(el) el.style.display = ph===phase ? '' : 'none';
  });
}
function sessionScore(s){
  const attempts = s.correct + s.errors;
  return attempts ? Math.round((s.correct/attempts)*100) : 0;
}
function sessionAvgTime(s){
  if(!s.times.length) return 0;
  return Math.round(s.times.reduce((a,b)=>a+b,0)/s.times.length);
}
function renderResults(prefix, gameId, s, onReplay, onChangeDiff){
  const score = sessionScore(s);
  const avgTime = sessionAvgTime(s);
  recordGameResult({ gameId, difficulty:s.difficulty, score, correct:s.correct, errors:s.errors, avgTime });
  const avgLabel = avgTime ? (avgTime/1000).toFixed(1)+'s' : '—';
  const el = document.getElementById(`${prefix}-results-phase`);
  el.innerHTML = `
    <h3 class="results-title">Session complete — 5 rounds (${s.difficulty})</h3>
    <div class="results-grid">
      <div class="stat-box"><div class="v">${score}%</div><div class="l">Score</div></div>
      <div class="stat-box"><div class="v">${s.correct}</div><div class="l">Correct</div></div>
      <div class="stat-box"><div class="v">${s.errors}</div><div class="l">Errors</div></div>
      <div class="stat-box"><div class="v">${avgLabel}</div><div class="l">Avg Response</div></div>
    </div>
    <div class="results-actions">
      <button class="btn btn-primary" id="${prefix}-replay-btn">🔁 Play Again</button>
      <button class="btn btn-outline" id="${prefix}-changediff-btn">🎚️ Change Difficulty</button>
      <button class="btn btn-ghost" data-go="game-select">← Back to Games</button>
    </div>`;
  document.getElementById(`${prefix}-replay-btn`).onclick = onReplay;
  document.getElementById(`${prefix}-changediff-btn`).onclick = onChangeDiff;
  showPhase(prefix, 'results');
}
function recordGameResult(result){
  if(!currentPatientId) return;
  const s = store[currentPatientId];
  s.gamesPlayedToday += 1;
  s.lastActive = 'Just now';
  const today = s.scoreHistory[s.scoreHistory.length-1];
  today.score = Math.max(today.score, result.score);
  s.gameHistory.unshift({ gameId: result.gameId, difficulty: result.difficulty, score: result.score, correct: result.correct, errors: result.errors, avgTime: result.avgTime, when: new Date().toLocaleString([], {month:'short', day:'numeric', hour:'2-digit', minute:'2-digit'}) });
  s.gameHistory = s.gameHistory.slice(0, 30);
  persistAll();
}
const GAME_START = {};
document.body.addEventListener('click', (e)=>{
  const btn = e.target.closest('.diff-btn');
  if(btn){
    const prefix = btn.getAttribute('data-prefix');
    const diff = btn.getAttribute('data-diff');
    if(GAME_START[prefix]) GAME_START[prefix](diff);
  }
});

/* ---------------- MEMORY MATCH ---------------- */
const MM_EMOJI = ['🍵','🎋','🏔️','🦚','🐘','🌾','🥁','🧣'];
const MM_DIFF = { easy:{pairs:4}, medium:{pairs:6}, hard:{pairs:8} };
let mmSession = null;
function initMemoryMatch(){ mmSession=null; showPhase('mm','diff'); document.getElementById('mm-score').textContent='Round 0 / 5'; }
function startMemoryMatch(difficulty){
  mmSession = { difficulty, round:0, totalRounds:5, correct:0, errors:0, times:[], pairs:MM_DIFF[difficulty].pairs, first:null, second:null, locked:false, matchedThisRound:0, roundStart:0 };
  showPhase('mm','play');
  nextMMRound();
}
GAME_START.mm = startMemoryMatch;
function nextMMRound(){
  mmSession.round++;
  document.getElementById('mm-score').textContent = `Round ${mmSession.round} / ${mmSession.totalRounds}`;
  const emojiSet = shuffle(MM_EMOJI).slice(0, mmSession.pairs);
  const deck = shuffle([...emojiSet, ...emojiSet]);
  const grid = document.getElementById('mm-grid');
  grid.innerHTML = deck.map((emoji,i)=>`<div class="mm-card" data-index="${i}" data-emoji="${emoji}"><span class="back">?</span><span class="face">${emoji}</span></div>`).join('');
  grid.querySelectorAll('.mm-card').forEach(card=>card.addEventListener('click', ()=>flipCard(card)));
  mmSession.matchedThisRound = 0;
  mmSession.roundStart = performance.now();
  updateMMLive();
}
function updateMMLive(){ document.getElementById('mm-live-stats').textContent = `Correct: ${mmSession.correct} · Errors: ${mmSession.errors}`; }
function flipCard(card){
  if(mmSession.locked || card.classList.contains('flipped') || card.classList.contains('matched')) return;
  card.classList.add('flipped');
  if(!mmSession.first){ mmSession.first = card; return; }
  mmSession.second = card; mmSession.locked = true;
  const isMatch = mmSession.first.dataset.emoji === mmSession.second.dataset.emoji;
  setTimeout(()=>{
    if(isMatch){
      mmSession.first.classList.add('matched'); mmSession.second.classList.add('matched');
      mmSession.correct++; mmSession.matchedThisRound++;
      updateMMLive();
      if(mmSession.matchedThisRound === mmSession.pairs){
        mmSession.times.push(performance.now()-mmSession.roundStart);
        mmSession.first=null; mmSession.second=null; mmSession.locked=false;
        if(mmSession.round >= mmSession.totalRounds){ finishMM(); } else { setTimeout(nextMMRound, 700); }
        return;
      }
    }else{
      mmSession.errors++; updateMMLive();
      mmSession.first.classList.remove('flipped'); mmSession.second.classList.remove('flipped');
    }
    mmSession.first=null; mmSession.second=null; mmSession.locked=false;
  }, 650);
}
function finishMM(){
  renderResults('mm', 'memory-match', mmSession, ()=>startMemoryMatch(mmSession.difficulty), ()=>showPhase('mm','diff'));
}

/* ---------------- PATTERN RECOGNITION ---------------- */
const PG_ICONS = ['🔺','🔵','⭐','🟩','🔶','🟣','⬛','💠','🔻'];
const PG_DIFF = { easy:{len:3}, medium:{len:5}, hard:{len:7} };
let pgSession = null;
function initPatternGame(){ pgSession=null; showPhase('pg','diff'); document.getElementById('pg-score').textContent='Round 0 / 5'; }
function startPatternGame(difficulty){
  pgSession = { difficulty, round:0, totalRounds:5, correct:0, errors:0, times:[], len:PG_DIFF[difficulty].len, sequence:[], userIndex:0, active:false, roundHasError:false, roundStart:0 };
  showPhase('pg','play');
  const grid = document.getElementById('pg-grid');
  grid.innerHTML = PG_ICONS.map((icon,i)=>`<div class="pg-cell" data-index="${i}">${icon}</div>`).join('');
  grid.querySelectorAll('.pg-cell').forEach(cell=>cell.addEventListener('click', ()=>handlePgTap(cell)));
  nextPGRound();
}
GAME_START.pg = startPatternGame;
function updatePGLive(){ document.getElementById('pg-live-stats').textContent = `Correct: ${pgSession.correct} · Errors: ${pgSession.errors}`; }
function nextPGRound(){
  pgSession.round++;
  document.getElementById('pg-score').textContent = `Round ${pgSession.round} / ${pgSession.totalRounds}`;
  updatePGLive();
  pgSession.userIndex = 0; pgSession.roundHasError = false;
  pgSession.sequence = Array.from({length: pgSession.len}, ()=>Math.floor(Math.random()*9));
  document.getElementById('pg-status').textContent = 'Watch carefully…';
  playPGSequence();
}
function playPGSequence(){
  const cells = document.querySelectorAll('.pg-cell');
  cells.forEach(c=>c.style.pointerEvents='none');
  let i=0;
  const interval = setInterval(()=>{
    cells.forEach(c=>c.classList.remove('lit'));
    if(i < pgSession.sequence.length){ cells[pgSession.sequence[i]].classList.add('lit'); i++; }
    else{
      clearInterval(interval);
      cells.forEach(c=>{ c.classList.remove('lit'); c.style.pointerEvents='auto'; });
      document.getElementById('pg-status').textContent = 'Your turn — tap them in order';
      pgSession.roundStart = performance.now();
      pgSession.active = true;
    }
  }, 600);
}
function handlePgTap(cell){
  if(!pgSession.active) return;
  const idx = Number(cell.getAttribute('data-index'));
  const expected = pgSession.sequence[pgSession.userIndex];
  if(idx === expected){
    cell.classList.add('lit'); setTimeout(()=>cell.classList.remove('lit'), 200);
    pgSession.userIndex++;
    if(pgSession.userIndex === pgSession.sequence.length){
      pgSession.active = false;
      if(!pgSession.roundHasError) pgSession.correct++;
      pgSession.times.push(performance.now()-pgSession.roundStart);
      updatePGLive();
      document.getElementById('pg-status').textContent = 'Nice! Next round…';
      if(pgSession.round >= pgSession.totalRounds){ setTimeout(finishPG, 900); } else { setTimeout(nextPGRound, 900); }
    }
  }else{
    cell.classList.add('wrong'); setTimeout(()=>cell.classList.remove('wrong'), 350);
    pgSession.errors++; pgSession.roundHasError = true;
    updatePGLive();
  }
}
function finishPG(){
  renderResults('pg', 'pattern-game', pgSession, ()=>startPatternGame(pgSession.difficulty), ()=>showPhase('pg','diff'));
}

/* ---------------- DAILY ROUTINE RECALL ---------------- */
const ROUTINE_FULL = [
  {icon:'🌅', key:'wake', label:'Wake up'}, {icon:'🪥', key:'brush', label:'Brush teeth'},
  {icon:'👕', key:'dress', label:'Get dressed'}, {icon:'🍽️', key:'eat', label:'Eat breakfast'},
  {icon:'💊', key:'medicine', label:'Take medicine'}, {icon:'🛁', key:'bathe', label:'Bathe'},
  {icon:'📖', key:'read', label:'Read newspaper'}, {icon:'😴', key:'sleep', label:'Sleep'},
];
const DR_DIFF = { easy:{idx:[0,3,4,7]}, medium:{idx:[0,1,3,4,5,7]}, hard:{idx:[0,1,2,3,4,5,6,7]} };
let drSession = null;
function initDailyRoutine(){ drSession=null; showPhase('dr','diff'); document.getElementById('dr-score').textContent='Round 0 / 5'; }
function startDailyRoutine(difficulty){
  drSession = { difficulty, round:0, totalRounds:5, correct:0, errors:0, times:[], items: DR_DIFF[difficulty].idx.map(i=>ROUTINE_FULL[i]), placed:[], roundStart:0 };
  showPhase('dr','play');
  nextDRRound();
}
GAME_START.dr = startDailyRoutine;
function updateDRLive(){ document.getElementById('dr-live-stats').textContent = `Correct: ${drSession.correct} · Errors: ${drSession.errors}`; }
function nextDRRound(){
  drSession.round++;
  document.getElementById('dr-score').textContent = `Round ${drSession.round} / ${drSession.totalRounds}`;
  updateDRLive();
  drSession.placed = [];
  document.getElementById('dr-slots').innerHTML = drSession.items.map((_,i)=>`<div class="routine-slot" data-slot="${i}"></div>`).join('');
  const pool = document.getElementById('dr-pool');
  pool.innerHTML = shuffle(drSession.items).map(item=>`<button class="routine-chip" data-key="${item.key}">${item.icon}</button>`).join('');
  pool.querySelectorAll('.routine-chip').forEach(chip=>chip.addEventListener('click', ()=>handleDRTap(chip)));
  document.getElementById('dr-hint').textContent='';
  drSession.roundStart = performance.now();
}
function handleDRTap(chip){
  const key = chip.getAttribute('data-key');
  const nextIndex = drSession.placed.length;
  const expectedKey = drSession.items[nextIndex].key;
  const slot = document.querySelector(`.routine-slot[data-slot="${nextIndex}"]`);
  if(key === expectedKey){
    slot.textContent = chip.textContent; slot.classList.add('filled'); chip.classList.add('used');
    drSession.placed.push(key); drSession.correct++;
    updateDRLive();
    if(drSession.placed.length === drSession.items.length){
      drSession.times.push(performance.now()-drSession.roundStart);
      document.getElementById('dr-hint').textContent = '🎉 Well done!';
      if(drSession.round >= drSession.totalRounds){ setTimeout(finishDR, 700); } else { setTimeout(nextDRRound, 700); }
    }
  }else{
    drSession.errors++; updateDRLive();
    document.getElementById('dr-hint').textContent = 'Not quite — try again.';
    chip.animate([{transform:'translateX(0)'},{transform:'translateX(-6px)'},{transform:'translateX(6px)'},{transform:'translateX(0)'}], {duration:250});
  }
}
function finishDR(){
  renderResults('dr', 'daily-routine', drSession, ()=>startDailyRoutine(drSession.difficulty), ()=>showPhase('dr','diff'));
}

/* ---------------- TEA LEAF SORTING ---------------- */
const TS_DIFF = { easy:{leaves:4, duration:4000}, medium:{leaves:5, duration:3000}, hard:{leaves:6, duration:2200} };
let tsSession = null;
function initTeaSorting(){ tsSession=null; showPhase('ts','diff'); document.getElementById('ts-score').textContent='Round 0 / 5'; }
function startTeaSorting(difficulty){
  tsSession = { difficulty, round:0, totalRounds:5, correct:0, errors:0, times:[], cfg:TS_DIFF[difficulty], queue:[], index:0, active:null, resolved:true, spawnTime:0 };
  showPhase('ts','play');
  nextTSRound();
}
GAME_START.ts = startTeaSorting;
function updateTSLive(){ document.getElementById('ts-live-stats').textContent = `Correct: ${tsSession.correct} · Errors: ${tsSession.errors}`; }
function nextTSRound(){
  tsSession.round++;
  document.getElementById('ts-score').textContent = `Round ${tsSession.round} / ${tsSession.totalRounds}`;
  updateTSLive();
  const n = tsSession.cfg.leaves;
  tsSession.queue = shuffle(Array.from({length:n}, (_,i)=> i%2===0 ? 'fresh':'dry'));
  tsSession.index = 0; tsSession.resolved = true; tsSession.active = null;
  document.querySelector('.ts-track').querySelectorAll('.ts-leaf').forEach(l=>l.remove());
  document.getElementById('ts-feedback').textContent='';
  spawnLeaf();
}
function spawnLeaf(){
  if(tsSession.index >= tsSession.queue.length){
    if(tsSession.round >= tsSession.totalRounds){ finishTS(); } else { setTimeout(nextTSRound, 500); }
    return;
  }
  const type = tsSession.queue[tsSession.index];
  const track = document.querySelector('.ts-track');
  const leaf = document.createElement('div');
  leaf.className = 'ts-leaf sliding';
  leaf.style.animationDuration = tsSession.cfg.duration+'ms';
  leaf.textContent = type==='fresh' ? '🍃' : '🍂';
  leaf.dataset.type = type;
  track.appendChild(leaf);
  tsSession.active = leaf; tsSession.resolved = false; tsSession.spawnTime = performance.now();
  leaf.addEventListener('animationend', ()=>{
    if(!tsSession.resolved){
      tsSession.errors++; updateTSLive();
      document.getElementById('ts-feedback').textContent = 'Missed — leaf reached the end.';
      tsSession.resolved = true; leaf.remove(); tsSession.index++;
      setTimeout(spawnLeaf, 300);
    }
  });
}
function handleTsBin(chosenType){
  if(!tsSession || tsSession.resolved || !tsSession.active) return;
  tsSession.resolved = true;
  const leaf = tsSession.active;
  const rt = performance.now() - tsSession.spawnTime;
  const correct = leaf.dataset.type === chosenType;
  if(correct){ tsSession.correct++; tsSession.times.push(rt); document.getElementById('ts-feedback').textContent = '✅ Correct!'; }
  else{ tsSession.errors++; document.getElementById('ts-feedback').textContent = `❌ That was a ${leaf.dataset.type} leaf.`; }
  updateTSLive();
  leaf.style.transition = 'opacity .2s'; leaf.style.opacity = '0';
  tsSession.index++;
  setTimeout(()=>{ leaf.remove(); spawnLeaf(); }, 300);
}
document.getElementById('ts-fresh-btn').addEventListener('click', ()=>handleTsBin('fresh'));
document.getElementById('ts-dry-btn').addEventListener('click', ()=>handleTsBin('dry'));
function finishTS(){
  renderResults('ts', 'tea-sorting', tsSession, ()=>startTeaSorting(tsSession.difficulty), ()=>showPhase('ts','diff'));
}

/* ---------------- RHYTHM & TAP ---------------- */
const RT_DIFF = { easy:{beats:5, interval:1100, tolerance:550}, medium:{beats:6, interval:900, tolerance:400}, hard:{beats:7, interval:700, tolerance:300} };
let rtSession = null;
function initRhythmTap(){ rtSession=null; showPhase('rt','diff'); document.getElementById('rt-score').textContent='Round 0 / 5'; }
function startRhythmTap(difficulty){
  rtSession = { difficulty, round:0, totalRounds:5, correct:0, errors:0, times:[], cfg:RT_DIFF[difficulty], current:0, awaiting:false, hit:false, beatTime:0, tickTimer:null, awaitTimeout:null };
  showPhase('rt','play');
  nextRTRound();
}
GAME_START.rt = startRhythmTap;
function updateRTLive(){ document.getElementById('rt-live-stats').textContent = `Correct: ${rtSession.correct} · Errors: ${rtSession.errors}`; }
function nextRTRound(){
  rtSession.round++;
  document.getElementById('rt-score').textContent = `Round ${rtSession.round} / ${rtSession.totalRounds}`;
  updateRTLive();
  rtSession.current = 0;
  document.getElementById('rt-beats').innerHTML = Array.from({length: rtSession.cfg.beats}, ()=>'<div class="rt-beat-dot"></div>').join('');
  document.getElementById('rt-feedback').textContent='';
  rtSession.tickTimer = setInterval(rhythmBeat, rtSession.cfg.interval);
  rhythmBeat();
}
function rhythmBeat(){
  if(rtSession.current >= rtSession.cfg.beats){
    clearInterval(rtSession.tickTimer);
    if(rtSession.round >= rtSession.totalRounds){ finishRT(); } else { setTimeout(nextRTRound, 600); }
    return;
  }
  const drum = document.getElementById('rt-drum');
  drum.classList.add('pulse');
  rtSession.awaiting = true; rtSession.hit = false; rtSession.beatTime = performance.now();
  const beatIndex = rtSession.current;
  setTimeout(()=>drum.classList.remove('pulse'), 220);
  rtSession.awaitTimeout = setTimeout(()=>{
    if(rtSession.awaiting && !rtSession.hit){
      rtSession.errors++; markBeatDot(beatIndex, 'miss'); updateRTLive();
    }
    rtSession.awaiting = false;
    rtSession.current++;
  }, rtSession.cfg.tolerance);
}
function markBeatDot(i, cls){ const dots = document.querySelectorAll('#rt-beats .rt-beat-dot'); if(dots[i]) dots[i].classList.add(cls); }
document.getElementById('rt-tapbtn').addEventListener('click', ()=>{
  if(!rtSession || !rtSession.awaiting){
    if(rtSession) document.getElementById('rt-feedback').textContent = 'Try to tap right as the drum pulses.';
    return;
  }
  rtSession.hit = true;
  const rt = performance.now() - rtSession.beatTime;
  rtSession.correct++; rtSession.times.push(rt);
  markBeatDot(rtSession.current, 'hit');
  document.getElementById('rt-feedback').textContent = '🎯 On beat!';
  updateRTLive();
});
function finishRT(){
  renderResults('rt', 'rhythm-tap', rtSession, ()=>startRhythmTap(rtSession.difficulty), ()=>showPhase('rt','diff'));
}

/* ---------------- REMINDERS / MEDICINE: full CRUD ---------------- */
function renderReminders(){
  const p = patients.find(x=>x.id===currentPatientId);
  if(!p){ ensureStore(currentPatientId); }
  const reminders = store[currentPatientId].reminders;
  const pending = reminders.filter(r=>!r.done);
  const done = reminders.filter(r=>r.done);
  document.getElementById('reminder-list-pending').innerHTML = pending.length ? pending.map(reminderCardHtml).join('') : `<div class="empty-state">Nothing pending — you're all caught up.</div>`;
  document.getElementById('reminder-list-done').innerHTML = done.length ? done.map(reminderCardHtml).join('') : `<div class="empty-state">No reminders completed yet today.</div>`;
  document.querySelectorAll('.check-btn').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const r = reminders.find(x=>x.id===btn.getAttribute('data-rid'));
      r.done = !r.done; persistAll(); renderReminders();
    });
  });
  document.querySelectorAll('.del-btn').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const rid = btn.getAttribute('data-rid');
      store[currentPatientId].reminders = reminders.filter(x=>x.id!==rid);
      persistAll(); renderReminders();
    });
  });
}
function reminderCardHtml(r){
  return `<div class="reminder-card type-${r.type} ${r.done?'is-done':''}">
    <div class="reminder-icon">${r.icon}</div>
    <div class="reminder-info"><div class="t ${r.done?'strike':''}">${r.title}</div><div class="time">${r.time}</div></div>
    <div class="reminder-actions">
      <button class="check-btn ${r.done?'done':''}" data-rid="${r.id}">${r.done?'✔️':''}</button>
      <button class="del-btn" data-rid="${r.id}">🗑️</button>
    </div>
  </div>`;
}
document.getElementById('reminder-form').addEventListener('submit', (e)=>{
  e.preventDefault();
  if(!currentPatientId) return;
  const title = document.getElementById('rem-title').value.trim();
  const time = document.getElementById('rem-time').value.trim();
  const type = document.getElementById('rem-type').value;
  if(!title || !time) return;
  store[currentPatientId].reminders.push({ id:'r'+Date.now()+Math.random(), title, time, type, icon:TYPE_ICON[type], done:false });
  persistAll();
  document.getElementById('reminder-form').reset();
  renderReminders();
});

/* ---------------- CAREGIVER MESSAGE (patient-facing) ---------------- */
function renderMessages(){
  if(!currentPatientId) return;
  const msgs = store[currentPatientId].messages || [];
  const el = document.getElementById('messages-list');
  el.innerHTML = msgs.length ? msgs.map(m=>`
    <div class="message-card"><div class="m-ico">💬</div><div><div class="m-text">${m.text}</div><div class="m-time">${m.time}</div></div></div>
  `).join('') : `<div class="empty-state">No messages yet from your caregiver.</div>`;
}

/* ---------------- CHECK-IN ---------------- */
function resetMoodScreen(){ document.getElementById('mood-confirm').classList.remove('show'); }
document.querySelectorAll('.mood-btn').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    if(!currentPatientId) return;
    const mood = btn.getAttribute('data-mood');
    store[currentPatientId].moodLog.push({ mood, time: new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'}) });
    persistAll();
    document.getElementById('mood-confirm').classList.add('show');
    setTimeout(()=>go('home'), 1100);
  });
});

/* ---------------- MY PROGRESS (patient-facing) ---------------- */
function renderProgress(){
  if(!currentPatientId) return;
  const s = store[currentPatientId];
  const hist = s.gameHistory || [];
  const totalGames = hist.length;
  const avgScore = totalGames ? Math.round(hist.reduce((a,g)=>a+g.score,0)/totalGames) : 0;
  const lastMood = s.moodLog.length ? s.moodLog[s.moodLog.length-1].mood : '—';
  const recent = hist.slice(0,6);
  const chipClass = (score)=> score>=80 ? 'good' : score>=60 ? 'mid' : 'low';
  const el = document.getElementById('progress-wrap');
  el.innerHTML = `
    <div class="progress-stats">
      <div class="progress-stat"><div class="v">${totalGames}</div><div class="l">Games played</div></div>
      <div class="progress-stat"><div class="v">${avgScore}%</div><div class="l">Average score</div></div>
      <div class="progress-stat"><div class="v">${lastMood}</div><div class="l">Latest mood</div></div>
    </div>
    <div class="reminder-section-title">Recent sessions</div>
    <div class="progress-history">
      ${recent.length ? recent.map(g=>`
        <div class="progress-row">
          <div class="g-em">${GAME_EMOJI[g.gameId]||'🎮'}</div>
          <div class="g-info"><div class="g-name">${GAME_LABELS[g.gameId]||g.gameId}</div><div class="g-meta">${g.difficulty} · ${g.when}</div></div>
          <span class="score-chip ${chipClass(g.score)}">${g.score}%</span>
        </div>`).join('') : `<div class="empty-state">Play a game to start building your progress history.</div>`}
    </div>`;
}

/* ---------------- CAREGIVER DASHBOARD ---------------- */
let scoreChartInstance = null;
function renderDashboard(){
  const select = document.getElementById('dash-patient-select');
  select.innerHTML = patients.map(p=>`<option value="${p.id}">${p.fullName}</option>`).join('');
  select.value = caregiverPatientId;
  select.onchange = ()=>{ caregiverPatientId = select.value; renderDashboardBody(); };
  renderDashboardBody();
}
function renderDashboardBody(){
  const p = patients.find(x=>x.id===caregiverPatientId);
  ensureStore(p.id);
  const s = store[p.id];
  document.getElementById('patient-banner').innerHTML = `
    <div class="pb-avatar" style="background:${p.color};">${avatarHtml(p)}</div>
    <div class="pb-info"><h2>${p.fullName}</h2><div class="meta"><span class="dot-live"></span>Age ${p.age} · ${p.gender||''} · ${p.lang} · Last active: ${s.lastActive}</div></div>`;
  const doneCount = s.reminders.filter(r=>r.done).length;
  const compliance = s.reminders.length ? Math.round((doneCount / s.reminders.length) * 100) : 100;
  document.getElementById('summary-cards').innerHTML = `
    <div class="summary-card"><div class="num">${s.gamesPlayedToday}</div><div class="lbl">Games played today</div></div>
    <div class="summary-card gold"><div class="num">${compliance}%</div><div class="lbl">Reminder compliance</div></div>
    <div class="summary-card clay"><div class="num">${s.moodLog.length ? s.moodLog[s.moodLog.length-1].mood : '—'}</div><div class="lbl">Latest mood check-in</div></div>`;
  const alerts = [];
  s.reminders.filter(r=>!r.done).forEach(r=>alerts.push({ icon:r.icon, text:`Missed / pending: ${r.title}`, time:r.time, low:false }));
  if(s.gamesPlayedToday === 0) alerts.push({ icon:'📉', text:'Low activity today — no games played yet', time:'Today', low:true });
  const alertsList = document.getElementById('alerts-list');
  alertsList.innerHTML = alerts.length ? alerts.map(a=>`
    <div class="alert-card ${a.low?'low':''}"><div class="a-icon">${a.icon}</div><div><div class="a-text">${a.text}</div><div class="a-time">${a.time}</div></div></div>
  `).join('') : `<div class="no-alerts">✅ No alerts — everything looks good today.</div>`;

  const ghmEl = document.getElementById('game-history-mini');
  const hist = (s.gameHistory||[]).slice(0,8);
  ghmEl.innerHTML = hist.length ? hist.map(g=>`
    <div class="ghm-row"><span class="n">${GAME_EMOJI[g.gameId]||'🎮'} ${GAME_LABELS[g.gameId]||g.gameId} <span class="d">(${g.difficulty})</span></span><span>${g.score}%</span></div>
  `).join('') : `<div class="no-alerts">No game sessions recorded yet.</div>`;

  const ctx = document.getElementById('score-chart').getContext('2d');
  if(scoreChartInstance) scoreChartInstance.destroy();
  scoreChartInstance = new Chart(ctx, {
    type:'line',
    data:{ labels: s.scoreHistory.map(d=>d.label), datasets:[{ label:'Cognitive score', data:s.scoreHistory.map(d=>d.score),
      borderColor:'#1F3D33', backgroundColor:'rgba(184,134,59,0.18)', fill:true, tension:0.35, pointBackgroundColor:'#B8863B', pointRadius:4 }] },
    options:{ responsive:true, maintainAspectRatio:false, plugins:{ legend:{ display:false } },
      scales:{ y:{ beginAtZero:true, max:100, grid:{ color:'#EFECE2' } }, x:{ grid:{ display:false } } } }
  });
}
document.getElementById('cg-msg-send').addEventListener('click', ()=>{
  const input = document.getElementById('cg-msg-input');
  const text = input.value.trim();
  if(!text) return;
  ensureStore(caregiverPatientId);
  store[caregiverPatientId].messages.unshift({ text, time: 'Today · ' + new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'}) });
  persistAll();
  input.value='';
  const note = document.getElementById('cg-msg-note');
  note.textContent = 'Message sent to patient.';
  setTimeout(()=>{ note.textContent=''; }, 2500);
});