"use client";

import { ClockIcon, DocumentIcon, DocumentPlusIcon, FolderOpenIcon, SparklesIcon } from "@heroicons/react/24/outline";

import { toast } from "react-hot-toast";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { usePDF } from "@/store/pdf-store";
import { useTranslation } from "@/lib/useTranslation";
import { useUI } from "@/store/ui-store";

// Global electronAPI type is declared in page.tsx

interface WelcomeScreenProps {
  onOpenFile?: () => void;
  onNewFile?: () => void;
}

export default function WelcomeScreen({ onOpenFile, onNewFile }: WelcomeScreenProps) {
  const { state: pdfState, dispatch: pdfDispatch } = usePDF();
  const { dispatch: uiDispatch } = useUI();
  const { t } = useTranslation();

  const loadPDFFile = useCallback(
    async (file: File | string) => {
      try {
        let fileData: ArrayBuffer;
        let fileName: string;

        if (typeof file === "string") {
          // File path from Electron dialog (desktop only)
          if (window.electronAPI) {
            const buffer = await window.electronAPI.fs.readFile(file);
            fileData = buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength) as ArrayBuffer;
            fileName = file.split("/").pop() || "document.pdf";
          } else {
            // Web environment doesn't support file path loading
            console.warn("File path loading not supported in web environment");
            return;
          }
        } else {
          // File from drag and drop or web file input
          fileData = await file.arrayBuffer();
          fileName = file.name;
        }

        // Create document object
        const document = {
          id: Date.now().toString(),
          name: fileName,
          path: typeof file === "string" ? file : undefined,
          data: typeof file === "string" ? undefined : fileData, // Store PDF data for uploaded files
          pages: [], // Will be populated when PDF is parsed
          currentPage: 1,
          zoom: 1,
          annotations: [],
          isModified: false,
          createdAt: new Date(),
          modifiedAt: new Date(),
        };

        // Add to store
        pdfDispatch({ type: "ADD_DOCUMENT", payload: document });
        pdfDispatch({ type: "SET_ACTIVE_DOCUMENT", payload: document });

        toast.success(`Loaded ${fileName} successfully`);
      } catch (error) {
        console.error("Error loading PDF:", error);
        toast.error("Failed to load PDF file");
      }
    },
    [pdfDispatch],
  );

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file && file.type === "application/pdf") {
        loadPDFFile(file);
      } else {
        toast.error("Please select a valid PDF file");
      }
    },
    [loadPDFFile],
  );

  const handleOpenFile = useCallback(async () => {
    if (window.electronAPI) {
      // Desktop app file dialog
      try {
        const result = await window.electronAPI.openFileDialog({
          properties: ["openFile"],
          filters: [{ name: "PDF Files", extensions: ["pdf"] }],
        });

        if (!result.canceled && result.filePaths.length > 0) {
          await loadPDFFile(result.filePaths[0]);
        }
      } catch (error) {
        console.error("Error opening file:", error);
        toast.error("Failed to open file");
      }
    } else {
      // Web browser file input
      const input = document.createElement("input");
      input.type = "file";
      input.accept = ".pdf,application/pdf";
      input.onchange = async (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file && file.type === "application/pdf") {
          await loadPDFFile(file);
        } else {
          toast.error("Please select a valid PDF file");
        }
      };
      input.click();
      onOpenFile?.();
    }
  }, [loadPDFFile, onOpenFile]);

  const handleNewFile = useCallback(() => {
    // Open the Create Modal for more creation options
    uiDispatch({ type: "OPEN_MODAL", payload: "create" });
    onNewFile?.();
  }, [uiDispatch, onNewFile]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
    },
    multiple: false,
  });

  const recentFiles = pdfState.recentFiles.slice(0, 5);

  const features = [
    {
      icon: DocumentIcon,
      title: "View & Edit PDFs",
      description: "Open, view, and edit PDF documents with professional tools",
    },
    {
      icon: SparklesIcon,
      title: "Annotations",
      description: "Add highlights, comments, drawings, and signatures",
    },
    {
      icon: FolderOpenIcon,
      title: "File Management",
      description: "Organize, merge, split, and manage your PDF files",
    },
  ];

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center shadow-lg">
              <DocumentIcon className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{t("welcome")}</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">{t("welcomeDescription")}</p>
        </div>

        {/* Main Actions */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {/* File Drop Zone */}
          <div
            {...getRootProps()}
            className={`dropzone cursor-pointer transition-all duration-200 ${isDragActive ? "active" : ""}`}
          >
            <input {...getInputProps()} />
            <div className="text-center">
              <FolderOpenIcon className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {isDragActive ? t("dropPDFHere") : t("openFile")}
              </h3>
              <p className="text-gray-600 mb-4">{isDragActive ? t("releaseToOpen") : t("dragDropDescription")}</p>
              <button onClick={handleOpenFile} className="btn btn-primary inline-flex items-center space-x-2">
                <FolderOpenIcon className="w-5 h-5" />
                <span>{t("browseFiles")}</span>
              </button>
            </div>
          </div>

          {/* Create New */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary-400 hover:bg-primary-50 transition-all duration-200">
            <DocumentPlusIcon className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{t("newDocument")}</h3>
            <p className="text-gray-600 mb-4">{t("createNewDescription")}</p>
            <button onClick={handleNewFile} className="btn btn-secondary inline-flex items-center space-x-2">
              <DocumentPlusIcon className="w-5 h-5" />
              <span>{t("newDocument")}</span>
            </button>
          </div>
        </div>

        {/* Recent Files */}
        {recentFiles.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
              <ClockIcon className="w-6 h-6 mr-2 text-gray-600" />
              {t("recentFiles")}
            </h2>
            <div className="grid gap-3">
              {recentFiles.map((filePath, index) => {
                const fileName = filePath.split("/").pop() || filePath;
                return (
                  <div
                    key={index}
                    className="flex items-center p-4 bg-white rounded-lg border border-gray-200 hover:border-primary-300 hover:shadow-md transition-all duration-200 cursor-pointer group"
                    onClick={() => {
                      loadPDFFile(filePath);
                    }}
                  >
                    <DocumentIcon className="w-8 h-8 text-red-500 mr-4 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900 truncate group-hover:text-primary-700">
                        {fileName}
                      </h3>
                      <p className="text-sm text-gray-500 truncate">{filePath}</p>
                    </div>
                    <div className="text-xs text-gray-400">Recent</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Features */}
        <div className="">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">Powerful PDF Tools</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="text-center p-6 bg-white rounded-xl border border-gray-200 hover:shadow-md transition-all duration-200"
                >
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-6 h-6 text-primary-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 pt-8 border-t border-gray-200">
          <p className="text-gray-500">
            Powered by <span className="font-semibold text-primary-600">MF Visions</span> • Created by Mohammad Fahad
            Alghammas
          </p>
        </div>
      </div>
    </div>
  );
}
