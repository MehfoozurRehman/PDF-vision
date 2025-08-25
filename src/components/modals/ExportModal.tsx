"use client";

import { useState } from "react";
import { useUI } from "@/store/ui-store";
import { usePDF } from "@/store/pdf-store";
import {
  XMarkIcon,
  DocumentArrowDownIcon,
  PhotoIcon,
  DocumentTextIcon,
  Cog6ToothIcon,
  FolderIcon,
} from "@heroicons/react/24/outline";
import toast from "react-hot-toast";
import { useStirlingAPI } from "@/hooks/useStirlingAPI";
import { ConversionOptions } from "@/api/types";

interface ExportOptions {
  format: "pdf" | "png" | "jpg" | "svg" | "docx" | "txt";
  quality: "low" | "medium" | "high" | "maximum";
  pages: "all" | "current" | "range" | "selection";
  pageRange: string;
  includeAnnotations: boolean;
  includeComments: boolean;
  includeBookmarks: boolean;
  includeMetadata: boolean;
  compression: boolean;
  password: string;
  permissions: {
    print: boolean;
    copy: boolean;
    modify: boolean;
    annotate: boolean;
  };
}

export default function ExportModal() {
  const { state: uiState, dispatch: uiDispatch } = useUI();
  const { state: pdfState } = usePDF();
  const { state: apiState, operations } = useStirlingAPI();
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    format: "pdf",
    quality: "high",
    pages: "all",
    pageRange: "",
    includeAnnotations: true,
    includeComments: true,
    includeBookmarks: true,
    includeMetadata: true,
    compression: true,
    password: "",
    permissions: {
      print: true,
      copy: true,
      modify: true,
      annotate: true,
    },
  });
  const [showAdvanced, setShowAdvanced] = useState(false);

  if (!uiState.modals.export) return null;

  const closeModal = () => {
    uiDispatch({ type: "CLOSE_MODAL", payload: "export" });
    setShowAdvanced(false);
  };

  const updateOption = <K extends keyof ExportOptions>(key: K, value: ExportOptions[K]) => {
    setExportOptions((prev) => ({ ...prev, [key]: value }));
  };

  const updatePermission = (permission: keyof ExportOptions["permissions"], value: boolean) => {
    setExportOptions((prev) => ({
      ...prev,
      permissions: { ...prev.permissions, [permission]: value },
    }));
  };

  const handleExport = async () => {
    if (!pdfState.activeDocument) {
      toast.error("No document is currently open");
      return;
    }

    if (exportOptions.pages === "range" && !exportOptions.pageRange.trim()) {
      toast.error("Please specify a page range");
      return;
    }

    try {
      // Get the current PDF file
      if (!pdfState.activeDocument?.data) {
        toast.error("No PDF file available for export");
        return;
      }

      // Convert ArrayBuffer to File for API operations
      const pdfFile = new File([pdfState.activeDocument.data], pdfState.activeDocument.name, {
        type: "application/pdf",
      });

      const fileName = `${pdfState.activeDocument.name.replace(".pdf", "")}.${exportOptions.format}`;
      let result: Blob | null = null;

      // Handle different export formats using Stirling-PDF API
      if (exportOptions.format === "pdf") {
        // For PDF export, we might want to apply compression or security
        if (exportOptions.compression || exportOptions.password) {
          const compressOptions = {
            optimizeLevel:
              exportOptions.quality === "maximum"
                ? (4 as const)
                : exportOptions.quality === "high"
                  ? (3 as const)
                  : exportOptions.quality === "medium"
                    ? (2 as const)
                    : (1 as const),
            removeMetadata: !exportOptions.includeMetadata,
          };
          result = await operations.compressPDF(pdfFile, compressOptions);
        } else {
          // Just download the original PDF
          result = pdfFile;
        }
      } else if (["png", "jpg"].includes(exportOptions.format)) {
        // Convert PDF to images
        const conversionOptions: ConversionOptions = {
          format: exportOptions.format as "png" | "jpg",
          dpi:
            exportOptions.quality === "maximum"
              ? 300
              : exportOptions.quality === "high"
                ? 200
                : exportOptions.quality === "medium"
                  ? 150
                  : 100,
          quality:
            exportOptions.quality === "maximum"
              ? 100
              : exportOptions.quality === "high"
                ? 85
                : exportOptions.quality === "medium"
                  ? 70
                  : 50,
          singleOrMultiple: "multiple",
        };
        result = await operations.convertPDFToImages(pdfFile, conversionOptions);
      } else if (exportOptions.format === "docx") {
        // Convert PDF to Word document
        result = await operations.convertPDFToWord(pdfFile);
      } else {
        toast.error(`Export format ${exportOptions.format} is not supported yet`);
        return;
      }

      if (result) {
        await operations.downloadFile(result, fileName);
        closeModal();
      }
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Export failed");
    }
  };

  const getFormatIcon = (format: string) => {
    switch (format) {
      case "pdf":
        return <DocumentArrowDownIcon className="w-5 h-5" />;
      case "png":
      case "jpg":
      case "svg":
        return <PhotoIcon className="w-5 h-5" />;
      case "docx":
      case "txt":
        return <DocumentTextIcon className="w-5 h-5" />;
      default:
        return <DocumentArrowDownIcon className="w-5 h-5" />;
    }
  };

  const getEstimatedSize = () => {
    if (!pdfState.activeDocument) return "Unknown";

    const baseSize = 2.5; // MB base estimate
    const qualityMultiplier = {
      low: 0.5,
      medium: 1,
      high: 1.5,
      maximum: 2.5,
    }[exportOptions.quality];

    const formatMultiplier = {
      pdf: 1,
      png: 3,
      jpg: 1.5,
      svg: 0.8,
      docx: 0.6,
      txt: 0.1,
    }[exportOptions.format];

    const pageCount =
      exportOptions.pages === "current"
        ? 1
        : exportOptions.pages === "all"
          ? pdfState.activeDocument.pages.length
          : exportOptions.pages === "range"
            ? 5 // Estimate
            : 3; // Selection estimate

    const estimatedSize = baseSize * qualityMultiplier * formatMultiplier * (pageCount / 10);
    return `~${estimatedSize.toFixed(1)} MB`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Export Document</h2>
          <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 transition-colors">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Format Selection */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Export Format</h3>
            <div className="grid grid-cols-3 gap-3">
              {[
                { format: "pdf", label: "PDF Document", desc: "Portable Document Format" },
                { format: "png", label: "PNG Images", desc: "High quality images" },
                { format: "jpg", label: "JPEG Images", desc: "Compressed images" },
                { format: "svg", label: "SVG Vector", desc: "Scalable vector graphics" },
                { format: "docx", label: "Word Document", desc: "Microsoft Word format" },
                { format: "txt", label: "Plain Text", desc: "Text content only" },
              ].map(({ format, label, desc }) => (
                <button
                  key={format}
                  onClick={() => updateOption("format", format as ExportOptions["format"])}
                  className={`p-4 border rounded-lg text-left transition-colors ${
                    exportOptions.format === format
                      ? "border-adobe-blue bg-adobe-blue/5 text-adobe-blue"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                >
                  <div className="flex items-center space-x-2 mb-2">
                    {getFormatIcon(format)}
                    <span className="font-medium">{label}</span>
                  </div>
                  <p className="text-sm text-gray-600">{desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Page Selection */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Pages to Export</h3>
            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="pages"
                  checked={exportOptions.pages === "all"}
                  onChange={() => updateOption("pages", "all")}
                  className="text-adobe-blue focus:ring-adobe-blue"
                />
                <span className="ml-2">All pages</span>
                {pdfState.activeDocument && (
                  <span className="ml-2 text-sm text-gray-500">({pdfState.activeDocument.pages.length} pages)</span>
                )}
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="pages"
                  checked={exportOptions.pages === "current"}
                  onChange={() => updateOption("pages", "current")}
                  className="text-adobe-blue focus:ring-adobe-blue"
                />
                <span className="ml-2">Current page only</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="pages"
                  checked={exportOptions.pages === "range"}
                  onChange={() => updateOption("pages", "range")}
                  className="text-adobe-blue focus:ring-adobe-blue"
                />
                <span className="ml-2">Page range:</span>
                <input
                  type="text"
                  value={exportOptions.pageRange}
                  onChange={(e) => updateOption("pageRange", e.target.value)}
                  placeholder="e.g., 1-5, 8, 10-12"
                  className="ml-2 px-2 py-1 border border-gray-300 rounded text-sm flex-1 max-w-48"
                  disabled={exportOptions.pages !== "range"}
                />
              </label>
            </div>
          </div>

          {/* Quality Settings */}
          {["png", "jpg"].includes(exportOptions.format) && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Image Quality</h3>
              <div className="grid grid-cols-4 gap-3">
                {[
                  { value: "low", label: "Low", desc: "Smaller file" },
                  { value: "medium", label: "Medium", desc: "Balanced" },
                  { value: "high", label: "High", desc: "Good quality" },
                  { value: "maximum", label: "Maximum", desc: "Best quality" },
                ].map(({ value, label, desc }) => (
                  <button
                    key={value}
                    onClick={() => updateOption("quality", value as ExportOptions["quality"])}
                    className={`p-3 border rounded-lg text-center transition-colors ${
                      exportOptions.quality === value
                        ? "border-adobe-blue bg-adobe-blue/5 text-adobe-blue"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    <div className="font-medium">{label}</div>
                    <div className="text-xs text-gray-600">{desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Include Options */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Include in Export</h3>
            <div className="grid grid-cols-2 gap-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={exportOptions.includeAnnotations}
                  onChange={(e) => updateOption("includeAnnotations", e.target.checked)}
                  className="rounded border-gray-300 text-adobe-blue focus:ring-adobe-blue"
                />
                <span className="ml-2">Annotations</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={exportOptions.includeComments}
                  onChange={(e) => updateOption("includeComments", e.target.checked)}
                  className="rounded border-gray-300 text-adobe-blue focus:ring-adobe-blue"
                />
                <span className="ml-2">Comments</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={exportOptions.includeBookmarks}
                  onChange={(e) => updateOption("includeBookmarks", e.target.checked)}
                  className="rounded border-gray-300 text-adobe-blue focus:ring-adobe-blue"
                />
                <span className="ml-2">Bookmarks</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={exportOptions.includeMetadata}
                  onChange={(e) => updateOption("includeMetadata", e.target.checked)}
                  className="rounded border-gray-300 text-adobe-blue focus:ring-adobe-blue"
                />
                <span className="ml-2">Metadata</span>
              </label>
            </div>
          </div>

          {/* Advanced Options */}
          <div>
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center space-x-2 text-adobe-blue hover:text-adobe-blue-dark transition-colors"
            >
              <Cog6ToothIcon className="w-5 h-5" />
              <span>Advanced Options</span>
            </button>

            {showAdvanced && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg space-y-4">
                {/* Compression */}
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={exportOptions.compression}
                    onChange={(e) => updateOption("compression", e.target.checked)}
                    className="rounded border-gray-300 text-adobe-blue focus:ring-adobe-blue"
                  />
                  <span className="ml-2">Enable compression</span>
                </label>

                {/* Password Protection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Password protection (optional)</label>
                  <input
                    type="password"
                    value={exportOptions.password}
                    onChange={(e) => updateOption("password", e.target.value)}
                    className="input w-full"
                    placeholder="Enter password to protect the exported file"
                  />
                </div>

                {/* Permissions */}
                {exportOptions.format === "pdf" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Document permissions</label>
                    <div className="grid grid-cols-2 gap-2">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={exportOptions.permissions.print}
                          onChange={(e) => updatePermission("print", e.target.checked)}
                          className="rounded border-gray-300 text-adobe-blue focus:ring-adobe-blue"
                        />
                        <span className="ml-2 text-sm">Allow printing</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={exportOptions.permissions.copy}
                          onChange={(e) => updatePermission("copy", e.target.checked)}
                          className="rounded border-gray-300 text-adobe-blue focus:ring-adobe-blue"
                        />
                        <span className="ml-2 text-sm">Allow copying</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={exportOptions.permissions.modify}
                          onChange={(e) => updatePermission("modify", e.target.checked)}
                          className="rounded border-gray-300 text-adobe-blue focus:ring-adobe-blue"
                        />
                        <span className="ml-2 text-sm">Allow modifications</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={exportOptions.permissions.annotate}
                          onChange={(e) => updatePermission("annotate", e.target.checked)}
                          className="rounded border-gray-300 text-adobe-blue focus:ring-adobe-blue"
                        />
                        <span className="ml-2 text-sm">Allow annotations</span>
                      </label>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Export Preview */}
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-blue-900">Export as {exportOptions.format.toUpperCase()}</p>
                <p className="text-sm text-blue-800">Estimated size: {getEstimatedSize()}</p>
              </div>
              <FolderIcon className="w-8 h-8 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center p-6 border-t border-gray-200">
          <div className="text-sm text-gray-600">
            {pdfState.activeDocument && <span>Ready to export {pdfState.activeDocument.name}</span>}
          </div>
          <div className="flex space-x-3">
            <button
              onClick={closeModal}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleExport}
              disabled={!pdfState.activeDocument || apiState.loading}
              className="px-4 py-2 bg-adobe-blue text-white rounded-lg hover:bg-adobe-blue-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {apiState.loading ? "Exporting..." : "Export"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
