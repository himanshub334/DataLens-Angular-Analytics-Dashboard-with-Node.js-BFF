# BFF Query Notes

The BFF intentionally aggregates multiple PostgreSQL queries in parallel with `Promise.all`.

This prevents the Angular application from needing to know:

- table names
- joins
- PostgreSQL numeric types
- database-specific aggregation
- reporting query structure

The response is shaped specifically for the dashboard.

If the PostgreSQL schema changes later, only the BFF mapping/query layer needs to adapt while the Angular contract can remain stable.
