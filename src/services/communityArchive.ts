import type { AnnotationType, ArchiveSourceType, LayerState, VisitorAnnotation } from '../types/archive';

export const COMMUNITY_ARCHIVE_STORAGE_KEY = 'glitchingArchive.communityArchive.v1';
const LEGACY_ANNOTATION_STORAGE_KEY = 'glitchingArchive.annotations.v1';
const VOTE_STORAGE_KEY = 'glitchingArchive.communityVotes.v1';
const CHANNEL_NAME = 'glitchingArchive.communityArchive';

export const COMMUNITY_CONTRIBUTION_MAX_LENGTH = 280;

const annotationTypes: AnnotationType[] = ['question', 'counterReading', 'memory', 'dispute'];
const layerStates: LayerState[] = ['surface', 'middle', 'core'];

export interface CommunityContribution {
  id: string;
  mugId: string;
  layerState: LayerState;
  type: AnnotationType;
  text: string;
  sourceType: Extract<ArchiveSourceType, 'visitorContribution'>;
  createdAt: string;
  upvotes: number;
  featured: boolean;
  responseToId?: string;
}

export interface ContributionDraft {
  mugId: string;
  layerState: LayerState;
  type: AnnotationType;
  text: string;
  responseToId?: string;
}

function createContributionId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }

  return `contribution-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function getBroadcastChannel() {
  if (typeof window === 'undefined' || typeof BroadcastChannel === 'undefined') {
    return undefined;
  }

  return new BroadcastChannel(CHANNEL_NAME);
}

function notifyCommunityArchiveChanged() {
  if (typeof window === 'undefined') {
    return;
  }

  window.dispatchEvent(new CustomEvent('communityArchiveChanged'));
  const channel = getBroadcastChannel();
  channel?.postMessage({ type: 'communityArchiveChanged' });
  channel?.close();
}

function parseArrayStorage(key: string) {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const stored = window.localStorage.getItem(key);
    const parsed: unknown = stored ? JSON.parse(stored) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function isAnnotationType(value: unknown): value is AnnotationType {
  return annotationTypes.includes(value as AnnotationType);
}

function isLayerState(value: unknown): value is LayerState {
  return layerStates.includes(value as LayerState);
}

function normalizeContribution(value: unknown): CommunityContribution | undefined {
  if (!value || typeof value !== 'object') {
    return undefined;
  }

  const candidate = value as Partial<CommunityContribution> & Partial<VisitorAnnotation>;
  const layerState = candidate.layerState ?? candidate.layer;

  if (
    typeof candidate.id !== 'string' ||
    typeof candidate.mugId !== 'string' ||
    !isAnnotationType(candidate.type) ||
    !isLayerState(layerState) ||
    typeof candidate.text !== 'string' ||
    typeof candidate.createdAt !== 'string' ||
    candidate.sourceType !== 'visitorContribution'
  ) {
    return undefined;
  }

  return {
    id: candidate.id,
    mugId: candidate.mugId,
    layerState,
    type: candidate.type,
    text: candidate.text,
    sourceType: 'visitorContribution',
    createdAt: candidate.createdAt,
    upvotes: Number.isFinite(candidate.upvotes) ? Number(candidate.upvotes) : 0,
    featured: Boolean(candidate.featured),
    responseToId: typeof candidate.responseToId === 'string' ? candidate.responseToId : undefined,
  };
}

function readLegacyContributions() {
  return parseArrayStorage(LEGACY_ANNOTATION_STORAGE_KEY)
    .map(normalizeContribution)
    .filter((contribution): contribution is CommunityContribution => Boolean(contribution));
}

function dedupeContributions(contributions: CommunityContribution[]) {
  const seen = new Set<string>();

  return contributions.filter((contribution) => {
    if (seen.has(contribution.id)) {
      return false;
    }

    seen.add(contribution.id);
    return true;
  });
}

export function readCommunityContributions() {
  const current = parseArrayStorage(COMMUNITY_ARCHIVE_STORAGE_KEY)
    .map(normalizeContribution)
    .filter((contribution): contribution is CommunityContribution => Boolean(contribution));
  const legacy = readLegacyContributions();
  const merged = dedupeContributions([...current, ...legacy]);

  if (typeof window !== 'undefined' && legacy.length > 0 && current.length === 0) {
    window.localStorage.setItem(COMMUNITY_ARCHIVE_STORAGE_KEY, JSON.stringify(merged));
  }

  return merged;
}

function writeCommunityContributions(contributions: CommunityContribution[]) {
  window.localStorage.setItem(COMMUNITY_ARCHIVE_STORAGE_KEY, JSON.stringify(contributions));
  notifyCommunityArchiveChanged();
}

export function createCommunityContribution(draft: ContributionDraft) {
  const text = draft.text.trim();

  if (!text) {
    throw new Error('Contribution text is required.');
  }

  if (text.length > COMMUNITY_CONTRIBUTION_MAX_LENGTH) {
    throw new Error(`Contribution text must be ${COMMUNITY_CONTRIBUTION_MAX_LENGTH} characters or fewer.`);
  }

  const contribution: CommunityContribution = {
    id: createContributionId(),
    mugId: draft.mugId,
    layerState: draft.layerState,
    type: draft.type,
    text,
    sourceType: 'visitorContribution',
    createdAt: new Date().toISOString(),
    upvotes: 0,
    featured: false,
    responseToId: draft.responseToId,
  };

  const next = [contribution, ...readCommunityContributions()];
  writeCommunityContributions(next);
  return contribution;
}

function readVotedIds() {
  return new Set(
    parseArrayStorage(VOTE_STORAGE_KEY).filter((id): id is string => typeof id === 'string'),
  );
}

function writeVotedIds(votedIds: Set<string>) {
  window.localStorage.setItem(VOTE_STORAGE_KEY, JSON.stringify([...votedIds]));
}

export function hasLocalVote(contributionId: string) {
  return readVotedIds().has(contributionId);
}

export function readLocalVoteIds() {
  return readVotedIds();
}

export function upvoteContribution(contributionId: string) {
  const votedIds = readVotedIds();

  if (votedIds.has(contributionId)) {
    return readCommunityContributions();
  }

  const next = readCommunityContributions().map((contribution) =>
    contribution.id === contributionId
      ? { ...contribution, upvotes: contribution.upvotes + 1 }
      : contribution,
  );

  votedIds.add(contributionId);
  writeVotedIds(votedIds);
  writeCommunityContributions(next);
  return next;
}

export function toggleFeaturedContribution(contributionId: string) {
  const next = readCommunityContributions().map((contribution) =>
    contribution.id === contributionId
      ? { ...contribution, featured: !contribution.featured }
      : contribution,
  );

  writeCommunityContributions(next);
  return next;
}

export function clearCommunityContributions(mugId?: string) {
  const next = mugId
    ? readCommunityContributions().filter((contribution) => contribution.mugId !== mugId)
    : [];

  writeCommunityContributions(next);
  return next;
}

export function sortCommunityContributions(contributions: CommunityContribution[]) {
  return [...contributions].sort((a, b) => {
    if (a.featured !== b.featured) {
      return a.featured ? -1 : 1;
    }

    if (a.upvotes !== b.upvotes) {
      return b.upvotes - a.upvotes;
    }

    return Date.parse(b.createdAt) - Date.parse(a.createdAt);
  });
}

export function subscribeCommunityArchive(listener: () => void) {
  if (typeof window === 'undefined') {
    return () => undefined;
  }

  const channel = getBroadcastChannel();

  function handleStorage(event: StorageEvent) {
    if (event.key === COMMUNITY_ARCHIVE_STORAGE_KEY || event.key === LEGACY_ANNOTATION_STORAGE_KEY) {
      listener();
    }
  }

  function handleLocalChange() {
    listener();
  }

  window.addEventListener('storage', handleStorage);
  window.addEventListener('communityArchiveChanged', handleLocalChange);
  channel?.addEventListener('message', handleLocalChange);

  return () => {
    window.removeEventListener('storage', handleStorage);
    window.removeEventListener('communityArchiveChanged', handleLocalChange);
    channel?.removeEventListener('message', handleLocalChange);
    channel?.close();
  };
}
