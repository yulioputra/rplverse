// Audio sintetis (Web Audio API). Baru aktif setelah pengguna menekan sesuatu.
import {Settings} from './storage.js';
let ctx=null,musicTimer=null,step=0;
const cfg=()=>Settings.get();
const vol=()=>cfg().mute?0:cfg().master;
function C(){if(!ctx){const A=window.AudioContext||window.webkitAudioContext;if(!A)return null;ctx=new A()}
  if(ctx.state==='suspended')ctx.resume();return ctx}
function tone(f,d=.12,type='square',g=.15,when=0){const c=C();if(!c||vol()===0)return;
  const o=c.createOscillator(),a=c.createGain(),t=c.currentTime+when;
  o.type=type;o.frequency.value=f;a.gain.setValueAtTime(g*vol(),t);
  a.gain.exponentialRampToValueAtTime(.0001,t+d);o.connect(a).connect(c.destination);o.start(t);o.stop(t+d)}
export const sfx={
  click:()=>tone(660,.07,'square',.1),
  ok:()=>{tone(523,.1);tone(784,.16,'square',.15,.09)},
  bad:()=>{tone(200,.25,'sawtooth',.15)},
  hit:()=>{tone(150,.15,'sawtooth',.2);tone(90,.2,'square',.2,.05)},
  level:()=>[523,659,784,1047].forEach((f,i)=>tone(f,.18,'triangle',.18,i*.1)),
  win:()=>[392,523,659,784,1047].forEach((f,i)=>tone(f,.2,'triangle',.18,i*.12)),
  lose:()=>[300,240,180].forEach((f,i)=>tone(f,.3,'sawtooth',.14,i*.18))};
const NOTES=[262,311,392,311,262,349,415,349];
export function music(on){clearInterval(musicTimer);musicTimer=null;
  if(on&&cfg().music&&!cfg().mute)musicTimer=setInterval(()=>{tone(NOTES[step++%8]/2,.5,'sine',.05)},500)}
export const applyVolume=()=>music(!!musicTimer||false);
export const unlock=()=>C();
                                                                 
