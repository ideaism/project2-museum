import type { CSSProperties } from 'react';
import type { DeviceTiltState } from '../types/interaction';

const layerLabels = {
  surface: 'Surface',
  middle: 'Middle',
  core: 'Core',
} as const;

export interface PourGaugeProps {
  tilt: DeviceTiltState;
  label?: string;
  description?: string;
}

function PourGauge({
  tilt,
  label = 'Pour layer control',
  description = 'Tilt the phone as if pouring from the mug, or use the slider fallback.',
}: PourGaugeProps) {
  const percentage = Math.round(tilt.pourValue * 100);
  const updateManualPourValue = (value: string) => {
    tilt.setManualPourValue(Number(value) / 100);
  };
  const showPermissionButton =
    tilt.isSupported &&
    tilt.inputSource !== 'sensor' &&
    (tilt.permissionState === 'prompt' || tilt.permissionState === 'granted');
  const fallbackReason =
    tilt.permissionState === 'denied'
      ? 'Sensor permission was denied. Manual control is active.'
      : tilt.permissionState === 'unavailable'
        ? 'Device orientation is unavailable here. Manual control is active.'
        : tilt.inputSource === 'manual'
          ? 'Manual control is active for preview and keyboard access.'
          : 'Sensor control is active.';

  return (
    <section className="pour-gauge" aria-labelledby="pour-gauge-title">
      <div className="pour-gauge__header">
        <div>
          <p className="eyebrow">Pour interaction</p>
          <h2 id="pour-gauge-title">{label}</h2>
        </div>
        <span className="layer-label">{tilt.layerState}</span>
      </div>

      <p>{description}</p>

      {showPermissionButton ? (
        <button
          className="button-link primary"
          type="button"
          onClick={() => {
            void tilt.requestPermission();
          }}
        >
          {tilt.permissionState === 'prompt' ? 'Enable phone tilt' : 'Use phone tilt'}
        </button>
      ) : null}

      <div
        className="pour-gauge__meter"
        aria-hidden="true"
        style={{ '--pour-value': String(tilt.pourValue) } as CSSProperties}
      >
        <span />
      </div>

      <div className="pour-gauge__readout" aria-live="polite">
        <strong>{percentage}% poured</strong>
        <span>{layerLabels[tilt.layerState]} layer</span>
      </div>

      <label className="pour-gauge__slider">
        <span>Manual pour fallback</span>
        <input
          type="range"
          min="0"
          max="100"
          value={percentage}
          onInput={(event) => {
            updateManualPourValue(event.currentTarget.value);
          }}
          onChange={(event) => {
            updateManualPourValue(event.currentTarget.value);
          }}
        />
      </label>

      <p className="pour-gauge__status">{fallbackReason}</p>
    </section>
  );
}

export default PourGauge;
