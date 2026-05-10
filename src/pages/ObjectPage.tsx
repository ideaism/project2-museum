import { Link, useNavigate, useParams } from 'react-router-dom';
import { useMemo, useState, type CSSProperties } from 'react';
import AnnotationForm from '../components/AnnotationForm';
import ArchiveTexture from '../components/ArchiveTexture';
import GlitchText from '../components/GlitchText';
import LayerTransition from '../components/LayerTransition';
import MugPourStage from '../components/MugPourStage';
import PourGauge from '../components/PourGauge';
import SoundManager from '../components/SoundManager';
import SpeculativeNarrativeGenerator from '../components/SpeculativeNarrativeGenerator';
import LayerCard from '../components/object/LayerCard';
import { layerAudioPaths } from '../data/layerAudio';
import { archiveMugs, findMugById } from '../data/mugs';
import { usePourInteraction } from '../hooks/usePourInteraction';
import type { AnnotationType, LayerState, MugRecord, NarrativeFragment } from '../types/archive';
import type { SpeculativeNarrativeFragment } from '../services/speculativeNarrative';
import '../styles/object.css';
import '../styles/projection.css';

const layerRangeLabels: Record<LayerState, string> = {
  surface: 'Surface: official facts and institutional frame',
  middle: 'Middle: speculative and inferred readings',
  core: 'Core: redacted, unresolved, and visitor memory',
};

function getFragmentsByLayer(layer: LayerState, fragments: Record<LayerState, NarrativeFragment[]>) {
  return fragments[layer];
}

function compactText(value: string | undefined, fallback: string) {
  return value?.trim() || fallback;
}

function getDualContainerEntries(mug: MugRecord) {
  const visibleLabel = mug.visibleInscription?.[0];
  const middleReading = mug.middleReadings[0]?.title ?? mug.shortHook;
  const politicalFeeling = mug.visitorPrompt ?? mug.middleReadings[1]?.title;
  const unresolvedMemory = mug.unresolvedQuestions?.[0] ?? mug.coreFragments[0]?.title;

  return {
    physical: [
      ['Material', compactText(mug.material, 'Material pending source data')],
      ['Form', compactText(mug.objectType, 'Political ceramic mug')],
      ['Label', compactText(visibleLabel, 'Visible inscription pending')],
      ['Storage', compactText(mug.collectionId, 'Stored record pending verification')],
    ],
    emotional: [
      ['Labour', compactText(middleReading, 'Labour reading pending')],
      ['Protest', compactText(mug.visibleInscription?.[1] ?? mug.middleReadings[1]?.title, 'Protest signal pending')],
      ['Political feeling', compactText(politicalFeeling, 'Visitor feeling remains open')],
      ['Unresolved memory', compactText(unresolvedMemory, 'Memory withheld until evidence or consent')],
    ],
  };
}

interface ObjectCabinetCardProps {
  record: MugRecord;
  index: number;
  isActive: boolean;
}

function ObjectCabinetCard({ record, index, isActive }: ObjectCabinetCardProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const showImage = Boolean(record.imagePath) && !imageFailed;

  return (
    <Link
      className={`object-cubby${isActive ? ' is-active' : ''}`}
      to={`/object/${record.slug}`}
      aria-current={isActive ? 'page' : undefined}
    >
      <span className="object-cubby__glass">
        {showImage ? (
          <img
            className="object-cubby__image"
            src={record.imagePath}
            alt={`${record.title} mug photograph`}
            onError={() => setImageFailed(true)}
          />
        ) : (
          <span className="object-cubby__placeholder" aria-hidden="true" />
        )}
      </span>
      <span className="object-cubby__label">
        <strong>Compartment {String(index + 1).padStart(2, '0')}</strong>
        <span>{record.title}</span>
      </span>
      <span className="object-cubby__status">
        {record.modelPath ? '3D model filed' : 'Model pending'}
      </span>
    </Link>
  );
}

function ObjectPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const mug = findMugById(id);
  const pourInteraction = usePourInteraction();
  const selectedLayer = pourInteraction.layerState;
  const [annotationDraft, setAnnotationDraft] = useState<
    | {
        id: string;
        text: string;
        type: AnnotationType;
        layer: LayerState;
      }
    | undefined
  >();
  const fragmentsByLayer = useMemo(
    () => ({
      surface: mug?.facts ?? [],
      middle: mug?.middleReadings ?? [],
      core: mug?.coreFragments ?? [],
    }),
    [mug],
  );
  const activeFragments = getFragmentsByLayer(selectedLayer, fragmentsByLayer);
  const dualContainerEntries = useMemo(
    () => (mug ? getDualContainerEntries(mug) : undefined),
    [mug],
  );
  const selectedMugIndex = mug
    ? archiveMugs.findIndex((record) => record.id === mug.id || record.slug === mug.slug)
    : -1;

  function handleUseSpeculativeFragment(fragment: SpeculativeNarrativeFragment) {
    setAnnotationDraft({
      id: fragment.id,
      type: fragment.mood,
      layer: fragment.layer,
      text: `[${fragment.label}; not verified history] ${fragment.text}`.slice(0, 280),
    });
  }

  if (!mug) {
    return (
      <section
        className="page-section object-page object-page--missing"
        aria-labelledby="missing-object-title"
      >
        <p className="eyebrow">No-camera object walkthrough</p>
        <h1 id="missing-object-title">Object not found</h1>
        <p className="lead">
          The archive does not have a mug record for <strong>{id ?? 'this route'}</strong>.
          Return to the sample object or the home route to continue the prototype
          walkthrough without camera access.
        </p>
        <div className="action-row">
          <Link className="button-link primary" to="/object/sample-mug">
            Open sample object
          </Link>
          <Link className="button-link" to="/">
            Return home
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section
      className={`page-section object-page glitch-${selectedLayer} glitch-layer-${selectedLayer}`}
      aria-labelledby="object-title"
    >
      <section className="object-cabinet" aria-labelledby="cabinet-title">
        <div className="object-cabinet__header">
          <div>
            <p className="eyebrow">Digital storage cabinet</p>
            <h2 id="cabinet-title">Stored political mugs</h2>
          </div>
          <p>
            Select a compartment to open its camera-free object record. The active mug is
            shown below as a stored object with layer controls and source-labelled notes.
            Camera gesture mode is optional. This fallback simulates the same pouring
            interaction.
          </p>
          <label className="object-selector">
            <span>Select object</span>
            <select
              value={mug.slug}
              onChange={(event) => navigate(`/object/${event.currentTarget.value}`)}
            >
              {archiveMugs.map((record) => (
                <option key={record.id} value={record.slug}>
                  {record.title}
                </option>
              ))}
            </select>
          </label>
        </div>

        <nav className="object-cabinet__grid" aria-label="Stored mug compartments">
          {archiveMugs.map((record, index) => {
            const isActive = record.id === mug.id;

            return (
              <ObjectCabinetCard
                key={record.id}
                record={record}
                index={index}
                isActive={isActive}
              />
            );
          })}
        </nav>
      </section>

      <div className="object-hero">
        <ArchiveTexture layerState={selectedLayer} variant="card" />
        <div className="object-hero__copy">
          <p className="eyebrow">
            Active cabinet item
            {selectedMugIndex >= 0 ? ` / compartment ${selectedMugIndex + 1}` : ''}
          </p>
          <GlitchText as="h1" id="object-title" layerState={selectedLayer}>
            {mug.title}
          </GlitchText>
          <p className="lead">
            A camera-free walkthrough for reading the mug as a container for daily
            routine and political memory. Camera gesture mode is optional. This fallback
            simulates the same pouring interaction. Move the pour control to reveal the
            surface, middle, and core archive layers.
          </p>
          <dl className="object-metadata" aria-label="Object metadata">
            <div>
              <dt>Object type</dt>
              <dd>Political ceramic mug</dd>
            </div>
            <div>
              <dt>Maker</dt>
              <dd>{mug.maker ?? 'Placeholder pending source data'}</dd>
            </div>
            <div>
              <dt>Date</dt>
              <dd>{mug.dateRange ?? 'Placeholder pending source data'}</dd>
            </div>
            <div>
              <dt>Collection ID</dt>
              <dd>{mug.collectionId ?? 'Placeholder pending source data'}</dd>
            </div>
          </dl>

          {dualContainerEntries ? (
            <section
              className="dual-container-panel"
              style={
                {
                  '--pour-value': String(pourInteraction.pourValue),
                  '--emotional-opacity': String(0.48 + pourInteraction.pourValue * 0.52),
                  '--emotional-offset': `${(1 - pourInteraction.pourValue) * 0.45}rem`,
                } as CSSProperties
              }
              aria-labelledby="dual-container-title"
            >
              <div className="dual-container-panel__intro">
                <p className="eyebrow">Dual container</p>
                <h2 id="dual-container-title">Physical volume / emotional volume</h2>
              </div>
              <div className="dual-container-panel__columns">
                <dl className="volume-list volume-list--physical">
                  <dt>Physical volume</dt>
                  {dualContainerEntries.physical.map(([label, value]) => (
                    <div key={label}>
                      <dt>{label}</dt>
                      <dd>{value}</dd>
                    </div>
                  ))}
                </dl>
                <dl className="volume-list volume-list--emotional">
                  <dt>Emotional volume</dt>
                  {dualContainerEntries.emotional.map(([label, value]) => (
                    <div key={label}>
                      <dt>{label}</dt>
                      <dd>{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </section>
          ) : null}
        </div>

        <figure className="object-media">
          <section className="object-pour-module" aria-labelledby="pour-title">
            <LayerTransition
              layerState={selectedLayer}
              pourValue={pourInteraction.pourValue}
              inputStatus={pourInteraction.inputStatus}
              inputConfidence={pourInteraction.inputConfidence}
            />
            <div className="pour-panel__header">
              <div>
                <p className="eyebrow">Manual pour</p>
                <h2 id="pour-title">Tilt the mug through the archive</h2>
              </div>
              <p aria-live="polite" className="pour-panel__state">
                Current layer: <strong>{layerRangeLabels[selectedLayer]}</strong>
              </p>
            </div>

            <MugPourStage
              mug={mug}
              interaction={pourInteraction}
              fragments={activeFragments}
            />

            <div className="object-pour-module__controls">
            <PourGauge
              tilt={pourInteraction}
              label="Pour without camera"
              description="Move the slider or use Surface, Middle, and Core to simulate the camera gesture pour."
            />
          </div>
        </section>
        <figcaption>
            The mug model or image rotates from the same pour value as the gesture
            experience. This route does not need camera access.
        </figcaption>
      </figure>
      </div>

      <LayerCard layer={selectedLayer} fragments={activeFragments} sources={mug.sources} />

      <SoundManager
        className="object-sound-module"
        layerState={selectedLayer}
        audioPaths={layerAudioPaths}
        pourValue={pourInteraction.soundIntensity}
        inputStatus={pourInteraction.inputStatus}
        inputConfidence={pourInteraction.inputConfidence}
      />

      <section className="object-installation-links" aria-labelledby="installation-title">
        <div>
          <p className="eyebrow">Installation routes</p>
          <h2 id="installation-title">Continue the same object in another mode</h2>
        </div>
        <div className="action-row">
          <Link className="button-link" to={`/gesture/${mug.slug}`}>
            Open camera gesture mode
          </Link>
          <Link className="button-link" to="/projection">
            Open projection wall
          </Link>
        </div>
      </section>

      <section className="object-memory-prompt" aria-label="Local co-curation prompt">
        <SpeculativeNarrativeGenerator
          mug={mug}
          layer={selectedLayer}
          onUseAsAnnotation={handleUseSpeculativeFragment}
        />
        <AnnotationForm mugId={mug.id} layer={selectedLayer} prefillDraft={annotationDraft} />
      </section>
    </section>
  );
}

export default ObjectPage;
