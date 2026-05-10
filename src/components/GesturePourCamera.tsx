import { useEffect, useRef, type CSSProperties } from 'react';
import { useGesturePour } from '../hooks/useGesturePour';
import type { ExternalPourInput } from '../types/interaction';
import type { GesturePourStatus } from '../types/gesture';
import '../styles/gesture-pour.css';

const statusLabels = {
  idle: 'Gesture input idle',
  permissionNeeded: 'Camera permission needed',
  cameraStarting: 'Starting camera',
  loadingModel: 'Loading hand tracking model',
  calibrating: 'Calibrating gesture',
  tracking: 'Hand detected',
  searching: 'Searching for hand',
  lowConfidence: 'Hand detected, low confidence',
  failed: 'Gesture input failed',
  unavailable: 'Camera unavailable',
  manualFallback: 'Manual fallback active',
} as const;

export interface GesturePourCameraSnapshot extends ExternalPourInput {
  source: 'gesture';
  status: GesturePourStatus;
  isCameraActive: boolean;
  errorMessage?: string;
}

interface GesturePourCameraProps {
  onGesturePour?: (input: ExternalPourInput) => void;
  onGestureStatusChange?: (snapshot: GesturePourCameraSnapshot) => void;
  className?: string;
}

function GesturePourCamera({
  onGesturePour,
  onGestureStatusChange,
  className,
}: GesturePourCameraProps) {
  const gesture = useGesturePour();
  const callbacksRef = useRef({ onGesturePour, onGestureStatusChange });
  const lastSnapshotKeyRef = useRef('');
  const percentage = Math.round(gesture.pourValue * 100);
  const confidencePercentage = Math.round(gesture.confidence * 100);

  useEffect(() => {
    callbacksRef.current = { onGesturePour, onGestureStatusChange };
  }, [onGesturePour, onGestureStatusChange]);

  useEffect(() => {
    const snapshot: GesturePourCameraSnapshot = {
      ...gesture.externalInput,
      source: 'gesture',
      status: gesture.status,
      confidence: gesture.confidence,
      isCameraActive: gesture.cameraStatus === 'active',
      errorMessage: gesture.error ?? undefined,
    };
    const snapshotKey = [
      snapshot.status,
      snapshot.confidence,
      snapshot.pourValue,
      snapshot.isCameraActive,
      snapshot.errorMessage,
    ].join(':');

    if (snapshotKey === lastSnapshotKeyRef.current) {
      return;
    }

    lastSnapshotKeyRef.current = snapshotKey;
    callbacksRef.current.onGestureStatusChange?.(snapshot);

    if (gesture.isHandDetected && gesture.confidence > 0) {
      callbacksRef.current.onGesturePour?.(gesture.externalInput);
    }
  }, [
    gesture.cameraStatus,
    gesture.confidence,
    gesture.error,
    gesture.externalInput,
    gesture.isHandDetected,
    gesture.status,
  ]);

  return (
    <section
      className={['gesture-pour', className].filter(Boolean).join(' ')}
      data-status={gesture.status}
      style={
        {
          '--pour-value': String(gesture.pourValue),
          '--gesture-confidence': String(gesture.confidence),
        } as CSSProperties
      }
      aria-labelledby="gesture-pour-title"
    >
      <div className="gesture-pour__header">
        <div>
          <p className="eyebrow">Gesture pour input</p>
          <h2 id="gesture-pour-title">Camera hand tracking</h2>
        </div>
        <span className="layer-label">{gesture.layerState}</span>
      </div>

      <p className="gesture-pour__instruction">
        Hold your hand as if holding the mug. Rotate slowly to pour the archive.
      </p>

      <div className="gesture-pour__stage">
        <div className="gesture-pour__preview">
          <video ref={gesture.videoRef} muted playsInline aria-label="Live gesture camera preview" />
          {gesture.cameraStatus !== 'active' ? (
            <div className="gesture-pour__placeholder" aria-hidden="true">
              <span />
            </div>
          ) : null}
          <div className="gesture-pour__tracking" aria-live="polite">
            {statusLabels[gesture.status]}
          </div>
        </div>

        <div className="gesture-pour__panel">
          <div className="gesture-pour__readout" aria-live="polite">
            <strong>{gesture.isHandDetected ? 'Hand detected' : 'Searching for hand'}</strong>
            <span>Gesture pour {percentage}%</span>
            <span>Confidence {confidencePercentage}%</span>
            <span>Estimated rotation {gesture.rotationDegrees}deg</span>
            <span>
              Landmarks {gesture.debug.landmarkCount} · raw {gesture.debug.rawAngleDegrees}deg ·
              neutral {gesture.debug.neutralAngleDegrees}deg · full pour{' '}
              {gesture.debug.coreAngleDegrees}deg
            </span>
          </div>

          <div className="action-row">
            <button
              className="button-link primary"
              type="button"
              onClick={() => {
                void gesture.startCamera();
              }}
              disabled={
                gesture.cameraStatus === 'starting' ||
                gesture.modelStatus === 'loading' ||
                gesture.status === 'unavailable'
              }
            >
              {gesture.cameraStatus === 'active' ? 'Restart camera' : 'Start gesture camera'}
            </button>
            <button
              className="button-link"
              type="button"
              onClick={gesture.stopCamera}
              disabled={gesture.cameraStatus !== 'active'}
            >
              Stop camera
            </button>
          </div>

          <div className="action-row">
            <button
              className="button-link"
              type="button"
              onClick={gesture.calibrateNeutral}
              disabled={!gesture.isHandDetected}
            >
              Set neutral hand
            </button>
            <button
              className="button-link"
              type="button"
              onClick={gesture.calibrateCore}
              disabled={!gesture.isHandDetected}
            >
              Set full pour
            </button>
          </div>

          <p className="gesture-pour__privacy">
            Camera is used locally for gesture input. No video is recorded or uploaded.
          </p>

          {gesture.error ? (
            <aside className="gesture-pour__error" aria-live="polite">
              {gesture.error}
            </aside>
          ) : null}
        </div>
      </div>

    </section>
  );
}

export default GesturePourCamera;
