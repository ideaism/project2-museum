import type { LayerState } from './archive';
import type { ExternalPourInput, PourInputStatus } from './interaction';

export type GesturePourStatus = Extract<
  PourInputStatus,
  | 'idle'
  | 'permissionNeeded'
  | 'cameraStarting'
  | 'loadingModel'
  | 'calibrating'
  | 'tracking'
  | 'searching'
  | 'lowConfidence'
  | 'failed'
  | 'unavailable'
  | 'manualFallback'
>;

export interface GestureLandmark {
  x: number;
  y: number;
  z?: number;
  visibility?: number;
}

export interface GesturePourCalibration {
  neutralAngleRad?: number;
  coreAngleRad?: number;
}

export interface GesturePourMappingInput {
  landmarks: GestureLandmark[];
  handednessScore?: number;
  calibration?: GesturePourCalibration;
}

export interface GesturePourMappingResult {
  pourValue: number;
  layerState: LayerState;
  confidence: number;
  isHandDetected: boolean;
  inputSource: 'gesture';
  angleRad: number;
  angleDeltaRad: number;
  landmarkCount: number;
}

export interface GesturePourOutput {
  pourValue: number;
  layerState: LayerState;
  confidence: number;
  isHandDetected: boolean;
  inputSource: 'gesture';
}

export interface GesturePourState extends GesturePourOutput {
  status: GesturePourStatus;
  externalInput: ExternalPourInput;
  rotationDegrees: number;
  error: string | null;
  calibration: Required<GesturePourCalibration>;
  debug: {
    landmarkCount: number;
    rawAngleDegrees: number;
    neutralAngleDegrees: number;
    coreAngleDegrees: number;
    mappedPourValue: number;
    confidence: number;
  };
}
