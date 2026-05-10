import type { LayerState } from '../types/archive';
import type { PourMappingInput } from '../types/interaction';

const DEFAULT_DEAD_ZONE_DEGREES = 6;
const DEFAULT_FULL_POUR_DEGREES = 72;

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
