(function(root){
  'use strict';
  const number=v=>v===null||v===undefined||String(v).trim()===''?null:Number(v);
  const positive=v=>{const n=number(v);return Number.isFinite(n)&&n>0?n:null;};
  const nonnegative=v=>{const n=number(v);return Number.isFinite(n)&&n>=0?n:null;};
  const nice=n=>Number.isInteger(n)?String(n):n.toFixed(1);
  const colorAdvice={oak:'Natural oak connects to the existing floors; use ivory and restrained sage around it.',white:'White or ivory works with light wood and the kitchen trim. Check the actual undertone beside the existing finish.',walnut:'Dark wood can work as one anchor piece; avoid adding several bulky dark units in the same small space.',russet:'Russet complements oak and cream. Treat it as the main accent, with quiet sage or ivory textiles.',gray:'Gray can work with the existing walls; warm wood and ivory can keep the room from feeling cold.',other:'Compare a daylight photo beside the actual floor and wall; exact color matching cannot be checked by dimensions.',unknown:'A daylight photo of the finish is needed for a useful color review.'};
  function evaluate(input){
    const w=positive(input.width),d=positive(input.depth),h=positive(input.height),zw=positive(input.zoneWidth),zd=positive(input.zoneDepth),zh=positive(input.zoneHeight),front=nonnegative(input.front),side=nonnegative(input.side);
    const messages=[],missing=[];let state='hold',fit='unknown';
    if(w===null)missing.push('furniture width');if(d===null)missing.push('furniture depth');if(zw===null)missing.push('usable-zone width');if(zd===null)missing.push('usable-zone depth');if(front===null)missing.push('front-use allowance');if(side===null)missing.push('side allowance');
    let effectiveWidth=null,effectiveDepth=null;
    if(missing.length){messages.push('Still needed: '+missing.join(', ')+'.');}
    else{
      effectiveWidth=w+side;effectiveDepth=d+front;
      const tooWide=effectiveWidth>zw+.001,tooDeep=effectiveDepth>zd+.001,tooTall=h!==null&&zh!==null&&h>zh+.001;
      fit=tooWide||tooDeep||tooTall?'outside':'within';
      if(tooWide)messages.push('Width exceeds this zone by '+nice(effectiveWidth-zw)+' in, including the entered side allowance.');
      if(tooDeep)messages.push('Depth exceeds this zone by '+nice(effectiveDepth-zd)+' in, including the entered front-use allowance.');
      if(tooTall)messages.push('Height exceeds the entered clear height by '+nice(h-zh)+' in.');
      if(fit==='within')messages.push('Within the entered rectangular envelope: '+nice(zw-effectiveWidth)+' in width and '+nice(zd-effectiveDepth)+' in depth remain after your allowances. This does not confirm the full room layout.');
      if((tooWide||tooDeep)&&d+side<=zw&&w+front<=zd&&!tooTall)messages.push('Rotating the outer footprint may help; test access and usability in that orientation rather than assuming it works.');
      if(h===null||zh===null)messages.push('Height is not fully checked. Record furniture height and available clear height, especially for tall cabinets.');
      if(input.zone==='hall-target')messages.push('The hall preset is a sofa shopping target, not a measured floor zone. The chaise may need a different layout.');
      if(input.zone==='closet-note')messages.push('The closet width is an interpretation of the notebook. Confirm its true inside width and sliding-door opening.');
      if(input.zone==='pantry-tall')messages.push('The tall-pantry option assumes the upper cupboard is removed and the resulting height is measured.');
      if(!input.measurementsConfirmed)messages.push('Remeasure this usable zone on site before treating the dimensions as reliable.');
      if(!input.layoutChecked)messages.push('Door and drawer operation, heater clearances, condition and the delivery route still need checking.');
    }
    const category=input.category||'other';
    const duplicated=['desk','console','bookcase'].includes(category)&&!input.alreadyOwned&&!input.newNeedConfirmed;
    if(duplicated)messages.push('We already own a '+({console:'TV console',bookcase:'bookcase',desk:'desk'}[category])+'. Try that piece first; a second purchase needs a distinct, measured purpose.');
    if(input.alreadyOwned)messages.push('Already owned: prioritize a usable placement or modest repair rather than buying a replacement just for color matching.');
    const price=nonnegative(input.price),delivery=nonnegative(input.delivery),repair=nonnegative(input.repair),budget=nonnegative(input.budget);
    const total=price!==null&&delivery!==null&&repair!==null?Math.round((price+delivery+repair)*100)/100:null;
    const overBudget=total!==null&&budget!==null&&total>budget+.001;
    if(!input.alreadyOwned){
      if(total===null)messages.push('Enter the asking price, collection/delivery/tax and repair allowance to estimate the total cost.');
      if(budget===null)messages.push('Set your own total budget ceiling before judging whether this is affordable.');
      if(overBudget)messages.push('The estimated total is $'+(total-budget).toFixed(2)+' above your entered budget.');
      messages.push('A low price is not proof of value: check joints, swelling, missing parts, upholstery condition and the effort of moving or restoring it.');
    }
    messages.push(colorAdvice[input.color]||colorAdvice.unknown);
    let headline='Hold — measurements are missing';
    if(fit==='outside'){headline=input.measurementsConfirmed?'Too large for this entered zone':'Outside this provisional envelope';state='outside';}
    else if(overBudget){headline='Hold — over your total budget';}
    else if(duplicated){headline='Pause — use the piece we own first';}
    else if(fit==='within'){
      if(!input.measurementsConfirmed||!input.layoutChecked||h===null||zh===null){headline=input.alreadyOwned?'Reuse candidate — placement still needs checking':'Hold — check the layout before reserving';}
      else if(input.alreadyOwned){headline='Reuse candidate — within your entered limits';state='within';}
      else if(total===null||budget===null){headline='Size looks workable — value check incomplete';}
      else{headline='Shortlist candidate — review the actual piece';state='within';}
    }
    return {headline,state,fit,messages,total,overBudget,duplicated,geometry:{width:w,depth:d,zoneWidth:zw,zoneDepth:zd,effectiveWidth,effectiveDepth},color:colorAdvice[input.color]||colorAdvice.unknown};
  }
  const api={evaluate,positive,nonnegative};root.DoverFurnitureChecks=api;if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof globalThis!=='undefined'?globalThis:this);
