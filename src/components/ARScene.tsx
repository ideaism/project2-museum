import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import ArchiveTexture from './ArchiveTexture';
import CameraPermissionNotice, {
  type CameraPermissionState,
} from './CameraPermissionNotice';
import GlitchText from './GlitchText';
import LayerTransition from './LayerTransition';
import PourGauge from './PourGauge';
import RedactedText from './RedactedText';
import ScanlineOverlay from './ScanlineOverlay';
import SoundManager from './SoundManager';
import SourceBadge from './object/SourceBadge';
import { layerAudioPaths } from '../data/layerAudio';
import type { ArchiveSource, LayerState, MugRecord, NarrativeFragment } from '../types/archive';
import type { PourInteractionState } from '../types/interaction';

const AFRAME_SCRIPT_ID = 'glitching-archive-aframe';
const ARJS_SCRIPT_ID = 'glitching-archive-arjs';
const AFRAME_SRC = 'https://aframe.io/releases/1.5.0/aframe.min.js';
const ARJS_SRC =
  'https://cdn.jsdelivr.net/gh/AR-js-org/AR.js@3.4.7/aframe/build/aframe-ar.js';
const LOCAL_PUBLIC_ROOT = '/Users/beijixinfei/project2/public';
const SAMPLE_MARKER_IMAGE_PATH = '/assets/archive/markers/sample-mug-marker.png';

type MarkerAssetState = 'unchecked' | 'available' | 'missing' | 'invalid';
type MarkerTrackingState = 'idle' | 'scanning' | 'found' | 'lost';
type RuntimeState = 'idle' | 'loading' | 'ready' | 'error';
const ARJS_PATTERN_MIN_NUMERIC_VALUES = 768;

interface ARSceneProps {
  mug: MugRecord;
  tilt: PourInteractionState;
}

declare global {
  interface Window {
    AFRAME?: unknown;
  }
}

function loadScript(id: string, src: string) {
  const existingScript = document.getElementById(id) as HTMLScriptElement | null;

  if (existingScript?.dataset.loaded === 'true') {
    return Promise.resolve();
  }

  if (existingScript) {
    return new Promise<void>((resolve, reject) => {
      existingScript.addEventListener('load', () => resolve(), { once: true });
      existingScript.addEventListener('error', () => reject(new Error(`Failed to load ${src}`)), {
        once: true,
      });
    });
  }

  return new Promise<void>((resolve, reject) => {
    const script = document.createElement('script');
    script.id = id;
    script.src = src;
    script.async = true;
    script.onload = () => {
      script.dataset.loaded = 'true';
      resolve();
    };
    script.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.head.append(script);
  });
}

