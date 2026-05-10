import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { layerSoundCaptions } from '../data/layerAudio';
import type { LayerState } from '../types/archive';
import type { PourInputStatus } from '../types/interaction';

export type LayerAudioPaths = Partial<Record<LayerState, string>>;

interface UseLayerSoundOptions {
  layerState: LayerState;
  audioPaths: LayerAudioPaths;
  pourValue?: number;
  inputStatus?: PourInputStatus;
  inputConfidence?: number;
}

type AudioElementMap = Partial<Record<LayerState, HTMLAudioElement>>;
type GeneratedLayerMap = Partial<Record<LayerState, GainNode>>;
type GeneratedSource = AudioBufferSourceNode | OscillatorNode;

const layers: LayerState[] = ['surface', 'middle', 'core'];

const layerLabels: Record<LayerState, string> = {
  surface: 'Surface',
  middle: 'Middle',
  core: 'Core',
};

const generatedBaseGain: Record<LayerState, number> = {
  surface: 0.12,
  middle: 0.16,
  core: 0.2,
};

function clamp(value: number) {
  return Math.min(1, Math.max(0, value));
}

function createNoiseSource(context: AudioContext) {
  const buffer = context.createBuffer(1, context.sampleRate * 2, context.sampleRate);
  const data = buffer.getChannelData(0);

  for (let index = 0; index < data.length; index += 1) {
    data[index] = Math.random() * 2 - 1;
  }

  const source = context.createBufferSource();
  source.buffer = buffer;
  source.loop = true;
  return source;
}

function connectNoiseLayer(
  context: AudioContext,
  destination: AudioNode,
  layer: LayerState,
  sources: GeneratedSource[],
) {
  const source = createNoiseSource(context);
  const filter = context.createBiquadFilter();
  const gain = context.createGain();

  if (layer === 'surface') {
    filter.type = 'lowpass';
    filter.frequency.value = 760;
    gain.gain.value = 0.42;
  } else if (layer === 'middle') {
    filter.type = 'bandpass';
    filter.frequency.value = 1180;
    filter.Q.value = 0.85;
    gain.gain.value = 0.35;
  } else {
    filter.type = 'highpass';
    filter.frequency.value = 1720;
    gain.gain.value = 0.5;
  }

  source.connect(filter);
  filter.connect(gain);
  gain.connect(destination);
  source.start();
  sources.push(source);
}

function connectToneLayer(
  context: AudioContext,
  destination: AudioNode,
  layer: LayerState,
  sources: GeneratedSource[],
) {
  const oscillator = context.createOscillator();
  const gain = context.createGain();

  if (layer === 'surface') {
    oscillator.type = 'sine';
    oscillator.frequency.value = 392;
    gain.gain.value = 0.08;
  } else if (layer === 'middle') {
    oscillator.type = 'sawtooth';
    oscillator.frequency.value = 74;
    gain.gain.value = 0.06;
  } else {
    oscillator.type = 'square';
    oscillator.frequency.value = 31;
    gain.gain.value = 0.045;
  }

  oscillator.connect(gain);
  gain.connect(destination);
  oscillator.start();
  sources.push(oscillator);
}

function canUseWebAudio() {
  return typeof window !== 'undefined' && 'AudioContext' in window;
}

function getInputSoundScale(inputStatus: PourInputStatus, inputConfidence?: number) {
  const confidence = typeof inputConfidence === 'number' ? clamp(inputConfidence) : 1;

  if (inputStatus === 'tracking') {
    return 0.78 + confidence * 0.34;
  }

  if (inputStatus === 'lowConfidence' || inputStatus === 'searching') {
    return 0.38;
  }

  if (
    inputStatus === 'permissionNeeded' ||
    inputStatus === 'calibrating' ||
    inputStatus === 'cameraStarting' ||
    inputStatus === 'loadingModel'
  ) {
    return 0.42;
  }

  if (inputStatus === 'manualFallback') {
    return 0.66;
  }

  if (inputStatus === 'failed' || inputStatus === 'unavailable' || inputStatus === 'idle') {
    return 0.22;
  }

  return 0.5;
}

