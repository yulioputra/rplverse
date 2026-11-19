// Dunia top-down Cyber Academy (Canvas 2D).
export const T=32,COLS=20,ROWS=12;
const MAP=["####################","#..................#","#.####....####.....#","#.#..#....#..#.....#","#.####....####.....#","#..................#","#......~~~~........#","#......~~~~........#","#.####.............#","#.#..#.....####....#","#.####.....#..#....#","####################"];
export const COINS=[{id:'c1',x:17,y:1},{id:'c2',x:1,y:10},{id:'c3',x:18,y:10}];
const NPC={x:8,y:5},PORTAL={x:13,y:5};
const solid=(c,r)=>{const t=(MAP[r]||'')[c];return t===undefined||t==='#'||t==='~'};
export function drawHero(g,x,y,s,col,type,acc,t=0){
  g.save();g.translate(x,y);g.scale(s,s);const b=Math.sin(t/200)*1.2;
  g.fillStyle='#0008';g.beginPath();g.ellipse(0,13,9,3,0,0,7);g.fill();
  g.fillStyle=col;g.fillRect(-7,-2+b,14,14);
  g.fillStyle=['#f1c9a5','#c68f67','#7ad7ff'][type]||'#f1c9a5';g.fillRect(-6,-14+b,12,12);
  g.fillStyle='#10143a';g.fillRect(-4,-9+b,2,3);g.fillRect(2,-9+b,2,3);
  g.fillStyle=['#2b1b4a','#111','#3dffa8'][type]||'#222';g.fillRect(-7,-16+b,14,4);
  if(acc===1){g.strokeStyle='#22e5ff';g.lineWidth=1.5;g.strokeRect(-6,-10+b,12,5)}
  if(acc===2){g.fillStyle='#22e5ff';g.fillRect(-8,-10+b,2,6);g.fillRect(6,-10+b,2,6)}
  if(acc===3){g.fillStyle='#ffd24d';g.fillRect(-5,-20+b,10,4)}
  g.restore()}
export class World{
  constructor(cv,S,cb){this.cv=cv;this.g=cv.getContext('2d');this.S=S;this.cb=cb;
    cv.width=COLS*T;cv.height=ROWS*T;this.p={x:2*T+16,y:2*T+16};this.k={};this.v={x:0,y:0};this.on=true;
    this.kd=e=>{const k=e.key.toLowerCase();if(['arrowup','arrowdown','arrowleft','arrowright',' '].includes(k))e.preventDefault();
      this.k[k]=true;if(k==='e')this.interact()};this.ku=e=>{this.k[e.key.toLowerCase()]=false};
    addEventListener('keydown',this.kd);addEventListener('keyup',this.ku);this.loop=this.loop.bind(this);requestAnimationFrame(this.loop)}
  stop(){this.on=false;removeEventListener('keydown',this.kd);removeEventListener('keyup',this.ku)}
  blocked(x,y){const r=9;return[[x-r,y-r+6],[x+r,y-r+6],[x-r,y+r],[x+r,y+r]].some(([a,b])=>solid(Math.floor(a/T),Math.floor(b/T)))}
  near(o,d=44){return Math.hypot(this.p.x-(o.x*T+16),this.p.y-(o.y*T+16))<d}
  interact(){if(this.near(NPC))this.cb.talk();else if(this.near(PORTAL))this.cb.arena();else this.cb.hint('Tidak ada yang bisa diajak berinteraksi di dekat sini.')}
  loop(t){if(!this.on)return;const k=this.k;
    let dx=(k.d||k.arrowright?1:0)-(k.a||k.arrowleft?1:0),dy=(k.s||k.arrowdown?1:0)-(k.w||k.arrowup?1:0);
    dx+=this.v.x;dy+=this.v.y;const m=Math.hypot(dx,dy);const sp=(k.shift?3.2:2.2);
    if(m>0){dx=dx/m*sp;dy=dy/m*sp;if(!this.blocked(this.p.x+dx,this.p.y))this.p.x+=dx;if(!this.blocked(this.p.x,this.p.y+dy))this.p.y+=dy}
    for(const c of COINS)if(!this.S.picked.includes(c.id)&&this.near(c,22)){this.cb.coin(c.id)}
    this.draw(t,m>0);requestAnimationFrame(this.loop)}
  draw(t){const g=this.g;g.clearRect(0,0,COLS*T,ROWS*T);
    for(let r=0;r<ROWS;r++)for(let c=0;c<COLS;c++){const ch=MAP[r][c],x=c*T,y=r*T;
      g.fillStyle=(c+r)%2?'#0b1233':'#0d1538';g.fillRect(x,y,T,T);
      if(ch==='#'){g.fillStyle='#1b2a70';g.fillRect(x,y,T,T);g.strokeStyle='#22e5ff55';g.strokeRect(x+.5,y+.5,T-1,T-1)}
      if(ch==='~'){g.fillStyle='#3b1f8f';g.fillRect(x,y,T,T);g.fillStyle='#9b6bff88';g.fillRect(x+4,y+8+Math.sin(t/300+c)*3,T-8,3)}}
    for(const c of COINS)if(!this.S.picked.includes(c.id)){g.fillStyle='#ffd24d';g.beginPath();g.arc(c.x*T+16,c.y*T+16+Math.sin(t/250)*2,7,0,7);g.fill()}
    const px=PORTAL.x*T+16,py=PORTAL.y*T+16;g.strokeStyle='#ff4d6d';g.lineWidth=3;g.beginPath();g.arc(px,py,12+Math.sin(t/200)*2,0,7);g.stroke();
    g.fillStyle='#ff4d6d';g.font='11px sans-serif';g.textAlign='center';g.fillText('ARENA',px,py-20);
    drawHero(g,NPC.x*T+16,NPC.y*T+16,1.1,'#9b6bff',1,3,t);g.fillStyle='#fff';g.fillText('Pak Guru',NPC.x*T+16,NPC.y*T-6);
    drawHero(g,this.p.x,this.p.y,1.1,this.S.color,this.S.type,this.S.acc,t);
    g.fillStyle='#fff';g.fillText(this.S.name,this.p.x,this.p.y-26);
    if(this.near(NPC)||this.near(PORTAL)){g.fillStyle='#3dffa8';g.fillText('Tekan E / tombol aksi',this.p.x,this.p.y+30)}}}
