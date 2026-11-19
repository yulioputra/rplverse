import {Store,Settings,exportSave,importSave} from './storage.js';
import {sfx,music,unlock} from './audio.js';
import {LESSONS,QUESTIONS,QUESTS,ACHS,ITEMS,RANKS} from './data.js';
import {World,drawHero} from './world.js';
const app=document.getElementById('app');
let S=null,world=null,hasSave=false,saveT=0;
const COLORS=['#22e5ff','#9b6bff','#3dffa8','#ff4d6d','#ffd24d'],TYPES=['Coder','Hacker','Cyborg'],ACCS=['Polos','Kacamata','Headset','Mahkota'];
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const need=l=>l*100,rank=()=>RANKS[Math.min(RANKS.length-1,Math.floor((S.level-1)/2))];
const fresh=()=>({created:false,name:'',type:0,color:COLORS[0],acc:1,level:1,exp:0,hp:100,maxHp:100,energy:100,coins:50,
  inv:{hp:2,exp:0,en:1},lessons:[],picked:[],flags:{},done:[],ach:[],wins:0,correct:0,login:Date.now()});
function toast(m){const t=document.getElementById('toast');t.textContent=m;t.classList.add('on');clearTimeout(toast.t);toast.t=setTimeout(()=>t.classList.remove('on'),2600)}
function save(now){clearTimeout(saveT);const go=()=>Store.save(S).catch(e=>toast('Gagal menyimpan: '+e.message));now?go():saveT=setTimeout(go,400)}
function stopWorld(){world&&world.stop();world=null}
function screen(html,after){stopWorld();app.innerHTML=html;after&&after()}
function on(sel,fn){app.querySelectorAll(sel).forEach(el=>el.onclick=e=>{unlock();sfx.click();fn(el,e)})}
function confirmBox(msg,yes){const m=document.createElement('div');m.className='modal';
  m.innerHTML=`<div class="panel"><p>${msg}</p><div class="row"><button class="btn bad" id="y">Ya</button><button class="btn alt" id="n">Batal</button></div></div>`;
  document.body.appendChild(m);m.querySelector('#y').onclick=()=>{m.remove();yes()};m.querySelector('#n').onclick=()=>m.remove()}
function addExp(n){S.exp+=n;let up=false;while(S.exp>=need(S.level)){S.exp-=need(S.level);S.level++;S.maxHp+=10;S.hp=S.maxHp;up=true}
  if(up){sfx.level();toast('Naik ke level '+S.level+'! HP penuh.')}checkQuests();checkAch()}
function give(r){addExp(r.exp||0);S.coins+=r.coin||0;if(r.item)S.inv[r.item]=(S.inv[r.item]||0)+1}
function checkQuests(){for(const q of QUESTS)if(!S.done.includes(q.id)&&q.prog(S)>=q.goal){S.done.push(q.id);sfx.ok();toast('Quest selesai: '+q.title);give(q.reward)}save()}
function checkAch(){for(const a of ACHS)if(!S.ach.includes(a.id)&&a.ok(S)){S.ach.push(a.id);toast('Achievement: '+a.t)}save()}
const bars=()=>`<div class="grid g2"><div><span class="tag">HP ${S.hp}/${S.maxHp}</span><div class="bar hp"><i style="width:${S.hp/S.maxHp*100}%"></i></div></div>
<div><span class="tag">EXP ${S.exp}/${need(S.level)}</span><div class="bar xp"><i style="width:${S.exp/need(S.level)*100}%"></i></div></div></div>`;
const back=`<button class="btn alt" data-go="dash">← Dashboard</button>`;
function nav(){on('[data-go]',el=>go[el.dataset.go]())}