function getInputSoundNote(inputStatus: PourInputStatus, inputConfidence?: number) {
  const confidenceText =
    typeof inputConfidence === 'number'
      ? ` Gesture confidence ${Math.round(clamp(inputConfidence) * 100)}%.`
      : '';

  if (inputStatus === 'tracking') {
    return `Gesture pour is tracking; the information-flow sound follows the current layer intensity.${confidenceText}`;
  }

  if (inputStatus === 'lowConfidence') {
    return `Gesture confidence is low, so the sound texture is damped.${confidenceText}`;
  }

  if (inputStatus === 'manualFallback') {
    return 'Manual fallback is active; sound remains optional and follows the visible information flow.';
  }

  if (inputStatus === 'permissionNeeded') {
    return 'Gesture permission is needed; the archive remains readable and silent controls stay available.';
  }

  if (inputStatus === 'calibrating' || inputStatus === 'cameraStarting' || inputStatus === 'loadingModel') {
    return 'Gesture input is preparing; sound is held back until tracking stabilizes.';
  }

  if (inputStatus === 'searching') {
    return 'Gesture input is searching; sound is damped while manual controls remain available.';
  }

  if (inputStatus === 'failed' || inputStatus === 'unavailable') {
    return 'Gesture input is unavailable; sound can still be used with manual or tilt controls.';
  }

  return 'Sound remains optional and captioned.';
}

