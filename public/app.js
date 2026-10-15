/* BÉ VUI HỌC V2.4 — static HTTPS/PWA demonstration. No AI or cloud storage. */
(() => {
'use strict';
const KEY = 'be-vui-hoc-v24-family';
const OLD = 'be-vui-hoc-v22-family';
const AUDIO = Object.fromEntries('welcome vi0 vi1 vi2 vi3 vi4 vi5 vi6 viDone a cam right retry traceDone math0 math1 math2 math3 math4 math5 mathDone bye'.split(' ').map(k => [k, `./audio/${k}.mp3`]));
const TEACHER = './teacher.svg';
const $ = selector => document.querySelector(selector);
const safe = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const blankKid = n => ({ name:`Bé ${n}`, stars:0, finished:{}, attempts:0, correct:0 });
const init = () => ({active:0,kids:[blankKid(1),blankKid(2)],speed:1});
function load(){
 try{
  const raw=localStorage.getItem(KEY)||localStorage.getItem(OLD);
  if(!raw)return init();
  const s=JSON.parse(raw);if(!Array.isArray(s.kids)||s.kids.length!==2)return init();
  return {active:s.active===1?1:0,speed:Math.max(.8,Math.min(1.1,Number(s.speed)||1)),kids:s.kids.map((k,i)=>({name:String(k.name||`Bé ${i+1}`).slice(0,24),stars:Math.max(0,Number(k.stars)||0),finished:k.finished&&typeof k.finished==='object'?k.finished:{},attempts:Number(k.attempts)||0,correct:Number(k.correct)||0}))};
 }catch{return init()}
}
const lessons={
 vi:{name:'Làm quen chữ a',symbol:'🔤',steps:[
  {type:'show',title:'Làm quen chữ a',say:'vi0',caption:'Đây là chữ a. Áo. Con nhìn thật kỹ chữ a nhé!',board:'letter'},
  {type:'show',title:'Cô đọc mẫu',say:'vi1',caption:'Con hãy đọc theo cô âm a nhé!',board:'letter'},
  {type:'listen',title:'Tai nghe tinh',say:'vi2',caption:'Con hãy đọc theo cô âm a nhé!',board:'cam'},
  {type:'choose',title:'Mắt tinh tìm chữ',say:'vi3',caption:'Con tìm chữ a nhé!',board:'letter',options:['o','a','ă'],answer:'a'},
  {type:'choose',title:'Chữ a trong tiếng cam',say:'vi4',caption:'Con tìm chữ a nhé!',board:'cam',options:['b','a','o'],answer:'a'},
  {type:'trace',title:'Tay khéo tập tô',say:'vi5',caption:'Con dùng ngón tay tô theo chữ a.',board:'trace'},
  {type:'choose',title:'Bé nhớ chữ a',say:'vi6',caption:'Con tìm chữ a nhé!',board:'letter',options:['ă','o','a'],answer:'a'},
  {type:'done',title:'Con đã hoàn thành!',say:'viDone',caption:'Chúc mừng con đã học xong bài! Con rất chăm chỉ!',board:'trophy'}
 ]},
 math:{name:'Bé tập đếm 1–3',symbol:'🍎',steps:[
  {type:'show',title:'Làm quen số 1',say:'math0',caption:'Đây là số một. Con cùng đếm nào!',board:'one'},
  {type:'choose',title:'Bé đếm táo',say:'math1',caption:'Có bao nhiêu quả táo?',board:'apples',options:['2','3','1'],answer:'3'},
  {type:'choose',title:'Bé đếm chim',say:'math2',caption:'Đây là số hai. Con cùng đếm nào!',board:'birds',options:['1','3','2'],answer:'2'},
  {type:'choose',title:'Ba ngôi sao',say:'math3',caption:'Con nghe và chọn số ba nhé!',board:'stars',options:['1','3','2'],answer:'3'},
  {type:'choose',title:'Cộng vui',say:'math4',caption:'Một cộng một bằng mấy?',board:'add',options:['3','1','2'],answer:'2'},
  {type:'choose',title:'Cùng ôn đếm',say:'math5',caption:'Con nghe và chọn số ba nhé!',board:'leaves',options:['3','2','1'],answer:'3'},
  {type:'done',title:'Con đã hoàn thành!',say:'mathDone',caption:'Chúc mừng con đã học xong bài! Con rất chăm chỉ!',board:'trophy'}
 ]}
};
let state=load(),screen='home',lessonId='vi',stepNum=0,solved=false,feedback='',traced=0,toastTimer=null,nowPlaying='',hasAudioError=false;
const audio = $('#teacherAudio');
const kid=()=>state.kids[state.active];
function save(){try{localStorage.setItem(KEY,JSON.stringify(state))}catch{toast('Không thể lưu tiến độ. Ba mẹ vui lòng kiểm tra bộ nhớ trình duyệt.')}}
function toast(txt){const el=$('#toast');el.textContent=txt;el.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('show'),3800)}
function setAudioStatus(text,kind='info'){
 const el=$('#audioStatus');if(el){el.textContent=text;el.dataset.status=kind;}
 const dot=$('#talkDot');if(dot)dot.textContent=kind==='playing'?'●':'';
 const portrait=$('.portrait');if(portrait)portrait.classList.toggle('speaking',kind==='playing');
 const help=$('#audioHelp');if(help)help.hidden=kind!=='error';
}
function stopAudio(){audio.pause();nowPlaying='';}
function playClip(id){
 const file=AUDIO[id];if(!file){setAudioStatus('Chưa có file âm thanh cho hoạt động này.','error');return;}
 hasAudioError=false;
 nowPlaying=id;
 try{
  audio.pause();audio.src=file;audio.load();audio.volume=1;audio.playbackRate=state.speed;
  setAudioStatus('⏳ Đang mở bài nghe…');
  const p=audio.play();
  if(p&&typeof p.catch==='function')p.catch(err=>{
   if(nowPlaying!==id)return;
   hasAudioError=true;setAudioStatus('⚠️ Chưa phát được tiếng. Hãy chạm “Nghe lại” hoặc mở tệp MP3 để thử.','error');
  });
 }catch{
  hasAudioError=true;setAudioStatus('⚠️ Trình duyệt không phát được MP3.','error');
 }
}
audio.addEventListener('playing',()=>{if(nowPlaying)setAudioStatus('🔊 Cô đang đọc…','playing')});
audio.addEventListener('ended',()=>setAudioStatus('✅ Con có thể nghe lại nhé.','done'));
audio.addEventListener('error',()=>{if(nowPlaying)setAudioStatus('⚠️ Không tải được âm thanh. Kiểm tra mạng hoặc tệp MP3.','error')});
audio.addEventListener('stalled',()=>{if(nowPlaying)setAudioStatus('⏳ Đang tải âm thanh…')});
function home(){
 const k=kid();
 return `<main class="home"><div class="page">
 <header class="header"><div class="logo"><span class="logo-emoji">🌈</span><span>Bé Vui Học<small>Lớp học của con</small></span></div><button class="parent-link" data-action="parent">⚙️ Ba mẹ</button></header>
 <section class="classroom" aria-label="Lớp học vui vẻ với cô giáo"><img src="./scene.svg" alt="Cô giáo đang vẫy tay chào trong lớp học tươi sáng"><div class="hello">Xin chào <b>${safe(k.name)}!</b> 🌞<small>Cô đang chờ con vào lớp</small></div></section>
 <nav class="kids" aria-label="Chọn bé học">${state.kids.map((p,i)=>`<button class="kid-tab ${i===state.active?'selected':''}" data-action="kid" data-id="${i}" aria-pressed="${i===state.active}">${i===0?'🐣':'🐰'} ${safe(p.name)}</button>`).join('')}</nav>
 <button class="btn-enter" data-action="start" data-id="${k.finished.vi?'math':'vi'}"><span>👩‍🏫</span><span><strong>VÀO LỚP CÙNG CÔ</strong><small>Chạm để nghe cô hướng dẫn</small></span><span aria-hidden="true">➜</span></button>
 <div class="quick-lessons"><button class="quick-card" data-action="start" data-id="vi"><span class="quick-art">🔤</span><strong>Học chữ a</strong><small>Nghe – nhìn – tập tô</small></button><button class="quick-card green" data-action="start" data-id="math"><span class="quick-art">🍎</span><strong>Đếm 1–3</strong><small>Đếm táo cùng cô</small></button></div>
 <button class="audio-test-home" data-action="audio-test">🔊 Kiểm tra tiếng cô giáo</button><div id="audioStatus" class="sound-status" aria-live="polite">Chạm nút loa để thử âm thanh.</div>
 <div class="stars-note">⭐ ${k.stars} ngôi sao của ${safe(k.name)} · Học vui mỗi ngày một chút 💛</div>
 </div></main>`;
}
function boardContent(b){
 switch(b){
  case 'letter':return `<div class="huge-letter" aria-label="Chữ a">a</div><div class="picture-word">👕 <span>áo</span></div>`;
  case 'cam':return `<div class="big-word"><span>c</span><b>a</b><span>m</span></div><div class="picture-word">🍊 cam</div>`;
  case 'trace':return `<div class="trace-wrap"><div class="trace-ghost">a</div><canvas id="tracePad" aria-label="Bảng tô chữ a bằng ngón tay"></canvas></div>`;
  case 'one':return `<div class="big-number">1</div><div class="objects">🍎</div>`;
  case 'apples':return `<div class="objects">🍎 🍎 🍎</div>`;
  case 'birds':return `<div class="objects">🐦 🐦</div>`;
  case 'stars':return `<div class="objects">⭐ ⭐ ⭐</div>`;
  case 'add':return `<div class="objects">🍎 <span class="plus">+</span> 🍎</div>`;
  case 'leaves':return `<div class="objects">🍃 🍃 🍃</div>`;
  default:return `<div class="award">🏆</div>`;
 }
}
function activity(s){
 if(s.type==='show')return `<div class="activity-intro">👀 Con nhìn lên bảng và nghe cô nhé!</div>`;
 if(s.type==='listen')return `<div class="listen-tiles"><button data-action="clip" data-id="a">🔊 Nghe âm a</button><button data-action="clip" data-id="cam">🔊 Nghe tiếng cam</button></div>`;
 if(s.type==='choose')return `<div class="choices" role="group" aria-label="Chọn đáp án">${s.options.map((o,i)=>`<button data-action="answer" data-id="${i}" class="answer" ${solved?'disabled':''}>${safe(o)}</button>`).join('')}</div><div id="feedback" class="feedback ${feedback?'visible':''}" aria-live="polite">${safe(feedback)}</div>`;
 if(s.type==='trace')return `<div class="trace-info"><span>✍️ Con tô chữ bằng ngón tay</span><button data-action="clear-trace">↺ Xóa nét</button></div>`;
 return '';
}
function lesson(){
 const L=lessons[lessonId],s=L.steps[stepNum],done=s.type==='done';
 return `<main class="lesson"><div class="lesson-shell"><header class="lesson-top"><button data-action="home" class="home-back" aria-label="Về trang chủ">🏠</button><div class="progress" aria-label="Bước ${stepNum+1} trên ${L.steps.length}">${L.steps.map((x,i)=>`<i class="${i<stepNum?'completed':i===stepNum?'current':''}"></i>`).join('')}</div><span class="lesson-count">${stepNum+1}/${L.steps.length}</span></header>
 <section class="learning-stage"><div class="talk-row"><img class="portrait" src="${TEACHER}" alt="Cô giáo"><div class="talk"><span id="talkDot" class="talk-dot"></span>${safe(s.caption)}</div></div>
 <div class="board"><div class="board-label">${safe(s.title)}</div>${boardContent(s.board)}</div>
 ${done?`<div class="end-block"><h1>Con giỏi lắm! 🌟</h1><p>Cô khen sự cố gắng của con.</p><button class="btn-next" data-action="home">🏠 Về lớp học</button><button class="btn-outline" data-action="repeat">↺ Học lại</button></div>`:
 `<div class="task-area">${activity(s)}</div><div class="controls"><button class="btn-listen" data-action="replay">🔊 Nghe cô</button><button class="btn-next" data-action="next" ${(['choose','trace'].includes(s.type)&&!solved)?'disabled':''}>${stepNum===L.steps.length-2?'Nhận sao ⭐':'Tiếp tục ➜'}</button></div>`}
 <div id="audioStatus" class="sound-status" aria-live="polite">Chạm “Nghe cô” nếu con muốn nghe lại.</div><div id="audioHelp" class="sound-help" hidden>Ba mẹ thử <a href="${AUDIO[s.say]}" target="_blank" rel="noopener">mở file MP3 trực tiếp</a> để kiểm tra âm thanh.</div></section></div></main>`;
}
function parent(){
 const rows=state.kids.map((p,i)=>`<div class="parent-kid"><label for="kidName${i}">${i===0?'🐣':'🐰'} Bé ${i+1}</label><input id="kidName${i}" maxlength="24" value="${safe(p.name)}"><button data-action="rename" data-id="${i}">Lưu tên</button><p>⭐ ${p.stars} sao · ${Object.keys(p.finished).length}/2 bài mẫu đã hoàn thành · ${p.correct}/${p.attempts} lần chọn đúng</p></div>`).join('');
 return `<main class="parent"><div class="parent-page"><button class="btn-outline" data-action="home">← Về lớp học</button><h1>👨‍👩‍👧‍👦 Góc ba mẹ</h1><p>Thiết lập dành cho người lớn, tách khỏi màn hình học của con.</p>
 <section class="parent-panel"><h2>Hai hồ sơ học tập</h2>${rows}</section>
 <section class="parent-panel"><h2>🔊 Kiểm tra âm thanh</h2><p>Cô giáo phát file MP3 từ website, không dùng giọng đọc trình duyệt. Hãy bấm nút để kiểm tra. Nếu không có tiếng, thử thanh phát bên dưới.</p><button class="btn-next" data-action="audio-test">🔊 Phát thử lời chào</button><div id="audioStatus" class="sound-status" aria-live="polite">Chưa kiểm tra</div><p class="native-label">Trình phát MP3 trực tiếp (dành cho ba mẹ):</p><audio controls preload="metadata" src="./audio/welcome.mp3" style="width:100%">Trình duyệt không hỗ trợ âm thanh.</audio><p class="help-note">Giọng MP3 hiện tại là bản tổng hợp thử nghiệm và chưa được kiểm chứng là giọng mẫu phát âm chuẩn. Bản này không phải cô giáo AI hội thoại.</p><label class="speed-label" for="speed">Tốc độ nghe: <span id="speedValue">${Math.round(state.speed*100)}%</span></label><input id="speed" type="range" min="0.8" max="1.1" step="0.05" value="${state.speed}"></section>
 <section class="parent-panel"><h2>💾 Sao lưu tiến độ</h2><p>Mỗi thiết bị lưu tiến độ riêng. Khi đổi điện thoại, ba mẹ có thể chuyển tệp JSON; chưa có đồng bộ đám mây.</p><div class="parent-buttons"><button class="btn-outline" data-action="backup">⬇️ Sao lưu</button><label class="upload">⬆️ Khôi phục <input id="restore" type="file" accept=".json,application/json" hidden></label></div></section>
 <section class="parent-panel"><h2>📱 Cài lên điện thoại</h2><p><b>Android:</b> mở địa chỉ HTTPS trên Chrome → menu ⋮ → Thêm vào màn hình chính / Cài đặt ứng dụng.</p><p><b>iPhone/iPad:</b> mở trên Safari → Chia sẻ → Thêm vào màn hình chính.</p><p><b>Windows:</b> mở trên Chrome/Edge → Cài đặt ứng dụng (nếu trình duyệt hỗ trợ).</p></section>
 <div class="version">BÉ VUI HỌC V2.4 · Hai bài mẫu: chữ a và đếm 1–3 · Không có tài khoản trực tuyến</div></div></main>`;
}
function render(){
 $('#app').innerHTML=screen==='home'?home():screen==='lesson'?lesson():parent();
 if(screen==='lesson'&&lessons[lessonId].steps[stepNum].type==='trace')setupTrace();
}
function start(id){if(!lessons[id])return;stopAudio();screen='lesson';lessonId=id;stepNum=0;solved=true;feedback='';render();playClip(lessons[id].steps[0].say);window.scrollTo(0,0)}
function next(){
 const L=lessons[lessonId],s=L.steps[stepNum];if(['choose','trace'].includes(s.type)&&!solved)return;
 if(stepNum+1>=L.steps.length)return;
 stepNum++;solved=!['choose','trace'].includes(L.steps[stepNum].type);feedback='';traced=0;
 if(L.steps[stepNum].type==='done'&&!kid().finished[lessonId]){kid().finished[lessonId]=Date.now();kid().stars+=3;save()}
 stopAudio();render();playClip(L.steps[stepNum].say);window.scrollTo(0,0);
}
function answer(index){
 const s=lessons[lessonId].steps[stepNum];if(s.type!=='choose'||solved)return;
 const pick=s.options[index];if(pick==null)return;kid().attempts++;
 if(pick===s.answer){kid().correct++;solved=true;feedback='🌟 Đúng rồi! Cô khen con!'}else feedback='💛 Con nhìn kỹ rồi thử lại nhé!';
 save();render();const el=$(`[data-action="answer"][data-id="${index}"]`);if(el)el.classList.add(pick===s.answer?'good':'try');
 playClip(pick===s.answer?'right':'retry');
}
function setupTrace(){
 const c=$('#tracePad');if(!c)return;const rect=c.getBoundingClientRect(),scale=Math.min(devicePixelRatio||1,2);
 c.width=Math.floor(rect.width*scale);c.height=Math.floor(rect.height*scale);
 const ctx=c.getContext('2d');ctx.scale(scale,scale);ctx.lineWidth=15;ctx.strokeStyle='#ec798f';ctx.lineCap='round';ctx.lineJoin='round';let drawing=false,last=null;
 const pos=e=>{const r=c.getBoundingClientRect();return{x:e.clientX-r.left,y:e.clientY-r.top}};
 c.addEventListener('pointerdown',e=>{drawing=true;last=pos(e);c.setPointerCapture(e.pointerId);e.preventDefault()});
 c.addEventListener('pointermove',e=>{if(!drawing)return;const p=pos(e);ctx.beginPath();ctx.moveTo(last.x,last.y);ctx.lineTo(p.x,p.y);ctx.stroke();traced+=Math.hypot(p.x-last.x,p.y-last.y);last=p;if(traced>125&&!solved){solved=true;const b=$('[data-action="next"]');if(b)b.disabled=false;}e.preventDefault()});
 c.addEventListener('pointerup',()=>{drawing=false;if(solved)toast('Tô xong rồi! Con bấm Tiếp tục nhé. ⭐')});
 c.addEventListener('pointercancel',()=>drawing=false);
}
function homeNow(){stopAudio();screen='home';render();window.scrollTo(0,0)}
function downloadProgress(){
 const data=JSON.stringify({format:'be-vui-hoc-progress',version:24,created:new Date().toISOString(),data:state},null,2),url=URL.createObjectURL(new Blob([data],{type:'application/json'}));
 const a=document.createElement('a');a.href=url;a.download='be-vui-hoc-tien-do.json';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1500);
}
async function restoreProgress(f){
 if(!f||f.size>100000)return toast('Tệp tiến độ không hợp lệ.');
 try{const x=JSON.parse(await f.text());if(x.format!=='be-vui-hoc-progress'||!Array.isArray(x.data?.kids)||x.data.kids.length!==2)throw Error('invalid');
  if(!confirm('Thay thế tiến độ hiện tại của cả hai bé?'))return;
  localStorage.setItem(KEY,JSON.stringify(x.data));state=load();render();toast('Đã khôi phục tiến độ.');
 }catch{toast('Không đọc được tệp tiến độ.');}
}
window.addEventListener('click',e=>{
 const el=e.target.closest('[data-action]');if(!el)return;
 const {action,id}=el.dataset;
 switch(action){
  case 'kid':state.active=id==='1'?1:0;save();render();break;
  case 'parent':stopAudio();screen='parent';render();window.scrollTo(0,0);break;
  case 'home':homeNow();break;
  case 'start':start(id);break;
  case 'next':next();break;
  case 'replay':playClip(lessons[lessonId].steps[stepNum].say);break;
  case 'audio-test':playClip('welcome');break;
  case 'clip':playClip(id);break;
  case 'answer':answer(Number(id));break;
  case 'clear-trace':traced=0;solved=false;render();break;
  case 'repeat':start(lessonId);break;
  case 'rename':{const s=$(`#kidName${id}`)?.value.trim();if(s){state.kids[Number(id)].name=s.slice(0,24);save();render();toast('Đã đổi tên bé.')}break;}
  case 'backup':downloadProgress();break;
 }
});
window.addEventListener('input',e=>{if(e.target.id==='speed'){state.speed=Number(e.target.value);save();const txt=$('#speedValue');if(txt)txt.textContent=Math.round(state.speed*100)+'%';if(!audio.paused)audio.playbackRate=state.speed;}});
window.addEventListener('change',e=>{if(e.target.id==='restore')restoreProgress(e.target.files[0])});
window.addEventListener('pagehide',stopAudio);
render();
if('serviceWorker' in navigator&&location.protocol==='https:')window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));
})();
