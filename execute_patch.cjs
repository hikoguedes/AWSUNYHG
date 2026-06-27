const fs = require('fs');
const vm = require('vm');

const srcFile = './index-8Dm9UXr_.js.bak';
const destFile = './dist/assets/index-8Dm9UXr_.js';

console.log('--- START PATCH PROCESS ---');

// 1. Read progress bar replacement dynamically from test_progress_only.js
const progressOnlyCode = fs.readFileSync('./test_progress_only.js', 'utf8');
const progressRegex = /const progressReplacementText = '([\s\S]+?)';\r?\n/m;
const progressMatch = progressOnlyCode.match(progressRegex);
if (!progressMatch) {
  console.error('Failed to extract progressReplacementText from test_progress_only.js');
  process.exit(1);
}

// We unescape single quotes, backticks, template expressions, and double backslashes
const progressReplacementTextRaw = progressMatch[1]
  .replace(/\\'/g, "'")
  .replace(/\\\`/g, "`")
  .replace(/\\\${/g, "${")
  .replace(/\\\\/g, '\\');

console.log('Loaded progressReplacementText length:', progressReplacementTextRaw.length);

// 2. Read original minified asset
let content = fs.readFileSync(srcFile, 'utf8');

// 3. Patch 1: Hide B2B balance
const balanceTarget = 'elative overflow-hidden glass\",children:[e.jsx(\"span\",{className:\"text-[10px] text-slate-455 font-bold block mb-1 uppercase tracking-wider\",children:\"Saldo Credito B2B\"';
const balanceReplacement = 'elative overflow-hidden glass hidden\",children:[e.jsx(\"span\",{className:\"text-[10px] text-slate-455 font-bold block mb-1 uppercase tracking-wider\",children:\"Saldo Credito B2B\"';
if (content.includes(balanceTarget)) {
  content = content.replace(balanceTarget, balanceReplacement);
  console.log('1. HIDE BALANCE: SUCCESS');
} else {
  console.error('1. HIDE BALANCE target not found');
  process.exit(1);
}

// 4. Patch 2: Move progress bar
const progressTarget1 = ',e.jsxs("div",{className:"space-y-2",children:[e.jsx("div",{className:"flex justify-between items-center text-[10px] font-extrabold text-slate-655 leading-none",children:e.jsxs("span",{children:["Passo ",fe(),"/5 Completo"]})}),e.jsx("div",{className:"w-full h-2 bg-slate-100 rounded-full overflow-hidden",children:e.jsx("div",{className:"h-full bg-gradient-to-r from-[#6366f1] to-[#06b6d4] rounded-full transition-all duration-700",style:{width:`${ts()}%`}})})]})';
const progressTarget2 = 'Buscar"]})]})]}) }),e.jsxs("div",{className:"grid grid-cols-1 xl:grid-cols-12 gap-4 items-start",children:[';

// Wait, let's verify if progressTarget2 in original content has a space or not:
// In index-8Dm9UXr_.js.bak, the string is Buscar"]})]})]})}),e.jsxs("div", ... (no space between }) and }) )
const progressTarget2Clean = 'Buscar"]})]})]})}),e.jsxs("div",{className:"grid grid-cols-1 xl:grid-cols-12 gap-4 items-start",children:[';

if (content.includes(progressTarget1) && content.includes(progressTarget2Clean)) {
  content = content.replace(progressTarget1, '').replace(progressTarget2Clean, progressReplacementTextRaw);
  console.log('2. MOVE PROGRESS BAR: SUCCESS');
} else {
  console.error('2. MOVE PROGRESS BAR targets not found');
  process.exit(1);
}

// 5. Patch 3: Move Auditoria e Mercado block & simplify checkout card
const startStr = ',e.jsxs("div",{className:"bg-white border border-[#e2e8f0] rounded-3xl p-5 shadow-sm space-y-4 glass mt-4",children:[e.jsxs("div",{className:"flex items-center justify-between border-b border-[#e2e8f0] pb-2"';
const startIndex = content.indexOf(startStr);
if (startIndex === -1) {
  console.error('3. MOVE AUDITORIA: startStr not found');
  process.exit(1);
}

const endPrefix = 'Use o seu bônus de jogo no checkout para resgatar benefícios exclusivos ou upgrades de cabine!"';
const endPrefixIndex = content.indexOf(endPrefix, startIndex);
if (endPrefixIndex === -1) {
  console.error('3. MOVE AUDITORIA: endPrefix not found');
  process.exit(1);
}

const closes = '})]})]})]})';
const closesIndex = content.indexOf(closes, endPrefixIndex);
if (closesIndex === -1) {
  console.error('3. MOVE AUDITORIA: closes not found');
  process.exit(1);
}

const endIndex = closesIndex + closes.length;
const auditoriaTarget = content.substring(startIndex, endIndex);

// Remove auditoriaTarget from Column 1 but RESTORE the Column 1 closing brackets ']})'
content = content.replace(auditoriaTarget, ']})');

const sectionPrefix = 'e.jsx("section",{className:"xl:col-span-3 space-y-6",children:e.jsxs("div",{className:"bg-white border border-[#e2e8f0] rounded-3xl p-6 shadow-sm space-y-6 glass",children:[e.jsxs("div",{className:"flex items-center justify-between border-b border-[#e2e8f0] pb-3",children:[e.jsx("span",{className:"text-xs font-extrabold text-slate-800 font-display",children:"VIAGEM EM CONSTRUÇÃO"}),';
const t2Index = content.indexOf(sectionPrefix);
if (t2Index === -1) {
  console.error('3. MOVE AUDITORIA: sectionPrefix not found');
  process.exit(1);
}

// Trace closing parenthesis of original section call with string-awareness
const startParenIndex = content.indexOf('(', t2Index);
let parenCount = 1;
let sectionEndIndex = -1;
let inStr = false;
let strChar = '';
for (let i = startParenIndex + 1; i < content.length; i++) {
  const c = content[i];
  if ((c === '"' || c === "'" || c === '`') && content[i-1] !== '\\') {
    if (!inStr) {
      inStr = true;
      strChar = c;
    } else if (c === strChar) {
      inStr = false;
    }
  }
  if (!inStr) {
    if (c === '(') parenCount++;
    else if (c === ')') parenCount--;
  }
  if (parenCount === 0) {
    sectionEndIndex = i;
    break;
  }
}

if (sectionEndIndex === -1) {
  console.error('3. MOVE AUDITORIA: section closing paren not found');
  process.exit(1);
}

const originalSectionCall = content.substring(t2Index, sectionEndIndex + 1);

// Extract Auditoria call (strip leading comma AND strip the last Column 1 closing brackets ']})')
const auditoriaCall = auditoriaTarget.substring(1).slice(0, -3);

// Redesigned summary card containing ONLY "Total Geral" and "Reservar Pacote"
const newDivCall = 'e.jsx("div",{className:"bg-white border border-[#e2e8f0] rounded-3xl p-6 shadow-sm glass",children:e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsxs("div",{children:[e.jsx("span",{className:"text-[9px] text-slate-400 font-bold block uppercase leading-none",children:"Total Geral"}),e.jsxs("span",{className:"text-xl font-black text-slate-800 font-display mt-1.5 block",children:["R$ ",be().toLocaleString("pt-BR"),",00"]})]}),e.jsx("button",{onClick:()=>re(!0),className:"px-4 py-2.5 bg-[#6366f1] hover:bg-[#4f46e5] text-white font-black text-xs rounded-xl shadow-md transition-all font-display",children:"Reservar Pacote"})]})})';

// New section call containing ONLY Auditoria (balanced) since checkout card was moved to the top stepper
const newSectionCall = `e.jsx("section",{className:"xl:col-span-3 space-y-6",children:${auditoriaCall}})`;

content = content.replace(originalSectionCall, newSectionCall);
console.log('3. MOVE AUDITORIA & SIMPLIFY CARD: SUCCESS');

// 5.5 Patch 4: Render Airline Logos in Flight Cards
const logoTarget = 'e.jsx("div",{className:"w-8 h-8 bg-indigo-50/70 rounded-xl flex items-center justify-center font-bold text-[#6366f1] text-[10px] border border-indigo-100",children:s.logo||"✈️"})';
const logoReplacement = 'e.jsx("div",{className:"w-20 h-10 bg-white rounded-xl flex items-center justify-center border border-slate-100 overflow-hidden shrink-0",children:(s.logo||s.provider||s.airline||"").toLowerCase().includes("azul")?e.jsx("img",{src:"/logo-azul.svg",className:"w-full h-full object-contain p-1"}):(s.logo||s.provider||s.airline||"").toLowerCase().includes("latam")?e.jsx("img",{src:"/logo-latam.svg",className:"w-full h-full object-contain p-1"}):(s.logo||s.provider||s.airline||"").toLowerCase().includes("gol")?e.jsx("img",{src:"/logo-gol.svg",className:"w-full h-full object-contain p-1"}):(s.logo||s.provider||s.airline||"").toLowerCase().includes("voepass")?e.jsx("img",{src:"/logo-voepass.png",className:"w-full h-full object-contain p-1"}):s.logo||"✈️"})';

if (content.includes(logoTarget)) {
  content = content.replace(logoTarget, logoReplacement);
  console.log('4. RENDER FLIGHT LOGOS: SUCCESS');
} else {
  console.error('4. RENDER FLIGHT LOGOS target not found');
  process.exit(1);
}

// 5.5 Patch 5: Toggle Selection Handlers
const handlersTarget = 'as=(s,n)=>{const B=n?n.clientX:window.innerWidth/2,N=n?n.clientY:window.innerHeight/2;_e(s),ae(U=>U+50),q({name:s.name,type:"hotel",startX:B,startY:N}),ie(`🏨 ${s.name} selecionado!`),setTimeout(()=>{q(null),c(2)},900)},is=(s,n)=>{const B=n?n.clientX:window.innerWidth/2,N=n?n.clientY:window.innerHeight/2;Le(s),ae(U=>U+20),q({name:s.description||s.name,type:"car",startX:B,startY:N}),ie(`🚗 ${s.description||s.name} adicionado ao pacote!`),setTimeout(()=>{q(null),c(3)},900)},rs=(s,n)=>{const B=n?n.clientX:window.innerWidth/2,N=n?n.clientY:window.innerHeight/2;Ie(s),ae(Z=>Z+10);const U=s.provider||s.airline;q({name:U,type:"flight",startX:B,startY:N}),ie(`✈️ Voo da ${U} adicionado!`),setTimeout(()=>{q(null),c(4)},900)},ns=(s,n)=>{const B=n?n.clientX:window.innerWidth/2,N=n?n.clientY:window.innerHeight/2;$e(s),ae(Z=>Z+10);const U=s.provider||s.company;q({name:U,type:"bus",startX:B,startY:N}),ie(`🚌 Ônibus da ${U} adicionado!`),setTimeout(()=>{q(null),c(5)},900)},os=(s,n)=>{const B=n?n.clientX:window.innerWidth/2,N=n?n.clientY:window.innerHeight/2;Me(s),q({name:s.planName||s.name,type:"insurance",startX:B,startY:N}),ie(`🛡️ ${s.planName||s.name} contratado!`),setTimeout(()=>{q(null)},900)}';

const handlersReplacement = 'as=(s,n)=>{const B=n?n.clientX:window.innerWidth/2,N=n?n.clientY:window.innerHeight/2;if(h&&h.id===s.id){_e(null),ie(`🏨 ${s.name} removido!`)}else{_e(s),ae(U=>U+50),q({name:s.name,type:"hotel",startX:B,startY:N}),ie(`🏨 ${s.name} selecionado!`),setTimeout(()=>{q(null),c(2)},900)}},is=(s,n)=>{const B=n?n.clientX:window.innerWidth/2,N=n?n.clientY:window.innerHeight/2;if(x&&x.id===s.id){Le(null),ie(`🚗 ${s.description||s.name} removido!`)}else{Le(s),ae(U=>U+20),q({name:s.description||s.name,type:"car",startX:B,startY:N}),ie(`🚗 ${s.description||s.name} adicionado ao pacote!`),setTimeout(()=>{q(null),c(3)},900)}},rs=(s,n)=>{const B=n?n.clientX:window.innerWidth/2,N=n?n.clientY:window.innerHeight/2;if(d&&d.id===s.id){Ie(null),ie(`✈️ Voo da ${s.provider||s.airline} removido!`)}else{Ie(s),ae(Z=>Z+10);const U=s.provider||s.airline;q({name:U,type:"flight",startX:B,startY:N}),ie(`✈️ Voo da ${U} adicionado!`),setTimeout(()=>{q(null),c(4)},900)}},ns=(s,n)=>{const B=n?n.clientX:window.innerWidth/2,N=n?n.clientY:window.innerHeight/2;if(m&&m.id===s.id){$e(null),ie(`🚌 Ônibus da ${s.provider||s.company} removido!`)}else{$e(s),ae(Z=>Z+10);const U=s.provider||s.company;q({name:U,type:"bus",startX:B,startY:N}),ie(`🚌 Ônibus da ${U} adicionado!`),setTimeout(()=>{q(null),c(5)},900)}},os=(s,n)=>{const B=n?n.clientX:window.innerWidth/2,N=n?n.clientY:window.innerHeight/2;if(p&&p.id===s.id){Me(null),ie(`🛡️ ${s.planName||s.name} removido!`)}else{Me(s),q({name:s.planName||s.name,type:"insurance",startX:B,startY:N}),ie(`🛡️ ${s.planName||s.name} contratado!`),setTimeout(()=>{q(null)},900)}}';

if (content.includes(handlersTarget)) {
  content = content.replace(handlersTarget, handlersReplacement);
  console.log('5. TOGGLE HANDLERS: SUCCESS');
} else {
  console.error('5. TOGGLE HANDLERS target not found');
  process.exit(1);
}

// 5.6 Patch 6: Card visual styling & buttons (Hotel, Car, Flight, Bus, Insurance)

// 6.1 Hotel Card Wrapper & Button
const hotelWrapperTarget = 'T.map(s=>e.jsxs("div",{className:"bg-white border border-[#e2e8f0] hover:border-amber-400 hover:shadow-lg rounded-3xl overflow-hidden flex flex-col justify-between transition-all glass",children:[e.jsxs("div"';
const hotelWrapperRepl = 'T.map(s=>e.jsxs("div",{className:"bg-white border border-[#e2e8f0] hover:border-amber-400 hover:shadow-lg rounded-3xl overflow-hidden flex flex-col justify-between transition-all glass",style:{position:"relative",borderColor:(h==null?void 0:h.id)===s.id?"#10b981":"",borderWidth:(h==null?void 0:h.id)===s.id?"2px":""},children:[(h==null?void 0:h.id)===s.id&&e.jsx("span",{className:"absolute top-3 left-3 text-white text-[9px] font-black px-2.5 py-1 rounded-full shadow font-display z-20",style:{backgroundColor:"#10b981"},children:"SELECIONADO"}),e.jsxs("div"';

const hotelBtnTarget = 'e.jsx("button",{onClick:n=>as(s,n),className:`px-4 py-2 rounded-xl text-xs font-bold transition-all font-display ${(h==null?void 0:h.id)===s.id?"bg-emerald-500 text-white shadow-sm":"bg-[#f59e0b] hover:bg-[#d97706] text-white shadow-md shadow-amber-100 font-display"}`,children:(h==null?void 0:h.id)===s.id?"Selecionado":"Selecionar"})';
const hotelBtnRepl = 'e.jsx("button",{onClick:n=>as(s,n),className:`px-4 py-2 rounded-xl text-xs font-bold transition-all font-display ${(h==null?void 0:h.id)===s.id?"bg-red-500 hover:bg-red-600 text-white shadow-sm":"bg-[#f59e0b] hover:bg-[#d97706] text-white shadow-md shadow-amber-100 font-display"}`,style:{backgroundColor:(h==null?void 0:h.id)===s.id?"#ef4444":""},children:(h==null?void 0:h.id)===s.id?"Cancelar":"Selecionar"})';

if (content.includes(hotelWrapperTarget) && content.includes(hotelBtnTarget)) {
  content = content.replace(hotelWrapperTarget, hotelWrapperRepl).replace(hotelBtnTarget, hotelBtnRepl);
  console.log('6.1 HOTEL CARDS UPDATE: SUCCESS');
} else {
  console.error('6.1 HOTEL CARDS targets not found');
  process.exit(1);
}

// 6.2 Car Card Wrapper & Button
const carWrapperTarget = 'le.map(s=>e.jsxs("div",{className:"bg-white border border-[#e2e8f0] hover:border-sky-400 hover:shadow-lg rounded-3xl p-4 flex flex-col justify-between h-[375px] transition-all glass",children:[e.jsxs("div"';
const carWrapperRepl = 'le.map(s=>e.jsxs("div",{className:"bg-white border border-[#e2e8f0] hover:border-sky-400 hover:shadow-lg rounded-3xl p-4 flex flex-col justify-between h-[375px] transition-all glass",style:{position:"relative",borderColor:(x==null?void 0:x.id)===s.id?"#10b981":"",borderWidth:(x==null?void 0:x.id)===s.id?"2px":""},children:[(x==null?void 0:x.id)===s.id&&e.jsx("span",{className:"absolute top-6 left-6 text-white text-[9px] font-black px-2.5 py-1 rounded-full shadow font-display z-20",style:{backgroundColor:"#10b981"},children:"SELECIONADO"}),e.jsxs("div"';

const carBtnTarget = 'e.jsx("button",{onClick:n=>is(s,n),className:`w-full py-2 rounded-xl text-[10px] font-bold transition-all font-display ${(x==null?void 0:x.id)===s.id?"bg-emerald-500 text-white shadow-sm":"bg-[#0ea5e9] hover:bg-[#0284c7] text-white shadow-md shadow-sky-100 font-display"}`,children:(x==null?void 0:x.id)===s.id?"Selecionado":"Selecionar"})';
const carBtnRepl = 'e.jsx("button",{onClick:n=>is(s,n),className:`w-full py-2 rounded-xl text-[10px] font-bold transition-all font-display ${(x==null?void 0:x.id)===s.id?"bg-red-500 hover:bg-red-600 text-white shadow-sm":"bg-[#0ea5e9] hover:bg-[#0284c7] text-white shadow-md shadow-sky-100 font-display"}`,style:{backgroundColor:(x==null?void 0:x.id)===s.id?"#ef4444":""},children:(x==null?void 0:x.id)===s.id?"Cancelar":"Selecionar"})';

if (content.includes(carWrapperTarget) && content.includes(carBtnTarget)) {
  content = content.replace(carWrapperTarget, carWrapperRepl).replace(carBtnTarget, carBtnRepl);
  console.log('6.2 CAR CARDS UPDATE: SUCCESS');
} else {
  console.error('6.2 CAR CARDS targets not found');
  process.exit(1);
}

// 6.3 Flight Card Wrapper & Button
const flightWrapperTarget = 'te.map(s=>e.jsxs("div",{className:"bg-white border border-[#e2e8f0] hover:border-indigo-400 hover:shadow-lg rounded-3xl overflow-hidden flex flex-col md:flex-row transition-all glass",children:[s.image&&e.jsx("div",{className:"w-full md:w-36 h-28 md:h-auto bg-slate-100 relative shrink-0",children:e.jsx("img",{src:s.image,alt:s.airline,className:"w-full h-full object-cover"})})';
const flightWrapperRepl = 'te.map(s=>e.jsxs("div",{className:"bg-white border border-[#e2e8f0] hover:border-indigo-400 hover:shadow-lg rounded-3xl overflow-hidden flex flex-col md:flex-row transition-all glass",style:{position:"relative",borderColor:(d==null?void 0:d.id)===s.id?"#10b981":"",borderWidth:(d==null?void 0:d.id)===s.id?"2px":""},children:[(d==null?void 0:d.id)===s.id&&e.jsx("span",{className:"absolute top-3 right-3 text-white text-[9px] font-black px-2.5 py-1 rounded-full shadow font-display z-20",style:{backgroundColor:"#10b981"},children:"SELECIONADO"}),s.image&&e.jsx("div",{className:"w-full md:w-36 h-28 md:h-auto bg-slate-100 relative shrink-0",children:e.jsx("img",{src:s.image,alt:s.airline,className:"w-full h-full object-cover"})})';

const flightBtnTarget = 'e.jsx("button",{onClick:n=>rs(s,n),className:`px-4 py-1.5 rounded-xl font-bold transition-all font-display ${(d==null?void 0:d.id)===s.id?"bg-emerald-500 text-white shadow-sm":"bg-[#6366f1] hover:bg-[#4f46e5] text-white shadow-md shadow-indigo-100 font-display"}`,children:(d==null?void 0:d.id)===s.id?"Selecionado":"Selecionar"})';
const flightBtnRepl = 'e.jsx("button",{onClick:n=>rs(s,n),className:`px-4 py-1.5 rounded-xl font-bold transition-all font-display ${(d==null?void 0:d.id)===s.id?"bg-red-500 hover:bg-red-600 text-white shadow-sm":"bg-[#6366f1] hover:bg-[#4f46e5] text-white shadow-md shadow-indigo-100 font-display"}`,style:{backgroundColor:(d==null?void 0:d.id)===s.id?"#ef4444":""},children:(d==null?void 0:d.id)===s.id?"Cancelar":"Selecionar"})';

if (content.includes(flightWrapperTarget) && content.includes(flightBtnTarget)) {
  content = content.replace(flightWrapperTarget, flightWrapperRepl).replace(flightBtnTarget, flightBtnRepl);
  console.log('6.3 FLIGHT CARDS UPDATE: SUCCESS');
} else {
  console.error('6.3 FLIGHT CARDS targets not found');
  process.exit(1);
}

// 6.4 Bus Card Wrapper & Button
const busWrapperTarget = 'L.map(s=>e.jsxs("div",{className:"bg-white border border-[#e2e8f0] hover:border-pink-400 hover:shadow-lg rounded-3xl overflow-hidden flex flex-col md:flex-row transition-all glass",children:[s.image&&e.jsx("div",{className:"w-full md:w-36 h-28 md:h-auto bg-slate-100 relative shrink-0",children:e.jsx("img",{src:s.image,alt:s.provider,className:"w-full h-full object-cover"})})';
const busWrapperRepl = 'L.map(s=>e.jsxs("div",{className:"bg-white border border-[#e2e8f0] hover:border-pink-400 hover:shadow-lg rounded-3xl overflow-hidden flex flex-col md:flex-row transition-all glass",style:{position:"relative",borderColor:(m==null?void 0:m.id)===s.id?"#10b981":"",borderWidth:(m==null?void 0:m.id)===s.id?"2px":""},children:[(m==null?void 0:m.id)===s.id&&e.jsx("span",{className:"absolute top-3 right-3 text-white text-[9px] font-black px-2.5 py-1 rounded-full shadow font-display z-20",style:{backgroundColor:"#10b981"},children:"SELECIONADO"}),s.image&&e.jsx("div",{className:"w-full md:w-36 h-28 md:h-auto bg-slate-100 relative shrink-0",children:e.jsx("img",{src:s.image,alt:s.provider,className:"w-full h-full object-cover"})})';

const busBtnTarget = 'e.jsx("button",{onClick:n=>ns(s,n),className:`px-4 py-1.5 rounded-xl font-bold transition-all font-display ${(m==null?void 0:m.id)===s.id?"bg-emerald-500 text-white shadow-sm":"bg-[#ec4899] hover:bg-[#db2777] text-white shadow-md shadow-pink-100 font-display"}`,children:(m==null?void 0:m.id)===s.id?"Selecionado":"Selecionar"})';
const busBtnRepl = 'e.jsx("button",{onClick:n=>ns(s,n),className:`px-4 py-1.5 rounded-xl font-bold transition-all font-display ${(m==null?void 0:m.id)===s.id?"bg-red-500 hover:bg-red-600 text-white shadow-sm":"bg-[#ec4899] hover:bg-[#db2777] text-white shadow-md shadow-pink-100 font-display"}`,style:{backgroundColor:(m==null?void 0:m.id)===s.id?"#ef4444":""},children:(m==null?void 0:m.id)===s.id?"Cancelar":"Selecionar"})';

if (content.includes(busWrapperTarget) && content.includes(busBtnTarget)) {
  content = content.replace(busWrapperTarget, busWrapperRepl).replace(busBtnTarget, busBtnRepl);
  console.log('6.4 BUS CARDS UPDATE: SUCCESS');
} else {
  console.error('6.4 BUS CARDS targets not found');
  process.exit(1);
}

// 6.5 Insurance Card Wrapper & Button
const insWrapperTarget = 'z.map(s=>e.jsxs("div",{className:"bg-white border border-[#e2e8f0] hover:border-rose-400 hover:shadow-lg rounded-3xl p-5 flex flex-col justify-between h-[320px] transition-all glass",children:[e.jsxs("div",{className:"space-y-2",children:[e.jsx("div",{className:"w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center text-[#f43f5e] border border-rose-100",children:e.jsx(we,{className:"w-5 h-5"})}),e.jsx("h3",{className:"font-bold text-slate-855 text-xs leading-tight font-display",children:s.planName||s.name})';
const insWrapperRepl = 'z.map(s=>e.jsxs("div",{className:"bg-white border border-[#e2e8f0] hover:border-rose-400 hover:shadow-lg rounded-3xl p-5 flex flex-col justify-between h-[320px] transition-all glass",style:{position:"relative",borderColor:(p==null?void 0:p.id)===s.id?"#10b981":"",borderWidth:(p==null?void 0:p.id)===s.id?"2px":""},children:[(p==null?void 0:p.id)===s.id&&e.jsx("span",{className:"absolute top-5 right-5 text-white text-[9px] font-black px-2.5 py-1 rounded-full shadow font-display z-20",style:{backgroundColor:"#10b981"},children:"SELECIONADO"}),e.jsxs("div",{className:"space-y-2",children:[e.jsx("div",{className:"w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center text-[#f43f5e] border border-rose-100",children:e.jsx(we,{className:"w-5 h-5"})}),e.jsx("h3",{className:"font-bold text-slate-855 text-xs leading-tight font-display",children:s.planName||s.name})';

const insBtnTarget = 'e.jsx("button",{onClick:n=>os(s,n),className:`w-full py-2 rounded-xl text-[10px] font-bold transition-all font-display ${(p==null?void 0:p.id)===s.id?"bg-emerald-500 text-white shadow-sm":"bg-[#f43f5e] hover:bg-[#e11d48] text-white shadow-md shadow-rose-100 font-display"}`,children:(p==null?void 0:p.id)===s.id?"Contratado":"Contratar"})';
const insBtnRepl = 'e.jsx("button",{onClick:n=>os(s,n),className:`w-full py-2 rounded-xl text-[10px] font-bold transition-all font-display ${(p==null?void 0:p.id)===s.id?"bg-red-500 hover:bg-red-600 text-white shadow-sm":"bg-[#f43f5e] hover:bg-[#e11d48] text-white shadow-md shadow-rose-100 font-display"}`,style:{backgroundColor:(p==null?void 0:p.id)===s.id?"#ef4444":""},children:(p==null?void 0:p.id)===s.id?"Cancelar":"Contratar"})';

if (content.includes(insWrapperTarget) && content.includes(insBtnTarget)) {
  content = content.replace(insWrapperTarget, insWrapperRepl).replace(insBtnTarget, insBtnRepl);
  console.log('6.5 INSURANCE CARDS UPDATE: SUCCESS');
} else {
  console.error('6.5 INSURANCE CARDS targets not found');
  process.exit(1);
}

// 5.7 Patch 7: Hide Left Sidebar (Simple Open Tag Replacement)
const sidebarTarget = 'e.jsxs("aside",{className:"w-[260px] bg-white border-r border-[#e2e8f0] flex flex-col justify-between p-6 shrink-0 hidden lg:flex",';
const sidebarReplacement = 'e.jsxs("aside",{className:"hidden",';

if (content.includes(sidebarTarget)) {
  content = content.replace(sidebarTarget, sidebarReplacement);
  console.log('7. HIDE SIDEBAR: SUCCESS');
} else {
  console.error('7. HIDE SIDEBAR target not found');
  process.exit(1);
}

// 5.8 Patch 8: Add Top-Right User Dropdown Menu
const headerTarget = 'e.jsxs("div",{className:"flex items-center justify-between text-[11px] font-semibold text-slate-450",children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("span",{children:"Unyco Brocker"}),e.jsx(X,{className:"w-3 h-3"}),e.jsx("span",{className:"text-slate-800 font-bold",children:"Nova Viagem Híbrida"})]}),e.jsxs("div",{children:["Locatário do IIPF Consolidado : ",e.jsx("span",{className:"text-slate-750 font-bold",children:"Unyco Brocker"})]})]})';

const headerReplacement = 'e.jsxs("div",{className:"flex items-center justify-between text-[11px] font-semibold text-slate-450",children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("span",{children:"Unyco Brocker"}),e.jsx(X,{className:"w-3 h-3"}),e.jsx("span",{className:"text-slate-800 font-bold",children:"Nova Viagem Híbrida"})]}),e.jsxs("div",{className:"flex items-center gap-4 relative z-50",children:[e.jsxs("div",{className:"hidden md:block",children:["Locatário do IIPF Consolidado : ",e.jsx("span",{className:"text-slate-750 font-bold",children:"Unyco Brocker"})]}),e.jsxs("div",{className:"relative",children:[e.jsxs("button",{onClick:()=>document.getElementById("profile-dropdown").classList.toggle("hidden"),className:"flex items-center gap-2 px-3 py-1.5 bg-white border border-[#e2e8f0] hover:border-slate-300 rounded-xl transition shadow-sm cursor-pointer",children:[e.jsx("div",{className:"w-6 h-6 bg-gradient-to-r from-[#6366f1] to-[#06b6d4] rounded-lg flex items-center justify-center text-white font-black text-[10px] font-display",children:"un"}),e.jsx("span",{className:"font-bold text-slate-750 text-xs",children:"Hiko Gueder"}),e.jsx("svg",{className:"w-3 h-3 text-slate-400",fill:"none",stroke:"currentColor",strokeWidth:"2.5",viewBox:"0 0 24 24",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M19 9l-7 7-7-7"})})]}),e.jsxs("div",{id:"profile-dropdown",className:"absolute right-0 mt-2 w-64 bg-white border border-[#e2e8f0] rounded-2xl shadow-xl p-4 hidden z-[999] space-y-4",children:[e.jsxs("div",{className:"flex items-center gap-3 pb-3 border-b border-slate-100",children:[e.jsx("div",{className:"w-8 h-8 bg-gradient-to-r from-[#6366f1] to-[#06b6d4] rounded-lg flex items-center justify-center text-white font-black text-xs font-display",children:"un"}),e.jsxs("div",{children:[e.jsx("span",{className:"font-bold text-slate-800 text-xs block leading-none font-display",children:"Hiko Gueder"}),e.jsx("span",{className:"text-[8px] text-slate-400 font-bold uppercase tracking-wider block mt-1",children:"B2B MULTITENANT"})]})]}),e.jsxs("nav",{className:"space-y-1 pb-3 border-b border-slate-100",children:[e.jsxs("button",{className:"w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-slate-500 hover:bg-slate-50 hover:text-slate-700 font-semibold text-xs transition text-left",children:[e.jsx(ms,{className:"w-3.5 h-3.5 text-slate-400"})," Dashboard"]}),e.jsxs("button",{className:"w-full flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-50/70 text-[#6366f1] font-bold text-xs transition border border-indigo-100/50 text-left",children:[e.jsx(Ft,{className:"w-3.5 h-3.5"})," Nova Viagem Híbrida"]}),e.jsxs("button",{className:"w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-slate-500 hover:bg-slate-50 hover:text-slate-700 font-semibold text-xs transition text-left",children:[e.jsx(Vt,{className:"w-3.5 h-3.5 text-slate-400"})," Meus Bônus"]}),e.jsxs("button",{className:"w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-slate-500 hover:bg-slate-50 hover:text-slate-700 font-semibold text-xs transition text-left",children:[e.jsx(Bt,{className:"w-3.5 h-3.5 text-slate-400"})," Meus Pedidos"]})]}),e.jsxs("div",{className:"space-y-3",children:[e.jsxs("div",{className:"flex items-center gap-3 px-1",children:[e.jsx("div",{className:"w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 text-xs font-bold font-display",children:"U"}),e.jsxs("div",{className:"min-w-0",children:[e.jsx("span",{className:"font-bold text-slate-800 text-[11px] block leading-none font-display",children:"Hiko Gueder"}),e.jsx("span",{className:"text-[8px] text-slate-400 block truncate mt-1 uppercase font-bold",children:"AGÊNCIA ADMINISTRATIVA"})]})]}),e.jsxs("button",{className:"w-full flex items-center gap-2 px-3 py-1.5 text-slate-400 hover:text-red-500 font-semibold text-xs transition rounded-lg hover:bg-red-50/50 text-left",children:[e.jsx(Ls,{className:"w-3.5 h-3.5"})," Sair"]})]})]})]})]})]})';

if (content.includes(headerTarget)) {
  content = content.replace(headerTarget, headerReplacement);
  console.log('8. USER DROPDOWN: SUCCESS');
} else {
  console.error('8. USER DROPDOWN target not found');
  process.exit(1);
}

// 5.9 Patch 9: Fix modal form price formatting (,00 display bug with float prices)
const modalSubtotalTarget = 'children:["R$ ",be().toLocaleString("pt-BR"),",00"]';
const modalSubtotalReplacement = 'children:["R$ ",be().toLocaleString("pt-BR",{minimumFractionDigits:2,maximumFractionDigits:2})]';

const modalTotalTarget = 'children:["R$ ",(be()-he).toLocaleString("pt-BR"),",00"]';
const modalTotalReplacement = 'children:["R$ ",(be()-he).toLocaleString("pt-BR",{minimumFractionDigits:2,maximumFractionDigits:2})]';

if (content.includes(modalSubtotalTarget) && content.includes(modalTotalTarget)) {
  content = content.replace(modalSubtotalTarget, modalSubtotalReplacement)
                   .replace(modalTotalTarget, modalTotalReplacement);
  console.log('9. MODAL PRICES FORMAT: SUCCESS');
} else {
  console.error('9. MODAL PRICES FORMAT target not found');
  process.exit(1);
}

// 5.10 Patch 10: Dynamic Hotel Nights and Subtotals
const beTarget = 'be=()=>{let s=0;return h&&(s+=(h.finalPrice||h.valor_venda)*3),x&&(s+=x.finalPrice||x.price),d&&(s+=d.finalPrice||d.price),m&&(s+=m.finalPrice||m.price),p&&(s+=p.finalPrice||p.price),s}';
const beReplacement = 'be=()=>{let s=0;const n=Math.round((new Date(u)-new Date(S))/864e5)||3;return h&&(s+=(h.finalPrice||h.valor_venda)*n),x&&(s+=x.finalPrice||x.price),d&&(s+=d.finalPrice||d.price),m&&(s+=m.finalPrice||m.price),p&&(s+=p.finalPrice||p.price),s}';

const modalNightsLabelTarget = 'children:[h.name," (3 Noites)"]';
const modalNightsLabelRepl = 'children:[h.name," (",(Math.round((new Date(u)-new Date(S))/864e5)||3)," Noites)"]';

const modalHotelPriceTarget = 'children:["R$ ",((h.finalPrice||h.valor_venda||0)*3).toLocaleString("pt-BR",{minimumFractionDigits:2,maximumFractionDigits:2})]';
const modalHotelPriceRepl = 'children:["R$ ",((h.finalPrice||h.valor_venda||0)*(Math.round((new Date(u)-new Date(S))/864e5)||3)).toLocaleString("pt-BR",{minimumFractionDigits:2,maximumFractionDigits:2})]';

if (content.includes(beTarget) && content.includes(modalNightsLabelTarget) && content.includes(modalHotelPriceTarget)) {
  content = content.replace(beTarget, beReplacement)
                   .replace(modalNightsLabelTarget, modalNightsLabelRepl)
                   .replace(modalHotelPriceTarget, modalHotelPriceRepl);
  console.log('10. DYNAMIC HOTEL NIGHTS AND SUBTOTALS: SUCCESS');
} else {
  console.error('10. DYNAMIC HOTEL NIGHTS AND SUBTOTALS targets not found');
  process.exit(1);
}

// 6. Write final patched file
fs.writeFileSync(destFile, content);
console.log('Wrote output file to scratch/index-8Dm9UXr_.js.fixed');

// 7. Verify syntax using vm.Script on formatted code
let testCode = content.replace(/import\s*(\*\s*as\s+\w+|\w+|,?\s*\{[^}]*\})\s*from\s*['"][^'"]+['"];?/g, '/* import */')
                      .replace(/import\s*['"][^'"]+['"];?/g, '/* import */')
                      .replace(/export\s*\{[^}]*\};?/g, '/* export */')
                      .replace(/export\ default\s+[^;]+;/g, '/* export default */');

let formatted = '';
let inString = false;
let stringChar = '';
for (let i = 0; i < testCode.length; i++) {
  const c = testCode[i];
  if ((c === '"' || c === "'" || c === '`') && testCode[i-1] !== '\\') {
    if (!inString) {
      inString = true;
      stringChar = c;
    } else if (c === stringChar) {
      inString = false;
    }
  }
  formatted += c;
  if (!inString && (c === '{' || c === '}' || c === ';')) {
    formatted += '\n';
  }
}

try {
  new vm.Script(formatted, { filename: 'formatted.js' });
  console.log('SYNTAX CHECK: PASSED SUCCESSFULLY!');
} catch (e) {
  console.log('SYNTAX CHECK: FAILED');
  console.log(e.message);
  const match = e.stack.match(/formatted\.js:(\d+)/);
  if (match) {
    const line = parseInt(match[1], 10);
    const lines = formatted.split('\n');
    for (let l = Math.max(0, line - 15); l < Math.min(lines.length, line + 15); l++) {
      console.log(`${l+1}${l+1 === line ? ' >>> ' : '     '}: ${lines[l]}`);
    }
  }
}
