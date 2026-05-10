import type { ElementType, ReactNode } from 'react';
import type { LayerState } from '../types/archive';

interface GlitchTextProps {
  children: ReactNode;
  as?: ElementType;
  id?: string;
  className?: string;
  layerState?: LayerState;
  intensity?: 'low' | 'medium' | 'high';
}

function GlitchText({
  children,
  as: Component = 'span',
  id,
  className,
  layerState = 'surface',
  intensity,
}: GlitchTextProps) {
  const resolvedIntensity =
    intensity ?? (layerState === 'core' ? 'high' : layerState === 'middle' ? 'medium' : 'low');
  return (
    <Component
      id={id}
      className={[
        'glitch-text',
        `glitch-text--${resolvedIntensity}`,
        `glitch-layer-${layerState}`,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <span className="glitch-text__base">{children}</span>
    </Component>
  );
}

export default GlitchText;
