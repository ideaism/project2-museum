import { useMemo, useRef, useState } from 'react';
import type { AnnotationType, MugRecord, VisitorAnnotation } from '../types/archive';
import FloatingFragments, { type FloatingFragment } from './FloatingFragments';

const annotationTitles: Record<AnnotationType, string> = {
  question: 'Visitor question',
  counterReading: 'Visitor counter-reading',
  memory: 'Visitor memory',
  dispute: 'Visitor dispute',
};

interface ProjectionWallProps {
  mugs: MugRecord[];
  annotations: VisitorAnnotation[];
  onClearDemoData: () => void;
}

function ProjectionWall({ mugs, annotations, onClearDemoData }: ProjectionWallProps) {
  const wallRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);

  const fragments = useMemo<FloatingFragment[]>(() => {
    const archiveFragments = mugs.flatMap((mug) =>
      [...mug.facts, ...mug.middleReadings, ...mug.coreFragments].map((fragment) => ({
        id: `${mug.id}-${fragment.id}`,
        mugTitle: mug.title,
        layer: fragment.layer,
        sourceType: fragment.sourceType,
        title: fragment.title,
        text: fragment.text,
      })),
    );

    const visitorFragments = annotations.map((annotation) => {
      const mug = mugs.find((record) => record.id === annotation.mugId || record.slug === annotation.mugId);

      return {
        id: annotation.id,
        mugTitle: mug?.title ?? annotation.mugId,
        layer: annotation.layer,
        sourceType: annotation.sourceType,
        title: annotationTitles[annotation.type],
        text: annotation.text,
      };
    });

    return [...visitorFragments, ...archiveFragments];
  }, [annotations, mugs]);

  async function handleFullscreen() {
    if (wallRef.current && document.fullscreenEnabled) {
      await wallRef.current.requestFullscreen();
    }
  }

  return (
    <section className="shadow-archive-wall" aria-labelledby="shadow-archive-title" ref={wallRef}>
      <div className="shadow-archive-wall__header">
        <div>
          <p className="eyebrow">Shadow archive</p>
          <h2 id="shadow-archive-title">Visitor fragments in projection space</h2>
        </div>
        <div className="shadow-archive-wall__controls" aria-label="Shadow archive controls">
          <button type="button" onClick={() => setPaused((current) => !current)}>
            {paused ? 'Resume' : 'Pause'}
          </button>
          <button type="button" onClick={handleFullscreen}>
            Full screen
          </button>
          {annotations.length > 0 ? (
            <button type="button" onClick={onClearDemoData}>
              Clear local demo data
            </button>
          ) : null}
        </div>
      </div>

      <FloatingFragments fragments={fragments} paused={paused} />

      <div className="shadow-archive-wall__footer" aria-label="Projection status">
        <span>{mugs.length} mug record</span>
        <span>{annotations.length} visitor contribution</span>
        <span>redactions remain visible</span>
      </div>
    </section>
  );
}

export default ProjectionWall;
