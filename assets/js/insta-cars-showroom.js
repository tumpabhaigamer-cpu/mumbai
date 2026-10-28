import * as THREE from 'three';

const canvas=document.querySelector('#car-canvas');
const stage=document.querySelector('#showroom');
const motionButton=document.querySelector('#motion-toggle');
const hero=document.querySelector('.hero');
const progressFill=document.querySelector('#scroll-fill');
const progressStep=document.querySelector('#scroll-step');
const progressCount=document.querySelector('#scroll-count');
if(!canvas||!stage||!hero)return;

const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)');
let renderer,scene,camera,carRoot,bodyMaterial,wheels=[],keyLight,rimLight,running=!reduceMotion.matches,visible=true,dragging=false,lastX=0,scrollProgress=0,dragRotation=0;
const initialRotation=-.38;
const clamp=(value,min,max)=>Math.max(min,Math.min(max,value));
const chapters=['01 / FRONT THREE-QUARTER','02 / SIDE PROFILE','03 / REAR THREE-QUARTER'];
function readScroll(){const travel=hero.offsetHeight-window.innerHeight;scrollProgress=reduceMotion.matches||travel<=0?0:clamp(-hero.getBoundingClientRect().top/travel,0,1);const chapter=Math.min(2,Math.floor(scrollProgress*3));if(progressFill)progressFill.style.transform=`scaleX(${scrollProgress})`;if(progressStep)progressStep.textContent=chapters[chapter];if(progressCount)progressCount.innerHTML=`0${chapter+1}<span> / 03</span>`;}
function applyScrollRotation(){carRoot.rotation.y=initialRotation+dragRotation+(reduceMotion.matches?0:scrollProgress*Math.PI*2);}
function updateView(progress){camera.position.set(4.7+Math.sin(progress*Math.PI*2)*.34,2.65+Math.sin(progress*Math.PI)*.18,6.5-Math.sin(progress*Math.PI)*.7);camera.lookAt(Math.sin(progress*Math.PI*2)*.12,.92,0);keyLight.position.x=-3+Math.sin(progress*Math.PI*2)*2;rimLight.intensity=2.1+.8*Math.sin(progress*Math.PI);}
function material(color,metalness,roughness){return new THREE.MeshStandardMaterial({color,metalness,roughness});}

