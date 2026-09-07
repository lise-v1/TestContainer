const canvas=document.getElementById("game");
const ctx=canvas.getContext("2d");
const W=canvas.width,H=canvas.height;
const forceEl=document.getElementById("force"), speedEl=document.getElementById("speed");
const forceOut=document.getElementById("forceOut"),speedOut=document.getElementById("speedOut");
const shoot=document.getElementById("shoot"),add=document.getElementById("add");
const moneyEl=document.getElementById("money"),statusEl=document.getElementById("status"),winEl=document.getElementById("win");

let money=20, running=false, last=0, coin=null, raf=0;
const pockets=[
  {x:88,w:82,value:0},{x:170,w:82,value:2},{x:252,w:82,value:0},
  {x:334,w:82,value:5},{x:416,w:82,value:0},{x:498,w:82,value:2},
  {x:580,w:82,value:0},{x:662,w:70,value:10}
];
const pegs=[];
for(let row=0;row<9;row++){
  const y=115+row*54;
  const offset=row%2?42:0;
  for(let col=0;col<9;col++) pegs.push({x:100+col*80+offset,y,r:7});
}

function drawMachine(){
  ctx.clearRect(0,0,W,H);
  const g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,"#dce8e3");g.addColorStop(1,"#a9bfbb");
  ctx.fillStyle=g;ctx.fillRect(0,0,W,H);

  // glass highlights
  ctx.fillStyle="rgba(255,255,255,.16)";ctx.fillRect(20,20,95,H-60);

  // title plate
  ctx.fillStyle="#4a2b14";ctx.fillRect(300,24,220,46);
  ctx.strokeStyle="#bd8437";ctx.lineWidth=3;ctx.strokeRect(300,24,220,46);
  ctx.fillStyle="#ffe5a1";ctx.font="bold 19px Georgia";ctx.textAlign="center";ctx.fillText("KNIPS & VINN",410,53);

  // pegs
  for(const p of pegs){
    ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
    ctx.fillStyle="#5a3519";ctx.fill();
    ctx.beginPath();ctx.arc(p.x-2,p.y-2,2,0,Math.PI*2);ctx.fillStyle="#d9aa63";ctx.fill();
  }

  // divider and pockets
  ctx.fillStyle="#6a421f";ctx.fillRect(65,598,690,8);
  for(const p of pockets){
    ctx.fillStyle=p.value?"#8c5a1e":"#4a2b16";
    ctx.fillRect(p.x,615,p.w-5,58);
    ctx.strokeStyle="#c28b42";ctx.lineWidth=2;ctx.strokeRect(p.x,615,p.w-5,58);
    ctx.fillStyle="#ffe5a0";ctx.font="bold 17px Arial";ctx.textAlign="center";
    ctx.fillText(p.value?`${p.value} KR`:"TAP",p.x+(p.w-5)/2,642);
    ctx.font="10px Arial";ctx.fillText(p.value?"GEVINST":"INGEN GEVINST",p.x+(p.w-5)/2,660);
  }
  ctx.textAlign="left";
}

function resetCoin(){
  coin={x:410,y:82,vx:0,vy:0,r:13,life:0};
}

function drawCoin(){
  if(!coin)return;
  const grad=ctx.createRadialGradient(coin.x-4,coin.y-5,2,coin.x,coin.y,coin.r);
  grad.addColorStop(0,"#fff2a6");grad.addColorStop(.45,"#dca737");grad.addColorStop(1,"#7e5114");
  ctx.beginPath();ctx.arc(coin.x,coin.y,coin.r,0,Math.PI*2);ctx.fillStyle=grad;ctx.fill();
  ctx.strokeStyle="#744a12";ctx.lineWidth=3;ctx.stroke();
  ctx.fillStyle="#70460f";ctx.font="bold 12px Arial";ctx.textAlign="center";ctx.fillText("1",coin.x,coin.y+4);
}

function collidePeg(p){
  const dx=coin.x-p.x,dy=coin.y-p.y,d=Math.hypot(dx,dy),min=coin.r+p.r;
  if(d<min){
    const nx=dx/(d||1),ny=dy/(d||1);
    coin.x=p.x+nx*min;coin.y=p.y+ny*min;
    const dot=coin.vx*nx+coin.vy*ny;
    if(dot<0){
      const bounce=0.72;
      coin.vx-=2*dot*nx*bounce;
      coin.vy-=2*dot*ny*bounce;
      coin.vx*=.985;coin.vy*=.985;
    }
  }
}

function step(dt){
  const speed=+speedEl.value/100;
  coin.vy += (620*(.55+.8*speed))*dt;
  coin.x += coin.vx*dt; coin.y += coin.vy*dt;
  if(coin.x<coin.r+42){coin.x=coin.r+42;coin.vx=Math.abs(coin.vx)*.72}
  if(coin.x>W-coin.r-42){coin.x=W-coin.r-42;coin.vx=-Math.abs(coin.vx)*.72}
  for(const p of pegs)collidePeg(p);
  coin.life+=dt;
  if(coin.y>590){
    finish();
  }else if(coin.life>8){
    finish();
  }
}

function finish(){
  if(!running)return;
  running=false;
  const pocket=pockets.find(p=>coin.x>=p.x && coin.x<p.x+p.w) || pockets[pockets.length-1];
  const value=pocket.value;
  if(value){money+=value;winEl.textContent=`+${value} KR`;statusEl.textContent=`Fulltreffer! +${value} kr`; }
  else{winEl.textContent="0 KR";statusEl.textContent="Mynten havnet i tapet."; }
  updateUI(); drawMachine(); coin=null;
}

function animate(t){
  if(!running)return;
  const dt=Math.min(.032,(t-last)/1000||.016);last=t;
  step(dt);drawMachine();drawCoin();
  raf=requestAnimationFrame(animate);
}

function start(){
  if(running||money<1)return;
  money--;running=true;winEl.textContent="—";statusEl.textContent="Mynten er på vei…";
  resetCoin();
  const f=+forceEl.value/100, s=+speedEl.value/100;
  // Force controls horizontal launch; speed controls overall launch energy.
  coin.vx=(f-.5)*500*(.55+.75*s);
  coin.vy=-180-260*s;
  updateUI();last=performance.now();cancelAnimationFrame(raf);raf=requestAnimationFrame(animate);
}
function updateUI(){
  moneyEl.textContent=money;
  forceOut.textContent=forceEl.value;
  speedOut.textContent=speedEl.value;
  shoot.disabled=running||money<1;
}
forceEl.oninput=updateUI;speedEl.oninput=updateUI;
shoot.onclick=start;
add.onclick=()=>{money+=5;statusEl.textContent="5 prøvekr lagt til.";updateUI()};
updateUI();drawMachine();
