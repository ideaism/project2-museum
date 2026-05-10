import type { CSSProperties } from 'react';
import type { LayerState } from '../types/archive';
import type { PourInputStatus, PourInteractionState } from '../types/interaction';
import { getPourValueForLayerState } from '../utils/pourMapping';

const layerLabels = {
  surface: 'Surface',
  middle: 'Middle',
  core: 'Core',
} as const;

export interface PourGaugeProps {
  tilt: PourInteractionState;
  label?: string;
  description?: string;
}

const inputSourceLabels: Record<PourInteractionState['inputSource'], string> = {
  slider: 'Slider',
  keyboard: 'Keyboard',
  'device-tilt': 'Device tilt',
  gesture: 'Camera gesture',
};

const inputStatusLabels: Record<PourInputStatus, string> = {
  idle: 'Input idle',
  manualFallback: 'Manual fallback active',
  permissionNeeded: 'Permission needed',
  calibrating: 'Calibrating input',
  cameraStarting: 'Starting camera input',
  loadingModel: 'Loading input model',
  tracking: 'Input tracking',
  searching: 'Searching for input',
  lowConfidence: 'Low confidence',
  failed: 'Input failed',
  unavailable: 'Input unavailable',
};

function PourGauge({
  tilt,
  label = 'Pour layer control',
  description = 'Tilt the phone as if pouring from the mug, or use the slider fallback.',
}: PourGaugeProps) {
  const percentage = Math.round(tilt.pourValue * 100);
  const updateManualPourValue = (value: string) => {
    tilt.setSliderPourValue(Number(value) / 100);
  };
  const chooseLayer = (layer: LayerState) => {
    tilt.setSliderPourValue(getPourValueForLayerState(layer));
  };
  const showPermissionButton =
    tilt.isSupported &&
    tilt.inputSource !== 'device-tilt' &&
    (tilt.permissionState === 'prompt' || tilt.permissionState === 'granted');
  const inputStatus = inputStatusLabels[tilt.inputStatus];
  const confidenceText =
    typeof tilt.inputConfidence === 'number'
      ? ` Confidence ${Math.round(tilt.inputConfidence * 100)}%.`
      : '';
  const inputConfidence = Math.min(1, Math.max(0, tilt.inputConfidence ?? 0));
  const externalStatusText =
    tilt.externalInput && tilt.externalInput.source !== tilt.inputSource && tilt.externalInput.status
      ? ` ${inputSourceLabels[tilt.externalInput.source]} input: ${
          inputStatusLabels[tilt.externalInput.status]
        }.`
      : '';
  const fallbackReason = `${inputSourceLabels[tilt.inputSource]} input: ${inputStatus}.${confidenceText}${externalStatusText}`;

  return (
    <section
      className="pour-gauge"
      data-input-source={tilt.inputSource}
      data-input-status={tilt.inputStatus}
      style={
        {
          '--pour-value': String(tilt.pourValue),
          '--input-confidence': String(inputConfidence),
        } as CSSProperties
      }
      aria-labelledby="pour-gauge-title"
    >
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
      >
        <span />
      </div>

      {typeof tilt.inputConfidence === 'number' ? (
        <div
          className="pour-gauge__confidence"
          aria-label={`Input confidence ${Math.round(inputConfidence * 100)}%`}
        >
          <span />
        </div>
      ) : null}

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

      <div className="pour-gauge__layer-buttons" aria-label="Choose archive layer">
        {(Object.keys(layerLabels) as LayerState[]).map((layer) => (
          <button
            key={layer}
            className={layer === tilt.layerState ? 'is-active' : undefined}
            type="button"
            aria-pressed={layer === tilt.layerState}
            data-pour-value={getPourValueForLayerState(layer)}
            onClick={() => chooseLayer(layer)}
          >
            {layerLabels[layer]}
          </button>
        ))}
      </div>

      <p className="pour-gauge__status">{fallbackReason}</p>
    </section>
  );
}

export default PourGauge;
