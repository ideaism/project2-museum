# AI Ethics Note

Codex was used as a coding and documentation assistant for The Glitching Archive. Its role was implementation support: route structure, TypeScript fixes, UI copy, fallback descriptions, QA documents, deployment notes, and assessment documentation.

Codex was not used as an authority for verified museum facts. It must not invent:

- maker names
- dates
- museum numbers
- dimensions
- donor or owner histories
- political affiliations
- oral histories
- rights statements
- protest participation or personal harm

When evidence is missing, the correct action is to label the gap.

## Claim Status

The interface and documentation should keep these categories separate:

- `fact`: visible object evidence, verified source data, or implementation facts.
- `inference`: a reasoned reading derived from evidence or the project frame.
- `speculation`: a possible interpretation that is not confirmed.
- `visitorContribution`: local visitor text, not institutional fact.
- `redacted`: withheld, sensitive, unresolved, or right-to-opacity material.

## AI Role in the Design Statement

The design statement may say that Codex supported prototyping and writing. It should not imply that AI verified the archive. Curatorial responsibility, source checking, and final interpretation remain with the project author and any future museum collaborators.

## Precedents and Citations

Design precedents can be cited as influences on form and method. They are not sources for mug history.

- Karim Ben Khelifa's *The Enemy* is cited as a precedent for immersive encounter with contested testimony.
- Rosa Menkman's *The Glitch Moment(um)* is cited as a precedent for treating glitch as critical interruption.
- The BBC Sound Effects Archive is cited as a precedent for searchable/remixable sound archive practice.
- V&A East Storehouse is cited as a precedent for open storage, object proximity, and QR/object lookup.

## Local Visitor Contributions

The MVP stores annotations in LocalStorage only. This avoids backend moderation and data-retention obligations for the assessment prototype, but it also means contributions are device-local, resettable, and not a shared public archive.

Before any public deployment with shared persistence, the project would need consent language, moderation, safeguarding, retention rules, deletion requests, and a policy for harmful or defamatory content.
