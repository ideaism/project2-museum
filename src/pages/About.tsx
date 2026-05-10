import { Link } from 'react-router-dom';

function About() {
  return (
    <section className="page-section about-page" aria-labelledby="about-title">
      <div className="content-stack">
        <p className="eyebrow">Design statement / AI process note</p>
        <h1 id="about-title">A cup that refuses one final reading.</h1>
        <p className="lead">
          The Glitching Archive is a mobile-first camera gesture museum prototype for
          political ceramic mugs from a stored collection. It treats the mug as both an
          everyday vessel and a container of political memory.
        </p>
      </div>

      <section className="status-panel" aria-labelledby="audience-title">
        <p className="eyebrow">Audience and context</p>
        <h2 id="audience-title">A reviewable installation, not only a screen.</h2>
        <p>
          The project is built for museum visitors, tutors, reviewers, and collaborators
          assessing a speculative archive prototype. It is intended to sit in a room with a
          physical cup, camera gesture route, no-camera fallback, projection wall, and local
          co-curation prompt.
        </p>
      </section>

      <section className="status-panel" aria-labelledby="mugs-title">
        <p className="eyebrow">Why mugs</p>
        <h2 id="mugs-title">Political language enters the hand.</h2>
        <p>
          Mugs move between kitchen, workplace, cupboard, protest souvenir, and museum
          store. They make politics small enough to hold, but not simple enough to settle.
          That tension makes the cup a useful object for reading routine and political memory
          together.
        </p>
      </section>

      <section className="status-panel warning" aria-labelledby="gesture-title">
        <p className="eyebrow">Camera gesture pour</p>
        <h2 id="gesture-title">The core act is pouring, not scanning.</h2>
        <p>
          The project moved away from AR marker tracking because the key conceptual act is
          not scanning a marker, but performing a bodily gesture of pouring. The camera
          becomes a way to sense the visitor&apos;s gesture, while the mug remains a container
          of political memory.
        </p>
      </section>

      <div className="layer-grid" aria-label="Archive layer principles">
        <article>
          <span className="layer-label">surface</span>
          <h2>Known record</h2>
          <p>
            The surface layer holds visible object evidence, collection metadata, and
            explicit placeholders where maker, date, accession, measurements, or assets have
            not yet been supplied.
          </p>
        </article>
        <article>
          <span className="layer-label">middle</span>
          <h2>Interpreted reading</h2>
          <p>
            The middle layer holds labelled inference and speculation about political,
            social, domestic, and emotional meanings. It must never pretend to be confirmed
            museum evidence.
          </p>
        </article>
        <article>
          <span className="layer-label">core</span>
          <h2>Opacity and memory</h2>
          <p>
            The core layer keeps redaction, dispute, unresolved evidence, and local visitor
            contribution visible as legitimate archive states.
          </p>
        </article>
      </div>

      <section className="status-panel" aria-labelledby="installation-title">
        <p className="eyebrow">Gesture / no-camera / projection</p>
        <h2 id="installation-title">Hand, cup, camera, projection wall</h2>
        <p>
          The walkable system joins a physical cup, camera gesture route, no-camera object
          page, and projection or sound-wall mode. Camera access is an enhancement; the
          no-camera route remains a central access path when permission, lighting, device,
          or comfort conditions make camera use unsuitable.
        </p>
      </section>

      <section className="status-panel" aria-labelledby="privacy-title">
        <p className="eyebrow">Camera privacy</p>
        <h2 id="privacy-title">Gesture sensing stays local.</h2>
        <p>
          The camera is used locally to estimate hand rotation and update pour value. The
          prototype does not record video, upload video, capture audio, or send camera
          frames to a project backend.
        </p>
      </section>

      <section className="status-panel" aria-labelledby="curation-title">
        <p className="eyebrow">Co-curation loop</p>
        <h2 id="curation-title">Visitor memory is invited, then labelled.</h2>
        <p>
          The annotation form lets a visitor add a local question, counter-reading, memory,
          or dispute. Those notes can flow into projection mode, but they remain labelled as
          visitor contributions and stay in LocalStorage. They are not shared, moderated, or
          converted into facts.
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

      <section className="status-panel" aria-labelledby="source-title">
        <p className="eyebrow">Source transparency</p>
        <h2 id="source-title">Every claim needs a visible status.</h2>
        <p>
          The interface separates fact, inference, speculation, visitor contribution, and
          redaction. Possible object matches, unverified metadata, absent audio, and
          placeholder rights information must stay visible as limits of the prototype.
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

      <section className="status-panel" aria-labelledby="precedents-title">
        <p className="eyebrow">References and precedents</p>
        <h2 id="precedents-title">Immersion, glitch, sound archive, open storage</h2>
        <p>
          The project takes design cues from Karim Ben Khelifa&apos;s{' '}
          <a href="https://arts.mit.edu/the-enemy/">The Enemy</a> as an immersive
          encounter with contested testimony; Rosa Menkman&apos;s{' '}
          <a href="https://networkcultures.org/_uploads/NN%234_RosaMenkman.pdf">
            The Glitch Moment(um)
          </a>{' '}
          as a way to treat glitch as critical interruption; the{' '}
          <a href="https://sound-effects.bbcrewind.co.uk/">BBC Sound Effects Archive</a> as a
          model for searchable sound material; and{' '}
          <a href="https://www.vam.ac.uk/east/storehouse/visit">V&amp;A East Storehouse</a> as
          a reference for open storage, object proximity, and collection lookup.
        </p>
      </section>

      <section className="status-panel" aria-labelledby="limits-title">
        <p className="eyebrow">Current limits</p>
        <h2 id="limits-title">What still needs source evidence</h2>
        <p>
          The repository includes prototype mug images and GLB models, but final
          presentation still needs audio files with captions, verified metadata, and rights
          information. Legacy marker files may remain in the repository, but they are not
          required for the current Camera Gesture Pour Experience.
        </p>
        <div className="action-row">
          <Link className="button-link primary" to="/gesture/sample-mug">
            Open gesture walkthrough
          </Link>
          <Link className="button-link" to="/object/sample-mug">
            Open no-camera fallback
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
