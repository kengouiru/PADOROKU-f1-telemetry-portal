'use client';

/**
 * components/common/SmartWikiText.tsx
 * Wikipedia-style Inline Knowledge Text Component
 *
 * Scans text for F1 keywords (e.g. "アンダーカット", "フェルスタッペン", "DRS", "ウィリアムズ")
 * and renders them with a subtle, non-intrusive dotted underline.
 * Font color is NOT altered (text-inherit).
 * Clicking opens the dedicated page in a new tab/window.
 * Also supports inline citations [1], [2] when onCitationClick is provided.
 */

import React from 'react';
import { parseWikiText, type TextToken } from '@/lib/knowledgeLinkRegistry';

export interface SmartWikiTextProps {
  text: string;
  excludeUrl?: string; // e.g. don't link to the current page itself
  maxLinksPerTerm?: number; // default 1
  onCitationClick?: (refId: number) => void;
  className?: string;
}

export default function SmartWikiText({
  text,
  excludeUrl,
  maxLinksPerTerm = 1,
  onCitationClick,
  className = '',
}: SmartWikiTextProps) {
  if (!text) return null;

  // 1. First parse wiki keywords
  const tokens = parseWikiText(text, { excludeUrl, maxLinksPerTerm });

  return (
    <span className={className}>
      {tokens.map((token: TextToken, idx: number) => {
        if (token.type === 'link' && token.url) {
          return (
            <a
              key={idx}
              href={token.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline text-inherit border-b border-dotted border-current/40 hover:border-current/90 cursor-pointer transition-colors pb-[1px]"
              title={token.title}
            >
              {token.content}
            </a>
          );
        }

        // Check for citations in plain text parts like "[1]", "[2]"
        if (onCitationClick && /\[\d+\]/.test(token.content)) {
          const parts = token.content.split(/(\[\d+\])/g);
          return (
            <React.Fragment key={idx}>
              {parts.map((p, pIdx) => {
                const citeMatch = p.match(/\[(\d+)\]/);
                if (citeMatch) {
                  const refId = parseInt(citeMatch[1], 10);
                  return (
                    <button
                      key={pIdx}
                      type="button"
                      onClick={() => onCitationClick(refId)}
                      className="inline-flex items-center px-1 mx-0.5 text-[10px] font-mono font-bold text-sky-400 bg-sky-950/60 hover:bg-sky-800/80 border border-sky-500/40 rounded transition-all cursor-pointer hover:scale-110"
                      title={`参考文献 [${refId}] を確認`}
                    >
                      [{refId}]
                    </button>
                  );
                }
                return <span key={pIdx}>{p}</span>;
              })}
            </React.Fragment>
          );
        }

        return <span key={idx}>{token.content}</span>;
      })}
    </span>
  );
}
