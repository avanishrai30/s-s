import {makePages} from './src/pages.mjs';
import {build} from 'esbuild';
import {readFile,writeFile,mkdir,rm} from 'node:fs/promises';
const products=JSON.parse(await readFile('src/products.json','utf8'));
await rm('dist/chunks',{recursive:true,force:true});
await build({entryPoints:['src/effects.jsx'],bundle:true,splitting:true,format:'esm',outdir:'dist',entryNames:'effects',chunkNames:'chunks/[name]-[hash]',minify:true,target:['es2020'],define:{'process.env.NODE_ENV':'"production"'},jsx:'automatic'});
await writeFile('dist/catalog.js','window.SS_PRODUCTS='+JSON.stringify(products)+';');
const goals=JSON.parse(await readFile('src/goals.json','utf8'));
const campaign={gym:{word:'BUILD.',line:'One more rep. One more reason.',image:'goal-training.jpg'},sports:{word:'PLAY.',line:'For every game. For every goal.',image:'goal-sports.png'},daily:{word:'EVERY<br>DAY.',line:'Good choices become good habits.',image:'goal-daily.jpg'},gain:{word:'GROW.',line:'Stay consistent. Keep showing up.',image:'goal-training.jpg'},recovery:{word:'RESET.',line:'Make the next session count.',image:'goal-sports.png'}};
const goalCards=goals.map((g,i)=>{const c=campaign[g.slug];return `<a class="goal-card goal-poster poster-${g.slug}" href="/goals/${g.slug}/"><div class="poster-photo" aria-hidden="true"><img src="/assets/${c.image}" alt="" width="1000" height="1300" loading="lazy" decoding="async"></div><div class="poster-shade" aria-hidden="true"></div><div class="poster-top"><span>${g.name}</span><span>0${i+1} / S&S</span></div><div class="poster-title"><h3>${c.word}</h3><p>${c.line}</p></div>${g.slug==='sports'?'<div class="poster-ribbon" aria-hidden="true"><span>KEEP MOVING · KEEP PLAYING · KEEP MOVING · KEEP PLAYING ·</span></div>':''}<div class="poster-footer"><span>${g.name}</span><span class="poster-cta">Explore collection <b aria-hidden="true">↗</b></span></div></a>`}).join('');
const goalSection=`<section class="goals section" id="goals"><div class="goals-heading"><div><div class="section-kicker">FIND WHAT MOVES YOU</div><h2>YOUR ROUTINE.<br><span>YOUR WAY.</span></h2></div><p>Five ways to explore.<br>One place to find your next step.</p></div><div class="goal-grid">${goalCards}</div></section>`;
let home=await readFile('dist/index.html','utf8');
home=home.replace(/<!-- GOALS_START -->[\s\S]*?<!-- GOALS_END -->/,'<!-- GOALS_START -->'+goalSection+'<!-- GOALS_END -->');
await writeFile('dist/index.html',home);
await writeFile('dist/goals.js','window.SS_GOALS='+JSON.stringify(goals)+';');
const esc=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
for(const p of products){
 let before=home.slice(0,home.indexOf('<main>')).replace(/<title>.*?<\/title>/,`<title>${esc(p.name)} — ${esc(p.brand)} | S&S</title>`).replace(/<meta name="description" content="[^"]*">/,`<meta name="description" content="Explore ${esc(p.name)} from ${esc(p.brand)} at S&S Sports &amp; Supplements, Banaswadi. Enquire for availability and pricing.">`).replace('<body>','<body class="pdp-body">');
 let after=home.slice(home.indexOf('</main>')+7);
 before=before.replaceAll('href="#','href="/#');after=after.replaceAll('href="#','href="/#');
 const fallback=`<div class="pdp-breadcrumb"><a href="/#shop">← Back to the supplement shelf</a></div><section class="pdp-hero" style="--pdp-color:${p.color};--pdp-accent:${p.accent}"><div class="pdp-stage"><div class="pdp-stage-inner"><div class="pdp-pack"><img src="${p.image}" alt="${esc(p.name)}" width="600" height="600"></div></div></div><div class="pdp-info"><div class="section-kicker">${esc(p.brand)}</div><h1>${esc(p.name)}</h1><p class="pdp-description">${esc(p.description)}</p><a class="button dark" href="tel:+917022825588">Enquire with S&S ↗</a></div></section>`;
 const page=before+`<main id="product-react" data-slug="${p.slug}">${fallback}</main>`+after;
 await mkdir('dist/products/'+p.slug,{recursive:true});await writeFile('dist/products/'+p.slug+'/index.html',page);
}
console.log(`Built React motion, lazy Three.js layer, and ${products.length} product pages.`);

const shellBefore=home.slice(0,home.indexOf('<main>'));
const shellAfter=home.slice(home.indexOf('</main>')+7);
for(const [slug,page] of Object.entries(makePages(home,products,goals))){
 const before=shellBefore.replace(/<title>.*?<\/title>/,`<title>${esc(page.title)} | S&S Sports &amp; Supplements</title>`).replace('<body>','<body class="inner-page">');
 await mkdir(`dist/${slug}`,{recursive:true});await writeFile(`dist/${slug}/index.html`,before+'<main>'+page.body+'</main>'+shellAfter);
}
console.log('Built Shop, Brands, Why S&S, Visit, Search and Bag routes.');
