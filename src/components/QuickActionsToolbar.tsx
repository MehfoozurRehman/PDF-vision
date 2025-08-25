"use client";

import {
  BookmarkIcon,
  ChatBubbleLeftIcon,
  Cog6ToothIcon,
  DocumentTextIcon,
  HandRaisedIcon,
  MinusIcon,
  PaintBrushIcon,
  PencilIcon,
  PencilSquareIcon,
  PlusIcon,
  SwatchIcon,
} from "@heroicons/react/24/outline";
import {
  BookmarkIcon as BookmarkSolidIcon,
  ChatBubbleLeftIcon as ChatBubbleLeftSolidIcon,
  DocumentTextIcon as DocumentTextSolidIcon,
  HandRaisedIcon as HandRaisedSolidIcon,
  PaintBrushIcon as PaintBrushSolidIcon,
  PencilIcon as PencilSolidIcon,
  PencilSquareIcon as PencilSquareSolidIcon,
  SwatchIcon as SwatchSolidIcon,
} from "@heroicons/react/24/solid";

import React from "react";
import { useUI } from "@/store/ui-store";

interface QuickAction {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  solidIcon: React.ComponentType<{ className?: string }>;
  tooltip: string;
  shortcut?: string;
  category: "annotation" | "editing" | "navigation" | "drawing";
}

const DEFAULT_QUICK_ACTIONS: QuickAction[] = [
  {
    id: "highlight",
    name: "Highlight",
    icon: SwatchIcon,
    solidIcon: SwatchSolidIcon,
    tooltip: "Highlight text (H)",
    shortcut: "H",
    category: "annotation",
  },
  {
    id: "text",
    name: "Add Text",
    icon: DocumentTextIcon,
    solidIcon: DocumentTextSolidIcon,
    tooltip: "Add text annotation (T)",
    shortcut: "T",
    category: "editing",
  },
  {
    id: "signature",
    name: "Signature",
    icon: HandRaisedIcon,
    solidIcon: HandRaisedSolidIcon,
    tooltip: "Add signature (S)",
    shortcut: "S",
    category: "editing",
  },
  {
    id: "draw",
    name: "Draw",
    icon: PencilIcon,
    solidIcon: PencilSolidIcon,
    tooltip: "Draw freehand (D)",
    shortcut: "D",
    category: "drawing",
  },
  {
    id: "comment",
    name: "Comment",
    icon: ChatBubbleLeftIcon,
    solidIcon: ChatBubbleLeftSolidIcon,
    tooltip: "Add comment (C)",
    shortcut: "C",
    category: "annotation",
  },
  {
    id: "bookmark",
    name: "Bookmark",
    icon: BookmarkIcon,
    solidIcon: BookmarkSolidIcon,
    tooltip: "Add bookmark (B)",
    shortcut: "B",
    category: "navigation",
  },
  {
    id: "shape",
    name: "Shape",
    icon: PencilSquareIcon,
    solidIcon: PencilSquareSolidIcon,
    tooltip: "Draw shapes (Shift+D)",
    shortcut: "Shift+D",
    category: "drawing",
  },
  {
    id: "paint",
    name: "Paint",
    icon: PaintBrushIcon,
    solidIcon: PaintBrushSolidIcon,
    tooltip: "Paint tool (P)",
    shortcut: "P",
    category: "drawing",
  },
];

