import { FormEvent, useEffect, useId, useMemo, useState } from 'react';
import ContributionCard from './ContributionCard';
import { useCommunityArchive } from '../hooks/useCommunityArchive';
import {
  COMMUNITY_CONTRIBUTION_MAX_LENGTH,
  type CommunityContribution,
} from '../services/communityArchive';
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
  prefillDraft?: {
    id: string;
    text: string;
    type: AnnotationType;
    layer: LayerState;
  };
}

function AnnotationForm({ mugId, layer = 'core', prefillDraft }: AnnotationFormProps) {
  const textareaId = useId();
  const typeId = useId();
  const layerId = useId();
  const [text, setText] = useState('');
  const [type, setType] = useState<AnnotationType>('question');
  const [selectedLayer, setSelectedLayer] = useState<LayerState>(layer);
  const [error, setError] = useState('');
  const [savedMessage, setSavedMessage] = useState('');
  const {
    contributions,
    localVoteIds,
    addContribution,
    upvote,
    toggleFeatured,
    clearContributions,
  } = useCommunityArchive(mugId);

  useEffect(() => {
    setSelectedLayer(layer);
  }, [layer]);

  useEffect(() => {
    if (!prefillDraft) {
      return;
    }

    setText(prefillDraft.text);
    setType(prefillDraft.type);
    setSelectedLayer(prefillDraft.layer);
    setError('');
    setSavedMessage('Speculative AI fragment loaded as an editable local draft.');
  }, [prefillDraft]);

  const remainingCharacters = COMMUNITY_CONTRIBUTION_MAX_LENGTH - text.length;
  const parentContributions = useMemo(
    () => contributions.filter((contribution) => !contribution.responseToId),
    [contributions],
  );
  const responsesByParent = useMemo(() => {
    const grouped = new Map<string, CommunityContribution[]>();

    contributions.forEach((contribution) => {
      if (!contribution.responseToId) {
        return;
      }

      grouped.set(contribution.responseToId, [
        ...(grouped.get(contribution.responseToId) ?? []),
        contribution,
      ]);
    });

    return grouped;
  }, [contributions]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!text.trim()) {
      setError('Add a short question, memory, dispute, or counter-reading first.');
      setSavedMessage('');
      return;
    }

    try {
      addContribution({
        mugId,
        type,
        layerState: selectedLayer,
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
            maxLength={COMMUNITY_CONTRIBUTION_MAX_LENGTH}
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

      {parentContributions.length > 0 ? (
        <section className="annotation-list" aria-labelledby="recent-annotations-title">
          <div className="annotation-list__header">
            <div>
              <h3 id="recent-annotations-title">Community re-curation loop</h3>
              <p>
                Local prototype state. Featured and upvoted contributions can enter the
                projection wall, but they are not verified facts.
              </p>
            </div>
            <button type="button" onClick={() => clearContributions(mugId)}>
              Clear local demo data
            </button>
          </div>
          <div className="contribution-list">
            {parentContributions.map((contribution) => (
              <ContributionCard
                key={contribution.id}
                contribution={contribution}
                responses={responsesByParent.get(contribution.id)}
                hasVoted={localVoteIds.has(contribution.id)}
                onUpvote={upvote}
                onToggleFeatured={toggleFeatured}
                onRespond={(parent, responseText) => {
                  addContribution({
                    mugId,
                    layerState: parent.layerState,
                    type: 'counterReading',
                    text: responseText,
                    responseToId: parent.id,
                  });
                }}
              />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}

export default AnnotationForm;
