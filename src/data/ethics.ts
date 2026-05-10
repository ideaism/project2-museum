import type { EthicsNote } from '../types/archive';

export const ethicsNotes: EthicsNote[] = [
  {
    id: 'source-transparency',
    title: 'Source transparency',
    text:
      'Every narrative fragment carries a visible source type so visitors can distinguish collection placeholders, inference, speculation, visitor memory, and redaction.',
  },
  {
    id: 'right-to-opacity',
    title: 'Right to opacity',
    text:
      'The prototype treats unresolved and redacted material as legitimate archive states. It does not force absent evidence, private memory, or contested history into false closure.',
  },
  {
    id: 'no-hallucinated-history',
    title: 'No hallucinated history',
    text:
      'The sample records avoid invented museum metadata. Missing makers, dates, collection numbers, images, markers, and audio are named as placeholders until supplied evidence is available.',
  },
  {
    id: 'local-only-contribution',
    title: 'Local-only contribution',
    text:
      'Visitor annotations in the MVP are intended for LocalStorage only. A later networked archive would need consent, moderation, retention, and withdrawal rules.',
  },
];

export function getEthicsNote(id: string) {
  return ethicsNotes.find((note) => note.id === id);
}
