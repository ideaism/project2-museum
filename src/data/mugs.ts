import type {
  ArchiveLayer,
  AssetRequirement,
  LayerState,
  MugRecord,
  NarrativeFragment,
} from '../types/archive';

const sharedEthicsNoteIds = [
  'source-transparency',
  'right-to-opacity',
  'no-hallucinated-history',
] satisfies string[];

function assetRequirementsFor(mugId: string, slug: string): AssetRequirement[] {
  return [
    {
      id: `${slug}-image`,
      mugId,
      type: 'image',
      path: `/assets/archive/images/${slug}.jpg`,
      status: 'needed',
      purpose: 'Object photograph for the no-AR detail page and object cards.',
    },
    {
      id: `${slug}-marker`,
      mugId,
      type: 'marker',
      path: `/assets/archive/markers/${slug}.patt`,
      status: slug === 'sample-mug' ? 'verified' : 'needed',
      purpose: 'AR.js marker pattern for the printed marker card used as the archive access target.',
    },
    {
      id: `${slug}-qr`,
      mugId,
      type: 'qr',
      path: `/assets/archive/qr/${slug}.svg`,
      status: 'needed',
      purpose: 'QR code linking visitors to the mobile walkthrough route.',
    },
    {
      id: `${slug}-model`,
      mugId,
      type: 'model',
      path: `/assets/archive/models/${slug}.glb`,
      status: slug === 'sample-mug' ? 'verified' : 'needed',
      purpose: 'Lightweight GLB/GLTF mug model for the no-AR object detail viewer.',
    },
    {
      id: `${slug}-audio`,
      mugId,
      type: 'audio',
      path: `/assets/archive/audio/${slug}-projection.mp3`,
      status: 'needed',
      purpose: 'Optional projection or sound-wall loop for this object.',
    },
  ];
}

