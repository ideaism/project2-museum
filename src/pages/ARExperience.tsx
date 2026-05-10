import { Link, useParams } from 'react-router-dom';
import ARScene from '../components/ARScene';
import { findMugById } from '../data/mugs';
import { useDeviceTilt } from '../hooks/useDeviceTilt';
import '../styles/ar.css';

function ARExperience() {
  const { id } = useParams();
  const mug = findMugById(id);
  const tilt = useDeviceTilt();

  if (!mug) {
    return (
      <section
        className="page-section ar-page ar-page--missing"
        aria-labelledby="missing-ar-title"
      >
        <p className="eyebrow">AR marker experience</p>
        <h1 id="missing-ar-title">Mug marker not found</h1>
        <p className="lead">
          The archive does not have a mug record for <strong>{id ?? 'this route'}</strong>.
          Open the sample marker route or continue with the no-AR object walkthrough.
        </p>
        <div className="action-row">
          <Link className="button-link primary" to="/ar/sample-mug">
            Open sample AR route
          </Link>
          <Link className="button-link" to="/object/sample-mug">
            Continue without AR
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="page-section ar-page">
      <ARScene mug={mug} tilt={tilt} />
    </section>
  );
}

export default ARExperience;
