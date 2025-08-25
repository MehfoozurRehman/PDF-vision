"use client";

import React, { useState, useRef } from "react";
import { Card } from "@/components/ui";
import {
  PaintBrushIcon,
  XMarkIcon,
  SwatchIcon,
  UnderlineIcon,
  StrikethroughIcon,
  TrashIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";

interface TextMarkup {
  id: string;
  type: "highlight" | "underline" | "strikethrough";
  text: string;
  position: { x: number; y: number; width: number; height: number };
  color: string;
  opacity: number;
  pageNumber: number;
  createdAt: Date;
  author: string;
  isVisible: boolean;
}

interface TextMarkupProps {
  pageNumber: number;
  onAddMarkup: (markup: Omit<TextMarkup, "id" | "createdAt">) => void;
  onUpdateMarkup: (id: string, updates: Partial<TextMarkup>) => void;
  onDeleteMarkup: (id: string) => void;
  markups: TextMarkup[];
  isActive: boolean;
  onClose: () => void;
}

const MARKUP_TYPES = [
  {
    id: "highlight" as const,
    name: "Highlight",
    icon: SwatchIcon,
    description: "Highlight important text",
  },
  {
    id: "underline" as const,
    name: "Underline",
    icon: UnderlineIcon,
    description: "Underline text for emphasis",
  },
  {
    id: "strikethrough" as const,
    name: "Strikethrough",
    icon: StrikethroughIcon,
    description: "Strike through text to mark as deleted",
  },
];

const HIGHLIGHT_COLORS = [
  { name: "Yellow", value: "#fbbf24", opacity: 0.3 },
  { name: "Green", value: "#10b981", opacity: 0.3 },
  { name: "Blue", value: "#3b82f6", opacity: 0.3 },
  { name: "Pink", value: "#ec4899", opacity: 0.3 },
  { name: "Purple", value: "#8b5cf6", opacity: 0.3 },
  { name: "Orange", value: "#f59e0b", opacity: 0.3 },
  { name: "Red", value: "#ef4444", opacity: 0.3 },
  { name: "Gray", value: "#6b7280", opacity: 0.3 },
];

const UNDERLINE_COLORS = [
  { name: "Red", value: "#ef4444", opacity: 1 },
  { name: "Blue", value: "#3b82f6", opacity: 1 },
  { name: "Green", value: "#10b981", opacity: 1 },
  { name: "Orange", value: "#f59e0b", opacity: 1 },
  { name: "Purple", value: "#8b5cf6", opacity: 1 },
  { name: "Black", value: "#000000", opacity: 1 },
];

export default function TextMarkup({
  pageNumber,
  onAddMarkup,
  onUpdateMarkup,
  onDeleteMarkup,
  markups,
  isActive,
  onClose,
}: TextMarkupProps) {
  const [selectedType, setSelectedType] = useState<"highlight" | "underline" | "strikethrough">("highlight");
  const [selectedColor, setSelectedColor] = useState("#fbbf24");
  const [opacity, setOpacity] = useState(0.3);
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionStart, setSelectionStart] = useState<{ x: number; y: number } | null>(null);
  const [currentSelection, setCurrentSelection] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);
  const [filter, setFilter] = useState<"all" | "highlight" | "underline" | "strikethrough">("all");

  const canvasRef = useRef<HTMLDivElement>(null);

  const pageMarkups = markups.filter((m) => m.pageNumber === pageNumber);
  const filteredMarkups = pageMarkups.filter((markup) => filter === "all" || markup.type === filter);

  const getColorsForType = (type: string) => {
    switch (type) {
      case "highlight":
        return HIGHLIGHT_COLORS;
      case "underline":
      case "strikethrough":
        return UNDERLINE_COLORS;
      default:
        return HIGHLIGHT_COLORS;
    }
  };

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!isActive) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    setIsSelecting(true);
    setSelectionStart({ x, y });
    setCurrentSelection({ x, y, width: 0, height: 0 });
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!isSelecting || !selectionStart) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const width = x - selectionStart.x;
    const height = y - selectionStart.y;

    setCurrentSelection({
      x: width < 0 ? x : selectionStart.x,
      y: height < 0 ? y : selectionStart.y,
      width: Math.abs(width),
      height: Math.abs(height),
    });
  };

  const handleMouseUp = () => {
    if (!isSelecting || !currentSelection || !selectionStart) return;

    setIsSelecting(false);

    // Only create markup if selection is large enough
    if (currentSelection.width > 10 && currentSelection.height > 5) {
      const selectedText = `Selected text (${Math.round(currentSelection.width)}x${Math.round(currentSelection.height)})`;

      onAddMarkup({
        type: selectedType,
        text: selectedText,
        position: currentSelection,
        color: selectedColor,
        opacity,
        pageNumber,
        author: "Current User",
        isVisible: true,
      });
    }

    setCurrentSelection(null);
    setSelectionStart(null);
  };

  const handleToggleVisibility = (markupId: string) => {
    const markup = markups.find((m) => m.id === markupId);
    if (markup) {
      onUpdateMarkup(markupId, { isVisible: !markup.isVisible });
    }
  };

  const handleColorChange = (color: string, newOpacity: number) => {
    setSelectedColor(color);
    setOpacity(newOpacity);
  };

  const renderMarkup = (markup: TextMarkup) => {
    if (!markup.isVisible) return null;

    const style: React.CSSProperties = {
      position: "absolute",
      left: markup.position.x,
      top: markup.position.y,
      width: markup.position.width,
      height: markup.position.height,
      pointerEvents: "none",
    };

    switch (markup.type) {
      case "highlight":
        return (
          <div
            key={markup.id}
            style={{
              ...style,
              backgroundColor: markup.color,
              opacity: markup.opacity,
            }}
          />
        );
      case "underline":
        return (
          <div
            key={markup.id}
            style={{
              ...style,
              borderBottom: `2px solid ${markup.color}`,
              opacity: markup.opacity,
            }}
          />
        );
      case "strikethrough":
        return (
          <div
            key={markup.id}
            style={{
              ...style,
              borderTop: `2px solid ${markup.color}`,
              top: markup.position.y + markup.position.height / 2,
              opacity: markup.opacity,
            }}
          />
        );
      default:
        return null;
    }
  };

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-6xl h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold flex items-center">
            <PaintBrushIcon className="w-5 h-5 mr-2" />
            Text Markup
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Tools Panel */}
          <div className="w-80 border-r border-gray-200 p-4 space-y-4 overflow-y-auto">
            {/* Markup Types */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Markup Type</h3>
              <div className="space-y-2">
                {MARKUP_TYPES.map((type) => {
                  const Icon = type.icon;
                  return (
                    <button
                      key={type.id}
                      onClick={() => setSelectedType(type.id)}
                      className={cn(
                        "w-full p-3 rounded-lg border text-left transition-colors",
                        selectedType === type.id
                          ? "bg-blue-50 border-blue-200 text-blue-700"
                          : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50",
                      )}
                    >
                      <div className="flex items-center">
                        <Icon className="w-5 h-5 mr-3" />
                        <div>
                          <div className="font-medium">{type.name}</div>
                          <div className="text-xs text-gray-500">{type.description}</div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Colors */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Colors</h3>
              <div className="grid grid-cols-4 gap-2">
                {getColorsForType(selectedType).map((color) => (
                  <button
                    key={color.value}
                    onClick={() => handleColorChange(color.value, color.opacity)}
                    className={cn(
                      "w-full h-10 rounded border-2 transition-all relative",
                      selectedColor === color.value
                        ? "border-gray-400 scale-105"
                        : "border-gray-200 hover:border-gray-300",
                    )}
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                  >
                    {selectedColor === color.value && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-3 h-3 bg-white rounded-full border border-gray-400" />
                      </div>
                    )}
                  </button>
                ))}
              </div>

              {/* Custom Color */}
              <div className="mt-2">
                <input
                  type="color"
                  value={selectedColor}
                  onChange={(e) => setSelectedColor(e.target.value)}
                  className="w-full h-8 rounded border border-gray-200"
                />
              </div>
            </div>

            {/* Opacity */}
            {selectedType === "highlight" && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Opacity: {Math.round(opacity * 100)}%</h3>
                <input
                  type="range"
                  min="0.1"
                  max="1"
                  step="0.1"
                  value={opacity}
                  onChange={(e) => setOpacity(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
            )}

            {/* Existing Markups */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-700">Markups ({filteredMarkups.length})</h3>
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value as any)}
                  className="text-xs border border-gray-200 rounded px-2 py-1"
                >
                  <option value="all">All</option>
                  <option value="highlight">Highlights</option>
                  <option value="underline">Underlines</option>
                  <option value="strikethrough">Strikethrough</option>
                </select>
              </div>

              <div className="space-y-2 max-h-40 overflow-y-auto">
                {filteredMarkups.map((markup) => (
                  <div key={markup.id} className="p-2 bg-gray-50 rounded border text-sm">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium capitalize">{markup.type}</span>
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => handleToggleVisibility(markup.id)}
                          className="p-1 hover:bg-gray-200 rounded"
                          title={markup.isVisible ? "Hide" : "Show"}
                        >
                          {markup.isVisible ? <EyeIcon className="w-3 h-3" /> : <EyeSlashIcon className="w-3 h-3" />}
                        </button>
                        <button
                          onClick={() => onDeleteMarkup(markup.id)}
                          className="p-1 hover:bg-red-100 text-red-600 rounded"
                          title="Delete"
                        >
                          <TrashIcon className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                    <div className="text-xs text-gray-600 truncate">{markup.text}</div>
                    <div
                      className="w-full h-2 rounded mt-1"
                      style={{ backgroundColor: markup.color, opacity: markup.opacity }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Canvas Area */}
          <div className="flex-1 p-4 bg-gray-50">
            <div className="w-full h-full bg-white rounded-lg shadow-sm border border-gray-200 relative overflow-hidden">
              <div
                ref={canvasRef}
                className="absolute inset-0 w-full h-full cursor-crosshair"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              >
                {/* Existing markups */}
                {filteredMarkups.map(renderMarkup)}

                {/* Current selection */}
                {currentSelection && isSelecting && (
                  <div
                    className="absolute border-2 border-dashed border-blue-500 bg-blue-100 bg-opacity-30 pointer-events-none"
                    style={{
                      left: currentSelection.x,
                      top: currentSelection.y,
                      width: currentSelection.width,
                      height: currentSelection.height,
                    }}
                  />
                )}
              </div>

              {/* Instructions */}
              <div className="absolute top-4 left-4 bg-white bg-opacity-90 rounded-lg p-3 text-sm text-gray-600">
                <div className="font-medium mb-1">Text Markup Instructions:</div>
                <div>• Select markup type from the left panel</div>
                <div>• Click and drag to select text area</div>
                <div>• Choose colors and opacity</div>
                <div className="mt-2 text-blue-600 font-medium">
                  Current: {selectedType.charAt(0).toUpperCase() + selectedType.slice(1)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
