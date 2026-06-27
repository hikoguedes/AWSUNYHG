const fs = require('fs');
const vm = require('vm');

const srcFile = 'C:/Users/Hiko/.gemini/antigravity/scratch/index-8Dm9UXr_.js.bak';
let content = fs.readFileSync(srcFile, 'utf8');

// 1. Hide balance B2B
const balanceTarget = 'elative overflow-hidden glass\",children:[e.jsx(\"span\",{className:\"text-[10px] text-slate-455 font-bold block mb-1 uppercase tracking-wider\",children:\"Saldo Credito B2B\"';
const balanceReplacement = 'elative overflow-hidden glass hidden\",children:[e.jsx(\"span\",{className:\"text-[10px] text-slate-455 font-bold block mb-1 uppercase tracking-wider\",children:\"Saldo Credito B2B\"';
content = content.replace(balanceTarget, balanceReplacement);

// 2. Move progress bar
const progressTarget1 = ',e.jsxs("div",{className:"space-y-2",children:[e.jsx("div",{className:"flex justify-between items-center text-[10px] font-extrabold text-slate-655 leading-none",children:e.jsxs("span",{children:["Passo ",fe(),"/5 Completo"]})}),e.jsx("div",{className:"w-full h-2 bg-slate-100 rounded-full overflow-hidden",children:e.jsx("div",{className:"h-full bg-gradient-to-r from-[#6366f1] to-[#06b6d4] rounded-full transition-all duration-700",style:{width:`${ts()}%`}})})]})';
const progressTarget2Clean = 'Buscar"]})]})]})}),e.jsxs("div",{className:"grid grid-cols-1 xl:grid-cols-12 gap-4 items-start",children:[';

