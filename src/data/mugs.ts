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

const verifiedModelSlugs = new Set(['sample-mug', 'campaign-slogan-mug']);

const cabinetAssetPaths: Record<string, { imagePath: string; modelPath: string }> = {
  'sample-mug': {
    imagePath: '/assets/archive/images/mug1.png',
    modelPath: '/assets/archive/models/mug1.glb',
  },
  'campaign-slogan-mug': {
    imagePath: '/assets/archive/images/mug2.png',
    modelPath: '/assets/archive/models/mug2.glb',
  },
  'commemorative-protest-mug': {
    imagePath: '/assets/archive/images/mug3.png',
    modelPath: '/assets/archive/models/mug3.glb',
  },
};

function assetRequirementsFor(mugId: string, slug: string): AssetRequirement[] {
  const cabinetAssets = cabinetAssetPaths[slug];

  return [
    {
      id: `${slug}-image`,
      mugId,
      type: 'image',
      path: cabinetAssets?.imagePath ?? `/assets/archive/images/${slug}.jpg`,
      status: cabinetAssets ? 'verified' : 'needed',
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
      path: cabinetAssets?.modelPath ?? `/assets/archive/models/${slug}.glb`,
      status: cabinetAssets || verifiedModelSlugs.has(slug) ? 'verified' : 'needed',
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
    title: 'Support the Miners: Coal, Justice, Future',
    maker: 'Maker not visible in supplied object evidence',
    dateRange: 'Printed strike years: 1972, 1974, 1984',
    collectionId: 'Placeholder collection ID',
    material: 'White glazed ceramic, pending collection verification',
    dimensions: 'Dimensions pending supplied collection record',
    markerPatternPath: '/assets/archive/markers/sample-mug.patt',
    qrPath: '/assets/archive/qr/sample-mug.svg',
    imagePath: cabinetAssetPaths['sample-mug'].imagePath,
    modelPath: cabinetAssetPaths['sample-mug'].modelPath,
    audioPath: '/assets/archive/audio/sample-mug-projection.mp3',
    projectionAudioPath: '/assets/archive/audio/sample-mug-projection.mp3',
    facts: [
      {
        id: 'miners-surface-visible-design',
        layer: 'surface',
        title: 'Printed solidarity design',
        text:
          'The supplied story evidence describes a white glazed ceramic mug with black printed lettering and illustration, including the texts "BRITAIN\'S COAL FOR BRITAIN\'S FUTURE", "SUPPORT THE MINERS", and "STRIKING FOR JUSTICE 1972 1974 1984".',
        sourceType: 'fact',
        sourceIds: ['miners-visible-evidence'],
      },
      {
        id: 'miners-surface-strike-context',
        layer: 'surface',
        title: 'Strike years as context',
        text:
          'The printed years align with documented national miners\' strike contexts in 1972, 1974, and 1984-85; the exact object production run and fundraising context still require collection verification.',
        sourceType: 'fact',
        sourceIds: ['kent-mining-strikes', 'museum-wales-miners-strike', 'miners-research-needed'],
      },
      {
        id: 'miners-surface-asset-paths',
        layer: 'surface',
        title: 'Prototype asset paths',
        text:
          'The existing prototype keeps this story on the sample-mug route while its cabinet media now points to the mug1 model and preview image. QR, audio, and full collection metadata remain pending.',
        sourceType: 'fact',
        sourceIds: ['asset-manifest'],
      },
    ],
    middleReadings: [
      {
        id: 'miners-middle-coal-body',
        layer: 'middle',
        title: 'Coal in the kitchen',
        text:
          'The mug links coal to both national energy and the bodies that extracted it, moving labour conflict into a daily object handled in kitchens, desks, cupboards, and sinks.',
        sourceType: 'inference',
        sourceIds: ['agent10-story-proposal'],
      },
      {
        id: 'miners-middle-future-justice',
        layer: 'middle',
        title: 'Future as demand',
        text:
          'On this cup, "future" reads less like a neutral forecast and more like a political demand, while "justice" frames the dispute as moral pressure rather than only wages or closures.',
        sourceType: 'inference',
        sourceIds: ['agent10-story-proposal'],
      },
      {
        id: 'miners-middle-family-pressure',
        layer: 'middle',
        title: 'Pressure beyond the pit',
        text:
          'The family-like figures may ask who carries strike pressure beyond the pit; the kitchen can become a small political room, warm, ordinary, and charged.',
        sourceType: 'speculation',
        sourceIds: ['agent10-story-proposal'],
      },
    ],
    coreFragments: [
      {
        id: 'miners-core-owner-unresolved',
        layer: 'core',
        title: 'Unverified room',
        text:
          'Who first owned this mug, and what did supporting the miners mean in that room?',
        sourceType: 'redacted',
        sourceIds: ['miners-ethics-caution'],
        isRedacted: true,
      },
      {
        id: 'miners-core-harm-redacted',
        layer: 'core',
        title: 'Names and harms withheld',
        text:
          'Names of families, donors, strike-breakers, local disputes, arrests, debt, hunger, and family conflict must not be invented or displayed without evidence and consent.',
        sourceType: 'redacted',
        sourceIds: ['miners-ethics-caution', 'redaction-policy'],
        isRedacted: true,
      },
      {
        id: 'miners-core-visitor-question',
        layer: 'core',
        title: 'Local question',
        text:
          'Did this image feel like solidarity, pressure, propaganda, or memory to you?',
        sourceType: 'visitorContribution',
        sourceIds: ['local-storage-policy'],
      },
    ],
    sources: [
      {
        id: 'miners-visible-evidence',
        type: 'fact',
        label: 'Agent 10 supplied object image reading',
        citation: 'docs/object-stories-three-mugs.md, Mug 01 visible evidence.',
        confidence: 'partial',
      },
      {
        id: 'kent-mining-strikes',
        type: 'fact',
        label: 'University of Kent mining strikes context',
        citation:
          'University of Kent Special Collections, "Mining in Kent: History of Mining Strikes".',
        confidence: 'partial',
      },
      {
        id: 'museum-wales-miners-strike',
        type: 'fact',
        label: 'Museum Wales / Big Pit miners strike context',
        citation: 'Museum Wales / Big Pit, "The Miners Strike of 1984".',
        confidence: 'partial',
      },
      {
        id: 'miners-research-needed',
        type: 'redacted',
        label: 'Miners mug collection record needed',
        citation:
          'Verify maker, accession number, production context, sale context, and whether proceeds supported strike funds.',
        confidence: 'unknown',
      },
      {
        id: 'agent10-story-proposal',
        type: 'inference',
        label: 'Agent 10 object story proposal',
        citation: 'docs/object-stories-three-mugs.md.',
        confidence: 'partial',
      },
      {
        id: 'asset-manifest',
        type: 'fact',
        label: 'Agent 02 placeholder asset manifest',
        citation: 'See docs/archive-asset-requirements.md.',
        confidence: 'partial',
      },
      {
        id: 'miners-ethics-caution',
        type: 'redacted',
        label: 'Miners story ethics caution',
        citation:
          'Do not claim to speak for miners, families, unions, strike-breakers, police, or coalfield communities.',
        confidence: 'confirmed',
      },
      {
        id: 'local-storage-policy',
        type: 'visitorContribution',
        label: 'Local-only visitor contribution policy',
        citation: 'MVP annotation data remains in browser LocalStorage.',
        confidence: 'confirmed',
      },
      {
        id: 'redaction-policy',
        type: 'redacted',
        label: 'Right-to-opacity policy',
        citation: 'Ethical rule: do not force closure where the archive is uncertain.',
        confidence: 'confirmed',
      },
    ],
    ethicsNoteIds: [...sharedEthicsNoteIds, 'local-only-contribution'],
    assetRequirements: assetRequirementsFor('sample-mug', 'sample-mug'),
  },
  {
    id: 'campaign-slogan-mug',
    slug: 'campaign-slogan-mug',
    title: 'Labour: Party Name, Domestic Signal',
    maker: 'Unknown maker pending source data',
    dateRange: 'Possibly 1986, pending object-match verification',
    collectionId: 'Placeholder collection ID',
    material: 'White glazed ceramic, pending collection verification',
    dimensions: 'Dimensions pending supplied collection record',
    markerPatternPath: '/assets/archive/markers/campaign-slogan-mug.patt',
    qrPath: '/assets/archive/qr/campaign-slogan-mug.svg',
    imagePath: cabinetAssetPaths['campaign-slogan-mug'].imagePath,
    modelPath: cabinetAssetPaths['campaign-slogan-mug'].modelPath,
    audioPath: '/assets/archive/audio/campaign-slogan-mug-projection.mp3',
    projectionAudioPath: '/assets/archive/audio/campaign-slogan-mug-projection.mp3',
    facts: [
      {
        id: 'labour-surface-visible-text',
        layer: 'surface',
        title: 'Name as sign',
        text:
          'The supplied story evidence describes a white ceramic mug with large red "Labour" text and no visible campaign slogan, candidate name, election date, maker, or provenance.',
        sourceType: 'fact',
        sourceIds: ['labour-visible-evidence'],
      },
      {
        id: 'labour-surface-possible-va-match',
        layer: 'surface',
        title: 'Possible collection match',
        text:
          'Agent 10 notes that V&A East Storehouse lists an unknown Staffordshire mug, possibly 1986, museum number C.91-1991, but the exact match to the supplied Labour image still requires verification.',
        sourceType: 'fact',
        sourceIds: ['va-marking-moments', 'labour-research-needed'],
      },
      {
        id: 'labour-surface-everyday-messaging',
        layer: 'surface',
        title: 'Everyday political messaging',
        text:
          'Public-history sources frame factory-produced and popular pottery mugs as everyday objects that can carry graphic design, messaging, and political or social commentary.',
        sourceType: 'fact',
        sourceIds: ['va-marking-moments', 'brighton-popular-pottery'],
      },
    ],
    middleReadings: [
      {
        id: 'labour-middle-name-colour',
        layer: 'middle',
        title: 'Name, colour, recognition',
        text:
          'The mug reduces politics to a name, colour, and recognition system, speaking through institutional branding rather than a depicted crowd.',
        sourceType: 'inference',
        sourceIds: ['agent10-story-proposal'],
      },
      {
        id: 'labour-middle-affiliation-stock',
        layer: 'middle',
        title: 'Affiliation or leftover',
        text:
          'It may have sat on a desk as affiliation, habit, joke, loyalty, or leftover campaign stock; the missing slogan may make the object feel more official and less argumentative.',
        sourceType: 'speculation',
        sourceIds: ['agent10-story-proposal'],
      },
      {
        id: 'labour-middle-movement-brand',
        layer: 'middle',
        title: 'Movement into brand',
        text:
          'Party identity enters the hand through a domestic object, while movement language can be absorbed into brand language.',
        sourceType: 'inference',
        sourceIds: ['agent10-story-proposal'],
      },
    ],
    coreFragments: [
      {
        id: 'labour-core-possession-caution',
        layer: 'core',
        title: 'Possession is not proof',
        text:
          'Possession of a party mug must not be treated as proof of political belief, party membership, or campaign participation.',
        sourceType: 'redacted',
        sourceIds: ['labour-ethics-caution', 'redaction-policy'],
        isRedacted: true,
      },
      {
        id: 'labour-core-logo-conflict',
        layer: 'core',
        title: 'What the logo cannot hold',
        text:
          'Local party histories, disputes, and donor identities need evidence before display; the archive should keep asking what conflicts disappear when labour becomes "Labour".',
        sourceType: 'redacted',
        sourceIds: ['labour-ethics-caution'],
        isRedacted: true,
      },
      {
        id: 'labour-core-counter-reading',
        layer: 'core',
        title: 'Counter-reading prompt',
        text:
          'When does a political logo feel like care, and when does it feel like a mask?',
        sourceType: 'visitorContribution',
        sourceIds: ['local-storage-policy'],
      },
    ],
    sources: [
      {
        id: 'labour-visible-evidence',
        type: 'fact',
        label: 'Agent 10 supplied Labour image reading',
        citation: 'docs/object-stories-three-mugs.md, Mug 03 visible evidence.',
        confidence: 'partial',
      },
      {
        id: 'va-marking-moments',
        type: 'fact',
        label: 'V&A East Storehouse display context',
        citation: 'V&A East Storehouse Lookup, "Marking moments in time".',
        confidence: 'partial',
      },
      {
        id: 'brighton-popular-pottery',
        type: 'fact',
        label: 'Brighton & Hove Museums popular pottery context',
        citation: 'Brighton & Hove Museums, "Mr Willett\'s Popular Pottery".',
        confidence: 'partial',
      },
      {
        id: 'labour-research-needed',
        type: 'redacted',
        label: 'Labour mug collection record needed',
        citation:
          'Verify exact collection record, date, maker, place of production, campaign context, and whether it matches V&A C.91-1991.',
        confidence: 'unknown',
      },
      {
        id: 'agent10-story-proposal',
        type: 'inference',
        label: 'Agent 10 object story proposal',
        citation: 'docs/object-stories-three-mugs.md.',
        confidence: 'partial',
      },
      {
        id: 'labour-ethics-caution',
        type: 'redacted',
        label: 'Labour story ethics caution',
        citation:
          'Do not read the mug as automatic evidence of personal belief, party membership, or campaign participation.',
        confidence: 'confirmed',
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
    title: "People's March for Jobs: Route Held in a Cup",
    maker: 'Unknown maker pending source data',
    dateRange: 'May 1981, pending object-match verification',
    collectionId: 'Potential V&A C.106-1991 match pending verification',
    material: 'Earthenware or ceramic, pending collection verification',
    dimensions: 'Dimensions pending supplied collection record',
    markerPatternPath: '/assets/archive/markers/commemorative-protest-mug.patt',
    qrPath: '/assets/archive/qr/commemorative-protest-mug.svg',
    imagePath: cabinetAssetPaths['commemorative-protest-mug'].imagePath,
    modelPath: cabinetAssetPaths['commemorative-protest-mug'].modelPath,
    audioPath: '/assets/archive/audio/commemorative-protest-mug-projection.mp3',
    projectionAudioPath: '/assets/archive/audio/commemorative-protest-mug-projection.mp3',
    facts: [
      {
        id: 'jobs-surface-visible-route',
        layer: 'surface',
        title: 'Route on ceramic',
        text:
          'The supplied story evidence describes a beige or speckled ceramic mug with green text, a route-map graphic, town names, and the visible text "Peoples march for jobs" and "Liverpool-London May 1981".',
        sourceType: 'fact',
        sourceIds: ['jobs-visible-evidence'],
      },
      {
        id: 'jobs-surface-public-history',
        layer: 'surface',
        title: 'March context',
        text:
          'Public-history sources describe the 1981 People\'s March for Jobs as a Liverpool-to-London protest, with the Liverpool march leaving on 1 May 1981 and reaching London on 31 May.',
        sourceType: 'fact',
        sourceIds: ['phm-peoples-march', 'tuc-peoples-march'],
      },
      {
        id: 'jobs-surface-object-match',
        layer: 'surface',
        title: 'Collection match not settled',
        text:
          'Agent 10 notes a strong V&A East Storehouse match for "Peoples March for Jobs", museum number C.106-1991, but the supplied mug image must be verified against that record before the number is treated as final.',
        sourceType: 'fact',
        sourceIds: ['va-marking-moments', 'jobs-research-needed'],
      },
    ],
    middleReadings: [
      {
        id: 'jobs-middle-unemployment-geography',
        layer: 'middle',
        title: 'Unemployment into geography',
        text:
          'The route turns unemployment into geography: job loss is mapped across towns, not hidden in statistics.',
        sourceType: 'inference',
        sourceIds: ['agent10-story-proposal'],
      },
      {
        id: 'jobs-middle-walking-evidence',
        layer: 'middle',
        title: 'Walking as evidence',
        text:
          'Walking becomes evidence; the body measures the distance between political promise and work, even while the printed route line makes protest look more planned than it was lived.',
        sourceType: 'inference',
        sourceIds: ['agent10-story-proposal'],
      },
      {
        id: 'jobs-middle-private-aftercare',
        layer: 'middle',
        title: 'Aftercare in a cup',
        text:
          'The mug may have held tea after the march, turning public endurance into private aftercare; each printed place name may have acted as a stop, host, memory, or blister.',
        sourceType: 'speculation',
        sourceIds: ['agent10-story-proposal'],
      },
    ],
    coreFragments: [
      {
        id: 'jobs-core-missing-route',
        layer: 'core',
        title: 'Missing stops',
        text:
          'Which marchers, hosts, local supporters, and places are missing from this printed route?',
        sourceType: 'redacted',
        sourceIds: ['jobs-ethics-caution'],
        isRedacted: true,
      },
      {
        id: 'jobs-core-oral-history-redacted',
        layer: 'core',
        title: 'Oral histories withheld',
        text:
          'Personal oral histories and names of unemployed participants require records, permission, and consent before display.',
        sourceType: 'redacted',
        sourceIds: ['jobs-ethics-caution', 'redaction-policy'],
        isRedacted: true,
      },
      {
        id: 'jobs-core-place-prompt',
        layer: 'core',
        title: 'Place prompt',
        text:
          'Where does unemployment sit on your own map: street, family, school, station, or home?',
        sourceType: 'visitorContribution',
        sourceIds: ['local-storage-policy'],
      },
    ],
    sources: [
      {
        id: 'jobs-visible-evidence',
        type: 'fact',
        label: 'Agent 10 supplied People\'s March image reading',
        citation: 'docs/object-stories-three-mugs.md, Mug 02 visible evidence.',
        confidence: 'partial',
      },
      {
        id: 'va-marking-moments',
        type: 'fact',
        label: 'V&A East Storehouse display context',
        citation: 'V&A East Storehouse Lookup, "Marking moments in time".',
        confidence: 'partial',
      },
      {
        id: 'phm-peoples-march',
        type: 'fact',
        label: 'People\'s History Museum march context',
        citation:
          'People\'s History Museum, "1981 People\'s March for Jobs: Q&A with historian Dr Greig Campbell".',
        confidence: 'partial',
      },
      {
        id: 'tuc-peoples-march',
        type: 'fact',
        label: 'TUC Library march dates',
        citation: 'TUC Library Collections Blog, "People\'s March for Jobs, May 1981".',
        confidence: 'partial',
      },
      {
        id: 'hackney-peoples-march-badge',
        type: 'fact',
        label: 'Hackney Museum related badge record',
        citation: 'Hackney Museum object 2024.39, "Peoples march for jobs" badge.',
        confidence: 'partial',
      },
      {
        id: 'jobs-research-needed',
        type: 'redacted',
        label: 'People\'s March mug object-match needed',
        citation:
          'Confirm the supplied image is V&A C.106-1991 and verify full town list, maker, issue context, and rights before public use.',
        confidence: 'unknown',
      },
      {
        id: 'agent10-story-proposal',
        type: 'inference',
        label: 'Agent 10 object story proposal',
        citation: 'docs/object-stories-three-mugs.md.',
        confidence: 'partial',
      },
      {
        id: 'jobs-ethics-caution',
        type: 'redacted',
        label: 'People\'s March story ethics caution',
        citation:
          'Do not flatten unemployment into heroic walking or treat the printed route as complete history.',
        confidence: 'confirmed',
      },
      {
        id: 'local-storage-policy',
        type: 'visitorContribution',
        label: 'Local-only visitor contribution policy',
        citation: 'MVP annotation data remains in browser LocalStorage.',
        confidence: 'confirmed',
      },
      {
        id: 'redaction-policy',
        type: 'redacted',
        label: 'Right-to-opacity policy',
        citation: 'Ethical rule: keep sensitive or unsupported memory partial.',
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
