import { useCallback, useEffect, useMemo, useState } from 'react';
import type { LayerState } from '../types/archive';
import type {
  ExternalPourInput,
  PourInputSource,
  PourInputStatus,
  PourInteractionState,
  UsePourInteractionOptions,
} from '../types/interaction';
import {
  clampPourValue,
  getPourValueForLayerState,
  mapPourValueToContentTransitionState,
  mapPourValueToLayerState,
} from '../utils/pourMapping';
import { useDeviceTilt } from './useDeviceTilt';

function getMugRotationDeg(pourValue: number) {
  return Math.round(clampPourValue(pourValue) * 112);
}

function canUseExternalInput(input: ExternalPourInput | null | undefined) {
  return (
    Boolean(input) &&
    input?.isActive !== false &&
    typeof input?.pourValue === 'number' &&
    Number.isFinite(input.pourValue) &&
    (input.status === undefined || input.status === 'tracking')
  );
}

function getManualSensorStatus(
  permissionState: PourInteractionState['permissionState'],
  inputSource: PourInteractionState['inputSource'],
): PourInputStatus {
  if (inputSource === 'device-tilt') {
    return 'tracking';
  }

  if (inputSource === 'slider' || inputSource === 'keyboard') {
    return 'manualFallback';
  }

  if (permissionState === 'prompt') {
    return 'permissionNeeded';
  }

  if (permissionState === 'unavailable') {
    return 'unavailable';
  }

  if (permissionState === 'denied') {
    return 'failed';
  }

  return 'manualFallback';
}

function getGestureExternalInput({
  gesturePourValue,
  gestureConfidence,
  gestureStatus,
}: UsePourInteractionOptions): ExternalPourInput | undefined {
  if (typeof gesturePourValue !== 'number' || !Number.isFinite(gesturePourValue)) {
    return undefined;
  }

  return {
    source: 'gesture',
    pourValue: gesturePourValue,
    confidence: gestureConfidence,
    status: gestureStatus ?? 'tracking',
    isActive: true,
  };
}

function isTypingTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  return (
    target.isContentEditable ||
    target.tagName === 'INPUT' ||
    target.tagName === 'TEXTAREA' ||
    target.tagName === 'SELECT'
  );
}

export function usePourInteraction(
  initialPourValue = 0,
  options: UsePourInteractionOptions = {},
): PourInteractionState {
  const tilt = useDeviceTilt(initialPourValue);
  const [storedExternalInput, setStoredExternalInput] = useState<ExternalPourInput>();
  const configuredExternalInput =
    options.externalInput ?? getGestureExternalInput(options) ?? storedExternalInput;
  const isUsingExternalInput = canUseExternalInput(configuredExternalInput);
  const activePourValue = isUsingExternalInput
    ? clampPourValue(configuredExternalInput?.pourValue ?? 0)
    : tilt.pourValue;
  const activeLayerState = mapPourValueToLayerState(activePourValue);
  const activeInputSource = isUsingExternalInput
    ? configuredExternalInput?.source ?? tilt.inputSource
    : tilt.inputSource;
  const activeInputStatus: PourInputStatus =
    isUsingExternalInput
      ? (configuredExternalInput?.status ?? 'tracking')
      : getManualSensorStatus(tilt.permissionState, activeInputSource);
  const inputConfidence =
    typeof configuredExternalInput?.confidence === 'number'
      ? clampPourValue(configuredExternalInput.confidence)
      : undefined;

  const setSliderPourValue = useCallback(
    (value: number) => {
      setStoredExternalInput(undefined);
      tilt.setManualPourValue(value);
    },
    [tilt.setManualPourValue],
  );

  const setKeyboardPourValue = useCallback(
    (value: number) => {
      setStoredExternalInput(undefined);
      tilt.setPourValueFromSource(value, 'keyboard');
    },
    [tilt.setPourValueFromSource],
  );

  const setManualPourValue = setSliderPourValue;

  const setLayerState = useCallback(
    (layer: LayerState) => {
      setKeyboardPourValue(getPourValueForLayerState(layer));
    },
    [setKeyboardPourValue],
  );

  const setExternalPourInput = useCallback(
    (input?: ExternalPourInput | null) => {
      setStoredExternalInput(input ?? undefined);
    },
    [],
  );

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.defaultPrevented || isTypingTarget(event.target)) {
        return;
      }

      if (event.key === '1') {
        event.preventDefault();
        setLayerState('surface');
        return;
      }

      if (event.key === '2') {
        event.preventDefault();
        setLayerState('middle');
        return;
      }

      if (event.key === '3') {
        event.preventDefault();
        setLayerState('core');
        return;
      }

      if (event.key === 'ArrowUp') {
        event.preventDefault();
        setKeyboardPourValue(activePourValue + 0.05);
        return;
      }

      if (event.key === 'ArrowDown') {
        event.preventDefault();
        setKeyboardPourValue(activePourValue - 0.05);
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activePourValue, setKeyboardPourValue, setLayerState]);

  return useMemo(
    () => ({
      ...tilt,
      pourValue: activePourValue,
      layerState: activeLayerState,
      inputSource: activeInputSource as PourInputSource,
      inputStatus: activeInputStatus,
      confidence: inputConfidence,
      inputConfidence,
      gestureConfidence:
        configuredExternalInput?.source === 'gesture' ? inputConfidence : undefined,
      externalInput: configuredExternalInput ?? undefined,
      setSliderPourValue,
      setKeyboardPourValue,
      setManualPourValue,
      contentTransitionState: mapPourValueToContentTransitionState(activePourValue),
      mugRotationDeg: getMugRotationDeg(activePourValue),
      soundIntensity: clampPourValue(activePourValue),
      setLayerState,
      setExternalPourInput,
    }),
    [
      activeInputSource,
      activeInputStatus,
      activeLayerState,
      activePourValue,
      configuredExternalInput,
      inputConfidence,
      setExternalPourInput,
      setLayerState,
      setKeyboardPourValue,
      setManualPourValue,
      setSliderPourValue,
      tilt,
    ],
  );
}
