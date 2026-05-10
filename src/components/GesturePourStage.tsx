import { useEffect, useState, type CSSProperties } from 'react';
import ArchiveTexture from './ArchiveTexture';
import GlitchText from './GlitchText';
import RedactedText from './RedactedText';
import ScanlineOverlay from './ScanlineOverlay';
import type {
  ArchiveResearchSourceType,
  ArchiveSourceType,
  LayerState,
  MugRecord,
  NarrativeFragment,
} from '../types/archive';
import type { PourInteractionState } from '../types/interaction';
import type { useGesturePour } from '../hooks/useGesturePour';
import { getPourValueForLayerState } from '../utils/pourMapping';

type GestureRuntime = ReturnType<typeof useGesturePour>;

const layerLabels: Record<LayerState, string> = {
  surface: 'Surface',
  middle: 'Middle',
  core: 'Core',
};

const statusLabels = {
  idle: 'Gesture input idle',
  permissionNeeded: 'Camera permission needed',
  cameraStarting: 'Starting camera',
  loadingModel: 'Loading hand model',
  calibrating: 'Calibrating',
  tracking: 'Gesture tracking',
  searching: 'Searching for hand',
  lowConfidence: 'Low confidence',
  failed: 'Gesture input failed',
  unavailable: 'Camera unavailable',
  manualFallback: 'Manual fallback active',
} as const;

const researchLabelText: Record<ArchiveResearchSourceType | ArchiveSourceType, string> = {
  fact: 'fact',
  'visible-evidence': 'visible evidence',
  'historical-context': 'historical context',
  inference: 'inference',
  speculation: 'speculation',
  unresolved: 'unresolved',
  redacted: 'redacted',
  'visitor-contribution': 'visitor contribution',
  visitorContribution: 'visitor contribution',
};

const labelLegend = [
  'fact',
  'visible-evidence',
  'historical-context',
  'inference',
  'speculation',
  'unresolved',
  'redacted',
  'visitor-contribution',
] as const;

interface GesturePourStageProps {
  mug: MugRecord;
  gesture: GestureRuntime;
  interaction: PourInteractionState;
}

function getFragmentsForLayer(mug: MugRecord, layer: LayerState) {
  if (layer === 'surface') {
    return mug.facts;
  }

  if (layer === 'middle') {
    return mug.middleReadings;
  }

  return mug.coreFragments;
}

function getFlowFragments(mug: MugRecord) {
  return [
    ...mug.facts.slice(0, 2),
    ...mug.middleReadings.slice(0, 2),
    ...mug.coreFragments.slice(0, 2),
    mug.coreFragments.find((fragment) => fragment.sourceType === 'visitorContribution'),
  ].filter((fragment): fragment is NarrativeFragment => Boolean(fragment));
}

function getResearchLabel(fragment: NarrativeFragment) {
  return fragment.researchType ?? fragment.sourceType;
}

function getFragmentVisibility(fragment: NarrativeFragment, pourValue: number) {
  if (fragment.layer === 'surface') {
    return pourValue < 0.42 ? 1 : Math.max(0.42, 1 - (pourValue - 0.42) * 1.2);
  }

  if (fragment.layer === 'middle') {
    return pourValue >= 0.28 ? Math.min(1, (pourValue - 0.2) * 2.8) : 0.12;
  }

  return pourValue >= 0.62 ? Math.min(1, (pourValue - 0.56) * 3.2) : 0.08;
}

function GestureCameraBackdrop({ gesture }: { gesture: GestureRuntime }) {
  return (
    <div className="gesture-camera-backdrop" aria-hidden="true">
      <video ref={gesture.videoRef} muted playsInline />
      {gesture.cameraStatus !== 'active' ? <span className="gesture-camera-backdrop__idle" /> : null}
    </div>
  );
}

function GestureStatusHUD({
  gesture,
  interaction,
}: {
  gesture: GestureRuntime;
  interaction: PourInteractionState;
}) {
  const pourPercent = Math.round(interaction.pourValue * 100);
  const confidencePercent = Math.round((gesture.confidence ?? 0) * 100);

  return (
    <aside className="gesture-status-hud" aria-live="polite">
      <span className="gesture-status-hud__status">{statusLabels[gesture.status]}</span>
      <span>{pourPercent}% poured</span>
      <span>{layerLabels[interaction.layerState]} layer</span>
      {gesture.cameraStatus === 'active' ? <span>Confidence {confidencePercent}%</span> : null}
    </aside>
  );
}

function GestureControls({ gesture }: { gesture: GestureRuntime }) {
  return (
    <div className="gesture-stage-controls" aria-label="Gesture camera controls">
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
        {gesture.cameraStatus === 'active' ? 'Restart gesture camera' : 'Start gesture camera'}
      </button>
      <button
        className="button-link"
        type="button"
        onClick={gesture.stopCamera}
        disabled={gesture.cameraStatus !== 'active'}
      >
        Stop camera
      </button>
      <button
        className="button-link"
        type="button"
        onClick={gesture.calibrateNeutral}
        disabled={!gesture.isHandDetected}
      >
        Set neutral
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
  );
}

