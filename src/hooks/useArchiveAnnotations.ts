import { useCallback, useEffect, useMemo, useState } from 'react';
import type { AnnotationType, LayerState, VisitorAnnotation } from '../types/archive';

const STORAGE_KEY = 'glitchingArchive.annotations.v1';
export const ANNOTATION_MAX_LENGTH = 280;

const annotationTypes: AnnotationType[] = ['question', 'counterReading', 'memory', 'dispute'];
const layerStates: LayerState[] = ['surface', 'middle', 'core'];

interface AnnotationDraft {
  mugId: string;
  type: AnnotationType;
  layer: LayerState;
  text: string;
}

function createAnnotationId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }

  return `annotation-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function isVisitorAnnotation(value: unknown): value is VisitorAnnotation {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as Partial<VisitorAnnotation>;

  return (
    typeof candidate.id === 'string' &&
    typeof candidate.mugId === 'string' &&
    annotationTypes.includes(candidate.type as AnnotationType) &&
    layerStates.includes(candidate.layer as LayerState) &&
    typeof candidate.text === 'string' &&
    typeof candidate.createdAt === 'string' &&
    candidate.sourceType === 'visitorContribution'
  );
}

function readAnnotations() {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    const parsed: unknown = stored ? JSON.parse(stored) : [];

    return Array.isArray(parsed) ? parsed.filter(isVisitorAnnotation) : [];
  } catch {
    return [];
  }
}

function writeAnnotations(annotations: VisitorAnnotation[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(annotations));
}

export function useArchiveAnnotations(mugId?: string) {
  const [allAnnotations, setAllAnnotations] = useState<VisitorAnnotation[]>(readAnnotations);

  useEffect(() => {
    function handleStorage(event: StorageEvent) {
      if (event.key === STORAGE_KEY) {
        setAllAnnotations(readAnnotations());
      }
    }

    window.addEventListener('storage', handleStorage);

    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const annotations = useMemo(() => {
    if (!mugId) {
      return allAnnotations;
    }

    return allAnnotations.filter((annotation) => annotation.mugId === mugId);
  }, [allAnnotations, mugId]);

  const addAnnotation = useCallback((draft: AnnotationDraft) => {
    const text = draft.text.trim();

    if (!text) {
      throw new Error('Annotation text is required.');
    }

    if (text.length > ANNOTATION_MAX_LENGTH) {
      throw new Error(`Annotation text must be ${ANNOTATION_MAX_LENGTH} characters or fewer.`);
    }

    const annotation: VisitorAnnotation = {
      id: createAnnotationId(),
      mugId: draft.mugId,
      type: draft.type,
      layer: draft.layer,
      text,
      createdAt: new Date().toISOString(),
      sourceType: 'visitorContribution',
    };

    setAllAnnotations((current) => {
      const next = [annotation, ...current];
      writeAnnotations(next);
      return next;
    });

    return annotation;
  }, []);

  const clearAnnotations = useCallback((targetMugId?: string) => {
    setAllAnnotations((current) => {
      const next = targetMugId
        ? current.filter((annotation) => annotation.mugId !== targetMugId)
        : [];
      writeAnnotations(next);
      return next;
    });
  }, []);

  return {
    annotations,
    allAnnotations,
    addAnnotation,
    clearAnnotations,
  };
}
