export type LayerState = 'surface' | 'middle' | 'core';

export type ArchiveSourceType =
  | 'fact'
  | 'inference'
  | 'speculation'
  | 'visitorContribution'
  | 'redacted';

export type ArchiveResearchSourceType =
  | 'fact'
  | 'visible-evidence'
  | 'historical-context'
  | 'inference'
  | 'speculation'
  | 'visitor-contribution'
  | 'unresolved'
  | 'redacted';

export type AnnotationType =
  | 'question'
  | 'counterReading'
  | 'memory'
  | 'dispute';

export interface ArchiveSource {
  id: string;
  type: ArchiveSourceType;
  label: string;
  citation?: string;
  confidence?: 'confirmed' | 'partial' | 'unknown';
}

export interface SourceLabelDefinition {
  type: ArchiveSourceType;
  label: string;
  shortLabel: string;
  description: string;
  ethicsNote: string;
}

export interface NarrativeFragment {
  id: string;
  layer: LayerState;
  title: string;
  text: string;
  sourceType: ArchiveSourceType;
  researchType?: ArchiveResearchSourceType;
  sourceIds: string[];
  citation?: string;
  isRedacted?: boolean;
}

export type ArchiveFragment = NarrativeFragment;

export interface ArchiveLayer {
  state: LayerState;
  title: string;
  description: string;
  fragments: NarrativeFragment[];
}

export interface EthicsNote {
  id: string;
  title: string;
  text: string;
}

export interface AssetRequirement {
  id: string;
  mugId: string;
  type: 'image' | 'marker' | 'qr' | 'model' | 'audio';
  path: string;
  status: 'placeholder' | 'needed' | 'verified';
  purpose: string;
}

export interface SourceMetadata {
  museum?: string;
  display?: string;
  museumNumber?: string;
  maker?: string;
  placeDate?: string;
  materialsTechniques?: string;
  verificationStatus: 'verified' | 'partial' | 'unknown';
  note: string;
}

export interface LayerDirection {
  surface: string;
  middle: string;
  core: string;
}

export interface SpeculativeGenerationGuide {
  keywords: string[];
  safeSpeculationBoundaries: string[];
  forbiddenClaims: string[];
  suggestedPrompts: string[];
}

export interface MugRecord {
  id: string;
  slug: string;
  title: string;
  shortHook?: string;
  objectType?: string;
  maker?: string;
  dateRange?: string;
  collectionId?: string;
  material?: string;
  dimensions?: string;
  sourceMetadata?: SourceMetadata;
  visibleInscription?: string[];
  markerId?: string;
  markerPatternPath: string;
  qrPath?: string;
  modelPath?: string;
  imagePath?: string;
  audioPath?: string;
  projectionAudioPath?: string;
  soundDirection?: LayerDirection;
  visualDirection?: LayerDirection;
  visitorPrompt?: string;
  ethicalNotes?: string[];
  unresolvedQuestions?: string[];
  aiSpeculation?: SpeculativeGenerationGuide;
  facts: NarrativeFragment[];
  middleReadings: NarrativeFragment[];
  coreFragments: NarrativeFragment[];
  sources: ArchiveSource[];
  ethicsNoteIds?: string[];
  assetRequirements?: AssetRequirement[];
}

export interface VisitorAnnotation {
  id: string;
  mugId: string;
  type: AnnotationType;
  layer: LayerState;
  text: string;
  createdAt: string;
  sourceType: 'visitorContribution';
  displayName?: string;
}
