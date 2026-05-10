import type { ReactNode } from 'react';
import type { LayerState } from '../types/archive';
import ArchiveTexture from './ArchiveTexture';

interface ArchiveCardProps {
  children: ReactNode;
  layerState?: LayerState;
  className?: string;
  labelledBy?: string;
}

function ArchiveCard({
  children,
  layerState = 'surface',
  className,
  labelledBy,
}: ArchiveCardProps) {
  return (
    <article
      className={['archive-sensory-card', `glitch-layer-${layerState}`, className]
        .filter(Boolean)
        .join(' ')}
      aria-labelledby={labelledBy}
    >
      <ArchiveTexture layerState={layerState} variant="card" />
      <div className="archive-sensory-card__content">{children}</div>
    </article>
  );
}

export default ArchiveCard;
