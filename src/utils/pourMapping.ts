import type { LayerState } from '../types/archive';
import type { PourContentTransitionState, PourMappingInput } from '../types/pour';

const DEFAULT_DEAD_ZONE_DEGREES = 4;
const DEFAULT_FULL_POUR_DEGREES = 55;

const layerPourAnchors: Record<LayerState, number> = {
  surface: 0,
  middle: 0.5,
  core: 0.86,
};

export function clampPourValue(value: number) {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.min(1, Math.max(0, value));
}

export function mapPourValueToLayerState(pourValue: number): LayerState {
  const normalized = clampPourValue(pourValue);

  if (normalized <= 0.33) {
    return 'surface';
  }

  if (normalized <= 0.66) {
    return 'middle';
  }

  return 'core';
}

export function getPourValueForLayerState(layer: LayerState) {
  return layerPourAnchors[layer];
}

export function mapPourValueToContentTransitionState(
  pourValue: number,
): PourContentTransitionState {
  const normalized = clampPourValue(pourValue);

  if (normalized >= 0.67) {
    return 'spilling';
  }

  if (normalized > 0.08) {
    return 'transitioning';
  }

  return 'settled';
}

export function mapDeviceOrientationToPourValue({
  beta,
  gamma,
  deadZoneDegrees = DEFAULT_DEAD_ZONE_DEGREES,
  fullPourDegrees = DEFAULT_FULL_POUR_DEGREES,
}: PourMappingInput) {
  const safeBeta = Number.isFinite(beta) ? Number(beta) : 0;
  const safeGamma = Number.isFinite(gamma) ? Number(gamma) : 0;
  const tiltMagnitude = Math.hypot(safeBeta, safeGamma);
  const activeTilt = Math.max(0, tiltMagnitude - deadZoneDegrees);
  const activeRange = Math.max(1, fullPourDegrees - deadZoneDegrees);

  return clampPourValue(activeTilt / activeRange);
}
