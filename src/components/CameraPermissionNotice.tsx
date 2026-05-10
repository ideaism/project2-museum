import { Link } from 'react-router-dom';

export type CameraPermissionState =
  | 'checking'
  | 'prompt'
  | 'granted'
  | 'denied'
  | 'unsupported'
  | 'markerMissing'
  | 'error';

interface CameraPermissionNoticeProps {
  state: CameraPermissionState;
  fallbackPath: string;
  onRequestCamera: () => void;
  isRequesting?: boolean;
  markerPath?: string;
  markerLocalPath?: string;
  message?: string;
}

const copyByState: Record<
  CameraPermissionState,
  { title: string; body: string; action?: string }
> = {
  checking: {
    title: 'Checking camera access',
    body: 'The AR route is preparing the marker scanner and archive overlay.',
  },
  prompt: {
    title: 'Start marker scan',
    body: 'Use the camera to scan the printed AR.js marker card. The archive layer remains readable if camera or motion permissions are unavailable.',
    action: 'Start camera',
  },
  granted: {
    title: 'Camera enabled',
    body: 'Hold the phone over the printed marker card and tilt it as if pouring from the cup.',
  },
  denied: {
    title: 'Camera permission denied',
    body: 'The camera route cannot start without permission. The no-AR object page contains the same archive layers and manual pour control.',
  },
  unsupported: {
    title: 'Camera AR is unavailable here',
    body: 'This browser or context does not expose camera access for the prototype. Continue with the no-AR walkthrough.',
  },
  markerMissing: {
    title: 'Marker pattern file missing',
    body: 'Live marker tracking needs the .patt file at the exact path below. The archive overlay and manual pour control remain available for assessment.',
    action: 'Recheck marker',
  },
  error: {
    title: 'AR scanner did not start',
    body: 'The progressive AR wrapper could not load safely. Continue with the no-AR object page for review.',
    action: 'Try camera again',
  },
};

function CameraPermissionNotice({
  state,
  fallbackPath,
  onRequestCamera,
  isRequesting = false,
  markerPath,
  markerLocalPath,
  message,
}: CameraPermissionNoticeProps) {
  const copy = copyByState[state];
  const showRequestButton = state === 'prompt' || state === 'error' || state === 'markerMissing';
  const showFallbackLink =
    state === 'denied' ||
    state === 'unsupported' ||
    state === 'markerMissing' ||
    state === 'error';

  return (
    <aside className={`camera-notice camera-notice--${state}`} aria-live="polite">
      <div>
        <p className="eyebrow">Camera marker route</p>
        <h2>{copy.title}</h2>
        <p>{message ?? copy.body}</p>
        {markerPath ? (
          <p className="camera-notice__marker">
            Marker file: <code>{markerPath}</code>
          </p>
        ) : null}
        {state === 'markerMissing' ? (
          <p className="camera-notice__marker">
            Add the file under <code>{markerLocalPath ?? `public${markerPath}`}</code>,
            then print the matching square marker card for the physical cup label or
            plinth.
          </p>
        ) : null}
      </div>

      <div className="action-row">
        {showRequestButton ? (
          <button
            className="button-link primary"
            type="button"
            onClick={onRequestCamera}
            disabled={isRequesting}
          >
            {isRequesting ? 'Starting camera' : copy.action}
          </button>
        ) : null}
        {showFallbackLink ? (
          <Link className="button-link" to={fallbackPath}>
            Continue without AR
          </Link>
        ) : null}
      </div>
    </aside>
  );
}

export default CameraPermissionNotice;
