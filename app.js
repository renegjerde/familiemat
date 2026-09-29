const KEY='familiemat-v1-data';
const FAMILY_KEY='familiemat-family-id';
const SUPABASE_URL='https://bukqjuyedqzyribzkcui.supabase.co';
const SUPABASE_PUBLISHABLE_KEY='sb_publishable_SHpVB28p0wKiWYg4HGt8eg_F_WZigNC';
const cloud=window.supabase?.createClient(SUPABASE_URL,SUPABASE_PUBLISHABLE_KEY);
let authSession=null;
let familyId=localStorage.getItem(FAMILY_KEY)||'';
let realtimeChannel=null;
let cloudBusy=false;
let cloudReady=false;

const days=['Mandag','Tirsdag','Onsdag','Torsdag','Fredag','Lørdag','Søndag'];
const recipeCategories=['Fisk','Kylling','Kjøtt','Vegetar','Pasta','Tex-Mex','Suppe','Lett middag','Pizza','Gryte','Annet'];
const starterRecipes=[
{name:'Spaghetti bolognese',days:[],categories:['Kjøtt','Pasta'],servings:4,ingredients:[['Kjøttdeig',400,'g'],['Spaghetti',500,'g'],['Løk',1,'stk'],['Hakkede tomater',2,'bokser']],instructions:'Stek kjøttdeig og løk. Tilsett tomater og la sausen småkoke. Kok pasta og server.',url:''},
{name:'Taco',days:[4],categories:['Kjøtt','Tex-Mex'],servings:4,ingredients:[['Kjøttdeig',400,'g'],['Løk',1,'stk'],['Tacokrydder',1,'pose'],['Tortilla',1,'pakke'],['Mais',1,'boks'],['Salsa',1,'glass']],instructions:'Stek kjøttdeig og løk. Tilsett krydder og server med tilbehør.',url:''},
{name:'Laks med poteter',days:[1,3],categories:['Fisk','Lett middag'],servings:4,ingredients:[['Laks',600,'g'],['Poteter',1,'kg'],['Sitron',1,'stk'],['Rømme',2,'dl']],instructions:'Stek eller bak laksen. Kok poteter og server med sitron og rømme.',url:''},
{name:'Kyllinggryte',days:[0,2,5],categories:['Kylling','Gryte'],servings:4,ingredients:[['Kylling',600,'g'],['Løk',1,'stk'],['Paprika',1,'stk'],['Kokosmelk',1,'boks'],['Ris',300,'g']],instructions:'Stek kylling og grønnsaker. Tilsett kokosmelk og la gryten småkoke. Server med ris.',url:''},
{name:'Hjemmelaget pizza',days:[4,5],categories:['Pizza','Kjøtt'],servings:4,ingredients:[['Pizzabunn',1,'stk'],['Pizzasaus',1,'glass'],['Ost',300,'g'],['Skinke',200,'g']],instructions:'Fordel saus og topping på bunnen. Stek til osten er gyllen.',url:''},
{name:'Fiskekaker med poteter',days:[1,3],categories:['Fisk'],servings:4,ingredients:[['Fiskekaker',8,'stk'],['Poteter',1,'kg'],['Gulrøtter',4,'stk'],['Smør',50,'g']],instructions:'Kok poteter og gulrøtter. Stek fiskekakene og server med smør.',url:''}
];
const starterPantry=['Mel','Sukker','Salt','Pepper','Olje','Smør','Kaffe','Ris','Pasta','Havregryn','Ketchup','Oppvaskmiddel','Toalettpapir'].map(name=>({name,low:false}));
let data=load(); let page='week';
function load(){
 try{
  let x=JSON.parse(localStorage.getItem(KEY));
  if(x){
   x.week=Array.isArray(x.week)?x.week:Array(7).fill(null);
   x.recipes=Array.isArray(x.recipes)?x.recipes:[];
   x.pantry=Array.isArray(x.pantry)?x.pantry:starterPantry;
   x.shopping=Array.isArray(x.shopping)?x.shopping:[];
   x.weekHistory=Array.isArray(x.weekHistory)?x.weekHistory:[];
   x.recipes=x.recipes.map(r=>({...r,days:Array.isArray(r.days)?r.days:[],categories:Array.isArray(r.categories)?r.categories:[]}));
   x.pendingDeletes=x.pendingDeletes||{recipes:[],pantry:[]};
   return x;
  }
 }catch(e){}
 return{week:Array(7).fill(null),recipes:starterRecipes,pantry:starterPantry,shopping:[],weekHistory:[],pendingDeletes:{recipes:[],pantry:[]}}
}
function save(){localStorage.setItem(KEY,JSON.stringify(data))}
function saveAndSync(){save();queueCloudSync()}
async function openAccount(){
 if(!cloud){return alert('Skyfunksjonene er ikke tilgjengelige akkurat nå.');}
 if(authSession){
   const {data:member}=await cloud.from('family_members').select('family_id').eq('user_id',authSession.user.id).maybeSingle();
   const fid=member?.family_id||familyId;
   if(fid) await showFamilyModal(fid); else showFamilySetup();
 } else showAuthModal('login');
}
function showAuthModal(mode='login'){
 closeModal();
 const signup=mode==='signup';
 modal(`<h2>☁️ Familiemat i skyen</h2><p class="small">Logg inn for å dele oppskrifter, ukeplan, basisvarer og handleliste med familien.</p><form id="authForm" onsubmit="event.preventDefault(); ${signup?'signUp()':'signIn()'}"><div class="field"><label for="authEmail">E-post</label><input id="authEmail" type="email" name="email" autocomplete="email" inputmode="email" autocapitalize="none" spellcheck="false" placeholder="navn@epost.no" required></div><div class="field"><label for="authPass">Passord</label><input id="authPass" type="password" name="password" autocomplete="${signup?'new-password':'current-password'}" minlength="6" placeholder="Minst 6 tegn" required></div><button id="authSubmit" type="submit" class="btn full">${signup?'Opprett konto':'Logg inn'}</button></form><button class="btn full secondary" onclick="showAuthModal('${signup?'login':'signup'}')">${signup?'Jeg har allerede konto':'Opprett ny konto'}</button>`);
}
function authValues(){const form=document.getElementById('authForm');const email=(form?.elements?.email?.value||'').trim();const password=form?.elements?.password?.value||'';return {email,password};}
async function signUp(){const {email,password}=authValues();if(!email)return alert('Skriv inn e-postadressen din.');if(password.length<6){document.getElementById('authPass')?.focus();return alert(`Passordet må være minst 6 tegn. Det som er skrevet inn er ${password.length} tegn.`);}const button=document.getElementById('authSubmit');if(button){button.disabled=true;button.textContent='Oppretter konto…';}try{const {data,error}=await cloud.auth.signUp({email,password});if(error)return alert(error.message);if(data.session){authSession=data.session;closeModal();showFamilySetup();}else alert('Kontoen er opprettet. Sjekk e-posten din og bekreft kontoen før du logger inn.');}finally{if(button){button.disabled=false;button.textContent='Opprett konto';}}}
async function signIn(){const {email,password}=authValues();if(!email||!password)return alert('Fyll inn e-post og passord.');const button=document.getElementById('authSubmit');if(button){button.disabled=true;button.textContent='Logger inn…';}try{const {data,error}=await cloud.auth.signInWithPassword({email,password});if(error)return alert(error.message);authSession=data.session;closeModal();await afterSignedIn();}finally{if(button){button.disabled=false;button.textContent='Logg inn';}}}
async function signOut(){await cloud.auth.signOut();authSession=null;familyId='';localStorage.removeItem(FAMILY_KEY);if(realtimeChannel){cloud.removeChannel(realtimeChannel);realtimeChannel=null;}render();}
function showFamilySetup(){modal(`<h2>👨‍👩‍👧 Koble familien</h2><p class="small">Opprett en ny familie på denne telefonen, eller bli med i en familie som allerede er opprettet.</p><button class="btn full" onclick="createFamily()">＋ Opprett familie</button><button class="btn full secondary" onclick="joinFamilyPrompt()">🔑 Bli med med familiekode</button>`)}
function joinFamilyPrompt(){modal(`<h2>🔑 Bli med i familien</h2><p class="small">Skriv inn familiekoden du får fra den andre telefonen.</p><div class="field"><label>Familiekode</label><input id="joinCode" autocapitalize="characters" placeholder="F.eks. A1B2C3D4"></div><button class="btn full" onclick="joinFamily()">Bli med</button>`)}
async function createFamily(){const {data,error}=await cloud.rpc('create_family',{p_name:'Familiemat'});if(error)return alert(error.message);familyId=data?.[0]?.family_id;if(!familyId)return alert('Kunne ikke opprette familien.');localStorage.setItem(FAMILY_KEY,familyId);await migrateLocalToCloud();closeModal();await subscribeRealtime();await refreshRemote();alert(`Familien er opprettet. Familiekoden er ${data[0].join_code}. Del denne koden med samboeren din.`);render();}
async function joinFamily(){const code=document.getElementById('joinCode')?.value.trim();if(!code)return alert('Skriv inn familiekoden.');const {data,error}=await cloud.rpc('join_family',{p_join_code:code});if(error)return alert(error.message);familyId=data;localStorage.setItem(FAMILY_KEY,familyId);closeModal();await subscribeRealtime();await refreshRemote();alert('Du er nå koblet til familien.');render();}
async function showFamilyModal(fid){const {data:family}=await cloud.from('families').select('name,join_code').eq('id',fid).maybeSingle();const code=family?.join_code||'—';modal(`<h2>☁️ ${esc(family?.name||'Familiemat')}</h2><p class="small">Familiekode: <strong>${esc(code)}</strong></p><p class="small">Endringer synkroniseres mellom telefonene når dere er på nett.</p><button class="btn full secondary" onclick="syncLocalChanges().then(()=>{closeModal();render()})">🔄 Synkroniser nå</button><button class="btn full secondary" onclick="signOut().then(()=>closeModal())">Logg ut</button>`)}
function currentWeekKey(){const d=new Date();const date=new Date(Date.UTC(d.getFullYear(),d.getMonth(),d.getDate()));const day=date.getUTCDay()||7;date.setUTCDate(date.getUTCDate()+4-day);const year=date.getUTCFullYear();const yearStart=new Date(Date.UTC(year,0,1));const week=Math.ceil((((date-yearStart)/86400000)+1)/7);return `${year}-W${String(week).padStart(2,'0')}`;}
async function migrateLocalToCloud(){if(!familyId||!authSession||cloudBusy)return;cloudBusy=true;try{
 const recipeRows=data.recipes.map(r=>({family_id:familyId,name:r.name,servings:r.servings,ingredients:r.ingredients,instructions:r.instructions,url:r.url||'',days:r.days||[],categories:r.categories||[]}));
 const ins=await cloud.from('recipes').insert(recipeRows).select();if(ins.error)throw ins.error;
 data.recipes=ins.data.map((r,i)=>({...recipeRows[i],id:r.id,created_at:r.created_at,updated_at:r.updated_at}));
 const pantryRows=data.pantry.map(p=>({family_id:familyId,name:p.name,low:!!p.low}));
 if(pantryRows.length){const pi=await cloud.from('pantry').insert(pantryRows).select();if(pi.error)throw pi.error;data.pantry=pi.data.map((p,i)=>({...pantryRows[i],id:p.id}));}
 await cloud.from('week_plans').upsert({family_id:familyId,week_key:currentWeekKey(),days:{meals:data.week,shopping:data.shopping}},{onConflict:'family_id,week_key'});
 save();
 }catch(e){console.error(e);alert('Kunne ikke flytte de lokale dataene til skyen: '+(e.message||e));}finally{cloudBusy=false;}}
