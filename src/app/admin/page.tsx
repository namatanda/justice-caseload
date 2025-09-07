import { SystemHealthDashboard } from '@/components/admin/system-health';

export default function AdminPage() {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">System Administration</h1>
        <p className="text-muted-foreground">
          Monitor system health and manage background workers
        </p>
      </div>
      
      <SystemHealthDashboard />
    </div>
  );
}