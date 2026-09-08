import {makePages} from './src/pages.mjs';
import {build} from 'esbuild';
import {readFile,writeFile,mkdir,rm} from 'node:fs/promises';
const products=JSON.parse(await readFile('src/products.json','utf8'));
await rm('dist/chunks',{recursive:true,force:true});
await build({entryPoints:['src/effects.jsx'],bundle:true,splitting:true,format:'esm',outdir:'dist',entryNames:'effects',chunkNames:'chunks/[name]-[hash]',minify:true,target:['es2020'],define:{'process.env.NODE_ENV':'"production"'},jsx:'automatic'});
await writeFile('dist/catalog.js','window.SS_PRODUCTS='+JSON.stringify(products)+';');
const goals=JSON.parse(await readFile('src/goals.json','utf8'));
const goalCards=goals.map((g,i)=>`<a class="goal-card goal-${g.tone}" href="/goals/${g.slug}/"><span class="goal-overline">${g.name}</span><h3>${g.short}</h3><div class="goal-art art-${g.symbol}" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></div><div class="goal-card-bottom"><span>0${i+1}</span><span aria-hidden="true">↗</span></div></a>`).join('');
const goalSection=`<section class="goals section" id="goals"><div class="goals-heading"><div><div class="section-kicker">A DIFFERENT GOAL. THE SAME COMMITMENT.</div><h2>YOUR ROUTINE.<br><span>YOUR WAY.</span></h2></div><p>Start with what moves you.<br>Explore the range, then find your fit.</p></div><div class="goal-grid">${goalCards}</div></section>`;
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
