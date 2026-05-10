import type { CSSProperties } from 'react';
import type { LayerState } from '../types/archive';
import type { PourInputStatus } from '../types/interaction';

interface LayerTransitionProps {
  layerState: LayerState;
  pourValue?: number;
  inputStatus?: PourInputStatus;
  inputConfidence?: number;
  className?: string;
}

function LayerTransition({
  layerState,
  pourValue = 0,
  inputStatus = 'manualFallback',
  inputConfidence,
  className,
}: LayerTransitionProps) {
  const confidence = typeof inputConfidence === 'number' ? Math.min(1, Math.max(0, inputConfidence)) : 1;

  return (
    <span
      key={layerState}
      className={['layer-transition', `layer-transition--${layerState}`, className]
        .filter(Boolean)
        .join(' ')}
      data-input-status={inputStatus}
      style={
        {
          '--pour-intensity': String(Math.min(1, Math.max(0, pourValue))),
          '--gesture-confidence': String(confidence),
        } as CSSProperties
      }
      aria-hidden="true"
    />
  );
}

export default LayerTransition;
