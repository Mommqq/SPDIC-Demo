"use strict";
const slider=document.getElementById("rho"),value=document.getElementById("rhoValue"),cost=document.getElementById("cost"),canvas=document.getElementById("theoryPlot");
function distortion(beta,rho){return 1+beta*beta-2*rho*beta;}
function discrepancy(beta){return 0.5*(Math.log(beta*beta)+1/(beta*beta)-1);}
function draw(){
 const rho=Number(slider.value);value.textContent=rho.toFixed(2);cost.textContent=`Distortion cost from β = ρ to β = 1: (1 − ρ)² = ${((1-rho)**2).toFixed(3)} in units of σX². This does not determine LPIPS.`;
 const rect=canvas.getBoundingClientRect(),scale=window.devicePixelRatio||1;canvas.width=Math.round(rect.width*scale);canvas.height=Math.round(rect.height*scale);const ctx=canvas.getContext("2d");ctx.scale(scale,scale);
 const w=rect.width,h=rect.height,left=48,right=16,top=18,bottom=41,pw=w-left-right,ph=h-top-bottom,xMin=.35,xMax=1.25;let yMax=0;for(let i=0;i<=200;i++){const b=xMin+(xMax-xMin)*i/200;yMax=Math.max(yMax,distortion(b,rho),discrepancy(b));}yMax=Math.ceil(yMax*10)/10+.05;
 const px=b=>left+(b-xMin)/(xMax-xMin)*pw,py=y=>top+ph-y/yMax*ph;ctx.font="12px system-ui,sans-serif";ctx.fillStyle="#53616b";
 for(let i=0;i<=5;i++){const y=yMax*i/5;ctx.strokeStyle="#e4e8e9";ctx.lineWidth=1;ctx.setLineDash([2,4]);ctx.beginPath();ctx.moveTo(left,py(y));ctx.lineTo(left+pw,py(y));ctx.stroke();ctx.setLineDash([]);ctx.textAlign="right";ctx.fillText(y.toFixed(1),left-6,py(y)+4);}
 for(let b=.4;b<=1.201;b+=.2){ctx.textAlign="center";ctx.fillText(b.toFixed(1),px(b),top+ph+18);}ctx.strokeStyle="#53616b";ctx.beginPath();ctx.moveTo(left,top);ctx.lineTo(left,top+ph);ctx.lineTo(left+pw,top+ph);ctx.stroke();
 for(const [b,label] of [[rho,"β=ρ"],[1,"β=1"]]){ctx.strokeStyle="#879399";ctx.setLineDash(b===1?[6,3,1,3]:[2,4]);ctx.beginPath();ctx.moveTo(px(b),top+17);ctx.lineTo(px(b),top+ph);ctx.stroke();ctx.setLineDash([]);ctx.fillStyle="#3f4b50";ctx.textAlign="center";ctx.fillText(label,px(b),top+11);}
 function curve(fn,dash){ctx.strokeStyle="#14212b";ctx.lineWidth=2;ctx.setLineDash(dash?[7,4]:[]);ctx.beginPath();for(let i=0;i<=280;i++){const b=xMin+(xMax-xMin)*i/280;if(i===0)ctx.moveTo(px(b),py(fn(b)));else ctx.lineTo(px(b),py(fn(b)));}ctx.stroke();ctx.setLineDash([]);}curve(b=>distortion(b,rho),false);curve(discrepancy,true);ctx.fillStyle="#14212b";ctx.textAlign="center";ctx.fillText("Reconstruction scale β",left+pw/2,h-7);
}
slider.addEventListener("input",draw);window.addEventListener("resize",draw);draw();
