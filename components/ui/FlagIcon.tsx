import React from 'react';

const EMOJI_TO_ISO: Record<string, string> = {
  '🇦🇺': 'au',
  '🇨🇳': 'cn',
  '🇯🇵': 'jp',
  '🇺🇸': 'us',
  '🇨🇦': 'ca',
  '🇲🇨': 'mc',
  '🇪🇸': 'es',
  '🇦🇹': 'at',
  '🇬🇧': 'gb',
  '🇧🇪': 'be',
  '🇭🇺': 'hu',
  '🇳🇱': 'nl',
  '🇮🇹': 'it',
  '🇦🇿': 'az',
  '🇲🇾': 'my',
  '🇸🇬': 'sg',
  '🇲🇽': 'mx',
  '🇧🇷': 'br',
  '🇶🇦': 'qa',
  '🇦🇪': 'ae',
  '🇧🇭': 'bh',
  '🇸🇦': 'sa',
  '🇫🇷': 'fr',
  '🇩🇪': 'de',
};

interface FlagIconProps {
  emojiFlag: string;
  className?: string;
}

export function FlagIcon({ emojiFlag, className = 'w-4 h-3' }: FlagIconProps) {
  const isoCode = EMOJI_TO_ISO[emojiFlag];

  if (!isoCode) {
    // 変換できない場合はフォールバックとして絵文字をそのまま返す
    return <span className={className}>{emojiFlag}</span>;
  }

  // flagcdn を使ってSVG国旗を描画
  return (
    <img
      src={`https://flagcdn.com/${isoCode}.svg`}
      alt={emojiFlag}
      className={`inline-block object-cover rounded-sm ${className}`}
      loading="lazy"
    />
  );
}
