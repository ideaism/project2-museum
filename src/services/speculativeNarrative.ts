import type { AnnotationType, LayerState, MugRecord } from '../types/archive';

export const SPECULATIVE_AI_DISCLAIMER = 'This is a speculative prompt, not verified history.';
export const SPECULATIVE_AI_LABEL = 'speculative AI fragment';

const STORAGE_KEY = 'glitchingArchive.speculativeFragments.v1';
const MAX_STORED_FRAGMENTS = 24;

export type SpeculativeMood = AnnotationType;

export interface SpeculativeNarrativeRequest {
  mug: MugRecord;
  visitorInput: string;
  layer: LayerState;
  mood?: SpeculativeMood;
}

export interface SpeculativeNarrativeFragment {
  id: string;
  mugId: string;
  mugTitle: string;
  layer: LayerState;
  mood: SpeculativeMood;
  label: typeof SPECULATIVE_AI_LABEL;
  title: string;
  text: string;
  disclaimer: typeof SPECULATIVE_AI_DISCLAIMER;
  sourceType: 'speculation';
  createdAt: string;
  evidence: string[];
  unresolvedQuestions: string[];
  boundaries: string[];
}

const moodTitles: Record<SpeculativeMood, string> = {
  question: 'Speculative question',
  counterReading: 'Speculative counter-reading',
  memory: 'Speculative memory prompt',
  dispute: 'Speculative dispute prompt',
};

const moodFrames: Record<SpeculativeMood, string> = {
  question: 'keeps the visitor prompt open as a question rather than an answer',
  counterReading: 'tests a counter-reading without replacing the record',
  memory: 'treats memory as a prompt for care, not as testimony',
  dispute: 'holds disagreement without declaring a winner',
};

const layerFrames: Record<LayerState, string> = {
  surface: 'at the surface of visible evidence',
  middle: 'in the middle layer of labelled interpretation',
  core: 'near the core layer of redaction and unresolved memory',
};

