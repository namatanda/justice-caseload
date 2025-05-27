import { OverviewCard } from '@/components/dashboard/overview-card';
import { FiledCasesChart } from '@/components/dashboard/filed-cases-chart';
import { ResolvedCasesChart } from '@/components/dashboard/resolved-cases-chart';
import { PendingCasesChart } from '@/components/dashboard/pending-cases-chart';
import { JudgeWorkloadChart } from '@/components/dashboard/judge-workload-chart';
import { Activity, CheckCircle2, FileText, Hourglass, LayoutDashboard } from 'lucide-react';

export default function DashboardPage() {
  const totalFiled = 1250;
  const totalResolved = 980;
  const totalPending = 270;
  const averageResolutionTime = '45 days';

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-8">
      <header className="mb-8">
        <div className="flex items-center gap-3">
          <LayoutDashboard className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold text-primary">
            CourtFlow Dashboard
          </h1>
        </div>
        <p className="text-muted-foreground mt-1">Key court performance metrics overview.</p>
      </header>

      <section className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <OverviewCard 
          title="Total Filed Cases" 
          value={totalFiled.toLocaleString()} 
          icon={<FileText className="h-5 w-5 text-primary" />} 
          description="All cases entered into the system." 
        />
        <OverviewCard 
          title="Total Resolved Cases" 
          value={totalResolved.toLocaleString()} 
          icon={<CheckCircle2 className="h-5 w-5 text-[hsl(var(--chart-2))]" />} 
          description="Cases successfully concluded."
          valueClassName="text-[hsl(var(--chart-2))]"
        />
        <OverviewCard 
          title="Total Pending Cases" 
          value={totalPending.toLocaleString()} 
          icon={<Hourglass className="h-5 w-5 text-accent" />} 
          description="Cases currently awaiting resolution."
          valueClassName="text-accent"
        />
        <OverviewCard 
          title="Avg. Resolution Time" 
          value={averageResolutionTime} 
          icon={<Activity className="h-5 w-5 text-[hsl(var(--chart-4))]" />} 
          description="Average time to resolve cases."
          valueClassName="text-[hsl(var(--chart-4))]"
        />
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <FiledCasesChart />
        <ResolvedCasesChart />
        <PendingCasesChart />
        <JudgeWorkloadChart />
      </section>

      <footer className="mt-12 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} CourtFlow. All rights reserved.</p>
      </footer>
    </div>
  );
}
