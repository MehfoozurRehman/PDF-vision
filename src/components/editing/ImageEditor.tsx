"use client";

import React, { useState, useRef, useCallback } from "react";
import {
  PhotoIcon,
  XMarkIcon,
  ArrowsPointingOutIcon,
  ArrowsPointingInIcon,
  ArrowPathIcon,
  TrashIcon,
  AdjustmentsHorizontalIcon,
  SwatchIcon,
  ScissorsIcon,
  SparklesIcon,
  EyeDropperIcon,
  SunIcon,
  MoonIcon,
} from "@heroicons/react/24/outline";
import { Card } from "@/components/ui";

interface ImageElement {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  originalWidth: number;
  originalHeight: number;
  src: string;
  rotation: number;
  opacity: number;
  flipX: boolean;
  flipY: boolean;
  borderWidth: number;
  borderColor: string;
  borderStyle: "solid" | "dashed" | "dotted";
  shadow: boolean;
  // Advanced image editing properties
  brightness: number;
  contrast: number;
  saturation: number;
  hue: number;
  blur: number;
  sepia: number;
  grayscale: number;
  invert: boolean;
  cropX: number;
  cropY: number;
  cropWidth: number;
  cropHeight: number;
  backgroundColor: string;
  borderRadius: number;
  skewX: number;
  skewY: number;
  scaleX: number;
  scaleY: number;
}

interface ImageEditorProps {
  isVisible: boolean;
  onClose: () => void;
  onAddImage: (element: Omit<ImageElement, "id">) => void;
  onUpdateImage: (id: string, updates: Partial<ImageElement>) => void;
  onDeleteImage: (id: string) => void;
  imageElements: ImageElement[];
  canvasWidth: number;
  canvasHeight: number;
}

const BORDER_STYLES = ["solid", "dashed", "dotted"] as const;
const BORDER_COLORS = [
  "#000000",
  "#FFFFFF",
  "#FF0000",
  "#00FF00",
  "#0000FF",
  "#FFFF00",
  "#FF00FF",
  "#00FFFF",
  "#FFA500",
  "#800080",
];

const FILTER_PRESETS = [
  { name: "None", filters: {} },
  { name: "Vintage", filters: { sepia: 0.5, contrast: 1.2, brightness: 0.9 } },
  { name: "Black & White", filters: { grayscale: 1 } },
  { name: "High Contrast", filters: { contrast: 1.5, brightness: 1.1 } },
  { name: "Warm", filters: { hue: 15, saturation: 1.2, brightness: 1.05 } },
  { name: "Cool", filters: { hue: -15, saturation: 1.1, brightness: 0.95 } },
  { name: "Dramatic", filters: { contrast: 1.4, saturation: 1.3, brightness: 0.9 } },
];

