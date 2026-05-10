# 00 Master Orchestrator Replan

This replan responds to the prototype evaluation and narrows the remaining work around experience gaps rather than generic feature expansion. The project must remain a WebAR museum prototype for three V&A East Storehouse political mugs, not a catalogue site.

## Current State Table

| Route / page | What works now | What is missing or weak | Agent to fix |
| --- | --- | --- | --- |
| `/` Home | Route exists, frames WebAR museum prototype, links to object, AR, projection, and about. | Needs stronger first-screen identity after visual system pass: glitch as curatorial method, three mugs as a constellation, not generic navigation. | 06 Glitch Visual + Sound, then 09 Final Integration |
| `/object/:id` No-AR object page | Digital storage cabinet exists; three mug records render; cabinet cards use `imagePath`; active item uses `ObjectModelViewer`; slider changes layer and model orientation; annotations attach to current layer. | Needs final experience direction: make pour + model the dominant interaction, verify mobile layout, make cabinet feel like archival storage rather than a grid, tighten source labels and unresolved/redacted distinction. | 03 Pour + 3D Interaction, 05 No-AR Immersive Walkthrough, 06 Visual pass |
| `/ar/:id` AR route | Route loads; AR.js/A-Frame scripts are wired; marker path validation exists; AR overlay uses current mug fragments; no-AR fallback exists; tilt hook is connected. | Major gap: camera/marker route still fragile; overlay content is drawer-like rather than meaningful spatial AR; marker availability only verified for `sample-mug`; 3D model overlay and source labels need stronger marker-bound presentation. | 04 AR Marker + Overlay |
| `/projection` Projection wall | Reads centralized mug records; groups fragments by mug and layer; includes shadow archive wall; local annotations can appear; sound manager exists. | No actual audio files; projection needs clearer co-curation loop, voting/selection, captions for silence/audio, and stronger glitch/archive visual identity. | 07 Co-curation + Projection Loop, 06 Sound |
| `/about` About / statement | Directionally explains mug as vessel, layers, right to opacity, AI process, missing assets. | Needs tightening after remaining work: references, exact V&A / source caveats, AI-assisted speculation policy, missing prototype elements, final assessment limitations. | 08 QA / Docs / Design Statement |
| Shared data / ethics | `src/data/mugs.ts` contains three mug stories; assets map to `mug1`, `mug2`, `mug3`; source labels exist for fact/inference/speculation/visitorContribution/redacted. | `unresolved` is not a separate `ArchiveSourceType`; verified metadata remains incomplete; Agent 11 speculative content must not enter fact fields. | 02 Object Research / Data / Ethics, 11 Speculative AI Narrative |
| Assets | Images and GLB models exist for three mugs; `sample-mug.patt` exists. | Audio folder has no real files; QR files missing; marker `.patt` files missing for `campaign-slogan-mug` and `commemorative-protest-mug`; verified photos/rights still need confirmation. | 02 assets manifest, 04 marker, 06 audio |

## Revised Dependency Map

1. **02 Object Research / Data / Ethics** runs first.
   - Stabilizes source taxonomy, mug records, missing asset manifest, and whether `unresolved` becomes a separate `ArchiveSourceType`.
   - Blocks Agents 04, 07, 08, and 11 wherever they need source semantics.

2. **11 Speculative AI Narrative** can start after 02 defines the taxonomy.
   - Works only on labelled speculative/inference/core narrative drafts or a separate data module, not UI.
   - Must not write facts.

3. **03 Pour + 3D Interaction** and **05 No-AR Immersive Walkthrough** can run after 02.
   - 03 owns model tilt/pour behavior and any reusable pour mapping.
   - 05 owns the object-page walkthrough composition and cabinet interaction.
   - They must coordinate around `src/pages/ObjectPage.tsx` and `src/components/object/ObjectModelViewer.tsx`; prefer 03 first if both need the same files.

4. **04 AR Marker + Overlay** can run after 02 and 03.
   - Needs stable model paths, marker paths, source labels, and pour mapping.

5. **06 Glitch Visual + Sound** can run in parallel with 04 after 02, but should avoid changing Object/AR structure.
   - Owns visual identity, sound/caption system, and shared glitch primitives.

6. **07 Co-curation + Projection Loop** can run after 02 and after any annotation contract updates.
   - It may run parallel to 04/06 if it keeps to annotation/projection files.

7. **08 QA / Docs / Design Statement** runs after 02, 06, 07, and 11 have completed content-affecting work.

8. **09 Final Integration** runs last.

