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
    shortHook: 'A kitchen cup carrying coal, family, strike, and unresolved justice.',
    objectType: 'Political ceramic mug',
    maker: 'Maker not visible in supplied object evidence',
    dateRange: 'Printed strike years: 1972, 1974, 1984',
    collectionId: 'Possible V&A C.174-1991 match pending verification',
    material: 'Earthenware with glaze, pending object-match verification',
    dimensions: 'Dimensions pending supplied collection record',
    sourceMetadata: {
      museum: 'V&A East Storehouse',
      display: 'Marking moments in time',
      museumNumber: 'Possible C.174-1991 match',
      maker: 'Commemorative Pottery if matched to C.174-1991',
      placeDate: 'England, 1984 if matched to C.174-1991',
      materialsTechniques: 'Earthenware, glaze, glazing if matched to C.174-1991',
      verificationStatus: 'partial',
      note:
        'V&A lists C.174-1991 as a 1984 mug by Commemorative Pottery; exact match to the supplied miners image still needs collection verification.',
    },
    visibleInscription: [
      "BRITAIN'S COAL FOR BRITAIN'S FUTURE",
      'SUPPORT THE MINERS',
      'STRIKING FOR JUSTICE 1972 1974 1984',
    ],
    markerId: 'sample-mug-marker',
    markerPatternPath: '/assets/archive/markers/sample-mug.patt',
    qrPath: '/assets/archive/qr/sample-mug.svg',
    imagePath: cabinetAssetPaths['sample-mug'].imagePath,
    modelPath: cabinetAssetPaths['sample-mug'].modelPath,
    audioPath: '/assets/archive/audio/sample-mug-projection.mp3',
    projectionAudioPath: '/assets/archive/audio/sample-mug-projection.mp3',
    soundDirection: {
      surface: 'Ceramic clink, kettle breath, and small printed-label ticks.',
      middle: 'Low coal rumble, muffled marching feet, and kitchen room tone.',
      core: 'Dropouts, breath, near-silence, and testimony cut before certainty.',
    },
    visualDirection: {
      surface: 'Dates and slogans appear as crisp black print on white ceramic.',
      middle: 'Coal-dust speckling and screen-print misregistration increase with pour.',
      core: 'Faces and names fade behind redaction bars, then return as outlines.',
    },
    visitorPrompt: 'Did this image feel like solidarity, pressure, propaganda, or memory?',
    ethicalNotes: [
      'Do not claim to speak for miners, families, unions, strike-breakers, police, or coalfield communities.',
      'Do not invent owner, donor, fundraising, or family testimony.',
      'Keep harm, debt, hunger, arrest, and local dispute histories redacted without consent and evidence.',
    ],
    unresolvedQuestions: [
      'Who first owned this mug?',
      'Did any proceeds support strike funds?',
      'Which mining community, if any, is directly connected to this object?',
      'Does the supplied image match V&A C.174-1991?',
    ],
    aiSpeculation: {
      keywords: ['coal', 'justice', 'strike solidarity', 'kitchen', 'family pressure'],
      safeSpeculationBoundaries: [
        'Speculate only about how printed slogans might be encountered through domestic use.',
        'Keep community memory plural and contested.',
        'Use conditional language for emotional readings.',
      ],
      forbiddenClaims: [
        'Do not name an owner, donor, miner, family, union branch, or strike-breaker.',
        'Do not claim the mug raised money without source evidence.',
        'Do not treat one mining community as representative of all coalfields.',
      ],
      suggestedPrompts: [
        'Write a 20-word middle-layer fragment about justice becoming a domestic ritual.',
        'Generate a redacted core question about solidarity without inventing testimony.',
      ],
    },
    facts: [
      {
        id: 'miners-surface-visible-design',
        layer: 'surface',
        title: 'Visible slogans',
        text: 'The mug shows black printed miners imagery and strike solidarity slogans.',
        sourceType: 'fact',
        researchType: 'visible-evidence',
        sourceIds: ['miners-visible-evidence'],
      },
      {
        id: 'miners-surface-strike-context',
        layer: 'surface',
        title: 'Strike years as context',
        text: 'The printed years 1972, 1974, and 1984 align with documented miners strike contexts.',
        sourceType: 'fact',
        researchType: 'historical-context',
        sourceIds: ['kent-mining-strikes', 'museum-wales-miners-strike', 'miners-research-needed'],
      },
      {
        id: 'miners-surface-asset-paths',
        layer: 'surface',
        title: 'Metadata gap',
        text: 'Maker, ownership, production run, and fundraising context remain unverified.',
        sourceType: 'fact',
        researchType: 'unresolved',
        sourceIds: ['asset-manifest', 'miners-research-needed'],
      },
    ],
    middleReadings: [
      {
        id: 'miners-middle-coal-body',
        layer: 'middle',
        title: 'Coal in the kitchen',
        text:
          'The mug links national energy to labouring bodies. Strike conflict enters the kitchen as a handled routine.',
        sourceType: 'inference',
        researchType: 'inference',
        sourceIds: ['agent10-story-proposal'],
      },
      {
        id: 'miners-middle-future-justice',
        layer: 'middle',
        title: 'Future as demand',
        text:
          '"Future" reads as a demand, not a forecast. "Justice" makes the dispute moral as well as economic.',
        sourceType: 'inference',
        researchType: 'inference',
        sourceIds: ['agent10-story-proposal'],
      },
      {
        id: 'miners-middle-family-pressure',
        layer: 'middle',
        title: 'Pressure beyond the pit',
        text:
          'The family-like figures may ask who carries strike pressure beyond the pit.',
        sourceType: 'speculation',
        researchType: 'speculation',
        sourceIds: ['agent10-story-proposal'],
      },
    ],
    coreFragments: [
      {
        id: 'miners-core-owner-unresolved',
        layer: 'core',
        title: 'Unverified room',
        text: 'Who first owned this mug, and what did support mean in that room?',
        sourceType: 'redacted',
        researchType: 'unresolved',
        sourceIds: ['miners-ethics-caution'],
        isRedacted: true,
      },
      {
        id: 'miners-core-harm-redacted',
        layer: 'core',
        title: 'Names and harms withheld',
        text:
          'Names, arrests, debts, hunger, and family conflict stay hidden without evidence and consent.',
        sourceType: 'redacted',
        researchType: 'redacted',
        sourceIds: ['miners-ethics-caution', 'redaction-policy'],
        isRedacted: true,
      },
      {
        id: 'miners-core-visitor-question',
        layer: 'core',
        title: 'Local question',
        text: 'Did this image feel like solidarity, pressure, propaganda, or memory?',
        sourceType: 'visitorContribution',
        researchType: 'visitor-contribution',
        sourceIds: ['local-storage-policy'],
      },
    ],
    sources: [
      {
        id: 'miners-visible-evidence',
        type: 'fact',
        label: 'Visible evidence: miners mug image',
        citation: 'docs/object-stories-three-mugs.md, Mug 01 visible evidence.',
        confidence: 'partial',
      },
      {
        id: 'va-miners-possible-match',
        type: 'fact',
        label: 'V&A possible miners mug match',
        citation:
          'V&A East Storehouse Lookup, "Marking moments in time", C.174-1991: Mug, Commemorative Pottery, England, 1984.',
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
    title: 'Labour Red Rose: Party Name, Domestic Signal',
    shortHook: 'A party word and rose enter the daily ritual of holding a cup.',
    objectType: 'Political ceramic mug',
    maker: 'Unknown maker pending source data',
    dateRange: 'Possibly 1986, pending object-match verification',
    collectionId: 'Possible V&A C.91-1991 match pending verification',
    material: 'Earthenware with glaze and printed decoration, pending object-match verification',
    dimensions: 'Dimensions pending supplied collection record',
    sourceMetadata: {
      museum: 'V&A East Storehouse',
      display: 'Marking moments in time',
      museumNumber: 'Possible C.91-1991 match',
      maker: 'Unknown',
      placeDate: 'Staffordshire, possibly 1986 if matched to C.91-1991',
      materialsTechniques: 'Earthenware, glaze, printed, glazed if matched to C.91-1991',
      verificationStatus: 'partial',
      note:
        'V&A lists C.91-1991 as a Staffordshire mug, possibly 1986; exact match to the supplied Labour image remains unverified.',
    },
    visibleInscription: ['Labour'],
    markerId: 'campaign-slogan-mug-marker',
    markerPatternPath: '/assets/archive/markers/campaign-slogan-mug.patt',
    qrPath: '/assets/archive/qr/campaign-slogan-mug.svg',
    imagePath: cabinetAssetPaths['campaign-slogan-mug'].imagePath,
    modelPath: cabinetAssetPaths['campaign-slogan-mug'].modelPath,
    audioPath: '/assets/archive/audio/campaign-slogan-mug-projection.mp3',
    projectionAudioPath: '/assets/archive/audio/campaign-slogan-mug-projection.mp3',
    soundDirection: {
      surface: 'Ceramic click, quiet office hum, and a small badge-pin tap.',
      middle: 'Muffled meeting room, paper stacks, and crowd sound reduced to room tone.',
      core: 'Muted applause interrupted by blank tape and redacted breaths.',
    },
    visualDirection: {
      surface: 'The red word and rose stay clean, flat, and recognisable.',
      middle: 'Letter edges slip as party branding becomes unstable.',
      core: 'Redaction cuts through white space around the logo.',
    },
    visitorPrompt: 'What does this word fail to hold?',
    ethicalNotes: [
      'Do not read ownership as political belief, party membership, or campaign participation.',
      'Do not claim a campaign, conference, constituency, or donor context without source evidence.',
      'Keep local party disputes and donor histories unresolved unless verified.',
    ],
    unresolvedQuestions: [
      'Does the supplied Labour image match V&A C.91-1991?',
      'Was this campaign merchandise, shop stock, conference material, or later souvenir?',
      'What rose or party mark is visible on the full object, if any?',
      'Who used or kept this mug, and why?',
    ],
    aiSpeculation: {
      keywords: ['Labour', 'red rose', 'party branding', 'domestic signal', 'institution'],
      safeSpeculationBoundaries: [
        'Speculate about branding entering everyday life, not about a specific owner.',
        'Keep the relation between labour as work and Labour as party open.',
        'Use the mug as a political sign, not proof of allegiance.',
      ],
      forbiddenClaims: [
        'Do not claim party membership, voting behaviour, or personal belief.',
        'Do not identify a campaign, candidate, donor, or local party without evidence.',
        'Do not claim the red rose design is complete unless the full object image verifies it.',
      ],
      suggestedPrompts: [
        'Write a short middle-layer fragment about a movement becoming a logo.',
        'Generate a core-layer question about what branding hides.',
      ],
    },
    facts: [
      {
        id: 'labour-surface-visible-text',
        layer: 'surface',
        title: 'Name as sign',
        text: 'The supplied image shows a white mug with large red Labour text.',
        sourceType: 'fact',
        researchType: 'visible-evidence',
        sourceIds: ['labour-visible-evidence'],
      },
      {
        id: 'labour-surface-possible-va-match',
        layer: 'surface',
        title: 'Possible collection match',
        text:
          'V&A lists a possible related Staffordshire mug, C.91-1991, but this object match is unverified.',
        sourceType: 'fact',
        researchType: 'historical-context',
        sourceIds: ['va-marking-moments', 'labour-research-needed'],
      },
      {
        id: 'labour-surface-everyday-messaging',
        layer: 'surface',
        title: 'Everyday political messaging',
        text:
          'V&A frames factory-produced mugs as everyday objects for graphic design and messaging.',
        sourceType: 'fact',
        researchType: 'fact',
        sourceIds: ['va-marking-moments', 'brighton-popular-pottery'],
      },
    ],
    middleReadings: [
      {
        id: 'labour-middle-name-colour',
        layer: 'middle',
        title: 'Name, colour, recognition',
        text:
          'The mug reduces politics to name, colour, and recognition. It speaks through branding rather than a crowd.',
        sourceType: 'inference',
        researchType: 'inference',
        sourceIds: ['agent10-story-proposal'],
      },
      {
        id: 'labour-middle-affiliation-stock',
        layer: 'middle',
        title: 'Affiliation or leftover',
        text:
          'It may have sat on a desk as affiliation, habit, joke, loyalty, or leftover stock.',
        sourceType: 'speculation',
        researchType: 'speculation',
        sourceIds: ['agent10-story-proposal'],
      },
      {
        id: 'labour-middle-movement-brand',
        layer: 'middle',
        title: 'Movement into brand',
        text: 'Party identity enters the hand through a domestic object.',
        sourceType: 'inference',
        researchType: 'inference',
        sourceIds: ['agent10-story-proposal'],
      },
    ],
    coreFragments: [
      {
        id: 'labour-core-possession-caution',
        layer: 'core',
        title: 'Possession is not proof',
        text: 'Possession is not proof of belief, membership, or campaign participation.',
        sourceType: 'redacted',
        researchType: 'redacted',
        sourceIds: ['labour-ethics-caution', 'redaction-policy'],
        isRedacted: true,
      },
      {
        id: 'labour-core-logo-conflict',
        layer: 'core',
        title: 'What the logo cannot hold',
        text:
          'Local party histories, disputes, and donor identities need evidence before display.',
        sourceType: 'redacted',
        researchType: 'unresolved',
        sourceIds: ['labour-ethics-caution'],
        isRedacted: true,
      },
      {
        id: 'labour-core-counter-reading',
        layer: 'core',
        title: 'Counter-reading prompt',
        text: 'When does a political logo feel like care, and when does it feel like a mask?',
        sourceType: 'visitorContribution',
        researchType: 'visitor-contribution',
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
    shortHook: 'A protest route becomes a handled map of unemployment and endurance.',
    objectType: 'Political ceramic mug',
    maker: 'Unknown maker pending source data',
    dateRange: 'May 1981, pending object-match verification',
    collectionId: 'Potential V&A C.106-1991 match pending verification',
    material: 'Earthenware or ceramic, pending collection verification',
    dimensions: 'Dimensions pending supplied collection record',
    sourceMetadata: {
      museum: 'V&A East Storehouse',
      display: 'Marking moments in time',
      museumNumber: 'C.106-1991, pending supplied-image match',
      maker: 'Unknown',
      placeDate: 'England, 1981',
      materialsTechniques: 'Earthenware, firing',
      verificationStatus: 'partial',
      note:
        'V&A lists Peoples March for Jobs as C.106-1991; the app still marks the supplied image match as requiring verification.',
    },
    visibleInscription: ['Peoples march for jobs', 'Liverpool-London May 1981'],
    markerId: 'commemorative-protest-mug-marker',
    markerPatternPath: '/assets/archive/markers/commemorative-protest-mug.patt',
    qrPath: '/assets/archive/qr/commemorative-protest-mug.svg',
    imagePath: cabinetAssetPaths['commemorative-protest-mug'].imagePath,
    modelPath: cabinetAssetPaths['commemorative-protest-mug'].modelPath,
    audioPath: '/assets/archive/audio/commemorative-protest-mug-projection.mp3',
    projectionAudioPath: '/assets/archive/audio/commemorative-protest-mug-projection.mp3',
    soundDirection: {
      surface: 'Pencil tracing a map, ceramic scrape, and light paper rustle.',
      middle: 'Layered footsteps, breath, traffic, and meeting-hall ambience.',
      core: 'Fading place names, interrupted roll call, and low room tone.',
    },
    visualDirection: {
      surface: 'Green route, town names, and border sit flat on ceramic.',
      middle: 'The route line animates with tilt and breaks at uncertain stops.',
      core: 'Small place names magnify but never fully resolve.',
    },
    visitorPrompt: 'Add a local place or question that remains local-only.',
    ethicalNotes: [
      'Do not flatten unemployment into a heroic walking story.',
      'Do not treat the printed route as a complete account of everyone involved.',
      'Keep oral histories and personal hardship absent unless records or consent support them.',
    ],
    unresolvedQuestions: [
      'Does the supplied image exactly match V&A C.106-1991?',
      'What full town list is printed on the mug?',
      'Was the mug sold, issued, gifted, or collected after the march?',
      'Which marchers, hosts, and local supporters are missing from the route?',
    ],
    aiSpeculation: {
      keywords: ['route', 'unemployment', 'walking protest', 'Liverpool to London', 'place memory'],
      safeSpeculationBoundaries: [
        'Speculate about route, endurance, and place memory without inventing marchers.',
        'Keep towns as prompts, not complete local histories.',
        'Treat the mug as a handled map, not a full account of the protest.',
      ],
      forbiddenClaims: [
        'Do not name individual marchers or hosts without records.',
        'Do not claim the printed route includes everyone who mattered.',
        'Do not invent oral histories or outcomes of the march.',
      ],
      suggestedPrompts: [
        'Write a 20-word middle-layer fragment about walking as evidence.',
        'Generate a core-layer unresolved question about places missing from the mug.',
      ],
    },
    facts: [
      {
        id: 'jobs-surface-visible-route',
        layer: 'surface',
        title: 'Route on ceramic',
        text: 'The mug shows green route graphics and the text "Peoples march for jobs".',
        sourceType: 'fact',
        researchType: 'visible-evidence',
        sourceIds: ['jobs-visible-evidence'],
      },
      {
        id: 'jobs-surface-public-history',
        layer: 'surface',
        title: 'March context',
        text:
          'Public-history sources describe a 1981 march from Liverpool to London.',
        sourceType: 'fact',
        researchType: 'historical-context',
        sourceIds: ['phm-peoples-march', 'tuc-peoples-march'],
      },
      {
        id: 'jobs-surface-object-match',
        layer: 'surface',
        title: 'Collection match not settled',
        text:
          'V&A lists C.106-1991 as "Peoples March for Jobs"; the supplied-image match still needs confirmation.',
        sourceType: 'fact',
        researchType: 'fact',
        sourceIds: ['va-marking-moments', 'jobs-research-needed'],
      },
    ],
    middleReadings: [
      {
        id: 'jobs-middle-unemployment-geography',
        layer: 'middle',
        title: 'Unemployment into geography',
        text: 'The route turns unemployment into geography. Job loss is mapped across towns, not hidden in statistics.',
        sourceType: 'inference',
        researchType: 'inference',
        sourceIds: ['agent10-story-proposal'],
      },
      {
        id: 'jobs-middle-walking-evidence',
        layer: 'middle',
        title: 'Walking as evidence',
        text:
          'Walking becomes evidence. The body measures distance between political promise and work.',
        sourceType: 'inference',
        researchType: 'inference',
        sourceIds: ['agent10-story-proposal'],
      },
      {
        id: 'jobs-middle-private-aftercare',
        layer: 'middle',
        title: 'Aftercare in a cup',
        text:
          'The mug may have turned public endurance into private aftercare.',
        sourceType: 'speculation',
        researchType: 'speculation',
        sourceIds: ['agent10-story-proposal'],
      },
    ],
    coreFragments: [
      {
        id: 'jobs-core-missing-route',
        layer: 'core',
        title: 'Missing stops',
        text: 'Which marchers, hosts, supporters, and places are missing from this route?',
        sourceType: 'redacted',
        researchType: 'unresolved',
        sourceIds: ['jobs-ethics-caution'],
        isRedacted: true,
      },
      {
        id: 'jobs-core-oral-history-redacted',
        layer: 'core',
        title: 'Oral histories withheld',
        text: 'Personal oral histories require records, permission, and consent before display.',
        sourceType: 'redacted',
        researchType: 'redacted',
        sourceIds: ['jobs-ethics-caution', 'redaction-policy'],
        isRedacted: true,
      },
      {
        id: 'jobs-core-place-prompt',
        layer: 'core',
        title: 'Place prompt',
        text: 'Where does unemployment sit on your own map?',
        sourceType: 'visitorContribution',
        researchType: 'visitor-contribution',
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