/* ---------- Intro & menu ---------- */
function intro(){screen(`<canvas id="introc"></canvas><div class="intro"><button class="btn alt sk" data-go="menu">Lewati intro</button>
<div><h1 class="fade">RPLVERSE</h1><p class="cy fade" style="animation-delay:1.2s;letter-spacing:.3em">DIGITAL KNOWLEDGE UNIVERSE</p>
<p class="mu fade" style="animation-delay:2.6s;max-width:460px;margin:18px auto">Dunia digital mulai retak oleh bug. Hanya developer muda yang bisa memulihkannya. Itu kamu.</p></div></div>`,()=>{
  nav();const c=document.getElementById('introc'),g=c.getContext('2d');c.width=innerWidth;c.height=innerHeight;
  const P=Array.from({length:90},()=>({x:Math.random()*c.width,y:Math.random()*c.height,s:1+Math.random()*3,c:Math.random()<.5?'#22e5ff':'#9b6bff'}));
  const tm=setTimeout(()=>app.querySelector('.sk')&&go.menu(),7000);
  (function f(){if(!document.getElementById('introc')){clearTimeout(tm);return}g.fillStyle='#070a18';g.fillRect(0,0,c.width,c.height);
    for(const p of P){p.y+=p.s;if(p.y>c.height){p.y=0;p.x=Math.random()*c.width}g.fillStyle=p.c;g.fillRect(p.x,p.y,2,p.s*5)}requestAnimationFrame(f)})()})}
