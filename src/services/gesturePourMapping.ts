import type {
  GestureLandmark,
  GesturePourCalibration,
  GesturePourMappingInput,
  GesturePourMappingResult,
} from '../types/gesture';
import { clampPourValue, mapPourValueToLayerState } from '../utils/pourMapping';

const WRIST = 0;
const INDEX_MCP = 5;
const MIDDLE_MCP = 9;
const PINKY_MCP = 17;
const DEFAULT_FULL_POUR_RAD = (95 * Math.PI) / 180;
const MIN_PALM_SPAN = 0.05;
const DEFAULT_CALIBRATION: Required<GesturePourCalibration> = {
  neutralAngleRad: 0,
  coreAngleRad: DEFAULT_FULL_POUR_RAD,
};

function getLandmark(landmarks: GestureLandmark[], index: number) {
  return landmarks[index];
}

function hasFinitePoint(landmark: GestureLandmark | undefined) {
  return Boolean(
    landmark &&
      Number.isFinite(landmark.x) &&
      Number.isFinite(landmark.y) &&
      (landmark.z === undefined || Number.isFinite(landmark.z)),
  );
}

function distance(a: GestureLandmark, b: GestureLandmark) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function shortestAngleDelta(angleRad: number, baselineRad: number) {
  return Math.atan2(Math.sin(angleRad - baselineRad), Math.cos(angleRad - baselineRad));
}

function getPalmAxisAngleRad(landmarks: GestureLandmark[]) {
  const indexMcp = getLandmark(landmarks, INDEX_MCP);
  const pinkyMcp = getLandmark(landmarks, PINKY_MCP);

  if (!indexMcp || !pinkyMcp) {
    return 0;
  }

  return Math.atan2(pinkyMcp.y - indexMcp.y, pinkyMcp.x - indexMcp.x);
}

function getLandmarkVisibilityConfidence(landmarks: GestureLandmark[]) {
  const tracked = [WRIST, INDEX_MCP, MIDDLE_MCP, PINKY_MCP]
    .map((index) => getLandmark(landmarks, index))
    .filter(Boolean);

  if (tracked.length < 4) {
    return 0;
  }

  const visibilityValues = tracked
    .map((landmark) => landmark.visibility)
    .filter(
      (visibility): visibility is number =>
        Number.isFinite(visibility) && Number(visibility) > 0.01,
    );

  if (visibilityValues.length === 0) {
    return 0.86;
  }

  return clampPourValue(
    visibilityValues.reduce((total, visibility) => total + visibility, 0) /
      visibilityValues.length,
  );
}

function getPalmGeometryConfidence(landmarks: GestureLandmark[]) {
  const wrist = getLandmark(landmarks, WRIST);
  const indexMcp = getLandmark(landmarks, INDEX_MCP);
  const middleMcp = getLandmark(landmarks, MIDDLE_MCP);
  const pinkyMcp = getLandmark(landmarks, PINKY_MCP);

  if (!wrist || !indexMcp || !middleMcp || !pinkyMcp) {
    return 0;
  }

  const palmSpan = distance(indexMcp, pinkyMcp);
  const wristToMiddle = distance(wrist, middleMcp);
  const sizeConfidence = clampPourValue((palmSpan - MIN_PALM_SPAN) / 0.12);
  const shapeConfidence = clampPourValue(wristToMiddle / Math.max(palmSpan, 0.001));

  return Math.min(1, 0.35 + sizeConfidence * 0.45 + shapeConfidence * 0.2);
}

export function getGesturePourCalibration(
  calibration?: GesturePourCalibration,
): Required<GesturePourCalibration> {
  return {
    neutralAngleRad: calibration?.neutralAngleRad ?? DEFAULT_CALIBRATION.neutralAngleRad,
    coreAngleRad: calibration?.coreAngleRad ?? DEFAULT_CALIBRATION.coreAngleRad,
  };
}

export function estimateGesturePour({
  landmarks,
  handednessScore = 0.8,
  calibration,
}: GesturePourMappingInput): GesturePourMappingResult {
  const activeCalibration = getGesturePourCalibration(calibration);
  const landmarkCount = landmarks.filter(hasFinitePoint).length;
  const hasRequiredLandmarks = Boolean(
    hasFinitePoint(getLandmark(landmarks, WRIST)) &&
      hasFinitePoint(getLandmark(landmarks, INDEX_MCP)) &&
      hasFinitePoint(getLandmark(landmarks, MIDDLE_MCP)) &&
      hasFinitePoint(getLandmark(landmarks, PINKY_MCP)),
  );

  if (!hasRequiredLandmarks) {
    return {
      pourValue: 0,
      layerState: 'surface',
      confidence: 0,
      isHandDetected: false,
      inputSource: 'gesture',
      angleRad: activeCalibration.neutralAngleRad,
      angleDeltaRad: 0,
      landmarkCount,
    };
  }

  const angleRad = getPalmAxisAngleRad(landmarks);
  const angleDeltaRad = shortestAngleDelta(angleRad, activeCalibration.neutralAngleRad);
  const coreDeltaRad = shortestAngleDelta(
    activeCalibration.coreAngleRad,
    activeCalibration.neutralAngleRad,
  );
  const hasCalibratedCore =
    calibration?.coreAngleRad !== undefined && Math.abs(coreDeltaRad) > 0.2;
  const pourValue = hasCalibratedCore
    ? clampPourValue(angleDeltaRad / coreDeltaRad)
    : clampPourValue(Math.abs(angleDeltaRad) / DEFAULT_FULL_POUR_RAD);
  const confidence = Math.min(
    getLandmarkVisibilityConfidence(landmarks),
    getPalmGeometryConfidence(landmarks),
    clampPourValue(handednessScore),
  );

  return {
    pourValue,
    layerState: mapPourValueToLayerState(pourValue),
    confidence,
    isHandDetected: true,
    inputSource: 'gesture',
    angleRad,
    angleDeltaRad,
    landmarkCount,
  };
}

export function radiansToDegrees(value: number) {
  return Math.round((value * 180) / Math.PI);
}
