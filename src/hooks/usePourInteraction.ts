import { useCallback, useMemo } from 'react';
import type { LayerState } from '../types/archive';
import type { PourContentTransitionState, PourInteractionState } from '../types/interaction';
import { clampPourValue } from '../utils/pourMapping';
import { useDeviceTilt } from './useDeviceTilt';

const layerPourValues: Record<LayerState, number> = {
  surface: 0,
  middle: 0.5,
  core: 0.86,
};

function getMugRotationDeg(pourValue: number) {
  return Math.round(clampPourValue(pourValue) * 112);
}

function getTransitionState(pourValue: number): PourContentTransitionState {
  const normalized = clampPourValue(pourValue);

  if (normalized >= 0.67) {
    return 'spilling';
  }

  if (normalized > 0.08) {
    return 'transitioning';
  }

  return 'settled';
}

export function usePourInteraction(initialPourValue = 0): PourInteractionState {
  const tilt = useDeviceTilt(initialPourValue);

  const setLayerState = useCallback(
    (layer: LayerState) => {
      tilt.setManualPourValue(layerPourValues[layer]);
    },
    [tilt.setManualPourValue],
  );

  return useMemo(
    () => ({
      ...tilt,
      contentTransitionState: getTransitionState(tilt.pourValue),
      mugRotationDeg: getMugRotationDeg(tilt.pourValue),
      soundIntensity: clampPourValue(tilt.pourValue),
      setLayerState,
    }),
    [setLayerState, tilt],
  );
}
