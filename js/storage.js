// Penyimpanan lokal: IndexedDB untuk save game, localStorage untuk pengaturan.
const DB='rplverse',STORE='save',KEY='slot1';
function open(){return new Promise((res,rej)=>{
  if(!window.indexedDB)return rej(new Error('Browser tidak mendukung IndexedDB.'));
  const r=indexedDB.open(DB,1);
  r.onupgradeneeded=()=>r.result.createObjectStore(STORE);
  r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error||new Error('Gagal membuka database.'));});}
async function tx(mode,fn){const db=await open();return new Promise((res,rej)=>{
  const t=db.transaction(STORE,mode),req=fn(t.objectStore(STORE));
  t.oncomplete=()=>{db.close();res(req.result)};t.onerror=()=>rej(t.error);t.onabort=()=>rej(t.error);});}
export const Store={
  load:()=>tx('readonly',s=>s.get(KEY)),
  save:d=>tx('readwrite',s=>s.put(JSON.parse(JSON.stringify(d)),KEY)),
  clear:()=>tx('readwrite',s=>s.delete(KEY))};
export const Settings={
  def:{master:.7,music:true,mute:false},
  get(){try{return{...this.def,...JSON.parse(localStorage.getItem('rplverse.settings')||'{}')}}catch{return{...this.def}}},
  set(v){try{localStorage.setItem('rplverse.settings',JSON.stringify(v))}catch{}}};
export function exportSave(d){
  const b=new Blob([JSON.stringify({game:'RPLVERSE',v:1,data:d},null,1)],{type:'application/json'});
  const a=document.createElement('a');a.href=URL.createObjectURL(b);
  a.download='rplverse-save.json';document.body.appendChild(a);a.click();a.remove();
  setTimeout(()=>URL.revokeObjectURL(a.href),2000);}
export function importSave(file){return new Promise((res,rej)=>{
  const r=new FileReader();
  r.onload=()=>{try{const j=JSON.parse(r.result);
    if(j.game!=='RPLVERSE'||!j.data||typeof j.data.level!=='number')throw 0;res(j.data)}
    catch{rej(new Error('File bukan save RPLVERSE yang valid.'))}};
  r.onerror=()=>rej(new Error('File tidak bisa dibaca.'));r.readAsText(file);});}