## File Ownership Map

| Area | Owner | Can touch with coordination | Do not touch |
| --- | --- | --- | --- |
| `src/data/*` | 02 | 11 may propose narrative in handoff/docs; 09 may integrate | 03-07 should not invent data fields |
| `src/types/archive.ts` | 02 | 07 if annotation votes require type additions; 09 final contract cleanup | Feature agents cannot casually rename unions |
| `src/pages/ObjectPage.tsx` | 05 | 03 for pour/model integration; 09 for final merge | 06 should not restructure this page |
| `src/components/object/*` | 03 for `ObjectModelViewer`; 05 for object layout cards; 02 for no UI changes | 06 visual-only classes; 09 integration | 04 AR changes |
| `src/pages/ARExperience.tsx`, `src/components/ARScene.tsx`, `src/components/CameraPermissionNotice.tsx` | 04 | 03 for shared pour hook only; 09 final QA | 05 and 07 should not alter AR logic |
| `src/hooks/useDeviceTilt.ts`, `src/utils/pourMapping.ts`, `src/types/interaction.ts` | 03 | 04 can consume; 09 integration | 05 should not fork mapping logic |
| `src/pages/Projection.tsx`, `src/components/ProjectionWall.tsx`, `src/components/FloatingFragments.tsx` | 07 | 06 for visual/audio integration; 09 final merge | 04 AR changes |
| `src/components/AnnotationForm.tsx`, `src/hooks/useArchiveAnnotations.ts` | 07 | 05 can place form; 09 merge | 02 data-only work |
| `src/components/SoundManager.tsx`, `src/styles/sound.css`, audio asset docs | 06 | 07 projection integration | 03/04 |
| `src/styles/*` | 06 | 03/04/05 may add scoped classes for owned components; 09 cleanup | Avoid broad global rewrites after 06 |
| `docs/*`, `README.md`, `src/pages/About.tsx` | 08 | 00 coordination docs; 02 source notes; 09 final status | Feature agents should only add narrow handoff notes |
| `public/assets/archive/*` | 02 asset manifest owner | 04 marker files; 06 audio files; 03 model requirement notes | Do not move existing assets without updating `mugs.ts` |

## Exact Agent Prompts

### Agent 02 — Object Research / Data / Ethics

```text
You are Agent 02: Object Research / Data / Ethics for The Glitching Archive.

Inspect the current repository first. Focus on src/data/*, src/types/archive.ts, docs/object-stories-three-mugs.md, public/assets/archive/*, and source-label semantics.

Task:
Stabilize the data, source taxonomy, asset manifest, and ethical boundaries for the three V&A East Storehouse political mugs.

Requirements:
- Preserve the three-layer model: surface, middle, core.
- Do not invent historical facts.
- Keep fact, inference, speculation, visitor contribution, redaction, and right-to-opacity visibly separate.
- Decide whether the project needs a separate ArchiveSourceType value of "unresolved" instead of folding unresolved into redacted. If yes, update the type, source labels, validation, and all affected fragments consistently. If no, document why unresolved remains represented through redacted/core copy.
- Verify the current mug-to-asset mapping:
  - mug1 assets: People's March for Jobs
  - mug2 assets: Labour
  - mug3 assets: Support the Miners
  Correct the data only if it is wrong.
- Update docs/archive-asset-requirements.md with missing QR, marker, verified metadata, and audio assets.
- Do not change UI layout, AR logic, projection logic, or annotation UI.

Run npm run build.

Return files changed, source taxonomy decision, missing evidence/assets, and risks.
```

### Agent 03 — Pour + 3D Interaction

```text
You are Agent 03: Pour + 3D Interaction.

Inspect ObjectPage, ObjectModelViewer, useDeviceTilt, pourMapping, and ARScene before editing.

Task:
Make the pour interaction physically legible: the same pour value must drive the narrative layer and visible mug movement.

Requirements:
- Strengthen the 3D mug presentation in the no-AR page.
- Ensure slider movement visibly tilts/pours the mug from surface to middle to core.
- Keep manual controls working on desktop and mobile.
- Keep a single mapping source for pourValue -> LayerState.
- Do not alter story content, source taxonomy, annotation storage, or projection structure.
- If AR needs to consume the same mapping, expose it without duplicating logic.
- Preserve fallback when model-viewer or GLB fails.

Run npm run build.

Return files changed, mapping behavior, mobile behavior, and limitations.
```

### Agent 04 — AR Marker + Overlay

