import { useLayerSound, type LayerAudioPaths } from '../hooks/useLayerSound';
import type { LayerState } from '../types/archive';

interface SoundManagerProps {
  layerState: LayerState;
  audioPaths: LayerAudioPaths;
  pourValue?: number;
  className?: string;
}

function SoundManager({ layerState, audioPaths, pourValue = 0, className }: SoundManagerProps) {
  const {
    activePath,
    caption,
    hasGeneratedFallback,
    isEnabled,
    isMuted,
    start,
    status,
    toggleMute,
  } = useLayerSound({ layerState, audioPaths, pourValue });

  return (
    <section
      className={['sound-manager', `sound-manager--${layerState}`, className]
        .filter(Boolean)
        .join(' ')}
      aria-label="Layer audio"
    >
      <div>
        <p className="eyebrow">Sound wall</p>
        <h2>Layer-reactive audio</h2>
        <p>{status}</p>
        <p className="sound-manager__caption">
          Written sound cue: <span>{caption}</span>
        </p>
        <p className="sound-manager__asset-note">
          Optional file: <code>{activePath ?? 'not supplied'}</code>
        </p>
        {hasGeneratedFallback ? (
          <p className="sound-manager__asset-note">
            Generated Web Audio fallback is active; no external audio is required.
          </p>
        ) : null}
      </div>

      <div className="sound-manager__controls">
        <button type="button" onClick={start} disabled={isEnabled}>
          {isEnabled ? 'Audio armed' : 'Start audio'}
        </button>
        <button type="button" onClick={toggleMute} disabled={!isEnabled}>
          {isMuted ? 'Unmute' : 'Mute'}
        </button>
      </div>
    </section>
  );
}

export default SoundManager;
