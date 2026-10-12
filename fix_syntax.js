const fs = require('fs');
let content = fs.readFileSync('components/AIStrategist.tsx', 'utf8');

// Replace string literal \n with actual newline
content = content.replace(/\\n/g, '\n');

// Fix the ternary structure
// It currently is:
//          {isStreaming ? (
//            <button ... >停止</button>
//          ) : (
//            </div>\n          <div className="flex justify-end gap-2 items-center">
//              <button ...>DATA</button>
//              <button ...>送信</button>
//            </div>
//          )}
//        </div>

// This is wrong because the `</div>` and `<div className="flex justify-end...">` splits the ternary incorrectly.
// We need it to be:
//          </div>
//          <div className="flex justify-end gap-2 items-center w-full">
//          {isStreaming ? (
//            <button ... >停止</button>
//          ) : (
//            <>
//              <button ...>DATA</button>
//              <button ...>送信</button>
//            </>
//          )}
//          </div>
//        </div>

const beforeFix = `          {isStreaming ? (
            <button
              type="button"
              onClick={handleStop}
              className="flex-shrink-0 px-3 py-2 h-10 text-xs bg-red-600/90 hover:bg-red-500 text-white rounded-lg transition-colors font-medium"
            >
              停止
            </button>
          ) : (
            </div>
          <div className="flex justify-end gap-2 items-center">
              <button`;

const afterFix = `          </div>
          <div className="flex justify-end gap-2 items-center w-full">
          {isStreaming ? (
            <button
              type="button"
              onClick={handleStop}
              className="flex-shrink-0 px-3 py-2 h-10 text-xs bg-red-600/90 hover:bg-red-500 text-white rounded-lg transition-colors font-medium"
            >
              停止
            </button>
          ) : (
            <>
              <button`;

content = content.replace(beforeFix, afterFix);

// we also need to close the <> fragment inside the false branch of the ternary
const beforeFix2 = `                送信
              </button>
            </div>
          )}
        </div>
        <p className="text-xs text-slate-700 mt-1">Enter: 送信 ／ Shift+Enter: 改行</p>`;

const afterFix2 = `                送信
              </button>
            </>
          )}
          </div>
        </div>
        <p className="text-xs text-slate-700 mt-1">Enter: 送信 ／ Shift+Enter: 改行</p>`;

content = content.replace(beforeFix2, afterFix2);


// Let's also fix the JSX at the top of this block where I wrote:
// <div className="flex flex-col gap-2.5">\n          <div className="flex items-center gap-2">
// It has the string literal "\n" that was already replaced, but let's make sure it's valid JSX.
// There is no JSX error here assuming it's inside curly braces or it's standard tags.

fs.writeFileSync('components/AIStrategist.tsx', content, 'utf8');
console.log('Fixed syntax error in AIStrategist.tsx');