function escapeAttribute(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

function truncateForAFrame(value: string, maxLength: number) {
  const singleLineValue = value.replace(/\s+/g, ' ').trim();
  return singleLineValue.length > maxLength
    ? `${singleLineValue.slice(0, Math.max(0, maxLength - 1))}…`
    : singleLineValue;
}

function looksLikeArJsPatternFile(text: string) {
  const trimmedText = text.trim();
  const lowerText = trimmedText.toLowerCase();

  if (!trimmedText || lowerText.startsWith('<!doctype') || lowerText.startsWith('<html')) {
    return false;
  }

  const numericValues = trimmedText.match(/\b(?:25[0-5]|2[0-4]\d|1?\d?\d)\b/g) ?? [];
  return numericValues.length >= ARJS_PATTERN_MIN_NUMERIC_VALUES;
}

async function checkMarkerAsset(path: string): Promise<MarkerAssetState> {
  try {
    const response = await fetch(path, { cache: 'no-store' });
    const contentType = response.headers.get('content-type') ?? '';

    if (!response.ok || contentType.includes('text/html')) {
      return 'missing';
    }

    const markerText = await response.text();
    return looksLikeArJsPatternFile(markerText) ? 'available' : 'invalid';
  } catch {
    return 'missing';
  }
}

function getLocalPublicAssetPath(path: string) {
  const normalizedPath = path.startsWith('/') ? path.slice(1) : path;
  return `${LOCAL_PUBLIC_ROOT}/${normalizedPath}`;
}

function getMarkerImagePath(mug: MugRecord) {
  if (mug.slug === 'sample-mug') {
    return SAMPLE_MARKER_IMAGE_PATH;
  }

  return mug.markerPatternPath.replace(/\.patt$/i, '-marker.png');
}

function getCameraContextBlocker(): CameraPermissionState | undefined {
  if (!window.isSecureContext && window.location.hostname !== 'localhost') {
    return 'unsupported';
  }

  if (!navigator.mediaDevices?.getUserMedia) {
    return 'unsupported';
  }

  return undefined;
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

function findSources(fragment: NarrativeFragment, sources: ArchiveSource[]) {
  return fragment.sourceIds
    .map((sourceId) => sources.find((source) => source.id === sourceId))
    .filter((source): source is ArchiveSource => Boolean(source));
}

function getSimulationReason(
  markerAssetState: MarkerAssetState,
  runtimeState: RuntimeState,
  cameraState: CameraPermissionState,
) {
  if (markerAssetState === 'missing') {
    return 'Marker pattern missing; showing assessment simulation.';
  }

  if (markerAssetState === 'invalid') {
    return 'Marker pattern invalid; showing assessment simulation.';
  }

  if (cameraState === 'denied') {
    return 'Camera denied; showing assessment simulation.';
  }

  if (cameraState === 'unsupported') {
    return 'Camera unavailable; showing assessment simulation.';
  }

  if (runtimeState === 'error') {
    return 'AR.js did not start; showing assessment simulation.';
  }

  if (runtimeState === 'ready') {
    return 'Live marker scan with readable archive overlay.';
  }

  return 'Pre-camera simulation of the marker overlay.';
}

function getMotionStatus(tilt: PourInteractionState) {
  if (!tilt.isSupported || tilt.permissionState === 'unavailable') {
    return 'Sensor unavailable';
  }

  if (tilt.permissionState === 'prompt') {
    return 'Sensor permission needed';
  }

  if (tilt.permissionState === 'denied') {
    return 'Sensor denied';
  }

  if (tilt.inputSource === 'sensor') {
    return 'Motion tilt active';
  }

  return 'Manual fallback active';
}

function canRequestMotion(tilt: PourInteractionState) {
  return (
    tilt.isSupported &&
    tilt.inputSource !== 'sensor' &&
    (tilt.permissionState === 'prompt' || tilt.permissionState === 'granted')
  );
}

function buildArchiveObjectMarkup(modelPath: string | undefined) {
  if (modelPath) {
    const modelUrl = escapeAttribute(modelPath);

    return `
      <a-assets>
        <a-asset-item id="archive-mug-model" src="${modelUrl}"></a-asset-item>
      </a-assets>
      <a-gltf-model
        id="archive-pour-object"
        src="#archive-mug-model"
        position="0 0.32 0"
        rotation="-10 0 0"
        scale="0.92 0.92 0.92"
      ></a-gltf-model>
    `;
  }

  return `
    <a-entity id="archive-pour-object" position="0 0.35 0" rotation="-90 0 0">
      <a-cylinder radius="0.42" height="0.28" color="#fff7e8" opacity="0.92"></a-cylinder>
      <a-torus radius="0.42" radius-tubular="0.018" color="#8b2f2f"></a-torus>
      <a-box position="0 0.22 0" depth="0.08" height="0.32" width="0.08" color="#183f45"></a-box>
    </a-entity>
  `;
}

function buildSceneMarkup(
  markerPatternPath: string,
  modelPath: string | undefined,
  mug: MugRecord,
  layer: LayerState,
  fragment: NarrativeFragment | undefined,
) {
  const markerUrl = escapeAttribute(markerPatternPath);
  const archiveObjectMarkup = buildArchiveObjectMarkup(modelPath);
  const title = escapeAttribute(truncateForAFrame(mug.title, 38));
  const layerText = escapeAttribute(
    truncateForAFrame(`${layer.toUpperCase()} / ${fragment?.title ?? 'Archive layer pending'}`, 46),
  );

  return `
    <a-scene
      embedded
      vr-mode-ui="enabled: false"
      renderer="antialias: true; alpha: true"
      arjs="sourceType: webcam; trackingMethod: best; debugUIEnabled: false;"
    >
      <a-marker type="pattern" url="${markerUrl}" smooth="true" smooth-count="8">
        ${archiveObjectMarkup}
        <a-entity id="archive-marker-label" position="0 1.05 -0.52" rotation="-62 0 0">
          <a-plane width="1.92" height="0.74" color="#fffdf8" opacity="0.92"></a-plane>
          <a-plane position="0 -0.3 0.01" width="1.92" height="0.05" color="#8b2f2f" opacity="0.92"></a-plane>
          <a-text
            id="archive-marker-title"
            value="${title}"
            position="-0.86 0.18 0.03"
            width="1.72"
            color="#1d1c19"
            align="left"
          ></a-text>
          <a-text
            id="archive-marker-layer"
            value="${layerText}"
            position="-0.86 -0.1 0.03"
            width="1.72"
            color="#8b2f2f"
            align="left"
          ></a-text>
        </a-entity>
        <a-entity id="archive-pour-stream" position="-0.68 0.42 0" rotation="0 0 38" visible="false">
          <a-cylinder radius="0.018" height="0.7" color="#183f45" opacity="0.72"></a-cylinder>
          <a-sphere position="0 -0.38 0" radius="0.055" color="#8b2f2f" opacity="0.78"></a-sphere>
        </a-entity>
      </a-marker>
      <a-entity camera></a-entity>
    </a-scene>
  `;
}

function ARScene({ mug, tilt }: ARSceneProps) {
  const sceneHostRef = useRef<HTMLDivElement | null>(null);
  const [cameraState, setCameraState] = useState<CameraPermissionState>('prompt');
  const [runtimeState, setRuntimeState] = useState<RuntimeState>('idle');
  const [markerAssetState, setMarkerAssetState] = useState<MarkerAssetState>('unchecked');
  const [markerTrackingState, setMarkerTrackingState] = useState<MarkerTrackingState>('idle');
  const [statusMessage, setStatusMessage] = useState<string>();
  const [mugImageFailed, setMugImageFailed] = useState(false);
  const [markerImageFailed, setMarkerImageFailed] = useState(false);

  const activeFragments = useMemo(
    () => getFragmentsForLayer(mug, tilt.layerState),
    [mug, tilt.layerState],
  );
  const activeFragment = activeFragments[0];
  const fallbackPath = `/object/${mug.slug}`;
  const markerLocalPath = getLocalPublicAssetPath(mug.markerPatternPath);
  const markerImagePath = getMarkerImagePath(mug);
  const markerImageLocalPath = getLocalPublicAssetPath(markerImagePath);
  const motionStatus = getMotionStatus(tilt);
  const showMotionButton = canRequestMotion(tilt);
  const showCameraButton =
    (markerAssetState === 'unchecked' || markerAssetState === 'available') &&
    (cameraState === 'prompt' || cameraState === 'error');
  const isRequestingCamera = runtimeState === 'loading' || cameraState === 'checking';
  const stageStyle = {
    '--pour-value': String(tilt.pourValue),
    '--mug-rotation': `${tilt.mugRotationDeg}deg`,
  } as CSSProperties;
  const simulationReason = getSimulationReason(markerAssetState, runtimeState, cameraState);
  const activeSources = activeFragment ? findSources(activeFragment, mug.sources) : [];
  const sourceSummary =
    activeSources.length > 0
      ? activeSources
          .map((source) => `${source.label}${source.confidence ? ` · ${source.confidence}` : ''}`)
          .join(' / ')
      : 'Source record pending; source type remains visible.';

  useEffect(() => {
    setMugImageFailed(false);
    setMarkerImageFailed(false);
  }, [mug.id, markerImagePath]);

  useEffect(() => {
    let isCurrent = true;

    setMarkerAssetState('unchecked');
    void checkMarkerAsset(mug.markerPatternPath).then((nextMarkerAssetState) => {
      if (!isCurrent) {
        return;
      }

      setMarkerAssetState(nextMarkerAssetState);
    });

    return () => {
      isCurrent = false;
    };
  }, [mug.markerPatternPath]);

  const mountArScene = useCallback(() => {
    const sceneHost = sceneHostRef.current;

    if (!sceneHost) {
      return;
    }

    sceneHost.innerHTML = buildSceneMarkup(
      mug.markerPatternPath,
      mug.modelPath,
      mug,
      tilt.layerState,
      activeFragment,
    );
    const scene = sceneHost.querySelector('a-scene');
    const marker = sceneHost.querySelector('a-marker');

    if (scene) {
      scene.addEventListener('camera-init', () => {
        setCameraState('granted');
        setStatusMessage('Camera ready. Hold the printed marker card in view.');
      });
      scene.addEventListener('camera-error', () => {
        setCameraState('denied');
        setRuntimeState('error');
        setStatusMessage(
          'Camera access was denied or could not start. Use the no-AR route or allow camera access and try again.',
        );
      });
    }

    if (marker) {
      marker.addEventListener('markerFound', () => setMarkerTrackingState('found'));
      marker.addEventListener('markerLost', () => setMarkerTrackingState('lost'));
    }

    setMarkerTrackingState('scanning');
  }, [activeFragment, mug, tilt.layerState]);

  useEffect(() => {
    const sceneHost = sceneHostRef.current;
    const pourObject = sceneHost?.querySelector('#archive-pour-object');

    if (!pourObject) {
      return;
    }

    pourObject.setAttribute(
      'rotation',
      mug.modelPath ? `0 0 ${-tilt.mugRotationDeg}` : `-90 0 ${-tilt.mugRotationDeg}`,
    );

    const layerText = sceneHost?.querySelector('#archive-marker-layer');
    const pourStream = sceneHost?.querySelector('#archive-pour-stream');

    layerText?.setAttribute(
      'value',
      truncateForAFrame(
        `${tilt.layerState.toUpperCase()} / ${activeFragment?.title ?? 'Archive layer pending'}`,
        46,
      ),
    );
    layerText?.setAttribute('color', tilt.layerState === 'core' ? '#1d1c19' : '#8b2f2f');
    pourStream?.setAttribute('visible', tilt.pourValue > 0.2 ? 'true' : 'false');
    pourStream?.setAttribute('scale', `1 ${Math.max(0.25, tilt.pourValue)} 1`);
    pourStream?.setAttribute('opacity', String(Math.max(0.28, tilt.pourValue)));
  }, [
    activeFragment,
    mug.modelPath,
    runtimeState,
    tilt.layerState,
    tilt.mugRotationDeg,
    tilt.pourValue,
  ]);

  const startAr = useCallback(async () => {
    setStatusMessage(undefined);
    setCameraState('checking');
    setRuntimeState('loading');

    const cameraBlocker = getCameraContextBlocker();

    if (cameraBlocker) {
      setCameraState(cameraBlocker);
      setRuntimeState(cameraBlocker === 'unsupported' ? 'idle' : 'error');
      setStatusMessage(
        'Camera AR needs a secure browser context. Use HTTPS, localhost, or the deployed prototype, then try again.',
      );
      return;
    }

    const nextMarkerAssetState = await checkMarkerAsset(mug.markerPatternPath);
    setMarkerAssetState(nextMarkerAssetState);

    if (nextMarkerAssetState !== 'available') {
      setRuntimeState('error');
      setCameraState('markerMissing');
      setStatusMessage(
        nextMarkerAssetState === 'invalid'
          ? `The marker file does not look like a valid AR.js .patt pattern. Replace it with a real AR.js marker pattern at ${markerLocalPath}.`
          : `Live marker tracking needs the .patt file at ${markerLocalPath}.`,
      );
      return;
    }

    try {
      await loadScript(AFRAME_SCRIPT_ID, AFRAME_SRC);
      await loadScript(ARJS_SCRIPT_ID, ARJS_SRC);

      if (!window.AFRAME) {
        throw new Error('A-Frame did not register on window.');
      }

      mountArScene();
      setRuntimeState('ready');
      setStatusMessage('Starting AR.js camera. If prompted, allow camera access.');
    } catch {
      setRuntimeState('error');
      setCameraState('error');
      setStatusMessage(
        'The AR.js scripts could not be loaded in this environment. The archive overlay remains available below.',
      );
    }
  }, [markerLocalPath, mountArScene, mug.markerPatternPath]);

  const markerStatus =
    markerAssetState === 'missing'
      ? 'Marker asset missing'
      : markerAssetState === 'invalid'
        ? 'Marker pattern invalid'
      : markerAssetState === 'available' && runtimeState !== 'ready'
        ? 'Marker asset ready'
      : markerTrackingState === 'found'
          ? 'Marker found'
        : markerTrackingState === 'lost'
          ? 'Marker lost'
          : runtimeState === 'ready'
            ? 'Camera ready / scanning marker'
            : 'Marker scanner idle';

  return (
    <section
      className={`ar-scene glitch-${tilt.layerState} glitch-layer-${tilt.layerState}`}
      aria-labelledby="ar-scene-title"
    >
      <div className="ar-scene__intro">
        <div>
          <p className="eyebrow">AR marker experience</p>
          <GlitchText as="h1" id="ar-scene-title" layerState={tilt.layerState}>
            {mug.title}
          </GlitchText>
          <p className="lead">
            Scan the printed AR.js marker card beside the cup. The cup remains the
            object anchor; the square, high-contrast marker card is the archive access
            target.
          </p>
        </div>

        <Link className="button-link" to={fallbackPath}>
          Continue without AR
        </Link>
      </div>

      <div
        className="ar-scene__stage"
        data-runtime={runtimeState}
        data-layer={tilt.layerState}
        data-transition={tilt.contentTransitionState}
        style={stageStyle}
      >
        <ArchiveTexture layerState={tilt.layerState} variant="screen" />
        <LayerTransition layerState={tilt.layerState} pourValue={tilt.pourValue} />
        <ScanlineOverlay layerState={tilt.layerState} />
        <div ref={sceneHostRef} className="ar-scene__host" aria-hidden={runtimeState !== 'ready'} />

        {runtimeState !== 'ready' ? (
          <div className="ar-scene__camera-placeholder" aria-hidden="true">
            <span />
          </div>
        ) : null}

        <div
          className="ar-prototype-overlay"
          data-live={runtimeState === 'ready' ? 'true' : 'false'}
          aria-label="AR marker overlay prototype"
        >
          <div className="ar-marker-plate" aria-hidden="true">
            {!markerImageFailed ? (
              <img
                src={markerImagePath}
                alt=""
                onError={() => setMarkerImageFailed(true)}
              />
            ) : (
              <span className="ar-marker-plate__fallback" />
            )}
          </div>

          <div className="ar-overlay-object" aria-hidden="true">
            {mug.imagePath && !mugImageFailed ? (
              <img
                src={mug.imagePath}
                alt=""
                onError={() => setMugImageFailed(true)}
              />
            ) : (
              <span className="ar-overlay-object__fallback" />
            )}
            <span className="ar-overlay-object__pour" />
          </div>

          <article className="ar-overlay-card" aria-live="polite">
            <div className="ar-overlay-card__header">
              <span className="layer-label">{tilt.layerState}</span>
              {activeFragment ? <SourceBadge type={activeFragment.sourceType} /> : null}
            </div>
            <GlitchText as="h2" layerState={tilt.layerState}>
              {activeFragment?.title ?? 'Archive layer pending'}
            </GlitchText>
            <p>
              {activeFragment ? (
                activeFragment.sourceType === 'redacted' ? (
                  <RedactedText text={activeFragment.text} layerState={activeFragment.layer} />
                ) : (
                  activeFragment.text
                )
              ) : (
                'No sourced fragment has been added for this layer yet.'
              )}
            </p>
            <p className="ar-overlay-card__source-note">{sourceSummary}</p>
          </article>

          <p className="ar-simulation-status">{simulationReason}</p>
        </div>

        <div className="ar-scene__hud">
          <div className="ar-scene__hud-primary">
            <span className="layer-label">{tilt.layerState}</span>
            <span>{markerStatus}</span>
          </div>
          <div className="ar-scene__hud-motion">
            <span>{motionStatus}</span>
            {showMotionButton ? (
              <button
                type="button"
                onClick={() => {
                  void tilt.requestPermission();
                }}
              >
                {tilt.permissionState === 'prompt' ? 'Enable tilt' : 'Use tilt'}
              </button>
            ) : null}
          </div>
          <div className="ar-scene__hud-actions">
            {showCameraButton ? (
              <button
                type="button"
                onClick={() => {
                  void startAr();
                }}
                disabled={isRequestingCamera}
              >
                {isRequestingCamera ? 'Starting camera' : 'Start camera'}
              </button>
            ) : null}
            <Link to={fallbackPath}>No AR</Link>
          </div>
        </div>

        <details className="ar-layer-drawer">
          <summary>
            <span>
              <span className="layer-label">{tilt.layerState}</span>
              <strong>
                {activeFragments.length > 0
                  ? `${activeFragments.length} ${tilt.layerState} fragments`
                  : 'No fragment for this layer'}
              </strong>
            </span>
            {activeFragment ? <SourceBadge type={activeFragment.sourceType} /> : null}
          </summary>

          <div className="ar-layer-drawer__content" aria-live="polite">
            {activeFragments.length > 0 ? (
              activeFragments.map((fragment) => (
                <article className="ar-fragment-card" key={fragment.id}>
                  <div className="ar-fragment-card__header">
                    <h2>{fragment.title}</h2>
                    <SourceBadge type={fragment.sourceType} />
                  </div>
                  <p>
                    {fragment.sourceType === 'redacted' ? (
                      <>
                        <RedactedText text={fragment.text} layerState={fragment.layer} />{' '}
                        <span>Redaction remains visible.</span>
                      </>
                    ) : (
                      fragment.text
                    )}
                  </p>
                  <dl className="ar-overlay-card__sources" aria-label="Visible source labels">
                    {findSources(fragment, mug.sources).map((source) => (
                      <div key={source.id}>
                        <dt>{source.label}</dt>
                        <dd>
                          {source.type}
                          {source.confidence ? ` · ${source.confidence}` : ''}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </article>
              ))
            ) : (
              <p>
                This absence remains visible until sourced archive data or local visitor
                contributions are added.
              </p>
            )}
          </div>
        </details>

        <div className="ar-pour-fragments" aria-hidden="true">
          {activeFragments.slice(0, 3).map((fragment, index) => (
            <span
              key={fragment.id}
              style={
                {
                  left: `${12 + index * 13}%`,
                  top: `${48 + index * 8}%`,
                  opacity:
                    tilt.contentTransitionState === 'settled'
                      ? 0
                      : tilt.pourValue * 0.86,
                  transform: `translateY(${(0.35 - tilt.pourValue) * 5}rem) rotate(${
                    -12 + index * 7
                  }deg)`,
                } as CSSProperties
              }
            >
              {fragment.title}
            </span>
          ))}
        </div>

        {markerAssetState === 'missing' || markerAssetState === 'invalid' ? (
          <aside className="ar-marker-missing" aria-label="Missing marker asset">
            <strong>
              {markerAssetState === 'invalid'
                ? 'Marker pattern file invalid'
                : 'Marker file missing'}
            </strong>
            <span>
              Expected a real AR.js pattern at <code>{mug.markerPatternPath}</code>.
              Add it at <code>{markerLocalPath}</code> and print the matching marker
              image at <code>{markerImageLocalPath}</code>.
            </span>
          </aside>
        ) : null}
      </div>

      <CameraPermissionNotice
        state={
          markerAssetState === 'missing' || markerAssetState === 'invalid'
            ? 'markerMissing'
            : cameraState
        }
        fallbackPath={fallbackPath}
        onRequestCamera={() => {
          void startAr();
        }}
        isRequesting={isRequestingCamera}
        markerPath={mug.markerPatternPath}
        markerLocalPath={markerLocalPath}
        message={statusMessage}
      />

      <section className="ar-instructions" aria-labelledby="ar-instructions-title">
        <div>
          <p className="eyebrow">Marker setup</p>
          <h2 id="ar-instructions-title">Print, place, scan, pour</h2>
        </div>
        <ol>
          <li>
            Print the marker image at <code>{markerImagePath}</code>.
          </li>
          <li>Place the marker flat beside the physical cup.</li>
          <li>Start the camera and hold the marker in view.</li>
          <li>Tilt the phone as if pouring, or use the manual slider below.</li>
        </ol>
        <p>
          Marker pattern: <code>{mug.markerPatternPath}</code>. Local file:{' '}
          <code>{markerLocalPath}</code>.
        </p>
      </section>

      <PourGauge
        tilt={tilt}
        label="Tilt or manual pour"
        description="Use phone tilt when available, or move the slider to review the same surface, middle, and core layers without sensor permission."
      />

      <SoundManager
        layerState={tilt.layerState}
        audioPaths={layerAudioPaths}
        pourValue={tilt.soundIntensity}
      />
    </section>
  );
}

export default ARScene;