export const archiveMugs: MugRecord[] = [
  {
    id: 'sample-mug',
    slug: 'sample-mug',
    title: 'Stored collection mug, sample record',
    maker: 'Placeholder maker pending supplied collection record',
    dateRange: 'Date range pending supplied collection record',
    collectionId: 'Placeholder collection ID',
    material: 'Ceramic, pending verification',
    dimensions: 'Dimensions pending supplied collection record',
    markerPatternPath: '/assets/archive/markers/sample-mug.patt',
    qrPath: '/assets/archive/qr/sample-mug.svg',
    imagePath: '/assets/archive/images/sample-mug.jpg',
    modelPath: '/assets/archive/models/sample-mug.glb',
    audioPath: '/assets/archive/audio/sample-mug-projection.mp3',
    projectionAudioPath: '/assets/archive/audio/sample-mug-projection.mp3',
    facts: [
      {
        id: 'sample-surface-collection-placeholder',
        layer: 'surface',
        title: 'Collection record not yet supplied',
        text:
          'This object is represented as a political ceramic mug from a stored collection. Exact maker, date, accession number, and measurements are placeholders until the source record is provided.',
        sourceType: 'fact',
        sourceIds: ['sample-source-placeholder-record'],
      },
      {
        id: 'sample-surface-installation-role',
        layer: 'surface',
        title: 'Marker-linked prototype object',
        text:
          'The prototype assigns this mug a QR path and AR.js marker-card path. The physical cup is treated as the object anchor, while the printed marker card is the reliable archive access target.',
        sourceType: 'fact',
        sourceIds: ['prototype-brief'],
      },
    ],
    middleReadings: [
      {
        id: 'sample-middle-daily-political-container',
        layer: 'middle',
        title: 'Daily object, political container',
        text:
          'The mug can be read as a small domestic container that carries political language into repeated routines such as drinking, desk work, and storage.',
        sourceType: 'inference',
        sourceIds: ['prototype-brief'],
      },
      {
        id: 'sample-middle-handheld-memory',
        layer: 'middle',
        title: 'Held close, read indirectly',
        text:
          'Because a mug is handled rather than only viewed, its politics may be encountered through touch, habit, humour, or discomfort before it becomes a formal museum object.',
        sourceType: 'speculation',
        sourceIds: ['interpretive-framework'],
      },
    ],
    coreFragments: [
      {
        id: 'sample-core-redacted-owner',
        layer: 'core',
        title: 'Previous owner withheld',
        text:
          'The prototype keeps the absent ownership story visible as redaction rather than inventing a donor, user, or political affiliation.',
        sourceType: 'redacted',
        sourceIds: ['redaction-policy'],
        isRedacted: true,
      },
      {
        id: 'sample-core-visitor-prompt',
        layer: 'core',
        title: 'Local memory prompt',
        text:
          'Visitor memory belongs here only as a local contribution during the MVP: a question, counter-reading, remembered slogan, or disputed association.',
        sourceType: 'visitorContribution',
        sourceIds: ['local-storage-policy'],
      },
    ],
    sources: [
      {
        id: 'sample-source-placeholder-record',
        type: 'fact',
        label: 'Placeholder collection record',
        citation: 'Exact museum record needed before public use.',
        confidence: 'unknown',
      },
      {
        id: 'prototype-brief',
        type: 'fact',
        label: 'The Glitching Archive project brief',
        citation: 'User-supplied AGENTS.md project concept and Agent 02 brief.',
        confidence: 'confirmed',
      },
      {
        id: 'interpretive-framework',
        type: 'speculation',
        label: 'Prototype interpretive frame',
        citation: 'Speculative reading generated for the sample data layer.',
        confidence: 'partial',
      },
      {
        id: 'redaction-policy',
        type: 'redacted',
        label: 'Right-to-opacity policy',
        citation: 'Ethical rule: do not force closure where the archive is uncertain.',
        confidence: 'confirmed',
      },
      {
        id: 'local-storage-policy',
        type: 'visitorContribution',
        label: 'Local-only visitor contribution policy',
        citation: 'MVP annotation data remains in browser LocalStorage.',
        confidence: 'confirmed',
      },
    ],
    ethicsNoteIds: [...sharedEthicsNoteIds, 'local-only-contribution'],
    assetRequirements: assetRequirementsFor('sample-mug', 'sample-mug'),
  },
  {
    id: 'campaign-slogan-mug',
    slug: 'campaign-slogan-mug',
    title: 'Campaign slogan mug, placeholder record',
    maker: 'Unknown maker pending source data',
    dateRange: 'Election period pending verification',
    collectionId: 'Placeholder collection ID',
    material: 'Glazed ceramic, pending verification',
    dimensions: 'Dimensions pending supplied collection record',
    markerPatternPath: '/assets/archive/markers/campaign-slogan-mug.patt',
    qrPath: '/assets/archive/qr/campaign-slogan-mug.svg',
    imagePath: '/assets/archive/images/campaign-slogan-mug.jpg',
    audioPath: '/assets/archive/audio/campaign-slogan-mug-projection.mp3',
    projectionAudioPath: '/assets/archive/audio/campaign-slogan-mug-projection.mp3',
    facts: [
      {
        id: 'campaign-surface-placeholder',
        layer: 'surface',
        title: 'Campaign object placeholder',
        text:
          'This record reserves space for a mug bearing campaign or party-political language. The slogan, date, campaign, and maker must be transcribed from supplied object evidence before being treated as facts.',
        sourceType: 'fact',
        sourceIds: ['campaign-source-needed'],
      },
      {
        id: 'campaign-surface-media-needed',
        layer: 'surface',
        title: 'Image and marker needed',
        text:
          'The current image, QR, audio, and marker paths are planned asset locations, not verified public assets.',
        sourceType: 'fact',
        sourceIds: ['asset-manifest'],
      },
    ],
    middleReadings: [
      {
        id: 'campaign-middle-slogan-domestic',
        layer: 'middle',
        title: 'Slogan in the domestic register',
        text:
          'A campaign slogan on a mug may shift public persuasion into a domestic or workplace routine, making politics part of repeated private gestures.',
        sourceType: 'inference',
        sourceIds: ['interpretive-framework'],
      },
      {
        id: 'campaign-middle-afterlife',
        layer: 'middle',
        title: 'Afterlife of a campaign object',
        text:
          'The cup may have survived after the campaign moment ended, changing from active persuasion into keepsake, joke, evidence, or unwanted remainder.',
        sourceType: 'speculation',
        sourceIds: ['interpretive-framework'],
      },
    ],
    coreFragments: [
      {
        id: 'campaign-core-affiliation-redacted',
        layer: 'core',
        title: 'Affiliation not assumed',
        text:
          'Owning, donating, storing, or encountering this mug should not be treated as proof of political support without direct evidence.',
        sourceType: 'redacted',
        sourceIds: ['redaction-policy'],
        isRedacted: true,
      },
      {
        id: 'campaign-core-dispute-prompt',
        layer: 'core',
        title: 'Dispute prompt',
        text:
          'A visitor may add a local-only dispute if the slogan means something different across generation, region, party context, or lived experience.',
        sourceType: 'visitorContribution',
        sourceIds: ['local-storage-policy'],
      },
    ],
    sources: [
      {
        id: 'campaign-source-needed',
        type: 'fact',
        label: 'Campaign mug source record needed',
        citation: 'Requires supplied photograph, collection record, or object label.',
        confidence: 'unknown',
      },
      {
        id: 'asset-manifest',
        type: 'fact',
        label: 'Agent 02 placeholder asset manifest',
        citation: 'See docs/archive-asset-requirements.md.',
        confidence: 'partial',
      },
      {
        id: 'interpretive-framework',
        type: 'inference',
        label: 'Object-as-container interpretive frame',
        citation: 'Inference from the project concept, not verified object history.',
        confidence: 'partial',
      },
      {
        id: 'redaction-policy',
        type: 'redacted',
        label: 'No assumed affiliation rule',
        citation: 'Ethical rule: do not infer personal politics from possession alone.',
        confidence: 'confirmed',
      },
      {
        id: 'local-storage-policy',
        type: 'visitorContribution',
        label: 'Local-only visitor contribution policy',
        citation: 'MVP annotation data remains in browser LocalStorage.',
        confidence: 'confirmed',
      },
    ],
    ethicsNoteIds: [...sharedEthicsNoteIds, 'local-only-contribution'],
    assetRequirements: assetRequirementsFor('campaign-slogan-mug', 'campaign-slogan-mug'),
  },
  {
    id: 'commemorative-protest-mug',
    slug: 'commemorative-protest-mug',
    title: 'Commemorative protest mug, placeholder record',
    maker: 'Unknown maker pending source data',
    dateRange: 'Protest or commemoration date pending verification',
    collectionId: 'Placeholder collection ID',
    material: 'Ceramic, pending verification',
    dimensions: 'Dimensions pending supplied collection record',
    markerPatternPath: '/assets/archive/markers/commemorative-protest-mug.patt',
    qrPath: '/assets/archive/qr/commemorative-protest-mug.svg',
    imagePath: '/assets/archive/images/commemorative-protest-mug.jpg',
    audioPath: '/assets/archive/audio/commemorative-protest-mug-projection.mp3',
    projectionAudioPath: '/assets/archive/audio/commemorative-protest-mug-projection.mp3',
    facts: [
      {
        id: 'protest-surface-placeholder',
        layer: 'surface',
        title: 'Commemoration record pending',
        text:
          'This record stands in for a mug connected to protest, commemoration, or collective political memory. The event name, date, place, and inscription are placeholders until supplied evidence confirms them.',
        sourceType: 'fact',
        sourceIds: ['protest-source-needed'],
      },
      {
        id: 'protest-surface-installation',
        layer: 'surface',
        title: 'Projection-wall candidate',
        text:
          'The record includes an optional projection audio path so the same object can move from phone-scale reading to sound-wall mode.',
        sourceType: 'fact',
        sourceIds: ['prototype-brief'],
      },
    ],
    middleReadings: [
      {
        id: 'protest-middle-commemoration',
        layer: 'middle',
        title: 'Commemoration at table scale',
        text:
          'If the mug marks a protest or campaign, it may miniaturise a collective event into an object that can be carried, displayed, washed, chipped, or forgotten.',
        sourceType: 'inference',
        sourceIds: ['interpretive-framework'],
      },
      {
        id: 'protest-middle-sound-wall',
        layer: 'middle',
        title: 'From cup to wall',
        text:
          'In projection mode, the mug could become a trigger for overlapping voices: official labels, uncertain memories, and local annotations heard together without one final account.',
        sourceType: 'speculation',
        sourceIds: ['projection-concept'],
      },
    ],
    coreFragments: [
      {
        id: 'protest-core-harm-context-redacted',
        layer: 'core',
        title: 'Potential harm context withheld',
        text:
          'Any names, injuries, arrests, or personal consequences connected to protest history should remain redacted until evidence, consent, and interpretation guidelines are supplied.',
        sourceType: 'redacted',
        sourceIds: ['redaction-policy'],
        isRedacted: true,
      },
      {
        id: 'protest-core-question-prompt',
        layer: 'core',
        title: 'Question prompt',
        text:
          'Visitors may locally ask what kind of political memory belongs in a museum record, and what should remain partial, private, or contested.',
        sourceType: 'visitorContribution',
        sourceIds: ['local-storage-policy'],
      },
    ],
    sources: [
      {
        id: 'protest-source-needed',
        type: 'fact',
        label: 'Protest mug source record needed',
        citation: 'Requires supplied object photograph, collection record, or label text.',
        confidence: 'unknown',
      },
      {
        id: 'prototype-brief',
        type: 'fact',
        label: 'The Glitching Archive project brief',
        citation: 'User-supplied AGENTS.md project concept and Agent 02 brief.',
        confidence: 'confirmed',
      },
      {
        id: 'interpretive-framework',
        type: 'inference',
        label: 'Object-as-container interpretive frame',
        citation: 'Inference from the project concept, not verified object history.',
        confidence: 'partial',
      },
      {
        id: 'projection-concept',
        type: 'speculation',
        label: 'Projection mode concept',
        citation: 'Speculative setup for Agent 06 sound-wall development.',
        confidence: 'partial',
      },
      {
        id: 'redaction-policy',
        type: 'redacted',
        label: 'Potential harm and consent redaction',
        citation: 'Ethical rule: keep sensitive or unsupported memory partial.',
        confidence: 'confirmed',
      },
      {
        id: 'local-storage-policy',
        type: 'visitorContribution',
        label: 'Local-only visitor contribution policy',
        citation: 'MVP annotation data remains in browser LocalStorage.',
        confidence: 'confirmed',
      },
    ],
    ethicsNoteIds: [...sharedEthicsNoteIds, 'local-only-contribution'],
    assetRequirements: assetRequirementsFor(
      'commemorative-protest-mug',
      'commemorative-protest-mug',
    ),
  },
];

