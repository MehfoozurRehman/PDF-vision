"use client";

import { useState } from "react";
import { useUI } from "@/store/ui-store";
import { usePDF } from "@/store/pdf-store";
import { XMarkIcon, DocumentIcon, PlusIcon, TrashIcon, ArrowUpIcon, ArrowDownIcon } from "@heroicons/react/24/outline";
import { useDropzone } from "react-dropzone";
import toast from "react-hot-toast";
import { useStirlingAPI } from "@/hooks/useStirlingAPI";
import { MergeOptions } from "@/api/types";

interface MergeFile {
  id: string;
  name: string;
  path: string;
  pages: number;
  size: string;
  file: File;
}

export default function MergeModal() {
  const { state: uiState, dispatch: uiDispatch } = useUI();
  const { dispatch: pdfDispatch } = usePDF();
  const { state: apiState, operations } = useStirlingAPI();
  const [files, setFiles] = useState<MergeFile[]>([]);
  const [outputName, setOutputName] = useState("merged-document.pdf");
  const [sortType, setSortType] = useState<"name" | "date" | "size">("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  if (!uiState.modals.merge) return null;

  const closeModal = () => {
    uiDispatch({ type: "CLOSE_MODAL", payload: "merge" });
    setFiles([]);
    setOutputName("merged-document.pdf");
    setSortType("name");
    setSortOrder("asc");
  };

  const onDrop = async (acceptedFiles: File[]) => {
    const pdfFiles = acceptedFiles.filter((file) => file.type === "application/pdf");

    if (pdfFiles.length !== acceptedFiles.length) {
      toast.error("Only PDF files are allowed");
    }

    const newFiles: (MergeFile | null)[] = await Promise.all(
      pdfFiles.map(async (file) => {
        try {
          // Get PDF info using Stirling-PDF API
          const pdfInfo = await operations.getPDFInfo(file);

          return {
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            name: file.name,
            path: file.name,
            pages: pdfInfo?.pageCount || 0,
            size: (file.size / 1024 / 1024).toFixed(2) + " MB",
            file: file,
          };
        } catch (error) {
          // Fallback to basic file info if API fails
          return {
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            name: file.name,
            path: file.name,
            pages: 0,
            size: (file.size / 1024 / 1024).toFixed(2) + " MB",
            file: file,
          };
        }
      }),
    );

    const validFiles = newFiles.filter((file): file is MergeFile => file !== null);
    setFiles((prev) => [...prev, ...validFiles]);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
    },
    multiple: true,
  });

  const removeFile = (fileId: string) => {
    setFiles((prev) => prev.filter((file) => file.id !== fileId));
  };

  const moveFile = (fileId: string, direction: "up" | "down") => {
    setFiles((prev) => {
      const index = prev.findIndex((file) => file.id === fileId);
      if (index === -1) return prev;

      const newIndex = direction === "up" ? index - 1 : index + 1;
      if (newIndex < 0 || newIndex >= prev.length) return prev;

      const newFiles = [...prev];
      const [movedFile] = newFiles.splice(index, 1);
      newFiles.splice(newIndex, 0, movedFile);
      return newFiles;
    });
  };

  const handleMerge = async () => {
    if (files.length < 2) {
      toast.error("Please select at least 2 PDF files to merge");
      return;
    }

    try {
      const fileList = files.map((f) => f.file);
      const mergeOptions: MergeOptions = {
        sortType,
        sortOrder,
      };

      const result = await operations.mergePDFs(fileList, mergeOptions);

      if (result) {
        await operations.downloadFile(result, outputName);
        closeModal();
      }
    } catch (error) {
      console.error("Error merging PDFs:", error);
    }
  };

  // Calculate totals
  const totalPages = files.reduce((sum, file) => sum + file.pages, 0);
  const totalSize = files.reduce((sum, file) => {
    const sizeInMB = parseFloat(file.size.replace(" MB", ""));
    return sum + sizeInMB;
  }, 0);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Merge PDFs</h2>
          <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 transition-colors">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden p-6">
          {/* Drop Zone */}
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors mb-6 ${
              isDragActive ? "border-adobe-blue bg-adobe-blue/5" : "border-gray-300 hover:border-gray-400"
            }`}
          >
            <input {...getInputProps()} />
            <DocumentIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-900 mb-2">
              {isDragActive ? "Drop PDF files here" : "Drag & drop PDF files here"}
            </p>
            <p className="text-gray-600 mb-4">or click to browse files</p>
            <button className="btn-primary">
              <PlusIcon className="w-4 h-4 mr-2" />
              Add Files
            </button>
          </div>

          {/* Files List */}
          {files.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">Files to Merge ({files.length})</h3>
                <div className="text-sm text-gray-600">
                  {totalPages} pages • {totalSize.toFixed(2)} MB
                </div>
              </div>

              <div className="max-h-64 overflow-y-auto space-y-2">
                {files.map((file, index) => (
                  <div key={file.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-red-100 rounded flex items-center justify-center">
                        <DocumentIcon className="w-5 h-5 text-red-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{file.name}</p>
                        <p className="text-sm text-gray-600">
                          {file.pages} pages • {file.size}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => moveFile(file.id, "up")}
                        disabled={index === 0}
                        className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Move up"
                      >
                        <ArrowUpIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => moveFile(file.id, "down")}
                        disabled={index === files.length - 1}
                        className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Move down"
                      >
                        <ArrowDownIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => removeFile(file.id)}
                        className="p-1 text-gray-400 hover:text-red-600"
                        title="Remove file"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Output Settings */}
          {files.length > 0 && (
            <div className="mt-6 space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Output Settings</h3>

              {/* Sort Options */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sort by</label>
                  <select
                    value={sortType}
                    onChange={(e) => setSortType(e.target.value as "name" | "date" | "size")}
                    className="input w-full"
                  >
                    <option value="name">Name</option>
                    <option value="date">Date</option>
                    <option value="size">Size</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Order</label>
                  <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
                    className="input w-full"
                  >
                    <option value="asc">Ascending</option>
                    <option value="desc">Descending</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Output filename</label>
                <input
                  type="text"
                  value={outputName}
                  onChange={(e) => setOutputName(e.target.value)}
                  className="input w-full"
                  placeholder="merged-document.pdf"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center p-6 border-t border-gray-200">
          <div className="text-sm text-gray-600">
            {files.length > 0 && (
              <span>
                Ready to merge {files.length} files into {outputName}
              </span>
            )}
          </div>
          <div className="flex space-x-3">
            <button
              onClick={closeModal}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleMerge}
              disabled={files.length < 2 || apiState.loading}
              className="px-4 py-2 bg-adobe-blue text-white rounded-lg hover:bg-adobe-blue-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {apiState.loading ? "Merging..." : "Merge PDFs"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