```text
You are Agent 04: AR Marker + Overlay.

Inspect ARExperience, ARScene, CameraPermissionNotice, useDeviceTilt, source labels, and marker assets.

Task:
Turn /ar/:id from a loading route into a meaningful marker-based AR prototype with source-labelled overlay content.

Requirements:
- Keep AR.js marker tracking as the WebAR method.
- Preserve /ar/:id and no-AR fallback.
- Confirm marker files:
  - sample-mug has sample-mug.patt
  - campaign-slogan-mug and commemorative-protest-mug need exact missing marker paths documented
- Make the AR viewport primary on mobile.
- Ensure overlay content is not just a blocking panel; it should behave like an AR HUD tied to current layer and marker state.
- Show source badges for every visible fragment.
- Use shared pour/tilt mapping from Agent 03.
- Do not invent content or change data contracts.

Run npm run build.

Return files changed, marker status, AR overlay behavior, camera/motion limitations.
```

### Agent 05 — No-AR Immersive Walkthrough

```text
You are Agent 05: No-AR Immersive Walkthrough.

Inspect ObjectPage, object components, object.css, and the current digital storage cabinet.

Task:
Make the no-AR route feel like an immersive digital storage cabinet, not a generic object-detail page.

Requirements:
- Keep the no-AR page camera-free.
- Preserve cabinet selection, 3D viewer, pour slider, layer cards, source labels, and annotation form.
- Make the selected mug feel stored inside an archive/cabinet compartment.
- Foreground the mug as domestic object + political memory container.
- Do not edit source data, source taxonomy, AR logic, projection logic, or annotation storage.
- Coordinate with Agent 03 if changing ObjectModelViewer or pour controls.

Run npm run build.

Return files changed, walkthrough structure, mobile/desktop notes, limitations.
```

### Agent 06 — Glitch Visual + Sound

```text
You are Agent 06: Glitch Visual + Sound.

Inspect styles, GlitchText, ScanlineOverlay, RedactedText, SoundManager, Projection, Object, AR, and docs/object-stories-three-mugs.md.

Task:
Create a bold glitch/archive identity and a sound/caption layer that supports the curatorial concept.

Requirements:
- Glitch must function as curatorial method: instability, redaction, misregistration, source uncertainty. It must not be decorative noise only.
- Add or wire sound only through documented paths under public/assets/archive/audio/.
- If audio files are missing, keep silent fallback and captions/transcripts visible.
- Support three audio moods: surface, middle, core.
- Preserve accessibility and prefers-reduced-motion.
- Avoid broad CSS rewrites that break Object/AR/Projection layouts.
- Do not alter data facts or speculative content.

Run npm run build.

Return files changed, visual system decisions, audio asset status, fallback behavior.
```

### Agent 07 — Co-curation + Projection Loop

```text
You are Agent 07: Co-curation + Projection Loop.

Inspect AnnotationForm, useArchiveAnnotations, Projection, ProjectionWall, FloatingFragments, and source labels.

Task:
Complete the local co-curation loop for prototype assessment.

Requirements:
- Keep LocalStorage-only persistence; no backend.
- Let visitors submit local contributions and clearly see them again.
- Add a lightweight local voting/selection mechanism if feasible without backend.
- Make visitor contributions visibly flow into Projection / shadow archive.
- Label all visitor text as visitorContribution, never fact.
- Keep privacy language: local browser only, no shared moderation model.
- Do not change story data or AR logic.

Run npm run build.

Return files changed, LocalStorage schema changes, projection loop behavior, privacy risks.
```

### Agent 08 — QA / Docs / Design Statement

```text
You are Agent 08: QA / Docs / Design Statement.

Inspect README, About, docs/*, asset requirements, and the final implemented routes.

Task:
Tighten the design statement, AI process note, reference caveats, assessment setup, and QA docs after implementation.

Requirements:
- Explain this as a prototype showcase, not production app.
- Name missing verified metadata, audio, QR, marker, and rights issues.
- Clarify AI-assisted speculative storytelling and ensure it is not presented as verified history.
- Keep right-to-opacity and source transparency central.
- Update route checklist for /, /object/:id, /ar/:id, /projection, /about.
- Do not change feature code unless fixing a documentation-only route typo.

Run npm run build.

Return files changed, docs improved, remaining limitations.
```

### Agent 09 — Final Integration

