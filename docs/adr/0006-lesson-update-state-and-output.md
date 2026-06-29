# ADR-0006 — /lesson-update state and output: version-pure files, frontmatter, keep-both on collision

**Status:** Accepted (2026-06-29)

## Context

ADR-0005 fixed the *release version* as the single unit of discovery, state, and output for
`/lesson-update`. This ADR settles the two things that follow from it: how the state is shaped
in `learning-config.md`, and how a generated lesson looks on disk — including what happens when
a locally-generated lesson and an upstream one cover the same version.

The draft spec carried three under-specified points: a covered/scanned/skipped state triple, a
filename scheme (open: progressive `13-…` vs version-based `13.9-…`), and a collision story
(merge vs keep-both) that assumed the clash is a *same-file* `git pull` conflict.

## Decision

### State in `learning-config.md`

Keep all three fields, each justified by carrying **non-derivable** information — except one,
kept deliberately as a convenience mirror:

- **`laravel_version_scanned`** — high-water cursor: the highest version already examined on the
  sources. Source of truth for "how far I've looked"; defines "new = > scanned". Not derivable.
- **`lessons_skipped`** — the set of versions the learner saw and declined. "Declined" cannot be
  reconstructed from a number; without it, skipped releases get re-proposed forever. Not derivable.
- **`laravel_version_covered`** — the highest version that became a lesson. **Derivable** from the
  `origin: local` files in `lessons/`; kept *explicit* anyway as a convenience **mirror** (a stable
  anchor for the README, and to avoid re-parsing every file each run). Documented as a mirror, not
  a source of truth.

`lesson_sources` carries the roles from ADR-0005 (editorial blogs laravel-news → Laravel Daily,
plus the changelog cross-check).

### Output: the generated lesson

- **One file per release, version-pure name** (e.g. `13.17-…`, full patch level). The version
  prefix deliberately breaks the progressive `01/02/03…` aesthetic — that is the point: it makes an
  upstream collision *visible and expected*. No forced topic slug (a release aggregates many changes;
  picking one for the name would be arbitrary).
- **Generated from `lessons/_template.md`**, brief written in the `language.docs` language (English,
  per the repo's docs-in-English rule). The HTML render stays a later `/teach` step.
- **YAML frontmatter on generated lessons only:** at least `version: <x.y.z>` and `origin: local`.
  `origin: local` marks "the learner generated this" vs an upstream lesson.

### Collision with upstream

The real clash is **semantic, not same-file**: the author's lessons are progressively named
(`01…12`), a generated one is version-named, so the filenames differ — a `git`-level conflict is
unlikely. The collision is "the same *version* is now covered by both a local and an upstream lesson."

- **Detection is by `version:`**, not by filename: compare the `version:` of `origin: local` files
  against upstream lessons' version (parsing their prose `> Version:` line as a best-effort fallback
  until/unless they gain frontmatter).
- **Default action is keep-both** — non-destructive, always safe. *Merge* (combining the two into one
  file) is offered only as an explicit opt-in, because auto-combining content is the riskiest move in
  the flow.
- **No retrofit:** the 12 existing lessons are *not* given frontmatter now (Option A). Only generated
  lessons carry it; upstream detection relies on the prose-parsing fallback. A retrofit stays a
  possible future cleanup, not a prerequisite — near-term collisions are unlikely anyway (lessons reach
  ~13.8, new ones start above).

## Consequences

- State keys cleanly on one version string per release; `covered` is explicitly the derivable one.
- Generated filenames diverge from the tracked `NN-` lessons by design.
- Generated lessons introduce a small YAML frontmatter convention the existing lessons don't share.
- Collision detection needs a parser for the upstream prose `> Version:` line (best-effort).