const go={intro,
 menu(){localStorage.setItem('rplverse.seen','1');
  screen(`<div class="center"><h1>RPLVERSE</h1><p class="mu">Game edukasi Rekayasa Perangkat Lunak</p></div><div class="menu">
  ${hasSave?'<button class="btn" data-a="cont">Lanjutkan</button>':''}<button class="btn" data-a="new">Game Baru</button>
  <button class="btn alt" data-a="imp">Impor Save</button><button class="btn alt" data-a="set">Pengaturan</button><button class="btn alt" data-a="about">Tentang</button></div>
  <input type="file" id="f" accept="application/json" hidden>`,()=>{
  on('[data-a]',el=>{const a=el.dataset.a;
   if(a==='cont')go.dash();
   if(a==='new')hasSave?confirmBox('Game baru akan menimpa save yang ada. Lanjutkan?',()=>{S=fresh();go.create()}):(S=fresh(),go.create());
   if(a==='imp')document.getElementById('f').click();if(a==='set')go.settings(true);
   if(a==='about')toast('RPLVERSE v0.1 – Cyber Academy. Dibuat dengan HTML, CSS, JS.')});
  document.getElementById('f').onchange=async e=>{try{S={...fresh(),...await importSave(e.target.files[0])};save(true);hasSave=true;toast('Save berhasil diimpor.');go.dash()}catch(x){toast(x.message)}}})},
 create(){const draw=()=>{const c=document.getElementById('pv'),g=c.getContext('2d');g.clearRect(0,0,160,160);drawHero(g,80,95,4,S.color,S.type,S.acc,0)};
  screen(`<div class="panel"><h2>Buat karakter</h2><div class="grid g2"><div class="center"><canvas id="pv" width="160" height="160"></canvas></div><div>
  <label>Nama</label><input type="text" id="nm" maxlength="14" placeholder="Nama developer" value="${esc(S.name)}">
  <p class="mu">Tipe</p><div class="row" id="ty">${TYPES.map((t,i)=>`<button class="btn alt" data-t="${i}">${t}</button>`).join('')}</div>
  <p class="mu">Warna pakaian</p><div class="row">${COLORS.map(c=>`<div class="swatch ${c===S.color?'on':''}" data-c="${c}" style="background:${c}"></div>`).join('')}</div>
  <p class="mu">Aksesori</p><div class="row">${ACCS.map((a,i)=>`<button class="btn alt" data-ac="${i}">${a}</button>`).join('')}</div></div></div>
  <div class="row" style="margin-top:14px"><button class="btn" id="ok">Mulai petualangan</button><button class="btn alt" data-go="menu">Kembali</button></div></div>`,()=>{
  nav();draw();on('[data-t]',e=>{S.type=+e.dataset.t;draw()});on('[data-ac]',e=>{S.acc=+e.dataset.ac;draw()});
  on('[data-c]',e=>{S.color=e.dataset.c;draw();app.querySelectorAll('.swatch').forEach(x=>x.classList.toggle('on',x===e))});
  on('#ok',()=>{const n=document.getElementById('nm').value.trim();if(n.length<2)return toast('Nama minimal 2 karakter.');
    S.name=n;S.created=true;hasSave=true;checkAch();save(true);go.dash()})})},
 dash(){screen(`<div class="panel"><div class="row" style="justify-content:space-between"><div><h2>${esc(S.name)}</h2><span class="tag">Level ${S.level}</span> <span class="tag">${rank()}</span></div>
  <div><span class="tag">🪙 ${S.coins}</span></div></div>${bars()}</div>
  <div class="grid g2" style="margin-top:12px">${[['world','🗺️ Jelajah Cyber Academy'],['learn','📚 Learning Center'],['battle','⚔️ Battle Arena'],['quest','📜 Quest'],['inv','🎒 Inventory & Toko'],['ach','🏆 Achievement'],['settings','⚙️ Pengaturan'],['menu','🏠 Menu utama']].map(([k,t])=>`<button class="btn" data-go="${k}">${t}</button>`).join('')}</div>
  <p class="mu center">Wilayah selanjutnya (Code City dan seterusnya) hadir di tahap pengembangan berikutnya.</p>`,nav);music(true)},
 world(){screen(`<div class="row">${back}<span class="tag">WASD/Panah: gerak · E: interaksi · Shift: lari</span></div>
  <canvas id="world"></canvas><div class="pad"><span></span><button data-d="0,-1">▲</button><span></span><button data-d="-1,0">◀</button><span></span><button data-d="1,0">▶</button><span></span><button data-d="0,1">▼</button><span></span></div>
  <div class="act"><button class="btn" id="e">E</button></div>`,()=>{nav();
  world=new World(document.getElementById('world'),S,{hint:toast,
   coin:id=>{S.picked.push(id);S.coins+=10;sfx.ok();toast('+10 koin data');checkQuests();save()},
   talk:()=>{S.flags.talked=true;checkQuests();dialog('Pak Guru',['Selamat datang di Cyber Academy, '+S.name+'!','Pelajari materi di Learning Center, lalu uji kemampuanmu di Arena melawan Bug Monster.','Koin data tersembunyi ada di sudut-sudut peta. Cari ya!'])},
   arena:()=>go.battle()});
  document.getElementById('e').onclick=()=>world&&world.interact();
  app.querySelectorAll('[data-d]').forEach(b=>{const [x,y]=b.dataset.d.split(',').map(Number),
   s=e=>{e.preventDefault();world&&(world.v={x,y})},u=()=>world&&(world.v={x:0,y:0});
   b.onpointerdown=s;b.onpointerup=u;b.onpointerleave=u;b.onpointercancel=u})})},
 learn(){screen(`${back}<h2>Learning Center</h2><div class="grid g2">${LESSONS.map(l=>`<div class="panel"><h3>${l.title}</h3><p class="mu">${l.goal}</p>
  <span class="tag">${S.lessons.includes(l.id)?'✔ Selesai':'+'+l.exp+' EXP'}</span><p><button class="btn" data-l="${l.id}">Buka materi</button></p></div>`).join('')}</div>`,()=>{nav();on('[data-l]',e=>lesson(e.dataset.l))})},
 quest(){screen(`${back}<h2>Quest Journal</h2><div class="grid">${QUESTS.map(q=>{const p=Math.min(q.goal,q.prog(S)),d=S.done.includes(q.id);
  return`<div class="panel"><span class="tag">${q.type}</span> <span class="tag">${q.lvl}</span> <span class="tag">${d?'Selesai':'Aktif'}</span><h3>${q.title}</h3><p class="mu">${q.desc}</p>
  <div class="bar xp"><i style="width:${p/q.goal*100}%"></i></div><p class="mu">${p}/${q.goal} · Hadiah: ${q.reward.exp} EXP, ${q.reward.coin} koin${q.reward.item?', '+ITEMS[q.reward.item].n:''}</p></div>`}).join('')}</div>`,nav)},
 inv(){screen(`${back}<h2>Inventory & Toko</h2><p>🪙 ${S.coins} koin (hanya untuk dalam game)</p><div class="grid g2">${Object.entries(ITEMS).map(([k,i])=>`<div class="panel"><h3>${i.i} ${i.n}</h3><p class="mu">${i.d}</p>
  <p>Dimiliki: <b>${S.inv[k]||0}</b></p><div class="row"><button class="btn" data-u="${k}">Pakai</button><button class="btn alt" data-b="${k}">Beli ${i.price}🪙</button></div></div>`).join('')}</div>`,()=>{nav();
  on('[data-u]',e=>{useItem(e.dataset.u)&&go.inv()});on('[data-b]',e=>{const k=e.dataset.b;if(S.coins<ITEMS[k].price)return toast('Koin tidak cukup.');S.coins-=ITEMS[k].price;S.inv[k]=(S.inv[k]||0)+1;save();go.inv()})})},
 ach(){screen(`${back}<h2>Achievement</h2><div class="grid g2">${ACHS.map(a=>`<div class="panel" style="opacity:${S.ach.includes(a.id)?1:.45}"><h3>${S.ach.includes(a.id)?'🏆':'🔒'} ${a.t}</h3><p class="mu">${a.d}</p></div>`).join('')}</div>`,nav)},
 settings(fromMenu){const c=Settings.get();screen(`${fromMenu===true?'<button class="btn alt" data-go="menu">← Menu</button>':back}<div class="panel"><h2>Pengaturan</h2>
  <p>Volume utama <input type="range" id="vo" min="0" max="1" step=".05" value="${c.master}"></p>
  <label><input type="checkbox" id="mu" ${c.music?'checked':''}> Musik latar</label><br><label><input type="checkbox" id="mt" ${c.mute?'checked':''}> Bisukan semua</label>
  ${S?'<hr><div class="row"><button class="btn" id="ex">Ekspor save (JSON)</button><button class="btn bad" id="rs">Reset progres</button></div>':''}</div>`,()=>{nav();
  const upd=()=>{Settings.set({master:+document.getElementById('vo').value,music:document.getElementById('mu').checked,mute:document.getElementById('mt').checked});music(true)};
  ['vo','mu','mt'].forEach(i=>document.getElementById(i).onchange=upd);
  const ex=document.getElementById('ex');if(ex){ex.onclick=()=>exportSave(S);document.getElementById('rs').onclick=()=>confirmBox('Semua progres akan dihapus permanen. Yakin?',async()=>{await Store.clear().catch(()=>{});S=null;hasSave=false;toast('Progres dihapus.');go.menu()})}})},
 battle(){startBattle()}};

