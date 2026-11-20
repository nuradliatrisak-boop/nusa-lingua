/* NUSA IMMERSIVE — procedural 3D museum, native WebGL (no external 3D library).
   Narration uses device speechSynthesis, not a trained Batak-language AI voice. */
(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const chapters = [
    {label:'01 / LANSKAP', eyebrow:'MEMULAI PERJALANAN', icon:'01', heading:'Pesona lanskap Danau Toba', title:'Danau yang menyimpan cerita', description:'Mulai perjalanan dari lanskap Danau Toba dan Pulau Samosir. Gerakkan kamera untuk mengenal ruang yang menjadi latar warisan budaya Batak Toba.', fact:'Model pulau dan pegunungan adalah interpretasi artistik, bukan data elevasi atau model Google Earth.', search:'', mapId:null, view:{dist:27,elev:.79,angle:.6,tx:0,ty:.0,tz:0}, lines:['Perjalanan kita dimulai dari Danau Toba, di Sumatera Utara.','Di tengah bentang alamnya, Pulau Samosir menyimpan jejak kehidupan dan tradisi yang masih terus dijaga.','Kita akan melihat bagaimana tempat, rumah, dan karya tenun menjadi bagian dari kisah masyarakat Batak Toba.']},
    {label:'02 / PERKAMPUNGAN', eyebrow:'RUANG HIDUP', icon:'02', heading:'Mendekati perkampungan', title:'Kehidupan di antara rumah adat', description:'Kamera perlahan mendekati ilustrasi perkampungan. Bangunan yang ditampilkan merupakan model edukatif yang terinspirasi arsitektur tradisional Batak Toba.',fact:'Bentuk dan susunan rumah pada model disederhanakan. Untuk sejarah bangunan tertentu, utamakan penjelasan pengelola situs.',search:'Siallagan',mapId:'siallagan',view:{dist:13,elev:.49,angle:.55,tx:.2,ty:.8,tz:.1},lines:['Sekarang kita mendekati sebuah gambaran perkampungan Batak Toba.','Rumah tradisional bukan hanya bangunan yang menarik untuk dilihat, melainkan bagian dari pengetahuan masyarakat.','Saat berkunjung, dengarkan penjelasan pemandu dan hormati batas area yang boleh diakses.']},
    {label:'03 / ARSITEKTUR',eyebrow:'MEMAHAMI BANGUNAN',icon:'03',heading:'Mengenal warisan Rumah Bolon',title:'Arsitektur yang bercerita',description:'Amati detail rumah tradisional Batak Toba melalui rekaman yang kamu pilih. Ketahui arsitektur dan cara menghargai ruang budaya ini.',fact:'Model 3D ini hanya mewakili ciri umum dan tidak boleh dijadikan acuan teknis atau representasi akurat satu Rumah Bolon tertentu.',search:'Simanindo',mapId:'simanindo',view:{dist:6.6,elev:.38,angle:.65,tx:.15,ty:1.25,tz:0},lines:['Mari kita perhatikan bentuk rumah tradisional yang dikenal dalam warisan arsitektur Batak Toba.','Atap, badan rumah, dan tiang penyangga memperlihatkan keterampilan dan pengetahuan membangun.','Kisah tentang fungsi dan makna tiap bagiannya sebaiknya dipelajari dari narasumber serta pengelola budaya setempat.']},
    {label:'04 / TENUN ULOS',eyebrow:'WARISAN KARYA',icon:'04',heading:'Menelusuri benang ulos',title:'Dari benang menjadi warisan',description:'Ikuti dokumentasi proses tenun ulos, dari persiapan hingga keterampilan menyusun pola. Belajarlah langsung dari penenun setempat untuk makna dan konteksnya.',fact:'Geometri pada kain adalah pola demonstrasi generik, bukan salinan motif ulos khusus. Tahapan menenun nyata lebih kompleks daripada ilustrasi ini.',search:'Hutaraja',mapId:'hutaraja',view:{dist:6.7,elev:.48,angle:.4,tx:7,ty:1.35,tz:0},lines:['Perjalanan berakhir pada karya tenun yang dikenal sebagai ulos.','Pembuatan ulos melibatkan keterampilan mengolah benang, menyusun pola, dan menenun dengan ketelitian.','Setiap kain dapat memiliki konteks sosial yang berbeda. Saat ingin mengetahui maknanya, belajarlah langsung bersama penenun dan pemilik pengetahuan.']}
  ];
  const englishLines=[
   ['Our journey begins at Lake Toba, in North Sumatra.','Across this remarkable landscape, Samosir Island is home to living traditions and generations of stories.','Discover how the land, traditional homes, and weaving are connected to Batak Toba heritage.'],
   ['We are approaching a traditional Batak Toba village.','These beautiful homes represent living knowledge and generations of craftsmanship.','As you explore, follow your local guide and respect private spaces.'],
   ['Look closely at the distinctive forms of traditional Batak Toba architecture.','The roof, wooden structure, and supporting pillars reflect remarkable building traditions.','For the deeper meaning of each element, listen to the people who care for this heritage.'],
   ['Our journey now turns to ulos, the woven textile heritage of the Batak Toba people.','The process takes patience, skill, and careful arrangement of the threads.','Each cloth has its own cultural context. The best stories come from the weavers themselves.']
  ];
  const language=()=>localStorage.getItem('nusaLanguage')==='en'?'en':'id';
  const state={i:0,sound:true,playing:false,utter:null,subtitleTimer:null,step:0,angle:.6,elev:.79,dist:27,tx:0,ty:0,tz:0,target:{...chapters[0].view},drag:false,lastX:0,lastY:0,gl:null,renderer:null,canvas:null,raf:0};
  let isWebGL = false;
  const cubic=(a,b,t)=>a+(b-a)*t;
  function setText(id,text){const e=$(id);if(e)e.textContent=text;}
  function navigate(i){
    stopNarration();state.i=(i+chapters.length)%chapters.length;const c=chapters[state.i];state.target={...c.view};document.dispatchEvent(new CustomEvent("nusa:chapter",{detail:{index:state.i}}));
    setText('immCount',`${String(state.i+1).padStart(2,'0')} / 04`);
    setText('immLabel',c.eyebrow);setText('immChapterIcon',c.icon);setText('immTitle',c.title);
    setText('immDescription',c.description);setText('immFact',c.fact);setText('immSceneHeading',c.heading);
    setText('immSceneType',c.label);setText('immSubtitles','Tekan “Mulai cerita” untuk mendengarkan narasi bab ini.');
    $('immProgress').style.width=`${(state.i+1)*25}%`;
    $('immPrev').disabled=state.i===0;
    $('immNext').textContent=state.i===chapters.length-1?'↺':'→';
    $('immChapters').querySelectorAll('button').forEach((btn,n)=>{btn.classList.toggle('selected',n===state.i);btn.setAttribute('aria-current',String(n===state.i));});
  }
  function stopNarration(){
    state.playing=false;clearTimeout(state.subtitleTimer);if('speechSynthesis' in window)window.speechSynthesis.cancel();
    setText('immPlay','▶ Mulai cerita');
  }
  function nextSentence(){
    if(!state.playing)return;
    const lines=language()==='en'?englishLines[state.i]:chapters[state.i].lines;
    if(state.step>=lines.length){state.playing=false;setText('immPlay','↺ Putar lagi');return;}
    const sentence=lines[state.step++];setText('immSubtitles',sentence);
    if(state.sound&&'speechSynthesis' in window){
      const u=new SpeechSynthesisUtterance(sentence);
      u.lang=language()==='en'?'en-US':'id-ID';u.rate=.94;u.pitch=1.04;u.volume=1;
      const voices=window.speechSynthesis.getVoices();
      const wanted=localStorage.getItem('nusaVoice_'+language())||localStorage.getItem('nusaVoice');
      const prefix=language()==='en'?'en':'id';
      const matching=voices.filter(v=>v.lang.toLowerCase().startsWith(prefix));
      u.voice=matching.find(v=>v.name===wanted)||matching.find(v=>/natural|online|neural|google|microsoft/i.test(v.name))||matching[0]||null;
      if(!matching.length){
        // Never read Indonesian with an unrelated foreign-language voice.
        setText('immSubtitles',sentence+'  ·  Suara '+(prefix==='id'?'Indonesia':'English')+' tidak tersedia pada browser ini.');
        state.subtitleTimer=setTimeout(nextSentence,Math.max(3500,sentence.length*72));return;
      }
      state.utter=u;
      u.onend=()=>{if(state.utter===u)nextSentence();};
      u.onerror=()=>{if(state.utter===u)state.subtitleTimer=setTimeout(nextSentence,4000);};
      try{window.speechSynthesis.speak(u);}catch{state.subtitleTimer=setTimeout(nextSentence,4600);}
    }else{
      state.subtitleTimer=setTimeout(nextSentence,Math.max(4300,sentence.length*74));
    }
  }
  function play(){
    if(state.playing){stopNarration();setText('immSubtitles','Narasi dijeda. Tekan mulai untuk mengulang.');return;}
    stopNarration();state.playing=true;state.step=0;setText('immPlay','Ⅱ Hentikan cerita');nextSentence();
  }
  function showMap(){
    stopNarration();document.querySelector('[data-page="peta"]')?.click();
    setTimeout(()=>{
      const c=chapters[state.i];const input=$('searchPOI');if(!input)return;
      input.value=c.search;input.dispatchEvent(new Event('input',{bubbles:true}));
      const match=window.POIS?.find?.(x=>x.id===c.mapId);
      if(match&&window.focusPOI)window.focusPOI(match.id);
    },280);
  }
  // ---------- Native WebGL geometry ----------
  const geometry=[];
  function tri(a,b,c,col){
    const ux=b[0]-a[0],uy=b[1]-a[1],uz=b[2]-a[2],vx=c[0]-a[0],vy=c[1]-a[1],vz=c[2]-a[2];
    let nx=uy*vz-uz*vy,ny=uz*vx-ux*vz,nz=ux*vy-uy*vx;const ll=Math.hypot(nx,ny,nz)||1;nx/=ll;ny/=ll;nz/=ll;
    [a,b,c].forEach(v=>geometry.push(v[0],v[1],v[2],nx,ny,nz,...col));
  }
  function quad(a,b,c,d,col){tri(a,b,c,col);tri(a,c,d,col);}
  function box(x,y,z,w,h,d,col){
    let x0=x-w/2,x1=x+w/2,y0=y,y1=y+h,z0=z-d/2,z1=z+d/2;
    quad([x0,y0,z1],[x1,y0,z1],[x1,y1,z1],[x0,y1,z1],col);
    quad([x1,y0,z0],[x0,y0,z0],[x0,y1,z0],[x1,y1,z0],col);
    quad([x0,y0,z0],[x0,y0,z1],[x0,y1,z1],[x0,y1,z0],col);
    quad([x1,y0,z1],[x1,y0,z0],[x1,y1,z0],[x1,y1,z1],col);
    quad([x0,y1,z1],[x1,y1,z1],[x1,y1,z0],[x0,y1,z0],col);
    quad([x0,y0,z0],[x1,y0,z0],[x1,y0,z1],[x0,y0,z1],col);
  }
  function pyramid(x,y,z,r,h,col,n=8){for(let i=0;i<n;i++){const a=2*Math.PI*i/n,b=2*Math.PI*(i+1)/n;tri([x+r*Math.cos(a),y,z+r*Math.sin(a)],[x+r*Math.cos(b),y,z+r*Math.sin(b)],[x,y+h,z],col)}}
  function slopingRoof(x,y,z,w,d,h){
    const dark=[.28,.17,.13],edge=[.49,.26,.18],half=w/2;
    const p0=[x-half,y,z-d/2],p1=[x+half,y,z-d/2],p2=[x+half,y,z+d/2],p3=[x-half,y,z+d/2];
    let r0=[x,y+h,z-d/2],r1=[x,y+h,z+d/2];
    quad(p0,p3,r1,r0,dark);quad(r0,r1,p2,p1,edge);tri(p3,p2,r1,dark);tri(p1,p0,r0,dark);
    box(x-half,y,z, .085,.1,d+.2,[.16,.1,.09]);box(x+half,y,z,.085,.1,d+.2,[.16,.1,.09]);
  }
  function house(x,z,size=1){
    const v=(n)=>n*size;
    for(const xx of [-.85,-.28,.28,.85])for(const zz of [-.49,.49])box(x+v(xx),0,z+v(zz),v(.14),v(1.15),v(.14),[.31,.22,.15]);
    box(x,v(1),z,v(2.15),v(1.12),v(1.37),[.47,.3,.21]);
    for(const xx of [-.88,-.53,-.18,.18,.53,.88])box(x+v(xx),v(1.01),z+v(.71),v(.055),v(1.04),v(.04),[.21,.15,.13]);
    box(x,v(1.01),z+v(.75),v(.4),v(.65),v(.06),[.17,.12,.11]);
    box(x,v(1.8),z+v(.77),v(.25),v(.3),v(.07),[.82,.67,.42]);
    slopingRoof(x,v(2.15),z,v(2.5),v(1.95),v(1.4));
    for(const zz of [-.82,.82]){box(x,v(2.16),z+v(zz),v(.075),v(1.45),v(.07),[.61,.34,.22]);}
  }
  function tree(x,z,s){box(x,0,z,.12*s,.52*s,.12*s,[.36,.25,.16]);pyramid(x,.4*s,z,.57*s,1.85*s,[.19+.05*(s%1),.43,.33],7)}
  function landscape(){
    // Lake mesh, dark-to-light rectangular strips
    for(let z=-24;z<24;z+=2){const c=[.11+Math.abs(z)/800,.31+Math.abs(z)/400,.43+Math.abs(z)/350];quad([-29,-.43,z],[-29,-.43,z+2],[29,-.43,z+2],[29,-.43,z],c)}
    const ring=28;
    // island with irregular edges and a visible layered slope
    for(let i=0;i<ring;i++){
      const a=i/ring*Math.PI*2,b=(i+1)/ring*Math.PI*2;
      let ra=8.3*(1+.09*Math.sin(i*2.7)),rb=8.3*(1+.09*Math.sin((i+1)*2.7));
      const A=[ra*Math.cos(a),-.3,ra*.63*Math.sin(a)],B=[rb*Math.cos(b),-.3,rb*.63*Math.sin(b)];
      const C=[ra*.78*Math.cos(a),.5+Math.cos(a*3)*.06,ra*.52*Math.sin(a)],D=[rb*.78*Math.cos(b),.5+Math.cos(b*3)*.06,rb*.52*Math.sin(b)];
      quad(A,B,D,C,[.34,.44,.26]);tri([0,.54,0],C,D,[.33+.03*(i%3),.47+.02*(i%2),.32]);
    }
    for(let i=0;i<50;i++){const a=i*2.39996,r=2.6+((i*29)%39)/10;let x=Math.cos(a)*r,z=Math.sin(a)*r*.55;if(Math.abs(x)<2.4&&Math.abs(z)<2)continue;tree(x,z,.48+((i*7)%12)/18)}
    // foothills on background edge
    for(let i=0;i<21;i++){const a=2*Math.PI*i/21,r=19+3*Math.sin(i*4);pyramid(r*Math.cos(a),-.48,r*.77*Math.sin(a),3+(i%4),2+(i%5)*.7,[.2,.42+.015*(i%3),.38],7)}
    house(0,0,1.0);house(-3.2,1.1,.65);house(3.05,-1.6,.7);
    // small village path
    box(0,.48,2.8,.55,.012,4.1,[.64,.6,.43]);
    // loom exhibit to side: frame, yarns, cloth, patterned bands
    const X=7;
    for(const x of [-1.14,1.14])box(X+x,.55,0,.14,3.25,.17,[.4,.25,.14]);
    box(X,3.75,0,2.45,.16,.21,[.43,.27,.16]);box(X,.55,0,2.45,.18,.21,[.43,.27,.16]);
    const cloth=[.58,.15,.15],cream=[.92,.78,.49],black=[.14,.17,.17];
    box(X,1.03,.035,1.9,2.45,.035,cloth);
    for(let j=0;j<13;j++){const y=1.08+j*.19;let col=j%4===0?cream:j%4===1?black:j%4===2?cloth:cream;box(X,y,.077,1.91,.035,.006,col)}
    for(let i=-8;i<=8;i++){box(X+i*.105,1.03,.085,.023,2.45,.007,i%3===0?cream:black)}
    for(const xx of [-.8,.8])for(const yy of [1.22,3.17]){
      const x=X+xx,y=yy;
      quad([x-.17,y,.095],[x,y+.16,.095],[x+.17,y,.095],[x,y-.16,.095],cream);
    }
  }
  function identity(){return [1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1]}
  function perspective(fov,asp,n,f){const t=1/Math.tan(fov/2);return [t/asp,0,0,0, 0,t,0,0, 0,0,(f+n)/(n-f),-1, 0,0,2*f*n/(n-f),0]}
  function lookAt(eye,at){
    let z=eye.map((e,i)=>e-at[i]);let l=Math.hypot(...z);z=z.map(e=>e/l);
    let x=[z[2],0,-z[0]];l=Math.hypot(...x);x=x.map(e=>e/l);
    let y=[z[1]*x[2]-z[2]*x[1],z[2]*x[0]-z[0]*x[2],z[0]*x[1]-z[1]*x[0]];
    return [x[0],y[0],z[0],0,x[1],y[1],z[1],0,x[2],y[2],z[2],0,-x.reduce((s,v,i)=>s+v*eye[i],0),-y.reduce((s,v,i)=>s+v*eye[i],0),-z.reduce((s,v,i)=>s+v*eye[i],0),1]
  }
  function mul(a,b){let out=new Array(16);for(let col=0;col<4;col++)for(let row=0;row<4;row++){out[col*4+row]=0;for(let k=0;k<4;k++)out[col*4+row]+=a[k*4+row]*b[col*4+k]}return out;}
  function compile(gl,type,src){let s=gl.createShader(type);gl.shaderSource(s,src);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(s));return s}
  function initGL(){
    state.canvas=$('immCanvas');let gl=state.canvas.getContext('webgl',{alpha:false,antialias:true,powerPreference:'low-power'});
    if(!gl)throw Error('WebGL tidak tersedia');state.gl=gl;
    const vert=`attribute vec3 aPosition;attribute vec3 aNormal;attribute vec3 aColor;uniform mat4 uMVP;uniform float uTime;varying vec3 vColor;varying float vHeight;varying vec3 vPos;void main(){vec3 pos=aPosition;if(aPosition.y<-.4)pos.y+=.035*sin(pos.x*1.7+uTime*.8)*cos(pos.z*1.5+uTime);gl_Position=uMVP*vec4(pos,1.);vHeight=aPosition.y;vPos=pos;float light=.70+.30*max(dot(normalize(aNormal),normalize(vec3(-.5,1.,.7))),0.);vColor=aColor*light;}`;
    const frag=`precision mediump float;uniform float uTime;varying vec3 vColor;varying float vHeight;varying vec3 vPos;void main(){vec3 c=mix(vColor,vec3(.94,.92,.83),.035);if(vHeight<-.4){float glimmer=pow(max(0.,sin(vPos.x*.85+uTime*.8)*sin(vPos.z*1.2-uTime*.6)),6.);c+=vec3(.15,.24,.2)*glimmer;}gl_FragColor=vec4(c,1.);}`;
    const program=gl.createProgram();gl.attachShader(program,compile(gl,gl.VERTEX_SHADER,vert));gl.attachShader(program,compile(gl,gl.FRAGMENT_SHADER,frag));gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error(gl.getProgramInfoLog(program));gl.useProgram(program);
    landscape();const buff=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buff);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(geometry),gl.STATIC_DRAW);
    const stride=9*4;for(const [name,size,offset] of [['aPosition',3,0],['aNormal',3,12],['aColor',3,24]]){const loc=gl.getAttribLocation(program,name);gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,size,gl.FLOAT,false,stride,offset)}
    state.renderer={loc:gl.getUniformLocation(program,'uMVP'),timeLoc:gl.getUniformLocation(program,'uTime'),count:geometry.length/9};
    isWebGL=true;setText('immRenderStatus','WEBGL · 3D AKTIF');
    requestAnimationFrame(draw);
  }
  function draw(){
    state.raf=requestAnimationFrame(draw);
    if(!$('immersive')?.classList.contains('active'))return;
    const canvas=state.canvas,gl=state.gl;const w=canvas.clientWidth,h=canvas.clientHeight;if(w<2||h<2)return;
    const scale=Math.min(2,window.devicePixelRatio||1);
    const rw=Math.floor(w*scale),rh=Math.floor(h*scale);
    if(canvas.width!==rw||canvas.height!==rh){canvas.width=rw;canvas.height=rh;gl.viewport(0,0,rw,rh)}
    const lerp=(a,b)=>cubic(a,b,.065);for(let key of ['dist','elev','angle','tx','ty','tz'])state[key]=lerp(state[key],state.target[key]);
    const at=[state.tx,state.ty,state.tz], horiz=state.dist*Math.cos(state.elev);
    const eye=[state.tx+Math.sin(state.angle)*horiz,state.ty+Math.sin(state.elev)*state.dist,state.tz+Math.cos(state.angle)*horiz];
    gl.clearColor(.77,.87,.86,1);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);gl.enable(gl.DEPTH_TEST);gl.disable(gl.CULL_FACE);
    gl.uniformMatrix4fv(state.renderer.loc,false,new Float32Array(mul(perspective(Math.PI/3,w/h,.05,120),lookAt(eye,at))));
    gl.uniform1f(state.renderer.timeLoc,performance.now()/1000);gl.drawArrays(gl.TRIANGLES,0,state.renderer.count);
  }
  function initInput(){
    const canvas=$('immCanvas');canvas.addEventListener('pointerdown',e=>{state.drag=true;state.lastX=e.clientX;state.lastY=e.clientY;canvas.setPointerCapture(e.pointerId);});
    canvas.addEventListener('pointermove',e=>{if(!state.drag)return;let dx=e.clientX-state.lastX,dy=e.clientY-state.lastY;state.lastX=e.clientX;state.lastY=e.clientY;state.target.angle+=dx*.008;state.target.elev=Math.max(.12,Math.min(1.48,state.target.elev+dy*.005));});
    canvas.addEventListener('pointerup',()=>state.drag=false);canvas.addEventListener('pointercancel',()=>state.drag=false);
    canvas.addEventListener('wheel',e=>{e.preventDefault();state.target.dist=Math.max(3.8,Math.min(37,state.target.dist*(e.deltaY>0?1.08:.92)));},{passive:false});
  }
  function bootstrap(){
    if(!$('immStage'))return;
    $('immChapters').innerHTML=chapters.map((c,i)=>`<button type="button" data-chapter="${i}"><span>${String(i+1).padStart(2,'0')}</span>${c.heading}</button>`).join('');
    $('immChapters').addEventListener('click',e=>{const b=e.target.closest('[data-chapter]');if(b)navigate(Number(b.dataset.chapter))});
    $('immPrev').onclick=()=>navigate(Math.max(0,state.i-1));$('immNext').onclick=()=>navigate((state.i+1)%chapters.length);
    $('immPlay').onclick=play; const voiceSel=document.getElementById('nusaVoiceChoice'); if(voiceSel){const fill=()=>{const lang=language();const voices=speechSynthesis.getVoices().filter(v=>v.lang.toLowerCase().startsWith(lang));const selected=localStorage.getItem('nusaVoice_'+lang)||'';voiceSel.replaceChildren();voiceSel.add(new Option(lang==='en'?'Best available English voice':'Suara Indonesia terbaik',''));voices.forEach(v=>voiceSel.add(new Option(v.name+(v.localService?' · offline':' · online'),v.name)));voiceSel.value=selected};if('speechSynthesis' in window){fill();speechSynthesis.addEventListener('voiceschanged',fill);}voiceSel.addEventListener('change',()=>localStorage.setItem('nusaVoice_'+language(),voiceSel.value));document.addEventListener('click',e=>{if(e.target.closest('.lang-toggle,.lang-pill,[data-lang]'))setTimeout(fill,80)});}$('immToMap').onclick=showMap;
    $('immAudio').onclick=()=>{state.sound=!state.sound;$('immAudio').setAttribute('aria-pressed',String(state.sound));setText('immAudio',state.sound?'♫ Suara aktif':'♫ Subtitle saja');if(state.playing){stopNarration();play();}};
    if($('immReset')) $('immReset').onclick=()=>{state.target={...chapters[state.i].view}};
    // Stop speech on departure, avoid persistent narration on other pages.
    document.addEventListener('click',e=>{let b=e.target.closest('[data-page]');if(b&&b.dataset.page!=='immersive')stopNarration()});
    window.addEventListener('pagehide',stopNarration);navigate(0); setText('immRenderStatus','MEDIA DOKUMENTER');
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bootstrap);else bootstrap();
})();
