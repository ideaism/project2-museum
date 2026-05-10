import type { ArchiveSource, NarrativeFragment } from '../../types/archive';
import SourceBadge from './SourceBadge';

interface ArchiveCardProps {
  fragment: NarrativeFragment;
  sources: ArchiveSource[];
}

function ArchiveCard({ fragment, sources }: ArchiveCardProps) {
  const fragmentSources = fragment.sourceIds
    .map((sourceId) => sources.find((source) => source.id === sourceId))
    .filter((source): source is ArchiveSource => Boolean(source));

  return (
    <article className="object-fragment">
      <div className="object-fragment__meta">
        <SourceBadge type={fragment.sourceType} />
        <span className="object-fragment__layer">{fragment.layer}</span>
      </div>
      <h3>{fragment.title}</h3>
      <p>{fragment.text}</p>

      {fragmentSources.length > 0 ? (
        <dl className="object-fragment__sources" aria-label="Fragment sources">
          {fragmentSources.map((source) => (
            <div key={source.id}>
              <dt>{source.label}</dt>
              <dd>
                {source.confidence ? `Confidence: ${source.confidence}` : 'Confidence not set'}
                {source.citation ? ` · ${source.citation}` : ''}
              </dd>
            </div>
          ))}
        </dl>
      ) : (
        <p className="object-fragment__source-note">
          Source record pending. This fragment is still labelled by source type.
        </p>
      )}
    </article>
  );
}

export default ArchiveCard;