export const placeholderMugs = archiveMugs;

export function getMugById(id: string | undefined) {
  if (!id) {
    return undefined;
  }

  return archiveMugs.find((mug) => mug.id === id || mug.slug === id);
}

export const findMugById = getMugById;

export function getLayer(mug: MugRecord, layerState: LayerState): ArchiveLayer {
  const layers: Record<LayerState, ArchiveLayer> = {
    surface: {
      state: 'surface',
      title: 'Surface',
      description: 'Official object facts and institutional framing.',
      fragments: mug.facts,
    },
    middle: {
      state: 'middle',
      title: 'Middle',
      description: 'Inferred and speculative readings around politics, feeling, and use.',
      fragments: mug.middleReadings,
    },
    core: {
      state: 'core',
      title: 'Core',
      description: 'Redacted, unresolved, disputed, or visitor-contributed memory.',
      fragments: mug.coreFragments,
    },
  };

  return layers[layerState];
}

export function getAllFragments(mug: MugRecord): NarrativeFragment[] {
  return [...mug.facts, ...mug.middleReadings, ...mug.coreFragments];
}

export function validateSourceLabels(mug: MugRecord) {
  const sourceIds = new Set(mug.sources.map((source) => source.id));

  return getAllFragments(mug).map((fragment) => ({
    fragmentId: fragment.id,
    hasSourceType: Boolean(fragment.sourceType),
    hasKnownSources: fragment.sourceIds.every((sourceId) => sourceIds.has(sourceId)),
    sourceTypeMatchesLayer:
      fragment.sourceType !== 'fact' || fragment.layer === 'surface' || fragment.text.includes('placeholder'),
  }));
}

export const archiveAssetRequirements = archiveMugs.flatMap((mug) => mug.assetRequirements ?? []);
