import type { LayerState } from './archive';

export type PourLayerState = LayerState;

export type PourInputSource = 'slider' | 'keyboard' | 'device-tilt' | 'gesture';

export type PourInputStatus =
  | 'idle'
  | 'manualFallback'
  | 'permissionNeeded'
  | 'calibrating'
  | 'cameraStarting'
  | 'loadingModel'
  | 'tracking'
  | 'searching'
  | 'lowConfidence'
  | 'failed'
  | 'unavailable';

export type PourContentTransitionState = 'settled' | 'transitioning' | 'spilling';

export interface PourInteractionOutput {
  pourValue: number;
  layerState: PourLayerState;
  inputSource: PourInputSource;
  confidence?: number;
}

export interface ExternalPourInput {
  source: Extract<PourInputSource, 'device-tilt' | 'gesture'>;
  pourValue?: number;
  confidence?: number;
  status?: PourInputStatus;
  isActive?: boolean;
}

export interface UsePourInteractionOptions {
  externalInput?: ExternalPourInput | null;
  gesturePourValue?: number | null;
  gestureConfidence?: number;
  gestureStatus?: PourInputStatus;
}

export interface PourMappingInput {
  beta: number | null;
  gamma: number | null;
  deadZoneDegrees?: number;
  fullPourDegrees?: number;
}

