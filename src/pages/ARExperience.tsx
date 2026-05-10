import { Link, Navigate, useParams } from 'react-router-dom';
import { findMugById } from '../data/mugs';

function ARExperience() {
  const { id } = useParams();
  const mug = findMugById(id);
  const targetSlug = mug?.slug ?? id ?? 'sample-mug';

  if (mug) {
    return <Navigate to={`/gesture/${targetSlug}`} replace />;
  }

  return (
    <section className="page-section" aria-labelledby="ar-migration-title">
      <p className="eyebrow">Prototype route update</p>
      <h1 id="ar-migration-title">
        This prototype now uses camera gesture pouring instead of AR marker tracking.
      </h1>
      <p className="lead">
        The requested mug record was not found, but the sample gesture route remains available
        without marker files, QR codes, or AR.js setup.
      </p>
      <div className="action-row">
        <Link className="button-link primary" to="/gesture/sample-mug">
          Open gesture sample
        </Link>
        <Link className="button-link" to="/object/sample-mug">
          Continue without camera
        </Link>
      </div>
    </section>
  );
}

export default ARExperience;
