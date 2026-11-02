# 無意味博物館 / MUSEUM OF NOTHING

A museum of useless, interactive web exhibits, intentionally never finished.

- **Live museum:** https://lovingthenhk-cpu.github.io/perpetual-nonsense-lab/
- **Infinite wing:** https://lovingthenhk-cpu.github.io/perpetual-nonsense-lab/infinite.html

## What it does

The home page contains small interactive experiments: oracles, orbital particles,
clocks, forms, weather reports, fake paperwork, biological specimens, calculators,
transmissions, and more. No account is necessary.

The infinite wing creates a new procedural canvas artifact every 9 seconds while
its page is open. Generated artifacts and the counter are stored in the browser's
localStorage, bounded to the 120 latest objects. These artifacts are local to
each browser, not new Git commits and not shared with other visitors.

## Expand the curated museum

Run with Python 3 (standard library only):

    python3 scripts/evolve.py --count 1

This appends new exhibits to data/catalogue.json without erasing old ones.
Commit and push changes to main, then GitHub Pages republishes them.

## GitHub Pages deployment status

GitHub Pages serves the root of the main branch, without a build step.
To set up truly remote unattended updates, a scheduled GitHub Actions workflow
with repository write and Pages deployment permissions would be needed.
Such a workflow is NOT installed in this repository at present.
A draft exists in the development workspace but requires GitHub
workflow-management privileges before upload.

GitHub's scheduled workflows may be delayed or disabled by prolonged repository
inactivity; they are not a promise of perpetual operation.

## Technical notes

- Vanilla HTML, CSS, JavaScript; no JS dependencies or backend.
- JavaScript Canvas 2D procedural visuals; not AI image generation.
- Responsive layout; supports reduced-motion preferences on main museum.
- No analytics, advertisements, or tracking scripts.
- Google Fonts import is optional; system fonts are fallbacks.

## License

Original code in this repository is released under the MIT License.
