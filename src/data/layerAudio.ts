import type { LayerState } from '../types/archive';

export const layerAudioPaths: Record<LayerState, string> = {
  surface: '/assets/archive/audio/projection-surface.mp3',
  middle: '/assets/archive/audio/projection-middle.mp3',
  core: '/assets/archive/audio/projection-core.mp3',
};

export const layerSoundCaptions: Record<LayerState, string> = {
  surface: 'Low ceramic clink, shelf room tone, and handled archive quiet.',
  middle: 'Radio tuning, crowd murmur, and a slow route rhythm under the readings.',
  core: 'Static, distortion, and broken redaction fragments held below speech level.',
};
