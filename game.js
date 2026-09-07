const state={coins:10, busy:false};
const slotsData=[
  {label:"TAP",mult:0},{label:"2 KR",mult:2},{label:"TAP",mult:0},
  {label:"5 KR",mult:5},{label:"TAP",mult:0},{label:"2 KR",mult:2},{label:"TAP",mult:0}
];
const slots=document.getElementById("slots");
slotsData.forEach((s,i)=>{
  const el=document.createElement("div");
  el.className="slot "+(s.mult?"win":"lose");
  el.innerHTML=`<div>${s.label}<small>${s.mult?"GEVINST":"INGEN GEVINST"}</small></div>`;
  el.dataset.index=i; slots.appendChild(el);
});
const coin=document.getElementById("coin"), coins=document.getElementById("coins");
const msg=document.getElementById("message"), payout=document.getElementById("payout");
const shoot=document.getElementById("shoot"), power=document.getElementById("power");

function update(){coins.textContent=state.coins;shoot.disabled=state.busy||state.coins<1}
function resultFromPower(p){
  // Skill + a little randomness. Higher power tends to travel farther.
  const normalized=(p-25)/70;
  const ideal=normalized*6;
  const noise=(Math.random()-.5)*2.4;
  return Math.max(0,Math.min(6,Math.round(ideal+noise)));
}
function animateCoin(target){
  state.busy=true; update();
  const start=performance.now(), duration=900;
  const fromX=50, toX=8+target*14;
  function frame(t){
    const q=Math.min(1,(t-start)/duration), e=1-Math.pow(1-q,3);
    coin.style.left=(fromX+(toX-fromX)*e)+"%";
    coin.style.top=(9+72*Math.sin(Math.PI*e))+"%";
    coin.style.transform=`translateX(-50%) rotate(${e*720}deg)`;
    if(q<1) requestAnimationFrame(frame); else finish(target);
  }
  requestAnimationFrame(frame);
}
function finish(target){
  const s=slotsData[target];
  const win=s.mult>0;
  let won=0;
  if(win){won=s.mult;state.coins+=won;msg.textContent=`Fulltreffer! Du fikk ${won} kr.`;payout.textContent=`+${won} kr`;document.querySelector(`[data-index="${target}"]`).animate([{transform:"scale(1)"},{transform:"scale(1.12)"},{transform:"scale(1)"}],{duration:450})}
  else{msg.textContent="Mynten havnet i tap-slusen.";payout.textContent="Ingen gevinst denne gangen."}
  coin.style.left="50%";coin.style.top="9%";coin.style.transform="translateX(-50%)";
  state.busy=false;update();
}
shoot.onclick=()=>{
  if(state.busy||state.coins<1)return;
  state.coins--; payout.textContent=""; msg.textContent="Mynten er på vei…";
  const target=resultFromPower(+power.value); animateCoin(target);
};
document.getElementById("add").onclick=()=>{state.coins+=5;msg.textContent="Du fikk 5 prøvekr.";update()};
document.getElementById("reset").onclick=()=>{state.coins=10;state.busy=false;payout.textContent="";msg.textContent="Velg styrke og knips mynten.";coin.style.left="50%";coin.style.top="9%";update()};
update();
