import { FormEvent, useEffect, useId, useMemo, useState } from 'react';
import { ANNOTATION_MAX_LENGTH, useArchiveAnnotations } from '../hooks/useArchiveAnnotations';
import type { AnnotationType, LayerState } from '../types/archive';
import SourceBadge from './object/SourceBadge';

const annotationTypeLabels: Record<AnnotationType, string> = {
  question: 'Question',
  counterReading: 'Counter-reading',
  memory: 'Memory',
  dispute: 'Dispute',
};

const layerLabels: Record<LayerState, string> = {
  surface: 'Surface',
  middle: 'Middle',
  core: 'Core',
};

interface AnnotationFormProps {
  mugId: string;
  layer?: LayerState;
}

function AnnotationForm({ mugId, layer = 'core' }: AnnotationFormProps) {
  const textareaId = useId();
  const typeId = useId();
  const layerId = useId();
  const [text, setText] = useState('');
  const [type, setType] = useState<AnnotationType>('question');
  const [selectedLayer, setSelectedLayer] = useState<LayerState>(layer);
  const [error, setError] = useState('');
  const [savedMessage, setSavedMessage] = useState('');
  const { annotations, addAnnotation, clearAnnotations } = useArchiveAnnotations(mugId);

  useEffect(() => {
    setSelectedLayer(layer);
  }, [layer]);

  const remainingCharacters = ANNOTATION_MAX_LENGTH - text.length;
  const recentAnnotations = useMemo(() => annotations.slice(0, 3), [annotations]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!text.trim()) {
      setError('Add a short question, memory, dispute, or counter-reading first.');
      setSavedMessage('');
      return;
    }

    try {
      addAnnotation({
        mugId,
        type,
        layer: selectedLayer,
        text,
      });
      setText('');
      setError('');
      setSavedMessage('Saved locally as a visitor contribution.');
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : 'Unable to save.');
      setSavedMessage('');
    }
  }

  return (
    <div className="annotation-panel">
      <form className="annotation-form" onSubmit={handleSubmit}>
        <div className="annotation-form__header">
          <div>
            <p className="eyebrow">Local co-curation</p>
            <h2>What should this cup remember?</h2>
          </div>
          <SourceBadge type="visitorContribution" />
        </div>

        <div className="annotation-form__controls">
          <label htmlFor={typeId}>
            Contribution type
            <select
              id={typeId}
              value={type}
              onChange={(event) => setType(event.currentTarget.value as AnnotationType)}
            >
              {Object.entries(annotationTypeLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>

          <label htmlFor={layerId}>
            Archive layer
            <select
              id={layerId}
              value={selectedLayer}
              onChange={(event) => setSelectedLayer(event.currentTarget.value as LayerState)}
            >
              {Object.entries(layerLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className="annotation-form__textarea" htmlFor={textareaId}>
          Visitor contribution
          <textarea
            id={textareaId}
            value={text}
            maxLength={ANNOTATION_MAX_LENGTH}
            rows={4}
            placeholder="A short local note for the shadow archive"
            onChange={(event) => setText(event.currentTarget.value)}
          />
        </label>

        <div className="annotation-form__footer">
          <span aria-live="polite">{remainingCharacters} characters left</span>
          <button type="submit">Add to shadow archive</button>
        </div>

        <p className="annotation-form__privacy">
          No name, email, or phone field. This contribution stays in this browser.
        </p>

        {error ? (
          <p className="annotation-form__status annotation-form__status--error" role="alert">
            {error}
          </p>
        ) : null}
        {savedMessage ? (
          <p className="annotation-form__status" role="status">
            {savedMessage}
          </p>
        ) : null}
      </form>

      {recentAnnotations.length > 0 ? (
        <section className="annotation-list" aria-labelledby="recent-annotations-title">
          <div className="annotation-list__header">
            <h3 id="recent-annotations-title">Recent visitor contributions</h3>
            <button type="button" onClick={() => clearAnnotations(mugId)}>
              Clear local demo data
            </button>
          </div>
          <ul>
            {recentAnnotations.map((annotation) => (
              <li key={annotation.id}>
                <div>
                  <SourceBadge type={annotation.sourceType} />
                  <span>{annotationTypeLabels[annotation.type]}</span>
                  <span>{layerLabels[annotation.layer]}</span>
                </div>
                <p>{annotation.text}</p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}

export default AnnotationForm;
