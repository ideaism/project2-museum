import { useLayerSound, type LayerAudioPaths } from '../hooks/useLayerSound';
import type { LayerState } from '../types/archive';
import type { PourInputStatus } from '../types/interaction';

interface SoundManagerProps {
  layerState: LayerState;
  audioPaths: LayerAudioPaths;
  pourValue?: number;
  inputStatus?: PourInputStatus;
  inputConfidence?: number;
  className?: string;
}

function SoundManager({
  layerState,
  audioPaths,
  pourValue = 0,
  inputStatus = 'manualFallback',
  inputConfidence,
  className,
}: SoundManagerProps) {
  const {
    caption,
    hasGeneratedFallback,
    isEnabled,
    isMuted,
    start,
    status,
    toggleMute,
  } = useLayerSound({ layerState, audioPaths, pourValue, inputStatus, inputConfidence });

  return (
    <section
      className={['sound-manager', `sound-manager--${layerState}`, className]
        .filter(Boolean)
        .join(' ')}
      data-input-status={inputStatus}
      aria-label="Layer audio"
    >
      <div>
        <p className="eyebrow">Sound wall</p>
        <h2>Layer-reactive audio</h2>
        <p>{status}</p>
        <p className="sound-manager__caption">
          Written sound cue: <span>{caption}</span>
        </p>
        {hasGeneratedFallback ? (
          <p className="sound-manager__asset-note">
            A quiet fallback texture is active. The archive remains readable with sound muted.
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