/* ---------- Dialog, materi, item ---------- */
function dialog(who,lines){let i=0;const m=document.createElement('div');m.className='modal';document.body.appendChild(m);
  const r=()=>{m.innerHTML=`<div class="panel"><h3>${who}</h3><p>${lines[i]}</p><button class="btn" id="nx">${i<lines.length-1?'Lanjut':'Tutup'}</button></div>`;
    m.querySelector('#nx').onclick=()=>{sfx.click();if(++i>=lines.length)m.remove();else r()}};r()}
function lesson(id){const l=LESSONS.find(x=>x.id===id);const m=document.createElement('div');m.className='modal';
  m.innerHTML=`<div class="panel"><h2>${l.title}</h2><p class="gr">Tujuan: ${l.goal}</p>${l.body.map(b=>`<p>${b}</p>`).join('')}<div class="expl"><b>Contoh:</b> ${l.example}</div>
  <div class="row"><button class="btn" id="dn">${S.lessons.includes(id)?'Tutup':'Selesai membaca (+'+l.exp+' EXP)'}</button></div></div>`;document.body.appendChild(m);
  m.querySelector('#dn').onclick=()=>{m.remove();if(!S.lessons.includes(id)){S.lessons.push(id);sfx.ok();addExp(l.exp);save();go.learn()}}}
