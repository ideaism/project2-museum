import { Link } from 'react-router-dom';
import ArchiveCard from '../components/ArchiveCard';
import GlitchBadge from '../components/GlitchBadge';
import GlitchText from '../components/GlitchText';
import { archiveMugs } from '../data/mugs';

function Home() {
  const featuredMug = archiveMugs[0];

  return (
    <section className="page-section hero-section" aria-labelledby="home-title">
      <div className="content-stack">
        <p className="eyebrow">Camera gesture museum prototype</p>
        <GlitchText as="h1" id="home-title" layerState="middle">
          A mobile-first archive for political ceramic mugs.
        </GlitchText>
        <p className="lead">
          Use the camera as a local gesture sensor: hold a hand as if holding a mug,
          rotate as if pouring, or use the no-camera walkthrough to reveal surface
          facts, middle readings, and core redactions or visitor memory.
        </p>
        <div className="action-row" aria-label="Prototype entry points">
          <Link className="button-link primary" to={`/gesture/${featuredMug.slug}`}>
            Start gesture pour
          </Link>
          <Link className="button-link" to={`/object/${featuredMug.slug}`}>
            Open no-camera walkthrough
          </Link>
          <Link className="button-link" to="/projection">
            Open projection wall
          </Link>
        </div>
      </div>

      <ArchiveCard className="archive-card" layerState="middle" labelledBy="home-featured-title">
        <p className="eyebrow">Installation system</p>
        <h2 id="home-featured-title">{featuredMug.title}</h2>
        <p>
          Physical cup, camera gesture route, no-camera layer walkthrough, local
          annotation prompt, and projection mode share the same mug record.
        </p>
        <div className="archive-card__layers" aria-label="Narrative layers">
          <GlitchBadge layerState="surface">surface</GlitchBadge>
          <GlitchBadge layerState="middle" tone="warning">
            middle
          </GlitchBadge>
          <GlitchBadge layerState="core" tone="dark">
            core
          </GlitchBadge>
        </div>
        <Link className="button-link" to="/about">
          Read design statement
        </Link>
      </ArchiveCard>
    </section>
  );
}

export default Home;