async function refreshRemote(){if(!familyId||!authSession||cloudBusy)return;cloudBusy=true;try{
 const [rr,pp,ww]=await Promise.all([cloud.from('recipes').select('*').eq('family_id',familyId),cloud.from('pantry').select('*').eq('family_id',familyId),cloud.from('week_plans').select('*').eq('family_id',familyId).eq('week_key',currentWeekKey()).maybeSingle()]);
 if(rr.error)throw rr.error;if(pp.error)throw pp.error;if(ww.error&&ww.error.code!=='PGRST116')throw ww.error;
 const pending=data.pendingDeletes||{recipes:[],pantry:[]};
 const localById=new Map(data.recipes.filter(r=>r.id).map(r=>[r.id,r]));
 for(const r of (rr.data||[])){if(pending.recipes.includes(r.id))continue;localById.set(r.id,{id:r.id,name:r.name,servings:r.servings,ingredients:r.ingredients||[],instructions:r.instructions||'',url:r.url||'',days:r.days||[],categories:r.categories||[]});}
 const localsWithoutId=data.recipes.filter(r=>!r.id);
 data.recipes=[...localById.values(),...localsWithoutId];
 const pantryById=new Map(data.pantry.filter(p=>p.id).map(p=>[p.id,p]));
 for(const p of (pp.data||[])){if(pending.pantry.includes(p.id))continue;pantryById.set(p.id,{id:p.id,name:p.name,low:!!p.low});}
 const pantryWithoutId=data.pantry.filter(p=>!p.id);
 data.pantry=[...pantryById.values(),...pantryWithoutId];
 const plan=ww.data?.days;if(Array.isArray(plan)){data.week=plan.length===7?plan:Array(7).fill(null);data.shopping=[];}else if(plan){data.week=Array.isArray(plan.meals)?plan.meals:data.week;data.shopping=Array.isArray(plan.shopping)?plan.shopping:data.shopping;}
 syncShopping();save();cloudReady=true;
 }catch(e){console.error(e);alert('Kunne ikke hente Familiemat-data fra skyen: '+(e.message||e));}finally{cloudBusy=false;}}

