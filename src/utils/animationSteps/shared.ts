import { AnimationStep, SupportedLanguage } from '@/types/animation';

const LANGUAGES: SupportedLanguage[] = ['java', 'python', 'go', 'javascript'];
let stepIdCounter = 0;

export function createStepId(): string {
  return `step-${Date.now()}-${stepIdCounter++}`;
}

export function toCodeLines(lines: number[]) {
  return Object.fromEntries(LANGUAGES.map((lang) => [lang, lines])) as Partial<
    Record<SupportedLanguage, number[]>
  >;
}

export function toVariableLines(variableLines: Record<string, number>) {
  return Object.fromEntries(
    LANGUAGES.map((lang) => [lang, variableLines]),
  ) as Partial<Record<SupportedLanguage, Record<string, number>>>;
}

export function step(
  partial: Omit<AnimationStep, 'id'> & {
    lines?: number[];
    vars?: Record<string, string | number | boolean | null>;
    varLines?: Record<string, number>;
  },
): AnimationStep {
  const { lines, vars, varLines, ...rest } = partial;
  return {
    id: createStepId(),
    ...rest,
    debug: lines || vars
      ? {
          codeLines: lines ? toCodeLines(lines) : undefined,
          variables: vars,
          variableLines: varLines ? toVariableLines(varLines) : undefined,
        }
      : undefined,
  };
}
