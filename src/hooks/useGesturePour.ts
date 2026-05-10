import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  FilesetResolver,
  HandLandmarker,
  type NormalizedLandmark,
} from '@mediapipe/tasks-vision';
import type { LayerState } from '../types/archive';
import type {
  GesturePourCalibration,
  GesturePourOutput,
  GesturePourState,
  GesturePourStatus,
} from '../types/gesture';
import { clampPourValue, mapPourValueToLayerState } from '../utils/pourMapping';
import {
  estimateGesturePour,
  getGesturePourCalibration,
  radiansToDegrees,
} from '../services/gesturePourMapping';
import { useCameraStream } from './useCameraStream';

const MEDIAPIPE_VERSION = '0.10.35';
const WASM_BASE_URL = `https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@${MEDIAPIPE_VERSION}/wasm`;
const HAND_MODEL_URL =
  'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/latest/hand_landmarker.task';
const SMOOTHING_ALPHA = 0.24;
const LOW_CONFIDENCE_THRESHOLD = 0.15;

interface GestureDetectionSnapshot extends GesturePourOutput {
  angleRad: number;
  angleDeltaRad: number;
  landmarkCount: number;
}

const emptyDetection: GestureDetectionSnapshot = {
  pourValue: 0,
  layerState: 'surface',
  confidence: 0,
  isHandDetected: false,
  inputSource: 'gesture',
  angleRad: 0,
  angleDeltaRad: 0,
  landmarkCount: 0,
};

function getHandednessScore(handedness: Array<Array<{ score?: number }>> | undefined) {
  const score = handedness?.[0]?.[0]?.score;
  return Number.isFinite(score) ? Number(score) : 0.8;
}

function getStatus({
  cameraStatus,
  canRequestCamera,
  modelStatus,
  isHandDetected,
  confidence,
  error,
}: {
  cameraStatus: ReturnType<typeof useCameraStream>['status'];
  canRequestCamera: boolean;
  modelStatus: 'idle' | 'loading' | 'ready' | 'error';
  isHandDetected: boolean;
  confidence: number;
  error: string | null;
}): GesturePourStatus {
  if (!canRequestCamera) {
    return 'unavailable';
  }

  if (error || cameraStatus === 'error' || modelStatus === 'error') {
    return 'failed';
  }

  if (cameraStatus === 'starting') {
    return 'cameraStarting';
  }

  if (modelStatus === 'loading') {
    return 'loadingModel';
  }

  if (cameraStatus !== 'active') {
    return 'permissionNeeded';
  }

  if (!isHandDetected) {
    return 'searching';
  }

  if (confidence < LOW_CONFIDENCE_THRESHOLD) {
    return 'lowConfidence';
  }

  return 'tracking';
}

