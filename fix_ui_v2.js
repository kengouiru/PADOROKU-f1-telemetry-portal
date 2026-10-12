const fs = require('fs');
let content = fs.readFileSync('components/AIStrategist.tsx', 'utf8');

// 1. Remove Key Settings Button block
content = content.replace(
  /<button\s+type="button"\s+onClick=\{\(\) => \{\s+setTempApiKey\(apiKey\);\s+setShowKeyModal\(true\);\s+\}\}[\s\S]*?<span>\{apiKey \? '設定済' : 'キー設定'\}<\/span>\s+<\/button>/g,
  ''
);

// 2. Change the Layout of the bottom bar
// We'll replace the `<div className="flex gap-2 items-end">` block with a flex-col layout
content = content.replace(
  /<div className="flex gap-2 items-end">/g,
  '<div className="flex flex-col gap-2.5">\\n          <div className="flex items-center gap-2">'
);

content = content.replace(
  /className="flex-1 bg-slate-800\/70 border border-white\/10 text-slate-200 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-slate-400\/50 placeholder:text-slate-600 resize-none disabled:opacity-50"/g,
  'className="flex-1 bg-slate-800/70 border border-white/10 text-slate-200 text-xs rounded-lg px-3 py-2.5 focus:outline-none focus:border-slate-400/50 placeholder:text-slate-600 resize-none disabled:opacity-50 h-10 leading-relaxed"'
);

content = content.replace(
  /placeholder=\{noDrivers \? 'ドライバーを選択してください\.\.\.' : 'テレメトリについて質問\.\.\. \(Enter 送信 \/ Shift\+Enter 改行\)'\}/g,
  'placeholder={noDrivers ? "ドライバーを選択してください..." : "質問を入力..."}'
);

content = content.replace(
  /<div className="flex gap-1\.5 flex-col sm:flex-row items-end">/g,
  '</div>\\n          <div className="flex justify-end gap-2 items-center">'
);

// 3. Fix the paperclip emoji -> SVG
content = content.replace(
  /className="flex-shrink-0 px-2\.5 py-2 h-10 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer flex items-center justify-center"\s+title="ファイルを添付"\s+>\s+📎\s+<\/button>/g,
  'className="flex-shrink-0 p-2 h-10 w-10 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors cursor-pointer flex items-center justify-center"\\n            title="ファイルを添付"\\n          >\\n            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 0 0 2.112 2.13" /></svg>\\n          </button>'
);

// 4. Fix DATA PRO button wording and style to make it compact
content = content.replace(
  /📊<span className="hidden sm:inline">生データを含めて送信<\/span>/g,
  '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5"><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" /></svg><span className="hidden sm:inline ml-0.5">生データ</span>'
);

fs.writeFileSync('components/AIStrategist.tsx', content, 'utf8');
console.log('UI cleanup applied perfectly.');
