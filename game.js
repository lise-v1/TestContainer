(function(){
var board=document.getElementById("board"),coin=document.getElementById("coin"),pegsBox=document.getElementById("pegs");
var money=100,busy=false,best=10,force=document.getElementById("force"),speed=document.getElementById("speed");
var values=[0,2,5,10,5,2,0];

for(var r=0;r<8;r++){for(var c=0;c<8;c++){var p=document.createElement("i");p.className="peg";p.style.left=(c*12+(r%2?6:0))+"%";p.style.top=(r*12)+"%";pegsBox.appendChild(p)}}

function ui(){document.getElementById("money").textContent=money;document.getElementById("forceValue").textContent=force.value+"%";document.getElementById("speedValue").textContent=speed.value+"%";document.getElementById("play").disabled=busy||money<1}
force.oninput=speed.oninput=ui;

document.getElementById("add").onclick=function(){money+=5;document.getElementById("message").textContent="+5 prøvekr lagt til.";ui()};

document.getElementById("play").onclick=function(){
 if(busy||money<1)return;
 money--;busy=true;ui();
 document.getElementById("message").textContent="Mynten spretter...";
 document.getElementById("win").textContent="0";
 coin.style.display="block";
 var x=50,y=4;
 var vx=(Number(force.value)-50)*0.075;
 var fall=0.75+Number(speed.value)*0.018;
 var timer=setInterval(function(){
   y+=fall;x+=vx;vx*=0.985;
   if(x<4){x=4;vx=Math.abs(vx)*.7}
   if(x>96){x=96;vx=-Math.abs(vx)*.7}
   coin.style.left=x+"%";coin.style.top=y+"%";
   if(y>=82){clearInterval(timer);finish(x)}
 },25);
};

function finish(x){
 var index=Math.max(0,Math.min(6,Math.floor(x/100*7)));
 var value=values[index];money+=value;
 document.getElementById("win").textContent=value;
 if(value>best){best=value;document.getElementById("best").textContent=best}
 document.getElementById("message").textContent=value?"🎉 Gratulerer! Du vant "+value+" kr!":"TAP – prøv igjen!";
 coin.style.display="none";busy=false;ui();
}
ui();
})();
