import { useMemo } from 'react';
import { SupportedLanguage } from '@/types/animation';
import { tokenClass, tokenizeLine } from '@/utils/syntaxHighlight';

interface CodeBlockProps {
  code: string;
  language?: SupportedLanguage;
  showLineNumbers?: boolean;
  className?: string;
}

export function CodeBlock({
  code,
  language = 'java',
  showLineNumbers = true,
  className = '',
}: CodeBlockProps) {
  const lines = useMemo(() => code.split('\n'), [code]);

  const highlightedLines = useMemo(() => {
    return lines.map((line) => tokenizeLine(line, language));
  }, [lines, language]);

  return (
    <div
      className={`bg-slate-900 rounded-lg p-4 text-white font-mono text-sm overflow-x-auto ${className}`}
    >
      <pre className="whitespace-pre-wrap">
        {highlightedLines.map((tokens, lineIndex) => (
          <div key={lineIndex} className="flex">
            {showLineNumbers && (
              <span className="select-none text-slate-500 w-8 text-right pr-4 flex-shrink-0">
                {lineIndex + 1}
              </span>
            )}
            <span className="flex-1">
              {tokens.map((token, tokenIndex) => (
                <span key={tokenIndex} className={tokenClass(token.kind)}>
                  {token.text}
                </span>
              ))}
            </span>
          </div>
        ))}
      </pre>
    </div>
  );
}
