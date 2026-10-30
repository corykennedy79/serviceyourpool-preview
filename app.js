const C=window.CLEANERS,Z=window.ZIPS,$=id=>document.getElementById(id);
const svcs=[...new Set(C.flatMap(c=>c.services))].sort();svcs.forEach(s=>$('svc').add(new Option(s,s)));
function area(q){q=q.trim().toLowerCase();if(!q)return null;const z=Z.zips.find(z=>z.zip===q);return z?{zip:z,term:z.area.split(/[\/(]/)[0].trim().toLowerCase()}:{term:q}}
function match(c,a){if(!a)return true;if(a.zip&&c.zips_served.includes(a.zip.zip))return true;const t=a.term;return (c.city+' '+c.service_areas.join(' ')+' '+c.address).toLowerCase().includes(t)}
function render(){const a=area($('q').value),mr=+$('minr').value,mp=+$('maxp').value,s=$('svc').value,hp=$('haspr').checked;
let r=C.filter(c=>match(c,a)&&(!s||c.services.includes(s))&&(c.rating||0)>=mr&&(!hp||c.price_monthly_from)&&(mp>=9999||(c.price_monthly_from&&c.price_monthly_from<=mp)));
const k=$('sort').value;r.sort((x,y)=>k=='name'?x.name.localeCompare(y.name):k=='price'?(x.price_monthly_from||1e9)-(y.price_monthly_from||1e9):k=='reviews'?(y.review_count||0)-(x.review_count||0):(y.rating||0)-(x.rating||0)||(y.review_count||0)-(x.review_count||0));
let est=a&&a.zip?` · Estimated weekly service in ${a.zip.zip}: $${a.zip.est_low}–$${a.zip.est_high}/mo (estimate)`:'';
$('count').textContent=`${r.length} cleaner${r.length==1?'':'s'} found`+est;
$('results').innerHTML=r.map(c=>`<div class="card" onclick="openM(${c.id})"><h3>${c.name}</h3><div class="muted">${c.city}${c.phone?' · '+c.phone:''}</div>
<div>${c.rating?`★ ${c.rating} (${c.review_count??'?'} reviews, ${c.rating_source})`:'<span class="muted">No rating collected yet</span>'}</div>
<div class="price">${c.price_monthly_from?`From $${c.price_monthly_from}/mo (published)`:'<span class="muted">Price: call for quote</span>'}</div>
<div>${c.services.map(s=>`<span class="tag">${s}</span>`).join('')}</div></div>`).join('')||'<p>No matches yet. Try a nearby city or clear filters.</p>'}
function openM(id){const c=C.find(x=>x.id==id);$('detail').innerHTML=`<h2>${c.name}</h2>${c.address?`<p>${c.address}</p>`:''}
<p>${c.phone?`📞 <a href="tel:${c.phone}">${c.phone}</a><br>`:''}${c.website?`🌐 <a href="${c.website}" target="_blank">${c.website}</a>`:''}</p>
<p><b>Rating:</b> ${c.rating?`${c.rating} (${c.review_count??'?'} reviews) via ${c.rating_source}`:'not collected'}</p>
<p><b>Price:</b> ${c.price_monthly_from?`From $${c.price_monthly_from}/mo, published${c.price_note?' ('+c.price_note+')':''} – <a href="${c.price_source}" target="_blank">source</a>`:'not published'}</p>
<p><b>Service areas:</b> ${c.service_areas.join(', ')||'—'}</p><p><b>Zips:</b> ${c.zips_served.join(', ')||'—'}</p><p><b>Services:</b> ${c.services.join(', ')}</p>
<p><b>Sources:</b><br>${c.sources.map(s=>`<a href="${s}" target="_blank">${s}</a>`).join('<br>')}</p>`;$('modal').classList.remove('hidden')}
function closeM(){$('modal').classList.add('hidden')}
['go'].forEach(i=>$(i).onclick=render);['svc','minr','maxp','haspr','sort'].forEach(i=>$(i).onchange=render);$('q').onkeyup=e=>render();
$('method').textContent=Z.method;
function zt(){const q=$('zq').value.toLowerCase();document.querySelector('#ztab tbody').innerHTML=Z.zips.filter(z=>(z.zip+z.area).toLowerCase().includes(q)).map(z=>`<tr><td>${z.zip}</td><td>${z.area}</td><td>${z.tier}</td><td>$${z.est_low}–$${z.est_high} <span class="muted">est.</span></td></tr>`).join('')}
$('zq').onkeyup=zt;zt();$('pub').innerHTML=Z.published_points.map(p=>`<li>${p.name}: from $${p.from}/mo ${p.note?'('+p.note+')':''} – <a href="${p.source}" target="_blank">source</a></li>`).join('');
render();
