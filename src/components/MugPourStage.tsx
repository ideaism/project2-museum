import ObjectModelViewer from './object/ObjectModelViewer';
import RedactedText from './RedactedText';
import ScanlineOverlay from './ScanlineOverlay';
import SourceBadge from './object/SourceBadge';
import type { MugRecord, NarrativeFragment } from '../types/archive';
import type { PourInteractionState } from '../types/interaction';
import type { CSSProperties } from 'react';

interface MugPourStageProps {
  mug: MugRecord;
  interaction: PourInteractionState;
  fragments: NarrativeFragment[];
}

function MugPourStage({ mug, interaction, fragments }: MugPourStageProps) {
  const visibleFragments = fragments.slice(0, 3);
  const style = {
    '--pour-value': String(interaction.pourValue),
    '--mug-rotation': `${interaction.mugRotationDeg}deg`,
    '--spill-opacity': String(0.48 + interaction.pourValue * 0.52),
    '--spill-shift': `${interaction.pourValue * 0.9}rem`,
    '--spill-rise': `${(1 - interaction.pourValue) * 0.5}rem`,
  } as CSSProperties;

  return (
    <div
      className="mug-pour-stage"
      data-layer={interaction.layerState}
      data-transition={interaction.contentTransitionState}
      style={style}
    >
      <ScanlineOverlay layerState={interaction.layerState} active={interaction.pourValue > 0.18} />
      <ObjectModelViewer
        title={mug.title}
        layer={interaction.layerState}
        modelPath={mug.modelPath}
        imagePath={mug.imagePath}
        pourValue={interaction.pourValue}
        mugRotationDeg={interaction.mugRotationDeg}
      />

      <div className="mug-pour-stage__fragments" aria-hidden="true">
        {visibleFragments.map((fragment, index) => (
          <span
            key={fragment.id}
            style={
              {
                left: `${8 + index * 9}%`,
                bottom: `${22 + index * 7}%`,
                opacity:
                  interaction.contentTransitionState === 'settled'
                    ? 0
                    : 0.12 + interaction.pourValue * 0.82,
                transform: `translateY(${(1 - interaction.pourValue) * 3}rem) rotate(${
                  -10 + index * 6
                }deg)`,
              } as CSSProperties
            }
          >
            {fragment.title}
          </span>
        ))}
      </div>

      <div className="mug-pour-stage__spill" aria-label="Pour reveal fragments">
        {visibleFragments.map((fragment, index) => (
          <article
            key={fragment.id}
            className="mug-pour-stage__spill-fragment"
            style={
              {
                '--spill-index': String(index),
                '--spill-rotate': `${(index - 1) * 0.6}deg`,
              } as CSSProperties
            }
          >
            <div>
              <SourceBadge type={fragment.sourceType} />
              <strong>{fragment.title}</strong>
            </div>
            <p>
              {fragment.sourceType === 'redacted' ? (
                <RedactedText text={fragment.text} layerState={fragment.layer} />
              ) : (
                fragment.text
              )}
            </p>
          </article>
        ))}
      </div>

      <p className="mug-pour-stage__state" aria-live="polite">
        Mug rotation {interaction.mugRotationDeg} degrees. Archive transition:{' '}
        {interaction.contentTransitionState}. Sound intensity{' '}
        {Math.round(interaction.soundIntensity * 100)}%.
      </p>
    </div>
  );
}

export default MugPourStage;
