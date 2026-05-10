import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type {
  DeviceTiltState,
  PourInputSource,
  TiltPermissionState,
} from '../types/interaction';
import {
  clampPourValue,
  mapDeviceOrientationToPourValue,
  mapPourValueToLayerState,
} from '../utils/pourMapping';

type PermissionResponse = 'granted' | 'denied';
type OrientationBaseline = { beta: number; gamma: number };

type DeviceOrientationEventWithPermission = typeof DeviceOrientationEvent & {
  requestPermission?: () => Promise<PermissionResponse>;
};

function canUseDeviceOrientation() {
  return typeof window !== 'undefined' && 'DeviceOrientationEvent' in window;
}

function getOrientationEventConstructor() {
  if (!canUseDeviceOrientation()) {
    return undefined;
  }

  return window.DeviceOrientationEvent as DeviceOrientationEventWithPermission;
}

function getInitialPermissionState(): TiltPermissionState {
  if (!canUseDeviceOrientation()) {
    return 'unavailable';
  }

  const OrientationEvent = getOrientationEventConstructor();
  return OrientationEvent?.requestPermission ? 'prompt' : 'granted';
}

export function useDeviceTilt(initialPourValue = 0): DeviceTiltState {
  const [pourValue, setPourValue] = useState(() => clampPourValue(initialPourValue));
  const [permissionState, setPermissionState] =
    useState<TiltPermissionState>(getInitialPermissionState);
  const [inputSource, setInputSource] = useState<PourInputSource>('slider');
  const orientationBaselineRef = useRef<OrientationBaseline | null>(null);
  const hasSensorEventRef = useRef(false);
  const isSupported = canUseDeviceOrientation();

  const requestPermission = useCallback(async () => {
    const OrientationEvent = getOrientationEventConstructor();

    if (!OrientationEvent) {
      setPermissionState('unavailable');
      setInputSource('slider');
      return 'unavailable';
    }

    orientationBaselineRef.current = null;
    hasSensorEventRef.current = false;

    if (typeof OrientationEvent.requestPermission !== 'function') {
      setPermissionState('granted');
      setInputSource('device-tilt');
      return 'granted';
    }

    try {
      const result = await OrientationEvent.requestPermission();
      const nextState: TiltPermissionState =
        result === 'granted' ? 'granted' : 'denied';
      setPermissionState(nextState);
      setInputSource(nextState === 'granted' ? 'device-tilt' : 'slider');
      return nextState;
    } catch {
      setPermissionState('denied');
      setInputSource('slider');
      return 'denied';
    }
  }, []);

  const setPourValueFromSource = useCallback((value: number, source: PourInputSource) => {
    setInputSource(source);
    setPourValue(clampPourValue(value));
  }, []);

  const setManualPourValue = useCallback(
    (value: number) => {
      setPourValueFromSource(value, 'slider');
    },
    [setPourValueFromSource],
  );

  useEffect(() => {
    if (!isSupported || permissionState !== 'granted' || inputSource !== 'device-tilt') {
      return undefined;
    }

    hasSensorEventRef.current = false;

    function handleOrientation(event: DeviceOrientationEvent) {
      const beta = Number.isFinite(event.beta) ? Number(event.beta) : 0;
      const gamma = Number.isFinite(event.gamma) ? Number(event.gamma) : 0;

      hasSensorEventRef.current = true;

      if (!orientationBaselineRef.current) {
        orientationBaselineRef.current = { beta, gamma };
        setPourValue(0);
        return;
      }

      const baseline = orientationBaselineRef.current;
      setPourValue(
        mapDeviceOrientationToPourValue({
          beta: beta - baseline.beta,
          gamma: gamma - baseline.gamma,
        }),
      );
    }

    const unavailableTimer = window.setTimeout(() => {
      if (!hasSensorEventRef.current) {
        setPermissionState('unavailable');
        setInputSource('slider');
      }
    }, 2500);

    window.addEventListener('deviceorientation', handleOrientation);
    return () => {
      window.clearTimeout(unavailableTimer);
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, [inputSource, isSupported, permissionState]);

  const layerState = useMemo(
    () => mapPourValueToLayerState(pourValue),
    [pourValue],
  );

  return {
    pourValue,
    layerState,
    permissionState,
    requestPermission,
    isSupported,
    setManualPourValue,
    setPourValueFromSource,
    inputSource,
  };
}
