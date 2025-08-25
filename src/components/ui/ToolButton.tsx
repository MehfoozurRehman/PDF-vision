"use client";

import { useEffect, useRef, useState } from "react";

import { useUI } from "@/store/ui-store";

interface ToolButtonProps {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  onClick: () => void;
  isActive?: boolean;
  className?: string;
}

export default function ToolButton({ title, icon: Icon, onClick, isActive = false, className = "" }: ToolButtonProps) {
  const { state: uiState } = useUI();
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (uiState.viewMode === "hover") {
      timeoutRef.current = setTimeout(() => {
        if (buttonRef.current) {
          const rect = buttonRef.current.getBoundingClientRect();
          setTooltipPosition({
            x: rect.left + rect.width / 2,
            y: rect.bottom + 8,
          });
          setShowTooltip(true);
        }
      }, 400); // 400ms delay
    }
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setShowTooltip(false);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Get icon size based on view mode
  const getIconSize = () => {
    switch (uiState.viewMode) {
      case "expanded":
        return "w-6 h-6"; // 20% larger than default w-5 h-5
      case "minimal":
      case "hover":
      default:
        return "w-5 h-5";
    }
  };

  // Get button classes based on view mode
  const getButtonClasses = () => {
    const baseClasses = "rounded-md transition-all duration-200 ease-in-out";
    const activeClasses = isActive ? "bg-blue-100 text-blue-700" : "text-gray-600 hover:bg-gray-100";

    switch (uiState.viewMode) {
      case "expanded":
        return `${baseClasses} ${activeClasses} p-3 flex flex-col items-center space-y-1 min-w-[60px] ${className}`;
      case "minimal":
      case "hover":
      default:
        return `${baseClasses} ${activeClasses} p-2 ${className}`;
    }
  };

  return (
    <>
      <button
        ref={buttonRef}
        title={uiState.viewMode === "minimal" ? title : undefined}
        onClick={onClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`${getButtonClasses()} transition-all duration-300 ease-in-out`}
      >
        <Icon className={`${getIconSize()} transition-all duration-300 ease-in-out`} />
        {uiState.viewMode === "expanded" && (
          <span className="text-xs font-medium text-center leading-tight max-w-[50px] truncate">{title}</span>
        )}
      </button>

      {/* Tooltip for hover mode */}
      {showTooltip && uiState.viewMode === "hover" && (
        <div
          className="fixed z-50 px-2 py-1 text-sm font-medium text-white bg-gray-900 rounded shadow-lg pointer-events-none transform -translate-x-1/2"
          style={{
            left: tooltipPosition.x,
            top: tooltipPosition.y,
          }}
        >
          {title}
          <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
        </div>
      )}
    </>
  );
}
