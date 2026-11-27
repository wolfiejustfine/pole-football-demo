const scenes = [
  {title:"Развитие атаки",time:"00:14",insight:"Движение и пространство",text:"Позиции помогают рассмотреть структуру команд в выбранном эпизоде.", points:[[14,53,"a"],[28,30,"a"],[35,66,"a"],[48,44,"a"],[61,67,"a"],[71,35,"a"],[85,52,"b"],[72,62,"b"],[62,28,"b"],[53,54,"b"],[40,27,"b"],[25,52,"b"],[50,48,"ball"]]},
  {title:"Возврат мяча",time:"00:32",insight:"Переход в оборону",text:"Схема помогает обсудить расположение игроков при смене владения.", points:[[14,55,"a"],[27,31,"a"],[39,56,"a"],[49,36,"a"],[53,71,"a"],[67,51,"a"],[84,51,"b"],[75,28,"b"],[68,69,"b"],[58,48,"b"],[45,69,"b"],[34,36,"b"],[56,52,"ball"]]},
  {title:"Подход к воротам",time:"00:48",insight:"Завершение эпизода",text:"Отмечайте важные моменты и возвращайтесь к ним во время разбора.", points:[[15,51,"a"],[35,32,"a"],[48,68,"a"],[58,45,"a"],[70,30,"a"],[74,65,"a"],[90,51,"b"],[78,43,"b"],[73,75,"b"],[66,55,"b"],[60,22,"b"],[48,50,"b"],[76,49,"ball"]]}
];
function showScene(index){const scene=scenes[index];document.querySelector('#sceneTitle').textContent=scene.title;document.querySelector('#timecode').textContent=scene.time;document.querySelector('#insightTitle').textContent=scene.insight;document.querySelector('#insightText').textContent=scene.text;for(const id of ['players','miniPlayers']){const container=document.getElementById(id);container.replaceChildren(...scene.points.map(([x,y,team])=>{const dot=document.createElement('i');dot.className=`player ${team}`;dot.style.left=`${x}%`;dot.style.top=`${y}%`;return dot;}));}document.querySelectorAll('.moment').forEach((button,i)=>{button.classList.toggle('active',i===index);button.setAttribute('aria-pressed',String(i===index));});}
document.querySelectorAll('.moment').forEach((button,i)=>button.addEventListener('click',()=>showScene(i)));showScene(0);

if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { const video = document.querySelector(".record-video"); video.autoplay = false; video.pause(); }

const demoVideo = document.querySelector('.record-video');
const videoToggle = document.querySelector('.video-toggle');
function updateVideoToggle() { const paused = demoVideo.paused; videoToggle.innerHTML = paused ? '▶ <span>Смотреть</span>' : '❚❚ <span>Пауза</span>'; videoToggle.setAttribute('aria-label', paused ? 'Воспроизвести видео' : 'Остановить видео'); }
videoToggle.addEventListener('click', () => { if (demoVideo.paused) demoVideo.play().catch(updateVideoToggle); else demoVideo.pause(); });
demoVideo.addEventListener('play', updateVideoToggle); demoVideo.addEventListener('pause', updateVideoToggle); updateVideoToggle();

const shots = { a: [{x:88,y:42,on:1},{x:83,y:51,on:1},{x:79,y:38,on:1},{x:85,y:60,on:1},{x:76,y:55,on:1},{x:70,y:32,on:0},{x:74,y:72,on:0},{x:80,y:22,on:0},{x:68,y:52,on:0},{x:76,y:46,on:0},{x:89,y:70,on:0},{x:61,y:43,on:0}], b: [{x:83,y:48,on:1},{x:76,y:35,on:1},{x:87,y:60,on:1},{x:70,y:58,on:0},{x:65,y:36,on:0},{x:80,y:72,on:0},{x:72,y:22,on:0},{x:58,y:51,on:0}] };
function showShots(team) { const values=shots[team]; const on=values.filter(shot=>shot.on).length; const container=document.getElementById('shotDots'); container.replaceChildren(...values.map(shot=>{const dot=document.createElement('span'); dot.className='shot-dot '+(shot.on?'on-target':'off-target'); dot.style.left=shot.x+'%'; dot.style.top=shot.y+'%'; return dot;})); document.getElementById('shotSummary').textContent=`${values.length} ударов · ${on} в створ`; document.getElementById('shotPitch').setAttribute('aria-label',`Карта ударов команды ${team.toUpperCase()}: ${values.length} ударов, ${on} в створ`); document.querySelectorAll('[data-team]').forEach(button=>{const selected=button.dataset.team===team;button.classList.toggle('active',selected);button.setAttribute('aria-pressed',String(selected));}); }
document.querySelectorAll('[data-team]').forEach(button=>button.addEventListener('click',()=>showShots(button.dataset.team)));showShots('a');

