import { useEffect, useMemo, useRef, useState } from 'react';
import type { LayerState } from '../types/archive';

type AudioPathMap = Partial<Record<LayerState, string>>;
type AudioElementMap = Partial<Record<LayerState, HTMLAudioElement>>;

interface SoundManagerProps {
  layerState: LayerState;
  audioPaths: AudioPathMap;
  className?: string;
}

const layerLabels: Record<LayerState, string> = {
  surface: 'Surface',
  middle: 'Middle',
  core: 'Core',
};

const fadeMs = 650;

function SoundManager({ layerState, audioPaths, className }: SoundManagerProps) {
  const audioRefs = useRef<AudioElementMap>({});
  const fadeRef = useRef<number | null>(null);
  const [isEnabled, setIsEnabled] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [status, setStatus] = useState(
    'Audio waits for visitor interaction. Projection remains usable silently.',
  );

  const hasAudio = useMemo(() => Object.values(audioPaths).some(Boolean), [audioPaths]);

  useEffect(() => {
    return () => {
      if (fadeRef.current !== null) {
        window.cancelAnimationFrame(fadeRef.current);
      }

      Object.values(audioRefs.current).forEach((audio) => {
        if (audio) {
          audio.pause();
          audio.src = '';
        }
      });
      audioRefs.current = {};
    };
  }, []);

  useEffect(() => {
    if (!isEnabled) {
      return;
    }

    syncLayerAudio(layerState, isMuted);
  }, [isEnabled, isMuted, layerState]);

  function ensureAudioElements() {
    (Object.entries(audioPaths) as Array<[LayerState, string | undefined]>).forEach(([layer, path]) => {
      if (!path || audioRefs.current[layer]) {
        return;
      }

      const audio = new Audio(path);
      audio.loop = true;
      audio.preload = 'metadata';
      audio.volume = 0;
      audioRefs.current[layer] = audio;
    });
  }

  function fadeVolumes(targetLayer: LayerState, muted: boolean) {
    if (fadeRef.current !== null) {
      window.cancelAnimationFrame(fadeRef.current);
    }

    const startedAt = performance.now();
    const initialVolumes = new Map<HTMLAudioElement, number>();

    Object.values(audioRefs.current).forEach((audio) => {
      if (audio) {
        initialVolumes.set(audio, audio.volume);
      }
    });

    const step = (time: number) => {
      const progress = Math.min(1, (time - startedAt) / fadeMs);

      (Object.entries(audioRefs.current) as Array<[LayerState, HTMLAudioElement | undefined]>).forEach(
        ([layer, audio]) => {
          if (!audio) {
            return;
          }

          const targetVolume = !muted && layer === targetLayer ? 0.78 : 0;
          const initialVolume = initialVolumes.get(audio) ?? 0;
          audio.volume = initialVolume + (targetVolume - initialVolume) * progress;

          if (progress === 1 && targetVolume === 0) {
            audio.pause();
            audio.currentTime = 0;
          }
        },
      );

      if (progress < 1) {
        fadeRef.current = window.requestAnimationFrame(step);
      }
    };

    fadeRef.current = window.requestAnimationFrame(step);
  }

  function syncLayerAudio(targetLayer: LayerState, muted: boolean) {
    const targetAudio = audioRefs.current[targetLayer];

    if (!targetAudio) {
      setStatus(
        `No ${layerLabels[targetLayer].toLowerCase()} archive audio path is available. Projection remains usable silently.`,
      );
      fadeVolumes(targetLayer, true);
      return;
    }

    if (!muted && targetAudio.paused) {
      void targetAudio.play().catch(() => {
        setStatus(
          'Audio could not start or the archive audio file is missing. Use the visual layer controls instead.',
        );
      });
    }

    setStatus(
      muted
        ? 'Sound wall muted.'
        : `${layerLabels[targetLayer]} audio layer active. Sound remains local to this device.`,
    );
    fadeVolumes(targetLayer, muted);
  }

  function handleStart() {
    ensureAudioElements();
    setIsEnabled(true);
    setIsMuted(false);
    syncLayerAudio(layerState, false);
  }

  function handleToggleMute() {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    syncLayerAudio(layerState, nextMuted);
  }

  return (
    <section className={['sound-manager', className].filter(Boolean).join(' ')} aria-label="Layer audio">
      <div>
        <p className="eyebrow">Sound wall</p>
        <h2>Layer-reactive audio</h2>
        <p>{status}</p>
        <p className="sound-manager__asset-note">
          Optional path: <code>{audioPaths[layerState] ?? 'not supplied'}</code>
        </p>
      </div>

      <div className="sound-manager__controls">
        <button type="button" onClick={handleStart} disabled={!hasAudio || isEnabled}>
          {isEnabled ? 'Audio armed' : 'Start audio'}
        </button>
        <button type="button" onClick={handleToggleMute} disabled={!isEnabled}>
          {isMuted ? 'Unmute' : 'Mute'}
        </button>
      </div>
    </section>
  );
}

export default SoundManager;