export function useGesturePour(): GesturePourState & {
  videoRef: ReturnType<typeof useCameraStream>['videoRef'];
  stream: MediaStream | null;
  startCamera: () => Promise<void>;
  stopCamera: () => void;
  calibrateNeutral: () => void;
  calibrateCore: () => void;
  cameraStatus: ReturnType<typeof useCameraStream>['status'];
  modelStatus: 'idle' | 'loading' | 'ready' | 'error';
} {
  const camera = useCameraStream();
  const landmarkerRef = useRef<HandLandmarker | null>(null);
  const latestAngleRef = useRef(0);
  const smoothedPourValueRef = useRef(0);
  const [modelStatus, setModelStatus] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle');
  const [modelError, setModelError] = useState<string | null>(null);
  const [calibration, setCalibration] = useState<GesturePourCalibration>({});
  const [detection, setDetection] = useState<GestureDetectionSnapshot>(emptyDetection);

  const loadHandLandmarker = useCallback(async () => {
    if (landmarkerRef.current || modelStatus === 'loading') {
      return;
    }

    setModelStatus('loading');
    setModelError(null);

    try {
      const vision = await FilesetResolver.forVisionTasks(WASM_BASE_URL);
      landmarkerRef.current = await HandLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: HAND_MODEL_URL,
          delegate: 'GPU',
        },
        runningMode: 'VIDEO',
        numHands: 1,
        minHandDetectionConfidence: 0.55,
        minHandPresenceConfidence: 0.55,
        minTrackingConfidence: 0.55,
      });
      setModelStatus('ready');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Hand tracking model failed to load.';
      setModelError(message);
      setModelStatus('error');
    }
  }, [modelStatus]);

  const startCamera = useCallback(async () => {
    setDetection(emptyDetection);
    smoothedPourValueRef.current = 0;
    await camera.startCamera();
    await loadHandLandmarker();
  }, [camera, loadHandLandmarker]);

  const stopCamera = useCallback(() => {
    camera.stopCamera();
    setDetection(emptyDetection);
    smoothedPourValueRef.current = 0;
  }, [camera]);

  const calibrateNeutral = useCallback(() => {
    setCalibration((current) => ({
      ...current,
      neutralAngleRad: latestAngleRef.current,
    }));
    smoothedPourValueRef.current = 0;
    setDetection((current) => ({
      ...current,
      pourValue: 0,
      layerState: 'surface',
      angleDeltaRad: 0,
    }));
  }, []);

  const calibrateCore = useCallback(() => {
    setCalibration((current) => ({
      ...current,
      coreAngleRad: latestAngleRef.current,
    }));
  }, []);

  useEffect(() => {
    if (camera.status !== 'active' || modelStatus !== 'ready' || !landmarkerRef.current) {
      return undefined;
    }

    let animationFrame = 0;
    let lastVideoTime = -1;
    let isCancelled = false;

    function detectFrame() {
      const video = camera.videoRef.current;
      const landmarker = landmarkerRef.current;

      if (!isCancelled && video && landmarker && video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
        if (video.currentTime !== lastVideoTime) {
          lastVideoTime = video.currentTime;
          const result = landmarker.detectForVideo(video, performance.now());
          const landmarks = result.landmarks[0] as NormalizedLandmark[] | undefined;

          if (landmarks) {
            const mapped = estimateGesturePour({
              landmarks,
              handednessScore: getHandednessScore(result.handedness),
              calibration,
            });
            latestAngleRef.current = mapped.angleRad;

            if (mapped.isHandDetected && calibration.neutralAngleRad === undefined) {
              setCalibration((current) =>
                current.neutralAngleRad === undefined
                  ? {
                      ...current,
                      neutralAngleRad: mapped.angleRad,
                    }
                  : current,
              );
              smoothedPourValueRef.current = 0;
              setDetection({
                pourValue: 0,
                layerState: 'surface',
                confidence: mapped.confidence,
                isHandDetected: true,
                inputSource: 'gesture',
                angleRad: mapped.angleRad,
                angleDeltaRad: 0,
                landmarkCount: mapped.landmarkCount,
              });
              animationFrame = window.requestAnimationFrame(detectFrame);
              return;
            }

            const smoothedPourValue =
              smoothedPourValueRef.current +
              (mapped.pourValue - smoothedPourValueRef.current) * SMOOTHING_ALPHA;
            smoothedPourValueRef.current = smoothedPourValue;

            setDetection({
              pourValue: clampPourValue(smoothedPourValue),
              layerState: mapPourValueToLayerState(smoothedPourValue),
              confidence: mapped.confidence,
              isHandDetected: mapped.isHandDetected,
              inputSource: 'gesture',
              angleRad: mapped.angleRad,
              angleDeltaRad: mapped.angleDeltaRad,
              landmarkCount: mapped.landmarkCount,
            });
          } else {
            setDetection((current) => ({
              ...current,
              pourValue: 0,
              layerState: 'surface' as LayerState,
              confidence: 0,
              isHandDetected: false,
              inputSource: 'gesture',
              angleRad: 0,
              angleDeltaRad: 0,
              landmarkCount: 0,
            }));
            smoothedPourValueRef.current = 0;
          }
        }
      }

      animationFrame = window.requestAnimationFrame(detectFrame);
    }

    animationFrame = window.requestAnimationFrame(detectFrame);

    return () => {
      isCancelled = true;
      window.cancelAnimationFrame(animationFrame);
    };
  }, [calibration, camera.status, camera.videoRef, modelStatus]);

  useEffect(
    () => () => {
      landmarkerRef.current?.close();
      landmarkerRef.current = null;
    },
    [],
  );

  const error = modelError ?? camera.error?.message ?? null;
  const status = getStatus({
    cameraStatus: camera.status,
    canRequestCamera: camera.support.canRequestCamera,
    modelStatus,
    isHandDetected: detection.isHandDetected,
    confidence: detection.confidence,
    error,
  });
  const activeCalibration = getGesturePourCalibration(calibration);

  return useMemo(
    () => ({
      pourValue: detection.pourValue,
      layerState: detection.layerState,
      confidence: detection.confidence,
      isHandDetected: detection.isHandDetected,
      inputSource: 'gesture',
      status,
      externalInput: {
        source: 'gesture',
        pourValue: detection.pourValue,
        confidence: detection.confidence,
        status,
        isActive: status === 'tracking',
      },
      rotationDegrees: radiansToDegrees(detection.angleDeltaRad),
      error,
      calibration: activeCalibration,
      debug: {
        landmarkCount: detection.landmarkCount,
        rawAngleDegrees: radiansToDegrees(detection.angleRad),
        neutralAngleDegrees: radiansToDegrees(activeCalibration.neutralAngleRad),
        coreAngleDegrees: radiansToDegrees(activeCalibration.coreAngleRad),
        mappedPourValue: detection.pourValue,
        confidence: detection.confidence,
      },
      videoRef: camera.videoRef,
      stream: camera.stream,
      startCamera,
      stopCamera,
      calibrateNeutral,
      calibrateCore,
      cameraStatus: camera.status,
      modelStatus,
    }),
    [
      calibrateCore,
      calibrateNeutral,
      calibration,
      camera.status,
      camera.stream,
      camera.videoRef,
      detection.confidence,
      detection.isHandDetected,
      detection.layerState,
      detection.landmarkCount,
      detection.pourValue,
      detection.angleRad,
      detection.angleDeltaRad,
      error,
      modelStatus,
      startCamera,
      status,
      stopCamera,
    ],
  );
}
