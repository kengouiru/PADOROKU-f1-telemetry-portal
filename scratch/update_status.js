const fs = require('fs');
let text = fs.readFileSync('docs/PROJECT_STATUS.md', 'utf8');

text = text.replace(/- \[x\] プロジェクト初期化・Next.jsセットアップ/g, '- [x] プロジェクト初期化・Next.jsセットアップ\n- [x] Phase A: SEASON画面への「Previous GP」追加、およびカレンダー国旗UI実装');

text = text.replace(/4. 次に取り組むタスク[\s\S]*?5. 技術選定/g, '4. 次に取り組むタスク\n1. [Phase B] 予選・決勝直後のOpenF1からの速報リザルト取得ロジックの実装\n2. [Phase B] 全無線を聞き返せる「Post-Race Review」画面の作成\n3. [Phase C] AIオリジナル記事生成機能の構築\n\n5. 技術選定');

fs.writeFileSync('docs/PROJECT_STATUS.md', text, 'utf8');
