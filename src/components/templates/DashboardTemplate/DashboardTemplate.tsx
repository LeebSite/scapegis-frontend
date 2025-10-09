import React, { useState, useEffect } from 'react';
import { DashboardSidebar, DashboardHeader } from '../../organisms';
import { MobileTopBar } from '../../molecules';
import { cn } from '../../../utils/cn';

interface DashboardTemplateProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  headerActions?: React.ReactNode;
  user?: {
    name: string;
    email: string;
    avatar?: string;
    workspace: string;
  };
  className?: string;
  onLogout?: () => void;
}

const DashboardTemplate: React.FC<DashboardTemplateProps> = ({
  children,
  title,
  subtitle,
  headerActions,
  user,
  className,
  onLogout,
}) => {
  const [activeItem, setActiveItem] = useState('recents');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if screen is mobile
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
      // Close sidebar on desktop
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(false);
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const handleItemClick = (item: string) => {
    setActiveItem(item);
    // Close sidebar on mobile after selection
    if (isMobile) {
      setIsSidebarOpen(false);
    }
    // Handle navigation logic here
    console.log('Navigate to:', item);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className={cn('flex h-screen bg-gray-50', className)}>
      {/* Mobile Backdrop */}
      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <DashboardSidebar
        user={user}
        activeItem={activeItem}
        onItemClick={handleItemClick}
        isOpen={isSidebarOpen}
        onClose={closeSidebar}
        isMobile={isMobile}
        onLogout={onLogout}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Top Bar */}
        {isMobile && (
          <MobileTopBar
            title={title}
            onMenuClick={toggleSidebar}
          />
        )}

        {/* Desktop Header */}
        {!isMobile && (
          <DashboardHeader
            title={title}
            subtitle={subtitle}
            actions={headerActions}
            onMenuClick={toggleSidebar}
            isMobile={isMobile}
          />
        )}

        {/* Content */}
        <main className="flex-1 overflow-auto bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardTemplate;