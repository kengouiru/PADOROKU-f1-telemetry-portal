const fs = require('fs');
let content = fs.readFileSync('components/AIStrategist.tsx', 'utf8');

// 1. Remove API Key stuff
// Remove `setShowKeyModal` and API Key state imports if needed, but easier to just strip the UI buttons.
content = content.replace(
  /<button[^>]*onClick=\{\(\) => setShowKeyModal\(true\)\}[^>]*>[\s\S]*?<\/button>/g,
  ''
);

// 2. Fix Header Layout
// Right now it might be a flex row that is too crowded.
// Let's find the header wrapper: `<div className="flex items-center justify-between mb-2 pb-2 border-b border-white/10 gap-2">`
// Change to flex-col or allow wrap.
content = content.replace(
  /<div className="flex items-center justify-between mb-2 pb-2 border-b border-white\/10 gap-2">/g,
  '<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-2 pb-2 border-b border-white/10 gap-2">'
);

// We should also replace the ultra-crowded model selector + toggle wrapper
content = content.replace(
  /<div className="flex items-center gap-1.5 flex-shrink-0">/g,
  '<div className="flex items-center gap-2 flex-wrap sm:flex-nowrap w-full sm:w-auto mt-2 sm:mt-0 justify-end">'
);

// 3. Fix Input Layout
// The paperclip icon `📎` inside `<button>📎</button>`
content = content.replace(
  />📎</g,
  '><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 0 0 2.112 2.13" /></svg><'
);

// Fix the button that says "生データを含めて送信 PRO" to be an icon button or just compact.
content = content.replace(
  /📊<span className="hidden sm:inline">生データを含めて送信<\/span><span className="ml-1 text-\[10px\] font-black bg-gradient-to-r from-amber-400 to-yellow-300 text-slate-900 px-1 rounded-sm shadow-\[0_0_8px_rgba\(251,191,36,0\.5\)\] tracking-wide">PRO<\/span>/g,
  '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1"><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" /></svg><span className="hidden sm:inline">DATA</span><span className="ml-1 text-[9px] font-black bg-gradient-to-r from-amber-400 to-yellow-300 text-slate-900 px-1 rounded-sm shadow-[0_0_8px_rgba(251,191,36,0.5)] tracking-wide">PRO</span>'
);

// The input wrapper should be flex-1
// Let's replace the flex container containing the text area
content = content.replace(
  /<div className="flex gap-2 relative">/g,
  '<div className="flex gap-2 relative items-end">'
);

// The text area wrapper
content = content.replace(
  /<div className="relative flex-1 min-w-0">/g,
  '<div className="relative flex-1 min-w-0 flex flex-col justify-end">'
);

// The buttons block is `flex gap-1.5`
content = content.replace(
  /<div className="flex gap-1.5">/g,
  '<div className="flex gap-1.5 flex-col sm:flex-row items-end">'
);

// Fix height of textarea
content = content.replace(
  /className="w-full bg-slate-800\/50 border border-slate-700 rounded-xl px-4 py-3/g,
  'className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 min-h-[44px]'
);

// Fix the paperclip button styling
content = content.replace(
  /className="text-slate-400 hover:text-white transition-colors cursor-pointer text-xl flex-shrink-0"/g,
  'className="text-slate-400 hover:text-white transition-colors cursor-pointer flex-shrink-0 p-2 hover:bg-white/10 rounded-full h-10 w-10 flex items-center justify-center"'
);

fs.writeFileSync('components/AIStrategist.tsx', content, 'utf8');
console.log('UI cleanup applied.');
