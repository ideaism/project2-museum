import { Link, useParams } from 'react-router-dom';
import { useId, useMemo, useState } from 'react';
import AnnotationForm from '../components/AnnotationForm';
import LayerCard from '../components/object/LayerCard';
import ObjectModelViewer from '../components/object/ObjectModelViewer';
import { findMugById } from '../data/mugs';
import type { LayerState, NarrativeFragment } from '../types/archive';
import '../styles/object.css';
import '../styles/projection.css';

const layerOrder: LayerState[] = ['surface', 'middle', 'core'];

const layerRangeLabels: Record<LayerState, string> = {
  surface: 'Surface: official facts and institutional frame',
  middle: 'Middle: speculative and inferred readings',
  core: 'Core: redacted, unresolved, and visitor memory',
};

function sliderValueToLayer(value: number): LayerState {
  if (value < 0.34) {
    return 'surface';
  }

  if (value < 0.67) {
    return 'middle';
  }

  return 'core';
}

function layerToSliderValue(layer: LayerState) {
  return layer === 'surface' ? 0 : layer === 'middle' ? 0.5 : 1;
}

function getFragmentsByLayer(layer: LayerState, fragments: Record<LayerState, NarrativeFragment[]>) {
  return fragments[layer];
}

function ObjectPage() {
  const { id } = useParams();
  const mug = findMugById(id);
  const sliderId = useId();
  const [pourValue, setPourValue] = useState(0);
  const selectedLayer = sliderValueToLayer(pourValue);
  const fragmentsByLayer = useMemo(
    () => ({
      surface: mug?.facts ?? [],
      middle: mug?.middleReadings ?? [],
      core: mug?.coreFragments ?? [],
    }),
    [mug],
  );
  const activeFragments = getFragmentsByLayer(selectedLayer, fragmentsByLayer);

  if (!mug) {
    return (
      <section
        className="page-section object-page object-page--missing"
        aria-labelledby="missing-object-title"
      >
        <p className="eyebrow">No-AR object walkthrough</p>
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
    <section className="page-section object-page" aria-labelledby="object-title">
      <div className="object-hero">
        <div className="object-hero__copy">
          <p className="eyebrow">No-AR object walkthrough</p>
          <h1 id="object-title">{mug.title}</h1>
          <p className="lead">
            A camera-free walkthrough for reading the mug as a container for daily
            routine and political memory. Move the pour control to reveal the surface,
            middle, and core archive layers.
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
        </div>

        <figure className="object-media">
          <ObjectModelViewer
            title={mug.title}
            modelPath={mug.modelPath}
            imagePath={mug.imagePath}
          />
          <figcaption>
            3D model path: <code>{mug.modelPath ?? 'No model path yet'}</code>. No camera
            or AR marker is required for this object walkthrough. Physical QR path:{' '}
            <code>{mug.qrPath ?? 'QR path pending'}</code>
          </figcaption>
        </figure>
      </div>

      <section className="pour-panel" aria-labelledby="pour-title">
        <div className="pour-panel__header">
          <div>
            <p className="eyebrow">Manual pour</p>
            <h2 id="pour-title">Tilt substitute</h2>
          </div>
          <p aria-live="polite" className="pour-panel__state">
            Current layer: <strong>{layerRangeLabels[selectedLayer]}</strong>
          </p>
        </div>

        <label className="pour-slider-label" htmlFor={sliderId}>
          Pour from surface to core
        </label>
        <input
          id={sliderId}
          className="pour-slider"
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={pourValue}
          aria-valuetext={layerRangeLabels[selectedLayer]}
          onChange={(event) => setPourValue(Number(event.currentTarget.value))}
        />

        <div className="pour-layer-buttons" aria-label="Choose archive layer">
          {layerOrder.map((layer) => (
            <button
              key={layer}
              className={layer === selectedLayer ? 'is-active' : undefined}
              type="button"
              aria-pressed={layer === selectedLayer}
              onClick={() => setPourValue(layerToSliderValue(layer))}
            >
              {layer}
            </button>
          ))}
        </div>
      </section>

      <LayerCard layer={selectedLayer} fragments={activeFragments} sources={mug.sources} />

      <section className="object-installation-links" aria-labelledby="installation-title">
        <div>
          <p className="eyebrow">Installation routes</p>
          <h2 id="installation-title">Continue the same object in another mode</h2>
        </div>
        <div className="action-row">
          <Link className="button-link" to={`/ar/${mug.slug}`}>
            Open AR marker route
          </Link>
          <Link className="button-link" to="/projection">
            Open projection wall
          </Link>
        </div>
      </section>

      <section className="object-memory-prompt" aria-label="Local co-curation prompt">
        <AnnotationForm mugId={mug.id} layer={selectedLayer} />
      </section>
    </section>
  );
}

export default ObjectPage;