```text
You are Agent 09: Final Integration.

Run after Agents 02, 03, 04, 05, 06, 07, 08, and 11.

Task:
Integrate and verify the final assessment prototype.

Requirements:
- Verify /, /object/sample-mug, /object/campaign-slogan-mug, /object/commemorative-protest-mug, /ar/sample-mug, /projection, /about.
- Confirm pour changes both layer and mug motion.
- Confirm source labels remain visible.
- Confirm AR marker state and no-AR fallback.
- Confirm Projection receives local visitor contributions.
- Confirm silent/audio fallback.
- Confirm About/docs match implemented state.
- Do not add new features; only fix integration breakage.

Run npm run build.

Return final status table, checks, unresolved risks, and handoff.
```

### Agent 11 — Speculative AI Narrative

```text
You are Agent 11: Speculative AI Narrative.

Inspect src/data/mugs.ts, docs/object-stories-three-mugs.md, source labels, and ethics notes.

Task:
Create labelled AI-assisted speculative narrative fragments that deepen the middle/core layers without becoming fake history.

Requirements:
- Do not write or alter facts.
- Work from supplied object stories and visible evidence only.
- Every generated fragment must be labelled inference, speculation, visitor prompt, unresolved, or redacted according to the current source taxonomy.
- Include a rationale/source note for each fragment.
- Preserve right-to-opacity: do not fill sensitive gaps with invented names, owners, donor histories, harms, or affiliations.
- Prefer delivering a structured handoff or data module that Agent 02 can review before integration.
- Do not change UI components.

Run npm run build if you edit repository files.

Return proposed fragments, labels, rationale, and ethical cautions.
```

## Recommended Merge Order

1. Agent 02: data/source taxonomy/assets.
2. Agent 11: speculative narrative handoff, reviewed by 02 before merge if it touches data.
3. Agent 03: pour + 3D interaction contract.
4. Agent 05: no-AR immersive cabinet composition.
5. Agent 04: AR marker + overlay using stable data/pour mapping.
6. Agent 06: visual identity + sound/caption layer.
7. Agent 07: co-curation + projection loop.
8. Agent 08: docs, About, assessment setup.
9. Agent 09: final integration.

Parallel-safe version after Agent 02:

- Agent 03 and Agent 11 can run in parallel if Agent 11 does not edit `src/data/mugs.ts` directly.
- Agent 04 and Agent 06 can run in parallel if 06 avoids `ARScene.tsx`.
- Agent 07 can run in parallel with 04 if it keeps to annotation/projection files.
- Agent 05 should wait for Agent 03 if both need object model/pour files.

## Risk List

| Risk | Current evidence | Mitigation |
| --- | --- | --- |
| Missing AR marker files | `sample-mug.patt` exists; other mug marker `.patt` files are not present. | Agent 04 documents missing marker paths and keeps no-AR fallback. |
| Missing object images | `mug1.png`, `mug2.png`, `mug3.png` exist; rights/verification unknown. | Agent 02 records status and source/rights caveat. |
| Missing audio files | `public/assets/archive/audio/` has no real audio files. | Agent 06 adds silent fallback/captions and exact asset requirements. |
| Missing verified metadata | Maker, accession, production context still incomplete for several records. | Agent 02 keeps placeholders and source confidence. |
| LocalStorage-only co-curation | Current annotations persist locally only; no backend/moderation. | Agent 07 makes local-only nature explicit and avoids shared claims. |
| Browser camera / motion limitations | AR depends on HTTPS/localhost, browser camera permission, DeviceOrientation support. | Agent 04 and 03 keep manual/no-AR fallback. |
| AI speculation mistaken for history | Agent 11 may produce persuasive text that reads as fact. | Agent 02 reviews labels; Agent 08 documents AI process and source limits. |
| CSS conflicts | Visual, object, AR, projection styles overlap in `src/styles/*`. | Agent 06 owns visual tokens; feature agents keep scoped class edits. |
| Prototype scope creep | Voting/audio/AI could become production-like. | Keep LocalStorage, placeholder audio, documented limitations, no backend. |

## Definition of Done For Replanned Prototype

- Three mugs appear as a coherent stored-cabinet constellation.
- No-AR route clearly demonstrates 3D pour interaction.
- AR route demonstrates marker-based access with meaningful source-labelled overlay or a clear fallback.
- Projection route shows archive fragments plus local visitor contributions.
- Audio layer is either supplied or clearly captioned as missing with silent fallback.
- Every narrative claim has source type labelling.
- `unresolved` vs `redacted` is either explicitly separated in the type system or clearly documented as a core-layer distinction.
- About/docs explain prototype limitations, V&A/source caveats, and AI-assisted speculation policy.
- `npm run build` passes.
