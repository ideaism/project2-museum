import { useCallback, useEffect, useMemo, useRef, useState, type RefObject } from 'react';

export type CameraStreamStatus =
  | 'idle'
  | 'checking'
  | 'starting'
  | 'active'
  | 'stopped'
  | 'unsupported'
  | 'error';

export interface CameraSupportSnapshot {
  isSecureContext: boolean;
  hasMediaDevices: boolean;
  hasGetUserMedia: boolean;
  canRequestCamera: boolean;
}

export interface CameraErrorInfo {
  name: string;
  message: string;
  fix: string;
}

export interface UseCameraStreamState {
  videoRef: RefObject<HTMLVideoElement | null>;
  stream: MediaStream | null;
  status: CameraStreamStatus;
  support: CameraSupportSnapshot;
  error: CameraErrorInfo | null;
  hasOpenedBasicCamera: boolean;
  startCamera: () => Promise<void>;
  startBackCamera: () => Promise<void>;
  stopCamera: () => void;
}

function getCameraSupport(): CameraSupportSnapshot {
  const hasWindow = typeof window !== 'undefined';
  const hasNavigator = typeof navigator !== 'undefined';
  const hasMediaDevices = Boolean(hasNavigator && navigator.mediaDevices);
  const hasGetUserMedia = Boolean(navigator.mediaDevices?.getUserMedia);
  const isSecureContext = Boolean(hasWindow && window.isSecureContext);

  return {
    isSecureContext,
    hasMediaDevices,
    hasGetUserMedia,
    canRequestCamera: isSecureContext && hasMediaDevices && hasGetUserMedia,
  };
}

function getCameraErrorInfo(error: unknown): CameraErrorInfo {
  const name = error instanceof Error ? error.name : 'UnknownError';
  const message =
    error instanceof Error && error.message
      ? error.message
      : 'The browser did not provide a camera error message.';

  const fixByName: Record<string, string> = {
    NotAllowedError:
      'Camera permission was blocked. Allow camera access for this site or reset the site permission in browser settings.',
    NotFoundError:
      'No camera was found. Check that the device has a camera and that the browser can see it.',
    NotReadableError:
      'The camera exists but cannot be read. Close Zoom, Teams, FaceTime, or other apps that may already be using it.',
    OverconstrainedError:
      'The requested camera constraints cannot be satisfied. Try the basic camera test before trying the back camera.',
    SecurityError:
      'The browser security policy blocked camera access. Use HTTPS, localhost, or an iframe with camera permission allowed.',
    TypeError:
      'The camera request was invalid or unavailable in this context. Check HTTPS/localhost and browser support.',
  };

  return {
    name,
    message,
    fix: fixByName[name] ?? 'Check browser camera permissions and try again from HTTPS or localhost.',
  };
}

function stopStream(stream: MediaStream | null) {
  stream?.getTracks().forEach((track) => track.stop());
}

export function useCameraStream(): UseCameraStreamState {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [status, setStatus] = useState<CameraStreamStatus>('checking');
  const [error, setError] = useState<CameraErrorInfo | null>(null);
  const [hasOpenedBasicCamera, setHasOpenedBasicCamera] = useState(false);
  const support = useMemo(getCameraSupport, []);

  const stopCamera = useCallback(() => {
    stopStream(streamRef.current);
    streamRef.current = null;
    setStream(null);

    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.srcObject = null;
    }

    setStatus((currentStatus) => (currentStatus === 'unsupported' ? currentStatus : 'stopped'));
  }, []);

  const startWithConstraints = useCallback(
    async (constraints: MediaStreamConstraints, isBasicCamera: boolean) => {
      setError(null);

      if (!support.canRequestCamera) {
        setStatus('unsupported');
        setError({
          name: 'UnsupportedEnvironment',
          message: 'This page cannot call navigator.mediaDevices.getUserMedia.',
          fix: 'Use HTTPS or localhost in a browser that supports camera access.',
        });
        return;
      }

      stopCamera();
      setStatus('starting');

      try {
        const nextStream = await navigator.mediaDevices.getUserMedia(constraints);

        streamRef.current = nextStream;
        setStream(nextStream);

        if (videoRef.current) {
          videoRef.current.srcObject = nextStream;
          videoRef.current.muted = true;
          videoRef.current.playsInline = true;
          await videoRef.current.play();
        }

        if (isBasicCamera) {
          setHasOpenedBasicCamera(true);
        }

        setStatus('active');
      } catch (nextError) {
        stopStream(streamRef.current);
        streamRef.current = null;
        setStream(null);
        setStatus('error');
        setError(getCameraErrorInfo(nextError));
      }
    },
    [stopCamera, support.canRequestCamera],
  );

  const startCamera = useCallback(
    () => startWithConstraints({ video: true, audio: false }, true),
    [startWithConstraints],
  );

  const startBackCamera = useCallback(
    () =>
      startWithConstraints(
        {
          video: {
            facingMode: { ideal: 'environment' },
          },
          audio: false,
        },
        false,
      ),
    [startWithConstraints],
  );

  useEffect(() => {
    setStatus(support.canRequestCamera ? 'idle' : 'unsupported');
  }, [support.canRequestCamera]);

  useEffect(() => stopCamera, [stopCamera]);

  return {
    videoRef,
    stream,
    status,
    support,
    error,
    hasOpenedBasicCamera,
    startCamera,
    startBackCamera,
    stopCamera,
  };
}