export default function QuickActionsToolbar() {
  const { state: uiState, dispatch: uiDispatch } = useUI();
  const [isCustomizing, setIsCustomizing] = React.useState(false);
  const [quickActions, setQuickActions] = React.useState(DEFAULT_QUICK_ACTIONS);
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  const handleToolSelect = (toolId: string) => {
    // Only allow valid tool types
    const validTools = ["select", "hand", "text", "highlight", "note", "drawing", "signature"] as const;
    if (validTools.includes(toolId as any)) {
      uiDispatch({
        type: "SET_ACTIVE_TOOL",
        payload: toolId as (typeof validTools)[number],
      });
    }
  };

  const isToolActive = (toolId: string) => uiState.activeTool === toolId;

  const toggleCustomization = () => {
    setIsCustomizing(!isCustomizing);
  };

  const addAction = (action: QuickAction) => {
    if (!quickActions.find((a) => a.id === action.id)) {
      setQuickActions([...quickActions, action]);
    }
  };

  const removeAction = (actionId: string) => {
    setQuickActions(quickActions.filter((a) => a.id !== actionId));
  };

  const moveAction = (fromIndex: number, toIndex: number) => {
    const newActions = [...quickActions];
    const [movedAction] = newActions.splice(fromIndex, 1);
    newActions.splice(toIndex, 0, movedAction);
    setQuickActions(newActions);
  };

  const resetToDefaults = () => {
    setQuickActions(DEFAULT_QUICK_ACTIONS);
  };

  if (isCollapsed) {
    return (
      <div className="fixed left-4 top-1/2 transform -translate-y-1/2 z-40">
        <button
          onClick={() => setIsCollapsed(false)}
          className="bg-white shadow-lg border border-gray-200 rounded-lg p-2 hover:bg-gray-50 transition-colors"
          title="Expand Quick Actions"
        >
          <PlusIcon className="w-4 h-4 text-gray-600" />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed left-4 top-1/2 transform -translate-y-1/2 z-40">
      <div className="bg-white shadow-lg border border-gray-200 rounded-xl p-2 max-w-xs">
        {/* Header */}
        <div className="flex items-center justify-between mb-2 px-1">
          <h3 className="text-xs font-medium text-gray-700">Quick Actions</h3>
          <div className="flex items-center space-x-1">
            <button
              onClick={toggleCustomization}
              className={`p-1 rounded transition-colors ${
                isCustomizing ? "bg-blue-100 text-blue-600" : "text-gray-400 hover:text-gray-600"
              }`}
              title="Customize toolbar"
            >
              <Cog6ToothIcon className="w-3 h-3" />
            </button>
            <button
              onClick={() => setIsCollapsed(true)}
              className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
              title="Collapse toolbar"
            >
              <MinusIcon className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-2 gap-1">
          {quickActions.slice(0, isCustomizing ? quickActions.length : 8).map((action, index) => {
            const IconComponent = isToolActive(action.id) ? action.solidIcon : action.icon;

            return (
              <div key={action.id} className="relative group">
                <button
                  onClick={() => handleToolSelect(action.id)}
                  className={`w-full p-2 rounded-lg transition-all duration-200 flex flex-col items-center space-y-1 ${
                    isToolActive(action.id)
                      ? "bg-blue-100 text-blue-600 shadow-sm"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
                  }`}
                  title={action.tooltip}
                >
                  <IconComponent className="w-4 h-4" />
                  <span className="text-xs font-medium truncate w-full text-center">{action.name}</span>
                  {action.shortcut && <span className="text-xs text-gray-400 font-mono">{action.shortcut}</span>}
                </button>

                {/* Customization controls */}
                {isCustomizing && (
                  <div className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => removeAction(action.id)}
                      className="bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                      title="Remove action"
                    >
                      ×
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Customization Panel */}
        {isCustomizing && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-700">Customize</span>
                <button
                  onClick={resetToDefaults}
                  className="text-xs text-blue-600 hover:text-blue-700 transition-colors"
                >
                  Reset
                </button>
              </div>

              {/* Available Actions */}
              <div className="text-xs text-gray-500 mb-1">Available Tools:</div>
              <div className="grid grid-cols-4 gap-1">
                {DEFAULT_QUICK_ACTIONS.filter((action) => !quickActions.find((qa) => qa.id === action.id)).map(
                  (action) => {
                    const IconComponent = action.icon;
                    return (
                      <button
                        key={action.id}
                        onClick={() => addAction(action)}
                        className="p-1 rounded border border-dashed border-gray-300 hover:border-blue-400 hover:bg-blue-50 transition-colors flex flex-col items-center"
                        title={`Add ${action.name}`}
                      >
                        <IconComponent className="w-3 h-3 text-gray-400" />
                        <span className="text-xs text-gray-500 truncate w-full text-center mt-0.5">{action.name}</span>
                      </button>
                    );
                  },
                )}
              </div>
            </div>
          </div>
        )}

        {/* Category Filter (when customizing) */}
        {isCustomizing && (
          <div className="mt-2 pt-2 border-t border-gray-200">
            <div className="text-xs text-gray-500 mb-1">Categories:</div>
            <div className="flex flex-wrap gap-1">
              {["annotation", "editing", "navigation", "drawing"].map((category) => (
                <span key={category} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs capitalize">
                  {category}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