async function pushWeek(){if(!familyId||!authSession||cloudBusy)return;const res=await cloud.from('week_plans').upsert({family_id:familyId,week_key:currentWeekKey(),days:{meals:data.week,shopping:data.shopping}},{onConflict:'family_id,week_key'});if(res.error)console.error(res.error);}
let syncTimer=null;function queueCloudSync(){if(!familyId||!authSession)return;clearTimeout(syncTimer);syncTimer=setTimeout(()=>syncLocalChanges(),250);}
async function syncLocalChanges(){if(!familyId||!authSession||cloudBusy)return;cloudBusy=true;try{
 const pending=data.pendingDeletes||{recipes:[],pantry:[]};
 // First remove items explicitly deleted on this device. We never infer deletions from a missing local item.
 for(const id of pending.recipes){const res=await cloud.from('recipes').delete().eq('id',id).eq('family_id',familyId);if(res.error)throw res.error;}
 for(const id of pending.pantry){const res=await cloud.from('pantry').delete().eq('id',id).eq('family_id',familyId);if(res.error)throw res.error;}
 pending.recipes=[];pending.pantry=[];data.pendingDeletes=pending;
 // Push local recipes, including brand-new recipes. Never delete remote recipes merely because they are absent locally.
 const newRecipeRows=data.recipes.map(r=>({...(r.id?{id:r.id}:{}),family_id:familyId,name:r.name,servings:r.servings,ingredients:r.ingredients,instructions:r.instructions,url:r.url||'',days:r.days||[],categories:r.categories||[]}));
 if(newRecipeRows.length){const up=await cloud.from('recipes').upsert(newRecipeRows).select();if(up.error)throw up.error;data.recipes=up.data.map(r=>({...r,ingredients:r.ingredients||[],days:r.days||[],categories:r.categories||[]}));}
 const prows=data.pantry.map(p=>({...(p.id?{id:p.id}:{}),family_id:familyId,name:p.name,low:!!p.low}));
 if(prows.length){const pu=await cloud.from('pantry').upsert(prows).select();if(pu.error)throw pu.error;data.pantry=pu.data.map(p=>({...p}));}
 await pushWeek();
 // Pull remote additions/changes after pushing local changes, merging instead of replacing local data.
 const [rr,pp]=await Promise.all([cloud.from('recipes').select('*').eq('family_id',familyId),cloud.from('pantry').select('*').eq('family_id',familyId)]);
 if(rr.error)throw rr.error;if(pp.error)throw pp.error;
 const recipeMap=new Map(data.recipes.map(r=>[r.id,r]));for(const r of (rr.data||[])){recipeMap.set(r.id,{id:r.id,name:r.name,servings:r.servings,ingredients:r.ingredients||[],instructions:r.instructions||'',url:r.url||'',days:r.days||[],categories:r.categories||[]});}data.recipes=[...recipeMap.values()];
 const pantryMap=new Map(data.pantry.map(p=>[p.id,p]));for(const p of (pp.data||[])){pantryMap.set(p.id,{id:p.id,name:p.name,low:!!p.low});}data.pantry=[...pantryMap.values()];
 syncShopping();save();
 }catch(e){console.error(e);alert('Synkronisering feilet: '+(e.message||e));}finally{cloudBusy=false;}}

async function subscribeRealtime(){if(!familyId||!authSession)return;if(realtimeChannel)await cloud.removeChannel(realtimeChannel);realtimeChannel=cloud.channel('familiemat-'+familyId).on('postgres_changes',{event:'*',schema:'public',table:'recipes',filter:`family_id=eq.${familyId}`},async()=>{await refreshRemote();render();}).on('postgres_changes',{event:'*',schema:'public',table:'pantry',filter:`family_id=eq.${familyId}`},async()=>{await refreshRemote();render();}).on('postgres_changes',{event:'*',schema:'public',table:'week_plans',filter:`family_id=eq.${familyId}`},async()=>{await refreshRemote();render();}).subscribe();}
async function afterSignedIn(){const {data:m}=await cloud.from('family_members').select('family_id').eq('user_id',authSession.user.id).maybeSingle();if(m?.family_id){familyId=m.family_id;localStorage.setItem(FAMILY_KEY,familyId);await subscribeRealtime();await refreshRemote();render();}else{showFamilySetup();render();}}