function PourFallbackControls({ interaction }: { interaction: PourInteractionState }) {
  const percentage = Math.round(interaction.pourValue * 100);

  return (
    <div className="pour-fallback-controls" aria-label="Manual pour fallback">
      <div className="pour-fallback-controls__readout">
        <span>Manual fallback</span>
        <strong>{percentage}%</strong>
      </div>
      <label className="pour-fallback-controls__slider">
        <span className="visually-hidden">Manual pour fallback</span>
        <input
          type="range"
          min="0"
          max="100"
          value={percentage}
          onInput={(event) => {
            interaction.setSliderPourValue(Number(event.currentTarget.value) / 100);
          }}
          onChange={(event) => {
            interaction.setSliderPourValue(Number(event.currentTarget.value) / 100);
          }}
        />
      </label>
      <div className="pour-fallback-controls__layers" aria-label="Choose archive layer">
        {(Object.keys(layerLabels) as LayerState[]).map((layer) => (
          <button
            key={layer}
            type="button"
            className={layer === interaction.layerState ? 'is-active' : undefined}
            aria-pressed={layer === interaction.layerState}
            onClick={() => {
              interaction.setSliderPourValue(getPourValueForLayerState(layer));
            }}
          >
            {layerLabels[layer]}
          </button>
        ))}
      </div>
    </div>
  );
}

function MugPourObject({ mug }: { mug: MugRecord }) {
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    setImageFailed(false);
  }, [mug.imagePath]);

  return (
    <div className="mug-pour-object" aria-hidden="true">
      {mug.imagePath && !imageFailed ? (
        <img
          src={mug.imagePath}
          alt=""
          onError={() => {
            setImageFailed(true);
          }}
        />
      ) : (
        <span className="mug-pour-object__fallback" />
      )}
      <i className="mug-pour-object__stream" />
    </div>
  );
}

function InfoFlowOverlay({
  fragments,
  pourValue,
}: {
  fragments: NarrativeFragment[];
  pourValue: number;
}) {
  return (
    <div className="info-flow-overlay" aria-hidden="true">
      {fragments.map((fragment, index) => (
        <span
          key={`${fragment.id}-${index}`}
          className={`info-flow-overlay__fragment info-flow-overlay__fragment--${fragment.layer}`}
          style={
            {
              '--fragment-index': String(index),
              opacity: getFragmentVisibility(fragment, pourValue),
            } as CSSProperties
          }
        >
          {fragment.title}
        </span>
      ))}
    </div>
  );
}

function ActiveLayerCard({
  fragment,
  layerState,
}: {
  fragment: NarrativeFragment | undefined;
  layerState: LayerState;
}) {
  const researchLabel = fragment ? getResearchLabel(fragment) : undefined;

  return (
    <article className="gesture-layer-card" aria-live="polite">
      <div className="gesture-layer-card__header">
        <span className="layer-label">{layerLabels[layerState]}</span>
        {researchLabel ? (
          <span className={`research-badge research-badge--${researchLabel}`}>
            {researchLabelText[researchLabel]}
          </span>
        ) : null}
      </div>
      <GlitchText as="h2" layerState={layerState}>
        {fragment?.title ?? 'Layer pending'}
      </GlitchText>
      <p>
        {fragment?.sourceType === 'redacted' ? (
          <RedactedText text={fragment.text} layerState={fragment.layer} />
        ) : (
          fragment?.text ?? 'No sourced fragment has been added for this layer yet.'
        )}
      </p>
    </article>
  );
}

export function GestureSourceLegend() {
  return (
    <section className="gesture-source-legend" aria-labelledby="gesture-source-title">
      <div>
        <p className="eyebrow">Source transparency</p>
        <h2 id="gesture-source-title">Labels remain visible while pouring</h2>
      </div>
      <div className="gesture-source-legend__list">
        {labelLegend.map((label) => (
          <span className={`research-badge research-badge--${label}`} key={label}>
            {researchLabelText[label]}
          </span>
        ))}
      </div>
    </section>
  );
}

function GesturePourStage({ mug, gesture, interaction }: GesturePourStageProps) {
  const activeFragments = getFragmentsForLayer(mug, interaction.layerState);
  const activeFragment = activeFragments[0];
  const flowFragments = getFlowFragments(mug);

  return (
    <section
      className={`gesture-pour-stage glitch-layer-${interaction.layerState}`}
      aria-label="Gesture pour stage"
      data-layer={interaction.layerState}
      data-input-status={interaction.inputStatus}
      style={
        {
          '--pour-value': String(interaction.pourValue),
          '--mug-rotation': `${interaction.mugRotationDeg}deg`,
          '--gesture-confidence': String(interaction.inputConfidence ?? gesture.confidence ?? 0),
        } as CSSProperties
      }
    >
      <GestureCameraBackdrop gesture={gesture} />
      <ArchiveTexture layerState={interaction.layerState} variant="screen" />
      <ScanlineOverlay layerState={interaction.layerState} />
      <MugPourObject mug={mug} />
      <InfoFlowOverlay fragments={flowFragments} pourValue={interaction.pourValue} />
      <GestureStatusHUD gesture={gesture} interaction={interaction} />
      <ActiveLayerCard fragment={activeFragment} layerState={interaction.layerState} />

      <div className="gesture-pour-stage__bottom">
        <GestureControls gesture={gesture} />
        <PourFallbackControls interaction={interaction} />
      </div>

      {gesture.error ? (
        <aside className="gesture-pour-stage__error" aria-live="polite">
          {gesture.error}
        </aside>
      ) : null}
    </section>
  );
}

export default GesturePourStage;
