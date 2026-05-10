import type { ArchiveSource, LayerState, NarrativeFragment } from '../../types/archive';
import ArchiveCard from './ArchiveCard';

const layerCopy: Record<LayerState, { label: string; description: string }> = {
  surface: {
    label: 'Surface',
    description: 'Official object facts and the institutional frame.',
  },
  middle: {
    label: 'Middle',
    description: 'Inferred or speculative political, social, and emotional readings.',
  },
  core: {
    label: 'Core',
    description: 'Unresolved, redacted, or visitor-contributed memory.',
  },
};

interface LayerCardProps {
  layer: LayerState;
  fragments: NarrativeFragment[];
  sources: ArchiveSource[];
}

function LayerCard({ layer, fragments, sources }: LayerCardProps) {
  const copy = layerCopy[layer];

  return (
    <section className="object-layer-card" aria-labelledby={`layer-${layer}-title`}>
      <div className="object-layer-card__header">
        <span className="layer-label">{layer}</span>
        <div>
          <h2 id={`layer-${layer}-title`}>{copy.label} layer</h2>
          <p>{copy.description}</p>
        </div>
      </div>

      <div className="object-fragment-list">
        {fragments.length > 0 ? (
          fragments.map((fragment) => (
            <ArchiveCard key={fragment.id} fragment={fragment} sources={sources} />
          ))
        ) : (
          <p className="object-empty-state">
            No fragments have been added to this layer yet. Keep this absence visible for
            integration rather than filling it with unsupported archive claims.
          </p>
        )}
      </div>
    </section>
  );
}

export default LayerCard;
