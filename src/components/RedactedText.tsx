import type { LayerState } from '../types/archive';

interface RedactedTextProps {
  text: string;
  revealLabel?: string;
  layerState?: LayerState;
  className?: string;
}

function RedactedText({
  text,
  revealLabel = 'Redacted archive text',
  layerState = 'core',
  className,
}: RedactedTextProps) {
  return (
    <span
      className={['redacted-text', `glitch-layer-${layerState}`, className].filter(Boolean).join(' ')}
      aria-label={`${revealLabel}: ${text}`}
    >
      <span aria-hidden="true">{text}</span>
    </span>
  );
}

export default RedactedText;
