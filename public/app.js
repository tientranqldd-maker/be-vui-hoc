/* BÉ VUI HỌC V2.4.1 — verified speech inputs; obsolete demo voices are disabled. */
(() => {
'use strict';
const KEY = 'be-vui-hoc-v24-family';
const VOICE_PREF_KEY = 'be-vui-hoc-voice-v241';
const OLD = 'be-vui-hoc-v22-family';
const CLIPS = {
 "welcome": "Xin chào con! Cô rất vui được học cùng con hôm nay.",
 "vi0": "Hôm nay cô và con học chữ a. Con nhìn lên bảng nhé.",
 "vi1": "Đây là chữ a. Con nghe cô đọc: a.",
 "vi2": "Con hãy đọc âm a theo cô nhé.",
 "vi3": "Con hãy tìm chữ a trong ba chữ trên màn hình.",
 "vi4": "Con hãy tìm chữ a trong tiếng cam nhé.",
 "vi5": "Bây giờ, con dùng ngón tay tô chữ a nhé.",
 "vi6": "Con có nhận ra chữ a không? Hãy chọn chữ a.",
 "viDone": "Con hoàn thành bài rồi! Cô khen con đã cố gắng.",
 "a": "a",
 "cam": "cam",
 "right": "Đúng rồi! Con giỏi lắm!",
 "retry": "Con thử lại nhé. Cô tin con làm được!",
 "traceDone": "Con tô rất chăm chỉ. Mình học tiếp nhé!",
 "math0": "Hôm nay mình cùng học đếm. Đây là số một.",
 "math1": "Con nhìn lên bảng. Có bao nhiêu quả táo?",
 "math2": "Con đếm xem có bao nhiêu chú chim nhé.",
 "math3": "Con đếm số ngôi sao rồi chọn đáp án nhé.",
 "math4": "Một cộng một bằng mấy? Con chọn đáp án nhé.",
 "math5": "Con cùng cô đếm những chiếc lá nhé.",
 "mathDone": "Hôm nay con học đếm rất chăm chỉ. Cô khen con!",
 "bye": "Hẹn gặp lại con trong buổi học sau nhé."
};
const AUDIO = Object.fromEntries(Object.keys(CLIPS).map(k=>[k,`./audio-approved/${k}.mp3`]));
const approved = {}; const localVoiceURLs = {}; const localVoiceBlobs = {};
let voiceMode = localStorage.getItem(VOICE_PREF_KEY) || 'approved';
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
let recorder=null, recordingId=null, recordingStream=null;
const audio = $('#teacherAudio');
const kid=()=>state.kids[state.active];
function save(){try{localStorage.setItem(KEY,JSON.stringify(state))}catch{toast('Không thể lưu tiến độ. Ba mẹ vui lòng kiểm tra bộ nhớ trình duyệt.')}}
function toast(txt){const el=$('#toast');el.textContent=txt;el.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('show'),3800)}
function setAudioStatus(message,kind='info'){
 const el=$('#audioStatus');if(el){el.textContent=message;el.dataset.status=kind;}
 const portrait=$('.portrait');if(portrait)portrait.classList.toggle('speaking',kind==='playing');
 const dot=$('#talkDot');if(dot)dot.textContent=kind==='playing'?'●':'';
}
function stopAudio(){
 audio.pause();nowPlaying='';
 try{window.speechSynthesis?.cancel()}catch{}
}
function sourceFor(id){
 if(localVoiceURLs[id])return localVoiceURLs[id];
 if(approved[id])return AUDIO[id];
 return null;
}
function getVietnameseVoice(){
 const voices=window.speechSynthesis?.getVoices?.()||[];
 return voices.find(v=>v.lang.toLowerCase()==='vi-vn')||voices.find(v=>v.lang.toLowerCase().startsWith('vi'))||null;
}
function speakBrowser(id){
 const voice=getVietnameseVoice();
 if(!voice){setAudioStatus('⚠️ Máy chưa có giọng đọc tiếng Việt. Ba mẹ hãy thêm bản ghi âm ở Góc ba mẹ.','error');return;}
 try{
  window.speechSynthesis.cancel();const ut=new SpeechSynthesisUtterance(CLIPS[id]);
  ut.lang='vi-VN'; ut.voice=voice;ut.rate=Math.min(.96,Math.max(.72,state.speed*.86));ut.pitch=1;ut.volume=1;
  ut.onstart=()=>setAudioStatus(`🔊 Đang đọc bằng giọng ${voice.name}. Ba mẹ cần kiểm tra độ rõ.`, 'playing');
  ut.onend=()=>setAudioStatus('Đã đọc xong. Chạm nghe lại nếu cần.','done');
  ut.onerror=()=>setAudioStatus('⚠️ Giọng đọc trên máy không hoạt động. Hãy dùng giọng ghi âm.','error');
  window.speechSynthesis.speak(ut);
 }catch{setAudioStatus('⚠️ Trình duyệt không hỗ trợ đọc tiếng Việt.','error')}
}
function playClip(id){
 if(!CLIPS[id]){setAudioStatus('Chưa có nội dung giọng đọc cho bước này.','error');return;}
 stopAudio();nowPlaying=id;
 if(voiceMode==='browser')return speakBrowser(id);
 const url=sourceFor(id);
 if(!url){setAudioStatus('🔇 Chưa có giọng cô giáo rõ ràng cho bài này. Ba mẹ hãy bổ sung ở Góc ba mẹ.','error');return;}
 try{
  audio.src=url;audio.volume=1;audio.playbackRate=state.speed;audio.load();
  setAudioStatus('⏳ Đang mở giọng cô giáo…');
  const p=audio.play();if(p?.catch)p.catch(()=>{if(nowPlaying===id)setAudioStatus('⚠️ Không phát được bản ghi âm. Ba mẹ thử trong Góc ba mẹ.','error')});
 }catch{setAudioStatus('⚠️ Không thể mở bản ghi âm.','error')}
}
function playTone(){
 stopAudio();nowPlaying='tone';
 try{audio.src='./audio/test-tone.mp3?v=241';audio.load();audio.volume=1;audio.playbackRate=1;
 setAudioStatus('⏳ Đang kiểm tra loa…');
 const p=audio.play();if(p?.catch)p.catch(()=>setAudioStatus('⚠️ Không phát được âm thanh kiểm tra.','error'));
 }catch{setAudioStatus('⚠️ Không phát được âm thanh kiểm tra.','error')}
}
audio.addEventListener('playing',()=>{if(nowPlaying)setAudioStatus(nowPlaying==='tone'?'🔔 Đang phát chuông kiểm tra loa…':'🔊 Đang phát bản ghi âm…','playing')});
audio.addEventListener('ended',()=>setAudioStatus(nowPlaying==='tone'?'✅ Đã phát chuông. Nếu cô vẫn nói khó hiểu, lỗi nằm ở bản ghi giọng.':'✅ Đã phát xong. Ba mẹ hãy kiểm tra lời nói có rõ hay không.','done'));
audio.addEventListener('error',()=>{if(nowPlaying)setAudioStatus('⚠️ Tệp âm thanh không tải được hoặc không được trình duyệt hỗ trợ.','error')});
// A parent can load verified recordings from this browser (IndexedDB). This does not publish them to GitHub.
function openVoiceDB(){return new Promise(resolve=>{
 if(!('indexedDB'in window)){resolve(null);return;}
 const req=indexedDB.open('be-vui-hoc-voices-v241',1);
 req.onupgradeneeded=()=>{if(!req.result.objectStoreNames.contains('clips'))req.result.createObjectStore('clips')};
 req.onsuccess=()=>resolve(req.result);req.onerror=()=>resolve(null);
})}
const voiceDB=openVoiceDB();
async function readLocalClips(){
 const db=await voiceDB;if(!db)return;
 for(const id of Object.keys(CLIPS)){
  await new Promise(done=>{const tx=db.transaction('clips','readonly');const req=tx.objectStore('clips').get(id);req.onsuccess=()=>{if(req.result instanceof Blob)useLocalBlob(id,req.result);done()};req.onerror=()=>done()});
 }
 if(screen==='parent')render();
}
function useLocalBlob(id,blob){
 if(localVoiceURLs[id])URL.revokeObjectURL(localVoiceURLs[id]);
 localVoiceBlobs[id]=blob;localVoiceURLs[id]=URL.createObjectURL(blob);
}
async function saveVoiceFile(id,file){
 if(!CLIPS[id]||!file)return;
 if(!((file.type||'').startsWith('audio/')||/\.(mp3|m4a|wav|ogg|webm|mp4)$/i.test(file.name||''))||file.size>15000000){toast('Chỉ nhận tệp âm thanh tối đa 15 MB.');return;}
 useLocalBlob(id,file);
 const db=await voiceDB;if(db){await new Promise(resolve=>{const trx=db.transaction('clips','readwrite');trx.objectStore('clips').put(file,id);trx.oncomplete=resolve;trx.onerror=resolve})}
 toast('Đã lưu âm thanh cho: '+id+'. Hãy bấm Thử nghe để kiểm tra.');if(screen==='parent')render();
}
async function loadApprovedManifest(){
 try{const res=await fetch('./audio-approved/manifest.json?v=241',{cache:'no-store'});if(!res.ok)return;
 const m=await res.json();if(typeof m==='object'&&m){for(const id of Object.keys(CLIPS))if(m[id]===true)approved[id]=true;}
 }catch{} if(screen==='parent')render();
}
async function recordToggle(id){
 if(recordingId===id&&recorder){recorder.stop();return;}
 if(recorder){toast('Hãy hoàn thành đoạn đang ghi âm trước.');return;}
 if(!navigator.mediaDevices?.getUserMedia||!window.MediaRecorder){toast('Trình duyệt này không hỗ trợ thu âm. Hãy thử Chrome qua HTTPS.');return;}
 try{
  recordingStream=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:true,noiseSuppression:true}});
  const chunks=[];recorder=new MediaRecorder(recordingStream);recordingId=id;
  const type=recorder.mimeType||'audio/webm';
  recorder.ondataavailable=e=>{if(e.data.size)chunks.push(e.data)};
  recorder.onstop=async()=>{
   const blob=new Blob(chunks,{type});const clipId=recordingId;
   recordingStream?.getTracks().forEach(t=>t.stop());recordingStream=null;recorder=null;recordingId=null;
   if(blob.size>2000)await saveVoiceFile(clipId,blob);
   else toast('Đoạn ghi âm quá ngắn. Hãy thử lại.');
   if(screen==='parent')render();
  };
  recorder.start();toast('Đang ghi âm “'+CLIPS[id]+'”. Bấm Dừng ghi để lưu.');render();
 }catch{recordingStream?.getTracks().forEach(t=>t.stop());recorder=null;recordingId=null;toast('Không được phép truy cập micro. Hãy mở bằng HTTPS và cấp quyền trong Chrome.');}
}
function downloadVoice(id){
 const blob=localVoiceBlobs[id];if(!blob)return toast('Chưa có bản ghi âm trên thiết bị này.');
 const ext=(blob.type.includes('webm')?'webm':blob.type.includes('ogg')?'ogg':blob.type.includes('wav')?'wav':blob.type.includes('mp4')?'m4a':'mp3');
 const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=`${id}.${ext}`;a.click();setTimeout(()=>URL.revokeObjectURL(url),5000);
}
function home(){
 const k=kid();
 return `<main class="home"><div class="page">
 <header class="header"><div class="logo"><span class="logo-emoji">🌈</span><span>Bé Vui Học<small>Lớp học của con</small></span></div><button class="parent-link" data-action="parent">⚙️ Ba mẹ</button></header>
 <section class="classroom" aria-label="Lớp học vui vẻ với cô giáo"><img src="./scene.svg" alt="Cô giáo đang vẫy tay chào trong lớp học tươi sáng"><div class="hello">Xin chào <b>${safe(k.name)}!</b> 🌞<small>Cô đang chờ con vào lớp</small></div></section>
 <nav class="kids" aria-label="Chọn bé học">${state.kids.map((p,i)=>`<button class="kid-tab ${i===state.active?'selected':''}" data-action="kid" data-id="${i}" aria-pressed="${i===state.active}">${i===0?'🐣':'🐰'} ${safe(p.name)}</button>`).join('')}</nav>
 <button class="btn-enter" data-action="start" data-id="${k.finished.vi?'math':'vi'}"><span>👩‍🏫</span><span><strong>VÀO LỚP CÙNG CÔ</strong><small>Chạm để nghe cô hướng dẫn</small></span><span aria-hidden="true">➜</span></button>
 <div class="quick-lessons"><button class="quick-card" data-action="start" data-id="vi"><span class="quick-art">🔤</span><strong>Học chữ a</strong><small>Nghe – nhìn – tập tô</small></button><button class="quick-card green" data-action="start" data-id="math"><span class="quick-art">🍎</span><strong>Đếm 1–3</strong><small>Đếm táo cùng cô</small></button></div>
 <button class="audio-test-home" data-action="tone">🔔 Kiểm tra loa</button><button class="audio-test-home" data-action="audio-test">👩‍🏫 Thử nghe giọng cô</button><div id="audioStatus" class="sound-status" aria-live="polite">Hãy thử chuông trước, sau đó thử nghe giọng cô.</div>
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
 <div id="audioStatus" class="sound-status" aria-live="polite">Chạm “Nghe cô” nếu con muốn nghe lại.</div></section></div></main>`;
}
function parent(){
 const rows=state.kids.map((p,i)=>`<div class="parent-kid"><label for="kidName${i}">${i===0?'🐣':'🐰'} Bé ${i+1}</label><input id="kidName${i}" maxlength="24" value="${safe(p.name)}"><button data-action="rename" data-id="${i}">Lưu tên</button><p>⭐ ${p.stars} sao · ${Object.keys(p.finished).length}/2 bài mẫu đã hoàn thành · ${p.correct}/${p.attempts} lần chọn đúng</p></div>`).join('');
 return `<main class="parent"><div class="parent-page"><button class="btn-outline" data-action="home">← Về lớp học</button><h1>👨‍👩‍👧‍👦 Góc ba mẹ</h1><p>Thiết lập dành cho người lớn, tách khỏi màn hình học của con.</p>
 <section class="parent-panel"><h2>Hai hồ sơ học tập</h2>${rows}</section>
 <section class="parent-panel"><h2>🔊 Phòng thu giọng cô giáo</h2>
 <p><b>Bộ MP3 cũ đã được ngừng sử dụng</b> vì phát âm không đủ rõ cho trẻ. Để dạy hai bé, ba mẹ cần dùng giọng tiếng Việt đã được kiểm tra hoặc ghi âm giọng người thật.</p>
 <div class="parent-buttons"><button class="btn-outline" data-action="tone">🔔 1. Kiểm tra loa</button><button class="btn-next" data-action="audio-test">👩‍🏫 2. Nghe câu chào</button></div>
 <div id="audioStatus" class="sound-status" aria-live="polite">Nếu nghe chuông nhưng không hiểu lời cô, lỗi nằm ở giọng nói chứ không phải loa.</div>
 <label class="native-label" for="voiceMode">Nguồn giọng dạy:</label>
 <select id="voiceMode" class="voice-mode"><option value="approved" ${voiceMode==='approved'?'selected':''}>Bản ghi rõ tiếng (ưu tiên)</option><option value="browser" ${voiceMode==='browser'?'selected':''}>Giọng Việt có sẵn trong thiết bị (thử nghiệm)</option></select>
 <p class="help-note">Chỉ sử dụng giọng thiết bị nếu ba mẹ nghe và xác nhận phát âm đạt. Cài đặt nguồn giọng được lưu trên thiết bị này.</p>
 <h3>22 câu cô giáo cần đọc</h3>
 <p>Bấm <b>Ghi âm</b> hoặc chọn tệp từ điện thoại/máy tính. Nghe lại và duyệt từng câu. Âm thanh tự lưu trong trình duyệt này; chưa đồng bộ sang máy khác.</p>
 <div class="voice-list">${Object.entries(CLIPS).map(([id,script],i)=>`<div class="voice-item"><div class="voice-script"><b>${i+1}. ${safe(id)} ${localVoiceURLs[id]||approved[id]?'✅':'○'}</b><span>${safe(script)}</span></div><div class="voice-actions"><button class="btn-outline" data-action="record" data-id="${id}">${recordingId===id?'⏹ Dừng ghi':'🎙 Ghi âm'}</button><label class="upload">📁 Chọn tệp<input type="file" hidden accept="audio/*,.mp3,.m4a,.wav,.ogg,.webm" data-voice-id="${id}"></label><button class="btn-outline" data-action="clip" data-id="${id}">🔊 Thử nghe</button>${localVoiceURLs[id]?`<button class="btn-outline" data-action="voice-download" data-id="${id}">⬇ Tải</button>`:''}</div></div>`).join('')}</div>
 <p class="help-note">Để phát trên <b>tất cả thiết bị</b>, bạn cần đưa những tệp âm thanh đã duyệt vào <code>public/audio-approved/</code> trên GitHub và cập nhật <code>manifest.json</code>. Mã nguồn có hướng dẫn. Tệp thu trên Chrome thường là WebM, không tự biến thành MP3; cần chuyển định dạng trước khi đưa vào thư mục MP3.</p>
 <label class="speed-label" for="speed">Tốc độ nghe: <span id="speedValue">${Math.round(state.speed*100)}%</span></label><input id="speed" type="range" min="0.8" max="1.1" step="0.05" value="${state.speed}"></section>
 <section class="parent-panel"><h2>💾 Sao lưu tiến độ</h2><p>Mỗi thiết bị lưu tiến độ riêng. Khi đổi điện thoại, ba mẹ có thể chuyển tệp JSON; chưa có đồng bộ đám mây.</p><div class="parent-buttons"><button class="btn-outline" data-action="backup">⬇️ Sao lưu</button><label class="upload">⬆️ Khôi phục <input id="restore" type="file" accept=".json,application/json" hidden></label></div></section>
 <section class="parent-panel"><h2>📱 Cài lên điện thoại</h2><p><b>Android:</b> mở địa chỉ HTTPS trên Chrome → menu ⋮ → Thêm vào màn hình chính / Cài đặt ứng dụng.</p><p><b>iPhone/iPad:</b> mở trên Safari → Chia sẻ → Thêm vào màn hình chính.</p><p><b>Windows:</b> mở trên Chrome/Edge → Cài đặt ứng dụng (nếu trình duyệt hỗ trợ).</p></section>
 <div class="version">BÉ VUI HỌC V2.4.1 · Hai bài mẫu: chữ a và đếm 1–3 · Không có tài khoản trực tuyến</div></div></main>`;
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
  case 'tone':playTone();break;
  case 'record':recordToggle(id);break;
  case 'voice-download':downloadVoice(id);break;
  case 'clip':playClip(id);break;
  case 'answer':answer(Number(id));break;
  case 'clear-trace':traced=0;solved=false;render();break;
  case 'repeat':start(lessonId);break;
  case 'rename':{const s=$(`#kidName${id}`)?.value.trim();if(s){state.kids[Number(id)].name=s.slice(0,24);save();render();toast('Đã đổi tên bé.')}break;}
  case 'backup':downloadProgress();break;
 }
});
window.addEventListener('input',e=>{if(e.target.id==='speed'){state.speed=Number(e.target.value);save();const txt=$('#speedValue');if(txt)txt.textContent=Math.round(state.speed*100)+'%';if(!audio.paused)audio.playbackRate=state.speed;}});
window.addEventListener('change',e=>{if(e.target.id==='restore')restoreProgress(e.target.files[0]);
  if(e.target.dataset.voiceId)saveVoiceFile(e.target.dataset.voiceId,e.target.files[0]);
  if(e.target.id==='voiceMode'){voiceMode=e.target.value;localStorage.setItem(VOICE_PREF_KEY,voiceMode);stopAudio();render()}});
window.addEventListener('pagehide',stopAudio);
render();
readLocalClips(); loadApprovedManifest();
if('serviceWorker' in navigator&&location.protocol==='https:')window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));
})();
