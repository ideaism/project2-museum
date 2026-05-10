import type { ReactNode } from 'react';
import type { LayerState } from '../types/archive';

interface GlitchBadgeProps {
  children: ReactNode;
  layerState?: LayerState;
  tone?: 'neutral' | 'warning' | 'dark';
  className?: string;
}

function GlitchBadge({
  children,
  layerState = 'surface',
  tone = 'neutral',
  className,
}: GlitchBadgeProps) {
  return (
    <span
      className={['glitch-badge', `glitch-badge--${tone}`, `glitch-layer-${layerState}`, className]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </span>
  );
}

export default GlitchBadge;
