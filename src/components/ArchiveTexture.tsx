import type { LayerState } from '../types/archive';

interface ArchiveTextureProps {
  layerState?: LayerState;
  variant?: 'grain' | 'halftone' | 'card' | 'screen';
  className?: string;
}

function ArchiveTexture({
  layerState = 'surface',
  variant = 'grain',
  className,
}: ArchiveTextureProps) {
  return (
    <span
      className={['archive-texture', `archive-texture--${variant}`, `glitch-layer-${layerState}`, className]
        .filter(Boolean)
        .join(' ')}
      aria-hidden="true"
    />
  );
}

export default ArchiveTexture;
