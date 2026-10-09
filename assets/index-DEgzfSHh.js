(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))n(r);new MutationObserver(r=>{for(const a of r)if(a.type==="childList")for(const s of a.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&n(s)}).observe(document,{childList:!0,subtree:!0});function t(r){const a={};return r.integrity&&(a.integrity=r.integrity),r.referrerPolicy&&(a.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?a.credentials="include":r.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function n(r){if(r.ep)return;r.ep=!0;const a=t(r);fetch(r.href,a)}})();class gs{constructor(e={}){this.tag=e.tag||"FIC-101",this.description=e.description||"Controller",this.units=e.units||"%",this.Kc=e.Kc!==void 0?e.Kc:1,this.Ti=e.Ti!==void 0?e.Ti:1,this.Td=e.Td!==void 0?e.Td:0,this.action=e.action||"REVERSE",this.coMin=e.coMin!==void 0?e.coMin:0,this.coMax=e.coMax!==void 0?e.coMax:100,this.pvMin=e.pvMin!==void 0?e.pvMin:0,this.pvMax=e.pvMax!==void 0?e.pvMax:200,this.mode=e.mode||"AUTO",this.sp=e.sp!==void 0?e.sp:50,this.rsp=e.rsp!==void 0?e.rsp:50,this.pv=e.pv!==void 0?e.pv:50,this.co=e.co!==void 0?e.co:50,this.manualCO=e.manualCO!==void 0?e.manualCO:50,this.integral=0,this.bias=50,this.lastPV=this.pv,this.lastError=0,this.externalFeedback=50,this.useExternalFeedback=e.useExternalFeedback!==!1,this.spTracking=!0,this.saturated=!1}setMode(e){if(this.mode===e)return;const t=this.mode;this.mode=e,e==="AUTO"?t==="MANUAL"&&(this.spTracking&&(this.sp=this.pv),this.integral=0,this.bias=this.co):e==="CASCADE"?(t==="MANUAL"||t==="AUTO")&&(this.integral=0,this.bias=this.co):e==="MANUAL"&&(this.manualCO=this.co)}getActiveSetpoint(){return this.mode==="CASCADE"?this.rsp:this.sp}step(e,t,n=null,r=null){this.pv=e,n!==null&&(this.rsp=n),r!==null&&(this.externalFeedback=r);const a=this.getActiveSetpoint();if(this.mode==="MANUAL")return this.spTracking&&(this.sp=e),this.co=Math.max(this.coMin,Math.min(this.coMax,this.manualCO)),this.lastPV=e,this.co;let s=this.action==="DIRECT"?e-a:a-e;const o=this.pvMax-this.pvMin||100,l=s/o*100,c=this.Kc*l;let u=0;this.Ti>.001&&(u=this.Kc/this.Ti*l);let h=!0;if(this.useExternalFeedback&&this.mode==="CASCADE"){const y=this.externalFeedback-c-this.bias;this.bias+=y*Math.min(1,t/(this.Ti||1)),this.integral=0}else this.saturated&&(this.co>=this.coMax&&u>0||this.co<=this.coMin&&u<0)&&(h=!1),h&&(this.integral+=u*t);let f=0;if(this.Td>1e-4&&t>0){const x=(e-this.lastPV)/o*100;f=-(this.action==="DIRECT"?1:-1)*this.Kc*this.Td*(x/t)}this.lastPV=e;let m=this.bias+c+this.integral+f;return m>this.coMax?(this.co=this.coMax,this.saturated=!0):m<this.coMin?(this.co=this.coMin,this.saturated=!0):(this.co=m,this.saturated=!1),this.co}reset(){this.integral=0,this.co=this.bias,this.saturated=!1,this.lastPV=this.pv}}class Q0{constructor(e={}){this.failAction=e.failAction||"ATO",this.characteristic=e.characteristic||"LINEAR",this.stictionDeadband=e.stictionDeadband||0,this.stictionSlipJump=e.stictionSlipJump||0,this.tauActuator=e.tauActuator||.05,this.stemPosition=50,this.apparentSignal=50,this.supplyPressure=100,this.actualFlow=50,this.useCharacterizer=!1}characterize(e){if(!this.useCharacterizer)return e;const t=Math.max(0,Math.min(100,e))/100,n=50;return Math.log(1+(n-1)*t)/Math.log(n)*100}step(e,t){const n=this.characterize(e);let r=this.failAction==="ATO"?n:100-n;if(r=Math.max(0,Math.min(100,r)),this.stictionDeadband>.01){const l=r-this.stemPosition;if(Math.abs(l)>this.stictionDeadband){const c=Math.sign(l),u=Math.min(Math.abs(l),this.stictionDeadband+this.stictionSlipJump);this.stemPosition+=c*u}}else{const l=Math.min(1,t/(this.tauActuator+1e-5));this.stemPosition+=l*(r-this.stemPosition)}this.stemPosition=Math.max(0,Math.min(100,this.stemPosition));const a=this.stemPosition/100;let s=a;this.characteristic==="EQUAL_PCT"?s=(Math.pow(50,a-1)-1/50)/(1-1/50):this.characteristic==="QUICK_OPEN"&&(s=Math.sqrt(Math.max(0,a)));const o=Math.sqrt(Math.max(0,this.supplyPressure/100));return this.actualFlow=Math.max(0,Math.min(150,s*100*o)),this.actualFlow}setSupplyPressure(e){this.supplyPressure=Math.max(10,Math.min(150,e))}}class na{constructor(e={}){this.name=e.name||"Process",this.Kp=e.Kp!==void 0?e.Kp:1,this.tau=e.tau!==void 0?e.tau:5,this.deadTime=e.deadTime!==void 0?e.deadTime:.5,this.ambient=e.ambient!==void 0?e.ambient:20,this.pv=e.initialPV!==void 0?e.initialPV:100,this.nominalInput=e.nominalInput!==void 0?e.nominalInput:50,this.nominalOutput=e.nominalOutput!==void 0?e.nominalOutput:100,this.bufferSize=2e3,this.delayBuffer=new Float32Array(this.bufferSize).fill(this.nominalInput),this.bufferIndex=0,this.nonLinearity=e.nonLinearity||1}step(e,t,n=0){const r=Math.max(1,Math.min(this.bufferSize-1,Math.round(this.deadTime/(t+1e-6))));this.delayBuffer[this.bufferIndex]=e;const a=(this.bufferIndex-r+this.bufferSize)%this.bufferSize,s=this.delayBuffer[a];this.bufferIndex=(this.bufferIndex+1)%this.bufferSize;let o=s;if(this.nonLinearity!==1){const h=Math.max(0,s)/50;o=50*Math.pow(h,this.nonLinearity)}const l=o-this.nominalInput,c=this.nominalOutput+this.Kp*l-n,u=Math.min(1,t/(this.tau+1e-5));return this.pv+=u*(c-this.pv),this.pv}reset(e=null){e!==null&&(this.pv=e),this.delayBuffer.fill(this.nominalInput),this.bufferIndex=0}}class Th{constructor(){this.timeMinutes=0,this.dtMinutes=.005,this.isRunning=!0,this.speedMultiplier=1,this.steamPressure=100,this.feedFlowDisturbance=0,this.casPrimaryPID=new gs({tag:"TIC-101",description:"Primary Column Temp Controller",units:"°C",action:"REVERSE",sp:120,pv:120,pvMin:80,pvMax:160,coMin:0,coMax:100,Kc:1.5,Ti:3.5,Td:.2,mode:"AUTO"}),this.casSecondaryPID=new gs({tag:"FIC-101",description:"Secondary Steam Flow Controller",units:"%",action:"REVERSE",sp:50,rsp:50,pv:50,pvMin:0,pvMax:120,coMin:0,coMax:100,Kc:2.5,Ti:.3,Td:0,mode:"CASCADE"}),this.casValve=new Q0({failAction:"ATO",characteristic:"LINEAR",tauActuator:.04,stictionDeadband:0,stictionSlipJump:0}),this.casFlowProcess=new na({name:"Steam Flow Fast Loop",Kp:1,tau:.15,deadTime:.02,nominalInput:50,nominalOutput:50,initialPV:50}),this.casTempProcess=new na({name:"Column Temperature Slow Loop",Kp:.8,tau:4.5,deadTime:.6,nominalInput:50,nominalOutput:120,initialPV:120}),this.convPID=new gs({tag:"TIC-101-CONV",description:"Conventional Temp Controller",units:"°C",action:"REVERSE",sp:120,pv:120,pvMin:80,pvMax:160,coMin:0,coMax:100,Kc:1.2,Ti:5,Td:.2,mode:"AUTO"}),this.convValve=new Q0({failAction:"ATO",characteristic:"LINEAR",tauActuator:.04,stictionDeadband:0}),this.convFlowProcess=new na({name:"Conv Flow Loop",Kp:1,tau:.15,deadTime:.02,nominalInput:50,nominalOutput:50,initialPV:50}),this.convTempProcess=new na({name:"Conv Temp Loop",Kp:.8,tau:4.5,deadTime:.6,nominalInput:50,nominalOutput:120,initialPV:120}),this.history=[],this.maxHistory=1200}reset(){this.timeMinutes=0,this.steamPressure=100,this.feedFlowDisturbance=0,this.history=[],this.casPrimaryPID.reset(),this.casSecondaryPID.reset(),this.casFlowProcess.reset(50),this.casTempProcess.reset(120),this.convPID.reset(),this.convFlowProcess.reset(50),this.convTempProcess.reset(120)}step(e=1){if(!this.isRunning)return this.getSnapshot();const t=this.dtMinutes*this.speedMultiplier;for(let r=0;r<e;r++){this.timeMinutes+=t,this.casValve.setSupplyPressure(this.steamPressure),this.convValve.setSupplyPressure(this.steamPressure);const a=this.casPrimaryPID.step(this.casTempProcess.pv,t,null,this.casFlowProcess.pv),s=this.casSecondaryPID.step(this.casFlowProcess.pv,t,a,this.casValve.stemPosition),o=this.casValve.step(s,t),l=this.casFlowProcess.step(o,t);this.casTempProcess.step(l,t,this.feedFlowDisturbance);const c=this.convPID.step(this.convTempProcess.pv,t),u=this.convValve.step(c,t),h=this.convFlowProcess.step(u,t);this.convTempProcess.step(h,t,this.feedFlowDisturbance)}const n=this.getSnapshot();return this.history.push(n),this.history.length>this.maxHistory&&this.history.shift(),n}getSnapshot(){return{time:this.timeMinutes,steamPressure:this.steamPressure,feedDisturbance:this.feedFlowDisturbance,casPriSP:this.casPrimaryPID.getActiveSetpoint(),casPriPV:this.casTempProcess.pv,casPriCO:this.casPrimaryPID.co,casPriMode:this.casPrimaryPID.mode,casSecSP:this.casSecondaryPID.getActiveSetpoint(),casSecPV:this.casFlowProcess.pv,casSecCO:this.casSecondaryPID.co,casSecMode:this.casSecondaryPID.mode,casValvePos:this.casValve.stemPosition,casFlow:this.casFlowProcess.pv,convSP:this.convPID.getActiveSetpoint(),convPV:this.convTempProcess.pv,convCO:this.convPID.co,convValvePos:this.convValve.stemPosition,convFlow:this.convFlowProcess.pv}}triggerSteamDrop(e=30){this.steamPressure=Math.max(10,100-e)}restoreSteam(){this.steamPressure=100}triggerFeedSurge(e=15){this.feedFlowDisturbance=e}clearFeedSurge(){this.feedFlowDisturbance=0}setStiction(e,t=0){this.casValve.stictionDeadband=e,this.casValve.stictionSlipJump=t,this.convValve.stictionDeadband=e,this.convValve.stictionSlipJump=t}}class Eh{constructor(e,t={}){this.canvas=e,this.ctx=this.canvas.getContext("2d"),this.timeWindowMinutes=t.timeWindowMinutes||10,this.yMin=t.yMin!==void 0?t.yMin:0,this.yMax=t.yMax!==void 0?t.yMax:160,this.yLabel=t.yLabel||"Value",this.pens=[{id:"casPriPV",name:"Cascade Temp PV (°C)",color:"#06b6d4",width:2.5,visible:!0,style:"solid"},{id:"casPriSP",name:"Cascade Temp SP (°C)",color:"#38bdf8",width:1.5,visible:!0,style:"dashed"},{id:"convPV",name:"Conventional Temp PV (°C)",color:"#f43f5e",width:2.5,visible:!0,style:"solid"},{id:"casSecPV",name:"Steam Flow PV (%)",color:"#f59e0b",width:2,visible:!0,style:"solid"},{id:"casValvePos",name:"Valve Stem (%)",color:"#10b981",width:1.8,visible:!1,style:"solid"},{id:"steamPressure",name:"Steam Header Press (%)",color:"#a855f7",width:1.8,visible:!0,style:"dotted"}],this.dataPoints=[],this.paused=!1,this.resize(),window.addEventListener("resize",()=>this.resize())}resize(){const e=this.canvas.getBoundingClientRect(),t=window.devicePixelRatio||1;this.width=e.width,this.height=e.height,this.canvas.width=e.width*t,this.canvas.height=e.height*t,this.ctx.resetTransform(),this.ctx.scale(t,t)}addPoint(e){if(!this.paused)for(this.dataPoints.push(e);this.dataPoints.length>2500;)this.dataPoints.shift()}clear(){this.dataPoints=[],this.render()}setPenVisibility(e,t){const n=this.pens.find(r=>r.id===e);n&&(n.visible=t)}render(){const e=this.ctx,t=this.width,n=this.height;if(!t||!n)return;const r=55,a=20,s=25,o=30,l=t-r-a,c=n-s-o;e.fillStyle="#0b0f19",e.fillRect(0,0,t,n),e.fillStyle="#111827",e.fillRect(r,s,l,c),e.strokeStyle="#1f293d",e.lineWidth=1,e.fillStyle="#94a3b8",e.font='11px "JetBrains Mono", monospace',e.textAlign="right",e.textBaseline="middle";const u=5;for(let y=0;y<=u;y++){const g=y/u,p=this.yMin+g*(this.yMax-this.yMin),A=s+c-g*c;e.beginPath(),e.moveTo(r,A),e.lineTo(r+l,A),e.stroke(),e.fillText(p.toFixed(0),r-8,A)}const h=this.dataPoints.length>0?this.dataPoints[this.dataPoints.length-1].time:0,f=Math.max(0,h-this.timeWindowMinutes),m=6;e.textAlign="center",e.textBaseline="top";for(let y=0;y<=m;y++){const g=y/m,p=f+g*(h-f||this.timeWindowMinutes),A=r+g*l;e.beginPath(),e.moveTo(A,s),e.lineTo(A,s+c),e.stroke(),e.fillText(`${p.toFixed(1)}m`,A,s+c+8)}if(this.dataPoints.length<2)return;e.save(),e.beginPath(),e.rect(r,s,l,c),e.clip();const x=Math.max(.1,h-f);for(const y of this.pens){if(!y.visible)continue;e.strokeStyle=y.color,e.lineWidth=y.width,y.style==="dashed"?e.setLineDash([6,4]):y.style==="dotted"?e.setLineDash([3,3]):e.setLineDash([]),e.beginPath();let g=!1;for(let p=0;p<this.dataPoints.length;p++){const A=this.dataPoints[p];if(A.time<f)continue;const C=(A.time-f)/x,S=r+C*l,N=A[y.id];if(N===void 0||isNaN(N))continue;const I=(N-this.yMin)/(this.yMax-this.yMin),D=s+c-I*c;g?e.lineTo(S,D):(e.moveTo(S,D),g=!0)}e.stroke()}e.restore(),e.strokeStyle="#334155",e.lineWidth=1,e.setLineDash([]),e.strokeRect(r,s,l,c)}}/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const _0="170",Ah=0,el=1,Ch=2,Vc=1,Rh=2,jn=3,Mi=0,sn=1,An=2,yi=0,hr=1,ho=2,tl=3,nl=4,Ph=5,Bi=100,Dh=101,Ih=102,Lh=103,Fh=104,Uh=200,Nh=201,kh=202,zh=203,fo=204,po=205,Oh=206,Bh=207,Hh=208,Vh=209,Gh=210,Wh=211,qh=212,Xh=213,$h=214,mo=0,vo=1,go=2,mr=3,xo=4,yo=5,_o=6,bo=7,Gc=0,Yh=1,Kh=2,_i=0,jh=1,Zh=2,Jh=3,Qh=4,ed=5,td=6,nd=7,Wc=300,vr=301,gr=302,Mo=303,So=304,Ja=306,wo=1e3,Gi=1001,To=1002,Pn=1003,id=1004,ia=1005,Un=1006,xs=1007,Wi=1008,ni=1009,qc=1010,Xc=1011,Gr=1012,b0=1013,qi=1014,Jn=1015,Yr=1016,M0=1017,S0=1018,xr=1020,$c=35902,Yc=1021,Kc=1022,Rn=1023,jc=1024,Zc=1025,dr=1026,yr=1027,Jc=1028,w0=1029,Qc=1030,T0=1031,E0=1033,Fa=33776,Ua=33777,Na=33778,ka=33779,Eo=35840,Ao=35841,Co=35842,Ro=35843,Po=36196,Do=37492,Io=37496,Lo=37808,Fo=37809,Uo=37810,No=37811,ko=37812,zo=37813,Oo=37814,Bo=37815,Ho=37816,Vo=37817,Go=37818,Wo=37819,qo=37820,Xo=37821,za=36492,$o=36494,Yo=36495,eu=36283,Ko=36284,jo=36285,Zo=36286,rd=3200,ad=3201,tu=0,sd=1,gi="",xn="srgb",wr="srgb-linear",Qa="linear",gt="srgb",Ki=7680,il=519,od=512,ld=513,cd=514,nu=515,ud=516,hd=517,dd=518,fd=519,rl=35044,al="300 es",Qn=2e3,Va=2001;class Tr{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){if(this._listeners===void 0)return!1;const n=this._listeners;return n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){if(this._listeners===void 0)return;const r=this._listeners[e];if(r!==void 0){const a=r.indexOf(t);a!==-1&&r.splice(a,1)}}dispatchEvent(e){if(this._listeners===void 0)return;const n=this._listeners[e.type];if(n!==void 0){e.target=this;const r=n.slice(0);for(let a=0,s=r.length;a<s;a++)r[a].call(this,e);e.target=null}}}const Wt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],ys=Math.PI/180,Jo=180/Math.PI;function Kr(){const i=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Wt[i&255]+Wt[i>>8&255]+Wt[i>>16&255]+Wt[i>>24&255]+"-"+Wt[e&255]+Wt[e>>8&255]+"-"+Wt[e>>16&15|64]+Wt[e>>24&255]+"-"+Wt[t&63|128]+Wt[t>>8&255]+"-"+Wt[t>>16&255]+Wt[t>>24&255]+Wt[n&255]+Wt[n>>8&255]+Wt[n>>16&255]+Wt[n>>24&255]).toLowerCase()}function Zt(i,e,t){return Math.max(e,Math.min(t,i))}function pd(i,e){return(i%e+e)%e}function _s(i,e,t){return(1-t)*i+t*e}function Fr(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function nn(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}class ut{constructor(e=0,t=0){ut.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,n=this.y,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6],this.y=r[1]*t+r[4]*n+r[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(Zt(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const n=Math.cos(t),r=Math.sin(t),a=this.x-e.x,s=this.y-e.y;return this.x=a*n-s*r+e.x,this.y=a*r+s*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Je{constructor(e,t,n,r,a,s,o,l,c){Je.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,r,a,s,o,l,c)}set(e,t,n,r,a,s,o,l,c){const u=this.elements;return u[0]=e,u[1]=r,u[2]=o,u[3]=t,u[4]=a,u[5]=l,u[6]=n,u[7]=s,u[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,r=t.elements,a=this.elements,s=n[0],o=n[3],l=n[6],c=n[1],u=n[4],h=n[7],f=n[2],m=n[5],x=n[8],y=r[0],g=r[3],p=r[6],A=r[1],C=r[4],S=r[7],N=r[2],I=r[5],D=r[8];return a[0]=s*y+o*A+l*N,a[3]=s*g+o*C+l*I,a[6]=s*p+o*S+l*D,a[1]=c*y+u*A+h*N,a[4]=c*g+u*C+h*I,a[7]=c*p+u*S+h*D,a[2]=f*y+m*A+x*N,a[5]=f*g+m*C+x*I,a[8]=f*p+m*S+x*D,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[1],r=e[2],a=e[3],s=e[4],o=e[5],l=e[6],c=e[7],u=e[8];return t*s*u-t*o*c-n*a*u+n*o*l+r*a*c-r*s*l}invert(){const e=this.elements,t=e[0],n=e[1],r=e[2],a=e[3],s=e[4],o=e[5],l=e[6],c=e[7],u=e[8],h=u*s-o*c,f=o*l-u*a,m=c*a-s*l,x=t*h+n*f+r*m;if(x===0)return this.set(0,0,0,0,0,0,0,0,0);const y=1/x;return e[0]=h*y,e[1]=(r*c-u*n)*y,e[2]=(o*n-r*s)*y,e[3]=f*y,e[4]=(u*t-r*l)*y,e[5]=(r*a-o*t)*y,e[6]=m*y,e[7]=(n*l-c*t)*y,e[8]=(s*t-n*a)*y,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,r,a,s,o){const l=Math.cos(a),c=Math.sin(a);return this.set(n*l,n*c,-n*(l*s+c*o)+s+e,-r*c,r*l,-r*(-c*s+l*o)+o+t,0,0,1),this}scale(e,t){return this.premultiply(bs.makeScale(e,t)),this}rotate(e){return this.premultiply(bs.makeRotation(-e)),this}translate(e,t){return this.premultiply(bs.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,n=e.elements;for(let r=0;r<9;r++)if(t[r]!==n[r])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const bs=new Je;function iu(i){for(let e=i.length-1;e>=0;--e)if(i[e]>=65535)return!0;return!1}function Ga(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function md(){const i=Ga("canvas");return i.style.display="block",i}const sl={};function Or(i){i in sl||(sl[i]=!0,console.warn(i))}function vd(i,e,t){return new Promise(function(n,r){function a(){switch(i.clientWaitSync(e,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:r();break;case i.TIMEOUT_EXPIRED:setTimeout(a,t);break;default:n()}}setTimeout(a,t)})}function gd(i){const e=i.elements;e[2]=.5*e[2]+.5*e[3],e[6]=.5*e[6]+.5*e[7],e[10]=.5*e[10]+.5*e[11],e[14]=.5*e[14]+.5*e[15]}function xd(i){const e=i.elements;e[11]===-1?(e[10]=-e[10]-1,e[14]=-e[14]):(e[10]=-e[10],e[14]=-e[14]+1)}const ot={enabled:!0,workingColorSpace:wr,spaces:{},convert:function(i,e,t){return this.enabled===!1||e===t||!e||!t||(this.spaces[e].transfer===gt&&(i.r=ei(i.r),i.g=ei(i.g),i.b=ei(i.b)),this.spaces[e].primaries!==this.spaces[t].primaries&&(i.applyMatrix3(this.spaces[e].toXYZ),i.applyMatrix3(this.spaces[t].fromXYZ)),this.spaces[t].transfer===gt&&(i.r=fr(i.r),i.g=fr(i.g),i.b=fr(i.b))),i},fromWorkingColorSpace:function(i,e){return this.convert(i,this.workingColorSpace,e)},toWorkingColorSpace:function(i,e){return this.convert(i,e,this.workingColorSpace)},getPrimaries:function(i){return this.spaces[i].primaries},getTransfer:function(i){return i===gi?Qa:this.spaces[i].transfer},getLuminanceCoefficients:function(i,e=this.workingColorSpace){return i.fromArray(this.spaces[e].luminanceCoefficients)},define:function(i){Object.assign(this.spaces,i)},_getMatrix:function(i,e,t){return i.copy(this.spaces[e].toXYZ).multiply(this.spaces[t].fromXYZ)},_getDrawingBufferColorSpace:function(i){return this.spaces[i].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(i=this.workingColorSpace){return this.spaces[i].workingColorSpaceConfig.unpackColorSpace}};function ei(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function fr(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}const ol=[.64,.33,.3,.6,.15,.06],ll=[.2126,.7152,.0722],cl=[.3127,.329],ul=new Je().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),hl=new Je().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);ot.define({[wr]:{primaries:ol,whitePoint:cl,transfer:Qa,toXYZ:ul,fromXYZ:hl,luminanceCoefficients:ll,workingColorSpaceConfig:{unpackColorSpace:xn},outputColorSpaceConfig:{drawingBufferColorSpace:xn}},[xn]:{primaries:ol,whitePoint:cl,transfer:gt,toXYZ:ul,fromXYZ:hl,luminanceCoefficients:ll,outputColorSpaceConfig:{drawingBufferColorSpace:xn}}});let ji;class yd{static getDataURL(e){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let t;if(e instanceof HTMLCanvasElement)t=e;else{ji===void 0&&(ji=Ga("canvas")),ji.width=e.width,ji.height=e.height;const n=ji.getContext("2d");e instanceof ImageData?n.putImageData(e,0,0):n.drawImage(e,0,0,e.width,e.height),t=ji}return t.width>2048||t.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",e),t.toDataURL("image/jpeg",.6)):t.toDataURL("image/png")}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=Ga("canvas");t.width=e.width,t.height=e.height;const n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);const r=n.getImageData(0,0,e.width,e.height),a=r.data;for(let s=0;s<a.length;s++)a[s]=ei(a[s]/255)*255;return n.putImageData(r,0,0),t}else if(e.data){const t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(ei(t[n]/255)*255):t[n]=ei(t[n]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let _d=0;class ru{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:_d++}),this.uuid=Kr(),this.data=e,this.dataReady=!0,this.version=0}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const n={uuid:this.uuid,url:""},r=this.data;if(r!==null){let a;if(Array.isArray(r)){a=[];for(let s=0,o=r.length;s<o;s++)r[s].isDataTexture?a.push(Ms(r[s].image)):a.push(Ms(r[s]))}else a=Ms(r);n.url=a}return t||(e.images[this.uuid]=n),n}}function Ms(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?yd.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let bd=0;class on extends Tr{constructor(e=on.DEFAULT_IMAGE,t=on.DEFAULT_MAPPING,n=Gi,r=Gi,a=Un,s=Wi,o=Rn,l=ni,c=on.DEFAULT_ANISOTROPY,u=gi){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:bd++}),this.uuid=Kr(),this.name="",this.source=new ru(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=r,this.magFilter=a,this.minFilter=s,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new ut(0,0),this.repeat=new ut(1,1),this.center=new ut(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Je,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const n={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==Wc)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case wo:e.x=e.x-Math.floor(e.x);break;case Gi:e.x=e.x<0?0:1;break;case To:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case wo:e.y=e.y-Math.floor(e.y);break;case Gi:e.y=e.y<0?0:1;break;case To:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}on.DEFAULT_IMAGE=null;on.DEFAULT_MAPPING=Wc;on.DEFAULT_ANISOTROPY=1;class It{constructor(e=0,t=0,n=0,r=1){It.prototype.isVector4=!0,this.x=e,this.y=t,this.z=n,this.w=r}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,r){return this.x=e,this.y=t,this.z=n,this.w=r,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,n=this.y,r=this.z,a=this.w,s=e.elements;return this.x=s[0]*t+s[4]*n+s[8]*r+s[12]*a,this.y=s[1]*t+s[5]*n+s[9]*r+s[13]*a,this.z=s[2]*t+s[6]*n+s[10]*r+s[14]*a,this.w=s[3]*t+s[7]*n+s[11]*r+s[15]*a,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,r,a;const l=e.elements,c=l[0],u=l[4],h=l[8],f=l[1],m=l[5],x=l[9],y=l[2],g=l[6],p=l[10];if(Math.abs(u-f)<.01&&Math.abs(h-y)<.01&&Math.abs(x-g)<.01){if(Math.abs(u+f)<.1&&Math.abs(h+y)<.1&&Math.abs(x+g)<.1&&Math.abs(c+m+p-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const C=(c+1)/2,S=(m+1)/2,N=(p+1)/2,I=(u+f)/4,D=(h+y)/4,U=(x+g)/4;return C>S&&C>N?C<.01?(n=0,r=.707106781,a=.707106781):(n=Math.sqrt(C),r=I/n,a=D/n):S>N?S<.01?(n=.707106781,r=0,a=.707106781):(r=Math.sqrt(S),n=I/r,a=U/r):N<.01?(n=.707106781,r=.707106781,a=0):(a=Math.sqrt(N),n=D/a,r=U/a),this.set(n,r,a,t),this}let A=Math.sqrt((g-x)*(g-x)+(h-y)*(h-y)+(f-u)*(f-u));return Math.abs(A)<.001&&(A=1),this.x=(g-x)/A,this.y=(h-y)/A,this.z=(f-u)/A,this.w=Math.acos((c+m+p-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this.w=Math.max(e.w,Math.min(t.w,this.w)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this.w=Math.max(e,Math.min(t,this.w)),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class Md extends Tr{constructor(e=1,t=1,n={}){super(),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=1,this.scissor=new It(0,0,e,t),this.scissorTest=!1,this.viewport=new It(0,0,e,t);const r={width:e,height:t,depth:1};n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Un,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},n);const a=new on(r,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace);a.flipY=!1,a.generateMipmaps=n.generateMipmaps,a.internalFormat=n.internalFormat,this.textures=[];const s=n.count;for(let o=0;o<s;o++)this.textures[o]=a.clone(),this.textures[o].isRenderTargetTexture=!0;this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.depthTexture=n.depthTexture,this.samples=n.samples}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let r=0,a=this.textures.length;r<a;r++)this.textures[r].image.width=e,this.textures[r].image.height=t,this.textures[r].image.depth=n;this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let n=0,r=e.textures.length;n<r;n++)this.textures[n]=e.textures[n].clone(),this.textures[n].isRenderTargetTexture=!0;const t=Object.assign({},e.texture.image);return this.texture.source=new ru(t),this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Xi extends Md{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}}class au extends on{constructor(e=null,t=1,n=1,r=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:r},this.magFilter=Pn,this.minFilter=Pn,this.wrapR=Gi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class Sd extends on{constructor(e=null,t=1,n=1,r=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:r},this.magFilter=Pn,this.minFilter=Pn,this.wrapR=Gi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class jr{constructor(e=0,t=0,n=0,r=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=r}static slerpFlat(e,t,n,r,a,s,o){let l=n[r+0],c=n[r+1],u=n[r+2],h=n[r+3];const f=a[s+0],m=a[s+1],x=a[s+2],y=a[s+3];if(o===0){e[t+0]=l,e[t+1]=c,e[t+2]=u,e[t+3]=h;return}if(o===1){e[t+0]=f,e[t+1]=m,e[t+2]=x,e[t+3]=y;return}if(h!==y||l!==f||c!==m||u!==x){let g=1-o;const p=l*f+c*m+u*x+h*y,A=p>=0?1:-1,C=1-p*p;if(C>Number.EPSILON){const N=Math.sqrt(C),I=Math.atan2(N,p*A);g=Math.sin(g*I)/N,o=Math.sin(o*I)/N}const S=o*A;if(l=l*g+f*S,c=c*g+m*S,u=u*g+x*S,h=h*g+y*S,g===1-o){const N=1/Math.sqrt(l*l+c*c+u*u+h*h);l*=N,c*=N,u*=N,h*=N}}e[t]=l,e[t+1]=c,e[t+2]=u,e[t+3]=h}static multiplyQuaternionsFlat(e,t,n,r,a,s){const o=n[r],l=n[r+1],c=n[r+2],u=n[r+3],h=a[s],f=a[s+1],m=a[s+2],x=a[s+3];return e[t]=o*x+u*h+l*m-c*f,e[t+1]=l*x+u*f+c*h-o*m,e[t+2]=c*x+u*m+o*f-l*h,e[t+3]=u*x-o*h-l*f-c*m,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,r){return this._x=e,this._y=t,this._z=n,this._w=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const n=e._x,r=e._y,a=e._z,s=e._order,o=Math.cos,l=Math.sin,c=o(n/2),u=o(r/2),h=o(a/2),f=l(n/2),m=l(r/2),x=l(a/2);switch(s){case"XYZ":this._x=f*u*h+c*m*x,this._y=c*m*h-f*u*x,this._z=c*u*x+f*m*h,this._w=c*u*h-f*m*x;break;case"YXZ":this._x=f*u*h+c*m*x,this._y=c*m*h-f*u*x,this._z=c*u*x-f*m*h,this._w=c*u*h+f*m*x;break;case"ZXY":this._x=f*u*h-c*m*x,this._y=c*m*h+f*u*x,this._z=c*u*x+f*m*h,this._w=c*u*h-f*m*x;break;case"ZYX":this._x=f*u*h-c*m*x,this._y=c*m*h+f*u*x,this._z=c*u*x-f*m*h,this._w=c*u*h+f*m*x;break;case"YZX":this._x=f*u*h+c*m*x,this._y=c*m*h+f*u*x,this._z=c*u*x-f*m*h,this._w=c*u*h-f*m*x;break;case"XZY":this._x=f*u*h-c*m*x,this._y=c*m*h-f*u*x,this._z=c*u*x+f*m*h,this._w=c*u*h+f*m*x;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+s)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const n=t/2,r=Math.sin(n);return this._x=e.x*r,this._y=e.y*r,this._z=e.z*r,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,n=t[0],r=t[4],a=t[8],s=t[1],o=t[5],l=t[9],c=t[2],u=t[6],h=t[10],f=n+o+h;if(f>0){const m=.5/Math.sqrt(f+1);this._w=.25/m,this._x=(u-l)*m,this._y=(a-c)*m,this._z=(s-r)*m}else if(n>o&&n>h){const m=2*Math.sqrt(1+n-o-h);this._w=(u-l)/m,this._x=.25*m,this._y=(r+s)/m,this._z=(a+c)/m}else if(o>h){const m=2*Math.sqrt(1+o-n-h);this._w=(a-c)/m,this._x=(r+s)/m,this._y=.25*m,this._z=(l+u)/m}else{const m=2*Math.sqrt(1+h-n-o);this._w=(s-r)/m,this._x=(a+c)/m,this._y=(l+u)/m,this._z=.25*m}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<Number.EPSILON?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(Zt(this.dot(e),-1,1)))}rotateTowards(e,t){const n=this.angleTo(e);if(n===0)return this;const r=Math.min(1,t/n);return this.slerp(e,r),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const n=e._x,r=e._y,a=e._z,s=e._w,o=t._x,l=t._y,c=t._z,u=t._w;return this._x=n*u+s*o+r*c-a*l,this._y=r*u+s*l+a*o-n*c,this._z=a*u+s*c+n*l-r*o,this._w=s*u-n*o-r*l-a*c,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);const n=this._x,r=this._y,a=this._z,s=this._w;let o=s*e._w+n*e._x+r*e._y+a*e._z;if(o<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,o=-o):this.copy(e),o>=1)return this._w=s,this._x=n,this._y=r,this._z=a,this;const l=1-o*o;if(l<=Number.EPSILON){const m=1-t;return this._w=m*s+t*this._w,this._x=m*n+t*this._x,this._y=m*r+t*this._y,this._z=m*a+t*this._z,this.normalize(),this}const c=Math.sqrt(l),u=Math.atan2(c,o),h=Math.sin((1-t)*u)/c,f=Math.sin(t*u)/c;return this._w=s*h+this._w*f,this._x=n*h+this._x*f,this._y=r*h+this._y*f,this._z=a*h+this._z*f,this._onChangeCallback(),this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),r=Math.sqrt(1-n),a=Math.sqrt(n);return this.set(r*Math.sin(e),r*Math.cos(e),a*Math.sin(t),a*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class q{constructor(e=0,t=0,n=0){q.prototype.isVector3=!0,this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(dl.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(dl.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,n=this.y,r=this.z,a=e.elements;return this.x=a[0]*t+a[3]*n+a[6]*r,this.y=a[1]*t+a[4]*n+a[7]*r,this.z=a[2]*t+a[5]*n+a[8]*r,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,n=this.y,r=this.z,a=e.elements,s=1/(a[3]*t+a[7]*n+a[11]*r+a[15]);return this.x=(a[0]*t+a[4]*n+a[8]*r+a[12])*s,this.y=(a[1]*t+a[5]*n+a[9]*r+a[13])*s,this.z=(a[2]*t+a[6]*n+a[10]*r+a[14])*s,this}applyQuaternion(e){const t=this.x,n=this.y,r=this.z,a=e.x,s=e.y,o=e.z,l=e.w,c=2*(s*r-o*n),u=2*(o*t-a*r),h=2*(a*n-s*t);return this.x=t+l*c+s*h-o*u,this.y=n+l*u+o*c-a*h,this.z=r+l*h+a*u-s*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,n=this.y,r=this.z,a=e.elements;return this.x=a[0]*t+a[4]*n+a[8]*r,this.y=a[1]*t+a[5]*n+a[9]*r,this.z=a[2]*t+a[6]*n+a[10]*r,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const n=e.x,r=e.y,a=e.z,s=t.x,o=t.y,l=t.z;return this.x=r*l-a*o,this.y=a*s-n*l,this.z=n*o-r*s,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return Ss.copy(this).projectOnVector(e),this.sub(Ss)}reflect(e){return this.sub(Ss.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(Zt(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y,r=this.z-e.z;return t*t+n*n+r*r}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){const r=Math.sin(t)*e;return this.x=r*Math.sin(n),this.y=Math.cos(t)*e,this.z=r*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),r=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=r,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const Ss=new q,dl=new jr;class Zr{constructor(e=new q(1/0,1/0,1/0),t=new q(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(wn.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(wn.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const n=wn.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const n=e.geometry;if(n!==void 0){const a=n.getAttribute("position");if(t===!0&&a!==void 0&&e.isInstancedMesh!==!0)for(let s=0,o=a.count;s<o;s++)e.isMesh===!0?e.getVertexPosition(s,wn):wn.fromBufferAttribute(a,s),wn.applyMatrix4(e.matrixWorld),this.expandByPoint(wn);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),ra.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),ra.copy(n.boundingBox)),ra.applyMatrix4(e.matrixWorld),this.union(ra)}const r=e.children;for(let a=0,s=r.length;a<s;a++)this.expandByObject(r[a],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,wn),wn.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Ur),aa.subVectors(this.max,Ur),Zi.subVectors(e.a,Ur),Ji.subVectors(e.b,Ur),Qi.subVectors(e.c,Ur),ci.subVectors(Ji,Zi),ui.subVectors(Qi,Ji),Pi.subVectors(Zi,Qi);let t=[0,-ci.z,ci.y,0,-ui.z,ui.y,0,-Pi.z,Pi.y,ci.z,0,-ci.x,ui.z,0,-ui.x,Pi.z,0,-Pi.x,-ci.y,ci.x,0,-ui.y,ui.x,0,-Pi.y,Pi.x,0];return!ws(t,Zi,Ji,Qi,aa)||(t=[1,0,0,0,1,0,0,0,1],!ws(t,Zi,Ji,Qi,aa))?!1:(sa.crossVectors(ci,ui),t=[sa.x,sa.y,sa.z],ws(t,Zi,Ji,Qi,aa))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,wn).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(wn).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Wn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Wn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Wn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Wn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Wn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Wn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Wn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Wn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Wn),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}}const Wn=[new q,new q,new q,new q,new q,new q,new q,new q],wn=new q,ra=new Zr,Zi=new q,Ji=new q,Qi=new q,ci=new q,ui=new q,Pi=new q,Ur=new q,aa=new q,sa=new q,Di=new q;function ws(i,e,t,n,r){for(let a=0,s=i.length-3;a<=s;a+=3){Di.fromArray(i,a);const o=r.x*Math.abs(Di.x)+r.y*Math.abs(Di.y)+r.z*Math.abs(Di.z),l=e.dot(Di),c=t.dot(Di),u=n.dot(Di);if(Math.max(-Math.max(l,c,u),Math.min(l,c,u))>o)return!1}return!0}const wd=new Zr,Nr=new q,Ts=new q;class es{constructor(e=new q,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const n=this.center;t!==void 0?n.copy(t):wd.setFromPoints(e).getCenter(n);let r=0;for(let a=0,s=e.length;a<s;a++)r=Math.max(r,n.distanceToSquared(e[a]));return this.radius=Math.sqrt(r),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Nr.subVectors(e,this.center);const t=Nr.lengthSq();if(t>this.radius*this.radius){const n=Math.sqrt(t),r=(n-this.radius)*.5;this.center.addScaledVector(Nr,r/n),this.radius+=r}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Ts.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Nr.copy(e.center).add(Ts)),this.expandByPoint(Nr.copy(e.center).sub(Ts))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}}const qn=new q,Es=new q,oa=new q,hi=new q,As=new q,la=new q,Cs=new q;class su{constructor(e=new q,t=new q(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,qn)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=qn.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(qn.copy(this.origin).addScaledVector(this.direction,t),qn.distanceToSquared(e))}distanceSqToSegment(e,t,n,r){Es.copy(e).add(t).multiplyScalar(.5),oa.copy(t).sub(e).normalize(),hi.copy(this.origin).sub(Es);const a=e.distanceTo(t)*.5,s=-this.direction.dot(oa),o=hi.dot(this.direction),l=-hi.dot(oa),c=hi.lengthSq(),u=Math.abs(1-s*s);let h,f,m,x;if(u>0)if(h=s*l-o,f=s*o-l,x=a*u,h>=0)if(f>=-x)if(f<=x){const y=1/u;h*=y,f*=y,m=h*(h+s*f+2*o)+f*(s*h+f+2*l)+c}else f=a,h=Math.max(0,-(s*f+o)),m=-h*h+f*(f+2*l)+c;else f=-a,h=Math.max(0,-(s*f+o)),m=-h*h+f*(f+2*l)+c;else f<=-x?(h=Math.max(0,-(-s*a+o)),f=h>0?-a:Math.min(Math.max(-a,-l),a),m=-h*h+f*(f+2*l)+c):f<=x?(h=0,f=Math.min(Math.max(-a,-l),a),m=f*(f+2*l)+c):(h=Math.max(0,-(s*a+o)),f=h>0?a:Math.min(Math.max(-a,-l),a),m=-h*h+f*(f+2*l)+c);else f=s>0?-a:a,h=Math.max(0,-(s*f+o)),m=-h*h+f*(f+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,h),r&&r.copy(Es).addScaledVector(oa,f),m}intersectSphere(e,t){qn.subVectors(e.center,this.origin);const n=qn.dot(this.direction),r=qn.dot(qn)-n*n,a=e.radius*e.radius;if(r>a)return null;const s=Math.sqrt(a-r),o=n-s,l=n+s;return l<0?null:o<0?this.at(l,t):this.at(o,t)}intersectsSphere(e){return this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){const n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,r,a,s,o,l;const c=1/this.direction.x,u=1/this.direction.y,h=1/this.direction.z,f=this.origin;return c>=0?(n=(e.min.x-f.x)*c,r=(e.max.x-f.x)*c):(n=(e.max.x-f.x)*c,r=(e.min.x-f.x)*c),u>=0?(a=(e.min.y-f.y)*u,s=(e.max.y-f.y)*u):(a=(e.max.y-f.y)*u,s=(e.min.y-f.y)*u),n>s||a>r||((a>n||isNaN(n))&&(n=a),(s<r||isNaN(r))&&(r=s),h>=0?(o=(e.min.z-f.z)*h,l=(e.max.z-f.z)*h):(o=(e.max.z-f.z)*h,l=(e.min.z-f.z)*h),n>l||o>r)||((o>n||n!==n)&&(n=o),(l<r||r!==r)&&(r=l),r<0)?null:this.at(n>=0?n:r,t)}intersectsBox(e){return this.intersectBox(e,qn)!==null}intersectTriangle(e,t,n,r,a){As.subVectors(t,e),la.subVectors(n,e),Cs.crossVectors(As,la);let s=this.direction.dot(Cs),o;if(s>0){if(r)return null;o=1}else if(s<0)o=-1,s=-s;else return null;hi.subVectors(this.origin,e);const l=o*this.direction.dot(la.crossVectors(hi,la));if(l<0)return null;const c=o*this.direction.dot(As.cross(hi));if(c<0||l+c>s)return null;const u=-o*hi.dot(Cs);return u<0?null:this.at(u/s,a)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class Ct{constructor(e,t,n,r,a,s,o,l,c,u,h,f,m,x,y,g){Ct.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,r,a,s,o,l,c,u,h,f,m,x,y,g)}set(e,t,n,r,a,s,o,l,c,u,h,f,m,x,y,g){const p=this.elements;return p[0]=e,p[4]=t,p[8]=n,p[12]=r,p[1]=a,p[5]=s,p[9]=o,p[13]=l,p[2]=c,p[6]=u,p[10]=h,p[14]=f,p[3]=m,p[7]=x,p[11]=y,p[15]=g,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Ct().fromArray(this.elements)}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){const t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){const t=this.elements,n=e.elements,r=1/er.setFromMatrixColumn(e,0).length(),a=1/er.setFromMatrixColumn(e,1).length(),s=1/er.setFromMatrixColumn(e,2).length();return t[0]=n[0]*r,t[1]=n[1]*r,t[2]=n[2]*r,t[3]=0,t[4]=n[4]*a,t[5]=n[5]*a,t[6]=n[6]*a,t[7]=0,t[8]=n[8]*s,t[9]=n[9]*s,t[10]=n[10]*s,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,n=e.x,r=e.y,a=e.z,s=Math.cos(n),o=Math.sin(n),l=Math.cos(r),c=Math.sin(r),u=Math.cos(a),h=Math.sin(a);if(e.order==="XYZ"){const f=s*u,m=s*h,x=o*u,y=o*h;t[0]=l*u,t[4]=-l*h,t[8]=c,t[1]=m+x*c,t[5]=f-y*c,t[9]=-o*l,t[2]=y-f*c,t[6]=x+m*c,t[10]=s*l}else if(e.order==="YXZ"){const f=l*u,m=l*h,x=c*u,y=c*h;t[0]=f+y*o,t[4]=x*o-m,t[8]=s*c,t[1]=s*h,t[5]=s*u,t[9]=-o,t[2]=m*o-x,t[6]=y+f*o,t[10]=s*l}else if(e.order==="ZXY"){const f=l*u,m=l*h,x=c*u,y=c*h;t[0]=f-y*o,t[4]=-s*h,t[8]=x+m*o,t[1]=m+x*o,t[5]=s*u,t[9]=y-f*o,t[2]=-s*c,t[6]=o,t[10]=s*l}else if(e.order==="ZYX"){const f=s*u,m=s*h,x=o*u,y=o*h;t[0]=l*u,t[4]=x*c-m,t[8]=f*c+y,t[1]=l*h,t[5]=y*c+f,t[9]=m*c-x,t[2]=-c,t[6]=o*l,t[10]=s*l}else if(e.order==="YZX"){const f=s*l,m=s*c,x=o*l,y=o*c;t[0]=l*u,t[4]=y-f*h,t[8]=x*h+m,t[1]=h,t[5]=s*u,t[9]=-o*u,t[2]=-c*u,t[6]=m*h+x,t[10]=f-y*h}else if(e.order==="XZY"){const f=s*l,m=s*c,x=o*l,y=o*c;t[0]=l*u,t[4]=-h,t[8]=c*u,t[1]=f*h+y,t[5]=s*u,t[9]=m*h-x,t[2]=x*h-m,t[6]=o*u,t[10]=y*h+f}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(Td,e,Ed)}lookAt(e,t,n){const r=this.elements;return cn.subVectors(e,t),cn.lengthSq()===0&&(cn.z=1),cn.normalize(),di.crossVectors(n,cn),di.lengthSq()===0&&(Math.abs(n.z)===1?cn.x+=1e-4:cn.z+=1e-4,cn.normalize(),di.crossVectors(n,cn)),di.normalize(),ca.crossVectors(cn,di),r[0]=di.x,r[4]=ca.x,r[8]=cn.x,r[1]=di.y,r[5]=ca.y,r[9]=cn.y,r[2]=di.z,r[6]=ca.z,r[10]=cn.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,r=t.elements,a=this.elements,s=n[0],o=n[4],l=n[8],c=n[12],u=n[1],h=n[5],f=n[9],m=n[13],x=n[2],y=n[6],g=n[10],p=n[14],A=n[3],C=n[7],S=n[11],N=n[15],I=r[0],D=r[4],U=r[8],T=r[12],w=r[1],F=r[5],V=r[9],G=r[13],K=r[2],J=r[6],j=r[10],te=r[14],Y=r[3],fe=r[7],pe=r[11],ye=r[15];return a[0]=s*I+o*w+l*K+c*Y,a[4]=s*D+o*F+l*J+c*fe,a[8]=s*U+o*V+l*j+c*pe,a[12]=s*T+o*G+l*te+c*ye,a[1]=u*I+h*w+f*K+m*Y,a[5]=u*D+h*F+f*J+m*fe,a[9]=u*U+h*V+f*j+m*pe,a[13]=u*T+h*G+f*te+m*ye,a[2]=x*I+y*w+g*K+p*Y,a[6]=x*D+y*F+g*J+p*fe,a[10]=x*U+y*V+g*j+p*pe,a[14]=x*T+y*G+g*te+p*ye,a[3]=A*I+C*w+S*K+N*Y,a[7]=A*D+C*F+S*J+N*fe,a[11]=A*U+C*V+S*j+N*pe,a[15]=A*T+C*G+S*te+N*ye,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[4],r=e[8],a=e[12],s=e[1],o=e[5],l=e[9],c=e[13],u=e[2],h=e[6],f=e[10],m=e[14],x=e[3],y=e[7],g=e[11],p=e[15];return x*(+a*l*h-r*c*h-a*o*f+n*c*f+r*o*m-n*l*m)+y*(+t*l*m-t*c*f+a*s*f-r*s*m+r*c*u-a*l*u)+g*(+t*c*h-t*o*m-a*s*h+n*s*m+a*o*u-n*c*u)+p*(-r*o*u-t*l*h+t*o*f+r*s*h-n*s*f+n*l*u)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){const r=this.elements;return e.isVector3?(r[12]=e.x,r[13]=e.y,r[14]=e.z):(r[12]=e,r[13]=t,r[14]=n),this}invert(){const e=this.elements,t=e[0],n=e[1],r=e[2],a=e[3],s=e[4],o=e[5],l=e[6],c=e[7],u=e[8],h=e[9],f=e[10],m=e[11],x=e[12],y=e[13],g=e[14],p=e[15],A=h*g*c-y*f*c+y*l*m-o*g*m-h*l*p+o*f*p,C=x*f*c-u*g*c-x*l*m+s*g*m+u*l*p-s*f*p,S=u*y*c-x*h*c+x*o*m-s*y*m-u*o*p+s*h*p,N=x*h*l-u*y*l-x*o*f+s*y*f+u*o*g-s*h*g,I=t*A+n*C+r*S+a*N;if(I===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const D=1/I;return e[0]=A*D,e[1]=(y*f*a-h*g*a-y*r*m+n*g*m+h*r*p-n*f*p)*D,e[2]=(o*g*a-y*l*a+y*r*c-n*g*c-o*r*p+n*l*p)*D,e[3]=(h*l*a-o*f*a-h*r*c+n*f*c+o*r*m-n*l*m)*D,e[4]=C*D,e[5]=(u*g*a-x*f*a+x*r*m-t*g*m-u*r*p+t*f*p)*D,e[6]=(x*l*a-s*g*a-x*r*c+t*g*c+s*r*p-t*l*p)*D,e[7]=(s*f*a-u*l*a+u*r*c-t*f*c-s*r*m+t*l*m)*D,e[8]=S*D,e[9]=(x*h*a-u*y*a-x*n*m+t*y*m+u*n*p-t*h*p)*D,e[10]=(s*y*a-x*o*a+x*n*c-t*y*c-s*n*p+t*o*p)*D,e[11]=(u*o*a-s*h*a-u*n*c+t*h*c+s*n*m-t*o*m)*D,e[12]=N*D,e[13]=(u*y*r-x*h*r+x*n*f-t*y*f-u*n*g+t*h*g)*D,e[14]=(x*o*r-s*y*r-x*n*l+t*y*l+s*n*g-t*o*g)*D,e[15]=(s*h*r-u*o*r+u*n*l-t*h*l-s*n*f+t*o*f)*D,this}scale(e){const t=this.elements,n=e.x,r=e.y,a=e.z;return t[0]*=n,t[4]*=r,t[8]*=a,t[1]*=n,t[5]*=r,t[9]*=a,t[2]*=n,t[6]*=r,t[10]*=a,t[3]*=n,t[7]*=r,t[11]*=a,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],r=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,r))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const n=Math.cos(t),r=Math.sin(t),a=1-n,s=e.x,o=e.y,l=e.z,c=a*s,u=a*o;return this.set(c*s+n,c*o-r*l,c*l+r*o,0,c*o+r*l,u*o+n,u*l-r*s,0,c*l-r*o,u*l+r*s,a*l*l+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,r,a,s){return this.set(1,n,a,0,e,1,s,0,t,r,1,0,0,0,0,1),this}compose(e,t,n){const r=this.elements,a=t._x,s=t._y,o=t._z,l=t._w,c=a+a,u=s+s,h=o+o,f=a*c,m=a*u,x=a*h,y=s*u,g=s*h,p=o*h,A=l*c,C=l*u,S=l*h,N=n.x,I=n.y,D=n.z;return r[0]=(1-(y+p))*N,r[1]=(m+S)*N,r[2]=(x-C)*N,r[3]=0,r[4]=(m-S)*I,r[5]=(1-(f+p))*I,r[6]=(g+A)*I,r[7]=0,r[8]=(x+C)*D,r[9]=(g-A)*D,r[10]=(1-(f+y))*D,r[11]=0,r[12]=e.x,r[13]=e.y,r[14]=e.z,r[15]=1,this}decompose(e,t,n){const r=this.elements;let a=er.set(r[0],r[1],r[2]).length();const s=er.set(r[4],r[5],r[6]).length(),o=er.set(r[8],r[9],r[10]).length();this.determinant()<0&&(a=-a),e.x=r[12],e.y=r[13],e.z=r[14],Tn.copy(this);const c=1/a,u=1/s,h=1/o;return Tn.elements[0]*=c,Tn.elements[1]*=c,Tn.elements[2]*=c,Tn.elements[4]*=u,Tn.elements[5]*=u,Tn.elements[6]*=u,Tn.elements[8]*=h,Tn.elements[9]*=h,Tn.elements[10]*=h,t.setFromRotationMatrix(Tn),n.x=a,n.y=s,n.z=o,this}makePerspective(e,t,n,r,a,s,o=Qn){const l=this.elements,c=2*a/(t-e),u=2*a/(n-r),h=(t+e)/(t-e),f=(n+r)/(n-r);let m,x;if(o===Qn)m=-(s+a)/(s-a),x=-2*s*a/(s-a);else if(o===Va)m=-s/(s-a),x=-s*a/(s-a);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return l[0]=c,l[4]=0,l[8]=h,l[12]=0,l[1]=0,l[5]=u,l[9]=f,l[13]=0,l[2]=0,l[6]=0,l[10]=m,l[14]=x,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(e,t,n,r,a,s,o=Qn){const l=this.elements,c=1/(t-e),u=1/(n-r),h=1/(s-a),f=(t+e)*c,m=(n+r)*u;let x,y;if(o===Qn)x=(s+a)*h,y=-2*h;else if(o===Va)x=a*h,y=-1*h;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return l[0]=2*c,l[4]=0,l[8]=0,l[12]=-f,l[1]=0,l[5]=2*u,l[9]=0,l[13]=-m,l[2]=0,l[6]=0,l[10]=y,l[14]=-x,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(e){const t=this.elements,n=e.elements;for(let r=0;r<16;r++)if(t[r]!==n[r])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}}const er=new q,Tn=new Ct,Td=new q(0,0,0),Ed=new q(1,1,1),di=new q,ca=new q,cn=new q,fl=new Ct,pl=new jr;class zn{constructor(e=0,t=0,n=0,r=zn.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=r}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,r=this._order){return this._x=e,this._y=t,this._z=n,this._order=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){const r=e.elements,a=r[0],s=r[4],o=r[8],l=r[1],c=r[5],u=r[9],h=r[2],f=r[6],m=r[10];switch(t){case"XYZ":this._y=Math.asin(Zt(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-u,m),this._z=Math.atan2(-s,a)):(this._x=Math.atan2(f,c),this._z=0);break;case"YXZ":this._x=Math.asin(-Zt(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(o,m),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-h,a),this._z=0);break;case"ZXY":this._x=Math.asin(Zt(f,-1,1)),Math.abs(f)<.9999999?(this._y=Math.atan2(-h,m),this._z=Math.atan2(-s,c)):(this._y=0,this._z=Math.atan2(l,a));break;case"ZYX":this._y=Math.asin(-Zt(h,-1,1)),Math.abs(h)<.9999999?(this._x=Math.atan2(f,m),this._z=Math.atan2(l,a)):(this._x=0,this._z=Math.atan2(-s,c));break;case"YZX":this._z=Math.asin(Zt(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-u,c),this._y=Math.atan2(-h,a)):(this._x=0,this._y=Math.atan2(o,m));break;case"XZY":this._z=Math.asin(-Zt(s,-1,1)),Math.abs(s)<.9999999?(this._x=Math.atan2(f,c),this._y=Math.atan2(o,a)):(this._x=Math.atan2(-u,m),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return fl.makeRotationFromQuaternion(e),this.setFromRotationMatrix(fl,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return pl.setFromEuler(this),this.setFromQuaternion(pl,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}zn.DEFAULT_ORDER="XYZ";class ou{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let Ad=0;const ml=new q,tr=new jr,Xn=new Ct,ua=new q,kr=new q,Cd=new q,Rd=new jr,vl=new q(1,0,0),gl=new q(0,1,0),xl=new q(0,0,1),yl={type:"added"},Pd={type:"removed"},nr={type:"childadded",child:null},Rs={type:"childremoved",child:null};class Vt extends Tr{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Ad++}),this.uuid=Kr(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Vt.DEFAULT_UP.clone();const e=new q,t=new zn,n=new jr,r=new q(1,1,1);function a(){n.setFromEuler(t,!1)}function s(){t.setFromQuaternion(n,void 0,!1)}t._onChange(a),n._onChange(s),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:r},modelViewMatrix:{value:new Ct},normalMatrix:{value:new Je}}),this.matrix=new Ct,this.matrixWorld=new Ct,this.matrixAutoUpdate=Vt.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Vt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new ou,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return tr.setFromAxisAngle(e,t),this.quaternion.multiply(tr),this}rotateOnWorldAxis(e,t){return tr.setFromAxisAngle(e,t),this.quaternion.premultiply(tr),this}rotateX(e){return this.rotateOnAxis(vl,e)}rotateY(e){return this.rotateOnAxis(gl,e)}rotateZ(e){return this.rotateOnAxis(xl,e)}translateOnAxis(e,t){return ml.copy(e).applyQuaternion(this.quaternion),this.position.add(ml.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(vl,e)}translateY(e){return this.translateOnAxis(gl,e)}translateZ(e){return this.translateOnAxis(xl,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Xn.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?ua.copy(e):ua.set(e,t,n);const r=this.parent;this.updateWorldMatrix(!0,!1),kr.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Xn.lookAt(kr,ua,this.up):Xn.lookAt(ua,kr,this.up),this.quaternion.setFromRotationMatrix(Xn),r&&(Xn.extractRotation(r.matrixWorld),tr.setFromRotationMatrix(Xn),this.quaternion.premultiply(tr.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(yl),nr.child=e,this.dispatchEvent(nr),nr.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(Pd),Rs.child=e,this.dispatchEvent(Rs),Rs.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Xn.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Xn.multiply(e.parent.matrixWorld)),e.applyMatrix4(Xn),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(yl),nr.child=e,this.dispatchEvent(nr),nr.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,r=this.children.length;n<r;n++){const s=this.children[n].getObjectByProperty(e,t);if(s!==void 0)return s}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);const r=this.children;for(let a=0,s=r.length;a<s;a++)r[a].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(kr,e,Cd),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(kr,Rd,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t){const n=this.parent;if(e===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){const r=this.children;for(let a=0,s=r.length;a<s;a++)r[a].updateWorldMatrix(!1,!0)}}toJSON(e){const t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const r={};r.uuid=this.uuid,r.type=this.type,this.name!==""&&(r.name=this.name),this.castShadow===!0&&(r.castShadow=!0),this.receiveShadow===!0&&(r.receiveShadow=!0),this.visible===!1&&(r.visible=!1),this.frustumCulled===!1&&(r.frustumCulled=!1),this.renderOrder!==0&&(r.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(r.userData=this.userData),r.layers=this.layers.mask,r.matrix=this.matrix.toArray(),r.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(r.matrixAutoUpdate=!1),this.isInstancedMesh&&(r.type="InstancedMesh",r.count=this.count,r.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(r.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(r.type="BatchedMesh",r.perObjectFrustumCulled=this.perObjectFrustumCulled,r.sortObjects=this.sortObjects,r.drawRanges=this._drawRanges,r.reservedRanges=this._reservedRanges,r.visibility=this._visibility,r.active=this._active,r.bounds=this._bounds.map(o=>({boxInitialized:o.boxInitialized,boxMin:o.box.min.toArray(),boxMax:o.box.max.toArray(),sphereInitialized:o.sphereInitialized,sphereRadius:o.sphere.radius,sphereCenter:o.sphere.center.toArray()})),r.maxInstanceCount=this._maxInstanceCount,r.maxVertexCount=this._maxVertexCount,r.maxIndexCount=this._maxIndexCount,r.geometryInitialized=this._geometryInitialized,r.geometryCount=this._geometryCount,r.matricesTexture=this._matricesTexture.toJSON(e),this._colorsTexture!==null&&(r.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(r.boundingSphere={center:r.boundingSphere.center.toArray(),radius:r.boundingSphere.radius}),this.boundingBox!==null&&(r.boundingBox={min:r.boundingBox.min.toArray(),max:r.boundingBox.max.toArray()}));function a(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?r.background=this.background.toJSON():this.background.isTexture&&(r.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(r.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){r.geometry=a(e.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const l=o.shapes;if(Array.isArray(l))for(let c=0,u=l.length;c<u;c++){const h=l[c];a(e.shapes,h)}else a(e.shapes,l)}}if(this.isSkinnedMesh&&(r.bindMode=this.bindMode,r.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(a(e.skeletons,this.skeleton),r.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(a(e.materials,this.material[l]));r.material=o}else r.material=a(e.materials,this.material);if(this.children.length>0){r.children=[];for(let o=0;o<this.children.length;o++)r.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){r.animations=[];for(let o=0;o<this.animations.length;o++){const l=this.animations[o];r.animations.push(a(e.animations,l))}}if(t){const o=s(e.geometries),l=s(e.materials),c=s(e.textures),u=s(e.images),h=s(e.shapes),f=s(e.skeletons),m=s(e.animations),x=s(e.nodes);o.length>0&&(n.geometries=o),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),u.length>0&&(n.images=u),h.length>0&&(n.shapes=h),f.length>0&&(n.skeletons=f),m.length>0&&(n.animations=m),x.length>0&&(n.nodes=x)}return n.object=r,n;function s(o){const l=[];for(const c in o){const u=o[c];delete u.metadata,l.push(u)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){const r=e.children[n];this.add(r.clone())}return this}}Vt.DEFAULT_UP=new q(0,1,0);Vt.DEFAULT_MATRIX_AUTO_UPDATE=!0;Vt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const En=new q,$n=new q,Ps=new q,Yn=new q,ir=new q,rr=new q,_l=new q,Ds=new q,Is=new q,Ls=new q,Fs=new It,Us=new It,Ns=new It;class Cn{constructor(e=new q,t=new q,n=new q){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,r){r.subVectors(n,t),En.subVectors(e,t),r.cross(En);const a=r.lengthSq();return a>0?r.multiplyScalar(1/Math.sqrt(a)):r.set(0,0,0)}static getBarycoord(e,t,n,r,a){En.subVectors(r,t),$n.subVectors(n,t),Ps.subVectors(e,t);const s=En.dot(En),o=En.dot($n),l=En.dot(Ps),c=$n.dot($n),u=$n.dot(Ps),h=s*c-o*o;if(h===0)return a.set(0,0,0),null;const f=1/h,m=(c*l-o*u)*f,x=(s*u-o*l)*f;return a.set(1-m-x,x,m)}static containsPoint(e,t,n,r){return this.getBarycoord(e,t,n,r,Yn)===null?!1:Yn.x>=0&&Yn.y>=0&&Yn.x+Yn.y<=1}static getInterpolation(e,t,n,r,a,s,o,l){return this.getBarycoord(e,t,n,r,Yn)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(a,Yn.x),l.addScaledVector(s,Yn.y),l.addScaledVector(o,Yn.z),l)}static getInterpolatedAttribute(e,t,n,r,a,s){return Fs.setScalar(0),Us.setScalar(0),Ns.setScalar(0),Fs.fromBufferAttribute(e,t),Us.fromBufferAttribute(e,n),Ns.fromBufferAttribute(e,r),s.setScalar(0),s.addScaledVector(Fs,a.x),s.addScaledVector(Us,a.y),s.addScaledVector(Ns,a.z),s}static isFrontFacing(e,t,n,r){return En.subVectors(n,t),$n.subVectors(e,t),En.cross($n).dot(r)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,r){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[r]),this}setFromAttributeAndIndices(e,t,n,r){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,r),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return En.subVectors(this.c,this.b),$n.subVectors(this.a,this.b),En.cross($n).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return Cn.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return Cn.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,r,a){return Cn.getInterpolation(e,this.a,this.b,this.c,t,n,r,a)}containsPoint(e){return Cn.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return Cn.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const n=this.a,r=this.b,a=this.c;let s,o;ir.subVectors(r,n),rr.subVectors(a,n),Ds.subVectors(e,n);const l=ir.dot(Ds),c=rr.dot(Ds);if(l<=0&&c<=0)return t.copy(n);Is.subVectors(e,r);const u=ir.dot(Is),h=rr.dot(Is);if(u>=0&&h<=u)return t.copy(r);const f=l*h-u*c;if(f<=0&&l>=0&&u<=0)return s=l/(l-u),t.copy(n).addScaledVector(ir,s);Ls.subVectors(e,a);const m=ir.dot(Ls),x=rr.dot(Ls);if(x>=0&&m<=x)return t.copy(a);const y=m*c-l*x;if(y<=0&&c>=0&&x<=0)return o=c/(c-x),t.copy(n).addScaledVector(rr,o);const g=u*x-m*h;if(g<=0&&h-u>=0&&m-x>=0)return _l.subVectors(a,r),o=(h-u)/(h-u+(m-x)),t.copy(r).addScaledVector(_l,o);const p=1/(g+y+f);return s=y*p,o=f*p,t.copy(n).addScaledVector(ir,s).addScaledVector(rr,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const lu={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},fi={h:0,s:0,l:0},ha={h:0,s:0,l:0};function ks(i,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?i+(e-i)*6*t:t<1/2?e:t<2/3?i+(e-i)*6*(2/3-t):i}class nt{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){const r=e;r&&r.isColor?this.copy(r):typeof r=="number"?this.setHex(r):typeof r=="string"&&this.setStyle(r)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=xn){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,ot.toWorkingColorSpace(this,t),this}setRGB(e,t,n,r=ot.workingColorSpace){return this.r=e,this.g=t,this.b=n,ot.toWorkingColorSpace(this,r),this}setHSL(e,t,n,r=ot.workingColorSpace){if(e=pd(e,1),t=Zt(t,0,1),n=Zt(n,0,1),t===0)this.r=this.g=this.b=n;else{const a=n<=.5?n*(1+t):n+t-n*t,s=2*n-a;this.r=ks(s,a,e+1/3),this.g=ks(s,a,e),this.b=ks(s,a,e-1/3)}return ot.toWorkingColorSpace(this,r),this}setStyle(e,t=xn){function n(a){a!==void 0&&parseFloat(a)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let r;if(r=/^(\w+)\(([^\)]*)\)/.exec(e)){let a;const s=r[1],o=r[2];switch(s){case"rgb":case"rgba":if(a=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(a[4]),this.setRGB(Math.min(255,parseInt(a[1],10))/255,Math.min(255,parseInt(a[2],10))/255,Math.min(255,parseInt(a[3],10))/255,t);if(a=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(a[4]),this.setRGB(Math.min(100,parseInt(a[1],10))/100,Math.min(100,parseInt(a[2],10))/100,Math.min(100,parseInt(a[3],10))/100,t);break;case"hsl":case"hsla":if(a=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(a[4]),this.setHSL(parseFloat(a[1])/360,parseFloat(a[2])/100,parseFloat(a[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(r=/^\#([A-Fa-f\d]+)$/.exec(e)){const a=r[1],s=a.length;if(s===3)return this.setRGB(parseInt(a.charAt(0),16)/15,parseInt(a.charAt(1),16)/15,parseInt(a.charAt(2),16)/15,t);if(s===6)return this.setHex(parseInt(a,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=xn){const n=lu[e.toLowerCase()];return n!==void 0?this.setHex(n,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=ei(e.r),this.g=ei(e.g),this.b=ei(e.b),this}copyLinearToSRGB(e){return this.r=fr(e.r),this.g=fr(e.g),this.b=fr(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=xn){return ot.fromWorkingColorSpace(qt.copy(this),e),Math.round(Zt(qt.r*255,0,255))*65536+Math.round(Zt(qt.g*255,0,255))*256+Math.round(Zt(qt.b*255,0,255))}getHexString(e=xn){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=ot.workingColorSpace){ot.fromWorkingColorSpace(qt.copy(this),t);const n=qt.r,r=qt.g,a=qt.b,s=Math.max(n,r,a),o=Math.min(n,r,a);let l,c;const u=(o+s)/2;if(o===s)l=0,c=0;else{const h=s-o;switch(c=u<=.5?h/(s+o):h/(2-s-o),s){case n:l=(r-a)/h+(r<a?6:0);break;case r:l=(a-n)/h+2;break;case a:l=(n-r)/h+4;break}l/=6}return e.h=l,e.s=c,e.l=u,e}getRGB(e,t=ot.workingColorSpace){return ot.fromWorkingColorSpace(qt.copy(this),t),e.r=qt.r,e.g=qt.g,e.b=qt.b,e}getStyle(e=xn){ot.fromWorkingColorSpace(qt.copy(this),e);const t=qt.r,n=qt.g,r=qt.b;return e!==xn?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${r.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(r*255)})`}offsetHSL(e,t,n){return this.getHSL(fi),this.setHSL(fi.h+e,fi.s+t,fi.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(fi),e.getHSL(ha);const n=_s(fi.h,ha.h,t),r=_s(fi.s,ha.s,t),a=_s(fi.l,ha.l,t);return this.setHSL(n,r,a),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,n=this.g,r=this.b,a=e.elements;return this.r=a[0]*t+a[3]*n+a[6]*r,this.g=a[1]*t+a[4]*n+a[7]*r,this.b=a[2]*t+a[5]*n+a[8]*r,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const qt=new nt;nt.NAMES=lu;let Dd=0;class Er extends Tr{static get type(){return"Material"}get type(){return this.constructor.type}set type(e){}constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Dd++}),this.uuid=Kr(),this.name="",this.blending=hr,this.side=Mi,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=fo,this.blendDst=po,this.blendEquation=Bi,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new nt(0,0,0),this.blendAlpha=0,this.depthFunc=mr,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=il,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Ki,this.stencilZFail=Ki,this.stencilZPass=Ki,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const n=e[t];if(n===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}const r=this[t];if(r===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}r&&r.isColor?r.set(n):r&&r.isVector3&&n&&n.isVector3?r.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const n={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==hr&&(n.blending=this.blending),this.side!==Mi&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==fo&&(n.blendSrc=this.blendSrc),this.blendDst!==po&&(n.blendDst=this.blendDst),this.blendEquation!==Bi&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==mr&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==il&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Ki&&(n.stencilFail=this.stencilFail),this.stencilZFail!==Ki&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==Ki&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function r(a){const s=[];for(const o in a){const l=a[o];delete l.metadata,s.push(l)}return s}if(t){const a=r(e.textures),s=r(e.images);a.length>0&&(n.textures=a),s.length>0&&(n.images=s)}return n}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let n=null;if(t!==null){const r=t.length;n=new Array(r);for(let a=0;a!==r;++a)n[a]=t[a].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}}class Wr extends Er{static get type(){return"MeshBasicMaterial"}constructor(e){super(),this.isMeshBasicMaterial=!0,this.color=new nt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new zn,this.combine=Gc,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const Lt=new q,da=new ut;class Dn{constructor(e,t,n=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=rl,this.updateRanges=[],this.gpuType=Jn,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let r=0,a=this.itemSize;r<a;r++)this.array[e+r]=t.array[n+r];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)da.fromBufferAttribute(this,t),da.applyMatrix3(e),this.setXY(t,da.x,da.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)Lt.fromBufferAttribute(this,t),Lt.applyMatrix3(e),this.setXYZ(t,Lt.x,Lt.y,Lt.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)Lt.fromBufferAttribute(this,t),Lt.applyMatrix4(e),this.setXYZ(t,Lt.x,Lt.y,Lt.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)Lt.fromBufferAttribute(this,t),Lt.applyNormalMatrix(e),this.setXYZ(t,Lt.x,Lt.y,Lt.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)Lt.fromBufferAttribute(this,t),Lt.transformDirection(e),this.setXYZ(t,Lt.x,Lt.y,Lt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=Fr(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=nn(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=Fr(t,this.array)),t}setX(e,t){return this.normalized&&(t=nn(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=Fr(t,this.array)),t}setY(e,t){return this.normalized&&(t=nn(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=Fr(t,this.array)),t}setZ(e,t){return this.normalized&&(t=nn(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=Fr(t,this.array)),t}setW(e,t){return this.normalized&&(t=nn(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=nn(t,this.array),n=nn(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,r){return e*=this.itemSize,this.normalized&&(t=nn(t,this.array),n=nn(n,this.array),r=nn(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=r,this}setXYZW(e,t,n,r,a){return e*=this.itemSize,this.normalized&&(t=nn(t,this.array),n=nn(n,this.array),r=nn(r,this.array),a=nn(a,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=r,this.array[e+3]=a,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==rl&&(e.usage=this.usage),e}}class cu extends Dn{constructor(e,t,n){super(new Uint16Array(e),t,n)}}class uu extends Dn{constructor(e,t,n){super(new Uint32Array(e),t,n)}}class Xt extends Dn{constructor(e,t,n){super(new Float32Array(e),t,n)}}let Id=0;const gn=new Ct,zs=new Vt,ar=new q,un=new Zr,zr=new Zr,Ht=new q;class bn extends Tr{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Id++}),this.uuid=Kr(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(iu(e)?uu:cu)(e,1):this.index=e,this}setIndirect(e){return this.indirect=e,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const a=new Je().getNormalMatrix(e);n.applyNormalMatrix(a),n.needsUpdate=!0}const r=this.attributes.tangent;return r!==void 0&&(r.transformDirection(e),r.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return gn.makeRotationFromQuaternion(e),this.applyMatrix4(gn),this}rotateX(e){return gn.makeRotationX(e),this.applyMatrix4(gn),this}rotateY(e){return gn.makeRotationY(e),this.applyMatrix4(gn),this}rotateZ(e){return gn.makeRotationZ(e),this.applyMatrix4(gn),this}translate(e,t,n){return gn.makeTranslation(e,t,n),this.applyMatrix4(gn),this}scale(e,t,n){return gn.makeScale(e,t,n),this.applyMatrix4(gn),this}lookAt(e){return zs.lookAt(e),zs.updateMatrix(),this.applyMatrix4(zs.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(ar).negate(),this.translate(ar.x,ar.y,ar.z),this}setFromPoints(e){const t=this.getAttribute("position");if(t===void 0){const n=[];for(let r=0,a=e.length;r<a;r++){const s=e[r];n.push(s.x,s.y,s.z||0)}this.setAttribute("position",new Xt(n,3))}else{for(let n=0,r=t.count;n<r;n++){const a=e[n];t.setXYZ(n,a.x,a.y,a.z||0)}e.length>t.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Zr);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new q(-1/0,-1/0,-1/0),new q(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,r=t.length;n<r;n++){const a=t[n];un.setFromBufferAttribute(a),this.morphTargetsRelative?(Ht.addVectors(this.boundingBox.min,un.min),this.boundingBox.expandByPoint(Ht),Ht.addVectors(this.boundingBox.max,un.max),this.boundingBox.expandByPoint(Ht)):(this.boundingBox.expandByPoint(un.min),this.boundingBox.expandByPoint(un.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new es);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new q,1/0);return}if(e){const n=this.boundingSphere.center;if(un.setFromBufferAttribute(e),t)for(let a=0,s=t.length;a<s;a++){const o=t[a];zr.setFromBufferAttribute(o),this.morphTargetsRelative?(Ht.addVectors(un.min,zr.min),un.expandByPoint(Ht),Ht.addVectors(un.max,zr.max),un.expandByPoint(Ht)):(un.expandByPoint(zr.min),un.expandByPoint(zr.max))}un.getCenter(n);let r=0;for(let a=0,s=e.count;a<s;a++)Ht.fromBufferAttribute(e,a),r=Math.max(r,n.distanceToSquared(Ht));if(t)for(let a=0,s=t.length;a<s;a++){const o=t[a],l=this.morphTargetsRelative;for(let c=0,u=o.count;c<u;c++)Ht.fromBufferAttribute(o,c),l&&(ar.fromBufferAttribute(e,c),Ht.add(ar)),r=Math.max(r,n.distanceToSquared(Ht))}this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=t.position,r=t.normal,a=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Dn(new Float32Array(4*n.count),4));const s=this.getAttribute("tangent"),o=[],l=[];for(let U=0;U<n.count;U++)o[U]=new q,l[U]=new q;const c=new q,u=new q,h=new q,f=new ut,m=new ut,x=new ut,y=new q,g=new q;function p(U,T,w){c.fromBufferAttribute(n,U),u.fromBufferAttribute(n,T),h.fromBufferAttribute(n,w),f.fromBufferAttribute(a,U),m.fromBufferAttribute(a,T),x.fromBufferAttribute(a,w),u.sub(c),h.sub(c),m.sub(f),x.sub(f);const F=1/(m.x*x.y-x.x*m.y);isFinite(F)&&(y.copy(u).multiplyScalar(x.y).addScaledVector(h,-m.y).multiplyScalar(F),g.copy(h).multiplyScalar(m.x).addScaledVector(u,-x.x).multiplyScalar(F),o[U].add(y),o[T].add(y),o[w].add(y),l[U].add(g),l[T].add(g),l[w].add(g))}let A=this.groups;A.length===0&&(A=[{start:0,count:e.count}]);for(let U=0,T=A.length;U<T;++U){const w=A[U],F=w.start,V=w.count;for(let G=F,K=F+V;G<K;G+=3)p(e.getX(G+0),e.getX(G+1),e.getX(G+2))}const C=new q,S=new q,N=new q,I=new q;function D(U){N.fromBufferAttribute(r,U),I.copy(N);const T=o[U];C.copy(T),C.sub(N.multiplyScalar(N.dot(T))).normalize(),S.crossVectors(I,T);const F=S.dot(l[U])<0?-1:1;s.setXYZW(U,C.x,C.y,C.z,F)}for(let U=0,T=A.length;U<T;++U){const w=A[U],F=w.start,V=w.count;for(let G=F,K=F+V;G<K;G+=3)D(e.getX(G+0)),D(e.getX(G+1)),D(e.getX(G+2))}}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new Dn(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let f=0,m=n.count;f<m;f++)n.setXYZ(f,0,0,0);const r=new q,a=new q,s=new q,o=new q,l=new q,c=new q,u=new q,h=new q;if(e)for(let f=0,m=e.count;f<m;f+=3){const x=e.getX(f+0),y=e.getX(f+1),g=e.getX(f+2);r.fromBufferAttribute(t,x),a.fromBufferAttribute(t,y),s.fromBufferAttribute(t,g),u.subVectors(s,a),h.subVectors(r,a),u.cross(h),o.fromBufferAttribute(n,x),l.fromBufferAttribute(n,y),c.fromBufferAttribute(n,g),o.add(u),l.add(u),c.add(u),n.setXYZ(x,o.x,o.y,o.z),n.setXYZ(y,l.x,l.y,l.z),n.setXYZ(g,c.x,c.y,c.z)}else for(let f=0,m=t.count;f<m;f+=3)r.fromBufferAttribute(t,f+0),a.fromBufferAttribute(t,f+1),s.fromBufferAttribute(t,f+2),u.subVectors(s,a),h.subVectors(r,a),u.cross(h),n.setXYZ(f+0,u.x,u.y,u.z),n.setXYZ(f+1,u.x,u.y,u.z),n.setXYZ(f+2,u.x,u.y,u.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)Ht.fromBufferAttribute(e,t),Ht.normalize(),e.setXYZ(t,Ht.x,Ht.y,Ht.z)}toNonIndexed(){function e(o,l){const c=o.array,u=o.itemSize,h=o.normalized,f=new c.constructor(l.length*u);let m=0,x=0;for(let y=0,g=l.length;y<g;y++){o.isInterleavedBufferAttribute?m=l[y]*o.data.stride+o.offset:m=l[y]*u;for(let p=0;p<u;p++)f[x++]=c[m++]}return new Dn(f,u,h)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new bn,n=this.index.array,r=this.attributes;for(const o in r){const l=r[o],c=e(l,n);t.setAttribute(o,c)}const a=this.morphAttributes;for(const o in a){const l=[],c=a[o];for(let u=0,h=c.length;u<h;u++){const f=c[u],m=e(f,n);l.push(m)}t.morphAttributes[o]=l}t.morphTargetsRelative=this.morphTargetsRelative;const s=this.groups;for(let o=0,l=s.length;o<l;o++){const c=s[o];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){const e={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const n=this.attributes;for(const l in n){const c=n[l];e.data.attributes[l]=c.toJSON(e.data)}const r={};let a=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],u=[];for(let h=0,f=c.length;h<f;h++){const m=c[h];u.push(m.toJSON(e.data))}u.length>0&&(r[l]=u,a=!0)}a&&(e.data.morphAttributes=r,e.data.morphTargetsRelative=this.morphTargetsRelative);const s=this.groups;s.length>0&&(e.data.groups=JSON.parse(JSON.stringify(s)));const o=this.boundingSphere;return o!==null&&(e.data.boundingSphere={center:o.center.toArray(),radius:o.radius}),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const n=e.index;n!==null&&this.setIndex(n.clone(t));const r=e.attributes;for(const c in r){const u=r[c];this.setAttribute(c,u.clone(t))}const a=e.morphAttributes;for(const c in a){const u=[],h=a[c];for(let f=0,m=h.length;f<m;f++)u.push(h[f].clone(t));this.morphAttributes[c]=u}this.morphTargetsRelative=e.morphTargetsRelative;const s=e.groups;for(let c=0,u=s.length;c<u;c++){const h=s[c];this.addGroup(h.start,h.count,h.materialIndex)}const o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());const l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const bl=new Ct,Ii=new su,fa=new es,Ml=new q,pa=new q,ma=new q,va=new q,Os=new q,ga=new q,Sl=new q,xa=new q;class Xe extends Vt{constructor(e=new bn,t=new Wr){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const r=t[n[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let a=0,s=r.length;a<s;a++){const o=r[a].name||String(a);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=a}}}}getVertexPosition(e,t){const n=this.geometry,r=n.attributes.position,a=n.morphAttributes.position,s=n.morphTargetsRelative;t.fromBufferAttribute(r,e);const o=this.morphTargetInfluences;if(a&&o){ga.set(0,0,0);for(let l=0,c=a.length;l<c;l++){const u=o[l],h=a[l];u!==0&&(Os.fromBufferAttribute(h,e),s?ga.addScaledVector(Os,u):ga.addScaledVector(Os.sub(t),u))}t.add(ga)}return t}raycast(e,t){const n=this.geometry,r=this.material,a=this.matrixWorld;r!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),fa.copy(n.boundingSphere),fa.applyMatrix4(a),Ii.copy(e.ray).recast(e.near),!(fa.containsPoint(Ii.origin)===!1&&(Ii.intersectSphere(fa,Ml)===null||Ii.origin.distanceToSquared(Ml)>(e.far-e.near)**2))&&(bl.copy(a).invert(),Ii.copy(e.ray).applyMatrix4(bl),!(n.boundingBox!==null&&Ii.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,Ii)))}_computeIntersections(e,t,n){let r;const a=this.geometry,s=this.material,o=a.index,l=a.attributes.position,c=a.attributes.uv,u=a.attributes.uv1,h=a.attributes.normal,f=a.groups,m=a.drawRange;if(o!==null)if(Array.isArray(s))for(let x=0,y=f.length;x<y;x++){const g=f[x],p=s[g.materialIndex],A=Math.max(g.start,m.start),C=Math.min(o.count,Math.min(g.start+g.count,m.start+m.count));for(let S=A,N=C;S<N;S+=3){const I=o.getX(S),D=o.getX(S+1),U=o.getX(S+2);r=ya(this,p,e,n,c,u,h,I,D,U),r&&(r.faceIndex=Math.floor(S/3),r.face.materialIndex=g.materialIndex,t.push(r))}}else{const x=Math.max(0,m.start),y=Math.min(o.count,m.start+m.count);for(let g=x,p=y;g<p;g+=3){const A=o.getX(g),C=o.getX(g+1),S=o.getX(g+2);r=ya(this,s,e,n,c,u,h,A,C,S),r&&(r.faceIndex=Math.floor(g/3),t.push(r))}}else if(l!==void 0)if(Array.isArray(s))for(let x=0,y=f.length;x<y;x++){const g=f[x],p=s[g.materialIndex],A=Math.max(g.start,m.start),C=Math.min(l.count,Math.min(g.start+g.count,m.start+m.count));for(let S=A,N=C;S<N;S+=3){const I=S,D=S+1,U=S+2;r=ya(this,p,e,n,c,u,h,I,D,U),r&&(r.faceIndex=Math.floor(S/3),r.face.materialIndex=g.materialIndex,t.push(r))}}else{const x=Math.max(0,m.start),y=Math.min(l.count,m.start+m.count);for(let g=x,p=y;g<p;g+=3){const A=g,C=g+1,S=g+2;r=ya(this,s,e,n,c,u,h,A,C,S),r&&(r.faceIndex=Math.floor(g/3),t.push(r))}}}}function Ld(i,e,t,n,r,a,s,o){let l;if(e.side===sn?l=n.intersectTriangle(s,a,r,!0,o):l=n.intersectTriangle(r,a,s,e.side===Mi,o),l===null)return null;xa.copy(o),xa.applyMatrix4(i.matrixWorld);const c=t.ray.origin.distanceTo(xa);return c<t.near||c>t.far?null:{distance:c,point:xa.clone(),object:i}}function ya(i,e,t,n,r,a,s,o,l,c){i.getVertexPosition(o,pa),i.getVertexPosition(l,ma),i.getVertexPosition(c,va);const u=Ld(i,e,t,n,pa,ma,va,Sl);if(u){const h=new q;Cn.getBarycoord(Sl,pa,ma,va,h),r&&(u.uv=Cn.getInterpolatedAttribute(r,o,l,c,h,new ut)),a&&(u.uv1=Cn.getInterpolatedAttribute(a,o,l,c,h,new ut)),s&&(u.normal=Cn.getInterpolatedAttribute(s,o,l,c,h,new q),u.normal.dot(n.direction)>0&&u.normal.multiplyScalar(-1));const f={a:o,b:l,c,normal:new q,materialIndex:0};Cn.getNormal(pa,ma,va,f.normal),u.face=f,u.barycoord=h}return u}class an extends bn{constructor(e=1,t=1,n=1,r=1,a=1,s=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:r,heightSegments:a,depthSegments:s};const o=this;r=Math.floor(r),a=Math.floor(a),s=Math.floor(s);const l=[],c=[],u=[],h=[];let f=0,m=0;x("z","y","x",-1,-1,n,t,e,s,a,0),x("z","y","x",1,-1,n,t,-e,s,a,1),x("x","z","y",1,1,e,n,t,r,s,2),x("x","z","y",1,-1,e,n,-t,r,s,3),x("x","y","z",1,-1,e,t,n,r,a,4),x("x","y","z",-1,-1,e,t,-n,r,a,5),this.setIndex(l),this.setAttribute("position",new Xt(c,3)),this.setAttribute("normal",new Xt(u,3)),this.setAttribute("uv",new Xt(h,2));function x(y,g,p,A,C,S,N,I,D,U,T){const w=S/D,F=N/U,V=S/2,G=N/2,K=I/2,J=D+1,j=U+1;let te=0,Y=0;const fe=new q;for(let pe=0;pe<j;pe++){const ye=pe*F-G;for(let ke=0;ke<J;ke++){const qe=ke*w-V;fe[y]=qe*A,fe[g]=ye*C,fe[p]=K,c.push(fe.x,fe.y,fe.z),fe[y]=0,fe[g]=0,fe[p]=I>0?1:-1,u.push(fe.x,fe.y,fe.z),h.push(ke/D),h.push(1-pe/U),te+=1}}for(let pe=0;pe<U;pe++)for(let ye=0;ye<D;ye++){const ke=f+ye+J*pe,qe=f+ye+J*(pe+1),Q=f+(ye+1)+J*(pe+1),ce=f+(ye+1)+J*pe;l.push(ke,qe,ce),l.push(qe,Q,ce),Y+=6}o.addGroup(m,Y,T),m+=Y,f+=te}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new an(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function _r(i){const e={};for(const t in i){e[t]={};for(const n in i[t]){const r=i[t][n];r&&(r.isColor||r.isMatrix3||r.isMatrix4||r.isVector2||r.isVector3||r.isVector4||r.isTexture||r.isQuaternion)?r.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=r.clone():Array.isArray(r)?e[t][n]=r.slice():e[t][n]=r}}return e}function Kt(i){const e={};for(let t=0;t<i.length;t++){const n=_r(i[t]);for(const r in n)e[r]=n[r]}return e}function Fd(i){const e=[];for(let t=0;t<i.length;t++)e.push(i[t].clone());return e}function hu(i){const e=i.getRenderTarget();return e===null?i.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:ot.workingColorSpace}const Ud={clone:_r,merge:Kt};var Nd=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,kd=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Si extends Er{static get type(){return"ShaderMaterial"}constructor(e){super(),this.isShaderMaterial=!0,this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Nd,this.fragmentShader=kd,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=_r(e.uniforms),this.uniformsGroups=Fd(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const r in this.uniforms){const s=this.uniforms[r].value;s&&s.isTexture?t.uniforms[r]={type:"t",value:s.toJSON(e).uuid}:s&&s.isColor?t.uniforms[r]={type:"c",value:s.getHex()}:s&&s.isVector2?t.uniforms[r]={type:"v2",value:s.toArray()}:s&&s.isVector3?t.uniforms[r]={type:"v3",value:s.toArray()}:s&&s.isVector4?t.uniforms[r]={type:"v4",value:s.toArray()}:s&&s.isMatrix3?t.uniforms[r]={type:"m3",value:s.toArray()}:s&&s.isMatrix4?t.uniforms[r]={type:"m4",value:s.toArray()}:t.uniforms[r]={value:s}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const n={};for(const r in this.extensions)this.extensions[r]===!0&&(n[r]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}}class du extends Vt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Ct,this.projectionMatrix=new Ct,this.projectionMatrixInverse=new Ct,this.coordinateSystem=Qn}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const pi=new q,wl=new ut,Tl=new ut;class hn extends du{constructor(e=50,t=1,n=.1,r=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=r,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=Jo*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(ys*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Jo*2*Math.atan(Math.tan(ys*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){pi.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(pi.x,pi.y).multiplyScalar(-e/pi.z),pi.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(pi.x,pi.y).multiplyScalar(-e/pi.z)}getViewSize(e,t){return this.getViewBounds(e,wl,Tl),t.subVectors(Tl,wl)}setViewOffset(e,t,n,r,a,s){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=r,this.view.width=a,this.view.height=s,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(ys*.5*this.fov)/this.zoom,n=2*t,r=this.aspect*n,a=-.5*r;const s=this.view;if(this.view!==null&&this.view.enabled){const l=s.fullWidth,c=s.fullHeight;a+=s.offsetX*r/l,t-=s.offsetY*n/c,r*=s.width/l,n*=s.height/c}const o=this.filmOffset;o!==0&&(a+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(a,a+r,t,t-n,e,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}const sr=-90,or=1;class zd extends Vt{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const r=new hn(sr,or,e,t);r.layers=this.layers,this.add(r);const a=new hn(sr,or,e,t);a.layers=this.layers,this.add(a);const s=new hn(sr,or,e,t);s.layers=this.layers,this.add(s);const o=new hn(sr,or,e,t);o.layers=this.layers,this.add(o);const l=new hn(sr,or,e,t);l.layers=this.layers,this.add(l);const c=new hn(sr,or,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[n,r,a,s,o,l]=t;for(const c of t)this.remove(c);if(e===Qn)n.up.set(0,1,0),n.lookAt(1,0,0),r.up.set(0,1,0),r.lookAt(-1,0,0),a.up.set(0,0,-1),a.lookAt(0,1,0),s.up.set(0,0,1),s.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===Va)n.up.set(0,-1,0),n.lookAt(-1,0,0),r.up.set(0,-1,0),r.lookAt(1,0,0),a.up.set(0,0,1),a.lookAt(0,1,0),s.up.set(0,0,-1),s.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:r}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[a,s,o,l,c,u]=this.children,h=e.getRenderTarget(),f=e.getActiveCubeFace(),m=e.getActiveMipmapLevel(),x=e.xr.enabled;e.xr.enabled=!1;const y=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,e.setRenderTarget(n,0,r),e.render(t,a),e.setRenderTarget(n,1,r),e.render(t,s),e.setRenderTarget(n,2,r),e.render(t,o),e.setRenderTarget(n,3,r),e.render(t,l),e.setRenderTarget(n,4,r),e.render(t,c),n.texture.generateMipmaps=y,e.setRenderTarget(n,5,r),e.render(t,u),e.setRenderTarget(h,f,m),e.xr.enabled=x,n.texture.needsPMREMUpdate=!0}}class fu extends on{constructor(e,t,n,r,a,s,o,l,c,u){e=e!==void 0?e:[],t=t!==void 0?t:vr,super(e,t,n,r,a,s,o,l,c,u),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class Od extends Xi{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const n={width:e,height:e,depth:1},r=[n,n,n,n,n,n];this.texture=new fu(r,t.mapping,t.wrapS,t.wrapT,t.magFilter,t.minFilter,t.format,t.type,t.anisotropy,t.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=t.generateMipmaps!==void 0?t.generateMipmaps:!1,this.texture.minFilter=t.minFilter!==void 0?t.minFilter:Un}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},r=new an(5,5,5),a=new Si({name:"CubemapFromEquirect",uniforms:_r(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:sn,blending:yi});a.uniforms.tEquirect.value=t;const s=new Xe(r,a),o=t.minFilter;return t.minFilter===Wi&&(t.minFilter=Un),new zd(1,10,this).update(e,s),t.minFilter=o,s.geometry.dispose(),s.material.dispose(),this}clear(e,t,n,r){const a=e.getRenderTarget();for(let s=0;s<6;s++)e.setRenderTarget(this,s),e.clear(t,n,r);e.setRenderTarget(a)}}const Bs=new q,Bd=new q,Hd=new Je;class zi{constructor(e=new q(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,r){return this.normal.set(e,t,n),this.constant=r,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){const r=Bs.subVectors(n,t).cross(Bd.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(r,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){const n=e.delta(Bs),r=this.normal.dot(n);if(r===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const a=-(e.start.dot(this.normal)+this.constant)/r;return a<0||a>1?null:t.copy(e.start).addScaledVector(n,a)}intersectsLine(e){const t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const n=t||Hd.getNormalMatrix(e),r=this.coplanarPoint(Bs).applyMatrix4(e),a=this.normal.applyMatrix3(n).normalize();return this.constant=-r.dot(a),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const Li=new es,_a=new q;class A0{constructor(e=new zi,t=new zi,n=new zi,r=new zi,a=new zi,s=new zi){this.planes=[e,t,n,r,a,s]}set(e,t,n,r,a,s){const o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(n),o[3].copy(r),o[4].copy(a),o[5].copy(s),this}copy(e){const t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=Qn){const n=this.planes,r=e.elements,a=r[0],s=r[1],o=r[2],l=r[3],c=r[4],u=r[5],h=r[6],f=r[7],m=r[8],x=r[9],y=r[10],g=r[11],p=r[12],A=r[13],C=r[14],S=r[15];if(n[0].setComponents(l-a,f-c,g-m,S-p).normalize(),n[1].setComponents(l+a,f+c,g+m,S+p).normalize(),n[2].setComponents(l+s,f+u,g+x,S+A).normalize(),n[3].setComponents(l-s,f-u,g-x,S-A).normalize(),n[4].setComponents(l-o,f-h,g-y,S-C).normalize(),t===Qn)n[5].setComponents(l+o,f+h,g+y,S+C).normalize();else if(t===Va)n[5].setComponents(o,h,y,C).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Li.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),Li.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Li)}intersectsSprite(e){return Li.center.set(0,0,0),Li.radius=.7071067811865476,Li.applyMatrix4(e.matrixWorld),this.intersectsSphere(Li)}intersectsSphere(e){const t=this.planes,n=e.center,r=-e.radius;for(let a=0;a<6;a++)if(t[a].distanceToPoint(n)<r)return!1;return!0}intersectsBox(e){const t=this.planes;for(let n=0;n<6;n++){const r=t[n];if(_a.x=r.normal.x>0?e.max.x:e.min.x,_a.y=r.normal.y>0?e.max.y:e.min.y,_a.z=r.normal.z>0?e.max.z:e.min.z,r.distanceToPoint(_a)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function pu(){let i=null,e=!1,t=null,n=null;function r(a,s){t(a,s),n=i.requestAnimationFrame(r)}return{start:function(){e!==!0&&t!==null&&(n=i.requestAnimationFrame(r),e=!0)},stop:function(){i.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(a){t=a},setContext:function(a){i=a}}}function Vd(i){const e=new WeakMap;function t(o,l){const c=o.array,u=o.usage,h=c.byteLength,f=i.createBuffer();i.bindBuffer(l,f),i.bufferData(l,c,u),o.onUploadCallback();let m;if(c instanceof Float32Array)m=i.FLOAT;else if(c instanceof Uint16Array)o.isFloat16BufferAttribute?m=i.HALF_FLOAT:m=i.UNSIGNED_SHORT;else if(c instanceof Int16Array)m=i.SHORT;else if(c instanceof Uint32Array)m=i.UNSIGNED_INT;else if(c instanceof Int32Array)m=i.INT;else if(c instanceof Int8Array)m=i.BYTE;else if(c instanceof Uint8Array)m=i.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)m=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:f,type:m,bytesPerElement:c.BYTES_PER_ELEMENT,version:o.version,size:h}}function n(o,l,c){const u=l.array,h=l.updateRanges;if(i.bindBuffer(c,o),h.length===0)i.bufferSubData(c,0,u);else{h.sort((m,x)=>m.start-x.start);let f=0;for(let m=1;m<h.length;m++){const x=h[f],y=h[m];y.start<=x.start+x.count+1?x.count=Math.max(x.count,y.start+y.count-x.start):(++f,h[f]=y)}h.length=f+1;for(let m=0,x=h.length;m<x;m++){const y=h[m];i.bufferSubData(c,y.start*u.BYTES_PER_ELEMENT,u,y.start,y.count)}l.clearUpdateRanges()}l.onUploadCallback()}function r(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function a(o){o.isInterleavedBufferAttribute&&(o=o.data);const l=e.get(o);l&&(i.deleteBuffer(l.buffer),e.delete(o))}function s(o,l){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const u=e.get(o);(!u||u.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const c=e.get(o);if(c===void 0)e.set(o,t(o,l));else if(c.version<o.version){if(c.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,o,l),c.version=o.version}}return{get:r,remove:a,update:s}}class ts extends bn{constructor(e=1,t=1,n=1,r=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:r};const a=e/2,s=t/2,o=Math.floor(n),l=Math.floor(r),c=o+1,u=l+1,h=e/o,f=t/l,m=[],x=[],y=[],g=[];for(let p=0;p<u;p++){const A=p*f-s;for(let C=0;C<c;C++){const S=C*h-a;x.push(S,-A,0),y.push(0,0,1),g.push(C/o),g.push(1-p/l)}}for(let p=0;p<l;p++)for(let A=0;A<o;A++){const C=A+c*p,S=A+c*(p+1),N=A+1+c*(p+1),I=A+1+c*p;m.push(C,S,I),m.push(S,N,I)}this.setIndex(m),this.setAttribute("position",new Xt(x,3)),this.setAttribute("normal",new Xt(y,3)),this.setAttribute("uv",new Xt(g,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new ts(e.width,e.height,e.widthSegments,e.heightSegments)}}var Gd=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Wd=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,qd=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Xd=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,$d=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Yd=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Kd=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,jd=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Zd=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,Jd=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Qd=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,ef=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,tf=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,nf=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,rf=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,af=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,sf=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,of=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,lf=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,cf=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,uf=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,hf=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,df=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,ff=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,pf=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,mf=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,vf=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,gf=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,xf=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,yf=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,_f="gl_FragColor = linearToOutputTexel( gl_FragColor );",bf=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Mf=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,Sf=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,wf=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,Tf=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Ef=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,Af=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Cf=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Rf=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Pf=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Df=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,If=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Lf=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Ff=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Uf=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,Nf=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,kf=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,zf=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Of=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Bf=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Hf=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,Vf=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,Gf=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,Wf=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,qf=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Xf=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,$f=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Yf=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Kf=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,jf=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Zf=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Jf=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,Qf=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,ep=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,tp=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,np=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,ip=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,rp=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,ap=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,sp=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,op=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,lp=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,cp=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,up=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,hp=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,dp=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,fp=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,pp=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,mp=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,vp=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,gp=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,xp=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,yp=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,_p=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,bp=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Mp=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Sp=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,wp=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Tp=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		float hard_shadow = step( compare , distribution.x );
		if (hard_shadow != 1.0 ) {
			float distance = compare - distribution.x ;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`,Ep=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,Ap=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,Cp=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,Rp=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Pp=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,Dp=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Ip=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,Lp=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Fp=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Up=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Np=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,kp=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,zp=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
		
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
		
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		
		#else
		
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,Op=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Bp=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Hp=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,Vp=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const Gp=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Wp=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,qp=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Xp=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,$p=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Yp=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Kp=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,jp=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	float fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,Zp=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,Jp=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,Qp=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,em=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,tm=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,nm=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,im=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,rm=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,am=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,sm=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,om=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,lm=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,cm=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,um=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,hm=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,dm=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,fm=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,pm=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,mm=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,vm=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,gm=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,xm=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,ym=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,_m=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,bm=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Mm=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,tt={alphahash_fragment:Gd,alphahash_pars_fragment:Wd,alphamap_fragment:qd,alphamap_pars_fragment:Xd,alphatest_fragment:$d,alphatest_pars_fragment:Yd,aomap_fragment:Kd,aomap_pars_fragment:jd,batching_pars_vertex:Zd,batching_vertex:Jd,begin_vertex:Qd,beginnormal_vertex:ef,bsdfs:tf,iridescence_fragment:nf,bumpmap_pars_fragment:rf,clipping_planes_fragment:af,clipping_planes_pars_fragment:sf,clipping_planes_pars_vertex:of,clipping_planes_vertex:lf,color_fragment:cf,color_pars_fragment:uf,color_pars_vertex:hf,color_vertex:df,common:ff,cube_uv_reflection_fragment:pf,defaultnormal_vertex:mf,displacementmap_pars_vertex:vf,displacementmap_vertex:gf,emissivemap_fragment:xf,emissivemap_pars_fragment:yf,colorspace_fragment:_f,colorspace_pars_fragment:bf,envmap_fragment:Mf,envmap_common_pars_fragment:Sf,envmap_pars_fragment:wf,envmap_pars_vertex:Tf,envmap_physical_pars_fragment:Nf,envmap_vertex:Ef,fog_vertex:Af,fog_pars_vertex:Cf,fog_fragment:Rf,fog_pars_fragment:Pf,gradientmap_pars_fragment:Df,lightmap_pars_fragment:If,lights_lambert_fragment:Lf,lights_lambert_pars_fragment:Ff,lights_pars_begin:Uf,lights_toon_fragment:kf,lights_toon_pars_fragment:zf,lights_phong_fragment:Of,lights_phong_pars_fragment:Bf,lights_physical_fragment:Hf,lights_physical_pars_fragment:Vf,lights_fragment_begin:Gf,lights_fragment_maps:Wf,lights_fragment_end:qf,logdepthbuf_fragment:Xf,logdepthbuf_pars_fragment:$f,logdepthbuf_pars_vertex:Yf,logdepthbuf_vertex:Kf,map_fragment:jf,map_pars_fragment:Zf,map_particle_fragment:Jf,map_particle_pars_fragment:Qf,metalnessmap_fragment:ep,metalnessmap_pars_fragment:tp,morphinstance_vertex:np,morphcolor_vertex:ip,morphnormal_vertex:rp,morphtarget_pars_vertex:ap,morphtarget_vertex:sp,normal_fragment_begin:op,normal_fragment_maps:lp,normal_pars_fragment:cp,normal_pars_vertex:up,normal_vertex:hp,normalmap_pars_fragment:dp,clearcoat_normal_fragment_begin:fp,clearcoat_normal_fragment_maps:pp,clearcoat_pars_fragment:mp,iridescence_pars_fragment:vp,opaque_fragment:gp,packing:xp,premultiplied_alpha_fragment:yp,project_vertex:_p,dithering_fragment:bp,dithering_pars_fragment:Mp,roughnessmap_fragment:Sp,roughnessmap_pars_fragment:wp,shadowmap_pars_fragment:Tp,shadowmap_pars_vertex:Ep,shadowmap_vertex:Ap,shadowmask_pars_fragment:Cp,skinbase_vertex:Rp,skinning_pars_vertex:Pp,skinning_vertex:Dp,skinnormal_vertex:Ip,specularmap_fragment:Lp,specularmap_pars_fragment:Fp,tonemapping_fragment:Up,tonemapping_pars_fragment:Np,transmission_fragment:kp,transmission_pars_fragment:zp,uv_pars_fragment:Op,uv_pars_vertex:Bp,uv_vertex:Hp,worldpos_vertex:Vp,background_vert:Gp,background_frag:Wp,backgroundCube_vert:qp,backgroundCube_frag:Xp,cube_vert:$p,cube_frag:Yp,depth_vert:Kp,depth_frag:jp,distanceRGBA_vert:Zp,distanceRGBA_frag:Jp,equirect_vert:Qp,equirect_frag:em,linedashed_vert:tm,linedashed_frag:nm,meshbasic_vert:im,meshbasic_frag:rm,meshlambert_vert:am,meshlambert_frag:sm,meshmatcap_vert:om,meshmatcap_frag:lm,meshnormal_vert:cm,meshnormal_frag:um,meshphong_vert:hm,meshphong_frag:dm,meshphysical_vert:fm,meshphysical_frag:pm,meshtoon_vert:mm,meshtoon_frag:vm,points_vert:gm,points_frag:xm,shadow_vert:ym,shadow_frag:_m,sprite_vert:bm,sprite_frag:Mm},xe={common:{diffuse:{value:new nt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Je},alphaMap:{value:null},alphaMapTransform:{value:new Je},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Je}},envmap:{envMap:{value:null},envMapRotation:{value:new Je},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Je}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Je}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Je},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Je},normalScale:{value:new ut(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Je},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Je}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Je}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Je}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new nt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new nt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Je},alphaTest:{value:0},uvTransform:{value:new Je}},sprite:{diffuse:{value:new nt(16777215)},opacity:{value:1},center:{value:new ut(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Je},alphaMap:{value:null},alphaMapTransform:{value:new Je},alphaTest:{value:0}}},Ln={basic:{uniforms:Kt([xe.common,xe.specularmap,xe.envmap,xe.aomap,xe.lightmap,xe.fog]),vertexShader:tt.meshbasic_vert,fragmentShader:tt.meshbasic_frag},lambert:{uniforms:Kt([xe.common,xe.specularmap,xe.envmap,xe.aomap,xe.lightmap,xe.emissivemap,xe.bumpmap,xe.normalmap,xe.displacementmap,xe.fog,xe.lights,{emissive:{value:new nt(0)}}]),vertexShader:tt.meshlambert_vert,fragmentShader:tt.meshlambert_frag},phong:{uniforms:Kt([xe.common,xe.specularmap,xe.envmap,xe.aomap,xe.lightmap,xe.emissivemap,xe.bumpmap,xe.normalmap,xe.displacementmap,xe.fog,xe.lights,{emissive:{value:new nt(0)},specular:{value:new nt(1118481)},shininess:{value:30}}]),vertexShader:tt.meshphong_vert,fragmentShader:tt.meshphong_frag},standard:{uniforms:Kt([xe.common,xe.envmap,xe.aomap,xe.lightmap,xe.emissivemap,xe.bumpmap,xe.normalmap,xe.displacementmap,xe.roughnessmap,xe.metalnessmap,xe.fog,xe.lights,{emissive:{value:new nt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:tt.meshphysical_vert,fragmentShader:tt.meshphysical_frag},toon:{uniforms:Kt([xe.common,xe.aomap,xe.lightmap,xe.emissivemap,xe.bumpmap,xe.normalmap,xe.displacementmap,xe.gradientmap,xe.fog,xe.lights,{emissive:{value:new nt(0)}}]),vertexShader:tt.meshtoon_vert,fragmentShader:tt.meshtoon_frag},matcap:{uniforms:Kt([xe.common,xe.bumpmap,xe.normalmap,xe.displacementmap,xe.fog,{matcap:{value:null}}]),vertexShader:tt.meshmatcap_vert,fragmentShader:tt.meshmatcap_frag},points:{uniforms:Kt([xe.points,xe.fog]),vertexShader:tt.points_vert,fragmentShader:tt.points_frag},dashed:{uniforms:Kt([xe.common,xe.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:tt.linedashed_vert,fragmentShader:tt.linedashed_frag},depth:{uniforms:Kt([xe.common,xe.displacementmap]),vertexShader:tt.depth_vert,fragmentShader:tt.depth_frag},normal:{uniforms:Kt([xe.common,xe.bumpmap,xe.normalmap,xe.displacementmap,{opacity:{value:1}}]),vertexShader:tt.meshnormal_vert,fragmentShader:tt.meshnormal_frag},sprite:{uniforms:Kt([xe.sprite,xe.fog]),vertexShader:tt.sprite_vert,fragmentShader:tt.sprite_frag},background:{uniforms:{uvTransform:{value:new Je},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:tt.background_vert,fragmentShader:tt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Je}},vertexShader:tt.backgroundCube_vert,fragmentShader:tt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:tt.cube_vert,fragmentShader:tt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:tt.equirect_vert,fragmentShader:tt.equirect_frag},distanceRGBA:{uniforms:Kt([xe.common,xe.displacementmap,{referencePosition:{value:new q},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:tt.distanceRGBA_vert,fragmentShader:tt.distanceRGBA_frag},shadow:{uniforms:Kt([xe.lights,xe.fog,{color:{value:new nt(0)},opacity:{value:1}}]),vertexShader:tt.shadow_vert,fragmentShader:tt.shadow_frag}};Ln.physical={uniforms:Kt([Ln.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Je},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Je},clearcoatNormalScale:{value:new ut(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Je},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Je},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Je},sheen:{value:0},sheenColor:{value:new nt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Je},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Je},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Je},transmissionSamplerSize:{value:new ut},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Je},attenuationDistance:{value:0},attenuationColor:{value:new nt(0)},specularColor:{value:new nt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Je},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Je},anisotropyVector:{value:new ut},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Je}}]),vertexShader:tt.meshphysical_vert,fragmentShader:tt.meshphysical_frag};const ba={r:0,b:0,g:0},Fi=new zn,Sm=new Ct;function wm(i,e,t,n,r,a,s){const o=new nt(0);let l=a===!0?0:1,c,u,h=null,f=0,m=null;function x(A){let C=A.isScene===!0?A.background:null;return C&&C.isTexture&&(C=(A.backgroundBlurriness>0?t:e).get(C)),C}function y(A){let C=!1;const S=x(A);S===null?p(o,l):S&&S.isColor&&(p(S,1),C=!0);const N=i.xr.getEnvironmentBlendMode();N==="additive"?n.buffers.color.setClear(0,0,0,1,s):N==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,s),(i.autoClear||C)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function g(A,C){const S=x(C);S&&(S.isCubeTexture||S.mapping===Ja)?(u===void 0&&(u=new Xe(new an(1,1,1),new Si({name:"BackgroundCubeMaterial",uniforms:_r(Ln.backgroundCube.uniforms),vertexShader:Ln.backgroundCube.vertexShader,fragmentShader:Ln.backgroundCube.fragmentShader,side:sn,depthTest:!1,depthWrite:!1,fog:!1})),u.geometry.deleteAttribute("normal"),u.geometry.deleteAttribute("uv"),u.onBeforeRender=function(N,I,D){this.matrixWorld.copyPosition(D.matrixWorld)},Object.defineProperty(u.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),r.update(u)),Fi.copy(C.backgroundRotation),Fi.x*=-1,Fi.y*=-1,Fi.z*=-1,S.isCubeTexture&&S.isRenderTargetTexture===!1&&(Fi.y*=-1,Fi.z*=-1),u.material.uniforms.envMap.value=S,u.material.uniforms.flipEnvMap.value=S.isCubeTexture&&S.isRenderTargetTexture===!1?-1:1,u.material.uniforms.backgroundBlurriness.value=C.backgroundBlurriness,u.material.uniforms.backgroundIntensity.value=C.backgroundIntensity,u.material.uniforms.backgroundRotation.value.setFromMatrix4(Sm.makeRotationFromEuler(Fi)),u.material.toneMapped=ot.getTransfer(S.colorSpace)!==gt,(h!==S||f!==S.version||m!==i.toneMapping)&&(u.material.needsUpdate=!0,h=S,f=S.version,m=i.toneMapping),u.layers.enableAll(),A.unshift(u,u.geometry,u.material,0,0,null)):S&&S.isTexture&&(c===void 0&&(c=new Xe(new ts(2,2),new Si({name:"BackgroundMaterial",uniforms:_r(Ln.background.uniforms),vertexShader:Ln.background.vertexShader,fragmentShader:Ln.background.fragmentShader,side:Mi,depthTest:!1,depthWrite:!1,fog:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),r.update(c)),c.material.uniforms.t2D.value=S,c.material.uniforms.backgroundIntensity.value=C.backgroundIntensity,c.material.toneMapped=ot.getTransfer(S.colorSpace)!==gt,S.matrixAutoUpdate===!0&&S.updateMatrix(),c.material.uniforms.uvTransform.value.copy(S.matrix),(h!==S||f!==S.version||m!==i.toneMapping)&&(c.material.needsUpdate=!0,h=S,f=S.version,m=i.toneMapping),c.layers.enableAll(),A.unshift(c,c.geometry,c.material,0,0,null))}function p(A,C){A.getRGB(ba,hu(i)),n.buffers.color.setClear(ba.r,ba.g,ba.b,C,s)}return{getClearColor:function(){return o},setClearColor:function(A,C=1){o.set(A),l=C,p(o,l)},getClearAlpha:function(){return l},setClearAlpha:function(A){l=A,p(o,l)},render:y,addToRenderList:g}}function Tm(i,e){const t=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},r=f(null);let a=r,s=!1;function o(w,F,V,G,K){let J=!1;const j=h(G,V,F);a!==j&&(a=j,c(a.object)),J=m(w,G,V,K),J&&x(w,G,V,K),K!==null&&e.update(K,i.ELEMENT_ARRAY_BUFFER),(J||s)&&(s=!1,S(w,F,V,G),K!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,e.get(K).buffer))}function l(){return i.createVertexArray()}function c(w){return i.bindVertexArray(w)}function u(w){return i.deleteVertexArray(w)}function h(w,F,V){const G=V.wireframe===!0;let K=n[w.id];K===void 0&&(K={},n[w.id]=K);let J=K[F.id];J===void 0&&(J={},K[F.id]=J);let j=J[G];return j===void 0&&(j=f(l()),J[G]=j),j}function f(w){const F=[],V=[],G=[];for(let K=0;K<t;K++)F[K]=0,V[K]=0,G[K]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:F,enabledAttributes:V,attributeDivisors:G,object:w,attributes:{},index:null}}function m(w,F,V,G){const K=a.attributes,J=F.attributes;let j=0;const te=V.getAttributes();for(const Y in te)if(te[Y].location>=0){const pe=K[Y];let ye=J[Y];if(ye===void 0&&(Y==="instanceMatrix"&&w.instanceMatrix&&(ye=w.instanceMatrix),Y==="instanceColor"&&w.instanceColor&&(ye=w.instanceColor)),pe===void 0||pe.attribute!==ye||ye&&pe.data!==ye.data)return!0;j++}return a.attributesNum!==j||a.index!==G}function x(w,F,V,G){const K={},J=F.attributes;let j=0;const te=V.getAttributes();for(const Y in te)if(te[Y].location>=0){let pe=J[Y];pe===void 0&&(Y==="instanceMatrix"&&w.instanceMatrix&&(pe=w.instanceMatrix),Y==="instanceColor"&&w.instanceColor&&(pe=w.instanceColor));const ye={};ye.attribute=pe,pe&&pe.data&&(ye.data=pe.data),K[Y]=ye,j++}a.attributes=K,a.attributesNum=j,a.index=G}function y(){const w=a.newAttributes;for(let F=0,V=w.length;F<V;F++)w[F]=0}function g(w){p(w,0)}function p(w,F){const V=a.newAttributes,G=a.enabledAttributes,K=a.attributeDivisors;V[w]=1,G[w]===0&&(i.enableVertexAttribArray(w),G[w]=1),K[w]!==F&&(i.vertexAttribDivisor(w,F),K[w]=F)}function A(){const w=a.newAttributes,F=a.enabledAttributes;for(let V=0,G=F.length;V<G;V++)F[V]!==w[V]&&(i.disableVertexAttribArray(V),F[V]=0)}function C(w,F,V,G,K,J,j){j===!0?i.vertexAttribIPointer(w,F,V,K,J):i.vertexAttribPointer(w,F,V,G,K,J)}function S(w,F,V,G){y();const K=G.attributes,J=V.getAttributes(),j=F.defaultAttributeValues;for(const te in J){const Y=J[te];if(Y.location>=0){let fe=K[te];if(fe===void 0&&(te==="instanceMatrix"&&w.instanceMatrix&&(fe=w.instanceMatrix),te==="instanceColor"&&w.instanceColor&&(fe=w.instanceColor)),fe!==void 0){const pe=fe.normalized,ye=fe.itemSize,ke=e.get(fe);if(ke===void 0)continue;const qe=ke.buffer,Q=ke.type,ce=ke.bytesPerElement,Re=Q===i.INT||Q===i.UNSIGNED_INT||fe.gpuType===b0;if(fe.isInterleavedBufferAttribute){const me=fe.data,Ne=me.stride,ze=fe.offset;if(me.isInstancedInterleavedBuffer){for(let ve=0;ve<Y.locationSize;ve++)p(Y.location+ve,me.meshPerAttribute);w.isInstancedMesh!==!0&&G._maxInstanceCount===void 0&&(G._maxInstanceCount=me.meshPerAttribute*me.count)}else for(let ve=0;ve<Y.locationSize;ve++)g(Y.location+ve);i.bindBuffer(i.ARRAY_BUFFER,qe);for(let ve=0;ve<Y.locationSize;ve++)C(Y.location+ve,ye/Y.locationSize,Q,pe,Ne*ce,(ze+ye/Y.locationSize*ve)*ce,Re)}else{if(fe.isInstancedBufferAttribute){for(let me=0;me<Y.locationSize;me++)p(Y.location+me,fe.meshPerAttribute);w.isInstancedMesh!==!0&&G._maxInstanceCount===void 0&&(G._maxInstanceCount=fe.meshPerAttribute*fe.count)}else for(let me=0;me<Y.locationSize;me++)g(Y.location+me);i.bindBuffer(i.ARRAY_BUFFER,qe);for(let me=0;me<Y.locationSize;me++)C(Y.location+me,ye/Y.locationSize,Q,pe,ye*ce,ye/Y.locationSize*me*ce,Re)}}else if(j!==void 0){const pe=j[te];if(pe!==void 0)switch(pe.length){case 2:i.vertexAttrib2fv(Y.location,pe);break;case 3:i.vertexAttrib3fv(Y.location,pe);break;case 4:i.vertexAttrib4fv(Y.location,pe);break;default:i.vertexAttrib1fv(Y.location,pe)}}}}A()}function N(){U();for(const w in n){const F=n[w];for(const V in F){const G=F[V];for(const K in G)u(G[K].object),delete G[K];delete F[V]}delete n[w]}}function I(w){if(n[w.id]===void 0)return;const F=n[w.id];for(const V in F){const G=F[V];for(const K in G)u(G[K].object),delete G[K];delete F[V]}delete n[w.id]}function D(w){for(const F in n){const V=n[F];if(V[w.id]===void 0)continue;const G=V[w.id];for(const K in G)u(G[K].object),delete G[K];delete V[w.id]}}function U(){T(),s=!0,a!==r&&(a=r,c(a.object))}function T(){r.geometry=null,r.program=null,r.wireframe=!1}return{setup:o,reset:U,resetDefaultState:T,dispose:N,releaseStatesOfGeometry:I,releaseStatesOfProgram:D,initAttributes:y,enableAttribute:g,disableUnusedAttributes:A}}function Em(i,e,t){let n;function r(c){n=c}function a(c,u){i.drawArrays(n,c,u),t.update(u,n,1)}function s(c,u,h){h!==0&&(i.drawArraysInstanced(n,c,u,h),t.update(u,n,h))}function o(c,u,h){if(h===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,c,0,u,0,h);let m=0;for(let x=0;x<h;x++)m+=u[x];t.update(m,n,1)}function l(c,u,h,f){if(h===0)return;const m=e.get("WEBGL_multi_draw");if(m===null)for(let x=0;x<c.length;x++)s(c[x],u[x],f[x]);else{m.multiDrawArraysInstancedWEBGL(n,c,0,u,0,f,0,h);let x=0;for(let y=0;y<h;y++)x+=u[y]*f[y];t.update(x,n,1)}}this.setMode=r,this.render=a,this.renderInstances=s,this.renderMultiDraw=o,this.renderMultiDrawInstances=l}function Am(i,e,t,n){let r;function a(){if(r!==void 0)return r;if(e.has("EXT_texture_filter_anisotropic")===!0){const D=e.get("EXT_texture_filter_anisotropic");r=i.getParameter(D.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else r=0;return r}function s(D){return!(D!==Rn&&n.convert(D)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(D){const U=D===Yr&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(D!==ni&&n.convert(D)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&D!==Jn&&!U)}function l(D){if(D==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";D="mediump"}return D==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=t.precision!==void 0?t.precision:"highp";const u=l(c);u!==c&&(console.warn("THREE.WebGLRenderer:",c,"not supported, using",u,"instead."),c=u);const h=t.logarithmicDepthBuffer===!0,f=t.reverseDepthBuffer===!0&&e.has("EXT_clip_control"),m=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),x=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),y=i.getParameter(i.MAX_TEXTURE_SIZE),g=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),p=i.getParameter(i.MAX_VERTEX_ATTRIBS),A=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),C=i.getParameter(i.MAX_VARYING_VECTORS),S=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),N=x>0,I=i.getParameter(i.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:a,getMaxPrecision:l,textureFormatReadable:s,textureTypeReadable:o,precision:c,logarithmicDepthBuffer:h,reverseDepthBuffer:f,maxTextures:m,maxVertexTextures:x,maxTextureSize:y,maxCubemapSize:g,maxAttributes:p,maxVertexUniforms:A,maxVaryings:C,maxFragmentUniforms:S,vertexTextures:N,maxSamples:I}}function Cm(i){const e=this;let t=null,n=0,r=!1,a=!1;const s=new zi,o=new Je,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(h,f){const m=h.length!==0||f||n!==0||r;return r=f,n=h.length,m},this.beginShadows=function(){a=!0,u(null)},this.endShadows=function(){a=!1},this.setGlobalState=function(h,f){t=u(h,f,0)},this.setState=function(h,f,m){const x=h.clippingPlanes,y=h.clipIntersection,g=h.clipShadows,p=i.get(h);if(!r||x===null||x.length===0||a&&!g)a?u(null):c();else{const A=a?0:n,C=A*4;let S=p.clippingState||null;l.value=S,S=u(x,f,C,m);for(let N=0;N!==C;++N)S[N]=t[N];p.clippingState=S,this.numIntersection=y?this.numPlanes:0,this.numPlanes+=A}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function u(h,f,m,x){const y=h!==null?h.length:0;let g=null;if(y!==0){if(g=l.value,x!==!0||g===null){const p=m+y*4,A=f.matrixWorldInverse;o.getNormalMatrix(A),(g===null||g.length<p)&&(g=new Float32Array(p));for(let C=0,S=m;C!==y;++C,S+=4)s.copy(h[C]).applyMatrix4(A,o),s.normal.toArray(g,S),g[S+3]=s.constant}l.value=g,l.needsUpdate=!0}return e.numPlanes=y,e.numIntersection=0,g}}function Rm(i){let e=new WeakMap;function t(s,o){return o===Mo?s.mapping=vr:o===So&&(s.mapping=gr),s}function n(s){if(s&&s.isTexture){const o=s.mapping;if(o===Mo||o===So)if(e.has(s)){const l=e.get(s).texture;return t(l,s.mapping)}else{const l=s.image;if(l&&l.height>0){const c=new Od(l.height);return c.fromEquirectangularTexture(i,s),e.set(s,c),s.addEventListener("dispose",r),t(c.texture,s.mapping)}else return null}}return s}function r(s){const o=s.target;o.removeEventListener("dispose",r);const l=e.get(o);l!==void 0&&(e.delete(o),l.dispose())}function a(){e=new WeakMap}return{get:n,dispose:a}}class mu extends du{constructor(e=-1,t=1,n=1,r=-1,a=.1,s=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=r,this.near=a,this.far=s,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,r,a,s){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=r,this.view.width=a,this.view.height=s,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,r=(this.top+this.bottom)/2;let a=n-e,s=n+e,o=r+t,l=r-t;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,u=(this.top-this.bottom)/this.view.fullHeight/this.zoom;a+=c*this.view.offsetX,s=a+c*this.view.width,o-=u*this.view.offsetY,l=o-u*this.view.height}this.projectionMatrix.makeOrthographic(a,s,o,l,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}const ur=4,El=[.125,.215,.35,.446,.526,.582],Hi=20,Hs=new mu,Al=new nt;let Vs=null,Gs=0,Ws=0,qs=!1;const Oi=(1+Math.sqrt(5))/2,lr=1/Oi,Cl=[new q(-Oi,lr,0),new q(Oi,lr,0),new q(-lr,0,Oi),new q(lr,0,Oi),new q(0,Oi,-lr),new q(0,Oi,lr),new q(-1,1,-1),new q(1,1,-1),new q(-1,1,1),new q(1,1,1)];class Rl{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,n=.1,r=100){Vs=this._renderer.getRenderTarget(),Gs=this._renderer.getActiveCubeFace(),Ws=this._renderer.getActiveMipmapLevel(),qs=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);const a=this._allocateTargets();return a.depthBuffer=!0,this._sceneToCubeUV(e,n,r,a),t>0&&this._blur(a,0,0,t),this._applyPMREM(a),this._cleanup(a),a}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Il(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Dl(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(Vs,Gs,Ws),this._renderer.xr.enabled=qs,e.scissorTest=!1,Ma(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===vr||e.mapping===gr?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Vs=this._renderer.getRenderTarget(),Gs=this._renderer.getActiveCubeFace(),Ws=this._renderer.getActiveMipmapLevel(),qs=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:Un,minFilter:Un,generateMipmaps:!1,type:Yr,format:Rn,colorSpace:wr,depthBuffer:!1},r=Pl(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Pl(e,t,n);const{_lodMax:a}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=Pm(a)),this._blurMaterial=Dm(a,e,t)}return r}_compileMaterial(e){const t=new Xe(this._lodPlanes[0],e);this._renderer.compile(t,Hs)}_sceneToCubeUV(e,t,n,r){const o=new hn(90,1,t,n),l=[1,-1,1,1,1,1],c=[1,1,1,-1,-1,-1],u=this._renderer,h=u.autoClear,f=u.toneMapping;u.getClearColor(Al),u.toneMapping=_i,u.autoClear=!1;const m=new Wr({name:"PMREM.Background",side:sn,depthWrite:!1,depthTest:!1}),x=new Xe(new an,m);let y=!1;const g=e.background;g?g.isColor&&(m.color.copy(g),e.background=null,y=!0):(m.color.copy(Al),y=!0);for(let p=0;p<6;p++){const A=p%3;A===0?(o.up.set(0,l[p],0),o.lookAt(c[p],0,0)):A===1?(o.up.set(0,0,l[p]),o.lookAt(0,c[p],0)):(o.up.set(0,l[p],0),o.lookAt(0,0,c[p]));const C=this._cubeSize;Ma(r,A*C,p>2?C:0,C,C),u.setRenderTarget(r),y&&u.render(x,o),u.render(e,o)}x.geometry.dispose(),x.material.dispose(),u.toneMapping=f,u.autoClear=h,e.background=g}_textureToCubeUV(e,t){const n=this._renderer,r=e.mapping===vr||e.mapping===gr;r?(this._cubemapMaterial===null&&(this._cubemapMaterial=Il()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Dl());const a=r?this._cubemapMaterial:this._equirectMaterial,s=new Xe(this._lodPlanes[0],a),o=a.uniforms;o.envMap.value=e;const l=this._cubeSize;Ma(t,0,0,3*l,2*l),n.setRenderTarget(t),n.render(s,Hs)}_applyPMREM(e){const t=this._renderer,n=t.autoClear;t.autoClear=!1;const r=this._lodPlanes.length;for(let a=1;a<r;a++){const s=Math.sqrt(this._sigmas[a]*this._sigmas[a]-this._sigmas[a-1]*this._sigmas[a-1]),o=Cl[(r-a-1)%Cl.length];this._blur(e,a-1,a,s,o)}t.autoClear=n}_blur(e,t,n,r,a){const s=this._pingPongRenderTarget;this._halfBlur(e,s,t,n,r,"latitudinal",a),this._halfBlur(s,e,n,n,r,"longitudinal",a)}_halfBlur(e,t,n,r,a,s,o){const l=this._renderer,c=this._blurMaterial;s!=="latitudinal"&&s!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const u=3,h=new Xe(this._lodPlanes[r],c),f=c.uniforms,m=this._sizeLods[n]-1,x=isFinite(a)?Math.PI/(2*m):2*Math.PI/(2*Hi-1),y=a/x,g=isFinite(a)?1+Math.floor(u*y):Hi;g>Hi&&console.warn(`sigmaRadians, ${a}, is too large and will clip, as it requested ${g} samples when the maximum is set to ${Hi}`);const p=[];let A=0;for(let D=0;D<Hi;++D){const U=D/y,T=Math.exp(-U*U/2);p.push(T),D===0?A+=T:D<g&&(A+=2*T)}for(let D=0;D<p.length;D++)p[D]=p[D]/A;f.envMap.value=e.texture,f.samples.value=g,f.weights.value=p,f.latitudinal.value=s==="latitudinal",o&&(f.poleAxis.value=o);const{_lodMax:C}=this;f.dTheta.value=x,f.mipInt.value=C-n;const S=this._sizeLods[r],N=3*S*(r>C-ur?r-C+ur:0),I=4*(this._cubeSize-S);Ma(t,N,I,3*S,2*S),l.setRenderTarget(t),l.render(h,Hs)}}function Pm(i){const e=[],t=[],n=[];let r=i;const a=i-ur+1+El.length;for(let s=0;s<a;s++){const o=Math.pow(2,r);t.push(o);let l=1/o;s>i-ur?l=El[s-i+ur-1]:s===0&&(l=0),n.push(l);const c=1/(o-2),u=-c,h=1+c,f=[u,u,h,u,h,h,u,u,h,h,u,h],m=6,x=6,y=3,g=2,p=1,A=new Float32Array(y*x*m),C=new Float32Array(g*x*m),S=new Float32Array(p*x*m);for(let I=0;I<m;I++){const D=I%3*2/3-1,U=I>2?0:-1,T=[D,U,0,D+2/3,U,0,D+2/3,U+1,0,D,U,0,D+2/3,U+1,0,D,U+1,0];A.set(T,y*x*I),C.set(f,g*x*I);const w=[I,I,I,I,I,I];S.set(w,p*x*I)}const N=new bn;N.setAttribute("position",new Dn(A,y)),N.setAttribute("uv",new Dn(C,g)),N.setAttribute("faceIndex",new Dn(S,p)),e.push(N),r>ur&&r--}return{lodPlanes:e,sizeLods:t,sigmas:n}}function Pl(i,e,t){const n=new Xi(i,e,t);return n.texture.mapping=Ja,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function Ma(i,e,t,n,r){i.viewport.set(e,t,n,r),i.scissor.set(e,t,n,r)}function Dm(i,e,t){const n=new Float32Array(Hi),r=new q(0,1,0);return new Si({name:"SphericalGaussianBlur",defines:{n:Hi,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:r}},vertexShader:C0(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:yi,depthTest:!1,depthWrite:!1})}function Dl(){return new Si({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:C0(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:yi,depthTest:!1,depthWrite:!1})}function Il(){return new Si({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:C0(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:yi,depthTest:!1,depthWrite:!1})}function C0(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function Im(i){let e=new WeakMap,t=null;function n(o){if(o&&o.isTexture){const l=o.mapping,c=l===Mo||l===So,u=l===vr||l===gr;if(c||u){let h=e.get(o);const f=h!==void 0?h.texture.pmremVersion:0;if(o.isRenderTargetTexture&&o.pmremVersion!==f)return t===null&&(t=new Rl(i)),h=c?t.fromEquirectangular(o,h):t.fromCubemap(o,h),h.texture.pmremVersion=o.pmremVersion,e.set(o,h),h.texture;if(h!==void 0)return h.texture;{const m=o.image;return c&&m&&m.height>0||u&&m&&r(m)?(t===null&&(t=new Rl(i)),h=c?t.fromEquirectangular(o):t.fromCubemap(o),h.texture.pmremVersion=o.pmremVersion,e.set(o,h),o.addEventListener("dispose",a),h.texture):null}}}return o}function r(o){let l=0;const c=6;for(let u=0;u<c;u++)o[u]!==void 0&&l++;return l===c}function a(o){const l=o.target;l.removeEventListener("dispose",a);const c=e.get(l);c!==void 0&&(e.delete(l),c.dispose())}function s(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:n,dispose:s}}function Lm(i){const e={};function t(n){if(e[n]!==void 0)return e[n];let r;switch(n){case"WEBGL_depth_texture":r=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":r=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":r=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":r=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:r=i.getExtension(n)}return e[n]=r,r}return{has:function(n){return t(n)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(n){const r=t(n);return r===null&&Or("THREE.WebGLRenderer: "+n+" extension not supported."),r}}}function Fm(i,e,t,n){const r={},a=new WeakMap;function s(h){const f=h.target;f.index!==null&&e.remove(f.index);for(const x in f.attributes)e.remove(f.attributes[x]);for(const x in f.morphAttributes){const y=f.morphAttributes[x];for(let g=0,p=y.length;g<p;g++)e.remove(y[g])}f.removeEventListener("dispose",s),delete r[f.id];const m=a.get(f);m&&(e.remove(m),a.delete(f)),n.releaseStatesOfGeometry(f),f.isInstancedBufferGeometry===!0&&delete f._maxInstanceCount,t.memory.geometries--}function o(h,f){return r[f.id]===!0||(f.addEventListener("dispose",s),r[f.id]=!0,t.memory.geometries++),f}function l(h){const f=h.attributes;for(const x in f)e.update(f[x],i.ARRAY_BUFFER);const m=h.morphAttributes;for(const x in m){const y=m[x];for(let g=0,p=y.length;g<p;g++)e.update(y[g],i.ARRAY_BUFFER)}}function c(h){const f=[],m=h.index,x=h.attributes.position;let y=0;if(m!==null){const A=m.array;y=m.version;for(let C=0,S=A.length;C<S;C+=3){const N=A[C+0],I=A[C+1],D=A[C+2];f.push(N,I,I,D,D,N)}}else if(x!==void 0){const A=x.array;y=x.version;for(let C=0,S=A.length/3-1;C<S;C+=3){const N=C+0,I=C+1,D=C+2;f.push(N,I,I,D,D,N)}}else return;const g=new(iu(f)?uu:cu)(f,1);g.version=y;const p=a.get(h);p&&e.remove(p),a.set(h,g)}function u(h){const f=a.get(h);if(f){const m=h.index;m!==null&&f.version<m.version&&c(h)}else c(h);return a.get(h)}return{get:o,update:l,getWireframeAttribute:u}}function Um(i,e,t){let n;function r(f){n=f}let a,s;function o(f){a=f.type,s=f.bytesPerElement}function l(f,m){i.drawElements(n,m,a,f*s),t.update(m,n,1)}function c(f,m,x){x!==0&&(i.drawElementsInstanced(n,m,a,f*s,x),t.update(m,n,x))}function u(f,m,x){if(x===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,m,0,a,f,0,x);let g=0;for(let p=0;p<x;p++)g+=m[p];t.update(g,n,1)}function h(f,m,x,y){if(x===0)return;const g=e.get("WEBGL_multi_draw");if(g===null)for(let p=0;p<f.length;p++)c(f[p]/s,m[p],y[p]);else{g.multiDrawElementsInstancedWEBGL(n,m,0,a,f,0,y,0,x);let p=0;for(let A=0;A<x;A++)p+=m[A]*y[A];t.update(p,n,1)}}this.setMode=r,this.setIndex=o,this.render=l,this.renderInstances=c,this.renderMultiDraw=u,this.renderMultiDrawInstances=h}function Nm(i){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(a,s,o){switch(t.calls++,s){case i.TRIANGLES:t.triangles+=o*(a/3);break;case i.LINES:t.lines+=o*(a/2);break;case i.LINE_STRIP:t.lines+=o*(a-1);break;case i.LINE_LOOP:t.lines+=o*a;break;case i.POINTS:t.points+=o*a;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",s);break}}function r(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:r,update:n}}function km(i,e,t){const n=new WeakMap,r=new It;function a(s,o,l){const c=s.morphTargetInfluences,u=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,h=u!==void 0?u.length:0;let f=n.get(o);if(f===void 0||f.count!==h){let w=function(){U.dispose(),n.delete(o),o.removeEventListener("dispose",w)};var m=w;f!==void 0&&f.texture.dispose();const x=o.morphAttributes.position!==void 0,y=o.morphAttributes.normal!==void 0,g=o.morphAttributes.color!==void 0,p=o.morphAttributes.position||[],A=o.morphAttributes.normal||[],C=o.morphAttributes.color||[];let S=0;x===!0&&(S=1),y===!0&&(S=2),g===!0&&(S=3);let N=o.attributes.position.count*S,I=1;N>e.maxTextureSize&&(I=Math.ceil(N/e.maxTextureSize),N=e.maxTextureSize);const D=new Float32Array(N*I*4*h),U=new au(D,N,I,h);U.type=Jn,U.needsUpdate=!0;const T=S*4;for(let F=0;F<h;F++){const V=p[F],G=A[F],K=C[F],J=N*I*4*F;for(let j=0;j<V.count;j++){const te=j*T;x===!0&&(r.fromBufferAttribute(V,j),D[J+te+0]=r.x,D[J+te+1]=r.y,D[J+te+2]=r.z,D[J+te+3]=0),y===!0&&(r.fromBufferAttribute(G,j),D[J+te+4]=r.x,D[J+te+5]=r.y,D[J+te+6]=r.z,D[J+te+7]=0),g===!0&&(r.fromBufferAttribute(K,j),D[J+te+8]=r.x,D[J+te+9]=r.y,D[J+te+10]=r.z,D[J+te+11]=K.itemSize===4?r.w:1)}}f={count:h,texture:U,size:new ut(N,I)},n.set(o,f),o.addEventListener("dispose",w)}if(s.isInstancedMesh===!0&&s.morphTexture!==null)l.getUniforms().setValue(i,"morphTexture",s.morphTexture,t);else{let x=0;for(let g=0;g<c.length;g++)x+=c[g];const y=o.morphTargetsRelative?1:1-x;l.getUniforms().setValue(i,"morphTargetBaseInfluence",y),l.getUniforms().setValue(i,"morphTargetInfluences",c)}l.getUniforms().setValue(i,"morphTargetsTexture",f.texture,t),l.getUniforms().setValue(i,"morphTargetsTextureSize",f.size)}return{update:a}}function zm(i,e,t,n){let r=new WeakMap;function a(l){const c=n.render.frame,u=l.geometry,h=e.get(l,u);if(r.get(h)!==c&&(e.update(h),r.set(h,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",o)===!1&&l.addEventListener("dispose",o),r.get(l)!==c&&(t.update(l.instanceMatrix,i.ARRAY_BUFFER),l.instanceColor!==null&&t.update(l.instanceColor,i.ARRAY_BUFFER),r.set(l,c))),l.isSkinnedMesh){const f=l.skeleton;r.get(f)!==c&&(f.update(),r.set(f,c))}return h}function s(){r=new WeakMap}function o(l){const c=l.target;c.removeEventListener("dispose",o),t.remove(c.instanceMatrix),c.instanceColor!==null&&t.remove(c.instanceColor)}return{update:a,dispose:s}}class vu extends on{constructor(e,t,n,r,a,s,o,l,c,u=dr){if(u!==dr&&u!==yr)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");n===void 0&&u===dr&&(n=qi),n===void 0&&u===yr&&(n=xr),super(null,r,a,s,o,l,u,n,c),this.isDepthTexture=!0,this.image={width:e,height:t},this.magFilter=o!==void 0?o:Pn,this.minFilter=l!==void 0?l:Pn,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}const gu=new on,Ll=new vu(1,1),xu=new au,yu=new Sd,_u=new fu,Fl=[],Ul=[],Nl=new Float32Array(16),kl=new Float32Array(9),zl=new Float32Array(4);function Ar(i,e,t){const n=i[0];if(n<=0||n>0)return i;const r=e*t;let a=Fl[r];if(a===void 0&&(a=new Float32Array(r),Fl[r]=a),e!==0){n.toArray(a,0);for(let s=1,o=0;s!==e;++s)o+=t,i[s].toArray(a,o)}return a}function zt(i,e){if(i.length!==e.length)return!1;for(let t=0,n=i.length;t<n;t++)if(i[t]!==e[t])return!1;return!0}function Ot(i,e){for(let t=0,n=e.length;t<n;t++)i[t]=e[t]}function ns(i,e){let t=Ul[e];t===void 0&&(t=new Int32Array(e),Ul[e]=t);for(let n=0;n!==e;++n)t[n]=i.allocateTextureUnit();return t}function Om(i,e){const t=this.cache;t[0]!==e&&(i.uniform1f(this.addr,e),t[0]=e)}function Bm(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(zt(t,e))return;i.uniform2fv(this.addr,e),Ot(t,e)}}function Hm(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(i.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(zt(t,e))return;i.uniform3fv(this.addr,e),Ot(t,e)}}function Vm(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(zt(t,e))return;i.uniform4fv(this.addr,e),Ot(t,e)}}function Gm(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(zt(t,e))return;i.uniformMatrix2fv(this.addr,!1,e),Ot(t,e)}else{if(zt(t,n))return;zl.set(n),i.uniformMatrix2fv(this.addr,!1,zl),Ot(t,n)}}function Wm(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(zt(t,e))return;i.uniformMatrix3fv(this.addr,!1,e),Ot(t,e)}else{if(zt(t,n))return;kl.set(n),i.uniformMatrix3fv(this.addr,!1,kl),Ot(t,n)}}function qm(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(zt(t,e))return;i.uniformMatrix4fv(this.addr,!1,e),Ot(t,e)}else{if(zt(t,n))return;Nl.set(n),i.uniformMatrix4fv(this.addr,!1,Nl),Ot(t,n)}}function Xm(i,e){const t=this.cache;t[0]!==e&&(i.uniform1i(this.addr,e),t[0]=e)}function $m(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(zt(t,e))return;i.uniform2iv(this.addr,e),Ot(t,e)}}function Ym(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(zt(t,e))return;i.uniform3iv(this.addr,e),Ot(t,e)}}function Km(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(zt(t,e))return;i.uniform4iv(this.addr,e),Ot(t,e)}}function jm(i,e){const t=this.cache;t[0]!==e&&(i.uniform1ui(this.addr,e),t[0]=e)}function Zm(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(zt(t,e))return;i.uniform2uiv(this.addr,e),Ot(t,e)}}function Jm(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(zt(t,e))return;i.uniform3uiv(this.addr,e),Ot(t,e)}}function Qm(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(zt(t,e))return;i.uniform4uiv(this.addr,e),Ot(t,e)}}function e1(i,e,t){const n=this.cache,r=t.allocateTextureUnit();n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r);let a;this.type===i.SAMPLER_2D_SHADOW?(Ll.compareFunction=nu,a=Ll):a=gu,t.setTexture2D(e||a,r)}function t1(i,e,t){const n=this.cache,r=t.allocateTextureUnit();n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r),t.setTexture3D(e||yu,r)}function n1(i,e,t){const n=this.cache,r=t.allocateTextureUnit();n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r),t.setTextureCube(e||_u,r)}function i1(i,e,t){const n=this.cache,r=t.allocateTextureUnit();n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r),t.setTexture2DArray(e||xu,r)}function r1(i){switch(i){case 5126:return Om;case 35664:return Bm;case 35665:return Hm;case 35666:return Vm;case 35674:return Gm;case 35675:return Wm;case 35676:return qm;case 5124:case 35670:return Xm;case 35667:case 35671:return $m;case 35668:case 35672:return Ym;case 35669:case 35673:return Km;case 5125:return jm;case 36294:return Zm;case 36295:return Jm;case 36296:return Qm;case 35678:case 36198:case 36298:case 36306:case 35682:return e1;case 35679:case 36299:case 36307:return t1;case 35680:case 36300:case 36308:case 36293:return n1;case 36289:case 36303:case 36311:case 36292:return i1}}function a1(i,e){i.uniform1fv(this.addr,e)}function s1(i,e){const t=Ar(e,this.size,2);i.uniform2fv(this.addr,t)}function o1(i,e){const t=Ar(e,this.size,3);i.uniform3fv(this.addr,t)}function l1(i,e){const t=Ar(e,this.size,4);i.uniform4fv(this.addr,t)}function c1(i,e){const t=Ar(e,this.size,4);i.uniformMatrix2fv(this.addr,!1,t)}function u1(i,e){const t=Ar(e,this.size,9);i.uniformMatrix3fv(this.addr,!1,t)}function h1(i,e){const t=Ar(e,this.size,16);i.uniformMatrix4fv(this.addr,!1,t)}function d1(i,e){i.uniform1iv(this.addr,e)}function f1(i,e){i.uniform2iv(this.addr,e)}function p1(i,e){i.uniform3iv(this.addr,e)}function m1(i,e){i.uniform4iv(this.addr,e)}function v1(i,e){i.uniform1uiv(this.addr,e)}function g1(i,e){i.uniform2uiv(this.addr,e)}function x1(i,e){i.uniform3uiv(this.addr,e)}function y1(i,e){i.uniform4uiv(this.addr,e)}function _1(i,e,t){const n=this.cache,r=e.length,a=ns(t,r);zt(n,a)||(i.uniform1iv(this.addr,a),Ot(n,a));for(let s=0;s!==r;++s)t.setTexture2D(e[s]||gu,a[s])}function b1(i,e,t){const n=this.cache,r=e.length,a=ns(t,r);zt(n,a)||(i.uniform1iv(this.addr,a),Ot(n,a));for(let s=0;s!==r;++s)t.setTexture3D(e[s]||yu,a[s])}function M1(i,e,t){const n=this.cache,r=e.length,a=ns(t,r);zt(n,a)||(i.uniform1iv(this.addr,a),Ot(n,a));for(let s=0;s!==r;++s)t.setTextureCube(e[s]||_u,a[s])}function S1(i,e,t){const n=this.cache,r=e.length,a=ns(t,r);zt(n,a)||(i.uniform1iv(this.addr,a),Ot(n,a));for(let s=0;s!==r;++s)t.setTexture2DArray(e[s]||xu,a[s])}function w1(i){switch(i){case 5126:return a1;case 35664:return s1;case 35665:return o1;case 35666:return l1;case 35674:return c1;case 35675:return u1;case 35676:return h1;case 5124:case 35670:return d1;case 35667:case 35671:return f1;case 35668:case 35672:return p1;case 35669:case 35673:return m1;case 5125:return v1;case 36294:return g1;case 36295:return x1;case 36296:return y1;case 35678:case 36198:case 36298:case 36306:case 35682:return _1;case 35679:case 36299:case 36307:return b1;case 35680:case 36300:case 36308:case 36293:return M1;case 36289:case 36303:case 36311:case 36292:return S1}}class T1{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=r1(t.type)}}class E1{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=w1(t.type)}}class A1{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){const r=this.seq;for(let a=0,s=r.length;a!==s;++a){const o=r[a];o.setValue(e,t[o.id],n)}}}const Xs=/(\w+)(\])?(\[|\.)?/g;function Ol(i,e){i.seq.push(e),i.map[e.id]=e}function C1(i,e,t){const n=i.name,r=n.length;for(Xs.lastIndex=0;;){const a=Xs.exec(n),s=Xs.lastIndex;let o=a[1];const l=a[2]==="]",c=a[3];if(l&&(o=o|0),c===void 0||c==="["&&s+2===r){Ol(t,c===void 0?new T1(o,i,e):new E1(o,i,e));break}else{let h=t.map[o];h===void 0&&(h=new A1(o),Ol(t,h)),t=h}}}class Oa{constructor(e,t){this.seq=[],this.map={};const n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let r=0;r<n;++r){const a=e.getActiveUniform(t,r),s=e.getUniformLocation(t,a.name);C1(a,s,this)}}setValue(e,t,n,r){const a=this.map[t];a!==void 0&&a.setValue(e,n,r)}setOptional(e,t,n){const r=t[n];r!==void 0&&this.setValue(e,n,r)}static upload(e,t,n,r){for(let a=0,s=t.length;a!==s;++a){const o=t[a],l=n[o.id];l.needsUpdate!==!1&&o.setValue(e,l.value,r)}}static seqWithValue(e,t){const n=[];for(let r=0,a=e.length;r!==a;++r){const s=e[r];s.id in t&&n.push(s)}return n}}function Bl(i,e,t){const n=i.createShader(e);return i.shaderSource(n,t),i.compileShader(n),n}const R1=37297;let P1=0;function D1(i,e){const t=i.split(`
`),n=[],r=Math.max(e-6,0),a=Math.min(e+6,t.length);for(let s=r;s<a;s++){const o=s+1;n.push(`${o===e?">":" "} ${o}: ${t[s]}`)}return n.join(`
`)}const Hl=new Je;function I1(i){ot._getMatrix(Hl,ot.workingColorSpace,i);const e=`mat3( ${Hl.elements.map(t=>t.toFixed(4))} )`;switch(ot.getTransfer(i)){case Qa:return[e,"LinearTransferOETF"];case gt:return[e,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",i),[e,"LinearTransferOETF"]}}function Vl(i,e,t){const n=i.getShaderParameter(e,i.COMPILE_STATUS),r=i.getShaderInfoLog(e).trim();if(n&&r==="")return"";const a=/ERROR: 0:(\d+)/.exec(r);if(a){const s=parseInt(a[1]);return t.toUpperCase()+`

`+r+`

`+D1(i.getShaderSource(e),s)}else return r}function L1(i,e){const t=I1(e);return[`vec4 ${i}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}function F1(i,e){let t;switch(e){case jh:t="Linear";break;case Zh:t="Reinhard";break;case Jh:t="Cineon";break;case Qh:t="ACESFilmic";break;case td:t="AgX";break;case nd:t="Neutral";break;case ed:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+i+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const Sa=new q;function U1(){ot.getLuminanceCoefficients(Sa);const i=Sa.x.toFixed(4),e=Sa.y.toFixed(4),t=Sa.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function N1(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Br).join(`
`)}function k1(i){const e=[];for(const t in i){const n=i[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function z1(i,e){const t={},n=i.getProgramParameter(e,i.ACTIVE_ATTRIBUTES);for(let r=0;r<n;r++){const a=i.getActiveAttrib(e,r),s=a.name;let o=1;a.type===i.FLOAT_MAT2&&(o=2),a.type===i.FLOAT_MAT3&&(o=3),a.type===i.FLOAT_MAT4&&(o=4),t[s]={type:a.type,location:i.getAttribLocation(e,s),locationSize:o}}return t}function Br(i){return i!==""}function Gl(i,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function Wl(i,e){return i.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const O1=/^[ \t]*#include +<([\w\d./]+)>/gm;function Qo(i){return i.replace(O1,H1)}const B1=new Map;function H1(i,e){let t=tt[e];if(t===void 0){const n=B1.get(e);if(n!==void 0)t=tt[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n);else throw new Error("Can not resolve #include <"+e+">")}return Qo(t)}const V1=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function ql(i){return i.replace(V1,G1)}function G1(i,e,t,n){let r="";for(let a=parseInt(e);a<parseInt(t);a++)r+=n.replace(/\[\s*i\s*\]/g,"[ "+a+" ]").replace(/UNROLLED_LOOP_INDEX/g,a);return r}function Xl(i){let e=`precision ${i.precision} float;
	precision ${i.precision} int;
	precision ${i.precision} sampler2D;
	precision ${i.precision} samplerCube;
	precision ${i.precision} sampler3D;
	precision ${i.precision} sampler2DArray;
	precision ${i.precision} sampler2DShadow;
	precision ${i.precision} samplerCubeShadow;
	precision ${i.precision} sampler2DArrayShadow;
	precision ${i.precision} isampler2D;
	precision ${i.precision} isampler3D;
	precision ${i.precision} isamplerCube;
	precision ${i.precision} isampler2DArray;
	precision ${i.precision} usampler2D;
	precision ${i.precision} usampler3D;
	precision ${i.precision} usamplerCube;
	precision ${i.precision} usampler2DArray;
	`;return i.precision==="highp"?e+=`
#define HIGH_PRECISION`:i.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}function W1(i){let e="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===Vc?e="SHADOWMAP_TYPE_PCF":i.shadowMapType===Rh?e="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===jn&&(e="SHADOWMAP_TYPE_VSM"),e}function q1(i){let e="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case vr:case gr:e="ENVMAP_TYPE_CUBE";break;case Ja:e="ENVMAP_TYPE_CUBE_UV";break}return e}function X1(i){let e="ENVMAP_MODE_REFLECTION";if(i.envMap)switch(i.envMapMode){case gr:e="ENVMAP_MODE_REFRACTION";break}return e}function $1(i){let e="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case Gc:e="ENVMAP_BLENDING_MULTIPLY";break;case Yh:e="ENVMAP_BLENDING_MIX";break;case Kh:e="ENVMAP_BLENDING_ADD";break}return e}function Y1(i){const e=i.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),7*16)),texelHeight:n,maxMip:t}}function K1(i,e,t,n){const r=i.getContext(),a=t.defines;let s=t.vertexShader,o=t.fragmentShader;const l=W1(t),c=q1(t),u=X1(t),h=$1(t),f=Y1(t),m=N1(t),x=k1(a),y=r.createProgram();let g,p,A=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(g=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,x].filter(Br).join(`
`),g.length>0&&(g+=`
`),p=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,x].filter(Br).join(`
`),p.length>0&&(p+=`
`)):(g=[Xl(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,x,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+u:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Br).join(`
`),p=[Xl(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,x,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+u:"",t.envMap?"#define "+h:"",f?"#define CUBEUV_TEXEL_WIDTH "+f.texelWidth:"",f?"#define CUBEUV_TEXEL_HEIGHT "+f.texelHeight:"",f?"#define CUBEUV_MAX_MIP "+f.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==_i?"#define TONE_MAPPING":"",t.toneMapping!==_i?tt.tonemapping_pars_fragment:"",t.toneMapping!==_i?F1("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",tt.colorspace_pars_fragment,L1("linearToOutputTexel",t.outputColorSpace),U1(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(Br).join(`
`)),s=Qo(s),s=Gl(s,t),s=Wl(s,t),o=Qo(o),o=Gl(o,t),o=Wl(o,t),s=ql(s),o=ql(o),t.isRawShaderMaterial!==!0&&(A=`#version 300 es
`,g=[m,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+g,p=["#define varying in",t.glslVersion===al?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===al?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);const C=A+g+s,S=A+p+o,N=Bl(r,r.VERTEX_SHADER,C),I=Bl(r,r.FRAGMENT_SHADER,S);r.attachShader(y,N),r.attachShader(y,I),t.index0AttributeName!==void 0?r.bindAttribLocation(y,0,t.index0AttributeName):t.morphTargets===!0&&r.bindAttribLocation(y,0,"position"),r.linkProgram(y);function D(F){if(i.debug.checkShaderErrors){const V=r.getProgramInfoLog(y).trim(),G=r.getShaderInfoLog(N).trim(),K=r.getShaderInfoLog(I).trim();let J=!0,j=!0;if(r.getProgramParameter(y,r.LINK_STATUS)===!1)if(J=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(r,y,N,I);else{const te=Vl(r,N,"vertex"),Y=Vl(r,I,"fragment");console.error("THREE.WebGLProgram: Shader Error "+r.getError()+" - VALIDATE_STATUS "+r.getProgramParameter(y,r.VALIDATE_STATUS)+`

Material Name: `+F.name+`
Material Type: `+F.type+`

Program Info Log: `+V+`
`+te+`
`+Y)}else V!==""?console.warn("THREE.WebGLProgram: Program Info Log:",V):(G===""||K==="")&&(j=!1);j&&(F.diagnostics={runnable:J,programLog:V,vertexShader:{log:G,prefix:g},fragmentShader:{log:K,prefix:p}})}r.deleteShader(N),r.deleteShader(I),U=new Oa(r,y),T=z1(r,y)}let U;this.getUniforms=function(){return U===void 0&&D(this),U};let T;this.getAttributes=function(){return T===void 0&&D(this),T};let w=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return w===!1&&(w=r.getProgramParameter(y,R1)),w},this.destroy=function(){n.releaseStatesOfProgram(this),r.deleteProgram(y),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=P1++,this.cacheKey=e,this.usedTimes=1,this.program=y,this.vertexShader=N,this.fragmentShader=I,this}let j1=0;class Z1{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const t=e.vertexShader,n=e.fragmentShader,r=this._getShaderStage(t),a=this._getShaderStage(n),s=this._getShaderCacheForMaterial(e);return s.has(r)===!1&&(s.add(r),r.usedTimes++),s.has(a)===!1&&(s.add(a),a.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){const t=this.shaderCache;let n=t.get(e);return n===void 0&&(n=new J1(e),t.set(e,n)),n}}class J1{constructor(e){this.id=j1++,this.code=e,this.usedTimes=0}}function Q1(i,e,t,n,r,a,s){const o=new ou,l=new Z1,c=new Set,u=[],h=r.logarithmicDepthBuffer,f=r.vertexTextures;let m=r.precision;const x={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function y(T){return c.add(T),T===0?"uv":`uv${T}`}function g(T,w,F,V,G){const K=V.fog,J=G.geometry,j=T.isMeshStandardMaterial?V.environment:null,te=(T.isMeshStandardMaterial?t:e).get(T.envMap||j),Y=te&&te.mapping===Ja?te.image.height:null,fe=x[T.type];T.precision!==null&&(m=r.getMaxPrecision(T.precision),m!==T.precision&&console.warn("THREE.WebGLProgram.getParameters:",T.precision,"not supported, using",m,"instead."));const pe=J.morphAttributes.position||J.morphAttributes.normal||J.morphAttributes.color,ye=pe!==void 0?pe.length:0;let ke=0;J.morphAttributes.position!==void 0&&(ke=1),J.morphAttributes.normal!==void 0&&(ke=2),J.morphAttributes.color!==void 0&&(ke=3);let qe,Q,ce,Re;if(fe){const mt=Ln[fe];qe=mt.vertexShader,Q=mt.fragmentShader}else qe=T.vertexShader,Q=T.fragmentShader,l.update(T),ce=l.getVertexShaderID(T),Re=l.getFragmentShaderID(T);const me=i.getRenderTarget(),Ne=i.state.buffers.depth.getReversed(),ze=G.isInstancedMesh===!0,ve=G.isBatchedMesh===!0,Oe=!!T.map,We=!!T.matcap,lt=!!te,O=!!T.aoMap,en=!!T.lightMap,it=!!T.bumpMap,rt=!!T.normalMap,Be=!!T.displacementMap,vt=!!T.emissiveMap,Ue=!!T.metalnessMap,R=!!T.roughnessMap,b=T.anisotropy>0,W=T.clearcoat>0,ne=T.dispersion>0,ae=T.iridescence>0,ee=T.sheen>0,Pe=T.transmission>0,ge=b&&!!T.anisotropyMap,we=W&&!!T.clearcoatMap,st=W&&!!T.clearcoatNormalMap,he=W&&!!T.clearcoatRoughnessMap,Ae=ae&&!!T.iridescenceMap,Ve=ae&&!!T.iridescenceThicknessMap,$e=ee&&!!T.sheenColorMap,Ce=ee&&!!T.sheenRoughnessMap,at=!!T.specularMap,et=!!T.specularColorMap,yt=!!T.specularIntensityMap,z=Pe&&!!T.transmissionMap,_e=Pe&&!!T.thicknessMap,Z=!!T.gradientMap,ie=!!T.alphaMap,Te=T.alphaTest>0,Me=!!T.alphaHash,je=!!T.extensions;let Rt=_i;T.toneMapped&&(me===null||me.isXRRenderTarget===!0)&&(Rt=i.toneMapping);const Gt={shaderID:fe,shaderType:T.type,shaderName:T.name,vertexShader:qe,fragmentShader:Q,defines:T.defines,customVertexShaderID:ce,customFragmentShaderID:Re,isRawShaderMaterial:T.isRawShaderMaterial===!0,glslVersion:T.glslVersion,precision:m,batching:ve,batchingColor:ve&&G._colorsTexture!==null,instancing:ze,instancingColor:ze&&G.instanceColor!==null,instancingMorph:ze&&G.morphTexture!==null,supportsVertexTextures:f,outputColorSpace:me===null?i.outputColorSpace:me.isXRRenderTarget===!0?me.texture.colorSpace:wr,alphaToCoverage:!!T.alphaToCoverage,map:Oe,matcap:We,envMap:lt,envMapMode:lt&&te.mapping,envMapCubeUVHeight:Y,aoMap:O,lightMap:en,bumpMap:it,normalMap:rt,displacementMap:f&&Be,emissiveMap:vt,normalMapObjectSpace:rt&&T.normalMapType===sd,normalMapTangentSpace:rt&&T.normalMapType===tu,metalnessMap:Ue,roughnessMap:R,anisotropy:b,anisotropyMap:ge,clearcoat:W,clearcoatMap:we,clearcoatNormalMap:st,clearcoatRoughnessMap:he,dispersion:ne,iridescence:ae,iridescenceMap:Ae,iridescenceThicknessMap:Ve,sheen:ee,sheenColorMap:$e,sheenRoughnessMap:Ce,specularMap:at,specularColorMap:et,specularIntensityMap:yt,transmission:Pe,transmissionMap:z,thicknessMap:_e,gradientMap:Z,opaque:T.transparent===!1&&T.blending===hr&&T.alphaToCoverage===!1,alphaMap:ie,alphaTest:Te,alphaHash:Me,combine:T.combine,mapUv:Oe&&y(T.map.channel),aoMapUv:O&&y(T.aoMap.channel),lightMapUv:en&&y(T.lightMap.channel),bumpMapUv:it&&y(T.bumpMap.channel),normalMapUv:rt&&y(T.normalMap.channel),displacementMapUv:Be&&y(T.displacementMap.channel),emissiveMapUv:vt&&y(T.emissiveMap.channel),metalnessMapUv:Ue&&y(T.metalnessMap.channel),roughnessMapUv:R&&y(T.roughnessMap.channel),anisotropyMapUv:ge&&y(T.anisotropyMap.channel),clearcoatMapUv:we&&y(T.clearcoatMap.channel),clearcoatNormalMapUv:st&&y(T.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:he&&y(T.clearcoatRoughnessMap.channel),iridescenceMapUv:Ae&&y(T.iridescenceMap.channel),iridescenceThicknessMapUv:Ve&&y(T.iridescenceThicknessMap.channel),sheenColorMapUv:$e&&y(T.sheenColorMap.channel),sheenRoughnessMapUv:Ce&&y(T.sheenRoughnessMap.channel),specularMapUv:at&&y(T.specularMap.channel),specularColorMapUv:et&&y(T.specularColorMap.channel),specularIntensityMapUv:yt&&y(T.specularIntensityMap.channel),transmissionMapUv:z&&y(T.transmissionMap.channel),thicknessMapUv:_e&&y(T.thicknessMap.channel),alphaMapUv:ie&&y(T.alphaMap.channel),vertexTangents:!!J.attributes.tangent&&(rt||b),vertexColors:T.vertexColors,vertexAlphas:T.vertexColors===!0&&!!J.attributes.color&&J.attributes.color.itemSize===4,pointsUvs:G.isPoints===!0&&!!J.attributes.uv&&(Oe||ie),fog:!!K,useFog:T.fog===!0,fogExp2:!!K&&K.isFogExp2,flatShading:T.flatShading===!0,sizeAttenuation:T.sizeAttenuation===!0,logarithmicDepthBuffer:h,reverseDepthBuffer:Ne,skinning:G.isSkinnedMesh===!0,morphTargets:J.morphAttributes.position!==void 0,morphNormals:J.morphAttributes.normal!==void 0,morphColors:J.morphAttributes.color!==void 0,morphTargetsCount:ye,morphTextureStride:ke,numDirLights:w.directional.length,numPointLights:w.point.length,numSpotLights:w.spot.length,numSpotLightMaps:w.spotLightMap.length,numRectAreaLights:w.rectArea.length,numHemiLights:w.hemi.length,numDirLightShadows:w.directionalShadowMap.length,numPointLightShadows:w.pointShadowMap.length,numSpotLightShadows:w.spotShadowMap.length,numSpotLightShadowsWithMaps:w.numSpotLightShadowsWithMaps,numLightProbes:w.numLightProbes,numClippingPlanes:s.numPlanes,numClipIntersection:s.numIntersection,dithering:T.dithering,shadowMapEnabled:i.shadowMap.enabled&&F.length>0,shadowMapType:i.shadowMap.type,toneMapping:Rt,decodeVideoTexture:Oe&&T.map.isVideoTexture===!0&&ot.getTransfer(T.map.colorSpace)===gt,decodeVideoTextureEmissive:vt&&T.emissiveMap.isVideoTexture===!0&&ot.getTransfer(T.emissiveMap.colorSpace)===gt,premultipliedAlpha:T.premultipliedAlpha,doubleSided:T.side===An,flipSided:T.side===sn,useDepthPacking:T.depthPacking>=0,depthPacking:T.depthPacking||0,index0AttributeName:T.index0AttributeName,extensionClipCullDistance:je&&T.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(je&&T.extensions.multiDraw===!0||ve)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:T.customProgramCacheKey()};return Gt.vertexUv1s=c.has(1),Gt.vertexUv2s=c.has(2),Gt.vertexUv3s=c.has(3),c.clear(),Gt}function p(T){const w=[];if(T.shaderID?w.push(T.shaderID):(w.push(T.customVertexShaderID),w.push(T.customFragmentShaderID)),T.defines!==void 0)for(const F in T.defines)w.push(F),w.push(T.defines[F]);return T.isRawShaderMaterial===!1&&(A(w,T),C(w,T),w.push(i.outputColorSpace)),w.push(T.customProgramCacheKey),w.join()}function A(T,w){T.push(w.precision),T.push(w.outputColorSpace),T.push(w.envMapMode),T.push(w.envMapCubeUVHeight),T.push(w.mapUv),T.push(w.alphaMapUv),T.push(w.lightMapUv),T.push(w.aoMapUv),T.push(w.bumpMapUv),T.push(w.normalMapUv),T.push(w.displacementMapUv),T.push(w.emissiveMapUv),T.push(w.metalnessMapUv),T.push(w.roughnessMapUv),T.push(w.anisotropyMapUv),T.push(w.clearcoatMapUv),T.push(w.clearcoatNormalMapUv),T.push(w.clearcoatRoughnessMapUv),T.push(w.iridescenceMapUv),T.push(w.iridescenceThicknessMapUv),T.push(w.sheenColorMapUv),T.push(w.sheenRoughnessMapUv),T.push(w.specularMapUv),T.push(w.specularColorMapUv),T.push(w.specularIntensityMapUv),T.push(w.transmissionMapUv),T.push(w.thicknessMapUv),T.push(w.combine),T.push(w.fogExp2),T.push(w.sizeAttenuation),T.push(w.morphTargetsCount),T.push(w.morphAttributeCount),T.push(w.numDirLights),T.push(w.numPointLights),T.push(w.numSpotLights),T.push(w.numSpotLightMaps),T.push(w.numHemiLights),T.push(w.numRectAreaLights),T.push(w.numDirLightShadows),T.push(w.numPointLightShadows),T.push(w.numSpotLightShadows),T.push(w.numSpotLightShadowsWithMaps),T.push(w.numLightProbes),T.push(w.shadowMapType),T.push(w.toneMapping),T.push(w.numClippingPlanes),T.push(w.numClipIntersection),T.push(w.depthPacking)}function C(T,w){o.disableAll(),w.supportsVertexTextures&&o.enable(0),w.instancing&&o.enable(1),w.instancingColor&&o.enable(2),w.instancingMorph&&o.enable(3),w.matcap&&o.enable(4),w.envMap&&o.enable(5),w.normalMapObjectSpace&&o.enable(6),w.normalMapTangentSpace&&o.enable(7),w.clearcoat&&o.enable(8),w.iridescence&&o.enable(9),w.alphaTest&&o.enable(10),w.vertexColors&&o.enable(11),w.vertexAlphas&&o.enable(12),w.vertexUv1s&&o.enable(13),w.vertexUv2s&&o.enable(14),w.vertexUv3s&&o.enable(15),w.vertexTangents&&o.enable(16),w.anisotropy&&o.enable(17),w.alphaHash&&o.enable(18),w.batching&&o.enable(19),w.dispersion&&o.enable(20),w.batchingColor&&o.enable(21),T.push(o.mask),o.disableAll(),w.fog&&o.enable(0),w.useFog&&o.enable(1),w.flatShading&&o.enable(2),w.logarithmicDepthBuffer&&o.enable(3),w.reverseDepthBuffer&&o.enable(4),w.skinning&&o.enable(5),w.morphTargets&&o.enable(6),w.morphNormals&&o.enable(7),w.morphColors&&o.enable(8),w.premultipliedAlpha&&o.enable(9),w.shadowMapEnabled&&o.enable(10),w.doubleSided&&o.enable(11),w.flipSided&&o.enable(12),w.useDepthPacking&&o.enable(13),w.dithering&&o.enable(14),w.transmission&&o.enable(15),w.sheen&&o.enable(16),w.opaque&&o.enable(17),w.pointsUvs&&o.enable(18),w.decodeVideoTexture&&o.enable(19),w.decodeVideoTextureEmissive&&o.enable(20),w.alphaToCoverage&&o.enable(21),T.push(o.mask)}function S(T){const w=x[T.type];let F;if(w){const V=Ln[w];F=Ud.clone(V.uniforms)}else F=T.uniforms;return F}function N(T,w){let F;for(let V=0,G=u.length;V<G;V++){const K=u[V];if(K.cacheKey===w){F=K,++F.usedTimes;break}}return F===void 0&&(F=new K1(i,w,T,a),u.push(F)),F}function I(T){if(--T.usedTimes===0){const w=u.indexOf(T);u[w]=u[u.length-1],u.pop(),T.destroy()}}function D(T){l.remove(T)}function U(){l.dispose()}return{getParameters:g,getProgramCacheKey:p,getUniforms:S,acquireProgram:N,releaseProgram:I,releaseShaderCache:D,programs:u,dispose:U}}function ev(){let i=new WeakMap;function e(s){return i.has(s)}function t(s){let o=i.get(s);return o===void 0&&(o={},i.set(s,o)),o}function n(s){i.delete(s)}function r(s,o,l){i.get(s)[o]=l}function a(){i=new WeakMap}return{has:e,get:t,remove:n,update:r,dispose:a}}function tv(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.material.id!==e.material.id?i.material.id-e.material.id:i.z!==e.z?i.z-e.z:i.id-e.id}function $l(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.z!==e.z?e.z-i.z:i.id-e.id}function Yl(){const i=[];let e=0;const t=[],n=[],r=[];function a(){e=0,t.length=0,n.length=0,r.length=0}function s(h,f,m,x,y,g){let p=i[e];return p===void 0?(p={id:h.id,object:h,geometry:f,material:m,groupOrder:x,renderOrder:h.renderOrder,z:y,group:g},i[e]=p):(p.id=h.id,p.object=h,p.geometry=f,p.material=m,p.groupOrder=x,p.renderOrder=h.renderOrder,p.z=y,p.group=g),e++,p}function o(h,f,m,x,y,g){const p=s(h,f,m,x,y,g);m.transmission>0?n.push(p):m.transparent===!0?r.push(p):t.push(p)}function l(h,f,m,x,y,g){const p=s(h,f,m,x,y,g);m.transmission>0?n.unshift(p):m.transparent===!0?r.unshift(p):t.unshift(p)}function c(h,f){t.length>1&&t.sort(h||tv),n.length>1&&n.sort(f||$l),r.length>1&&r.sort(f||$l)}function u(){for(let h=e,f=i.length;h<f;h++){const m=i[h];if(m.id===null)break;m.id=null,m.object=null,m.geometry=null,m.material=null,m.group=null}}return{opaque:t,transmissive:n,transparent:r,init:a,push:o,unshift:l,finish:u,sort:c}}function nv(){let i=new WeakMap;function e(n,r){const a=i.get(n);let s;return a===void 0?(s=new Yl,i.set(n,[s])):r>=a.length?(s=new Yl,a.push(s)):s=a[r],s}function t(){i=new WeakMap}return{get:e,dispose:t}}function iv(){const i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new q,color:new nt};break;case"SpotLight":t={position:new q,direction:new q,color:new nt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new q,color:new nt,distance:0,decay:0};break;case"HemisphereLight":t={direction:new q,skyColor:new nt,groundColor:new nt};break;case"RectAreaLight":t={color:new nt,position:new q,halfWidth:new q,halfHeight:new q};break}return i[e.id]=t,t}}}function rv(){const i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ut};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ut};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ut,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[e.id]=t,t}}}let av=0;function sv(i,e){return(e.castShadow?2:0)-(i.castShadow?2:0)+(e.map?1:0)-(i.map?1:0)}function ov(i){const e=new iv,t=rv(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new q);const r=new q,a=new Ct,s=new Ct;function o(c){let u=0,h=0,f=0;for(let T=0;T<9;T++)n.probe[T].set(0,0,0);let m=0,x=0,y=0,g=0,p=0,A=0,C=0,S=0,N=0,I=0,D=0;c.sort(sv);for(let T=0,w=c.length;T<w;T++){const F=c[T],V=F.color,G=F.intensity,K=F.distance,J=F.shadow&&F.shadow.map?F.shadow.map.texture:null;if(F.isAmbientLight)u+=V.r*G,h+=V.g*G,f+=V.b*G;else if(F.isLightProbe){for(let j=0;j<9;j++)n.probe[j].addScaledVector(F.sh.coefficients[j],G);D++}else if(F.isDirectionalLight){const j=e.get(F);if(j.color.copy(F.color).multiplyScalar(F.intensity),F.castShadow){const te=F.shadow,Y=t.get(F);Y.shadowIntensity=te.intensity,Y.shadowBias=te.bias,Y.shadowNormalBias=te.normalBias,Y.shadowRadius=te.radius,Y.shadowMapSize=te.mapSize,n.directionalShadow[m]=Y,n.directionalShadowMap[m]=J,n.directionalShadowMatrix[m]=F.shadow.matrix,A++}n.directional[m]=j,m++}else if(F.isSpotLight){const j=e.get(F);j.position.setFromMatrixPosition(F.matrixWorld),j.color.copy(V).multiplyScalar(G),j.distance=K,j.coneCos=Math.cos(F.angle),j.penumbraCos=Math.cos(F.angle*(1-F.penumbra)),j.decay=F.decay,n.spot[y]=j;const te=F.shadow;if(F.map&&(n.spotLightMap[N]=F.map,N++,te.updateMatrices(F),F.castShadow&&I++),n.spotLightMatrix[y]=te.matrix,F.castShadow){const Y=t.get(F);Y.shadowIntensity=te.intensity,Y.shadowBias=te.bias,Y.shadowNormalBias=te.normalBias,Y.shadowRadius=te.radius,Y.shadowMapSize=te.mapSize,n.spotShadow[y]=Y,n.spotShadowMap[y]=J,S++}y++}else if(F.isRectAreaLight){const j=e.get(F);j.color.copy(V).multiplyScalar(G),j.halfWidth.set(F.width*.5,0,0),j.halfHeight.set(0,F.height*.5,0),n.rectArea[g]=j,g++}else if(F.isPointLight){const j=e.get(F);if(j.color.copy(F.color).multiplyScalar(F.intensity),j.distance=F.distance,j.decay=F.decay,F.castShadow){const te=F.shadow,Y=t.get(F);Y.shadowIntensity=te.intensity,Y.shadowBias=te.bias,Y.shadowNormalBias=te.normalBias,Y.shadowRadius=te.radius,Y.shadowMapSize=te.mapSize,Y.shadowCameraNear=te.camera.near,Y.shadowCameraFar=te.camera.far,n.pointShadow[x]=Y,n.pointShadowMap[x]=J,n.pointShadowMatrix[x]=F.shadow.matrix,C++}n.point[x]=j,x++}else if(F.isHemisphereLight){const j=e.get(F);j.skyColor.copy(F.color).multiplyScalar(G),j.groundColor.copy(F.groundColor).multiplyScalar(G),n.hemi[p]=j,p++}}g>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=xe.LTC_FLOAT_1,n.rectAreaLTC2=xe.LTC_FLOAT_2):(n.rectAreaLTC1=xe.LTC_HALF_1,n.rectAreaLTC2=xe.LTC_HALF_2)),n.ambient[0]=u,n.ambient[1]=h,n.ambient[2]=f;const U=n.hash;(U.directionalLength!==m||U.pointLength!==x||U.spotLength!==y||U.rectAreaLength!==g||U.hemiLength!==p||U.numDirectionalShadows!==A||U.numPointShadows!==C||U.numSpotShadows!==S||U.numSpotMaps!==N||U.numLightProbes!==D)&&(n.directional.length=m,n.spot.length=y,n.rectArea.length=g,n.point.length=x,n.hemi.length=p,n.directionalShadow.length=A,n.directionalShadowMap.length=A,n.pointShadow.length=C,n.pointShadowMap.length=C,n.spotShadow.length=S,n.spotShadowMap.length=S,n.directionalShadowMatrix.length=A,n.pointShadowMatrix.length=C,n.spotLightMatrix.length=S+N-I,n.spotLightMap.length=N,n.numSpotLightShadowsWithMaps=I,n.numLightProbes=D,U.directionalLength=m,U.pointLength=x,U.spotLength=y,U.rectAreaLength=g,U.hemiLength=p,U.numDirectionalShadows=A,U.numPointShadows=C,U.numSpotShadows=S,U.numSpotMaps=N,U.numLightProbes=D,n.version=av++)}function l(c,u){let h=0,f=0,m=0,x=0,y=0;const g=u.matrixWorldInverse;for(let p=0,A=c.length;p<A;p++){const C=c[p];if(C.isDirectionalLight){const S=n.directional[h];S.direction.setFromMatrixPosition(C.matrixWorld),r.setFromMatrixPosition(C.target.matrixWorld),S.direction.sub(r),S.direction.transformDirection(g),h++}else if(C.isSpotLight){const S=n.spot[m];S.position.setFromMatrixPosition(C.matrixWorld),S.position.applyMatrix4(g),S.direction.setFromMatrixPosition(C.matrixWorld),r.setFromMatrixPosition(C.target.matrixWorld),S.direction.sub(r),S.direction.transformDirection(g),m++}else if(C.isRectAreaLight){const S=n.rectArea[x];S.position.setFromMatrixPosition(C.matrixWorld),S.position.applyMatrix4(g),s.identity(),a.copy(C.matrixWorld),a.premultiply(g),s.extractRotation(a),S.halfWidth.set(C.width*.5,0,0),S.halfHeight.set(0,C.height*.5,0),S.halfWidth.applyMatrix4(s),S.halfHeight.applyMatrix4(s),x++}else if(C.isPointLight){const S=n.point[f];S.position.setFromMatrixPosition(C.matrixWorld),S.position.applyMatrix4(g),f++}else if(C.isHemisphereLight){const S=n.hemi[y];S.direction.setFromMatrixPosition(C.matrixWorld),S.direction.transformDirection(g),y++}}}return{setup:o,setupView:l,state:n}}function Kl(i){const e=new ov(i),t=[],n=[];function r(u){c.camera=u,t.length=0,n.length=0}function a(u){t.push(u)}function s(u){n.push(u)}function o(){e.setup(t)}function l(u){e.setupView(t,u)}const c={lightsArray:t,shadowsArray:n,camera:null,lights:e,transmissionRenderTarget:{}};return{init:r,state:c,setupLights:o,setupLightsView:l,pushLight:a,pushShadow:s}}function lv(i){let e=new WeakMap;function t(r,a=0){const s=e.get(r);let o;return s===void 0?(o=new Kl(i),e.set(r,[o])):a>=s.length?(o=new Kl(i),s.push(o)):o=s[a],o}function n(){e=new WeakMap}return{get:t,dispose:n}}class cv extends Er{static get type(){return"MeshDepthMaterial"}constructor(e){super(),this.isMeshDepthMaterial=!0,this.depthPacking=rd,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class uv extends Er{static get type(){return"MeshDistanceMaterial"}constructor(e){super(),this.isMeshDistanceMaterial=!0,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}const hv=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,dv=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function fv(i,e,t){let n=new A0;const r=new ut,a=new ut,s=new It,o=new cv({depthPacking:ad}),l=new uv,c={},u=t.maxTextureSize,h={[Mi]:sn,[sn]:Mi,[An]:An},f=new Si({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new ut},radius:{value:4}},vertexShader:hv,fragmentShader:dv}),m=f.clone();m.defines.HORIZONTAL_PASS=1;const x=new bn;x.setAttribute("position",new Dn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const y=new Xe(x,f),g=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Vc;let p=this.type;this.render=function(I,D,U){if(g.enabled===!1||g.autoUpdate===!1&&g.needsUpdate===!1||I.length===0)return;const T=i.getRenderTarget(),w=i.getActiveCubeFace(),F=i.getActiveMipmapLevel(),V=i.state;V.setBlending(yi),V.buffers.color.setClear(1,1,1,1),V.buffers.depth.setTest(!0),V.setScissorTest(!1);const G=p!==jn&&this.type===jn,K=p===jn&&this.type!==jn;for(let J=0,j=I.length;J<j;J++){const te=I[J],Y=te.shadow;if(Y===void 0){console.warn("THREE.WebGLShadowMap:",te,"has no shadow.");continue}if(Y.autoUpdate===!1&&Y.needsUpdate===!1)continue;r.copy(Y.mapSize);const fe=Y.getFrameExtents();if(r.multiply(fe),a.copy(Y.mapSize),(r.x>u||r.y>u)&&(r.x>u&&(a.x=Math.floor(u/fe.x),r.x=a.x*fe.x,Y.mapSize.x=a.x),r.y>u&&(a.y=Math.floor(u/fe.y),r.y=a.y*fe.y,Y.mapSize.y=a.y)),Y.map===null||G===!0||K===!0){const ye=this.type!==jn?{minFilter:Pn,magFilter:Pn}:{};Y.map!==null&&Y.map.dispose(),Y.map=new Xi(r.x,r.y,ye),Y.map.texture.name=te.name+".shadowMap",Y.camera.updateProjectionMatrix()}i.setRenderTarget(Y.map),i.clear();const pe=Y.getViewportCount();for(let ye=0;ye<pe;ye++){const ke=Y.getViewport(ye);s.set(a.x*ke.x,a.y*ke.y,a.x*ke.z,a.y*ke.w),V.viewport(s),Y.updateMatrices(te,ye),n=Y.getFrustum(),S(D,U,Y.camera,te,this.type)}Y.isPointLightShadow!==!0&&this.type===jn&&A(Y,U),Y.needsUpdate=!1}p=this.type,g.needsUpdate=!1,i.setRenderTarget(T,w,F)};function A(I,D){const U=e.update(y);f.defines.VSM_SAMPLES!==I.blurSamples&&(f.defines.VSM_SAMPLES=I.blurSamples,m.defines.VSM_SAMPLES=I.blurSamples,f.needsUpdate=!0,m.needsUpdate=!0),I.mapPass===null&&(I.mapPass=new Xi(r.x,r.y)),f.uniforms.shadow_pass.value=I.map.texture,f.uniforms.resolution.value=I.mapSize,f.uniforms.radius.value=I.radius,i.setRenderTarget(I.mapPass),i.clear(),i.renderBufferDirect(D,null,U,f,y,null),m.uniforms.shadow_pass.value=I.mapPass.texture,m.uniforms.resolution.value=I.mapSize,m.uniforms.radius.value=I.radius,i.setRenderTarget(I.map),i.clear(),i.renderBufferDirect(D,null,U,m,y,null)}function C(I,D,U,T){let w=null;const F=U.isPointLight===!0?I.customDistanceMaterial:I.customDepthMaterial;if(F!==void 0)w=F;else if(w=U.isPointLight===!0?l:o,i.localClippingEnabled&&D.clipShadows===!0&&Array.isArray(D.clippingPlanes)&&D.clippingPlanes.length!==0||D.displacementMap&&D.displacementScale!==0||D.alphaMap&&D.alphaTest>0||D.map&&D.alphaTest>0){const V=w.uuid,G=D.uuid;let K=c[V];K===void 0&&(K={},c[V]=K);let J=K[G];J===void 0&&(J=w.clone(),K[G]=J,D.addEventListener("dispose",N)),w=J}if(w.visible=D.visible,w.wireframe=D.wireframe,T===jn?w.side=D.shadowSide!==null?D.shadowSide:D.side:w.side=D.shadowSide!==null?D.shadowSide:h[D.side],w.alphaMap=D.alphaMap,w.alphaTest=D.alphaTest,w.map=D.map,w.clipShadows=D.clipShadows,w.clippingPlanes=D.clippingPlanes,w.clipIntersection=D.clipIntersection,w.displacementMap=D.displacementMap,w.displacementScale=D.displacementScale,w.displacementBias=D.displacementBias,w.wireframeLinewidth=D.wireframeLinewidth,w.linewidth=D.linewidth,U.isPointLight===!0&&w.isMeshDistanceMaterial===!0){const V=i.properties.get(w);V.light=U}return w}function S(I,D,U,T,w){if(I.visible===!1)return;if(I.layers.test(D.layers)&&(I.isMesh||I.isLine||I.isPoints)&&(I.castShadow||I.receiveShadow&&w===jn)&&(!I.frustumCulled||n.intersectsObject(I))){I.modelViewMatrix.multiplyMatrices(U.matrixWorldInverse,I.matrixWorld);const G=e.update(I),K=I.material;if(Array.isArray(K)){const J=G.groups;for(let j=0,te=J.length;j<te;j++){const Y=J[j],fe=K[Y.materialIndex];if(fe&&fe.visible){const pe=C(I,fe,T,w);I.onBeforeShadow(i,I,D,U,G,pe,Y),i.renderBufferDirect(U,null,G,pe,I,Y),I.onAfterShadow(i,I,D,U,G,pe,Y)}}}else if(K.visible){const J=C(I,K,T,w);I.onBeforeShadow(i,I,D,U,G,J,null),i.renderBufferDirect(U,null,G,J,I,null),I.onAfterShadow(i,I,D,U,G,J,null)}}const V=I.children;for(let G=0,K=V.length;G<K;G++)S(V[G],D,U,T,w)}function N(I){I.target.removeEventListener("dispose",N);for(const U in c){const T=c[U],w=I.target.uuid;w in T&&(T[w].dispose(),delete T[w])}}}const pv={[mo]:vo,[go]:_o,[xo]:bo,[mr]:yo,[vo]:mo,[_o]:go,[bo]:xo,[yo]:mr};function mv(i,e){function t(){let z=!1;const _e=new It;let Z=null;const ie=new It(0,0,0,0);return{setMask:function(Te){Z!==Te&&!z&&(i.colorMask(Te,Te,Te,Te),Z=Te)},setLocked:function(Te){z=Te},setClear:function(Te,Me,je,Rt,Gt){Gt===!0&&(Te*=Rt,Me*=Rt,je*=Rt),_e.set(Te,Me,je,Rt),ie.equals(_e)===!1&&(i.clearColor(Te,Me,je,Rt),ie.copy(_e))},reset:function(){z=!1,Z=null,ie.set(-1,0,0,0)}}}function n(){let z=!1,_e=!1,Z=null,ie=null,Te=null;return{setReversed:function(Me){if(_e!==Me){const je=e.get("EXT_clip_control");_e?je.clipControlEXT(je.LOWER_LEFT_EXT,je.ZERO_TO_ONE_EXT):je.clipControlEXT(je.LOWER_LEFT_EXT,je.NEGATIVE_ONE_TO_ONE_EXT);const Rt=Te;Te=null,this.setClear(Rt)}_e=Me},getReversed:function(){return _e},setTest:function(Me){Me?me(i.DEPTH_TEST):Ne(i.DEPTH_TEST)},setMask:function(Me){Z!==Me&&!z&&(i.depthMask(Me),Z=Me)},setFunc:function(Me){if(_e&&(Me=pv[Me]),ie!==Me){switch(Me){case mo:i.depthFunc(i.NEVER);break;case vo:i.depthFunc(i.ALWAYS);break;case go:i.depthFunc(i.LESS);break;case mr:i.depthFunc(i.LEQUAL);break;case xo:i.depthFunc(i.EQUAL);break;case yo:i.depthFunc(i.GEQUAL);break;case _o:i.depthFunc(i.GREATER);break;case bo:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}ie=Me}},setLocked:function(Me){z=Me},setClear:function(Me){Te!==Me&&(_e&&(Me=1-Me),i.clearDepth(Me),Te=Me)},reset:function(){z=!1,Z=null,ie=null,Te=null,_e=!1}}}function r(){let z=!1,_e=null,Z=null,ie=null,Te=null,Me=null,je=null,Rt=null,Gt=null;return{setTest:function(mt){z||(mt?me(i.STENCIL_TEST):Ne(i.STENCIL_TEST))},setMask:function(mt){_e!==mt&&!z&&(i.stencilMask(mt),_e=mt)},setFunc:function(mt,Mn,Vn){(Z!==mt||ie!==Mn||Te!==Vn)&&(i.stencilFunc(mt,Mn,Vn),Z=mt,ie=Mn,Te=Vn)},setOp:function(mt,Mn,Vn){(Me!==mt||je!==Mn||Rt!==Vn)&&(i.stencilOp(mt,Mn,Vn),Me=mt,je=Mn,Rt=Vn)},setLocked:function(mt){z=mt},setClear:function(mt){Gt!==mt&&(i.clearStencil(mt),Gt=mt)},reset:function(){z=!1,_e=null,Z=null,ie=null,Te=null,Me=null,je=null,Rt=null,Gt=null}}}const a=new t,s=new n,o=new r,l=new WeakMap,c=new WeakMap;let u={},h={},f=new WeakMap,m=[],x=null,y=!1,g=null,p=null,A=null,C=null,S=null,N=null,I=null,D=new nt(0,0,0),U=0,T=!1,w=null,F=null,V=null,G=null,K=null;const J=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let j=!1,te=0;const Y=i.getParameter(i.VERSION);Y.indexOf("WebGL")!==-1?(te=parseFloat(/^WebGL (\d)/.exec(Y)[1]),j=te>=1):Y.indexOf("OpenGL ES")!==-1&&(te=parseFloat(/^OpenGL ES (\d)/.exec(Y)[1]),j=te>=2);let fe=null,pe={};const ye=i.getParameter(i.SCISSOR_BOX),ke=i.getParameter(i.VIEWPORT),qe=new It().fromArray(ye),Q=new It().fromArray(ke);function ce(z,_e,Z,ie){const Te=new Uint8Array(4),Me=i.createTexture();i.bindTexture(z,Me),i.texParameteri(z,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(z,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let je=0;je<Z;je++)z===i.TEXTURE_3D||z===i.TEXTURE_2D_ARRAY?i.texImage3D(_e,0,i.RGBA,1,1,ie,0,i.RGBA,i.UNSIGNED_BYTE,Te):i.texImage2D(_e+je,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,Te);return Me}const Re={};Re[i.TEXTURE_2D]=ce(i.TEXTURE_2D,i.TEXTURE_2D,1),Re[i.TEXTURE_CUBE_MAP]=ce(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),Re[i.TEXTURE_2D_ARRAY]=ce(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),Re[i.TEXTURE_3D]=ce(i.TEXTURE_3D,i.TEXTURE_3D,1,1),a.setClear(0,0,0,1),s.setClear(1),o.setClear(0),me(i.DEPTH_TEST),s.setFunc(mr),it(!1),rt(el),me(i.CULL_FACE),O(yi);function me(z){u[z]!==!0&&(i.enable(z),u[z]=!0)}function Ne(z){u[z]!==!1&&(i.disable(z),u[z]=!1)}function ze(z,_e){return h[z]!==_e?(i.bindFramebuffer(z,_e),h[z]=_e,z===i.DRAW_FRAMEBUFFER&&(h[i.FRAMEBUFFER]=_e),z===i.FRAMEBUFFER&&(h[i.DRAW_FRAMEBUFFER]=_e),!0):!1}function ve(z,_e){let Z=m,ie=!1;if(z){Z=f.get(_e),Z===void 0&&(Z=[],f.set(_e,Z));const Te=z.textures;if(Z.length!==Te.length||Z[0]!==i.COLOR_ATTACHMENT0){for(let Me=0,je=Te.length;Me<je;Me++)Z[Me]=i.COLOR_ATTACHMENT0+Me;Z.length=Te.length,ie=!0}}else Z[0]!==i.BACK&&(Z[0]=i.BACK,ie=!0);ie&&i.drawBuffers(Z)}function Oe(z){return x!==z?(i.useProgram(z),x=z,!0):!1}const We={[Bi]:i.FUNC_ADD,[Dh]:i.FUNC_SUBTRACT,[Ih]:i.FUNC_REVERSE_SUBTRACT};We[Lh]=i.MIN,We[Fh]=i.MAX;const lt={[Uh]:i.ZERO,[Nh]:i.ONE,[kh]:i.SRC_COLOR,[fo]:i.SRC_ALPHA,[Gh]:i.SRC_ALPHA_SATURATE,[Hh]:i.DST_COLOR,[Oh]:i.DST_ALPHA,[zh]:i.ONE_MINUS_SRC_COLOR,[po]:i.ONE_MINUS_SRC_ALPHA,[Vh]:i.ONE_MINUS_DST_COLOR,[Bh]:i.ONE_MINUS_DST_ALPHA,[Wh]:i.CONSTANT_COLOR,[qh]:i.ONE_MINUS_CONSTANT_COLOR,[Xh]:i.CONSTANT_ALPHA,[$h]:i.ONE_MINUS_CONSTANT_ALPHA};function O(z,_e,Z,ie,Te,Me,je,Rt,Gt,mt){if(z===yi){y===!0&&(Ne(i.BLEND),y=!1);return}if(y===!1&&(me(i.BLEND),y=!0),z!==Ph){if(z!==g||mt!==T){if((p!==Bi||S!==Bi)&&(i.blendEquation(i.FUNC_ADD),p=Bi,S=Bi),mt)switch(z){case hr:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case ho:i.blendFunc(i.ONE,i.ONE);break;case tl:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case nl:i.blendFuncSeparate(i.ZERO,i.SRC_COLOR,i.ZERO,i.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",z);break}else switch(z){case hr:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case ho:i.blendFunc(i.SRC_ALPHA,i.ONE);break;case tl:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case nl:i.blendFunc(i.ZERO,i.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",z);break}A=null,C=null,N=null,I=null,D.set(0,0,0),U=0,g=z,T=mt}return}Te=Te||_e,Me=Me||Z,je=je||ie,(_e!==p||Te!==S)&&(i.blendEquationSeparate(We[_e],We[Te]),p=_e,S=Te),(Z!==A||ie!==C||Me!==N||je!==I)&&(i.blendFuncSeparate(lt[Z],lt[ie],lt[Me],lt[je]),A=Z,C=ie,N=Me,I=je),(Rt.equals(D)===!1||Gt!==U)&&(i.blendColor(Rt.r,Rt.g,Rt.b,Gt),D.copy(Rt),U=Gt),g=z,T=!1}function en(z,_e){z.side===An?Ne(i.CULL_FACE):me(i.CULL_FACE);let Z=z.side===sn;_e&&(Z=!Z),it(Z),z.blending===hr&&z.transparent===!1?O(yi):O(z.blending,z.blendEquation,z.blendSrc,z.blendDst,z.blendEquationAlpha,z.blendSrcAlpha,z.blendDstAlpha,z.blendColor,z.blendAlpha,z.premultipliedAlpha),s.setFunc(z.depthFunc),s.setTest(z.depthTest),s.setMask(z.depthWrite),a.setMask(z.colorWrite);const ie=z.stencilWrite;o.setTest(ie),ie&&(o.setMask(z.stencilWriteMask),o.setFunc(z.stencilFunc,z.stencilRef,z.stencilFuncMask),o.setOp(z.stencilFail,z.stencilZFail,z.stencilZPass)),vt(z.polygonOffset,z.polygonOffsetFactor,z.polygonOffsetUnits),z.alphaToCoverage===!0?me(i.SAMPLE_ALPHA_TO_COVERAGE):Ne(i.SAMPLE_ALPHA_TO_COVERAGE)}function it(z){w!==z&&(z?i.frontFace(i.CW):i.frontFace(i.CCW),w=z)}function rt(z){z!==Ah?(me(i.CULL_FACE),z!==F&&(z===el?i.cullFace(i.BACK):z===Ch?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):Ne(i.CULL_FACE),F=z}function Be(z){z!==V&&(j&&i.lineWidth(z),V=z)}function vt(z,_e,Z){z?(me(i.POLYGON_OFFSET_FILL),(G!==_e||K!==Z)&&(i.polygonOffset(_e,Z),G=_e,K=Z)):Ne(i.POLYGON_OFFSET_FILL)}function Ue(z){z?me(i.SCISSOR_TEST):Ne(i.SCISSOR_TEST)}function R(z){z===void 0&&(z=i.TEXTURE0+J-1),fe!==z&&(i.activeTexture(z),fe=z)}function b(z,_e,Z){Z===void 0&&(fe===null?Z=i.TEXTURE0+J-1:Z=fe);let ie=pe[Z];ie===void 0&&(ie={type:void 0,texture:void 0},pe[Z]=ie),(ie.type!==z||ie.texture!==_e)&&(fe!==Z&&(i.activeTexture(Z),fe=Z),i.bindTexture(z,_e||Re[z]),ie.type=z,ie.texture=_e)}function W(){const z=pe[fe];z!==void 0&&z.type!==void 0&&(i.bindTexture(z.type,null),z.type=void 0,z.texture=void 0)}function ne(){try{i.compressedTexImage2D.apply(i,arguments)}catch(z){console.error("THREE.WebGLState:",z)}}function ae(){try{i.compressedTexImage3D.apply(i,arguments)}catch(z){console.error("THREE.WebGLState:",z)}}function ee(){try{i.texSubImage2D.apply(i,arguments)}catch(z){console.error("THREE.WebGLState:",z)}}function Pe(){try{i.texSubImage3D.apply(i,arguments)}catch(z){console.error("THREE.WebGLState:",z)}}function ge(){try{i.compressedTexSubImage2D.apply(i,arguments)}catch(z){console.error("THREE.WebGLState:",z)}}function we(){try{i.compressedTexSubImage3D.apply(i,arguments)}catch(z){console.error("THREE.WebGLState:",z)}}function st(){try{i.texStorage2D.apply(i,arguments)}catch(z){console.error("THREE.WebGLState:",z)}}function he(){try{i.texStorage3D.apply(i,arguments)}catch(z){console.error("THREE.WebGLState:",z)}}function Ae(){try{i.texImage2D.apply(i,arguments)}catch(z){console.error("THREE.WebGLState:",z)}}function Ve(){try{i.texImage3D.apply(i,arguments)}catch(z){console.error("THREE.WebGLState:",z)}}function $e(z){qe.equals(z)===!1&&(i.scissor(z.x,z.y,z.z,z.w),qe.copy(z))}function Ce(z){Q.equals(z)===!1&&(i.viewport(z.x,z.y,z.z,z.w),Q.copy(z))}function at(z,_e){let Z=c.get(_e);Z===void 0&&(Z=new WeakMap,c.set(_e,Z));let ie=Z.get(z);ie===void 0&&(ie=i.getUniformBlockIndex(_e,z.name),Z.set(z,ie))}function et(z,_e){const ie=c.get(_e).get(z);l.get(_e)!==ie&&(i.uniformBlockBinding(_e,ie,z.__bindingPointIndex),l.set(_e,ie))}function yt(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),s.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),u={},fe=null,pe={},h={},f=new WeakMap,m=[],x=null,y=!1,g=null,p=null,A=null,C=null,S=null,N=null,I=null,D=new nt(0,0,0),U=0,T=!1,w=null,F=null,V=null,G=null,K=null,qe.set(0,0,i.canvas.width,i.canvas.height),Q.set(0,0,i.canvas.width,i.canvas.height),a.reset(),s.reset(),o.reset()}return{buffers:{color:a,depth:s,stencil:o},enable:me,disable:Ne,bindFramebuffer:ze,drawBuffers:ve,useProgram:Oe,setBlending:O,setMaterial:en,setFlipSided:it,setCullFace:rt,setLineWidth:Be,setPolygonOffset:vt,setScissorTest:Ue,activeTexture:R,bindTexture:b,unbindTexture:W,compressedTexImage2D:ne,compressedTexImage3D:ae,texImage2D:Ae,texImage3D:Ve,updateUBOMapping:at,uniformBlockBinding:et,texStorage2D:st,texStorage3D:he,texSubImage2D:ee,texSubImage3D:Pe,compressedTexSubImage2D:ge,compressedTexSubImage3D:we,scissor:$e,viewport:Ce,reset:yt}}function jl(i,e,t,n){const r=vv(n);switch(t){case Yc:return i*e;case jc:return i*e;case Zc:return i*e*2;case Jc:return i*e/r.components*r.byteLength;case w0:return i*e/r.components*r.byteLength;case Qc:return i*e*2/r.components*r.byteLength;case T0:return i*e*2/r.components*r.byteLength;case Kc:return i*e*3/r.components*r.byteLength;case Rn:return i*e*4/r.components*r.byteLength;case E0:return i*e*4/r.components*r.byteLength;case Fa:case Ua:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case Na:case ka:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case Ao:case Ro:return Math.max(i,16)*Math.max(e,8)/4;case Eo:case Co:return Math.max(i,8)*Math.max(e,8)/2;case Po:case Do:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case Io:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case Lo:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case Fo:return Math.floor((i+4)/5)*Math.floor((e+3)/4)*16;case Uo:return Math.floor((i+4)/5)*Math.floor((e+4)/5)*16;case No:return Math.floor((i+5)/6)*Math.floor((e+4)/5)*16;case ko:return Math.floor((i+5)/6)*Math.floor((e+5)/6)*16;case zo:return Math.floor((i+7)/8)*Math.floor((e+4)/5)*16;case Oo:return Math.floor((i+7)/8)*Math.floor((e+5)/6)*16;case Bo:return Math.floor((i+7)/8)*Math.floor((e+7)/8)*16;case Ho:return Math.floor((i+9)/10)*Math.floor((e+4)/5)*16;case Vo:return Math.floor((i+9)/10)*Math.floor((e+5)/6)*16;case Go:return Math.floor((i+9)/10)*Math.floor((e+7)/8)*16;case Wo:return Math.floor((i+9)/10)*Math.floor((e+9)/10)*16;case qo:return Math.floor((i+11)/12)*Math.floor((e+9)/10)*16;case Xo:return Math.floor((i+11)/12)*Math.floor((e+11)/12)*16;case za:case $o:case Yo:return Math.ceil(i/4)*Math.ceil(e/4)*16;case eu:case Ko:return Math.ceil(i/4)*Math.ceil(e/4)*8;case jo:case Zo:return Math.ceil(i/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function vv(i){switch(i){case ni:case qc:return{byteLength:1,components:1};case Gr:case Xc:case Yr:return{byteLength:2,components:1};case M0:case S0:return{byteLength:2,components:4};case qi:case b0:case Jn:return{byteLength:4,components:1};case $c:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${i}.`)}function gv(i,e,t,n,r,a,s){const o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new ut,u=new WeakMap;let h;const f=new WeakMap;let m=!1;try{m=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function x(R,b){return m?new OffscreenCanvas(R,b):Ga("canvas")}function y(R,b,W){let ne=1;const ae=Ue(R);if((ae.width>W||ae.height>W)&&(ne=W/Math.max(ae.width,ae.height)),ne<1)if(typeof HTMLImageElement<"u"&&R instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&R instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&R instanceof ImageBitmap||typeof VideoFrame<"u"&&R instanceof VideoFrame){const ee=Math.floor(ne*ae.width),Pe=Math.floor(ne*ae.height);h===void 0&&(h=x(ee,Pe));const ge=b?x(ee,Pe):h;return ge.width=ee,ge.height=Pe,ge.getContext("2d").drawImage(R,0,0,ee,Pe),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+ae.width+"x"+ae.height+") to ("+ee+"x"+Pe+")."),ge}else return"data"in R&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+ae.width+"x"+ae.height+")."),R;return R}function g(R){return R.generateMipmaps}function p(R){i.generateMipmap(R)}function A(R){return R.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:R.isWebGL3DRenderTarget?i.TEXTURE_3D:R.isWebGLArrayRenderTarget||R.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function C(R,b,W,ne,ae=!1){if(R!==null){if(i[R]!==void 0)return i[R];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+R+"'")}let ee=b;if(b===i.RED&&(W===i.FLOAT&&(ee=i.R32F),W===i.HALF_FLOAT&&(ee=i.R16F),W===i.UNSIGNED_BYTE&&(ee=i.R8)),b===i.RED_INTEGER&&(W===i.UNSIGNED_BYTE&&(ee=i.R8UI),W===i.UNSIGNED_SHORT&&(ee=i.R16UI),W===i.UNSIGNED_INT&&(ee=i.R32UI),W===i.BYTE&&(ee=i.R8I),W===i.SHORT&&(ee=i.R16I),W===i.INT&&(ee=i.R32I)),b===i.RG&&(W===i.FLOAT&&(ee=i.RG32F),W===i.HALF_FLOAT&&(ee=i.RG16F),W===i.UNSIGNED_BYTE&&(ee=i.RG8)),b===i.RG_INTEGER&&(W===i.UNSIGNED_BYTE&&(ee=i.RG8UI),W===i.UNSIGNED_SHORT&&(ee=i.RG16UI),W===i.UNSIGNED_INT&&(ee=i.RG32UI),W===i.BYTE&&(ee=i.RG8I),W===i.SHORT&&(ee=i.RG16I),W===i.INT&&(ee=i.RG32I)),b===i.RGB_INTEGER&&(W===i.UNSIGNED_BYTE&&(ee=i.RGB8UI),W===i.UNSIGNED_SHORT&&(ee=i.RGB16UI),W===i.UNSIGNED_INT&&(ee=i.RGB32UI),W===i.BYTE&&(ee=i.RGB8I),W===i.SHORT&&(ee=i.RGB16I),W===i.INT&&(ee=i.RGB32I)),b===i.RGBA_INTEGER&&(W===i.UNSIGNED_BYTE&&(ee=i.RGBA8UI),W===i.UNSIGNED_SHORT&&(ee=i.RGBA16UI),W===i.UNSIGNED_INT&&(ee=i.RGBA32UI),W===i.BYTE&&(ee=i.RGBA8I),W===i.SHORT&&(ee=i.RGBA16I),W===i.INT&&(ee=i.RGBA32I)),b===i.RGB&&W===i.UNSIGNED_INT_5_9_9_9_REV&&(ee=i.RGB9_E5),b===i.RGBA){const Pe=ae?Qa:ot.getTransfer(ne);W===i.FLOAT&&(ee=i.RGBA32F),W===i.HALF_FLOAT&&(ee=i.RGBA16F),W===i.UNSIGNED_BYTE&&(ee=Pe===gt?i.SRGB8_ALPHA8:i.RGBA8),W===i.UNSIGNED_SHORT_4_4_4_4&&(ee=i.RGBA4),W===i.UNSIGNED_SHORT_5_5_5_1&&(ee=i.RGB5_A1)}return(ee===i.R16F||ee===i.R32F||ee===i.RG16F||ee===i.RG32F||ee===i.RGBA16F||ee===i.RGBA32F)&&e.get("EXT_color_buffer_float"),ee}function S(R,b){let W;return R?b===null||b===qi||b===xr?W=i.DEPTH24_STENCIL8:b===Jn?W=i.DEPTH32F_STENCIL8:b===Gr&&(W=i.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):b===null||b===qi||b===xr?W=i.DEPTH_COMPONENT24:b===Jn?W=i.DEPTH_COMPONENT32F:b===Gr&&(W=i.DEPTH_COMPONENT16),W}function N(R,b){return g(R)===!0||R.isFramebufferTexture&&R.minFilter!==Pn&&R.minFilter!==Un?Math.log2(Math.max(b.width,b.height))+1:R.mipmaps!==void 0&&R.mipmaps.length>0?R.mipmaps.length:R.isCompressedTexture&&Array.isArray(R.image)?b.mipmaps.length:1}function I(R){const b=R.target;b.removeEventListener("dispose",I),U(b),b.isVideoTexture&&u.delete(b)}function D(R){const b=R.target;b.removeEventListener("dispose",D),w(b)}function U(R){const b=n.get(R);if(b.__webglInit===void 0)return;const W=R.source,ne=f.get(W);if(ne){const ae=ne[b.__cacheKey];ae.usedTimes--,ae.usedTimes===0&&T(R),Object.keys(ne).length===0&&f.delete(W)}n.remove(R)}function T(R){const b=n.get(R);i.deleteTexture(b.__webglTexture);const W=R.source,ne=f.get(W);delete ne[b.__cacheKey],s.memory.textures--}function w(R){const b=n.get(R);if(R.depthTexture&&(R.depthTexture.dispose(),n.remove(R.depthTexture)),R.isWebGLCubeRenderTarget)for(let ne=0;ne<6;ne++){if(Array.isArray(b.__webglFramebuffer[ne]))for(let ae=0;ae<b.__webglFramebuffer[ne].length;ae++)i.deleteFramebuffer(b.__webglFramebuffer[ne][ae]);else i.deleteFramebuffer(b.__webglFramebuffer[ne]);b.__webglDepthbuffer&&i.deleteRenderbuffer(b.__webglDepthbuffer[ne])}else{if(Array.isArray(b.__webglFramebuffer))for(let ne=0;ne<b.__webglFramebuffer.length;ne++)i.deleteFramebuffer(b.__webglFramebuffer[ne]);else i.deleteFramebuffer(b.__webglFramebuffer);if(b.__webglDepthbuffer&&i.deleteRenderbuffer(b.__webglDepthbuffer),b.__webglMultisampledFramebuffer&&i.deleteFramebuffer(b.__webglMultisampledFramebuffer),b.__webglColorRenderbuffer)for(let ne=0;ne<b.__webglColorRenderbuffer.length;ne++)b.__webglColorRenderbuffer[ne]&&i.deleteRenderbuffer(b.__webglColorRenderbuffer[ne]);b.__webglDepthRenderbuffer&&i.deleteRenderbuffer(b.__webglDepthRenderbuffer)}const W=R.textures;for(let ne=0,ae=W.length;ne<ae;ne++){const ee=n.get(W[ne]);ee.__webglTexture&&(i.deleteTexture(ee.__webglTexture),s.memory.textures--),n.remove(W[ne])}n.remove(R)}let F=0;function V(){F=0}function G(){const R=F;return R>=r.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+R+" texture units while this GPU supports only "+r.maxTextures),F+=1,R}function K(R){const b=[];return b.push(R.wrapS),b.push(R.wrapT),b.push(R.wrapR||0),b.push(R.magFilter),b.push(R.minFilter),b.push(R.anisotropy),b.push(R.internalFormat),b.push(R.format),b.push(R.type),b.push(R.generateMipmaps),b.push(R.premultiplyAlpha),b.push(R.flipY),b.push(R.unpackAlignment),b.push(R.colorSpace),b.join()}function J(R,b){const W=n.get(R);if(R.isVideoTexture&&Be(R),R.isRenderTargetTexture===!1&&R.version>0&&W.__version!==R.version){const ne=R.image;if(ne===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(ne.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{Q(W,R,b);return}}t.bindTexture(i.TEXTURE_2D,W.__webglTexture,i.TEXTURE0+b)}function j(R,b){const W=n.get(R);if(R.version>0&&W.__version!==R.version){Q(W,R,b);return}t.bindTexture(i.TEXTURE_2D_ARRAY,W.__webglTexture,i.TEXTURE0+b)}function te(R,b){const W=n.get(R);if(R.version>0&&W.__version!==R.version){Q(W,R,b);return}t.bindTexture(i.TEXTURE_3D,W.__webglTexture,i.TEXTURE0+b)}function Y(R,b){const W=n.get(R);if(R.version>0&&W.__version!==R.version){ce(W,R,b);return}t.bindTexture(i.TEXTURE_CUBE_MAP,W.__webglTexture,i.TEXTURE0+b)}const fe={[wo]:i.REPEAT,[Gi]:i.CLAMP_TO_EDGE,[To]:i.MIRRORED_REPEAT},pe={[Pn]:i.NEAREST,[id]:i.NEAREST_MIPMAP_NEAREST,[ia]:i.NEAREST_MIPMAP_LINEAR,[Un]:i.LINEAR,[xs]:i.LINEAR_MIPMAP_NEAREST,[Wi]:i.LINEAR_MIPMAP_LINEAR},ye={[od]:i.NEVER,[fd]:i.ALWAYS,[ld]:i.LESS,[nu]:i.LEQUAL,[cd]:i.EQUAL,[dd]:i.GEQUAL,[ud]:i.GREATER,[hd]:i.NOTEQUAL};function ke(R,b){if(b.type===Jn&&e.has("OES_texture_float_linear")===!1&&(b.magFilter===Un||b.magFilter===xs||b.magFilter===ia||b.magFilter===Wi||b.minFilter===Un||b.minFilter===xs||b.minFilter===ia||b.minFilter===Wi)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(R,i.TEXTURE_WRAP_S,fe[b.wrapS]),i.texParameteri(R,i.TEXTURE_WRAP_T,fe[b.wrapT]),(R===i.TEXTURE_3D||R===i.TEXTURE_2D_ARRAY)&&i.texParameteri(R,i.TEXTURE_WRAP_R,fe[b.wrapR]),i.texParameteri(R,i.TEXTURE_MAG_FILTER,pe[b.magFilter]),i.texParameteri(R,i.TEXTURE_MIN_FILTER,pe[b.minFilter]),b.compareFunction&&(i.texParameteri(R,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(R,i.TEXTURE_COMPARE_FUNC,ye[b.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(b.magFilter===Pn||b.minFilter!==ia&&b.minFilter!==Wi||b.type===Jn&&e.has("OES_texture_float_linear")===!1)return;if(b.anisotropy>1||n.get(b).__currentAnisotropy){const W=e.get("EXT_texture_filter_anisotropic");i.texParameterf(R,W.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(b.anisotropy,r.getMaxAnisotropy())),n.get(b).__currentAnisotropy=b.anisotropy}}}function qe(R,b){let W=!1;R.__webglInit===void 0&&(R.__webglInit=!0,b.addEventListener("dispose",I));const ne=b.source;let ae=f.get(ne);ae===void 0&&(ae={},f.set(ne,ae));const ee=K(b);if(ee!==R.__cacheKey){ae[ee]===void 0&&(ae[ee]={texture:i.createTexture(),usedTimes:0},s.memory.textures++,W=!0),ae[ee].usedTimes++;const Pe=ae[R.__cacheKey];Pe!==void 0&&(ae[R.__cacheKey].usedTimes--,Pe.usedTimes===0&&T(b)),R.__cacheKey=ee,R.__webglTexture=ae[ee].texture}return W}function Q(R,b,W){let ne=i.TEXTURE_2D;(b.isDataArrayTexture||b.isCompressedArrayTexture)&&(ne=i.TEXTURE_2D_ARRAY),b.isData3DTexture&&(ne=i.TEXTURE_3D);const ae=qe(R,b),ee=b.source;t.bindTexture(ne,R.__webglTexture,i.TEXTURE0+W);const Pe=n.get(ee);if(ee.version!==Pe.__version||ae===!0){t.activeTexture(i.TEXTURE0+W);const ge=ot.getPrimaries(ot.workingColorSpace),we=b.colorSpace===gi?null:ot.getPrimaries(b.colorSpace),st=b.colorSpace===gi||ge===we?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,b.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,b.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,b.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,st);let he=y(b.image,!1,r.maxTextureSize);he=vt(b,he);const Ae=a.convert(b.format,b.colorSpace),Ve=a.convert(b.type);let $e=C(b.internalFormat,Ae,Ve,b.colorSpace,b.isVideoTexture);ke(ne,b);let Ce;const at=b.mipmaps,et=b.isVideoTexture!==!0,yt=Pe.__version===void 0||ae===!0,z=ee.dataReady,_e=N(b,he);if(b.isDepthTexture)$e=S(b.format===yr,b.type),yt&&(et?t.texStorage2D(i.TEXTURE_2D,1,$e,he.width,he.height):t.texImage2D(i.TEXTURE_2D,0,$e,he.width,he.height,0,Ae,Ve,null));else if(b.isDataTexture)if(at.length>0){et&&yt&&t.texStorage2D(i.TEXTURE_2D,_e,$e,at[0].width,at[0].height);for(let Z=0,ie=at.length;Z<ie;Z++)Ce=at[Z],et?z&&t.texSubImage2D(i.TEXTURE_2D,Z,0,0,Ce.width,Ce.height,Ae,Ve,Ce.data):t.texImage2D(i.TEXTURE_2D,Z,$e,Ce.width,Ce.height,0,Ae,Ve,Ce.data);b.generateMipmaps=!1}else et?(yt&&t.texStorage2D(i.TEXTURE_2D,_e,$e,he.width,he.height),z&&t.texSubImage2D(i.TEXTURE_2D,0,0,0,he.width,he.height,Ae,Ve,he.data)):t.texImage2D(i.TEXTURE_2D,0,$e,he.width,he.height,0,Ae,Ve,he.data);else if(b.isCompressedTexture)if(b.isCompressedArrayTexture){et&&yt&&t.texStorage3D(i.TEXTURE_2D_ARRAY,_e,$e,at[0].width,at[0].height,he.depth);for(let Z=0,ie=at.length;Z<ie;Z++)if(Ce=at[Z],b.format!==Rn)if(Ae!==null)if(et){if(z)if(b.layerUpdates.size>0){const Te=jl(Ce.width,Ce.height,b.format,b.type);for(const Me of b.layerUpdates){const je=Ce.data.subarray(Me*Te/Ce.data.BYTES_PER_ELEMENT,(Me+1)*Te/Ce.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,Z,0,0,Me,Ce.width,Ce.height,1,Ae,je)}b.clearLayerUpdates()}else t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,Z,0,0,0,Ce.width,Ce.height,he.depth,Ae,Ce.data)}else t.compressedTexImage3D(i.TEXTURE_2D_ARRAY,Z,$e,Ce.width,Ce.height,he.depth,0,Ce.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else et?z&&t.texSubImage3D(i.TEXTURE_2D_ARRAY,Z,0,0,0,Ce.width,Ce.height,he.depth,Ae,Ve,Ce.data):t.texImage3D(i.TEXTURE_2D_ARRAY,Z,$e,Ce.width,Ce.height,he.depth,0,Ae,Ve,Ce.data)}else{et&&yt&&t.texStorage2D(i.TEXTURE_2D,_e,$e,at[0].width,at[0].height);for(let Z=0,ie=at.length;Z<ie;Z++)Ce=at[Z],b.format!==Rn?Ae!==null?et?z&&t.compressedTexSubImage2D(i.TEXTURE_2D,Z,0,0,Ce.width,Ce.height,Ae,Ce.data):t.compressedTexImage2D(i.TEXTURE_2D,Z,$e,Ce.width,Ce.height,0,Ce.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):et?z&&t.texSubImage2D(i.TEXTURE_2D,Z,0,0,Ce.width,Ce.height,Ae,Ve,Ce.data):t.texImage2D(i.TEXTURE_2D,Z,$e,Ce.width,Ce.height,0,Ae,Ve,Ce.data)}else if(b.isDataArrayTexture)if(et){if(yt&&t.texStorage3D(i.TEXTURE_2D_ARRAY,_e,$e,he.width,he.height,he.depth),z)if(b.layerUpdates.size>0){const Z=jl(he.width,he.height,b.format,b.type);for(const ie of b.layerUpdates){const Te=he.data.subarray(ie*Z/he.data.BYTES_PER_ELEMENT,(ie+1)*Z/he.data.BYTES_PER_ELEMENT);t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,ie,he.width,he.height,1,Ae,Ve,Te)}b.clearLayerUpdates()}else t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,he.width,he.height,he.depth,Ae,Ve,he.data)}else t.texImage3D(i.TEXTURE_2D_ARRAY,0,$e,he.width,he.height,he.depth,0,Ae,Ve,he.data);else if(b.isData3DTexture)et?(yt&&t.texStorage3D(i.TEXTURE_3D,_e,$e,he.width,he.height,he.depth),z&&t.texSubImage3D(i.TEXTURE_3D,0,0,0,0,he.width,he.height,he.depth,Ae,Ve,he.data)):t.texImage3D(i.TEXTURE_3D,0,$e,he.width,he.height,he.depth,0,Ae,Ve,he.data);else if(b.isFramebufferTexture){if(yt)if(et)t.texStorage2D(i.TEXTURE_2D,_e,$e,he.width,he.height);else{let Z=he.width,ie=he.height;for(let Te=0;Te<_e;Te++)t.texImage2D(i.TEXTURE_2D,Te,$e,Z,ie,0,Ae,Ve,null),Z>>=1,ie>>=1}}else if(at.length>0){if(et&&yt){const Z=Ue(at[0]);t.texStorage2D(i.TEXTURE_2D,_e,$e,Z.width,Z.height)}for(let Z=0,ie=at.length;Z<ie;Z++)Ce=at[Z],et?z&&t.texSubImage2D(i.TEXTURE_2D,Z,0,0,Ae,Ve,Ce):t.texImage2D(i.TEXTURE_2D,Z,$e,Ae,Ve,Ce);b.generateMipmaps=!1}else if(et){if(yt){const Z=Ue(he);t.texStorage2D(i.TEXTURE_2D,_e,$e,Z.width,Z.height)}z&&t.texSubImage2D(i.TEXTURE_2D,0,0,0,Ae,Ve,he)}else t.texImage2D(i.TEXTURE_2D,0,$e,Ae,Ve,he);g(b)&&p(ne),Pe.__version=ee.version,b.onUpdate&&b.onUpdate(b)}R.__version=b.version}function ce(R,b,W){if(b.image.length!==6)return;const ne=qe(R,b),ae=b.source;t.bindTexture(i.TEXTURE_CUBE_MAP,R.__webglTexture,i.TEXTURE0+W);const ee=n.get(ae);if(ae.version!==ee.__version||ne===!0){t.activeTexture(i.TEXTURE0+W);const Pe=ot.getPrimaries(ot.workingColorSpace),ge=b.colorSpace===gi?null:ot.getPrimaries(b.colorSpace),we=b.colorSpace===gi||Pe===ge?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,b.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,b.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,b.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,we);const st=b.isCompressedTexture||b.image[0].isCompressedTexture,he=b.image[0]&&b.image[0].isDataTexture,Ae=[];for(let ie=0;ie<6;ie++)!st&&!he?Ae[ie]=y(b.image[ie],!0,r.maxCubemapSize):Ae[ie]=he?b.image[ie].image:b.image[ie],Ae[ie]=vt(b,Ae[ie]);const Ve=Ae[0],$e=a.convert(b.format,b.colorSpace),Ce=a.convert(b.type),at=C(b.internalFormat,$e,Ce,b.colorSpace),et=b.isVideoTexture!==!0,yt=ee.__version===void 0||ne===!0,z=ae.dataReady;let _e=N(b,Ve);ke(i.TEXTURE_CUBE_MAP,b);let Z;if(st){et&&yt&&t.texStorage2D(i.TEXTURE_CUBE_MAP,_e,at,Ve.width,Ve.height);for(let ie=0;ie<6;ie++){Z=Ae[ie].mipmaps;for(let Te=0;Te<Z.length;Te++){const Me=Z[Te];b.format!==Rn?$e!==null?et?z&&t.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ie,Te,0,0,Me.width,Me.height,$e,Me.data):t.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ie,Te,at,Me.width,Me.height,0,Me.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):et?z&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ie,Te,0,0,Me.width,Me.height,$e,Ce,Me.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ie,Te,at,Me.width,Me.height,0,$e,Ce,Me.data)}}}else{if(Z=b.mipmaps,et&&yt){Z.length>0&&_e++;const ie=Ue(Ae[0]);t.texStorage2D(i.TEXTURE_CUBE_MAP,_e,at,ie.width,ie.height)}for(let ie=0;ie<6;ie++)if(he){et?z&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ie,0,0,0,Ae[ie].width,Ae[ie].height,$e,Ce,Ae[ie].data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ie,0,at,Ae[ie].width,Ae[ie].height,0,$e,Ce,Ae[ie].data);for(let Te=0;Te<Z.length;Te++){const je=Z[Te].image[ie].image;et?z&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ie,Te+1,0,0,je.width,je.height,$e,Ce,je.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ie,Te+1,at,je.width,je.height,0,$e,Ce,je.data)}}else{et?z&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ie,0,0,0,$e,Ce,Ae[ie]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ie,0,at,$e,Ce,Ae[ie]);for(let Te=0;Te<Z.length;Te++){const Me=Z[Te];et?z&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ie,Te+1,0,0,$e,Ce,Me.image[ie]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ie,Te+1,at,$e,Ce,Me.image[ie])}}}g(b)&&p(i.TEXTURE_CUBE_MAP),ee.__version=ae.version,b.onUpdate&&b.onUpdate(b)}R.__version=b.version}function Re(R,b,W,ne,ae,ee){const Pe=a.convert(W.format,W.colorSpace),ge=a.convert(W.type),we=C(W.internalFormat,Pe,ge,W.colorSpace),st=n.get(b),he=n.get(W);if(he.__renderTarget=b,!st.__hasExternalTextures){const Ae=Math.max(1,b.width>>ee),Ve=Math.max(1,b.height>>ee);ae===i.TEXTURE_3D||ae===i.TEXTURE_2D_ARRAY?t.texImage3D(ae,ee,we,Ae,Ve,b.depth,0,Pe,ge,null):t.texImage2D(ae,ee,we,Ae,Ve,0,Pe,ge,null)}t.bindFramebuffer(i.FRAMEBUFFER,R),rt(b)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,ne,ae,he.__webglTexture,0,it(b)):(ae===i.TEXTURE_2D||ae>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&ae<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,ne,ae,he.__webglTexture,ee),t.bindFramebuffer(i.FRAMEBUFFER,null)}function me(R,b,W){if(i.bindRenderbuffer(i.RENDERBUFFER,R),b.depthBuffer){const ne=b.depthTexture,ae=ne&&ne.isDepthTexture?ne.type:null,ee=S(b.stencilBuffer,ae),Pe=b.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,ge=it(b);rt(b)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,ge,ee,b.width,b.height):W?i.renderbufferStorageMultisample(i.RENDERBUFFER,ge,ee,b.width,b.height):i.renderbufferStorage(i.RENDERBUFFER,ee,b.width,b.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,Pe,i.RENDERBUFFER,R)}else{const ne=b.textures;for(let ae=0;ae<ne.length;ae++){const ee=ne[ae],Pe=a.convert(ee.format,ee.colorSpace),ge=a.convert(ee.type),we=C(ee.internalFormat,Pe,ge,ee.colorSpace),st=it(b);W&&rt(b)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,st,we,b.width,b.height):rt(b)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,st,we,b.width,b.height):i.renderbufferStorage(i.RENDERBUFFER,we,b.width,b.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function Ne(R,b){if(b&&b.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(i.FRAMEBUFFER,R),!(b.depthTexture&&b.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const ne=n.get(b.depthTexture);ne.__renderTarget=b,(!ne.__webglTexture||b.depthTexture.image.width!==b.width||b.depthTexture.image.height!==b.height)&&(b.depthTexture.image.width=b.width,b.depthTexture.image.height=b.height,b.depthTexture.needsUpdate=!0),J(b.depthTexture,0);const ae=ne.__webglTexture,ee=it(b);if(b.depthTexture.format===dr)rt(b)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,ae,0,ee):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,ae,0);else if(b.depthTexture.format===yr)rt(b)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,ae,0,ee):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,ae,0);else throw new Error("Unknown depthTexture format")}function ze(R){const b=n.get(R),W=R.isWebGLCubeRenderTarget===!0;if(b.__boundDepthTexture!==R.depthTexture){const ne=R.depthTexture;if(b.__depthDisposeCallback&&b.__depthDisposeCallback(),ne){const ae=()=>{delete b.__boundDepthTexture,delete b.__depthDisposeCallback,ne.removeEventListener("dispose",ae)};ne.addEventListener("dispose",ae),b.__depthDisposeCallback=ae}b.__boundDepthTexture=ne}if(R.depthTexture&&!b.__autoAllocateDepthBuffer){if(W)throw new Error("target.depthTexture not supported in Cube render targets");Ne(b.__webglFramebuffer,R)}else if(W){b.__webglDepthbuffer=[];for(let ne=0;ne<6;ne++)if(t.bindFramebuffer(i.FRAMEBUFFER,b.__webglFramebuffer[ne]),b.__webglDepthbuffer[ne]===void 0)b.__webglDepthbuffer[ne]=i.createRenderbuffer(),me(b.__webglDepthbuffer[ne],R,!1);else{const ae=R.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,ee=b.__webglDepthbuffer[ne];i.bindRenderbuffer(i.RENDERBUFFER,ee),i.framebufferRenderbuffer(i.FRAMEBUFFER,ae,i.RENDERBUFFER,ee)}}else if(t.bindFramebuffer(i.FRAMEBUFFER,b.__webglFramebuffer),b.__webglDepthbuffer===void 0)b.__webglDepthbuffer=i.createRenderbuffer(),me(b.__webglDepthbuffer,R,!1);else{const ne=R.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,ae=b.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,ae),i.framebufferRenderbuffer(i.FRAMEBUFFER,ne,i.RENDERBUFFER,ae)}t.bindFramebuffer(i.FRAMEBUFFER,null)}function ve(R,b,W){const ne=n.get(R);b!==void 0&&Re(ne.__webglFramebuffer,R,R.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),W!==void 0&&ze(R)}function Oe(R){const b=R.texture,W=n.get(R),ne=n.get(b);R.addEventListener("dispose",D);const ae=R.textures,ee=R.isWebGLCubeRenderTarget===!0,Pe=ae.length>1;if(Pe||(ne.__webglTexture===void 0&&(ne.__webglTexture=i.createTexture()),ne.__version=b.version,s.memory.textures++),ee){W.__webglFramebuffer=[];for(let ge=0;ge<6;ge++)if(b.mipmaps&&b.mipmaps.length>0){W.__webglFramebuffer[ge]=[];for(let we=0;we<b.mipmaps.length;we++)W.__webglFramebuffer[ge][we]=i.createFramebuffer()}else W.__webglFramebuffer[ge]=i.createFramebuffer()}else{if(b.mipmaps&&b.mipmaps.length>0){W.__webglFramebuffer=[];for(let ge=0;ge<b.mipmaps.length;ge++)W.__webglFramebuffer[ge]=i.createFramebuffer()}else W.__webglFramebuffer=i.createFramebuffer();if(Pe)for(let ge=0,we=ae.length;ge<we;ge++){const st=n.get(ae[ge]);st.__webglTexture===void 0&&(st.__webglTexture=i.createTexture(),s.memory.textures++)}if(R.samples>0&&rt(R)===!1){W.__webglMultisampledFramebuffer=i.createFramebuffer(),W.__webglColorRenderbuffer=[],t.bindFramebuffer(i.FRAMEBUFFER,W.__webglMultisampledFramebuffer);for(let ge=0;ge<ae.length;ge++){const we=ae[ge];W.__webglColorRenderbuffer[ge]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,W.__webglColorRenderbuffer[ge]);const st=a.convert(we.format,we.colorSpace),he=a.convert(we.type),Ae=C(we.internalFormat,st,he,we.colorSpace,R.isXRRenderTarget===!0),Ve=it(R);i.renderbufferStorageMultisample(i.RENDERBUFFER,Ve,Ae,R.width,R.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+ge,i.RENDERBUFFER,W.__webglColorRenderbuffer[ge])}i.bindRenderbuffer(i.RENDERBUFFER,null),R.depthBuffer&&(W.__webglDepthRenderbuffer=i.createRenderbuffer(),me(W.__webglDepthRenderbuffer,R,!0)),t.bindFramebuffer(i.FRAMEBUFFER,null)}}if(ee){t.bindTexture(i.TEXTURE_CUBE_MAP,ne.__webglTexture),ke(i.TEXTURE_CUBE_MAP,b);for(let ge=0;ge<6;ge++)if(b.mipmaps&&b.mipmaps.length>0)for(let we=0;we<b.mipmaps.length;we++)Re(W.__webglFramebuffer[ge][we],R,b,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+ge,we);else Re(W.__webglFramebuffer[ge],R,b,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+ge,0);g(b)&&p(i.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(Pe){for(let ge=0,we=ae.length;ge<we;ge++){const st=ae[ge],he=n.get(st);t.bindTexture(i.TEXTURE_2D,he.__webglTexture),ke(i.TEXTURE_2D,st),Re(W.__webglFramebuffer,R,st,i.COLOR_ATTACHMENT0+ge,i.TEXTURE_2D,0),g(st)&&p(i.TEXTURE_2D)}t.unbindTexture()}else{let ge=i.TEXTURE_2D;if((R.isWebGL3DRenderTarget||R.isWebGLArrayRenderTarget)&&(ge=R.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(ge,ne.__webglTexture),ke(ge,b),b.mipmaps&&b.mipmaps.length>0)for(let we=0;we<b.mipmaps.length;we++)Re(W.__webglFramebuffer[we],R,b,i.COLOR_ATTACHMENT0,ge,we);else Re(W.__webglFramebuffer,R,b,i.COLOR_ATTACHMENT0,ge,0);g(b)&&p(ge),t.unbindTexture()}R.depthBuffer&&ze(R)}function We(R){const b=R.textures;for(let W=0,ne=b.length;W<ne;W++){const ae=b[W];if(g(ae)){const ee=A(R),Pe=n.get(ae).__webglTexture;t.bindTexture(ee,Pe),p(ee),t.unbindTexture()}}}const lt=[],O=[];function en(R){if(R.samples>0){if(rt(R)===!1){const b=R.textures,W=R.width,ne=R.height;let ae=i.COLOR_BUFFER_BIT;const ee=R.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,Pe=n.get(R),ge=b.length>1;if(ge)for(let we=0;we<b.length;we++)t.bindFramebuffer(i.FRAMEBUFFER,Pe.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+we,i.RENDERBUFFER,null),t.bindFramebuffer(i.FRAMEBUFFER,Pe.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+we,i.TEXTURE_2D,null,0);t.bindFramebuffer(i.READ_FRAMEBUFFER,Pe.__webglMultisampledFramebuffer),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,Pe.__webglFramebuffer);for(let we=0;we<b.length;we++){if(R.resolveDepthBuffer&&(R.depthBuffer&&(ae|=i.DEPTH_BUFFER_BIT),R.stencilBuffer&&R.resolveStencilBuffer&&(ae|=i.STENCIL_BUFFER_BIT)),ge){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,Pe.__webglColorRenderbuffer[we]);const st=n.get(b[we]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,st,0)}i.blitFramebuffer(0,0,W,ne,0,0,W,ne,ae,i.NEAREST),l===!0&&(lt.length=0,O.length=0,lt.push(i.COLOR_ATTACHMENT0+we),R.depthBuffer&&R.resolveDepthBuffer===!1&&(lt.push(ee),O.push(ee),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,O)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,lt))}if(t.bindFramebuffer(i.READ_FRAMEBUFFER,null),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),ge)for(let we=0;we<b.length;we++){t.bindFramebuffer(i.FRAMEBUFFER,Pe.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+we,i.RENDERBUFFER,Pe.__webglColorRenderbuffer[we]);const st=n.get(b[we]).__webglTexture;t.bindFramebuffer(i.FRAMEBUFFER,Pe.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+we,i.TEXTURE_2D,st,0)}t.bindFramebuffer(i.DRAW_FRAMEBUFFER,Pe.__webglMultisampledFramebuffer)}else if(R.depthBuffer&&R.resolveDepthBuffer===!1&&l){const b=R.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[b])}}}function it(R){return Math.min(r.maxSamples,R.samples)}function rt(R){const b=n.get(R);return R.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&b.__useRenderToTexture!==!1}function Be(R){const b=s.render.frame;u.get(R)!==b&&(u.set(R,b),R.update())}function vt(R,b){const W=R.colorSpace,ne=R.format,ae=R.type;return R.isCompressedTexture===!0||R.isVideoTexture===!0||W!==wr&&W!==gi&&(ot.getTransfer(W)===gt?(ne!==Rn||ae!==ni)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",W)),b}function Ue(R){return typeof HTMLImageElement<"u"&&R instanceof HTMLImageElement?(c.width=R.naturalWidth||R.width,c.height=R.naturalHeight||R.height):typeof VideoFrame<"u"&&R instanceof VideoFrame?(c.width=R.displayWidth,c.height=R.displayHeight):(c.width=R.width,c.height=R.height),c}this.allocateTextureUnit=G,this.resetTextureUnits=V,this.setTexture2D=J,this.setTexture2DArray=j,this.setTexture3D=te,this.setTextureCube=Y,this.rebindTextures=ve,this.setupRenderTarget=Oe,this.updateRenderTargetMipmap=We,this.updateMultisampleRenderTarget=en,this.setupDepthRenderbuffer=ze,this.setupFrameBufferTexture=Re,this.useMultisampledRTT=rt}function xv(i,e){function t(n,r=gi){let a;const s=ot.getTransfer(r);if(n===ni)return i.UNSIGNED_BYTE;if(n===M0)return i.UNSIGNED_SHORT_4_4_4_4;if(n===S0)return i.UNSIGNED_SHORT_5_5_5_1;if(n===$c)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===qc)return i.BYTE;if(n===Xc)return i.SHORT;if(n===Gr)return i.UNSIGNED_SHORT;if(n===b0)return i.INT;if(n===qi)return i.UNSIGNED_INT;if(n===Jn)return i.FLOAT;if(n===Yr)return i.HALF_FLOAT;if(n===Yc)return i.ALPHA;if(n===Kc)return i.RGB;if(n===Rn)return i.RGBA;if(n===jc)return i.LUMINANCE;if(n===Zc)return i.LUMINANCE_ALPHA;if(n===dr)return i.DEPTH_COMPONENT;if(n===yr)return i.DEPTH_STENCIL;if(n===Jc)return i.RED;if(n===w0)return i.RED_INTEGER;if(n===Qc)return i.RG;if(n===T0)return i.RG_INTEGER;if(n===E0)return i.RGBA_INTEGER;if(n===Fa||n===Ua||n===Na||n===ka)if(s===gt)if(a=e.get("WEBGL_compressed_texture_s3tc_srgb"),a!==null){if(n===Fa)return a.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===Ua)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===Na)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===ka)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(a=e.get("WEBGL_compressed_texture_s3tc"),a!==null){if(n===Fa)return a.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===Ua)return a.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===Na)return a.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===ka)return a.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===Eo||n===Ao||n===Co||n===Ro)if(a=e.get("WEBGL_compressed_texture_pvrtc"),a!==null){if(n===Eo)return a.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===Ao)return a.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===Co)return a.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===Ro)return a.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===Po||n===Do||n===Io)if(a=e.get("WEBGL_compressed_texture_etc"),a!==null){if(n===Po||n===Do)return s===gt?a.COMPRESSED_SRGB8_ETC2:a.COMPRESSED_RGB8_ETC2;if(n===Io)return s===gt?a.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:a.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===Lo||n===Fo||n===Uo||n===No||n===ko||n===zo||n===Oo||n===Bo||n===Ho||n===Vo||n===Go||n===Wo||n===qo||n===Xo)if(a=e.get("WEBGL_compressed_texture_astc"),a!==null){if(n===Lo)return s===gt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:a.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===Fo)return s===gt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:a.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===Uo)return s===gt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:a.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===No)return s===gt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:a.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===ko)return s===gt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:a.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===zo)return s===gt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:a.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===Oo)return s===gt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:a.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===Bo)return s===gt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:a.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===Ho)return s===gt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:a.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===Vo)return s===gt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:a.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===Go)return s===gt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:a.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===Wo)return s===gt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:a.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===qo)return s===gt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:a.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===Xo)return s===gt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:a.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===za||n===$o||n===Yo)if(a=e.get("EXT_texture_compression_bptc"),a!==null){if(n===za)return s===gt?a.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:a.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===$o)return a.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===Yo)return a.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===eu||n===Ko||n===jo||n===Zo)if(a=e.get("EXT_texture_compression_rgtc"),a!==null){if(n===za)return a.COMPRESSED_RED_RGTC1_EXT;if(n===Ko)return a.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===jo)return a.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===Zo)return a.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===xr?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:t}}class yv extends hn{constructor(e=[]){super(),this.isArrayCamera=!0,this.cameras=e}}class Nn extends Vt{constructor(){super(),this.isGroup=!0,this.type="Group"}}const _v={type:"move"};class $s{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Nn,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Nn,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new q,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new q),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Nn,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new q,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new q),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let r=null,a=null,s=null;const o=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){s=!0;for(const y of e.hand.values()){const g=t.getJointPose(y,n),p=this._getHandJoint(c,y);g!==null&&(p.matrix.fromArray(g.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=g.radius),p.visible=g!==null}const u=c.joints["index-finger-tip"],h=c.joints["thumb-tip"],f=u.position.distanceTo(h.position),m=.02,x=.005;c.inputState.pinching&&f>m+x?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&f<=m-x&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(a=t.getPose(e.gripSpace,n),a!==null&&(l.matrix.fromArray(a.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,a.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(a.linearVelocity)):l.hasLinearVelocity=!1,a.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(a.angularVelocity)):l.hasAngularVelocity=!1));o!==null&&(r=t.getPose(e.targetRaySpace,n),r===null&&a!==null&&(r=a),r!==null&&(o.matrix.fromArray(r.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,r.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(r.linearVelocity)):o.hasLinearVelocity=!1,r.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(r.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(_v)))}return o!==null&&(o.visible=r!==null),l!==null&&(l.visible=a!==null),c!==null&&(c.visible=s!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const n=new Nn;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}}const bv=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,Mv=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class Sv{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t,n){if(this.texture===null){const r=new on,a=e.properties.get(r);a.__webglTexture=t.texture,(t.depthNear!=n.depthNear||t.depthFar!=n.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=r}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,n=new Si({vertexShader:bv,fragmentShader:Mv,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new Xe(new ts(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class wv extends Tr{constructor(e,t){super();const n=this;let r=null,a=1,s=null,o="local-floor",l=1,c=null,u=null,h=null,f=null,m=null,x=null;const y=new Sv,g=t.getContextAttributes();let p=null,A=null;const C=[],S=[],N=new ut;let I=null;const D=new hn;D.viewport=new It;const U=new hn;U.viewport=new It;const T=[D,U],w=new yv;let F=null,V=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(Q){let ce=C[Q];return ce===void 0&&(ce=new $s,C[Q]=ce),ce.getTargetRaySpace()},this.getControllerGrip=function(Q){let ce=C[Q];return ce===void 0&&(ce=new $s,C[Q]=ce),ce.getGripSpace()},this.getHand=function(Q){let ce=C[Q];return ce===void 0&&(ce=new $s,C[Q]=ce),ce.getHandSpace()};function G(Q){const ce=S.indexOf(Q.inputSource);if(ce===-1)return;const Re=C[ce];Re!==void 0&&(Re.update(Q.inputSource,Q.frame,c||s),Re.dispatchEvent({type:Q.type,data:Q.inputSource}))}function K(){r.removeEventListener("select",G),r.removeEventListener("selectstart",G),r.removeEventListener("selectend",G),r.removeEventListener("squeeze",G),r.removeEventListener("squeezestart",G),r.removeEventListener("squeezeend",G),r.removeEventListener("end",K),r.removeEventListener("inputsourceschange",J);for(let Q=0;Q<C.length;Q++){const ce=S[Q];ce!==null&&(S[Q]=null,C[Q].disconnect(ce))}F=null,V=null,y.reset(),e.setRenderTarget(p),m=null,f=null,h=null,r=null,A=null,qe.stop(),n.isPresenting=!1,e.setPixelRatio(I),e.setSize(N.width,N.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(Q){a=Q,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(Q){o=Q,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||s},this.setReferenceSpace=function(Q){c=Q},this.getBaseLayer=function(){return f!==null?f:m},this.getBinding=function(){return h},this.getFrame=function(){return x},this.getSession=function(){return r},this.setSession=async function(Q){if(r=Q,r!==null){if(p=e.getRenderTarget(),r.addEventListener("select",G),r.addEventListener("selectstart",G),r.addEventListener("selectend",G),r.addEventListener("squeeze",G),r.addEventListener("squeezestart",G),r.addEventListener("squeezeend",G),r.addEventListener("end",K),r.addEventListener("inputsourceschange",J),g.xrCompatible!==!0&&await t.makeXRCompatible(),I=e.getPixelRatio(),e.getSize(N),r.renderState.layers===void 0){const ce={antialias:g.antialias,alpha:!0,depth:g.depth,stencil:g.stencil,framebufferScaleFactor:a};m=new XRWebGLLayer(r,t,ce),r.updateRenderState({baseLayer:m}),e.setPixelRatio(1),e.setSize(m.framebufferWidth,m.framebufferHeight,!1),A=new Xi(m.framebufferWidth,m.framebufferHeight,{format:Rn,type:ni,colorSpace:e.outputColorSpace,stencilBuffer:g.stencil})}else{let ce=null,Re=null,me=null;g.depth&&(me=g.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,ce=g.stencil?yr:dr,Re=g.stencil?xr:qi);const Ne={colorFormat:t.RGBA8,depthFormat:me,scaleFactor:a};h=new XRWebGLBinding(r,t),f=h.createProjectionLayer(Ne),r.updateRenderState({layers:[f]}),e.setPixelRatio(1),e.setSize(f.textureWidth,f.textureHeight,!1),A=new Xi(f.textureWidth,f.textureHeight,{format:Rn,type:ni,depthTexture:new vu(f.textureWidth,f.textureHeight,Re,void 0,void 0,void 0,void 0,void 0,void 0,ce),stencilBuffer:g.stencil,colorSpace:e.outputColorSpace,samples:g.antialias?4:0,resolveDepthBuffer:f.ignoreDepthValues===!1})}A.isXRRenderTarget=!0,this.setFoveation(l),c=null,s=await r.requestReferenceSpace(o),qe.setContext(r),qe.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(r!==null)return r.environmentBlendMode},this.getDepthTexture=function(){return y.getDepthTexture()};function J(Q){for(let ce=0;ce<Q.removed.length;ce++){const Re=Q.removed[ce],me=S.indexOf(Re);me>=0&&(S[me]=null,C[me].disconnect(Re))}for(let ce=0;ce<Q.added.length;ce++){const Re=Q.added[ce];let me=S.indexOf(Re);if(me===-1){for(let ze=0;ze<C.length;ze++)if(ze>=S.length){S.push(Re),me=ze;break}else if(S[ze]===null){S[ze]=Re,me=ze;break}if(me===-1)break}const Ne=C[me];Ne&&Ne.connect(Re)}}const j=new q,te=new q;function Y(Q,ce,Re){j.setFromMatrixPosition(ce.matrixWorld),te.setFromMatrixPosition(Re.matrixWorld);const me=j.distanceTo(te),Ne=ce.projectionMatrix.elements,ze=Re.projectionMatrix.elements,ve=Ne[14]/(Ne[10]-1),Oe=Ne[14]/(Ne[10]+1),We=(Ne[9]+1)/Ne[5],lt=(Ne[9]-1)/Ne[5],O=(Ne[8]-1)/Ne[0],en=(ze[8]+1)/ze[0],it=ve*O,rt=ve*en,Be=me/(-O+en),vt=Be*-O;if(ce.matrixWorld.decompose(Q.position,Q.quaternion,Q.scale),Q.translateX(vt),Q.translateZ(Be),Q.matrixWorld.compose(Q.position,Q.quaternion,Q.scale),Q.matrixWorldInverse.copy(Q.matrixWorld).invert(),Ne[10]===-1)Q.projectionMatrix.copy(ce.projectionMatrix),Q.projectionMatrixInverse.copy(ce.projectionMatrixInverse);else{const Ue=ve+Be,R=Oe+Be,b=it-vt,W=rt+(me-vt),ne=We*Oe/R*Ue,ae=lt*Oe/R*Ue;Q.projectionMatrix.makePerspective(b,W,ne,ae,Ue,R),Q.projectionMatrixInverse.copy(Q.projectionMatrix).invert()}}function fe(Q,ce){ce===null?Q.matrixWorld.copy(Q.matrix):Q.matrixWorld.multiplyMatrices(ce.matrixWorld,Q.matrix),Q.matrixWorldInverse.copy(Q.matrixWorld).invert()}this.updateCamera=function(Q){if(r===null)return;let ce=Q.near,Re=Q.far;y.texture!==null&&(y.depthNear>0&&(ce=y.depthNear),y.depthFar>0&&(Re=y.depthFar)),w.near=U.near=D.near=ce,w.far=U.far=D.far=Re,(F!==w.near||V!==w.far)&&(r.updateRenderState({depthNear:w.near,depthFar:w.far}),F=w.near,V=w.far),D.layers.mask=Q.layers.mask|2,U.layers.mask=Q.layers.mask|4,w.layers.mask=D.layers.mask|U.layers.mask;const me=Q.parent,Ne=w.cameras;fe(w,me);for(let ze=0;ze<Ne.length;ze++)fe(Ne[ze],me);Ne.length===2?Y(w,D,U):w.projectionMatrix.copy(D.projectionMatrix),pe(Q,w,me)};function pe(Q,ce,Re){Re===null?Q.matrix.copy(ce.matrixWorld):(Q.matrix.copy(Re.matrixWorld),Q.matrix.invert(),Q.matrix.multiply(ce.matrixWorld)),Q.matrix.decompose(Q.position,Q.quaternion,Q.scale),Q.updateMatrixWorld(!0),Q.projectionMatrix.copy(ce.projectionMatrix),Q.projectionMatrixInverse.copy(ce.projectionMatrixInverse),Q.isPerspectiveCamera&&(Q.fov=Jo*2*Math.atan(1/Q.projectionMatrix.elements[5]),Q.zoom=1)}this.getCamera=function(){return w},this.getFoveation=function(){if(!(f===null&&m===null))return l},this.setFoveation=function(Q){l=Q,f!==null&&(f.fixedFoveation=Q),m!==null&&m.fixedFoveation!==void 0&&(m.fixedFoveation=Q)},this.hasDepthSensing=function(){return y.texture!==null},this.getDepthSensingMesh=function(){return y.getMesh(w)};let ye=null;function ke(Q,ce){if(u=ce.getViewerPose(c||s),x=ce,u!==null){const Re=u.views;m!==null&&(e.setRenderTargetFramebuffer(A,m.framebuffer),e.setRenderTarget(A));let me=!1;Re.length!==w.cameras.length&&(w.cameras.length=0,me=!0);for(let ze=0;ze<Re.length;ze++){const ve=Re[ze];let Oe=null;if(m!==null)Oe=m.getViewport(ve);else{const lt=h.getViewSubImage(f,ve);Oe=lt.viewport,ze===0&&(e.setRenderTargetTextures(A,lt.colorTexture,f.ignoreDepthValues?void 0:lt.depthStencilTexture),e.setRenderTarget(A))}let We=T[ze];We===void 0&&(We=new hn,We.layers.enable(ze),We.viewport=new It,T[ze]=We),We.matrix.fromArray(ve.transform.matrix),We.matrix.decompose(We.position,We.quaternion,We.scale),We.projectionMatrix.fromArray(ve.projectionMatrix),We.projectionMatrixInverse.copy(We.projectionMatrix).invert(),We.viewport.set(Oe.x,Oe.y,Oe.width,Oe.height),ze===0&&(w.matrix.copy(We.matrix),w.matrix.decompose(w.position,w.quaternion,w.scale)),me===!0&&w.cameras.push(We)}const Ne=r.enabledFeatures;if(Ne&&Ne.includes("depth-sensing")){const ze=h.getDepthInformation(Re[0]);ze&&ze.isValid&&ze.texture&&y.init(e,ze,r.renderState)}}for(let Re=0;Re<C.length;Re++){const me=S[Re],Ne=C[Re];me!==null&&Ne!==void 0&&Ne.update(me,ce,c||s)}ye&&ye(Q,ce),ce.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:ce}),x=null}const qe=new pu;qe.setAnimationLoop(ke),this.setAnimationLoop=function(Q){ye=Q},this.dispose=function(){}}}const Ui=new zn,Tv=new Ct;function Ev(i,e){function t(g,p){g.matrixAutoUpdate===!0&&g.updateMatrix(),p.value.copy(g.matrix)}function n(g,p){p.color.getRGB(g.fogColor.value,hu(i)),p.isFog?(g.fogNear.value=p.near,g.fogFar.value=p.far):p.isFogExp2&&(g.fogDensity.value=p.density)}function r(g,p,A,C,S){p.isMeshBasicMaterial||p.isMeshLambertMaterial?a(g,p):p.isMeshToonMaterial?(a(g,p),h(g,p)):p.isMeshPhongMaterial?(a(g,p),u(g,p)):p.isMeshStandardMaterial?(a(g,p),f(g,p),p.isMeshPhysicalMaterial&&m(g,p,S)):p.isMeshMatcapMaterial?(a(g,p),x(g,p)):p.isMeshDepthMaterial?a(g,p):p.isMeshDistanceMaterial?(a(g,p),y(g,p)):p.isMeshNormalMaterial?a(g,p):p.isLineBasicMaterial?(s(g,p),p.isLineDashedMaterial&&o(g,p)):p.isPointsMaterial?l(g,p,A,C):p.isSpriteMaterial?c(g,p):p.isShadowMaterial?(g.color.value.copy(p.color),g.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function a(g,p){g.opacity.value=p.opacity,p.color&&g.diffuse.value.copy(p.color),p.emissive&&g.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(g.map.value=p.map,t(p.map,g.mapTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,t(p.alphaMap,g.alphaMapTransform)),p.bumpMap&&(g.bumpMap.value=p.bumpMap,t(p.bumpMap,g.bumpMapTransform),g.bumpScale.value=p.bumpScale,p.side===sn&&(g.bumpScale.value*=-1)),p.normalMap&&(g.normalMap.value=p.normalMap,t(p.normalMap,g.normalMapTransform),g.normalScale.value.copy(p.normalScale),p.side===sn&&g.normalScale.value.negate()),p.displacementMap&&(g.displacementMap.value=p.displacementMap,t(p.displacementMap,g.displacementMapTransform),g.displacementScale.value=p.displacementScale,g.displacementBias.value=p.displacementBias),p.emissiveMap&&(g.emissiveMap.value=p.emissiveMap,t(p.emissiveMap,g.emissiveMapTransform)),p.specularMap&&(g.specularMap.value=p.specularMap,t(p.specularMap,g.specularMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest);const A=e.get(p),C=A.envMap,S=A.envMapRotation;C&&(g.envMap.value=C,Ui.copy(S),Ui.x*=-1,Ui.y*=-1,Ui.z*=-1,C.isCubeTexture&&C.isRenderTargetTexture===!1&&(Ui.y*=-1,Ui.z*=-1),g.envMapRotation.value.setFromMatrix4(Tv.makeRotationFromEuler(Ui)),g.flipEnvMap.value=C.isCubeTexture&&C.isRenderTargetTexture===!1?-1:1,g.reflectivity.value=p.reflectivity,g.ior.value=p.ior,g.refractionRatio.value=p.refractionRatio),p.lightMap&&(g.lightMap.value=p.lightMap,g.lightMapIntensity.value=p.lightMapIntensity,t(p.lightMap,g.lightMapTransform)),p.aoMap&&(g.aoMap.value=p.aoMap,g.aoMapIntensity.value=p.aoMapIntensity,t(p.aoMap,g.aoMapTransform))}function s(g,p){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,p.map&&(g.map.value=p.map,t(p.map,g.mapTransform))}function o(g,p){g.dashSize.value=p.dashSize,g.totalSize.value=p.dashSize+p.gapSize,g.scale.value=p.scale}function l(g,p,A,C){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,g.size.value=p.size*A,g.scale.value=C*.5,p.map&&(g.map.value=p.map,t(p.map,g.uvTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,t(p.alphaMap,g.alphaMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest)}function c(g,p){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,g.rotation.value=p.rotation,p.map&&(g.map.value=p.map,t(p.map,g.mapTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,t(p.alphaMap,g.alphaMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest)}function u(g,p){g.specular.value.copy(p.specular),g.shininess.value=Math.max(p.shininess,1e-4)}function h(g,p){p.gradientMap&&(g.gradientMap.value=p.gradientMap)}function f(g,p){g.metalness.value=p.metalness,p.metalnessMap&&(g.metalnessMap.value=p.metalnessMap,t(p.metalnessMap,g.metalnessMapTransform)),g.roughness.value=p.roughness,p.roughnessMap&&(g.roughnessMap.value=p.roughnessMap,t(p.roughnessMap,g.roughnessMapTransform)),p.envMap&&(g.envMapIntensity.value=p.envMapIntensity)}function m(g,p,A){g.ior.value=p.ior,p.sheen>0&&(g.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),g.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(g.sheenColorMap.value=p.sheenColorMap,t(p.sheenColorMap,g.sheenColorMapTransform)),p.sheenRoughnessMap&&(g.sheenRoughnessMap.value=p.sheenRoughnessMap,t(p.sheenRoughnessMap,g.sheenRoughnessMapTransform))),p.clearcoat>0&&(g.clearcoat.value=p.clearcoat,g.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(g.clearcoatMap.value=p.clearcoatMap,t(p.clearcoatMap,g.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(g.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,t(p.clearcoatRoughnessMap,g.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(g.clearcoatNormalMap.value=p.clearcoatNormalMap,t(p.clearcoatNormalMap,g.clearcoatNormalMapTransform),g.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===sn&&g.clearcoatNormalScale.value.negate())),p.dispersion>0&&(g.dispersion.value=p.dispersion),p.iridescence>0&&(g.iridescence.value=p.iridescence,g.iridescenceIOR.value=p.iridescenceIOR,g.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],g.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(g.iridescenceMap.value=p.iridescenceMap,t(p.iridescenceMap,g.iridescenceMapTransform)),p.iridescenceThicknessMap&&(g.iridescenceThicknessMap.value=p.iridescenceThicknessMap,t(p.iridescenceThicknessMap,g.iridescenceThicknessMapTransform))),p.transmission>0&&(g.transmission.value=p.transmission,g.transmissionSamplerMap.value=A.texture,g.transmissionSamplerSize.value.set(A.width,A.height),p.transmissionMap&&(g.transmissionMap.value=p.transmissionMap,t(p.transmissionMap,g.transmissionMapTransform)),g.thickness.value=p.thickness,p.thicknessMap&&(g.thicknessMap.value=p.thicknessMap,t(p.thicknessMap,g.thicknessMapTransform)),g.attenuationDistance.value=p.attenuationDistance,g.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(g.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(g.anisotropyMap.value=p.anisotropyMap,t(p.anisotropyMap,g.anisotropyMapTransform))),g.specularIntensity.value=p.specularIntensity,g.specularColor.value.copy(p.specularColor),p.specularColorMap&&(g.specularColorMap.value=p.specularColorMap,t(p.specularColorMap,g.specularColorMapTransform)),p.specularIntensityMap&&(g.specularIntensityMap.value=p.specularIntensityMap,t(p.specularIntensityMap,g.specularIntensityMapTransform))}function x(g,p){p.matcap&&(g.matcap.value=p.matcap)}function y(g,p){const A=e.get(p).light;g.referencePosition.value.setFromMatrixPosition(A.matrixWorld),g.nearDistance.value=A.shadow.camera.near,g.farDistance.value=A.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:r}}function Av(i,e,t,n){let r={},a={},s=[];const o=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function l(A,C){const S=C.program;n.uniformBlockBinding(A,S)}function c(A,C){let S=r[A.id];S===void 0&&(x(A),S=u(A),r[A.id]=S,A.addEventListener("dispose",g));const N=C.program;n.updateUBOMapping(A,N);const I=e.render.frame;a[A.id]!==I&&(f(A),a[A.id]=I)}function u(A){const C=h();A.__bindingPointIndex=C;const S=i.createBuffer(),N=A.__size,I=A.usage;return i.bindBuffer(i.UNIFORM_BUFFER,S),i.bufferData(i.UNIFORM_BUFFER,N,I),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,C,S),S}function h(){for(let A=0;A<o;A++)if(s.indexOf(A)===-1)return s.push(A),A;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function f(A){const C=r[A.id],S=A.uniforms,N=A.__cache;i.bindBuffer(i.UNIFORM_BUFFER,C);for(let I=0,D=S.length;I<D;I++){const U=Array.isArray(S[I])?S[I]:[S[I]];for(let T=0,w=U.length;T<w;T++){const F=U[T];if(m(F,I,T,N)===!0){const V=F.__offset,G=Array.isArray(F.value)?F.value:[F.value];let K=0;for(let J=0;J<G.length;J++){const j=G[J],te=y(j);typeof j=="number"||typeof j=="boolean"?(F.__data[0]=j,i.bufferSubData(i.UNIFORM_BUFFER,V+K,F.__data)):j.isMatrix3?(F.__data[0]=j.elements[0],F.__data[1]=j.elements[1],F.__data[2]=j.elements[2],F.__data[3]=0,F.__data[4]=j.elements[3],F.__data[5]=j.elements[4],F.__data[6]=j.elements[5],F.__data[7]=0,F.__data[8]=j.elements[6],F.__data[9]=j.elements[7],F.__data[10]=j.elements[8],F.__data[11]=0):(j.toArray(F.__data,K),K+=te.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,V,F.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function m(A,C,S,N){const I=A.value,D=C+"_"+S;if(N[D]===void 0)return typeof I=="number"||typeof I=="boolean"?N[D]=I:N[D]=I.clone(),!0;{const U=N[D];if(typeof I=="number"||typeof I=="boolean"){if(U!==I)return N[D]=I,!0}else if(U.equals(I)===!1)return U.copy(I),!0}return!1}function x(A){const C=A.uniforms;let S=0;const N=16;for(let D=0,U=C.length;D<U;D++){const T=Array.isArray(C[D])?C[D]:[C[D]];for(let w=0,F=T.length;w<F;w++){const V=T[w],G=Array.isArray(V.value)?V.value:[V.value];for(let K=0,J=G.length;K<J;K++){const j=G[K],te=y(j),Y=S%N,fe=Y%te.boundary,pe=Y+fe;S+=fe,pe!==0&&N-pe<te.storage&&(S+=N-pe),V.__data=new Float32Array(te.storage/Float32Array.BYTES_PER_ELEMENT),V.__offset=S,S+=te.storage}}}const I=S%N;return I>0&&(S+=N-I),A.__size=S,A.__cache={},this}function y(A){const C={boundary:0,storage:0};return typeof A=="number"||typeof A=="boolean"?(C.boundary=4,C.storage=4):A.isVector2?(C.boundary=8,C.storage=8):A.isVector3||A.isColor?(C.boundary=16,C.storage=12):A.isVector4?(C.boundary=16,C.storage=16):A.isMatrix3?(C.boundary=48,C.storage=48):A.isMatrix4?(C.boundary=64,C.storage=64):A.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",A),C}function g(A){const C=A.target;C.removeEventListener("dispose",g);const S=s.indexOf(C.__bindingPointIndex);s.splice(S,1),i.deleteBuffer(r[C.id]),delete r[C.id],delete a[C.id]}function p(){for(const A in r)i.deleteBuffer(r[A]);s=[],r={},a={}}return{bind:l,update:c,dispose:p}}class bu{constructor(e={}){const{canvas:t=md(),context:n=null,depth:r=!0,stencil:a=!1,alpha:s=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:u="default",failIfMajorPerformanceCaveat:h=!1,reverseDepthBuffer:f=!1}=e;this.isWebGLRenderer=!0;let m;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");m=n.getContextAttributes().alpha}else m=s;const x=new Uint32Array(4),y=new Int32Array(4);let g=null,p=null;const A=[],C=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=xn,this.toneMapping=_i,this.toneMappingExposure=1;const S=this;let N=!1,I=0,D=0,U=null,T=-1,w=null;const F=new It,V=new It;let G=null;const K=new nt(0);let J=0,j=t.width,te=t.height,Y=1,fe=null,pe=null;const ye=new It(0,0,j,te),ke=new It(0,0,j,te);let qe=!1;const Q=new A0;let ce=!1,Re=!1;const me=new Ct,Ne=new Ct,ze=new q,ve=new It,Oe={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let We=!1;function lt(){return U===null?Y:1}let O=n;function en(E,B){return t.getContext(E,B)}try{const E={alpha:!0,depth:r,stencil:a,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:u,failIfMajorPerformanceCaveat:h};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${_0}`),t.addEventListener("webglcontextlost",ie,!1),t.addEventListener("webglcontextrestored",Te,!1),t.addEventListener("webglcontextcreationerror",Me,!1),O===null){const B="webgl2";if(O=en(B,E),O===null)throw en(B)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(E){throw console.error("THREE.WebGLRenderer: "+E.message),E}let it,rt,Be,vt,Ue,R,b,W,ne,ae,ee,Pe,ge,we,st,he,Ae,Ve,$e,Ce,at,et,yt,z;function _e(){it=new Lm(O),it.init(),et=new xv(O,it),rt=new Am(O,it,e,et),Be=new mv(O,it),rt.reverseDepthBuffer&&f&&Be.buffers.depth.setReversed(!0),vt=new Nm(O),Ue=new ev,R=new gv(O,it,Be,Ue,rt,et,vt),b=new Rm(S),W=new Im(S),ne=new Vd(O),yt=new Tm(O,ne),ae=new Fm(O,ne,vt,yt),ee=new zm(O,ae,ne,vt),$e=new km(O,rt,R),he=new Cm(Ue),Pe=new Q1(S,b,W,it,rt,yt,he),ge=new Ev(S,Ue),we=new nv,st=new lv(it),Ve=new wm(S,b,W,Be,ee,m,l),Ae=new fv(S,ee,rt),z=new Av(O,vt,rt,Be),Ce=new Em(O,it,vt),at=new Um(O,it,vt),vt.programs=Pe.programs,S.capabilities=rt,S.extensions=it,S.properties=Ue,S.renderLists=we,S.shadowMap=Ae,S.state=Be,S.info=vt}_e();const Z=new wv(S,O);this.xr=Z,this.getContext=function(){return O},this.getContextAttributes=function(){return O.getContextAttributes()},this.forceContextLoss=function(){const E=it.get("WEBGL_lose_context");E&&E.loseContext()},this.forceContextRestore=function(){const E=it.get("WEBGL_lose_context");E&&E.restoreContext()},this.getPixelRatio=function(){return Y},this.setPixelRatio=function(E){E!==void 0&&(Y=E,this.setSize(j,te,!1))},this.getSize=function(E){return E.set(j,te)},this.setSize=function(E,B,X=!0){if(Z.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}j=E,te=B,t.width=Math.floor(E*Y),t.height=Math.floor(B*Y),X===!0&&(t.style.width=E+"px",t.style.height=B+"px"),this.setViewport(0,0,E,B)},this.getDrawingBufferSize=function(E){return E.set(j*Y,te*Y).floor()},this.setDrawingBufferSize=function(E,B,X){j=E,te=B,Y=X,t.width=Math.floor(E*X),t.height=Math.floor(B*X),this.setViewport(0,0,E,B)},this.getCurrentViewport=function(E){return E.copy(F)},this.getViewport=function(E){return E.copy(ye)},this.setViewport=function(E,B,X,$){E.isVector4?ye.set(E.x,E.y,E.z,E.w):ye.set(E,B,X,$),Be.viewport(F.copy(ye).multiplyScalar(Y).round())},this.getScissor=function(E){return E.copy(ke)},this.setScissor=function(E,B,X,$){E.isVector4?ke.set(E.x,E.y,E.z,E.w):ke.set(E,B,X,$),Be.scissor(V.copy(ke).multiplyScalar(Y).round())},this.getScissorTest=function(){return qe},this.setScissorTest=function(E){Be.setScissorTest(qe=E)},this.setOpaqueSort=function(E){fe=E},this.setTransparentSort=function(E){pe=E},this.getClearColor=function(E){return E.copy(Ve.getClearColor())},this.setClearColor=function(){Ve.setClearColor.apply(Ve,arguments)},this.getClearAlpha=function(){return Ve.getClearAlpha()},this.setClearAlpha=function(){Ve.setClearAlpha.apply(Ve,arguments)},this.clear=function(E=!0,B=!0,X=!0){let $=0;if(E){let H=!1;if(U!==null){const de=U.texture.format;H=de===E0||de===T0||de===w0}if(H){const de=U.texture.type,Se=de===ni||de===qi||de===Gr||de===xr||de===M0||de===S0,De=Ve.getClearColor(),Ie=Ve.getClearAlpha(),Ke=De.r,Ze=De.g,Le=De.b;Se?(x[0]=Ke,x[1]=Ze,x[2]=Le,x[3]=Ie,O.clearBufferuiv(O.COLOR,0,x)):(y[0]=Ke,y[1]=Ze,y[2]=Le,y[3]=Ie,O.clearBufferiv(O.COLOR,0,y))}else $|=O.COLOR_BUFFER_BIT}B&&($|=O.DEPTH_BUFFER_BIT),X&&($|=O.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),O.clear($)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",ie,!1),t.removeEventListener("webglcontextrestored",Te,!1),t.removeEventListener("webglcontextcreationerror",Me,!1),we.dispose(),st.dispose(),Ue.dispose(),b.dispose(),W.dispose(),ee.dispose(),yt.dispose(),z.dispose(),Pe.dispose(),Z.dispose(),Z.removeEventListener("sessionstart",q0),Z.removeEventListener("sessionend",X0),Ri.stop()};function ie(E){E.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),N=!0}function Te(){console.log("THREE.WebGLRenderer: Context Restored."),N=!1;const E=vt.autoReset,B=Ae.enabled,X=Ae.autoUpdate,$=Ae.needsUpdate,H=Ae.type;_e(),vt.autoReset=E,Ae.enabled=B,Ae.autoUpdate=X,Ae.needsUpdate=$,Ae.type=H}function Me(E){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",E.statusMessage)}function je(E){const B=E.target;B.removeEventListener("dispose",je),Rt(B)}function Rt(E){Gt(E),Ue.remove(E)}function Gt(E){const B=Ue.get(E).programs;B!==void 0&&(B.forEach(function(X){Pe.releaseProgram(X)}),E.isShaderMaterial&&Pe.releaseShaderCache(E))}this.renderBufferDirect=function(E,B,X,$,H,de){B===null&&(B=Oe);const Se=H.isMesh&&H.matrixWorld.determinant()<0,De=Mh(E,B,X,$,H);Be.setMaterial($,Se);let Ie=X.index,Ke=1;if($.wireframe===!0){if(Ie=ae.getWireframeAttribute(X),Ie===void 0)return;Ke=2}const Ze=X.drawRange,Le=X.attributes.position;let ct=Ze.start*Ke,_t=(Ze.start+Ze.count)*Ke;de!==null&&(ct=Math.max(ct,de.start*Ke),_t=Math.min(_t,(de.start+de.count)*Ke)),Ie!==null?(ct=Math.max(ct,0),_t=Math.min(_t,Ie.count)):Le!=null&&(ct=Math.max(ct,0),_t=Math.min(_t,Le.count));const Mt=_t-ct;if(Mt<0||Mt===1/0)return;yt.setup(H,$,De,X,Ie);let tn,ft=Ce;if(Ie!==null&&(tn=ne.get(Ie),ft=at,ft.setIndex(tn)),H.isMesh)$.wireframe===!0?(Be.setLineWidth($.wireframeLinewidth*lt()),ft.setMode(O.LINES)):ft.setMode(O.TRIANGLES);else if(H.isLine){let Fe=$.linewidth;Fe===void 0&&(Fe=1),Be.setLineWidth(Fe*lt()),H.isLineSegments?ft.setMode(O.LINES):H.isLineLoop?ft.setMode(O.LINE_LOOP):ft.setMode(O.LINE_STRIP)}else H.isPoints?ft.setMode(O.POINTS):H.isSprite&&ft.setMode(O.TRIANGLES);if(H.isBatchedMesh)if(H._multiDrawInstances!==null)ft.renderMultiDrawInstances(H._multiDrawStarts,H._multiDrawCounts,H._multiDrawCount,H._multiDrawInstances);else if(it.get("WEBGL_multi_draw"))ft.renderMultiDraw(H._multiDrawStarts,H._multiDrawCounts,H._multiDrawCount);else{const Fe=H._multiDrawStarts,Gn=H._multiDrawCounts,pt=H._multiDrawCount,Sn=Ie?ne.get(Ie).bytesPerElement:1,Yi=Ue.get($).currentProgram.getUniforms();for(let ln=0;ln<pt;ln++)Yi.setValue(O,"_gl_DrawID",ln),ft.render(Fe[ln]/Sn,Gn[ln])}else if(H.isInstancedMesh)ft.renderInstances(ct,Mt,H.count);else if(X.isInstancedBufferGeometry){const Fe=X._maxInstanceCount!==void 0?X._maxInstanceCount:1/0,Gn=Math.min(X.instanceCount,Fe);ft.renderInstances(ct,Mt,Gn)}else ft.render(ct,Mt)};function mt(E,B,X){E.transparent===!0&&E.side===An&&E.forceSinglePass===!1?(E.side=sn,E.needsUpdate=!0,ta(E,B,X),E.side=Mi,E.needsUpdate=!0,ta(E,B,X),E.side=An):ta(E,B,X)}this.compile=function(E,B,X=null){X===null&&(X=E),p=st.get(X),p.init(B),C.push(p),X.traverseVisible(function(H){H.isLight&&H.layers.test(B.layers)&&(p.pushLight(H),H.castShadow&&p.pushShadow(H))}),E!==X&&E.traverseVisible(function(H){H.isLight&&H.layers.test(B.layers)&&(p.pushLight(H),H.castShadow&&p.pushShadow(H))}),p.setupLights();const $=new Set;return E.traverse(function(H){if(!(H.isMesh||H.isPoints||H.isLine||H.isSprite))return;const de=H.material;if(de)if(Array.isArray(de))for(let Se=0;Se<de.length;Se++){const De=de[Se];mt(De,X,H),$.add(De)}else mt(de,X,H),$.add(de)}),C.pop(),p=null,$},this.compileAsync=function(E,B,X=null){const $=this.compile(E,B,X);return new Promise(H=>{function de(){if($.forEach(function(Se){Ue.get(Se).currentProgram.isReady()&&$.delete(Se)}),$.size===0){H(E);return}setTimeout(de,10)}it.get("KHR_parallel_shader_compile")!==null?de():setTimeout(de,10)})};let Mn=null;function Vn(E){Mn&&Mn(E)}function q0(){Ri.stop()}function X0(){Ri.start()}const Ri=new pu;Ri.setAnimationLoop(Vn),typeof self<"u"&&Ri.setContext(self),this.setAnimationLoop=function(E){Mn=E,Z.setAnimationLoop(E),E===null?Ri.stop():Ri.start()},Z.addEventListener("sessionstart",q0),Z.addEventListener("sessionend",X0),this.render=function(E,B){if(B!==void 0&&B.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(N===!0)return;if(E.matrixWorldAutoUpdate===!0&&E.updateMatrixWorld(),B.parent===null&&B.matrixWorldAutoUpdate===!0&&B.updateMatrixWorld(),Z.enabled===!0&&Z.isPresenting===!0&&(Z.cameraAutoUpdate===!0&&Z.updateCamera(B),B=Z.getCamera()),E.isScene===!0&&E.onBeforeRender(S,E,B,U),p=st.get(E,C.length),p.init(B),C.push(p),Ne.multiplyMatrices(B.projectionMatrix,B.matrixWorldInverse),Q.setFromProjectionMatrix(Ne),Re=this.localClippingEnabled,ce=he.init(this.clippingPlanes,Re),g=we.get(E,A.length),g.init(),A.push(g),Z.enabled===!0&&Z.isPresenting===!0){const de=S.xr.getDepthSensingMesh();de!==null&&vs(de,B,-1/0,S.sortObjects)}vs(E,B,0,S.sortObjects),g.finish(),S.sortObjects===!0&&g.sort(fe,pe),We=Z.enabled===!1||Z.isPresenting===!1||Z.hasDepthSensing()===!1,We&&Ve.addToRenderList(g,E),this.info.render.frame++,ce===!0&&he.beginShadows();const X=p.state.shadowsArray;Ae.render(X,E,B),ce===!0&&he.endShadows(),this.info.autoReset===!0&&this.info.reset();const $=g.opaque,H=g.transmissive;if(p.setupLights(),B.isArrayCamera){const de=B.cameras;if(H.length>0)for(let Se=0,De=de.length;Se<De;Se++){const Ie=de[Se];Y0($,H,E,Ie)}We&&Ve.render(E);for(let Se=0,De=de.length;Se<De;Se++){const Ie=de[Se];$0(g,E,Ie,Ie.viewport)}}else H.length>0&&Y0($,H,E,B),We&&Ve.render(E),$0(g,E,B);U!==null&&(R.updateMultisampleRenderTarget(U),R.updateRenderTargetMipmap(U)),E.isScene===!0&&E.onAfterRender(S,E,B),yt.resetDefaultState(),T=-1,w=null,C.pop(),C.length>0?(p=C[C.length-1],ce===!0&&he.setGlobalState(S.clippingPlanes,p.state.camera)):p=null,A.pop(),A.length>0?g=A[A.length-1]:g=null};function vs(E,B,X,$){if(E.visible===!1)return;if(E.layers.test(B.layers)){if(E.isGroup)X=E.renderOrder;else if(E.isLOD)E.autoUpdate===!0&&E.update(B);else if(E.isLight)p.pushLight(E),E.castShadow&&p.pushShadow(E);else if(E.isSprite){if(!E.frustumCulled||Q.intersectsSprite(E)){$&&ve.setFromMatrixPosition(E.matrixWorld).applyMatrix4(Ne);const Se=ee.update(E),De=E.material;De.visible&&g.push(E,Se,De,X,ve.z,null)}}else if((E.isMesh||E.isLine||E.isPoints)&&(!E.frustumCulled||Q.intersectsObject(E))){const Se=ee.update(E),De=E.material;if($&&(E.boundingSphere!==void 0?(E.boundingSphere===null&&E.computeBoundingSphere(),ve.copy(E.boundingSphere.center)):(Se.boundingSphere===null&&Se.computeBoundingSphere(),ve.copy(Se.boundingSphere.center)),ve.applyMatrix4(E.matrixWorld).applyMatrix4(Ne)),Array.isArray(De)){const Ie=Se.groups;for(let Ke=0,Ze=Ie.length;Ke<Ze;Ke++){const Le=Ie[Ke],ct=De[Le.materialIndex];ct&&ct.visible&&g.push(E,Se,ct,X,ve.z,Le)}}else De.visible&&g.push(E,Se,De,X,ve.z,null)}}const de=E.children;for(let Se=0,De=de.length;Se<De;Se++)vs(de[Se],B,X,$)}function $0(E,B,X,$){const H=E.opaque,de=E.transmissive,Se=E.transparent;p.setupLightsView(X),ce===!0&&he.setGlobalState(S.clippingPlanes,X),$&&Be.viewport(F.copy($)),H.length>0&&ea(H,B,X),de.length>0&&ea(de,B,X),Se.length>0&&ea(Se,B,X),Be.buffers.depth.setTest(!0),Be.buffers.depth.setMask(!0),Be.buffers.color.setMask(!0),Be.setPolygonOffset(!1)}function Y0(E,B,X,$){if((X.isScene===!0?X.overrideMaterial:null)!==null)return;p.state.transmissionRenderTarget[$.id]===void 0&&(p.state.transmissionRenderTarget[$.id]=new Xi(1,1,{generateMipmaps:!0,type:it.has("EXT_color_buffer_half_float")||it.has("EXT_color_buffer_float")?Yr:ni,minFilter:Wi,samples:4,stencilBuffer:a,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:ot.workingColorSpace}));const de=p.state.transmissionRenderTarget[$.id],Se=$.viewport||F;de.setSize(Se.z,Se.w);const De=S.getRenderTarget();S.setRenderTarget(de),S.getClearColor(K),J=S.getClearAlpha(),J<1&&S.setClearColor(16777215,.5),S.clear(),We&&Ve.render(X);const Ie=S.toneMapping;S.toneMapping=_i;const Ke=$.viewport;if($.viewport!==void 0&&($.viewport=void 0),p.setupLightsView($),ce===!0&&he.setGlobalState(S.clippingPlanes,$),ea(E,X,$),R.updateMultisampleRenderTarget(de),R.updateRenderTargetMipmap(de),it.has("WEBGL_multisampled_render_to_texture")===!1){let Ze=!1;for(let Le=0,ct=B.length;Le<ct;Le++){const _t=B[Le],Mt=_t.object,tn=_t.geometry,ft=_t.material,Fe=_t.group;if(ft.side===An&&Mt.layers.test($.layers)){const Gn=ft.side;ft.side=sn,ft.needsUpdate=!0,K0(Mt,X,$,tn,ft,Fe),ft.side=Gn,ft.needsUpdate=!0,Ze=!0}}Ze===!0&&(R.updateMultisampleRenderTarget(de),R.updateRenderTargetMipmap(de))}S.setRenderTarget(De),S.setClearColor(K,J),Ke!==void 0&&($.viewport=Ke),S.toneMapping=Ie}function ea(E,B,X){const $=B.isScene===!0?B.overrideMaterial:null;for(let H=0,de=E.length;H<de;H++){const Se=E[H],De=Se.object,Ie=Se.geometry,Ke=$===null?Se.material:$,Ze=Se.group;De.layers.test(X.layers)&&K0(De,B,X,Ie,Ke,Ze)}}function K0(E,B,X,$,H,de){E.onBeforeRender(S,B,X,$,H,de),E.modelViewMatrix.multiplyMatrices(X.matrixWorldInverse,E.matrixWorld),E.normalMatrix.getNormalMatrix(E.modelViewMatrix),H.onBeforeRender(S,B,X,$,E,de),H.transparent===!0&&H.side===An&&H.forceSinglePass===!1?(H.side=sn,H.needsUpdate=!0,S.renderBufferDirect(X,B,$,H,E,de),H.side=Mi,H.needsUpdate=!0,S.renderBufferDirect(X,B,$,H,E,de),H.side=An):S.renderBufferDirect(X,B,$,H,E,de),E.onAfterRender(S,B,X,$,H,de)}function ta(E,B,X){B.isScene!==!0&&(B=Oe);const $=Ue.get(E),H=p.state.lights,de=p.state.shadowsArray,Se=H.state.version,De=Pe.getParameters(E,H.state,de,B,X),Ie=Pe.getProgramCacheKey(De);let Ke=$.programs;$.environment=E.isMeshStandardMaterial?B.environment:null,$.fog=B.fog,$.envMap=(E.isMeshStandardMaterial?W:b).get(E.envMap||$.environment),$.envMapRotation=$.environment!==null&&E.envMap===null?B.environmentRotation:E.envMapRotation,Ke===void 0&&(E.addEventListener("dispose",je),Ke=new Map,$.programs=Ke);let Ze=Ke.get(Ie);if(Ze!==void 0){if($.currentProgram===Ze&&$.lightsStateVersion===Se)return Z0(E,De),Ze}else De.uniforms=Pe.getUniforms(E),E.onBeforeCompile(De,S),Ze=Pe.acquireProgram(De,Ie),Ke.set(Ie,Ze),$.uniforms=De.uniforms;const Le=$.uniforms;return(!E.isShaderMaterial&&!E.isRawShaderMaterial||E.clipping===!0)&&(Le.clippingPlanes=he.uniform),Z0(E,De),$.needsLights=wh(E),$.lightsStateVersion=Se,$.needsLights&&(Le.ambientLightColor.value=H.state.ambient,Le.lightProbe.value=H.state.probe,Le.directionalLights.value=H.state.directional,Le.directionalLightShadows.value=H.state.directionalShadow,Le.spotLights.value=H.state.spot,Le.spotLightShadows.value=H.state.spotShadow,Le.rectAreaLights.value=H.state.rectArea,Le.ltc_1.value=H.state.rectAreaLTC1,Le.ltc_2.value=H.state.rectAreaLTC2,Le.pointLights.value=H.state.point,Le.pointLightShadows.value=H.state.pointShadow,Le.hemisphereLights.value=H.state.hemi,Le.directionalShadowMap.value=H.state.directionalShadowMap,Le.directionalShadowMatrix.value=H.state.directionalShadowMatrix,Le.spotShadowMap.value=H.state.spotShadowMap,Le.spotLightMatrix.value=H.state.spotLightMatrix,Le.spotLightMap.value=H.state.spotLightMap,Le.pointShadowMap.value=H.state.pointShadowMap,Le.pointShadowMatrix.value=H.state.pointShadowMatrix),$.currentProgram=Ze,$.uniformsList=null,Ze}function j0(E){if(E.uniformsList===null){const B=E.currentProgram.getUniforms();E.uniformsList=Oa.seqWithValue(B.seq,E.uniforms)}return E.uniformsList}function Z0(E,B){const X=Ue.get(E);X.outputColorSpace=B.outputColorSpace,X.batching=B.batching,X.batchingColor=B.batchingColor,X.instancing=B.instancing,X.instancingColor=B.instancingColor,X.instancingMorph=B.instancingMorph,X.skinning=B.skinning,X.morphTargets=B.morphTargets,X.morphNormals=B.morphNormals,X.morphColors=B.morphColors,X.morphTargetsCount=B.morphTargetsCount,X.numClippingPlanes=B.numClippingPlanes,X.numIntersection=B.numClipIntersection,X.vertexAlphas=B.vertexAlphas,X.vertexTangents=B.vertexTangents,X.toneMapping=B.toneMapping}function Mh(E,B,X,$,H){B.isScene!==!0&&(B=Oe),R.resetTextureUnits();const de=B.fog,Se=$.isMeshStandardMaterial?B.environment:null,De=U===null?S.outputColorSpace:U.isXRRenderTarget===!0?U.texture.colorSpace:wr,Ie=($.isMeshStandardMaterial?W:b).get($.envMap||Se),Ke=$.vertexColors===!0&&!!X.attributes.color&&X.attributes.color.itemSize===4,Ze=!!X.attributes.tangent&&(!!$.normalMap||$.anisotropy>0),Le=!!X.morphAttributes.position,ct=!!X.morphAttributes.normal,_t=!!X.morphAttributes.color;let Mt=_i;$.toneMapped&&(U===null||U.isXRRenderTarget===!0)&&(Mt=S.toneMapping);const tn=X.morphAttributes.position||X.morphAttributes.normal||X.morphAttributes.color,ft=tn!==void 0?tn.length:0,Fe=Ue.get($),Gn=p.state.lights;if(ce===!0&&(Re===!0||E!==w)){const vn=E===w&&$.id===T;he.setState($,E,vn)}let pt=!1;$.version===Fe.__version?(Fe.needsLights&&Fe.lightsStateVersion!==Gn.state.version||Fe.outputColorSpace!==De||H.isBatchedMesh&&Fe.batching===!1||!H.isBatchedMesh&&Fe.batching===!0||H.isBatchedMesh&&Fe.batchingColor===!0&&H.colorTexture===null||H.isBatchedMesh&&Fe.batchingColor===!1&&H.colorTexture!==null||H.isInstancedMesh&&Fe.instancing===!1||!H.isInstancedMesh&&Fe.instancing===!0||H.isSkinnedMesh&&Fe.skinning===!1||!H.isSkinnedMesh&&Fe.skinning===!0||H.isInstancedMesh&&Fe.instancingColor===!0&&H.instanceColor===null||H.isInstancedMesh&&Fe.instancingColor===!1&&H.instanceColor!==null||H.isInstancedMesh&&Fe.instancingMorph===!0&&H.morphTexture===null||H.isInstancedMesh&&Fe.instancingMorph===!1&&H.morphTexture!==null||Fe.envMap!==Ie||$.fog===!0&&Fe.fog!==de||Fe.numClippingPlanes!==void 0&&(Fe.numClippingPlanes!==he.numPlanes||Fe.numIntersection!==he.numIntersection)||Fe.vertexAlphas!==Ke||Fe.vertexTangents!==Ze||Fe.morphTargets!==Le||Fe.morphNormals!==ct||Fe.morphColors!==_t||Fe.toneMapping!==Mt||Fe.morphTargetsCount!==ft)&&(pt=!0):(pt=!0,Fe.__version=$.version);let Sn=Fe.currentProgram;pt===!0&&(Sn=ta($,B,H));let Yi=!1,ln=!1,Ir=!1;const St=Sn.getUniforms(),In=Fe.uniforms;if(Be.useProgram(Sn.program)&&(Yi=!0,ln=!0,Ir=!0),$.id!==T&&(T=$.id,ln=!0),Yi||w!==E){Be.buffers.depth.getReversed()?(me.copy(E.projectionMatrix),gd(me),xd(me),St.setValue(O,"projectionMatrix",me)):St.setValue(O,"projectionMatrix",E.projectionMatrix),St.setValue(O,"viewMatrix",E.matrixWorldInverse);const oi=St.map.cameraPosition;oi!==void 0&&oi.setValue(O,ze.setFromMatrixPosition(E.matrixWorld)),rt.logarithmicDepthBuffer&&St.setValue(O,"logDepthBufFC",2/(Math.log(E.far+1)/Math.LN2)),($.isMeshPhongMaterial||$.isMeshToonMaterial||$.isMeshLambertMaterial||$.isMeshBasicMaterial||$.isMeshStandardMaterial||$.isShaderMaterial)&&St.setValue(O,"isOrthographic",E.isOrthographicCamera===!0),w!==E&&(w=E,ln=!0,Ir=!0)}if(H.isSkinnedMesh){St.setOptional(O,H,"bindMatrix"),St.setOptional(O,H,"bindMatrixInverse");const vn=H.skeleton;vn&&(vn.boneTexture===null&&vn.computeBoneTexture(),St.setValue(O,"boneTexture",vn.boneTexture,R))}H.isBatchedMesh&&(St.setOptional(O,H,"batchingTexture"),St.setValue(O,"batchingTexture",H._matricesTexture,R),St.setOptional(O,H,"batchingIdTexture"),St.setValue(O,"batchingIdTexture",H._indirectTexture,R),St.setOptional(O,H,"batchingColorTexture"),H._colorsTexture!==null&&St.setValue(O,"batchingColorTexture",H._colorsTexture,R));const Lr=X.morphAttributes;if((Lr.position!==void 0||Lr.normal!==void 0||Lr.color!==void 0)&&$e.update(H,X,Sn),(ln||Fe.receiveShadow!==H.receiveShadow)&&(Fe.receiveShadow=H.receiveShadow,St.setValue(O,"receiveShadow",H.receiveShadow)),$.isMeshGouraudMaterial&&$.envMap!==null&&(In.envMap.value=Ie,In.flipEnvMap.value=Ie.isCubeTexture&&Ie.isRenderTargetTexture===!1?-1:1),$.isMeshStandardMaterial&&$.envMap===null&&B.environment!==null&&(In.envMapIntensity.value=B.environmentIntensity),ln&&(St.setValue(O,"toneMappingExposure",S.toneMappingExposure),Fe.needsLights&&Sh(In,Ir),de&&$.fog===!0&&ge.refreshFogUniforms(In,de),ge.refreshMaterialUniforms(In,$,Y,te,p.state.transmissionRenderTarget[E.id]),Oa.upload(O,j0(Fe),In,R)),$.isShaderMaterial&&$.uniformsNeedUpdate===!0&&(Oa.upload(O,j0(Fe),In,R),$.uniformsNeedUpdate=!1),$.isSpriteMaterial&&St.setValue(O,"center",H.center),St.setValue(O,"modelViewMatrix",H.modelViewMatrix),St.setValue(O,"normalMatrix",H.normalMatrix),St.setValue(O,"modelMatrix",H.matrixWorld),$.isShaderMaterial||$.isRawShaderMaterial){const vn=$.uniformsGroups;for(let oi=0,li=vn.length;oi<li;oi++){const J0=vn[oi];z.update(J0,Sn),z.bind(J0,Sn)}}return Sn}function Sh(E,B){E.ambientLightColor.needsUpdate=B,E.lightProbe.needsUpdate=B,E.directionalLights.needsUpdate=B,E.directionalLightShadows.needsUpdate=B,E.pointLights.needsUpdate=B,E.pointLightShadows.needsUpdate=B,E.spotLights.needsUpdate=B,E.spotLightShadows.needsUpdate=B,E.rectAreaLights.needsUpdate=B,E.hemisphereLights.needsUpdate=B}function wh(E){return E.isMeshLambertMaterial||E.isMeshToonMaterial||E.isMeshPhongMaterial||E.isMeshStandardMaterial||E.isShadowMaterial||E.isShaderMaterial&&E.lights===!0}this.getActiveCubeFace=function(){return I},this.getActiveMipmapLevel=function(){return D},this.getRenderTarget=function(){return U},this.setRenderTargetTextures=function(E,B,X){Ue.get(E.texture).__webglTexture=B,Ue.get(E.depthTexture).__webglTexture=X;const $=Ue.get(E);$.__hasExternalTextures=!0,$.__autoAllocateDepthBuffer=X===void 0,$.__autoAllocateDepthBuffer||it.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),$.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(E,B){const X=Ue.get(E);X.__webglFramebuffer=B,X.__useDefaultFramebuffer=B===void 0},this.setRenderTarget=function(E,B=0,X=0){U=E,I=B,D=X;let $=!0,H=null,de=!1,Se=!1;if(E){const Ie=Ue.get(E);if(Ie.__useDefaultFramebuffer!==void 0)Be.bindFramebuffer(O.FRAMEBUFFER,null),$=!1;else if(Ie.__webglFramebuffer===void 0)R.setupRenderTarget(E);else if(Ie.__hasExternalTextures)R.rebindTextures(E,Ue.get(E.texture).__webglTexture,Ue.get(E.depthTexture).__webglTexture);else if(E.depthBuffer){const Le=E.depthTexture;if(Ie.__boundDepthTexture!==Le){if(Le!==null&&Ue.has(Le)&&(E.width!==Le.image.width||E.height!==Le.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");R.setupDepthRenderbuffer(E)}}const Ke=E.texture;(Ke.isData3DTexture||Ke.isDataArrayTexture||Ke.isCompressedArrayTexture)&&(Se=!0);const Ze=Ue.get(E).__webglFramebuffer;E.isWebGLCubeRenderTarget?(Array.isArray(Ze[B])?H=Ze[B][X]:H=Ze[B],de=!0):E.samples>0&&R.useMultisampledRTT(E)===!1?H=Ue.get(E).__webglMultisampledFramebuffer:Array.isArray(Ze)?H=Ze[X]:H=Ze,F.copy(E.viewport),V.copy(E.scissor),G=E.scissorTest}else F.copy(ye).multiplyScalar(Y).floor(),V.copy(ke).multiplyScalar(Y).floor(),G=qe;if(Be.bindFramebuffer(O.FRAMEBUFFER,H)&&$&&Be.drawBuffers(E,H),Be.viewport(F),Be.scissor(V),Be.setScissorTest(G),de){const Ie=Ue.get(E.texture);O.framebufferTexture2D(O.FRAMEBUFFER,O.COLOR_ATTACHMENT0,O.TEXTURE_CUBE_MAP_POSITIVE_X+B,Ie.__webglTexture,X)}else if(Se){const Ie=Ue.get(E.texture),Ke=B||0;O.framebufferTextureLayer(O.FRAMEBUFFER,O.COLOR_ATTACHMENT0,Ie.__webglTexture,X||0,Ke)}T=-1},this.readRenderTargetPixels=function(E,B,X,$,H,de,Se){if(!(E&&E.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let De=Ue.get(E).__webglFramebuffer;if(E.isWebGLCubeRenderTarget&&Se!==void 0&&(De=De[Se]),De){Be.bindFramebuffer(O.FRAMEBUFFER,De);try{const Ie=E.texture,Ke=Ie.format,Ze=Ie.type;if(!rt.textureFormatReadable(Ke)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!rt.textureTypeReadable(Ze)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}B>=0&&B<=E.width-$&&X>=0&&X<=E.height-H&&O.readPixels(B,X,$,H,et.convert(Ke),et.convert(Ze),de)}finally{const Ie=U!==null?Ue.get(U).__webglFramebuffer:null;Be.bindFramebuffer(O.FRAMEBUFFER,Ie)}}},this.readRenderTargetPixelsAsync=async function(E,B,X,$,H,de,Se){if(!(E&&E.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let De=Ue.get(E).__webglFramebuffer;if(E.isWebGLCubeRenderTarget&&Se!==void 0&&(De=De[Se]),De){const Ie=E.texture,Ke=Ie.format,Ze=Ie.type;if(!rt.textureFormatReadable(Ke))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!rt.textureTypeReadable(Ze))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(B>=0&&B<=E.width-$&&X>=0&&X<=E.height-H){Be.bindFramebuffer(O.FRAMEBUFFER,De);const Le=O.createBuffer();O.bindBuffer(O.PIXEL_PACK_BUFFER,Le),O.bufferData(O.PIXEL_PACK_BUFFER,de.byteLength,O.STREAM_READ),O.readPixels(B,X,$,H,et.convert(Ke),et.convert(Ze),0);const ct=U!==null?Ue.get(U).__webglFramebuffer:null;Be.bindFramebuffer(O.FRAMEBUFFER,ct);const _t=O.fenceSync(O.SYNC_GPU_COMMANDS_COMPLETE,0);return O.flush(),await vd(O,_t,4),O.bindBuffer(O.PIXEL_PACK_BUFFER,Le),O.getBufferSubData(O.PIXEL_PACK_BUFFER,0,de),O.deleteBuffer(Le),O.deleteSync(_t),de}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(E,B=null,X=0){E.isTexture!==!0&&(Or("WebGLRenderer: copyFramebufferToTexture function signature has changed."),B=arguments[0]||null,E=arguments[1]);const $=Math.pow(2,-X),H=Math.floor(E.image.width*$),de=Math.floor(E.image.height*$),Se=B!==null?B.x:0,De=B!==null?B.y:0;R.setTexture2D(E,0),O.copyTexSubImage2D(O.TEXTURE_2D,X,0,0,Se,De,H,de),Be.unbindTexture()},this.copyTextureToTexture=function(E,B,X=null,$=null,H=0){E.isTexture!==!0&&(Or("WebGLRenderer: copyTextureToTexture function signature has changed."),$=arguments[0]||null,E=arguments[1],B=arguments[2],H=arguments[3]||0,X=null);let de,Se,De,Ie,Ke,Ze,Le,ct,_t;const Mt=E.isCompressedTexture?E.mipmaps[H]:E.image;X!==null?(de=X.max.x-X.min.x,Se=X.max.y-X.min.y,De=X.isBox3?X.max.z-X.min.z:1,Ie=X.min.x,Ke=X.min.y,Ze=X.isBox3?X.min.z:0):(de=Mt.width,Se=Mt.height,De=Mt.depth||1,Ie=0,Ke=0,Ze=0),$!==null?(Le=$.x,ct=$.y,_t=$.z):(Le=0,ct=0,_t=0);const tn=et.convert(B.format),ft=et.convert(B.type);let Fe;B.isData3DTexture?(R.setTexture3D(B,0),Fe=O.TEXTURE_3D):B.isDataArrayTexture||B.isCompressedArrayTexture?(R.setTexture2DArray(B,0),Fe=O.TEXTURE_2D_ARRAY):(R.setTexture2D(B,0),Fe=O.TEXTURE_2D),O.pixelStorei(O.UNPACK_FLIP_Y_WEBGL,B.flipY),O.pixelStorei(O.UNPACK_PREMULTIPLY_ALPHA_WEBGL,B.premultiplyAlpha),O.pixelStorei(O.UNPACK_ALIGNMENT,B.unpackAlignment);const Gn=O.getParameter(O.UNPACK_ROW_LENGTH),pt=O.getParameter(O.UNPACK_IMAGE_HEIGHT),Sn=O.getParameter(O.UNPACK_SKIP_PIXELS),Yi=O.getParameter(O.UNPACK_SKIP_ROWS),ln=O.getParameter(O.UNPACK_SKIP_IMAGES);O.pixelStorei(O.UNPACK_ROW_LENGTH,Mt.width),O.pixelStorei(O.UNPACK_IMAGE_HEIGHT,Mt.height),O.pixelStorei(O.UNPACK_SKIP_PIXELS,Ie),O.pixelStorei(O.UNPACK_SKIP_ROWS,Ke),O.pixelStorei(O.UNPACK_SKIP_IMAGES,Ze);const Ir=E.isDataArrayTexture||E.isData3DTexture,St=B.isDataArrayTexture||B.isData3DTexture;if(E.isRenderTargetTexture||E.isDepthTexture){const In=Ue.get(E),Lr=Ue.get(B),vn=Ue.get(In.__renderTarget),oi=Ue.get(Lr.__renderTarget);Be.bindFramebuffer(O.READ_FRAMEBUFFER,vn.__webglFramebuffer),Be.bindFramebuffer(O.DRAW_FRAMEBUFFER,oi.__webglFramebuffer);for(let li=0;li<De;li++)Ir&&O.framebufferTextureLayer(O.READ_FRAMEBUFFER,O.COLOR_ATTACHMENT0,Ue.get(E).__webglTexture,H,Ze+li),E.isDepthTexture?(St&&O.framebufferTextureLayer(O.DRAW_FRAMEBUFFER,O.COLOR_ATTACHMENT0,Ue.get(B).__webglTexture,H,_t+li),O.blitFramebuffer(Ie,Ke,de,Se,Le,ct,de,Se,O.DEPTH_BUFFER_BIT,O.NEAREST)):St?O.copyTexSubImage3D(Fe,H,Le,ct,_t+li,Ie,Ke,de,Se):O.copyTexSubImage2D(Fe,H,Le,ct,_t+li,Ie,Ke,de,Se);Be.bindFramebuffer(O.READ_FRAMEBUFFER,null),Be.bindFramebuffer(O.DRAW_FRAMEBUFFER,null)}else St?E.isDataTexture||E.isData3DTexture?O.texSubImage3D(Fe,H,Le,ct,_t,de,Se,De,tn,ft,Mt.data):B.isCompressedArrayTexture?O.compressedTexSubImage3D(Fe,H,Le,ct,_t,de,Se,De,tn,Mt.data):O.texSubImage3D(Fe,H,Le,ct,_t,de,Se,De,tn,ft,Mt):E.isDataTexture?O.texSubImage2D(O.TEXTURE_2D,H,Le,ct,de,Se,tn,ft,Mt.data):E.isCompressedTexture?O.compressedTexSubImage2D(O.TEXTURE_2D,H,Le,ct,Mt.width,Mt.height,tn,Mt.data):O.texSubImage2D(O.TEXTURE_2D,H,Le,ct,de,Se,tn,ft,Mt);O.pixelStorei(O.UNPACK_ROW_LENGTH,Gn),O.pixelStorei(O.UNPACK_IMAGE_HEIGHT,pt),O.pixelStorei(O.UNPACK_SKIP_PIXELS,Sn),O.pixelStorei(O.UNPACK_SKIP_ROWS,Yi),O.pixelStorei(O.UNPACK_SKIP_IMAGES,ln),H===0&&B.generateMipmaps&&O.generateMipmap(Fe),Be.unbindTexture()},this.copyTextureToTexture3D=function(E,B,X=null,$=null,H=0){return E.isTexture!==!0&&(Or("WebGLRenderer: copyTextureToTexture3D function signature has changed."),X=arguments[0]||null,$=arguments[1]||null,E=arguments[2],B=arguments[3],H=arguments[4]||0),Or('WebGLRenderer: copyTextureToTexture3D function has been deprecated. Use "copyTextureToTexture" instead.'),this.copyTextureToTexture(E,B,X,$,H)},this.initRenderTarget=function(E){Ue.get(E).__webglFramebuffer===void 0&&R.setupRenderTarget(E)},this.initTexture=function(E){E.isCubeTexture?R.setTextureCube(E,0):E.isData3DTexture?R.setTexture3D(E,0):E.isDataArrayTexture||E.isCompressedArrayTexture?R.setTexture2DArray(E,0):R.setTexture2D(E,0),Be.unbindTexture()},this.resetState=function(){I=0,D=0,U=null,Be.reset(),yt.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Qn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorspace=ot._getDrawingBufferColorSpace(e),t.unpackColorSpace=ot._getUnpackColorSpace()}}class Mu extends Vt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new zn,this.environmentIntensity=1,this.environmentRotation=new zn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}}class Su extends Er{static get type(){return"PointsMaterial"}constructor(e){super(),this.isPointsMaterial=!0,this.color=new nt(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}const Zl=new Ct,e0=new su,wa=new es,Ta=new q;class Cv extends Vt{constructor(e=new bn,t=new Su){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}raycast(e,t){const n=this.geometry,r=this.matrixWorld,a=e.params.Points.threshold,s=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),wa.copy(n.boundingSphere),wa.applyMatrix4(r),wa.radius+=a,e.ray.intersectsSphere(wa)===!1)return;Zl.copy(r).invert(),e0.copy(e.ray).applyMatrix4(Zl);const o=a/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=n.index,h=n.attributes.position;if(c!==null){const f=Math.max(0,s.start),m=Math.min(c.count,s.start+s.count);for(let x=f,y=m;x<y;x++){const g=c.getX(x);Ta.fromBufferAttribute(h,g),Jl(Ta,g,l,r,e,t,this)}}else{const f=Math.max(0,s.start),m=Math.min(h.count,s.start+s.count);for(let x=f,y=m;x<y;x++)Ta.fromBufferAttribute(h,x),Jl(Ta,x,l,r,e,t,this)}}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const r=t[n[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let a=0,s=r.length;a<s;a++){const o=r[a].name||String(a);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=a}}}}}function Jl(i,e,t,n,r,a,s){const o=e0.distanceSqToPoint(i);if(o<t){const l=new q;e0.closestPointToPoint(i,l),l.applyMatrix4(n);const c=r.ray.origin.distanceTo(l);if(c<r.near||c>r.far)return;a.push({distance:c,distanceToRay:Math.sqrt(o),point:l,index:e,face:null,faceIndex:null,barycoord:null,object:s})}}class Dt extends bn{constructor(e=1,t=1,n=1,r=32,a=1,s=!1,o=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:r,heightSegments:a,openEnded:s,thetaStart:o,thetaLength:l};const c=this;r=Math.floor(r),a=Math.floor(a);const u=[],h=[],f=[],m=[];let x=0;const y=[],g=n/2;let p=0;A(),s===!1&&(e>0&&C(!0),t>0&&C(!1)),this.setIndex(u),this.setAttribute("position",new Xt(h,3)),this.setAttribute("normal",new Xt(f,3)),this.setAttribute("uv",new Xt(m,2));function A(){const S=new q,N=new q;let I=0;const D=(t-e)/n;for(let U=0;U<=a;U++){const T=[],w=U/a,F=w*(t-e)+e;for(let V=0;V<=r;V++){const G=V/r,K=G*l+o,J=Math.sin(K),j=Math.cos(K);N.x=F*J,N.y=-w*n+g,N.z=F*j,h.push(N.x,N.y,N.z),S.set(J,D,j).normalize(),f.push(S.x,S.y,S.z),m.push(G,1-w),T.push(x++)}y.push(T)}for(let U=0;U<r;U++)for(let T=0;T<a;T++){const w=y[T][U],F=y[T+1][U],V=y[T+1][U+1],G=y[T][U+1];(e>0||T!==0)&&(u.push(w,F,G),I+=3),(t>0||T!==a-1)&&(u.push(F,V,G),I+=3)}c.addGroup(p,I,0),p+=I}function C(S){const N=x,I=new ut,D=new q;let U=0;const T=S===!0?e:t,w=S===!0?1:-1;for(let V=1;V<=r;V++)h.push(0,g*w,0),f.push(0,w,0),m.push(.5,.5),x++;const F=x;for(let V=0;V<=r;V++){const K=V/r*l+o,J=Math.cos(K),j=Math.sin(K);D.x=T*j,D.y=g*w,D.z=T*J,h.push(D.x,D.y,D.z),f.push(0,w,0),I.x=J*.5+.5,I.y=j*.5*w+.5,m.push(I.x,I.y),x++}for(let V=0;V<r;V++){const G=N+V,K=F+V;S===!0?u.push(K,K+1,G):u.push(K+1,K,G),U+=3}c.addGroup(p,U,S===!0?1:2),p+=U}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Dt(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class Wa extends Dt{constructor(e=1,t=1,n=32,r=1,a=!1,s=0,o=Math.PI*2){super(0,e,t,n,r,a,s,o),this.type="ConeGeometry",this.parameters={radius:e,height:t,radialSegments:n,heightSegments:r,openEnded:a,thetaStart:s,thetaLength:o}}static fromJSON(e){return new Wa(e.radius,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class qr extends bn{constructor(e=1,t=32,n=16,r=0,a=Math.PI*2,s=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:r,phiLength:a,thetaStart:s,thetaLength:o},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));const l=Math.min(s+o,Math.PI);let c=0;const u=[],h=new q,f=new q,m=[],x=[],y=[],g=[];for(let p=0;p<=n;p++){const A=[],C=p/n;let S=0;p===0&&s===0?S=.5/t:p===n&&l===Math.PI&&(S=-.5/t);for(let N=0;N<=t;N++){const I=N/t;h.x=-e*Math.cos(r+I*a)*Math.sin(s+C*o),h.y=e*Math.cos(s+C*o),h.z=e*Math.sin(r+I*a)*Math.sin(s+C*o),x.push(h.x,h.y,h.z),f.copy(h).normalize(),y.push(f.x,f.y,f.z),g.push(I+S,1-C),A.push(c++)}u.push(A)}for(let p=0;p<n;p++)for(let A=0;A<t;A++){const C=u[p][A+1],S=u[p][A],N=u[p+1][A],I=u[p+1][A+1];(p!==0||s>0)&&m.push(C,S,I),(p!==n-1||l<Math.PI)&&m.push(S,N,I)}this.setIndex(m),this.setAttribute("position",new Xt(x,3)),this.setAttribute("normal",new Xt(y,3)),this.setAttribute("uv",new Xt(g,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new qr(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}}class qa extends bn{constructor(e=1,t=.4,n=12,r=48,a=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:e,tube:t,radialSegments:n,tubularSegments:r,arc:a},n=Math.floor(n),r=Math.floor(r);const s=[],o=[],l=[],c=[],u=new q,h=new q,f=new q;for(let m=0;m<=n;m++)for(let x=0;x<=r;x++){const y=x/r*a,g=m/n*Math.PI*2;h.x=(e+t*Math.cos(g))*Math.cos(y),h.y=(e+t*Math.cos(g))*Math.sin(y),h.z=t*Math.sin(g),o.push(h.x,h.y,h.z),u.x=e*Math.cos(y),u.y=e*Math.sin(y),f.subVectors(h,u).normalize(),l.push(f.x,f.y,f.z),c.push(x/r),c.push(m/n)}for(let m=1;m<=n;m++)for(let x=1;x<=r;x++){const y=(r+1)*m+x-1,g=(r+1)*(m-1)+x-1,p=(r+1)*(m-1)+x,A=(r+1)*m+x;s.push(y,g,A),s.push(g,p,A)}this.setIndex(s),this.setAttribute("position",new Xt(o,3)),this.setAttribute("normal",new Xt(l,3)),this.setAttribute("uv",new Xt(c,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new qa(e.radius,e.tube,e.radialSegments,e.tubularSegments,e.arc)}}class bt extends Er{static get type(){return"MeshStandardMaterial"}constructor(e){super(),this.isMeshStandardMaterial=!0,this.defines={STANDARD:""},this.color=new nt(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new nt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=tu,this.normalScale=new ut(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new zn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class Ql extends bt{static get type(){return"MeshPhysicalMaterial"}constructor(e){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new ut(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return Zt(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(t){this.ior=(1+.4*t)/(1-.4*t)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new nt(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new nt(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new nt(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._sheen=0,this._transmission=0,this.setValues(e)}get anisotropy(){return this._anisotropy}set anisotropy(e){this._anisotropy>0!=e>0&&this.version++,this._anisotropy=e}get clearcoat(){return this._clearcoat}set clearcoat(e){this._clearcoat>0!=e>0&&this.version++,this._clearcoat=e}get iridescence(){return this._iridescence}set iridescence(e){this._iridescence>0!=e>0&&this.version++,this._iridescence=e}get dispersion(){return this._dispersion}set dispersion(e){this._dispersion>0!=e>0&&this.version++,this._dispersion=e}get sheen(){return this._sheen}set sheen(e){this._sheen>0!=e>0&&this.version++,this._sheen=e}get transmission(){return this._transmission}set transmission(e){this._transmission>0!=e>0&&this.version++,this._transmission=e}copy(e){return super.copy(e),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=e.anisotropy,this.anisotropyRotation=e.anisotropyRotation,this.anisotropyMap=e.anisotropyMap,this.clearcoat=e.clearcoat,this.clearcoatMap=e.clearcoatMap,this.clearcoatRoughness=e.clearcoatRoughness,this.clearcoatRoughnessMap=e.clearcoatRoughnessMap,this.clearcoatNormalMap=e.clearcoatNormalMap,this.clearcoatNormalScale.copy(e.clearcoatNormalScale),this.dispersion=e.dispersion,this.ior=e.ior,this.iridescence=e.iridescence,this.iridescenceMap=e.iridescenceMap,this.iridescenceIOR=e.iridescenceIOR,this.iridescenceThicknessRange=[...e.iridescenceThicknessRange],this.iridescenceThicknessMap=e.iridescenceThicknessMap,this.sheen=e.sheen,this.sheenColor.copy(e.sheenColor),this.sheenColorMap=e.sheenColorMap,this.sheenRoughness=e.sheenRoughness,this.sheenRoughnessMap=e.sheenRoughnessMap,this.transmission=e.transmission,this.transmissionMap=e.transmissionMap,this.thickness=e.thickness,this.thicknessMap=e.thicknessMap,this.attenuationDistance=e.attenuationDistance,this.attenuationColor.copy(e.attenuationColor),this.specularIntensity=e.specularIntensity,this.specularIntensityMap=e.specularIntensityMap,this.specularColor.copy(e.specularColor),this.specularColorMap=e.specularColorMap,this}}class wu extends Vt{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new nt(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(t.object.target=this.target.uuid),t}}const Ys=new Ct,ec=new q,tc=new q;class Rv{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new ut(512,512),this.map=null,this.mapPass=null,this.matrix=new Ct,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new A0,this._frameExtents=new ut(1,1),this._viewportCount=1,this._viewports=[new It(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera,n=this.matrix;ec.setFromMatrixPosition(e.matrixWorld),t.position.copy(ec),tc.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(tc),t.updateMatrixWorld(),Ys.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Ys),n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(Ys)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}class Pv extends Rv{constructor(){super(new mu(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class Xa extends wu{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Vt.DEFAULT_UP),this.updateMatrix(),this.target=new Vt,this.shadow=new Pv}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}class Tu extends wu{constructor(e,t){super(e,t),this.isAmbientLight=!0,this.type="AmbientLight"}}class Dv{constructor(e=!0){this.autoStart=e,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=nc(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let e=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){const t=nc();e=(t-this.oldTime)/1e3,this.oldTime=t,this.elapsedTime+=e}return e}}function nc(){return performance.now()}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:_0}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=_0);class Iv{constructor(e){this.container=e,this.width=e.clientWidth||600,this.height=e.clientHeight||400,this.scene=new Mu,this.scene.background=new nt(856866),this.camera=new hn(45,this.width/this.height,.1,1e3),this.camera.position.set(12,9,16),this.renderer=new bu({antialias:!0,alpha:!0}),this.renderer.setSize(this.width,this.height),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2)),this.renderer.shadowMap.enabled=!0,this.container.appendChild(this.renderer.domElement),this.isDragging=!1,this.prevMouse={x:0,y:0},this.camTarget=new q(0,2,0),this.camera.lookAt(this.camTarget),this.initLights(),this.initEquipment(),this.initParticles(),this.setupInteraction(),this.onResize=()=>this.resize(),window.addEventListener("resize",this.onResize),this.clock=new Dv,this.animate()}initLights(){const e=new Tu(9741240,1.2);this.scene.add(e);const t=new Xa(16777215,2);t.position.set(15,20,10),t.castShadow=!0,this.scene.add(t);const n=new Xa(3718648,1.5);n.position.set(-10,10,-10),this.scene.add(n)}initEquipment(){this.equipmentGroup=new Nn,this.scene.add(this.equipmentGroup);const e=new an(20,.8,14),t=new bt({color:1976635,roughness:.8}),n=new Xe(e,t);n.position.y=-.4,this.equipmentGroup.add(n);const r=new Dt(2.5,2.5,9,32),a=new bt({color:3359061,metalness:.6,roughness:.3});this.tower=new Xe(r,a),this.tower.position.set(-5.5,4.5,0),this.equipmentGroup.add(this.tower);const s=new Dt(.2,.2,4,16),o=new Ql({color:3718648,transparent:!0,opacity:.6,roughness:.1,transmission:.9}),l=new Xe(s,o);l.position.set(-3,3,1.5),this.equipmentGroup.add(l);const c=new Dt(1.6,1.6,7,32),u=new Ql({color:4674921,metalness:.5,roughness:.2,transparent:!0,opacity:.75});this.exchanger=new Xe(c,u),this.exchanger.rotation.z=Math.PI/2,this.exchanger.position.set(2.5,2.5,0),this.equipmentGroup.add(this.exchanger),this.tubesGroup=new Nn;const h=new Dt(.12,.12,6.6,12);this.tubeMaterial=new bt({color:16096779,metalness:.8,roughness:.2,emissive:14251782,emissiveIntensity:.3});for(let ye=-.9;ye<=.9;ye+=.45)for(let ke=-.9;ke<=.9;ke+=.45)if(ye*ye+ke*ke<1){const qe=new Xe(h,this.tubeMaterial);qe.rotation.z=Math.PI/2,qe.position.set(2.5,2.5+ke,ye),this.tubesGroup.add(qe)}this.equipmentGroup.add(this.tubesGroup);const f=new an(.8,1.2,3.4),m=new bt({color:1976635}),x=new Xe(f,m);x.position.set(.5,.6,0);const y=new Xe(f,m);y.position.set(4.5,.6,0),this.equipmentGroup.add(x,y);const g=new bt({color:6583435,metalness:.7,roughness:.2}),p=new Xe(new Dt(.35,.35,3.2,16),g);p.rotation.z=Math.PI/2,p.position.set(-1.8,1.2,0),this.equipmentGroup.add(p);const A=new Xe(new Dt(.4,.4,3.2,16),g);A.rotation.z=Math.PI/2,A.position.set(-1.8,4,0),this.equipmentGroup.add(A);const C=new Xe(new Dt(.3,.3,4.5,16),g);C.position.set(2.5,6,0),this.equipmentGroup.add(C),this.valveGroup=new Nn,this.valveGroup.position.set(2.5,5.5,0);const S=new Dt(.5,.5,.8,16),N=new bt({color:165063,metalness:.6,roughness:.3}),I=new Xe(S,N);I.rotation.z=Math.PI/2,this.valveGroup.add(I);const D=new qr(.8,24,16,0,Math.PI*2,0,Math.PI/2),U=new bt({color:223649,metalness:.5,roughness:.3}),T=new Xe(D,U);T.position.set(0,1.4,0),this.valveGroup.add(T);const w=new Dt(.12,.12,1.2,8),F=new bt({color:988970,metalness:.8}),V=new Xe(w,F);V.position.set(-.3,.7,0);const G=new Xe(w,F);G.position.set(.3,.7,0),this.valveGroup.add(V,G),this.stemMesh=new Xe(new Dt(.06,.06,1.1,8),new bt({color:14870768,metalness:.9})),this.stemMesh.position.set(0,.7,0),this.valveGroup.add(this.stemMesh);const K=new an(.5,.6,.4),J=new bt({color:1096065,roughness:.4}),j=new Xe(K,J);j.position.set(.55,.7,0),this.valveGroup.add(j),this.feedbackArm=new Xe(new an(.35,.04,.04),new bt({color:16096779})),this.feedbackArm.position.set(.2,.7,0),this.valveGroup.add(this.feedbackArm),this.equipmentGroup.add(this.valveGroup);const te=new Nn;te.position.set(3.5,7.2,0);const Y=new Dt(.4,.4,.1,24),fe=new bt({color:16317180}),pe=new Xe(Y,fe);pe.rotation.x=Math.PI/2,te.add(pe),this.needle=new Xe(new an(.04,.32,.02),new Wr({color:15680580})),this.needle.position.set(0,.08,.06),te.add(this.needle),this.equipmentGroup.add(te)}initParticles(){this.particleCount=120;const e=new bn,t=new Float32Array(this.particleCount*3);this.particleVels=[];for(let r=0;r<this.particleCount;r++)t[r*3+0]=2.5+(Math.random()-.5)*1.8,t[r*3+1]=2.5+(Math.random()-.5)*1.8,t[r*3+2]=(Math.random()-.5)*5,this.particleVels.push({z:.02+Math.random()*.04,rot:Math.random()*Math.PI});e.setAttribute("position",new Dn(t,3));const n=new Su({color:3718648,size:.22,transparent:!0,opacity:.6,blending:ho});this.steamParticles=new Cv(e,n),this.equipmentGroup.add(this.steamParticles)}setupInteraction(){const e=this.renderer.domElement;e.style.cursor="grab",e.addEventListener("mousedown",t=>{this.isDragging=!0,this.prevMouse={x:t.clientX,y:t.clientY},e.style.cursor="grabbing"}),window.addEventListener("mouseup",()=>{this.isDragging=!1,e.style.cursor="grab"}),window.addEventListener("mousemove",t=>{if(!this.isDragging)return;const n=t.clientX-this.prevMouse.x,r=t.clientY-this.prevMouse.y;this.prevMouse={x:t.clientX,y:t.clientY};const a=.006,s=this.camera.position.x-this.camTarget.x,o=this.camera.position.z-this.camTarget.z,l=Math.sqrt(s*s+o*o);let c=Math.atan2(o,s)-n*a;this.camera.position.x=this.camTarget.x+l*Math.cos(c),this.camera.position.z=this.camTarget.z+l*Math.sin(c),this.camera.position.y=Math.max(2,Math.min(22,this.camera.position.y-r*.04)),this.camera.lookAt(this.camTarget)}),e.addEventListener("wheel",t=>{t.preventDefault();const n=t.deltaY*.01,r=this.camera.position.clone().sub(this.camTarget).normalize(),a=this.camera.position.distanceTo(this.camTarget),s=Math.max(8,Math.min(32,a+n));this.camera.position.copy(this.camTarget).add(r.multiplyScalar(s))},{passive:!1})}updateState(e){if(!e)return;const t=(e.casValvePos!==void 0?e.casValvePos:50)/100;this.stemMesh.position.y=.55+t*.25,this.feedbackArm.position.y=.55+t*.25;const n=(e.steamPressure!==void 0?e.steamPressure:100)/100;this.needle.rotation.z=(1-n)*1.5;const r=e.casPriPV||120,a=Math.max(0,Math.min(1,(r-80)/70)),s=new nt().lerpColors(new nt(440020),new nt(15680580),a);this.tubeMaterial.color.copy(s),this.tubeMaterial.emissive.copy(s),this.tubeMaterial.emissiveIntensity=.2+a*.4;const o=e.casSecPV||50,l=Math.max(.01,o/100*.08);this.currentFlowSpeed=l,this.steamParticles.material.opacity=Math.max(.2,o/100*.85)}animate(){if(requestAnimationFrame(()=>this.animate()),this.clock.getDelta(),this.steamParticles){const e=this.steamParticles.geometry.attributes.position.array,t=this.currentFlowSpeed||.03;for(let n=0;n<this.particleCount;n++)e[n*3+2]+=t,e[n*3+2]>2.5&&(e[n*3+2]=-2.5);this.steamParticles.geometry.attributes.position.needsUpdate=!0}this.renderer.render(this.scene,this.camera)}resize(){this.container&&(this.width=this.container.clientWidth,this.height=this.container.clientHeight,this.camera.aspect=this.width/this.height,this.camera.updateProjectionMatrix(),this.renderer.setSize(this.width,this.height))}destroy(){window.removeEventListener("resize",this.onResize),this.renderer.dispose()}}class Lv{constructor(e){this.container=e,this.width=e.clientWidth||500,this.height=e.clientHeight||400,this.scene=new Mu,this.scene.background=new nt(659229),this.camera=new hn(45,this.width/this.height,.1,100),this.camera.position.set(0,3.5,9.5),this.renderer=new bu({antialias:!0,alpha:!0}),this.renderer.setSize(this.width,this.height),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2)),this.renderer.shadowMap.enabled=!0,this.container.appendChild(this.renderer.domElement),this.camTarget=new q(0,2.5,0),this.camera.lookAt(this.camTarget),this.isDragging=!1,this.prevMouse={x:0,y:0},this.initLights(),this.initModel(),this.setupInteraction(),this.onResize=()=>this.resize(),window.addEventListener("resize",this.onResize),this.currentStroke=.5,this.targetStroke=.5,this.animate()}initLights(){this.scene.add(new Tu(13621468,1.4));const e=new Xa(16777215,2.2);e.position.set(10,15,12),e.castShadow=!0,this.scene.add(e);const t=new Xa(440020,1.2);t.position.set(-8,8,-6),this.scene.add(t)}initModel(){this.valveGroup=new Nn,this.scene.add(this.valveGroup);const e=new bt({color:165063,metalness:.6,roughness:.3,side:An}),t=new Xe(new qr(1.8,32,16,0,Math.PI,0,Math.PI/2),e);t.rotation.y=Math.PI/2,t.position.set(0,5.2,0),this.valveGroup.add(t);const n=new Xe(new qr(1.8,32,16,0,Math.PI,Math.PI/2,Math.PI/2),e);n.rotation.y=Math.PI/2,n.position.set(0,5.2,0),this.valveGroup.add(n);const r=new Dt(1.6,1.6,.1,32),a=new bt({color:3359061,roughness:.7});this.diaphragmDisc=new Xe(r,a),this.diaphragmDisc.position.set(0,5.2,0),this.valveGroup.add(this.diaphragmDisc);const s=new Nn,o=new bt({color:16096779,metalness:.8,roughness:.2}),l=5;for(let G=0;G<l;G++){const K=new Xe(new qa(.7,.08,12,24),o);K.rotation.x=Math.PI/2,K.position.y=4.2+G*.22,s.add(K)}this.springGroup=s,this.valveGroup.add(s);const c=new bt({color:1976635,metalness:.8}),u=new Xe(new Dt(.14,.14,2.2,12),c);u.position.set(-.8,3.2,0);const h=new Xe(new Dt(.14,.14,2.2,12),c);h.position.set(.8,3.2,0),this.valveGroup.add(u,h);const f=new Xe(new an(.2,1.4,.04),new bt({color:16777215,roughness:.2}));f.position.set(.85,3.2,.15),this.valveGroup.add(f),this.pointer=new Xe(new Wa(.08,.2,8),new Wr({color:15680580})),this.pointer.rotation.z=Math.PI/2,this.pointer.position.set(.7,3.2,.15),this.valveGroup.add(this.pointer);const m=new bt({color:15857145,metalness:.9,roughness:.1});this.stem=new Xe(new Dt(.1,.1,4,16),m),this.stem.position.set(0,3.2,0),this.valveGroup.add(this.stem);const x=new Dt(.4,.4,.6,16),y=new bt({color:6583435,metalness:.7}),g=new Xe(x,y);g.position.set(0,2,0),this.valveGroup.add(g);const p=new bt({color:1013358,metalness:.5,roughness:.4,side:An}),A=new Xe(new Dt(1.4,1.4,2,32,1,!1,0,Math.PI*1.5),p);A.position.set(0,1,0),this.valveGroup.add(A);const C=new bt({color:1138265,metalness:.6}),S=new Xe(new Dt(.6,.6,1.4,20),C);S.rotation.z=Math.PI/2,S.position.set(-1.8,.9,0);const N=new Xe(new Dt(.6,.6,1.4,20),C);N.rotation.z=Math.PI/2,N.position.set(1.8,.9,0),this.valveGroup.add(S,N);const I=new Xe(new qa(.5,.08,12,24),new bt({color:14870768,metalness:.9}));I.rotation.x=Math.PI/2,I.position.set(0,.8,0),this.valveGroup.add(I);const D=new Wa(.45,.6,24),U=new bt({color:14870768,metalness:.9,roughness:.1});this.plug=new Xe(D,U),this.plug.position.set(0,1.2,0),this.valveGroup.add(this.plug);const T=new an(.8,1,.6),w=new bt({color:366185,roughness:.3}),F=new Xe(T,w);F.position.set(-1.2,3.2,0),this.valveGroup.add(F);const V=new Xe(new an(.45,.25,.04),new Wr({color:1096065}));V.position.set(-1.2,3.4,.31),this.valveGroup.add(V),this.posArm=new Xe(new an(.7,.06,.06),new bt({color:16096779,metalness:.6})),this.posArm.position.set(-.5,3.2,0),this.valveGroup.add(this.posArm)}setupInteraction(){const e=this.renderer.domElement;e.style.cursor="grab",e.addEventListener("mousedown",t=>{this.isDragging=!0,this.prevMouse={x:t.clientX,y:t.clientY},e.style.cursor="grabbing"}),window.addEventListener("mouseup",()=>{this.isDragging=!1,e.style.cursor="grab"}),window.addEventListener("mousemove",t=>{if(!this.isDragging)return;const n=t.clientX-this.prevMouse.x,r=t.clientY-this.prevMouse.y;this.prevMouse={x:t.clientX,y:t.clientY};const a=.007,s=this.camera.position.x-this.camTarget.x,o=this.camera.position.z-this.camTarget.z,l=Math.sqrt(s*s+o*o);let c=Math.atan2(o,s)-n*a;this.camera.position.x=this.camTarget.x+l*Math.cos(c),this.camera.position.z=this.camTarget.z+l*Math.sin(c),this.camera.position.y=Math.max(1,Math.min(10,this.camera.position.y-r*.02)),this.camera.lookAt(this.camTarget)}),e.addEventListener("wheel",t=>{t.preventDefault();const n=t.deltaY*.008,r=this.camera.position.clone().sub(this.camTarget).normalize(),a=this.camera.position.distanceTo(this.camTarget),s=Math.max(4.5,Math.min(18,a+n));this.camera.position.copy(this.camTarget).add(r.multiplyScalar(s))},{passive:!1})}setStemPosition(e){this.targetStroke=Math.max(0,Math.min(100,e))/100}animate(){requestAnimationFrame(()=>this.animate()),this.currentStroke+=(this.targetStroke-this.currentStroke)*.15;const e=this.currentStroke,t=.85+e*.6;this.plug&&(this.plug.position.y=t),this.stem&&(this.stem.position.y=2.85+e*.6),this.diaphragmDisc&&(this.diaphragmDisc.position.y=4.85+e*.6),this.pointer&&(this.pointer.position.y=2.6+e*1.2),this.posArm&&(this.posArm.position.y=2.6+e*1.2),this.renderer.render(this.scene,this.camera)}resize(){this.container&&(this.width=this.container.clientWidth,this.height=this.container.clientHeight,this.camera.aspect=this.width/this.height,this.camera.updateProjectionMatrix(),this.renderer.setSize(this.width,this.height))}destroy(){window.removeEventListener("resize",this.onResize),this.renderer.dispose()}}class ic{constructor(e,t,n,r,a){this.container=e,this.pid=t,this.onModeChange=n,this.onSPChange=r,this.onCOChange=a,this.render()}render(){this.container.innerHTML=`
      <div class="faceplate-card" id="fp-${this.pid.tag}">
        <div class="fp-header">
          <div class="fp-tag">${this.pid.tag}</div>
          <div class="fp-desc">${this.pid.description}</div>
          <div class="fp-action-badge ${this.pid.action.toLowerCase()}">${this.pid.action}</div>
        </div>

        <div class="fp-meters">
          <!-- PV Meter -->
          <div class="fp-meter-col">
            <div class="meter-bar-track">
              <div class="meter-bar-fill pv-fill" id="fill-pv-${this.pid.tag}"></div>
              <div class="meter-sp-marker" id="marker-sp-${this.pid.tag}"></div>
            </div>
            <div class="meter-label">PV</div>
            <div class="meter-val" id="val-pv-${this.pid.tag}">0.0</div>
            <div class="meter-unit">${this.pid.units}</div>
          </div>

          <!-- SP Readout & Controls -->
          <div class="fp-center-controls">
            <div class="sp-box">
              <span class="sp-label">SETPOINT</span>
              <div class="sp-readout" id="val-sp-${this.pid.tag}">0.0</div>
              <div class="sp-buttons">
                <button class="sp-btn" data-delta="-5">-5</button>
                <button class="sp-btn" data-delta="-1">-1</button>
                <button class="sp-btn" data-delta="1">+1</button>
                <button class="sp-btn" data-delta="5">+5</button>
              </div>
            </div>

            <!-- Mode Selector -->
            <div class="mode-selector">
              <button class="mode-btn ${this.pid.mode==="MANUAL"?"active":""}" data-mode="MANUAL">MAN</button>
              <button class="mode-btn ${this.pid.mode==="AUTO"?"active":""}" data-mode="AUTO">AUTO</button>
              <button class="mode-btn ${this.pid.mode==="CASCADE"?"active":""}" data-mode="CASCADE">CAS</button>
            </div>

            <!-- RSP Link indicator -->
            <div class="rsp-indicator ${this.pid.mode==="CASCADE"?"active":""}" id="rsp-ind-${this.pid.tag}">
              <span class="led-dot"></span> RSP ACTIVE
            </div>
          </div>

          <!-- CO Meter -->
          <div class="fp-meter-col">
            <div class="meter-bar-track">
              <div class="meter-bar-fill co-fill" id="fill-co-${this.pid.tag}"></div>
            </div>
            <div class="meter-label">OUT</div>
            <div class="meter-val" id="val-co-${this.pid.tag}">0.0</div>
            <div class="meter-unit">%</div>
          </div>
        </div>

        <!-- Manual Output Slider (Active in MAN mode) -->
        <div class="manual-co-tray ${this.pid.mode==="MANUAL"?"visible":""}" id="man-tray-${this.pid.tag}">
          <label class="man-label">Manual Output (%):</label>
          <input type="range" class="man-slider" id="man-slider-${this.pid.tag}" min="0" max="100" step="0.5" value="${this.pid.co}">
          <span class="man-val-readout" id="man-readout-${this.pid.tag}">${this.pid.co.toFixed(1)}%</span>
        </div>
      </div>
    `,this.attachEvents()}attachEvents(){const e=this.container.querySelectorAll(".mode-btn");e.forEach(a=>{a.addEventListener("click",()=>{const s=a.dataset.mode;this.pid.setMode(s),e.forEach(c=>c.classList.remove("active")),a.classList.add("active");const o=this.container.querySelector(`#rsp-ind-${this.pid.tag}`);o&&(s==="CASCADE"?o.classList.add("active"):o.classList.remove("active"));const l=this.container.querySelector(`#man-tray-${this.pid.tag}`);l&&(s==="MANUAL"?l.classList.add("visible"):l.classList.remove("visible")),this.onModeChange&&this.onModeChange(s)})}),this.container.querySelectorAll(".sp-btn").forEach(a=>{a.addEventListener("click",()=>{if(this.pid.mode==="CASCADE")return;const s=parseFloat(a.dataset.delta);this.pid.sp=Math.max(this.pid.pvMin,Math.min(this.pid.pvMax,this.pid.sp+s)),this.onSPChange&&this.onSPChange(this.pid.sp)})});const n=this.container.querySelector(`#man-slider-${this.pid.tag}`),r=this.container.querySelector(`#man-readout-${this.pid.tag}`);n&&n.addEventListener("input",a=>{const s=parseFloat(a.target.value);this.pid.manualCO=s,this.pid.co=s,r&&(r.textContent=`${s.toFixed(1)}%`),this.onCOChange&&this.onCOChange(s)})}updateDisplay(){const e=this.pid.pv,t=this.pid.getActiveSetpoint(),n=this.pid.co,r=this.pid.pvMax-this.pid.pvMin||100,a=Math.max(0,Math.min(100,(e-this.pid.pvMin)/r*100)),s=Math.max(0,Math.min(100,(t-this.pid.pvMin)/r*100)),o=Math.max(0,Math.min(100,n)),l=this.container.querySelector(`#fill-pv-${this.pid.tag}`),c=this.container.querySelector(`#marker-sp-${this.pid.tag}`),u=this.container.querySelector(`#val-pv-${this.pid.tag}`),h=this.container.querySelector(`#val-sp-${this.pid.tag}`),f=this.container.querySelector(`#fill-co-${this.pid.tag}`),m=this.container.querySelector(`#val-co-${this.pid.tag}`);l&&(l.style.height=`${a}%`),c&&(c.style.bottom=`${s}%`),u&&(u.textContent=e.toFixed(1)),h&&(h.textContent=t.toFixed(1)),f&&(f.style.height=`${o}%`),m&&(m.textContent=n.toFixed(1))}}class oe extends Error{constructor(e,t){var n="KaTeX parse error: "+e,r,a,s=t&&t.loc;if(s&&s.start<=s.end){var o=s.lexer.input;r=s.start,a=s.end,r===o.length?n+=" at end of input: ":n+=" at position "+(r+1)+": ";var l=o.slice(r,a).replace(/[^]/g,"$&̲"),c;r>15?c="…"+o.slice(r-15,r):c=o.slice(0,r);var u;a+15<o.length?u=o.slice(a,a+15)+"…":u=o.slice(a),n+=c+l+u}super(n),this.name="ParseError",this.position=void 0,this.length=void 0,this.rawMessage=void 0,Object.setPrototypeOf(this,oe.prototype),this.position=r,r!=null&&a!=null&&(this.length=a-r),this.rawMessage=e}}var Fv=/([A-Z])/g,Uv=i=>i.replace(Fv,"-$1").toLowerCase(),Nv={"&":"&amp;",">":"&gt;","<":"&lt;",'"':"&quot;","'":"&#x27;"},kv=/[&><"']/g,$t=i=>String(i).replace(kv,e=>Nv[e]),Ba=i=>i.type==="ordgroup"||i.type==="color"?i.body.length===1?Ba(i.body[0]):i:i.type==="font"?Ba(i.body):i,zv=new Set(["mathord","textord","atom"]),ri=i=>zv.has(Ba(i).type),Ov=i=>{var e=/^[\x00-\x20]*([^\\/#?]*?)(:|&#0*58|&#x0*3a|&colon)/i.exec(i);return e?e[2]!==":"||!/^[a-zA-Z][a-zA-Z0-9+\-.]*$/.test(e[1])?null:e[1].toLowerCase():"_relative"},t0={displayMode:{type:"boolean",description:"Render math in display mode, which puts the math in display style (so \\int and \\sum are large, for example), and centers the math on the page on its own line.",cli:"-d, --display-mode"},output:{type:{enum:["htmlAndMathml","html","mathml"]},description:"Determines the markup language of the output.",cli:"-F, --format <type>"},leqno:{type:"boolean",description:"Render display math in leqno style (left-justified tags)."},fleqn:{type:"boolean",description:"Render display math flush left."},throwOnError:{type:"boolean",default:!0,cli:"-t, --no-throw-on-error",cliDescription:"Render errors (in the color given by --error-color) instead of throwing a ParseError exception when encountering an error."},errorColor:{type:"string",default:"#cc0000",cli:"-c, --error-color <color>",cliDescription:"A color string given in the format 'rgb' or 'rrggbb' (no #). This option determines the color of errors rendered by the -t option.",cliProcessor:i=>"#"+i},macros:{type:"object",cli:"-m, --macro <def>",cliDescription:"Define custom macro of the form '\\foo:expansion' (use multiple -m arguments for multiple macros).",cliDefault:[],cliProcessor:(i,e)=>(e.push(i),e)},minRuleThickness:{type:"number",description:"Specifies a minimum thickness, in ems, for fraction lines, `\\sqrt` top lines, `{array}` vertical lines, `\\hline`, `\\hdashline`, `\\underline`, `\\overline`, and the borders of `\\fbox`, `\\boxed`, and `\\fcolorbox`.",processor:i=>Math.max(0,i),cli:"--min-rule-thickness <size>",cliProcessor:parseFloat},colorIsTextColor:{type:"boolean",description:"Makes \\color behave like LaTeX's 2-argument \\textcolor, instead of LaTeX's one-argument \\color mode change.",cli:"-b, --color-is-text-color"},strict:{type:[{enum:["warn","ignore","error"]},"boolean","function"],description:"Turn on strict / LaTeX faithfulness mode, which throws an error if the input uses features that are not supported by LaTeX.",cli:"-S, --strict",cliDefault:!1},trust:{type:["boolean","function"],description:"Trust the input, enabling all HTML features such as \\url.",cli:"-T, --trust"},maxSize:{type:"number",default:1/0,description:"If non-zero, all user-specified sizes, e.g. in \\rule{500em}{500em}, will be capped to maxSize ems. Otherwise, elements and spaces can be arbitrarily large",processor:i=>Math.max(0,i),cli:"-s, --max-size <n>",cliProcessor:parseInt},maxExpand:{type:"number",default:1e3,description:"Limit the number of macro expansions to the specified number, to prevent e.g. infinite macro loops. If set to Infinity, the macro expander will try to fully expand as in LaTeX.",processor:i=>Math.max(0,i),cli:"-e, --max-expand <n>",cliProcessor:i=>i==="Infinity"?1/0:parseInt(i)},globalGroup:{type:"boolean",cli:!1}};function Bv(i){if(typeof i!="string")return i.enum[0];switch(i){case"boolean":return!1;case"string":return"";case"number":return 0;case"object":return{};default:throw new Error("Unexpected schema type; settings must declare an explicit default.")}}function Hv(i){if(i.default!==void 0)return i.default;var e=Array.isArray(i.type)?i.type[0]:i.type;return Bv(e)}function Vv(i,e,t,n){var r=t[e];i[e]=r!==void 0?n.processor?n.processor(r):r:Hv(n)}class R0{constructor(e){e===void 0&&(e={}),this.displayMode=void 0,this.output=void 0,this.leqno=void 0,this.fleqn=void 0,this.throwOnError=void 0,this.errorColor=void 0,this.macros=void 0,this.minRuleThickness=void 0,this.colorIsTextColor=void 0,this.strict=void 0,this.trust=void 0,this.maxSize=void 0,this.maxExpand=void 0,this.globalGroup=void 0,e=e||{};for(var t of Object.keys(t0)){var n=t0[t];n&&Vv(this,t,e,n)}}reportNonstrict(e,t,n){var r=this.strict;if(typeof r=="function"&&(r=r(e,t,n)),!(!r||r==="ignore")){if(r===!0||r==="error")throw new oe("LaTeX-incompatible input and strict mode is set to 'error': "+(t+" ["+e+"]"),n);r==="warn"?typeof console<"u"&&console.warn("LaTeX-incompatible input and strict mode is set to 'warn': "+(t+" ["+e+"]")):typeof console<"u"&&console.warn("LaTeX-incompatible input and strict mode is set to "+("unrecognized '"+r+"': "+t+" ["+e+"]"))}}useStrictBehavior(e,t,n){var r=this.strict;if(typeof r=="function")try{r=r(e,t,n)}catch{r="error"}return!r||r==="ignore"?!1:r===!0||r==="error"?!0:r==="warn"?(typeof console<"u"&&console.warn("LaTeX-incompatible input and strict mode is set to 'warn': "+(t+" ["+e+"]")),!1):(typeof console<"u"&&console.warn("LaTeX-incompatible input and strict mode is set to "+("unrecognized '"+r+"': "+t+" ["+e+"]")),!1)}isTrusted(e){if("url"in e&&e.url&&!e.protocol){var t=Ov(e.url);if(t==null)return!1;e.protocol=t}var n=typeof this.trust=="function"?this.trust(e):this.trust;return!!n}}class mi{constructor(e,t,n){this.id=void 0,this.size=void 0,this.cramped=void 0,this.id=e,this.size=t,this.cramped=n}sup(){return Fn[Gv[this.id]]}sub(){return Fn[Wv[this.id]]}fracNum(){return Fn[qv[this.id]]}fracDen(){return Fn[Xv[this.id]]}cramp(){return Fn[$v[this.id]]}text(){return Fn[Yv[this.id]]}isTight(){return this.size>=2}}var P0=0,$a=1,pr=2,ti=3,Xr=4,yn=5,br=6,Jt=7,Fn=[new mi(P0,0,!1),new mi($a,0,!0),new mi(pr,1,!1),new mi(ti,1,!0),new mi(Xr,2,!1),new mi(yn,2,!0),new mi(br,3,!1),new mi(Jt,3,!0)],Gv=[Xr,yn,Xr,yn,br,Jt,br,Jt],Wv=[yn,yn,yn,yn,Jt,Jt,Jt,Jt],qv=[pr,ti,Xr,yn,br,Jt,br,Jt],Xv=[ti,ti,yn,yn,Jt,Jt,Jt,Jt],$v=[$a,$a,ti,ti,yn,yn,Jt,Jt],Yv=[P0,$a,pr,ti,pr,ti,pr,ti],Ye={DISPLAY:Fn[P0],TEXT:Fn[pr],SCRIPT:Fn[Xr],SCRIPTSCRIPT:Fn[br]},n0=[{name:"latin",blocks:[[256,591],[768,879]]},{name:"cyrillic",blocks:[[1024,1279]]},{name:"armenian",blocks:[[1328,1423]]},{name:"brahmic",blocks:[[2304,4255]]},{name:"georgian",blocks:[[4256,4351]]},{name:"cjk",blocks:[[12288,12543],[19968,40879],[65280,65376]]},{name:"hangul",blocks:[[44032,55215]]}];function Kv(i){for(var e=0;e<n0.length;e++)for(var t=n0[e],n=0;n<t.blocks.length;n++){var r=t.blocks[n];if(i>=r[0]&&i<=r[1])return t.name}return null}var Ha=[];n0.forEach(i=>i.blocks.forEach(e=>Ha.push(...e)));function Eu(i){for(var e=0;e<Ha.length;e+=2)if(i>=Ha[e]&&i<=Ha[e+1])return!0;return!1}var kt=i=>i+" "+i,cr=80,jv=function(e,t){return"M95,"+(622+e+t)+`
c-2.7,0,-7.17,-2.7,-13.5,-8c-5.8,-5.3,-9.5,-10,-9.5,-14
c0,-2,0.3,-3.3,1,-4c1.3,-2.7,23.83,-20.7,67.5,-54
c44.2,-33.3,65.8,-50.3,66.5,-51c1.3,-1.3,3,-2,5,-2c4.7,0,8.7,3.3,12,10
s173,378,173,378c0.7,0,35.3,-71,104,-213c68.7,-142,137.5,-285,206.5,-429
c69,-144,104.5,-217.7,106.5,-221
l`+e/2.075+" -"+e+`
c5.3,-9.3,12,-14,20,-14
H400000v`+(40+e)+`H845.2724
s-225.272,467,-225.272,467s-235,486,-235,486c-2.7,4.7,-9,7,-19,7
c-6,0,-10,-1,-12,-3s-194,-422,-194,-422s-65,47,-65,47z
M`+(834+e)+" "+t+"h400000v"+(40+e)+"h-400000z"},Zv=function(e,t){return"M263,"+(601+e+t)+`c0.7,0,18,39.7,52,119
c34,79.3,68.167,158.7,102.5,238c34.3,79.3,51.8,119.3,52.5,120
c340,-704.7,510.7,-1060.3,512,-1067
l`+e/2.084+" -"+e+`
c4.7,-7.3,11,-11,19,-11
H40000v`+(40+e)+`H1012.3
s-271.3,567,-271.3,567c-38.7,80.7,-84,175,-136,283c-52,108,-89.167,185.3,-111.5,232
c-22.3,46.7,-33.8,70.3,-34.5,71c-4.7,4.7,-12.3,7,-23,7s-12,-1,-12,-1
s-109,-253,-109,-253c-72.7,-168,-109.3,-252,-110,-252c-10.7,8,-22,16.7,-34,26
c-22,17.3,-33.3,26,-34,26s-26,-26,-26,-26s76,-59,76,-59s76,-60,76,-60z
M`+(1001+e)+" "+t+"h400000v"+(40+e)+"h-400000z"},Jv=function(e,t){return"M983 "+(10+e+t)+`
l`+e/3.13+" -"+e+`
c4,-6.7,10,-10,18,-10 H400000v`+(40+e)+`
H1013.1s-83.4,268,-264.1,840c-180.7,572,-277,876.3,-289,913c-4.7,4.7,-12.7,7,-24,7
s-12,0,-12,0c-1.3,-3.3,-3.7,-11.7,-7,-25c-35.3,-125.3,-106.7,-373.3,-214,-744
c-10,12,-21,25,-33,39s-32,39,-32,39c-6,-5.3,-15,-14,-27,-26s25,-30,25,-30
c26.7,-32.7,52,-63,76,-91s52,-60,52,-60s208,722,208,722
c56,-175.3,126.3,-397.3,211,-666c84.7,-268.7,153.8,-488.2,207.5,-658.5
c53.7,-170.3,84.5,-266.8,92.5,-289.5z
M`+(1001+e)+" "+t+"h400000v"+(40+e)+"h-400000z"},Qv=function(e,t){return"M424,"+(2398+e+t)+`
c-1.3,-0.7,-38.5,-172,-111.5,-514c-73,-342,-109.8,-513.3,-110.5,-514
c0,-2,-10.7,14.3,-32,49c-4.7,7.3,-9.8,15.7,-15.5,25c-5.7,9.3,-9.8,16,-12.5,20
s-5,7,-5,7c-4,-3.3,-8.3,-7.7,-13,-13s-13,-13,-13,-13s76,-122,76,-122s77,-121,77,-121
s209,968,209,968c0,-2,84.7,-361.7,254,-1079c169.3,-717.3,254.7,-1077.7,256,-1081
l`+e/4.223+" -"+e+`c4,-6.7,10,-10,18,-10 H400000
v`+(40+e)+`H1014.6
s-87.3,378.7,-272.6,1166c-185.3,787.3,-279.3,1182.3,-282,1185
c-2,6,-10,9,-24,9
c-8,0,-12,-0.7,-12,-2z M`+(1001+e)+" "+t+`
h400000v`+(40+e)+"h-400000z"},eg=function(e,t){return"M473,"+(2713+e+t)+`
c339.3,-1799.3,509.3,-2700,510,-2702 l`+e/5.298+" -"+e+`
c3.3,-7.3,9.3,-11,18,-11 H400000v`+(40+e)+`H1017.7
s-90.5,478,-276.2,1466c-185.7,988,-279.5,1483,-281.5,1485c-2,6,-10,9,-24,9
c-8,0,-12,-0.7,-12,-2c0,-1.3,-5.3,-32,-16,-92c-50.7,-293.3,-119.7,-693.3,-207,-1200
c0,-1.3,-5.3,8.7,-16,30c-10.7,21.3,-21.3,42.7,-32,64s-16,33,-16,33s-26,-26,-26,-26
s76,-153,76,-153s77,-151,77,-151c0.7,0.7,35.7,202,105,604c67.3,400.7,102,602.7,104,
606zM`+(1001+e)+" "+t+"h400000v"+(40+e)+"H1017.7z"},tg=function(e){var t=e/2;return"M400000 "+e+" H0 L"+t+" 0 l65 45 L145 "+(e-80)+" H400000z"},ng=function(e,t,n){var r=n-54-t-e;return"M702 "+(e+t)+"H400000"+(40+e)+`
H742v`+r+`l-4 4-4 4c-.667.7 -2 1.5-4 2.5s-4.167 1.833-6.5 2.5-5.5 1-9.5 1
h-12l-28-84c-16.667-52-96.667 -294.333-240-727l-212 -643 -85 170
c-4-3.333-8.333-7.667-13 -13l-13-13l77-155 77-156c66 199.333 139 419.667
219 661 l218 661zM702 `+t+"H400000v"+(40+e)+"H742z"},ig=function(e,t,n){t=1e3*t;var r="";switch(e){case"sqrtMain":r=jv(t,cr);break;case"sqrtSize1":r=Zv(t,cr);break;case"sqrtSize2":r=Jv(t,cr);break;case"sqrtSize3":r=Qv(t,cr);break;case"sqrtSize4":r=eg(t,cr);break;case"sqrtTall":r=ng(t,cr,n)}return r},rg=function(e,t){switch(e){case"⎜":return kt("M291 0 H417 V"+t+" H291z");case"∣":return kt("M145 0 H188 V"+t+" H145z");case"∥":return kt("M145 0 H188 V"+t+" H145z")+kt("M367 0 H410 V"+t+" H367z");case"⎟":return kt("M457 0 H583 V"+t+" H457z");case"⎢":return kt("M319 0 H403 V"+t+" H319z");case"⎥":return kt("M263 0 H347 V"+t+" H263z");case"⎪":return kt("M384 0 H504 V"+t+" H384z");case"⏐":return kt("M312 0 H355 V"+t+" H312z");case"‖":return kt("M257 0 H300 V"+t+" H257z")+kt("M478 0 H521 V"+t+" H478z");default:return""}},rc={doubleleftarrow:`M262 157
l10-10c34-36 62.7-77 86-123 3.3-8 5-13.3 5-16 0-5.3-6.7-8-20-8-7.3
 0-12.2.5-14.5 1.5-2.3 1-4.8 4.5-7.5 10.5-49.3 97.3-121.7 169.3-217 216-28
 14-57.3 25-88 33-6.7 2-11 3.8-13 5.5-2 1.7-3 4.2-3 7.5s1 5.8 3 7.5
c2 1.7 6.3 3.5 13 5.5 68 17.3 128.2 47.8 180.5 91.5 52.3 43.7 93.8 96.2 124.5
 157.5 9.3 8 15.3 12.3 18 13h6c12-.7 18-4 18-10 0-2-1.7-7-5-15-23.3-46-52-87
-86-123l-10-10h399738v-40H218c328 0 0 0 0 0l-10-8c-26.7-20-65.7-43-117-69 2.7
-2 6-3.7 10-5 36.7-16 72.3-37.3 107-64l10-8h399782v-40z
m8 0v40h399730v-40zm0 194v40h399730v-40z`,doublerightarrow:`M399738 392l
-10 10c-34 36-62.7 77-86 123-3.3 8-5 13.3-5 16 0 5.3 6.7 8 20 8 7.3 0 12.2-.5
 14.5-1.5 2.3-1 4.8-4.5 7.5-10.5 49.3-97.3 121.7-169.3 217-216 28-14 57.3-25 88
-33 6.7-2 11-3.8 13-5.5 2-1.7 3-4.2 3-7.5s-1-5.8-3-7.5c-2-1.7-6.3-3.5-13-5.5-68
-17.3-128.2-47.8-180.5-91.5-52.3-43.7-93.8-96.2-124.5-157.5-9.3-8-15.3-12.3-18
-13h-6c-12 .7-18 4-18 10 0 2 1.7 7 5 15 23.3 46 52 87 86 123l10 10H0v40h399782
c-328 0 0 0 0 0l10 8c26.7 20 65.7 43 117 69-2.7 2-6 3.7-10 5-36.7 16-72.3 37.3
-107 64l-10 8H0v40zM0 157v40h399730v-40zm0 194v40h399730v-40z`,leftarrow:`M400000 241H110l3-3c68.7-52.7 113.7-120
 135-202 4-14.7 6-23 6-25 0-7.3-7-11-21-11-8 0-13.2.8-15.5 2.5-2.3 1.7-4.2 5.8
-5.5 12.5-1.3 4.7-2.7 10.3-4 17-12 48.7-34.8 92-68.5 130S65.3 228.3 18 247
c-10 4-16 7.7-18 11 0 8.7 6 14.3 18 17 47.3 18.7 87.8 47 121.5 85S196 441.3 208
 490c.7 2 1.3 5 2 9s1.2 6.7 1.5 8c.3 1.3 1 3.3 2 6s2.2 4.5 3.5 5.5c1.3 1 3.3
 1.8 6 2.5s6 1 10 1c14 0 21-3.7 21-11 0-2-2-10.3-6-25-20-79.3-65-146.7-135-202
 l-3-3h399890zM100 241v40h399900v-40z`,leftbrace:`M6 548l-6-6v-35l6-11c56-104 135.3-181.3 238-232 57.3-28.7 117
-45 179-50h399577v120H403c-43.3 7-81 15-113 26-100.7 33-179.7 91-237 174-2.7
 5-6 9-10 13-.7 1-7.3 1-20 1H6z`,leftbraceunder:`M0 6l6-6h17c12.688 0 19.313.3 20 1 4 4 7.313 8.3 10 13
 35.313 51.3 80.813 93.8 136.5 127.5 55.688 33.7 117.188 55.8 184.5 66.5.688
 0 2 .3 4 1 18.688 2.7 76 4.3 172 5h399450v120H429l-6-1c-124.688-8-235-61.7
-331-161C60.687 138.7 32.312 99.3 7 54L0 41V6z`,leftgroup:`M400000 80
H435C64 80 168.3 229.4 21 260c-5.9 1.2-18 0-18 0-2 0-3-1-3-3v-38C76 61 257 0
 435 0h399565z`,leftgroupunder:`M400000 262
H435C64 262 168.3 112.6 21 82c-5.9-1.2-18 0-18 0-2 0-3 1-3 3v38c76 158 257 219
 435 219h399565z`,leftharpoon:`M0 267c.7 5.3 3 10 7 14h399993v-40H93c3.3
-3.3 10.2-9.5 20.5-18.5s17.8-15.8 22.5-20.5c50.7-52 88-110.3 112-175 4-11.3 5
-18.3 3-21-1.3-4-7.3-6-18-6-8 0-13 .7-15 2s-4.7 6.7-8 16c-42 98.7-107.3 174.7
-196 228-6.7 4.7-10.7 8-12 10-1.3 2-2 5.7-2 11zm100-26v40h399900v-40z`,leftharpoonplus:`M0 267c.7 5.3 3 10 7 14h399993v-40H93c3.3-3.3 10.2-9.5
 20.5-18.5s17.8-15.8 22.5-20.5c50.7-52 88-110.3 112-175 4-11.3 5-18.3 3-21-1.3
-4-7.3-6-18-6-8 0-13 .7-15 2s-4.7 6.7-8 16c-42 98.7-107.3 174.7-196 228-6.7 4.7
-10.7 8-12 10-1.3 2-2 5.7-2 11zm100-26v40h399900v-40zM0 435v40h400000v-40z
m0 0v40h400000v-40z`,leftharpoondown:`M7 241c-4 4-6.333 8.667-7 14 0 5.333.667 9 2 11s5.333
 5.333 12 10c90.667 54 156 130 196 228 3.333 10.667 6.333 16.333 9 17 2 .667 5
 1 9 1h5c10.667 0 16.667-2 18-6 2-2.667 1-9.667-3-21-32-87.333-82.667-157.667
-152-211l-3-3h399907v-40zM93 281 H400000 v-40L7 241z`,leftharpoondownplus:`M7 435c-4 4-6.3 8.7-7 14 0 5.3.7 9 2 11s5.3 5.3 12
 10c90.7 54 156 130 196 228 3.3 10.7 6.3 16.3 9 17 2 .7 5 1 9 1h5c10.7 0 16.7
-2 18-6 2-2.7 1-9.7-3-21-32-87.3-82.7-157.7-152-211l-3-3h399907v-40H7zm93 0
v40h399900v-40zM0 241v40h399900v-40zm0 0v40h399900v-40z`,lefthook:`M400000 281 H103s-33-11.2-61-33.5S0 197.3 0 164s14.2-61.2 42.5
-83.5C70.8 58.2 104 47 142 47 c16.7 0 25 6.7 25 20 0 12-8.7 18.7-26 20-40 3.3
-68.7 15.7-86 37-10 12-15 25.3-15 40 0 22.7 9.8 40.7 29.5 54 19.7 13.3 43.5 21
 71.5 23h399859zM103 281v-40h399897v40z`,leftlinesegment:kt("M40 281 V428 H0 V94 H40 V241 H400000 v40z"),leftbracketunder:kt("M0 0 h120 V290 H399995 v120 H0z"),leftbracketover:kt("M0 440 h120 V150 H399995 v-120 H0z"),leftmapsto:kt("M40 281 V448H0V74H40V241H400000v40z"),leftToFrom:`M0 147h400000v40H0zm0 214c68 40 115.7 95.7 143 167h22c15.3 0 23
-.3 23-1 0-1.3-5.3-13.7-16-37-18-35.3-41.3-69-70-101l-7-8h399905v-40H95l7-8
c28.7-32 52-65.7 70-101 10.7-23.3 16-35.7 16-37 0-.7-7.7-1-23-1h-22C115.7 265.3
 68 321 0 361zm0-174v-40h399900v40zm100 154v40h399900v-40z`,longequal:kt("M0 50 h400000 v40H0z m0 194h40000v40H0z"),midbrace:`M200428 334
c-100.7-8.3-195.3-44-280-108-55.3-42-101.7-93-139-153l-9-14c-2.7 4-5.7 8.7-9 14
-53.3 86.7-123.7 153-211 199-66.7 36-137.3 56.3-212 62H0V214h199568c178.3-11.7
 311.7-78.3 403-201 6-8 9.7-12 11-12 .7-.7 6.7-1 18-1s17.3.3 18 1c1.3 0 5 4 11
 12 44.7 59.3 101.3 106.3 170 141s145.3 54.3 229 60h199572v120z`,midbraceunder:`M199572 214
c100.7 8.3 195.3 44 280 108 55.3 42 101.7 93 139 153l9 14c2.7-4 5.7-8.7 9-14
 53.3-86.7 123.7-153 211-199 66.7-36 137.3-56.3 212-62h199568v120H200432c-178.3
 11.7-311.7 78.3-403 201-6 8-9.7 12-11 12-.7.7-6.7 1-18 1s-17.3-.3-18-1c-1.3 0
-5-4-11-12-44.7-59.3-101.3-106.3-170-141s-145.3-54.3-229-60H0V214z`,oiintSize1:`M512.6 71.6c272.6 0 320.3 106.8 320.3 178.2 0 70.8-47.7 177.6
-320.3 177.6S193.1 320.6 193.1 249.8c0-71.4 46.9-178.2 319.5-178.2z
m368.1 178.2c0-86.4-60.9-215.4-368.1-215.4-306.4 0-367.3 129-367.3 215.4 0 85.8
60.9 214.8 367.3 214.8 307.2 0 368.1-129 368.1-214.8z`,oiintSize2:`M757.8 100.1c384.7 0 451.1 137.6 451.1 230 0 91.3-66.4 228.8
-451.1 228.8-386.3 0-452.7-137.5-452.7-228.8 0-92.4 66.4-230 452.7-230z
m502.4 230c0-111.2-82.4-277.2-502.4-277.2s-504 166-504 277.2
c0 110 84 276 504 276s502.4-166 502.4-276z`,oiiintSize1:`M681.4 71.6c408.9 0 480.5 106.8 480.5 178.2 0 70.8-71.6 177.6
-480.5 177.6S202.1 320.6 202.1 249.8c0-71.4 70.5-178.2 479.3-178.2z
m525.8 178.2c0-86.4-86.8-215.4-525.7-215.4-437.9 0-524.7 129-524.7 215.4 0
85.8 86.8 214.8 524.7 214.8 438.9 0 525.7-129 525.7-214.8z`,oiiintSize2:`M1021.2 53c603.6 0 707.8 165.8 707.8 277.2 0 110-104.2 275.8
-707.8 275.8-606 0-710.2-165.8-710.2-275.8C311 218.8 415.2 53 1021.2 53z
m770.4 277.1c0-131.2-126.4-327.6-770.5-327.6S248.4 198.9 248.4 330.1
c0 130 128.8 326.4 772.7 326.4s770.5-196.4 770.5-326.4z`,rightarrow:`M0 241v40h399891c-47.3 35.3-84 78-110 128
-16.7 32-27.7 63.7-33 95 0 1.3-.2 2.7-.5 4-.3 1.3-.5 2.3-.5 3 0 7.3 6.7 11 20
 11 8 0 13.2-.8 15.5-2.5 2.3-1.7 4.2-5.5 5.5-11.5 2-13.3 5.7-27 11-41 14.7-44.7
 39-84.5 73-119.5s73.7-60.2 119-75.5c6-2 9-5.7 9-11s-3-9-9-11c-45.3-15.3-85
-40.5-119-75.5s-58.3-74.8-73-119.5c-4.7-14-8.3-27.3-11-40-1.3-6.7-3.2-10.8-5.5
-12.5-2.3-1.7-7.5-2.5-15.5-2.5-14 0-21 3.7-21 11 0 2 2 10.3 6 25 20.7 83.3 67
 151.7 139 205zm0 0v40h399900v-40z`,rightbrace:`M400000 542l
-6 6h-17c-12.7 0-19.3-.3-20-1-4-4-7.3-8.3-10-13-35.3-51.3-80.8-93.8-136.5-127.5
s-117.2-55.8-184.5-66.5c-.7 0-2-.3-4-1-18.7-2.7-76-4.3-172-5H0V214h399571l6 1
c124.7 8 235 61.7 331 161 31.3 33.3 59.7 72.7 85 118l7 13v35z`,rightbraceunder:`M399994 0l6 6v35l-6 11c-56 104-135.3 181.3-238 232-57.3
 28.7-117 45-179 50H-300V214h399897c43.3-7 81-15 113-26 100.7-33 179.7-91 237
-174 2.7-5 6-9 10-13 .7-1 7.3-1 20-1h17z`,rightgroup:`M0 80h399565c371 0 266.7 149.4 414 180 5.9 1.2 18 0 18 0 2 0
 3-1 3-3v-38c-76-158-257-219-435-219H0z`,rightgroupunder:`M0 262h399565c371 0 266.7-149.4 414-180 5.9-1.2 18 0 18
 0 2 0 3 1 3 3v38c-76 158-257 219-435 219H0z`,rightharpoon:`M0 241v40h399993c4.7-4.7 7-9.3 7-14 0-9.3
-3.7-15.3-11-18-92.7-56.7-159-133.7-199-231-3.3-9.3-6-14.7-8-16-2-1.3-7-2-15-2
-10.7 0-16.7 2-18 6-2 2.7-1 9.7 3 21 15.3 42 36.7 81.8 64 119.5 27.3 37.7 58
 69.2 92 94.5zm0 0v40h399900v-40z`,rightharpoonplus:`M0 241v40h399993c4.7-4.7 7-9.3 7-14 0-9.3-3.7-15.3-11
-18-92.7-56.7-159-133.7-199-231-3.3-9.3-6-14.7-8-16-2-1.3-7-2-15-2-10.7 0-16.7
 2-18 6-2 2.7-1 9.7 3 21 15.3 42 36.7 81.8 64 119.5 27.3 37.7 58 69.2 92 94.5z
m0 0v40h399900v-40z m100 194v40h399900v-40zm0 0v40h399900v-40z`,rightharpoondown:`M399747 511c0 7.3 6.7 11 20 11 8 0 13-.8 15-2.5s4.7-6.8
 8-15.5c40-94 99.3-166.3 178-217 13.3-8 20.3-12.3 21-13 5.3-3.3 8.5-5.8 9.5
-7.5 1-1.7 1.5-5.2 1.5-10.5s-2.3-10.3-7-15H0v40h399908c-34 25.3-64.7 57-92 95
-27.3 38-48.7 77.7-64 119-3.3 8.7-5 14-5 16zM0 241v40h399900v-40z`,rightharpoondownplus:`M399747 705c0 7.3 6.7 11 20 11 8 0 13-.8
 15-2.5s4.7-6.8 8-15.5c40-94 99.3-166.3 178-217 13.3-8 20.3-12.3 21-13 5.3-3.3
 8.5-5.8 9.5-7.5 1-1.7 1.5-5.2 1.5-10.5s-2.3-10.3-7-15H0v40h399908c-34 25.3
-64.7 57-92 95-27.3 38-48.7 77.7-64 119-3.3 8.7-5 14-5 16zM0 435v40h399900v-40z
m0-194v40h400000v-40zm0 0v40h400000v-40z`,righthook:`M399859 241c-764 0 0 0 0 0 40-3.3 68.7-15.7 86-37 10-12 15-25.3
 15-40 0-22.7-9.8-40.7-29.5-54-19.7-13.3-43.5-21-71.5-23-17.3-1.3-26-8-26-20 0
-13.3 8.7-20 26-20 38 0 71 11.2 99 33.5 0 0 7 5.6 21 16.7 14 11.2 21 33.5 21
 66.8s-14 61.2-42 83.5c-28 22.3-61 33.5-99 33.5L0 241z M0 281v-40h399859v40z`,rightlinesegment:kt("M399960 241 V94 h40 V428 h-40 V281 H0 v-40z"),rightbracketunder:kt("M399995 0 h-120 V290 H0 v120 H400000z"),rightbracketover:kt("M399995 440 h-120 V150 H0 v-120 H399995z"),rightToFrom:`M400000 167c-70.7-42-118-97.7-142-167h-23c-15.3 0-23 .3-23
 1 0 1.3 5.3 13.7 16 37 18 35.3 41.3 69 70 101l7 8H0v40h399905l-7 8c-28.7 32
-52 65.7-70 101-10.7 23.3-16 35.7-16 37 0 .7 7.7 1 23 1h23c24-69.3 71.3-125 142
-167z M100 147v40h399900v-40zM0 341v40h399900v-40z`,twoheadleftarrow:`M0 167c68 40
 115.7 95.7 143 167h22c15.3 0 23-.3 23-1 0-1.3-5.3-13.7-16-37-18-35.3-41.3-69
-70-101l-7-8h125l9 7c50.7 39.3 85 86 103 140h46c0-4.7-6.3-18.7-19-42-18-35.3
-40-67.3-66-96l-9-9h399716v-40H284l9-9c26-28.7 48-60.7 66-96 12.7-23.333 19
-37.333 19-42h-46c-18 54-52.3 100.7-103 140l-9 7H95l7-8c28.7-32 52-65.7 70-101
 10.7-23.333 16-35.7 16-37 0-.7-7.7-1-23-1h-22C115.7 71.3 68 127 0 167z`,twoheadrightarrow:`M400000 167
c-68-40-115.7-95.7-143-167h-22c-15.3 0-23 .3-23 1 0 1.3 5.3 13.7 16 37 18 35.3
 41.3 69 70 101l7 8h-125l-9-7c-50.7-39.3-85-86-103-140h-46c0 4.7 6.3 18.7 19 42
 18 35.3 40 67.3 66 96l9 9H0v40h399716l-9 9c-26 28.7-48 60.7-66 96-12.7 23.333
-19 37.333-19 42h46c18-54 52.3-100.7 103-140l9-7h125l-7 8c-28.7 32-52 65.7-70
 101-10.7 23.333-16 35.7-16 37 0 .7 7.7 1 23 1h22c27.3-71.3 75-127 143-167z`,tilde1:`M200 55.538c-77 0-168 73.953-177 73.953-3 0-7
-2.175-9-5.437L2 97c-1-2-2-4-2-6 0-4 2-7 5-9l20-12C116 12 171 0 207 0c86 0
 114 68 191 68 78 0 168-68 177-68 4 0 7 2 9 5l12 19c1 2.175 2 4.35 2 6.525 0
 4.35-2 7.613-5 9.788l-19 13.05c-92 63.077-116.937 75.308-183 76.128
-68.267.847-113-73.952-191-73.952z`,tilde2:`M344 55.266c-142 0-300.638 81.316-311.5 86.418
-8.01 3.762-22.5 10.91-23.5 5.562L1 120c-1-2-1-3-1-4 0-5 3-9 8-10l18.4-9C160.9
 31.9 283 0 358 0c148 0 188 122 331 122s314-97 326-97c4 0 8 2 10 7l7 21.114
c1 2.14 1 3.21 1 4.28 0 5.347-3 9.626-7 10.696l-22.3 12.622C852.6 158.372 751
 181.476 676 181.476c-149 0-189-126.21-332-126.21z`,tilde3:`M786 59C457 59 32 175.242 13 175.242c-6 0-10-3.457
-11-10.37L.15 138c-1-7 3-12 10-13l19.2-6.4C378.4 40.7 634.3 0 804.3 0c337 0
 411.8 157 746.8 157 328 0 754-112 773-112 5 0 10 3 11 9l1 14.075c1 8.066-.697
 16.595-6.697 17.492l-21.052 7.31c-367.9 98.146-609.15 122.696-778.15 122.696
 -338 0-409-156.573-744-156.573z`,tilde4:`M786 58C457 58 32 177.487 13 177.487c-6 0-10-3.345
-11-10.035L.15 143c-1-7 3-12 10-13l22-6.7C381.2 35 637.15 0 807.15 0c337 0 409
 177 744 177 328 0 754-127 773-127 5 0 10 3 11 9l1 14.794c1 7.805-3 13.38-9
 14.495l-20.7 5.574c-366.85 99.79-607.3 139.372-776.3 139.372-338 0-409
 -175.236-744-175.236z`,vec:`M377 20c0-5.333 1.833-10 5.5-14S391 0 397 0c4.667 0 8.667 1.667 12 5
3.333 2.667 6.667 9 10 19 6.667 24.667 20.333 43.667 41 57 7.333 4.667 11
10.667 11 18 0 6-1 10-3 12s-6.667 5-14 9c-28.667 14.667-53.667 35.667-75 63
-1.333 1.333-3.167 3.5-5.5 6.5s-4 4.833-5 5.5c-1 .667-2.5 1.333-4.5 2s-4.333 1
-7 1c-4.667 0-9.167-1.833-13.5-5.5S337 184 337 178c0-12.667 15.667-32.333 47-59
H213l-171-1c-8.667-6-13-12.333-13-19 0-4.667 4.333-11.333 13-20h359
c-16-25.333-24-45-24-59z`,widehat1:`M529 0h5l519 115c5 1 9 5 9 10 0 1-1 2-1 3l-4 22
c-1 5-5 9-11 9h-2L532 67 19 159h-2c-5 0-9-4-11-9l-5-22c-1-6 2-12 8-13z`,widehat2:`M1181 0h2l1171 176c6 0 10 5 10 11l-2 23c-1 6-5 10
-11 10h-1L1182 67 15 220h-1c-6 0-10-4-11-10l-2-23c-1-6 4-11 10-11z`,widehat3:`M1181 0h2l1171 236c6 0 10 5 10 11l-2 23c-1 6-5 10
-11 10h-1L1182 67 15 280h-1c-6 0-10-4-11-10l-2-23c-1-6 4-11 10-11z`,widehat4:`M1181 0h2l1171 296c6 0 10 5 10 11l-2 23c-1 6-5 10
-11 10h-1L1182 67 15 340h-1c-6 0-10-4-11-10l-2-23c-1-6 4-11 10-11z`,widecheck1:`M529,159h5l519,-115c5,-1,9,-5,9,-10c0,-1,-1,-2,-1,-3l-4,-22c-1,
-5,-5,-9,-11,-9h-2l-512,92l-513,-92h-2c-5,0,-9,4,-11,9l-5,22c-1,6,2,12,8,13z`,widecheck2:`M1181,220h2l1171,-176c6,0,10,-5,10,-11l-2,-23c-1,-6,-5,-10,
-11,-10h-1l-1168,153l-1167,-153h-1c-6,0,-10,4,-11,10l-2,23c-1,6,4,11,10,11z`,widecheck3:`M1181,280h2l1171,-236c6,0,10,-5,10,-11l-2,-23c-1,-6,-5,-10,
-11,-10h-1l-1168,213l-1167,-213h-1c-6,0,-10,4,-11,10l-2,23c-1,6,4,11,10,11z`,widecheck4:`M1181,340h2l1171,-296c6,0,10,-5,10,-11l-2,-23c-1,-6,-5,-10,
-11,-10h-1l-1168,273l-1167,-273h-1c-6,0,-10,4,-11,10l-2,23c-1,6,4,11,10,11z`,baraboveleftarrow:`M400000 620h-399890l3 -3c68.7 -52.7 113.7 -120 135 -202
c4 -14.7 6 -23 6 -25c0 -7.3 -7 -11 -21 -11c-8 0 -13.2 0.8 -15.5 2.5
c-2.3 1.7 -4.2 5.8 -5.5 12.5c-1.3 4.7 -2.7 10.3 -4 17c-12 48.7 -34.8 92 -68.5 130
s-74.2 66.3 -121.5 85c-10 4 -16 7.7 -18 11c0 8.7 6 14.3 18 17c47.3 18.7 87.8 47
121.5 85s56.5 81.3 68.5 130c0.7 2 1.3 5 2 9s1.2 6.7 1.5 8c0.3 1.3 1 3.3 2 6
s2.2 4.5 3.5 5.5c1.3 1 3.3 1.8 6 2.5s6 1 10 1c14 0 21 -3.7 21 -11
c0 -2 -2 -10.3 -6 -25c-20 -79.3 -65 -146.7 -135 -202l-3 -3h399890z
M100 620v40h399900v-40z M0 241v40h399900v-40zM0 241v40h399900v-40z`,rightarrowabovebar:`M0 241v40h399891c-47.3 35.3-84 78-110 128-16.7 32
-27.7 63.7-33 95 0 1.3-.2 2.7-.5 4-.3 1.3-.5 2.3-.5 3 0 7.3 6.7 11 20 11 8 0
13.2-.8 15.5-2.5 2.3-1.7 4.2-5.5 5.5-11.5 2-13.3 5.7-27 11-41 14.7-44.7 39
-84.5 73-119.5s73.7-60.2 119-75.5c6-2 9-5.7 9-11s-3-9-9-11c-45.3-15.3-85-40.5
-119-75.5s-58.3-74.8-73-119.5c-4.7-14-8.3-27.3-11-40-1.3-6.7-3.2-10.8-5.5
-12.5-2.3-1.7-7.5-2.5-15.5-2.5-14 0-21 3.7-21 11 0 2 2 10.3 6 25 20.7 83.3 67
151.7 139 205zm96 379h399894v40H0zm0 0h399904v40H0z`,baraboveshortleftharpoon:`M507,435c-4,4,-6.3,8.7,-7,14c0,5.3,0.7,9,2,11
c1.3,2,5.3,5.3,12,10c90.7,54,156,130,196,228c3.3,10.7,6.3,16.3,9,17
c2,0.7,5,1,9,1c0,0,5,0,5,0c10.7,0,16.7,-2,18,-6c2,-2.7,1,-9.7,-3,-21
c-32,-87.3,-82.7,-157.7,-152,-211c0,0,-3,-3,-3,-3l399351,0l0,-40
c-398570,0,-399437,0,-399437,0z M593 435 v40 H399500 v-40z
M0 281 v-40 H399908 v40z M0 281 v-40 H399908 v40z`,rightharpoonaboveshortbar:`M0,241 l0,40c399126,0,399993,0,399993,0
c4.7,-4.7,7,-9.3,7,-14c0,-9.3,-3.7,-15.3,-11,-18c-92.7,-56.7,-159,-133.7,-199,
-231c-3.3,-9.3,-6,-14.7,-8,-16c-2,-1.3,-7,-2,-15,-2c-10.7,0,-16.7,2,-18,6
c-2,2.7,-1,9.7,3,21c15.3,42,36.7,81.8,64,119.5c27.3,37.7,58,69.2,92,94.5z
M0 241 v40 H399908 v-40z M0 475 v-40 H399500 v40z M0 475 v-40 H399500 v40z`,shortbaraboveleftharpoon:`M7,435c-4,4,-6.3,8.7,-7,14c0,5.3,0.7,9,2,11
c1.3,2,5.3,5.3,12,10c90.7,54,156,130,196,228c3.3,10.7,6.3,16.3,9,17c2,0.7,5,1,9,
1c0,0,5,0,5,0c10.7,0,16.7,-2,18,-6c2,-2.7,1,-9.7,-3,-21c-32,-87.3,-82.7,-157.7,
-152,-211c0,0,-3,-3,-3,-3l399907,0l0,-40c-399126,0,-399993,0,-399993,0z
M93 435 v40 H400000 v-40z M500 241 v40 H400000 v-40z M500 241 v40 H400000 v-40z`,shortrightharpoonabovebar:`M53,241l0,40c398570,0,399437,0,399437,0
c4.7,-4.7,7,-9.3,7,-14c0,-9.3,-3.7,-15.3,-11,-18c-92.7,-56.7,-159,-133.7,-199,
-231c-3.3,-9.3,-6,-14.7,-8,-16c-2,-1.3,-7,-2,-15,-2c-10.7,0,-16.7,2,-18,6
c-2,2.7,-1,9.7,3,21c15.3,42,36.7,81.8,64,119.5c27.3,37.7,58,69.2,92,94.5z
M500 241 v40 H399408 v-40z M500 435 v40 H400000 v-40z`},ag=function(e,t){switch(e){case"lbrack":return"M403 1759 V84 H666 V0 H319 V1759 v"+t+` v1759 v84 h347 v-84
H403z M403 1759 V0 H319 V1759 v`+t+" v1759 v84 h84z";case"rbrack":return"M347 1759 V0 H0 V84 H263 V1759 v"+t+` v1759 H0 v84 H347z
M347 1759 V0 H263 V1759 v`+t+" v1759 h84z";case"vert":return"M145 15 v585 v"+t+` v585 c2.667,10,9.667,15,21,15
c10,0,16.667,-5,20,-15 v-585 v`+-t+` v-585 c-2.667,-10,-9.667,-15,-21,-15
c-10,0,-16.667,5,-20,15z M188 15 H145 v585 v`+t+" v585 h43z";case"doublevert":return"M145 15 v585 v"+t+` v585 c2.667,10,9.667,15,21,15
c10,0,16.667,-5,20,-15 v-585 v`+-t+` v-585 c-2.667,-10,-9.667,-15,-21,-15
c-10,0,-16.667,5,-20,15z M188 15 H145 v585 v`+t+` v585 h43z
M367 15 v585 v`+t+` v585 c2.667,10,9.667,15,21,15
c10,0,16.667,-5,20,-15 v-585 v`+-t+` v-585 c-2.667,-10,-9.667,-15,-21,-15
c-10,0,-16.667,5,-20,15z M410 15 H367 v585 v`+t+" v585 h43z";case"lfloor":return"M319 602 V0 H403 V602 v"+t+` v1715 h263 v84 H319z
MM319 602 V0 H403 V602 v`+t+" v1715 H319z";case"rfloor":return"M319 602 V0 H403 V602 v"+t+` v1799 H0 v-84 H319z
MM319 602 V0 H403 V602 v`+t+" v1715 H319z";case"lceil":return"M403 1759 V84 H666 V0 H319 V1759 v"+t+` v602 h84z
M403 1759 V0 H319 V1759 v`+t+" v602 h84z";case"rceil":return"M347 1759 V0 H0 V84 H263 V1759 v"+t+` v602 h84z
M347 1759 V0 h-84 V1759 v`+t+" v602 h84z";case"lparen":return`M863,9c0,-2,-2,-5,-6,-9c0,0,-17,0,-17,0c-12.7,0,-19.3,0.3,-20,1
c-5.3,5.3,-10.3,11,-15,17c-242.7,294.7,-395.3,682,-458,1162c-21.3,163.3,-33.3,349,
-36,557 l0,`+(t+84)+`c0.2,6,0,26,0,60c2,159.3,10,310.7,24,454c53.3,528,210,
949.7,470,1265c4.7,6,9.7,11.7,15,17c0.7,0.7,7,1,19,1c0,0,18,0,18,0c4,-4,6,-7,6,-9
c0,-2.7,-3.3,-8.7,-10,-18c-135.3,-192.7,-235.5,-414.3,-300.5,-665c-65,-250.7,-102.5,
-544.7,-112.5,-882c-2,-104,-3,-167,-3,-189
l0,-`+(t+92)+`c0,-162.7,5.7,-314,17,-454c20.7,-272,63.7,-513,129,-723c65.3,
-210,155.3,-396.3,270,-559c6.7,-9.3,10,-15.3,10,-18z`;case"rparen":return`M76,0c-16.7,0,-25,3,-25,9c0,2,2,6.3,6,13c21.3,28.7,42.3,60.3,
63,95c96.7,156.7,172.8,332.5,228.5,527.5c55.7,195,92.8,416.5,111.5,664.5
c11.3,139.3,17,290.7,17,454c0,28,1.7,43,3.3,45l0,`+(t+9)+`
c-3,4,-3.3,16.7,-3.3,38c0,162,-5.7,313.7,-17,455c-18.7,248,-55.8,469.3,-111.5,664
c-55.7,194.7,-131.8,370.3,-228.5,527c-20.7,34.7,-41.7,66.3,-63,95c-2,3.3,-4,7,-6,11
c0,7.3,5.7,11,17,11c0,0,11,0,11,0c9.3,0,14.3,-0.3,15,-1c5.3,-5.3,10.3,-11,15,-17
c242.7,-294.7,395.3,-681.7,458,-1161c21.3,-164.7,33.3,-350.7,36,-558
l0,-`+(t+144)+`c-2,-159.3,-10,-310.7,-24,-454c-53.3,-528,-210,-949.7,
-470,-1265c-4.7,-6,-9.7,-11.7,-15,-17c-0.7,-0.7,-6.7,-1,-18,-1z`;default:throw new Error("Unknown stretchy delimiter.")}};function sg(i){return"toText"in i}class Cr{constructor(e){this.children=void 0,this.classes=void 0,this.height=void 0,this.depth=void 0,this.maxFontSize=void 0,this.style=void 0,this.children=e,this.classes=[],this.height=0,this.depth=0,this.maxFontSize=0,this.style={}}hasClass(e){return this.classes.includes(e)}toNode(){for(var e=document.createDocumentFragment(),t=0;t<this.children.length;t++)e.appendChild(this.children[t].toNode());return e}toMarkup(){for(var e="",t=0;t<this.children.length;t++)e+=this.children[t].toMarkup();return e}toText(){return this.children.map(e=>{if(sg(e))return e.toText();throw new Error("Expected MathDomNode with toText, got "+e.constructor.name)}).join("")}}var i0={pt:1,mm:7227/2540,cm:7227/254,in:72.27,bp:803/800,pc:12,dd:1238/1157,cc:14856/1157,nd:685/642,nc:1370/107,sp:1/65536,px:803/800},og={ex:!0,em:!0,mu:!0},Au=function(e){return typeof e!="string"&&(e=e.unit),e in i0||e in og||e==="ex"},At=function(e,t){var n;if(e.unit in i0)n=i0[e.unit]/t.fontMetrics().ptPerEm/t.sizeMultiplier;else if(e.unit==="mu")n=t.fontMetrics().cssEmPerMu;else{var r;if(t.style.isTight()?r=t.havingStyle(t.style.text()):r=t,e.unit==="ex")n=r.fontMetrics().xHeight;else if(e.unit==="em")n=r.fontMetrics().quad;else throw new oe("Invalid unit: '"+e.unit+"'");r!==t&&(n*=r.sizeMultiplier/t.sizeMultiplier)}return Math.min(e.number*n,t.maxSize)},ue=function(e){return+e.toFixed(4)+"em"},wi=function(e){return e.filter(t=>t).join(" ")},D0=function(e){var t="";for(var n of Object.keys(e)){var r=e[n];r!==void 0&&(t+=Uv(n)+":"+r+";")}return t},Cu=function(e,t,n){if(this.classes=e||[],this.attributes={},this.height=0,this.depth=0,this.maxFontSize=0,this.style=n||{},t){t.style.isTight()&&this.classes.push("mtight");var r=t.getColor();r&&(this.style.color=r)}},Ru=function(e){var t=document.createElement(e);t.className=wi(this.classes),Object.assign(t.style,this.style);for(var n of Object.keys(this.attributes))t.setAttribute(n,this.attributes[n]);for(var r=0;r<this.children.length;r++)t.appendChild(this.children[r].toNode());return t},lg=/[\s"'>/=\x00-\x1f]/,Pu=function(e){var t="<"+e;this.classes.length&&(t+=' class="'+$t(wi(this.classes))+'"');var n=D0(this.style);n&&(t+=' style="'+$t(n)+'"');for(var r of Object.keys(this.attributes)){if(lg.test(r))throw new oe("Invalid attribute name '"+r+"'");t+=" "+r+'="'+$t(this.attributes[r])+'"'}t+=">";for(var a=0;a<this.children.length;a++)t+=this.children[a].toMarkup();return t+="</"+e+">",t};class Rr{constructor(e,t,n,r){this.children=void 0,this.attributes=void 0,this.classes=void 0,this.height=void 0,this.depth=void 0,this.width=void 0,this.maxFontSize=void 0,this.style=void 0,this.italic=void 0,Cu.call(this,e,n,r),this.children=t||[]}setAttribute(e,t){this.attributes[e]=t}hasClass(e){return this.classes.includes(e)}toNode(){return Ru.call(this,"span")}toMarkup(){return Pu.call(this,"span")}}class is{constructor(e,t,n,r){this.children=void 0,this.attributes=void 0,this.classes=void 0,this.height=void 0,this.depth=void 0,this.maxFontSize=void 0,this.style=void 0,Cu.call(this,t,r),this.children=n||[],this.setAttribute("href",e)}setAttribute(e,t){this.attributes[e]=t}hasClass(e){return this.classes.includes(e)}toNode(){return Ru.call(this,"a")}toMarkup(){return Pu.call(this,"a")}}class cg{constructor(e,t,n){this.src=void 0,this.alt=void 0,this.classes=void 0,this.height=void 0,this.depth=void 0,this.maxFontSize=void 0,this.style=void 0,this.alt=t,this.src=e,this.classes=["mord"],this.height=0,this.depth=0,this.maxFontSize=0,this.style=n}hasClass(e){return this.classes.includes(e)}toNode(){var e=document.createElement("img");return e.src=this.src,e.alt=this.alt,e.className="mord",Object.assign(e.style,this.style),e}toMarkup(){var e='<img src="'+$t(this.src)+'"'+(' alt="'+$t(this.alt)+'"'),t=D0(this.style);return t&&(e+=' style="'+$t(t)+'"'),e+="'/>",e}}var ug={î:"ı̂",ï:"ı̈",í:"ı́",ì:"ı̀"};class fn{constructor(e,t,n,r,a,s,o,l){this.text=void 0,this.height=void 0,this.depth=void 0,this.italic=void 0,this.skew=void 0,this.width=void 0,this.maxFontSize=void 0,this.classes=void 0,this.style=void 0,this.text=e,this.height=t||0,this.depth=n||0,this.italic=r||0,this.skew=a||0,this.width=s||0,this.classes=o||[],this.style=l||{},this.maxFontSize=0;var c=Kv(this.text.charCodeAt(0));c&&this.classes.push(c+"_fallback"),/[îïíì]/.test(this.text)&&(this.text=ug[this.text])}hasClass(e){return this.classes.includes(e)}toNode(){var e=document.createTextNode(this.text),t=null;return this.italic>0&&(t=document.createElement("span"),t.style.marginRight=ue(this.italic)),this.classes.length>0&&(t=t||document.createElement("span"),t.className=wi(this.classes)),Object.keys(this.style).length>0&&(t=t||document.createElement("span"),Object.assign(t.style,this.style)),t?(t.appendChild(e),t):e}toMarkup(){var e=!1,t="<span";this.classes.length&&(e=!0,t+=' class="',t+=$t(wi(this.classes)),t+='"');var n="";this.italic>0&&(n+="margin-right:"+ue(this.italic)+";"),n+=D0(this.style),n&&(e=!0,t+=' style="'+$t(n)+'"');var r=$t(this.text);return e?(t+=">",t+=r,t+="</span>",t):r}}class ii{constructor(e,t){this.children=void 0,this.attributes=void 0,this.children=e||[],this.attributes=t||{}}toNode(){var e="http://www.w3.org/2000/svg",t=document.createElementNS(e,"svg");for(var n of Object.keys(this.attributes))t.setAttribute(n,this.attributes[n]);for(var r=0;r<this.children.length;r++)t.appendChild(this.children[r].toNode());return t}toMarkup(){var e='<svg xmlns="http://www.w3.org/2000/svg"';for(var t of Object.keys(this.attributes))e+=" "+t+'="'+$t(this.attributes[t])+'"';e+=">";for(var n=0;n<this.children.length;n++)e+=this.children[n].toMarkup();return e+="</svg>",e}}class Ti{constructor(e,t){this.pathName=void 0,this.alternate=void 0,this.pathName=e,this.alternate=t}toNode(){var e="http://www.w3.org/2000/svg",t=document.createElementNS(e,"path");return this.alternate?t.setAttribute("d",this.alternate):t.setAttribute("d",rc[this.pathName]),t}toMarkup(){return this.alternate?'<path d="'+$t(this.alternate)+'"/>':'<path d="'+$t(rc[this.pathName])+'"/>'}}class r0{constructor(e){this.attributes=void 0,this.attributes=e||{}}toNode(){var e="http://www.w3.org/2000/svg",t=document.createElementNS(e,"line");for(var n of Object.keys(this.attributes))t.setAttribute(n,this.attributes[n]);return t}toMarkup(){var e="<line";for(var t of Object.keys(this.attributes))e+=" "+t+'="'+$t(this.attributes[t])+'"';return e+="/>",e}}function hg(i){if(i instanceof fn)return i;throw new Error("Expected symbolNode but got "+String(i)+".")}function dg(i){if(i instanceof Rr)return i;throw new Error("Expected span<HtmlDomNode> but got "+String(i)+".")}var fg=i=>i instanceof Rr||i instanceof is||i instanceof Cr,kn={"AMS-Regular":{32:[0,0,0,0,.25],65:[0,.68889,0,0,.72222],66:[0,.68889,0,0,.66667],67:[0,.68889,0,0,.72222],68:[0,.68889,0,0,.72222],69:[0,.68889,0,0,.66667],70:[0,.68889,0,0,.61111],71:[0,.68889,0,0,.77778],72:[0,.68889,0,0,.77778],73:[0,.68889,0,0,.38889],74:[.16667,.68889,0,0,.5],75:[0,.68889,0,0,.77778],76:[0,.68889,0,0,.66667],77:[0,.68889,0,0,.94445],78:[0,.68889,0,0,.72222],79:[.16667,.68889,0,0,.77778],80:[0,.68889,0,0,.61111],81:[.16667,.68889,0,0,.77778],82:[0,.68889,0,0,.72222],83:[0,.68889,0,0,.55556],84:[0,.68889,0,0,.66667],85:[0,.68889,0,0,.72222],86:[0,.68889,0,0,.72222],87:[0,.68889,0,0,1],88:[0,.68889,0,0,.72222],89:[0,.68889,0,0,.72222],90:[0,.68889,0,0,.66667],107:[0,.68889,0,0,.55556],160:[0,0,0,0,.25],165:[0,.675,.025,0,.75],174:[.15559,.69224,0,0,.94666],240:[0,.68889,0,0,.55556],295:[0,.68889,0,0,.54028],710:[0,.825,0,0,2.33334],732:[0,.9,0,0,2.33334],770:[0,.825,0,0,2.33334],771:[0,.9,0,0,2.33334],989:[.08167,.58167,0,0,.77778],1008:[0,.43056,.04028,0,.66667],8245:[0,.54986,0,0,.275],8463:[0,.68889,0,0,.54028],8487:[0,.68889,0,0,.72222],8498:[0,.68889,0,0,.55556],8502:[0,.68889,0,0,.66667],8503:[0,.68889,0,0,.44445],8504:[0,.68889,0,0,.66667],8513:[0,.68889,0,0,.63889],8592:[-.03598,.46402,0,0,.5],8594:[-.03598,.46402,0,0,.5],8602:[-.13313,.36687,0,0,1],8603:[-.13313,.36687,0,0,1],8606:[.01354,.52239,0,0,1],8608:[.01354,.52239,0,0,1],8610:[.01354,.52239,0,0,1.11111],8611:[.01354,.52239,0,0,1.11111],8619:[0,.54986,0,0,1],8620:[0,.54986,0,0,1],8621:[-.13313,.37788,0,0,1.38889],8622:[-.13313,.36687,0,0,1],8624:[0,.69224,0,0,.5],8625:[0,.69224,0,0,.5],8630:[0,.43056,0,0,1],8631:[0,.43056,0,0,1],8634:[.08198,.58198,0,0,.77778],8635:[.08198,.58198,0,0,.77778],8638:[.19444,.69224,0,0,.41667],8639:[.19444,.69224,0,0,.41667],8642:[.19444,.69224,0,0,.41667],8643:[.19444,.69224,0,0,.41667],8644:[.1808,.675,0,0,1],8646:[.1808,.675,0,0,1],8647:[.1808,.675,0,0,1],8648:[.19444,.69224,0,0,.83334],8649:[.1808,.675,0,0,1],8650:[.19444,.69224,0,0,.83334],8651:[.01354,.52239,0,0,1],8652:[.01354,.52239,0,0,1],8653:[-.13313,.36687,0,0,1],8654:[-.13313,.36687,0,0,1],8655:[-.13313,.36687,0,0,1],8666:[.13667,.63667,0,0,1],8667:[.13667,.63667,0,0,1],8669:[-.13313,.37788,0,0,1],8672:[-.064,.437,0,0,1.334],8674:[-.064,.437,0,0,1.334],8705:[0,.825,0,0,.5],8708:[0,.68889,0,0,.55556],8709:[.08167,.58167,0,0,.77778],8717:[0,.43056,0,0,.42917],8722:[-.03598,.46402,0,0,.5],8724:[.08198,.69224,0,0,.77778],8726:[.08167,.58167,0,0,.77778],8733:[0,.69224,0,0,.77778],8736:[0,.69224,0,0,.72222],8737:[0,.69224,0,0,.72222],8738:[.03517,.52239,0,0,.72222],8739:[.08167,.58167,0,0,.22222],8740:[.25142,.74111,0,0,.27778],8741:[.08167,.58167,0,0,.38889],8742:[.25142,.74111,0,0,.5],8756:[0,.69224,0,0,.66667],8757:[0,.69224,0,0,.66667],8764:[-.13313,.36687,0,0,.77778],8765:[-.13313,.37788,0,0,.77778],8769:[-.13313,.36687,0,0,.77778],8770:[-.03625,.46375,0,0,.77778],8774:[.30274,.79383,0,0,.77778],8776:[-.01688,.48312,0,0,.77778],8778:[.08167,.58167,0,0,.77778],8782:[.06062,.54986,0,0,.77778],8783:[.06062,.54986,0,0,.77778],8785:[.08198,.58198,0,0,.77778],8786:[.08198,.58198,0,0,.77778],8787:[.08198,.58198,0,0,.77778],8790:[0,.69224,0,0,.77778],8791:[.22958,.72958,0,0,.77778],8796:[.08198,.91667,0,0,.77778],8806:[.25583,.75583,0,0,.77778],8807:[.25583,.75583,0,0,.77778],8808:[.25142,.75726,0,0,.77778],8809:[.25142,.75726,0,0,.77778],8812:[.25583,.75583,0,0,.5],8814:[.20576,.70576,0,0,.77778],8815:[.20576,.70576,0,0,.77778],8816:[.30274,.79383,0,0,.77778],8817:[.30274,.79383,0,0,.77778],8818:[.22958,.72958,0,0,.77778],8819:[.22958,.72958,0,0,.77778],8822:[.1808,.675,0,0,.77778],8823:[.1808,.675,0,0,.77778],8828:[.13667,.63667,0,0,.77778],8829:[.13667,.63667,0,0,.77778],8830:[.22958,.72958,0,0,.77778],8831:[.22958,.72958,0,0,.77778],8832:[.20576,.70576,0,0,.77778],8833:[.20576,.70576,0,0,.77778],8840:[.30274,.79383,0,0,.77778],8841:[.30274,.79383,0,0,.77778],8842:[.13597,.63597,0,0,.77778],8843:[.13597,.63597,0,0,.77778],8847:[.03517,.54986,0,0,.77778],8848:[.03517,.54986,0,0,.77778],8858:[.08198,.58198,0,0,.77778],8859:[.08198,.58198,0,0,.77778],8861:[.08198,.58198,0,0,.77778],8862:[0,.675,0,0,.77778],8863:[0,.675,0,0,.77778],8864:[0,.675,0,0,.77778],8865:[0,.675,0,0,.77778],8872:[0,.69224,0,0,.61111],8873:[0,.69224,0,0,.72222],8874:[0,.69224,0,0,.88889],8876:[0,.68889,0,0,.61111],8877:[0,.68889,0,0,.61111],8878:[0,.68889,0,0,.72222],8879:[0,.68889,0,0,.72222],8882:[.03517,.54986,0,0,.77778],8883:[.03517,.54986,0,0,.77778],8884:[.13667,.63667,0,0,.77778],8885:[.13667,.63667,0,0,.77778],8888:[0,.54986,0,0,1.11111],8890:[.19444,.43056,0,0,.55556],8891:[.19444,.69224,0,0,.61111],8892:[.19444,.69224,0,0,.61111],8901:[0,.54986,0,0,.27778],8903:[.08167,.58167,0,0,.77778],8905:[.08167,.58167,0,0,.77778],8906:[.08167,.58167,0,0,.77778],8907:[0,.69224,0,0,.77778],8908:[0,.69224,0,0,.77778],8909:[-.03598,.46402,0,0,.77778],8910:[0,.54986,0,0,.76042],8911:[0,.54986,0,0,.76042],8912:[.03517,.54986,0,0,.77778],8913:[.03517,.54986,0,0,.77778],8914:[0,.54986,0,0,.66667],8915:[0,.54986,0,0,.66667],8916:[0,.69224,0,0,.66667],8918:[.0391,.5391,0,0,.77778],8919:[.0391,.5391,0,0,.77778],8920:[.03517,.54986,0,0,1.33334],8921:[.03517,.54986,0,0,1.33334],8922:[.38569,.88569,0,0,.77778],8923:[.38569,.88569,0,0,.77778],8926:[.13667,.63667,0,0,.77778],8927:[.13667,.63667,0,0,.77778],8928:[.30274,.79383,0,0,.77778],8929:[.30274,.79383,0,0,.77778],8934:[.23222,.74111,0,0,.77778],8935:[.23222,.74111,0,0,.77778],8936:[.23222,.74111,0,0,.77778],8937:[.23222,.74111,0,0,.77778],8938:[.20576,.70576,0,0,.77778],8939:[.20576,.70576,0,0,.77778],8940:[.30274,.79383,0,0,.77778],8941:[.30274,.79383,0,0,.77778],8994:[.19444,.69224,0,0,.77778],8995:[.19444,.69224,0,0,.77778],9416:[.15559,.69224,0,0,.90222],9484:[0,.69224,0,0,.5],9488:[0,.69224,0,0,.5],9492:[0,.37788,0,0,.5],9496:[0,.37788,0,0,.5],9585:[.19444,.68889,0,0,.88889],9586:[.19444,.74111,0,0,.88889],9632:[0,.675,0,0,.77778],9633:[0,.675,0,0,.77778],9650:[0,.54986,0,0,.72222],9651:[0,.54986,0,0,.72222],9654:[.03517,.54986,0,0,.77778],9660:[0,.54986,0,0,.72222],9661:[0,.54986,0,0,.72222],9664:[.03517,.54986,0,0,.77778],9674:[.11111,.69224,0,0,.66667],9733:[.19444,.69224,0,0,.94445],10003:[0,.69224,0,0,.83334],10016:[0,.69224,0,0,.83334],10731:[.11111,.69224,0,0,.66667],10846:[.19444,.75583,0,0,.61111],10877:[.13667,.63667,0,0,.77778],10878:[.13667,.63667,0,0,.77778],10885:[.25583,.75583,0,0,.77778],10886:[.25583,.75583,0,0,.77778],10887:[.13597,.63597,0,0,.77778],10888:[.13597,.63597,0,0,.77778],10889:[.26167,.75726,0,0,.77778],10890:[.26167,.75726,0,0,.77778],10891:[.48256,.98256,0,0,.77778],10892:[.48256,.98256,0,0,.77778],10901:[.13667,.63667,0,0,.77778],10902:[.13667,.63667,0,0,.77778],10933:[.25142,.75726,0,0,.77778],10934:[.25142,.75726,0,0,.77778],10935:[.26167,.75726,0,0,.77778],10936:[.26167,.75726,0,0,.77778],10937:[.26167,.75726,0,0,.77778],10938:[.26167,.75726,0,0,.77778],10949:[.25583,.75583,0,0,.77778],10950:[.25583,.75583,0,0,.77778],10955:[.28481,.79383,0,0,.77778],10956:[.28481,.79383,0,0,.77778],57350:[.08167,.58167,0,0,.22222],57351:[.08167,.58167,0,0,.38889],57352:[.08167,.58167,0,0,.77778],57353:[0,.43056,.04028,0,.66667],57356:[.25142,.75726,0,0,.77778],57357:[.25142,.75726,0,0,.77778],57358:[.41951,.91951,0,0,.77778],57359:[.30274,.79383,0,0,.77778],57360:[.30274,.79383,0,0,.77778],57361:[.41951,.91951,0,0,.77778],57366:[.25142,.75726,0,0,.77778],57367:[.25142,.75726,0,0,.77778],57368:[.25142,.75726,0,0,.77778],57369:[.25142,.75726,0,0,.77778],57370:[.13597,.63597,0,0,.77778],57371:[.13597,.63597,0,0,.77778]},"Caligraphic-Regular":{32:[0,0,0,0,.25],65:[0,.68333,0,.19445,.79847],66:[0,.68333,.03041,.13889,.65681],67:[0,.68333,.05834,.13889,.52653],68:[0,.68333,.02778,.08334,.77139],69:[0,.68333,.08944,.11111,.52778],70:[0,.68333,.09931,.11111,.71875],71:[.09722,.68333,.0593,.11111,.59487],72:[0,.68333,.00965,.11111,.84452],73:[0,.68333,.07382,0,.54452],74:[.09722,.68333,.18472,.16667,.67778],75:[0,.68333,.01445,.05556,.76195],76:[0,.68333,0,.13889,.68972],77:[0,.68333,0,.13889,1.2009],78:[0,.68333,.14736,.08334,.82049],79:[0,.68333,.02778,.11111,.79611],80:[0,.68333,.08222,.08334,.69556],81:[.09722,.68333,0,.11111,.81667],82:[0,.68333,0,.08334,.8475],83:[0,.68333,.075,.13889,.60556],84:[0,.68333,.25417,0,.54464],85:[0,.68333,.09931,.08334,.62583],86:[0,.68333,.08222,0,.61278],87:[0,.68333,.08222,.08334,.98778],88:[0,.68333,.14643,.13889,.7133],89:[.09722,.68333,.08222,.08334,.66834],90:[0,.68333,.07944,.13889,.72473],160:[0,0,0,0,.25]},"Fraktur-Regular":{32:[0,0,0,0,.25],33:[0,.69141,0,0,.29574],34:[0,.69141,0,0,.21471],38:[0,.69141,0,0,.73786],39:[0,.69141,0,0,.21201],40:[.24982,.74947,0,0,.38865],41:[.24982,.74947,0,0,.38865],42:[0,.62119,0,0,.27764],43:[.08319,.58283,0,0,.75623],44:[0,.10803,0,0,.27764],45:[.08319,.58283,0,0,.75623],46:[0,.10803,0,0,.27764],47:[.24982,.74947,0,0,.50181],48:[0,.47534,0,0,.50181],49:[0,.47534,0,0,.50181],50:[0,.47534,0,0,.50181],51:[.18906,.47534,0,0,.50181],52:[.18906,.47534,0,0,.50181],53:[.18906,.47534,0,0,.50181],54:[0,.69141,0,0,.50181],55:[.18906,.47534,0,0,.50181],56:[0,.69141,0,0,.50181],57:[.18906,.47534,0,0,.50181],58:[0,.47534,0,0,.21606],59:[.12604,.47534,0,0,.21606],61:[-.13099,.36866,0,0,.75623],63:[0,.69141,0,0,.36245],65:[0,.69141,0,0,.7176],66:[0,.69141,0,0,.88397],67:[0,.69141,0,0,.61254],68:[0,.69141,0,0,.83158],69:[0,.69141,0,0,.66278],70:[.12604,.69141,0,0,.61119],71:[0,.69141,0,0,.78539],72:[.06302,.69141,0,0,.7203],73:[0,.69141,0,0,.55448],74:[.12604,.69141,0,0,.55231],75:[0,.69141,0,0,.66845],76:[0,.69141,0,0,.66602],77:[0,.69141,0,0,1.04953],78:[0,.69141,0,0,.83212],79:[0,.69141,0,0,.82699],80:[.18906,.69141,0,0,.82753],81:[.03781,.69141,0,0,.82699],82:[0,.69141,0,0,.82807],83:[0,.69141,0,0,.82861],84:[0,.69141,0,0,.66899],85:[0,.69141,0,0,.64576],86:[0,.69141,0,0,.83131],87:[0,.69141,0,0,1.04602],88:[0,.69141,0,0,.71922],89:[.18906,.69141,0,0,.83293],90:[.12604,.69141,0,0,.60201],91:[.24982,.74947,0,0,.27764],93:[.24982,.74947,0,0,.27764],94:[0,.69141,0,0,.49965],97:[0,.47534,0,0,.50046],98:[0,.69141,0,0,.51315],99:[0,.47534,0,0,.38946],100:[0,.62119,0,0,.49857],101:[0,.47534,0,0,.40053],102:[.18906,.69141,0,0,.32626],103:[.18906,.47534,0,0,.5037],104:[.18906,.69141,0,0,.52126],105:[0,.69141,0,0,.27899],106:[0,.69141,0,0,.28088],107:[0,.69141,0,0,.38946],108:[0,.69141,0,0,.27953],109:[0,.47534,0,0,.76676],110:[0,.47534,0,0,.52666],111:[0,.47534,0,0,.48885],112:[.18906,.52396,0,0,.50046],113:[.18906,.47534,0,0,.48912],114:[0,.47534,0,0,.38919],115:[0,.47534,0,0,.44266],116:[0,.62119,0,0,.33301],117:[0,.47534,0,0,.5172],118:[0,.52396,0,0,.5118],119:[0,.52396,0,0,.77351],120:[.18906,.47534,0,0,.38865],121:[.18906,.47534,0,0,.49884],122:[.18906,.47534,0,0,.39054],160:[0,0,0,0,.25],8216:[0,.69141,0,0,.21471],8217:[0,.69141,0,0,.21471],58112:[0,.62119,0,0,.49749],58113:[0,.62119,0,0,.4983],58114:[.18906,.69141,0,0,.33328],58115:[.18906,.69141,0,0,.32923],58116:[.18906,.47534,0,0,.50343],58117:[0,.69141,0,0,.33301],58118:[0,.62119,0,0,.33409],58119:[0,.47534,0,0,.50073]},"Main-Bold":{32:[0,0,0,0,.25],33:[0,.69444,0,0,.35],34:[0,.69444,0,0,.60278],35:[.19444,.69444,0,0,.95833],36:[.05556,.75,0,0,.575],37:[.05556,.75,0,0,.95833],38:[0,.69444,0,0,.89444],39:[0,.69444,0,0,.31944],40:[.25,.75,0,0,.44722],41:[.25,.75,0,0,.44722],42:[0,.75,0,0,.575],43:[.13333,.63333,0,0,.89444],44:[.19444,.15556,0,0,.31944],45:[0,.44444,0,0,.38333],46:[0,.15556,0,0,.31944],47:[.25,.75,0,0,.575],48:[0,.64444,0,0,.575],49:[0,.64444,0,0,.575],50:[0,.64444,0,0,.575],51:[0,.64444,0,0,.575],52:[0,.64444,0,0,.575],53:[0,.64444,0,0,.575],54:[0,.64444,0,0,.575],55:[0,.64444,0,0,.575],56:[0,.64444,0,0,.575],57:[0,.64444,0,0,.575],58:[0,.44444,0,0,.31944],59:[.19444,.44444,0,0,.31944],60:[.08556,.58556,0,0,.89444],61:[-.10889,.39111,0,0,.89444],62:[.08556,.58556,0,0,.89444],63:[0,.69444,0,0,.54305],64:[0,.69444,0,0,.89444],65:[0,.68611,0,0,.86944],66:[0,.68611,0,0,.81805],67:[0,.68611,0,0,.83055],68:[0,.68611,0,0,.88194],69:[0,.68611,0,0,.75555],70:[0,.68611,0,0,.72361],71:[0,.68611,0,0,.90416],72:[0,.68611,0,0,.9],73:[0,.68611,0,0,.43611],74:[0,.68611,0,0,.59444],75:[0,.68611,0,0,.90138],76:[0,.68611,0,0,.69166],77:[0,.68611,0,0,1.09166],78:[0,.68611,0,0,.9],79:[0,.68611,0,0,.86388],80:[0,.68611,0,0,.78611],81:[.19444,.68611,0,0,.86388],82:[0,.68611,0,0,.8625],83:[0,.68611,0,0,.63889],84:[0,.68611,0,0,.8],85:[0,.68611,0,0,.88472],86:[0,.68611,.01597,0,.86944],87:[0,.68611,.01597,0,1.18888],88:[0,.68611,0,0,.86944],89:[0,.68611,.02875,0,.86944],90:[0,.68611,0,0,.70277],91:[.25,.75,0,0,.31944],92:[.25,.75,0,0,.575],93:[.25,.75,0,0,.31944],94:[0,.69444,0,0,.575],95:[.31,.13444,.03194,0,.575],97:[0,.44444,0,0,.55902],98:[0,.69444,0,0,.63889],99:[0,.44444,0,0,.51111],100:[0,.69444,0,0,.63889],101:[0,.44444,0,0,.52708],102:[0,.69444,.10903,0,.35139],103:[.19444,.44444,.01597,0,.575],104:[0,.69444,0,0,.63889],105:[0,.69444,0,0,.31944],106:[.19444,.69444,0,0,.35139],107:[0,.69444,0,0,.60694],108:[0,.69444,0,0,.31944],109:[0,.44444,0,0,.95833],110:[0,.44444,0,0,.63889],111:[0,.44444,0,0,.575],112:[.19444,.44444,0,0,.63889],113:[.19444,.44444,0,0,.60694],114:[0,.44444,0,0,.47361],115:[0,.44444,0,0,.45361],116:[0,.63492,0,0,.44722],117:[0,.44444,0,0,.63889],118:[0,.44444,.01597,0,.60694],119:[0,.44444,.01597,0,.83055],120:[0,.44444,0,0,.60694],121:[.19444,.44444,.01597,0,.60694],122:[0,.44444,0,0,.51111],123:[.25,.75,0,0,.575],124:[.25,.75,0,0,.31944],125:[.25,.75,0,0,.575],126:[.35,.34444,0,0,.575],160:[0,0,0,0,.25],163:[0,.69444,0,0,.86853],168:[0,.69444,0,0,.575],172:[0,.44444,0,0,.76666],176:[0,.69444,0,0,.86944],177:[.13333,.63333,0,0,.89444],184:[.17014,0,0,0,.51111],198:[0,.68611,0,0,1.04166],215:[.13333,.63333,0,0,.89444],216:[.04861,.73472,0,0,.89444],223:[0,.69444,0,0,.59722],230:[0,.44444,0,0,.83055],247:[.13333,.63333,0,0,.89444],248:[.09722,.54167,0,0,.575],305:[0,.44444,0,0,.31944],338:[0,.68611,0,0,1.16944],339:[0,.44444,0,0,.89444],567:[.19444,.44444,0,0,.35139],710:[0,.69444,0,0,.575],711:[0,.63194,0,0,.575],713:[0,.59611,0,0,.575],714:[0,.69444,0,0,.575],715:[0,.69444,0,0,.575],728:[0,.69444,0,0,.575],729:[0,.69444,0,0,.31944],730:[0,.69444,0,0,.86944],732:[0,.69444,0,0,.575],733:[0,.69444,0,0,.575],915:[0,.68611,0,0,.69166],916:[0,.68611,0,0,.95833],920:[0,.68611,0,0,.89444],923:[0,.68611,0,0,.80555],926:[0,.68611,0,0,.76666],928:[0,.68611,0,0,.9],931:[0,.68611,0,0,.83055],933:[0,.68611,0,0,.89444],934:[0,.68611,0,0,.83055],936:[0,.68611,0,0,.89444],937:[0,.68611,0,0,.83055],8211:[0,.44444,.03194,0,.575],8212:[0,.44444,.03194,0,1.14999],8216:[0,.69444,0,0,.31944],8217:[0,.69444,0,0,.31944],8220:[0,.69444,0,0,.60278],8221:[0,.69444,0,0,.60278],8224:[.19444,.69444,0,0,.51111],8225:[.19444,.69444,0,0,.51111],8242:[0,.55556,0,0,.34444],8407:[0,.72444,.15486,0,.575],8463:[0,.69444,0,0,.66759],8465:[0,.69444,0,0,.83055],8467:[0,.69444,0,0,.47361],8472:[.19444,.44444,0,0,.74027],8476:[0,.69444,0,0,.83055],8501:[0,.69444,0,0,.70277],8592:[-.10889,.39111,0,0,1.14999],8593:[.19444,.69444,0,0,.575],8594:[-.10889,.39111,0,0,1.14999],8595:[.19444,.69444,0,0,.575],8596:[-.10889,.39111,0,0,1.14999],8597:[.25,.75,0,0,.575],8598:[.19444,.69444,0,0,1.14999],8599:[.19444,.69444,0,0,1.14999],8600:[.19444,.69444,0,0,1.14999],8601:[.19444,.69444,0,0,1.14999],8636:[-.10889,.39111,0,0,1.14999],8637:[-.10889,.39111,0,0,1.14999],8640:[-.10889,.39111,0,0,1.14999],8641:[-.10889,.39111,0,0,1.14999],8656:[-.10889,.39111,0,0,1.14999],8657:[.19444,.69444,0,0,.70277],8658:[-.10889,.39111,0,0,1.14999],8659:[.19444,.69444,0,0,.70277],8660:[-.10889,.39111,0,0,1.14999],8661:[.25,.75,0,0,.70277],8704:[0,.69444,0,0,.63889],8706:[0,.69444,.06389,0,.62847],8707:[0,.69444,0,0,.63889],8709:[.05556,.75,0,0,.575],8711:[0,.68611,0,0,.95833],8712:[.08556,.58556,0,0,.76666],8715:[.08556,.58556,0,0,.76666],8722:[.13333,.63333,0,0,.89444],8723:[.13333,.63333,0,0,.89444],8725:[.25,.75,0,0,.575],8726:[.25,.75,0,0,.575],8727:[-.02778,.47222,0,0,.575],8728:[-.02639,.47361,0,0,.575],8729:[-.02639,.47361,0,0,.575],8730:[.18,.82,0,0,.95833],8733:[0,.44444,0,0,.89444],8734:[0,.44444,0,0,1.14999],8736:[0,.69224,0,0,.72222],8739:[.25,.75,0,0,.31944],8741:[.25,.75,0,0,.575],8743:[0,.55556,0,0,.76666],8744:[0,.55556,0,0,.76666],8745:[0,.55556,0,0,.76666],8746:[0,.55556,0,0,.76666],8747:[.19444,.69444,.12778,0,.56875],8764:[-.10889,.39111,0,0,.89444],8768:[.19444,.69444,0,0,.31944],8771:[.00222,.50222,0,0,.89444],8773:[.027,.638,0,0,.894],8776:[.02444,.52444,0,0,.89444],8781:[.00222,.50222,0,0,.89444],8801:[.00222,.50222,0,0,.89444],8804:[.19667,.69667,0,0,.89444],8805:[.19667,.69667,0,0,.89444],8810:[.08556,.58556,0,0,1.14999],8811:[.08556,.58556,0,0,1.14999],8826:[.08556,.58556,0,0,.89444],8827:[.08556,.58556,0,0,.89444],8834:[.08556,.58556,0,0,.89444],8835:[.08556,.58556,0,0,.89444],8838:[.19667,.69667,0,0,.89444],8839:[.19667,.69667,0,0,.89444],8846:[0,.55556,0,0,.76666],8849:[.19667,.69667,0,0,.89444],8850:[.19667,.69667,0,0,.89444],8851:[0,.55556,0,0,.76666],8852:[0,.55556,0,0,.76666],8853:[.13333,.63333,0,0,.89444],8854:[.13333,.63333,0,0,.89444],8855:[.13333,.63333,0,0,.89444],8856:[.13333,.63333,0,0,.89444],8857:[.13333,.63333,0,0,.89444],8866:[0,.69444,0,0,.70277],8867:[0,.69444,0,0,.70277],8868:[0,.69444,0,0,.89444],8869:[0,.69444,0,0,.89444],8900:[-.02639,.47361,0,0,.575],8901:[-.02639,.47361,0,0,.31944],8902:[-.02778,.47222,0,0,.575],8968:[.25,.75,0,0,.51111],8969:[.25,.75,0,0,.51111],8970:[.25,.75,0,0,.51111],8971:[.25,.75,0,0,.51111],8994:[-.13889,.36111,0,0,1.14999],8995:[-.13889,.36111,0,0,1.14999],9651:[.19444,.69444,0,0,1.02222],9657:[-.02778,.47222,0,0,.575],9661:[.19444,.69444,0,0,1.02222],9667:[-.02778,.47222,0,0,.575],9711:[.19444,.69444,0,0,1.14999],9824:[.12963,.69444,0,0,.89444],9825:[.12963,.69444,0,0,.89444],9826:[.12963,.69444,0,0,.89444],9827:[.12963,.69444,0,0,.89444],9837:[0,.75,0,0,.44722],9838:[.19444,.69444,0,0,.44722],9839:[.19444,.69444,0,0,.44722],10216:[.25,.75,0,0,.44722],10217:[.25,.75,0,0,.44722],10815:[0,.68611,0,0,.9],10927:[.19667,.69667,0,0,.89444],10928:[.19667,.69667,0,0,.89444],57376:[.19444,.69444,0,0,0]},"Main-BoldItalic":{32:[0,0,0,0,.25],33:[0,.69444,.11417,0,.38611],34:[0,.69444,.07939,0,.62055],35:[.19444,.69444,.06833,0,.94444],37:[.05556,.75,.12861,0,.94444],38:[0,.69444,.08528,0,.88555],39:[0,.69444,.12945,0,.35555],40:[.25,.75,.15806,0,.47333],41:[.25,.75,.03306,0,.47333],42:[0,.75,.14333,0,.59111],43:[.10333,.60333,.03306,0,.88555],44:[.19444,.14722,0,0,.35555],45:[0,.44444,.02611,0,.41444],46:[0,.14722,0,0,.35555],47:[.25,.75,.15806,0,.59111],48:[0,.64444,.13167,0,.59111],49:[0,.64444,.13167,0,.59111],50:[0,.64444,.13167,0,.59111],51:[0,.64444,.13167,0,.59111],52:[.19444,.64444,.13167,0,.59111],53:[0,.64444,.13167,0,.59111],54:[0,.64444,.13167,0,.59111],55:[.19444,.64444,.13167,0,.59111],56:[0,.64444,.13167,0,.59111],57:[0,.64444,.13167,0,.59111],58:[0,.44444,.06695,0,.35555],59:[.19444,.44444,.06695,0,.35555],61:[-.10889,.39111,.06833,0,.88555],63:[0,.69444,.11472,0,.59111],64:[0,.69444,.09208,0,.88555],65:[0,.68611,0,0,.86555],66:[0,.68611,.0992,0,.81666],67:[0,.68611,.14208,0,.82666],68:[0,.68611,.09062,0,.87555],69:[0,.68611,.11431,0,.75666],70:[0,.68611,.12903,0,.72722],71:[0,.68611,.07347,0,.89527],72:[0,.68611,.17208,0,.8961],73:[0,.68611,.15681,0,.47166],74:[0,.68611,.145,0,.61055],75:[0,.68611,.14208,0,.89499],76:[0,.68611,0,0,.69777],77:[0,.68611,.17208,0,1.07277],78:[0,.68611,.17208,0,.8961],79:[0,.68611,.09062,0,.85499],80:[0,.68611,.0992,0,.78721],81:[.19444,.68611,.09062,0,.85499],82:[0,.68611,.02559,0,.85944],83:[0,.68611,.11264,0,.64999],84:[0,.68611,.12903,0,.7961],85:[0,.68611,.17208,0,.88083],86:[0,.68611,.18625,0,.86555],87:[0,.68611,.18625,0,1.15999],88:[0,.68611,.15681,0,.86555],89:[0,.68611,.19803,0,.86555],90:[0,.68611,.14208,0,.70888],91:[.25,.75,.1875,0,.35611],93:[.25,.75,.09972,0,.35611],94:[0,.69444,.06709,0,.59111],95:[.31,.13444,.09811,0,.59111],97:[0,.44444,.09426,0,.59111],98:[0,.69444,.07861,0,.53222],99:[0,.44444,.05222,0,.53222],100:[0,.69444,.10861,0,.59111],101:[0,.44444,.085,0,.53222],102:[.19444,.69444,.21778,0,.4],103:[.19444,.44444,.105,0,.53222],104:[0,.69444,.09426,0,.59111],105:[0,.69326,.11387,0,.35555],106:[.19444,.69326,.1672,0,.35555],107:[0,.69444,.11111,0,.53222],108:[0,.69444,.10861,0,.29666],109:[0,.44444,.09426,0,.94444],110:[0,.44444,.09426,0,.64999],111:[0,.44444,.07861,0,.59111],112:[.19444,.44444,.07861,0,.59111],113:[.19444,.44444,.105,0,.53222],114:[0,.44444,.11111,0,.50167],115:[0,.44444,.08167,0,.48694],116:[0,.63492,.09639,0,.385],117:[0,.44444,.09426,0,.62055],118:[0,.44444,.11111,0,.53222],119:[0,.44444,.11111,0,.76777],120:[0,.44444,.12583,0,.56055],121:[.19444,.44444,.105,0,.56166],122:[0,.44444,.13889,0,.49055],126:[.35,.34444,.11472,0,.59111],160:[0,0,0,0,.25],168:[0,.69444,.11473,0,.59111],176:[0,.69444,0,0,.94888],184:[.17014,0,0,0,.53222],198:[0,.68611,.11431,0,1.02277],216:[.04861,.73472,.09062,0,.88555],223:[.19444,.69444,.09736,0,.665],230:[0,.44444,.085,0,.82666],248:[.09722,.54167,.09458,0,.59111],305:[0,.44444,.09426,0,.35555],338:[0,.68611,.11431,0,1.14054],339:[0,.44444,.085,0,.82666],567:[.19444,.44444,.04611,0,.385],710:[0,.69444,.06709,0,.59111],711:[0,.63194,.08271,0,.59111],713:[0,.59444,.10444,0,.59111],714:[0,.69444,.08528,0,.59111],715:[0,.69444,0,0,.59111],728:[0,.69444,.10333,0,.59111],729:[0,.69444,.12945,0,.35555],730:[0,.69444,0,0,.94888],732:[0,.69444,.11472,0,.59111],733:[0,.69444,.11472,0,.59111],915:[0,.68611,.12903,0,.69777],916:[0,.68611,0,0,.94444],920:[0,.68611,.09062,0,.88555],923:[0,.68611,0,0,.80666],926:[0,.68611,.15092,0,.76777],928:[0,.68611,.17208,0,.8961],931:[0,.68611,.11431,0,.82666],933:[0,.68611,.10778,0,.88555],934:[0,.68611,.05632,0,.82666],936:[0,.68611,.10778,0,.88555],937:[0,.68611,.0992,0,.82666],8211:[0,.44444,.09811,0,.59111],8212:[0,.44444,.09811,0,1.18221],8216:[0,.69444,.12945,0,.35555],8217:[0,.69444,.12945,0,.35555],8220:[0,.69444,.16772,0,.62055],8221:[0,.69444,.07939,0,.62055]},"Main-Italic":{32:[0,0,0,0,.25],33:[0,.69444,.12417,0,.30667],34:[0,.69444,.06961,0,.51444],35:[.19444,.69444,.06616,0,.81777],37:[.05556,.75,.13639,0,.81777],38:[0,.69444,.09694,0,.76666],39:[0,.69444,.12417,0,.30667],40:[.25,.75,.16194,0,.40889],41:[.25,.75,.03694,0,.40889],42:[0,.75,.14917,0,.51111],43:[.05667,.56167,.03694,0,.76666],44:[.19444,.10556,0,0,.30667],45:[0,.43056,.02826,0,.35778],46:[0,.10556,0,0,.30667],47:[.25,.75,.16194,0,.51111],48:[0,.64444,.13556,0,.51111],49:[0,.64444,.13556,0,.51111],50:[0,.64444,.13556,0,.51111],51:[0,.64444,.13556,0,.51111],52:[.19444,.64444,.13556,0,.51111],53:[0,.64444,.13556,0,.51111],54:[0,.64444,.13556,0,.51111],55:[.19444,.64444,.13556,0,.51111],56:[0,.64444,.13556,0,.51111],57:[0,.64444,.13556,0,.51111],58:[0,.43056,.0582,0,.30667],59:[.19444,.43056,.0582,0,.30667],61:[-.13313,.36687,.06616,0,.76666],63:[0,.69444,.1225,0,.51111],64:[0,.69444,.09597,0,.76666],65:[0,.68333,0,0,.74333],66:[0,.68333,.10257,0,.70389],67:[0,.68333,.14528,0,.71555],68:[0,.68333,.09403,0,.755],69:[0,.68333,.12028,0,.67833],70:[0,.68333,.13305,0,.65277],71:[0,.68333,.08722,0,.77361],72:[0,.68333,.16389,0,.74333],73:[0,.68333,.15806,0,.38555],74:[0,.68333,.14028,0,.525],75:[0,.68333,.14528,0,.76888],76:[0,.68333,0,0,.62722],77:[0,.68333,.16389,0,.89666],78:[0,.68333,.16389,0,.74333],79:[0,.68333,.09403,0,.76666],80:[0,.68333,.10257,0,.67833],81:[.19444,.68333,.09403,0,.76666],82:[0,.68333,.03868,0,.72944],83:[0,.68333,.11972,0,.56222],84:[0,.68333,.13305,0,.71555],85:[0,.68333,.16389,0,.74333],86:[0,.68333,.18361,0,.74333],87:[0,.68333,.18361,0,.99888],88:[0,.68333,.15806,0,.74333],89:[0,.68333,.19383,0,.74333],90:[0,.68333,.14528,0,.61333],91:[.25,.75,.1875,0,.30667],93:[.25,.75,.10528,0,.30667],94:[0,.69444,.06646,0,.51111],95:[.31,.12056,.09208,0,.51111],97:[0,.43056,.07671,0,.51111],98:[0,.69444,.06312,0,.46],99:[0,.43056,.05653,0,.46],100:[0,.69444,.10333,0,.51111],101:[0,.43056,.07514,0,.46],102:[.19444,.69444,.21194,0,.30667],103:[.19444,.43056,.08847,0,.46],104:[0,.69444,.07671,0,.51111],105:[0,.65536,.1019,0,.30667],106:[.19444,.65536,.14467,0,.30667],107:[0,.69444,.10764,0,.46],108:[0,.69444,.10333,0,.25555],109:[0,.43056,.07671,0,.81777],110:[0,.43056,.07671,0,.56222],111:[0,.43056,.06312,0,.51111],112:[.19444,.43056,.06312,0,.51111],113:[.19444,.43056,.08847,0,.46],114:[0,.43056,.10764,0,.42166],115:[0,.43056,.08208,0,.40889],116:[0,.61508,.09486,0,.33222],117:[0,.43056,.07671,0,.53666],118:[0,.43056,.10764,0,.46],119:[0,.43056,.10764,0,.66444],120:[0,.43056,.12042,0,.46389],121:[.19444,.43056,.08847,0,.48555],122:[0,.43056,.12292,0,.40889],126:[.35,.31786,.11585,0,.51111],160:[0,0,0,0,.25],168:[0,.66786,.10474,0,.51111],176:[0,.69444,0,0,.83129],184:[.17014,0,0,0,.46],198:[0,.68333,.12028,0,.88277],216:[.04861,.73194,.09403,0,.76666],223:[.19444,.69444,.10514,0,.53666],230:[0,.43056,.07514,0,.71555],248:[.09722,.52778,.09194,0,.51111],338:[0,.68333,.12028,0,.98499],339:[0,.43056,.07514,0,.71555],710:[0,.69444,.06646,0,.51111],711:[0,.62847,.08295,0,.51111],713:[0,.56167,.10333,0,.51111],714:[0,.69444,.09694,0,.51111],715:[0,.69444,0,0,.51111],728:[0,.69444,.10806,0,.51111],729:[0,.66786,.11752,0,.30667],730:[0,.69444,0,0,.83129],732:[0,.66786,.11585,0,.51111],733:[0,.69444,.1225,0,.51111],915:[0,.68333,.13305,0,.62722],916:[0,.68333,0,0,.81777],920:[0,.68333,.09403,0,.76666],923:[0,.68333,0,0,.69222],926:[0,.68333,.15294,0,.66444],928:[0,.68333,.16389,0,.74333],931:[0,.68333,.12028,0,.71555],933:[0,.68333,.11111,0,.76666],934:[0,.68333,.05986,0,.71555],936:[0,.68333,.11111,0,.76666],937:[0,.68333,.10257,0,.71555],8211:[0,.43056,.09208,0,.51111],8212:[0,.43056,.09208,0,1.02222],8216:[0,.69444,.12417,0,.30667],8217:[0,.69444,.12417,0,.30667],8220:[0,.69444,.1685,0,.51444],8221:[0,.69444,.06961,0,.51444],8463:[0,.68889,0,0,.54028]},"Main-Regular":{32:[0,0,0,0,.25],33:[0,.69444,0,0,.27778],34:[0,.69444,0,0,.5],35:[.19444,.69444,0,0,.83334],36:[.05556,.75,0,0,.5],37:[.05556,.75,0,0,.83334],38:[0,.69444,0,0,.77778],39:[0,.69444,0,0,.27778],40:[.25,.75,0,0,.38889],41:[.25,.75,0,0,.38889],42:[0,.75,0,0,.5],43:[.08333,.58333,0,0,.77778],44:[.19444,.10556,0,0,.27778],45:[0,.43056,0,0,.33333],46:[0,.10556,0,0,.27778],47:[.25,.75,0,0,.5],48:[0,.64444,0,0,.5],49:[0,.64444,0,0,.5],50:[0,.64444,0,0,.5],51:[0,.64444,0,0,.5],52:[0,.64444,0,0,.5],53:[0,.64444,0,0,.5],54:[0,.64444,0,0,.5],55:[0,.64444,0,0,.5],56:[0,.64444,0,0,.5],57:[0,.64444,0,0,.5],58:[0,.43056,0,0,.27778],59:[.19444,.43056,0,0,.27778],60:[.0391,.5391,0,0,.77778],61:[-.13313,.36687,0,0,.77778],62:[.0391,.5391,0,0,.77778],63:[0,.69444,0,0,.47222],64:[0,.69444,0,0,.77778],65:[0,.68333,0,0,.75],66:[0,.68333,0,0,.70834],67:[0,.68333,0,0,.72222],68:[0,.68333,0,0,.76389],69:[0,.68333,0,0,.68056],70:[0,.68333,0,0,.65278],71:[0,.68333,0,0,.78472],72:[0,.68333,0,0,.75],73:[0,.68333,0,0,.36111],74:[0,.68333,0,0,.51389],75:[0,.68333,0,0,.77778],76:[0,.68333,0,0,.625],77:[0,.68333,0,0,.91667],78:[0,.68333,0,0,.75],79:[0,.68333,0,0,.77778],80:[0,.68333,0,0,.68056],81:[.19444,.68333,0,0,.77778],82:[0,.68333,0,0,.73611],83:[0,.68333,0,0,.55556],84:[0,.68333,0,0,.72222],85:[0,.68333,0,0,.75],86:[0,.68333,.01389,0,.75],87:[0,.68333,.01389,0,1.02778],88:[0,.68333,0,0,.75],89:[0,.68333,.025,0,.75],90:[0,.68333,0,0,.61111],91:[.25,.75,0,0,.27778],92:[.25,.75,0,0,.5],93:[.25,.75,0,0,.27778],94:[0,.69444,0,0,.5],95:[.31,.12056,.02778,0,.5],97:[0,.43056,0,0,.5],98:[0,.69444,0,0,.55556],99:[0,.43056,0,0,.44445],100:[0,.69444,0,0,.55556],101:[0,.43056,0,0,.44445],102:[0,.69444,.07778,0,.30556],103:[.19444,.43056,.01389,0,.5],104:[0,.69444,0,0,.55556],105:[0,.66786,0,0,.27778],106:[.19444,.66786,0,0,.30556],107:[0,.69444,0,0,.52778],108:[0,.69444,0,0,.27778],109:[0,.43056,0,0,.83334],110:[0,.43056,0,0,.55556],111:[0,.43056,0,0,.5],112:[.19444,.43056,0,0,.55556],113:[.19444,.43056,0,0,.52778],114:[0,.43056,0,0,.39167],115:[0,.43056,0,0,.39445],116:[0,.61508,0,0,.38889],117:[0,.43056,0,0,.55556],118:[0,.43056,.01389,0,.52778],119:[0,.43056,.01389,0,.72222],120:[0,.43056,0,0,.52778],121:[.19444,.43056,.01389,0,.52778],122:[0,.43056,0,0,.44445],123:[.25,.75,0,0,.5],124:[.25,.75,0,0,.27778],125:[.25,.75,0,0,.5],126:[.35,.31786,0,0,.5],160:[0,0,0,0,.25],163:[0,.69444,0,0,.76909],167:[.19444,.69444,0,0,.44445],168:[0,.66786,0,0,.5],172:[0,.43056,0,0,.66667],176:[0,.69444,0,0,.75],177:[.08333,.58333,0,0,.77778],182:[.19444,.69444,0,0,.61111],184:[.17014,0,0,0,.44445],198:[0,.68333,0,0,.90278],215:[.08333,.58333,0,0,.77778],216:[.04861,.73194,0,0,.77778],223:[0,.69444,0,0,.5],230:[0,.43056,0,0,.72222],247:[.08333,.58333,0,0,.77778],248:[.09722,.52778,0,0,.5],305:[0,.43056,0,0,.27778],338:[0,.68333,0,0,1.01389],339:[0,.43056,0,0,.77778],567:[.19444,.43056,0,0,.30556],710:[0,.69444,0,0,.5],711:[0,.62847,0,0,.5],713:[0,.56778,0,0,.5],714:[0,.69444,0,0,.5],715:[0,.69444,0,0,.5],728:[0,.69444,0,0,.5],729:[0,.66786,0,0,.27778],730:[0,.69444,0,0,.75],732:[0,.66786,0,0,.5],733:[0,.69444,0,0,.5],915:[0,.68333,0,0,.625],916:[0,.68333,0,0,.83334],920:[0,.68333,0,0,.77778],923:[0,.68333,0,0,.69445],926:[0,.68333,0,0,.66667],928:[0,.68333,0,0,.75],931:[0,.68333,0,0,.72222],933:[0,.68333,0,0,.77778],934:[0,.68333,0,0,.72222],936:[0,.68333,0,0,.77778],937:[0,.68333,0,0,.72222],8211:[0,.43056,.02778,0,.5],8212:[0,.43056,.02778,0,1],8216:[0,.69444,0,0,.27778],8217:[0,.69444,0,0,.27778],8220:[0,.69444,0,0,.5],8221:[0,.69444,0,0,.5],8224:[.19444,.69444,0,0,.44445],8225:[.19444,.69444,0,0,.44445],8230:[0,.123,0,0,1.172],8242:[0,.55556,0,0,.275],8407:[0,.71444,.15382,0,.5],8463:[0,.68889,0,0,.54028],8465:[0,.69444,0,0,.72222],8467:[0,.69444,0,.11111,.41667],8472:[.19444,.43056,0,.11111,.63646],8476:[0,.69444,0,0,.72222],8501:[0,.69444,0,0,.61111],8592:[-.13313,.36687,0,0,1],8593:[.19444,.69444,0,0,.5],8594:[-.13313,.36687,0,0,1],8595:[.19444,.69444,0,0,.5],8596:[-.13313,.36687,0,0,1],8597:[.25,.75,0,0,.5],8598:[.19444,.69444,0,0,1],8599:[.19444,.69444,0,0,1],8600:[.19444,.69444,0,0,1],8601:[.19444,.69444,0,0,1],8614:[.011,.511,0,0,1],8617:[.011,.511,0,0,1.126],8618:[.011,.511,0,0,1.126],8636:[-.13313,.36687,0,0,1],8637:[-.13313,.36687,0,0,1],8640:[-.13313,.36687,0,0,1],8641:[-.13313,.36687,0,0,1],8652:[.011,.671,0,0,1],8656:[-.13313,.36687,0,0,1],8657:[.19444,.69444,0,0,.61111],8658:[-.13313,.36687,0,0,1],8659:[.19444,.69444,0,0,.61111],8660:[-.13313,.36687,0,0,1],8661:[.25,.75,0,0,.61111],8704:[0,.69444,0,0,.55556],8706:[0,.69444,.05556,.08334,.5309],8707:[0,.69444,0,0,.55556],8709:[.05556,.75,0,0,.5],8711:[0,.68333,0,0,.83334],8712:[.0391,.5391,0,0,.66667],8715:[.0391,.5391,0,0,.66667],8722:[.08333,.58333,0,0,.77778],8723:[.08333,.58333,0,0,.77778],8725:[.25,.75,0,0,.5],8726:[.25,.75,0,0,.5],8727:[-.03472,.46528,0,0,.5],8728:[-.05555,.44445,0,0,.5],8729:[-.05555,.44445,0,0,.5],8730:[.2,.8,0,0,.83334],8733:[0,.43056,0,0,.77778],8734:[0,.43056,0,0,1],8736:[0,.69224,0,0,.72222],8739:[.25,.75,0,0,.27778],8741:[.25,.75,0,0,.5],8743:[0,.55556,0,0,.66667],8744:[0,.55556,0,0,.66667],8745:[0,.55556,0,0,.66667],8746:[0,.55556,0,0,.66667],8747:[.19444,.69444,.11111,0,.41667],8764:[-.13313,.36687,0,0,.77778],8768:[.19444,.69444,0,0,.27778],8771:[-.03625,.46375,0,0,.77778],8773:[-.022,.589,0,0,.778],8776:[-.01688,.48312,0,0,.77778],8781:[-.03625,.46375,0,0,.77778],8784:[-.133,.673,0,0,.778],8801:[-.03625,.46375,0,0,.77778],8804:[.13597,.63597,0,0,.77778],8805:[.13597,.63597,0,0,.77778],8810:[.0391,.5391,0,0,1],8811:[.0391,.5391,0,0,1],8826:[.0391,.5391,0,0,.77778],8827:[.0391,.5391,0,0,.77778],8834:[.0391,.5391,0,0,.77778],8835:[.0391,.5391,0,0,.77778],8838:[.13597,.63597,0,0,.77778],8839:[.13597,.63597,0,0,.77778],8846:[0,.55556,0,0,.66667],8849:[.13597,.63597,0,0,.77778],8850:[.13597,.63597,0,0,.77778],8851:[0,.55556,0,0,.66667],8852:[0,.55556,0,0,.66667],8853:[.08333,.58333,0,0,.77778],8854:[.08333,.58333,0,0,.77778],8855:[.08333,.58333,0,0,.77778],8856:[.08333,.58333,0,0,.77778],8857:[.08333,.58333,0,0,.77778],8866:[0,.69444,0,0,.61111],8867:[0,.69444,0,0,.61111],8868:[0,.69444,0,0,.77778],8869:[0,.69444,0,0,.77778],8872:[.249,.75,0,0,.867],8900:[-.05555,.44445,0,0,.5],8901:[-.05555,.44445,0,0,.27778],8902:[-.03472,.46528,0,0,.5],8904:[.005,.505,0,0,.9],8942:[.03,.903,0,0,.278],8943:[-.19,.313,0,0,1.172],8945:[-.1,.823,0,0,1.282],8968:[.25,.75,0,0,.44445],8969:[.25,.75,0,0,.44445],8970:[.25,.75,0,0,.44445],8971:[.25,.75,0,0,.44445],8994:[-.14236,.35764,0,0,1],8995:[-.14236,.35764,0,0,1],9136:[.244,.744,0,0,.412],9137:[.244,.745,0,0,.412],9651:[.19444,.69444,0,0,.88889],9657:[-.03472,.46528,0,0,.5],9661:[.19444,.69444,0,0,.88889],9667:[-.03472,.46528,0,0,.5],9711:[.19444,.69444,0,0,1],9824:[.12963,.69444,0,0,.77778],9825:[.12963,.69444,0,0,.77778],9826:[.12963,.69444,0,0,.77778],9827:[.12963,.69444,0,0,.77778],9837:[0,.75,0,0,.38889],9838:[.19444,.69444,0,0,.38889],9839:[.19444,.69444,0,0,.38889],10216:[.25,.75,0,0,.38889],10217:[.25,.75,0,0,.38889],10222:[.244,.744,0,0,.412],10223:[.244,.745,0,0,.412],10229:[.011,.511,0,0,1.609],10230:[.011,.511,0,0,1.638],10231:[.011,.511,0,0,1.859],10232:[.024,.525,0,0,1.609],10233:[.024,.525,0,0,1.638],10234:[.024,.525,0,0,1.858],10236:[.011,.511,0,0,1.638],10815:[0,.68333,0,0,.75],10927:[.13597,.63597,0,0,.77778],10928:[.13597,.63597,0,0,.77778],57376:[.19444,.69444,0,0,0]},"Math-BoldItalic":{32:[0,0,0,0,.25],48:[0,.44444,0,0,.575],49:[0,.44444,0,0,.575],50:[0,.44444,0,0,.575],51:[.19444,.44444,0,0,.575],52:[.19444,.44444,0,0,.575],53:[.19444,.44444,0,0,.575],54:[0,.64444,0,0,.575],55:[.19444,.44444,0,0,.575],56:[0,.64444,0,0,.575],57:[.19444,.44444,0,0,.575],65:[0,.68611,0,0,.86944],66:[0,.68611,.04835,0,.8664],67:[0,.68611,.06979,0,.81694],68:[0,.68611,.03194,0,.93812],69:[0,.68611,.05451,0,.81007],70:[0,.68611,.15972,0,.68889],71:[0,.68611,0,0,.88673],72:[0,.68611,.08229,0,.98229],73:[0,.68611,.07778,0,.51111],74:[0,.68611,.10069,0,.63125],75:[0,.68611,.06979,0,.97118],76:[0,.68611,0,0,.75555],77:[0,.68611,.11424,0,1.14201],78:[0,.68611,.11424,0,.95034],79:[0,.68611,.03194,0,.83666],80:[0,.68611,.15972,0,.72309],81:[.19444,.68611,0,0,.86861],82:[0,.68611,.00421,0,.87235],83:[0,.68611,.05382,0,.69271],84:[0,.68611,.15972,0,.63663],85:[0,.68611,.11424,0,.80027],86:[0,.68611,.25555,0,.67778],87:[0,.68611,.15972,0,1.09305],88:[0,.68611,.07778,0,.94722],89:[0,.68611,.25555,0,.67458],90:[0,.68611,.06979,0,.77257],97:[0,.44444,0,0,.63287],98:[0,.69444,0,0,.52083],99:[0,.44444,0,0,.51342],100:[0,.69444,0,0,.60972],101:[0,.44444,0,0,.55361],102:[.19444,.69444,.11042,0,.56806],103:[.19444,.44444,.03704,0,.5449],104:[0,.69444,0,0,.66759],105:[0,.69326,0,0,.4048],106:[.19444,.69326,.0622,0,.47083],107:[0,.69444,.01852,0,.6037],108:[0,.69444,.0088,0,.34815],109:[0,.44444,0,0,1.0324],110:[0,.44444,0,0,.71296],111:[0,.44444,0,0,.58472],112:[.19444,.44444,0,0,.60092],113:[.19444,.44444,.03704,0,.54213],114:[0,.44444,.03194,0,.5287],115:[0,.44444,0,0,.53125],116:[0,.63492,0,0,.41528],117:[0,.44444,0,0,.68102],118:[0,.44444,.03704,0,.56666],119:[0,.44444,.02778,0,.83148],120:[0,.44444,0,0,.65903],121:[.19444,.44444,.03704,0,.59028],122:[0,.44444,.04213,0,.55509],160:[0,0,0,0,.25],915:[0,.68611,.15972,0,.65694],916:[0,.68611,0,0,.95833],920:[0,.68611,.03194,0,.86722],923:[0,.68611,0,0,.80555],926:[0,.68611,.07458,0,.84125],928:[0,.68611,.08229,0,.98229],931:[0,.68611,.05451,0,.88507],933:[0,.68611,.15972,0,.67083],934:[0,.68611,0,0,.76666],936:[0,.68611,.11653,0,.71402],937:[0,.68611,.04835,0,.8789],945:[0,.44444,0,0,.76064],946:[.19444,.69444,.03403,0,.65972],947:[.19444,.44444,.06389,0,.59003],948:[0,.69444,.03819,0,.52222],949:[0,.44444,0,0,.52882],950:[.19444,.69444,.06215,0,.50833],951:[.19444,.44444,.03704,0,.6],952:[0,.69444,.03194,0,.5618],953:[0,.44444,0,0,.41204],954:[0,.44444,0,0,.66759],955:[0,.69444,0,0,.67083],956:[.19444,.44444,0,0,.70787],957:[0,.44444,.06898,0,.57685],958:[.19444,.69444,.03021,0,.50833],959:[0,.44444,0,0,.58472],960:[0,.44444,.03704,0,.68241],961:[.19444,.44444,0,0,.6118],962:[.09722,.44444,.07917,0,.42361],963:[0,.44444,.03704,0,.68588],964:[0,.44444,.13472,0,.52083],965:[0,.44444,.03704,0,.63055],966:[.19444,.44444,0,0,.74722],967:[.19444,.44444,0,0,.71805],968:[.19444,.69444,.03704,0,.75833],969:[0,.44444,.03704,0,.71782],977:[0,.69444,0,0,.69155],981:[.19444,.69444,0,0,.7125],982:[0,.44444,.03194,0,.975],1009:[.19444,.44444,0,0,.6118],1013:[0,.44444,0,0,.48333],57649:[0,.44444,0,0,.39352],57911:[.19444,.44444,0,0,.43889]},"Math-Italic":{32:[0,0,0,0,.25],48:[0,.43056,0,0,.5],49:[0,.43056,0,0,.5],50:[0,.43056,0,0,.5],51:[.19444,.43056,0,0,.5],52:[.19444,.43056,0,0,.5],53:[.19444,.43056,0,0,.5],54:[0,.64444,0,0,.5],55:[.19444,.43056,0,0,.5],56:[0,.64444,0,0,.5],57:[.19444,.43056,0,0,.5],65:[0,.68333,0,.13889,.75],66:[0,.68333,.05017,.08334,.75851],67:[0,.68333,.07153,.08334,.71472],68:[0,.68333,.02778,.05556,.82792],69:[0,.68333,.05764,.08334,.7382],70:[0,.68333,.13889,.08334,.64306],71:[0,.68333,0,.08334,.78625],72:[0,.68333,.08125,.05556,.83125],73:[0,.68333,.07847,.11111,.43958],74:[0,.68333,.09618,.16667,.55451],75:[0,.68333,.07153,.05556,.84931],76:[0,.68333,0,.02778,.68056],77:[0,.68333,.10903,.08334,.97014],78:[0,.68333,.10903,.08334,.80347],79:[0,.68333,.02778,.08334,.76278],80:[0,.68333,.13889,.08334,.64201],81:[.19444,.68333,0,.08334,.79056],82:[0,.68333,.00773,.08334,.75929],83:[0,.68333,.05764,.08334,.6132],84:[0,.68333,.13889,.08334,.58438],85:[0,.68333,.10903,.02778,.68278],86:[0,.68333,.22222,0,.58333],87:[0,.68333,.13889,0,.94445],88:[0,.68333,.07847,.08334,.82847],89:[0,.68333,.22222,0,.58056],90:[0,.68333,.07153,.08334,.68264],97:[0,.43056,0,0,.52859],98:[0,.69444,0,0,.42917],99:[0,.43056,0,.05556,.43276],100:[0,.69444,0,.16667,.52049],101:[0,.43056,0,.05556,.46563],102:[.19444,.69444,.10764,.16667,.48959],103:[.19444,.43056,.03588,.02778,.47697],104:[0,.69444,0,0,.57616],105:[0,.65952,0,0,.34451],106:[.19444,.65952,.05724,0,.41181],107:[0,.69444,.03148,0,.5206],108:[0,.69444,.01968,.08334,.29838],109:[0,.43056,0,0,.87801],110:[0,.43056,0,0,.60023],111:[0,.43056,0,.05556,.48472],112:[.19444,.43056,0,.08334,.50313],113:[.19444,.43056,.03588,.08334,.44641],114:[0,.43056,.02778,.05556,.45116],115:[0,.43056,0,.05556,.46875],116:[0,.61508,0,.08334,.36111],117:[0,.43056,0,.02778,.57246],118:[0,.43056,.03588,.02778,.48472],119:[0,.43056,.02691,.08334,.71592],120:[0,.43056,0,.02778,.57153],121:[.19444,.43056,.03588,.05556,.49028],122:[0,.43056,.04398,.05556,.46505],160:[0,0,0,0,.25],915:[0,.68333,.13889,.08334,.61528],916:[0,.68333,0,.16667,.83334],920:[0,.68333,.02778,.08334,.76278],923:[0,.68333,0,.16667,.69445],926:[0,.68333,.07569,.08334,.74236],928:[0,.68333,.08125,.05556,.83125],931:[0,.68333,.05764,.08334,.77986],933:[0,.68333,.13889,.05556,.58333],934:[0,.68333,0,.08334,.66667],936:[0,.68333,.11,.05556,.61222],937:[0,.68333,.05017,.08334,.7724],945:[0,.43056,.0037,.02778,.6397],946:[.19444,.69444,.05278,.08334,.56563],947:[.19444,.43056,.05556,0,.51773],948:[0,.69444,.03785,.05556,.44444],949:[0,.43056,0,.08334,.46632],950:[.19444,.69444,.07378,.08334,.4375],951:[.19444,.43056,.03588,.05556,.49653],952:[0,.69444,.02778,.08334,.46944],953:[0,.43056,0,.05556,.35394],954:[0,.43056,0,0,.57616],955:[0,.69444,0,0,.58334],956:[.19444,.43056,0,.02778,.60255],957:[0,.43056,.06366,.02778,.49398],958:[.19444,.69444,.04601,.11111,.4375],959:[0,.43056,0,.05556,.48472],960:[0,.43056,.03588,0,.57003],961:[.19444,.43056,0,.08334,.51702],962:[.09722,.43056,.07986,.08334,.36285],963:[0,.43056,.03588,0,.57141],964:[0,.43056,.1132,.02778,.43715],965:[0,.43056,.03588,.02778,.54028],966:[.19444,.43056,0,.08334,.65417],967:[.19444,.43056,0,.05556,.62569],968:[.19444,.69444,.03588,.11111,.65139],969:[0,.43056,.03588,0,.62245],977:[0,.69444,0,.08334,.59144],981:[.19444,.69444,0,.08334,.59583],982:[0,.43056,.02778,0,.82813],1009:[.19444,.43056,0,.08334,.51702],1013:[0,.43056,0,.05556,.4059],57649:[0,.43056,0,.02778,.32246],57911:[.19444,.43056,0,.08334,.38403]},"SansSerif-Bold":{32:[0,0,0,0,.25],33:[0,.69444,0,0,.36667],34:[0,.69444,0,0,.55834],35:[.19444,.69444,0,0,.91667],36:[.05556,.75,0,0,.55],37:[.05556,.75,0,0,1.02912],38:[0,.69444,0,0,.83056],39:[0,.69444,0,0,.30556],40:[.25,.75,0,0,.42778],41:[.25,.75,0,0,.42778],42:[0,.75,0,0,.55],43:[.11667,.61667,0,0,.85556],44:[.10556,.13056,0,0,.30556],45:[0,.45833,0,0,.36667],46:[0,.13056,0,0,.30556],47:[.25,.75,0,0,.55],48:[0,.69444,0,0,.55],49:[0,.69444,0,0,.55],50:[0,.69444,0,0,.55],51:[0,.69444,0,0,.55],52:[0,.69444,0,0,.55],53:[0,.69444,0,0,.55],54:[0,.69444,0,0,.55],55:[0,.69444,0,0,.55],56:[0,.69444,0,0,.55],57:[0,.69444,0,0,.55],58:[0,.45833,0,0,.30556],59:[.10556,.45833,0,0,.30556],61:[-.09375,.40625,0,0,.85556],63:[0,.69444,0,0,.51945],64:[0,.69444,0,0,.73334],65:[0,.69444,0,0,.73334],66:[0,.69444,0,0,.73334],67:[0,.69444,0,0,.70278],68:[0,.69444,0,0,.79445],69:[0,.69444,0,0,.64167],70:[0,.69444,0,0,.61111],71:[0,.69444,0,0,.73334],72:[0,.69444,0,0,.79445],73:[0,.69444,0,0,.33056],74:[0,.69444,0,0,.51945],75:[0,.69444,0,0,.76389],76:[0,.69444,0,0,.58056],77:[0,.69444,0,0,.97778],78:[0,.69444,0,0,.79445],79:[0,.69444,0,0,.79445],80:[0,.69444,0,0,.70278],81:[.10556,.69444,0,0,.79445],82:[0,.69444,0,0,.70278],83:[0,.69444,0,0,.61111],84:[0,.69444,0,0,.73334],85:[0,.69444,0,0,.76389],86:[0,.69444,.01528,0,.73334],87:[0,.69444,.01528,0,1.03889],88:[0,.69444,0,0,.73334],89:[0,.69444,.0275,0,.73334],90:[0,.69444,0,0,.67223],91:[.25,.75,0,0,.34306],93:[.25,.75,0,0,.34306],94:[0,.69444,0,0,.55],95:[.35,.10833,.03056,0,.55],97:[0,.45833,0,0,.525],98:[0,.69444,0,0,.56111],99:[0,.45833,0,0,.48889],100:[0,.69444,0,0,.56111],101:[0,.45833,0,0,.51111],102:[0,.69444,.07639,0,.33611],103:[.19444,.45833,.01528,0,.55],104:[0,.69444,0,0,.56111],105:[0,.69444,0,0,.25556],106:[.19444,.69444,0,0,.28611],107:[0,.69444,0,0,.53056],108:[0,.69444,0,0,.25556],109:[0,.45833,0,0,.86667],110:[0,.45833,0,0,.56111],111:[0,.45833,0,0,.55],112:[.19444,.45833,0,0,.56111],113:[.19444,.45833,0,0,.56111],114:[0,.45833,.01528,0,.37222],115:[0,.45833,0,0,.42167],116:[0,.58929,0,0,.40417],117:[0,.45833,0,0,.56111],118:[0,.45833,.01528,0,.5],119:[0,.45833,.01528,0,.74445],120:[0,.45833,0,0,.5],121:[.19444,.45833,.01528,0,.5],122:[0,.45833,0,0,.47639],126:[.35,.34444,0,0,.55],160:[0,0,0,0,.25],168:[0,.69444,0,0,.55],176:[0,.69444,0,0,.73334],180:[0,.69444,0,0,.55],184:[.17014,0,0,0,.48889],305:[0,.45833,0,0,.25556],567:[.19444,.45833,0,0,.28611],710:[0,.69444,0,0,.55],711:[0,.63542,0,0,.55],713:[0,.63778,0,0,.55],728:[0,.69444,0,0,.55],729:[0,.69444,0,0,.30556],730:[0,.69444,0,0,.73334],732:[0,.69444,0,0,.55],733:[0,.69444,0,0,.55],915:[0,.69444,0,0,.58056],916:[0,.69444,0,0,.91667],920:[0,.69444,0,0,.85556],923:[0,.69444,0,0,.67223],926:[0,.69444,0,0,.73334],928:[0,.69444,0,0,.79445],931:[0,.69444,0,0,.79445],933:[0,.69444,0,0,.85556],934:[0,.69444,0,0,.79445],936:[0,.69444,0,0,.85556],937:[0,.69444,0,0,.79445],8211:[0,.45833,.03056,0,.55],8212:[0,.45833,.03056,0,1.10001],8216:[0,.69444,0,0,.30556],8217:[0,.69444,0,0,.30556],8220:[0,.69444,0,0,.55834],8221:[0,.69444,0,0,.55834]},"SansSerif-Italic":{32:[0,0,0,0,.25],33:[0,.69444,.05733,0,.31945],34:[0,.69444,.00316,0,.5],35:[.19444,.69444,.05087,0,.83334],36:[.05556,.75,.11156,0,.5],37:[.05556,.75,.03126,0,.83334],38:[0,.69444,.03058,0,.75834],39:[0,.69444,.07816,0,.27778],40:[.25,.75,.13164,0,.38889],41:[.25,.75,.02536,0,.38889],42:[0,.75,.11775,0,.5],43:[.08333,.58333,.02536,0,.77778],44:[.125,.08333,0,0,.27778],45:[0,.44444,.01946,0,.33333],46:[0,.08333,0,0,.27778],47:[.25,.75,.13164,0,.5],48:[0,.65556,.11156,0,.5],49:[0,.65556,.11156,0,.5],50:[0,.65556,.11156,0,.5],51:[0,.65556,.11156,0,.5],52:[0,.65556,.11156,0,.5],53:[0,.65556,.11156,0,.5],54:[0,.65556,.11156,0,.5],55:[0,.65556,.11156,0,.5],56:[0,.65556,.11156,0,.5],57:[0,.65556,.11156,0,.5],58:[0,.44444,.02502,0,.27778],59:[.125,.44444,.02502,0,.27778],61:[-.13,.37,.05087,0,.77778],63:[0,.69444,.11809,0,.47222],64:[0,.69444,.07555,0,.66667],65:[0,.69444,0,0,.66667],66:[0,.69444,.08293,0,.66667],67:[0,.69444,.11983,0,.63889],68:[0,.69444,.07555,0,.72223],69:[0,.69444,.11983,0,.59722],70:[0,.69444,.13372,0,.56945],71:[0,.69444,.11983,0,.66667],72:[0,.69444,.08094,0,.70834],73:[0,.69444,.13372,0,.27778],74:[0,.69444,.08094,0,.47222],75:[0,.69444,.11983,0,.69445],76:[0,.69444,0,0,.54167],77:[0,.69444,.08094,0,.875],78:[0,.69444,.08094,0,.70834],79:[0,.69444,.07555,0,.73611],80:[0,.69444,.08293,0,.63889],81:[.125,.69444,.07555,0,.73611],82:[0,.69444,.08293,0,.64584],83:[0,.69444,.09205,0,.55556],84:[0,.69444,.13372,0,.68056],85:[0,.69444,.08094,0,.6875],86:[0,.69444,.1615,0,.66667],87:[0,.69444,.1615,0,.94445],88:[0,.69444,.13372,0,.66667],89:[0,.69444,.17261,0,.66667],90:[0,.69444,.11983,0,.61111],91:[.25,.75,.15942,0,.28889],93:[.25,.75,.08719,0,.28889],94:[0,.69444,.0799,0,.5],95:[.35,.09444,.08616,0,.5],97:[0,.44444,.00981,0,.48056],98:[0,.69444,.03057,0,.51667],99:[0,.44444,.08336,0,.44445],100:[0,.69444,.09483,0,.51667],101:[0,.44444,.06778,0,.44445],102:[0,.69444,.21705,0,.30556],103:[.19444,.44444,.10836,0,.5],104:[0,.69444,.01778,0,.51667],105:[0,.67937,.09718,0,.23889],106:[.19444,.67937,.09162,0,.26667],107:[0,.69444,.08336,0,.48889],108:[0,.69444,.09483,0,.23889],109:[0,.44444,.01778,0,.79445],110:[0,.44444,.01778,0,.51667],111:[0,.44444,.06613,0,.5],112:[.19444,.44444,.0389,0,.51667],113:[.19444,.44444,.04169,0,.51667],114:[0,.44444,.10836,0,.34167],115:[0,.44444,.0778,0,.38333],116:[0,.57143,.07225,0,.36111],117:[0,.44444,.04169,0,.51667],118:[0,.44444,.10836,0,.46111],119:[0,.44444,.10836,0,.68334],120:[0,.44444,.09169,0,.46111],121:[.19444,.44444,.10836,0,.46111],122:[0,.44444,.08752,0,.43472],126:[.35,.32659,.08826,0,.5],160:[0,0,0,0,.25],168:[0,.67937,.06385,0,.5],176:[0,.69444,0,0,.73752],184:[.17014,0,0,0,.44445],305:[0,.44444,.04169,0,.23889],567:[.19444,.44444,.04169,0,.26667],710:[0,.69444,.0799,0,.5],711:[0,.63194,.08432,0,.5],713:[0,.60889,.08776,0,.5],714:[0,.69444,.09205,0,.5],715:[0,.69444,0,0,.5],728:[0,.69444,.09483,0,.5],729:[0,.67937,.07774,0,.27778],730:[0,.69444,0,0,.73752],732:[0,.67659,.08826,0,.5],733:[0,.69444,.09205,0,.5],915:[0,.69444,.13372,0,.54167],916:[0,.69444,0,0,.83334],920:[0,.69444,.07555,0,.77778],923:[0,.69444,0,0,.61111],926:[0,.69444,.12816,0,.66667],928:[0,.69444,.08094,0,.70834],931:[0,.69444,.11983,0,.72222],933:[0,.69444,.09031,0,.77778],934:[0,.69444,.04603,0,.72222],936:[0,.69444,.09031,0,.77778],937:[0,.69444,.08293,0,.72222],8211:[0,.44444,.08616,0,.5],8212:[0,.44444,.08616,0,1],8216:[0,.69444,.07816,0,.27778],8217:[0,.69444,.07816,0,.27778],8220:[0,.69444,.14205,0,.5],8221:[0,.69444,.00316,0,.5]},"SansSerif-Regular":{32:[0,0,0,0,.25],33:[0,.69444,0,0,.31945],34:[0,.69444,0,0,.5],35:[.19444,.69444,0,0,.83334],36:[.05556,.75,0,0,.5],37:[.05556,.75,0,0,.83334],38:[0,.69444,0,0,.75834],39:[0,.69444,0,0,.27778],40:[.25,.75,0,0,.38889],41:[.25,.75,0,0,.38889],42:[0,.75,0,0,.5],43:[.08333,.58333,0,0,.77778],44:[.125,.08333,0,0,.27778],45:[0,.44444,0,0,.33333],46:[0,.08333,0,0,.27778],47:[.25,.75,0,0,.5],48:[0,.65556,0,0,.5],49:[0,.65556,0,0,.5],50:[0,.65556,0,0,.5],51:[0,.65556,0,0,.5],52:[0,.65556,0,0,.5],53:[0,.65556,0,0,.5],54:[0,.65556,0,0,.5],55:[0,.65556,0,0,.5],56:[0,.65556,0,0,.5],57:[0,.65556,0,0,.5],58:[0,.44444,0,0,.27778],59:[.125,.44444,0,0,.27778],61:[-.13,.37,0,0,.77778],63:[0,.69444,0,0,.47222],64:[0,.69444,0,0,.66667],65:[0,.69444,0,0,.66667],66:[0,.69444,0,0,.66667],67:[0,.69444,0,0,.63889],68:[0,.69444,0,0,.72223],69:[0,.69444,0,0,.59722],70:[0,.69444,0,0,.56945],71:[0,.69444,0,0,.66667],72:[0,.69444,0,0,.70834],73:[0,.69444,0,0,.27778],74:[0,.69444,0,0,.47222],75:[0,.69444,0,0,.69445],76:[0,.69444,0,0,.54167],77:[0,.69444,0,0,.875],78:[0,.69444,0,0,.70834],79:[0,.69444,0,0,.73611],80:[0,.69444,0,0,.63889],81:[.125,.69444,0,0,.73611],82:[0,.69444,0,0,.64584],83:[0,.69444,0,0,.55556],84:[0,.69444,0,0,.68056],85:[0,.69444,0,0,.6875],86:[0,.69444,.01389,0,.66667],87:[0,.69444,.01389,0,.94445],88:[0,.69444,0,0,.66667],89:[0,.69444,.025,0,.66667],90:[0,.69444,0,0,.61111],91:[.25,.75,0,0,.28889],93:[.25,.75,0,0,.28889],94:[0,.69444,0,0,.5],95:[.35,.09444,.02778,0,.5],97:[0,.44444,0,0,.48056],98:[0,.69444,0,0,.51667],99:[0,.44444,0,0,.44445],100:[0,.69444,0,0,.51667],101:[0,.44444,0,0,.44445],102:[0,.69444,.06944,0,.30556],103:[.19444,.44444,.01389,0,.5],104:[0,.69444,0,0,.51667],105:[0,.67937,0,0,.23889],106:[.19444,.67937,0,0,.26667],107:[0,.69444,0,0,.48889],108:[0,.69444,0,0,.23889],109:[0,.44444,0,0,.79445],110:[0,.44444,0,0,.51667],111:[0,.44444,0,0,.5],112:[.19444,.44444,0,0,.51667],113:[.19444,.44444,0,0,.51667],114:[0,.44444,.01389,0,.34167],115:[0,.44444,0,0,.38333],116:[0,.57143,0,0,.36111],117:[0,.44444,0,0,.51667],118:[0,.44444,.01389,0,.46111],119:[0,.44444,.01389,0,.68334],120:[0,.44444,0,0,.46111],121:[.19444,.44444,.01389,0,.46111],122:[0,.44444,0,0,.43472],126:[.35,.32659,0,0,.5],160:[0,0,0,0,.25],168:[0,.67937,0,0,.5],176:[0,.69444,0,0,.66667],184:[.17014,0,0,0,.44445],305:[0,.44444,0,0,.23889],567:[.19444,.44444,0,0,.26667],710:[0,.69444,0,0,.5],711:[0,.63194,0,0,.5],713:[0,.60889,0,0,.5],714:[0,.69444,0,0,.5],715:[0,.69444,0,0,.5],728:[0,.69444,0,0,.5],729:[0,.67937,0,0,.27778],730:[0,.69444,0,0,.66667],732:[0,.67659,0,0,.5],733:[0,.69444,0,0,.5],915:[0,.69444,0,0,.54167],916:[0,.69444,0,0,.83334],920:[0,.69444,0,0,.77778],923:[0,.69444,0,0,.61111],926:[0,.69444,0,0,.66667],928:[0,.69444,0,0,.70834],931:[0,.69444,0,0,.72222],933:[0,.69444,0,0,.77778],934:[0,.69444,0,0,.72222],936:[0,.69444,0,0,.77778],937:[0,.69444,0,0,.72222],8211:[0,.44444,.02778,0,.5],8212:[0,.44444,.02778,0,1],8216:[0,.69444,0,0,.27778],8217:[0,.69444,0,0,.27778],8220:[0,.69444,0,0,.5],8221:[0,.69444,0,0,.5]},"Script-Regular":{32:[0,0,0,0,.25],65:[0,.7,.22925,0,.80253],66:[0,.7,.04087,0,.90757],67:[0,.7,.1689,0,.66619],68:[0,.7,.09371,0,.77443],69:[0,.7,.18583,0,.56162],70:[0,.7,.13634,0,.89544],71:[0,.7,.17322,0,.60961],72:[0,.7,.29694,0,.96919],73:[0,.7,.19189,0,.80907],74:[.27778,.7,.19189,0,1.05159],75:[0,.7,.31259,0,.91364],76:[0,.7,.19189,0,.87373],77:[0,.7,.15981,0,1.08031],78:[0,.7,.3525,0,.9015],79:[0,.7,.08078,0,.73787],80:[0,.7,.08078,0,1.01262],81:[0,.7,.03305,0,.88282],82:[0,.7,.06259,0,.85],83:[0,.7,.19189,0,.86767],84:[0,.7,.29087,0,.74697],85:[0,.7,.25815,0,.79996],86:[0,.7,.27523,0,.62204],87:[0,.7,.27523,0,.80532],88:[0,.7,.26006,0,.94445],89:[0,.7,.2939,0,.70961],90:[0,.7,.24037,0,.8212],160:[0,0,0,0,.25]},"Size1-Regular":{32:[0,0,0,0,.25],40:[.35001,.85,0,0,.45834],41:[.35001,.85,0,0,.45834],47:[.35001,.85,0,0,.57778],91:[.35001,.85,0,0,.41667],92:[.35001,.85,0,0,.57778],93:[.35001,.85,0,0,.41667],123:[.35001,.85,0,0,.58334],125:[.35001,.85,0,0,.58334],160:[0,0,0,0,.25],710:[0,.72222,0,0,.55556],732:[0,.72222,0,0,.55556],770:[0,.72222,0,0,.55556],771:[0,.72222,0,0,.55556],8214:[-99e-5,.601,0,0,.77778],8593:[1e-5,.6,0,0,.66667],8595:[1e-5,.6,0,0,.66667],8657:[1e-5,.6,0,0,.77778],8659:[1e-5,.6,0,0,.77778],8719:[.25001,.75,0,0,.94445],8720:[.25001,.75,0,0,.94445],8721:[.25001,.75,0,0,1.05556],8730:[.35001,.85,0,0,1],8739:[-.00599,.606,0,0,.33333],8741:[-.00599,.606,0,0,.55556],8747:[.30612,.805,.19445,0,.47222],8748:[.306,.805,.19445,0,.47222],8749:[.306,.805,.19445,0,.47222],8750:[.30612,.805,.19445,0,.47222],8896:[.25001,.75,0,0,.83334],8897:[.25001,.75,0,0,.83334],8898:[.25001,.75,0,0,.83334],8899:[.25001,.75,0,0,.83334],8968:[.35001,.85,0,0,.47222],8969:[.35001,.85,0,0,.47222],8970:[.35001,.85,0,0,.47222],8971:[.35001,.85,0,0,.47222],9168:[-99e-5,.601,0,0,.66667],10216:[.35001,.85,0,0,.47222],10217:[.35001,.85,0,0,.47222],10752:[.25001,.75,0,0,1.11111],10753:[.25001,.75,0,0,1.11111],10754:[.25001,.75,0,0,1.11111],10756:[.25001,.75,0,0,.83334],10758:[.25001,.75,0,0,.83334]},"Size2-Regular":{32:[0,0,0,0,.25],40:[.65002,1.15,0,0,.59722],41:[.65002,1.15,0,0,.59722],47:[.65002,1.15,0,0,.81111],91:[.65002,1.15,0,0,.47222],92:[.65002,1.15,0,0,.81111],93:[.65002,1.15,0,0,.47222],123:[.65002,1.15,0,0,.66667],125:[.65002,1.15,0,0,.66667],160:[0,0,0,0,.25],710:[0,.75,0,0,1],732:[0,.75,0,0,1],770:[0,.75,0,0,1],771:[0,.75,0,0,1],8719:[.55001,1.05,0,0,1.27778],8720:[.55001,1.05,0,0,1.27778],8721:[.55001,1.05,0,0,1.44445],8730:[.65002,1.15,0,0,1],8747:[.86225,1.36,.44445,0,.55556],8748:[.862,1.36,.44445,0,.55556],8749:[.862,1.36,.44445,0,.55556],8750:[.86225,1.36,.44445,0,.55556],8896:[.55001,1.05,0,0,1.11111],8897:[.55001,1.05,0,0,1.11111],8898:[.55001,1.05,0,0,1.11111],8899:[.55001,1.05,0,0,1.11111],8968:[.65002,1.15,0,0,.52778],8969:[.65002,1.15,0,0,.52778],8970:[.65002,1.15,0,0,.52778],8971:[.65002,1.15,0,0,.52778],10216:[.65002,1.15,0,0,.61111],10217:[.65002,1.15,0,0,.61111],10752:[.55001,1.05,0,0,1.51112],10753:[.55001,1.05,0,0,1.51112],10754:[.55001,1.05,0,0,1.51112],10756:[.55001,1.05,0,0,1.11111],10758:[.55001,1.05,0,0,1.11111]},"Size3-Regular":{32:[0,0,0,0,.25],40:[.95003,1.45,0,0,.73611],41:[.95003,1.45,0,0,.73611],47:[.95003,1.45,0,0,1.04445],91:[.95003,1.45,0,0,.52778],92:[.95003,1.45,0,0,1.04445],93:[.95003,1.45,0,0,.52778],123:[.95003,1.45,0,0,.75],125:[.95003,1.45,0,0,.75],160:[0,0,0,0,.25],710:[0,.75,0,0,1.44445],732:[0,.75,0,0,1.44445],770:[0,.75,0,0,1.44445],771:[0,.75,0,0,1.44445],8730:[.95003,1.45,0,0,1],8968:[.95003,1.45,0,0,.58334],8969:[.95003,1.45,0,0,.58334],8970:[.95003,1.45,0,0,.58334],8971:[.95003,1.45,0,0,.58334],10216:[.95003,1.45,0,0,.75],10217:[.95003,1.45,0,0,.75]},"Size4-Regular":{32:[0,0,0,0,.25],40:[1.25003,1.75,0,0,.79167],41:[1.25003,1.75,0,0,.79167],47:[1.25003,1.75,0,0,1.27778],91:[1.25003,1.75,0,0,.58334],92:[1.25003,1.75,0,0,1.27778],93:[1.25003,1.75,0,0,.58334],123:[1.25003,1.75,0,0,.80556],125:[1.25003,1.75,0,0,.80556],160:[0,0,0,0,.25],710:[0,.825,0,0,1.8889],732:[0,.825,0,0,1.8889],770:[0,.825,0,0,1.8889],771:[0,.825,0,0,1.8889],8730:[1.25003,1.75,0,0,1],8968:[1.25003,1.75,0,0,.63889],8969:[1.25003,1.75,0,0,.63889],8970:[1.25003,1.75,0,0,.63889],8971:[1.25003,1.75,0,0,.63889],9115:[.64502,1.155,0,0,.875],9116:[1e-5,.6,0,0,.875],9117:[.64502,1.155,0,0,.875],9118:[.64502,1.155,0,0,.875],9119:[1e-5,.6,0,0,.875],9120:[.64502,1.155,0,0,.875],9121:[.64502,1.155,0,0,.66667],9122:[-99e-5,.601,0,0,.66667],9123:[.64502,1.155,0,0,.66667],9124:[.64502,1.155,0,0,.66667],9125:[-99e-5,.601,0,0,.66667],9126:[.64502,1.155,0,0,.66667],9127:[1e-5,.9,0,0,.88889],9128:[.65002,1.15,0,0,.88889],9129:[.90001,0,0,0,.88889],9130:[0,.3,0,0,.88889],9131:[1e-5,.9,0,0,.88889],9132:[.65002,1.15,0,0,.88889],9133:[.90001,0,0,0,.88889],9143:[.88502,.915,0,0,1.05556],10216:[1.25003,1.75,0,0,.80556],10217:[1.25003,1.75,0,0,.80556],57344:[-.00499,.605,0,0,1.05556],57345:[-.00499,.605,0,0,1.05556],57680:[0,.12,0,0,.45],57681:[0,.12,0,0,.45],57682:[0,.12,0,0,.45],57683:[0,.12,0,0,.45]},"Typewriter-Regular":{32:[0,0,0,0,.525],33:[0,.61111,0,0,.525],34:[0,.61111,0,0,.525],35:[0,.61111,0,0,.525],36:[.08333,.69444,0,0,.525],37:[.08333,.69444,0,0,.525],38:[0,.61111,0,0,.525],39:[0,.61111,0,0,.525],40:[.08333,.69444,0,0,.525],41:[.08333,.69444,0,0,.525],42:[0,.52083,0,0,.525],43:[-.08056,.53055,0,0,.525],44:[.13889,.125,0,0,.525],45:[-.08056,.53055,0,0,.525],46:[0,.125,0,0,.525],47:[.08333,.69444,0,0,.525],48:[0,.61111,0,0,.525],49:[0,.61111,0,0,.525],50:[0,.61111,0,0,.525],51:[0,.61111,0,0,.525],52:[0,.61111,0,0,.525],53:[0,.61111,0,0,.525],54:[0,.61111,0,0,.525],55:[0,.61111,0,0,.525],56:[0,.61111,0,0,.525],57:[0,.61111,0,0,.525],58:[0,.43056,0,0,.525],59:[.13889,.43056,0,0,.525],60:[-.05556,.55556,0,0,.525],61:[-.19549,.41562,0,0,.525],62:[-.05556,.55556,0,0,.525],63:[0,.61111,0,0,.525],64:[0,.61111,0,0,.525],65:[0,.61111,0,0,.525],66:[0,.61111,0,0,.525],67:[0,.61111,0,0,.525],68:[0,.61111,0,0,.525],69:[0,.61111,0,0,.525],70:[0,.61111,0,0,.525],71:[0,.61111,0,0,.525],72:[0,.61111,0,0,.525],73:[0,.61111,0,0,.525],74:[0,.61111,0,0,.525],75:[0,.61111,0,0,.525],76:[0,.61111,0,0,.525],77:[0,.61111,0,0,.525],78:[0,.61111,0,0,.525],79:[0,.61111,0,0,.525],80:[0,.61111,0,0,.525],81:[.13889,.61111,0,0,.525],82:[0,.61111,0,0,.525],83:[0,.61111,0,0,.525],84:[0,.61111,0,0,.525],85:[0,.61111,0,0,.525],86:[0,.61111,0,0,.525],87:[0,.61111,0,0,.525],88:[0,.61111,0,0,.525],89:[0,.61111,0,0,.525],90:[0,.61111,0,0,.525],91:[.08333,.69444,0,0,.525],92:[.08333,.69444,0,0,.525],93:[.08333,.69444,0,0,.525],94:[0,.61111,0,0,.525],95:[.09514,0,0,0,.525],96:[0,.61111,0,0,.525],97:[0,.43056,0,0,.525],98:[0,.61111,0,0,.525],99:[0,.43056,0,0,.525],100:[0,.61111,0,0,.525],101:[0,.43056,0,0,.525],102:[0,.61111,0,0,.525],103:[.22222,.43056,0,0,.525],104:[0,.61111,0,0,.525],105:[0,.61111,0,0,.525],106:[.22222,.61111,0,0,.525],107:[0,.61111,0,0,.525],108:[0,.61111,0,0,.525],109:[0,.43056,0,0,.525],110:[0,.43056,0,0,.525],111:[0,.43056,0,0,.525],112:[.22222,.43056,0,0,.525],113:[.22222,.43056,0,0,.525],114:[0,.43056,0,0,.525],115:[0,.43056,0,0,.525],116:[0,.55358,0,0,.525],117:[0,.43056,0,0,.525],118:[0,.43056,0,0,.525],119:[0,.43056,0,0,.525],120:[0,.43056,0,0,.525],121:[.22222,.43056,0,0,.525],122:[0,.43056,0,0,.525],123:[.08333,.69444,0,0,.525],124:[.08333,.69444,0,0,.525],125:[.08333,.69444,0,0,.525],126:[0,.61111,0,0,.525],127:[0,.61111,0,0,.525],160:[0,0,0,0,.525],176:[0,.61111,0,0,.525],184:[.19445,0,0,0,.525],305:[0,.43056,0,0,.525],567:[.22222,.43056,0,0,.525],711:[0,.56597,0,0,.525],713:[0,.56555,0,0,.525],714:[0,.61111,0,0,.525],715:[0,.61111,0,0,.525],728:[0,.61111,0,0,.525],730:[0,.61111,0,0,.525],770:[0,.61111,0,0,.525],771:[0,.61111,0,0,.525],776:[0,.61111,0,0,.525],915:[0,.61111,0,0,.525],916:[0,.61111,0,0,.525],920:[0,.61111,0,0,.525],923:[0,.61111,0,0,.525],926:[0,.61111,0,0,.525],928:[0,.61111,0,0,.525],931:[0,.61111,0,0,.525],933:[0,.61111,0,0,.525],934:[0,.61111,0,0,.525],936:[0,.61111,0,0,.525],937:[0,.61111,0,0,.525],8216:[0,.61111,0,0,.525],8217:[0,.61111,0,0,.525],8242:[0,.61111,0,0,.525],9251:[.11111,.21944,0,0,.525]}},Ea={slant:[.25,.25,.25],space:[0,0,0],stretch:[0,0,0],shrink:[0,0,0],xHeight:[.431,.431,.431],quad:[1,1.171,1.472],extraSpace:[0,0,0],num1:[.677,.732,.925],num2:[.394,.384,.387],num3:[.444,.471,.504],denom1:[.686,.752,1.025],denom2:[.345,.344,.532],sup1:[.413,.503,.504],sup2:[.363,.431,.404],sup3:[.289,.286,.294],sub1:[.15,.143,.2],sub2:[.247,.286,.4],supDrop:[.386,.353,.494],subDrop:[.05,.071,.1],delim1:[2.39,1.7,1.98],delim2:[1.01,1.157,1.42],axisHeight:[.25,.25,.25],defaultRuleThickness:[.04,.049,.049],bigOpSpacing1:[.111,.111,.111],bigOpSpacing2:[.166,.166,.166],bigOpSpacing3:[.2,.2,.2],bigOpSpacing4:[.6,.611,.611],bigOpSpacing5:[.1,.143,.143],sqrtRuleThickness:[.04,.04,.04],ptPerEm:[10,10,10],doubleRuleSep:[.2,.2,.2],arrayRuleWidth:[.04,.04,.04],fboxsep:[.3,.3,.3],fboxrule:[.04,.04,.04]},ac={Å:"A",Ð:"D",Þ:"o",å:"a",ð:"d",þ:"o",А:"A",Б:"B",В:"B",Г:"F",Д:"A",Е:"E",Ж:"K",З:"3",И:"N",Й:"N",К:"K",Л:"N",М:"M",Н:"H",О:"O",П:"N",Р:"P",С:"C",Т:"T",У:"y",Ф:"O",Х:"X",Ц:"U",Ч:"h",Ш:"W",Щ:"W",Ъ:"B",Ы:"X",Ь:"B",Э:"3",Ю:"X",Я:"R",а:"a",б:"b",в:"a",г:"r",д:"y",е:"e",ж:"m",з:"e",и:"n",й:"n",к:"n",л:"n",м:"m",н:"n",о:"o",п:"n",р:"p",с:"c",т:"o",у:"y",ф:"b",х:"x",ц:"n",ч:"n",ш:"w",щ:"w",ъ:"a",ы:"m",ь:"a",э:"e",ю:"m",я:"r"};function pg(i,e){kn[i]=e}function I0(i,e,t){if(!kn[e])throw new Error("Font metrics not found for font: "+e+".");var n=i.charCodeAt(0),r=kn[e][n];if(!r&&i[0]in ac&&(n=ac[i[0]].charCodeAt(0),r=kn[e][n]),!r&&t==="text"&&Eu(n)&&(r=kn[e][77]),r)return{depth:r[0],height:r[1],italic:r[2],skew:r[3],width:r[4]}}var Ks={};function mg(i){var e;if(i>=5?e=0:i>=3?e=1:e=2,!Ks[e]){var t=Ks[e]={cssEmPerMu:Ea.quad[e]/18};for(var n in Ea)Ea.hasOwnProperty(n)&&(t[n]=Ea[n][e])}return Ks[e]}var wt={math:{},text:{}};function d(i,e,t,n,r,a){wt[i][r]={font:e,group:t,replace:n},a&&n&&(wt[i][n]=wt[i][r])}var v="math",re="text",_="main",P="ams",Tt="accent-token",Ee="bin",Qt="close",Pr="inner",He="mathord",Nt="op-token",pn="open",Jr="punct",L="rel",ai="spacing",k="textord";d(v,_,L,"≡","\\equiv",!0);d(v,_,L,"≺","\\prec",!0);d(v,_,L,"≻","\\succ",!0);d(v,_,L,"∼","\\sim",!0);d(v,_,L,"⊥","\\perp");d(v,_,L,"⪯","\\preceq",!0);d(v,_,L,"⪰","\\succeq",!0);d(v,_,L,"≃","\\simeq",!0);d(v,_,L,"∣","\\mid",!0);d(v,_,L,"≪","\\ll",!0);d(v,_,L,"≫","\\gg",!0);d(v,_,L,"≍","\\asymp",!0);d(v,_,L,"∥","\\parallel");d(v,_,L,"⋈","\\bowtie",!0);d(v,_,L,"⌣","\\smile",!0);d(v,_,L,"⊑","\\sqsubseteq",!0);d(v,_,L,"⊒","\\sqsupseteq",!0);d(v,_,L,"≐","\\doteq",!0);d(v,_,L,"⌢","\\frown",!0);d(v,_,L,"∋","\\ni",!0);d(v,_,L,"∝","\\propto",!0);d(v,_,L,"⊢","\\vdash",!0);d(v,_,L,"⊣","\\dashv",!0);d(v,_,L,"∋","\\owns");d(v,_,Jr,".","\\ldotp");d(v,_,Jr,"⋅","\\cdotp");d(v,_,Jr,"⋅","·");d(re,_,k,"⋅","·");d(v,_,k,"#","\\#");d(re,_,k,"#","\\#");d(v,_,k,"&","\\&");d(re,_,k,"&","\\&");d(v,_,k,"ℵ","\\aleph",!0);d(v,_,k,"∀","\\forall",!0);d(v,_,k,"ℏ","\\hbar",!0);d(v,_,k,"∃","\\exists",!0);d(v,_,k,"∇","\\nabla",!0);d(v,_,k,"♭","\\flat",!0);d(v,_,k,"ℓ","\\ell",!0);d(v,_,k,"♮","\\natural",!0);d(v,_,k,"♣","\\clubsuit",!0);d(v,_,k,"℘","\\wp",!0);d(v,_,k,"♯","\\sharp",!0);d(v,_,k,"♢","\\diamondsuit",!0);d(v,_,k,"ℜ","\\Re",!0);d(v,_,k,"♡","\\heartsuit",!0);d(v,_,k,"ℑ","\\Im",!0);d(v,_,k,"♠","\\spadesuit",!0);d(v,_,k,"§","\\S",!0);d(re,_,k,"§","\\S");d(v,_,k,"¶","\\P",!0);d(re,_,k,"¶","\\P");d(v,_,k,"†","\\dag");d(re,_,k,"†","\\dag");d(re,_,k,"†","\\textdagger");d(v,_,k,"‡","\\ddag");d(re,_,k,"‡","\\ddag");d(re,_,k,"‡","\\textdaggerdbl");d(v,_,Qt,"⎱","\\rmoustache",!0);d(v,_,pn,"⎰","\\lmoustache",!0);d(v,_,Qt,"⟯","\\rgroup",!0);d(v,_,pn,"⟮","\\lgroup",!0);d(v,_,Ee,"∓","\\mp",!0);d(v,_,Ee,"⊖","\\ominus",!0);d(v,_,Ee,"⊎","\\uplus",!0);d(v,_,Ee,"⊓","\\sqcap",!0);d(v,_,Ee,"∗","\\ast");d(v,_,Ee,"⊔","\\sqcup",!0);d(v,_,Ee,"◯","\\bigcirc",!0);d(v,_,Ee,"∙","\\bullet",!0);d(v,_,Ee,"‡","\\ddagger");d(v,_,Ee,"≀","\\wr",!0);d(v,_,Ee,"⨿","\\amalg");d(v,_,Ee,"&","\\And");d(v,_,L,"⟵","\\longleftarrow",!0);d(v,_,L,"⇐","\\Leftarrow",!0);d(v,_,L,"⟸","\\Longleftarrow",!0);d(v,_,L,"⟶","\\longrightarrow",!0);d(v,_,L,"⇒","\\Rightarrow",!0);d(v,_,L,"⟹","\\Longrightarrow",!0);d(v,_,L,"↔","\\leftrightarrow",!0);d(v,_,L,"⟷","\\longleftrightarrow",!0);d(v,_,L,"⇔","\\Leftrightarrow",!0);d(v,_,L,"⟺","\\Longleftrightarrow",!0);d(v,_,L,"↦","\\mapsto",!0);d(v,_,L,"⟼","\\longmapsto",!0);d(v,_,L,"↗","\\nearrow",!0);d(v,_,L,"↩","\\hookleftarrow",!0);d(v,_,L,"↪","\\hookrightarrow",!0);d(v,_,L,"↘","\\searrow",!0);d(v,_,L,"↼","\\leftharpoonup",!0);d(v,_,L,"⇀","\\rightharpoonup",!0);d(v,_,L,"↙","\\swarrow",!0);d(v,_,L,"↽","\\leftharpoondown",!0);d(v,_,L,"⇁","\\rightharpoondown",!0);d(v,_,L,"↖","\\nwarrow",!0);d(v,_,L,"⇌","\\rightleftharpoons",!0);d(v,P,L,"≮","\\nless",!0);d(v,P,L,"","\\@nleqslant");d(v,P,L,"","\\@nleqq");d(v,P,L,"⪇","\\lneq",!0);d(v,P,L,"≨","\\lneqq",!0);d(v,P,L,"","\\@lvertneqq");d(v,P,L,"⋦","\\lnsim",!0);d(v,P,L,"⪉","\\lnapprox",!0);d(v,P,L,"⊀","\\nprec",!0);d(v,P,L,"⋠","\\npreceq",!0);d(v,P,L,"⋨","\\precnsim",!0);d(v,P,L,"⪹","\\precnapprox",!0);d(v,P,L,"≁","\\nsim",!0);d(v,P,L,"","\\@nshortmid");d(v,P,L,"∤","\\nmid",!0);d(v,P,L,"⊬","\\nvdash",!0);d(v,P,L,"⊭","\\nvDash",!0);d(v,P,L,"⋪","\\ntriangleleft");d(v,P,L,"⋬","\\ntrianglelefteq",!0);d(v,P,L,"⊊","\\subsetneq",!0);d(v,P,L,"","\\@varsubsetneq");d(v,P,L,"⫋","\\subsetneqq",!0);d(v,P,L,"","\\@varsubsetneqq");d(v,P,L,"≯","\\ngtr",!0);d(v,P,L,"","\\@ngeqslant");d(v,P,L,"","\\@ngeqq");d(v,P,L,"⪈","\\gneq",!0);d(v,P,L,"≩","\\gneqq",!0);d(v,P,L,"","\\@gvertneqq");d(v,P,L,"⋧","\\gnsim",!0);d(v,P,L,"⪊","\\gnapprox",!0);d(v,P,L,"⊁","\\nsucc",!0);d(v,P,L,"⋡","\\nsucceq",!0);d(v,P,L,"⋩","\\succnsim",!0);d(v,P,L,"⪺","\\succnapprox",!0);d(v,P,L,"≆","\\ncong",!0);d(v,P,L,"","\\@nshortparallel");d(v,P,L,"∦","\\nparallel",!0);d(v,P,L,"⊯","\\nVDash",!0);d(v,P,L,"⋫","\\ntriangleright");d(v,P,L,"⋭","\\ntrianglerighteq",!0);d(v,P,L,"","\\@nsupseteqq");d(v,P,L,"⊋","\\supsetneq",!0);d(v,P,L,"","\\@varsupsetneq");d(v,P,L,"⫌","\\supsetneqq",!0);d(v,P,L,"","\\@varsupsetneqq");d(v,P,L,"⊮","\\nVdash",!0);d(v,P,L,"⪵","\\precneqq",!0);d(v,P,L,"⪶","\\succneqq",!0);d(v,P,L,"","\\@nsubseteqq");d(v,P,Ee,"⊴","\\unlhd");d(v,P,Ee,"⊵","\\unrhd");d(v,P,L,"↚","\\nleftarrow",!0);d(v,P,L,"↛","\\nrightarrow",!0);d(v,P,L,"⇍","\\nLeftarrow",!0);d(v,P,L,"⇏","\\nRightarrow",!0);d(v,P,L,"↮","\\nleftrightarrow",!0);d(v,P,L,"⇎","\\nLeftrightarrow",!0);d(v,P,L,"△","\\vartriangle");d(v,P,k,"ℏ","\\hslash");d(v,P,k,"▽","\\triangledown");d(v,P,k,"◊","\\lozenge");d(v,P,k,"Ⓢ","\\circledS");d(v,P,k,"®","\\circledR");d(re,P,k,"®","\\circledR");d(v,P,k,"∡","\\measuredangle",!0);d(v,P,k,"∄","\\nexists");d(v,P,k,"℧","\\mho");d(v,P,k,"Ⅎ","\\Finv",!0);d(v,P,k,"⅁","\\Game",!0);d(v,P,k,"‵","\\backprime");d(v,P,k,"▲","\\blacktriangle");d(v,P,k,"▼","\\blacktriangledown");d(v,P,k,"■","\\blacksquare");d(v,P,k,"⧫","\\blacklozenge");d(v,P,k,"★","\\bigstar");d(v,P,k,"∢","\\sphericalangle",!0);d(v,P,k,"∁","\\complement",!0);d(v,P,k,"ð","\\eth",!0);d(re,_,k,"ð","ð");d(v,P,k,"╱","\\diagup");d(v,P,k,"╲","\\diagdown");d(v,P,k,"□","\\square");d(v,P,k,"□","\\Box");d(v,P,k,"◊","\\Diamond");d(v,P,k,"¥","\\yen",!0);d(re,P,k,"¥","\\yen",!0);d(v,P,k,"✓","\\checkmark",!0);d(re,P,k,"✓","\\checkmark");d(v,P,k,"ℶ","\\beth",!0);d(v,P,k,"ℸ","\\daleth",!0);d(v,P,k,"ℷ","\\gimel",!0);d(v,P,k,"ϝ","\\digamma",!0);d(v,P,k,"ϰ","\\varkappa");d(v,P,pn,"┌","\\@ulcorner",!0);d(v,P,Qt,"┐","\\@urcorner",!0);d(v,P,pn,"└","\\@llcorner",!0);d(v,P,Qt,"┘","\\@lrcorner",!0);d(v,P,L,"≦","\\leqq",!0);d(v,P,L,"⩽","\\leqslant",!0);d(v,P,L,"⪕","\\eqslantless",!0);d(v,P,L,"≲","\\lesssim",!0);d(v,P,L,"⪅","\\lessapprox",!0);d(v,P,L,"≊","\\approxeq",!0);d(v,P,Ee,"⋖","\\lessdot");d(v,P,L,"⋘","\\lll",!0);d(v,P,L,"≶","\\lessgtr",!0);d(v,P,L,"⋚","\\lesseqgtr",!0);d(v,P,L,"⪋","\\lesseqqgtr",!0);d(v,P,L,"≑","\\doteqdot");d(v,P,L,"≓","\\risingdotseq",!0);d(v,P,L,"≒","\\fallingdotseq",!0);d(v,P,L,"∽","\\backsim",!0);d(v,P,L,"⋍","\\backsimeq",!0);d(v,P,L,"⫅","\\subseteqq",!0);d(v,P,L,"⋐","\\Subset",!0);d(v,P,L,"⊏","\\sqsubset",!0);d(v,P,L,"≼","\\preccurlyeq",!0);d(v,P,L,"⋞","\\curlyeqprec",!0);d(v,P,L,"≾","\\precsim",!0);d(v,P,L,"⪷","\\precapprox",!0);d(v,P,L,"⊲","\\vartriangleleft");d(v,P,L,"⊴","\\trianglelefteq");d(v,P,L,"⊨","\\vDash",!0);d(v,P,L,"⊪","\\Vvdash",!0);d(v,P,L,"⌣","\\smallsmile");d(v,P,L,"⌢","\\smallfrown");d(v,P,L,"≏","\\bumpeq",!0);d(v,P,L,"≎","\\Bumpeq",!0);d(v,P,L,"≧","\\geqq",!0);d(v,P,L,"⩾","\\geqslant",!0);d(v,P,L,"⪖","\\eqslantgtr",!0);d(v,P,L,"≳","\\gtrsim",!0);d(v,P,L,"⪆","\\gtrapprox",!0);d(v,P,Ee,"⋗","\\gtrdot");d(v,P,L,"⋙","\\ggg",!0);d(v,P,L,"≷","\\gtrless",!0);d(v,P,L,"⋛","\\gtreqless",!0);d(v,P,L,"⪌","\\gtreqqless",!0);d(v,P,L,"≖","\\eqcirc",!0);d(v,P,L,"≗","\\circeq",!0);d(v,P,L,"≜","\\triangleq",!0);d(v,P,L,"∼","\\thicksim");d(v,P,L,"≈","\\thickapprox");d(v,P,L,"⫆","\\supseteqq",!0);d(v,P,L,"⋑","\\Supset",!0);d(v,P,L,"⊐","\\sqsupset",!0);d(v,P,L,"≽","\\succcurlyeq",!0);d(v,P,L,"⋟","\\curlyeqsucc",!0);d(v,P,L,"≿","\\succsim",!0);d(v,P,L,"⪸","\\succapprox",!0);d(v,P,L,"⊳","\\vartriangleright");d(v,P,L,"⊵","\\trianglerighteq");d(v,P,L,"⊩","\\Vdash",!0);d(v,P,L,"∣","\\shortmid");d(v,P,L,"∥","\\shortparallel");d(v,P,L,"≬","\\between",!0);d(v,P,L,"⋔","\\pitchfork",!0);d(v,P,L,"∝","\\varpropto");d(v,P,L,"◀","\\blacktriangleleft");d(v,P,L,"∴","\\therefore",!0);d(v,P,L,"∍","\\backepsilon");d(v,P,L,"▶","\\blacktriangleright");d(v,P,L,"∵","\\because",!0);d(v,P,L,"⋘","\\llless");d(v,P,L,"⋙","\\gggtr");d(v,P,Ee,"⊲","\\lhd");d(v,P,Ee,"⊳","\\rhd");d(v,P,L,"≂","\\eqsim",!0);d(v,_,L,"⋈","\\Join");d(v,P,L,"≑","\\Doteq",!0);d(v,P,Ee,"∔","\\dotplus",!0);d(v,P,Ee,"∖","\\smallsetminus");d(v,P,Ee,"⋒","\\Cap",!0);d(v,P,Ee,"⋓","\\Cup",!0);d(v,P,Ee,"⩞","\\doublebarwedge",!0);d(v,P,Ee,"⊟","\\boxminus",!0);d(v,P,Ee,"⊞","\\boxplus",!0);d(v,P,Ee,"⋇","\\divideontimes",!0);d(v,P,Ee,"⋉","\\ltimes",!0);d(v,P,Ee,"⋊","\\rtimes",!0);d(v,P,Ee,"⋋","\\leftthreetimes",!0);d(v,P,Ee,"⋌","\\rightthreetimes",!0);d(v,P,Ee,"⋏","\\curlywedge",!0);d(v,P,Ee,"⋎","\\curlyvee",!0);d(v,P,Ee,"⊝","\\circleddash",!0);d(v,P,Ee,"⊛","\\circledast",!0);d(v,P,Ee,"⋅","\\centerdot");d(v,P,Ee,"⊺","\\intercal",!0);d(v,P,Ee,"⋒","\\doublecap");d(v,P,Ee,"⋓","\\doublecup");d(v,P,Ee,"⊠","\\boxtimes",!0);d(v,P,L,"⇢","\\dashrightarrow",!0);d(v,P,L,"⇠","\\dashleftarrow",!0);d(v,P,L,"⇇","\\leftleftarrows",!0);d(v,P,L,"⇆","\\leftrightarrows",!0);d(v,P,L,"⇚","\\Lleftarrow",!0);d(v,P,L,"↞","\\twoheadleftarrow",!0);d(v,P,L,"↢","\\leftarrowtail",!0);d(v,P,L,"↫","\\looparrowleft",!0);d(v,P,L,"⇋","\\leftrightharpoons",!0);d(v,P,L,"↶","\\curvearrowleft",!0);d(v,P,L,"↺","\\circlearrowleft",!0);d(v,P,L,"↰","\\Lsh",!0);d(v,P,L,"⇈","\\upuparrows",!0);d(v,P,L,"↿","\\upharpoonleft",!0);d(v,P,L,"⇃","\\downharpoonleft",!0);d(v,_,L,"⊶","\\origof",!0);d(v,_,L,"⊷","\\imageof",!0);d(v,P,L,"⊸","\\multimap",!0);d(v,P,L,"↭","\\leftrightsquigarrow",!0);d(v,P,L,"⇉","\\rightrightarrows",!0);d(v,P,L,"⇄","\\rightleftarrows",!0);d(v,P,L,"↠","\\twoheadrightarrow",!0);d(v,P,L,"↣","\\rightarrowtail",!0);d(v,P,L,"↬","\\looparrowright",!0);d(v,P,L,"↷","\\curvearrowright",!0);d(v,P,L,"↻","\\circlearrowright",!0);d(v,P,L,"↱","\\Rsh",!0);d(v,P,L,"⇊","\\downdownarrows",!0);d(v,P,L,"↾","\\upharpoonright",!0);d(v,P,L,"⇂","\\downharpoonright",!0);d(v,P,L,"⇝","\\rightsquigarrow",!0);d(v,P,L,"⇝","\\leadsto");d(v,P,L,"⇛","\\Rrightarrow",!0);d(v,P,L,"↾","\\restriction");d(v,_,k,"‘","`");d(v,_,k,"$","\\$");d(re,_,k,"$","\\$");d(re,_,k,"$","\\textdollar");d(v,_,k,"%","\\%");d(re,_,k,"%","\\%");d(v,_,k,"_","\\_");d(re,_,k,"_","\\_");d(re,_,k,"_","\\textunderscore");d(v,_,k,"∠","\\angle",!0);d(v,_,k,"∞","\\infty",!0);d(v,_,k,"′","\\prime");d(v,_,k,"△","\\triangle");d(v,_,k,"Γ","\\Gamma",!0);d(v,_,k,"Δ","\\Delta",!0);d(v,_,k,"Θ","\\Theta",!0);d(v,_,k,"Λ","\\Lambda",!0);d(v,_,k,"Ξ","\\Xi",!0);d(v,_,k,"Π","\\Pi",!0);d(v,_,k,"Σ","\\Sigma",!0);d(v,_,k,"Υ","\\Upsilon",!0);d(v,_,k,"Φ","\\Phi",!0);d(v,_,k,"Ψ","\\Psi",!0);d(v,_,k,"Ω","\\Omega",!0);d(v,_,k,"A","Α");d(v,_,k,"B","Β");d(v,_,k,"E","Ε");d(v,_,k,"Z","Ζ");d(v,_,k,"H","Η");d(v,_,k,"I","Ι");d(v,_,k,"K","Κ");d(v,_,k,"M","Μ");d(v,_,k,"N","Ν");d(v,_,k,"O","Ο");d(v,_,k,"P","Ρ");d(v,_,k,"T","Τ");d(v,_,k,"X","Χ");d(v,_,k,"¬","\\neg",!0);d(v,_,k,"¬","\\lnot");d(v,_,k,"⊤","\\top");d(v,_,k,"⊥","\\bot");d(v,_,k,"∅","\\emptyset");d(v,P,k,"∅","\\varnothing");d(v,_,He,"α","\\alpha",!0);d(v,_,He,"β","\\beta",!0);d(v,_,He,"γ","\\gamma",!0);d(v,_,He,"δ","\\delta",!0);d(v,_,He,"ϵ","\\epsilon",!0);d(v,_,He,"ζ","\\zeta",!0);d(v,_,He,"η","\\eta",!0);d(v,_,He,"θ","\\theta",!0);d(v,_,He,"ι","\\iota",!0);d(v,_,He,"κ","\\kappa",!0);d(v,_,He,"λ","\\lambda",!0);d(v,_,He,"μ","\\mu",!0);d(v,_,He,"ν","\\nu",!0);d(v,_,He,"ξ","\\xi",!0);d(v,_,He,"ο","\\omicron",!0);d(v,_,He,"π","\\pi",!0);d(v,_,He,"ρ","\\rho",!0);d(v,_,He,"σ","\\sigma",!0);d(v,_,He,"τ","\\tau",!0);d(v,_,He,"υ","\\upsilon",!0);d(v,_,He,"ϕ","\\phi",!0);d(v,_,He,"χ","\\chi",!0);d(v,_,He,"ψ","\\psi",!0);d(v,_,He,"ω","\\omega",!0);d(v,_,He,"ε","\\varepsilon",!0);d(v,_,He,"ϑ","\\vartheta",!0);d(v,_,He,"ϖ","\\varpi",!0);d(v,_,He,"ϱ","\\varrho",!0);d(v,_,He,"ς","\\varsigma",!0);d(v,_,He,"φ","\\varphi",!0);d(v,_,Ee,"∗","*",!0);d(v,_,Ee,"+","+");d(v,_,Ee,"−","-",!0);d(v,_,Ee,"⋅","\\cdot",!0);d(v,_,Ee,"∘","\\circ",!0);d(v,_,Ee,"÷","\\div",!0);d(v,_,Ee,"±","\\pm",!0);d(v,_,Ee,"×","\\times",!0);d(v,_,Ee,"∩","\\cap",!0);d(v,_,Ee,"∪","\\cup",!0);d(v,_,Ee,"∖","\\setminus",!0);d(v,_,Ee,"∧","\\land");d(v,_,Ee,"∨","\\lor");d(v,_,Ee,"∧","\\wedge",!0);d(v,_,Ee,"∨","\\vee",!0);d(v,_,k,"√","\\surd");d(v,_,pn,"⟨","\\langle",!0);d(v,_,pn,"∣","\\lvert");d(v,_,pn,"∥","\\lVert");d(v,_,Qt,"?","?");d(v,_,Qt,"!","!");d(v,_,Qt,"⟩","\\rangle",!0);d(v,_,Qt,"∣","\\rvert");d(v,_,Qt,"∥","\\rVert");d(v,_,L,"=","=");d(v,_,L,":",":");d(v,_,L,"≈","\\approx",!0);d(v,_,L,"≅","\\cong",!0);d(v,_,L,"≥","\\ge");d(v,_,L,"≥","\\geq",!0);d(v,_,L,"←","\\gets");d(v,_,L,">","\\gt",!0);d(v,_,L,"∈","\\in",!0);d(v,_,L,"","\\@not");d(v,_,L,"⊂","\\subset",!0);d(v,_,L,"⊃","\\supset",!0);d(v,_,L,"⊆","\\subseteq",!0);d(v,_,L,"⊇","\\supseteq",!0);d(v,P,L,"⊈","\\nsubseteq",!0);d(v,P,L,"⊉","\\nsupseteq",!0);d(v,_,L,"⊨","\\models");d(v,_,L,"←","\\leftarrow",!0);d(v,_,L,"≤","\\le");d(v,_,L,"≤","\\leq",!0);d(v,_,L,"<","\\lt",!0);d(v,_,L,"→","\\rightarrow",!0);d(v,_,L,"→","\\to");d(v,P,L,"≱","\\ngeq",!0);d(v,P,L,"≰","\\nleq",!0);d(v,_,ai," ","\\ ");d(v,_,ai," ","\\space");d(v,_,ai," ","\\nobreakspace");d(re,_,ai," ","\\ ");d(re,_,ai," "," ");d(re,_,ai," ","\\space");d(re,_,ai," ","\\nobreakspace");d(v,_,ai,"","\\nobreak");d(v,_,ai,"","\\allowbreak");d(v,_,Jr,",",",");d(v,_,Jr,";",";");d(v,P,Ee,"⊼","\\barwedge",!0);d(v,P,Ee,"⊻","\\veebar",!0);d(v,_,Ee,"⊙","\\odot",!0);d(v,_,Ee,"⊕","\\oplus",!0);d(v,_,Ee,"⊗","\\otimes",!0);d(v,_,k,"∂","\\partial",!0);d(v,_,Ee,"⊘","\\oslash",!0);d(v,P,Ee,"⊚","\\circledcirc",!0);d(v,P,Ee,"⊡","\\boxdot",!0);d(v,_,Ee,"△","\\bigtriangleup");d(v,_,Ee,"▽","\\bigtriangledown");d(v,_,Ee,"†","\\dagger");d(v,_,Ee,"⋄","\\diamond");d(v,_,Ee,"⋆","\\star");d(v,_,Ee,"◃","\\triangleleft");d(v,_,Ee,"▹","\\triangleright");d(v,_,pn,"{","\\{");d(re,_,k,"{","\\{");d(re,_,k,"{","\\textbraceleft");d(v,_,Qt,"}","\\}");d(re,_,k,"}","\\}");d(re,_,k,"}","\\textbraceright");d(v,_,pn,"{","\\lbrace");d(v,_,Qt,"}","\\rbrace");d(v,_,pn,"[","\\lbrack",!0);d(re,_,k,"[","\\lbrack",!0);d(v,_,Qt,"]","\\rbrack",!0);d(re,_,k,"]","\\rbrack",!0);d(v,_,pn,"(","\\lparen",!0);d(v,_,Qt,")","\\rparen",!0);d(re,_,k,"<","\\textless",!0);d(re,_,k,">","\\textgreater",!0);d(v,_,pn,"⌊","\\lfloor",!0);d(v,_,Qt,"⌋","\\rfloor",!0);d(v,_,pn,"⌈","\\lceil",!0);d(v,_,Qt,"⌉","\\rceil",!0);d(v,_,k,"\\","\\backslash");d(v,_,k,"∣","|");d(v,_,k,"∣","\\vert");d(re,_,k,"|","\\textbar",!0);d(v,_,k,"∥","\\|");d(v,_,k,"∥","\\Vert");d(re,_,k,"∥","\\textbardbl");d(re,_,k,"~","\\textasciitilde");d(re,_,k,"\\","\\textbackslash");d(re,_,k,"^","\\textasciicircum");d(v,_,L,"↑","\\uparrow",!0);d(v,_,L,"⇑","\\Uparrow",!0);d(v,_,L,"↓","\\downarrow",!0);d(v,_,L,"⇓","\\Downarrow",!0);d(v,_,L,"↕","\\updownarrow",!0);d(v,_,L,"⇕","\\Updownarrow",!0);d(v,_,Nt,"∐","\\coprod");d(v,_,Nt,"⋁","\\bigvee");d(v,_,Nt,"⋀","\\bigwedge");d(v,_,Nt,"⨄","\\biguplus");d(v,_,Nt,"⋂","\\bigcap");d(v,_,Nt,"⋃","\\bigcup");d(v,_,Nt,"∫","\\int");d(v,_,Nt,"∫","\\intop");d(v,_,Nt,"∬","\\iint");d(v,_,Nt,"∭","\\iiint");d(v,_,Nt,"∏","\\prod");d(v,_,Nt,"∑","\\sum");d(v,_,Nt,"⨂","\\bigotimes");d(v,_,Nt,"⨁","\\bigoplus");d(v,_,Nt,"⨀","\\bigodot");d(v,_,Nt,"∮","\\oint");d(v,_,Nt,"∯","\\oiint");d(v,_,Nt,"∰","\\oiiint");d(v,_,Nt,"⨆","\\bigsqcup");d(v,_,Nt,"∫","\\smallint");d(re,_,Pr,"…","\\textellipsis");d(v,_,Pr,"…","\\mathellipsis");d(re,_,Pr,"…","\\ldots",!0);d(v,_,Pr,"…","\\ldots",!0);d(v,_,Pr,"⋯","\\@cdots",!0);d(v,_,Pr,"⋱","\\ddots",!0);d(v,_,k,"⋮","\\varvdots");d(re,_,k,"⋮","\\varvdots");d(v,_,Tt,"ˊ","\\acute");d(v,_,Tt,"ˋ","\\grave");d(v,_,Tt,"¨","\\ddot");d(v,_,Tt,"~","\\tilde");d(v,_,Tt,"ˉ","\\bar");d(v,_,Tt,"˘","\\breve");d(v,_,Tt,"ˇ","\\check");d(v,_,Tt,"^","\\hat");d(v,_,Tt,"⃗","\\vec");d(v,_,Tt,"˙","\\dot");d(v,_,Tt,"˚","\\mathring");d(v,_,He,"","\\@imath");d(v,_,He,"","\\@jmath");d(v,_,k,"ı","ı");d(v,_,k,"ȷ","ȷ");d(re,_,k,"ı","\\i",!0);d(re,_,k,"ȷ","\\j",!0);d(re,_,k,"ß","\\ss",!0);d(re,_,k,"æ","\\ae",!0);d(re,_,k,"œ","\\oe",!0);d(re,_,k,"ø","\\o",!0);d(re,_,k,"Æ","\\AE",!0);d(re,_,k,"Œ","\\OE",!0);d(re,_,k,"Ø","\\O",!0);d(re,_,Tt,"ˊ","\\'");d(re,_,Tt,"ˋ","\\`");d(re,_,Tt,"ˆ","\\^");d(re,_,Tt,"˜","\\~");d(re,_,Tt,"ˉ","\\=");d(re,_,Tt,"˘","\\u");d(re,_,Tt,"˙","\\.");d(re,_,Tt,"¸","\\c");d(re,_,Tt,"˚","\\r");d(re,_,Tt,"ˇ","\\v");d(re,_,Tt,"¨",'\\"');d(re,_,Tt,"˝","\\H");d(re,_,Tt,"◯","\\textcircled");var Du={"--":!0,"---":!0,"``":!0,"''":!0};d(re,_,k,"–","--",!0);d(re,_,k,"–","\\textendash");d(re,_,k,"—","---",!0);d(re,_,k,"—","\\textemdash");d(re,_,k,"‘","`",!0);d(re,_,k,"‘","\\textquoteleft");d(re,_,k,"’","'",!0);d(re,_,k,"’","\\textquoteright");d(re,_,k,"“","``",!0);d(re,_,k,"“","\\textquotedblleft");d(re,_,k,"”","''",!0);d(re,_,k,"”","\\textquotedblright");d(v,_,k,"°","\\degree",!0);d(re,_,k,"°","\\degree");d(re,_,k,"°","\\textdegree",!0);d(v,_,k,"£","\\pounds");d(v,_,k,"£","\\mathsterling",!0);d(re,_,k,"£","\\pounds");d(re,_,k,"£","\\textsterling",!0);d(v,P,k,"✠","\\maltese");d(re,P,k,"✠","\\maltese");var sc='0123456789/@."';for(var js=0;js<sc.length;js++){var oc=sc.charAt(js);d(v,_,k,oc,oc)}var lc='0123456789!@*()-=+";:?/.,';for(var Zs=0;Zs<lc.length;Zs++){var cc=lc.charAt(Zs);d(re,_,k,cc,cc)}var Ya="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";for(var Js=0;Js<Ya.length;Js++){var Aa=Ya.charAt(Js);d(v,_,He,Aa,Aa),d(re,_,k,Aa,Aa)}d(v,P,k,"C","ℂ");d(re,P,k,"C","ℂ");d(v,P,k,"H","ℍ");d(re,P,k,"H","ℍ");d(v,P,k,"N","ℕ");d(re,P,k,"N","ℕ");d(v,P,k,"P","ℙ");d(re,P,k,"P","ℙ");d(v,P,k,"Q","ℚ");d(re,P,k,"Q","ℚ");d(v,P,k,"R","ℝ");d(re,P,k,"R","ℝ");d(v,P,k,"Z","ℤ");d(re,P,k,"Z","ℤ");d(v,_,He,"h","ℎ");d(re,_,He,"h","ℎ");var Ge;for(var Yt=0;Yt<Ya.length;Yt++){var Pt=Ya.charAt(Yt);Ge=String.fromCharCode(55349,56320+Yt),d(v,_,He,Pt,Ge),d(re,_,k,Pt,Ge),Ge=String.fromCharCode(55349,56372+Yt),d(v,_,He,Pt,Ge),d(re,_,k,Pt,Ge),Ge=String.fromCharCode(55349,56424+Yt),d(v,_,He,Pt,Ge),d(re,_,k,Pt,Ge),Ge=String.fromCharCode(55349,56580+Yt),d(v,_,He,Pt,Ge),d(re,_,k,Pt,Ge),Ge=String.fromCharCode(55349,56684+Yt),d(v,_,He,Pt,Ge),d(re,_,k,Pt,Ge),Ge=String.fromCharCode(55349,56736+Yt),d(v,_,He,Pt,Ge),d(re,_,k,Pt,Ge),Ge=String.fromCharCode(55349,56788+Yt),d(v,_,He,Pt,Ge),d(re,_,k,Pt,Ge),Ge=String.fromCharCode(55349,56840+Yt),d(v,_,He,Pt,Ge),d(re,_,k,Pt,Ge),Ge=String.fromCharCode(55349,56944+Yt),d(v,_,He,Pt,Ge),d(re,_,k,Pt,Ge),Yt<26&&(Ge=String.fromCharCode(55349,56632+Yt),d(v,_,He,Pt,Ge),d(re,_,k,Pt,Ge),Ge=String.fromCharCode(55349,56476+Yt),d(v,_,He,Pt,Ge),d(re,_,k,Pt,Ge))}Ge="𝕜";d(v,_,He,"k",Ge);d(re,_,k,"k",Ge);for(var Ni=0;Ni<10;Ni++){var vi=Ni.toString();Ge=String.fromCharCode(55349,57294+Ni),d(v,_,He,vi,Ge),d(re,_,k,vi,Ge),Ge=String.fromCharCode(55349,57314+Ni),d(v,_,He,vi,Ge),d(re,_,k,vi,Ge),Ge=String.fromCharCode(55349,57324+Ni),d(v,_,He,vi,Ge),d(re,_,k,vi,Ge),Ge=String.fromCharCode(55349,57334+Ni),d(v,_,He,vi,Ge),d(re,_,k,vi,Ge)}var a0="ÐÞþ";for(var Qs=0;Qs<a0.length;Qs++){var Ca=a0.charAt(Qs);d(v,_,He,Ca,Ca),d(re,_,k,Ca,Ca)}var s0={mathClass:"mathbf",textClass:"textbf",font:"Main-Bold"},uc={mathClass:"mathnormal",textClass:"textit",font:"Math-Italic"},hc={mathClass:"boldsymbol",textClass:"boldsymbol",font:"Main-BoldItalic"},vg={mathClass:"mathscr",textClass:"textscr",font:"Script-Regular"},Vi={mathClass:"",textClass:"",font:""},dc={mathClass:"mathfrak",textClass:"textfrak",font:"Fraktur-Regular"},fc={mathClass:"mathbb",textClass:"textbb",font:"AMS-Regular"},pc={mathClass:"mathboldfrak",textClass:"textboldfrak",font:"Fraktur-Regular"},o0={mathClass:"mathsf",textClass:"textsf",font:"SansSerif-Regular"},l0={mathClass:"mathboldsf",textClass:"textboldsf",font:"SansSerif-Bold"},mc={mathClass:"mathitsf",textClass:"textitsf",font:"SansSerif-Italic"},c0={mathClass:"mathtt",textClass:"texttt",font:"Typewriter-Regular"},vc=[s0,s0,uc,uc,hc,hc,vg,Vi,Vi,Vi,dc,dc,fc,fc,pc,pc,o0,o0,l0,l0,mc,mc,Vi,Vi,c0,c0],gg=[s0,Vi,o0,l0,c0],xg=i=>{var e=i.charCodeAt(0),t=i.charCodeAt(1),n=(e-55296)*1024+(t-56320)+65536;if(119808<=n&&n<120484){var r=Math.floor((n-119808)/26);return vc[r]}else if(120782<=n&&n<=120831){var a=Math.floor((n-120782)/10);return gg[a]}else{if(n===120485||n===120486)return vc[0];if(120486<n&&n<120782)return Vi;throw new oe("Unsupported character: "+i)}},rs=function(e,t,n){if(wt[n][e]){var r=wt[n][e].replace;r&&(e=r)}return{value:e,metrics:I0(e,t,n)}},jt=function(e,t,n,r,a){var s=rs(e,t,n),o=s.metrics;e=s.value;var l;if(o){var c=o.italic;(n==="text"||r&&r.font==="mathit")&&(c=0),l=new fn(e,o.height,o.depth,c,o.skew,o.width,a)}else typeof console<"u"&&console.warn("No character metrics "+("for '"+e+"' in style '"+t+"' and mode '"+n+"'")),l=new fn(e,0,0,0,0,0,a);if(r){l.maxFontSize=r.sizeMultiplier,r.style.isTight()&&l.classes.push("mtight");var u=r.getColor();u&&(l.style.color=u)}return l},L0=function(e,t,n,r){return r===void 0&&(r=[]),n.font==="boldsymbol"&&rs(e,"Main-Bold",t).metrics?jt(e,"Main-Bold",t,n,r.concat(["mathbf"])):e==="\\"||wt[t][e].font==="main"?jt(e,"Main-Regular",t,n,r):jt(e,"AMS-Regular",t,n,r.concat(["amsrm"]))},yg=function(e,t,n){return n!=="textord"&&rs(e,"Math-BoldItalic",t).metrics?{fontName:"Math-BoldItalic",fontClass:"boldsymbol"}:{fontName:"Main-Bold",fontClass:"mathbf"}},as=function(e,t,n){var r=e.mode,a=e.text,s=["mord"],{font:o,fontFamily:l,fontWeight:c,fontShape:u}=t,h=r==="math"||r==="text"&&!!o,f=h?o:l,m="",x="";if(a.charCodeAt(0)===55349){var y=xg(a);m=y.font,x=y[r+"Class"]}if(m)return jt(a,m,r,t,s.concat(x));if(f){var g,p;if(f==="boldsymbol"){var A=yg(a,r,n);g=A.fontName,p=[A.fontClass]}else h?(g=u0[o].fontName,p=[o]):(g=Ra(l,c,u),p=[l,c,u]);if(rs(a,g,r).metrics)return jt(a,g,r,t,s.concat(p));if(Du.hasOwnProperty(a)&&g.slice(0,10)==="Typewriter"){for(var C=[],S=0;S<a.length;S++)C.push(jt(a[S],g,r,t,s.concat(p)));return si(C)}}if(n==="mathord")return jt(a,"Math-Italic",r,t,s.concat(["mathnormal"]));if(n==="textord"){var N=wt[r][a]&&wt[r][a].font;if(N==="ams"){var I=Ra("amsrm",c,u);return jt(a,I,r,t,s.concat("amsrm",c,u))}else if(N==="main"||!N){var D=Ra("textrm",c,u);return jt(a,D,r,t,s.concat(c,u))}else{var U=Ra(N,c,u);return jt(a,U,r,t,s.concat(U,c,u))}}else throw new Error("unexpected type: "+n+" in makeOrd")},_g=(i,e)=>{if(wi(i.classes)!==wi(e.classes)||i.skew!==e.skew||i.maxFontSize!==e.maxFontSize||i.italic!==0&&i.hasClass("mathnormal"))return!1;if(i.classes.length===1){var t=i.classes[0];if(t==="mbin"||t==="mord")return!1}for(var n of Object.keys(i.style))if(i.style[n]!==e.style[n])return!1;for(var r of Object.keys(e.style))if(i.style[r]!==e.style[r])return!1;return!0},Iu=i=>{for(var e=0;e<i.length-1;e++){var t=i[e],n=i[e+1];t instanceof fn&&n instanceof fn&&_g(t,n)&&(t.text+=n.text,t.height=Math.max(t.height,n.height),t.depth=Math.max(t.depth,n.depth),t.italic=n.italic,i.splice(e+1,1),e--)}return i},F0=function(e){for(var t=0,n=0,r=0,a=0;a<e.children.length;a++){var s=e.children[a];s.height>t&&(t=s.height),s.depth>n&&(n=s.depth),s.maxFontSize>r&&(r=s.maxFontSize)}e.height=t,e.depth=n,e.maxFontSize=r},se=function(e,t,n,r){var a=new Rr(e,t,n,r);return F0(a),a},Ei=(i,e,t,n)=>new Rr(i,e,t,n),Mr=function(e,t,n){var r=se([e],[],t);return r.height=Math.max(n||t.fontMetrics().defaultRuleThickness,t.minRuleThickness),r.style.borderBottomWidth=ue(r.height),r.maxFontSize=1,r},bg=function(e,t,n,r){var a=new is(e,t,n,r);return F0(a),a},si=function(e){var t=new Cr(e);return F0(t),t},Sr=function(e,t){return e instanceof Cr?se([],[e],t):e},Mg=function(e){if(e.positionType==="individualShift"){for(var t=e.children,n=[t[0]],r=-t[0].shift-t[0].elem.depth,a=r,s=1;s<t.length;s++){var o=-t[s].shift-a-t[s].elem.depth,l=o-(t[s-1].elem.height+t[s-1].elem.depth);a=a+o,n.push({type:"kern",size:l}),n.push(t[s])}return{children:n,depth:r}}var c;if(e.positionType==="top"){for(var u=e.positionData,h=0;h<e.children.length;h++){var f=e.children[h];u-=f.type==="kern"?f.size:f.elem.height+f.elem.depth}c=u}else if(e.positionType==="bottom")c=-e.positionData;else{var m=e.children[0];if(m.type!=="elem")throw new Error('First child must have type "elem".');if(e.positionType==="shift")c=-m.elem.depth-e.positionData;else if(e.positionType==="firstBaseline")c=-m.elem.depth;else throw new Error("Invalid positionType "+e.positionType+".")}return{children:e.children,depth:c}},ht=function(e,t){for(var{children:n,depth:r}=Mg(e),a=0,s=0;s<n.length;s++){var o=n[s];if(o.type==="elem"){var l=o.elem;a=Math.max(a,l.maxFontSize,l.height)}}a+=2;var c=se(["pstrut"],[]);c.style.height=ue(a);for(var u=[],h=r,f=r,m=r,x=0;x<n.length;x++){var y=n[x];if(y.type==="kern")m+=y.size;else{var g=y.elem,p=y.wrapperClasses||[],A=y.wrapperStyle||{},C=se(p,[c,g],void 0,A);C.style.top=ue(-a-m-g.depth),y.marginLeft&&(C.style.marginLeft=y.marginLeft),y.marginRight&&(C.style.marginRight=y.marginRight),u.push(C),m+=g.height+g.depth}h=Math.min(h,m),f=Math.max(f,m)}var S=se(["vlist"],u);S.style.height=ue(f);var N;if(h<0){var I=se([],[]),D=se(["vlist"],[I]);D.style.height=ue(-h);var U=se(["vlist-s"],[new fn("​")]);N=[se(["vlist-r"],[S,U]),se(["vlist-r"],[D])]}else N=[se(["vlist-r"],[S])];var T=se(["vlist-t"],N);return N.length===2&&T.classes.push("vlist-t2"),T.height=f,T.depth=-h,T},Lu=(i,e)=>{var t=se(["mspace"],[],e),n=At(i,e);return t.style.marginRight=ue(n),t},Ra=(i,e,t)=>{var n,r;switch(i){case"amsrm":n="AMS";break;case"textrm":n="Main";break;case"textsf":n="SansSerif";break;case"texttt":n="Typewriter";break;default:n=i}return e==="textbf"&&t==="textit"?r="BoldItalic":e==="textbf"?r="Bold":t==="textit"?r="Italic":r="Regular",n+"-"+r},u0={mathbf:{variant:"bold",fontName:"Main-Bold"},mathrm:{variant:"normal",fontName:"Main-Regular"},textit:{variant:"italic",fontName:"Main-Italic"},mathit:{variant:"italic",fontName:"Main-Italic"},mathnormal:{variant:"italic",fontName:"Math-Italic"},mathsfit:{variant:"sans-serif-italic",fontName:"SansSerif-Italic"},mathbb:{variant:"double-struck",fontName:"AMS-Regular"},mathcal:{variant:"script",fontName:"Caligraphic-Regular"},mathfrak:{variant:"fraktur",fontName:"Fraktur-Regular"},mathscr:{variant:"script",fontName:"Script-Regular"},mathsf:{variant:"sans-serif",fontName:"SansSerif-Regular"},mathtt:{variant:"monospace",fontName:"Typewriter-Regular"}},Fu={vec:["vec",.471,.714],oiintSize1:["oiintSize1",.957,.499],oiintSize2:["oiintSize2",1.472,.659],oiiintSize1:["oiiintSize1",1.304,.499],oiiintSize2:["oiiintSize2",1.98,.659]},Uu=function(e,t){var[n,r,a]=Fu[e],s=new Ti(n),o=new ii([s],{width:ue(r),height:ue(a),style:"width:"+ue(r),viewBox:"0 0 "+1e3*r+" "+1e3*a,preserveAspectRatio:"xMinYMin"}),l=Ei(["overlay"],[o],t);return l.height=a,l.style.height=ue(a),l.style.width=ue(r),l},Et={number:3,unit:"mu"},ki={number:4,unit:"mu"},Kn={number:5,unit:"mu"},Sg={mord:{mop:Et,mbin:ki,mrel:Kn,minner:Et},mop:{mord:Et,mop:Et,mrel:Kn,minner:Et},mbin:{mord:ki,mop:ki,mopen:ki,minner:ki},mrel:{mord:Kn,mop:Kn,mopen:Kn,minner:Kn},mopen:{},mclose:{mop:Et,mbin:ki,mrel:Kn,minner:Et},mpunct:{mord:Et,mop:Et,mrel:Kn,mopen:Et,mclose:Et,mpunct:Et,minner:Et},minner:{mord:Et,mop:Et,mbin:ki,mrel:Kn,mopen:Et,mpunct:Et,minner:Et}},wg={mord:{mop:Et},mop:{mord:Et,mop:Et},mbin:{},mrel:{},mopen:{},mclose:{mop:Et},mpunct:{},minner:{mop:Et}},Nu={},Ka={},ja={};function be(i){for(var{type:e,names:t,props:n,handler:r,htmlBuilder:a,mathmlBuilder:s}=i,o={type:e,numArgs:n.numArgs,argTypes:n.argTypes,allowedInArgument:!!n.allowedInArgument,allowedInText:!!n.allowedInText,allowedInMath:n.allowedInMath===void 0?!0:n.allowedInMath,numOptionalArgs:n.numOptionalArgs||0,infix:!!n.infix,primitive:!!n.primitive,handler:r},l=0;l<t.length;++l)Nu[t[l]]=o;e&&(a&&(Ka[e]=a),s&&(ja[e]=s))}function $i(i){var{type:e,htmlBuilder:t,mathmlBuilder:n}=i;be({type:e,names:[],props:{numArgs:0},handler(){throw new Error("Should never be called.")},htmlBuilder:t,mathmlBuilder:n})}var Za=function(e){return e.type==="ordgroup"&&e.body.length===1?e.body[0]:e},Ft=function(e){return e.type==="ordgroup"?e.body:[e]},Tg=new Set(["leftmost","mbin","mopen","mrel","mop","mpunct"]),Eg=new Set(["rightmost","mrel","mclose","mpunct"]),Ag={display:Ye.DISPLAY,text:Ye.TEXT,script:Ye.SCRIPT,scriptscript:Ye.SCRIPTSCRIPT},Cg={mord:"mord",mop:"mop",mbin:"mbin",mrel:"mrel",mopen:"mopen",mclose:"mclose",mpunct:"mpunct",minner:"minner"},Bt=function(e,t,n,r){r===void 0&&(r=[null,null]);for(var a=[],s=0;s<e.length;s++){var o=dt(e[s],t);if(o instanceof Cr){var l=o.children;a.push(...l)}else a.push(o)}if(Iu(a),!n)return a;var c=t;if(e.length===1){var u=e[0];u.type==="sizing"?c=t.havingSize(u.size):u.type==="styling"&&(c=t.havingStyle(Ag[u.style]))}var h=se([r[0]||"leftmost"],[],t),f=se([r[1]||"rightmost"],[],t),m=n==="root";return h0(a,(x,y)=>{var g=y.classes[0],p=x.classes[0];g==="mbin"&&Eg.has(p)?y.classes[0]="mord":p==="mbin"&&Tg.has(g)&&(x.classes[0]="mord")},{node:h},f,m),h0(a,(x,y)=>{var g,p,A=f0(y),C=f0(x),S=A&&C?x.hasClass("mtight")?(g=wg[A])==null?void 0:g[C]:(p=Sg[A])==null?void 0:p[C]:null;if(S)return Lu(S,c)},{node:h},f,m),a},h0=function(e,t,n,r,a){r&&e.push(r);for(var s=0;s<e.length;s++){var o=e[s],l=ku(o);if(l){h0(l.children,t,n,null,a);continue}var c=!o.hasClass("mspace");if(c){var u=t(o,n.node);u&&(n.insertAfter?n.insertAfter(u):(e.unshift(u),s++))}c?n.node=o:a&&o.hasClass("newline")&&(n.node=se(["leftmost"])),n.insertAfter=(h=>f=>{e.splice(h+1,0,f),s++})(s)}r&&e.pop()},ku=function(e){return e instanceof Cr||e instanceof is||e instanceof Rr&&e.hasClass("enclosing")?e:null},d0=function(e,t){var n=ku(e);if(n){var r=n.children;if(r.length){if(t==="right")return d0(r[r.length-1],"right");if(t==="left")return d0(r[0],"left")}}return e},f0=function(e,t){if(!e)return null;t&&(e=d0(e,t));var n=e.classes[0];return Cg[n]||null},$r=function(e,t){var n=["nulldelimiter"].concat(e.baseSizingClasses());return se(t.concat(n))},dt=function(e,t,n){if(!e)return se();if(Ka[e.type]){var r=Ka[e.type](e,t);if(n&&t.size!==n.size){r=se(t.sizingClasses(n),[r],t);var a=t.sizeMultiplier/n.sizeMultiplier;r.height*=a,r.depth*=a}return r}else throw new oe("Got group of unknown type: '"+e.type+"'")};function Pa(i,e){var t=se(["base"],i,e),n=se(["strut"]);return n.style.height=ue(t.height+t.depth),t.depth&&(n.style.verticalAlign=ue(-t.depth)),t.children.unshift(n),t}function p0(i,e){var t=null;i.length===1&&i[0].type==="tag"&&(t=i[0].tag,i=i[0].body);var n=Bt(i,e,"root"),r;n.length===2&&n[1].hasClass("tag")&&(r=n.pop());for(var a=[],s=[],o=0;o<n.length;o++)if(s.push(n[o]),n[o].hasClass("mbin")||n[o].hasClass("mrel")||n[o].hasClass("allowbreak")){for(var l=!1;o<n.length-1&&n[o+1].hasClass("mspace")&&!n[o+1].hasClass("newline");)o++,s.push(n[o]),n[o].hasClass("nobreak")&&(l=!0);l||(a.push(Pa(s,e)),s=[])}else n[o].hasClass("newline")&&(s.pop(),s.length>0&&(a.push(Pa(s,e)),s=[]),a.push(n[o]));s.length>0&&a.push(Pa(s,e));var c;t?(c=Pa(Bt(t,e,!0),e),c.classes=["tag"],a.push(c)):r&&a.push(r);var u=se(["katex-html"],a);if(u.setAttribute("aria-hidden","true"),c){var h=c.children[0];h.style.height=ue(u.height+u.depth),u.depth&&(h.style.verticalAlign=ue(-u.depth))}return u}function zu(i){return new Cr(i)}class le{constructor(e,t,n){this.type=void 0,this.attributes=void 0,this.children=void 0,this.classes=void 0,this.type=e,this.attributes={},this.children=t||[],this.classes=n||[]}setAttribute(e,t){this.attributes[e]=t}getAttribute(e){return this.attributes[e]}toNode(){var e=document.createElementNS("http://www.w3.org/1998/Math/MathML",this.type);for(var t in this.attributes)Object.prototype.hasOwnProperty.call(this.attributes,t)&&e.setAttribute(t,this.attributes[t]);this.classes.length>0&&(e.className=wi(this.classes));for(var n=0;n<this.children.length;n++)if(this.children[n]instanceof Ut&&this.children[n+1]instanceof Ut){for(var r=this.children[n].toText()+this.children[++n].toText();this.children[n+1]instanceof Ut;)r+=this.children[++n].toText();e.appendChild(new Ut(r).toNode())}else e.appendChild(this.children[n].toNode());return e}toMarkup(){var e="<"+this.type;for(var t in this.attributes)Object.prototype.hasOwnProperty.call(this.attributes,t)&&(e+=" "+t+'="',e+=$t(this.attributes[t]),e+='"');this.classes.length>0&&(e+=' class ="'+$t(wi(this.classes))+'"'),e+=">";for(var n=0;n<this.children.length;n++)e+=this.children[n].toMarkup();return e+="</"+this.type+">",e}toText(){return this.children.map(e=>e.toText()).join("")}}class Ut{constructor(e){this.text=void 0,this.text=e}toNode(){return document.createTextNode(this.text)}toMarkup(){return $t(this.toText())}toText(){return this.text}}class Ou{constructor(e){this.width=void 0,this.character=void 0,this.width=e,e>=.05555&&e<=.05556?this.character=" ":e>=.1666&&e<=.1667?this.character=" ":e>=.2222&&e<=.2223?this.character=" ":e>=.2777&&e<=.2778?this.character="  ":e>=-.05556&&e<=-.05555?this.character=" ⁣":e>=-.1667&&e<=-.1666?this.character=" ⁣":e>=-.2223&&e<=-.2222?this.character=" ⁣":e>=-.2778&&e<=-.2777?this.character=" ⁣":this.character=null}toNode(){if(this.character)return document.createTextNode(this.character);var e=document.createElementNS("http://www.w3.org/1998/Math/MathML","mspace");return e.setAttribute("width",ue(this.width)),e}toMarkup(){return this.character?"<mtext>"+this.character+"</mtext>":'<mspace width="'+ue(this.width)+'"/>'}toText(){return this.character?this.character:" "}}var Rg=new Set(["\\imath","\\jmath"]),Pg=new Set(["mrow","mtable"]),_n=function(e,t,n){return wt[t][e]&&wt[t][e].replace&&e.charCodeAt(0)!==55349&&!(Du.hasOwnProperty(e)&&n&&(n.fontFamily&&n.fontFamily.slice(4,6)==="tt"||n.font&&n.font.slice(4,6)==="tt"))&&(e=wt[t][e].replace),new Ut(e)},U0=function(e){return e.length===1?e[0]:new le("mrow",e)},Dg={mathit:"italic",boldsymbol:i=>i.type==="textord"?"bold":"bold-italic",mathbf:"bold",mathbb:"double-struck",mathsfit:"sans-serif-italic",mathfrak:"fraktur",mathscr:"script",mathcal:"script",mathsf:"sans-serif",mathtt:"monospace"},N0=(i,e)=>{if(i.mode==="text"){if(e.fontFamily==="texttt")return"monospace";if(e.fontFamily==="textsf")return e.fontShape==="textit"&&e.fontWeight==="textbf"?"sans-serif-bold-italic":e.fontShape==="textit"?"sans-serif-italic":e.fontWeight==="textbf"?"bold-sans-serif":"sans-serif";if(e.fontShape==="textit"&&e.fontWeight==="textbf")return"bold-italic";if(e.fontShape==="textit")return"italic";if(e.fontWeight==="textbf")return"bold"}var t=e.font;if(!t||t==="mathnormal")return null;var n=i.mode,r=Dg[t];if(r)return typeof r=="function"?r(i):r;var a=i.text;if(Rg.has(a))return null;if(wt[n][a]){var s=wt[n][a].replace;s&&(a=s)}var o=u0[t].fontName;return I0(a,o,n)?u0[t].variant:null};function eo(i){if(!i)return!1;if(i.type==="mi"&&i.children.length===1){var e=i.children[0];return e instanceof Ut&&e.text==="."}else if(i.type==="mo"&&i.children.length===1&&i.getAttribute("separator")==="true"&&i.getAttribute("lspace")==="0em"&&i.getAttribute("rspace")==="0em"){var t=i.children[0];return t instanceof Ut&&t.text===","}else return!1}var mn=function(e,t,n){if(e.length===1){var r=xt(e[0],t);return n&&r instanceof le&&r.type==="mo"&&(r.setAttribute("lspace","0em"),r.setAttribute("rspace","0em")),[r]}for(var a=[],s,o=0;o<e.length;o++){var l=xt(e[o],t);if(l instanceof le&&s instanceof le){if(l.type==="mtext"&&s.type==="mtext"&&l.getAttribute("mathvariant")===s.getAttribute("mathvariant")){s.children.push(...l.children);continue}else if(l.type==="mn"&&s.type==="mn"){s.children.push(...l.children);continue}else if(eo(l)&&s.type==="mn"){s.children.push(...l.children);continue}else if(l.type==="mn"&&eo(s))l.children=[...s.children,...l.children],a.pop();else if((l.type==="msup"||l.type==="msub")&&l.children.length>=1&&(s.type==="mn"||eo(s))){var c=l.children[0];c instanceof le&&c.type==="mn"&&(c.children=[...s.children,...c.children],a.pop())}else if(s.type==="mi"&&s.children.length===1){var u=s.children[0];if(u instanceof Ut&&u.text==="̸"&&(l.type==="mo"||l.type==="mi"||l.type==="mn")){var h=l.children[0];h instanceof Ut&&h.text.length>0&&(h.text=h.text.slice(0,1)+"̸"+h.text.slice(1),a.pop())}}}a.push(l),s=l}return a},Ai=function(e,t,n){return U0(mn(e,t,n))},xt=function(e,t){if(!e)return new le("mrow");if(ja[e.type])return ja[e.type](e,t);throw new oe("Got group of unknown type: '"+e.type+"'")};function gc(i,e,t,n,r){var a=mn(i,t),s;a.length===1&&a[0]instanceof le&&Pg.has(a[0].type)?s=a[0]:s=new le("mrow",a);var o=new le("annotation",[new Ut(e)]);o.setAttribute("encoding","application/x-tex");var l=new le("semantics",[s,o]),c=new le("math",[l]);c.setAttribute("xmlns","http://www.w3.org/1998/Math/MathML"),n&&c.setAttribute("display","block");var u=r?"katex":"katex-mathml";return se([u],[c])}var Ig=[[1,1,1],[2,1,1],[3,1,1],[4,2,1],[5,2,1],[6,3,1],[7,4,2],[8,6,3],[9,7,6],[10,8,7],[11,10,9]],xc=[.5,.6,.7,.8,.9,1,1.2,1.44,1.728,2.074,2.488],yc=function(e,t){return t.size<2?e:Ig[e-1][t.size-1]};class Zn{constructor(e){this.style=void 0,this.color=void 0,this.size=void 0,this.textSize=void 0,this.phantom=void 0,this.font=void 0,this.fontFamily=void 0,this.fontWeight=void 0,this.fontShape=void 0,this.sizeMultiplier=void 0,this.maxSize=void 0,this.minRuleThickness=void 0,this._fontMetrics=void 0,this.style=e.style,this.color=e.color,this.size=e.size||Zn.BASESIZE,this.textSize=e.textSize||this.size,this.phantom=!!e.phantom,this.font=e.font||"",this.fontFamily=e.fontFamily||"",this.fontWeight=e.fontWeight||"",this.fontShape=e.fontShape||"",this.sizeMultiplier=xc[this.size-1],this.maxSize=e.maxSize,this.minRuleThickness=e.minRuleThickness,this._fontMetrics=void 0}extend(e){var t={style:this.style,size:this.size,textSize:this.textSize,color:this.color,phantom:this.phantom,font:this.font,fontFamily:this.fontFamily,fontWeight:this.fontWeight,fontShape:this.fontShape,maxSize:this.maxSize,minRuleThickness:this.minRuleThickness};return Object.assign(t,e),new Zn(t)}havingStyle(e){return this.style===e?this:this.extend({style:e,size:yc(this.textSize,e)})}havingCrampedStyle(){return this.havingStyle(this.style.cramp())}havingSize(e){return this.size===e&&this.textSize===e?this:this.extend({style:this.style.text(),size:e,textSize:e,sizeMultiplier:xc[e-1]})}havingBaseStyle(e){e=e||this.style.text();var t=yc(Zn.BASESIZE,e);return this.size===t&&this.textSize===Zn.BASESIZE&&this.style===e?this:this.extend({style:e,size:t})}havingBaseSizing(){var e;switch(this.style.id){case 4:case 5:e=3;break;case 6:case 7:e=1;break;default:e=6}return this.extend({style:this.style.text(),size:e})}withColor(e){return this.extend({color:e})}withPhantom(){return this.extend({phantom:!0})}withFont(e){return this.extend({font:e})}withTextFontFamily(e){return this.extend({fontFamily:e,font:""})}withTextFontWeight(e){return this.extend({fontWeight:e,font:""})}withTextFontShape(e){return this.extend({fontShape:e,font:""})}sizingClasses(e){return e.size!==this.size?["sizing","reset-size"+e.size,"size"+this.size]:[]}baseSizingClasses(){return this.size!==Zn.BASESIZE?["sizing","reset-size"+this.size,"size"+Zn.BASESIZE]:[]}fontMetrics(){return this._fontMetrics||(this._fontMetrics=mg(this.size)),this._fontMetrics}getColor(){return this.phantom?"transparent":this.color}}Zn.BASESIZE=6;var Bu=function(e){return new Zn({style:e.displayMode?Ye.DISPLAY:Ye.TEXT,maxSize:e.maxSize,minRuleThickness:e.minRuleThickness})},Hu=function(e,t){if(t.displayMode){var n=["katex-display"];t.leqno&&n.push("leqno"),t.fleqn&&n.push("fleqn"),e=se(n,[e])}return e},Lg=function(e,t,n){var r=Bu(n),a;if(n.output==="mathml")return gc(e,t,r,n.displayMode,!0);if(n.output==="html"){var s=p0(e,r);a=se(["katex"],[s])}else{var o=gc(e,t,r,n.displayMode,!1),l=p0(e,r);a=se(["katex"],[o,l])}return Hu(a,n)},Fg=function(e,t,n){var r=Bu(n),a=p0(e,r),s=se(["katex"],[a]);return Hu(s,n)},Ug={widehat:"^",widecheck:"ˇ",widetilde:"~",utilde:"~",overleftarrow:"←",underleftarrow:"←",xleftarrow:"←",overrightarrow:"→",underrightarrow:"→",xrightarrow:"→",underbrace:"⏟",overbrace:"⏞",underbracket:"⎵",overbracket:"⎴",overgroup:"⏠",undergroup:"⏡",overleftrightarrow:"↔",underleftrightarrow:"↔",xleftrightarrow:"↔",Overrightarrow:"⇒",xRightarrow:"⇒",overleftharpoon:"↼",xleftharpoonup:"↼",overrightharpoon:"⇀",xrightharpoonup:"⇀",xLeftarrow:"⇐",xLeftrightarrow:"⇔",xhookleftarrow:"↩",xhookrightarrow:"↪",xmapsto:"↦",xrightharpoondown:"⇁",xleftharpoondown:"↽",xrightleftharpoons:"⇌",xleftrightharpoons:"⇋",xtwoheadleftarrow:"↞",xtwoheadrightarrow:"↠",xlongequal:"=",xtofrom:"⇄",xrightleftarrows:"⇄",xrightequilibrium:"⇌",xleftequilibrium:"⇋","\\cdrightarrow":"→","\\cdleftarrow":"←","\\cdlongequal":"="},ss=function(e){var t=new le("mo",[new Ut(Ug[e.replace(/^\\/,"")])]);return t.setAttribute("stretchy","true"),t},Ng={overrightarrow:[["rightarrow"],.888,522,"xMaxYMin"],overleftarrow:[["leftarrow"],.888,522,"xMinYMin"],underrightarrow:[["rightarrow"],.888,522,"xMaxYMin"],underleftarrow:[["leftarrow"],.888,522,"xMinYMin"],xrightarrow:[["rightarrow"],1.469,522,"xMaxYMin"],"\\cdrightarrow":[["rightarrow"],3,522,"xMaxYMin"],xleftarrow:[["leftarrow"],1.469,522,"xMinYMin"],"\\cdleftarrow":[["leftarrow"],3,522,"xMinYMin"],Overrightarrow:[["doublerightarrow"],.888,560,"xMaxYMin"],xRightarrow:[["doublerightarrow"],1.526,560,"xMaxYMin"],xLeftarrow:[["doubleleftarrow"],1.526,560,"xMinYMin"],overleftharpoon:[["leftharpoon"],.888,522,"xMinYMin"],xleftharpoonup:[["leftharpoon"],.888,522,"xMinYMin"],xleftharpoondown:[["leftharpoondown"],.888,522,"xMinYMin"],overrightharpoon:[["rightharpoon"],.888,522,"xMaxYMin"],xrightharpoonup:[["rightharpoon"],.888,522,"xMaxYMin"],xrightharpoondown:[["rightharpoondown"],.888,522,"xMaxYMin"],xlongequal:[["longequal"],.888,334,"xMinYMin"],"\\cdlongequal":[["longequal"],3,334,"xMinYMin"],xtwoheadleftarrow:[["twoheadleftarrow"],.888,334,"xMinYMin"],xtwoheadrightarrow:[["twoheadrightarrow"],.888,334,"xMaxYMin"],overleftrightarrow:[["leftarrow","rightarrow"],.888,522],overbrace:[["leftbrace","midbrace","rightbrace"],1.6,548],underbrace:[["leftbraceunder","midbraceunder","rightbraceunder"],1.6,548],underleftrightarrow:[["leftarrow","rightarrow"],.888,522],xleftrightarrow:[["leftarrow","rightarrow"],1.75,522],xLeftrightarrow:[["doubleleftarrow","doublerightarrow"],1.75,560],xrightleftharpoons:[["leftharpoondownplus","rightharpoonplus"],1.75,716],xleftrightharpoons:[["leftharpoonplus","rightharpoondownplus"],1.75,716],xhookleftarrow:[["leftarrow","righthook"],1.08,522],xhookrightarrow:[["lefthook","rightarrow"],1.08,522],overlinesegment:[["leftlinesegment","rightlinesegment"],.888,522],underlinesegment:[["leftlinesegment","rightlinesegment"],.888,522],overbracket:[["leftbracketover","rightbracketover"],1.6,440],underbracket:[["leftbracketunder","rightbracketunder"],1.6,410],overgroup:[["leftgroup","rightgroup"],.888,342],undergroup:[["leftgroupunder","rightgroupunder"],.888,342],xmapsto:[["leftmapsto","rightarrow"],1.5,522],xtofrom:[["leftToFrom","rightToFrom"],1.75,528],xrightleftarrows:[["baraboveleftarrow","rightarrowabovebar"],1.75,901],xrightequilibrium:[["baraboveshortleftharpoon","rightharpoonaboveshortbar"],1.75,716],xleftequilibrium:[["shortbaraboveleftharpoon","shortrightharpoonabovebar"],1.75,716]},kg=new Set(["widehat","widecheck","widetilde","utilde"]),os=function(e,t){function n(){var o=4e5,l=e.label.slice(1);if(kg.has(l)&&"base"in e){var c=e.base.type==="ordgroup"?e.base.body.length:1,u,h,f;if(c>5)l==="widehat"||l==="widecheck"?(u=420,o=2364,f=.42,h=l+"4"):(u=312,o=2340,f=.34,h="tilde4");else{var m=[1,1,2,2,3,3][c];l==="widehat"||l==="widecheck"?(o=[0,1062,2364,2364,2364][m],u=[0,239,300,360,420][m],f=[0,.24,.3,.3,.36,.42][m],h=l+m):(o=[0,600,1033,2339,2340][m],u=[0,260,286,306,312][m],f=[0,.26,.286,.3,.306,.34][m],h="tilde"+m)}var x=new Ti(h),y=new ii([x],{width:"100%",height:ue(f),viewBox:"0 0 "+o+" "+u,preserveAspectRatio:"none"});return{span:Ei([],[y],t),minWidth:0,height:f}}else{var g=[],p=Ng[l];if(!p)throw new Error('No SVG data for "'+l+'".');var[A,C,S]=p,N=S/1e3,I=A.length,D,U;if(I===1){if(p.length!==4)throw new Error('Expected 4-tuple for single-path SVG data "'+l+'".');D=["hide-tail"],U=[p[3]]}else if(I===2)D=["halfarrow-left","halfarrow-right"],U=["xMinYMin","xMaxYMin"];else if(I===3)D=["brace-left","brace-center","brace-right"],U=["xMinYMin","xMidYMin","xMaxYMin"];else throw new Error(`Correct katexImagesData or update code here to support
                    `+I+" children.");for(var T=0;T<I;T++){var w=new Ti(A[T]),F=new ii([w],{width:"400em",height:ue(N),viewBox:"0 0 "+o+" "+S,preserveAspectRatio:U[T]+" slice"}),V=Ei([D[T]],[F],t);if(I===1)return{span:V,minWidth:C,height:N};V.style.height=ue(N),g.push(V)}return{span:se(["stretchy"],g,t),minWidth:C,height:N}}}var{span:r,minWidth:a,height:s}=n();return r.height=s,r.style.height=ue(s),a>0&&(r.style.minWidth=ue(a)),r},zg=function(e,t,n,r,a){var s,o=e.height+e.depth+n+r;if(/fbox|color|angl/.test(t)){if(s=se(["stretchy",t],[],a),t==="fbox"){var l=a.color&&a.getColor();l&&(s.style.borderColor=l)}}else{var c=[];/^[bx]cancel$/.test(t)&&c.push(new r0({x1:"0",y1:"0",x2:"100%",y2:"100%","stroke-width":"0.046em"})),/^x?cancel$/.test(t)&&c.push(new r0({x1:"0",y1:"100%",x2:"100%",y2:"0","stroke-width":"0.046em"}));var u=new ii(c,{width:"100%",height:ue(o)});s=Ei([],[u],a)}return s.height=o,s.style.height=ue(o),s},Og={bin:1,close:1,inner:1,open:1,punct:1,rel:1},Bg={"accent-token":1,mathord:1,"op-token":1,spacing:1,textord:1};function Hg(i){return i in Og}function Qe(i,e){if(!i||i.type!==e)throw new Error("Expected node of type "+e+", but got "+(i?"node of type "+i.type:String(i)));return i}function ls(i){var e=cs(i);if(!e)throw new Error("Expected node of symbol group type, but got "+(i?"node of type "+i.type:String(i)));return e}function cs(i){return i&&(i.type==="atom"||Bg.hasOwnProperty(i.type))?i:null}var Vu=i=>{if(i instanceof fn)return i;if(fg(i)&&i.children.length===1)return Vu(i.children[0])},k0=(i,e)=>{var t,n,r;i&&i.type==="supsub"?(n=Qe(i.base,"accent"),t=n.base,i.base=t,r=dg(dt(i,e)),i.base=n):(n=Qe(i,"accent"),t=n.base);var a=dt(t,e.havingCrampedStyle()),s=n.isShifty&&ri(t),o=0;if(s){var l,c;o=(l=(c=Vu(a))==null?void 0:c.skew)!=null?l:0}var u=n.label==="\\c",h=u?a.height+a.depth:Math.min(a.height,e.fontMetrics().xHeight),f;if(n.isStretchy)f=os(n,e),f=ht({positionType:"firstBaseline",children:[{type:"elem",elem:a},{type:"elem",elem:f,wrapperClasses:["svg-align"],wrapperStyle:o>0?{width:"calc(100% - "+ue(2*o)+")",marginLeft:ue(2*o)}:void 0}]});else{var m,x;n.label==="\\vec"?(m=Uu("vec",e),x=Fu.vec[1]):(m=as({mode:n.mode,text:n.label},e,"textord"),m=hg(m),m.italic=0,x=m.width,u&&(h+=m.depth)),f=se(["accent-body"],[m]);var y=n.label==="\\textcircled";y&&(f.classes.push("accent-full"),h=a.height);var g=o;y||(g-=x/2),f.style.left=ue(g),n.label==="\\textcircled"&&(f.style.top=".2em"),f=ht({positionType:"firstBaseline",children:[{type:"elem",elem:a},{type:"kern",size:-h},{type:"elem",elem:f}]})}var p=se(["mord","accent"],[f],e);return r?(r.children[0]=p,r.height=Math.max(p.height,r.height),r.classes[0]="mord",r):p},Gu=(i,e)=>{var t=i.isStretchy?ss(i.label):new le("mo",[_n(i.label,i.mode)]),n=new le("mover",[xt(i.base,e),t]);return n.setAttribute("accent","true"),n},Vg=new RegExp(["\\acute","\\grave","\\ddot","\\tilde","\\bar","\\breve","\\check","\\hat","\\vec","\\dot","\\mathring"].map(i=>"\\"+i).join("|"));be({type:"accent",names:["\\acute","\\grave","\\ddot","\\tilde","\\bar","\\breve","\\check","\\hat","\\vec","\\dot","\\mathring","\\widecheck","\\widehat","\\widetilde","\\overrightarrow","\\overleftarrow","\\Overrightarrow","\\overleftrightarrow","\\overgroup","\\overlinesegment","\\overleftharpoon","\\overrightharpoon"],props:{numArgs:1},handler:(i,e)=>{var t=Za(e[0]),n=!Vg.test(i.funcName),r=!n||i.funcName==="\\widehat"||i.funcName==="\\widetilde"||i.funcName==="\\widecheck";return{type:"accent",mode:i.parser.mode,label:i.funcName,isStretchy:n,isShifty:r,base:t}},htmlBuilder:k0,mathmlBuilder:Gu});be({type:"accent",names:["\\'","\\`","\\^","\\~","\\=","\\u","\\.",'\\"',"\\c","\\r","\\H","\\v","\\textcircled"],props:{numArgs:1,allowedInText:!0,allowedInMath:!0,argTypes:["primitive"]},handler:(i,e)=>{var t=e[0],n=i.parser.mode;return n==="math"&&(i.parser.settings.reportNonstrict("mathVsTextAccents","LaTeX's accent "+i.funcName+" works only in text mode"),n="text"),{type:"accent",mode:n,label:i.funcName,isStretchy:!1,isShifty:!0,base:t}},htmlBuilder:k0,mathmlBuilder:Gu});be({type:"accentUnder",names:["\\underleftarrow","\\underrightarrow","\\underleftrightarrow","\\undergroup","\\underlinesegment","\\utilde"],props:{numArgs:1},handler:(i,e)=>{var{parser:t,funcName:n}=i,r=e[0];return{type:"accentUnder",mode:t.mode,label:n,base:r}},htmlBuilder:(i,e)=>{var t=dt(i.base,e),n=os(i,e),r=i.label==="\\utilde"?.12:0,a=ht({positionType:"top",positionData:t.height,children:[{type:"elem",elem:n,wrapperClasses:["svg-align"]},{type:"kern",size:r},{type:"elem",elem:t}]});return se(["mord","accentunder"],[a],e)},mathmlBuilder:(i,e)=>{var t=ss(i.label),n=new le("munder",[xt(i.base,e),t]);return n.setAttribute("accentunder","true"),n}});var Da=i=>{var e=new le("mpadded",i?[i]:[]);return e.setAttribute("width","+0.6em"),e.setAttribute("lspace","0.3em"),e};be({type:"xArrow",names:["\\xleftarrow","\\xrightarrow","\\xLeftarrow","\\xRightarrow","\\xleftrightarrow","\\xLeftrightarrow","\\xhookleftarrow","\\xhookrightarrow","\\xmapsto","\\xrightharpoondown","\\xrightharpoonup","\\xleftharpoondown","\\xleftharpoonup","\\xrightleftharpoons","\\xleftrightharpoons","\\xlongequal","\\xtwoheadrightarrow","\\xtwoheadleftarrow","\\xtofrom","\\xrightleftarrows","\\xrightequilibrium","\\xleftequilibrium","\\\\cdrightarrow","\\\\cdleftarrow","\\\\cdlongequal"],props:{numArgs:1,numOptionalArgs:1},handler(i,e,t){var{parser:n,funcName:r}=i;return{type:"xArrow",mode:n.mode,label:r,body:e[0],below:t[0]}},htmlBuilder(i,e){var t=e.style,n=e.havingStyle(t.sup()),r=Sr(dt(i.body,n,e),e),a=i.label.slice(0,2)==="\\x"?"x":"cd";r.classes.push(a+"-arrow-pad");var s;i.below&&(n=e.havingStyle(t.sub()),s=Sr(dt(i.below,n,e),e),s.classes.push(a+"-arrow-pad"));var o=os(i,e),l=-e.fontMetrics().axisHeight+.5*o.height,c=-e.fontMetrics().axisHeight-.5*o.height-.111;(r.depth>.25||i.label==="\\xleftequilibrium")&&(c-=r.depth);var u;if(s){var h=-e.fontMetrics().axisHeight+s.height+.5*o.height+.111;u=ht({positionType:"individualShift",children:[{type:"elem",elem:r,shift:c},{type:"elem",elem:o,shift:l,wrapperClasses:["svg-align"]},{type:"elem",elem:s,shift:h}]})}else u=ht({positionType:"individualShift",children:[{type:"elem",elem:r,shift:c},{type:"elem",elem:o,shift:l,wrapperClasses:["svg-align"]}]});return se(["mrel","x-arrow"],[u],e)},mathmlBuilder(i,e){var t=ss(i.label);t.setAttribute("minsize",i.label.charAt(0)==="x"?"1.75em":"3.0em");var n;if(i.body){var r=Da(xt(i.body,e));if(i.below){var a=Da(xt(i.below,e));n=new le("munderover",[t,a,r])}else n=new le("mover",[t,r])}else if(i.below){var s=Da(xt(i.below,e));n=new le("munder",[t,s])}else n=Da(),n=new le("mover",[t,n]);return n}});function Wu(i,e){var t=Bt(i.body,e,!0);return se([i.mclass],t,e)}function qu(i,e){var t,n=mn(i.body,e);return i.mclass==="minner"?t=new le("mpadded",n):i.mclass==="mord"?i.isCharacterBox?(t=n[0],t.type="mi"):t=new le("mi",n):(i.isCharacterBox?(t=n[0],t.type="mo"):t=new le("mo",n),i.mclass==="mbin"?(t.attributes.lspace="0.22em",t.attributes.rspace="0.22em"):i.mclass==="mpunct"?(t.attributes.lspace="0em",t.attributes.rspace="0.17em"):i.mclass==="mopen"||i.mclass==="mclose"?(t.attributes.lspace="0em",t.attributes.rspace="0em"):i.mclass==="minner"&&(t.attributes.lspace="0.0556em",t.attributes.width="+0.1111em")),t}be({type:"mclass",names:["\\mathord","\\mathbin","\\mathrel","\\mathopen","\\mathclose","\\mathpunct","\\mathinner"],props:{numArgs:1,primitive:!0},handler(i,e){var{parser:t,funcName:n}=i,r=e[0];return{type:"mclass",mode:t.mode,mclass:"m"+n.slice(5),body:Ft(r),isCharacterBox:ri(r)}},htmlBuilder:Wu,mathmlBuilder:qu});var us=i=>{var e=i.type==="ordgroup"&&i.body.length?i.body[0]:i;return e.type==="atom"&&(e.family==="bin"||e.family==="rel")?"m"+e.family:"mord"};be({type:"mclass",names:["\\@binrel"],props:{numArgs:2},handler(i,e){var{parser:t}=i;return{type:"mclass",mode:t.mode,mclass:us(e[0]),body:Ft(e[1]),isCharacterBox:ri(e[1])}}});be({type:"mclass",names:["\\stackrel","\\overset","\\underset"],props:{numArgs:2},handler(i,e){var{parser:t,funcName:n}=i,r=e[1],a=e[0],s;n!=="\\stackrel"?s=us(r):s="mrel";var o={type:"op",mode:r.mode,limits:!0,alwaysHandleSupSub:!0,parentIsSupSub:!1,symbol:!1,suppressBaseShift:n!=="\\stackrel",body:Ft(r)},l={type:"supsub",mode:a.mode,base:o,sup:n==="\\underset"?null:a,sub:n==="\\underset"?a:null};return{type:"mclass",mode:t.mode,mclass:s,body:[l],isCharacterBox:ri(l)}},htmlBuilder:Wu,mathmlBuilder:qu});be({type:"pmb",names:["\\pmb"],props:{numArgs:1,allowedInText:!0},handler(i,e){var{parser:t}=i;return{type:"pmb",mode:t.mode,mclass:us(e[0]),body:Ft(e[0])}},htmlBuilder(i,e){var t=Bt(i.body,e,!0),n=se([i.mclass],t,e);return n.style.textShadow="0.02em 0.01em 0.04px",n},mathmlBuilder(i,e){var t=mn(i.body,e),n=new le("mstyle",t);return n.setAttribute("style","text-shadow: 0.02em 0.01em 0.04px"),n}});var Gg={">":"\\\\cdrightarrow","<":"\\\\cdleftarrow","=":"\\\\cdlongequal",A:"\\uparrow",V:"\\downarrow","|":"\\Vert",".":"no arrow"},_c=()=>({type:"styling",body:[],mode:"math",style:"display",resetFont:!0}),bc=i=>i.type==="textord"&&i.text==="@",Wg=(i,e)=>(i.type==="mathord"||i.type==="atom")&&i.text===e;function qg(i,e,t){var n=Gg[i];switch(n){case"\\\\cdrightarrow":case"\\\\cdleftarrow":return t.callFunction(n,[e[0]],[e[1]]);case"\\uparrow":case"\\downarrow":{var r=t.callFunction("\\\\cdleft",[e[0]],[]),a={type:"atom",text:n,mode:"math",family:"rel"},s=t.callFunction("\\Big",[a],[]),o=t.callFunction("\\\\cdright",[e[1]],[]),l={type:"ordgroup",mode:"math",body:[r,s,o]};return t.callFunction("\\\\cdparent",[l],[])}case"\\\\cdlongequal":return t.callFunction("\\\\cdlongequal",[],[]);case"\\Vert":{var c={type:"textord",text:"\\Vert",mode:"math"};return t.callFunction("\\Big",[c],[])}default:return{type:"textord",text:" ",mode:"math"}}}function Xg(i){var e=[];for(i.gullet.beginGroup(),i.gullet.macros.set("\\cr","\\\\\\relax"),i.gullet.beginGroup();;){e.push(i.parseExpression(!1,"\\\\")),i.gullet.endGroup(),i.gullet.beginGroup();var t=i.fetch().text;if(t==="&"||t==="\\\\")i.consume();else if(t==="\\end"){e[e.length-1].length===0&&e.pop();break}else throw new oe("Expected \\\\ or \\cr or \\end",i.nextToken)}for(var n=[],r=[n],a=0;a<e.length;a++){for(var s=e[a],o=_c(),l=0;l<s.length;l++)if(!bc(s[l]))o.body.push(s[l]);else{n.push(o),l+=1;var c=ls(s[l]).text,u=new Array(2);if(u[0]={type:"ordgroup",mode:"math",body:[]},u[1]={type:"ordgroup",mode:"math",body:[]},!"=|.".includes(c))if("<>AV".includes(c))for(var h=0;h<2;h++){for(var f=!0,m=l+1;m<s.length;m++){if(Wg(s[m],c)){f=!1,l=m;break}if(bc(s[m]))throw new oe("Missing a "+c+" character to complete a CD arrow.",s[m]);u[h].body.push(s[m])}if(f)throw new oe("Missing a "+c+" character to complete a CD arrow.",s[l])}else throw new oe('Expected one of "<>AV=|." after @',s[l]);var x=qg(c,u,i),y={type:"styling",body:[x],mode:"math",style:"display",resetFont:!0};n.push(y),o=_c()}a%2===0?n.push(o):n.shift(),n=[],r.push(n)}i.gullet.endGroup(),i.gullet.endGroup();var g=new Array(r[0].length).fill({type:"align",align:"c",pregap:.25,postgap:.25});return{type:"array",mode:"math",body:r,arraystretch:1,addJot:!0,rowGaps:[null],cols:g,colSeparationType:"CD",hLinesBeforeRow:new Array(r.length+1).fill([])}}be({type:"cdlabel",names:["\\\\cdleft","\\\\cdright"],props:{numArgs:1},handler(i,e){var{parser:t,funcName:n}=i;return{type:"cdlabel",mode:t.mode,side:n.slice(4),label:e[0]}},htmlBuilder(i,e){var t=e.havingStyle(e.style.sup()),n=Sr(dt(i.label,t,e),e);return n.classes.push("cd-label-"+i.side),n.style.bottom=ue(.8-n.depth),n.height=0,n.depth=0,n},mathmlBuilder(i,e){var t=new le("mrow",[xt(i.label,e)]);return t=new le("mpadded",[t]),t.setAttribute("width","0"),i.side==="left"&&t.setAttribute("lspace","-1width"),t.setAttribute("voffset","0.7em"),t=new le("mstyle",[t]),t.setAttribute("displaystyle","false"),t.setAttribute("scriptlevel","1"),t}});be({type:"cdlabelparent",names:["\\\\cdparent"],props:{numArgs:1},handler(i,e){var{parser:t}=i;return{type:"cdlabelparent",mode:t.mode,fragment:e[0]}},htmlBuilder(i,e){var t=Sr(dt(i.fragment,e),e);return t.classes.push("cd-vert-arrow"),t},mathmlBuilder(i,e){return new le("mrow",[xt(i.fragment,e)])}});be({type:"textord",names:["\\@char"],props:{numArgs:1,allowedInText:!0},handler(i,e){for(var{parser:t}=i,n=Qe(e[0],"ordgroup"),r=n.body,a="",s=0;s<r.length;s++){var o=Qe(r[s],"textord");a+=o.text}var l=parseInt(a),c;if(isNaN(l))throw new oe("\\@char has non-numeric argument "+a);if(l<0||l>=1114111)throw new oe("\\@char with invalid code point "+a);return l<=65535?c=String.fromCharCode(l):(l-=65536,c=String.fromCharCode((l>>10)+55296,(l&1023)+56320)),{type:"textord",mode:t.mode,text:c}}});var Xu=(i,e)=>{var t=Bt(i.body,e.withColor(i.color),!1);return si(t)},$u=(i,e)=>{var t=mn(i.body,e.withColor(i.color)),n=new le("mstyle",t);return n.setAttribute("mathcolor",i.color),n};be({type:"color",names:["\\textcolor"],props:{numArgs:2,allowedInText:!0,argTypes:["color","original"]},handler(i,e){var{parser:t}=i,n=Qe(e[0],"color-token").color,r=e[1];return{type:"color",mode:t.mode,color:n,body:Ft(r)}},htmlBuilder:Xu,mathmlBuilder:$u});be({type:"color",names:["\\color"],props:{numArgs:1,allowedInText:!0,argTypes:["color"]},handler(i,e){var{parser:t,breakOnTokenText:n}=i,r=Qe(e[0],"color-token").color;t.gullet.macros.set("\\current@color",r);var a=t.parseExpression(!0,n);return{type:"color",mode:t.mode,color:r,body:a}},htmlBuilder:Xu,mathmlBuilder:$u});be({type:"cr",names:["\\\\"],props:{numArgs:0,numOptionalArgs:0,allowedInText:!0},handler(i,e,t){var{parser:n}=i,r=n.gullet.future().text==="["?n.parseSizeGroup(!0):null,a=!n.settings.displayMode||!n.settings.useStrictBehavior("newLineInDisplayMode","In LaTeX, \\\\ or \\newline does nothing in display mode");return{type:"cr",mode:n.mode,newLine:a,size:r&&Qe(r,"size").value}},htmlBuilder(i,e){var t=se(["mspace"],[],e);return i.newLine&&(t.classes.push("newline"),i.size&&(t.style.marginTop=ue(At(i.size,e)))),t},mathmlBuilder(i,e){var t=new le("mspace");return i.newLine&&(t.setAttribute("linebreak","newline"),i.size&&t.setAttribute("height",ue(At(i.size,e)))),t}});var m0={"\\global":"\\global","\\long":"\\\\globallong","\\\\globallong":"\\\\globallong","\\def":"\\gdef","\\gdef":"\\gdef","\\edef":"\\xdef","\\xdef":"\\xdef","\\let":"\\\\globallet","\\futurelet":"\\\\globalfuture"},Yu=i=>{var e=i.text;if(/^(?:[\\{}$&#^_]|EOF)$/.test(e))throw new oe("Expected a control sequence",i);return e},$g=i=>{var e=i.gullet.popToken();return e.text==="="&&(e=i.gullet.popToken(),e.text===" "&&(e=i.gullet.popToken())),e},Ku=(i,e,t,n)=>{var r=i.gullet.macros.get(t.text);r==null&&(t.noexpand=!0,r={tokens:[t],numArgs:0,unexpandable:!i.gullet.isExpandable(t.text)}),i.gullet.macros.set(e,r,n)};be({type:"internal",names:["\\global","\\long","\\\\globallong"],props:{numArgs:0,allowedInText:!0},handler(i){var{parser:e,funcName:t}=i;e.consumeSpaces();var n=e.fetch();if(m0[n.text])return(t==="\\global"||t==="\\\\globallong")&&(n.text=m0[n.text]),Qe(e.parseFunction(),"internal");throw new oe("Invalid token after macro prefix",n)}});be({type:"internal",names:["\\def","\\gdef","\\edef","\\xdef"],props:{numArgs:0,allowedInText:!0,primitive:!0},handler(i){var{parser:e,funcName:t}=i,n=e.gullet.popToken(),r=n.text;if(/^(?:[\\{}$&#^_]|EOF)$/.test(r))throw new oe("Expected a control sequence",n);for(var a=0,s,o=[[]];e.gullet.future().text!=="{";)if(n=e.gullet.popToken(),n.text==="#"){if(e.gullet.future().text==="{"){s=e.gullet.future(),o[a].push("{");break}if(n=e.gullet.popToken(),!/^[1-9]$/.test(n.text))throw new oe('Invalid argument number "'+n.text+'"');if(parseInt(n.text)!==a+1)throw new oe('Argument number "'+n.text+'" out of order');a++,o.push([])}else{if(n.text==="EOF")throw new oe("Expected a macro definition");o[a].push(n.text)}var{tokens:l}=e.gullet.consumeArg();return s&&l.unshift(s),(t==="\\edef"||t==="\\xdef")&&(l=e.gullet.expandTokens(l),l.reverse()),e.gullet.macros.set(r,{tokens:l,numArgs:a,delimiters:o},t===m0[t]),{type:"internal",mode:e.mode}}});be({type:"internal",names:["\\let","\\\\globallet"],props:{numArgs:0,allowedInText:!0,primitive:!0},handler(i){var{parser:e,funcName:t}=i,n=Yu(e.gullet.popToken());e.gullet.consumeSpaces();var r=$g(e);return Ku(e,n,r,t==="\\\\globallet"),{type:"internal",mode:e.mode}}});be({type:"internal",names:["\\futurelet","\\\\globalfuture"],props:{numArgs:0,allowedInText:!0,primitive:!0},handler(i){var{parser:e,funcName:t}=i,n=Yu(e.gullet.popToken()),r=e.gullet.popToken(),a=e.gullet.popToken();return Ku(e,n,a,t==="\\\\globalfuture"),e.gullet.pushToken(a),e.gullet.pushToken(r),{type:"internal",mode:e.mode}}});var Hr=function(e,t,n){var r=wt.math[e]&&wt.math[e].replace,a=I0(r||e,t,n);if(!a)throw new Error("Unsupported symbol "+e+" and font size "+t+".");return a},z0=function(e,t,n,r){var a=n.havingBaseStyle(t),s=se(r.concat(a.sizingClasses(n)),[e],n),o=a.sizeMultiplier/n.sizeMultiplier;return s.height*=o,s.depth*=o,s.maxFontSize=a.sizeMultiplier,s},ju=function(e,t,n){var r=t.havingBaseStyle(n),a=(1-t.sizeMultiplier/r.sizeMultiplier)*t.fontMetrics().axisHeight;e.classes.push("delimcenter"),e.style.top=ue(a),e.height-=a,e.depth+=a},Yg=function(e,t,n,r,a,s){var o=jt(e,"Main-Regular",a,r),l=z0(o,t,r,s);return ju(l,r,t),l},Kg=function(e,t,n,r){return jt(e,"Size"+t+"-Regular",n,r)},Zu=function(e,t,n,r,a,s){var o=Kg(e,t,a,r),l=z0(se(["delimsizing","size"+t],[o],r),Ye.TEXT,r,s);return n&&ju(l,r,Ye.TEXT),l},to=function(e,t,n){var r;t==="Size1-Regular"?r="delim-size1":r="delim-size4";var a=se(["delimsizinginner",r],[se([],[jt(e,t,n)])]);return{type:"elem",elem:a}},no=function(e,t,n){var r=kn["Size4-Regular"][e.charCodeAt(0)]?kn["Size4-Regular"][e.charCodeAt(0)][4]:kn["Size1-Regular"][e.charCodeAt(0)][4],a=new Ti("inner",rg(e,Math.round(1e3*t))),s=new ii([a],{width:ue(r),height:ue(t),style:"width:"+ue(r),viewBox:"0 0 "+1e3*r+" "+Math.round(1e3*t),preserveAspectRatio:"xMinYMin"}),o=Ei([],[s],n);return o.height=t,o.style.height=ue(t),o.style.width=ue(r),{type:"elem",elem:o}},v0=.008,Ia={type:"kern",size:-1*v0},jg=new Set(["|","\\lvert","\\rvert","\\vert"]),Zg=new Set(["\\|","\\lVert","\\rVert","\\Vert"]),Ju=function(e,t,n,r,a,s){var o,l,c,u,h="",f=0;o=c=u=e,l=null;var m="Size1-Regular";e==="\\uparrow"?c=u="⏐":e==="\\Uparrow"?c=u="‖":e==="\\downarrow"?o=c="⏐":e==="\\Downarrow"?o=c="‖":e==="\\updownarrow"?(o="\\uparrow",c="⏐",u="\\downarrow"):e==="\\Updownarrow"?(o="\\Uparrow",c="‖",u="\\Downarrow"):jg.has(e)?(c="∣",h="vert",f=333):Zg.has(e)?(c="∥",h="doublevert",f=556):e==="["||e==="\\lbrack"?(o="⎡",c="⎢",u="⎣",m="Size4-Regular",h="lbrack",f=667):e==="]"||e==="\\rbrack"?(o="⎤",c="⎥",u="⎦",m="Size4-Regular",h="rbrack",f=667):e==="\\lfloor"||e==="⌊"?(c=o="⎢",u="⎣",m="Size4-Regular",h="lfloor",f=667):e==="\\lceil"||e==="⌈"?(o="⎡",c=u="⎢",m="Size4-Regular",h="lceil",f=667):e==="\\rfloor"||e==="⌋"?(c=o="⎥",u="⎦",m="Size4-Regular",h="rfloor",f=667):e==="\\rceil"||e==="⌉"?(o="⎤",c=u="⎥",m="Size4-Regular",h="rceil",f=667):e==="("||e==="\\lparen"?(o="⎛",c="⎜",u="⎝",m="Size4-Regular",h="lparen",f=875):e===")"||e==="\\rparen"?(o="⎞",c="⎟",u="⎠",m="Size4-Regular",h="rparen",f=875):e==="\\{"||e==="\\lbrace"?(o="⎧",l="⎨",u="⎩",c="⎪",m="Size4-Regular"):e==="\\}"||e==="\\rbrace"?(o="⎫",l="⎬",u="⎭",c="⎪",m="Size4-Regular"):e==="\\lgroup"||e==="⟮"?(o="⎧",u="⎩",c="⎪",m="Size4-Regular"):e==="\\rgroup"||e==="⟯"?(o="⎫",u="⎭",c="⎪",m="Size4-Regular"):e==="\\lmoustache"||e==="⎰"?(o="⎧",u="⎭",c="⎪",m="Size4-Regular"):(e==="\\rmoustache"||e==="⎱")&&(o="⎫",u="⎩",c="⎪",m="Size4-Regular");var x=Hr(o,m,a),y=x.height+x.depth,g=Hr(c,m,a),p=g.height+g.depth,A=Hr(u,m,a),C=A.height+A.depth,S=0,N=1;if(l!==null){var I=Hr(l,m,a);S=I.height+I.depth,N=2}var D=y+C+S,U=Math.max(0,Math.ceil((t-D)/(N*p))),T=D+U*N*p,w=r.fontMetrics().axisHeight;n&&(w*=r.sizeMultiplier);var F=T/2-w,V=[];if(h.length>0){var G=T-y-C,K=Math.round(T*1e3),J=ag(h,Math.round(G*1e3)),j=new Ti(h,J),te=ue(f/1e3),Y=ue(K/1e3),fe=new ii([j],{width:te,height:Y,viewBox:"0 0 "+f+" "+K}),pe=Ei([],[fe],r);pe.height=K/1e3,pe.style.width=te,pe.style.height=Y,V.push({type:"elem",elem:pe})}else{if(V.push(to(u,m,a)),V.push(Ia),l===null){var ye=T-y-C+2*v0;V.push(no(c,ye,r))}else{var ke=(T-y-C-S)/2+2*v0;V.push(no(c,ke,r)),V.push(Ia),V.push(to(l,m,a)),V.push(Ia),V.push(no(c,ke,r))}V.push(Ia),V.push(to(o,m,a))}var qe=r.havingBaseStyle(Ye.TEXT),Q=ht({positionType:"bottom",positionData:F,children:V});return z0(se(["delimsizing","mult"],[Q],qe),Ye.TEXT,r,s)},io=80,ro=.08,ao=function(e,t,n,r,a){var s=ig(e,r,n),o=new Ti(e,s),l=new ii([o],{width:"400em",height:ue(t),viewBox:"0 0 400000 "+n,preserveAspectRatio:"xMinYMin slice"});return Ei(["hide-tail"],[l],a)},Jg=function(e,t){var n=t.havingBaseSizing(),r=ih("\\surd",e*n.sizeMultiplier,nh,n),a=n.sizeMultiplier,s=Math.max(0,t.minRuleThickness-t.fontMetrics().sqrtRuleThickness),o,l,c,u,h;return r.type==="small"?(u=1e3+1e3*s+io,e<1?a=1:e<1.4&&(a=.7),l=(1+s+ro)/a,c=(1+s)/a,o=ao("sqrtMain",l,u,s,t),o.style.minWidth="0.853em",h=.833/a):r.type==="large"?(u=(1e3+io)*Vr[r.size],c=(Vr[r.size]+s)/a,l=(Vr[r.size]+s+ro)/a,o=ao("sqrtSize"+r.size,l,u,s,t),o.style.minWidth="1.02em",h=1/a):(l=e+s+ro,c=e+s,u=Math.floor(1e3*e+s)+io,o=ao("sqrtTall",l,u,s,t),o.style.minWidth="0.742em",h=1.056),o.height=c,o.style.height=ue(l),{span:o,advanceWidth:h,ruleWidth:(t.fontMetrics().sqrtRuleThickness+s)*a}},Qu=new Set(["(","\\lparen",")","\\rparen","[","\\lbrack","]","\\rbrack","\\{","\\lbrace","\\}","\\rbrace","\\lfloor","\\rfloor","⌊","⌋","\\lceil","\\rceil","⌈","⌉","\\surd"]),Qg=new Set(["\\uparrow","\\downarrow","\\updownarrow","\\Uparrow","\\Downarrow","\\Updownarrow","|","\\|","\\vert","\\Vert","\\lvert","\\rvert","\\lVert","\\rVert","\\lgroup","\\rgroup","⟮","⟯","\\lmoustache","\\rmoustache","⎰","⎱"]),eh=new Set(["<",">","\\langle","\\rangle","/","\\backslash","\\lt","\\gt"]),Vr=[0,1.2,1.8,2.4,3],th=function(e,t,n,r,a){if(e==="<"||e==="\\lt"||e==="⟨"?e="\\langle":(e===">"||e==="\\gt"||e==="⟩")&&(e="\\rangle"),Qu.has(e)||eh.has(e))return Zu(e,t,!1,n,r,a);if(Qg.has(e))return Ju(e,Vr[t],!1,n,r,a);throw new oe("Illegal delimiter: '"+e+"'")},e2=[{type:"small",style:Ye.SCRIPTSCRIPT},{type:"small",style:Ye.SCRIPT},{type:"small",style:Ye.TEXT},{type:"large",size:1},{type:"large",size:2},{type:"large",size:3},{type:"large",size:4}],t2=[{type:"small",style:Ye.SCRIPTSCRIPT},{type:"small",style:Ye.SCRIPT},{type:"small",style:Ye.TEXT},{type:"stack"}],nh=[{type:"small",style:Ye.SCRIPTSCRIPT},{type:"small",style:Ye.SCRIPT},{type:"small",style:Ye.TEXT},{type:"large",size:1},{type:"large",size:2},{type:"large",size:3},{type:"large",size:4},{type:"stack"}],n2=function(e){if(e.type==="small")return"Main-Regular";if(e.type==="large")return"Size"+e.size+"-Regular";if(e.type==="stack")return"Size4-Regular";var t=e.type;throw new Error("Add support for delim type '"+t+"' here.")},ih=function(e,t,n,r){for(var a=Math.min(2,3-r.style.size),s=a;s<n.length;s++){var o=n[s];if(o.type==="stack")break;var l=Hr(e,n2(o),"math"),c=l.height+l.depth;if(o.type==="small"){var u=r.havingBaseStyle(o.style);c*=u.sizeMultiplier}if(c>t)return o}return n[n.length-1]},g0=function(e,t,n,r,a,s){e==="<"||e==="\\lt"||e==="⟨"?e="\\langle":(e===">"||e==="\\gt"||e==="⟩")&&(e="\\rangle");var o;eh.has(e)?o=e2:Qu.has(e)?o=nh:o=t2;var l=ih(e,t,o,r);return l.type==="small"?Yg(e,l.style,n,r,a,s):l.type==="large"?Zu(e,l.size,n,r,a,s):Ju(e,t,n,r,a,s)},so=function(e,t,n,r,a,s){var o=r.fontMetrics().axisHeight*r.sizeMultiplier,l=901,c=5/r.fontMetrics().ptPerEm,u=Math.max(t-o,n+o),h=Math.max(u/500*l,2*u-c);return g0(e,h,!0,r,a,s)},Mc={"\\bigl":{mclass:"mopen",size:1},"\\Bigl":{mclass:"mopen",size:2},"\\biggl":{mclass:"mopen",size:3},"\\Biggl":{mclass:"mopen",size:4},"\\bigr":{mclass:"mclose",size:1},"\\Bigr":{mclass:"mclose",size:2},"\\biggr":{mclass:"mclose",size:3},"\\Biggr":{mclass:"mclose",size:4},"\\bigm":{mclass:"mrel",size:1},"\\Bigm":{mclass:"mrel",size:2},"\\biggm":{mclass:"mrel",size:3},"\\Biggm":{mclass:"mrel",size:4},"\\big":{mclass:"mord",size:1},"\\Big":{mclass:"mord",size:2},"\\bigg":{mclass:"mord",size:3},"\\Bigg":{mclass:"mord",size:4}},i2=new Set(["(","\\lparen",")","\\rparen","[","\\lbrack","]","\\rbrack","\\{","\\lbrace","\\}","\\rbrace","\\lfloor","\\rfloor","⌊","⌋","\\lceil","\\rceil","⌈","⌉","<",">","\\langle","⟨","\\rangle","⟩","\\lt","\\gt","\\lvert","\\rvert","\\lVert","\\rVert","\\lgroup","\\rgroup","⟮","⟯","\\lmoustache","\\rmoustache","⎰","⎱","/","\\backslash","|","\\vert","\\|","\\Vert","\\uparrow","\\Uparrow","\\downarrow","\\Downarrow","\\updownarrow","\\Updownarrow","."]);function Sc(i){return"isMiddle"in i}function hs(i,e){var t=cs(i);if(t&&i2.has(t.text))return t;throw t?new oe("Invalid delimiter '"+t.text+"' after '"+e.funcName+"'",i):new oe("Invalid delimiter type '"+i.type+"'",i)}be({type:"delimsizing",names:["\\bigl","\\Bigl","\\biggl","\\Biggl","\\bigr","\\Bigr","\\biggr","\\Biggr","\\bigm","\\Bigm","\\biggm","\\Biggm","\\big","\\Big","\\bigg","\\Bigg"],props:{numArgs:1,argTypes:["primitive"]},handler:(i,e)=>{var t=hs(e[0],i);return{type:"delimsizing",mode:i.parser.mode,size:Mc[i.funcName].size,mclass:Mc[i.funcName].mclass,delim:t.text}},htmlBuilder:(i,e)=>i.delim==="."?se([i.mclass]):th(i.delim,i.size,e,i.mode,[i.mclass]),mathmlBuilder:i=>{var e=[];i.delim!=="."&&e.push(_n(i.delim,i.mode));var t=new le("mo",e);i.mclass==="mopen"||i.mclass==="mclose"?t.setAttribute("fence","true"):t.setAttribute("fence","false"),t.setAttribute("stretchy","true");var n=ue(Vr[i.size]);return t.setAttribute("minsize",n),t.setAttribute("maxsize",n),t}});function wc(i){if(!i.body)throw new Error("Bug: The leftright ParseNode wasn't fully parsed.")}be({type:"leftright-right",names:["\\right"],props:{numArgs:1,primitive:!0},handler:(i,e)=>{var t=i.parser.gullet.macros.get("\\current@color");if(t&&typeof t!="string")throw new oe("\\current@color set to non-string in \\right");return{type:"leftright-right",mode:i.parser.mode,delim:hs(e[0],i).text,color:t}}});be({type:"leftright",names:["\\left"],props:{numArgs:1,primitive:!0},handler:(i,e)=>{var t=hs(e[0],i),n=i.parser;++n.leftrightDepth;var r=n.parseExpression(!1);--n.leftrightDepth,n.expect("\\right",!1);var a=Qe(n.parseFunction(),"leftright-right");return{type:"leftright",mode:n.mode,body:r,left:t.text,right:a.delim,rightColor:a.color}},htmlBuilder:(i,e)=>{wc(i);for(var t=Bt(i.body,e,!0,["mopen","mclose"]),n=0,r=0,a=!1,s=0;s<t.length;s++){var o=t[s];Sc(o)?a=!0:(n=Math.max(t[s].height,n),r=Math.max(t[s].depth,r))}n*=e.sizeMultiplier,r*=e.sizeMultiplier;var l;if(i.left==="."?l=$r(e,["mopen"]):l=so(i.left,n,r,e,i.mode,["mopen"]),t.unshift(l),a)for(var c=1;c<t.length;c++){var u=t[c];if(Sc(u)){var h=u.isMiddle;t[c]=so(h.delim,n,r,h.options,i.mode,[])}}var f;if(i.right===".")f=$r(e,["mclose"]);else{var m=i.rightColor?e.withColor(i.rightColor):e;f=so(i.right,n,r,m,i.mode,["mclose"])}return t.push(f),se(["minner"],t,e)},mathmlBuilder:(i,e)=>{wc(i);var t=mn(i.body,e);if(i.left!=="."){var n=new le("mo",[_n(i.left,i.mode)]);n.setAttribute("fence","true"),t.unshift(n)}if(i.right!=="."){var r=new le("mo",[_n(i.right,i.mode)]);r.setAttribute("fence","true"),i.rightColor&&r.setAttribute("mathcolor",i.rightColor),t.push(r)}return U0(t)}});be({type:"middle",names:["\\middle"],props:{numArgs:1,primitive:!0},handler:(i,e)=>{var t=hs(e[0],i);if(!i.parser.leftrightDepth)throw new oe("\\middle without preceding \\left",t);return{type:"middle",mode:i.parser.mode,delim:t.text}},htmlBuilder:(i,e)=>{var t;return i.delim==="."?t=$r(e,[]):(t=th(i.delim,1,e,i.mode,[]),t.isMiddle={delim:i.delim,options:e}),t},mathmlBuilder:(i,e)=>{var t=i.delim==="\\vert"||i.delim==="|"?_n("|","text"):_n(i.delim,i.mode),n=new le("mo",[t]);return n.setAttribute("fence","true"),n.setAttribute("lspace","0.05em"),n.setAttribute("rspace","0.05em"),n}});var ds=(i,e)=>{var t=Sr(dt(i.body,e),e),n=i.label.slice(1),r=e.sizeMultiplier,a,s,o=ri(i.body);if(n==="sout")a=se(["stretchy","sout"]),a.height=e.fontMetrics().defaultRuleThickness/r,s=-.5*e.fontMetrics().xHeight;else if(n==="phase"){var l=At({number:.6,unit:"pt"},e),c=At({number:.35,unit:"ex"},e),u=e.havingBaseSizing();r=r/u.sizeMultiplier;var h=t.height+t.depth+l+c;t.style.paddingLeft=ue(h/2+l);var f=Math.floor(1e3*h*r),m=tg(f),x=new ii([new Ti("phase",m)],{width:"400em",height:ue(f/1e3),viewBox:"0 0 400000 "+f,preserveAspectRatio:"xMinYMin slice"});a=Ei(["hide-tail"],[x],e),a.style.height=ue(h),s=t.depth+l+c}else{/cancel/.test(n)?o||t.classes.push("cancel-pad"):n==="angl"?t.classes.push("anglpad"):t.classes.push("boxpad");var y,g,p=0;/box/.test(n)?(p=Math.max(e.fontMetrics().fboxrule,e.minRuleThickness),y=e.fontMetrics().fboxsep+(n==="colorbox"?0:p),g=y):n==="angl"?(p=Math.max(e.fontMetrics().defaultRuleThickness,e.minRuleThickness),y=4*p,g=Math.max(0,.25-t.depth)):(y=o?.2:0,g=y),a=zg(t,n,y,g,e),/fbox|boxed|fcolorbox/.test(n)?(a.style.borderStyle="solid",a.style.borderWidth=ue(p)):n==="angl"&&p!==.049&&(a.style.borderTopWidth=ue(p),a.style.borderRightWidth=ue(p)),s=t.depth+g,i.backgroundColor&&(a.style.backgroundColor=i.backgroundColor,i.borderColor&&(a.style.borderColor=i.borderColor))}var A;if(i.backgroundColor)A=ht({positionType:"individualShift",children:[{type:"elem",elem:a,shift:s},{type:"elem",elem:t,shift:0}]});else{var C=/cancel|phase/.test(n)?["svg-align"]:[];A=ht({positionType:"individualShift",children:[{type:"elem",elem:t,shift:0},{type:"elem",elem:a,shift:s,wrapperClasses:C}]})}return/cancel/.test(n)&&(A.height=t.height,A.depth=t.depth),/cancel/.test(n)&&!o?se(["mord","cancel-lap"],[A],e):se(["mord"],[A],e)},fs=(i,e)=>{var t,n=new le(i.label.includes("colorbox")?"mpadded":"menclose",[xt(i.body,e)]);switch(i.label){case"\\cancel":n.setAttribute("notation","updiagonalstrike");break;case"\\bcancel":n.setAttribute("notation","downdiagonalstrike");break;case"\\phase":n.setAttribute("notation","phasorangle");break;case"\\sout":n.setAttribute("notation","horizontalstrike");break;case"\\fbox":n.setAttribute("notation","box");break;case"\\angl":n.setAttribute("notation","actuarial");break;case"\\fcolorbox":case"\\colorbox":if(t=e.fontMetrics().fboxsep*e.fontMetrics().ptPerEm,n.setAttribute("width","+"+2*t+"pt"),n.setAttribute("height","+"+2*t+"pt"),n.setAttribute("lspace",t+"pt"),n.setAttribute("voffset",t+"pt"),i.label==="\\fcolorbox"){var r=Math.max(e.fontMetrics().fboxrule,e.minRuleThickness);n.setAttribute("style","border: "+ue(r)+" solid "+i.borderColor)}break;case"\\xcancel":n.setAttribute("notation","updiagonalstrike downdiagonalstrike");break}return i.backgroundColor&&n.setAttribute("mathbackground",i.backgroundColor),n};be({type:"enclose",names:["\\colorbox"],props:{numArgs:2,allowedInText:!0,argTypes:["color","hbox"]},handler(i,e,t){var{parser:n,funcName:r}=i,a=Qe(e[0],"color-token").color,s=e[1];return{type:"enclose",mode:n.mode,label:r,backgroundColor:a,body:s}},htmlBuilder:ds,mathmlBuilder:fs});be({type:"enclose",names:["\\fcolorbox"],props:{numArgs:3,allowedInText:!0,argTypes:["color","color","hbox"]},handler(i,e,t){var{parser:n,funcName:r}=i,a=Qe(e[0],"color-token").color,s=Qe(e[1],"color-token").color,o=e[2];return{type:"enclose",mode:n.mode,label:r,backgroundColor:s,borderColor:a,body:o}},htmlBuilder:ds,mathmlBuilder:fs});be({type:"enclose",names:["\\fbox"],props:{numArgs:1,argTypes:["hbox"],allowedInText:!0},handler(i,e){var{parser:t}=i;return{type:"enclose",mode:t.mode,label:"\\fbox",body:e[0]}}});be({type:"enclose",names:["\\cancel","\\bcancel","\\xcancel","\\phase"],props:{numArgs:1},handler(i,e){var{parser:t,funcName:n}=i,r=e[0];return{type:"enclose",mode:t.mode,label:n,body:r}},htmlBuilder:ds,mathmlBuilder:fs});be({type:"enclose",names:["\\sout"],props:{numArgs:1,allowedInText:!0},handler(i,e){var{parser:t,funcName:n}=i;t.mode==="math"&&t.settings.reportNonstrict("mathVsSout","LaTeX's \\sout works only in text mode");var r=e[0];return{type:"enclose",mode:t.mode,label:n,body:r}},htmlBuilder:ds,mathmlBuilder:fs});be({type:"enclose",names:["\\angl"],props:{numArgs:1,argTypes:["hbox"],allowedInText:!1},handler(i,e){var{parser:t}=i;return{type:"enclose",mode:t.mode,label:"\\angl",body:e[0]}}});var rh={};function On(i){for(var{type:e,names:t,props:n,handler:r,htmlBuilder:a,mathmlBuilder:s}=i,o={type:e,numArgs:n.numArgs||0,allowedInText:!1,numOptionalArgs:0,handler:r},l=0;l<t.length;++l)rh[t[l]]=o;a&&(Ka[e]=a),s&&(ja[e]=s)}var ah={};function M(i,e){ah[i]=e}class rn{constructor(e,t,n){this.lexer=void 0,this.start=void 0,this.end=void 0,this.lexer=e,this.start=t,this.end=n}static range(e,t){return t?!e||!e.loc||!t.loc||e.loc.lexer!==t.loc.lexer?null:new rn(e.loc.lexer,e.loc.start,t.loc.end):e&&e.loc}}class dn{constructor(e,t){this.text=void 0,this.loc=void 0,this.noexpand=void 0,this.treatAsRelax=void 0,this.text=e,this.loc=t}range(e,t){return new dn(t,rn.range(this,e))}}function Tc(i){var e=[];i.consumeSpaces();var t=i.fetch().text;for(t==="\\relax"&&(i.consume(),i.consumeSpaces(),t=i.fetch().text);t==="\\hline"||t==="\\hdashline";)i.consume(),e.push(t==="\\hdashline"),i.consumeSpaces(),t=i.fetch().text;return e}var ps=i=>{var e=i.parser.settings;if(!e.displayMode)throw new oe("{"+i.envName+"} can be used only in display mode.")},r2=new Set(["gather","gather*"]);function O0(i){if(!i.includes("ed"))return!i.includes("*")}function Ci(i,e,t){var{hskipBeforeAndAfter:n,addJot:r,cols:a,arraystretch:s,colSeparationType:o,autoTag:l,singleRow:c,emptySingleRow:u,maxNumCols:h,leqno:f}=e;if(i.gullet.beginGroup(),c||i.gullet.macros.set("\\cr","\\\\\\relax"),!s){var m=i.gullet.expandMacroAsText("\\arraystretch");if(m==null)s=1;else if(s=parseFloat(m),!s||s<0)throw new oe("Invalid \\arraystretch: "+m)}i.gullet.beginGroup();var x=[],y=[x],g=[],p=[],A=l!=null?[]:void 0;function C(){l&&i.gullet.macros.set("\\@eqnsw","1",!0)}function S(){A&&(i.gullet.macros.get("\\df@tag")?(A.push(i.subparse([new dn("\\df@tag")])),i.gullet.macros.set("\\df@tag",void 0,!0)):A.push(!!l&&i.gullet.macros.get("\\@eqnsw")==="1"))}for(C(),p.push(Tc(i));;){var N=i.parseExpression(!1,c?"\\end":"\\\\");i.gullet.endGroup(),i.gullet.beginGroup();var I={type:"ordgroup",mode:i.mode,body:N};t&&(I={type:"styling",mode:i.mode,style:t,resetFont:!0,body:[I]}),x.push(I);var D=i.fetch().text;if(D==="&"){if(h&&x.length===h){if(c||o)throw new oe("Too many tab characters: &",i.nextToken);i.settings.reportNonstrict("textEnv","Too few columns specified in the {array} column argument.")}i.consume()}else if(D==="\\end"){S(),x.length===1&&I.type==="styling"&&I.body.length===1&&I.body[0].type==="ordgroup"&&I.body[0].body.length===0&&(y.length>1||!u)&&y.pop(),p.length<y.length+1&&p.push([]);break}else if(D==="\\\\"){i.consume();var U=void 0;i.gullet.future().text!==" "&&(U=i.parseSizeGroup(!0)),g.push(U?U.value:null),S(),p.push(Tc(i)),x=[],y.push(x),C()}else throw new oe("Expected & or \\\\ or \\cr or \\end",i.nextToken)}return i.gullet.endGroup(),i.gullet.endGroup(),{type:"array",mode:i.mode,addJot:r,arraystretch:s,body:y,cols:a,rowGaps:g,hskipBeforeAndAfter:n,hLinesBeforeRow:p,colSeparationType:o,tags:A,leqno:f}}function B0(i){return i.slice(0,1)==="d"?"display":"text"}var Bn=function(e,t){var n,r,a=e.body.length,s=e.hLinesBeforeRow,o=0,l=new Array(a),c=[],u=Math.max(t.fontMetrics().arrayRuleWidth,t.minRuleThickness),h=1/t.fontMetrics().ptPerEm,f=5*h;if(e.colSeparationType&&e.colSeparationType==="small"){var m=t.havingStyle(Ye.SCRIPT).sizeMultiplier;f=.2778*(m/t.sizeMultiplier)}var x=e.colSeparationType==="CD"?At({number:3,unit:"ex"},t):12*h,y=3*h,g=e.arraystretch*x,p=.7*g,A=.3*g,C=0;function S(ge){for(var we=0;we<ge.length;++we)we>0&&(C+=.25),c.push({pos:C,isDashed:ge[we]})}for(S(s[0]),n=0;n<e.body.length;++n){var N=e.body[n],I=p,D=A;o<N.length&&(o=N.length);var U={cells:new Array(N.length),height:0,depth:0,pos:0};for(r=0;r<N.length;++r){var T=dt(N[r],t);D<T.depth&&(D=T.depth),I<T.height&&(I=T.height),U.cells[r]=T}var w=e.rowGaps[n],F=0;w&&(F=At(w,t),F>0&&(F+=A,D<F&&(D=F),F=0)),e.addJot&&n<e.body.length-1&&(D+=y),U.height=I,U.depth=D,C+=I,U.pos=C,C+=D+F,l[n]=U,S(s[n+1])}var V=C/2+t.fontMetrics().axisHeight,G=e.cols||[],K=[],J,j,te=[];if(e.tags&&e.tags.some(ge=>ge))for(n=0;n<a;++n){var Y=l[n],fe=Y.pos-V,pe=e.tags[n],ye=void 0;pe===!0?ye=se(["eqn-num"],[],t):pe===!1?ye=se([],[],t):ye=se([],Bt(pe,t,!0),t),ye.depth=Y.depth,ye.height=Y.height,te.push({type:"elem",elem:ye,shift:fe})}for(r=0,j=0;r<o||j<G.length;++r,++j){for(var ke,qe=G[j],Q=!0;((ce=qe)==null?void 0:ce.type)==="separator";){var ce;if(Q||(J=se(["arraycolsep"],[]),J.style.width=ue(t.fontMetrics().doubleRuleSep),K.push(J)),qe.separator==="|"||qe.separator===":"){var Re=qe.separator==="|"?"solid":"dashed",me=se(["vertical-separator"],[],t);me.style.height=ue(C),me.style.borderRightWidth=ue(u),me.style.borderRightStyle=Re,me.style.margin="0 "+ue(-u/2);var Ne=C-V;Ne&&(me.style.verticalAlign=ue(-Ne)),K.push(me)}else throw new oe("Invalid separator type: "+qe.separator);j++,qe=G[j],Q=!1}if(!(r>=o)){var ze=void 0;if(r>0||e.hskipBeforeAndAfter){var ve,Oe;ze=(ve=(Oe=qe)==null?void 0:Oe.pregap)!=null?ve:f,ze!==0&&(J=se(["arraycolsep"],[]),J.style.width=ue(ze),K.push(J))}var We=[];for(n=0;n<a;++n){var lt=l[n],O=lt.cells[r];if(O){var en=lt.pos-V;O.depth=lt.depth,O.height=lt.height,We.push({type:"elem",elem:O,shift:en})}}var it=ht({positionType:"individualShift",children:We}),rt=se(["col-align-"+(((ke=qe)==null?void 0:ke.align)||"c")],[it]);if(K.push(rt),r<o-1||e.hskipBeforeAndAfter){var Be,vt;ze=(Be=(vt=qe)==null?void 0:vt.postgap)!=null?Be:f,ze!==0&&(J=se(["arraycolsep"],[]),J.style.width=ue(ze),K.push(J))}}}var Ue=se(["mtable"],K);if(c.length>0){for(var R=Mr("hline",t,u),b=Mr("hdashline",t,u),W=[{type:"elem",elem:Ue,shift:0}];c.length>0;){var ne=c.pop(),ae=ne.pos-V;ne.isDashed?W.push({type:"elem",elem:b,shift:ae}):W.push({type:"elem",elem:R,shift:ae})}Ue=ht({positionType:"individualShift",children:W})}if(te.length===0)return se(["mord"],[Ue],t);var ee=ht({positionType:"individualShift",children:te}),Pe=se(["tag"],[ee],t);return si([Ue,Pe])},a2={c:"center ",l:"left ",r:"right "},Hn=function(e,t){for(var n=[],r=new le("mtd",[],["mtr-glue"]),a=new le("mtd",[],["mml-eqn-num"]),s=0;s<e.body.length;s++){for(var o=e.body[s],l=[],c=0;c<o.length;c++)l.push(new le("mtd",[xt(o[c],t)]));e.tags&&e.tags[s]&&(l.unshift(r),l.push(r),e.leqno?l.unshift(a):l.push(a)),n.push(new le("mtr",l))}var u=new le("mtable",n),h=e.arraystretch===.5?.1:.16+e.arraystretch-1+(e.addJot?.09:0);u.setAttribute("rowspacing",ue(h));var f="",m="";if(e.cols&&e.cols.length>0){var x=e.cols,y="",g=!1,p=0,A=x.length;x[0].type==="separator"&&(f+="top ",p=1),x[x.length-1].type==="separator"&&(f+="bottom ",A-=1);for(var C=p;C<A;C++){var S=x[C];S.type==="align"?(m+=a2[S.align],g&&(y+="none "),g=!0):S.type==="separator"&&g&&(y+=S.separator==="|"?"solid ":"dashed ",g=!1)}u.setAttribute("columnalign",m.trim()),/[sd]/.test(y)&&u.setAttribute("columnlines",y.trim())}if(e.colSeparationType==="align"){for(var N=e.cols||[],I="",D=1;D<N.length;D++)I+=D%2?"0em ":"1em ";u.setAttribute("columnspacing",I.trim())}else e.colSeparationType==="alignat"||e.colSeparationType==="gather"?u.setAttribute("columnspacing","0em"):e.colSeparationType==="small"?u.setAttribute("columnspacing","0.2778em"):e.colSeparationType==="CD"?u.setAttribute("columnspacing","0.5em"):u.setAttribute("columnspacing","1em");var U="",T=e.hLinesBeforeRow;f+=T[0].length>0?"left ":"",f+=T[T.length-1].length>0?"right ":"";for(var w=1;w<T.length-1;w++)U+=T[w].length===0?"none ":T[w][0]?"dashed ":"solid ";return/[sd]/.test(U)&&u.setAttribute("rowlines",U.trim()),f!==""&&(u=new le("menclose",[u]),u.setAttribute("notation",f.trim())),e.arraystretch&&e.arraystretch<1&&(u=new le("mstyle",[u]),u.setAttribute("scriptlevel","1")),u},sh=function(e,t){e.envName.includes("ed")||ps(e);var n=[],r=e.envName.includes("at")?"alignat":"align",a=e.envName==="split",s=Ci(e.parser,{cols:n,addJot:!0,autoTag:a?void 0:O0(e.envName),emptySingleRow:!0,colSeparationType:r,maxNumCols:a?2:void 0,leqno:e.parser.settings.leqno},"display"),o=0,l=0,c={type:"ordgroup",mode:e.mode,body:[]};if(t[0]&&t[0].type==="ordgroup"){for(var u="",h=0;h<t[0].body.length;h++){var f=Qe(t[0].body[h],"textord");u+=f.text}o=Number(u),l=o*2}var m=!l;s.body.forEach(function(p){for(var A=1;A<p.length;A+=2){var C=Qe(p[A],"styling"),S=Qe(C.body[0],"ordgroup");S.body.unshift(c)}if(m)l<p.length&&(l=p.length);else{var N=p.length/2;if(o<N)throw new oe("Too many math in a row: "+("expected "+o+", but got "+N),p[0])}});for(var x=0;x<l;++x){var y="r",g=0;x%2===1?y="l":x>0&&m&&(g=1),n[x]={type:"align",align:y,pregap:g,postgap:0}}return s.colSeparationType=m?"align":"alignat",s};On({type:"array",names:["array","darray"],props:{numArgs:1},handler(i,e){var t=cs(e[0]),n=t?[e[0]]:Qe(e[0],"ordgroup").body,r=n.map(function(s){var o=ls(s),l=o.text;if("lcr".includes(l))return{type:"align",align:l};if(l==="|")return{type:"separator",separator:"|"};if(l===":")return{type:"separator",separator:":"};throw new oe("Unknown column alignment: "+l,s)}),a={cols:r,hskipBeforeAndAfter:!0,maxNumCols:r.length};return Ci(i.parser,a,B0(i.envName))},htmlBuilder:Bn,mathmlBuilder:Hn});On({type:"array",names:["matrix","pmatrix","bmatrix","Bmatrix","vmatrix","Vmatrix","matrix*","pmatrix*","bmatrix*","Bmatrix*","vmatrix*","Vmatrix*"],props:{numArgs:0},handler(i){var e={matrix:null,pmatrix:["(",")"],bmatrix:["[","]"],Bmatrix:["\\{","\\}"],vmatrix:["|","|"],Vmatrix:["\\Vert","\\Vert"]}[i.envName.replace("*","")],t="c",n={hskipBeforeAndAfter:!1,cols:[{type:"align",align:t}]};if(i.envName.charAt(i.envName.length-1)==="*"){var r=i.parser;if(r.consumeSpaces(),r.fetch().text==="["){if(r.consume(),r.consumeSpaces(),t=r.fetch().text,!"lcr".includes(t))throw new oe("Expected l or c or r",r.nextToken);r.consume(),r.consumeSpaces(),r.expect("]"),r.consume(),n.cols=[{type:"align",align:t}]}}var a=Ci(i.parser,n,B0(i.envName)),s=Math.max(0,...a.body.map(o=>o.length));return a.cols=new Array(s).fill({type:"align",align:t}),e?{type:"leftright",mode:i.mode,body:[a],left:e[0],right:e[1],rightColor:void 0}:a},htmlBuilder:Bn,mathmlBuilder:Hn});On({type:"array",names:["smallmatrix"],props:{numArgs:0},handler(i){var e={arraystretch:.5},t=Ci(i.parser,e,"script");return t.colSeparationType="small",t},htmlBuilder:Bn,mathmlBuilder:Hn});On({type:"array",names:["subarray"],props:{numArgs:1},handler(i,e){var t=cs(e[0]),n=t?[e[0]]:Qe(e[0],"ordgroup").body,r=n.map(function(o){var l=ls(o),c=l.text;if("lc".includes(c))return{type:"align",align:c};throw new oe("Unknown column alignment: "+c,o)});if(r.length>1)throw new oe("{subarray} can contain only one column");var a={cols:r,hskipBeforeAndAfter:!1,arraystretch:.5},s=Ci(i.parser,a,"script");if(s.body.length>0&&s.body[0].length>1)throw new oe("{subarray} can contain only one column");return s},htmlBuilder:Bn,mathmlBuilder:Hn});On({type:"array",names:["cases","dcases","rcases","drcases"],props:{numArgs:0},handler(i){var e={arraystretch:1.2,cols:[{type:"align",align:"l",pregap:0,postgap:1},{type:"align",align:"l",pregap:0,postgap:0}]},t=Ci(i.parser,e,B0(i.envName));return{type:"leftright",mode:i.mode,body:[t],left:i.envName.includes("r")?".":"\\{",right:i.envName.includes("r")?"\\}":".",rightColor:void 0}},htmlBuilder:Bn,mathmlBuilder:Hn});On({type:"array",names:["align","align*","aligned","split"],props:{numArgs:0},handler:sh,htmlBuilder:Bn,mathmlBuilder:Hn});On({type:"array",names:["gathered","gather","gather*"],props:{numArgs:0},handler(i){r2.has(i.envName)&&ps(i);var e={cols:[{type:"align",align:"c"}],addJot:!0,colSeparationType:"gather",autoTag:O0(i.envName),emptySingleRow:!0,leqno:i.parser.settings.leqno};return Ci(i.parser,e,"display")},htmlBuilder:Bn,mathmlBuilder:Hn});On({type:"array",names:["alignat","alignat*","alignedat"],props:{numArgs:1},handler:sh,htmlBuilder:Bn,mathmlBuilder:Hn});On({type:"array",names:["equation","equation*"],props:{numArgs:0},handler(i){ps(i);var e={autoTag:O0(i.envName),emptySingleRow:!0,singleRow:!0,maxNumCols:1,leqno:i.parser.settings.leqno};return Ci(i.parser,e,"display")},htmlBuilder:Bn,mathmlBuilder:Hn});On({type:"array",names:["CD"],props:{numArgs:0},handler(i){return ps(i),Xg(i.parser)},htmlBuilder:Bn,mathmlBuilder:Hn});M("\\nonumber","\\gdef\\@eqnsw{0}");M("\\notag","\\nonumber");be({type:"text",names:["\\hline","\\hdashline"],props:{numArgs:0,allowedInText:!0,allowedInMath:!0},handler(i,e){throw new oe(i.funcName+" valid only within array environment")}});var Ec=rh;be({type:"environment",names:["\\begin","\\end"],props:{numArgs:1,argTypes:["text"]},handler(i,e){var{parser:t,funcName:n}=i,r=e[0];if(r.type!=="ordgroup")throw new oe("Invalid environment name",r);for(var a="",s=0;s<r.body.length;++s)a+=Qe(r.body[s],"textord").text;if(n==="\\begin"){if(!Ec.hasOwnProperty(a))throw new oe("No such environment: "+a,r);var o=Ec[a],{args:l,optArgs:c}=t.parseArguments("\\begin{"+a+"}",o),u={mode:t.mode,envName:a,parser:t},h=o.handler(u,l,c);t.expect("\\end",!1);var f=t.nextToken,m=Qe(t.parseFunction(),"environment");if(m.name!==a)throw new oe("Mismatch: \\begin{"+a+"} matched by \\end{"+m.name+"}",f);return h}return{type:"environment",mode:t.mode,name:a,nameGroup:r}}});var oh=(i,e)=>{var t=i.font,n=e.withFont(t);return dt(i.body,n)},lh=(i,e)=>{var t=i.font,n=e.withFont(t);return xt(i.body,n)},Ac={"\\Bbb":"\\mathbb","\\bold":"\\mathbf","\\frak":"\\mathfrak"};be({type:"font",names:["\\mathrm","\\mathit","\\mathbf","\\mathnormal","\\mathsfit","\\mathbb","\\mathcal","\\mathfrak","\\mathscr","\\mathsf","\\mathtt","\\Bbb","\\bold","\\frak"],props:{numArgs:1,allowedInArgument:!0},handler:(i,e)=>{var{parser:t,funcName:n}=i,r=Za(e[0]),a=n;return a in Ac&&(a=Ac[a]),{type:"font",mode:t.mode,font:a.slice(1),body:r}},htmlBuilder:oh,mathmlBuilder:lh});be({type:"mclass",names:["\\boldsymbol","\\bm"],props:{numArgs:1},handler:(i,e)=>{var{parser:t}=i,n=e[0];return{type:"mclass",mode:t.mode,mclass:us(n),body:[{type:"font",mode:t.mode,font:"boldsymbol",body:n}],isCharacterBox:ri(n)}}});be({type:"font",names:["\\rm","\\sf","\\tt","\\bf","\\it","\\cal"],props:{numArgs:0,allowedInText:!0},handler:(i,e)=>{var{parser:t,funcName:n,breakOnTokenText:r}=i,{mode:a}=t,s=t.parseExpression(!0,r);return{type:"font",mode:a,font:"math"+n.slice(1),body:{type:"ordgroup",mode:t.mode,body:s}}},htmlBuilder:oh,mathmlBuilder:lh});var s2=(i,e)=>{var t=e.style,n=t.fracNum(),r=t.fracDen(),a;a=e.havingStyle(n);var s=dt(i.numer,a,e);if(i.continued){var o=8.5/e.fontMetrics().ptPerEm,l=3.5/e.fontMetrics().ptPerEm;s.height=s.height<o?o:s.height,s.depth=s.depth<l?l:s.depth}a=e.havingStyle(r);var c=dt(i.denom,a,e),u,h,f;i.hasBarLine?(i.barSize?(h=At(i.barSize,e),u=Mr("frac-line",e,h)):u=Mr("frac-line",e),h=u.height,f=u.height):(u=null,h=0,f=e.fontMetrics().defaultRuleThickness);var m,x,y;t.size===Ye.DISPLAY.size?(m=e.fontMetrics().num1,h>0?x=3*f:x=7*f,y=e.fontMetrics().denom1):(h>0?(m=e.fontMetrics().num2,x=f):(m=e.fontMetrics().num3,x=3*f),y=e.fontMetrics().denom2);var g;if(u){var A=e.fontMetrics().axisHeight;m-s.depth-(A+.5*h)<x&&(m+=x-(m-s.depth-(A+.5*h))),A-.5*h-(c.height-y)<x&&(y+=x-(A-.5*h-(c.height-y)));var C=-(A-.5*h);g=ht({positionType:"individualShift",children:[{type:"elem",elem:c,shift:y},{type:"elem",elem:u,shift:C},{type:"elem",elem:s,shift:-m}]})}else{var p=m-s.depth-(c.height-y);p<x&&(m+=.5*(x-p),y+=.5*(x-p)),g=ht({positionType:"individualShift",children:[{type:"elem",elem:c,shift:y},{type:"elem",elem:s,shift:-m}]})}a=e.havingStyle(t),g.height*=a.sizeMultiplier/e.sizeMultiplier,g.depth*=a.sizeMultiplier/e.sizeMultiplier;var S;t.size===Ye.DISPLAY.size?S=e.fontMetrics().delim1:t.size===Ye.SCRIPTSCRIPT.size?S=e.havingStyle(Ye.SCRIPT).fontMetrics().delim2:S=e.fontMetrics().delim2;var N,I;return i.leftDelim==null?N=$r(e,["mopen"]):N=g0(i.leftDelim,S,!0,e.havingStyle(t),i.mode,["mopen"]),i.continued?I=se([]):i.rightDelim==null?I=$r(e,["mclose"]):I=g0(i.rightDelim,S,!0,e.havingStyle(t),i.mode,["mclose"]),se(["mord"].concat(a.sizingClasses(e)),[N,se(["mfrac"],[g]),I],e)},o2=(i,e)=>{var t=new le("mfrac",[xt(i.numer,e),xt(i.denom,e)]);if(!i.hasBarLine)t.setAttribute("linethickness","0px");else if(i.barSize){var n=At(i.barSize,e);t.setAttribute("linethickness",ue(n))}if(i.leftDelim!=null||i.rightDelim!=null){var r=[];if(i.leftDelim!=null){var a=new le("mo",[new Ut(i.leftDelim.replace("\\",""))]);a.setAttribute("fence","true"),r.push(a)}if(r.push(t),i.rightDelim!=null){var s=new le("mo",[new Ut(i.rightDelim.replace("\\",""))]);s.setAttribute("fence","true"),r.push(s)}return U0(r)}return t},ch=(i,e)=>{if(!e)return i;var t={type:"styling",mode:i.mode,style:e,body:[i]};return t};be({type:"genfrac",names:["\\cfrac","\\dfrac","\\frac","\\tfrac","\\dbinom","\\binom","\\tbinom","\\\\atopfrac","\\\\bracefrac","\\\\brackfrac"],props:{numArgs:2,allowedInArgument:!0},handler:(i,e)=>{var{parser:t,funcName:n}=i,r=e[0],a=e[1],s,o=null,l=null;switch(n){case"\\cfrac":case"\\dfrac":case"\\frac":case"\\tfrac":s=!0;break;case"\\\\atopfrac":s=!1;break;case"\\dbinom":case"\\binom":case"\\tbinom":s=!1,o="(",l=")";break;case"\\\\bracefrac":s=!1,o="\\{",l="\\}";break;case"\\\\brackfrac":s=!1,o="[",l="]";break;default:throw new Error("Unrecognized genfrac command")}var c=n==="\\cfrac",u=null;return c||n.startsWith("\\d")?u="display":n.startsWith("\\t")&&(u="text"),ch({type:"genfrac",mode:t.mode,numer:r,denom:a,continued:c,hasBarLine:s,leftDelim:o,rightDelim:l,barSize:null},u)},htmlBuilder:s2,mathmlBuilder:o2});be({type:"infix",names:["\\over","\\choose","\\atop","\\brace","\\brack"],props:{numArgs:0,infix:!0},handler(i){var{parser:e,funcName:t,token:n}=i,r;switch(t){case"\\over":r="\\frac";break;case"\\choose":r="\\binom";break;case"\\atop":r="\\\\atopfrac";break;case"\\brace":r="\\\\bracefrac";break;case"\\brack":r="\\\\brackfrac";break;default:throw new Error("Unrecognized infix genfrac command")}return{type:"infix",mode:e.mode,replaceWith:r,token:n}}});var Cc=["display","text","script","scriptscript"],Rc=function(e){var t=null;return e.length>0&&(t=e,t=t==="."?null:t),t};be({type:"genfrac",names:["\\genfrac"],props:{numArgs:6,allowedInArgument:!0,argTypes:["math","math","size","text","math","math"]},handler(i,e){var{parser:t}=i,n=e[4],r=e[5],a=Za(e[0]),s=a.type==="atom"&&a.family==="open"?Rc(a.text):null,o=Za(e[1]),l=o.type==="atom"&&o.family==="close"?Rc(o.text):null,c=Qe(e[2],"size"),u,h=null;c.isBlank?u=!0:(h=c.value,u=h.number>0);var f=null,m=e[3];if(m.type==="ordgroup"){if(m.body.length>0){var x=Qe(m.body[0],"textord");f=Cc[Number(x.text)]}}else m=Qe(m,"textord"),f=Cc[Number(m.text)];return ch({type:"genfrac",mode:t.mode,numer:n,denom:r,continued:!1,hasBarLine:u,barSize:h,leftDelim:s,rightDelim:l},f)}});be({type:"infix",names:["\\above"],props:{numArgs:1,argTypes:["size"],infix:!0},handler(i,e){var{parser:t,funcName:n,token:r}=i;return{type:"infix",mode:t.mode,replaceWith:"\\\\abovefrac",size:Qe(e[0],"size").value,token:r}}});be({type:"genfrac",names:["\\\\abovefrac"],props:{numArgs:3,argTypes:["math","size","math"]},handler:(i,e)=>{var{parser:t,funcName:n}=i,r=e[0],a=Qe(e[1],"infix").size;if(!a)throw new Error("\\\\abovefrac expected size, but got "+String(a));var s=e[2],o=a.number>0;return{type:"genfrac",mode:t.mode,numer:r,denom:s,continued:!1,hasBarLine:o,barSize:a,leftDelim:null,rightDelim:null}}});var uh=(i,e)=>{var t=e.style,n,r;i.type==="supsub"?(n=i.sup?dt(i.sup,e.havingStyle(t.sup()),e):dt(i.sub,e.havingStyle(t.sub()),e),r=Qe(i.base,"horizBrace")):r=Qe(i,"horizBrace");var a=dt(r.base,e.havingBaseStyle(Ye.DISPLAY)),s=os(r,e),o;if(r.isOver?o=ht({positionType:"firstBaseline",children:[{type:"elem",elem:a},{type:"kern",size:.1},{type:"elem",elem:s,wrapperClasses:["svg-align"]}]}):o=ht({positionType:"bottom",positionData:a.depth+.1+s.height,children:[{type:"elem",elem:s,wrapperClasses:["svg-align"]},{type:"kern",size:.1},{type:"elem",elem:a}]}),n){var l=se(["minner",r.isOver?"mover":"munder"],[o],e);r.isOver?o=ht({positionType:"firstBaseline",children:[{type:"elem",elem:l},{type:"kern",size:.2},{type:"elem",elem:n}]}):o=ht({positionType:"bottom",positionData:l.depth+.2+n.height+n.depth,children:[{type:"elem",elem:n},{type:"kern",size:.2},{type:"elem",elem:l}]})}return se(["minner",r.isOver?"mover":"munder"],[o],e)},l2=(i,e)=>{var t=ss(i.label);return new le(i.isOver?"mover":"munder",[xt(i.base,e),t])};be({type:"horizBrace",names:["\\overbrace","\\underbrace","\\overbracket","\\underbracket"],props:{numArgs:1},handler(i,e){var{parser:t,funcName:n}=i;return{type:"horizBrace",mode:t.mode,label:n,isOver:n.includes("\\over"),base:e[0]}},htmlBuilder:uh,mathmlBuilder:l2});be({type:"href",names:["\\href"],props:{numArgs:2,argTypes:["url","original"],allowedInText:!0},handler:(i,e)=>{var{parser:t}=i,n=e[1],r=Qe(e[0],"url").url;return t.settings.isTrusted({command:"\\href",url:r})?{type:"href",mode:t.mode,href:r,body:Ft(n)}:t.formatUnsupportedCmd("\\href")},htmlBuilder:(i,e)=>{var t=Bt(i.body,e,!1);return bg(i.href,[],t,e)},mathmlBuilder:(i,e)=>{var t=Ai(i.body,e);return t instanceof le||(t=new le("mrow",[t])),t.setAttribute("href",i.href),t}});be({type:"href",names:["\\url"],props:{numArgs:1,argTypes:["url"],allowedInText:!0},handler:(i,e)=>{var{parser:t}=i,n=Qe(e[0],"url").url;if(!t.settings.isTrusted({command:"\\url",url:n}))return t.formatUnsupportedCmd("\\url");for(var r=[],a=0;a<n.length;a++){var s=n[a];s==="~"&&(s="\\textasciitilde"),r.push({type:"textord",mode:"text",text:s})}var o={type:"text",mode:t.mode,font:"\\texttt",body:r};return{type:"href",mode:t.mode,href:n,body:Ft(o)}}});be({type:"hbox",names:["\\hbox"],props:{numArgs:1,argTypes:["text"],allowedInText:!0,primitive:!0},handler(i,e){var{parser:t}=i;return{type:"hbox",mode:t.mode,body:Ft(e[0])}},htmlBuilder(i,e){var t=Bt(i.body,e.withFont(""),!1);return si(t)},mathmlBuilder(i,e){return new le("mrow",mn(i.body,e.withFont("")))}});be({type:"html",names:["\\htmlClass","\\htmlId","\\htmlStyle","\\htmlData"],props:{numArgs:2,argTypes:["raw","original"],allowedInText:!0},handler:(i,e)=>{var{parser:t,funcName:n,token:r}=i,a=Qe(e[0],"raw").string,s=e[1];t.settings.strict&&t.settings.reportNonstrict("htmlExtension","HTML extension is disabled on strict mode");var o,l={};switch(n){case"\\htmlClass":l.class=a,o={command:"\\htmlClass",class:a};break;case"\\htmlId":l.id=a,o={command:"\\htmlId",id:a};break;case"\\htmlStyle":l.style=a,o={command:"\\htmlStyle",style:a};break;case"\\htmlData":{for(var c=a.split(","),u=0;u<c.length;u++){var h=c[u],f=h.indexOf("=");if(f<0)throw new oe("\\htmlData key/value '"+h+"' missing equals sign");var m=h.slice(0,f),x=h.slice(f+1);l["data-"+m.trim()]=x}o={command:"\\htmlData",attributes:l};break}default:throw new Error("Unrecognized html command")}return t.settings.isTrusted(o)?{type:"html",mode:t.mode,attributes:l,body:Ft(s)}:t.formatUnsupportedCmd(n)},htmlBuilder:(i,e)=>{var t=Bt(i.body,e,!1),n=["enclosing"];i.attributes.class&&n.push(...i.attributes.class.trim().split(/\s+/));var r=se(n,t,e);for(var a in i.attributes)a!=="class"&&i.attributes.hasOwnProperty(a)&&r.setAttribute(a,i.attributes[a]);return r},mathmlBuilder:(i,e)=>Ai(i.body,e)});be({type:"htmlmathml",names:["\\html@mathml"],props:{numArgs:2,allowedInArgument:!0,allowedInText:!0},handler:(i,e)=>{var{parser:t}=i;return{type:"htmlmathml",mode:t.mode,html:Ft(e[0]),mathml:Ft(e[1])}},htmlBuilder:(i,e)=>{var t=Bt(i.html,e,!1);return si(t)},mathmlBuilder:(i,e)=>Ai(i.mathml,e)});var oo=function(e){if(/^[-+]? *(\d+(\.\d*)?|\.\d+)$/.test(e))return{number:+e,unit:"bp"};var t=/([-+]?) *(\d+(?:\.\d*)?|\.\d+) *([a-z]{2})/.exec(e);if(!t)throw new oe("Invalid size: '"+e+"' in \\includegraphics");var n={number:+(t[1]+t[2]),unit:t[3]};if(!Au(n))throw new oe("Invalid unit: '"+n.unit+"' in \\includegraphics.");return n};be({type:"includegraphics",names:["\\includegraphics"],props:{numArgs:1,numOptionalArgs:1,argTypes:["raw","url"],allowedInText:!1},handler:(i,e,t)=>{var{parser:n}=i,r={number:0,unit:"em"},a={number:.9,unit:"em"},s={number:0,unit:"em"},o="";if(t[0])for(var l=Qe(t[0],"raw").string,c=l.split(","),u=0;u<c.length;u++){var h=c[u].split("=");if(h.length===2){var f=h[1].trim();switch(h[0].trim()){case"alt":o=f;break;case"width":r=oo(f);break;case"height":a=oo(f);break;case"totalheight":s=oo(f);break;default:throw new oe("Invalid key: '"+h[0]+"' in \\includegraphics.")}}}var m=Qe(e[0],"url").url;return o===""&&(o=m,o=o.replace(/^.*[\\/]/,""),o=o.substring(0,o.lastIndexOf("."))),n.settings.isTrusted({command:"\\includegraphics",url:m})?{type:"includegraphics",mode:n.mode,alt:o,width:r,height:a,totalheight:s,src:m}:n.formatUnsupportedCmd("\\includegraphics")},htmlBuilder:(i,e)=>{var t=At(i.height,e),n=0;i.totalheight.number>0&&(n=At(i.totalheight,e)-t);var r=0;i.width.number>0&&(r=At(i.width,e));var a={height:ue(t+n)};r>0&&(a.width=ue(r)),n>0&&(a.verticalAlign=ue(-n));var s=new cg(i.src,i.alt,a);return s.height=t,s.depth=n,s},mathmlBuilder:(i,e)=>{var t=new le("mglyph",[]);t.setAttribute("alt",i.alt);var n=At(i.height,e),r=0;if(i.totalheight.number>0&&(r=At(i.totalheight,e)-n,t.setAttribute("valign",ue(-r))),t.setAttribute("height",ue(n+r)),i.width.number>0){var a=At(i.width,e);t.setAttribute("width",ue(a))}return t.setAttribute("src",i.src),t}});be({type:"kern",names:["\\kern","\\mkern","\\hskip","\\mskip"],props:{numArgs:1,argTypes:["size"],primitive:!0,allowedInText:!0},handler(i,e){var{parser:t,funcName:n}=i,r=Qe(e[0],"size");if(t.settings.strict){var a=n[1]==="m",s=r.value.unit==="mu";a?(s||t.settings.reportNonstrict("mathVsTextUnits","LaTeX's "+n+" supports only mu units, "+("not "+r.value.unit+" units")),t.mode!=="math"&&t.settings.reportNonstrict("mathVsTextUnits","LaTeX's "+n+" works only in math mode")):s&&t.settings.reportNonstrict("mathVsTextUnits","LaTeX's "+n+" doesn't support mu units")}return{type:"kern",mode:t.mode,dimension:r.value}},htmlBuilder(i,e){return Lu(i.dimension,e)},mathmlBuilder(i,e){var t=At(i.dimension,e);return new Ou(t)}});be({type:"lap",names:["\\mathllap","\\mathrlap","\\mathclap"],props:{numArgs:1,allowedInText:!0},handler:(i,e)=>{var{parser:t,funcName:n}=i,r=e[0];return{type:"lap",mode:t.mode,alignment:n.slice(5),body:r}},htmlBuilder:(i,e)=>{var t;i.alignment==="clap"?(t=se([],[dt(i.body,e)]),t=se(["inner"],[t],e)):t=se(["inner"],[dt(i.body,e)]);var n=se(["fix"],[]),r=se([i.alignment],[t,n],e),a=se(["strut"]);return a.style.height=ue(r.height+r.depth),r.depth&&(a.style.verticalAlign=ue(-r.depth)),r.children.unshift(a),r=se(["thinbox"],[r],e),se(["mord","vbox"],[r],e)},mathmlBuilder:(i,e)=>{var t=new le("mpadded",[xt(i.body,e)]);if(i.alignment!=="rlap"){var n=i.alignment==="llap"?"-1":"-0.5";t.setAttribute("lspace",n+"width")}return t.setAttribute("width","0px"),t}});be({type:"styling",names:["\\(","$"],props:{numArgs:0,allowedInText:!0,allowedInMath:!1},handler(i,e){var{funcName:t,parser:n}=i,r=n.mode;n.switchMode("math");var a=t==="\\("?"\\)":"$",s=n.parseExpression(!1,a);return n.expect(a),n.switchMode(r),{type:"styling",mode:n.mode,style:"text",resetFont:!0,body:s}}});be({type:"text",names:["\\)","\\]"],props:{numArgs:0,allowedInText:!0,allowedInMath:!1},handler(i,e){throw new oe("Mismatched "+i.funcName)}});var Pc=(i,e)=>{switch(e.style.size){case Ye.DISPLAY.size:return i.display;case Ye.TEXT.size:return i.text;case Ye.SCRIPT.size:return i.script;case Ye.SCRIPTSCRIPT.size:return i.scriptscript;default:return i.text}};be({type:"mathchoice",names:["\\mathchoice"],props:{numArgs:4,primitive:!0},handler:(i,e)=>{var{parser:t}=i;return{type:"mathchoice",mode:t.mode,display:Ft(e[0]),text:Ft(e[1]),script:Ft(e[2]),scriptscript:Ft(e[3])}},htmlBuilder:(i,e)=>{var t=Pc(i,e),n=Bt(t,e,!1);return si(n)},mathmlBuilder:(i,e)=>{var t=Pc(i,e);return Ai(t,e)}});var hh=(i,e,t,n,r,a,s)=>{i=se([],[i]);var o=t&&ri(t),l,c;if(e){var u=dt(e,n.havingStyle(r.sup()),n);c={elem:u,kern:Math.max(n.fontMetrics().bigOpSpacing1,n.fontMetrics().bigOpSpacing3-u.depth)}}if(t){var h=dt(t,n.havingStyle(r.sub()),n);l={elem:h,kern:Math.max(n.fontMetrics().bigOpSpacing2,n.fontMetrics().bigOpSpacing4-h.height)}}var f;if(c&&l){var m=n.fontMetrics().bigOpSpacing5+l.elem.height+l.elem.depth+l.kern+i.depth+s;f=ht({positionType:"bottom",positionData:m,children:[{type:"kern",size:n.fontMetrics().bigOpSpacing5},{type:"elem",elem:l.elem,marginLeft:ue(-a)},{type:"kern",size:l.kern},{type:"elem",elem:i},{type:"kern",size:c.kern},{type:"elem",elem:c.elem,marginLeft:ue(a)},{type:"kern",size:n.fontMetrics().bigOpSpacing5}]})}else if(l){var x=i.height-s;f=ht({positionType:"top",positionData:x,children:[{type:"kern",size:n.fontMetrics().bigOpSpacing5},{type:"elem",elem:l.elem,marginLeft:ue(-a)},{type:"kern",size:l.kern},{type:"elem",elem:i}]})}else if(c){var y=i.depth+s;f=ht({positionType:"bottom",positionData:y,children:[{type:"elem",elem:i},{type:"kern",size:c.kern},{type:"elem",elem:c.elem,marginLeft:ue(a)},{type:"kern",size:n.fontMetrics().bigOpSpacing5}]})}else return i;var g=[f];if(l&&a!==0&&!o){var p=se(["mspace"],[],n);p.style.marginRight=ue(a),g.unshift(p)}return se(["mop","op-limits"],g,n)},dh=new Set(["\\smallint"]),Dr=(i,e)=>{var t,n,r=!1,a;i.type==="supsub"?(t=i.sup,n=i.sub,a=Qe(i.base,"op"),r=!0):a=Qe(i,"op");var s=e.style,o=!1;s.size===Ye.DISPLAY.size&&a.symbol&&!dh.has(a.name)&&(o=!0);var l,c;if(a.symbol){var u=o?"Size2-Regular":"Size1-Regular",h="";if((a.name==="\\oiint"||a.name==="\\oiiint")&&(h=a.name.slice(1),a.name=h==="oiint"?"\\iint":"\\iiint"),l=jt(a.name,u,"math",e,["mop","op-symbol",o?"large-op":"small-op"]),c=l.italic,h.length>0){var f=Uu(h+"Size"+(o?"2":"1"),e);l=ht({positionType:"individualShift",children:[{type:"elem",elem:l,shift:0},{type:"elem",elem:f,shift:o?.08:0}]}),a.name="\\"+h,l.classes.unshift("mop"),l.italic=c}}else if(a.body){var m=Bt(a.body,e,!0);m.length===1&&m[0]instanceof fn?(l=m[0],l.classes[0]="mop"):l=se(["mop"],m,e)}else{for(var x=[],y=1;y<a.name.length;y++)x.push(L0(a.name[y],a.mode,e));l=se(["mop"],x,e)}var g=0,p=0;if((l instanceof fn||a.name==="\\oiint"||a.name==="\\oiiint")&&!a.suppressBaseShift){var A;g=(l.height-l.depth)/2-e.fontMetrics().axisHeight,p=(A=l.italic)!=null?A:0}return r?hh(l,t,n,e,s,p,g):(g&&(l.style.position="relative",l.style.top=ue(g)),l)},Qr=(i,e)=>{var t;if(i.symbol)t=new le("mo",[_n(i.name,i.mode)]),dh.has(i.name)&&t.setAttribute("largeop","false");else if(i.body)t=new le("mo",mn(i.body,e));else{t=new le("mi",[new Ut(i.name.slice(1))]);var n=new le("mo",[_n("⁡","text")]);i.parentIsSupSub?t=new le("mrow",[t,n]):t=zu([t,n])}return t},c2={"∏":"\\prod","∐":"\\coprod","∑":"\\sum","⋀":"\\bigwedge","⋁":"\\bigvee","⋂":"\\bigcap","⋃":"\\bigcup","⨀":"\\bigodot","⨁":"\\bigoplus","⨂":"\\bigotimes","⨄":"\\biguplus","⨆":"\\bigsqcup"};be({type:"op",names:["\\coprod","\\bigvee","\\bigwedge","\\biguplus","\\bigcap","\\bigcup","\\intop","\\prod","\\sum","\\bigotimes","\\bigoplus","\\bigodot","\\bigsqcup","\\smallint","∏","∐","∑","⋀","⋁","⋂","⋃","⨀","⨁","⨂","⨄","⨆"],props:{numArgs:0},handler:(i,e)=>{var{parser:t,funcName:n}=i,r=n;return r.length===1&&(r=c2[r]),{type:"op",mode:t.mode,limits:!0,parentIsSupSub:!1,symbol:!0,name:r}},htmlBuilder:Dr,mathmlBuilder:Qr});be({type:"op",names:["\\mathop"],props:{numArgs:1,primitive:!0},handler:(i,e)=>{var{parser:t}=i,n=e[0];return{type:"op",mode:t.mode,limits:!1,parentIsSupSub:!1,symbol:!1,body:Ft(n)}},htmlBuilder:Dr,mathmlBuilder:Qr});var u2={"∫":"\\int","∬":"\\iint","∭":"\\iiint","∮":"\\oint","∯":"\\oiint","∰":"\\oiiint"};be({type:"op",names:["\\arcsin","\\arccos","\\arctan","\\arctg","\\arcctg","\\arg","\\ch","\\cos","\\cosec","\\cosh","\\cot","\\cotg","\\coth","\\csc","\\ctg","\\cth","\\deg","\\dim","\\exp","\\hom","\\ker","\\lg","\\ln","\\log","\\sec","\\sin","\\sinh","\\sh","\\tan","\\tanh","\\tg","\\th"],props:{numArgs:0},handler(i){var{parser:e,funcName:t}=i;return{type:"op",mode:e.mode,limits:!1,parentIsSupSub:!1,symbol:!1,name:t}},htmlBuilder:Dr,mathmlBuilder:Qr});be({type:"op",names:["\\det","\\gcd","\\inf","\\lim","\\max","\\min","\\Pr","\\sup"],props:{numArgs:0},handler(i){var{parser:e,funcName:t}=i;return{type:"op",mode:e.mode,limits:!0,parentIsSupSub:!1,symbol:!1,name:t}},htmlBuilder:Dr,mathmlBuilder:Qr});be({type:"op",names:["\\int","\\iint","\\iiint","\\oint","\\oiint","\\oiiint","∫","∬","∭","∮","∯","∰"],props:{numArgs:0,allowedInArgument:!0},handler(i){var{parser:e,funcName:t}=i,n=t;return n.length===1&&(n=u2[n]),{type:"op",mode:e.mode,limits:!1,parentIsSupSub:!1,symbol:!0,name:n}},htmlBuilder:Dr,mathmlBuilder:Qr});var fh=(i,e)=>{var t,n,r=!1,a;i.type==="supsub"?(t=i.sup,n=i.sub,a=Qe(i.base,"operatorname"),r=!0):a=Qe(i,"operatorname");var s;if(a.body.length>0){for(var o=a.body.map(h=>{var f="text"in h?h.text:void 0;return typeof f=="string"?{type:"textord",mode:h.mode,text:f}:h}),l=Bt(o,e.withFont("mathrm"),!0),c=0;c<l.length;c++){var u=l[c];u instanceof fn&&(u.text=u.text.replace(/\u2212/,"-").replace(/\u2217/,"*"))}s=se(["mop"],l,e)}else s=se(["mop"],[],e);return r?hh(s,t,n,e,e.style,0,0):s},h2=(i,e)=>{for(var t=mn(i.body,e.withFont("mathrm")),n=!0,r=0;r<t.length;r++){var a=t[r];if(!(a instanceof Ou))if(a instanceof le)switch(a.type){case"mi":case"mn":case"mspace":case"mtext":break;case"mo":{var s=a.children[0];a.children.length===1&&s instanceof Ut?s.text=s.text.replace(/\u2212/,"-").replace(/\u2217/,"*"):n=!1;break}default:n=!1}else n=!1}if(n){var o=t.map(u=>u.toText()).join("");t=[new Ut(o)]}var l=new le("mi",t);l.setAttribute("mathvariant","normal");var c=new le("mo",[_n("⁡","text")]);return i.parentIsSupSub?new le("mrow",[l,c]):zu([l,c])};be({type:"operatorname",names:["\\operatorname@","\\operatornamewithlimits"],props:{numArgs:1},handler:(i,e)=>{var{parser:t,funcName:n}=i,r=e[0];return{type:"operatorname",mode:t.mode,body:Ft(r),alwaysHandleSupSub:n==="\\operatornamewithlimits",limits:!1,parentIsSupSub:!1}},htmlBuilder:fh,mathmlBuilder:h2});M("\\operatorname","\\@ifstar\\operatornamewithlimits\\operatorname@");$i({type:"ordgroup",htmlBuilder(i,e){return i.semisimple?si(Bt(i.body,e,!1)):se(["mord"],Bt(i.body,e,!0),e)},mathmlBuilder(i,e){return Ai(i.body,e,!0)}});be({type:"overline",names:["\\overline"],props:{numArgs:1},handler(i,e){var{parser:t}=i,n=e[0];return{type:"overline",mode:t.mode,body:n}},htmlBuilder(i,e){var t=dt(i.body,e.havingCrampedStyle()),n=Mr("overline-line",e),r=e.fontMetrics().defaultRuleThickness,a=ht({positionType:"firstBaseline",children:[{type:"elem",elem:t},{type:"kern",size:3*r},{type:"elem",elem:n},{type:"kern",size:r}]});return se(["mord","overline"],[a],e)},mathmlBuilder(i,e){var t=new le("mo",[new Ut("‾")]);t.setAttribute("stretchy","true");var n=new le("mover",[xt(i.body,e),t]);return n.setAttribute("accent","true"),n}});be({type:"phantom",names:["\\phantom"],props:{numArgs:1,allowedInText:!0},handler:(i,e)=>{var{parser:t}=i,n=e[0];return{type:"phantom",mode:t.mode,body:Ft(n)}},htmlBuilder:(i,e)=>{var t=Bt(i.body,e.withPhantom(),!1);return si(t)},mathmlBuilder:(i,e)=>{var t=mn(i.body,e);return new le("mphantom",t)}});M("\\hphantom","\\smash{\\phantom{#1}}");be({type:"vphantom",names:["\\vphantom"],props:{numArgs:1,allowedInText:!0},handler:(i,e)=>{var{parser:t}=i,n=e[0];return{type:"vphantom",mode:t.mode,body:n}},htmlBuilder:(i,e)=>{var t=se(["inner"],[dt(i.body,e.withPhantom())]),n=se(["fix"],[]);return se(["mord","rlap"],[t,n],e)},mathmlBuilder:(i,e)=>{var t=mn(Ft(i.body),e),n=new le("mphantom",t),r=new le("mpadded",[n]);return r.setAttribute("width","0px"),r}});be({type:"raisebox",names:["\\raisebox"],props:{numArgs:2,argTypes:["size","hbox"],allowedInText:!0},handler(i,e){var{parser:t}=i,n=Qe(e[0],"size").value,r=e[1];return{type:"raisebox",mode:t.mode,dy:n,body:r}},htmlBuilder(i,e){var t=dt(i.body,e),n=At(i.dy,e);return ht({positionType:"shift",positionData:-n,children:[{type:"elem",elem:t}]})},mathmlBuilder(i,e){var t=new le("mpadded",[xt(i.body,e)]),n=i.dy.number+i.dy.unit;return t.setAttribute("voffset",n),t}});be({type:"internal",names:["\\relax"],props:{numArgs:0,allowedInText:!0,allowedInArgument:!0},handler(i){var{parser:e}=i;return{type:"internal",mode:e.mode}}});be({type:"rule",names:["\\rule"],props:{numArgs:2,numOptionalArgs:1,allowedInText:!0,allowedInMath:!0,argTypes:["size","size","size"]},handler(i,e,t){var{parser:n}=i,r=t[0],a=Qe(e[0],"size"),s=Qe(e[1],"size");return{type:"rule",mode:n.mode,shift:r&&Qe(r,"size").value,width:a.value,height:s.value}},htmlBuilder(i,e){var t=se(["mord","rule"],[],e),n=At(i.width,e),r=At(i.height,e),a=i.shift?At(i.shift,e):0;return t.style.borderRightWidth=ue(n),t.style.borderTopWidth=ue(r),t.style.bottom=ue(a),t.width=n,t.height=r+a,t.depth=-a,t.maxFontSize=r*1.125*e.sizeMultiplier,t},mathmlBuilder(i,e){var t=At(i.width,e),n=At(i.height,e),r=i.shift?At(i.shift,e):0,a=e.color&&e.getColor()||"black",s=new le("mspace");s.setAttribute("mathbackground",a),s.setAttribute("width",ue(t)),s.setAttribute("height",ue(n));var o=new le("mpadded",[s]);return r>=0?o.setAttribute("height",ue(r)):(o.setAttribute("height",ue(r)),o.setAttribute("depth",ue(-r))),o.setAttribute("voffset",ue(r)),o}});function ph(i,e,t){for(var n=Bt(i,e,!1),r=e.sizeMultiplier/t.sizeMultiplier,a=0;a<n.length;a++){var s=n[a].classes.indexOf("sizing");s<0?Array.prototype.push.apply(n[a].classes,e.sizingClasses(t)):n[a].classes[s+1]==="reset-size"+e.size&&(n[a].classes[s+1]="reset-size"+t.size),n[a].height*=r,n[a].depth*=r}return si(n)}var Dc=["\\tiny","\\sixptsize","\\scriptsize","\\footnotesize","\\small","\\normalsize","\\large","\\Large","\\LARGE","\\huge","\\Huge"],d2=(i,e)=>{var t=e.havingSize(i.size);return ph(i.body,t,e)};be({type:"sizing",names:Dc,props:{numArgs:0,allowedInText:!0},handler:(i,e)=>{var{breakOnTokenText:t,funcName:n,parser:r}=i,a=r.parseExpression(!1,t);return{type:"sizing",mode:r.mode,size:Dc.indexOf(n)+1,body:a}},htmlBuilder:d2,mathmlBuilder:(i,e)=>{var t=e.havingSize(i.size),n=mn(i.body,t),r=new le("mstyle",n);return r.setAttribute("mathsize",ue(t.sizeMultiplier)),r}});be({type:"smash",names:["\\smash"],props:{numArgs:1,numOptionalArgs:1,allowedInText:!0},handler:(i,e,t)=>{var{parser:n}=i,r=!1,a=!1,s=t[0]&&Qe(t[0],"ordgroup");if(s)for(var o,l=0;l<s.body.length;++l){var c=s.body[l];if(o=ls(c).text,o==="t")r=!0;else if(o==="b")a=!0;else{r=!1,a=!1;break}}else r=!0,a=!0;var u=e[0];return{type:"smash",mode:n.mode,body:u,smashHeight:r,smashDepth:a}},htmlBuilder:(i,e)=>{var t=se([],[dt(i.body,e)]);if(!i.smashHeight&&!i.smashDepth)return t;if(i.smashHeight&&(t.height=0),i.smashDepth&&(t.depth=0),i.smashHeight&&i.smashDepth)return se(["mord","smash"],[t],e);if(t.children)for(var n=0;n<t.children.length;n++)i.smashHeight&&(t.children[n].height=0),i.smashDepth&&(t.children[n].depth=0);var r=ht({positionType:"firstBaseline",children:[{type:"elem",elem:t}]});return se(["mord"],[r],e)},mathmlBuilder:(i,e)=>{var t=new le("mpadded",[xt(i.body,e)]);return i.smashHeight&&t.setAttribute("height","0px"),i.smashDepth&&t.setAttribute("depth","0px"),t}});be({type:"sqrt",names:["\\sqrt"],props:{numArgs:1,numOptionalArgs:1},handler(i,e,t){var{parser:n}=i,r=t[0],a=e[0];return{type:"sqrt",mode:n.mode,body:a,index:r}},htmlBuilder(i,e){var t=dt(i.body,e.havingCrampedStyle());t.height===0&&(t.height=e.fontMetrics().xHeight),t=Sr(t,e);var n=e.fontMetrics(),r=n.defaultRuleThickness,a=r;e.style.id<Ye.TEXT.id&&(a=e.fontMetrics().xHeight);var s=r+a/4,o=t.height+t.depth+s+r,{span:l,ruleWidth:c,advanceWidth:u}=Jg(o,e),h=l.height-c;h>t.height+t.depth+s&&(s=(s+h-t.height-t.depth)/2);var f=l.height-t.height-s-c;t.style.paddingLeft=ue(u);var m=ht({positionType:"firstBaseline",children:[{type:"elem",elem:t,wrapperClasses:["svg-align"]},{type:"kern",size:-(t.height+f)},{type:"elem",elem:l},{type:"kern",size:c}]});if(i.index){var x=e.havingStyle(Ye.SCRIPTSCRIPT),y=dt(i.index,x,e),g=.6*(m.height-m.depth),p=ht({positionType:"shift",positionData:-g,children:[{type:"elem",elem:y}]}),A=se(["root"],[p]);return se(["mord","sqrt"],[A,m],e)}else return se(["mord","sqrt"],[m],e)},mathmlBuilder(i,e){var{body:t,index:n}=i;return n?new le("mroot",[xt(t,e),xt(n,e)]):new le("msqrt",[xt(t,e)])}});var x0={display:Ye.DISPLAY,text:Ye.TEXT,script:Ye.SCRIPT,scriptscript:Ye.SCRIPTSCRIPT};function f2(i){return i in x0}be({type:"styling",names:["\\displaystyle","\\textstyle","\\scriptstyle","\\scriptscriptstyle"],props:{numArgs:0,allowedInText:!0,primitive:!0},handler(i,e){var{breakOnTokenText:t,funcName:n,parser:r}=i,a=r.parseExpression(!0,t),s=n.slice(1,n.length-5);if(!f2(s))throw new Error("Unknown style: "+s);return{type:"styling",mode:r.mode,style:s,body:a}},htmlBuilder(i,e){var t=x0[i.style],n=e.havingStyle(t);return i.resetFont&&(n=n.withFont("")),ph(i.body,n,e)},mathmlBuilder(i,e){var t=x0[i.style],n=e.havingStyle(t);i.resetFont&&(n=n.withFont(""));var r=mn(i.body,n),a=new le("mstyle",r),s={display:["0","true"],text:["0","false"],script:["1","false"],scriptscript:["2","false"]},o=s[i.style];return a.setAttribute("scriptlevel",o[0]),a.setAttribute("displaystyle",o[1]),a}});var p2=function(e,t){var n=e.base;if(n)if(n.type==="op"){var r=n.limits&&(t.style.size===Ye.DISPLAY.size||n.alwaysHandleSupSub);return r?Dr:null}else if(n.type==="operatorname"){var a=n.alwaysHandleSupSub&&(t.style.size===Ye.DISPLAY.size||n.limits);return a?fh:null}else{if(n.type==="accent")return ri(n.base)?k0:null;if(n.type==="horizBrace"){var s=!e.sub;return s===n.isOver?uh:null}else return null}else return null};$i({type:"supsub",htmlBuilder(i,e){var t=p2(i,e);if(t)return t(i,e);var{base:n,sup:r,sub:a}=i,s=dt(n,e),o,l,c=e.fontMetrics(),u=0,h=0,f=n&&ri(n);if(r){var m=e.havingStyle(e.style.sup());o=dt(r,m,e),f||(u=s.height-m.fontMetrics().supDrop*m.sizeMultiplier/e.sizeMultiplier)}if(a){var x=e.havingStyle(e.style.sub());l=dt(a,x,e),f||(h=s.depth+x.fontMetrics().subDrop*x.sizeMultiplier/e.sizeMultiplier)}var y;e.style===Ye.DISPLAY?y=c.sup1:e.style.cramped?y=c.sup3:y=c.sup2;var g=e.sizeMultiplier,p=ue(.5/c.ptPerEm/g),A=null;if(l){var C=i.base&&i.base.type==="op"&&i.base.name&&(i.base.name==="\\oiint"||i.base.name==="\\oiiint");if(s instanceof fn||C){var S;A=ue(-((S=s.italic)!=null?S:0))}}var N;if(o&&l){u=Math.max(u,y,o.depth+.25*c.xHeight),h=Math.max(h,c.sub2);var I=c.defaultRuleThickness,D=4*I;if(u-o.depth-(l.height-h)<D){h=D-(u-o.depth)+l.height;var U=.8*c.xHeight-(u-o.depth);U>0&&(u+=U,h-=U)}var T=[{type:"elem",elem:l,shift:h,marginRight:p,marginLeft:A},{type:"elem",elem:o,shift:-u,marginRight:p}];N=ht({positionType:"individualShift",children:T})}else if(l){h=Math.max(h,c.sub1,l.height-.8*c.xHeight);var w=[{type:"elem",elem:l,marginLeft:A,marginRight:p}];N=ht({positionType:"shift",positionData:h,children:w})}else if(o)u=Math.max(u,y,o.depth+.25*c.xHeight),N=ht({positionType:"shift",positionData:-u,children:[{type:"elem",elem:o,marginRight:p}]});else throw new Error("supsub must have either sup or sub.");var F=f0(s,"right")||"mord";return se([F],[s,se(["msupsub"],[N])],e)},mathmlBuilder(i,e){var t=!1,n,r;i.base&&i.base.type==="horizBrace"&&(r=!!i.sup,r===i.base.isOver&&(t=!0,n=i.base.isOver)),i.base&&(i.base.type==="op"||i.base.type==="operatorname")&&(i.base.parentIsSupSub=!0);var a=[xt(i.base,e)];i.sub&&a.push(xt(i.sub,e)),i.sup&&a.push(xt(i.sup,e));var s;if(t)s=n?"mover":"munder";else if(i.sub)if(i.sup){var c=i.base;c&&c.type==="op"&&c.limits&&e.style===Ye.DISPLAY||c&&c.type==="operatorname"&&c.alwaysHandleSupSub&&(e.style===Ye.DISPLAY||c.limits)?s="munderover":s="msubsup"}else{var l=i.base;l&&l.type==="op"&&l.limits&&(e.style===Ye.DISPLAY||l.alwaysHandleSupSub)||l&&l.type==="operatorname"&&l.alwaysHandleSupSub&&(l.limits||e.style===Ye.DISPLAY)?s="munder":s="msub"}else{var o=i.base;o&&o.type==="op"&&o.limits&&(e.style===Ye.DISPLAY||o.alwaysHandleSupSub)||o&&o.type==="operatorname"&&o.alwaysHandleSupSub&&(o.limits||e.style===Ye.DISPLAY)?s="mover":s="msup"}return new le(s,a)}});$i({type:"atom",htmlBuilder(i,e){return L0(i.text,i.mode,e,["m"+i.family])},mathmlBuilder(i,e){var t=new le("mo",[_n(i.text,i.mode)]);if(i.family==="bin"){var n=N0(i,e);n==="bold-italic"&&t.setAttribute("mathvariant",n)}else i.family==="punct"?t.setAttribute("separator","true"):(i.family==="open"||i.family==="close")&&t.setAttribute("stretchy","false");return t}});var mh={mi:"italic",mn:"normal",mtext:"normal"};$i({type:"mathord",htmlBuilder(i,e){return as(i,e,"mathord")},mathmlBuilder(i,e){var t=new le("mi",[_n(i.text,i.mode,e)]),n=N0(i,e)||"italic";return n!==mh[t.type]&&t.setAttribute("mathvariant",n),t}});$i({type:"textord",htmlBuilder(i,e){return as(i,e,"textord")},mathmlBuilder(i,e){var t=_n(i.text,i.mode,e),n=N0(i,e)||"normal",r;return i.mode==="text"?r=new le("mtext",[t]):/[0-9]/.test(i.text)?r=new le("mn",[t]):i.text==="\\prime"?r=new le("mo",[t]):r=new le("mi",[t]),n!==mh[r.type]&&r.setAttribute("mathvariant",n),r}});var lo={"\\nobreak":"nobreak","\\allowbreak":"allowbreak"},co={" ":{},"\\ ":{},"~":{className:"nobreak"},"\\space":{},"\\nobreakspace":{className:"nobreak"}};$i({type:"spacing",htmlBuilder(i,e){if(co.hasOwnProperty(i.text)){var t=co[i.text].className||"";if(i.mode==="text"){var n=as(i,e,"textord");return n.classes.push(t),n}else return se(["mspace",t],[L0(i.text,i.mode,e)],e)}else{if(lo.hasOwnProperty(i.text))return se(["mspace",lo[i.text]],[],e);throw new oe('Unknown type of space "'+i.text+'"')}},mathmlBuilder(i,e){var t;if(co.hasOwnProperty(i.text))t=new le("mtext",[new Ut(" ")]);else{if(lo.hasOwnProperty(i.text))return new le("mspace");throw new oe('Unknown type of space "'+i.text+'"')}return t}});var Ic=()=>{var i=new le("mtd",[]);return i.setAttribute("width","50%"),i};$i({type:"tag",mathmlBuilder(i,e){var t=new le("mtable",[new le("mtr",[Ic(),new le("mtd",[Ai(i.body,e)]),Ic(),new le("mtd",[Ai(i.tag,e)])])]);return t.setAttribute("width","100%"),t}});var Lc={"\\text":void 0,"\\textrm":"textrm","\\textsf":"textsf","\\texttt":"texttt","\\textnormal":"textrm"},Fc={"\\textbf":"textbf","\\textmd":"textmd"},m2={"\\textit":"textit","\\textup":"textup"},Uc=(i,e)=>{var t=i.font;if(t){if(Lc[t])return e.withTextFontFamily(Lc[t]);if(Fc[t])return e.withTextFontWeight(Fc[t]);if(t==="\\emph")return e.fontShape==="textit"?e.withTextFontShape("textup"):e.withTextFontShape("textit")}else return e;return e.withTextFontShape(m2[t])};be({type:"text",names:["\\text","\\textrm","\\textsf","\\texttt","\\textnormal","\\textbf","\\textmd","\\textit","\\textup","\\emph"],props:{numArgs:1,argTypes:["text"],allowedInArgument:!0,allowedInText:!0},handler(i,e){var{parser:t,funcName:n}=i,r=e[0];return{type:"text",mode:t.mode,body:Ft(r),font:n}},htmlBuilder(i,e){var t=Uc(i,e),n=Bt(i.body,t,!0);return se(["mord","text"],n,t)},mathmlBuilder(i,e){var t=Uc(i,e);return Ai(i.body,t)}});be({type:"underline",names:["\\underline"],props:{numArgs:1,allowedInText:!0},handler(i,e){var{parser:t}=i;return{type:"underline",mode:t.mode,body:e[0]}},htmlBuilder(i,e){var t=dt(i.body,e),n=Mr("underline-line",e),r=e.fontMetrics().defaultRuleThickness,a=ht({positionType:"top",positionData:t.height,children:[{type:"kern",size:r},{type:"elem",elem:n},{type:"kern",size:3*r},{type:"elem",elem:t}]});return se(["mord","underline"],[a],e)},mathmlBuilder(i,e){var t=new le("mo",[new Ut("‾")]);t.setAttribute("stretchy","true");var n=new le("munder",[xt(i.body,e),t]);return n.setAttribute("accentunder","true"),n}});be({type:"vcenter",names:["\\vcenter"],props:{numArgs:1,argTypes:["original"],allowedInText:!1},handler(i,e){var{parser:t}=i;return{type:"vcenter",mode:t.mode,body:e[0]}},htmlBuilder(i,e){var t=dt(i.body,e),n=e.fontMetrics().axisHeight,r=.5*(t.height-n-(t.depth+n));return ht({positionType:"shift",positionData:r,children:[{type:"elem",elem:t}]})},mathmlBuilder(i,e){var t=new le("mpadded",[xt(i.body,e)],["vcenter"]);return new le("mrow",[t])}});be({type:"verb",names:["\\verb"],props:{numArgs:0,allowedInText:!0},handler(i,e,t){throw new oe("\\verb ended by end of line instead of matching delimiter")},htmlBuilder(i,e){for(var t=Nc(i),n=[],r=e.havingStyle(e.style.text()),a=0;a<t.length;a++){var s=t[a];s==="~"&&(s="\\textasciitilde"),n.push(jt(s,"Typewriter-Regular",i.mode,r,["mord","texttt"]))}return se(["mord","text"].concat(r.sizingClasses(e)),Iu(n),r)},mathmlBuilder(i,e){var t=new Ut(Nc(i)),n=new le("mtext",[t]);return n.setAttribute("mathvariant","monospace"),n}});var Nc=i=>i.body.replace(/ /g,i.star?"␣":" "),xi=Nu,vh=`[ \r
	]`,v2="\\\\[a-zA-Z@]+",g2="\\\\[^\uD800-\uDFFF]",x2="("+v2+")"+vh+"*",y2=`\\\\(
|[ \r	]+
?)[ \r	]*`,y0="[̀-ͯ]",_2=new RegExp(y0+"+$"),b2="("+vh+"+)|"+(y2+"|")+"([!-\\[\\]-‧‪-퟿豈-￿]"+(y0+"*")+"|[\uD800-\uDBFF][\uDC00-\uDFFF]"+(y0+"*")+"|\\\\verb\\*([^]).*?\\4|\\\\verb([^*a-zA-Z]).*?\\5"+("|"+x2)+("|"+g2+")");class kc{constructor(e,t){this.input=void 0,this.settings=void 0,this.tokenRegex=void 0,this.catcodes=void 0,this.input=e,this.settings=t,this.tokenRegex=new RegExp(b2,"g"),this.catcodes={"%":14,"~":13}}setCatcode(e,t){this.catcodes[e]=t}lex(){var e=this.input,t=this.tokenRegex.lastIndex;if(t===e.length)return new dn("EOF",new rn(this,t,t));var n=this.tokenRegex.exec(e);if(n===null||n.index!==t)throw new oe("Unexpected character: '"+e[t]+"'",new dn(e[t],new rn(this,t,t+1)));var r=n[6]||n[3]||(n[2]?"\\ ":" ");if(this.catcodes[r]===14){var a=e.indexOf(`
`,this.tokenRegex.lastIndex);return a===-1?(this.tokenRegex.lastIndex=e.length,this.settings.reportNonstrict("commentAtEnd","% comment has no terminating newline; LaTeX would fail because of commenting the end of math mode (e.g. $)")):this.tokenRegex.lastIndex=a+1,this.lex()}return new dn(r,new rn(this,t,this.tokenRegex.lastIndex))}}class M2{constructor(e,t){e===void 0&&(e={}),t===void 0&&(t={}),this.current=void 0,this.builtins=void 0,this.undefStack=void 0,this.current=t,this.builtins=e,this.undefStack=[]}beginGroup(){this.undefStack.push({})}endGroup(){if(this.undefStack.length===0)throw new oe("Unbalanced namespace destruction: attempt to pop global namespace; please report this as a bug");var e=this.undefStack.pop();for(var t in e)e.hasOwnProperty(t)&&(e[t]==null?delete this.current[t]:this.current[t]=e[t])}endGroups(){for(;this.undefStack.length>0;)this.endGroup()}has(e){return this.current.hasOwnProperty(e)||this.builtins.hasOwnProperty(e)}get(e){return this.current.hasOwnProperty(e)?this.current[e]:this.builtins[e]}set(e,t,n){if(n===void 0&&(n=!1),n){for(var r=0;r<this.undefStack.length;r++)delete this.undefStack[r][e];this.undefStack.length>0&&(this.undefStack[this.undefStack.length-1][e]=t)}else{var a=this.undefStack[this.undefStack.length-1];a&&!a.hasOwnProperty(e)&&(a[e]=this.current[e])}t==null?delete this.current[e]:this.current[e]=t}}var S2=ah;M("\\noexpand",function(i){var e=i.popToken();return i.isExpandable(e.text)&&(e.noexpand=!0,e.treatAsRelax=!0),{tokens:[e],numArgs:0}});M("\\expandafter",function(i){var e=i.popToken();return i.expandOnce(!0),{tokens:[e],numArgs:0}});M("\\@firstoftwo",function(i){var e=i.consumeArgs(2);return{tokens:e[0],numArgs:0}});M("\\@secondoftwo",function(i){var e=i.consumeArgs(2);return{tokens:e[1],numArgs:0}});M("\\@ifnextchar",function(i){var e=i.consumeArgs(3);i.consumeSpaces();var t=i.future();return e[0].length===1&&e[0][0].text===t.text?{tokens:e[1],numArgs:0}:{tokens:e[2],numArgs:0}});M("\\@ifstar","\\@ifnextchar *{\\@firstoftwo{#1}}");M("\\TextOrMath",function(i){var e=i.consumeArgs(2);return i.mode==="text"?{tokens:e[0],numArgs:0}:{tokens:e[1],numArgs:0}});var zc={0:0,1:1,2:2,3:3,4:4,5:5,6:6,7:7,8:8,9:9,a:10,A:10,b:11,B:11,c:12,C:12,d:13,D:13,e:14,E:14,f:15,F:15};M("\\char",function(i){var e=i.popToken(),t,n=0;if(e.text==="'")t=8,e=i.popToken();else if(e.text==='"')t=16,e=i.popToken();else if(e.text==="`")if(e=i.popToken(),e.text[0]==="\\")n=e.text.charCodeAt(1);else{if(e.text==="EOF")throw new oe("\\char` missing argument");n=e.text.charCodeAt(0)}else t=10;if(t){if(n=zc[e.text],n==null||n>=t)throw new oe("Invalid base-"+t+" digit "+e.text);for(var r;(r=zc[i.future().text])!=null&&r<t;)n*=t,n+=r,i.popToken()}return"\\@char{"+n+"}"});var H0=(i,e,t,n)=>{var r=i.consumeArg().tokens;if(r.length!==1)throw new oe("\\newcommand's first argument must be a macro name");var a=r[0].text,s=i.isDefined(a);if(s&&!e)throw new oe("\\newcommand{"+a+"} attempting to redefine "+(a+"; use \\renewcommand"));if(!s&&!t)throw new oe("\\renewcommand{"+a+"} when command "+a+" does not yet exist; use \\newcommand");var o=0;if(r=i.consumeArg().tokens,r.length===1&&r[0].text==="["){for(var l="",c=i.expandNextToken();c.text!=="]"&&c.text!=="EOF";)l+=c.text,c=i.expandNextToken();if(!l.match(/^\s*[0-9]+\s*$/))throw new oe("Invalid number of arguments: "+l);o=parseInt(l),r=i.consumeArg().tokens}return s&&n||i.macros.set(a,{tokens:r,numArgs:o}),""};M("\\newcommand",i=>H0(i,!1,!0,!1));M("\\renewcommand",i=>H0(i,!0,!1,!1));M("\\providecommand",i=>H0(i,!0,!0,!0));M("\\message",i=>{var e=i.consumeArgs(1)[0];return console.log(e.reverse().map(t=>t.text).join("")),""});M("\\errmessage",i=>{var e=i.consumeArgs(1)[0];return console.error(e.reverse().map(t=>t.text).join("")),""});M("\\show",i=>{var e=i.popToken(),t=e.text;return console.log(e,i.macros.get(t),xi[t],wt.math[t],wt.text[t]),""});M("\\bgroup","{");M("\\egroup","}");M("~","\\nobreakspace");M("\\lq","`");M("\\rq","'");M("\\aa","\\r a");M("\\AA","\\r A");M("\\textcopyright","\\html@mathml{\\textcircled{c}}{\\char`©}");M("\\copyright","\\TextOrMath{\\textcopyright}{\\text{\\textcopyright}}");M("\\textregistered","\\html@mathml{\\textcircled{\\scriptsize R}}{\\char`®}");M("ℬ","\\mathscr{B}");M("ℰ","\\mathscr{E}");M("ℱ","\\mathscr{F}");M("ℋ","\\mathscr{H}");M("ℐ","\\mathscr{I}");M("ℒ","\\mathscr{L}");M("ℳ","\\mathscr{M}");M("ℛ","\\mathscr{R}");M("ℭ","\\mathfrak{C}");M("ℌ","\\mathfrak{H}");M("ℨ","\\mathfrak{Z}");M("\\Bbbk","\\Bbb{k}");M("\\llap","\\mathllap{\\textrm{#1}}");M("\\rlap","\\mathrlap{\\textrm{#1}}");M("\\clap","\\mathclap{\\textrm{#1}}");M("\\mathstrut","\\vphantom{(}");M("\\underbar","\\underline{\\text{#1}}");M("\\not",'\\html@mathml{\\mathrel{\\mathrlap\\@not}\\nobreak}{\\char"338}');M("\\neq","\\html@mathml{\\mathrel{\\not=}}{\\mathrel{\\char`≠}}");M("\\ne","\\neq");M("≠","\\neq");M("\\notin","\\html@mathml{\\mathrel{{\\in}\\mathllap{/\\mskip1mu}}}{\\mathrel{\\char`∉}}");M("∉","\\notin");M("≘","\\html@mathml{\\mathrel{=\\kern{-1em}\\raisebox{0.4em}{$\\scriptsize\\frown$}}}{\\mathrel{\\char`≘}}");M("≙","\\html@mathml{\\stackrel{\\tiny\\wedge}{=}}{\\mathrel{\\char`≘}}");M("≚","\\html@mathml{\\stackrel{\\tiny\\vee}{=}}{\\mathrel{\\char`≚}}");M("≛","\\html@mathml{\\stackrel{\\scriptsize\\star}{=}}{\\mathrel{\\char`≛}}");M("≝","\\html@mathml{\\stackrel{\\tiny\\mathrm{def}}{=}}{\\mathrel{\\char`≝}}");M("≞","\\html@mathml{\\stackrel{\\tiny\\mathrm{m}}{=}}{\\mathrel{\\char`≞}}");M("≟","\\html@mathml{\\stackrel{\\tiny?}{=}}{\\mathrel{\\char`≟}}");M("⟂","\\perp");M("‼","\\mathclose{!\\mkern-0.8mu!}");M("∌","\\notni");M("⌜","\\ulcorner");M("⌝","\\urcorner");M("⌞","\\llcorner");M("⌟","\\lrcorner");M("©","\\copyright");M("®","\\textregistered");M("\\ulcorner",'\\html@mathml{\\@ulcorner}{\\mathop{\\char"231c}}');M("\\urcorner",'\\html@mathml{\\@urcorner}{\\mathop{\\char"231d}}');M("\\llcorner",'\\html@mathml{\\@llcorner}{\\mathop{\\char"231e}}');M("\\lrcorner",'\\html@mathml{\\@lrcorner}{\\mathop{\\char"231f}}');M("\\vdots","{\\varvdots\\rule{0pt}{15pt}}");M("⋮","\\vdots");M("\\varGamma","\\mathit{\\Gamma}");M("\\varDelta","\\mathit{\\Delta}");M("\\varTheta","\\mathit{\\Theta}");M("\\varLambda","\\mathit{\\Lambda}");M("\\varXi","\\mathit{\\Xi}");M("\\varPi","\\mathit{\\Pi}");M("\\varSigma","\\mathit{\\Sigma}");M("\\varUpsilon","\\mathit{\\Upsilon}");M("\\varPhi","\\mathit{\\Phi}");M("\\varPsi","\\mathit{\\Psi}");M("\\varOmega","\\mathit{\\Omega}");M("\\substack","\\begin{subarray}{c}#1\\end{subarray}");M("\\colon","\\nobreak\\mskip2mu\\mathpunct{}\\mathchoice{\\mkern-3mu}{\\mkern-3mu}{}{}{:}\\mskip6mu\\relax");M("\\boxed","\\fbox{$\\displaystyle{#1}$}");M("\\iff","\\DOTSB\\;\\Longleftrightarrow\\;");M("\\implies","\\DOTSB\\;\\Longrightarrow\\;");M("\\impliedby","\\DOTSB\\;\\Longleftarrow\\;");M("\\dddot","{\\overset{\\raisebox{-0.1ex}{\\normalsize ...}}{#1}}");M("\\ddddot","{\\overset{\\raisebox{-0.1ex}{\\normalsize ....}}{#1}}");var Oc={",":"\\dotsc","\\not":"\\dotsb","+":"\\dotsb","=":"\\dotsb","<":"\\dotsb",">":"\\dotsb","-":"\\dotsb","*":"\\dotsb",":":"\\dotsb","\\DOTSB":"\\dotsb","\\coprod":"\\dotsb","\\bigvee":"\\dotsb","\\bigwedge":"\\dotsb","\\biguplus":"\\dotsb","\\bigcap":"\\dotsb","\\bigcup":"\\dotsb","\\prod":"\\dotsb","\\sum":"\\dotsb","\\bigotimes":"\\dotsb","\\bigoplus":"\\dotsb","\\bigodot":"\\dotsb","\\bigsqcup":"\\dotsb","\\And":"\\dotsb","\\longrightarrow":"\\dotsb","\\Longrightarrow":"\\dotsb","\\longleftarrow":"\\dotsb","\\Longleftarrow":"\\dotsb","\\longleftrightarrow":"\\dotsb","\\Longleftrightarrow":"\\dotsb","\\mapsto":"\\dotsb","\\longmapsto":"\\dotsb","\\hookrightarrow":"\\dotsb","\\doteq":"\\dotsb","\\mathbin":"\\dotsb","\\mathrel":"\\dotsb","\\relbar":"\\dotsb","\\Relbar":"\\dotsb","\\xrightarrow":"\\dotsb","\\xleftarrow":"\\dotsb","\\DOTSI":"\\dotsi","\\int":"\\dotsi","\\oint":"\\dotsi","\\iint":"\\dotsi","\\iiint":"\\dotsi","\\iiiint":"\\dotsi","\\idotsint":"\\dotsi","\\DOTSX":"\\dotsx"},w2=new Set(["bin","rel"]);M("\\dots",function(i){var e="\\dotso",t=i.expandAfterFuture().text;return t in Oc?e=Oc[t]:(t.slice(0,4)==="\\not"||t in wt.math&&w2.has(wt.math[t].group))&&(e="\\dotsb"),e});var V0={")":!0,"]":!0,"\\rbrack":!0,"\\}":!0,"\\rbrace":!0,"\\rangle":!0,"\\rceil":!0,"\\rfloor":!0,"\\rgroup":!0,"\\rmoustache":!0,"\\right":!0,"\\bigr":!0,"\\biggr":!0,"\\Bigr":!0,"\\Biggr":!0,$:!0,";":!0,".":!0,",":!0};M("\\dotso",function(i){var e=i.future().text;return e in V0?"\\ldots\\,":"\\ldots"});M("\\dotsc",function(i){var e=i.future().text;return e in V0&&e!==","?"\\ldots\\,":"\\ldots"});M("\\cdots",function(i){var e=i.future().text;return e in V0?"\\@cdots\\,":"\\@cdots"});M("\\dotsb","\\cdots");M("\\dotsm","\\cdots");M("\\dotsi","\\!\\cdots");M("\\dotsx","\\ldots\\,");M("\\DOTSI","\\relax");M("\\DOTSB","\\relax");M("\\DOTSX","\\relax");M("\\tmspace","\\TextOrMath{\\kern#1#3}{\\mskip#1#2}\\relax");M("\\,","\\tmspace+{3mu}{.1667em}");M("\\thinspace","\\,");M("\\>","\\mskip{4mu}");M("\\:","\\tmspace+{4mu}{.2222em}");M("\\medspace","\\:");M("\\;","\\tmspace+{5mu}{.2777em}");M("\\thickspace","\\;");M("\\!","\\tmspace-{3mu}{.1667em}");M("\\negthinspace","\\!");M("\\negmedspace","\\tmspace-{4mu}{.2222em}");M("\\negthickspace","\\tmspace-{5mu}{.277em}");M("\\enspace","\\kern.5em ");M("\\enskip","\\hskip.5em\\relax");M("\\quad","\\hskip1em\\relax");M("\\qquad","\\hskip2em\\relax");M("\\tag","\\@ifstar\\tag@literal\\tag@paren");M("\\tag@paren","\\tag@literal{({#1})}");M("\\tag@literal",i=>{if(i.macros.get("\\df@tag"))throw new oe("Multiple \\tag");return"\\gdef\\df@tag{\\text{#1}}"});M("\\bmod","\\mathchoice{\\mskip1mu}{\\mskip1mu}{\\mskip5mu}{\\mskip5mu}\\mathbin{\\rm mod}\\mathchoice{\\mskip1mu}{\\mskip1mu}{\\mskip5mu}{\\mskip5mu}");M("\\pod","\\allowbreak\\mathchoice{\\mkern18mu}{\\mkern8mu}{\\mkern8mu}{\\mkern8mu}(#1)");M("\\pmod","\\pod{{\\rm mod}\\mkern6mu#1}");M("\\mod","\\allowbreak\\mathchoice{\\mkern18mu}{\\mkern12mu}{\\mkern12mu}{\\mkern12mu}{\\rm mod}\\,\\,#1");M("\\newline","\\\\\\relax");M("\\TeX","\\textrm{\\html@mathml{T\\kern-.1667em\\raisebox{-.5ex}{E}\\kern-.125emX}{TeX}}");var gh=ue(kn["Main-Regular"][84][1]-.7*kn["Main-Regular"][65][1]);M("\\LaTeX","\\textrm{\\html@mathml{"+("L\\kern-.36em\\raisebox{"+gh+"}{\\scriptstyle A}")+"\\kern-.15em\\TeX}{LaTeX}}");M("\\KaTeX","\\textrm{\\html@mathml{"+("K\\kern-.17em\\raisebox{"+gh+"}{\\scriptstyle A}")+"\\kern-.15em\\TeX}{KaTeX}}");M("\\hspace","\\@ifstar\\@hspacer\\@hspace");M("\\@hspace","\\hskip #1\\relax");M("\\@hspacer","\\rule{0pt}{0pt}\\hskip #1\\relax");M("\\ordinarycolon",":");M("\\vcentcolon","\\mathrel{\\mathop\\ordinarycolon}");M("\\dblcolon",'\\html@mathml{\\mathrel{\\vcentcolon\\mathrel{\\mkern-.9mu}\\vcentcolon}}{\\mathop{\\char"2237}}');M("\\coloneqq",'\\html@mathml{\\mathrel{\\vcentcolon\\mathrel{\\mkern-1.2mu}=}}{\\mathop{\\char"2254}}');M("\\Coloneqq",'\\html@mathml{\\mathrel{\\dblcolon\\mathrel{\\mkern-1.2mu}=}}{\\mathop{\\char"2237\\char"3d}}');M("\\coloneq",'\\html@mathml{\\mathrel{\\vcentcolon\\mathrel{\\mkern-1.2mu}\\mathrel{-}}}{\\mathop{\\char"3a\\char"2212}}');M("\\Coloneq",'\\html@mathml{\\mathrel{\\dblcolon\\mathrel{\\mkern-1.2mu}\\mathrel{-}}}{\\mathop{\\char"2237\\char"2212}}');M("\\eqqcolon",'\\html@mathml{\\mathrel{=\\mathrel{\\mkern-1.2mu}\\vcentcolon}}{\\mathop{\\char"2255}}');M("\\Eqqcolon",'\\html@mathml{\\mathrel{=\\mathrel{\\mkern-1.2mu}\\dblcolon}}{\\mathop{\\char"3d\\char"2237}}');M("\\eqcolon",'\\html@mathml{\\mathrel{\\mathrel{-}\\mathrel{\\mkern-1.2mu}\\vcentcolon}}{\\mathop{\\char"2239}}');M("\\Eqcolon",'\\html@mathml{\\mathrel{\\mathrel{-}\\mathrel{\\mkern-1.2mu}\\dblcolon}}{\\mathop{\\char"2212\\char"2237}}');M("\\colonapprox",'\\html@mathml{\\mathrel{\\vcentcolon\\mathrel{\\mkern-1.2mu}\\approx}}{\\mathop{\\char"3a\\char"2248}}');M("\\Colonapprox",'\\html@mathml{\\mathrel{\\dblcolon\\mathrel{\\mkern-1.2mu}\\approx}}{\\mathop{\\char"2237\\char"2248}}');M("\\colonsim",'\\html@mathml{\\mathrel{\\vcentcolon\\mathrel{\\mkern-1.2mu}\\sim}}{\\mathop{\\char"3a\\char"223c}}');M("\\Colonsim",'\\html@mathml{\\mathrel{\\dblcolon\\mathrel{\\mkern-1.2mu}\\sim}}{\\mathop{\\char"2237\\char"223c}}');M("∷","\\dblcolon");M("∹","\\eqcolon");M("≔","\\coloneqq");M("≕","\\eqqcolon");M("⩴","\\Coloneqq");M("\\ratio","\\vcentcolon");M("\\coloncolon","\\dblcolon");M("\\colonequals","\\coloneqq");M("\\coloncolonequals","\\Coloneqq");M("\\equalscolon","\\eqqcolon");M("\\equalscoloncolon","\\Eqqcolon");M("\\colonminus","\\coloneq");M("\\coloncolonminus","\\Coloneq");M("\\minuscolon","\\eqcolon");M("\\minuscoloncolon","\\Eqcolon");M("\\coloncolonapprox","\\Colonapprox");M("\\coloncolonsim","\\Colonsim");M("\\simcolon","\\mathrel{\\sim\\mathrel{\\mkern-1.2mu}\\vcentcolon}");M("\\simcoloncolon","\\mathrel{\\sim\\mathrel{\\mkern-1.2mu}\\dblcolon}");M("\\approxcolon","\\mathrel{\\approx\\mathrel{\\mkern-1.2mu}\\vcentcolon}");M("\\approxcoloncolon","\\mathrel{\\approx\\mathrel{\\mkern-1.2mu}\\dblcolon}");M("\\notni","\\html@mathml{\\not\\ni}{\\mathrel{\\char`∌}}");M("\\limsup","\\DOTSB\\operatorname*{lim\\,sup}");M("\\liminf","\\DOTSB\\operatorname*{lim\\,inf}");M("\\injlim","\\DOTSB\\operatorname*{inj\\,lim}");M("\\projlim","\\DOTSB\\operatorname*{proj\\,lim}");M("\\varlimsup","\\DOTSB\\operatorname*{\\overline{lim}}");M("\\varliminf","\\DOTSB\\operatorname*{\\underline{lim}}");M("\\varinjlim","\\DOTSB\\operatorname*{\\underrightarrow{lim}}");M("\\varprojlim","\\DOTSB\\operatorname*{\\underleftarrow{lim}}");M("\\gvertneqq","\\html@mathml{\\@gvertneqq}{≩}");M("\\lvertneqq","\\html@mathml{\\@lvertneqq}{≨}");M("\\ngeqq","\\html@mathml{\\@ngeqq}{≱}");M("\\ngeqslant","\\html@mathml{\\@ngeqslant}{≱}");M("\\nleqq","\\html@mathml{\\@nleqq}{≰}");M("\\nleqslant","\\html@mathml{\\@nleqslant}{≰}");M("\\nshortmid","\\html@mathml{\\@nshortmid}{∤}");M("\\nshortparallel","\\html@mathml{\\@nshortparallel}{∦}");M("\\nsubseteqq","\\html@mathml{\\@nsubseteqq}{⊈}");M("\\nsupseteqq","\\html@mathml{\\@nsupseteqq}{⊉}");M("\\varsubsetneq","\\html@mathml{\\@varsubsetneq}{⊊}");M("\\varsubsetneqq","\\html@mathml{\\@varsubsetneqq}{⫋}");M("\\varsupsetneq","\\html@mathml{\\@varsupsetneq}{⊋}");M("\\varsupsetneqq","\\html@mathml{\\@varsupsetneqq}{⫌}");M("\\imath","\\html@mathml{\\@imath}{ı}");M("\\jmath","\\html@mathml{\\@jmath}{ȷ}");M("\\llbracket","\\html@mathml{\\mathopen{[\\mkern-3.2mu[}}{\\mathopen{\\char`⟦}}");M("\\rrbracket","\\html@mathml{\\mathclose{]\\mkern-3.2mu]}}{\\mathclose{\\char`⟧}}");M("⟦","\\llbracket");M("⟧","\\rrbracket");M("\\lBrace","\\html@mathml{\\mathopen{\\{\\mkern-3.2mu[}}{\\mathopen{\\char`⦃}}");M("\\rBrace","\\html@mathml{\\mathclose{]\\mkern-3.2mu\\}}}{\\mathclose{\\char`⦄}}");M("⦃","\\lBrace");M("⦄","\\rBrace");M("\\minuso","\\mathbin{\\html@mathml{{\\mathrlap{\\mathchoice{\\kern{0.145em}}{\\kern{0.145em}}{\\kern{0.1015em}}{\\kern{0.0725em}}\\circ}{-}}}{\\char`⦵}}");M("⦵","\\minuso");M("\\darr","\\downarrow");M("\\dArr","\\Downarrow");M("\\Darr","\\Downarrow");M("\\lang","\\langle");M("\\rang","\\rangle");M("\\uarr","\\uparrow");M("\\uArr","\\Uparrow");M("\\Uarr","\\Uparrow");M("\\N","\\mathbb{N}");M("\\R","\\mathbb{R}");M("\\Z","\\mathbb{Z}");M("\\alef","\\aleph");M("\\alefsym","\\aleph");M("\\Alpha","\\mathrm{A}");M("\\Beta","\\mathrm{B}");M("\\bull","\\bullet");M("\\Chi","\\mathrm{X}");M("\\clubs","\\clubsuit");M("\\cnums","\\mathbb{C}");M("\\Complex","\\mathbb{C}");M("\\Dagger","\\ddagger");M("\\diamonds","\\diamondsuit");M("\\empty","\\emptyset");M("\\Epsilon","\\mathrm{E}");M("\\Eta","\\mathrm{H}");M("\\exist","\\exists");M("\\harr","\\leftrightarrow");M("\\hArr","\\Leftrightarrow");M("\\Harr","\\Leftrightarrow");M("\\hearts","\\heartsuit");M("\\image","\\Im");M("\\infin","\\infty");M("\\Iota","\\mathrm{I}");M("\\isin","\\in");M("\\Kappa","\\mathrm{K}");M("\\larr","\\leftarrow");M("\\lArr","\\Leftarrow");M("\\Larr","\\Leftarrow");M("\\lrarr","\\leftrightarrow");M("\\lrArr","\\Leftrightarrow");M("\\Lrarr","\\Leftrightarrow");M("\\Mu","\\mathrm{M}");M("\\natnums","\\mathbb{N}");M("\\Nu","\\mathrm{N}");M("\\Omicron","\\mathrm{O}");M("\\plusmn","\\pm");M("\\rarr","\\rightarrow");M("\\rArr","\\Rightarrow");M("\\Rarr","\\Rightarrow");M("\\real","\\Re");M("\\reals","\\mathbb{R}");M("\\Reals","\\mathbb{R}");M("\\Rho","\\mathrm{P}");M("\\sdot","\\cdot");M("\\sect","\\S");M("\\spades","\\spadesuit");M("\\sub","\\subset");M("\\sube","\\subseteq");M("\\supe","\\supseteq");M("\\Tau","\\mathrm{T}");M("\\thetasym","\\vartheta");M("\\weierp","\\wp");M("\\Zeta","\\mathrm{Z}");M("\\argmin","\\DOTSB\\operatorname*{arg\\,min}");M("\\argmax","\\DOTSB\\operatorname*{arg\\,max}");M("\\plim","\\DOTSB\\mathop{\\operatorname{plim}}\\limits");M("\\bra","\\mathinner{\\langle{#1}|}");M("\\ket","\\mathinner{|{#1}\\rangle}");M("\\braket","\\mathinner{\\langle{#1}\\rangle}");M("\\Bra","\\left\\langle#1\\right|");M("\\Ket","\\left|#1\\right\\rangle");var xh=i=>e=>{var t=e.consumeArg().tokens,n=e.consumeArg().tokens,r=e.consumeArg().tokens,a=e.consumeArg().tokens,s=e.macros.get("|"),o=e.macros.get("\\|");e.macros.beginGroup();var l=h=>f=>{i&&(f.macros.set("|",s),r.length&&f.macros.set("\\|",o));var m=h;if(!h&&r.length){var x=f.future();x.text==="|"&&(f.popToken(),m=!0)}return{tokens:m?r:n,numArgs:0}};e.macros.set("|",l(!1)),r.length&&e.macros.set("\\|",l(!0));var c=e.consumeArg().tokens,u=e.expandTokens([...a,...c,...t]);return e.macros.endGroup(),{tokens:u.reverse(),numArgs:0}};M("\\bra@ket",xh(!1));M("\\bra@set",xh(!0));M("\\Braket","\\bra@ket{\\left\\langle}{\\,\\middle\\vert\\,}{\\,\\middle\\vert\\,}{\\right\\rangle}");M("\\Set","\\bra@set{\\left\\{\\:}{\\;\\middle\\vert\\;}{\\;\\middle\\Vert\\;}{\\:\\right\\}}");M("\\set","\\bra@set{\\{\\,}{\\mid}{}{\\,\\}}");M("\\angln","{\\angl n}");M("\\blue","\\textcolor{##6495ed}{#1}");M("\\orange","\\textcolor{##ffa500}{#1}");M("\\pink","\\textcolor{##ff00af}{#1}");M("\\red","\\textcolor{##df0030}{#1}");M("\\green","\\textcolor{##28ae7b}{#1}");M("\\gray","\\textcolor{gray}{#1}");M("\\purple","\\textcolor{##9d38bd}{#1}");M("\\blueA","\\textcolor{##ccfaff}{#1}");M("\\blueB","\\textcolor{##80f6ff}{#1}");M("\\blueC","\\textcolor{##63d9ea}{#1}");M("\\blueD","\\textcolor{##11accd}{#1}");M("\\blueE","\\textcolor{##0c7f99}{#1}");M("\\tealA","\\textcolor{##94fff5}{#1}");M("\\tealB","\\textcolor{##26edd5}{#1}");M("\\tealC","\\textcolor{##01d1c1}{#1}");M("\\tealD","\\textcolor{##01a995}{#1}");M("\\tealE","\\textcolor{##208170}{#1}");M("\\greenA","\\textcolor{##b6ffb0}{#1}");M("\\greenB","\\textcolor{##8af281}{#1}");M("\\greenC","\\textcolor{##74cf70}{#1}");M("\\greenD","\\textcolor{##1fab54}{#1}");M("\\greenE","\\textcolor{##0d923f}{#1}");M("\\goldA","\\textcolor{##ffd0a9}{#1}");M("\\goldB","\\textcolor{##ffbb71}{#1}");M("\\goldC","\\textcolor{##ff9c39}{#1}");M("\\goldD","\\textcolor{##e07d10}{#1}");M("\\goldE","\\textcolor{##a75a05}{#1}");M("\\redA","\\textcolor{##fca9a9}{#1}");M("\\redB","\\textcolor{##ff8482}{#1}");M("\\redC","\\textcolor{##f9685d}{#1}");M("\\redD","\\textcolor{##e84d39}{#1}");M("\\redE","\\textcolor{##bc2612}{#1}");M("\\maroonA","\\textcolor{##ffbde0}{#1}");M("\\maroonB","\\textcolor{##ff92c6}{#1}");M("\\maroonC","\\textcolor{##ed5fa6}{#1}");M("\\maroonD","\\textcolor{##ca337c}{#1}");M("\\maroonE","\\textcolor{##9e034e}{#1}");M("\\purpleA","\\textcolor{##ddd7ff}{#1}");M("\\purpleB","\\textcolor{##c6b9fc}{#1}");M("\\purpleC","\\textcolor{##aa87ff}{#1}");M("\\purpleD","\\textcolor{##7854ab}{#1}");M("\\purpleE","\\textcolor{##543b78}{#1}");M("\\mintA","\\textcolor{##f5f9e8}{#1}");M("\\mintB","\\textcolor{##edf2df}{#1}");M("\\mintC","\\textcolor{##e0e5cc}{#1}");M("\\grayA","\\textcolor{##f6f7f7}{#1}");M("\\grayB","\\textcolor{##f0f1f2}{#1}");M("\\grayC","\\textcolor{##e3e5e6}{#1}");M("\\grayD","\\textcolor{##d6d8da}{#1}");M("\\grayE","\\textcolor{##babec2}{#1}");M("\\grayF","\\textcolor{##888d93}{#1}");M("\\grayG","\\textcolor{##626569}{#1}");M("\\grayH","\\textcolor{##3b3e40}{#1}");M("\\grayI","\\textcolor{##21242c}{#1}");M("\\kaBlue","\\textcolor{##314453}{#1}");M("\\kaGreen","\\textcolor{##71B307}{#1}");var yh={"^":!0,_:!0,"\\limits":!0,"\\nolimits":!0};class T2{constructor(e,t,n){this.settings=void 0,this.expansionCount=void 0,this.lexer=void 0,this.macros=void 0,this.stack=void 0,this.mode=void 0,this.settings=t,this.expansionCount=0,this.feed(e),this.macros=new M2(S2,t.macros),this.mode=n,this.stack=[]}feed(e){this.lexer=new kc(e,this.settings)}switchMode(e){this.mode=e}beginGroup(){this.macros.beginGroup()}endGroup(){this.macros.endGroup()}endGroups(){this.macros.endGroups()}future(){return this.stack.length===0&&this.pushToken(this.lexer.lex()),this.stack[this.stack.length-1]}popToken(){return this.future(),this.stack.pop()}pushToken(e){this.stack.push(e)}pushTokens(e){this.stack.push(...e)}scanArgument(e){var t,n,r;if(e){if(this.consumeSpaces(),this.future().text!=="[")return null;t=this.popToken(),{tokens:r,end:n}=this.consumeArg(["]"])}else({tokens:r,start:t,end:n}=this.consumeArg());return this.pushToken(new dn("EOF",n.loc)),this.pushTokens(r),new dn("",rn.range(t,n))}consumeSpaces(){for(;;){var e=this.future();if(e.text===" ")this.stack.pop();else break}}consumeArg(e){var t=[],n=e&&e.length>0;n||this.consumeSpaces();var r=this.future(),a,s=0,o=0;do{if(a=this.popToken(),t.push(a),a.text==="{")++s;else if(a.text==="}"){if(--s,s===-1)throw new oe("Extra }",a)}else if(a.text==="EOF")throw new oe("Unexpected end of input in a macro argument, expected '"+(e&&n?e[o]:"}")+"'",a);if(e&&n)if((s===0||s===1&&e[o]==="{")&&a.text===e[o]){if(++o,o===e.length){t.splice(-o,o);break}}else o=0}while(s!==0||n);return r.text==="{"&&t[t.length-1].text==="}"&&(t.pop(),t.shift()),t.reverse(),{tokens:t,start:r,end:a}}consumeArgs(e,t){if(t){if(t.length!==e+1)throw new oe("The length of delimiters doesn't match the number of args!");for(var n=t[0],r=0;r<n.length;r++){var a=this.popToken();if(n[r]!==a.text)throw new oe("Use of the macro doesn't match its definition",a)}}for(var s=[],o=0;o<e;o++)s.push(this.consumeArg(t&&t[o+1]).tokens);return s}countExpansion(e){if(this.expansionCount+=e,this.expansionCount>this.settings.maxExpand)throw new oe("Too many expansions: infinite loop or need to increase maxExpand setting")}expandOnce(e){var t=this.popToken(),n=t.text,r=t.noexpand?null:this._getExpansion(n);if(r==null||e&&r.unexpandable){if(e&&r==null&&n[0]==="\\"&&!this.isDefined(n))throw new oe("Undefined control sequence: "+n);return this.pushToken(t),!1}this.countExpansion(1);var a=r.tokens,s=this.consumeArgs(r.numArgs,r.delimiters);if(r.numArgs){a=a.slice();for(var o=a.length-1;o>=0;--o){var l=a[o];if(l.text==="#"){if(o===0)throw new oe("Incomplete placeholder at end of macro body",l);if(l=a[--o],l.text==="#")a.splice(o+1,1);else if(/^[1-9]$/.test(l.text))a.splice(o,2,...s[+l.text-1]);else throw new oe("Not a valid argument number",l)}}}return this.pushTokens(a),a.length}expandAfterFuture(){return this.expandOnce(),this.future()}expandNextToken(){for(;;)if(this.expandOnce()===!1){var e=this.stack.pop();return e.treatAsRelax&&(e.text="\\relax"),e}}expandMacro(e){return this.macros.has(e)?this.expandTokens([new dn(e)]):void 0}expandTokens(e){var t=[],n=this.stack.length;for(this.pushTokens(e);this.stack.length>n;)if(this.expandOnce(!0)===!1){var r=this.stack.pop();r.treatAsRelax&&(r.noexpand=!1,r.treatAsRelax=!1),t.push(r)}return this.countExpansion(t.length),t}expandMacroAsText(e){var t=this.expandMacro(e);return t&&t.map(n=>n.text).join("")}_getExpansion(e){var t=this.macros.get(e);if(t==null)return t;if(e.length===1){var n=this.lexer.catcodes[e];if(n!=null&&n!==13)return}var r=typeof t=="function"?t(this):t;if(typeof r=="string"){var a=0;if(r.includes("#"))for(var s=r.replace(/##/g,"");s.includes("#"+(a+1));)++a;for(var o=new kc(r,this.settings),l=[],c=o.lex();c.text!=="EOF";)l.push(c),c=o.lex();l.reverse();var u={tokens:l,numArgs:a};return u}return r}isDefined(e){return this.macros.has(e)||xi.hasOwnProperty(e)||wt.math.hasOwnProperty(e)||wt.text.hasOwnProperty(e)||yh.hasOwnProperty(e)}isExpandable(e){var t=this.macros.get(e);return t!=null?typeof t=="string"||typeof t=="function"||!t.unexpandable:xi.hasOwnProperty(e)&&!xi[e].primitive}}var Bc=/^[₊₋₌₍₎₀₁₂₃₄₅₆₇₈₉ₐₑₕᵢⱼₖₗₘₙₒₚᵣₛₜᵤᵥₓᵦᵧᵨᵩᵪ]/,La=Object.freeze({"₊":"+","₋":"-","₌":"=","₍":"(","₎":")","₀":"0","₁":"1","₂":"2","₃":"3","₄":"4","₅":"5","₆":"6","₇":"7","₈":"8","₉":"9","ₐ":"a","ₑ":"e","ₕ":"h","ᵢ":"i","ⱼ":"j","ₖ":"k","ₗ":"l","ₘ":"m","ₙ":"n","ₒ":"o","ₚ":"p","ᵣ":"r","ₛ":"s","ₜ":"t","ᵤ":"u","ᵥ":"v","ₓ":"x","ᵦ":"β","ᵧ":"γ","ᵨ":"ρ","ᵩ":"ϕ","ᵪ":"χ","⁺":"+","⁻":"-","⁼":"=","⁽":"(","⁾":")","⁰":"0","¹":"1","²":"2","³":"3","⁴":"4","⁵":"5","⁶":"6","⁷":"7","⁸":"8","⁹":"9","ᴬ":"A","ᴮ":"B","ᴰ":"D","ᴱ":"E","ᴳ":"G","ᴴ":"H","ᴵ":"I","ᴶ":"J","ᴷ":"K","ᴸ":"L","ᴹ":"M","ᴺ":"N","ᴼ":"O","ᴾ":"P","ᴿ":"R","ᵀ":"T","ᵁ":"U","ⱽ":"V","ᵂ":"W","ᵃ":"a","ᵇ":"b","ᶜ":"c","ᵈ":"d","ᵉ":"e","ᶠ":"f","ᵍ":"g",ʰ:"h","ⁱ":"i",ʲ:"j","ᵏ":"k",ˡ:"l","ᵐ":"m",ⁿ:"n","ᵒ":"o","ᵖ":"p",ʳ:"r",ˢ:"s","ᵗ":"t","ᵘ":"u","ᵛ":"v",ʷ:"w",ˣ:"x",ʸ:"y","ᶻ":"z","ᵝ":"β","ᵞ":"γ","ᵟ":"δ","ᵠ":"ϕ","ᵡ":"χ","ᶿ":"θ"}),uo={"́":{text:"\\'",math:"\\acute"},"̀":{text:"\\`",math:"\\grave"},"̈":{text:'\\"',math:"\\ddot"},"̃":{text:"\\~",math:"\\tilde"},"̄":{text:"\\=",math:"\\bar"},"̆":{text:"\\u",math:"\\breve"},"̌":{text:"\\v",math:"\\check"},"̂":{text:"\\^",math:"\\hat"},"̇":{text:"\\.",math:"\\dot"},"̊":{text:"\\r",math:"\\mathring"},"̋":{text:"\\H"},"̧":{text:"\\c"}},Hc={á:"á",à:"à",ä:"ä",ǟ:"ǟ",ã:"ã",ā:"ā",ă:"ă",ắ:"ắ",ằ:"ằ",ẵ:"ẵ",ǎ:"ǎ",â:"â",ấ:"ấ",ầ:"ầ",ẫ:"ẫ",ȧ:"ȧ",ǡ:"ǡ",å:"å",ǻ:"ǻ",ḃ:"ḃ",ć:"ć",ḉ:"ḉ",č:"č",ĉ:"ĉ",ċ:"ċ",ç:"ç",ď:"ď",ḋ:"ḋ",ḑ:"ḑ",é:"é",è:"è",ë:"ë",ẽ:"ẽ",ē:"ē",ḗ:"ḗ",ḕ:"ḕ",ĕ:"ĕ",ḝ:"ḝ",ě:"ě",ê:"ê",ế:"ế",ề:"ề",ễ:"ễ",ė:"ė",ȩ:"ȩ",ḟ:"ḟ",ǵ:"ǵ",ḡ:"ḡ",ğ:"ğ",ǧ:"ǧ",ĝ:"ĝ",ġ:"ġ",ģ:"ģ",ḧ:"ḧ",ȟ:"ȟ",ĥ:"ĥ",ḣ:"ḣ",ḩ:"ḩ",í:"í",ì:"ì",ï:"ï",ḯ:"ḯ",ĩ:"ĩ",ī:"ī",ĭ:"ĭ",ǐ:"ǐ",î:"î",ǰ:"ǰ",ĵ:"ĵ",ḱ:"ḱ",ǩ:"ǩ",ķ:"ķ",ĺ:"ĺ",ľ:"ľ",ļ:"ļ",ḿ:"ḿ",ṁ:"ṁ",ń:"ń",ǹ:"ǹ",ñ:"ñ",ň:"ň",ṅ:"ṅ",ņ:"ņ",ó:"ó",ò:"ò",ö:"ö",ȫ:"ȫ",õ:"õ",ṍ:"ṍ",ṏ:"ṏ",ȭ:"ȭ",ō:"ō",ṓ:"ṓ",ṑ:"ṑ",ŏ:"ŏ",ǒ:"ǒ",ô:"ô",ố:"ố",ồ:"ồ",ỗ:"ỗ",ȯ:"ȯ",ȱ:"ȱ",ő:"ő",ṕ:"ṕ",ṗ:"ṗ",ŕ:"ŕ",ř:"ř",ṙ:"ṙ",ŗ:"ŗ",ś:"ś",ṥ:"ṥ",š:"š",ṧ:"ṧ",ŝ:"ŝ",ṡ:"ṡ",ş:"ş",ẗ:"ẗ",ť:"ť",ṫ:"ṫ",ţ:"ţ",ú:"ú",ù:"ù",ü:"ü",ǘ:"ǘ",ǜ:"ǜ",ǖ:"ǖ",ǚ:"ǚ",ũ:"ũ",ṹ:"ṹ",ū:"ū",ṻ:"ṻ",ŭ:"ŭ",ǔ:"ǔ",û:"û",ů:"ů",ű:"ű",ṽ:"ṽ",ẃ:"ẃ",ẁ:"ẁ",ẅ:"ẅ",ŵ:"ŵ",ẇ:"ẇ",ẘ:"ẘ",ẍ:"ẍ",ẋ:"ẋ",ý:"ý",ỳ:"ỳ",ÿ:"ÿ",ỹ:"ỹ",ȳ:"ȳ",ŷ:"ŷ",ẏ:"ẏ",ẙ:"ẙ",ź:"ź",ž:"ž",ẑ:"ẑ",ż:"ż",Á:"Á",À:"À",Ä:"Ä",Ǟ:"Ǟ",Ã:"Ã",Ā:"Ā",Ă:"Ă",Ắ:"Ắ",Ằ:"Ằ",Ẵ:"Ẵ",Ǎ:"Ǎ",Â:"Â",Ấ:"Ấ",Ầ:"Ầ",Ẫ:"Ẫ",Ȧ:"Ȧ",Ǡ:"Ǡ",Å:"Å",Ǻ:"Ǻ",Ḃ:"Ḃ",Ć:"Ć",Ḉ:"Ḉ",Č:"Č",Ĉ:"Ĉ",Ċ:"Ċ",Ç:"Ç",Ď:"Ď",Ḋ:"Ḋ",Ḑ:"Ḑ",É:"É",È:"È",Ë:"Ë",Ẽ:"Ẽ",Ē:"Ē",Ḗ:"Ḗ",Ḕ:"Ḕ",Ĕ:"Ĕ",Ḝ:"Ḝ",Ě:"Ě",Ê:"Ê",Ế:"Ế",Ề:"Ề",Ễ:"Ễ",Ė:"Ė",Ȩ:"Ȩ",Ḟ:"Ḟ",Ǵ:"Ǵ",Ḡ:"Ḡ",Ğ:"Ğ",Ǧ:"Ǧ",Ĝ:"Ĝ",Ġ:"Ġ",Ģ:"Ģ",Ḧ:"Ḧ",Ȟ:"Ȟ",Ĥ:"Ĥ",Ḣ:"Ḣ",Ḩ:"Ḩ",Í:"Í",Ì:"Ì",Ï:"Ï",Ḯ:"Ḯ",Ĩ:"Ĩ",Ī:"Ī",Ĭ:"Ĭ",Ǐ:"Ǐ",Î:"Î",İ:"İ",Ĵ:"Ĵ",Ḱ:"Ḱ",Ǩ:"Ǩ",Ķ:"Ķ",Ĺ:"Ĺ",Ľ:"Ľ",Ļ:"Ļ",Ḿ:"Ḿ",Ṁ:"Ṁ",Ń:"Ń",Ǹ:"Ǹ",Ñ:"Ñ",Ň:"Ň",Ṅ:"Ṅ",Ņ:"Ņ",Ó:"Ó",Ò:"Ò",Ö:"Ö",Ȫ:"Ȫ",Õ:"Õ",Ṍ:"Ṍ",Ṏ:"Ṏ",Ȭ:"Ȭ",Ō:"Ō",Ṓ:"Ṓ",Ṑ:"Ṑ",Ŏ:"Ŏ",Ǒ:"Ǒ",Ô:"Ô",Ố:"Ố",Ồ:"Ồ",Ỗ:"Ỗ",Ȯ:"Ȯ",Ȱ:"Ȱ",Ő:"Ő",Ṕ:"Ṕ",Ṗ:"Ṗ",Ŕ:"Ŕ",Ř:"Ř",Ṙ:"Ṙ",Ŗ:"Ŗ",Ś:"Ś",Ṥ:"Ṥ",Š:"Š",Ṧ:"Ṧ",Ŝ:"Ŝ",Ṡ:"Ṡ",Ş:"Ş",Ť:"Ť",Ṫ:"Ṫ",Ţ:"Ţ",Ú:"Ú",Ù:"Ù",Ü:"Ü",Ǘ:"Ǘ",Ǜ:"Ǜ",Ǖ:"Ǖ",Ǚ:"Ǚ",Ũ:"Ũ",Ṹ:"Ṹ",Ū:"Ū",Ṻ:"Ṻ",Ŭ:"Ŭ",Ǔ:"Ǔ",Û:"Û",Ů:"Ů",Ű:"Ű",Ṽ:"Ṽ",Ẃ:"Ẃ",Ẁ:"Ẁ",Ẅ:"Ẅ",Ŵ:"Ŵ",Ẇ:"Ẇ",Ẍ:"Ẍ",Ẋ:"Ẋ",Ý:"Ý",Ỳ:"Ỳ",Ÿ:"Ÿ",Ỹ:"Ỹ",Ȳ:"Ȳ",Ŷ:"Ŷ",Ẏ:"Ẏ",Ź:"Ź",Ž:"Ž",Ẑ:"Ẑ",Ż:"Ż",ά:"ά",ὰ:"ὰ",ᾱ:"ᾱ",ᾰ:"ᾰ",έ:"έ",ὲ:"ὲ",ή:"ή",ὴ:"ὴ",ί:"ί",ὶ:"ὶ",ϊ:"ϊ",ΐ:"ΐ",ῒ:"ῒ",ῑ:"ῑ",ῐ:"ῐ",ό:"ό",ὸ:"ὸ",ύ:"ύ",ὺ:"ὺ",ϋ:"ϋ",ΰ:"ΰ",ῢ:"ῢ",ῡ:"ῡ",ῠ:"ῠ",ώ:"ώ",ὼ:"ὼ",Ύ:"Ύ",Ὺ:"Ὺ",Ϋ:"Ϋ",Ῡ:"Ῡ",Ῠ:"Ῠ",Ώ:"Ώ",Ὼ:"Ὼ"};class ms{constructor(e,t){this.mode=void 0,this.gullet=void 0,this.settings=void 0,this.leftrightDepth=void 0,this.nextToken=void 0,this.mode="math",this.gullet=new T2(e,t,this.mode),this.settings=t,this.leftrightDepth=0,this.nextToken=null}expect(e,t){if(t===void 0&&(t=!0),this.fetch().text!==e)throw new oe("Expected '"+e+"', got '"+this.fetch().text+"'",this.fetch());t&&this.consume()}consume(){this.nextToken=null}fetch(){return this.nextToken==null&&(this.nextToken=this.gullet.expandNextToken()),this.nextToken}switchMode(e){this.mode=e,this.gullet.switchMode(e)}parse(){this.settings.globalGroup||this.gullet.beginGroup(),this.settings.colorIsTextColor&&this.gullet.macros.set("\\color","\\textcolor");try{var e=this.parseExpression(!1);return this.expect("EOF"),this.settings.globalGroup||this.gullet.endGroup(),e}finally{this.gullet.endGroups()}}subparse(e){var t=this.nextToken;this.consume(),this.gullet.pushToken(new dn("}")),this.gullet.pushTokens(e);var n=this.parseExpression(!1);return this.expect("}"),this.nextToken=t,n}parseExpression(e,t){for(var n=[];;){this.mode==="math"&&this.consumeSpaces();var r=this.fetch();if(ms.endOfExpression.has(r.text)||t&&r.text===t||e&&xi[r.text]&&xi[r.text].infix)break;var a=this.parseAtom(t);if(a){if(a.type==="internal")continue}else break;n.push(a)}return this.mode==="text"&&this.formLigatures(n),this.handleInfixNodes(n)}handleInfixNodes(e){for(var t=-1,n,r=0;r<e.length;r++){var a=e[r];if(a.type==="infix"){if(t!==-1)throw new oe("only one infix operator per group",a.token);t=r,n=a.replaceWith}}if(t!==-1&&n){var s,o,l=e.slice(0,t),c=e.slice(t+1);l.length===1&&l[0].type==="ordgroup"?s=l[0]:s={type:"ordgroup",mode:this.mode,body:l},c.length===1&&c[0].type==="ordgroup"?o=c[0]:o={type:"ordgroup",mode:this.mode,body:c};var u;return n==="\\\\abovefrac"?u=this.callFunction(n,[s,e[t],o],[]):u=this.callFunction(n,[s,o],[]),[u]}else return e}handleSupSubscript(e){var t=this.fetch(),n=t.text;this.consume(),this.consumeSpaces();var r;do{var a;r=this.parseGroup(e)}while(((a=r)==null?void 0:a.type)==="internal");if(!r)throw new oe("Expected group after '"+n+"'",t);return r}formatUnsupportedCmd(e){for(var t=[],n=0;n<e.length;n++)t.push({type:"textord",mode:"text",text:e[n]});var r={type:"text",mode:this.mode,body:t},a={type:"color",mode:this.mode,color:this.settings.errorColor,body:[r]};return a}parseAtom(e){var t=this.parseGroup("atom",e);if((t==null?void 0:t.type)==="internal"||this.mode==="text")return t;for(var n,r;;){this.consumeSpaces();var a=this.fetch();if(a.text==="\\limits"||a.text==="\\nolimits"){if(t&&t.type==="op"){var s=a.text==="\\limits";t.limits=s,t.alwaysHandleSupSub=!0}else if(t&&t.type==="operatorname")t.alwaysHandleSupSub&&(t.limits=a.text==="\\limits");else throw new oe("Limit controls must follow a math operator",a);this.consume()}else if(a.text==="^"){if(n)throw new oe("Double superscript",a);n=this.handleSupSubscript("superscript")}else if(a.text==="_"){if(r)throw new oe("Double subscript",a);r=this.handleSupSubscript("subscript")}else if(a.text==="'"){if(n)throw new oe("Double superscript",a);var o={type:"textord",mode:this.mode,text:"\\prime"},l=[o];for(this.consume();this.fetch().text==="'";)l.push(o),this.consume();this.fetch().text==="^"&&l.push(this.handleSupSubscript("superscript")),n={type:"ordgroup",mode:this.mode,body:l}}else if(La[a.text]){var c=Bc.test(a.text),u=[];for(u.push(new dn(La[a.text])),this.consume();;){var h=this.fetch().text;if(!La[h]||Bc.test(h)!==c)break;u.unshift(new dn(La[h])),this.consume()}var f=this.subparse(u);c?r={type:"ordgroup",mode:"math",body:f}:n={type:"ordgroup",mode:"math",body:f}}else break}return n||r?{type:"supsub",mode:this.mode,base:t,sup:n,sub:r}:t}parseFunction(e,t){var n=this.fetch(),r=n.text,a=xi[r];if(!a)return null;if(this.consume(),t&&t!=="atom"&&!a.allowedInArgument)throw new oe("Got function '"+r+"' with no arguments"+(t?" as "+t:""),n);if(this.mode==="text"&&!a.allowedInText)throw new oe("Can't use function '"+r+"' in text mode",n);if(this.mode==="math"&&a.allowedInMath===!1)throw new oe("Can't use function '"+r+"' in math mode",n);var{args:s,optArgs:o}=this.parseArguments(r,a);return this.callFunction(r,s,o,n,e)}callFunction(e,t,n,r,a){var s={funcName:e,parser:this,token:r,breakOnTokenText:a},o=xi[e];if(o&&o.handler)return o.handler(s,t,n);throw new oe("No function handler for "+e)}parseArguments(e,t){var n=t.numArgs+t.numOptionalArgs;if(n===0)return{args:[],optArgs:[]};for(var r=[],a=[],s=0;s<n;s++){var o=t.argTypes&&t.argTypes[s],l=s<t.numOptionalArgs;("primitive"in t&&t.primitive&&o==null||t.type==="sqrt"&&s===1&&a[0]==null)&&(o="primitive");var c=this.parseGroupOfType("argument to '"+e+"'",o,l);if(l)a.push(c);else if(c!=null)r.push(c);else throw new oe("Null argument, please report this as a bug")}return{args:r,optArgs:a}}parseGroupOfType(e,t,n){switch(t){case"color":return this.parseColorGroup(n);case"size":return this.parseSizeGroup(n);case"url":return this.parseUrlGroup(n);case"math":case"text":return this.parseArgumentGroup(n,t);case"hbox":{var r=this.parseArgumentGroup(n,"text");return r!=null?{type:"styling",mode:r.mode,body:[r],style:"text",resetFont:!0}:null}case"raw":{var a=this.parseStringGroup("raw",n);return a!=null?{type:"raw",mode:"text",string:a.text}:null}case"primitive":{if(n)throw new oe("A primitive argument cannot be optional");var s=this.parseGroup(e);if(s==null)throw new oe("Expected group as "+e,this.fetch());return s}case"original":case null:case void 0:return this.parseArgumentGroup(n);default:throw new oe("Unknown group type as "+e,this.fetch())}}consumeSpaces(){for(;this.fetch().text===" ";)this.consume()}parseStringGroup(e,t){var n=this.gullet.scanArgument(t);if(n==null)return null;for(var r="",a;(a=this.fetch()).text!=="EOF";)r+=a.text,this.consume();return this.consume(),n.text=r,n}parseRegexGroup(e,t){for(var n=this.fetch(),r=n,a="",s;(s=this.fetch()).text!=="EOF"&&e.test(a+s.text);)r=s,a+=r.text,this.consume();if(a==="")throw new oe("Invalid "+t+": '"+n.text+"'",n);return n.range(r,a)}parseColorGroup(e){var t=this.parseStringGroup("color",e);if(t==null)return null;var n=/^(#[a-f0-9]{3,4}|#[a-f0-9]{6}|#[a-f0-9]{8}|[a-f0-9]{6}|[a-z]+)$/i.exec(t.text);if(!n)throw new oe("Invalid color: '"+t.text+"'",t);var r=n[0];return/^[0-9a-f]{6}$/i.test(r)&&(r="#"+r),{type:"color-token",mode:this.mode,color:r}}parseSizeGroup(e){var t,n=!1;if(this.gullet.consumeSpaces(),!e&&this.gullet.future().text!=="{"?t=this.parseRegexGroup(/^[-+]? *(?:$|\d+|\d+\.\d*|\.\d*) *[a-z]{0,2} *$/,"size"):t=this.parseStringGroup("size",e),!t)return null;!e&&t.text.length===0&&(t.text="0pt",n=!0);var r=/([-+]?) *(\d+(?:\.\d*)?|\.\d+) *([a-z]{2})/.exec(t.text);if(!r)throw new oe("Invalid size: '"+t.text+"'",t);var a={number:+(r[1]+r[2]),unit:r[3]};if(!Au(a))throw new oe("Invalid unit: '"+a.unit+"'",t);return{type:"size",mode:this.mode,value:a,isBlank:n}}parseUrlGroup(e){this.gullet.lexer.setCatcode("%",13),this.gullet.lexer.setCatcode("~",12);var t=this.parseStringGroup("url",e);if(this.gullet.lexer.setCatcode("%",14),this.gullet.lexer.setCatcode("~",13),t==null)return null;var n=t.text.replace(/\\([#$%&~_^{}])/g,"$1");return{type:"url",mode:this.mode,url:n}}parseArgumentGroup(e,t){var n=this.gullet.scanArgument(e);if(n==null)return null;var r=this.mode;t&&this.switchMode(t),this.gullet.beginGroup();var a=this.parseExpression(!1,"EOF");this.expect("EOF"),this.gullet.endGroup();var s={type:"ordgroup",mode:this.mode,loc:n.loc,body:a};return t&&this.switchMode(r),s}parseGroup(e,t){var n=this.fetch(),r=n.text,a;if(r==="{"||r==="\\begingroup"){this.consume();var s=r==="{"?"}":"\\endgroup";this.gullet.beginGroup();var o=this.parseExpression(!1,s),l=this.fetch();this.expect(s),this.gullet.endGroup(),a={type:"ordgroup",mode:this.mode,loc:rn.range(n,l),body:o,semisimple:r==="\\begingroup"||void 0}}else if(a=this.parseFunction(t,e)||this.parseSymbol(),a==null&&r[0]==="\\"&&!yh.hasOwnProperty(r)){if(this.settings.throwOnError)throw new oe("Undefined control sequence: "+r,n);a=this.formatUnsupportedCmd(r),this.consume()}return a}formLigatures(e){for(var t=e.length-1,n=0;n<t;++n){var r=e[n];if(r.type==="textord"){var a=r.text,s=e[n+1];if(!(!s||s.type!=="textord")){if(a==="-"&&s.text==="-"){var o=e[n+2];n+1<t&&o&&o.type==="textord"&&o.text==="-"?(e.splice(n,3,{type:"textord",mode:"text",loc:rn.range(r,o),text:"---"}),t-=2):(e.splice(n,2,{type:"textord",mode:"text",loc:rn.range(r,s),text:"--"}),t-=1)}(a==="'"||a==="`")&&s.text===a&&(e.splice(n,2,{type:"textord",mode:"text",loc:rn.range(r,s),text:a+a}),t-=1)}}}}parseSymbol(){var e=this.fetch(),t=e.text;if(/^\\verb[^a-zA-Z]/.test(t)){this.consume();var n=t.slice(5),r=n.charAt(0)==="*";if(r&&(n=n.slice(1)),n.length<2||n.charAt(0)!==n.slice(-1))throw new oe(`\\verb assertion failed --
                    please report what input caused this bug`);return n=n.slice(1,-1),{type:"verb",mode:"text",body:n,star:r}}Hc.hasOwnProperty(t[0])&&!wt[this.mode][t[0]]&&(this.settings.strict&&this.mode==="math"&&this.settings.reportNonstrict("unicodeTextInMathMode",'Accented Unicode text character "'+t[0]+'" used in math mode',e),t=Hc[t[0]]+t.slice(1));var a=_2.exec(t);a&&(t=t.substring(0,a.index),t==="i"?t="ı":t==="j"&&(t="ȷ"));var s;if(wt[this.mode][t]){this.settings.strict&&this.mode==="math"&&a0.includes(t)&&this.settings.reportNonstrict("unicodeTextInMathMode",'Latin-1/Unicode text character "'+t[0]+'" used in math mode',e);var o=wt[this.mode][t].group,l=rn.range(e),c;Hg(o)?c={type:"atom",mode:this.mode,family:o,loc:l,text:t}:c={type:o,mode:this.mode,loc:l,text:t},s=c}else if(t.charCodeAt(0)>=128)this.settings.strict&&(Eu(t.charCodeAt(0))?this.mode==="math"&&this.settings.reportNonstrict("unicodeTextInMathMode",'Unicode text character "'+t[0]+'" used in math mode',e):this.settings.reportNonstrict("unknownSymbol",'Unrecognized Unicode character "'+t[0]+'"'+(" ("+t.charCodeAt(0)+")"),e)),s={type:"textord",mode:"text",loc:rn.range(e),text:t};else return null;if(this.consume(),a)for(var u=0;u<a[0].length;u++){var h=a[0][u];if(!uo[h])throw new oe("Unknown accent ' "+h+"'",e);var f=uo[h][this.mode]||uo[h].text;if(!f)throw new oe("Accent "+h+" unsupported in "+this.mode+" mode",e);s={type:"accent",mode:this.mode,loc:rn.range(e),label:f,isStretchy:!1,isShifty:!0,base:s}}return s}}ms.endOfExpression=new Set(["}","\\endgroup","\\end","\\right","&"]);var G0=function(e,t){if(!(typeof e=="string"||e instanceof String))throw new TypeError("KaTeX can only parse string typed expression");var n=new ms(e,t);delete n.gullet.macros.current["\\df@tag"];var r=n.parse();if(delete n.gullet.macros.current["\\current@color"],delete n.gullet.macros.current["\\color"],n.gullet.macros.get("\\df@tag")){if(!t.displayMode)throw new oe("\\tag works only in display equations");r=[{type:"tag",mode:"text",body:r,tag:n.subparse([new dn("\\df@tag")])}]}return r},_h=function(e,t,n){t.textContent="";var r=W0(e,n).toNode();t.appendChild(r)};typeof document<"u"&&document.compatMode!=="CSS1Compat"&&(typeof console<"u"&&console.warn("Warning: KaTeX doesn't work in quirks mode. Make sure your website has a suitable doctype."),_h=function(){throw new oe("KaTeX doesn't work in quirks mode.")});var E2=function(e,t){var n=W0(e,t).toMarkup();return n},A2=function(e,t){var n=new R0(t);return G0(e,n)},bh=function(e,t,n){if(n.throwOnError||!(e instanceof oe))throw e;var r=se(["katex-error"],[new fn(t)]);return r.setAttribute("title",e.toString()),r.setAttribute("style","color:"+n.errorColor),r},W0=function(e,t){var n=new R0(t);try{var r=G0(e,n);return Lg(r,e,n)}catch(a){return bh(a,e,n)}},C2=function(e,t){var n=new R0(t);try{var r=G0(e,n);return Fg(r,e,n)}catch(a){return bh(a,e,n)}},R2="0.16.47",P2={Span:Rr,Anchor:is,SymbolNode:fn,SvgNode:ii,PathNode:Ti,LineNode:r0},D2={version:R2,render:_h,renderToString:E2,ParseError:oe,SETTINGS_SCHEMA:t0,__parse:A2,__renderToDomTree:W0,__renderToHTMLTree:C2,__setFontMetrics:pg,__defineSymbol:d,__defineFunction:be,__defineMacro:M,__domTree:P2};function bi(i,e,t=!0){const n=typeof i=="string"?document.getElementById(i):i;if(n)try{D2.render(e,n,{displayMode:t,throwOnError:!1})}catch(r){n.textContent=e,console.error("KaTeX render error:",r)}}class I2{constructor(e){this.container=e,this.render()}render(){this.container.innerHTML=`
      <div class="studio-container">
        <div class="studio-header">
          <h3>Objectives One & Five: Cascade Architecture, P&ID & Block Diagrams</h3>
          <p class="studio-subtext">
            Explore authentic ISA 5.1 instrumentation symbology, trace inner vs outer feedback loops, and understand the mathematical block transfer functions of cascade systems.
          </p>
        </div>

        <div class="studio-grid">
          <!-- 1. Authentic ISA P&ID Diagram -->
          <div class="card diagram-card">
            <h4>1. P&ID Schematic of Cascade Scheme (ILM Fig 44)</h4>
            <div class="diagram-wrap">
              <svg viewBox="0 0 700 420" width="100%" xmlns="http://www.w3.org/2000/svg">
                <!-- Background grid lines -->
                <defs>
                  <linearGradient id="pipeSteamGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stop-color="#38bdf8"/>
                    <stop offset="100%" stop-color="#0284c7"/>
                  </linearGradient>
                  <linearGradient id="exchangerGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stop-color="#334155"/>
                    <stop offset="100%" stop-color="#1e293b"/>
                  </linearGradient>
                </defs>

                <!-- Process Piping -->
                <!-- Cold Oil Inlet -->
                <path d="M 60 300 L 220 300" stroke="#64748b" stroke-width="6" fill="none"/>
                <text x="70" y="290" fill="#94a3b8" font-size="12" font-family="'JetBrains Mono', monospace">Cold Oil Feed</text>

                <!-- Heat Exchanger Shell -->
                <rect x="220" y="220" width="220" height="150" rx="12" fill="url(#exchangerGrad)" stroke="#64748b" stroke-width="3"/>
                <!-- Tubes inside exchanger -->
                <line x1="230" y1="260" x2="430" y2="260" stroke="#f59e0b" stroke-width="3"/>
                <line x1="230" y1="285" x2="430" y2="285" stroke="#f59e0b" stroke-width="3"/>
                <line x1="230" y1="310" x2="430" y2="310" stroke="#f59e0b" stroke-width="3"/>
                <line x1="230" y1="335" x2="430" y2="335" stroke="#f59e0b" stroke-width="3"/>
                <text x="250" y="245" fill="#e2e8f0" font-weight="bold" font-size="14" font-family="'Outfit', sans-serif">Heat Exchanger (E-101)</text>

                <!-- Hot Oil Outlet -->
                <path d="M 440 300 L 620 300" stroke="#ef4444" stroke-width="6" fill="none"/>
                <text x="510" y="290" fill="#f87171" font-size="12" font-family="'JetBrains Mono', monospace">Hot Oil Out (PV1)</text>

                <!-- Steam Supply Line -->
                <path d="M 330 40 L 330 220" stroke="url(#pipeSteamGrad)" stroke-width="6" fill="none"/>
                <text x="345" y="60" fill="#38bdf8" font-size="12" font-family="'JetBrains Mono', monospace">Steam Header (P_steam)</text>

                <!-- Control Valve (FV-101 / FCE) -->
                <g transform="translate(330, 140)">
                  <!-- Diaphragm Dome -->
                  <path d="M -22 -28 A 22 22 0 0 1 22 -28 Z" fill="#0284c7" stroke="#38bdf8" stroke-width="2"/>
                  <!-- Yoke & Stem -->
                  <line x1="0" y1="-28" x2="0" y2="0" stroke="#cbd5e1" stroke-width="3"/>
                  <!-- Valve Body Hourglass -->
                  <polygon points="-16,-12 16,12 16,-12 -16,12" fill="#0f766e" stroke="#14b8a6" stroke-width="2"/>
                  <text x="25" y="-10" fill="#38bdf8" font-size="11" font-family="'JetBrains Mono', monospace">FC (ATO)</text>
                </g>

                <!-- Condensate Drain -->
                <path d="M 330 370 L 330 405" stroke="#64748b" stroke-width="4" fill="none"/>
                <text x="345" y="400" fill="#94a3b8" font-size="11" font-family="'JetBrains Mono', monospace">Condensate</text>

                <!-- ISA INSTRUMENT BUBBLES -->
                <!-- FT-101 (Flow Transmitter) -->
                <g transform="translate(330, 85)">
                  <circle cx="0" cy="0" r="22" fill="#0b1120" stroke="#06b6d4" stroke-width="2"/>
                  <line x1="-22" y1="0" x2="22" y2="0" stroke="#06b6d4" stroke-width="1.5"/>
                  <text x="0" y="-4" fill="#06b6d4" font-size="11" font-weight="bold" text-anchor="middle">FT</text>
                  <text x="0" y="14" fill="#94a3b8" font-size="10" text-anchor="middle">101</text>
                </g>

                <!-- FIC-101 (Secondary Controller) -->
                <g transform="translate(200, 85)">
                  <circle cx="0" cy="0" r="24" fill="#0b1120" stroke="#f59e0b" stroke-width="2"/>
                  <line x1="-24" y1="0" x2="24" y2="0" stroke="#f59e0b" stroke-width="1.5"/>
                  <text x="0" y="-4" fill="#f59e0b" font-size="11" font-weight="bold" text-anchor="middle">FIC</text>
                  <text x="0" y="14" fill="#94a3b8" font-size="10" text-anchor="middle">101</text>
                </g>

                <!-- TT-101 (Temperature Transmitter) -->
                <g transform="translate(530, 300)">
                  <circle cx="0" cy="0" r="22" fill="#0b1120" stroke="#06b6d4" stroke-width="2"/>
                  <line x1="-22" y1="0" x2="22" y2="0" stroke="#06b6d4" stroke-width="1.5"/>
                  <text x="0" y="-4" fill="#06b6d4" font-size="11" font-weight="bold" text-anchor="middle">TT</text>
                  <text x="0" y="14" fill="#94a3b8" font-size="10" text-anchor="middle">101</text>
                </g>

                <!-- TIC-101 (Primary Master Controller) -->
                <g transform="translate(70, 85)">
                  <circle cx="0" cy="0" r="24" fill="#0b1120" stroke="#38bdf8" stroke-width="2"/>
                  <line x1="-24" y1="0" x2="24" y2="0" stroke="#38bdf8" stroke-width="1.5"/>
                  <text x="0" y="-4" fill="#38bdf8" font-size="11" font-weight="bold" text-anchor="middle">TIC</text>
                  <text x="0" y="14" fill="#94a3b8" font-size="10" text-anchor="middle">101</text>
                </g>

                <!-- SIGNAL LINES -->
                <!-- FT-101 to FIC-101 (dashed electrical signal) -->
                <path d="M 308 85 L 224 85" stroke="#06b6d4" stroke-dasharray="4,4" stroke-width="2"/>
                <!-- TIC-101 to FIC-101 (Remote Setpoint RSP) -->
                <path d="M 94 85 L 176 85" stroke="#38bdf8" stroke-dasharray="4,4" stroke-width="2"/>
                <polygon points="176,85 168,81 168,89" fill="#38bdf8"/>
                <text x="135" y="75" fill="#38bdf8" font-size="11" font-weight="bold" text-anchor="middle">RSP</text>

                <!-- FIC-101 to Valve (Pneumatic signal line with hashes) -->
                <path d="M 200 110 L 200 140 L 314 140" stroke="#10b981" stroke-width="2" stroke-dasharray="8,2" fill="none"/>
                <!-- TT-101 up and over to TIC-101 -->
                <path d="M 530 278 L 530 18 L 70 18 L 70 61" stroke="#ef4444" stroke-dasharray="4,4" stroke-width="2" fill="none"/>
                <polygon points="70,61 66,53 74,53" fill="#ef4444"/>
                <text x="280" y="14" fill="#f87171" font-size="11" text-anchor="middle">Primary PV (Temp Feedback)</text>
              </svg>
            </div>
          </div>

          <!-- 2. Transfer Function Mathematics Card -->
          <div class="card math-card">
            <h4>2. Closed-Loop Disturbance Transfer Function</h4>
            <div id="formula-tf-box" class="math-display"></div>
            <p class="formula-description">
              In conventional control, load disturbance <strong>D₂ (steam header pressure drop)</strong> directly impacts the process. Under cascade control, the inner loop transfer function divides the disturbance by <strong>(1 + G_c2 · G_p2)</strong>, eliminating its impact before it can upset the product temperature!
            </p>

            <div class="kpi-grid">
              <div class="kpi-box highlight">
                <span class="kpi-label">Inner Loop Disturbance Attenuation</span>
                <span class="kpi-val" id="kpi-tf-attenuation"></span>
                <span class="kpi-sub">Reduces disturbance effect before reaching primary process</span>
              </div>
              <div class="kpi-box success">
                <span class="kpi-label">Effective Inner Loop Dynamics</span>
                <span class="kpi-val" id="kpi-tf-inner"></span>
                <span class="kpi-sub">Acts as a fast linear actuator to the primary controller</span>
              </div>
            </div>

            <div class="ilm-rule-alert">
              <strong>Figure 46 Takeaway:</strong> The master controller TIC-101 perceives the entire slave loop as an idealized linear element with near-unity gain ($G_{inner} approx 1$). Valve non-linearities and stiction are completely isolated within the inner loop!
            </div>
          </div>
        </div>

        <!-- 3. Complete Block Diagram (ILM Fig 45 & Fig 46) -->
        <div class="card diagram-card">
          <h4>3. Complete Cascade Control Block Diagram (ILM Fig 45)</h4>
          <div class="diagram-wrap">
            <svg viewBox="0 0 850 300" width="100%" xmlns="http://www.w3.org/2000/svg">
              <!-- Outer Loop Boundary -->
              <rect x="10" y="10" width="830" height="280" rx="10" fill="none" stroke="#334155" stroke-dasharray="6,6" stroke-width="1.5"/>
              <text x="25" y="30" fill="#94a3b8" font-size="12" font-family="'Outfit', sans-serif">OUTER LOOP (PRIMARY: REBOILER TEMPERATURE)</text>

              <!-- Inner Loop Boundary -->
              <rect x="230" y="45" width="370" height="190" rx="8" fill="rgba(6, 182, 212, 0.04)" stroke="#06b6d4" stroke-dasharray="4,4" stroke-width="1.5"/>
              <text x="245" y="65" fill="#06b6d4" font-size="11" font-family="'Outfit', sans-serif">INNER LOOP (SECONDARY: STEAM FLOW)</text>

              <!-- SP1 Input -->
              <path d="M 25 110 L 60 110" stroke="#f8fafc" stroke-width="2"/>
              <polygon points="60,110 52,106 52,114" fill="#f8fafc"/>
              <text x="25" y="100" fill="#f8fafc" font-size="12" font-family="'JetBrains Mono', monospace">SP1</text>

              <!-- Summing Junction 1 -->
              <circle cx="75" cy="110" r="14" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/>
              <text x="75" y="114" fill="#38bdf8" font-size="14" text-anchor="middle">+</text>

              <!-- Primary Controller TIC-101 -->
              <path d="M 89 110 L 115 110" stroke="#38bdf8" stroke-width="2"/>
              <rect x="115" y="85" width="80" height="50" rx="4" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>
              <text x="155" y="107" fill="#fff" font-size="11" font-weight="bold" text-anchor="middle">TIC-101</text>
              <text x="155" y="123" fill="#94a3b8" font-size="9" text-anchor="middle">G_c1(s)</text>

              <!-- RSP Arrow into Summing Junction 2 -->
              <path d="M 195 110 L 255 110" stroke="#38bdf8" stroke-width="2"/>
              <polygon points="255,110 247,106 247,114" fill="#38bdf8"/>
              <text x="225" y="102" fill="#38bdf8" font-size="11" font-weight="bold" text-anchor="middle">RSP</text>

              <!-- Summing Junction 2 -->
              <circle cx="270" cy="110" r="14" fill="#0f172a" stroke="#f59e0b" stroke-width="2"/>
              <text x="270" y="114" fill="#f59e0b" font-size="14" text-anchor="middle">+</text>

              <!-- Secondary Controller FIC-101 -->
              <path d="M 284 110 L 310 110" stroke="#f59e0b" stroke-width="2"/>
              <rect x="310" y="85" width="80" height="50" rx="4" fill="#1e293b" stroke="#f59e0b" stroke-width="2"/>
              <text x="350" y="107" fill="#fff" font-size="11" font-weight="bold" text-anchor="middle">FIC-101</text>
              <text x="350" y="123" fill="#94a3b8" font-size="9" text-anchor="middle">G_c2(s)</text>

              <!-- Valve & Flow Process (Inner Process) -->
              <path d="M 390 110 L 420 110" stroke="#10b981" stroke-width="2"/>
              <rect x="420" y="85" width="90" height="50" rx="4" fill="#1e293b" stroke="#10b981" stroke-width="2"/>
              <text x="465" y="107" fill="#fff" font-size="11" font-weight="bold" text-anchor="middle">Valve & Flow</text>
              <text x="465" y="123" fill="#94a3b8" font-size="9" text-anchor="middle">G_p2(s)</text>

              <!-- Steam Header Disturbance D2 Arrow -->
              <path d="M 465 30 L 465 75" stroke="#ef4444" stroke-width="2"/>
              <polygon points="465,75 461,67 469,67" fill="#ef4444"/>
              <text x="475" y="45" fill="#ef4444" font-size="10" font-weight="bold">Disturbance D2 (Steam Press)</text>

              <!-- Inner Feedback Loop -->
              <path d="M 510 110 L 540 110 L 540 190 L 270 190 L 270 124" stroke="#f59e0b" stroke-width="2" fill="none"/>
              <polygon points="270,124 266,132 274,132" fill="#f59e0b"/>
              <text x="410" y="182" fill="#f59e0b" font-size="10" text-anchor="middle">Secondary PV2 (Steam Flow)</text>

              <!-- Primary Process (Reboiler Heat Transfer) -->
              <path d="M 540 110 L 640 110" stroke="#06b6d4" stroke-width="2"/>
              <polygon points="640,110 632,106 632,114" fill="#06b6d4"/>
              <rect x="640" y="85" width="100" height="50" rx="4" fill="#1e293b" stroke="#06b6d4" stroke-width="2"/>
              <text x="690" y="107" fill="#fff" font-size="11" font-weight="bold" text-anchor="middle">Column Temp</text>
              <text x="690" y="123" fill="#94a3b8" font-size="9" text-anchor="middle">G_p1(s)</text>

              <!-- Feed Flow Disturbance D1 Arrow -->
              <path d="M 690 30 L 690 75" stroke="#a855f7" stroke-width="2"/>
              <polygon points="690,75 686,67 694,67" fill="#a855f7"/>
              <text x="700" y="45" fill="#a855f7" font-size="10" font-weight="bold">Disturbance D1 (Feed Flow)</text>

              <!-- Primary PV Output -->
              <path d="M 740 110 L 800 110" stroke="#f8fafc" stroke-width="2"/>
              <polygon points="800,110 792,106 792,114" fill="#f8fafc"/>
              <text x="815" y="114" fill="#f8fafc" font-size="12" font-family="'JetBrains Mono', monospace">PV1</text>

              <!-- Outer Feedback Loop -->
              <path d="M 770 110 L 770 250 L 75 250 L 75 124" stroke="#38bdf8" stroke-width="2" fill="none"/>
              <polygon points="75,124 71,132 79,132" fill="#38bdf8"/>
              <text x="440" y="242" fill="#38bdf8" font-size="11" text-anchor="middle">Primary PV1 Feedback (Temperature TT-101)</text>
            </svg>
          </div>
        </div>
      </div>
    `,this.renderFormulas()}renderFormulas(){bi("formula-tf-box","\\frac{Y_1(s)}{D_2(s)} = \\frac{G_{p1}(s) \\cdot G_{p2}(s)}{1 + G_{c2}(s)G_{p2}(s) + G_{c1}(s)G_{c2}(s)G_{p2}(s)G_{p1}(s)}"),bi("kpi-tf-attenuation","\\frac{1}{1 + G_{c2}G_{p2}}",!1),bi("kpi-tf-inner","G_{inner}(s) \\approx 1.0",!1)}}class L2{constructor(e){this.container=e,this.tauP=8.8,this.Kp=1.7,this.Kc=2,this.tauOuter=26.4,this.render()}calculateEffectiveTau(){const e=1+Math.abs(this.Kc*this.Kp);return this.tauP/e}render(){const e=this.calculateEffectiveTau(),t=this.tauOuter/e;this.container.innerHTML=`
      <div class="studio-container">
        <div class="studio-header">
          <h3>Objective Three: Response Speed & Time Constant Reduction</h3>
          <p class="studio-subtext">
            Discover mathematically and graphically how closing the inner loop in automatic control dramatically shrinks its effective time constant, accelerating the entire process.
          </p>
        </div>

        <div class="studio-grid">
          <!-- Interactive Parameters Card -->
          <div class="card control-card">
            <h4>1. Adjust Inner Loop Parameters</h4>
            <div class="param-row">
              <label>Secondary Open-Loop Time Constant (τ_p):</label>
              <div class="slider-box">
                <input type="range" id="speed-tau-p" min="1.0" max="20.0" step="0.2" value="${this.tauP}">
                <span class="readout" id="speed-tau-p-val">${this.tauP.toFixed(1)} min</span>
              </div>
            </div>

            <div class="param-row">
              <label>Secondary Process Static Gain (K_p):</label>
              <div class="slider-box">
                <input type="range" id="speed-kp" min="0.5" max="5.0" step="0.1" value="${this.Kp}">
                <span class="readout" id="speed-kp-val">${this.Kp.toFixed(1)}</span>
              </div>
            </div>

            <div class="param-row">
              <label>Secondary Controller Proportional Gain (K_c):</label>
              <div class="slider-box">
                <input type="range" id="speed-kc" min="0.1" max="10.0" step="0.1" value="${this.Kc}">
                <span class="readout" id="speed-kc-val">${this.Kc.toFixed(1)}</span>
              </div>
            </div>

            <div class="param-row">
              <label>Outer (Primary) Loop Time Constant (τ_outer):</label>
              <div class="slider-box">
                <input type="range" id="speed-tau-outer" min="5.0" max="50.0" step="1.0" value="${this.tauOuter}">
                <span class="readout" id="speed-tau-outer-val">${this.tauOuter.toFixed(1)} min</span>
              </div>
            </div>

            <!-- ILM Case Study Presets -->
            <div class="preset-box">
              <span class="preset-label">ILM 310305e Case Studies:</span>
              <div class="preset-buttons">
                <button class="btn-preset" id="preset-furnace">Catalyst Furnace (p. 28)</button>
                <button class="btn-preset" id="preset-reboiler">Steam Reboiler (p. 10)</button>
                <button class="btn-preset" id="preset-fast-inner">Fast Inner Loop (10x)</button>
              </div>
            </div>
          </div>

          <!-- Mathematical Derivation Card -->
          <div class="card math-card">
            <h4>2. Closed-Loop Time Constant Derivation</h4>
            <div id="formula-cltc-box" class="math-display"></div>
            <div id="formula-cltc-calc" class="math-calc-display"></div>

            <div class="kpi-grid">
              <div class="kpi-box highlight">
                <span class="kpi-label">Effective Time Constant (τ_eff)</span>
                <span class="kpi-val" id="kpi-tau-eff">${e.toFixed(2)} min</span>
                <span class="kpi-sub" id="kpi-reduction-pct">${((this.tauP-e)/this.tauP*100).toFixed(0)}% Speedup</span>
              </div>

              <div class="kpi-box ${t>=3?"success":"warning"}">
                <span class="kpi-label">Speed Ratio (τ_outer / τ_eff)</span>
                <span class="kpi-val" id="kpi-speed-ratio">${t.toFixed(1)} : 1</span>
                <span class="kpi-sub" id="kpi-ratio-status">${t>=3?"Rule Met (≥ 3:1)":"Too Slow (< 3:1)"}</span>
              </div>
            </div>

            <div class="ilm-rule-alert">
              <strong>ILM Rule of Thumb (p. 9-10):</strong> The secondary loop must be at least <strong>3 to 5 times faster</strong> than the outer loop. This ensures the inner loop dampens load disturbances before the primary controlled variable is disturbed.
            </div>
          </div>
        </div>

        <!-- Dynamic Response Curve Comparison Plot -->
        <div class="card plot-card">
          <h4>3. Real-Time Dynamic Response Curve Comparison</h4>
          <canvas id="speed-canvas" height="260"></canvas>
          <div class="plot-legend">
            <span class="leg-item"><span class="dot open-dot"></span> Open-Loop Response ($	au_p = ${this.tauP.toFixed(1)} min)</span>
            <span class="leg-item"><span class="dot closed-dot"></span> Cascade Inner Loop Response ($	au_{eff} = ${e.toFixed(2)} min)</span>
            <span class="leg-item"><span class="dot target-dot"></span> Setpoint Step Target</span>
          </div>
        </div>
      </div>
    `,this.renderFormulas(),this.attachEvents(),this.drawResponseCurves()}renderFormulas(){bi("formula-cltc-box","\\tau_{eff} = \\text{CLTC} = \\frac{\\tau_p}{1 + |K_c K_p|}"),this.updateCalculatedFormula()}updateCalculatedFormula(){const e=this.calculateEffectiveTau();(this.Kc*this.Kp).toFixed(2);const t=(1+Math.abs(this.Kc*this.Kp)).toFixed(2);bi("formula-cltc-calc",`\\tau_{eff} = \\frac{${this.tauP.toFixed(1)}\\text{ min}}{1 + (${this.Kc.toFixed(1)} \\times ${this.Kp.toFixed(1)})} = \\frac{${this.tauP.toFixed(1)}}{${t}} = \\mathbf{${e.toFixed(2)}\\text{ min}}`)}attachEvents(){var t,n,r;const e=(a,s,o)=>{const l=document.getElementById(a),c=document.getElementById(`${a}-val`);l&&l.addEventListener("input",u=>{const h=parseFloat(u.target.value);this[s]=h,c&&(c.textContent=s.includes("tau")?`${h.toFixed(1)} min`:h.toFixed(1)),this.updateView()})};e("speed-tau-p","tauP"),e("speed-kp","Kp"),e("speed-kc","Kc"),e("speed-tau-outer","tauOuter"),(t=document.getElementById("preset-furnace"))==null||t.addEventListener("click",()=>{this.tauP=8.8,this.Kp=1.7,this.Kc=2,this.tauOuter=26.4,this.syncInputs()}),(n=document.getElementById("preset-reboiler"))==null||n.addEventListener("click",()=>{this.tauP=.5,this.Kp=1,this.Kc=2.5,this.tauOuter=4.5,this.syncInputs()}),(r=document.getElementById("preset-fast-inner"))==null||r.addEventListener("click",()=>{this.tauP=1.2,this.Kp=1,this.Kc=4,this.tauOuter=15,this.syncInputs()})}syncInputs(){const e=(t,n,r="")=>{const a=document.getElementById(t),s=document.getElementById(`${t}-val`);a&&(a.value=n),s&&(s.textContent=`${n.toFixed(1)}${r}`)};e("speed-tau-p",this.tauP," min"),e("speed-kp",this.Kp),e("speed-kc",this.Kc),e("speed-tau-outer",this.tauOuter," min"),this.updateView()}updateView(){const e=this.calculateEffectiveTau(),t=this.tauOuter/e,n=document.getElementById("kpi-tau-eff");n&&(n.textContent=`${e.toFixed(2)} min`);const r=document.getElementById("kpi-reduction-pct");r&&(r.textContent=`${((this.tauP-e)/this.tauP*100).toFixed(0)}% Speedup`);const a=document.getElementById("kpi-speed-ratio");a&&(a.textContent=`${t.toFixed(1)} : 1`);const s=document.getElementById("kpi-ratio-status");if(s){s.textContent=t>=3?"Rule Met (≥ 3:1)":"Too Slow (< 3:1)";const o=a.closest(".kpi-box");o&&(o.className=`kpi-box ${t>=3?"success":"warning"}`)}this.updateCalculatedFormula(),this.drawResponseCurves()}drawResponseCurves(){const e=document.getElementById("speed-canvas");if(!e)return;const t=e.getContext("2d"),n=e.getBoundingClientRect(),r=window.devicePixelRatio||1;e.width=n.width*r,e.height=n.height*r,t.resetTransform(),t.scale(r,r);const a=n.width,s=n.height,o=50,l=20,c=20,u=30,h=a-o-l,f=s-c-u;t.fillStyle="#0f172a",t.fillRect(0,0,a,s),t.fillStyle="#1e293b",t.fillRect(o,c,h,f),t.strokeStyle="#334155",t.fillStyle="#94a3b8",t.font='10px "JetBrains Mono", monospace',t.textAlign="right";for(let g=0;g<=4;g++){const p=g/4,A=c+f-p*f;t.beginPath(),t.moveTo(o,A),t.lineTo(o+h,A),t.stroke(),t.fillText(`${(p*100).toFixed(0)}%`,o-6,A+3)}const m=Math.max(10,this.tauP*3.5);t.textAlign="center";for(let g=0;g<=6;g++){const p=g/6,A=o+p*h,C=p*m;t.beginPath(),t.moveTo(A,c),t.lineTo(A,c+f),t.stroke(),t.fillText(`${C.toFixed(1)}m`,A,c+f+14)}t.strokeStyle="#64748b",t.setLineDash([4,4]),t.beginPath(),t.moveTo(o,c),t.lineTo(o+h,c),t.stroke(),t.setLineDash([]),t.strokeStyle="#f43f5e",t.lineWidth=2.5,t.beginPath();for(let g=0;g<=h;g++){const p=g/h*m,A=1-Math.exp(-p/this.tauP),C=c+f-A*f;g===0?t.moveTo(o+g,C):t.lineTo(o+g,C)}t.stroke();const x=this.calculateEffectiveTau();t.strokeStyle="#06b6d4",t.lineWidth=2.5,t.beginPath();for(let g=0;g<=h;g++){const p=g/h*m,A=1-Math.exp(-p/x),C=c+f-A*f;g===0?t.moveTo(o+g,C):t.lineTo(o+g,C)}t.stroke();const y=c+f-.632*f;t.strokeStyle="#eab308",t.setLineDash([2,4]),t.beginPath(),t.moveTo(o,y),t.lineTo(o+h,y),t.stroke(),t.setLineDash([]),t.fillStyle="#eab308",t.fillText("63.2% (1τ)",o+35,y-4)}}class F2{constructor(e,t){this.container=e,this.onInjectFault=t,this.imcTauP=2.7,this.imcTauD=2.3,this.imcKp=1,this.currentCase="NORMAL",this.score=0,this.attempts=0,this.render()}render(){this.container.innerHTML=`
      <div class="studio-container">
        <div class="studio-header">
          <h3>Objective Four: Tuning Methods, Non-Linearity & Fault Diagnostics</h3>
          <p class="studio-subtext">
            Master the inside-out tuning sequence, calculate controller settings via Ziegler-Nichols & IMC, and diagnose loop instability from industrial chart recordings.
          </p>
        </div>

        <!-- 1. The Inside-Out Tuning Sequence -->
        <div class="card workflow-card">
          <h4>1. Industrial Inside-Out Tuning Workflow (ILM p. 31, 57)</h4>
          <div class="steps-container">
            <div class="step-card">
              <div class="step-num">Step 1</div>
              <div class="step-title">Isolate Outer Loop</div>
              <div class="step-desc">Place primary controller (TIC-101) in <strong>Manual</strong> mode.</div>
            </div>
            <div class="step-card">
              <div class="step-num">Step 2</div>
              <div class="step-title">Tune Inner Controller</div>
              <div class="step-desc">Adjust secondary (FIC-101) to achieve <strong>Quarter Amplitude Decay (DR = 0.25)</strong> for setpoint changes. P-only is preferred.</div>
            </div>
            <div class="step-card">
              <div class="step-num">Step 3</div>
              <div class="step-title">Engage Cascade Mode</div>
              <div class="step-desc">Switch secondary controller to <strong>Cascade (Remote Setpoint RSP)</strong>.</div>
            </div>
            <div class="step-card">
              <div class="step-num">Step 4</div>
              <div class="step-title">Tune Outer Controller</div>
              <div class="step-desc">Tune primary controller with inner loop in automatic. Set T_i ≈ 3 × τ_eff or apply IMC/Z-N.</div>
            </div>
          </div>
        </div>

        <div class="studio-grid">
          <!-- 2. IMC & Ziegler-Nichols Calculator -->
          <div class="card math-card">
            <h4>2. IMC Tuning Parameter Calculator (ILM p. 43)</h4>
            <div id="formula-imc-box" class="math-display"></div>

            <div class="calc-inputs">
              <div class="param-row">
                <label>Primary Time Constant (τ_p):</label>
                <div class="slider-box">
                  <input type="range" id="imc-tau-p" min="0.5" max="10.0" step="0.1" value="${this.imcTauP}">
                  <span class="readout" id="imc-tau-p-val">${this.imcTauP.toFixed(1)} min</span>
                </div>
              </div>

              <div class="param-row">
                <label>Process Dead Time (τ_d):</label>
                <div class="slider-box">
                  <input type="range" id="imc-tau-d" min="0.2" max="6.0" step="0.1" value="${this.imcTauD}">
                  <span class="readout" id="imc-tau-d-val">${this.imcTauD.toFixed(1)} min</span>
                </div>
              </div>

              <div class="param-row">
                <label>Process Static Gain (K_p):</label>
                <div class="slider-box">
                  <input type="range" id="imc-kp" min="0.2" max="3.0" step="0.1" value="${this.imcKp}">
                  <span class="readout" id="imc-kp-val">${this.imcKp.toFixed(1)}</span>
                </div>
              </div>
            </div>

            <div id="formula-imc-result" class="math-calc-display"></div>

            <div class="kpi-grid">
              <div class="kpi-box highlight">
                <span class="kpi-label">Recommended Gain (K_c)</span>
                <span class="kpi-val" id="kpi-imc-kc">0.70</span>
              </div>
              <div class="kpi-box success">
                <span class="kpi-label">Integral Time (T_i)</span>
                <span class="kpi-val" id="kpi-imc-ti">2.70 min</span>
              </div>
            </div>
          </div>

          <!-- 3. Quarter Amplitude Decay Visualizer -->
          <div class="card plot-card">
            <h4>3. Quarter Amplitude Decay (DR = A2 / A1 = 0.25)</h4>
            <div id="formula-decay-box" class="math-display"></div>
            <canvas id="decay-canvas" height="180"></canvas>
            <div class="ilm-rule-alert">
              <strong>Tuning Objective (p. 31):</strong> Secondary controller should be tuned for 1/4 decay ratio. Fast response dampens disturbances with minimal overshoot.
            </div>
          </div>
        </div>

        <!-- 4. Interactive Fault Diagnostic Challenge -->
        <div class="card diagnostic-card">
          <div class="diag-header">
            <h4>4. Industrial Instability Diagnostic Simulator (ILM Fig 29 vs 30)</h4>
            <div class="score-badge">Score: <span id="diag-score">0</span> / <span id="diag-attempts">0</span></div>
          </div>
          <p class="diag-intro">
            Simulate an upset, observe the chart behavior, and diagnose which loop is improperly tuned!
          </p>

          <div class="diag-buttons">
            <button class="btn-action" id="btn-test-normal">Run Normal Loop</button>
            <button class="btn-action warn" id="btn-test-inner-unstable">Simulate Problem A (Fig 29)</button>
            <button class="btn-action danger" id="btn-test-outer-unstable">Simulate Problem B (Fig 30)</button>
          </div>

          <div class="diag-question-box" id="diag-box" style="display: none;">
            <div class="diag-prompt">
              <strong>Diagnostic Inspection:</strong> Examine the live strip chart recording above. What is the root cause?
            </div>
            <div class="diag-options">
              <button class="btn-diag-option" data-ans="INNER">Inner (Secondary) Loop Unstable</button>
              <button class="btn-diag-option" data-ans="OUTER">Outer (Primary) Loop Unstable</button>
              <button class="btn-diag-option" data-ans="NORMAL">Both Loops Operating Stably</button>
            </div>
            <div class="diag-feedback" id="diag-feedback"></div>
          </div>
        </div>
      </div>
    `,this.renderFormulas(),this.attachEvents(),this.drawDecayCurve(),this.updateIMCResults()}renderFormulas(){bi("formula-imc-box","K_c = \\frac{0.6 \\cdot \\tau_p}{K_p \\cdot \\tau_d}, \\quad T_i = \\tau_p"),bi("formula-decay-box","\\text{Decay Ratio (DR)} = \\frac{A_2}{A_1} = 0.25 = \\frac{1}{4}")}updateIMCResults(){const e=this.imcKp*this.imcTauD,t=e>0?.6*this.imcTauP/e:0,n=this.imcTauP;bi("formula-imc-result",`K_c = \\frac{0.6(${this.imcTauP.toFixed(1)})}{${this.imcKp.toFixed(1)}(${this.imcTauD.toFixed(1)})} = \\mathbf{${t.toFixed(2)}}, \\quad T_i = \\mathbf{${n.toFixed(2)}\\text{ min}}`);const r=document.getElementById("kpi-imc-kc"),a=document.getElementById("kpi-imc-ti");r&&(r.textContent=t.toFixed(2)),a&&(a.textContent=`${n.toFixed(2)} min`)}attachEvents(){var a,s,o;const e=(l,c,u)=>{const h=document.getElementById(l),f=document.getElementById(`${l}-val`);h&&h.addEventListener("input",m=>{const x=parseFloat(m.target.value);this[c]=x,f&&(f.textContent=c.includes("Tau")?`${x.toFixed(1)} min`:x.toFixed(1)),this.updateIMCResults()})};e("imc-tau-p","imcTauP"),e("imc-tau-d","imcTauD"),e("imc-kp","imcKp");const t=document.getElementById("diag-box"),n=document.getElementById("diag-feedback");(a=document.getElementById("btn-test-normal"))==null||a.addEventListener("click",()=>{this.currentCase="NORMAL",this.onInjectFault&&this.onInjectFault("NORMAL"),t&&(t.style.display="block"),n&&(n.innerHTML="")}),(s=document.getElementById("btn-test-inner-unstable"))==null||s.addEventListener("click",()=>{this.currentCase="INNER",this.onInjectFault&&this.onInjectFault("INNER_UNSTABLE"),t&&(t.style.display="block"),n&&(n.innerHTML="")}),(o=document.getElementById("btn-test-outer-unstable"))==null||o.addEventListener("click",()=>{this.currentCase="OUTER",this.onInjectFault&&this.onInjectFault("OUTER_UNSTABLE"),t&&(t.style.display="block"),n&&(n.innerHTML="")}),this.container.querySelectorAll(".btn-diag-option").forEach(l=>{l.addEventListener("click",()=>{const c=l.dataset.ans;this.attempts++,c===this.currentCase?(this.score++,n.innerHTML=`
            <div class="feedback-correct">
              ✓ Correct! <strong>${this.getDiagnosticExplanation(this.currentCase)}</strong>
            </div>
          `):n.innerHTML=`
            <div class="feedback-wrong">
              ✗ Incorrect. <strong>${this.getDiagnosticExplanation(this.currentCase)}</strong>
            </div>
          `,document.getElementById("diag-score").textContent=this.score,document.getElementById("diag-attempts").textContent=this.attempts})})}getDiagnosticExplanation(e){return e==="INNER"?"Figure 29 Diagnosis: The secondary loop (FIC-101) is cycling rapidly with high frequency on the valve stem, but the primary temperature (TIC-101) remains steady because the slow primary process filters out the high frequency. This causes severe valve wear and must be fixed by lowering inner loop gain!":e==="OUTER"?"Figure 30 Diagnosis: The primary loop (TIC-101) has an increasing oscillatory response that causes the entire system to become unstable. The secondary controller merely amplifies the outer loop's rolling wave. Detune the primary controller!":"Normal Operation: Both loops are well damped with quarter amplitude decay and steady-state stability."}drawDecayCurve(){const e=document.getElementById("decay-canvas");if(!e)return;const t=e.getContext("2d"),n=e.getBoundingClientRect(),r=window.devicePixelRatio||1;e.width=n.width*r,e.height=n.height*r,t.resetTransform(),t.scale(r,r);const a=n.width,s=n.height;t.fillStyle="#0f172a",t.fillRect(0,0,a,s);const o=40,l=20,c=20,u=30,h=a-o-l,f=s-c-u;t.fillStyle="#1e293b",t.fillRect(o,c,h,f);const m=c+f*.55;t.strokeStyle="#475569",t.setLineDash([3,3]),t.beginPath(),t.moveTo(o,m),t.lineTo(o+h,m),t.stroke(),t.setLineDash([]),t.strokeStyle="#38bdf8",t.lineWidth=2.5,t.beginPath();const x=4*Math.PI,y=Math.log(4)/(2*Math.PI);for(let C=0;C<=h;C++){const S=C/h*x,I=Math.exp(-y*S)*Math.cos(S),D=m-I*(f*.42);C===0?t.moveTo(o+C,D):t.lineTo(o+C,D)}t.stroke();const g=m-f*.42,p=o+2*Math.PI/x*h,A=m-.25*(f*.42);t.fillStyle="#f59e0b",t.font='11px "JetBrains Mono", monospace',t.fillText("Peak A1 (100%)",o+10,g-4),t.fillText("Peak A2 (25%)",p-30,A-6),t.fillStyle="#ef4444",t.beginPath(),t.arc(o,g,4,0,Math.PI*2),t.arc(p,A,4,0,Math.PI*2),t.fill()}}class U2{constructor(e,t){this.container=e,this.onModePermutationSelect=t,this.selectedPermutation=1,this.valveFailMode="ATO",this.windupTime=0,this.windupError=15,this.integralNormal=0,this.integralEF=0,this.render()}render(){this.container.innerHTML=`
      <div class="studio-container">
        <div class="studio-header">
          <h3>Objective Two: Controller Actions, Modes, Bumpless Transfer & Reset Windup</h3>
          <p class="studio-subtext">
            Explore fail-safe valve selection, the four operational mode configurations, bumpless transfer tracking rules, and External Feedback (EF) anti-reset windup protection.
          </p>
        </div>

        <div class="studio-grid">
          <!-- 1. The Four Operational Mode Configurations -->
          <div class="card mode-perm-card">
            <h4>1. Cascade Operational Mode Configurations (ILM Fig 12 - 15)</h4>
            <div class="perm-selector">
              <button class="perm-btn ${this.selectedPermutation===1?"active":""}" data-perm="1">
                <strong>Config 1 (Fig 12)</strong>
                <span>Primary: AUTO | Secondary: CASCADE</span>
              </button>
              <button class="perm-btn ${this.selectedPermutation===2?"active":""}" data-perm="2">
                <strong>Config 2 (Fig 13)</strong>
                <span>Primary: MANUAL | Secondary: MANUAL</span>
              </button>
              <button class="perm-btn ${this.selectedPermutation===3?"active":""}" data-perm="3">
                <strong>Config 3 (Fig 14)</strong>
                <span>Primary: MANUAL | Secondary: AUTO</span>
              </button>
              <button class="perm-btn ${this.selectedPermutation===4?"active":""}" data-perm="4">
                <strong>Config 4 (Fig 15)</strong>
                <span>Primary: MANUAL | Secondary: CASCADE</span>
              </button>
            </div>

            <!-- Dynamic explanation of active mode configuration -->
            <div class="perm-detail-box" id="perm-detail-box">
              ${this.getPermutationDetail(this.selectedPermutation)}
            </div>
          </div>

          <!-- 2. Controller Action Matrix (Direct vs Reverse) -->
          <div class="card action-matrix-card">
            <h4>2. Valve Failure Mode & Controller Action</h4>
            <div class="action-select-row">
              <label>Select Control Valve Failure Mode:</label>
              <div class="valve-toggle-group">
                <button class="btn-toggle ${this.valveFailMode==="ATO"?"active":""}" id="toggle-ato">
                  Air-to-Open (ATO / Fail-Closed)
                </button>
                <button class="btn-toggle ${this.valveFailMode==="ATC"?"active":""}" id="toggle-atc">
                  Air-to-Close (ATC / Fail-Open)
                </button>
              </div>
            </div>

            <div class="action-matrix-table-wrap">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Component</th>
                    <th>Process Action</th>
                    <th>Controller Action Required</th>
                  </tr>
                </thead>
                <tbody id="action-table-body">
                  ${this.getActionTableRows()}
                </tbody>
              </table>
            </div>

            <div class="ilm-rule-alert">
              <strong>Technician Rule:</strong> For heating loops, loss of air should fail the steam valve closed (ATO). To open the valve when temperature drops, the primary controller must be <strong>Reverse Acting</strong> ($SP - PV$).
            </div>
          </div>
        </div>

        <!-- 3. Reset Windup & External Feedback (EF) Studio -->
        <div class="card windup-card">
          <h4>3. Anti-Reset Windup via External Feedback (EF) (ILM p. 24-25)</h4>
          <p class="card-intro">
            When secondary loop is in manual or saturated, a continuous primary error would normally cause integral saturation (Reset Windup). See how connecting External Feedback (EF) from the secondary PV eliminates windup!
          </p>

          <div class="windup-demo-grid">
            <div class="windup-controls">
              <label>Simulated Sustained Error ($SP - PV$):</label>
              <div class="slider-box">
                <input type="range" id="windup-err-slider" min="0" max="30" step="1" value="${this.windupError}">
                <span class="readout" id="windup-err-val">${this.windupError.toFixed(0)}°C</span>
              </div>
              <button class="btn-action danger" id="btn-run-windup">Simulate 10 Min Sustained Error</button>
              <button class="btn-action" id="btn-reset-windup">Reset Integral State</button>
            </div>

            <div class="windup-visuals">
              <div class="windup-bar-group">
                <span class="bar-title">Without Anti-Windup (Saturated Integral)</span>
                <div class="windup-progress-track">
                  <div class="windup-progress-fill saturated" id="bar-no-ef" style="width: 20%;">20%</div>
                </div>
                <span class="windup-status warn" id="status-no-ef">Accumulating Bias...</span>
              </div>

              <div class="windup-bar-group">
                <span class="bar-title">With External Feedback EF (Protected Bias)</span>
                <div class="windup-progress-track">
                  <div class="windup-progress-fill protected" id="bar-with-ef" style="width: 50%;">50%</div>
                </div>
                <span class="windup-status success" id="status-with-ef">Clamped to Secondary PV (EF)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `,this.attachEvents()}getPermutationDetail(e){switch(e){case 1:return`
          <div class="perm-detail">
            <h5>Full Cascade Control (Figure 12)</h5>
            <ul>
              <li><strong>Operator Adjustments:</strong> Primary Setpoint ($SP_1$) only. Cannot adjust secondary setpoint or valve output directly.</li>
              <li><strong>Signal Path:</strong> Primary Output ($CO_1$) $\\to$ Remote Setpoint ($RSP_2$) of Secondary Controller.</li>
              <li><strong>Operation:</strong> Secondary controller FIC-101 operates in automatic, eliminating flow and steam pressure disturbances. Primary maintains product temperature.</li>
            </ul>
          </div>
        `;case 2:return`
          <div class="perm-detail">
            <h5>Full Manual Mode (Figure 13)</h5>
            <ul>
              <li><strong>Operator Adjustments:</strong> Secondary Output ($CO_2$) directly manipulates valve position.</li>
              <li><strong>Tracking for Bumpless Transfer:</strong> 
                <br>• Secondary SP tracks Secondary PV ($SP_2 = PV_2$).
                <br>• Primary SP tracks Primary PV ($SP_1 = PV_1$).
                <br>• Primary CO tracks Secondary PV ($CO_1 = PV_2$).
              </li>
              <li><strong>Outcome:</strong> No bump or valve jump occurs when transferring to Automatic or Cascade.</li>
            </ul>
          </div>
        `;case 3:return`
          <div class="perm-detail">
            <h5>Primary Manual, Secondary Automatic (Figure 14)</h5>
            <ul>
              <li><strong>Operator Adjustments:</strong> Secondary Setpoint ($SP_2$) locally. Cannot adjust valve directly.</li>
              <li><strong>Primary Initialized Manual:</strong> Primary controller TIC-101 is forced into initialized manual mode.</li>
              <li><strong>Tracking:</strong> Primary SP tracks Primary PV ($SP_1 = PV_1$), Primary CO tracks Secondary SP ($CO_1 = SP_2$).</li>
            </ul>
          </div>
        `;case 4:return`
          <div class="perm-detail">
            <h5>Primary Manual, Secondary Cascade (Figure 15)</h5>
            <ul>
              <li><strong>Operator Adjustments:</strong> Primary Output ($CO_1$). This directly sets the Remote Setpoint ($RSP_2$) for FIC-101!</li>
              <li><strong>Secondary Operation:</strong> FIC-101 runs in automatic control to hold flow at $CO_1$.</li>
              <li><strong>Primary Tracking:</strong> Primary SP tracks Primary PV ($SP_1 = PV_1$).</li>
            </ul>
          </div>
        `;default:return""}}getActionTableRows(){return this.valveFailMode==="ATO"?`
        <tr>
          <td>Control Valve (ATO)</td>
          <td>Air $\\uparrow \\implies$ Valve Opens $\\implies$ Steam Flow $\\uparrow$</td>
          <td><span class="badge direct">Direct Process</span></td>
        </tr>
        <tr>
          <td>Flow Controller (FIC-101)</td>
          <td>Flow $PV_2 \\uparrow$ requires Valve closing</td>
          <td><span class="badge reverse">Reverse Acting</span></td>
        </tr>
        <tr>
          <td>Reboiler Heat Process</td>
          <td>Steam Flow $\\uparrow \\implies$ Product Temp $PV_1 \\uparrow$</td>
          <td><span class="badge direct">Direct Process</span></td>
        </tr>
        <tr>
          <td>Temp Controller (TIC-101)</td>
          <td>Temp $PV_1 \\uparrow$ requires Steam setpoint reduction</td>
          <td><span class="badge reverse">Reverse Acting</span></td>
        </tr>
      `:`
        <tr>
          <td>Control Valve (ATC)</td>
          <td>Air $\\uparrow \\implies$ Valve Closes $\\implies$ Steam Flow $\\downarrow$</td>
          <td><span class="badge reverse">Reverse Process</span></td>
        </tr>
        <tr>
          <td>Flow Controller (FIC-101)</td>
          <td>Flow $PV_2 \\uparrow$ requires Valve closing (Air $\\uparrow$)</td>
          <td><span class="badge direct">Direct Acting</span></td>
        </tr>
        <tr>
          <td>Reboiler Heat Process</td>
          <td>Steam Flow $\\uparrow \\implies$ Product Temp $PV_1 \\uparrow$</td>
          <td><span class="badge direct">Direct Process</span></td>
        </tr>
        <tr>
          <td>Temp Controller (TIC-101)</td>
          <td>Temp $PV_1 \\uparrow$ requires Steam setpoint reduction</td>
          <td><span class="badge reverse">Reverse Acting</span></td>
        </tr>
      `}attachEvents(){var o,l;const e=this.container.querySelectorAll(".perm-btn");e.forEach(c=>{c.addEventListener("click",()=>{const u=parseInt(c.dataset.perm,10);this.selectedPermutation=u,e.forEach(f=>f.classList.remove("active")),c.classList.add("active");const h=document.getElementById("perm-detail-box");h&&(h.innerHTML=this.getPermutationDetail(u)),this.onModePermutationSelect&&this.onModePermutationSelect(u)})});const t=document.getElementById("toggle-ato"),n=document.getElementById("toggle-atc"),r=document.getElementById("action-table-body");t==null||t.addEventListener("click",()=>{this.valveFailMode="ATO",t.classList.add("active"),n.classList.remove("active"),r&&(r.innerHTML=this.getActionTableRows())}),n==null||n.addEventListener("click",()=>{this.valveFailMode="ATC",n.classList.add("active"),t.classList.remove("active"),r&&(r.innerHTML=this.getActionTableRows())});const a=document.getElementById("windup-err-slider"),s=document.getElementById("windup-err-val");a==null||a.addEventListener("input",c=>{this.windupError=parseFloat(c.target.value),s&&(s.textContent=`${this.windupError.toFixed(0)}°C`)}),(o=document.getElementById("btn-run-windup"))==null||o.addEventListener("click",()=>{this.simulateWindup()}),(l=document.getElementById("btn-reset-windup"))==null||l.addEventListener("click",()=>{this.resetWindup()})}simulateWindup(){const e=document.getElementById("bar-no-ef"),t=document.getElementById("status-no-ef"),n=document.getElementById("bar-with-ef"),r=document.getElementById("status-with-ef");e&&(e.style.width="100%",e.textContent="103.3% (Saturated!)"),t&&(t.textContent="WARNING: Saturated Reset Windup. Delay in returning to control!",t.className="windup-status danger"),n&&(n.style.width="52%",n.textContent="52.0% (Matched)"),r&&(r.textContent="SUCCESS: Bias locked to External Feedback (EF). Immediate control recovery.",r.className="windup-status success")}resetWindup(){const e=document.getElementById("bar-no-ef"),t=document.getElementById("status-no-ef"),n=document.getElementById("bar-with-ef"),r=document.getElementById("status-with-ef");e&&(e.style.width="20%",e.textContent="20%"),t&&(t.textContent="Normal Bias",t.className="windup-status"),n&&(n.style.width="50%",n.textContent="50%"),r&&(r.textContent="Normal Tracking",r.className="windup-status")}}class N2{constructor(e){this.container=e,this.userAnswers={},this.submitted=!1,this.questions=[{id:1,title:"1. Definition of Cascade Control",prompt:"What is the technical definition of cascade control in process automation?",options:["Any control scheme where two valves are operated in split-range sequence.","Any control scheme in which the output of one controller is used as the setpoint input of another controller.","A feedback control loop where feedforward disturbance rejection is added to the valve.","A control strategy where two controllers simultaneously manipulate the same final control element."],correct:1,explanation:"ILM Definition (p. 2, 60): Cascade control is any control scheme in which the output of one controller is used as the setpoint of another controller."},{id:2,title:"2. Advantages of Cascade Control",prompt:"Which of the following is NOT an advantage of a cascade control scheme over conventional single-loop control?",options:["Minimizes or eliminates the effects of disturbances to the manipulated variable before they reach the primary variable.","Improves the speed of response of the primary control loop.","Eliminates the need for a secondary transmitter or secondary process penetration.","Handles and isolates non-linearities (like valve stiction) in the slave loop so they do not upset the master loop."],correct:2,explanation:"ILM Answer (p. 9, 60): Cascade control requires at least two measurements, requiring an additional transmitter and process penetration (an added cost, not an elimination)."},{id:3,title:"3. Loop Speed Requirements",prompt:"For two loops to be successfully coupled in cascade control, what loop speed requirement must be met?",options:["The secondary loop must be at least 3 to 5 times faster than the primary loop.","The primary loop must be at least 3 times faster than the secondary loop.","Both loops must have identical natural frequencies of oscillation to prevent resonance.","The speed of the loops does not matter as long as derivative action is enabled on both."],correct:0,explanation:"ILM Answer (p. 9-10, 60): The secondary loop should be at least three times faster than the primary loop. This is determined by comparing their first order time constants or natural frequencies."},{id:4,title:"4. Most Common Cascade Loop in Industry",prompt:"What is the single most common secondary loop found in industrial cascade control?",options:["Orifice plate flow control loop (FIC)","Thermocouple temperature loop (TIC)","Smart valve positioner on a pneumatic control valve","Level transmitter buoyancy displacer (LIC)"],correct:2,explanation:"ILM Answer (p. 10, 60): A valve positioner is the most common secondary loop. It acts as a high-gain, proportional-only controller positioning the valve stem."},{id:5,title:"5. Valve Positioner & Stiction in Temperature Loops",prompt:"How does a valve positioner mitigate packing friction / stiction in a slow temperature process?",options:["It completely lubricates the packing to physically eliminate static friction.","It increases the frequency of stick-slip oscillations so the rapid cycles are filtered and damped out by the process.","It shifts the valve failure mode from Air-to-Open to Air-to-Close.","It adds large integral action to ramp actuator pressure slowly."],correct:1,explanation:"ILM Answer (p. 11, 60): A valve positioner does not stop stick-slip, but it shortens the period so that the faster oscillations are damped out by the process without affecting the primary variable."},{id:6,title:"6. Valve Positioners on Fast Flow Loops",prompt:"Why is a valve positioner often NOT beneficial on a liquid flow control loop?",options:["Flow valves cannot accept pneumatic positioners.","The primary flow loop dynamics are in milliseconds (faster than the actuator's seconds), so positioners offer no speed advantage.","Flow loops require Air-to-Close valves exclusively.","Positioners cause flow cavitation."],correct:1,explanation:"ILM Answer (p. 11): In a flow loop, the speed of the primary flow measurement is milliseconds, whereas the actuator takes seconds. The primary loop is already faster than the secondary loop."},{id:7,title:"7. Heat Exchanger Controller Actions (Fig 47)",prompt:"In a steam reboiler with an Air-to-Open (ATO, fail closed) steam valve heating product liquid, what actions are required for TIC-101 and FIC-101?",options:["TIC-101: Direct Acting | FIC-101: Direct Acting","TIC-101: Reverse Acting | FIC-101: Reverse Acting","TIC-101: Reverse Acting | FIC-101: Direct Acting","TIC-101: Direct Acting | FIC-101: Reverse Acting"],correct:1,explanation:"ILM Answer (p. 16, 56, 60): When temperature rises, heat must decrease (Reverse). For an ATO valve, when flow rises above SP, controller must decrease output to close valve (Reverse). Both are Reverse Acting."},{id:8,title:"8. Bumpless Transfer in Full Manual (Fig 13)",prompt:"When both primary and secondary controllers are in MANUAL mode, which variables track each other to ensure bumpless transfer?",options:["SP2 tracks PV2, SP1 tracks PV1, and CO1 tracks PV2","SP1 tracks CO2, and PV1 tracks PV2","CO1 tracks SP1, and CO2 tracks SP2","No variables track each other in manual"],correct:0,explanation:"ILM Answer (p. 19, 56, 60): SP2 tracks PV2 (secondary bumpless transfer), SP1 tracks PV1, and Primary Output CO1 tracks Secondary PV (PV2)."},{id:9,title:"9. Primary Initialized Manual Adjustments",prompt:"When the primary controller is in Initialized Manual mode (secondary in Auto), what can the operator adjust on the primary controller?",options:["The operator cannot adjust Primary CO because it is tracking the secondary loop.","The operator can adjust Primary CO directly to open the valve.","The operator can adjust the tuning gain of the primary loop.","The operator can override the secondary process variable."],correct:0,explanation:"ILM Answer (p. 20, 57, 60): When in initialized manual mode, the primary controller's output tracks the secondary controller, so the operator cannot adjust its output."},{id:10,title:"10. Reasons for Initialized Manual Mode",prompt:"List two primary reasons why a digital primary controller automatically enters Initialized Manual mode:",options:["Secondary controller is placed in Manual OR Secondary controller is placed in local Automatic.","Primary transmitter fails OR Steam header pressure rises.","Valve stiction occurs OR Operator presses reset button.","Process variable exceeds 100% OR Derivative time is set to zero."],correct:0,explanation:"ILM Answer (p. 19-20, 57, 60): The primary controller enters initialized manual whenever the secondary controller is not in cascade mode (i.e. Secondary is in Manual or local Auto)."},{id:11,title:"11. Prevention of Reset Windup via External Feedback",prompt:"How is integral reset windup prevented in the primary controller of a pneumatic or analog cascade scheme?",options:["By venting the nozzle-flapper assembly to atmosphere.","By connecting the primary controller's reset bellows to External Feedback (EF) from the secondary PV.","By turning off integral action whenever error is positive.","By using only derivative control in the primary loop."],correct:1,explanation:"ILM Answer (p. 25, 57, 60): Reset windup is prevented by connecting the primary controller's bias bellows to the secondary process variable (External Feedback EF)."},{id:12,title:"12. Time Constant Reduction Formula",prompt:"What mathematical formula describes how the effective closed loop time constant (CLTC) of the inner loop is reduced?",options:["CLTC = tau_p / (1 + |Kc * Kp|)","CLTC = tau_p * (1 + |Kc * Kp|)","CLTC = sqrt(tau_p * Kc)","CLTC = tau_p - (Kc / Kp)"],correct:0,explanation:"ILM Answer (p. 24, 28): CLTC = tau_p / (1 + |Kc * Kp|). Increasing proportional gain Kc in the secondary controller shrinks the effective time constant."},{id:13,title:"13. Sequence for Tuning Cascade Control Systems",prompt:"What is the proper industrial procedure for tuning a cascade control system?",options:["Tune outer loop first in automatic, then engage inner loop in cascade.","Tune from the inside out: Put outer loop in manual, tune inner loop first, put inner loop in cascade, then tune outer loop.","Tune both controllers simultaneously using maximum proportional gain.","Tune inner loop with outer loop set to high integral action."],correct:1,explanation:"ILM Answer (p. 31, 57, 61): A cascade control system is tuned from the inside out: outer loop in manual, tune inner loop for 1/4 decay, put inner loop in cascade, then tune outer loop."},{id:14,title:"14. Secondary Controller Mode Selection",prompt:"Why is Proportional-only (P-only) control generally recommended for the secondary controller in cascade systems?",options:["Because offset in the secondary variable does not affect the primary variable, and P-only is more stable with higher allowed gain.","Because integral action cannot be programmed into digital slave controllers.","Because P-only control prevents valve movement entirely.","Because secondary transmitters cannot calculate error."],correct:0,explanation:"ILM Answer (p. 30, 42): Proportional-only control is recommended because secondary offset is compensated by the primary master loop, and integral action decreases stability and limits usable gain."},{id:15,title:"15. Diagnostic Scenario (Figure 29)",prompt:"An operator notices the steam control valve is rapidly oscillating in cascade mode, but the product temperature remains completely steady. What is the fault?",options:["The primary temperature controller is unstable.","The secondary flow controller is unstable and needs re-tuning (gain too high).","The temperature transmitter has failed open.","The steam valve is stuck shut."],correct:1,explanation:"ILM Answer (p. 38, 58, 61): The secondary loop is unstable. Because the secondary loop is fast, it cycles without affecting the primary variable, causing unnecessary valve wear."},{id:16,title:"16. Diagnostic Scenario (Figure 30)",prompt:"A load disturbance causes growing, rolling oscillations in the primary temperature that are amplified by the secondary flow controller. What is the fault?",options:["The primary controller is improperly tuned and causing system instability.","The secondary controller gain is too low.","The control valve packing is slipping.","The feed pump has tripped."],correct:0,explanation:"ILM Answer (p. 39, 58, 61): The primary controller's tuning causes the instability of the primary controlled variable, which is amplified by the secondary loop."},{id:17,title:"17. Non-Linearity in Control Valve Installed Characteristic",prompt:"If the installed characteristic of the control valve is non-linear, which loop must compensate for this?",options:["The secondary (inner) control loop, via multipoint characterization f(x) or adaptive gain.","The primary (outer) control loop only.","Neither loop, because cascade control eliminates physical valve non-linearities automatically.","The feed pump variable frequency drive."],correct:0,explanation:"ILM Answer (p. 49, 58, 61): The inner loop contains the valve, so the inner loop must compensate via multipoint characterization f(x), adaptive control, or detuning."},{id:18,title:"18. Non-Linearity in Primary Process",prompt:"If the process characteristic of the primary heat transfer process is non-linear, which loop must compensate?",options:["The primary (outer) control loop, via multipoint characterization or adaptive control.","The secondary flow control loop.","The pneumatic valve positioner.","The steam trap on the condensate line."],correct:0,explanation:"ILM Answer (p. 50-51, 58, 61): The primary process non-linearity is outside the inner loop; therefore, the primary loop must compensate via multipoint characterization f(x) or detuning."},{id:19,title:"19. Multilevel Cascade Control",prompt:"In a 4-level industrial cascade scheme (ILM Figure 9), what is the correct hierarchy from inner-most to outer-most?",options:["Level 1: Valve Positioner -> Level 2: Flow Controller -> Level 3: Secondary Temp -> Level 4: Primary Temp","Level 1: Primary Temp -> Level 2: Secondary Temp -> Level 3: Flow Controller -> Level 4: Valve Positioner","Level 1: Flow Controller -> Level 2: Primary Temp -> Level 3: Valve Positioner -> Level 4: Secondary Temp","Level 1: Steam Header -> Level 2: Diaphragm -> Level 3: Flange -> Level 4: Reboiler"],correct:0,explanation:"ILM Answer (p. 14): Level 1 is the valve positioner, Level 2 is flow controller FIC-101, Level 3 is furnace temp TIC-201, and Level 4 is master regenerator temp TIC-101."}],this.render()}render(){this.container.innerHTML=`
      <div class="quiz-container">
        <div class="quiz-header">
          <h3>ILM 310305e Comprehensive Self-Test & Exam Prep</h3>
          <p class="quiz-subtext">
            Test your knowledge across all 5 learning objectives using the official Alberta Apprenticeship curriculum questions. Submit for instant grading and technical explanations!
          </p>
          <div class="quiz-score-banner" id="quiz-banner" style="display: none;">
            <div class="banner-score">Your Score: <span id="quiz-final-score">0</span> / 19 (<span id="quiz-final-pct">0%</span>)</div>
            <div class="banner-status" id="quiz-banner-status">Pass / Fail</div>
          </div>
        </div>

        <div class="quiz-questions-list">
          ${this.questions.map((e,t)=>`
            <div class="quiz-q-card" id="q-card-${e.id}">
              <div class="q-title">${e.title}</div>
              <div class="q-prompt">${e.prompt}</div>
              <div class="q-options">
                ${e.options.map((n,r)=>`
                  <label class="q-option-label" id="opt-label-${e.id}-${r}">
                    <input type="radio" name="question-${e.id}" value="${r}" class="q-radio" data-qid="${e.id}" data-oidx="${r}">
                    <span class="q-opt-text">${n}</span>
                  </label>
                `).join("")}
              </div>
              <div class="q-feedback" id="feedback-${e.id}" style="display: none;"></div>
            </div>
          `).join("")}
        </div>

        <div class="quiz-actions-bar">
          <button class="btn-action primary lg" id="btn-submit-quiz">Submit All Answers for Grading</button>
          <button class="btn-action" id="btn-reset-quiz">Reset Quiz</button>
        </div>
      </div>
    `,this.attachEvents()}attachEvents(){var t,n;this.container.querySelectorAll(".q-radio").forEach(r=>{r.addEventListener("change",a=>{const s=parseInt(a.target.dataset.qid,10),o=parseInt(a.target.dataset.oidx,10);this.userAnswers[s]=o})}),(t=document.getElementById("btn-submit-quiz"))==null||t.addEventListener("click",()=>{this.gradeQuiz()}),(n=document.getElementById("btn-reset-quiz"))==null||n.addEventListener("click",()=>{this.userAnswers={},this.submitted=!1,this.render()})}gradeQuiz(){let e=0;this.submitted=!0,this.questions.forEach(o=>{const l=document.getElementById(`q-card-${o.id}`),c=document.getElementById(`feedback-${o.id}`),u=this.userAnswers[o.id];for(let h=0;h<o.options.length;h++){const f=document.getElementById(`opt-label-${o.id}-${h}`);f&&(f.className="q-option-label")}if(u!==void 0)if(u===o.correct){e++,l.classList.add("correct"),l.classList.remove("incorrect");const h=document.getElementById(`opt-label-${o.id}-${o.correct}`);h&&h.classList.add("chosen-correct"),c&&(c.style.display="block",c.className="q-feedback correct",c.innerHTML=`✓ <strong>Correct!</strong> ${o.explanation}`)}else{l.classList.add("incorrect"),l.classList.remove("correct");const h=document.getElementById(`opt-label-${o.id}-${u}`);h&&h.classList.add("chosen-wrong");const f=document.getElementById(`opt-label-${o.id}-${o.correct}`);f&&f.classList.add("correct-answer"),c&&(c.style.display="block",c.className="q-feedback incorrect",c.innerHTML=`✗ <strong>Incorrect.</strong> ${o.explanation}`)}else l.classList.add("incorrect"),c&&(c.style.display="block",c.className="q-feedback incorrect",c.innerHTML=`⚠️ <strong>Unanswered.</strong> Correct answer is: "${o.options[o.correct]}".<br>${o.explanation}`)});const t=Math.round(e/this.questions.length*100),n=document.getElementById("quiz-banner"),r=document.getElementById("quiz-final-score"),a=document.getElementById("quiz-final-pct"),s=document.getElementById("quiz-banner-status");n&&(n.style.display="flex"),r&&(r.textContent=e),a&&(a.textContent=`${t}%`),s&&(t>=80?(s.textContent="🎉 Mastery Achieved! Excellent understanding of Cascade Control.",s.className="banner-status pass"):t>=65?(s.textContent="👍 Pass (Review sections on loop speed and tuning diagnostics).",s.className="banner-status pass"):(s.textContent="📚 Review Recommended (Re-visit Objectives 2, 3, and 4).",s.className="banner-status fail")),n==null||n.scrollIntoView({behavior:"smooth",block:"start"})}}document.addEventListener("DOMContentLoaded",()=>{var Q,ce,Re,me,Ne,ze;const i=new Th,e=document.getElementById("strip-chart-canvas");let t=null;e&&(t=new Eh(e,{timeWindowMinutes:8,yMin:0,yMax:160}));const n=document.getElementById("heat-exchanger-3d-container");let r=null;n&&(r=new Iv(n));const a=document.getElementById("valve-3d-container");let s=null;const o=document.getElementById("faceplate-tic-container"),l=document.getElementById("faceplate-fic-container");let c=null,u=null;o&&(c=new ic(o,i.casPrimaryPID,ve=>console.log("TIC Mode:",ve),ve=>console.log("TIC SP:",ve),ve=>console.log("TIC CO:",ve))),l&&(u=new ic(l,i.casSecondaryPID,ve=>console.log("FIC Mode:",ve),ve=>console.log("FIC SP:",ve),ve=>console.log("FIC CO:",ve)));const h=document.getElementById("tab-diagrams");h&&new I2(h);const f=document.getElementById("tab-speed");f&&new L2(f);const m=document.getElementById("tab-tuning");m&&new F2(m,ve=>{ve==="INNER_UNSTABLE"?(i.casSecondaryPID.Kc=8.5,i.casSecondaryPID.Ti=.02):ve==="OUTER_UNSTABLE"?(i.casPrimaryPID.Kc=4.8,i.casPrimaryPID.Ti=.5):(i.casSecondaryPID.Kc=2.5,i.casSecondaryPID.Ti=.3,i.casPrimaryPID.Kc=1.5,i.casPrimaryPID.Ti=3.5)});const x=document.getElementById("tab-modes");x&&new U2(x,ve=>{ve===1?(i.casPrimaryPID.setMode("AUTO"),i.casSecondaryPID.setMode("CASCADE")):ve===2?(i.casPrimaryPID.setMode("MANUAL"),i.casSecondaryPID.setMode("MANUAL")):ve===3?(i.casPrimaryPID.setMode("MANUAL"),i.casSecondaryPID.setMode("AUTO")):ve===4&&(i.casPrimaryPID.setMode("MANUAL"),i.casSecondaryPID.setMode("CASCADE")),c==null||c.render(),u==null||u.render()});const y=document.getElementById("tab-quiz");y&&new N2(y);const g=document.querySelectorAll(".tab-btn"),p=document.querySelectorAll(".tab-panel");g.forEach(ve=>{ve.addEventListener("click",()=>{const Oe=ve.dataset.tab;g.forEach(lt=>lt.classList.remove("active")),p.forEach(lt=>lt.classList.remove("active")),ve.classList.add("active");const We=document.getElementById(Oe);We&&We.classList.add("active"),Oe==="tab-valve"&&!s&&a&&(s=new Lv(a)),setTimeout(()=>{r==null||r.resize(),s==null||s.resize(),t==null||t.resize()},50)})}),(Q=document.getElementById("btn-inject-steam-drop"))==null||Q.addEventListener("click",()=>{i.triggerSteamDrop(30)}),(ce=document.getElementById("btn-inject-feed-surge"))==null||ce.addEventListener("click",()=>{i.triggerFeedSurge(20)}),(Re=document.getElementById("btn-restore-disturbances"))==null||Re.addEventListener("click",()=>{i.restoreSteam(),i.clearFeedSurge()});const A=document.getElementById("btn-global-pause");A==null||A.addEventListener("click",()=>{i.isRunning=!i.isRunning,A.textContent=i.isRunning?"Pause":"Resume",A.classList.toggle("warn",!i.isRunning)}),(me=document.getElementById("btn-global-reset"))==null||me.addEventListener("click",()=>{i.reset(),t==null||t.clear()}),(Ne=document.getElementById("btn-camera-reset"))==null||Ne.addEventListener("click",()=>{r&&(r.camera.position.set(12,9,16),r.camera.lookAt(r.camTarget))});const C=document.getElementById("slider-kc2"),S=document.getElementById("val-kc2");C==null||C.addEventListener("input",ve=>{const Oe=parseFloat(ve.target.value);i.casSecondaryPID.Kc=Oe,S&&(S.textContent=Oe.toFixed(1))});const N=document.getElementById("slider-kc1"),I=document.getElementById("val-kc1");N==null||N.addEventListener("input",ve=>{const Oe=parseFloat(ve.target.value);i.casPrimaryPID.Kc=Oe,I&&(I.textContent=Oe.toFixed(1))});const D=document.getElementById("slider-sim-speed"),U=document.getElementById("val-sim-speed");D==null||D.addEventListener("input",ve=>{const Oe=parseFloat(ve.target.value);i.speedMultiplier=Oe,U&&(U.textContent=`${Oe.toFixed(1)}x`)});const T=document.getElementById("slider-stiction-deadband"),w=document.getElementById("val-stiction-deadband"),F=document.getElementById("slider-stiction-slip"),V=document.getElementById("val-stiction-slip"),G=()=>{const ve=parseFloat((T==null?void 0:T.value)||0),Oe=parseFloat((F==null?void 0:F.value)||0);i.setStiction(ve,Oe),w&&(w.textContent=`${ve.toFixed(1)}%`),V&&(V.textContent=`${Oe.toFixed(1)}%`)};T==null||T.addEventListener("input",G),F==null||F.addEventListener("input",G);const K=document.getElementById("btn-char-linear"),J=document.getElementById("btn-char-eq"),j=document.getElementById("btn-char-quick"),te=[K,J,j],Y=(ve,Oe)=>{i.casValve.characteristic=ve,i.convValve.characteristic=ve,te.forEach(We=>We==null?void 0:We.classList.remove("active")),Oe==null||Oe.classList.add("active")};K==null||K.addEventListener("click",()=>Y("LINEAR",K)),J==null||J.addEventListener("click",()=>Y("EQUAL_PCT",J)),j==null||j.addEventListener("click",()=>Y("QUICK_OPEN",j));const fe=document.getElementById("btn-char-off"),pe=document.getElementById("btn-char-on");fe==null||fe.addEventListener("click",()=>{i.casValve.useCharacterizer=!1,fe.classList.add("active"),pe.classList.remove("active")}),pe==null||pe.addEventListener("click",()=>{i.casValve.useCharacterizer=!0,pe.classList.add("active"),fe.classList.remove("active")});const ye=(ve,Oe)=>{const We=document.getElementById(ve);We==null||We.addEventListener("change",lt=>{t==null||t.setPenVisibility(Oe,lt.target.checked)})};ye("pen-cas-pv","casPriPV"),ye("pen-conv-pv","convPV"),ye("pen-steam-pv","casSecPV"),ye("pen-valve-pos","casValvePos"),ye("pen-steam-press","steamPressure"),(ze=document.getElementById("btn-chart-clear"))==null||ze.addEventListener("click",()=>{t==null||t.clear()});const ke=document.getElementById("header-sim-time");performance.now();function qe(ve){requestAnimationFrame(qe);const Oe=i.step(1);r==null||r.updateState(Oe),s&&s.setStemPosition(Oe.casValvePos),t&&(t.addPoint(Oe),t.render()),c==null||c.updateDisplay(),u==null||u.updateDisplay(),ke&&(ke.textContent=`${Oe.time.toFixed(1)}m`)}requestAnimationFrame(qe)});
//# sourceMappingURL=index-DEgzfSHh.js.map
