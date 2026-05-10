import { FormEvent, useEffect, useId, useState } from 'react';
import {
  generateSpeculativeNarrative,
  SPECULATIVE_AI_DISCLAIMER,
  SPECULATIVE_AI_LABEL,
  storeSpeculativeFragments,
  type SpeculativeMood,
  type SpeculativeNarrativeFragment,
} from '../services/speculativeNarrative';
import type { LayerState, MugRecord } from '../types/archive';
import SourceBadge from './object/SourceBadge';

const moodLabels: Record<SpeculativeMood, string> = {
  memory: 'Memory',
  dispute: 'Dispute',
  question: 'Question',
  counterReading: 'Counter-reading',
};

const layerLabels: Record<LayerState, string> = {
  surface: 'Surface',
  middle: 'Middle',
  core: 'Core',
};

interface SpeculativeNarrativeGeneratorProps {
  mug: MugRecord;
  layer: LayerState;
  onUseAsAnnotation?: (fragment: SpeculativeNarrativeFragment) => void;
}

function SpeculativeNarrativeGenerator({
  mug,
  layer,
  onUseAsAnnotation,
}: SpeculativeNarrativeGeneratorProps) {
  const inputId = useId();
  const layerId = useId();
  const moodId = useId();
  const [visitorInput, setVisitorInput] = useState('');
  const [selectedLayer, setSelectedLayer] = useState<LayerState>(layer);
  const [mood, setMood] = useState<SpeculativeMood>('question');
  const [isGenerating, setIsGenerating] = useState(false);
  const [fragments, setFragments] = useState<SpeculativeNarrativeFragment[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    setSelectedLayer(layer);
  }, [layer]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const prompt = visitorInput.trim();

    if (!prompt) {
      setError('Add a keyword or question before generating a speculative prompt.');
      return;
    }

    setError('');
    setIsGenerating(true);

    window.setTimeout(() => {
      const generatedFragments = generateSpeculativeNarrative({
        mug,
        visitorInput: prompt,
        layer: selectedLayer,
        mood,
      });

      storeSpeculativeFragments(generatedFragments);
      setFragments(generatedFragments);
      setIsGenerating(false);
    }, 760);
  }

  return (
    <section className="speculative-generator" aria-labelledby="speculative-generator-title">
      <div className="speculative-generator__header">
        <div>
          <p className="eyebrow">Speculative AI mirror</p>
          <h2 id="speculative-generator-title">Generate a labelled prompt</h2>
        </div>
        <span className="speculative-generator__label">{SPECULATIVE_AI_LABEL}</span>
      </div>

      <p className="speculative-generator__disclaimer">{SPECULATIVE_AI_DISCLAIMER}</p>
      <p className="speculative-generator__disclaimer">
        Local safety-bounded generator; no external AI provider is required for this
        prototype, and generated prompts are never treated as archive facts.
      </p>

      <form className="speculative-generator__form" onSubmit={handleSubmit}>
        <label htmlFor={inputId}>
          Visitor keyword or question
          <input
            id={inputId}
            value={visitorInput}
            maxLength={120}
            placeholder="Example: What does solidarity hide?"
            onChange={(event) => setVisitorInput(event.currentTarget.value)}
          />
        </label>

        <div className="speculative-generator__controls">
          <label htmlFor={layerId}>
            Layer
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

          <label htmlFor={moodId}>
            Mood
            <select
              id={moodId}
              value={mood}
              onChange={(event) => setMood(event.currentTarget.value as SpeculativeMood)}
            >
              {Object.entries(moodLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <button type="submit" disabled={isGenerating}>
          {isGenerating ? 'Glitching fragment' : 'Generate speculative fragment'}
        </button>

        {error ? (
          <p className="speculative-generator__status" role="alert">
            {error}
          </p>
        ) : null}
      </form>

      {isGenerating ? (
        <div className="speculative-generator__static" role="status" aria-live="polite">
          <span>static</span>
          <span>redaction check</span>
          <span>source boundary check</span>
        </div>
      ) : null}

      {fragments.length > 0 ? (
        <div className="speculative-generator__results" aria-live="polite">
          {fragments.map((fragment) => (
            <article key={fragment.id} className="speculative-fragment">
              <div className="speculative-fragment__meta">
                <SourceBadge type="speculation" />
                <span>{fragment.label}</span>
                <span>{layerLabels[fragment.layer]}</span>
              </div>
              <h3>{fragment.title}</h3>
              <p>{fragment.text}</p>
              <p className="speculative-fragment__disclaimer">{fragment.disclaimer}</p>

              {onUseAsAnnotation ? (
                <button type="button" onClick={() => onUseAsAnnotation(fragment)}>
                  Use as local annotation draft
                </button>
              ) : null}
            </article>
          ))}
        </div>
      ) : null}

      <details className="speculative-generator__boundaries">
        <summary>Safety boundaries used by this prototype</summary>
        <ul>
          <li>No invented names, quotes, eyewitness claims, provenance, or personal memories.</li>
          <li>No confident historical claims without source evidence.</li>
          <li>No party propaganda and no romanticising suffering.</li>
          {(mug.aiSpeculation?.safeSpeculationBoundaries ?? []).map((boundary) => (
            <li key={boundary}>{boundary}</li>
          ))}
        </ul>
      </details>
    </section>
  );
}

export default SpeculativeNarrativeGenerator;
