export type LayerState = 'surface' | 'middle' | 'core';

export type ArchiveSourceType =
  | 'fact'
  | 'inference'
  | 'speculation'
  | 'visitorContribution'
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

export interface MugRecord {
  id: string;
  slug: string;
  title: string;
  maker?: string;
  dateRange?: string;
  collectionId?: string;
  material?: string;
  dimensions?: string;
  markerPatternPath: string;
  qrPath?: string;
  modelPath?: string;
  imagePath?: string;
  audioPath?: string;
  projectionAudioPath?: string;
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
