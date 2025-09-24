/**
 * Admin Layout Component
 * 
 * Provides the layout for administrative pages with appropriate navigation and access controls
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Settings, Users, Database, FileText } from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  showBackButton?: boolean;
}

const adminNavItems = [
  {
    href: '/admin',
    label: 'Overview',
    icon: Settings,
  },
  {
    href: '/admin/users',
    label: 'User Management',
    icon: Users,
  },
  {
    href: '/admin/system',
    label: 'System Health',
    icon: Database,
  },
  {
    href: '/admin/logs',
    label: 'System Logs',
    icon: FileText,
  },
];

export function AdminLayout({ 
  children, 
  title = "Admin Panel",
  description = "System administration and management.",
  showBackButton = true
}: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Admin Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            {showBackButton && (
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
            )}
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-primary">{title}</h1>
              {description && (
                <p className="text-muted-foreground mt-1">{description}</p>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Admin Navigation Sidebar */}
          <aside className="lg:col-span-1">
            <Card className="p-4">
              <h3 className="font-semibold mb-4">Admin Navigation</h3>
              <nav className="space-y-2">
                {adminNavItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link key={item.href} href={item.href}>
                      <Button 
                        variant="ghost" 
                        className="w-full justify-start"
                        size="sm"
                      >
                        <Icon className="h-4 w-4 mr-2" />
                        {item.label}
                      </Button>
                    </Link>
                  );
                })}
              </nav>
            </Card>
          </aside>

          {/* Main Admin Content */}
          <main className="lg:col-span-3">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}

export default AdminLayout;