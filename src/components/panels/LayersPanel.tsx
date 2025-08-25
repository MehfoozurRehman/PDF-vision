"use client";

import { useState } from "react";
import { usePDF } from "@/store/pdf-store";
import { EyeIcon, EyeSlashIcon, LockClosedIcon, LockOpenIcon, Squares2X2Icon } from "@heroicons/react/24/outline";

interface Layer {
  id: string;
  name: string;
  visible: boolean;
  locked: boolean;
  opacity: number;
  type: "content" | "annotations" | "forms" | "signatures";
}

export default function LayersPanel() {
  const { state: pdfState } = usePDF();
  const [layers, setLayers] = useState<Layer[]>([
    {
      id: "content",
      name: "Document Content",
      visible: true,
      locked: false,
      opacity: 100,
      type: "content",
    },
    {
      id: "annotations",
      name: "Annotations",
      visible: true,
      locked: false,
      opacity: 100,
      type: "annotations",
    },
    {
      id: "forms",
      name: "Form Fields",
      visible: true,
      locked: false,
      opacity: 100,
      type: "forms",
    },
    {
      id: "signatures",
      name: "Digital Signatures",
      visible: true,
      locked: true,
      opacity: 100,
      type: "signatures",
    },
  ]);

  const currentDocument = pdfState.activeDocument;

  const toggleLayerVisibility = (layerId: string) => {
    setLayers((prev) => prev.map((layer) => (layer.id === layerId ? { ...layer, visible: !layer.visible } : layer)));
  };

  const toggleLayerLock = (layerId: string) => {
    setLayers((prev) => prev.map((layer) => (layer.id === layerId ? { ...layer, locked: !layer.locked } : layer)));
  };

  const updateLayerOpacity = (layerId: string, opacity: number) => {
    setLayers((prev) => prev.map((layer) => (layer.id === layerId ? { ...layer, opacity } : layer)));
  };

  const getLayerIcon = (type: string) => {
    switch (type) {
      case "content":
        return "📄";
      case "annotations":
        return "📝";
      case "forms":
        return "📋";
      case "signatures":
        return "✍️";
      default:
        return "📄";
    }
  };

  const getLayerCount = (type: string) => {
    if (!currentDocument) return 0;

    switch (type) {
      case "content":
        return currentDocument.pages.length;
      case "annotations":
        return currentDocument.annotations.length;
      case "forms":
        return 0; // TODO: Implement form fields count
      case "signatures":
        return currentDocument.annotations.filter((a) => a.type === "signature").length;
      default:
        return 0;
    }
  };

  if (!currentDocument) {
    return (
      <div className="p-4 text-center text-gray-500">
        <Squares2X2Icon className="w-8 h-8 mx-auto mb-2 text-gray-400" />
        <p>No document open</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-3 border-b border-gray-200">
        <h3 className="text-sm font-medium text-gray-900">Layers</h3>
        <p className="text-xs text-gray-500 mt-1">
          {layers.length} layer{layers.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Layer Controls */}
      <div className="p-3 border-b border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-gray-700">Quick Actions</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => {
              setLayers((prev) => prev.map((layer) => ({ ...layer, visible: true })));
            }}
            className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded transition-colors"
          >
            Show All
          </button>
          <button
            onClick={() => {
              setLayers((prev) => prev.map((layer) => ({ ...layer, visible: false })));
            }}
            className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded transition-colors"
          >
            Hide All
          </button>
        </div>
      </div>

      {/* Layers List */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-2 space-y-1">
          {layers.map((layer) => {
            const itemCount = getLayerCount(layer.type);

            return (
              <div
                key={layer.id}
                className={`group p-3 rounded-lg border transition-all ${
                  layer.visible ? "border-gray-200 bg-white" : "border-gray-100 bg-gray-50"
                }`}
              >
                {/* Layer Header */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{getLayerIcon(layer.type)}</span>
                    <div>
                      <div className={`text-sm font-medium ${layer.visible ? "text-gray-900" : "text-gray-500"}`}>
                        {layer.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {itemCount} item{itemCount !== 1 ? "s" : ""}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1">
                    {/* Visibility Toggle */}
                    <button
                      onClick={() => toggleLayerVisibility(layer.id)}
                      className={`p-1 rounded transition-colors ${
                        layer.visible ? "text-gray-600 hover:text-gray-900" : "text-gray-400 hover:text-gray-600"
                      }`}
                      title={layer.visible ? "Hide layer" : "Show layer"}
                    >
                      {layer.visible ? <EyeIcon className="w-4 h-4" /> : <EyeSlashIcon className="w-4 h-4" />}
                    </button>

                    {/* Lock Toggle */}
                    <button
                      onClick={() => toggleLayerLock(layer.id)}
                      className={`p-1 rounded transition-colors ${
                        layer.locked ? "text-red-600 hover:text-red-700" : "text-gray-400 hover:text-gray-600"
                      }`}
                      title={layer.locked ? "Unlock layer" : "Lock layer"}
                    >
                      {layer.locked ? <LockClosedIcon className="w-4 h-4" /> : <LockOpenIcon className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Opacity Control */}
                {layer.visible && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-600">Opacity</span>
                      <span className="text-xs text-gray-600">{layer.opacity}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={layer.opacity}
                      onChange={(e) => updateLayerOpacity(layer.id, parseInt(e.target.value))}
                      className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                    />
                  </div>
                )}

                {/* Layer Info */}
                <div className="mt-2 pt-2 border-t border-gray-100">
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Type: {layer.type}</span>
                    <span
                      className={`px-1.5 py-0.5 rounded-full text-xs ${
                        layer.locked ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
                      }`}
                    >
                      {layer.locked ? "Locked" : "Editable"}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Layer Statistics */}
      <div className="p-3 border-t border-gray-200 bg-gray-50">
        <div className="text-xs text-gray-600">
          <div className="flex justify-between mb-1">
            <span>Visible layers:</span>
            <span>
              {layers.filter((l) => l.visible).length}/{layers.length}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Locked layers:</span>
            <span>
              {layers.filter((l) => l.locked).length}/{layers.length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
