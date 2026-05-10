import { useEffect, useMemo, useState } from 'react';
import ArchiveTexture from '../components/ArchiveTexture';
import GlitchText from '../components/GlitchText';
import LayerTransition from '../components/LayerTransition';
import ProjectionWall from '../components/ProjectionWall';
import RedactedText from '../components/RedactedText';
import ScanlineOverlay from '../components/ScanlineOverlay';
import SoundManager from '../components/SoundManager';
import SourceBadge from '../components/object/SourceBadge';
import { layerAudioPaths } from '../data/layerAudio';
import { archiveMugs } from '../data/mugs';
import { useCommunityArchive } from '../hooks/useCommunityArchive';
import {
  clearStoredSpeculativeFragments,
  readStoredSpeculativeFragments,
  type SpeculativeNarrativeFragment,
} from '../services/speculativeNarrative';
import type { AnnotationType, LayerState, MugRecord, NarrativeFragment } from '../types/archive';
import '../styles/projection.css';

const layerOrder: LayerState[] = ['surface', 'middle', 'core'];

const annotationLabels: Record<AnnotationType, string> = {
  question: 'Visitor question',
  counterReading: 'Visitor counter-reading',
  memory: 'Visitor memory',
  dispute: 'Visitor dispute',
};

const layerDescriptions: Record<LayerState, string> = {
  surface: 'Official record layer for catalogue facts and visible object metadata.',
  middle: 'Interpretive layer for labelled inference, speculation, and social readings.',
  core: 'Unresolved layer for redaction, opacity, and local visitor memory.',
};

const layerPourValues: Record<LayerState, number> = {
  surface: 0.12,
  middle: 0.56,
  core: 1,
};

interface ProjectionStoryGroup {
  mug: MugRecord;
  fragments: NarrativeFragment[];
}

function getFragmentsForMug(mug: MugRecord, layer: LayerState): NarrativeFragment[] {
  if (layer === 'surface') {
    return mug.facts;
  }

  if (layer === 'middle') {
    return mug.middleReadings;
  }

  return mug.coreFragments;
}

function getStoryGroupsForLayer(layer: LayerState): ProjectionStoryGroup[] {
  return archiveMugs
    .map((mug) => ({
      mug,
      fragments: getFragmentsForMug(mug, layer),
    }))
    .filter((group) => group.fragments.length > 0);
}

