"use client";

import { EyeIcon, QueueListIcon, Squares2X2Icon } from "@heroicons/react/24/outline";

import { useUI } from "@/store/ui-store";

interface ViewModeToggleProps {
  className?: string;
}

export default function ViewModeToggle({ className = "" }: ViewModeToggleProps) {
  const { state: uiState, dispatch: uiDispatch } = useUI();

  const viewModeIcons = {
    minimal: EyeIcon,
    hover: Squares2X2Icon,
    expanded: QueueListIcon,
  };

  const viewModeLabels = {
    minimal: "Minimal View",
    hover: "Hover View",
    expanded: "Expanded View",
  };

  const handleToggle = () => {
    uiDispatch({ type: "TOGGLE_VIEW_MODE" });
  };

  const CurrentIcon = viewModeIcons[uiState.viewMode];

  return (
    <div className={`fixed bottom-4 right-4 z-40 ${className}`}>
      <button
        onClick={handleToggle}
        title={`Current: ${viewModeLabels[uiState.viewMode]} - Click to cycle`}
        className="bg-white border border-gray-200 rounded-lg p-3 shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out hover:bg-gray-50 group"
      >
        <CurrentIcon className="w-5 h-5 text-gray-600 group-hover:text-gray-800 transition-all duration-300 ease-in-out" />
        <div className="absolute bottom-full right-0 mb-2 px-2 py-1 text-xs font-medium text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
          {viewModeLabels[uiState.viewMode]}
          <div className="absolute top-full right-2 w-2 h-2 bg-gray-900 rotate-45 transform -translate-y-1"></div>
        </div>
      </button>
    </div>
  );
}