function makeCar(){
  carRoot=new THREE.Group();const car=new THREE.Group();carRoot.add(car);
  bodyMaterial=new THREE.MeshPhysicalMaterial({color:0xc4cec8,metalness:.82,roughness:.22,clearcoat:.92,clearcoatRoughness:.17});
  const shape=new THREE.Shape();shape.moveTo(-2.08,.42);shape.lineTo(-2,.70);shape.lineTo(-1.72,.83);shape.lineTo(-1.03,.97);shape.lineTo(-.63,1.46);shape.quadraticCurveTo(-.42,1.68,-.10,1.69);shape.lineTo(.64,1.62);shape.quadraticCurveTo(.94,1.56,1.13,1.14);shape.lineTo(1.42,.96);shape.lineTo(1.94,.83);shape.lineTo(2.09,.63);shape.lineTo(2.09,.40);shape.closePath();
  const geo=new THREE.ExtrudeGeometry(shape,{depth:1.22,bevelEnabled:true,bevelSegments:4,steps:1,bevelSize:.075,bevelThickness:.06,curveSegments:12});geo.translate(0,0,-.61);car.add(new THREE.Mesh(geo,bodyMaterial));
  const chassis=new THREE.Mesh(new THREE.BoxGeometry(3.65,.28,1.26),material(0x111715,.35,.42));chassis.position.set(0,.43,0);car.add(chassis);
  const glass=new THREE.MeshPhysicalMaterial({color:0x1b2927,metalness:.28,roughness:.13,clearcoat:1,transparent:true,opacity:.95});
  function windowShape(points,z){const s=new THREE.Shape();s.moveTo(points[0][0],points[0][1]);for(let i=1;i<points.length;i++)s.lineTo(points[i][0],points[i][1]);s.closePath();const g=new THREE.ExtrudeGeometry(s,{depth:.025,bevelEnabled:false});g.translate(0,0,z);car.add(new THREE.Mesh(g,glass));}
  windowShape([[-.91,1.04],[-.57,1.47],[-.10,1.51],[-.10,1.04]],.62);windowShape([[-.01,1.51],[.55,1.47],[.93,1.12],[.93,1.04],[-.01,1.04]],.62);
  windowShape([[-.91,1.04],[-.57,1.47],[-.10,1.51],[-.10,1.04]],-.645);windowShape([[-.01,1.51],[.55,1.47],[.93,1.12],[.93,1.04],[-.01,1.04]],-.645);
  const trim=material(0x8d9c93,.8,.24);[-.10,.98].forEach(function(x){const p=new THREE.Mesh(new THREE.BoxGeometry(.045,.55,1.29),trim);p.position.set(x,1.27,0);p.rotation.z=x<0?-.48:.52;car.add(p);});
  const tireMat=material(0x090d0c,.05,.82),rimMat=material(0xc4d0c8,.92,.2),hubMat=material(0x66746b,.8,.25);
  function wheel(x,z){const w=new THREE.Group();w.position.set(x,.48,z);w.rotation.x=Math.PI/2;car.add(w);const tire=new THREE.Mesh(new THREE.CylinderGeometry(.405,.405,.22,40),tireMat);w.add(tire);const ring=new THREE.Mesh(new THREE.TorusGeometry(.29,.035,10,32),rimMat);ring.position.y=.116;ring.rotation.x=-Math.PI/2;w.add(ring);const inner=new THREE.Mesh(new THREE.CylinderGeometry(.20,.20,.012,32),hubMat);inner.position.y=.118;w.add(inner);const center=new THREE.Mesh(new THREE.CylinderGeometry(.085,.085,.02,24),rimMat);center.position.y=.13;w.add(center);for(let i=0;i<8;i++){const a=i*Math.PI/4;const spoke=new THREE.Mesh(new THREE.BoxGeometry(.025,.018,.28),rimMat);spoke.position.set(Math.sin(a)*.11,.13,Math.cos(a)*.11);spoke.rotation.y=a;w.add(spoke);}wheels.push(w);}
  [-1.22,1.28].forEach(function(x){wheel(x,.69);wheel(x,-.69);});
  const headlight=new THREE.MeshStandardMaterial({color:0xe8ffe7,emissive:0xc8fc66,emissiveIntensity:1.3,roughness:.2});[-.39,.39].forEach(function(z){const l=new THREE.Mesh(new THREE.BoxGeometry(.18,.08,.04),headlight);l.position.set(2.02,.70,z);car.add(l);});
  const tail=new THREE.MeshStandardMaterial({color:0xff633c,emissive:0xb32916,emissiveIntensity:.55});[-.39,.39].forEach(function(z){const l=new THREE.Mesh(new THREE.BoxGeometry(.035,.1,.22),tail);l.position.set(-2,.68,z);car.add(l);});
  [-.73,.73].forEach(function(z){const mirror=new THREE.Mesh(new THREE.SphereGeometry(.11,16,12),bodyMaterial);mirror.scale.set(1.3,.65,.8);mirror.position.set(.93,1.04,z);car.add(mirror);});
  const floor=new THREE.Mesh(new THREE.CircleGeometry(3.1,64),new THREE.MeshBasicMaterial({color:0x6c8d68,transparent:true,opacity:.08,side:THREE.DoubleSide}));floor.rotation.x=-Math.PI/2;floor.position.y=.015;car.add(floor);
  const ring=new THREE.Mesh(new THREE.TorusGeometry(2.66,.008,4,100),new THREE.MeshBasicMaterial({color:0xc8fc66,transparent:true,opacity:.42}));ring.rotation.x=Math.PI/2;ring.position.y=.02;car.add(ring);carRoot.rotation.y=initialRotation;scene.add(carRoot);
}

