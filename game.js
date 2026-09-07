const c=document.getElementById("board"),ctx=c.getContext("2d");
const force=document.getElementById("force"),speed=document.getElementById("speed");
const forceOut=document.getElementById("forceOut"),speedOut=document.getElementById("speedOut");
const balance=document.getElementById("balance"),lastWin=document.getElementById("lastWin"),bestWin=document.getElementById("bestWin"),status=document.getElementById("status");
const W=c.width,H=c.height;let money=100,best=10,running=false,coin=null,last=0,raf=0;

const pockets=[{x:32,w:76,v:0},{x:108,w:76,v:2},{x:184,w:76,v:5},{x:260,w:76,v:0},{x:336,w:76,v:10},{x:412,w:76,v:0},{x:488,w:76,v:5},{x:564,w:76,v:2}];
const pegs=[];
for(let row=0;row<11;row++){for(let col=0;col<8;col++){let x=88+col*76+(row%2?38:0);if(x<665)pegs.push({x,y:110+row*47,r:7})}}

function draw(){
 ctx.clearRect(0,0,W,H);
 let bg=ctx.createRadialGradient(W/2,200,20,W/2,350,560);bg.addColorStop(0,"#f39b36");bg.addColorStop(1,"#a93620");ctx.fillStyle=bg;ctx.fillRect(0,0,W,H);
 // circus rays
 ctx.save();ctx.translate(W/2,80);for(let i=0;i<16;i++){ctx.rotate(Math.PI/8);ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(-24,520);ctx.lineTo(24,520);ctx.fillStyle=i%2?"rgba(255,223,91,.20)":"rgba(107,17,28,.13)";ctx.fill()}ctx.restore();
 // stars
 for(let i=0;i<16;i++){let x=(i*97)%W,y=45+(i*73)%520;star(x,y,5,12,"#ffd448")}
 // top coin chute
 ctx.fillStyle="#642615";ctx.fillRect(310,24,80,38);ctx.strokeStyle="#f5c54c";ctx.lineWidth=3;ctx.strokeRect(310,24,80,38);
 ctx.fillStyle="#ffe9a2";ctx.font="bold 13px Georgia";ctx.textAlign="center";ctx.fillText("KNIPS",350,49);
 // pegs
 for(const p of pegs){ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fillStyle="#4d2b17";ctx.fill();ctx.beginPath();ctx.arc(p.x-2,p.y-2,2,0,Math.PI*2);ctx.fillStyle="#f9d27a";ctx.fill()}
 // separators
 ctx.fillStyle="#713016";for(let x=40;x<=660;x+=78)ctx.fillRect(x,620,5,72);
 // pockets
 for(const p of pockets){ctx.fillStyle=p.v?"#e7a72e":"#174a82";ctx.fillRect(p.x,675,p.w-6,62);ctx.strokeStyle="#ffe37b";ctx.lineWidth=3;ctx.strokeRect(p.x,675,p.w-6,62);ctx.fillStyle="#fff2bd";ctx.font="bold 18px Arial";ctx.fillText(p.v?`${p.v} KR`:"TAP",p.x+(p.w-6)/2,703);ctx.font="9px Arial";ctx.fillText(p.v?"GEVINST":"TAP",p.x+(p.w-6)/2,721)}
 if(coin)drawCoin();
}
function star(x,y,r1,r2,col){ctx.save();ctx.translate(x,y);ctx.beginPath();for(let i=0;i<10;i++){let r=i%2?r1:r2,a=-Math.PI/2+i*Math.PI/5;ctx.lineTo(Math.cos(a)*r,Math.sin(a)*r)}ctx.closePath();ctx.fillStyle=col;ctx.fill();ctx.restore()}
function drawCoin(){let g=ctx.createRadialGradient(coin.x-5,coin.y-6,2,coin.x,coin.y,coin.r);g.addColorStop(0,"#fff7b0");g.addColorStop(.5,"#dfaa34");g.addColorStop(1,"#77470e");ctx.beginPath();ctx.arc(coin.x,coin.y,coin.r,0,Math.PI*2);ctx.fillStyle=g;ctx.fill();ctx.strokeStyle="#6d420e";ctx.lineWidth=3;ctx.stroke();ctx.fillStyle="#6c430e";ctx.font="bold 13px Arial";ctx.textAlign="center";ctx.fillText("1",coin.x,coin.y+4)}
function hit(p){let dx=coin.x-p.x,dy=coin.y-p.y,d=Math.hypot(dx,dy),m=coin.r+p.r;if(d<m){let nx=dx/(d||1),ny=dy/(d||1);coin.x=p.x+nx*m;coin.y=p.y+ny*m;let dot=coin.vx*nx+coin.vy*ny;if(dot<0){coin.vx-=1.75*dot*nx*.75;coin.vy-=1.75*dot*ny*.75;coin.vx*=.98;coin.vy*=.98}}}
function update(dt){let s=+speed.value/100;coin.vy+=580*(.45+.9*s)*dt;coin.x+=coin.vx*dt;coin.y+=coin.vy*dt;if(coin.x<35){coin.x=35;coin.vx=Math.abs(coin.vx)*.75}if(coin.x>665){coin.x=665;coin.vx=-Math.abs(coin.vx)*.75}for(const p of pegs)hit(p);if(coin.y>650)finish()}
function finish(){if(!running)return;running=false;let p=pockets.find(p=>coin.x>=p.x&&coin.x<p.x+p.w)||pockets[7],v=p.v;money+=v;lastWin.textContent=v;best=Math.max(best,v);bestWin.textContent=best;status.innerHTML=v?`🎉 Fulltreffer!<br>+${v} kr`:`Mynten havnet i TAP.<br>Prøv igjen!`;coin=null;ui();draw()}
function loop(t){if(!running)return;let dt=Math.min(.03,(t-last)/1000||.016);last=t;update(dt);draw();raf=requestAnimationFrame(loop)}
function ui(){balance.textContent=money;forceOut.textContent=force.value+"%";speedOut.textContent=speed.value+"%";document.getElementById("knips").disabled=running||money<1}
force.oninput=speed.oninput=ui;
document.getElementById("knips").onclick=()=>{if(running||money<1)return;money--;running=true;status.textContent="Mynten spretter…";coin={x:350,y:75,vx:(+force.value/100-.5)*360*(.5+.7*+speed.value/100),vy:-170-260*(+speed.value/100),r:14};ui();last=performance.now();raf=requestAnimationFrame(loop)}
document.getElementById("addCoin").onclick=()=>{money+=5;status.textContent="+5 prøvekr!";ui()}
document.getElementById("full").onclick=()=>document.documentElement.requestFullscreen?.();
document.getElementById("sound").onclick=e=>e.currentTarget.textContent=e.currentTarget.textContent==="🔊"?"🔇":"🔊";
document.getElementById("music").onclick=e=>e.currentTarget.textContent=e.currentTarget.textContent==="♫"?"♪":"♫";
ui();draw();