export function useLayerSound({
  layerState,
  audioPaths,
  pourValue = 0,
  inputStatus = 'manualFallback',
  inputConfidence,
}: UseLayerSoundOptions) {
  const audioRefs = useRef<AudioElementMap>({});
  const audioFadeRef = useRef<number | null>(null);
  const contextRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const generatedGainsRef = useRef<GeneratedLayerMap>({});
  const generatedSourcesRef = useRef<GeneratedSource[]>([]);
  const [isEnabled, setIsEnabled] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [hasFilePlayback, setHasFilePlayback] = useState(false);
  const [hasGeneratedFallback, setHasGeneratedFallback] = useState(false);
  const [status, setStatus] = useState(
    'Audio waits for visitor interaction. Projection remains usable silently.',
  );

  const activePath = audioPaths[layerState];
  const caption = layerSoundCaptions[layerState];
  const intensity = useMemo(
    () =>
      (0.18 + Math.pow(clamp(pourValue), 0.72) * 0.9) *
      getInputSoundScale(inputStatus, inputConfidence),
    [inputConfidence, inputStatus, pourValue],
  );
  const inputSoundNote = useMemo(
    () => getInputSoundNote(inputStatus, inputConfidence),
    [inputConfidence, inputStatus],
  );

  const stopAudioFade = useCallback(() => {
    if (audioFadeRef.current !== null) {
      window.cancelAnimationFrame(audioFadeRef.current);
      audioFadeRef.current = null;
    }
  }, []);

  const ensureAudioElements = useCallback(async () => {
    await Promise.all(
      layers.map(async (layer) => {
        const path = audioPaths[layer];

        if (!path || audioRefs.current[layer]) {
          return;
        }

        try {
          const response = await fetch(path, { method: 'HEAD', cache: 'no-store' });

          if (!response.ok) {
            setStatus('A quiet fallback sound texture is active.');
            return;
          }
        } catch {
          setStatus('A quiet fallback sound texture is active.');
          return;
        }

        const audio = new Audio(path);
        audio.loop = true;
        audio.preload = 'metadata';
        audio.volume = 0;
        audio.addEventListener('error', () => {
          setStatus('A quiet fallback sound texture is active.');
        });
        audioRefs.current[layer] = audio;
      }),
    );
  }, [audioPaths]);

  const ensureGeneratedFallback = useCallback(() => {
    if (contextRef.current || !canUseWebAudio()) {
      return;
    }

    const context = new AudioContext();
    const masterGain = context.createGain();
    masterGain.gain.value = 0;
    masterGain.connect(context.destination);

    layers.forEach((layer) => {
      const layerGain = context.createGain();
      layerGain.gain.value = 0;
      layerGain.connect(masterGain);
      generatedGainsRef.current[layer] = layerGain;
      connectNoiseLayer(context, layerGain, layer, generatedSourcesRef.current);
      connectToneLayer(context, layerGain, layer, generatedSourcesRef.current);
    });

    contextRef.current = context;
    masterGainRef.current = masterGain;
    setHasGeneratedFallback(true);
  }, []);

  const fadeAudioElements = useCallback(
    (targetLayer: LayerState, muted: boolean, nextIntensity: number) => {
      stopAudioFade();

      const startedAt = performance.now();
      const fadeMs = 650;
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

            const targetVolume = !muted && layer === targetLayer ? 0.74 * nextIntensity : 0;
            const initialVolume = initialVolumes.get(audio) ?? 0;
            audio.volume = initialVolume + (targetVolume - initialVolume) * progress;

            if (progress === 1 && targetVolume === 0) {
              audio.pause();
              audio.currentTime = 0;
            }
          },
        );

        if (progress < 1) {
          audioFadeRef.current = window.requestAnimationFrame(step);
        }
      };

      audioFadeRef.current = window.requestAnimationFrame(step);
    },
    [stopAudioFade],
  );

  const syncSound = useCallback(
    (targetLayer: LayerState, muted: boolean, nextIntensity: number) => {
      const context = contextRef.current;
      const masterGain = masterGainRef.current;
      const targetAudio = audioRefs.current[targetLayer];

      if (context && masterGain) {
        if (context.state === 'suspended') {
          void context.resume();
        }

        masterGain.gain.setTargetAtTime(muted ? 0 : 0.78, context.currentTime, 0.08);
        layers.forEach((layer) => {
          const layerGain = generatedGainsRef.current[layer];
          if (!layerGain) {
            return;
          }

          const targetGain =
            !muted && layer === targetLayer ? generatedBaseGain[layer] * nextIntensity : 0;
          layerGain.gain.setTargetAtTime(targetGain, context.currentTime, 0.12);
        });
      }

      if (targetAudio && !muted && targetAudio.paused) {
        void targetAudio
          .play()
          .then(() => {
            setHasFilePlayback(true);
          })
          .catch(() => {
            setStatus('Archive audio could not start; generated tactile fallback is active.');
          });
      }

      fadeAudioElements(targetLayer, muted, nextIntensity);

      if (muted) {
        setStatus('Sound wall muted. Visual layers remain active.');
      } else if (targetAudio && hasFilePlayback) {
        setStatus(
          `${layerLabels[targetLayer]} audio file and generated texture are active. ${inputSoundNote}`,
        );
      } else if (context) {
        setStatus(`${layerLabels[targetLayer]} generated sound texture is active. ${inputSoundNote}`);
      } else {
        setStatus('Web Audio is unavailable. Use the visual layer controls silently.');
      }
    },
    [fadeAudioElements, hasFilePlayback, inputSoundNote],
  );

  const start = useCallback(() => {
    ensureGeneratedFallback();
    setIsEnabled(true);
    setIsMuted(false);
    void ensureAudioElements().then(() => {
      syncSound(layerState, false, intensity);
    });
  }, [ensureAudioElements, ensureGeneratedFallback, intensity, layerState, syncSound]);

  const toggleMute = useCallback(() => {
    setIsMuted((current) => !current);
  }, []);

  useEffect(() => {
    if (!isEnabled) {
      return;
    }

    syncSound(layerState, isMuted, intensity);
  }, [intensity, isEnabled, isMuted, layerState, syncSound]);

  useEffect(() => {
    return () => {
      stopAudioFade();
      Object.values(audioRefs.current).forEach((audio) => {
        if (audio) {
          audio.pause();
          audio.src = '';
        }
      });
      generatedSourcesRef.current.forEach((source) => {
        try {
          source.stop();
        } catch {
          // Source may already be stopped by the browser.
        }
      });
      void contextRef.current?.close();
    };
  }, [stopAudioFade]);

  return {
    activePath,
    caption,
    hasGeneratedFallback,
    isEnabled,
    isMuted,
    start,
    status,
    toggleMute,
  };
}
