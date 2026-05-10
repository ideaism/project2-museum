import { getSourceLabel } from '../data/sourceLabels';
import type { ArchiveSourceType } from '../types/archive';

interface SourceTypeLabelProps {
  type: ArchiveSourceType;
  className?: string;
}

function SourceTypeLabel({ type, className }: SourceTypeLabelProps) {
  const label = getSourceLabel(type);

  return (
    <span
      className={['source-type-label', `source-type-label--${type}`, className]
        .filter(Boolean)
        .join(' ')}
      aria-label={`Source type: ${label.label}`}
      title={`${label.description} ${label.ethicsNote}`}
    >
      {label.label}
    </span>
  );
}

export default SourceTypeLabel;
