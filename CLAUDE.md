# laravel-12-13-practice

A **content repo**, not a runnable app — no `composer.json`/`artisan`. It teaches Laravel 12→13 changes through markdown lesson briefs.

- **`lessons/NN-*.md`** — 12 chronological lesson briefs. New lessons start from `lessons/_template.md`.
- **`index.html`** — standalone progress tracker, saves to browser `localStorage` (Export/Import as JSON). No build step.
- Lessons are meant to be run with Matt Pocock's `/teach` skill, oldest first.

When editing a lesson, keep the brief format (what changed, why it matters, what to try, relevance questions) and match the existing lessons' tone.

## Agent skills

### Issue tracker

Issues and PRDs live in this repo's GitHub Issues, managed via the `gh` CLI. External PRs are **not** a triage surface. See `docs/agents/issue-tracker.md`.

### Triage labels

Default canonical vocabulary: `needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: one `CONTEXT.md` + `docs/adr/` at the repo root. See `docs/agents/domain.md`.
