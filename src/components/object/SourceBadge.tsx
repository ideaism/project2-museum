import type { ArchiveSourceType } from '../../types/archive';
import SourceTypeLabel from '../SourceTypeLabel';

interface SourceBadgeProps {
  type: ArchiveSourceType;
}

function SourceBadge({ type }: SourceBadgeProps) {
  return <SourceTypeLabel type={type} className={`source-badge source-badge--${type}`} />;
}

export default SourceBadge;