const overlay = document.querySelector('#broadcastOverlay');
const overlayToggle = document.querySelector('#overlayToggle');
const overlayMessage = document.querySelector('#overlayMessage');
let observations = null;
let overlayEnabled = true;
let lastObservation = -1;
function renderObservation() {
  if (!observations || !overlayEnabled) return;
  const index = Math.min(observations.samples.length - 1, Math.max(0, Math.floor(demoVideo.currentTime * observations.fps)));
  if (index === lastObservation) return;
  lastObservation = index;
  const sample = observations.samples[index];
  const seconds = Math.floor(observations.source_start_seconds + index / observations.fps);
  document.querySelector('#overlayTime').textContent = `00:${String(seconds).padStart(2, '0')}`;
  document.querySelector('#observedPlayers').textContent = sample.a + sample.b + sample.unknown;
  document.querySelector('#observedTeams').textContent = `A ${sample.a} · B ${sample.b} · ? ${sample.unknown}`;
  document.querySelector('#observedBall').textContent = sample.ball ? 'Найден' : 'Не найден';
  document.querySelector('#observedField').textContent = sample.field ? 'Есть' : 'Нет';
}
let observationFrame = null;
function observationLoop() { observationFrame = null; if (!demoVideo.paused && !demoVideo.ended) { renderObservation(); observationFrame = requestAnimationFrame(observationLoop); } }
function startObservationLoop() { if (observationFrame === null && !demoVideo.paused) observationFrame = requestAnimationFrame(observationLoop); }
demoVideo.addEventListener('play', startObservationLoop);
demoVideo.addEventListener('seeked', () => { lastObservation = -1; renderObservation(); });
overlayToggle.addEventListener('click', () => { overlayEnabled = !overlayEnabled; overlay.hidden = !overlayEnabled || !observations; overlayToggle.setAttribute('aria-pressed', String(overlayEnabled)); overlayToggle.textContent = `◉ Метрики на видео: ${overlayEnabled ? 'вкл.' : 'выкл.'}`; if (overlayEnabled) { lastObservation = -1; renderObservation(); } });
fetch('assets/observations.json').then(response => { if (!response.ok) throw new Error('data'); return response.json(); }).then(data => { observations = data; overlay.hidden = !overlayEnabled; renderObservation(); startObservationLoop(); }).catch(() => { overlay.hidden = true; overlayToggle.disabled = true; overlayMessage.textContent = 'Данные наблюдений не загрузились'; });

const contextDefaults = { stadium: 'Пример стадиона', weather: 'Ясно, +18 °C', officials: '', squadA: '', squadB: '' };
const contextFields = [['stadium','Stadium','Не указан'], ['weather','Weather','Не указана'], ['officials','Officials','Не указана'], ['squadA','SquadA','Добавьте игроков и номера'], ['squadB','SquadB','Добавьте игроков и номера']];
let matchContext = {...contextDefaults};
try { const saved = JSON.parse(localStorage.getItem('pole-demo-context') || 'null'); if (saved && typeof saved === 'object') for (const [key] of contextFields) if (typeof saved[key] === 'string') matchContext[key] = saved[key]; } catch {}
function showContext() { for (const [key, id, empty] of contextFields) { document.getElementById('show'+id).textContent = matchContext[key] || empty; document.getElementById('edit'+id).value = matchContext[key]; } }
showContext();
document.getElementById('contextForm').addEventListener('submit', event => { event.preventDefault(); const next = {}; for (const [key, id] of contextFields) next[key] = document.getElementById('edit'+id).value.trim(); try { localStorage.setItem('pole-demo-context', JSON.stringify(next)); matchContext = next; showContext(); document.getElementById('contextStatus').textContent = 'Сохранено в этом браузере'; } catch { document.getElementById('contextStatus').textContent = 'Не удалось сохранить данные в браузере'; } });