const progressReplacementText = 'Buscar"]})]})]}) }),e.jsx("div",{className:"mb-4 bg-white p-5 rounded-3xl border border-slate-100 shadow-sm glass",children:e.jsxs("div",{className:"flex flex-col lg:flex-row items-center justify-between gap-6 w-full",style:{display:"flex",flexDirection:"row",alignItems:"center",justifyContent:"space-between",gap:"24px",width:"100%"},children:[e.jsxs("div",{className:"flex-1 flex items-center justify-between relative w-full py-4 px-4 overflow-x-auto min-w-0",style:{flex:"1 1 0%",display:"flex",alignItems:"center",justifyContent:"space-between",minWidth:"0"},children:[e.jsx("div",{className:"absolute -z-0",style:{left:"40px",right:"40px",top:"68px",transform:"translateY(-50%)",height:"3px",backgroundColor:"#e2e8f0"}}),e.jsx("div",{className:"absolute -z-0 transition-all duration-500",style:{left:"40px",top:"68px",transform:"translateY(-50%)",height:"3px",backgroundColor:"#cbd5e1",width:`calc(${ts()}% - 20px)`}}),e.jsxs("div",{className:"flex flex-col items-center relative z-10 w-20 shrink-0",children:[e.jsx("span",{className:`text-[9px] font-bold text-center leading-tight mb-2.5 h-7 flex items-end justify-center \${h?"text-slate-800":r===1?"text-slate-900 font-extrabold":"text-slate-400"}`,children:"Hotel Selecionado"}),e.jsx("div",{className:"rounded-full flex items-center justify-center border-2 transition-all duration-300",style:{width:"28px",height:"28px",backgroundColor:h?"#ffffff":r===1?"#dfba6b":"#f1f5f9",borderColor:h?"#a78235":r===1?"#dfba6b":"#e2e8f0"},children:h&&e.jsx("svg",{className:"w-3.5 h-3.5 text-[#cbd5e1]",fill:"none",stroke:"currentColor",strokeWidth:"4",viewBox:"0 0 24 24",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M5 13l4 4L19 7"})})}),e.jsx("span",{className:"mt-2.5 px-2 py-0.5 text-[8px] font-black rounded uppercase tracking-wider text-center border",style:{backgroundColor:"#ffffff",borderColor:h?"#a78235":r===1?"#dfba6b":"#cbd5e1",color:h?"#a78235":r===1?"#dfba6b":"#94a3b8",borderWidth:"1px"},children:h?"COMPLETO":r===1?"EM ANDAMENTO":"PREVISTO"})]}),e.jsxs("div",{className:"flex flex-col items-center relative z-10 w-20 shrink-0",children:[e.jsx("span",{className:`text-[9px] font-bold text-center leading-tight mb-2.5 h-7 flex items-end justify-center \${x?"text-slate-800":r===2?"text-slate-900 font-extrabold":"text-slate-400"}`,children:"Carro Selecionado"}),e.jsx("div",{className:"rounded-full flex items-center justify-center border-2 transition-all duration-300",style:{width:"28px",height:"28px",backgroundColor:x?"#ffffff":r===2?"#dfba6b":"#f1f5f9",borderColor:x?"#a78235":r===2?"#dfba6b":"#e2e8f0"},children:x&&e.jsx("svg",{className:"w-3.5 h-3.5 text-[#cbd5e1]",fill:"none",stroke:"currentColor",strokeWidth:"4",viewBox:"0 0 24 24",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M5 13l4 4L19 7"})})}),e.jsx("span",{className:"mt-2.5 px-2 py-0.5 text-[8px] font-black rounded uppercase tracking-wider text-center border",style:{backgroundColor:"#ffffff",borderColor:x?"#a78235":r===2?"#dfba6b":"#cbd5e1",color:x?"#a78235":r===2?"#dfba6b":"#94a3b8",borderWidth:"1px"},children:x?"COMPLETO":r===2?"EM ANDAMENTO":"PREVISTO"})]}),e.jsxs("div",{className:"flex flex-col items-center relative z-10 w-20 shrink-0",children:[e.jsx("span",{className:`text-[9px] font-bold text-center leading-tight mb-2.5 h-7 flex items-end justify-center \${d?"text-slate-800":r===3?"text-slate-900 font-extrabold":"text-slate-400"}`,children:"Voo Selecionado"}),e.jsx("div",{className:"rounded-full flex items-center justify-center border-2 transition-all duration-300",style:{width:"28px",height:"28px",backgroundColor:d?"#ffffff":r===3?"#dfba6b":"#f1f5f9",borderColor:d?"#a78235":r===3?"#dfba6b":"#e2e8f0"},children:d&&e.jsx("svg",{className:"w-3.5 h-3.5 text-[#cbd5e1]",fill:"none",stroke:"currentColor",strokeWidth:"4",viewBox:"0 0 24 24",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M5 13l4 4L19 7"})})}),e.jsx("span",{className:"mt-2.5 px-2 py-0.5 text-[8px] font-black rounded uppercase tracking-wider text-center border",style:{backgroundColor:"#ffffff",borderColor:d?"#a78235":r===3?"#dfba6b":"#cbd5e1",color:d?"#a78235":r===3?"#dfba6b":"#94a3b8",borderWidth:"1px"},children:d?"COMPLETO":r===3?"EM ANDAMENTO":"PREVISTO"})]}),e.jsxs("div",{className:"flex flex-col items-center relative z-10 w-20 shrink-0",children:[e.jsx("span",{className:`text-[9px] font-bold text-center leading-tight mb-2.5 h-7 flex items-end justify-center \${m?"text-slate-800":r===4?"text-slate-900 font-extrabold":"text-slate-400"}`,children:"Ônibus Selecionado"}),e.jsx("div",{className:"rounded-full flex items-center justify-center border-2 transition-all duration-300",style:{width:"28px",height:"28px",backgroundColor:m?"#ffffff":r===4?"#dfba6b":"#f1f5f9",borderColor:m?"#a78235":r===4?"#dfba6b":"#e2e8f0"},children:m&&e.jsx("svg",{className:"w-3.5 h-3.5 text-[#cbd5e1]",fill:"none",stroke:"currentColor",strokeWidth:"4",viewBox:"0 0 24 24",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M5 13l4 4L19 7"})})}),e.jsx("span",{className:"mt-2.5 px-2 py-0.5 text-[8px] font-black rounded uppercase tracking-wider text-center border",style:{backgroundColor:"#ffffff",borderColor:m?"#a78235":r===4?"#dfba6b":"#cbd5e1",color:m?"#a78235":r===4?"#dfba6b":"#94a3b8",borderWidth:"1px"},children:m?"COMPLETO":r===4?"EM ANDAMENTO":"PREVISTO"})]}),e.jsxs("div",{className:"flex flex-col items-center relative z-10 w-20 shrink-0",children:[e.jsx("span",{className:`text-[9px] font-bold text-center leading-tight mb-2.5 h-7 flex items-end justify-center \${p?"text-slate-800":r===5?"text-slate-900 font-extrabold":"text-slate-400"}`,children:"Seguro Selecionado"}),e.jsx("div",{className:"rounded-full flex items-center justify-center border-2 transition-all duration-300",style:{width:"28px",height:"28px",backgroundColor:p?"#ffffff":r===5?"#dfba6b":"#f1f5f9",borderColor:p?"#a78235":r===5?"#dfba6b":"#e2e8f0"},children:p&&e.jsx("svg",{className:"w-3.5 h-3.5 text-[#cbd5e1]",fill:"none",stroke:"currentColor",strokeWidth:"4",viewBox:"0 0 24 24",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M5 13l4 4L19 7"})})}),e.jsx("span",{className:"mt-2.5 px-2 py-0.5 text-[8px] font-black rounded uppercase tracking-wider text-center border",style:{backgroundColor:"#ffffff",borderColor:p?"#a78235":r===5?"#dfba6b":"#cbd5e1",color:p?"#a78235":r===5?"#dfba6b":"#94a3b8",borderWidth:"1px"},children:p?"COMPLETO":r===5?"EM ANDAMENTO":"PREVISTO"})]})]}),e.jsx("div",{className:"bg-white border shadow-sm rounded-2xl p-4 flex items-center justify-between gap-6 shrink-0 w-full lg:w-[350px]",style:{width:"350px",minWidth:"350px",flexShrink:0,borderColor:ts()===100?"#a78235":"#dfba6b",borderWidth:ts()===100?"2px":"1px"},children:e.jsxs("div",{className:"flex items-center justify-between w-full",style:{display:"flex",alignItems:"center",justifyContent:"space-between",width:"100%"},children:[e.jsxs("div",{children:[e.jsx("span",{className:"text-[8px] text-slate-400 font-bold block uppercase leading-none",children:"Total Geral"}),e.jsxs("span",{className:"text-lg font-black text-slate-800 font-display mt-1.5 block",children:["R$ ",be().toLocaleString("pt-BR",{minimumFractionDigits:2,maximumFractionDigits:2})]}),h&&e.jsx("span",{className:"text-[9px] text-slate-400 font-bold block mt-1 font-sans normal-case",children:"(inclui " + (Math.round((new Date(u) - new Date(S)) / 864e5) || 3) + " diárias de hotel)"})]}) ,e.jsx("button",{onClick:()=>re(!0),className:"px-4 py-2.5 text-slate-900 font-black text-xs rounded-xl shadow-md transition-all font-display",style:{background:"linear-gradient(135deg, #a78235 0%, #dfba6b 100%)"},children:"Reservar Pacote"})]})})]})}),e.jsxs("div",{className:"grid grid-cols-1 xl:grid-cols-12 gap-4 items-stretch flex-1 min-h-0 overflow-hidden",children:[';

content = content.replace(progressTarget1, '').replace(progressTarget2Clean, progressReplacementText);

// Write test_syntax.mjs
fs.writeFileSync('C:/Users/Hiko/.gemini/antigravity/scratch/test_syntax.mjs', content);

// Format and verify syntax using vm.Script
let testCode = content.replace(/import\s*(\*\s*as\s+\w+|\w+|,?\s*\{[^}]*\})\s*from\s*['"][^'"]+['"];?/g, '/* import */')
                      .replace(/import\s*['"][^'"]+['"];?/g, '/* import */')
                      .replace(/export\s*\{[^}]*\};?/g, '/* export */')
                      .replace(/export\ default\s+[^;]+;/g, '/* export default */');

let formatted = '';
let inString = false;
let stringChar = '';
for (let i = 0; i < testCode.length; i++) {
  const c = testCode[i];
  if ((c === '"' || c === "'") && testCode[i-1] !== '\\') {
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
