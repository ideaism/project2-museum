import type { CSSProperties } from 'react';
import type { ArchiveSourceType, LayerState } from '../types/archive';
import RedactedText from './RedactedText';
import SourceBadge from './object/SourceBadge';

export interface FloatingFragment {
  id: string;
  mugTitle: string;
  layer: LayerState;
  sourceType: ArchiveSourceType;
  title: string;
  text: string;
  upvotes?: number;
  featured?: boolean;
}

interface FloatingFragmentsProps {
  fragments: FloatingFragment[];
  paused?: boolean;
}

const layerLabels: Record<LayerState, string> = {
  surface: 'surface',
  middle: 'middle',
  core: 'core',
};

function FloatingFragments({ fragments, paused = false }: FloatingFragmentsProps) {
  return (
    <div
      className={paused ? 'shadow-floating-fragments is-paused' : 'shadow-floating-fragments'}
      aria-live="polite"
    >
      {fragments.map((fragment, index) => (
        <article
          key={fragment.id}
          className={`shadow-fragment shadow-fragment--${fragment.sourceType} shadow-fragment--${fragment.layer}`}
          style={
            {
              '--fragment-left': `${8 + ((index * 19) % 78)}%`,
              '--fragment-top': `${6 + ((index * 23) % 68)}%`,
              '--drift-duration': `${22 + (index % 5) * 4}s`,
              '--drift-delay': `${(index % 7) * 0.9}s`,
            } as CSSProperties
          }
        >
          <div className="shadow-fragment__meta">
            <SourceBadge type={fragment.sourceType} />
            <span>{layerLabels[fragment.layer]}</span>
          </div>
          <p className="shadow-fragment__mug">{fragment.mugTitle}</p>
          <h3>{fragment.title}</h3>
          <p>
            {fragment.sourceType === 'redacted' ? (
              <>
                <RedactedText text={fragment.text} layerState={fragment.layer} />{' '}
                <span className="shadow-fragment__note">right to opacity</span>
              </>
            ) : (
              fragment.text
            )}
          </p>
          {fragment.sourceType === 'visitorContribution' ? (
            <p className="shadow-fragment__community">
              {fragment.featured ? 'featured · ' : ''}
              {fragment.upvotes ?? 0} upvotes · upvoted does not mean true
            </p>
          ) : null}
        </article>
      ))}
    </div>
  );
}

export default FloatingFragments;
