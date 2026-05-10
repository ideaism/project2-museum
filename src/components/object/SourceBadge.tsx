import type { ArchiveSourceType } from '../../types/archive';
import { getSourceLabel } from '../../data/sourceLabels';

interface SourceBadgeProps {
  type: ArchiveSourceType;
}

function SourceBadge({ type }: SourceBadgeProps) {
  const label = getSourceLabel(type);

  return (
    <span
      className={`source-badge source-badge--${type}`}
      aria-label={`Source type: ${label.label}`}
      title={`${label.description} ${label.ethicsNote}`}
    >
      {label.label}
    </span>
  );
}

export default SourceBadge;
