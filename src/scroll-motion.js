import {gsap} from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ignoreMobileResize:true});

// Native scrolling is retained. One owner per transform prevents competing timelines.
export function initMotion(){
 const mm=gsap.matchMedia();
 mm.add({desktop:'(min-width: 761px)',mobile:'(max-width: 760px)',reduce:'(prefers-reduced-motion: reduce)'},context=>{
  const {desktop,reduce}=context.conditions;if(reduce)return;
  const distance=desktop?1:.28;
  const hero=document.querySelector('.hero');
  if(hero){
   const trigger={trigger:hero,start:'top top',end:'bottom top',scrub:1.15,invalidateOnRefresh:true};
   const image=hero.querySelector('.campaign-product'),word=hero.querySelector('.campaign-word');
   if(image)gsap.to(image,{y:50*distance,ease:'none',scrollTrigger:trigger});
   if(word)gsap.to(word,{y:-35*distance,ease:'none',scrollTrigger:trigger});
  }
  const stage=document.querySelector('.pdp-stage'),pack=document.querySelector('.pdp-pack img');
  if(stage&&pack)gsap.fromTo(pack,{y:0,rotation:0},{y:24*distance,rotation:0,ease:'none',scrollTrigger:{trigger:'.pdp-hero',start:'top top',end:'bottom top',scrub:1.2}});
  document.querySelectorAll('.pdp-story h2').forEach(el=>gsap.fromTo(el,{x:-25*distance},{x:25*distance,ease:'none',scrollTrigger:{trigger:el.parentElement,start:'top bottom',end:'bottom top',scrub:1.4}}));
  document.querySelectorAll('.section-heading,.goals-heading,.about-title,.about-body,.review-shell,.visit-card,.pdp-details').forEach(el=>{
   ScrollTrigger.create({trigger:el,start:'top 93%',once:true,onEnter:()=>gsap.fromTo(el,{y:24*distance,opacity:.5},{y:0,opacity:1,duration:.7,ease:'power2.out',clearProps:'opacity,transform'})});
  });
  document.querySelectorAll('.values>div,.brand-tile').forEach((el,i)=>{ScrollTrigger.create({trigger:el,start:'top 94%',once:true,onEnter:()=>gsap.fromTo(el,{opacity:.4,y:18*distance},{opacity:1,y:0,duration:.75,delay:(i%3)*.07,ease:'power2.out',clearProps:'opacity,transform'})})});
  document.querySelectorAll('.goal-card').forEach((el,i)=>{
   ScrollTrigger.create({trigger:el,start:'top 94%',once:true,onEnter:()=>gsap.fromTo(el,{opacity:.5,y:28*distance},{opacity:1,y:0,duration:.85,delay:(i%5)*.055,ease:'power3.out',clearProps:'opacity,transform'})});
   const art=el.querySelector('.goal-art');if(art)gsap.fromTo(art,{y:16*distance,rotation:-8},{y:-16*distance,rotation:8,ease:'none',scrollTrigger:{trigger:el,start:'top bottom',end:'bottom top',scrub:1.4}});
  });
  let cards=gsap.context(()=>{}),refreshFrame=0;
  const setupCards=()=>{cards.revert();cards=gsap.context(()=>{
   document.querySelectorAll('.product-image .pack-depth').forEach(el=>gsap.fromTo(el,{y:12*distance},{y:-12*distance,ease:'none',scrollTrigger:{trigger:el.closest('.product-image'),start:'top bottom',end:'bottom top',scrub:.9}}));
  });cancelAnimationFrame(refreshFrame);refreshFrame=requestAnimationFrame(()=>ScrollTrigger.refresh())};
  setupCards();document.addEventListener('ss:catalog',setupCards);
  const ready=()=>ScrollTrigger.refresh();document.fonts?.ready.then(ready).catch(()=>{});window.addEventListener('load',ready,{once:true});
  return()=>{cards.revert();cancelAnimationFrame(refreshFrame);document.removeEventListener('ss:catalog',setupCards);window.removeEventListener('load',ready);document.querySelectorAll('.product-image').forEach(el=>{gsap.killTweensOf(el);el.style.removeProperty('--tilt-x');el.style.removeProperty('--tilt-y')})};
 });
 return()=>mm.revert();
}