const forbiddenOutputPatterns = [
  /\b(eyewitness|witnessed|testified|testimony says|remembered that)\b/i,
  /\b(owner|donor|miner|marcher|candidate|organiser|family)\s+(said|recalled|remembered)\b/i,
  /["“”]/,
];

function createFragmentId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }

  return `speculative-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function normaliseInput(input: string) {
  return input
    .replace(/["“”'‘’]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 90);
}

function hasLikelyPersonalName(input: string, mug: MugRecord) {
  const knownCapitalisedWords = new Set(
    [mug.title, ...(mug.visibleInscription ?? []), ...(mug.aiSpeculation?.keywords ?? [])]
      .join(' ')
      .split(/\s+/)
      .map((word) => word.replace(/[^A-Za-z]/g, ''))
      .filter(Boolean),
  );

  return input
    .split(/\s+/)
    .map((word) => word.replace(/[^A-Za-z-]/g, ''))
    .some((word) => /^[A-Z][a-z]{2,}$/.test(word) && !knownCapitalisedWords.has(word));
}

function hasPersonalOrTestimonyClaim(input: string) {
  return /\b(i was there|i remember|my family|my father|my mother|my grandfather|my grandmother|told me|said|recalled|remembered|witnessed|testified)\b/i.test(input);
}

function getVisitorSignal(input: string, mug: MugRecord) {
  const safeInput = normaliseInput(input);

  if (!safeInput) {
    return mug.aiSpeculation?.keywords[0] ?? 'unresolved evidence';
  }

  if (hasLikelyPersonalName(safeInput, mug) || hasPersonalOrTestimonyClaim(safeInput)) {
    return 'a visitor-supplied question that may contain personal detail';
  }

  return safeInput.toLowerCase();
}

function getEvidence(mug: MugRecord) {
  const visibleEvidence = mug.visibleInscription?.slice(0, 2) ?? [];
  const surfaceFacts = mug.facts
    .filter((fragment) => fragment.researchType === 'visible-evidence')
    .map((fragment) => fragment.text);

  return [...visibleEvidence, ...surfaceFacts].slice(0, 3);
}

function getBoundaries(mug: MugRecord) {
  return [
    ...(mug.aiSpeculation?.safeSpeculationBoundaries ?? []),
    ...(mug.aiSpeculation?.forbiddenClaims ?? []),
    ...(mug.ethicalNotes ?? []),
    'Do not invent names, quotes, eyewitness claims, provenance, or personal memories.',
    'Do not make confident historical claims without a visible source.',
    'Do not produce party propaganda or romanticise suffering.',
  ];
}

function safeText(text: string) {
  if (forbiddenOutputPatterns.some((pattern) => pattern.test(text))) {
    return [
      'The fragment was held back because it risked sounding like evidence or testimony.',
      'Use the visible object record, unresolved questions, and visitor prompt as separate materials.',
    ].join(' ');
  }

  return text;
}

function composeTexts(request: SpeculativeNarrativeRequest) {
  const { mug, layer } = request;
  const mood = request.mood ?? 'question';
  const visitorSignal = getVisitorSignal(request.visitorInput, mug);
  const keywords = mug.aiSpeculation?.keywords ?? [];
  const evidence = getEvidence(mug);
  const unresolved = mug.unresolvedQuestions ?? [];
  const evidencePhrase = evidence[0] ? `the visible evidence (${evidence[0]})` : 'the visible object evidence';
  const keywordPhrase = keywords.length > 0 ? keywords.slice(0, 3).join(', ') : 'political memory';
  const unresolvedPrompt = unresolved[0] ?? 'What remains unverified in this object record?';

  return [
    {
      title: moodTitles[mood],
      text: safeText(
        `Using ${evidencePhrase}, this fragment ${moodFrames[mood]} ${layerFrames[layer]}. The visitor signal is treated as ${visitorSignal} only as a prompt, never as proof.`,
      ),
    },
    {
      title: 'Glitch reading',
      text: safeText(
        `The mug might hold tension between ${keywordPhrase} and ordinary handling. This reading stays conditional: it does not name an owner, invent a quote, or settle political meaning.`,
      ),
    },
    {
      title: 'Unresolved mirror',
      text: safeText(
        `A safe next prompt could ask: ${unresolvedPrompt} The answer is withheld until evidence, consent, or a local visitor contribution makes it appropriate to show.`,
      ),
    },
  ];
}

export function generateSpeculativeNarrative(
  request: SpeculativeNarrativeRequest,
): SpeculativeNarrativeFragment[] {
  const mood = request.mood ?? 'question';
  const evidence = getEvidence(request.mug);
  const boundaries = getBoundaries(request.mug);
  const unresolvedQuestions = request.mug.unresolvedQuestions ?? [];
  const createdAt = new Date().toISOString();

  return composeTexts(request).slice(0, 3).map((fragment) => ({
    id: createFragmentId(),
    mugId: request.mug.id,
    mugTitle: request.mug.title,
    layer: request.layer,
    mood,
    label: SPECULATIVE_AI_LABEL,
    title: fragment.title,
    text: fragment.text,
    disclaimer: SPECULATIVE_AI_DISCLAIMER,
    sourceType: 'speculation',
    createdAt,
    evidence,
    unresolvedQuestions,
    boundaries,
  }));
}

function isSpeculativeNarrativeFragment(value: unknown): value is SpeculativeNarrativeFragment {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as Partial<SpeculativeNarrativeFragment>;

  return (
    typeof candidate.id === 'string' &&
    typeof candidate.mugId === 'string' &&
    typeof candidate.mugTitle === 'string' &&
    typeof candidate.layer === 'string' &&
    ['surface', 'middle', 'core'].includes(candidate.layer) &&
    typeof candidate.mood === 'string' &&
    ['question', 'counterReading', 'memory', 'dispute'].includes(candidate.mood) &&
    candidate.label === SPECULATIVE_AI_LABEL &&
    typeof candidate.title === 'string' &&
    typeof candidate.text === 'string' &&
    candidate.disclaimer === SPECULATIVE_AI_DISCLAIMER &&
    candidate.sourceType === 'speculation' &&
    typeof candidate.createdAt === 'string' &&
    Array.isArray(candidate.evidence) &&
    Array.isArray(candidate.unresolvedQuestions) &&
    Array.isArray(candidate.boundaries)
  );
}

export function readStoredSpeculativeFragments() {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    const parsed: unknown = stored ? JSON.parse(stored) : [];

    return Array.isArray(parsed) ? parsed.filter(isSpeculativeNarrativeFragment) : [];
  } catch {
    return [];
  }
}

export function storeSpeculativeFragments(fragments: SpeculativeNarrativeFragment[]) {
  if (typeof window === 'undefined') {
    return fragments;
  }

  const next = [...fragments, ...readStoredSpeculativeFragments()].slice(0, MAX_STORED_FRAGMENTS);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return next;
}

export function clearStoredSpeculativeFragments() {
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem(STORAGE_KEY);
  }
}
