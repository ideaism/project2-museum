import type { LayerState } from './archive';
import type {
  ExternalPourInput,
  PourContentTransitionState,
  PourInputSource,
  PourInputStatus,
  PourInteractionOutput,
  PourMappingInput,
  UsePourInteractionOptions,
} from './pour';

export type {
  ExternalPourInput,
  PourContentTransitionState,
  PourInputSource,
  PourInputStatus,
  PourInteractionOutput,
  PourMappingInput,
  UsePourInteractionOptions,
} from './pour';

export type TiltPermissionState = 'prompt' | 'granted' | 'denied' | 'unavailable';

export interface DeviceTiltState {
  pourValue: number;
  layerState: LayerState;
  permissionState: TiltPermissionState;
  requestPermission: () => Promise<TiltPermissionState>;
  isSupported: boolean;
  setManualPourValue: (value: number) => void;
  setPourValueFromSource: (value: number, source: PourInputSource) => void;
  inputSource: PourInputSource;
}

export interface PourInteractionState extends DeviceTiltState, PourInteractionOutput {
  contentTransitionState: PourContentTransitionState;
  mugRotationDeg: number;
  soundIntensity: number;
  inputStatus: PourInputStatus;
  confidence?: number;
  gestureConfidence?: number;
  inputConfidence?: number;
  externalInput?: ExternalPourInput;
  setSliderPourValue: (value: number) => void;
  setKeyboardPourValue: (value: number) => void;
  setManualPourValue: (value: number) => void;
  setLayerState: (layer: LayerState) => void;
  setExternalPourInput: (input?: ExternalPourInput | null) => void;
}
