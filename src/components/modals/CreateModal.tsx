"use client";

import {
  CameraIcon,
  DocumentPlusIcon,
  DocumentTextIcon,
  FolderOpenIcon,
  GlobeAltIcon,
  PhotoIcon,
  PlusIcon,
  TrashIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { PDFDocument, rgb } from "pdf-lib";
import { useCallback, useState } from "react";

import toast from "react-hot-toast";
import { useDropzone } from "react-dropzone";
import { usePDF } from "@/store/pdf-store";
import { useUI } from "@/store/ui-store";

interface CreateOptions {
  method: "files" | "scan" | "web" | "blank";
  files: File[];
  webUrl: string;
  scanSettings: {
    quality: "draft" | "normal" | "high" | "best";
    colorMode: "color" | "grayscale" | "blackwhite";
    resolution: 150 | 300 | 600 | 1200;
    autoDetectPages: boolean;
    enhanceText: boolean;
  };
  blankSettings: {
    pageSize: "letter" | "a4" | "legal" | "tabloid";
    orientation: "portrait" | "landscape";
    pageCount: number;
  };
}

export default function CreateModal() {
  const { state: uiState, dispatch: uiDispatch } = useUI();
  const { dispatch: pdfDispatch } = usePDF();
  const [createOptions, setCreateOptions] = useState<CreateOptions>({
    method: "files",
    files: [],
    webUrl: "",
    scanSettings: {
      quality: "normal",
      colorMode: "color",
      resolution: 300,
      autoDetectPages: true,
      enhanceText: true,
    },
    blankSettings: {
      pageSize: "letter",
      orientation: "portrait",
      pageCount: 1,
    },
  });
  const [isCreating, setIsCreating] = useState(false);

  if (!uiState.modals.create) return null;

  const closeModal = () => {
    uiDispatch({ type: "CLOSE_MODAL", payload: "create" });
    setCreateOptions((prev) => ({ ...prev, files: [] }));
  };

  const updateOption = <K extends keyof CreateOptions>(key: K, value: CreateOptions[K]) => {
    setCreateOptions((prev) => ({ ...prev, [key]: value }));
  };

  const updateScanSetting = <K extends keyof CreateOptions["scanSettings"]>(
    key: K,
    value: CreateOptions["scanSettings"][K],
  ) => {
    setCreateOptions((prev) => ({
      ...prev,
      scanSettings: { ...prev.scanSettings, [key]: value },
    }));
  };

  const updateBlankSetting = <K extends keyof CreateOptions["blankSettings"]>(
    key: K,
    value: CreateOptions["blankSettings"][K],
  ) => {
    setCreateOptions((prev) => ({
      ...prev,
      blankSettings: { ...prev.blankSettings, [key]: value },
    }));
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const validFiles = acceptedFiles.filter((file) => {
      const validTypes = [
        "application/pdf",
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/bmp",
        "image/tiff",
        "text/plain",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.ms-powerpoint",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      ];
      return validTypes.includes(file.type);
    });

    if (validFiles.length !== acceptedFiles.length) {
      toast.error("Some files were not supported and were skipped");
    }

    setCreateOptions((prev) => ({
      ...prev,
      files: [...prev.files, ...validFiles],
    }));
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "image/*": [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".tiff"],
      "text/plain": [".txt"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
      "application/vnd.ms-excel": [".xls"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
      "application/vnd.ms-powerpoint": [".ppt"],
      "application/vnd.openxmlformats-officedocument.presentationml.presentation": [".pptx"],
    },
    multiple: true,
  });

  const removeFile = (index: number) => {
    setCreateOptions((prev) => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== index),
    }));
  };

  const handleCreate = async () => {
    setIsCreating(true);

    try {
      let pdfDoc: PDFDocument;
      let fileName = "New Document.pdf";

      switch (createOptions.method) {
        case "files":
          if (createOptions.files.length === 0) {
            toast.error("Please select files to convert");
            return;
          }

          pdfDoc = await PDFDocument.create();
          fileName = `Converted_${Date.now()}.pdf`;

          // Process each file
          for (const file of createOptions.files) {
            if (file.type === "application/pdf") {
              // Merge existing PDF
              const arrayBuffer = await file.arrayBuffer();
              const existingPdf = await PDFDocument.load(arrayBuffer);
              const pages = await pdfDoc.copyPages(existingPdf, existingPdf.getPageIndices());
              pages.forEach((page) => pdfDoc.addPage(page));
            } else if (file.type.startsWith("image/")) {
              // Convert image to PDF page
              const arrayBuffer = await file.arrayBuffer();
              let image;

              if (file.type === "image/jpeg" || file.type === "image/jpg") {
                image = await pdfDoc.embedJpg(arrayBuffer);
              } else if (file.type === "image/png") {
                image = await pdfDoc.embedPng(arrayBuffer);
              } else {
                // For other image types, we'll skip for now
                continue;
              }

              const page = pdfDoc.addPage([image.width, image.height]);
              page.drawImage(image, {
                x: 0,
                y: 0,
                width: image.width,
                height: image.height,
              });
            } else if (file.type === "text/plain") {
              // Convert text to PDF
              const text = await file.text();
              const page = pdfDoc.addPage();
              const { width, height } = page.getSize();

              page.drawText(text, {
                x: 50,
                y: height - 50,
                size: 12,
                color: rgb(0, 0, 0),
                maxWidth: width - 100,
              });
            }
            // Note: For Office documents, we'd need additional libraries
            // This is a simplified implementation
          }
          break;

        case "scan":
          // Simulate scanning process
          await new Promise((resolve) => setTimeout(resolve, 2000));
          pdfDoc = await PDFDocument.create();
          fileName = `Scanned_${Date.now()}.pdf`;

          // Create a mock scanned page
          const page = pdfDoc.addPage();
          const { width, height } = page.getSize();

          page.drawText("Scanned Document", {
            x: 50,
            y: height - 50,
            size: 16,
            color: rgb(0, 0, 0),
          });

          page.drawText(`Quality: ${createOptions.scanSettings.quality}`, {
            x: 50,
            y: height - 80,
            size: 12,
            color: rgb(0.5, 0.5, 0.5),
          });

          page.drawText(`Resolution: ${createOptions.scanSettings.resolution} DPI`, {
            x: 50,
            y: height - 100,
            size: 12,
            color: rgb(0.5, 0.5, 0.5),
          });
          break;

        case "web":
          if (!createOptions.webUrl.trim()) {
            toast.error("Please enter a valid URL");
            return;
          }

          // Simulate web-to-PDF conversion
          await new Promise((resolve) => setTimeout(resolve, 3000));
          pdfDoc = await PDFDocument.create();
          fileName = `Web_${createOptions.webUrl.replace(/[^a-zA-Z0-9]/g, "_")}.pdf`;

          const webPage = pdfDoc.addPage();
          const { width: webWidth, height: webHeight } = webPage.getSize();

          webPage.drawText(`Web Page: ${createOptions.webUrl}`, {
            x: 50,
            y: webHeight - 50,
            size: 16,
            color: rgb(0, 0, 0),
          });

          webPage.drawText("This is a simulated web-to-PDF conversion.", {
            x: 50,
            y: webHeight - 80,
            size: 12,
            color: rgb(0.5, 0.5, 0.5),
          });

          webPage.drawText("In a real implementation, this would capture the actual web page.", {
            x: 50,
            y: webHeight - 100,
            size: 12,
            color: rgb(0.5, 0.5, 0.5),
          });
          break;

        case "blank":
          pdfDoc = await PDFDocument.create();
          fileName = "Blank Document.pdf";

          const { pageSize, orientation, pageCount } = createOptions.blankSettings;

          // Define page dimensions
          let pageWidth: number, pageHeight: number;
          switch (pageSize) {
            case "letter":
              pageWidth = 612;
              pageHeight = 792;
              break;
            case "a4":
              pageWidth = 595;
              pageHeight = 842;
              break;
            case "legal":
              pageWidth = 612;
              pageHeight = 1008;
              break;
            case "tabloid":
              pageWidth = 792;
              pageHeight = 1224;
              break;
            default:
              pageWidth = 612;
              pageHeight = 792;
          }

          if (orientation === "landscape") {
            [pageWidth, pageHeight] = [pageHeight, pageWidth];
          }

          // Create blank pages
          for (let i = 0; i < pageCount; i++) {
            pdfDoc.addPage([pageWidth, pageHeight]);
          }
          break;

        default:
          throw new Error("Invalid creation method");
      }

      // Generate PDF bytes
      const pdfBytes = await pdfDoc.save();

      // Create blob and download

      //@ts-ignore
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      // Load the created PDF into the viewer
      const newDocument = {
        id: Date.now().toString(),
        name: fileName,
        data: pdfBytes,
        pages: Array.from({ length: pdfDoc.getPageCount() }, (_, i) => ({
          id: `page-${i + 1}`,
          pageNumber: i + 1,
          width: 612, // Standard letter size width
          height: 792, // Standard letter size height
          rotation: 0,
          annotations: [],
        })),
        currentPage: 1,
        zoom: 1,
        annotations: [],
        isModified: false,
        createdAt: new Date(),
        modifiedAt: new Date(),
      };

      pdfDispatch({ type: "ADD_DOCUMENT", payload: newDocument });

      toast.success(`PDF created successfully: ${fileName}`);
      closeModal();
    } catch (error) {
      console.error("Creation error:", error);
      toast.error("Failed to create PDF");
    } finally {
      setIsCreating(false);
    }
  };

  const getMethodIcon = (method: string) => {
    switch (method) {
      case "files":
        return <FolderOpenIcon className="w-6 h-6" />;
      case "scan":
        return <CameraIcon className="w-6 h-6" />;
      case "web":
        return <GlobeAltIcon className="w-6 h-6" />;
      case "blank":
        return <DocumentPlusIcon className="w-6 h-6" />;
      default:
        return <DocumentPlusIcon className="w-6 h-6" />;
    }
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith("image/")) {
      return <PhotoIcon className="w-5 h-5" />;
    } else if (file.type === "application/pdf") {
      return <DocumentTextIcon className="w-5 h-5" />;
    } else {
      return <DocumentTextIcon className="w-5 h-5" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Create PDF</h2>
          <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 transition-colors">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Method Selection */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Creation Method</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                {
                  method: "files",
                  label: "From Files",
                  desc: "Convert documents & images",
                },
                {
                  method: "scan",
                  label: "Scan to PDF",
                  desc: "Scan physical documents",
                },
                {
                  method: "web",
                  label: "Web to PDF",
                  desc: "Convert web pages",
                },
                {
                  method: "blank",
                  label: "Blank Document",
                  desc: "Create empty PDF",
                },
              ].map(({ method, label, desc }) => (
                <button
                  key={method}
                  onClick={() => updateOption("method", method as CreateOptions["method"])}
                  className={`p-4 border rounded-lg text-left transition-colors ${
                    createOptions.method === method
                      ? "border-adobe-blue bg-adobe-blue/5 text-adobe-blue"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                >
                  <div className="flex items-center space-x-3 mb-2">
                    {getMethodIcon(method)}
                    <span className="font-medium">{label}</span>
                  </div>
                  <p className="text-sm text-gray-600">{desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Method-specific content */}
          {createOptions.method === "files" && (
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Select Files</h4>

              {/* File Drop Zone */}
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  isDragActive ? "border-adobe-blue bg-adobe-blue/5" : "border-gray-300 hover:border-gray-400"
                }`}
              >
                <input {...getInputProps()} />
                <FolderOpenIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-900 mb-2">
                  {isDragActive ? "Drop files here" : "Drag & drop files here"}
                </p>
                <p className="text-gray-600 mb-4">or click to browse files</p>
                <p className="text-sm text-gray-500">
                  Supports: PDF, Images (JPG, PNG, GIF, BMP, TIFF), Text, Word, Excel, PowerPoint
                </p>
              </div>

              {/* Selected Files */}
              {createOptions.files.length > 0 && (
                <div>
                  <h5 className="font-medium text-gray-900 mb-3">Selected Files ({createOptions.files.length})</h5>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {createOptions.files.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          {getFileIcon(file)}
                          <div>
                            <p className="font-medium text-gray-900">{file.name}</p>
                            <p className="text-sm text-gray-600">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                          </div>
                        </div>
                        <button
                          onClick={() => removeFile(index)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {createOptions.method === "scan" && (
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Scan Settings</h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Quality</label>
                  <select
                    value={createOptions.scanSettings.quality}
                    onChange={(e) => updateScanSetting("quality", e.target.value as any)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-adobe-blue"
                  >
                    <option value="draft">Draft</option>
                    <option value="normal">Normal</option>
                    <option value="high">High</option>
                    <option value="best">Best</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Color Mode</label>
                  <select
                    value={createOptions.scanSettings.colorMode}
                    onChange={(e) => updateScanSetting("colorMode", e.target.value as any)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-adobe-blue"
                  >
                    <option value="color">Color</option>
                    <option value="grayscale">Grayscale</option>
                    <option value="blackwhite">Black & White</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Resolution (DPI)</label>
                  <select
                    value={createOptions.scanSettings.resolution}
                    onChange={(e) => updateScanSetting("resolution", parseInt(e.target.value) as any)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-adobe-blue"
                  >
                    <option value={150}>150 DPI</option>
                    <option value={300}>300 DPI</option>
                    <option value={600}>600 DPI</option>
                    <option value={1200}>1200 DPI</option>
                  </select>
                </div>
              </div>

              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={createOptions.scanSettings.autoDetectPages}
                    onChange={(e) => updateScanSetting("autoDetectPages", e.target.checked)}
                    className="rounded border-gray-300 text-adobe-blue focus:ring-adobe-blue"
                  />
                  <span className="ml-2 text-sm text-gray-700">Auto-detect pages</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={createOptions.scanSettings.enhanceText}
                    onChange={(e) => updateScanSetting("enhanceText", e.target.checked)}
                    className="rounded border-gray-300 text-adobe-blue focus:ring-adobe-blue"
                  />
                  <span className="ml-2 text-sm text-gray-700">Enhance text readability</span>
                </label>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> This is a simulation. In a real implementation, this would connect to scanner
                  hardware or camera.
                </p>
              </div>
            </div>
          )}

          {createOptions.method === "web" && (
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Web Page URL</h4>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Enter URL</label>
                <input
                  type="url"
                  value={createOptions.webUrl}
                  onChange={(e) => updateOption("webUrl", e.target.value)}
                  placeholder="https://example.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-adobe-blue"
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> This is a simulation. In a real implementation, this would capture the actual
                  web page content.
                </p>
              </div>
            </div>
          )}

          {createOptions.method === "blank" && (
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Document Settings</h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Page Size</label>
                  <select
                    value={createOptions.blankSettings.pageSize}
                    onChange={(e) => updateBlankSetting("pageSize", e.target.value as any)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-adobe-blue"
                  >
                    <option value="letter">Letter (8.5" × 11")</option>
                    <option value="a4">A4 (210 × 297 mm)</option>
                    <option value="legal">Legal (8.5" × 14")</option>
                    <option value="tabloid">Tabloid (11" × 17")</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Orientation</label>
                  <select
                    value={createOptions.blankSettings.orientation}
                    onChange={(e) => updateBlankSetting("orientation", e.target.value as any)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-adobe-blue"
                  >
                    <option value="portrait">Portrait</option>
                    <option value="landscape">Landscape</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Number of Pages</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={createOptions.blankSettings.pageCount}
                    onChange={(e) => updateBlankSetting("pageCount", parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-adobe-blue"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200">
          <button
            onClick={closeModal}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>

          <button
            onClick={handleCreate}
            disabled={
              isCreating ||
              (createOptions.method === "files" && createOptions.files.length === 0) ||
              (createOptions.method === "web" && !createOptions.webUrl.trim())
            }
            className="px-6 py-2 bg-adobe-blue text-white rounded-md hover:bg-adobe-blue/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
          >
            {isCreating ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Creating...</span>
              </>
            ) : (
              <>
                <DocumentPlusIcon className="w-5 h-5" />
                <span>Create PDF</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
