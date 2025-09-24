# Product Overview

CourtFlow is a comprehensive court performance dashboard designed to help court administrators and stakeholders visualize and analyze judicial data effectively.

## Core Features

- **KPI Dashboard**: Real-time metrics for filed cases, resolved cases, pending cases, average resolution time, clearance rate, and backlog growth
- **Data Import System**: Robust CSV import with validation, background processing, and progress tracking
- **Interactive Analytics**: 
  - Case trends over time
  - Case age distribution analysis
  - Backlog trends by court level
- **Dynamic Filtering**: Time period and court level filters with drill-down capabilities
- **Responsive Design**: Mobile-first approach supporting all screen sizes

## Target Users

- Court administrators
- Judicial stakeholders
- Data analysts
- Performance monitoring teams

## Key Business Logic

- Cases flow through states: ACTIVE → RESOLVED/PENDING/TRANSFERRED
- Court hierarchy: Supreme → High → District → Magistrate
- Background job processing for large data imports
- Real-time metrics calculation and caching