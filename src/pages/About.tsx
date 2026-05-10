import { Link } from 'react-router-dom';

function About() {
  return (
    <section className="page-section about-page" aria-labelledby="about-title">
      <div className="content-stack">
        <p className="eyebrow">Design statement / AI process note</p>
        <h1 id="about-title">A cup that refuses one final reading.</h1>
        <p className="lead">
          The Glitching Archive is a mobile-first WebAR museum prototype for political
          ceramic mugs from a stored collection. It treats the mug as both an everyday
          vessel and a container of political memory.
        </p>
      </div>

      <div className="layer-grid" aria-label="Archive layer principles">
        <article>
          <span className="layer-label">surface</span>
          <h2>Known record</h2>
          <p>
            The surface layer holds object facts, collection metadata, and explicit
            placeholders where maker, date, accession, measurements, or assets have not
            yet been supplied.
          </p>
        </article>
        <article>
          <span className="layer-label">middle</span>
          <h2>Interpreted reading</h2>
          <p>
            The middle layer holds labelled inference and speculation about political,
            social, domestic, and emotional meanings. It must never pretend to be
            confirmed museum evidence.
          </p>
        </article>
        <article>
          <span className="layer-label">core</span>
          <h2>Opacity and memory</h2>
          <p>
            The core layer keeps redaction, dispute, unresolved evidence, and local
            visitor contribution visible as legitimate archive states.
          </p>
        </article>
      </div>

      <section className="status-panel" aria-labelledby="installation-title">
        <p className="eyebrow">Installation system</p>
        <h2 id="installation-title">Phone, cup, marker, projection wall</h2>
        <p>
          The prototype is designed as a walkable room setup: a physical cup with QR or
          AR marker, a handheld mobile walkthrough, a camera-free object route, and a
          projection or sound-wall mode that lets archive fragments spill into the room.
        </p>
      </section>

      <section className="status-panel warning" aria-labelledby="ethics-title">
        <p className="eyebrow">Right to opacity</p>
        <h2 id="ethics-title">Absence is not a prompt to invent facts.</h2>
        <p>
          Missing ownership stories, sensitive political affiliations, harm contexts, and
          contested memories should not be forced into a confident institutional voice.
          Redaction remains visible so uncertainty can be read rather than hidden.
        </p>
      </section>

      <section className="status-panel" aria-labelledby="ai-title">
        <p className="eyebrow">AI process</p>
        <h2 id="ai-title">Codex supported prototyping, not historical verification.</h2>
        <p>
          Codex was used to support code implementation, route structure, fallback states,
          QA documentation, and interface copy. It was not used as an authority for museum
          facts. Historical claims remain placeholders or labelled interpretations unless
          verified by supplied sources.
        </p>
      </section>

      <section className="status-panel" aria-labelledby="limits-title">
        <p className="eyebrow">Current limits</p>
        <h2 id="limits-title">What still needs source evidence</h2>
        <p>
          Real object photographs, AR marker pattern files, QR codes, audio assets, and
          verified collection metadata are still required before public presentation.
          Local visitor annotations remain in this browser only.
        </p>
        <div className="action-row">
          <Link className="button-link primary" to="/object/sample-mug">
            Open no-AR walkthrough
          </Link>
          <Link className="button-link" to="/projection">
            Open projection wall
          </Link>
        </div>
      </section>
    </section>
  );
}

export default About;