const categoryOrder=['Frukt og grønt','Kjøtt og fisk','Meieri og egg','Brød og bakervarer','Tørrvarer','Hermetikk og sauser','Frysevarer','Drikke','Husholdning','Annet'];
function sortShopping(){data.shopping=(data.shopping||[]).map(x=>({...x,category:categorizeIngredient(x.name)})).sort((a,b)=>{const ca=categoryOrder.indexOf(a.category),cb=categoryOrder.indexOf(b.category);return (ca-cb)||String(a.name).localeCompare(String(b.name),'nb',{sensitivity:'base'})});}
sortShopping();
syncShopping();
function esc(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]))}
function render(){document.getElementById('app').innerHTML=`<div class="app"><header class="top"><div><div class="brand">🍲 Familiemat</div><div class="subtitle">Middag, basisvarer og handleliste samlet.</div></div><button class="account-btn" onclick="openAccount()">${authSession?'☁️ Familie':'☁️ Logg inn'}</button></header><main class="content">${page==='week'?weekView():page==='recipes'?recipesView():page==='shopping'?shoppingView():pantryView()}</main><nav class="nav"><div class="navinner">${nav('week','🏠','Uke')}${nav('recipes','🍝','Oppskrifter')}${nav('shopping','🛒','Handleliste')}${nav('pantry','🧺','Basisvarer')}</div></nav></div>`}
function nav(p,i,t){return `<button class="${page===p?'active':''}" onclick="go('${p}')"><span class="ico">${i}</span>${t}</button>`}
function go(p){page=p;render();window.scrollTo(0,0)}
function weekView(){return `<div class="section-title"><span>Denne uka</span><button class="btn secondary" style="margin-left:auto" onclick="newWeek()">✨ Ny uke</button></div><div class="actions" style="margin-bottom:12px"><button class="btn full" onclick="suggestWeek()">✨ Foreslå ukemeny</button></div>${data.week.map((r,i)=>`<div class="card day"><div class="dayname">${days[i]}</div>${r?`<div class="meal"><strong>${esc(r)}</strong><small>${esc(data.recipes.find(x=>x.name===r)?.servings||4)} porsjoner</small></div><div class="actions"><button class="btn secondary" onclick="choose(${i})">Bytt</button><button class="btn ghost" onclick="removeFromWeek(${i})">Fjern</button></div>`:`<div class="meal"><strong>Ingen middag valgt</strong><small>Hva skal dere spise?</small></div><button class="btn" onclick="choose(${i})">Velg</button>`}</div>`).join('')}<div class="card"><strong>Tips</strong><p class="small">Handlelisten slår sammen like ingredienser fra alle middagene. Basisvarer du markerer som «går tom» blir også lagt til.</p></div>`}