try{
  renderer=new THREE.WebGLRenderer({canvas:canvas,alpha:true,antialias:true,powerPreference:'low-power'});renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.6));renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.15;
  scene=new THREE.Scene();camera=new THREE.PerspectiveCamera(35,1,.1,80);camera.position.set(4.7,2.65,6.5);camera.lookAt(0,.92,0);scene.add(new THREE.HemisphereLight(0xd9f1dc,0x101512,2));keyLight=new THREE.DirectionalLight(0xeaffed,3);keyLight.position.set(-3,6,4);scene.add(keyLight);rimLight=new THREE.DirectionalLight(0xc8fc66,2.1);rimLight.position.set(2,3,-5);scene.add(rimLight);const fill=new THREE.PointLight(0x89a9ff,.7,15);fill.position.set(3,1.5,4);scene.add(fill);makeCar();
  const resize=new ResizeObserver(function(entries){const b=entries[0].contentRect;if(!b.width||!b.height)return;renderer.setSize(b.width,b.height,false);camera.aspect=b.width/b.height;camera.updateProjectionMatrix();renderer.render(scene,camera);});resize.observe(stage);stage.classList.add('webgl-ready');let start=performance.now();
  function render(now){if(!renderer||!visible)return;const t=(now-start)/1000,p=reduceMotion.matches?0:scrollProgress;updateView(p);if(!dragging){carRoot.rotation.y=initialRotation+dragRotation+p*Math.PI*2+(running?Math.sin(t*.22)*.13:0);if(running){carRoot.position.y=.018+Math.sin(t*.8)*.014;wheels.forEach(function(w){w.rotation.y=Math.sin(t*.3)*.012;});}}renderer.render(scene,camera);}
  const visibility=new IntersectionObserver(function(entries){visible=entries[0].isIntersecting;if(!document.hidden){renderer.setAnimationLoop(visible&&running?render:null);if(visible&&!running)renderer.render(scene,camera);}},{threshold:.01});visibility.observe(stage);document.addEventListener('visibilitychange',function(){renderer.setAnimationLoop(!document.hidden&&visible&&running?render:null);if(!document.hidden&&visible&&!running)renderer.render(scene,camera);});
  function updateMotion(){motionButton.setAttribute('aria-pressed',String(!running));motionButton.setAttribute('aria-label',running?'Pause showroom animation':'Play showroom animation');motionButton.querySelector('.motion-label').textContent=running?'PAUSE MOTION':'PLAY MOTION';if(!running){carRoot.position.y=0;renderer.setAnimationLoop(null);renderer.render(scene,camera);}else{renderer.setAnimationLoop(visible&&!document.hidden?render:null);}}
  readScroll();window.addEventListener('scroll',function(){readScroll();if(!running&&visible){updateView(reduceMotion.matches?0:scrollProgress);applyScrollRotation();renderer.render(scene,camera);}},{passive:true});window.addEventListener('resize',readScroll,{passive:true});motionButton.addEventListener('click',function(){running=!running;updateMotion();});stage.addEventListener('pointerdown',function(e){if(e.target!==canvas)return;dragging=true;lastX=e.clientX;canvas.setPointerCapture(e.pointerId);});canvas.addEventListener('pointermove',function(e){if(!dragging)return;const dx=e.clientX-lastX;dragRotation+=dx*.008;applyScrollRotation();lastX=e.clientX;renderer.render(scene,camera);});function release(){dragging=false;}canvas.addEventListener('pointerup',release);canvas.addEventListener('pointercancel',release);canvas.addEventListener('lostpointercapture',release);reduceMotion.addEventListener('change',function(e){running=!e.matches;readScroll();updateMotion();});updateMotion();
}catch(error){stage.classList.add('webgl-failed');console.warn('3D showroom fallback active.',error);}

document.querySelectorAll('.reveal').forEach(function(el){if(!('IntersectionObserver'in window)||reduceMotion.matches){el.classList.add('in');return;}const io=new IntersectionObserver(function(entries){entries.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});},{threshold:.12,rootMargin:'0px 0px -5% 0px'});io.observe(el);});
