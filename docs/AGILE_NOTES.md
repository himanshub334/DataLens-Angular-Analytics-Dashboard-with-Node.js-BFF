# Agile / Collaboration Notes

Use this file as the project working agreement/demo artifact.

## Example stories

### DL-101 — KPI dashboard
Acceptance criteria:
- Revenue, orders, customers and average order value are visible.
- Date range filters all metrics.
- Empty data range displays zero values.

### DL-102 — Responsive dashboard
Acceptance criteria:
- Desktop uses a multi-column grid.
- Tablet collapses chart sections.
- Mobile uses single-column cards.

### DL-103 — BFF dashboard DTO
Acceptance criteria:
- Angular receives one dashboard DTO.
- Raw PostgreSQL table structure is not exposed to the browser.
- Date filtering is performed server-side.

## Cross-functional collaboration

- UX: map design tokens and Figma layout into Angular Material/CSS components.
- QA: provide deterministic SQL seed data and expected API response examples.
- Product: explain refresh-rate constraints and document an acceptable polling interval.

## Sprint process

- Story refinement and acceptance criteria
- Planning poker / story-point estimation
- Daily standups
- Code review
- Retrospective action items
