import { Link, Navigate, useParams } from 'react-router-dom';
import GlitchText from '../components/GlitchText';
import GesturePourStage, { GestureSourceLegend } from '../components/GesturePourStage';
import SoundManager from '../components/SoundManager';
import { layerAudioPaths } from '../data/layerAudio';
import { archiveMugs, findMugById } from '../data/mugs';
import { useGesturePour } from '../hooks/useGesturePour';
import { usePourInteraction } from '../hooks/usePourInteraction';
import '../styles/gesture.css';

const mugSelectorLabels: Record<string, string> = {
  'sample-mug': 'Miners',
  'commemorative-protest-mug': 'Jobs March',
  'campaign-slogan-mug': 'Labour Rose',
};

function GestureExperience() {
  const { id } = useParams();
  const mug = findMugById(id);
  const fallbackMug = archiveMugs[0];
  const gesture = useGesturePour();
  const interaction = usePourInteraction(0, {
    externalInput: gesture.externalInput,
  });

  if (!mug) {
    return <Navigate to={`/gesture/${fallbackMug.slug}`} replace />;
  }

  return (
    <section
      className={`page-section gesture-page glitch-layer-${interaction.layerState}`}
      aria-labelledby="gesture-title"
    >
      <div className="gesture-page__hero">
        <div>
          <p className="eyebrow">Camera gesture pouring</p>
          <GlitchText as="h1" id="gesture-title" layerState={interaction.layerState}>
            {mug.title}
          </GlitchText>
          <p className="lead">{mug.shortHook ?? 'Pour the archive through layered evidence.'}</p>
        </div>
        <Link className="button-link" to={`/object/${mug.slug}`}>
          No-camera object walkthrough
        </Link>
      </div>

      <nav className="gesture-object-switcher" aria-label="Choose archive mug">
        <span>Archive object</span>
        <div>
          {archiveMugs.map((record) => (
            <Link
              key={record.id}
              className={record.id === mug.id ? 'is-active' : undefined}
              aria-current={record.id === mug.id ? 'page' : undefined}
              to={`/gesture/${record.slug}`}
            >
              {mugSelectorLabels[record.slug] ?? record.title}
            </Link>
          ))}
        </div>
      </nav>

      <GesturePourStage mug={mug} gesture={gesture} interaction={interaction} />

      <GestureSourceLegend />

      <section className="gesture-instructions" aria-labelledby="gesture-instructions-title">
        <div>
          <p className="eyebrow">Visitor instructions</p>
          <h2 id="gesture-instructions-title">Hold, rotate, fallback</h2>
        </div>
        <ul>
          <li>Open your hand as if holding the mug.</li>
          <li>Rotate slowly to pour the archive.</li>
          <li>Use the slider if camera is unavailable.</li>
        </ul>
        <p>Camera is used locally for gesture input. No video is recorded or uploaded.</p>
      </section>

      <SoundManager
        layerState={interaction.layerState}
        audioPaths={layerAudioPaths}
        pourValue={interaction.soundIntensity}
        inputStatus={interaction.inputStatus}
        inputConfidence={interaction.inputConfidence}
      />
    </section>
  );
}

export default GestureExperience;
