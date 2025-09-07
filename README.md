# CourtFlow - Court Performance Dashboard

This is a web application that provides a comprehensive dashboard for monitoring key court performance metrics. It's built to help court administrators and stakeholders visualize and analyze judicial data effectively.

## Features

- **KPI Overview**: At-a-glance cards for critical metrics like Total Filed Cases, Total Resolved Cases, Pending Cases, Average Resolution Time, Clearance Rate, and Backlog Growth.
- **Data Import System**: Robust CSV data import functionality with validation, background processing, and real-time progress tracking.
- **Interactive Charts**:
    - **Case Trends**: A line chart showing the comparison of new cases filed, cases resolved, and pending cases over time.
    - **Case Age Distribution**: A bar chart that breaks down pending cases by their age.
    - **Backlog Trends by Court Level**: A line chart that shows backlog trends across different court levels (Supreme, High, District).
- **Dynamic Filtering**: A collapsible sidebar with filters for Time Period and Court Level, allowing users to drill down from court rank to specific court names.
- **Responsive Design**: The dashboard is fully responsive and works on various screen sizes, from mobile to desktop.

## Technology Stack

- **Framework**: [Next.js](https://nextjs.org/) (using the App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database**: PostgreSQL with Prisma ORM
- **Background Processing**: Redis with BullMQ for asynchronous job processing
- **UI Components**: Built with [React](https://react.dev/), [ShadCN UI](https://ui.shadcn.com/), and styled with [Tailwind CSS](https://tailwindcss.com/).
- **Charting**: [Recharts](https://recharts.org/) is used for creating the interactive charts.
- **Icons**: [Lucide React](https://lucide.dev/guide/packages/lucide-react) for a consistent and clean icon set.
- **AI Integration**: [Genkit](https://firebase.google.com/docs/genkit) for generative AI functionality.

## Getting Started

### Option 1: Using Docker (Recommended)

1. **Install Docker** - [Download Docker Desktop](https://www.docker.com/products/docker-desktop/)

2. **Configure Environment**:
   ```bash
   cp .env.example .env
   ```

3. **Start the Application**:
   ```bash
   docker-compose up --build
   ```

4. **Access the Application** - Visit [http://localhost:3000](http://localhost:3000)

### Option 2: Local Development Setup

1.  **Install dependencies**:
    ```bash
    npm install
    ```

2.  **Run the development server**:
    ```bash
    npm run dev
    ```

Open [http://localhost:9002](http://localhost:9002) with your browser to see the result.

You can start editing the main page by modifying `src/app/page.tsx`. The page auto-updates as you edit the file.

For detailed database setup instructions, see [DATABASE_SETUP.md](DATABASE_SETUP.md).
For Docker-specific instructions, see [DOCKER.md](DOCKER.md).
For information about the data import system, see [IMPORT_SYSTEM.md](IMPORT_SYSTEM.md).


#npx prisma studio --port 5556 // http://localhost:5556