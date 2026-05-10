import { useCallback, useEffect, useMemo, useState } from 'react';
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
  const [inputSource, setInputSource] = useState<PourInputSource>('manual');
  const isSupported = canUseDeviceOrientation();

  const requestPermission = useCallback(async () => {
    const OrientationEvent = getOrientationEventConstructor();

    if (!OrientationEvent) {
      setPermissionState('unavailable');
      setInputSource('manual');
      return 'unavailable';
    }

    if (typeof OrientationEvent.requestPermission !== 'function') {
      setPermissionState('granted');
      setInputSource('sensor');
      return 'granted';
    }

    try {
      const result = await OrientationEvent.requestPermission();
      const nextState: TiltPermissionState =
        result === 'granted' ? 'granted' : 'denied';
      setPermissionState(nextState);
      setInputSource(nextState === 'granted' ? 'sensor' : 'manual');
      return nextState;
    } catch {
      setPermissionState('denied');
      setInputSource('manual');
      return 'denied';
    }
  }, []);

  const setManualPourValue = useCallback((value: number) => {
    setInputSource('manual');
    setPourValue(clampPourValue(value));
  }, []);

  useEffect(() => {
    if (!isSupported || permissionState !== 'granted' || inputSource !== 'sensor') {
      return undefined;
    }

    function handleOrientation(event: DeviceOrientationEvent) {
      setPourValue(
        mapDeviceOrientationToPourValue({
          beta: event.beta,
          gamma: event.gamma,
        }),
      );
    }

    window.addEventListener('deviceorientation', handleOrientation);
    return () => {
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
    inputSource,
  };
}
