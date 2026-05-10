import { FormEvent, useId, useState } from 'react';
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

interface ContributionCardProps {
  contribution: CommunityContribution;
  responses?: CommunityContribution[];
  hasVoted?: boolean;
  onUpvote: (contributionId: string) => void;
  onToggleFeatured: (contributionId: string) => void;
  onRespond: (parent: CommunityContribution, text: string) => void;
}

function formatDate(value: string) {
  try {
    return new Intl.DateTimeFormat(undefined, {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(value));
  } catch {
    return 'Local time unknown';
  }
}

function ContributionCard({
  contribution,
  responses = [],
  hasVoted = false,
  onUpvote,
  onToggleFeatured,
  onRespond,
}: ContributionCardProps) {
  const responseId = useId();
  const [responseText, setResponseText] = useState('');
  const [responseError, setResponseError] = useState('');

  function handleResponseSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = responseText.trim();

    if (!text) {
      setResponseError('Add a short local response first.');
      return;
    }

    onRespond(contribution, text);
    setResponseText('');
    setResponseError('');
  }

  return (
    <article className={contribution.featured ? 'contribution-card is-featured' : 'contribution-card'}>
      <div className="contribution-card__meta">
        <SourceBadge type={contribution.sourceType} />
        <span>{annotationTypeLabels[contribution.type]}</span>
        <span>{layerLabels[contribution.layerState]}</span>
        {contribution.featured ? <strong>Featured for projection</strong> : null}
      </div>

      <p className="contribution-card__text">{contribution.text}</p>

      <p className="contribution-card__ethics">
        Visitor contribution, not verified history. Upvoted does not mean true.
      </p>

      <div className="contribution-card__actions">
        <button type="button" onClick={() => onUpvote(contribution.id)} disabled={hasVoted}>
          {hasVoted ? 'Upvoted' : 'Upvote'} · {contribution.upvotes}
        </button>
        <button type="button" onClick={() => onToggleFeatured(contribution.id)}>
          {contribution.featured ? 'Unfeature' : 'Feature'}
        </button>
        <span>{formatDate(contribution.createdAt)}</span>
      </div>

      {responses.length > 0 ? (
        <div className="contribution-card__responses" aria-label="Local responses">
          {responses.map((response) => (
            <article key={response.id}>
              <div className="contribution-card__meta">
                <SourceBadge type={response.sourceType} />
                <span>{annotationTypeLabels[response.type]}</span>
              </div>
              <p>{response.text}</p>
            </article>
          ))}
        </div>
      ) : null}

      <form className="contribution-response-form" onSubmit={handleResponseSubmit}>
        <label htmlFor={responseId}>Respond locally</label>
        <textarea
          id={responseId}
          rows={2}
          maxLength={COMMUNITY_CONTRIBUTION_MAX_LENGTH}
          value={responseText}
          placeholder="Add a short question, memory, counter-reading, or dispute"
          onChange={(event) => setResponseText(event.currentTarget.value)}
        />
        <div className="contribution-response-form__footer">
          <span>{COMMUNITY_CONTRIBUTION_MAX_LENGTH - responseText.length} characters left</span>
          <button type="submit">Respond</button>
        </div>
        {responseError ? (
          <p className="annotation-form__status annotation-form__status--error" role="alert">
            {responseError}
          </p>
        ) : null}
      </form>
    </article>
  );
}

export default ContributionCard;
