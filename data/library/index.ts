export const loadChampions = () => import('./champions').then(m => m.CHAMPIONS);
export const loadLegends = () => import('./legends').then(m => m.LEGENDS);
