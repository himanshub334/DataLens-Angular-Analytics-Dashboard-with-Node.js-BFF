# DataLens — Angular Analytics Dashboard + Node.js BFF

A portfolio-ready analytics dashboard demonstrating Angular 16, TypeScript, RxJS, Chart.js, Angular Material, Node.js BFF, PostgreSQL, Docker and AWS-ready deployment.

## Features

- KPI cards for revenue, orders, customers and conversion
- Chart.js line/bar/doughnut visualizations
- Shared date-range filtering using an RxJS BehaviorSubject
- Sortable/filterable Angular Material data table
- Client-side pagination
- Responsive CSS Grid + Flexbox + mobile breakpoints
- OnPush change detection
- Lazy-loaded analytics route/module
- Node.js Backend-for-Frontend (BFF)
- PostgreSQL reporting queries
- Dashboard-specific DTOs so Angular does not depend on raw DB schema
- Docker Compose
- Jest/Supertest BFF tests
- GitHub Actions CI
- Seed data for local demo

## Architecture

```text
Angular 16
  |
  | HTTP
  v
Node.js BFF
  |
  | dashboard DTOs
  v
PostgreSQL
  |
  +-- daily metrics
  +-- KPI aggregation
  +-- table/reporting query
```

The BFF is intentionally responsible for adapting database results into UI-oriented DTOs. Angular never accesses PostgreSQL directly.

The dashboard endpoint returns:

```json
{
  "kpis": {},
  "revenueTrend": [],
  "ordersByChannel": [],
  "customerMix": [],
  "transactions": []
}
```


## GitHub

```bash
git init
git add .
git commit -m "Initial commit - DataLens analytics dashboard"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/DataLens.git
git push -u origin main
```

## Portfolio note

The repository is structured for an interview/demo environment. Run the application locally before claiming a specific deployment or bundle-size measurement. The architecture supports those measurements but does not fabricate them.
# DataLens-Angular-Analytics-Dashboard-with-Node.js-BFF
