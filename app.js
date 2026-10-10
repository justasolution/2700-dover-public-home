const state={data:null,filter:'all'};
const $=s=>document.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));

function openViewer(image,title,type,description=''){
  const d=$('#viewer'); d.querySelector('img').src=image; d.querySelector('img').alt=title;
  d.querySelector('.tag').textContent=type; d.querySelector('h3').textContent=title;
  d.querySelector('p').textContent=description; d.showModal();
}
function bindZoom(){document.querySelectorAll('[data-view]').forEach(el=>el.addEventListener('click',()=>openViewer(el.src,el.dataset.title,el.dataset.type,el.dataset.description)));}
function renderFilters(){
  const f=$('#roomFilters'); f.innerHTML=['all',...state.data.rooms.map(r=>r.id)].map((id,i)=>`<button class="${id===state.filter?'active':''}" data-filter="${id}">${i?' '+esc(state.data.rooms[i-1].title.split('—')[0].trim()):'All spaces'}</button>`).join('');
  f.querySelectorAll('button').forEach(b=>b.onclick=()=>{state.filter=b.dataset.filter;renderFilters();renderRooms();});
}
function renderRooms(){
  const rooms=state.filter==='all'?state.data.rooms:state.data.rooms.filter(r=>r.id===state.filter);
  $('#roomList').innerHTML=rooms.map(r=>`<article class="room-card"><div class="room-head"><div><h3>${esc(r.title)}</h3><p>${esc(r.summary)}</p></div></div>
  <figure class="image-card"><span class="badge">Listing</span><img loading="lazy" src="${r.source}" alt="Original listing view for ${esc(r.title)}" data-view data-title="${esc(r.title)} — original" data-type="Listing photo" data-description="Original public listing reference"></figure>
  <figure class="image-card"><span class="badge concept">Concept</span><img loading="lazy" src="${r.concept}" alt="Illustrative concept for ${esc(r.title)}" data-view data-title="${esc(r.title)}" data-type="Illustrative concept" data-description="${esc(r.summary)}"></figure></article>`).join(''); bindZoom();
}
function renderListing(){
  $('#listingGrid').innerHTML=state.data.photos.map(p=>`<figure class="photo"><img loading="lazy" src="${p.image}" alt="Listing photo ${p.number}: ${esc(p.view)}" data-view data-title="Photo ${p.number} — ${esc(p.view)}" data-type="Original listing" data-description="${esc(p.direction)}"><figcaption>Photo ${p.number} · ${esc(p.view)}</figcaption></figure>`).join('');
}
function renderConcepts(){
  $('#conceptGrid').innerHTML=state.data.concepts.map(c=>`<figure class="concept"><img loading="lazy" src="${c.image}" alt="${esc(c.title)} design concept" data-view data-title="${esc(c.title)}" data-type="Illustrative concept" data-description="Planning visualization; verify site conditions and dimensions."><figcaption>${esc(c.title)}</figcaption></figure>`).join('');
}
async function init(){
  try{state.data=await fetch('site-data.json').then(r=>{if(!r.ok)throw Error('Could not load gallery data');return r.json()});renderFilters();renderRooms();renderListing();renderConcepts();bindZoom();}
  catch(e){$('#roomList').innerHTML=`<p>Gallery could not load. ${esc(e.message)}</p>`;}
}
$('#viewer .close').onclick=()=>$('#viewer').close(); $('#viewer').onclick=e=>{if(e.target===$('#viewer'))$('#viewer').close()};
init();
