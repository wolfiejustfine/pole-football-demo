(() => {
 const tabs=[...document.querySelectorAll('[data-view]')];
 function openView(name, focus=false){if(name!=='video')document.querySelector('#demoTacticalVideo').pause();for(const tab of tabs){const active=tab.dataset.view===name;tab.setAttribute('aria-selected',String(active));tab.tabIndex=active?0:-1;document.getElementById('panel-'+tab.dataset.view).hidden=!active;if(active&&focus)tab.focus();}if(name==='video')requestAnimationFrame(()=>window.dispatchEvent(new Event('resize')));}
 tabs.forEach((tab,index)=>{tab.addEventListener('click',()=>openView(tab.dataset.view));tab.addEventListener('keydown',event=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;event.preventDefault();const next=event.key==='Home'?0:event.key==='End'?tabs.length-1:(index+(event.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length;openView(tabs[next].dataset.view,true);});});
 document.querySelectorAll('[data-open]').forEach(button=>button.addEventListener('click',()=>openView(button.dataset.open)));
 function openMoment(seconds){openView('video');const video=document.querySelector('#demoTacticalVideo');video.pause();const seek=()=>{video.currentTime=seconds;};if(video.readyState>=1)seek();else video.addEventListener('loadedmetadata',seek,{once:true});document.querySelector('#panel-video').scrollIntoView({block:'start',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});}
 document.querySelectorAll('[data-seek]').forEach(button=>button.addEventListener('click',()=>openMoment(Number(button.dataset.seek))));
 for(const id of ['shotMetric','distanceMetric','shotPoint','shotLink'])document.getElementById(id).addEventListener('click',()=>openMoment(8));
 const initialView=new URLSearchParams(location.search).get('view');if(tabs.some(tab=>tab.dataset.view===initialView))openView(initialView);
})();
