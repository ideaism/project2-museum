import type { CSSProperties } from 'react';
import type { LayerState } from '../types/archive';

interface LayerTransitionProps {
  layerState: LayerState;
  pourValue?: number;
  className?: string;
}

function LayerTransition({ layerState, pourValue = 0, className }: LayerTransitionProps) {
  return (
    <span
      key={layerState}
      className={['layer-transition', `layer-transition--${layerState}`, className]
        .filter(Boolean)
        .join(' ')}
      style={{ '--pour-intensity': String(Math.min(1, Math.max(0, pourValue))) } as CSSProperties}
      aria-hidden="true"
    />
  );
}

export default LayerTransition;