async function archiveCurrentWeek(){
 const meals=[...data.week];
 if(!meals.some(Boolean))return;
 const key=currentWeekKey();
 const archivedAt=new Date().toISOString();
 if(!Array.isArray(data.weekHistory))data.weekHistory=[];
 const localKey=`${key}-${archivedAt}`;
 data.weekHistory.unshift({weekKey:key,archivedAt,meals});
 data.weekHistory=data.weekHistory.slice(0,24);
 if(familyId&&authSession&&!cloudBusy){
   const archiveKey=`${key}__archive__${Date.now()}`;
   const res=await cloud.from('week_plans').insert({family_id:familyId,week_key:archiveKey,days:{meals,archivedWeek:key,archivedAt}});
   if(res.error)console.error('Kunne ikke arkivere uke i skyen:',res.error);
 }
}
async function newWeek(){
 if(!data.week.some(Boolean))return;
 if(confirm('Starte en ny uke? Den nåværende ukeplanen arkiveres automatisk, slik at Familiemat kan bruke historikken til å lage mer varierte menyer. Oppskrifter og basisvarer beholdes.')){
   await archiveCurrentWeek();
   data.week=Array(7).fill(null);
   syncShopping();
   saveAndSync();
   render();
 }
}
function shuffle(a){return [...a].sort(()=>Math.random()-0.5)}
function eligibleRecipes(day){return data.recipes.filter(r=>{const ds=Array.isArray(r.days)?r.days:[];return !ds.length||ds.includes(day)})}
async function recentMealNames(){
 const names=new Set();
 const cutoff=Date.now()-28*86400000;
 for(const h of (data.weekHistory||[])){
   const t=Date.parse(h.archivedAt||'');
   if(!t||t>=cutoff) for(const n of (h.meals||[]))if(n)names.add(n);
 }
 if(familyId&&authSession&&cloud){
   try{
     const res=await cloud.from('week_plans').select('week_key,days,updated_at').eq('family_id',familyId).order('updated_at',{ascending:false}).limit(30);
     if(!res.error){
       for(const row of (res.data||[])){
         if(row.week_key===currentWeekKey())continue;
         const meals=Array.isArray(row.days)?row.days:(row.days?.meals||[]);
         for(const n of meals)if(n)names.add(n);
       }
     }
   }catch(e){console.warn('Historikk kunne ikke hentes',e)}
 }
 return names;
}
async function suggestWeek(){
 const recipes=data.recipes.filter(r=>r&&r.name);
 const fish=recipes.filter(r=>(r.categories||[]).includes('Fisk'));
 if(fish.length<2)return alert('For å foreslå en uke med to ulike fiskemiddager trenger du minst to oppskrifter som er kategorisert som «Fisk».');
 const fishSlots=[];
 for(let d=0;d<7;d++) if(eligibleRecipes(d).some(r=>fish.includes(r))) fishSlots.push(d);
 if(fishSlots.length<2)return alert('Jeg finner ikke to ulike dager der fiskerettene dine er aktuelle. Sjekk «Aktuelle dager» på fiskemiddagene.');
 const recent=await recentMealNames();
 const freshScore=r=>recent.has(r.name)?1:0;
 let best=null;
 for(let tries=0;tries<300&&!best;tries++){
   const daysForFish=shuffle(fishSlots).slice(0,2);
   const plan=Array(7).fill(null); const used=new Set(); let ok=true;
   for(const d of daysForFish){
     const choices=shuffle(eligibleRecipes(d).filter(r=>fish.includes(r)&&!used.has(r))).sort((a,b)=>freshScore(a)-freshScore(b));
     if(!choices.length){ok=false;break;} const r=choices[0]; plan[d]=r; used.add(r);
   }
   if(!ok)continue;
   for(let d=0;d<7;d++){
     if(plan[d])continue;
     const choices=shuffle(eligibleRecipes(d).filter(r=>!used.has(r))).sort((a,b)=>freshScore(a)-freshScore(b));
     if(choices.length){plan[d]=choices[0];used.add(choices[0]);}
   }
   if(plan.every(Boolean))best=plan;
 }
 if(!best){
   const plan=Array(7).fill(null); const used=new Set();
   const fishDayChoices=shuffle(fishSlots); const chosenFish=[];
   for(const d of fishDayChoices){
     const choices=shuffle(eligibleRecipes(d).filter(r=>fish.includes(r)&&!chosenFish.includes(r))).sort((a,b)=>freshScore(a)-freshScore(b));
     if(choices.length){plan[d]=choices[0];chosenFish.push(choices[0]);used.add(choices[0]);if(chosenFish.length===2)break;}
   }
   if(chosenFish.length<2)return alert('Jeg klarte ikke å finne to ulike fiskemiddager som passer på ulike dager.');
   for(let d=0;d<7;d++) if(!plan[d]){
     const choices=shuffle(eligibleRecipes(d).filter(r=>!used.has(r))).sort((a,b)=>freshScore(a)-freshScore(b));
     plan[d]=choices[0]||shuffle(eligibleRecipes(d))[0]||null;
     if(plan[d])used.add(plan[d]);
   }
   best=plan;
 }
 data.week=best.map(r=>r?r.name:null);syncShopping();saveAndSync();render();
}
function recipeSort(a,b){return String(a.name).localeCompare(String(b.name),'nb',{sensitivity:'base'})}
function recipeBadges(r){const cats=(r.categories||[]).map(c=>`<span class="pill">${esc(c)}</span>`).join('');const ds=(r.days||[]).sort((a,b)=>a-b).map(i=>days[i]).join(', ');return `${cats}${ds?`<span class="pill">📅 ${esc(ds)}</span>`:'<span class="pill">📅 Alle dager</span>'}`}
function recipesView(){const recipes=[...data.recipes].sort(recipeSort);return `<div class="section-title">Oppskrifter</div><button class="btn full" onclick="newRecipe()">＋ Ny oppskrift</button><button class="btn full secondary" onclick="webRecipe()">🌐 Oppskrift fra nett</button>${recipes.map(r=>{const i=data.recipes.indexOf(r);return `<div class="card"><div class="recipe-head"><div><div class="recipe-title">${esc(r.name)}</div><div class="small">${r.servings} porsjoner</div><div class="pills">${recipeBadges(r)}</div></div>${r.url?`<a class="pill" href="${esc(r.url)}" target="_blank">Nettlenke</a>`:''}</div><ul class="ingredients">${r.ingredients.map(x=>`<li>${esc(x[1])} ${esc(x[2])} ${esc(x[0])}</li>`).join('')}</ul><div class="actions"><button class="btn" onclick="addRecipeToWeek(${i})">＋ Legg til i uka</button><button class="btn secondary" onclick="editRecipe(${i})">Rediger</button><button class="btn ghost" onclick="deleteRecipe(${i})">Slett</button></div></div>`}).join('')}`}
function shoppingView(){sortShopping();save();const items=data.shopping;let bought=items.filter(x=>x.done).length;const groups={};items.forEach((x,i)=>{const cat=x.category||categorizeIngredient(x.name);if(!groups[cat])groups[cat]=[];groups[cat].push({...x,index:i})});const ordered=Object.keys(groups).sort((a,b)=>categoryOrder.indexOf(a)-categoryOrder.indexOf(b));return `<div class=\"section-title\">Handleliste</div><div class=\"card\"><strong>${bought} av ${items.length} varer kjøpt</strong><div class=\"progress\" style=\"margin-top:10px\"><div style=\"width:${items.length?bought/items.length*100:0}%\"></div></div><p class=\"small\" style=\"margin-bottom:0\">Sortert etter butikkategori og alfabetisk.</p></div>${items.length?ordered.map(cat=>`<div class=\"shop-category\"><h3>${esc(cat)}</h3><div class=\"list\">${groups[cat].map(x=>`<label class=\"row ${x.done?'done':''}\"><input type=\"checkbox\" ${x.done?'checked':''} onchange=\"toggleShop(${x.index})\"><span>${esc(x.name)}</span><span class=\"qty\">${esc(formatQty(x.qty))} ${esc(x.unit)}</span></label>`).join('')}</div></div>`).join('')+`<button class=\"btn full secondary\" onclick=\"clearBought()\">Fjern kjøpte varer</button>`:`<div class=\"empty\">Handlelisten er tom.<br>Legg til middager eller marker basisvarer som «går tom».</div>`}`}
function categorizeIngredient(name){const n=String(name||'').trim().toLowerCase();const exact={'poteter':'Frukt og grønt','gulrøtter':'Frukt og grønt','gulrot':'Frukt og grønt','løk':'Frukt og grønt','paprika':'Frukt og grønt','sitron':'Frukt og grønt','tomat':'Frukt og grønt','agurk':'Frukt og grønt','salat':'Frukt og grønt','brokkoli':'Frukt og grønt','blomkål':'Frukt og grønt','eple':'Frukt og grønt','banan':'Frukt og grønt','avokado':'Frukt og grønt','hvitløk':'Frukt og grønt','ingefær':'Frukt og grønt','laks':'Kjøtt og fisk','fiskekaker':'Kjøtt og fisk','fiskekake':'Kjøtt og fisk','torsk':'Kjøtt og fisk','kjøttdeig':'Kjøtt og fisk','kylling':'Kjøtt og fisk','skinke':'Kjøtt og fisk','bacon':'Kjøtt og fisk','pølse':'Kjøtt og fisk','karbonade':'Kjøtt og fisk','rømme':'Meieri og egg','ost':'Meieri og egg','smør':'Meieri og egg','melk':'Meieri og egg','yoghurt':'Meieri og egg','fløte':'Meieri og egg','egg':'Meieri og egg','kremost':'Meieri og egg','parmesan':'Meieri og egg','mozzarella':'Meieri og egg','feta':'Meieri og egg','spaghetti':'Tørrvarer','pasta':'Tørrvarer','ris':'Tørrvarer','havregryn':'Tørrvarer','mel':'Tørrvarer','sukker':'Tørrvarer','salt':'Tørrvarer','pepper':'Tørrvarer','olje':'Tørrvarer','kaffe':'Tørrvarer','te':'Tørrvarer','tacokrydder':'Tørrvarer','krydder':'Tørrvarer','tortilla':'Tørrvarer','melis':'Tørrvarer','bakepulver':'Tørrvarer','hakkede tomater':'Hermetikk og sauser','kokosmelk':'Hermetikk og sauser','mais':'Hermetikk og sauser','salsa':'Hermetikk og sauser','bønner':'Hermetikk og sauser','pizzasaus':'Hermetikk og sauser','brød':'Brød og bakervarer','rundstykker':'Brød og bakervarer','rundstykke':'Brød og bakervarer','knekkebrød':'Brød og bakervarer','baguette':'Brød og bakervarer','pizzabunn':'Brød og bakervarer','iskrem':'Frysevarer','juice':'Drikke','brus':'Drikke','vann':'Drikke','saft':'Drikke','toalettpapir':'Husholdning','oppvaskmiddel':'Husholdning','såpe':'Husholdning','vaskemiddel':'Husholdning','tørkepapir':'Husholdning','servietter':'Husholdning','kjøkkenpapir':'Husholdning','søppelposer':'Husholdning','avfallsposer':'Husholdning','aluminiumsfolie':'Husholdning','plastfolie':'Husholdning','matpapir':'Husholdning','bakepapir':'Husholdning','stålull':'Husholdning','svamp':'Husholdning'};if(exact[n])return exact[n];if(/frossen|fryse|iskrem/.test(n))return 'Frysevarer';if(/toalett|dopapir|oppvask|såpe|vask|tørkepapir|kjøkkenpapir|søppelposer|avfallsposer|aluminiumsfolie|plastfolie|matpapir|bakepapir|stålull|svamp|serviett/.test(n))return 'Husholdning';if(/juice|brus|vann|saft/.test(n))return 'Drikke';if(/kokosmelk|mais|salsa|bønne|hakkede tomater|hermet|glass|boks/.test(n))return 'Hermetikk og sauser';if(/brød|rundstykke|knekkebrød|baguette|pizzabunn/.test(n))return 'Brød og bakervarer';if(/kjøtt|kjøttdeig|kylling|skinke|bacon|pølse|laks|fisk|fiskekake|torsk|karbonade/.test(n))return 'Kjøtt og fisk';if(/melk|rømme|ost|smør|yoghurt|fløte|egg|kremost|parmesan|mozzarella|feta/.test(n))return 'Meieri og egg';if(/spaghetti|pasta|ris|havre|mel|sukker|salt|pepper|olje|kaffe|te|tacokrydder|krydder|tortilla|melis|bakepulver/.test(n))return 'Tørrvarer';if(/potet|løk|paprika|gulrot|sitron|tomat|agurk|salat|brokkoli|blomkål|eple|banan|avokado|hvitløk|ingefær/.test(n))return 'Frukt og grønt';return 'Annet'}
function pantryView(){const items=[...data.pantry].sort((a,b)=>String(a.name).localeCompare(String(b.name),'nb',{sensitivity:'base'}));return `<div class="section-title">Basisvarer</div><p class="small">Marker det dere begynner å gå tom for. Da havner varen automatisk på handlelisten.</p><button class="btn full" onclick="addPantry()">＋ Legg til basisvare</button><div class="list" style="margin-top:10px">${items.map(x=>{const i=data.pantry.indexOf(x);return `<div class="row"><input type="checkbox" ${x.low?'checked':''} onchange="togglePantry(${i})"><span>${esc(x.name)}</span><span class="qty">${x.low?'Går tom':'Har hjemme'}</span><button class="btn danger smallbtn" onclick="deletePantry(${i})" aria-label="Slett ${esc(x.name)}">×</button></div>`}).join('')}</div>`}
function choose(day){modal(`<h2>Velg middag – ${days[day]}</h2><p class="small">Trykk på en oppskrift for å legge den direkte inn på ${days[day].toLowerCase()}.</p><div class="list">${[...data.recipes].sort(recipeSort).map(r=>{const i=data.recipes.indexOf(r);return `<button type="button" class="row recipe-choice" onclick="setDay(${day},${i})"><span>🍽️</span><span style="flex:1;text-align:left"><strong>${esc(r.name)}</strong><small style="display:block;color:var(--muted)">${esc(r.servings)} porsjoner</small></span><span>›</span></button>`}).join('')}</div><button type="button" class="btn full secondary" onclick="newRecipeForDay(${day})">＋ Lag ny oppskrift</button>`)}
function setDay(d,recipeIndex){const r=data.recipes[recipeIndex];if(!r)return;data.week[d]=r.name;syncShopping();saveAndSync();closeModal();render()}
function removeFromWeek(day){if(day<0||day>=data.week.length||!data.week[day])return;data.week[day]=null;syncShopping();saveAndSync();render()}
function addRecipeToWeek(recipeIndex){const r=data.recipes[recipeIndex];if(!r)return;modal(`<h2>Legg «${esc(r.name)}» til i uka</h2><p class="small">Velg hvilken dag middagen skal være.</p><div class="list">${days.map((d,i)=>`<button type="button" class="row" style="text-align:left" onclick="setDay(${i},${recipeIndex})"><span>📅</span><strong>${d}</strong>${data.week[i]===r.name?'<span class="qty">Valgt</span>':''}</button>`).join('')}</div>`)}
function newRecipeForDay(day){closeModal();recipeForm(-1,day)}
function syncShopping(){const old=new Map((data.shopping||[]).map(x=>[x.name.trim().toLowerCase(),x]));const map=new Map();for(const name of data.week.filter(Boolean)){const r=data.recipes.find(x=>x.name===name);if(!r)continue;for(const [ing,q,u] of r.ingredients){const k=ing.trim().toLowerCase();if(!map.has(k))map.set(k,{name:ing,qty:0,unit:u,category:categorizeIngredient(ing),done:old.get(k)?.done||false});const x=map.get(k);x.category=categorizeIngredient(x.name);if(x.unit===u&&typeof q==='number')x.qty+=q;else if(x.qty===0){x.qty=q;x.unit=u}}}for(const p of data.pantry.filter(x=>x.low)){const k=p.name.trim().toLowerCase();if(!map.has(k))map.set(k,{name:p.name,qty:1,unit:'stk',category:categorizeIngredient(p.name),done:old.get(k)?.done||false})}data.shopping=[...map.values()].sort((a,b)=>{const ca=categoryOrder.indexOf(a.category),cb=categoryOrder.indexOf(b.category);return (ca-cb)||String(a.name).localeCompare(String(b.name),'nb',{sensitivity:'base'})});save()}
function buildShopping(){syncShopping();page='shopping';render()}
function formatQty(q){return Number.isInteger(q)?q:String(Math.round(q*100)/100)}
function toggleShop(i){data.shopping[i].done=!data.shopping[i].done;const item=data.shopping[i];const pantry=data.pantry.find(p=>p.name.trim().toLowerCase()===item.name.trim().toLowerCase());if(pantry&&item.done)pantry.low=false;saveAndSync();render()}
function clearBought(){data.shopping=data.shopping.filter(x=>!x.done);saveAndSync();render()}
function togglePantry(i){data.pantry[i].low=!data.pantry[i].low;syncShopping();saveAndSync();render()}
function addPantry(){modal(`<h2>Ny basisvare</h2><div class="field"><label>Navn</label><input id="pname" placeholder="F.eks. melk"></div><button class="btn full" onclick="savePantry()">Legg til</button>`)}
function savePantry(){let n=document.getElementById('pname').value.trim();if(!n)return;data.pantry.push({name:n,low:false});saveAndSync();closeModal();render()}
async function deletePantry(i){const item=data.pantry[i];if(!item)return;if(confirm(`Vil du slette ${item.name} fra basisvarene?`)){if(item.id){data.pendingDeletes=data.pendingDeletes||{recipes:[],pantry:[]};data.pendingDeletes.pantry.push(item.id);}data.pantry.splice(i,1);syncShopping();saveAndSync();render()}}
function recipeForm(i=-1,day=null,prefill=null){
 const r=prefill||(i>=0?data.recipes[i]:{name:'',servings:4,ingredients:[['',1,'stk']],instructions:'',url:'',days:[],categories:[]});
 const selectedDays=new Set(r.days||[]), selectedCats=new Set(r.categories||[]);
 modal(`<h2>${i>=0?'Rediger oppskrift':(prefill?'Importer oppskrift':'Ny oppskrift')}</h2>${prefill?'<p class="small">Vi har hentet innholdet fra nettsiden. Gå gjennom alt før du lagrer.</p>':''}
 <div class="field"><label>Navn</label><input id="rname" value="${esc(r.name)}"></div>
 <div class="field"><label>Porsjoner</label><input id="rserv" type="number" value="${r.servings}"></div>
 <div class="field"><label>Aktuelle dager</label><p class="small">Ingen avkrysning = retten kan foreslås alle dager.</p><div class="checkgrid">${days.map((d,j)=>`<label class="checkitem"><input type="checkbox" class="rday" value="${j}" ${selectedDays.has(j)?'checked':''}>${d}</label>`).join('')}</div></div>
 <div class="field"><label>Kategorier</label><p class="small">Velg én eller flere. Dette brukes senere når Familiemat skal lage balanserte ukemenyer.</p><div class="checkgrid">${recipeCategories.map(c=>`<label class="checkitem"><input type="checkbox" class="rcat" value="${esc(c)}" ${selectedCats.has(c)?'checked':''}>${esc(c)}</label>`).join('')}</div></div>
 <div class="field"><label>Ingredienser</label><div id="ings">${r.ingredients.map((x,j)=>ingRow(x,j)).join('')}</div><button class="btn secondary" onclick="addIng()">＋ Ingrediens</button></div>
 <div class="field"><label>Fremgangsmåte</label><textarea id="rinst" rows="5">${esc(r.instructions)}</textarea></div>
 <div class="field"><label>Lenke (valgfritt)</label><input id="rurl" type="url" value="${esc(r.url)}" placeholder="https://..."></div>
 <button class="btn full" onclick="saveRecipe(${i},${day===null?'null':day})">Lagre oppskrift</button>`)}
function ingRow(x,j){return `<div class="ingredient-edit" data-i="${j}"><input class="in" value="${esc(x[0])}" placeholder="Vare"><input class="iq" type="number" step="0.01" value="${x[1]}"><input class="iu" value="${esc(x[2])}" placeholder="enhet"><button class="btn danger" onclick="this.parentElement.remove()">×</button></div>`}
function addIng(){document.getElementById('ings').insertAdjacentHTML('beforeend',ingRow(['',1,'stk'],Date.now()))}
function saveRecipe(i,day=null){
 const ings=[...document.querySelectorAll('#ings .ingredient-edit')].map(el=>[el.querySelector('.in').value.trim(),Number(el.querySelector('.iq').value)||0,el.querySelector('.iu').value.trim()]).filter(x=>x[0]);
 const daysSelected=[...document.querySelectorAll('.rday:checked')].map(x=>Number(x.value));
 const catsSelected=[...document.querySelectorAll('.rcat:checked')].map(x=>x.value);
 const r={name:document.getElementById('rname').value.trim(),servings:Number(document.getElementById('rserv').value)||4,ingredients:ings,instructions:document.getElementById('rinst').value,url:document.getElementById('rurl').value.trim(),days:daysSelected,categories:catsSelected};
 if(!r.name||!ings.length)return alert('Fyll inn navn og minst én ingrediens.');
 if(i<0){data.recipes.push(r);if(day!==null)data.week[day]=r.name}else data.recipes[i]={...data.recipes[i],...r};
 syncShopping();saveAndSync();closeModal();render()
}
function newRecipe(){recipeForm()};function editRecipe(i){recipeForm(i)}
function deleteRecipe(i){const item=data.recipes[i];if(!item)return;if(confirm('Slette oppskriften?')){if(item.id){data.pendingDeletes=data.pendingDeletes||{recipes:[],pantry:[]};data.pendingDeletes.recipes.push(item.id);}data.recipes.splice(i,1);data.week=data.week.map(x=>data.recipes.some(r=>r.name===x)?x:null);syncShopping();saveAndSync();render()}}
function webRecipe(){modal(`<h2>🌐 Oppskrift fra nett</h2><p class="small">Lim inn lenken til en oppskrift. Familiemat prøver å hente navn, porsjoner, ingredienser og fremgangsmåte automatisk. Du får redigere alt før du lagrer.</p><div class="field"><label>Lenke til oppskrift</label><input id="weburl" type="url" inputmode="url" placeholder="https://..."></div><button class="btn full" onclick="importWebRecipe()">Hent oppskrift</button><p class="small">Tips: Oppskrifter som bruker standarden Schema.org/Recipe gir som regel best resultat. cite_placeholder</p>`)}

function parseImportedIngredient(line){let t=String(line||'').replace(/^[-*•]\s*/,'').replace(/\s+/g,' ').trim();if(!t)return null; t=t.replace(/^\d+\.\s*/, '');
 const m=t.match(/^(?:ca\.?\s*)?([0-9]+(?:[,.][0-9]+)?|[½¼¾⅓⅔⅛⅜⅝⅞])\s*(stk\.?|kg|g|mg|l|dl|cl|ml|ss|ts|pk|pose|poser|boks|bokser|glass|beger|pakke|pakker|skive|skiver|fedd|båt|båter|potte|krukke|flaske|liter|kg)?\s*(.*)$/i);
 if(m){let q=m[1].replace(',','.');const fractions={'½':.5,'¼':.25,'¾':.75,'⅓':1/3,'⅔':2/3,'⅛':.125,'⅜':.375,'⅝':.625,'⅞':.875};q=fractions[q]??Number(q);let unit=(m[2]||'stk').replace('.','');let name=m[3].trim().replace(/^av\s+/i,'');if(name)return [name,q,unit];}
 return [t,1,'stk'];}

function parseRecipeMarkdown(text){const lines=String(text||'').split(/\r?\n/);let title='',servings=4,ingredients=[],instructions=[];const heading=(s)=>s.replace(/^#+\s*/,'').trim().toLowerCase();
 for(const line of lines){const h=heading(line);if(!title&&line.trim()&&!/^#/.test(line)&&line.trim().length<120){/* title is normally supplied by Reader JSON */}}
 let start=-1,end=lines.length;for(let i=0;i<lines.length;i++){const h=heading(lines[i]);if(/^(ingredienser|ingredients)$/.test(h)){start=i+1;break;}}if(start>=0){for(let i=start;i<lines.length;i++){const h=heading(lines[i]);if(/^#{1,6}\s*/.test(lines[i])&&i>start){end=i;break;}if(/^(næringsinnhold|nutrition|slik gjør du|fremgangsmåte|instructions)$/.test(h)){end=i;break;}const raw=lines[i].trim();if(!raw||/^porsjoner$/i.test(raw)||/^porsjoner/i.test(raw))continue;if(/^[-*•]/.test(raw))ingredients.push(parseImportedIngredient(raw));}}
 let istart=-1;for(let i=0;i<lines.length;i++){const h=heading(lines[i]);if(/^(slik gjør du|fremgangsmåte|instructions)$/.test(h)){istart=i+1;break;}}if(istart>=0){for(let i=istart;i<lines.length;i++){if(/^#{1,6}\s*/.test(lines[i]))break;const raw=lines[i].trim();if(raw)instructions.push(raw.replace(/^\d+[.)]\s*/,''));}}
 const servingsMatch=String(text).match(/(?:porsjoner|servings?)\s*[:|]?\s*(\d+)/i);if(servingsMatch)servings=Number(servingsMatch[1])||4;return {servings,ingredients:ingredients.filter(Boolean),instructions:instructions.join('\n')};}

async function importWebRecipe(){const input=document.getElementById('weburl');const url=(input?.value||'').trim();if(!/^https?:\/\//i.test(url))return alert('Lim inn en gyldig nettadresse som starter med https:// eller http://.');const btn=document.querySelector('#modal .sheet .btn.full');if(btn){btn.disabled=true;btn.textContent='Henter oppskrift…';}try{const reader='https://r.jina.ai/'+url;const res=await fetch(reader,{headers:{Accept:'application/json'}});if(!res.ok)throw new Error('Reader HTTP '+res.status);const raw=await res.text();let payload;try{payload=JSON.parse(raw)}catch{payload={data:{content:raw}}}const d=payload.data||payload;const content=d.content||raw;const parsed=parseRecipeMarkdown(content);let name=d.title||'';if(!name){const m=content.match(/^#\s+(.+)$/m);name=m?m[1].trim():''}if(!parsed.ingredients.length)throw new Error('Fant ingen ingredienser på siden.');recipeForm(-1,null,{name:name||'Importert oppskrift',servings:parsed.servings||4,ingredients:parsed.ingredients,instructions:parsed.instructions,url});}catch(err){console.error(err);alert('Jeg klarte ikke å hente ingrediensene automatisk fra denne siden. Nettstedet kan blokkere import, eller oppskriften kan bruke en struktur Familiemat ikke kjenner igjen ennå. Du kan fortsatt legge inn oppskriften manuelt.');}finally{if(btn){btn.disabled=false;btn.textContent='Hent oppskrift';}}}
function modal(inner){document.body.insertAdjacentHTML('beforeend',`<div class="modal" id="modal" onclick="if(event.target.id==='modal')closeModal()"><div class="sheet">${inner}<button class="btn full secondary" onclick="closeModal()">Avbryt</button></div></div>`)}
function closeModal(){document.getElementById('modal')?.remove()}
window.go=go;window.newWeek=newWeek;window.suggestWeek=suggestWeek;window.choose=choose;window.setDay=setDay;window.removeFromWeek=removeFromWeek;window.addRecipeToWeek=addRecipeToWeek;window.newRecipeForDay=newRecipeForDay;window.buildShopping=buildShopping;window.toggleShop=toggleShop;window.clearBought=clearBought;window.togglePantry=togglePantry;window.addPantry=addPantry;window.savePantry=savePantry;window.deletePantry=deletePantry;window.newRecipe=newRecipe;window.editRecipe=editRecipe;window.deleteRecipe=deleteRecipe;window.webRecipe=webRecipe;window.importWebRecipe=importWebRecipe;window.recipeForm=recipeForm;window.addIng=addIng;window.saveRecipe=saveRecipe;window.closeModal=closeModal;window.openAccount=openAccount;window.showAuthModal=showAuthModal;window.signUp=signUp;window.signIn=signIn;window.signOut=signOut;window.createFamily=createFamily;window.joinFamilyPrompt=joinFamilyPrompt;window.joinFamily=joinFamily;window.refreshRemote=refreshRemote;
if('serviceWorker' in navigator)navigator.serviceWorker.register('service-worker.js').catch(()=>{});
(async()=>{render();if(cloud){const {data:{session}}=await cloud.auth.getSession();authSession=session;if(session){await afterSignedIn();}render();cloud.auth.onAuthStateChange(async(_e,s)=>{authSession=s;if(s&&!familyId)await afterSignedIn();render();});}})();
