import { createElement, useEffect, useMemo, useState } from 'react';

const MODEL_VIEWER_SCRIPT_ID = 'glitching-archive-model-viewer';
const MODEL_VIEWER_SRC =
  'https://ajax.googleapis.com/ajax/libs/model-viewer/4.1.0/model-viewer.min.js';

type ModelState =
  | 'noModel'
  | 'checking'
  | 'missing'
  | 'loadingViewer'
  | 'ready'
  | 'failed';

interface ObjectModelViewerProps {
  title: string;
  modelPath?: string;
  imagePath?: string;
}

function loadModelViewerScript() {
  const existingScript = document.getElementById(
    MODEL_VIEWER_SCRIPT_ID,
  ) as HTMLScriptElement | null;

  if (existingScript?.dataset.loaded === 'true') {
    return Promise.resolve();
  }

  if (existingScript) {
    return new Promise<void>((resolve, reject) => {
      existingScript.addEventListener('load', () => resolve(), { once: true });
      existingScript.addEventListener(
        'error',
        () => reject(new Error('Failed to load model-viewer')),
        { once: true },
      );
    });
  }

  return new Promise<void>((resolve, reject) => {
    const script = document.createElement('script');
    script.id = MODEL_VIEWER_SCRIPT_ID;
    script.type = 'module';
    script.src = MODEL_VIEWER_SRC;
    script.onload = () => {
      script.dataset.loaded = 'true';
      resolve();
    };
    script.onerror = () => reject(new Error('Failed to load model-viewer'));
    document.head.append(script);
  });
}

async function assetExists(path: string) {
  try {
    const response = await fetch(path, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
}

function fallbackReason(state: ModelState, modelPath?: string) {
  if (state === 'noModel') {
    return 'No 3D model path is attached to this mug record yet.';
  }

  if (state === 'missing') {
    return `The 3D model file is missing at ${modelPath}.`;
  }

  if (state === 'failed') {
    return 'The 3D viewer or model file could not load in this browser.';
  }

  return undefined;
}

function ObjectModelViewer({ title, modelPath, imagePath }: ObjectModelViewerProps) {
  const [modelState, setModelState] = useState<ModelState>(modelPath ? 'checking' : 'noModel');
  const [imageFailed, setImageFailed] = useState(false);
  const showModel = modelPath && modelState === 'ready';
  const reason = fallbackReason(modelState, modelPath);
  const modelPublicPath = useMemo(
    () => (modelPath ? `public${modelPath}` : undefined),
    [modelPath],
  );

  useEffect(() => {
    let isCurrent = true;

    setImageFailed(false);

    if (!modelPath) {
      setModelState('noModel');
      return () => {
        isCurrent = false;
      };
    }

    setModelState('checking');

    void assetExists(modelPath).then(async (exists) => {
      if (!isCurrent) {
        return;
      }

      if (!exists) {
        setModelState('missing');
        return;
      }

      setModelState('loadingViewer');

      try {
        await loadModelViewerScript();

        if (isCurrent) {
          setModelState('ready');
        }
      } catch {
        if (isCurrent) {
          setModelState('failed');
        }
      }
    });

    return () => {
      isCurrent = false;
    };
  }, [modelPath]);

  return (
    <div className="object-model-viewer">
      {showModel
        ? (
          <div className="object-model-viewer__frame">
            {/*
              model-viewer is loaded as a custom element so the app does not need a
              heavier React 3D dependency for this no-camera walkthrough.
            */}
            {createElement('model-viewer', {
              src: modelPath,
              poster: imagePath,
              alt: `Interactive 3D model for ${title}`,
              'camera-controls': true,
              'interaction-prompt': 'auto',
              'auto-rotate': true,
              'auto-rotate-delay': 1800,
              'rotation-per-second': '18deg',
              'shadow-intensity': '0.75',
              exposure: '0.95',
              'camera-orbit': '35deg 68deg 2.8m',
              'min-camera-orbit': 'auto auto 1.8m',
              'max-camera-orbit': 'auto auto 4.2m',
              'field-of-view': '32deg',
              loading: 'eager',
              onError: () => setModelState('failed'),
            })}
          </div>
        )
        : null}

      {!showModel && imagePath && !imageFailed ? (
        <img
          src={imagePath}
          alt={`Archive placeholder for ${title}`}
          onError={() => setImageFailed(true)}
        />
      ) : null}

      {!showModel && (!imagePath || imageFailed) ? (
        <div className="object-media__placeholder" role="img" aria-label="Mug image placeholder">
          <span>Placeholder mug image</span>
        </div>
      ) : null}

      {modelPath ? (
        <p className="object-model-viewer__status" aria-live="polite">
          {modelState === 'checking'
            ? 'Checking 3D model file...'
            : modelState === 'loadingViewer'
              ? 'Loading interactive 3D mug...'
              : modelState === 'ready'
                ? `Interactive 3D mug model: ${modelPath}`
                : `${reason} Expected file location: ${modelPublicPath}.`}
        </p>
      ) : (
        <p className="object-model-viewer__status">{reason}</p>
      )}
    </div>
  );
}

export default ObjectModelViewer;
