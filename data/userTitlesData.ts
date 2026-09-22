/**
 * data/userTitlesData.ts
 * 🎖️ User Strategist Titles & Paddock Aura Database
 *
 * Implements:
 * - Strategist Titles unlocked via racing achievements, quiz mastery & career feats
 * - Subtle, realistic probability modifiers (+1% to +5% chance on probabilistic trait activations)
 * - Rarity Tiers: COMMON, RARE, EPIC, LEGENDARY
 * - No overpowered cheat mechanics — purely mirrors real-life strategist aura (e.g. Ross Brawn, Hannah Schmitz)
 */

export type TitleRarity = 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY';

export interface UserTitle {
  id: string;
  name: string;
  badgeLabel: string;
  rarity: TitleRarity;
  icon: string;
  description: string;
  unlockConditionText: string;
  achievementKey?: string;
  // Subtle bonus applied to probabilistic trait rolls (+0.01 to +0.05)
  tacticalPerk: {
    probabilisticBonus: number; // e.g. 0.03 (+3%)
    pitMistakeResistanceBonus?: number; // e.g. 0.10 (-10% error chance)
    description: string;
  };
}

export const USER_TITLES_MASTER: Record<string, UserTitle> = {
  rookie_tactician: {
    id: 'rookie_tactician',
    name: '新人ストラテジスト',
    badgeLabel: 'ROOKIE',
    rarity: 'COMMON',
    icon: '🌱',
    description: 'ピットウォールに足を踏み入れたばかりの新人戦略担当者。',
    unlockConditionText: '初期解放（全員所持）',
    tacticalPerk: {
      probabilisticBonus: 0.0,
      description: '補正なし（基礎実力）',
    },
  },
  weather_oracle: {
    id: 'weather_oracle',
    name: '雨雲を読む者 (Weather Oracle)',
    badgeLabel: '気象予報士',
    rarity: 'RARE',
    icon: '🌦️',
    description: 'レーダーと風向きから雨雲の接近をミリ秒単位で先読みする気象の目。',
    unlockConditionText: '雨天レース（DrizzleまたはMonsoon）を完走する',
    achievementKey: 'ACH_FINISH_WET_RACE',
    tacticalPerk: {
      probabilisticBonus: 0.02, // +2%
      description: '雨天時・天候急変時の確率発動スキルが +2% 誘発しやすくなる',
    },
  },
  undercut_specialist: {
    id: 'undercut_specialist',
    name: 'アンダーカットの鬼 (Undercut Specialist)',
    badgeLabel: 'ピット巧者',
    rarity: 'RARE',
    icon: '🛞',
    description: 'ライバルの1周前にピットに飛び込ませ、ニュータイヤの魔力で前を奪う電撃戦略家。',
    unlockConditionText: 'シミュレータでピットストップを経て順位を1ポジション以上上げる',
    achievementKey: 'ACH_UNDERCUT_OVERTAKE',
    tacticalPerk: {
      probabilisticBonus: 0.03, // +3%
      pitMistakeResistanceBonus: 0.08,
      description: 'ピットストップ関連（電光石火クルー、停止精度）の発動率 +3%',
    },
  },
  legendary_pitwall: {
    id: 'legendary_pitwall',
    name: '伝説のピットウォール (Legendary Pitwall)',
    badgeLabel: '名ピットウォール',
    rarity: 'EPIC',
    icon: '🏆',
    description: 'ハンナ・シュミッツのように、紧迫のレース展開でも冷徹に最適解を導き出す。',
    unlockConditionText: 'シミュレータで3連勝を達成する、またはF1検定クイズで90点以上を獲得する',
    achievementKey: 'ACH_QUIZ_MASTER_OR_3_STREAK',
    tacticalPerk: {
      probabilisticBonus: 0.04, // +4%
      pitMistakeResistanceBonus: 0.15,
      description: '全てのポジティブ確率スキルの発動率 +4%、ピット作業ミス率 -15%',
    },
  },
  the_mastermind: {
    id: 'the_mastermind',
    name: '神託の軍師 (The Mastermind)',
    badgeLabel: '神託の軍師',
    rarity: 'LEGENDARY',
    icon: '👑',
    description: 'ロス・ブラウンの再来。ピットウォールに腰掛けるだけでチーム全体の勝負運が底上げされる。',
    unlockConditionText: '伝説の名車を1台以上アンロックし、F1検定マスター級を全問正解する',
    achievementKey: 'ACH_LEGENDARY_MASTERMIND',
    tacticalPerk: {
      probabilisticBonus: 0.05, // +5%
      pitMistakeResistanceBonus: 0.25,
      description: '全てのポジティブ確率スキルの発動率 +5%、赤特（悪癖）発生率 -25%',
    },
  },
};

/**
 * Get user title definition
 */
export function getUserTitle(titleId?: string): UserTitle {
  if (!titleId || !USER_TITLES_MASTER[titleId]) {
    return USER_TITLES_MASTER.rookie_tactician;
  }
  return USER_TITLES_MASTER[titleId];
}