export const ImageEditor: React.FC<ImageEditorProps> = ({
  isVisible,
  onClose,
  onAddImage,
  onUpdateImage,
  onDeleteImage,
  imageElements,
  canvasWidth,
  canvasHeight,
}) => {
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [isAddingImage, setIsAddingImage] = useState(false);
  const [draggedElement, setDraggedElement] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [resizeHandle, setResizeHandle] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file || !file.type.startsWith("image/")) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const maxWidth = 300;
          const maxHeight = 300;
          const aspectRatio = img.width / img.height;

          let width = img.width;
          let height = img.height;

          if (width > maxWidth) {
            width = maxWidth;
            height = width / aspectRatio;
          }

          if (height > maxHeight) {
            height = maxHeight;
            width = height * aspectRatio;
          }

          const newElement: Omit<ImageElement, "id"> = {
            x: 50,
            y: 50,
            width,
            height,
            originalWidth: img.width,
            originalHeight: img.height,
            src: e.target?.result as string,
            rotation: 0,
            opacity: 1,
            flipX: false,
            flipY: false,
            borderWidth: 0,
            borderColor: "#000000",
            borderStyle: "solid",
            shadow: false,
            // Advanced image editing properties
            brightness: 1,
            contrast: 1,
            saturation: 1,
            hue: 0,
            blur: 0,
            sepia: 0,
            grayscale: 0,
            invert: false,
            cropX: 0,
            cropY: 0,
            cropWidth: width,
            cropHeight: height,
            backgroundColor: "transparent",
            borderRadius: 0,
            skewX: 0,
            skewY: 0,
            scaleX: 1,
            scaleY: 1,
          };

          onAddImage(newElement);
          setIsAddingImage(false);
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    },
    [onAddImage],
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent, elementId: string, action: "drag" | "resize", handle?: string) => {
      e.preventDefault();
      e.stopPropagation();

      const element = imageElements.find((el) => el.id === elementId);
      if (!element) return;

      if (action === "drag") {
        setDraggedElement(elementId);
        setDragOffset({
          x: e.clientX - element.x,
          y: e.clientY - element.y,
        });
      } else if (action === "resize" && handle) {
        setResizeHandle(`${elementId}-${handle}`);
      }

      setSelectedElement(elementId);
    },
    [imageElements],
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (draggedElement) {
        const newX = e.clientX - dragOffset.x;
        const newY = e.clientY - dragOffset.y;
        onUpdateImage(draggedElement, { x: newX, y: newY });
      } else if (resizeHandle) {
        const [elementId, handle] = resizeHandle.split("-");
        const element = imageElements.find((el) => el.id === elementId);
        if (!element) return;

        const rect = e.currentTarget.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        let newWidth = element.width;
        let newHeight = element.height;
        let newX = element.x;
        let newY = element.y;

        const aspectRatio = element.originalWidth / element.originalHeight;

        switch (handle) {
          case "se": // Southeast
            newWidth = mouseX - element.x;
            newHeight = newWidth / aspectRatio;
            break;
          case "sw": // Southwest
            newWidth = element.x + element.width - mouseX;
            newHeight = newWidth / aspectRatio;
            newX = mouseX;
            break;
          case "ne": // Northeast
            newWidth = mouseX - element.x;
            newHeight = newWidth / aspectRatio;
            newY = element.y + element.height - newHeight;
            break;
          case "nw": // Northwest
            newWidth = element.x + element.width - mouseX;
            newHeight = newWidth / aspectRatio;
            newX = mouseX;
            newY = element.y + element.height - newHeight;
            break;
        }

        if (newWidth > 20 && newHeight > 20) {
          onUpdateImage(elementId, {
            x: newX,
            y: newY,
            width: newWidth,
            height: newHeight,
          });
        }
      }
    },
    [draggedElement, dragOffset, resizeHandle, imageElements, onUpdateImage],
  );

  const handleMouseUp = useCallback(() => {
    setDraggedElement(null);
    setResizeHandle(null);
    setDragOffset({ x: 0, y: 0 });
  }, []);

  const handleUpdateElement = (id: string, field: keyof ImageElement, value: any) => {
    onUpdateImage(id, { [field]: value });
  };

  const getSelectedElement = () => {
    return imageElements.find((el) => el.id === selectedElement);
  };

  const selectedEl = getSelectedElement();

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-6xl h-5/6 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-neutral-200">
          <h2 className="text-lg font-semibold text-neutral-900">Image Editor</h2>
          <button onClick={onClose} className="btn btn-ghost btn-sm text-neutral-500 hover:text-neutral-700">
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Toolbar */}
          <div className="w-80 border-r border-neutral-200 p-4 overflow-y-auto">
            <div className="space-y-6">
              {/* Add Image Button */}
              <div>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
                <button onClick={() => fileInputRef.current?.click()} className="btn btn-primary w-full">
                  <PhotoIcon className="w-4 h-4 mr-2" />
                  Add Image
                </button>
              </div>

              {/* Selected Element Controls */}
              {selectedEl && (
                <div className="space-y-4">
                  <h3 className="font-medium text-neutral-900">Selected Image</h3>

                  {/* Transform Controls */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-neutral-700">Transform</h4>

                    {/* Position */}
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs text-neutral-600 mb-1">X Position</label>
                        <input
                          type="number"
                          value={Math.round(selectedEl.x)}
                          onChange={(e) => handleUpdateElement(selectedEl.id, "x", parseInt(e.target.value) || 0)}
                          className="input input-sm w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-neutral-600 mb-1">Y Position</label>
                        <input
                          type="number"
                          value={Math.round(selectedEl.y)}
                          onChange={(e) => handleUpdateElement(selectedEl.id, "y", parseInt(e.target.value) || 0)}
                          className="input input-sm w-full"
                        />
                      </div>
                    </div>

                    {/* Size */}
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs text-neutral-600 mb-1">Width</label>
                        <input
                          type="number"
                          value={Math.round(selectedEl.width)}
                          onChange={(e) => {
                            const newWidth = parseInt(e.target.value) || 0;
                            const aspectRatio = selectedEl.originalWidth / selectedEl.originalHeight;
                            const newHeight = newWidth / aspectRatio;
                            handleUpdateElement(selectedEl.id, "width", newWidth);
                            handleUpdateElement(selectedEl.id, "height", newHeight);
                          }}
                          className="input input-sm w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-neutral-600 mb-1">Height</label>
                        <input
                          type="number"
                          value={Math.round(selectedEl.height)}
                          onChange={(e) => {
                            const newHeight = parseInt(e.target.value) || 0;
                            const aspectRatio = selectedEl.originalWidth / selectedEl.originalHeight;
                            const newWidth = newHeight * aspectRatio;
                            handleUpdateElement(selectedEl.id, "height", newHeight);
                            handleUpdateElement(selectedEl.id, "width", newWidth);
                          }}
                          className="input input-sm w-full"
                        />
                      </div>
                    </div>

                    {/* Rotation */}
                    <div>
                      <label className="block text-xs text-neutral-600 mb-1">Rotation (degrees)</label>
                      <input
                        type="range"
                        min="0"
                        max="360"
                        value={selectedEl.rotation}
                        onChange={(e) => handleUpdateElement(selectedEl.id, "rotation", parseInt(e.target.value))}
                        className="w-full"
                      />
                      <div className="text-xs text-neutral-500 text-center">{selectedEl.rotation}°</div>
                    </div>

                    {/* Opacity */}
                    <div>
                      <label className="block text-xs text-neutral-600 mb-1">Opacity</label>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={selectedEl.opacity}
                        onChange={(e) => handleUpdateElement(selectedEl.id, "opacity", parseFloat(e.target.value))}
                        className="w-full"
                      />
                      <div className="text-xs text-neutral-500 text-center">
                        {Math.round(selectedEl.opacity * 100)}%
                      </div>
                    </div>

                    {/* Flip Controls */}
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleUpdateElement(selectedEl.id, "flipX", !selectedEl.flipX)}
                        className={`btn btn-sm flex-1 ${selectedEl.flipX ? "btn-primary" : "btn-secondary"}`}
                      >
                        Flip X
                      </button>
                      <button
                        onClick={() => handleUpdateElement(selectedEl.id, "flipY", !selectedEl.flipY)}
                        className={`btn btn-sm flex-1 ${selectedEl.flipY ? "btn-primary" : "btn-secondary"}`}
                      >
                        Flip Y
                      </button>
                    </div>
                  </div>

                  {/* Border Controls */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-neutral-700">Border</h4>

                    {/* Border Width */}
                    <div>
                      <label className="block text-xs text-neutral-600 mb-1">Border Width</label>
                      <input
                        type="range"
                        min="0"
                        max="20"
                        value={selectedEl.borderWidth}
                        onChange={(e) => handleUpdateElement(selectedEl.id, "borderWidth", parseInt(e.target.value))}
                        className="w-full"
                      />
                      <div className="text-xs text-neutral-500 text-center">{selectedEl.borderWidth}px</div>
                    </div>

                    {/* Border Style */}
                    <div>
                      <label className="block text-xs text-neutral-600 mb-1">Border Style</label>
                      <select
                        value={selectedEl.borderStyle}
                        onChange={(e) => handleUpdateElement(selectedEl.id, "borderStyle", e.target.value)}
                        className="input input-sm w-full"
                      >
                        {BORDER_STYLES.map((style) => (
                          <option key={style} value={style}>
                            {style}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Border Color */}
                    <div>
                      <label className="block text-xs text-neutral-600 mb-1">Border Color</label>
                      <div className="grid grid-cols-5 gap-1">
                        {BORDER_COLORS.map((color) => (
                          <button
                            key={color}
                            onClick={() => handleUpdateElement(selectedEl.id, "borderColor", color)}
                            className={`w-6 h-6 rounded border-2 ${
                              selectedEl.borderColor === color ? "border-primary-500" : "border-neutral-300"
                            }`}
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Effects */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-neutral-700">Effects</h4>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={selectedEl.shadow}
                        onChange={(e) => handleUpdateElement(selectedEl.id, "shadow", e.target.checked)}
                        className="checkbox"
                      />
                      <label className="text-sm text-neutral-700">Drop Shadow</label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={selectedEl.invert}
                        onChange={(e) => handleUpdateElement(selectedEl.id, "invert", e.target.checked)}
                        className="checkbox"
                      />
                      <label className="text-sm text-neutral-700">Invert Colors</label>
                    </div>
                  </div>

                  {/* Filter Presets */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-neutral-700">Filter Presets</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {FILTER_PRESETS.map((preset) => (
                        <button
                          key={preset.name}
                          onClick={() => {
                            Object.entries(preset.filters).forEach(([key, value]) => {
                              handleUpdateElement(selectedEl.id, key as keyof ImageElement, value);
                            });
                          }}
                          className="btn btn-sm btn-secondary text-xs"
                        >
                          {preset.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Color Adjustments */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-neutral-700">Color Adjustments</h4>

                    {/* Brightness */}
                    <div>
                      <label className="block text-xs text-neutral-600 mb-1">Brightness</label>
                      <input
                        type="range"
                        min="0"
                        max="2"
                        step="0.1"
                        value={selectedEl.brightness}
                        onChange={(e) => handleUpdateElement(selectedEl.id, "brightness", parseFloat(e.target.value))}
                        className="w-full"
                      />
                      <div className="text-xs text-neutral-500 text-center">
                        {Math.round(selectedEl.brightness * 100)}%
                      </div>
                    </div>

                    {/* Contrast */}
                    <div>
                      <label className="block text-xs text-neutral-600 mb-1">Contrast</label>
                      <input
                        type="range"
                        min="0"
                        max="2"
                        step="0.1"
                        value={selectedEl.contrast}
                        onChange={(e) => handleUpdateElement(selectedEl.id, "contrast", parseFloat(e.target.value))}
                        className="w-full"
                      />
                      <div className="text-xs text-neutral-500 text-center">
                        {Math.round(selectedEl.contrast * 100)}%
                      </div>
                    </div>

                    {/* Saturation */}
                    <div>
                      <label className="block text-xs text-neutral-600 mb-1">Saturation</label>
                      <input
                        type="range"
                        min="0"
                        max="2"
                        step="0.1"
                        value={selectedEl.saturation}
                        onChange={(e) => handleUpdateElement(selectedEl.id, "saturation", parseFloat(e.target.value))}
                        className="w-full"
                      />
                      <div className="text-xs text-neutral-500 text-center">
                        {Math.round(selectedEl.saturation * 100)}%
                      </div>
                    </div>

                    {/* Hue */}
                    <div>
                      <label className="block text-xs text-neutral-600 mb-1">Hue</label>
                      <input
                        type="range"
                        min="-180"
                        max="180"
                        value={selectedEl.hue}
                        onChange={(e) => handleUpdateElement(selectedEl.id, "hue", parseInt(e.target.value))}
                        className="w-full"
                      />
                      <div className="text-xs text-neutral-500 text-center">{selectedEl.hue}°</div>
                    </div>

                    {/* Blur */}
                    <div>
                      <label className="block text-xs text-neutral-600 mb-1">Blur</label>
                      <input
                        type="range"
                        min="0"
                        max="10"
                        step="0.5"
                        value={selectedEl.blur}
                        onChange={(e) => handleUpdateElement(selectedEl.id, "blur", parseFloat(e.target.value))}
                        className="w-full"
                      />
                      <div className="text-xs text-neutral-500 text-center">{selectedEl.blur}px</div>
                    </div>

                    {/* Sepia */}
                    <div>
                      <label className="block text-xs text-neutral-600 mb-1">Sepia</label>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={selectedEl.sepia}
                        onChange={(e) => handleUpdateElement(selectedEl.id, "sepia", parseFloat(e.target.value))}
                        className="w-full"
                      />
                      <div className="text-xs text-neutral-500 text-center">{Math.round(selectedEl.sepia * 100)}%</div>
                    </div>

                    {/* Grayscale */}
                    <div>
                      <label className="block text-xs text-neutral-600 mb-1">Grayscale</label>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={selectedEl.grayscale}
                        onChange={(e) => handleUpdateElement(selectedEl.id, "grayscale", parseFloat(e.target.value))}
                        className="w-full"
                      />
                      <div className="text-xs text-neutral-500 text-center">
                        {Math.round(selectedEl.grayscale * 100)}%
                      </div>
                    </div>
                  </div>

                  {/* Advanced Transform */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-neutral-700">Advanced Transform</h4>

                    {/* Border Radius */}
                    <div>
                      <label className="block text-xs text-neutral-600 mb-1">Border Radius</label>
                      <input
                        type="range"
                        min="0"
                        max="50"
                        value={selectedEl.borderRadius}
                        onChange={(e) => handleUpdateElement(selectedEl.id, "borderRadius", parseInt(e.target.value))}
                        className="w-full"
                      />
                      <div className="text-xs text-neutral-500 text-center">{selectedEl.borderRadius}px</div>
                    </div>

                    {/* Skew */}
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs text-neutral-600 mb-1">Skew X</label>
                        <input
                          type="range"
                          min="-45"
                          max="45"
                          value={selectedEl.skewX}
                          onChange={(e) => handleUpdateElement(selectedEl.id, "skewX", parseInt(e.target.value))}
                          className="w-full"
                        />
                        <div className="text-xs text-neutral-500 text-center">{selectedEl.skewX}°</div>
                      </div>
                      <div>
                        <label className="block text-xs text-neutral-600 mb-1">Skew Y</label>
                        <input
                          type="range"
                          min="-45"
                          max="45"
                          value={selectedEl.skewY}
                          onChange={(e) => handleUpdateElement(selectedEl.id, "skewY", parseInt(e.target.value))}
                          className="w-full"
                        />
                        <div className="text-xs text-neutral-500 text-center">{selectedEl.skewY}°</div>
                      </div>
                    </div>

                    {/* Scale */}
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs text-neutral-600 mb-1">Scale X</label>
                        <input
                          type="range"
                          min="0.1"
                          max="3"
                          step="0.1"
                          value={selectedEl.scaleX}
                          onChange={(e) => handleUpdateElement(selectedEl.id, "scaleX", parseFloat(e.target.value))}
                          className="w-full"
                        />
                        <div className="text-xs text-neutral-500 text-center">{selectedEl.scaleX}x</div>
                      </div>
                      <div>
                        <label className="block text-xs text-neutral-600 mb-1">Scale Y</label>
                        <input
                          type="range"
                          min="0.1"
                          max="3"
                          step="0.1"
                          value={selectedEl.scaleY}
                          onChange={(e) => handleUpdateElement(selectedEl.id, "scaleY", parseFloat(e.target.value))}
                          className="w-full"
                        />
                        <div className="text-xs text-neutral-500 text-center">{selectedEl.scaleY}x</div>
                      </div>
                    </div>

                    {/* Background Color */}
                    <div>
                      <label className="block text-xs text-neutral-600 mb-1">Background Color</label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="color"
                          value={selectedEl.backgroundColor === "transparent" ? "#ffffff" : selectedEl.backgroundColor}
                          onChange={(e) => handleUpdateElement(selectedEl.id, "backgroundColor", e.target.value)}
                          className="w-8 h-8 rounded border"
                        />
                        <button
                          onClick={() => handleUpdateElement(selectedEl.id, "backgroundColor", "transparent")}
                          className="btn btn-sm btn-secondary flex-1"
                        >
                          Transparent
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-2 pt-4 border-t border-neutral-200">
                    <button
                      onClick={() => {
                        onDeleteImage(selectedEl.id);
                        setSelectedElement(null);
                      }}
                      className="btn btn-danger btn-sm w-full"
                    >
                      <TrashIcon className="w-4 h-4 mr-2" />
                      Delete Image
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Canvas */}
          <div className="flex-1 p-4">
            <div
              className="relative w-full h-full border border-neutral-300 bg-white overflow-auto"
              style={{ minHeight: canvasHeight, minWidth: canvasWidth }}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              {/* Image Elements */}
              {imageElements.map((element) => (
                <div
                  key={element.id}
                  className={`absolute cursor-move ${
                    selectedElement === element.id ? "ring-2 ring-primary-500" : "hover:ring-2 hover:ring-neutral-300"
                  }`}
                  style={{
                    left: element.x,
                    top: element.y,
                    width: element.width,
                    height: element.height,
                    transform: [
                      `rotate(${element.rotation}deg)`,
                      `scaleX(${element.flipX ? -element.scaleX : element.scaleX})`,
                      `scaleY(${element.flipY ? -element.scaleY : element.scaleY})`,
                      `skewX(${element.skewX}deg)`,
                      `skewY(${element.skewY}deg)`,
                    ].join(" "),
                    opacity: element.opacity,
                  }}
                  onMouseDown={(e) => handleMouseDown(e, element.id, "drag")}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedElement(element.id);
                  }}
                >
                  <img
                    src={element.src}
                    alt="Editable image"
                    className="w-full h-full object-contain"
                    style={{
                      border:
                        element.borderWidth > 0
                          ? `${element.borderWidth}px ${element.borderStyle} ${element.borderColor}`
                          : "none",
                      boxShadow: element.shadow ? "0 4px 8px rgba(0, 0, 0, 0.2)" : "none",
                      borderRadius: `${element.borderRadius}px`,
                      backgroundColor:
                        element.backgroundColor !== "transparent" ? element.backgroundColor : "transparent",
                      filter: [
                        `brightness(${element.brightness})`,
                        `contrast(${element.contrast})`,
                        `saturate(${element.saturation})`,
                        `hue-rotate(${element.hue}deg)`,
                        `blur(${element.blur}px)`,
                        `sepia(${element.sepia})`,
                        `grayscale(${element.grayscale})`,
                        element.invert ? "invert(1)" : "invert(0)",
                      ].join(" "),
                    }}
                    draggable={false}
                  />

                  {/* Resize Handles */}
                  {selectedElement === element.id && (
                    <>
                      {["nw", "ne", "sw", "se"].map((handle) => (
                        <div
                          key={handle}
                          className="absolute w-3 h-3 bg-primary-500 border border-white cursor-pointer"
                          style={{
                            top: handle.includes("n") ? -6 : "auto",
                            bottom: handle.includes("s") ? -6 : "auto",
                            left: handle.includes("w") ? -6 : "auto",
                            right: handle.includes("e") ? -6 : "auto",
                            cursor: `${handle}-resize`,
                          }}
                          onMouseDown={(e) => handleMouseDown(e, element.id, "resize", handle)}
                        />
                      ))}
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ImageEditor;
