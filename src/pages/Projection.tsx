import { useMemo, useState } from 'react';
import GlitchText from '../components/GlitchText';
import ProjectionWall from '../components/ProjectionWall';
import RedactedText from '../components/RedactedText';
import ScanlineOverlay from '../components/ScanlineOverlay';
import SoundManager from '../components/SoundManager';
import SourceBadge from '../components/object/SourceBadge';
import { placeholderMugs } from '../data/mugs';
import { useArchiveAnnotations } from '../hooks/useArchiveAnnotations';
import type { AnnotationType, LayerState, NarrativeFragment } from '../types/archive';
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

function getFragmentsForLayer(layer: LayerState): NarrativeFragment[] {
  return placeholderMugs.flatMap((mug) => {
    if (layer === 'surface') {
      return mug.facts;
    }

    if (layer === 'middle') {
      return mug.middleReadings;
    }

    return mug.coreFragments;
  });
}

function Projection() {
  const [activeLayer, setActiveLayer] = useState<LayerState>('surface');
  const { annotations, clearAnnotations } = useArchiveAnnotations();
  const fragments = useMemo(() => getFragmentsForLayer(activeLayer), [activeLayer]);
  const visitorAnnotations = useMemo(
    () => annotations.filter((annotation) => annotation.layer === activeLayer),
    [activeLayer, annotations],
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

            <div className="projection-fragments">
              {fragments.map((fragment) => (
                <section key={fragment.id} className="projection-fragment">
                  <SourceBadge type={fragment.sourceType} />
                  <h3>{fragment.title}</h3>
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
              {visitorAnnotations.map((annotation) => (
                <section key={annotation.id} className="projection-fragment">
                  <SourceBadge type={annotation.sourceType} />
                  <h3>{annotationLabels[annotation.type]}</h3>
                  <p>{annotation.text}</p>
                  <p className="projection-fragment__note">
                    Local visitor contribution, not museum fact.
                  </p>
                </section>
              ))}
            </div>
          </article>

          <SoundManager layerState={activeLayer} audioPaths={audioPaths} />
          <ProjectionWall
            mugs={placeholderMugs}
            annotations={annotations}
            onClearDemoData={() => clearAnnotations()}
          />
        </div>
      </div>
    </section>
  );
}

export default Projection;
