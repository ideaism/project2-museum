import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import CameraPermissionNotice, {
  type CameraPermissionState,
} from './CameraPermissionNotice';
import PourGauge from './PourGauge';
import SourceBadge from './object/SourceBadge';
import type { ArchiveSource, LayerState, MugRecord, NarrativeFragment } from '../types/archive';
import type { DeviceTiltState } from '../types/interaction';

const AFRAME_SCRIPT_ID = 'glitching-archive-aframe';
const ARJS_SCRIPT_ID = 'glitching-archive-arjs';
const AFRAME_SRC = 'https://aframe.io/releases/1.5.0/aframe.min.js';
const ARJS_SRC =
  'https://cdn.jsdelivr.net/gh/AR-js-org/AR.js@3.4.7/aframe/build/aframe-ar.js';
const LOCAL_PUBLIC_ROOT = '/Users/beijixinfei/project2/public';

type MarkerAssetState = 'unchecked' | 'available' | 'missing' | 'invalid';
type MarkerTrackingState = 'idle' | 'scanning' | 'found' | 'lost';
type RuntimeState = 'idle' | 'loading' | 'ready' | 'error';
const ARJS_PATTERN_MIN_NUMERIC_VALUES = 768;

interface ARSceneProps {
  mug: MugRecord;
  tilt: DeviceTiltState;
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

async function requestCameraAccess() {
  if (!window.isSecureContext && window.location.hostname !== 'localhost') {
    return 'unsupported' satisfies CameraPermissionState;
  }

  if (!navigator.mediaDevices?.getUserMedia) {
    return 'unsupported' satisfies CameraPermissionState;
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: { ideal: 'environment' } },
      audio: false,
    });
    stream.getTracks().forEach((track) => track.stop());
    return 'granted' satisfies CameraPermissionState;
  } catch (error) {
    if (error instanceof DOMException && error.name === 'NotAllowedError') {
      return 'denied' satisfies CameraPermissionState;
    }

    return 'error' satisfies CameraPermissionState;
  }
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

function buildArchiveObjectMarkup(modelPath: string | undefined) {
  if (modelPath) {
    const modelUrl = escapeAttribute(modelPath);

    return `
      <a-assets>
        <a-asset-item id="archive-mug-model" src="${modelUrl}"></a-asset-item>
      </a-assets>
      <a-gltf-model
        src="#archive-mug-model"
        position="0 0 0"
        rotation="0 0 0"
        scale="0.45 0.45 0.45"
      ></a-gltf-model>
    `;
  }

  return `
    <a-entity position="0 0.35 0" rotation="-90 0 0">
      <a-cylinder radius="0.42" height="0.28" color="#fff7e8" opacity="0.92"></a-cylinder>
      <a-torus radius="0.42" radius-tubular="0.018" color="#8b2f2f"></a-torus>
      <a-box position="0 0.22 0" depth="0.08" height="0.32" width="0.08" color="#183f45"></a-box>
    </a-entity>
  `;
}

function buildSceneMarkup(markerPatternPath: string, modelPath: string | undefined) {
  const markerUrl = escapeAttribute(markerPatternPath);
  const archiveObjectMarkup = buildArchiveObjectMarkup(modelPath);

  return `
    <a-scene
      embedded
      vr-mode-ui="enabled: false"
      renderer="antialias: true; alpha: true"
      arjs="sourceType: webcam; trackingMethod: best; debugUIEnabled: false;"
    >
      <a-marker type="pattern" url="${markerUrl}" smooth="true" smooth-count="8">
        ${archiveObjectMarkup}
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

  const activeFragments = useMemo(
    () => getFragmentsForLayer(mug, tilt.layerState),
    [mug, tilt.layerState],
  );
  const activeFragment = activeFragments[0];
  const fallbackPath = `/object/${mug.slug}`;
  const markerLocalPath = getLocalPublicAssetPath(mug.markerPatternPath);

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

    sceneHost.innerHTML = buildSceneMarkup(mug.markerPatternPath, mug.modelPath);
    const marker = sceneHost.querySelector('a-marker');

    if (marker) {
      marker.addEventListener('markerFound', () => setMarkerTrackingState('found'));
      marker.addEventListener('markerLost', () => setMarkerTrackingState('lost'));
    }

    setMarkerTrackingState('scanning');
  }, [mug.markerPatternPath, mug.modelPath]);

  const startAr = useCallback(async () => {
    setStatusMessage(undefined);
    setCameraState('checking');
    setRuntimeState('loading');

    const nextCameraState = await requestCameraAccess();
    setCameraState(nextCameraState);

    if (nextCameraState !== 'granted') {
      setRuntimeState(nextCameraState === 'unsupported' ? 'idle' : 'error');
      return;
    }

    const nextMarkerAssetState = await checkMarkerAsset(mug.markerPatternPath);
    setMarkerAssetState(nextMarkerAssetState);

    if (nextMarkerAssetState !== 'available') {
      setRuntimeState('error');
      setCameraState('markerMissing');
      setStatusMessage(
        nextMarkerAssetState === 'invalid'
          ? `Marker file found but it does not look like a valid AR.js .patt pattern. Replace it with a real AR.js marker pattern at ${markerLocalPath}.`
          : `Missing marker asset. Add the .patt file at ${markerLocalPath} before using live AR.js marker tracking.`,
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
            ? 'Scanning for marker'
            : 'Marker scanner idle';

  return (
    <section className="ar-scene" aria-labelledby="ar-scene-title">
      <div className="ar-scene__intro">
        <div>
          <p className="eyebrow">AR marker experience</p>
          <h1 id="ar-scene-title">{mug.title}</h1>
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

      <div className="ar-scene__stage" data-runtime={runtimeState}>
        <div ref={sceneHostRef} className="ar-scene__host" aria-hidden={runtimeState !== 'ready'} />

        {runtimeState !== 'ready' ? (
          <div className="ar-scene__camera-placeholder" aria-hidden="true">
            <span />
          </div>
        ) : null}

        <div className="ar-scene__hud">
          <span className="layer-label">{tilt.layerState}</span>
          <span>{markerStatus}</span>
        </div>

        <article className="ar-overlay-card" aria-live="polite">
          <div className="ar-overlay-card__header">
            <span className="layer-label">{tilt.layerState}</span>
            {activeFragment ? <SourceBadge type={activeFragment.sourceType} /> : null}
          </div>

          {activeFragment ? (
            <>
              <h2>{activeFragment.title}</h2>
              <p>{activeFragment.text}</p>
              <dl className="ar-overlay-card__sources" aria-label="Visible source labels">
                {findSources(activeFragment, mug.sources).map((source) => (
                  <div key={source.id}>
                    <dt>{source.label}</dt>
                    <dd>
                      {source.type}
                      {source.confidence ? ` · ${source.confidence}` : ''}
                    </dd>
                  </div>
                ))}
              </dl>
            </>
          ) : (
            <>
              <h2>No fragment for this layer</h2>
              <p>
                This absence remains visible until sourced archive data or local visitor
                contributions are added.
              </p>
            </>
          )}
        </article>

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
              image.
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
        isRequesting={runtimeState === 'loading' || cameraState === 'checking'}
        markerPath={mug.markerPatternPath}
        markerLocalPath={markerLocalPath}
        message={statusMessage}
      />

      <PourGauge
        tilt={tilt}
        label="Tilt or manual pour"
        description="Use phone tilt when available, or move the slider to review the same surface, middle, and core layers without sensor permission."
      />
    </section>
  );
}

export default ARScene;