function Projection() {
  const [activeLayer, setActiveLayer] = useState<LayerState>('surface');
  const [speculativeFragments, setSpeculativeFragments] = useState<
    SpeculativeNarrativeFragment[]
  >([]);
  const { allContributions, clearContributions } = useCommunityArchive();
  const storyGroups = useMemo(() => getStoryGroupsForLayer(activeLayer), [activeLayer]);
  const activeLayerAnnotations = useMemo(
    () => allContributions.filter((annotation) => annotation.layerState === activeLayer),
    [activeLayer, allContributions],
  );
  const knownMugIds = useMemo(() => new Set(archiveMugs.flatMap((mug) => [mug.id, mug.slug])), []);
  const orphanLayerAnnotations = useMemo(
    () => activeLayerAnnotations.filter((annotation) => !knownMugIds.has(annotation.mugId)),
    [activeLayerAnnotations, knownMugIds],
  );
  const activeSpeculativeFragments = useMemo(
    () => speculativeFragments.filter((fragment) => fragment.layer === activeLayer),
    [activeLayer, speculativeFragments],
  );

  useEffect(() => {
    setSpeculativeFragments(readStoredSpeculativeFragments());
  }, []);

  function handleClearProjectionDemoData() {
    clearContributions();
    clearStoredSpeculativeFragments();
    setSpeculativeFragments([]);
  }

  return (
    <section
      className={`page-section projection-shell glitch-${activeLayer} glitch-layer-${activeLayer}`}
      aria-labelledby="projection-title"
    >
      <div className="projection-stage">
        <ArchiveTexture layerState={activeLayer} variant="halftone" />
        <LayerTransition layerState={activeLayer} pourValue={layerPourValues[activeLayer]} />
        <ScanlineOverlay layerState={activeLayer} />

        <div className="projection-stage__header">
          <p className="eyebrow">Projection / sound wall</p>
          <GlitchText as="h1" id="projection-title" layerState={activeLayer}>
            The archive pours outward.
          </GlitchText>
          <p className="lead">
            Installation mode for a wall projection or room speaker. It mirrors the mug
            layer system without camera or motion permissions.
          </p>
        </div>

        <div className="projection-controls" aria-label="Projection layer controls">
          {layerOrder.map((layer) => (
            <button
              key={layer}
              type="button"
              className={activeLayer === layer ? 'active' : undefined}
              onClick={() => setActiveLayer(layer)}
              aria-pressed={activeLayer === layer}
            >
              {layer}
            </button>
          ))}
        </div>

        <div className="projection-wall" aria-live="polite">
          <article className="projection-wall__panel">
            <span className="layer-label">{activeLayer}</span>
            <h2>{layerDescriptions[activeLayer]}</h2>

            <div className="projection-story-groups">
              {storyGroups.map(({ mug, fragments }) => {
                const mugAnnotations = activeLayerAnnotations.filter(
                  (annotation) => annotation.mugId === mug.id || annotation.mugId === mug.slug,
                );

                return (
                  <section key={mug.id} className="projection-story-card">
                    <div className="projection-story-card__header">
                      <p className="projection-story-card__kicker">Mug story</p>
                      <h3>{mug.title}</h3>
                      <p>{mug.dateRange ?? 'Date pending verification'}</p>
                    </div>

                    <div className="projection-fragments">
                      {fragments.map((fragment) => (
                        <section
                          key={fragment.id}
                          className={`projection-fragment projection-fragment--${fragment.sourceType}`}
                        >
                          <SourceBadge type={fragment.sourceType} />
                          <h4>{fragment.title}</h4>
                          <p>
                            {fragment.sourceType === 'redacted' ? (
                              <>
                                <RedactedText text={fragment.text} layerState={activeLayer} />{' '}
                                <span className="projection-fragment__note">
                                  Redaction remains visible as an archive state.
                                </span>
                              </>
                            ) : (
                              fragment.text
                            )}
                          </p>
                        </section>
                      ))}

                      {mugAnnotations.map((annotation) => (
                        <section
                          key={annotation.id}
                          className="projection-fragment projection-fragment--visitor"
                        >
                          <SourceBadge type={annotation.sourceType} />
                          <h4>
                            {annotation.featured ? 'Featured ' : ''}
                            {annotationLabels[annotation.type]}
                          </h4>
                          <p>{annotation.text}</p>
                          <p className="projection-fragment__note">
                            Local visitor contribution, not museum fact. {annotation.upvotes} upvotes.
                          </p>
                        </section>
                      ))}
                    </div>
                  </section>
                );
              })}

              {orphanLayerAnnotations.length > 0 ? (
                <section className="projection-story-card projection-story-card--local">
                  <div className="projection-story-card__header">
                    <p className="projection-story-card__kicker">Local-only</p>
                    <h3>Visitor fragments not linked to a current mug</h3>
                    <p>These remain in this browser only.</p>
                  </div>

                  <div className="projection-fragments">
                    {orphanLayerAnnotations.map((annotation) => (
                      <section
                        key={annotation.id}
                        className="projection-fragment projection-fragment--visitor"
                      >
                        <SourceBadge type={annotation.sourceType} />
                        <h4>{annotationLabels[annotation.type]}</h4>
                        <p>{annotation.text}</p>
                        <p className="projection-fragment__note">
                          Local visitor contribution, not museum fact. {annotation.upvotes} upvotes.
                        </p>
                      </section>
                    ))}
                  </div>
                </section>
              ) : null}

              {activeSpeculativeFragments.length > 0 ? (
                <section className="projection-story-card projection-story-card--speculative">
                  <div className="projection-story-card__header">
                    <p className="projection-story-card__kicker">Speculative AI mirror</p>
                    <h3>Generated prompts, not verified history</h3>
                    <p>These are local prototype outputs and are not object record sources.</p>
                  </div>

                  <div className="projection-fragments">
                    {activeSpeculativeFragments.map((fragment) => (
                      <section
                        key={fragment.id}
                        className="projection-fragment projection-fragment--speculative"
                      >
                        <SourceBadge type="speculation" />
                        <h4>{fragment.title}</h4>
                        <p>{fragment.text}</p>
                        <p className="projection-fragment__note">{fragment.disclaimer}</p>
                      </section>
                    ))}
                  </div>
                </section>
              ) : null}
            </div>
          </article>

          <SoundManager
            layerState={activeLayer}
            audioPaths={layerAudioPaths}
            pourValue={layerPourValues[activeLayer]}
          />
          <ProjectionWall
            mugs={archiveMugs}
            contributions={allContributions}
            onClearDemoData={handleClearProjectionDemoData}
          />
        </div>
      </div>
    </section>
  );
}

export default Projection;
