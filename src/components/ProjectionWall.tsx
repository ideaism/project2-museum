import { useMemo, useRef, useState } from 'react';
import {
  sortCommunityContributions,
  type CommunityContribution,
} from '../services/communityArchive';
import type { AnnotationType, LayerState, MugRecord } from '../types/archive';
import FloatingFragments, { type FloatingFragment } from './FloatingFragments';

const annotationTitles: Record<AnnotationType, string> = {
  question: 'Visitor question',
  counterReading: 'Visitor counter-reading',
  memory: 'Visitor memory',
  dispute: 'Visitor dispute',
};

type ShadowFilter = LayerState | 'visitor';

const shadowFilters: Array<{ value: ShadowFilter; label: string }> = [
  { value: 'surface', label: 'Surface' },
  { value: 'middle', label: 'Middle' },
  { value: 'core', label: 'Core' },
  { value: 'visitor', label: 'Visitor' },
];

interface ProjectionWallProps {
  mugs: MugRecord[];
  contributions: CommunityContribution[];
  onClearDemoData: () => void;
}

function ProjectionWall({ mugs, contributions, onClearDemoData }: ProjectionWallProps) {
  const wallRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  const [activeFilter, setActiveFilter] = useState<ShadowFilter>('visitor');

  const officialFragments = useMemo<FloatingFragment[]>(() => {
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

    if (activeFilter === 'visitor') {
      return archiveFragments.filter((fragment) => fragment.sourceType === 'redacted').slice(0, 6);
    }

    return archiveFragments.filter((fragment) => fragment.layer === activeFilter);
  }, [activeFilter, mugs]);

  const visitorFragments = useMemo<FloatingFragment[]>(() => {
    const filteredContributions = activeFilter === 'visitor'
      ? contributions
      : contributions.filter((contribution) => contribution.layerState === activeFilter);

    return sortCommunityContributions(filteredContributions).map((contribution) => {
      const mug = mugs.find(
        (record) => record.id === contribution.mugId || record.slug === contribution.mugId,
      );

      return {
        id: contribution.id,
        mugTitle: mug?.title ?? contribution.mugId,
        layer: contribution.layerState,
        sourceType: contribution.sourceType,
        title: annotationTitles[contribution.type],
        text: contribution.text,
        upvotes: contribution.upvotes,
        featured: contribution.featured,
      };
    });
  }, [activeFilter, contributions, mugs]);

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
          <p>
            Local prototype storage only. Visitor text is separated from verified,
            inferred, speculative, and redacted archive fragments.
          </p>
        </div>
        <div className="shadow-archive-wall__controls" aria-label="Shadow archive controls">
          <button type="button" onClick={() => setPaused((current) => !current)}>
            {paused ? 'Resume' : 'Pause'}
          </button>
          <button type="button" onClick={handleFullscreen}>
            Full screen
          </button>
          {contributions.length > 0 ? (
            <button type="button" onClick={onClearDemoData}>
              Clear local demo data
            </button>
          ) : null}
        </div>
      </div>

      <div className="shadow-filter-controls" aria-label="Shadow archive filters">
        {shadowFilters.map((filter) => (
          <button
            key={filter.value}
            type="button"
            className={activeFilter === filter.value ? 'is-active' : undefined}
            aria-pressed={activeFilter === filter.value}
            onClick={() => setActiveFilter(filter.value)}
          >
            {filter.label}
          </button>
        ))}
      </div>

      <div className="shadow-archive-wall__sections">
        {activeFilter !== 'visitor' ? (
          <section aria-labelledby="shadow-official-title">
            <div className="shadow-archive-wall__section-heading">
              <p className="eyebrow">Official / labelled archive</p>
              <h3 id="shadow-official-title">{activeFilter} fragments</h3>
            </div>
            <FloatingFragments fragments={officialFragments} paused={paused} />
          </section>
        ) : null}

        <section aria-labelledby="shadow-visitor-title">
          <div className="shadow-archive-wall__section-heading">
            <p className="eyebrow">Visitor shadow archive</p>
            <h3 id="shadow-visitor-title">
              {activeFilter === 'visitor'
                ? 'Featured, upvoted, and recent visitor fragments'
                : `${activeFilter} visitor fragments`}
            </h3>
          </div>
          {visitorFragments.length > 0 ? (
            <FloatingFragments fragments={visitorFragments} paused={paused} />
          ) : (
            <p className="shadow-empty-state">
              No local visitor contributions for this filter yet. Add one from an object
              page to feed the projection wall.
            </p>
          )}
        </section>

        {activeFilter === 'visitor' ? (
          <section aria-labelledby="shadow-redaction-title">
            <div className="shadow-archive-wall__section-heading">
              <p className="eyebrow">Right to opacity</p>
              <h3 id="shadow-redaction-title">Redactions remain visible beside visitor memory</h3>
            </div>
            <FloatingFragments fragments={officialFragments} paused={paused} />
          </section>
        ) : null}
      </div>

      <div className="shadow-archive-wall__footer" aria-label="Projection status">
        <span>{mugs.length} mug stories</span>
        <span>{contributions.length} visitor contribution</span>
        <span>upvoted does not mean true</span>
      </div>
    </section>
  );
}

export default ProjectionWall;
