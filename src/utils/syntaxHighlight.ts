import { SupportedLanguage } from '@/types/animation';

interface Token {
  text: string;
  kind: 'plain' | 'keyword' | 'string' | 'comment' | 'number' | 'function';
}

const KEYWORDS: Record<SupportedLanguage, Set<string>> = {
  java: new Set([
    'public', 'private', 'return', 'new', 'int', 'char', 'for', 'if', 'else',
    'while', 'true', 'false', 'class', 'void', 'String', 'Arrays',
  ]),
  python: new Set([
    'def', 'return', 'for', 'in', 'if', 'else', 'while', 'True', 'False',
    'None', 'class', 'import', 'from',
  ]),
  go: new Set([
    'func', 'return', 'for', 'if', 'else', 'range', 'var', 'const', 'type',
    'struct', 'make', 'copy',
  ]),
  javascript: new Set([
    'function', 'return', 'const', 'let', 'var', 'if', 'else', 'for', 'while',
    'true', 'false', 'null', 'undefined',
  ]),
};

function isCommentToken(text: string, language: SupportedLanguage): boolean {
  if (language === 'python') return /^\s*#/.test(text);
  return /^\s*\/\//.test(text);
}

function tokenizeCodeSegment(segment: string, language: SupportedLanguage): Token[] {
  const tokenPattern = /("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\b\d+(?:\.\d+)?\b|\b[A-Za-z_][A-Za-z0-9_]*\b)/g;
  const tokens: Token[] = [];

  let lastIndex = 0;
  let match: RegExpExecArray | null = null;

  while ((match = tokenPattern.exec(segment)) !== null) {
    if (match.index > lastIndex) {
      tokens.push({ text: segment.slice(lastIndex, match.index), kind: 'plain' });
    }

    const lexeme = match[0];
    let kind: Token['kind'] = 'plain';

    if (/^["']/.test(lexeme)) {
      kind = 'string';
    } else if (/^\d/.test(lexeme)) {
      kind = 'number';
    } else if (KEYWORDS[language].has(lexeme)) {
      kind = 'keyword';
    }

    tokens.push({ text: lexeme, kind });
    lastIndex = tokenPattern.lastIndex;
  }

  if (lastIndex < segment.length) {
    tokens.push({ text: segment.slice(lastIndex), kind: 'plain' });
  }

  return tokens;
}

export function tokenizeLine(line: string, language: SupportedLanguage): Token[] {
  if (!line) return [{ text: ' ', kind: 'plain' }];

  if (isCommentToken(line, language)) {
    return [{ text: line, kind: 'comment' }];
  }

  const commentStart = language === 'python' ? line.indexOf('#') : line.indexOf('//');
  if (commentStart >= 0) {
    const codePart = line.slice(0, commentStart);
    const commentPart = line.slice(commentStart);
    return [
      ...tokenizeCodeSegment(codePart, language),
      { text: commentPart, kind: 'comment' },
    ];
  }

  return tokenizeCodeSegment(line, language);
}

export function tokenClass(kind: Token['kind']): string {
  switch (kind) {
    case 'keyword':
      return 'syntax-keyword';
    case 'string':
      return 'syntax-string';
    case 'comment':
      return 'syntax-comment';
    case 'number':
      return 'syntax-number';
    case 'function':
      return 'syntax-function';
    default:
      return 'syntax-plain';
  }
}
