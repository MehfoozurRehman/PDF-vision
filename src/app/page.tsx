"use client";

import { useEffect, useState } from "react";

import AboutModal from "@/components/modals/AboutModal";
import AllToolsMenu from "@/components/AllToolsMenu";
import BatesModal from "@/components/modals/BatesModal";
import ContextPanel from "@/components/ContextPanel";
import CreateModal from "@/components/modals/CreateModal";
import DrawingToolsModal from "@/components/modals/DrawingToolsModal";
import ExportModal from "@/components/modals/ExportModal";
import MergeModal from "@/components/modals/MergeModal";
import PDFViewer from "@/components/PDFViewer";
import QuickActionsToolbar from "@/components/QuickActionsToolbar";
import SettingsModal from "@/components/modals/SettingsModal";
import SharedReviewModal from "@/components/modals/SharedReviewModal";
import Sidebar from "@/components/Sidebar";
import SignModal from "@/components/modals/SignModal";
import SplitModal from "@/components/modals/SplitModal";
import StampsModal from "@/components/modals/StampsModal";
import StickyNotesModal from "@/components/modals/StickyNotesModal";
import TextMarkupModal from "@/components/modals/TextMarkupModal";
import Toolbar from "@/components/Toolbar";
import WelcomeScreen from "@/components/WelcomeScreen";
import { toast } from "react-hot-toast";
import { usePDF } from "@/store/pdf-store";
import { useUI } from "@/store/ui-store";

