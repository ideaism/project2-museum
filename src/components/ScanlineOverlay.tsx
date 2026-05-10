import type { LayerState } from '../types/archive';

interface ScanlineOverlayProps {
  layerState?: LayerState;
  active?: boolean;
  className?: string;
}

function ScanlineOverlay({ layerState = 'surface', active = true, className }: ScanlineOverlayProps) {
  if (!active) {
    return null;
  }

  return (
    <span
      className={['scanline-overlay', `scanline-overlay--${layerState}`, className]
        .filter(Boolean)
        .join(' ')}
      aria-hidden="true"
    />
  );
}

export default ScanlineOverlay;
