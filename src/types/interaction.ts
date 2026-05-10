import type { LayerState } from './archive';

export type TiltPermissionState = 'prompt' | 'granted' | 'denied' | 'unavailable';

export type PourInputSource = 'sensor' | 'manual';

export interface PourMappingInput {
  beta: number | null;
  gamma: number | null;
  deadZoneDegrees?: number;
  fullPourDegrees?: number;
}

export interface DeviceTiltState {
  pourValue: number;
  layerState: LayerState;
  permissionState: TiltPermissionState;
  requestPermission: () => Promise<TiltPermissionState>;
  isSupported: boolean;
  setManualPourValue: (value: number) => void;
  inputSource: PourInputSource;
}