export default function HomePage() {
  const { state: pdfState, dispatch: pdfDispatch } = usePDF();
  const { state: uiState, dispatch: uiDispatch } = useUI();
  const [isElectron, setIsElectron] = useState(false);

  useEffect(() => {
    // Check if running in Electron
    setIsElectron(typeof window !== "undefined" && window.electronAPI !== undefined);

    // No automatic document loading - let users choose their own files

    // Set up Electron menu event listeners
    if (typeof window !== "undefined" && window.electronAPI) {
      const { electronAPI } = window;

      // File menu events
      electronAPI.onMenuOpenFile(() => handleOpenFile());
      electronAPI.onMenuNewFile(() => handleNewFile());
      electronAPI.onMenuSaveFile(() => handleSaveFile());
      electronAPI.onMenuSaveAsFile(() => handleSaveAsFile());

      // Tools menu events
      electronAPI.onMenuMergePdfs(() => uiDispatch({ type: "OPEN_MODAL", payload: "merge" }));
      electronAPI.onMenuSplitPdf(() => uiDispatch({ type: "OPEN_MODAL", payload: "split" }));
      electronAPI.onMenuSignDocument(() => uiDispatch({ type: "OPEN_MODAL", payload: "sign" }));

      // Help menu events
      electronAPI.onMenuShowAbout(() => uiDispatch({ type: "OPEN_MODAL", payload: "about" }));

      // Cleanup listeners on unmount
      return () => {
        electronAPI.removeAllListeners("menu-open-file");
        electronAPI.removeAllListeners("menu-new-file");
        electronAPI.removeAllListeners("menu-save-file");
        electronAPI.removeAllListeners("menu-save-as-file");
        electronAPI.removeAllListeners("menu-merge-pdfs");
        electronAPI.removeAllListeners("menu-split-pdf");
        electronAPI.removeAllListeners("menu-sign-document");
        electronAPI.removeAllListeners("menu-show-about");
      };
    }
  }, []);

  const handleOpenFile = async () => {
    if (isElectron && window.electronAPI) {
      // Desktop app file dialog
      try {
        const result = await window.electronAPI.openFileDialog({
          title: "Open PDF File",
          buttonLabel: "Open",
        });

        if (!result.canceled && result.filePaths.length > 0) {
          const filePath = result.filePaths[0];
          await loadPDFFile(filePath);
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
    }
  };

  const handleNewFile = () => {
    // Create a new blank PDF document
    const newDoc = {
      id: `doc_${Date.now()}`,
      name: "Untitled.pdf",
      path: undefined,
      pages: [],
      currentPage: 1,
      zoom: 1,
      annotations: [],
      isModified: false,
      createdAt: new Date(),
      modifiedAt: new Date(),
    };

    pdfDispatch({ type: "ADD_DOCUMENT", payload: newDoc });
    pdfDispatch({ type: "SET_ACTIVE_DOCUMENT", payload: newDoc });
    toast.success("New document created");
  };

  const handleSaveFile = async () => {
    if (!pdfState.activeDocument) {
      toast.error("No document to save");
      return;
    }

    if (isElectron && window.electronAPI) {
      // Desktop app save
      try {
        if (pdfState.activeDocument.path) {
          // Save to existing path
          await savePDFFile(pdfState.activeDocument.path);
          toast.success("Document saved");
        } else {
          // Save as new file
          await handleSaveAsFile();
        }
      } catch (error) {
        console.error("Error saving file:", error);
        toast.error("Failed to save file");
      }
    } else {
      // Web browser - trigger download
      toast.success("Downloading document... (Web version uses download instead of save)");
      // This will be handled by the PDFViewer component's download functionality
      const downloadEvent = new CustomEvent("downloadPDF");
      window.dispatchEvent(downloadEvent);
    }
  };

  const handleSaveAsFile = async () => {
    if (!pdfState.activeDocument) {
      toast.error("No document to save");
      return;
    }

    if (isElectron && window.electronAPI) {
      // Desktop app save dialog
      try {
        const result = await window.electronAPI.saveFileDialog({
          title: "Save PDF File",
          defaultPath: pdfState.activeDocument.name,
          buttonLabel: "Save",
        });

        if (!result.canceled && result.filePath) {
          await savePDFFile(result.filePath);
          pdfDispatch({
            type: "UPDATE_DOCUMENT",
            payload: {
              id: pdfState.activeDocument.id,
              path: result.filePath,
              name: window.electronAPI.path.basename(result.filePath),
            },
          });
          toast.success("Document saved");
        }
      } catch (error) {
        console.error("Error saving file:", error);
        toast.error("Failed to save file");
      }
    } else {
      // Web browser - trigger download with custom name
      const fileName = prompt("Enter filename:", pdfState.activeDocument.name) || pdfState.activeDocument.name;
      toast.success("Downloading document...");
      const downloadEvent = new CustomEvent("downloadPDF", {
        detail: { fileName },
      });
      window.dispatchEvent(downloadEvent);
    }
  };

  const loadPDFFile = async (fileInput: string | File) => {
    pdfDispatch({ type: "SET_LOADING", payload: true });

    try {
      let fileName: string;
      let filePath: string | undefined;

      if (typeof fileInput === "string") {
        // Desktop app - file path (desktop only)
        if (!window.electronAPI) {
          console.warn("File path operations not supported in web environment");
          return;
        }
        const fileData = await window.electronAPI.fs.readFile(fileInput);
        fileName = window.electronAPI.path.basename(fileInput);
        filePath = fileInput;
      } else {
        // Web browser - File object
        fileName = fileInput.name;
        filePath = undefined;
        // File data will be handled by PDFViewer component
      }

      const newDoc = {
        id: `doc_${Date.now()}`,
        name: fileName,
        path: filePath,
        pages: [], // Would be populated by PDF.js
        currentPage: 1,
        zoom: 1,
        annotations: [],
        isModified: false,
        createdAt: new Date(),
        modifiedAt: new Date(),
      };

      pdfDispatch({ type: "ADD_DOCUMENT", payload: newDoc });
      pdfDispatch({ type: "SET_ACTIVE_DOCUMENT", payload: newDoc });
      if (filePath) {
        pdfDispatch({ type: "ADD_RECENT_FILE", payload: filePath });
      }
      pdfDispatch({ type: "SET_LOADING", payload: false });
      toast.success(`Opened ${newDoc.name}`);
    } catch (error) {
      console.error("Error loading PDF:", error);
      pdfDispatch({ type: "SET_ERROR", payload: "Failed to load PDF file" });
      pdfDispatch({ type: "SET_LOADING", payload: false });
      toast.error("Failed to load PDF file");
    }
  };

  const savePDFFile = async (filePath: string) => {
    if (!pdfState.activeDocument) return;

    try {
      if (window.electronAPI) {
        // Desktop app - save to file system
        // Save PDF file using PDF-lib or similar library
        // This is a placeholder - actual implementation would use PDF-lib
        const pdfData = new Uint8Array(); // Would be generated by PDF-lib

        await window.electronAPI.fs.writeFile(filePath, pdfData);
      } else {
        // Web environment - trigger download
        const fileName = pdfState.activeDocument.name;
        const pdfContent = "Mock PDF content"; // Would be generated by PDF-lib

        const blob = new Blob([pdfContent], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        toast.success(`Downloaded ${fileName}`);
      }

      pdfDispatch({
        type: "UPDATE_DOCUMENT",
        payload: {
          id: pdfState.activeDocument.id,
          isModified: false,
        },
      });
    } catch (error) {
      console.error("Error saving PDF:", error);
      throw error;
    }
  };

  const handleUndo = () => {
    // TODO: Implement undo functionality
    toast.success("Undo action performed");
  };

  const handleRedo = () => {
    // TODO: Implement redo functionality
    toast.success("Redo action performed");
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Toolbar */}
      {uiState.toolbarVisible && (
        <Toolbar
          onOpenFile={handleOpenFile}
          onNewFile={handleNewFile}
          onSaveFile={handleSaveFile}
          onSaveAsFile={handleSaveAsFile}
          onUndo={handleUndo}
          onRedo={handleRedo}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        {uiState.sidebarOpen && <Sidebar />}

        {/* PDF Viewer or Welcome Screen */}
        <div className="flex-1 flex flex-col">
          {pdfState.activeDocument ? (
            <PDFViewer document={pdfState.activeDocument} />
          ) : (
            <WelcomeScreen onOpenFile={handleOpenFile} onNewFile={handleNewFile} />
          )}
        </div>
      </div>

      {/* Modals */}
      {uiState.modals.about && <AboutModal />}
      {uiState.modals.settings && <SettingsModal />}
      {uiState.modals.merge && <MergeModal />}
      {uiState.modals.split && <SplitModal />}
      {uiState.modals.sign && <SignModal />}
      {uiState.modals.export && <ExportModal />}
      {uiState.modals.bates && <BatesModal />}
      {uiState.modals.create && <CreateModal />}
      {uiState.modals.stickyNotes && <StickyNotesModal />}
      {uiState.modals.textMarkup && <TextMarkupModal />}
      {uiState.modals.drawingTools && <DrawingToolsModal />}
      {uiState.modals.stamps && <StampsModal />}
      {uiState.modals.sharedReview && <SharedReviewModal />}

      {/* All Tools Menu */}
      {uiState.showAllToolsMenu && <AllToolsMenu />}

      {/* Quick Actions Toolbar */}
      {pdfState.activeDocument && <QuickActionsToolbar />}

      {/* Context Panel */}
      {pdfState.activeDocument && <ContextPanel className="fixed top-20 right-4 w-80 max-h-96 overflow-y-auto z-40" />}
    </div>
  );
}

// Extend Window interface for Electron APIs
declare global {
  interface Window {
    electronAPI?: {
      openFileDialog: (options: any) => Promise<any>;
      saveFileDialog: (options: any) => Promise<any>;
      showMessageBox: (options: any) => Promise<any>;
      getAppVersion: () => Promise<string>;
      getAppPath: (name: string) => Promise<string>;
      onMenuOpenFile: (callback: () => void) => void;
      onMenuNewFile: (callback: () => void) => void;
      onMenuSaveFile: (callback: () => void) => void;
      onMenuSaveAsFile: (callback: () => void) => void;
      onMenuMergePdfs: (callback: () => void) => void;
      onMenuSplitPdf: (callback: () => void) => void;
      onMenuSignDocument: (callback: () => void) => void;
      onMenuShowAbout: (callback: () => void) => void;
      removeAllListeners: (channel: string) => void;
      platform: string;
      path: {
        join: (...args: string[]) => string;
        dirname: (path: string) => string;
        basename: (path: string) => string;
        extname: (path: string) => string;
      };
      fs: {
        readFile: (path: string) => Promise<Buffer>;
        writeFile: (path: string, data: any) => Promise<void>;
        exists: (path: string) => Promise<boolean>;
      };
    };
    cryptoAPI?: {
      generateKeyPair: () => { privateKey: string; publicKey: string };
      createCertificate: (keyPair: any, subject: any) => string;
    };
  }
}
