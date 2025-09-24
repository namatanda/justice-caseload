"use client";

import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Filter, BarChart3, Upload, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function BottomNavigation() {
  const pathname = usePathname();
  const [activeIndex, setActiveIndex] = useState(0);

  const navItems = [
    { 
      name: 'Dashboard', 
      href: '/', 
      icon: LayoutDashboard,
      active: pathname === '/'
    },
    { 
      name: 'Filters', 
      href: '#', 
      icon: Filter,
      active: false // We'll handle this differently since it opens a sheet
    },
    { 
      name: 'Reports', 
      href: '#', 
      icon: BarChart3,
      active: false
    },
    { 
      name: 'Import', 
      href: '/import', 
      icon: Upload,
      active: pathname === '/import'
    },
    { 
      name: 'Settings', 
      href: '#', 
      icon: Settings,
      active: false
    }
  ];

  // Keyboard navigation support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        setActiveIndex(prev => Math.max(0, prev - 1));
      } else if (e.key === 'ArrowRight') {
        setActiveIndex(prev => Math.min(navItems.length - 1, prev + 1));
      } else if (e.key === 'Enter' || e.key === ' ') {
        // Navigate to the active item
        const activeItem = navItems[activeIndex];
        if (activeItem && activeItem.href !== '#') {
          window.location.href = activeItem.href;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex, navItems]);

  return (
    <nav 
      className="thumb-reachable-bottom safe-area-bottom bg-background border-t border-border z-50 md:hidden"
      style={{ 
        paddingBottom: 'env(safe-area-inset-bottom)',
        paddingLeft: 'env(safe-area-inset-left)',
        paddingRight: 'env(safe-area-inset-right)'
      }}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="grid grid-cols-5 gap-1 px-2 py-2">
        {navItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = index === activeIndex;
          
          return (
            <Link 
              key={item.name} 
              href={item.href} 
              className="flex flex-col items-center justify-center"
              aria-current={item.active ? "page" : undefined}
              tabIndex={isActive ? 0 : -1}
              onFocus={() => setActiveIndex(index)}
            >
              <Button
                variant={item.active ? "secondary" : "ghost"}
                size="icon"
                className={`touch-target rounded-full h-12 w-12 flex flex-col items-center justify-center ${
                  isActive ? 'ring-2 ring-primary' : ''
                }`}
                aria-label={item.name}
              >
                <Icon className={`h-5 w-5 ${item.active ? 'text-primary' : 'text-muted-foreground'}`} />
              </Button>
              <span className={`text-xs mt-1 ${item.active ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}