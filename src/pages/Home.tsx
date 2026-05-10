import { Link } from 'react-router-dom';
import { archiveMugs } from '../data/mugs';

function Home() {
  const featuredMug = archiveMugs[0];

  return (
    <section className="page-section hero-section" aria-labelledby="home-title">
      <div className="content-stack">
        <p className="eyebrow">Mobile WebAR museum prototype</p>
        <h1 id="home-title">A mobile-first archive for political ceramic mugs.</h1>
        <p className="lead">
          Scan a cup marker, tilt the phone as if pouring, or use the no-camera
          walkthrough to reveal surface facts, middle readings, and core redactions or
          visitor memory.
        </p>
        <div className="action-row" aria-label="Prototype entry points">
          <Link className="button-link primary" to={`/object/${featuredMug.slug}`}>
            Start no-AR walkthrough
          </Link>
          <Link className="button-link" to={`/ar/${featuredMug.slug}`}>
            Open AR marker route
          </Link>
          <Link className="button-link" to="/projection">
            Open projection wall
          </Link>
        </div>
      </div>

      <div className="archive-card" aria-label="Integrated prototype overview">
        <p className="eyebrow">Installation system</p>
        <h2>{featuredMug.title}</h2>
        <p>
          Physical cup plus QR/AR marker, mobile layer walkthrough, local annotation
          prompt, and projection mode share the same mug record.
        </p>
        <div className="archive-card__layers" aria-label="Narrative layers">
          <span className="layer-label">surface</span>
          <span className="layer-label">middle</span>
          <span className="layer-label">core</span>
        </div>
        <Link className="button-link" to="/about">
          Read design statement
        </Link>
      </div>
    </section>
  );
}

export default Home;