function useItem(k){if(!S.inv[k])return toast('Item habis.')&&false;
  if(k==='hp'){if(S.hp>=S.maxHp)return toast('HP sudah penuh.'),false;S.hp=Math.min(S.maxHp,S.hp+40)}
  if(k==='en')S.energy=Math.min(100,S.energy+30);if(k==='exp')addExp(50);
  S.inv[k]--;sfx.ok();save();return true}

/* ---------- Battle edukatif ---------- */
function startBattle(){if(S.hp<=0)S.hp=Math.ceil(S.maxHp/2);
  const b={hp:60,max:60,qs:[...QUESTIONS].sort(()=>Math.random()-.5),i:0,phase:1};
  const q=()=>{const Q=b.qs[b.i%b.qs.length];
   screen(`<div class="row"><button class="btn alt" id="fl">Kabur</button></div><div class="panel center"><h2>🐛 Bug Monster${b.hp<=b.max/2?' (Fase 2: marah!)':''}</h2>
   <div class="bar hp"><i style="width:${b.hp/b.max*100}%"></i></div></div><div class="panel" style="margin-top:10px">${bars()}<h3>${esc(Q.q)}</h3>
   ${Q.o.map((o,i)=>`<button class="btn alt opt" data-o="${i}">${esc(o)}</button>`).join('')}<div id="ex"></div>
   <p><button class="btn alt" id="pt">🧪 Health Potion (${S.inv.hp||0})</button></p></div>`,()=>{
   on('#fl',()=>go.dash());on('#pt',()=>{useItem('hp')&&q()});
   on('[data-o]',el=>{const c=+el.dataset.o===Q.a;app.querySelectorAll('[data-o]').forEach(x=>{x.disabled=true;if(+x.dataset.o===Q.a)x.classList.add('ok')});
    const dmg=b.hp<=b.max/2?15:20,hit=b.hp<=b.max/2?20:12;
    if(c){S.correct++;b.hp=Math.max(0,b.hp-dmg);sfx.hit()}else{el.classList.add('no');S.hp=Math.max(0,S.hp-hit);sfx.bad()}
    checkAch();b.i++;
    document.getElementById('ex').innerHTML=`<div class="expl"><b>${c?'Benar! −'+dmg+' HP musuh.':'Salah. Kamu terkena −'+hit+' HP.'}</b><br>${Q.e}</div><button class="btn" id="nx">Lanjut</button>`;
    document.getElementById('nx').onclick=()=>{sfx.click();if(b.hp<=0)end(true);else if(S.hp<=0)end(false);else q()}})})};
  const end=w=>{if(w){S.wins++;sfx.win();give({exp:80,coin:40});checkQuests();checkAch();save(true)}else{sfx.lose();S.hp=Math.ceil(S.maxHp/2);save(true)}
   screen(`<div class="panel center"><h1>${w?'Menang!':'Kalah'}</h1><p>${w?'Bug Monster dihancurkan. +80 EXP, +40 koin.':'Jangan menyerah. Pelajari lagi materinya, HP dipulihkan setengah.'}</p><div class="row" style="justify-content:center"><button class="btn" data-go="dash">Dashboard</button><button class="btn alt" data-go="battle">Lawan lagi</button></div></div>`,nav)};
  q()}

/* ---------- Boot ---------- */
(async()=>{try{const d=await Store.load();if(d){S={...fresh(),...d};hasSave=true}}catch(e){setTimeout(()=>toast('Penyimpanan tidak tersedia: '+e.message),500)}
  addEventListener('beforeunload',()=>S&&S.created&&save(true));
  localStorage.getItem('rplverse.seen')?go.menu():intro()})();
