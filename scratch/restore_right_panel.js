const fs = require('fs');
let text = fs.readFileSync('app/page.tsx', 'utf8');

const target = '        <main ref={desktopScrollRef} className="flex-1 min-w-0 p-5 overflow-y-auto">\r\n          {mainHubContent}\r\n        </main>\r\n      </div>';

const replacement = `        <main ref={desktopScrollRef} className="flex-1 min-w-0 p-5 overflow-y-auto">\r
          {mainHubContent}\r
        </main>\r
\r
        {/* Right Panel: AI & Notebook (Desktop only) */}\r
        <aside className="hidden lg:flex w-80 2xl:w-96 flex-shrink-0 border-l border-white/10 bg-slate-900/50 flex-col">\r
          <div className="flex items-center justify-between px-4 pt-4 pb-2 border-b border-white/10 bg-slate-950/60 flex-shrink-0">\r
            <div className="flex bg-slate-800/80 rounded-xl p-1 border border-white/10">\r
              {([['ai', '🤖 AI分析'], ['notebook', '📓 レースノート']] as [RightPanelTab, string][]).map(([tab, label]) => (\r
                <button\r
                  key={tab}\r
                  type="button"\r
                  onClick={() => setRightPanelTab(tab)}\r
                  className={\`px-3 py-1.5 rounded-lg text-xs font-racing font-bold transition-all cursor-pointer \${\r
                    rightPanelTab === tab\r
                      ? 'bg-red-600 text-white shadow-md'\r
                      : 'text-slate-400 hover:text-white hover:bg-white/5'\r
                  }\`}\r
                >\r
                  {label}\r
                </button>\r
              ))}\r
            </div>\r
          </div>\r
          <div className="flex-1 min-h-0 flex flex-col overflow-hidden p-3 bg-slate-900/50">\r
            <ErrorBoundary sectionName="Right Panel">{rightPanelTab === 'ai' ? aiContent : notebookContent}</ErrorBoundary>\r
          </div>\r
        </aside>\r
      </div>`;

if (text.includes(target)) {
    fs.writeFileSync('app/page.tsx', text.replace(target, replacement), 'utf8');
    console.log('Restored Right Panel');
} else {
    // try fallback
    const target2 = target.replace(/\r\n/g, '\n');
    if (text.includes(target2)) {
        fs.writeFileSync('app/page.tsx', text.replace(target2, replacement), 'utf8');
        console.log('Restored Right Panel');
    } else {
        console.log('Target not found');
    }
}
