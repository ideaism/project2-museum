# Design Statement

The Glitching Archive is a speculative WebAR museum prototype for political ceramic mugs from a stored collection. It treats the mug as both a daily object and a political memory container: something held, washed, stored, joked with, argued over, and eventually catalogued.

## Audience and Context

The primary audience is museum visitors, tutors, reviewers, and project collaborators assessing a prototype installation. The work is designed for a review context where not everyone can or will grant camera, motion, or audio permissions. The no-AR route is therefore not secondary documentation; it is a core route through the project.

The intended setting is a small room installation: physical cup, printed QR or AR marker, phone walkthrough, projection wall, optional sound, and local visitor annotation.

## Why Mugs

Political mugs are useful because they make public language intimate. A slogan, party name, protest route, or labour image enters the kitchen, the desk, the cupboard, and the hand. The cup can be a souvenir, a tool, a joke, a declaration, an unwanted remainder, or a stored fragment. That ambiguity supports the project's central question: what does a museum archive do with political memory when the object is ordinary, handled, and unresolved?

## Three-Layer Pour Interaction

The central gesture is a pour. The visitor tilts the phone or uses a manual slider to move through three layers:

- `surface`: visible evidence, catalogue-like metadata, and source-linked facts.
- `middle`: labelled inference and speculation about political, social, domestic, and emotional readings.
- `core`: redaction, unresolved evidence, local visitor memory, dispute, and right-to-opacity.

Pouring matters because the archive is not simply opened. It is tipped, strained, and made unstable. The deeper the pour, the more the interface moves from institutional certainty toward partial memory and contested interpretation.

## AR + No-AR + Projection System

The prototype is not only a screen interface. It combines:

- AR marker route: `/ar/:id`, using AR.js marker tracking for the physical cup setup.
- No-AR object route: `/object/:id`, using the same records without camera or motion dependency.
- Projection route: `/projection`, turning fragments and local contributions into a wall-scale archive mode.
- About route: `/about`, carrying the design statement, source limits, AI process, and ethical framing.

The no-AR route is the reliable accessibility path. AR is a situated enhancement that depends on camera permission, HTTPS or localhost, marker print quality, lighting, and AR.js runtime loading.

## Co-Curation Loop

Visitors can add local annotations as questions, counter-readings, memories, or disputes. These contributions are stored in LocalStorage only. They can appear in projection mode, but they remain labelled as `visitorContribution` and are not promoted to fact.

This loop is a prototype of co-curation rather than a public collection system. A public version would need consent, moderation, data retention, deletion processes, and safeguarding policies.

## Right to Opacity

The project uses right-to-opacity as a design principle. Missing ownership stories, sensitive political affiliations, personal harm, and contested memories should not be forced into a confident institutional voice. Redaction remains visible so absence can be read as part of the archive rather than hidden as a defect.

## Source Transparency

Every fragment must carry a visible source status: `fact`, `inference`, `speculation`, `visitorContribution`, or `redacted`. Possible museum object matches, unverified dates, unknown makers, missing QR files, absent audio, and unresolved rights information must remain explicit.

The interface must never use speculation, AI-generated copy, or visitor memory as a substitute for verified metadata.

## Role of Codex / AI

Codex supported code prototyping, TypeScript fixes, fallback copy, QA documentation, deployment notes, and design-statement drafting. Codex did not verify museum records and must not be treated as a historical source.

AI-assisted writing is acceptable in this project only when source status remains visible. The ethical rule is simple: if evidence is missing, label the gap.

The interface also includes a local speculative prompt generator for assessment. It does not call an external AI provider, does not verify history, and labels every generated prompt as speculation. Its purpose is to demonstrate ethical boundaries for AI-assisted interpretation, not to add facts to the archive.

## Design and Research References

- Karim Ben Khelifa, [The Enemy](https://arts.mit.edu/the-enemy/) and the [NFB installation page](https://ennemi.onf.ca/the-installation). This is a precedent for immersive encounter with contested testimony and for moving viewers from passive spectatorship toward situated encounter. It is not a source for mug history.
- Rosa Menkman, [The Glitch Moment(um)](https://networkcultures.org/_uploads/NN%234_RosaMenkman.pdf). This is a reference for treating glitch as a critical interruption in media systems, not as decorative distortion.
- [BBC Sound Effects Archive](https://sound-effects.bbcrewind.co.uk/). This is a reference for searchable sound archive practice and for thinking about how audio fragments might be browsed, layered, credited, or licensed.
- [V&A East Storehouse](https://www.vam.ac.uk/east/storehouse/visit) and [V&A East Storehouse Lookup](https://lookup.vam.ac.uk/). These are references for open storage, public proximity to collections, QR/object lookup, and visible museum infrastructure.

## Prototype Limits

- Object metadata remains partial or possible-match material until verified collection records are supplied.
- Current mug images and models support the prototype, but rights and source status still need confirmation before public use.
- Only `sample-mug` currently has a `.patt` marker file in the repository.
- QR code SVGs are missing.
- Projection audio files are missing.
- Captions/transcripts are missing because final audio has not been supplied.
- LocalStorage annotations are per-browser demo data and are not a shared visitor archive.
- Live AR tracking depends on device, lighting, browser, marker quality, HTTPS or localhost, and third-party AR.js/A-Frame script availability.
