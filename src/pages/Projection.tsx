import { useMemo, useState } from 'react';
import GlitchText from '../components/GlitchText';
import ProjectionWall from '../components/ProjectionWall';
import RedactedText from '../components/RedactedText';
import ScanlineOverlay from '../components/ScanlineOverlay';
import SoundManager from '../components/SoundManager';
import SourceBadge from '../components/object/SourceBadge';
import { archiveMugs } from '../data/mugs';
import { useArchiveAnnotations } from '../hooks/useArchiveAnnotations';
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

const audioPaths: Record<LayerState, string> = {
  surface: '/assets/archive/audio/projection-surface.mp3',
  middle: '/assets/archive/audio/projection-middle.mp3',
  core: '/assets/archive/audio/projection-core.mp3',
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
  const { annotations, clearAnnotations } = useArchiveAnnotations();
  const storyGroups = useMemo(() => getStoryGroupsForLayer(activeLayer), [activeLayer]);
  const activeLayerAnnotations = useMemo(
    () => annotations.filter((annotation) => annotation.layer === activeLayer),
    [activeLayer, annotations],
  );
  const knownMugIds = useMemo(() => new Set(archiveMugs.flatMap((mug) => [mug.id, mug.slug])), []);
  const orphanLayerAnnotations = useMemo(
    () => activeLayerAnnotations.filter((annotation) => !knownMugIds.has(annotation.mugId)),
    [activeLayerAnnotations, knownMugIds],
  );

  return (
    <section
      className={`page-section projection-shell glitch-${activeLayer} glitch-layer-${activeLayer}`}
      aria-labelledby="projection-title"
    >
      <div className="projection-stage">
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
                        <section key={fragment.id} className="projection-fragment">
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
                          <h4>{annotationLabels[annotation.type]}</h4>
                          <p>{annotation.text}</p>
                          <p className="projection-fragment__note">
                            Local visitor contribution, not museum fact.
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
                          Local visitor contribution, not museum fact.
                        </p>
                      </section>
                    ))}
                  </div>
                </section>
              ) : null}
            </div>
          </article>

          <SoundManager layerState={activeLayer} audioPaths={audioPaths} />
          <ProjectionWall
            mugs={archiveMugs}
            annotations={annotations}
            onClearDemoData={() => clearAnnotations()}
          />
        </div>
      </div>
    </section>
  );
}

export default Projection;
