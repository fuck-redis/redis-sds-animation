import { useMemo } from 'react';
import { useStore } from '@/store/useStore';
import { DEFAULT_LANGUAGE, OPERATION_CODE_SNIPPETS, getSnippet } from '@/constants/codeSnippets';
import { SupportedLanguage } from '@/types/animation';
import { usePersistedSetting } from '@/hooks/usePersistedSetting';
import { tokenClass, tokenizeLine } from '@/utils/syntaxHighlight';

const LANGUAGES: SupportedLanguage[] = ['java', 'python', 'go', 'javascript'];

export function CodeDebuggerPanel() {
  const { uiState, animationState } = useStore();
  const operation = uiState.currentOperation;
  const step = animationState.steps[animationState.currentStep];
  const { value: language, setValue: setLanguage } = usePersistedSetting<SupportedLanguage>(
    'code_language',
    DEFAULT_LANGUAGE,
  );

  const snippet = useMemo(() => getSnippet(operation, language), [operation, language]);
  const codeLines = useMemo(() => snippet.split('\n'), [snippet]);

  const activeLines = useMemo(() => {
    const lines = step?.debug?.codeLines?.[language] ?? [];
    return new Set(lines);
  }, [step, language]);

  const variableLines = useMemo(
    () => step?.debug?.variableLines?.[language] ?? {},
    [step, language],
  );

  const variableBadgesByLine = useMemo(() => {
    const badges = new Map<number, string[]>();
    const variables = step?.debug?.variables ?? {};
    Object.entries(variables).forEach(([name, value]) => {
      const line = variableLines[name];
      if (!line) return;
      const text = `${name}=${String(value)}`;
      const list = badges.get(line) ?? [];
      list.push(text);
      badges.set(line, list);
    });
    return badges;
  }, [step, variableLines]);

  const operationTitle = operation ? OPERATION_CODE_SNIPPETS[operation].title : '请选择一个 SDS 操作';

  return (
    <section className="bg-white rounded-lg shadow-md border border-slate-200 p-4 h-full flex flex-col">
      <div className="flex items-center justify-between gap-3 mb-3">
        <h3 className="font-semibold text-slate-800 text-sm leading-tight">{operationTitle}</h3>
        <div className="flex gap-1 bg-slate-100 p-1 rounded-md">
          {LANGUAGES.map((lang) => (
            <button
              key={lang}
              type="button"
              onClick={() => setLanguage(lang)}
              className={`px-2 py-1 text-xs rounded transition-colors ${
                language === lang
                  ? 'bg-emerald-600 text-white'
                  : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              {lang === 'javascript' ? 'JavaScript' : lang[0].toUpperCase() + lang.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {step && (
        <div className="mb-2 text-xs text-slate-600 bg-emerald-50 border border-emerald-200 px-2 py-1 rounded">
          <strong>当前分镜：</strong>{step.description}
        </div>
      )}

      <div className="code-debugger flex-1 overflow-auto rounded border border-slate-200">
        {!operation ? (
          <div className="h-full flex items-center justify-center text-sm text-slate-500">
            选择左侧操作后展示对应代码
          </div>
        ) : (
          <div className="font-mono text-[12px] leading-5">
            {codeLines.map((line, index) => {
              const lineNo = index + 1;
              const highlighted = activeLines.has(lineNo);
              const tokens = tokenizeLine(line, language);
              const badges = variableBadgesByLine.get(lineNo) ?? [];

              return (
                <div
                  key={lineNo}
                  className={`code-row group ${highlighted ? 'code-row-active' : ''}`}
                >
                  <span className="line-no">{lineNo}</span>
                  <span className="line-content">
                    {tokens.map((token, tokenIndex) => (
                      <span key={tokenIndex} className={tokenClass(token.kind)}>
                        {token.text}
                      </span>
                    ))}
                  </span>
                  {badges.length > 0 && (
                    <span className="line-badges">
                      {badges.map((badge) => (
                        <span key={badge} className="line-badge">
                          {badge}
                        </span>
                      ))}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
