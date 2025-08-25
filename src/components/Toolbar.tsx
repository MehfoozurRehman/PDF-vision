"use client";

import {
  ArrowDownTrayIcon,
  ArrowUturnLeftIcon,
  ArrowUturnRightIcon,
  BookmarkIcon,
  CalculatorIcon,
  CameraIcon,
  ChatBubbleLeftIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CloudIcon,
  CodeBracketIcon,
  CogIcon,
  CubeIcon,
  DocumentArrowUpIcon,
  DocumentCheckIcon,
  DocumentDuplicateIcon,
  DocumentTextIcon,
  EyeIcon,
  FolderIcon,
  FolderOpenIcon,
  GlobeAltIcon,
  LinkIcon,
  LockClosedIcon,
  MagnifyingGlassIcon,
  MagnifyingGlassMinusIcon,
  MagnifyingGlassPlusIcon,
  PaintBrushIcon,
  PencilIcon,
  PencilSquareIcon,
  PhotoIcon,
  PrinterIcon,
  ScaleIcon,
  ScissorsIcon,
  ShieldCheckIcon,
  SparklesIcon,
  SwatchIcon,
  UserGroupIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { UIState, useUI } from "@/store/ui-store";

import ToolButton from "@/components/ui/ToolButton";
import ViewModeToggle from "./ui/ViewModeToggle";
import { usePDF } from "@/store/pdf-store";
import { useState } from "react";

interface ToolbarProps {
  onOpenFile: () => void;
  onNewFile: () => void;
  onSaveFile: () => void;
  onSaveAsFile: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
}

export default function Toolbar({ onOpenFile, onNewFile, onSaveFile, onSaveAsFile, onUndo, onRedo }: ToolbarProps) {
  const { state: uiState, dispatch: uiDispatch } = useUI();
  const { state: pdfState, dispatch: pdfDispatch } = usePDF();
  const [zoomValue, setZoomValue] = useState(100);

  const handleZoomIn = () => {
    const newZoom = Math.min(500, zoomValue + 25);
    setZoomValue(newZoom);
    pdfDispatch({ type: "SET_ZOOM", payload: newZoom });
  };

  const handleZoomOut = () => {
    const newZoom = Math.max(25, zoomValue - 25);
    setZoomValue(newZoom);
    pdfDispatch({ type: "SET_ZOOM", payload: newZoom });
  };

  const handleZoomChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newZoom = parseInt(event.target.value);
    setZoomValue(newZoom);
    pdfDispatch({ type: "SET_ZOOM", payload: newZoom });
  };

  const handleToolChange = (tool: UIState["activeTool"]) => {
    uiDispatch({ type: "SET_ACTIVE_TOOL", payload: tool });
  };

  const isToolActive = (tool: string) => uiState.activeTool === tool;

  // Get container classes based on view mode
  const getContainerClasses = () => {
    switch (uiState.viewMode) {
      case "expanded":
        return "bg-white border-b border-gray-200 px-4 py-4";
      case "minimal":
      case "hover":
      default:
        return "bg-white border-b border-gray-200 px-4 py-3";
    }
  };

  // Get flex container classes based on view mode
  const getFlexContainerClasses = () => {
    switch (uiState.viewMode) {
      case "expanded":
        return "flex items-start justify-between";
      case "minimal":
      case "hover":
      default:
        return "flex items-center justify-between";
    }
  };

  // Get group spacing classes based on view mode
  const getGroupSpacing = () => {
    switch (uiState.viewMode) {
      case "expanded":
        return "flex items-start space-x-2";
      case "minimal":
      case "hover":
      default:
        return "flex items-center space-x-1";
    }
  };

  return (
    <div className={`${getContainerClasses()} transition-all duration-300 ease-in-out`}>
      <div className={`${getFlexContainerClasses()} transition-all duration-300 ease-in-out`}>
        {/* File Operations */}
        <div className={getGroupSpacing()}>
          <ToolButton title="Open File" icon={FolderOpenIcon} onClick={onOpenFile} />
          <ToolButton title="Save" icon={ArrowDownTrayIcon} onClick={onSaveFile} />
          <ToolButton title="Print" icon={PrinterIcon} onClick={() => window.print()} />
          <ToolButton
            title="Merge Documents"
            icon={DocumentDuplicateIcon}
            onClick={() => uiDispatch({ type: "OPEN_MODAL", payload: "merge" })}
          />
          <ToolButton title="Create from Files" icon={DocumentArrowUpIcon} onClick={onNewFile} />
          <ToolButton
            title="Split Document"
            icon={ScissorsIcon}
            onClick={() => uiDispatch({ type: "OPEN_MODAL", payload: "split" })}
          />
          <ToolButton
            title="Bates Numbering"
            icon={CalculatorIcon}
            onClick={() => uiDispatch({ type: "OPEN_MODAL", payload: "bates" })}
          />
          <ToolButton
            title="Export Options"
            icon={ArrowDownTrayIcon}
            onClick={() => uiDispatch({ type: "OPEN_MODAL", payload: "export" })}
          />
        </div>

        <div className="w-px h-6 bg-gray-300 mx-2" />

        {/* PDF Editing */}
        <div className={getGroupSpacing()}>
          <ToolButton
            title="Edit Text"
            icon={DocumentTextIcon}
            onClick={() => handleToolChange("text")}
            isActive={uiState.activeTool === "text"}
          />
          <ToolButton
            title="Edit Images & Objects"
            icon={PhotoIcon}
            onClick={() => handleToolChange("image")}
            isActive={uiState.activeTool === "image"}
          />
          <ToolButton
            title="Links & Attachments"
            icon={LinkIcon}
            onClick={() => handleToolChange("link")}
            isActive={uiState.activeTool === "link"}
          />
        </div>

        <div className="w-px h-6 bg-gray-300 mx-2" />

        {/* Navigation & View */}
        <div className={getGroupSpacing()}>
          <ToolButton title="Previous Page" icon={ChevronLeftIcon} onClick={() => {}} />
          <ToolButton title="Next Page" icon={ChevronRightIcon} onClick={() => {}} />
          <ToolButton
            title="Search"
            icon={MagnifyingGlassIcon}
            onClick={() => uiDispatch({ type: "OPEN_MODAL", payload: "search" })}
          />
          <ToolButton title="Zoom Out" icon={MagnifyingGlassMinusIcon} onClick={handleZoomOut} />
          <div
            className={`${
              uiState.viewMode === "expanded" ? "flex flex-col items-center space-y-1" : "flex items-center"
            }`}
          >
            <span className="px-2 text-sm font-medium text-gray-700 min-w-[60px] text-center">{zoomValue}%</span>
            {uiState.viewMode === "expanded" && <span className="text-xs text-gray-500">Zoom</span>}
          </div>
          <ToolButton title="Zoom In" icon={MagnifyingGlassPlusIcon} onClick={handleZoomIn} />
          <ToolButton
            title="Fit to View"
            icon={EyeIcon}
            onClick={() => handleToolChange("fit")}
            isActive={uiState.activeTool === "fit"}
          />
        </div>

        <div className="w-px h-6 bg-gray-300 mx-2" />

        {/* Annotation & Drawing */}
        <div className={getGroupSpacing()}>
          <ToolButton
            title="Pen Tool"
            icon={PencilIcon}
            onClick={() => handleToolChange("pen")}
            isActive={uiState.activeTool === "pen"}
          />
          <ToolButton
            title="Highlight Text"
            icon={SwatchIcon}
            onClick={() => handleToolChange("highlight")}
            isActive={uiState.activeTool === "highlight"}
          />
          <ToolButton
            title="Sticky Notes"
            icon={ChatBubbleLeftIcon}
            onClick={() => handleToolChange("note")}
            isActive={uiState.activeTool === "note"}
          />
          <ToolButton
            title="Text Markup"
            icon={PaintBrushIcon}
            onClick={() => handleToolChange("drawing")}
            isActive={uiState.activeTool === "drawing"}
          />
          <ToolButton
            title="Drawing Tools"
            icon={PencilIcon}
            onClick={() => uiDispatch({ type: "OPEN_MODAL", payload: "drawingTools" })}
          />
          <ToolButton
            title="Stamps"
            icon={BookmarkIcon}
            onClick={() => uiDispatch({ type: "OPEN_MODAL", payload: "stamps" })}
          />
          <ToolButton
            title="Shared Review"
            icon={UserGroupIcon}
            onClick={() => uiDispatch({ type: "OPEN_MODAL", payload: "sharedReview" })}
          />
        </div>

        <div className="w-px h-6 bg-gray-300 mx-2" />

        {/* Forms & Data */}
        <div className={getGroupSpacing()}>
          <ToolButton title="Auto-Detect Fields" icon={MagnifyingGlassIcon} onClick={() => {}} />
          <ToolButton title="Form Fields" icon={DocumentCheckIcon} onClick={() => {}} />
          <ToolButton
            title="Scan to PDF"
            icon={CameraIcon}
            onClick={() => uiDispatch({ type: "OPEN_MODAL", payload: "create" })}
          />
          <ToolButton
            title="Web to PDF"
            icon={GlobeAltIcon}
            onClick={() => uiDispatch({ type: "OPEN_MODAL", payload: "create" })}
          />
        </div>

        <div className="w-px h-6 bg-gray-300 mx-2" />

        {/* Security & Signatures */}
        <div className={getGroupSpacing()}>
          <ToolButton
            title="Fill & Sign"
            icon={PencilSquareIcon}
            onClick={() => handleToolChange("signature")}
            isActive={uiState.activeTool === "signature"}
          />
          <ToolButton
            title="Digital Certificates"
            icon={ShieldCheckIcon}
            onClick={() => uiDispatch({ type: "OPEN_MODAL", payload: "certificates" })}
          />
          <ToolButton
            title="Password Protection"
            icon={LockClosedIcon}
            onClick={() => uiDispatch({ type: "OPEN_MODAL", payload: "passwordProtection" })}
          />
          <ToolButton
            title="Redaction"
            icon={XMarkIcon}
            onClick={() => uiDispatch({ type: "OPEN_MODAL", payload: "redaction" })}
          />
        </div>

        <div className="w-px h-6 bg-gray-300 mx-2" />

        {/* Advanced Features */}
        <div className={getGroupSpacing()}>
          <ToolButton
            title="OCR"
            icon={MagnifyingGlassIcon}
            onClick={() => uiDispatch({ type: "OPEN_MODAL", payload: "ocr" })}
          />
          <ToolButton
            title="Optimize PDF"
            icon={CogIcon}
            onClick={() => uiDispatch({ type: "OPEN_MODAL", payload: "optimize" })}
          />
          <ToolButton
            title="Compare PDFs"
            icon={DocumentDuplicateIcon}
            onClick={() => uiDispatch({ type: "OPEN_MODAL", payload: "compare" })}
          />
          <ToolButton
            title="Multimedia & 3D"
            icon={CubeIcon}
            onClick={() => uiDispatch({ type: "OPEN_MODAL", payload: "multimedia" })}
          />
          <ToolButton
            title="Measurement Tools"
            icon={ScaleIcon}
            onClick={() => uiDispatch({ type: "OPEN_MODAL", payload: "measurement" })}
          />
          <ToolButton
            title="JavaScript Support"
            icon={CodeBracketIcon}
            onClick={() => uiDispatch({ type: "OPEN_MODAL", payload: "javascript" })}
          />
        </div>

        <div className="w-px h-6 bg-gray-300 mx-2" />

        {/* AI & Integration */}
        <div className={getGroupSpacing()}>
          <ToolButton
            title="AI Assist"
            icon={SparklesIcon}
            onClick={() => uiDispatch({ type: "OPEN_MODAL", payload: "aiAssist" })}
          />
          <ToolButton
            title="Cloud Storage"
            icon={CloudIcon}
            onClick={() => uiDispatch({ type: "OPEN_MODAL", payload: "cloudStorage" })}
          />
          <ToolButton
            title="Page Organization"
            icon={FolderIcon}
            onClick={() => uiDispatch({ type: "OPEN_MODAL", payload: "pageOrganization" })}
          />
        </div>

        <div className="w-px h-6 bg-gray-300 mx-2" />

        {/* History */}
        <div className={getGroupSpacing()}>
          <ToolButton title="Undo" icon={ArrowUturnLeftIcon} onClick={() => {}} />
          <ToolButton title="Redo" icon={ArrowUturnRightIcon} onClick={() => {}} />
        </div>

        {/* View Mode Toggle - Bottom Corner */}
        <div className="absolute bottom-2 right-2">
          <ViewModeToggle />
        </div>
      </div>
    </div>
  );
}
