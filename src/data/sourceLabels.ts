import type { ArchiveSourceType, SourceLabelDefinition } from '../types/archive';

export const sourceLabelDefinitions: Record<ArchiveSourceType, SourceLabelDefinition> = {
  fact: {
    type: 'fact',
    label: 'Fact',
    shortLabel: 'Fact',
    description:
      'A collection-facing statement that must be traceable to supplied records or visible object evidence.',
    ethicsNote:
      'Use only for confirmed or explicitly placeholder metadata. Do not use for interpretation.',
  },
  inference: {
    type: 'inference',
    label: 'Inference',
    shortLabel: 'Inference',
    description:
      'A reasoned reading based on object form, placement, wording, or known interpretive context.',
    ethicsNote:
      'Make the reasoning visible and avoid presenting the reading as institutional certainty.',
  },
  speculation: {
    type: 'speculation',
    label: 'Speculation',
    shortLabel: 'Speculation',
    description:
      'A possible political, social, or emotional reading used to open discussion rather than settle history.',
    ethicsNote:
      'Keep claims conditional and clearly separate from verified object metadata.',
  },
  visitorContribution: {
    type: 'visitorContribution',
    label: 'Visitor contribution',
    shortLabel: 'Visitor',
    description:
      'A local-only visitor annotation, memory, dispute, or question contributed during the MVP experience.',
    ethicsNote:
      'Visitor text stays on the device unless a later backend and consent model are explicitly added.',
  },
  redacted: {
    type: 'redacted',
    label: 'Redacted',
    shortLabel: 'Redacted',
    description:
      'A deliberately withheld, unresolved, or unavailable part of the archive that remains visible as absence.',
    ethicsNote:
      'Right-to-opacity is a design principle: not every gap should be forced into disclosure.',
  },
};

export function getSourceLabel(sourceType: ArchiveSourceType) {
  return sourceLabelDefinitions[sourceType];
}

export function getSourceLabelText(sourceType: ArchiveSourceType) {
  return sourceLabelDefinitions[sourceType].label;
}
