"use client";

import React, { useState, useRef, useEffect } from 'react';
import { LayoutDashboard, Upload, Bell, User, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import Link from 'next/link';
import { useIsMobile } from '@/hooks/use-mobile';

interface MobileHeaderProps {
  onMenuToggle?: () => void;
  isMenuOpen?: boolean;
}

export function MobileHeader({ onMenuToggle, isMenuOpen }: MobileHeaderProps) {
  const isMobile = useIsMobile();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const notificationsButtonRef = useRef<HTMLButtonElement>(null);
  const userMenuButtonRef = useRef<HTMLButtonElement>(null);

  // Handle keyboard navigation for sheets
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setNotificationsOpen(false);
        setUserMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Focus management for accessibility
  useEffect(() => {
    if (notificationsOpen && notificationsButtonRef.current) {
      const focusableElements = document.querySelectorAll(
        '#notifications-sheet button, #notifications-sheet a, #notifications-sheet input'
      );
      if (focusableElements.length > 0) {
        (focusableElements[0] as HTMLElement).focus();
      }
    }
  }, [notificationsOpen]);

  useEffect(() => {
    if (userMenuOpen && userMenuButtonRef.current) {
      const focusableElements = document.querySelectorAll(
        '#user-menu-sheet button, #user-menu-sheet a, #user-menu-sheet input'
      );
      if (focusableElements.length > 0) {
        (focusableElements[0] as HTMLElement).focus();
      }
    }
  }, [userMenuOpen]);

  // For mobile, we'll use a sheet for notifications and user menu
  return (
    <header 
      className="thumb-reachable-top safe-area-top bg-background border-b border-border z-50"
      style={{ 
        minHeight: '56px',
        paddingTop: 'env(safe-area-inset-top)',
        paddingLeft: 'env(safe-area-inset-left)',
        paddingRight: 'env(safe-area-inset-right)'
      }}
      role="banner"
    >
      <div className="flex items-center justify-between h-full px-4">
        {/* Left side - Menu button and title */}
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="touch-target"
            onClick={onMenuToggle}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
          <div className="flex items-center gap-2">
            <LayoutDashboard className="h-6 w-6 text-primary hidden sm:block" />
            <h1 className="text-lg font-bold text-primary truncate max-w-[140px] sm:max-w-[200px]">
              CourtFlow
            </h1>
          </div>
        </div>

        {/* Right side - Action buttons */}
        <div className="flex items-center gap-1">
          <Link href="/import" passHref>
            <Button 
              variant="ghost" 
              size="icon" 
              className="touch-target relative"
              aria-label="Import data"
            >
              <Upload className="h-5 w-5" />
            </Button>
          </Link>
          
          {/* Notifications button */}
          <Sheet open={notificationsOpen} onOpenChange={setNotificationsOpen}>
            <SheetTrigger asChild>
              <Button 
                ref={notificationsButtonRef}
                variant="ghost" 
                size="icon" 
                className="touch-target relative"
                aria-label="Notifications"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" aria-hidden="true"></span>
                <span className="sr-only">You have new notifications</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]" id="notifications-sheet">
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between border-b pb-4">
                  <SheetTitle>Notifications</SheetTitle>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => setNotificationsOpen(false)}
                    aria-label="Close notifications"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex-1 py-4">
                  <p className="text-muted-foreground text-center py-8">
                    No new notifications
                  </p>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          {/* User menu */}
          <Sheet open={userMenuOpen} onOpenChange={setUserMenuOpen}>
            <SheetTrigger asChild>
              <Button 
                ref={userMenuButtonRef}
                variant="ghost" 
                size="icon" 
                className="touch-target"
                aria-label="User menu"
              >
                <User className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]" id="user-menu-sheet">
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between border-b pb-4">
                  <SheetTitle>User Menu</SheetTitle>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => setUserMenuOpen(false)}
                    aria-label="Close user menu"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex-1 py-4">
                  <div className="space-y-4">
                    <Button variant="outline" className="w-full justify-start" role="menuitem">
                      Profile Settings
                    </Button>
                    <Button variant="outline" className="w-full justify-start" role="menuitem">
                      System Preferences
                    </Button>
                    <Button variant="outline" className="w-full justify-start" role="menuitem">
                      Help & Support
                    </Button>
                    <Button variant="destructive" className="w-full justify-start" role="menuitem">
                      Sign Out
                    </Button>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}