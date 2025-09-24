import { useState, useRef, useEffect } from 'react';

interface UseMobileChartProps {
  title: string;
}

/**
 * Custom hook to handle mobile chart logic
 * 
 * This hook extracts the complex state management and business logic
 * from the MobileChart component, making the component simpler and
 * the logic more reusable.
 */
export function useMobileChart({ title }: UseMobileChartProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const expandButtonRef = useRef<HTMLButtonElement>(null);

  // Focus management for accessibility
  useEffect(() => {
    if (!isExpanded && expandButtonRef.current) {
      expandButtonRef.current.focus();
    }
  }, [isExpanded]);

  const generateChartId = () => {
    return `chart-title-${title.replace(/\s+/g, '-').toLowerCase()}`;
  };

  return {
    // State values
    isExpanded,
    expandButtonRef,
    
    // State setters
    setIsExpanded,
    
    // Functions
    generateChartId,
  };
}