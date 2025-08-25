"use client";

import * as pdfjsLib from "pdfjs-dist";

import {
  AdjustmentsHorizontalIcon,
  ArrowPathIcon,
  ChatBubbleLeftRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  DocumentArrowDownIcon,
  EyeDropperIcon,
  FolderOpenIcon,
  MagnifyingGlassIcon,
  MinusIcon,
  MoonIcon,
  PencilIcon,
  PhotoIcon,
  PlusIcon,
  PrinterIcon,
  ShareIcon,
  ShieldCheckIcon,
  SparklesIcon,
  SunIcon,
  SwatchIcon,
  TrashIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useCallback, useEffect, useRef, useState } from "react";

import CommentSystem from "@/components/collaboration/CommentSystem";
import DocumentProtection from "@/components/editing/DocumentProtection";
import ExportModal from "@/components/editing/ExportModal";
import FileManager from "@/components/editing/FileManager";
import ImageEditor from "@/components/editing/ImageEditor";
import { PDFDocument } from "@/store/pdf-store";
import PrintModal from "@/components/modals/PrintModal";
import ShareModal from "@/components/modals/ShareModal";
import TextEditor from "@/components/TextEditor";
import { toast } from "react-hot-toast";
import { usePDF } from "@/store/pdf-store";
import { useUI } from "@/store/ui-store";

// Configure PDF.js worker
if (typeof window !== "undefined") {
  pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";
}

interface PDFViewerProps {
  document: PDFDocument;
}

export default function PDFViewer({ document }: PDFViewerProps) {
  const { state: uiState, dispatch: uiDispatch } = useUI();
  const { dispatch: pdfDispatch } = usePDF();
  const [searchTerm, setSearchTerm] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [pageRendering, setPageRendering] = useState(false);
  const [pageNumPending, setPageNumPending] = useState<number | null>(null);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showDocumentProtection, setShowDocumentProtection] = useState(false);
  const [showFileManager, setShowFileManager] = useState(false);
  const [showImageEditor, setShowImageEditor] = useState(false);
  const [textElements, setTextElements] = useState<any[]>([]);
  const [imageElements, setImageElements] = useState<any[]>([]);
  const [isAddingText, setIsAddingText] = useState(false);
  const [isAddingImage, setIsAddingImage] = useState(false);
  const [selectedTextElement, setSelectedTextElement] = useState<string | null>(null);
  const [selectedImageElement, setSelectedImageElement] = useState<string | null>(null);
  const [textToolbar, setTextToolbar] = useState({
    visible: false,
    x: 0,
    y: 0,
  });
  const [imageToolbar, setImageToolbar] = useState({
    visible: false,
    x: 0,
    y: 0,
  });
  const [showTextEditor, setShowTextEditor] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [loadingError, setLoadingError] = useState<string | null>(null);
  const [isLoadingPDF, setIsLoadingPDF] = useState(false);
  const [showColorAdjustments, setShowColorAdjustments] = useState(false);
  const [colorAdjustments, setColorAdjustments] = useState({
    brightness: 100,
    contrast: 100,
    saturation: 100,
    hue: 0,
    invert: false,
    grayscale: false,
    sepia: false,
    // Advanced color adjustments
    temperature: 0,
    tint: 0,
    gamma: 1,
    vibrance: 0,
    exposure: 0,
    shadows: 0,
    highlights: 0,
    blur: 0,
    sharpen: 0,
    opacity: 100,
  });
  const [comments, setComments] = useState<any[]>([]);
  const [selectedCommentId, setSelectedCommentId] = useState<string | undefined>(undefined);
  const viewerRef = useRef<HTMLDivElement>(null);
  const [canvasElement, setCanvasElement] = useState<HTMLCanvasElement | null>(null);
  const renderTaskRef = useRef<any>(null);

  // Touch gesture state for smooth page navigation
  const [touchState, setTouchState] = useState({
    startX: 0,
    startY: 0,
    currentX: 0,
    currentY: 0,
    isDragging: false,
    startTime: 0,
  });
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Watch for tool changes and open appropriate editors
  useEffect(() => {
    switch (uiState.activeTool) {
      case "text":
        setIsAddingText(true);
        setIsAddingImage(false);
        break;
      case "signature":
        setIsAddingImage(true);
        setIsAddingText(false);
        break;
      default:
        setIsAddingText(false);
        setIsAddingImage(false);
        // For other tools like highlight, note, drawing - keep editors closed
        // These will be handled directly on the canvas
        break;
    }
  }, [uiState.activeTool]);

  // Handle canvas clicks for annotation tools and inline editing
  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasElement) return;

    const rect = canvasElement.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Check if click is on a comment marker
    const clickedComment = comments.find((comment) => {
      if (comment.position?.page === document.currentPage) {
        const markerX = comment.position.x * document.zoom;
        const markerY = comment.position.y * document.zoom;
        const distance = Math.sqrt((x - markerX) ** 2 + (y - markerY) ** 2);
        return distance <= 12; // Click tolerance around marker
      }
      return false;
    });

    if (clickedComment) {
      // Select the comment and show comments panel
      handleSelectComment(clickedComment.id);
      setShowComments(true);
      return;
    }

    // Handle inline editing tools
    if (uiState.activeTool === "text" && isAddingText) {
      handleAddTextElement(x, y);
      return;
    }

    if (uiState.activeTool === "signature" && isAddingImage) {
      // Trigger file input for image selection
      const fileInput = window.document.createElement("input");
      fileInput.type = "file";
      fileInput.accept = "image/*";
      fileInput.onchange = (e: Event) => handleImageFileSelect(e, x, y);
      fileInput.click();
      return;
    }

    // Handle image tool for direct placement
    if (uiState.activeTool === "image") {
      const fileInput = window.document.createElement("input");
      fileInput.type = "file";
      fileInput.accept = "image/*";
      fileInput.onchange = (e: Event) => handleImageFileSelect(e, x, y);
      fileInput.click();
      return;
    }

    // Create annotation based on active tool
    switch (uiState.activeTool) {
      case "highlight":
        createAnnotation("highlight", x, y, 100, 20);
        break;
      case "note":
        // Create a comment at the clicked position
        const noteContent = prompt("Enter comment content:");
        if (noteContent) {
          handleAddComment({
            content: noteContent,
            author: {
              id: "user-1",
              name: "Current User",
              email: "user@example.com",
            },
            position: {
              page: document.currentPage,
              x: x,
              y: y,
            },
            status: "open",
            priority: "medium",
            tags: [],
          });
          // Also show the comments panel
          setShowComments(true);
        }
        break;
      case "drawing":
        // For drawing, we'll create a simple rectangle for now
        createAnnotation("drawing", x, y, 50, 50);
        break;
      default:
        break;
    }
  };

  // Handle adding text element directly on canvas
  const handleAddTextElement = (x: number, y: number) => {
    const newTextElement = {
      id: `text-${Date.now()}`,
      x,
      y,
      width: 200,
      height: 30,
      content: "Click to edit text",
      fontSize: 14,
      fontFamily: "Arial",
      fontWeight: "normal" as const,
      fontStyle: "normal" as const,
      textDecoration: "none" as const,
      textAlign: "left" as const,
      color: "#000000",
      isEditing: true,
      pageNumber: document.currentPage,
    };
    setTextElements((prev) => [...prev, newTextElement]);
    setSelectedTextElement(newTextElement.id);
    setIsAddingText(false);
    toast.success("Text element added - click to edit");
  };

  // Handle adding image element from file selection
  const handleImageFileSelect = (event: Event, x: number, y: number) => {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
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

        const newImageElement = {
          id: `image-${Date.now()}`,
          x,
          y,
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
          borderStyle: "solid" as const,
          shadow: false,
          pageNumber: document.currentPage,
        };
        setImageElements((prev) => [...prev, newImageElement]);
        setSelectedImageElement(newImageElement.id);
        setIsAddingImage(false);
        toast.success("Image added successfully");
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // Create annotation function
  const createAnnotation = (
    type: "highlight" | "note" | "drawing",
    x: number,
    y: number,
    width: number,
    height: number,
    content?: string,
  ) => {
    const newAnnotation = {
      id: `annotation-${Date.now()}`,
      type,
      pageNumber: document.currentPage,
      x,
      y,
      width,
      height,
      content: content || "",
      color: type === "highlight" ? "#fbbf24" : type === "note" ? "#3b82f6" : "#ef4444",
      author: "Current User",
      createdAt: new Date(),
      modifiedAt: new Date(),
    };

    pdfDispatch({
      type: "UPDATE_DOCUMENT",
      payload: {
        id: document.id,
        annotations: [...document.annotations, newAnnotation],
      },
    });

    toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} annotation added`);
  };

  const canvasRef = useCallback((node: HTMLCanvasElement | null) => {
    if (node) {
      console.log("Canvas mounted");
      setCanvasElement(node);
    } else {
      console.log("Canvas unmounted");
      setCanvasElement(null);
    }
  }, []);

  // Create a simple fallback PDF when sample.pdf is not available
  const createFallbackPDF = async (): Promise<ArrayBuffer> => {
    // Create a minimal PDF structure
    const pdfContent = `%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj

2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj

3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
>>
endobj

4 0 obj
<<
/Length 44
>>
stream
BT
/F1 12 Tf
100 700 Td
(Welcome to PDF Vision) Tj
ET
endstream
endobj

xref
0 5
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000206 00000 n 
trailer
<<
/Size 5
/Root 1 0 R
>>
startxref
299
%%EOF`;

    const encoder = new TextEncoder();
    return encoder.encode(pdfContent).buffer;
  };

  const loadPDFDocument = useCallback(async () => {
    if (typeof window === "undefined" || isLoadingPDF) return;

    setIsLoadingPDF(true);
    setLoadingError(null);

    try {
      // Check if we have stored PDF data first (for uploaded files)
      let fileData;
      if (document.data) {
        // Use stored PDF data from uploaded file
        fileData = document.data;
      } else if (document.path && window.electronAPI?.fs) {
        // Electron environment with file path
        try {
          fileData = await window.electronAPI.fs.readFile(document.path);
        } catch (fsError) {
          throw new Error(`Failed to read file: ${document.path}`);
        }
      } else {
        // Web environment - use direct public path for sample files
        const pdfPath = document.path || "/sample.pdf";
        try {
          // For Next.js dev server, use the direct public path
          const publicPath = pdfPath.startsWith("/") ? pdfPath : `/${pdfPath}`;

          const response = await fetch(publicPath, {
            method: "GET",
            headers: {
              Accept: "application/pdf",
            },
          });

          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }

          fileData = await response.arrayBuffer();
        } catch (fetchError) {
          fileData = await createFallbackPDF();
        }
      }

      if (!fileData || fileData.byteLength === 0) {
        throw new Error("PDF file is empty or corrupted");
      }

      // Load PDF with PDF.js
      const loadingTask = pdfjsLib.getDocument({
        data: fileData,
      });

      const pdf = await loadingTask.promise;

      if (pdf.numPages === 0) {
        throw new Error("PDF has no pages");
      }

      setPdfDoc(pdf);
      setTotalPages(pdf.numPages);

      // Update document with page count
      pdfDispatch({
        type: "UPDATE_DOCUMENT",
        payload: {
          id: document.id,
          pages: Array.from({ length: pdf.numPages }, (_, i) => ({
            id: `${document.id}-page-${i + 1}`,
            pageNumber: i + 1,
            width: 612, // Default width, will be updated when rendered
            height: 792, // Default height, will be updated when rendered
            rotation: 0,
            annotations: [],
          })),
        },
      });

      setLoadingError(null);
      toast.success(`PDF loaded successfully (${pdf.numPages} pages)`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      const fullErrorMessage = `Failed to load PDF: ${errorMessage}`;
      setLoadingError(fullErrorMessage);
    } finally {
      setIsLoadingPDF(false);
    }
  }, [document.path, document.id, isLoadingPDF, pdfDispatch]);

  useEffect(() => {
    // Load PDF document
    if (document && (document.path || document.data) && !pdfDoc && !isLoadingPDF) {
      loadPDFDocument();
    }
  }, [document, pdfDoc, isLoadingPDF, loadPDFDocument]);

  useEffect(() => {
    // Render page when document or page changes
    if (pdfDoc && canvasElement && totalPages > 0) {
      queueRenderPage(document.currentPage);
    }
  }, [pdfDoc, document.currentPage, document.zoom, canvasElement, totalPages]);

  // Cleanup render task on unmount or canvas change
  useEffect(() => {
    return () => {
      if (renderTaskRef.current) {
        try {
          renderTaskRef.current.cancel();
        } catch (error) {
          // Ignore cancellation errors
        }
        renderTaskRef.current = null;
      }
    };
  }, [canvasElement]);

  const renderPage = async (pageNum: number) => {
    if (!pdfDoc || !canvasElement || pageRendering) {
      return;
    }

    if (pageNum < 1 || pageNum > totalPages) {
      return;
    }

    // Cancel any existing render task
    if (renderTaskRef.current) {
      try {
        renderTaskRef.current.cancel();
      } catch (error) {
        // Ignore cancellation errors
      }
      renderTaskRef.current = null;
    }

    setPageRendering(true);

    try {
      const page = await pdfDoc.getPage(pageNum);
      const viewport = page.getViewport({ scale: document.zoom });
      const canvas = canvasElement;

      if (!canvas) {
        setPageRendering(false);
        return;
      }

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        setPageRendering(false);
        return;
      }

      canvas.height = viewport.height;
      canvas.width = viewport.width;

      // Clear canvas before rendering
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const renderContext = {
        canvasContext: ctx,
        viewport: viewport,
      };

      const renderTask = page.render(renderContext);
      renderTaskRef.current = renderTask;
      await renderTask.promise;
      renderTaskRef.current = null;

      // Render comment markers on top of the PDF
      renderCommentMarkers(ctx, viewport, pageNum);

      // Update page dimensions in store
      pdfDispatch({
        type: "UPDATE_DOCUMENT",
        payload: {
          id: document.id,
          pages: document.pages.map((p) =>
            p.pageNumber === pageNum ? { ...p, width: viewport.width, height: viewport.height } : p,
          ),
        },
      });

      setPageRendering(false);

      // If there was a pending page render, execute it
      if (pageNumPending !== null) {
        const pendingPage = pageNumPending;
        setPageNumPending(null);
        renderPage(pendingPage);
      }
    } catch (error) {
      console.error("Error rendering page:", error);
      toast.error(`Failed to render page ${pageNum}`);
      setPageRendering(false);
    }
  };

  const queueRenderPage = (pageNum: number) => {
    if (pageRendering) {
      setPageNumPending(pageNum);
    } else {
      renderPage(pageNum);
    }
  };

  // Render comment markers on the canvas
  const renderCommentMarkers = (ctx: CanvasRenderingContext2D, viewport: any, pageNumber: number) => {
    const pageComments = comments.filter((comment) => comment.position?.page === pageNumber);

    pageComments.forEach((comment) => {
      if (comment.position) {
        const x = comment.position.x * document.zoom;
        const y = comment.position.y * document.zoom;

        // Draw comment marker (small circle)
        ctx.save();
        ctx.fillStyle = comment.status === "resolved" ? "#10b981" : "#f59e0b";
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 2;

        ctx.beginPath();
        ctx.arc(x, y, 8, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();

        // Add comment icon (C)
        ctx.fillStyle = "#ffffff";
        ctx.font = "10px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("C", x, y);

        ctx.restore();
      }
    });
  };

  const handlePrevPage = () => {
    if (document.currentPage > 1 && !isTransitioning) {
      setIsTransitioning(true);
      const newPage = document.currentPage - 1;
      pdfDispatch({
        type: "UPDATE_DOCUMENT",
        payload: { id: document.id, currentPage: newPage },
      });
      // Reset transition state after animation
      setTimeout(() => setIsTransitioning(false), 300);
    }
  };

  const handleNextPage = () => {
    if (document.currentPage < document.pages.length && !isTransitioning) {
      setIsTransitioning(true);
      const newPage = document.currentPage + 1;
      pdfDispatch({
        type: "UPDATE_DOCUMENT",
        payload: { id: document.id, currentPage: newPage },
      });
      // Reset transition state after animation
      setTimeout(() => setIsTransitioning(false), 300);
    }
  };

  // Touch gesture handlers for smooth page navigation
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setTouchState({
      startX: touch.clientX,
      startY: touch.clientY,
      currentX: touch.clientX,
      currentY: touch.clientY,
      isDragging: true,
      startTime: Date.now(),
    });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchState.isDragging) return;

    const touch = e.touches[0];
    const deltaX = touch.clientX - touchState.startX;
    const deltaY = touch.clientY - touchState.startY;

    // Only prevent default for horizontal swipes to allow page navigation
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 20) {
      e.preventDefault();
    }

    setTouchState((prev) => ({
      ...prev,
      currentX: touch.clientX,
      currentY: touch.clientY,
    }));
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchState.isDragging) return;

    const deltaX = touchState.currentX - touchState.startX;
    const deltaY = touchState.currentY - touchState.startY;
    const deltaTime = Date.now() - touchState.startTime;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const velocity = distance / deltaTime;

    // Determine if this is a swipe gesture for page navigation
    const isHorizontalSwipe = Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 30;
    const isFastSwipe = velocity > 0.3;
    const isSignificantSwipe = Math.abs(deltaX) > 80;

    // Allow page navigation with any tool if it's a clear horizontal swipe
    if (isHorizontalSwipe && (isSignificantSwipe || isFastSwipe)) {
      // Add haptic feedback if available
      if (navigator.vibrate) {
        navigator.vibrate(50);
      }

      if (deltaX > 0) {
        // Swipe right - go to previous page
        handlePrevPage();
        toast.success(`Page ${Math.max(1, document.currentPage - 1)} of ${totalPages}`, {
          duration: 1000,
          position: "bottom-center",
        });
      } else {
        // Swipe left - go to next page
        handleNextPage();
        toast.success(`Page ${Math.min(totalPages, document.currentPage + 1)} of ${totalPages}`, {
          duration: 1000,
          position: "bottom-center",
        });
      }
    }

    setTouchState({
      startX: 0,
      startY: 0,
      currentX: 0,
      currentY: 0,
      isDragging: false,
      startTime: 0,
    });
  };

  // Mouse gesture handlers for desktop
  const handleMouseDown = (e: React.MouseEvent) => {
    // Only enable mouse dragging for hand tool to avoid conflicts with other tools
    if (uiState.activeTool !== "hand") return;

    setTouchState({
      startX: e.clientX,
      startY: e.clientY,
      currentX: e.clientX,
      currentY: e.clientY,
      isDragging: true,
      startTime: Date.now(),
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!touchState.isDragging || uiState.activeTool !== "hand") return;

    setTouchState((prev) => ({
      ...prev,
      currentX: e.clientX,
      currentY: e.clientY,
    }));
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!touchState.isDragging || uiState.activeTool !== "hand") return;

    const deltaX = touchState.currentX - touchState.startX;
    const deltaY = touchState.currentY - touchState.startY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    // Only trigger page change for significant horizontal movement
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 120) {
      if (deltaX > 0) {
        handlePrevPage();
        toast.success(`Page ${Math.max(1, document.currentPage - 1)} of ${totalPages}`, {
          duration: 1000,
          position: "bottom-center",
        });
      } else {
        handleNextPage();
        toast.success(`Page ${Math.min(totalPages, document.currentPage + 1)} of ${totalPages}`, {
          duration: 1000,
          position: "bottom-center",
        });
      }
    }

    setTouchState({
      startX: 0,
      startY: 0,
      currentX: 0,
      currentY: 0,
      isDragging: false,
      startTime: 0,
    });
  };

  const handleZoomIn = () => {
    const newZoom = Math.min(document.zoom + 0.25, 3);
    pdfDispatch({
      type: "UPDATE_DOCUMENT",
      payload: { id: document.id, zoom: newZoom },
    });
  };

  // Keyboard navigation support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle navigation keys when not typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (e.key) {
        case "ArrowLeft":
        case "PageUp":
          e.preventDefault();
          handlePrevPage();
          break;
        case "ArrowRight":
        case "PageDown":
        case " ": // Spacebar
          e.preventDefault();
          handleNextPage();
          break;
        case "Home":
          e.preventDefault();
          if (document.currentPage !== 1) {
            pdfDispatch({
              type: "UPDATE_DOCUMENT",
              payload: { id: document.id, currentPage: 1 },
            });
            toast.success("Navigated to first page", {
              duration: 1000,
              position: "bottom-center",
            });
          }
          break;
        case "End":
          e.preventDefault();
          if (document.currentPage !== totalPages) {
            pdfDispatch({
              type: "UPDATE_DOCUMENT",
              payload: { id: document.id, currentPage: totalPages },
            });
            toast.success("Navigated to last page", {
              duration: 1000,
              position: "bottom-center",
            });
          }
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [document.currentPage, totalPages, handlePrevPage, handleNextPage, pdfDispatch, document.id]);

  const handleZoomOut = () => {
    const newZoom = Math.max(document.zoom - 0.25, 0.25);
    pdfDispatch({
      type: "UPDATE_DOCUMENT",
      payload: { id: document.id, zoom: newZoom },
    });
  };

  const handlePrint = () => {
    setShowPrintModal(true);
  };

  const handleShare = () => {
    setShowShareModal(true);
  };

  const handlePrintDocument = (settings: any) => {
    console.log("Printing with settings:", settings);
    // TODO: Implement actual print functionality with settings
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    // TODO: Implement search functionality
    console.log("Searching for:", term);
  };

  const handleDownloadPDF = async () => {
    try {
      if (!pdfDoc) {
        toast.error("No PDF document loaded");
        return;
      }

      // Create a download link for the current PDF
      const canvas = canvasElement;
      if (!canvas) {
        toast.error("PDF not rendered yet");
        return;
      }

      // For web environment, we'll convert the current PDF to a blob and download it
      if (document.path && document.path.startsWith("/")) {
        // If it's a sample PDF, fetch and download it
        try {
          const response = await fetch(document.path);
          if (response.ok) {
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            const link = window.document.createElement("a");
            link.href = url;
            link.download = document.name || "document.pdf";
            window.document.body.appendChild(link);
            link.click();
            window.document.body.removeChild(link);
            URL.revokeObjectURL(url);
            toast.success("PDF downloaded successfully");
            return;
          }
        } catch (error) {
          console.error("Error downloading PDF:", error);
        }
      }

      // Fallback: Create PDF from canvas (for generated/modified PDFs)
      const dataUrl = canvas.toDataURL("image/png");
      const link = window.document.createElement("a");
      link.href = dataUrl;
      link.download = `${document.name || "document"}.png`;
      window.document.body.appendChild(link);
      link.click();
      window.document.body.removeChild(link);
      toast.success("PDF page downloaded as image");
    } catch (error) {
      console.error("Error downloading PDF:", error);
      toast.error("Failed to download PDF");
    }
  };

  const handleExportDocument = async (settings: any) => {
    try {
      if (!pdfDoc || !canvasElement) {
        toast.error("No PDF document loaded");
        return;
      }

      const { format, quality, pageRange, pageStart, pageEnd } = settings;

      if (format === "pdf") {
        // Download original PDF
        await handleDownloadPDF();
        return;
      }

      // For image formats, render pages to canvas and export
      if (format === "png" || format === "jpg") {
        const canvas = canvasElement;
        const dataUrl = canvas.toDataURL(
          `image/${format}`,
          quality === "high" ? 1.0 : quality === "medium" ? 0.8 : 0.6,
        );
        const link = window.document.createElement("a");
        link.href = dataUrl;
        link.download = `${document.name || "document"}.${format}`;
        window.document.body.appendChild(link);
        link.click();
        window.document.body.removeChild(link);
        toast.success(`Document exported as ${format.toUpperCase()}`);
        return;
      }

      // For advanced formats, provide basic conversion or show helpful message
      if (format === "docx" || format === "xlsx" || format === "pptx") {
        toast.error(
          `${format.toUpperCase()} export requires advanced conversion. Try using online converters or the desktop app for full support.`,
        );
        return;
      }

      // For text format, extract text content (basic implementation)
      if (format === "txt") {
        try {
          const page = await pdfDoc.getPage(document.currentPage);
          const textContent = await page.getTextContent();
          const text = textContent.items.map((item: any) => item.str).join(" ");

          const blob = new Blob([text], { type: "text/plain" });
          const url = URL.createObjectURL(blob);
          const link = window.document.createElement("a");
          link.href = url;
          link.download = `${document.name || "document"}.txt`;
          window.document.body.appendChild(link);
          link.click();
          window.document.body.removeChild(link);
          URL.revokeObjectURL(url);
          toast.success("Text content exported");
        } catch (error) {
          toast.error("Failed to extract text content");
        }
        return;
      }

      toast.error("Export format not supported in web version");
    } catch (error) {
      console.error("Error exporting document:", error);
      toast.error("Failed to export document");
    }
  };

  // Comment handlers
  const handleAddComment = (comment: any) => {
    const newComment = {
      ...comment,
      id: `comment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      replies: [],
      likes: [],
    };
    setComments((prev) => [...prev, newComment]);
    toast.success("Comment added successfully");
  };

  const handleUpdateComment = (id: string, content: string) => {
    setComments((prev) =>
      prev.map((comment) => (comment.id === id ? { ...comment, content, updatedAt: new Date() } : comment)),
    );
    toast.success("Comment updated");
  };

  const handleDeleteComment = (id: string) => {
    setComments((prev) => prev.filter((comment) => comment.id !== id));
    toast.success("Comment deleted");
  };

  const handleReplyToComment = (commentId: string, reply: any) => {
    const newReply = {
      ...reply,
      id: `reply-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      likes: [],
    };
    setComments((prev) =>
      prev.map((comment) =>
        comment.id === commentId ? { ...comment, replies: [...comment.replies, newReply] } : comment,
      ),
    );
    toast.success("Reply added");
  };

  const handleUpdateReply = (commentId: string, replyId: string, content: string) => {
    setComments((prev) =>
      prev.map((comment) =>
        comment.id === commentId
          ? {
              ...comment,
              replies: comment.replies.map((reply: any) =>
                reply.id === replyId ? { ...reply, content, updatedAt: new Date() } : reply,
              ),
            }
          : comment,
      ),
    );
    toast.success("Reply updated");
  };

  const handleDeleteReply = (commentId: string, replyId: string) => {
    setComments((prev) =>
      prev.map((comment) =>
        comment.id === commentId
          ? {
              ...comment,
              replies: comment.replies.filter((reply: any) => reply.id !== replyId),
            }
          : comment,
      ),
    );
    toast.success("Reply deleted");
  };

  const handleLikeComment = (id: string) => {
    const currentUserId = "user-1";
    setComments((prev) =>
      prev.map((comment) => {
        if (comment.id === id) {
          const isLiked = comment.likes.includes(currentUserId);
          return {
            ...comment,
            likes: isLiked
              ? comment.likes.filter((userId: string) => userId !== currentUserId)
              : [...comment.likes, currentUserId],
          };
        }
        return comment;
      }),
    );
  };

  const handleLikeReply = (commentId: string, replyId: string) => {
    const currentUserId = "user-1";
    setComments((prev) =>
      prev.map((comment) => {
        if (comment.id === commentId) {
          return {
            ...comment,
            replies: comment.replies.map((reply: any) => {
              if (reply.id === replyId) {
                const isLiked = reply.likes.includes(currentUserId);
                return {
                  ...reply,
                  likes: isLiked
                    ? reply.likes.filter((userId: string) => userId !== currentUserId)
                    : [...reply.likes, currentUserId],
                };
              }
              return reply;
            }),
          };
        }
        return comment;
      }),
    );
  };

  const handleResolveComment = (id: string) => {
    setComments((prev) =>
      prev.map((comment) =>
        comment.id === id
          ? {
              ...comment,
              status: comment.status === "resolved" ? "open" : "resolved",
            }
          : comment,
      ),
    );
    toast.success("Comment status updated");
  };

  const handleChangeCommentStatus = (id: string, status: "open" | "resolved" | "archived") => {
    setComments((prev) => prev.map((comment) => (comment.id === id ? { ...comment, status } : comment)));
    toast.success("Comment status updated");
  };

  const handleSelectComment = (id: string | undefined) => {
    setSelectedCommentId(id);
  };

  if (!document) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-100">
        <div className="text-center text-gray-500">
          <p>No document selected</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-pdf-bg">
      {/* Document Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h2 className="text-lg font-semibold text-gray-900 truncate">{document.name}</h2>
          {document.isModified && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
              Modified
            </span>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {/* Search */}
          <div className="relative">
            {showSearch ? (
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="Search in document..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="input w-64"
                  autoFocus
                />
                <button onClick={() => setShowSearch(false)} className="text-gray-400 hover:text-gray-600">
                  ×
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowSearch(true)}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
                title="Search (Ctrl+F)"
              >
                <MagnifyingGlassIcon className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Zoom Controls */}
          <div className="flex items-center space-x-2 border-l border-gray-200 pl-4">
            <button
              onClick={handleZoomOut}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
              title="Zoom Out"
            >
              <MinusIcon className="w-5 h-5" />
            </button>
            <span className="text-sm text-gray-600 min-w-[60px] text-center">{Math.round(document.zoom * 100)}%</span>
            <button
              onClick={handleZoomIn}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
              title="Zoom In"
            >
              <PlusIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Page Navigation */}
          <div className="flex items-center space-x-2 border-l border-gray-200 pl-4">
            <button
              onClick={handlePrevPage}
              disabled={document.currentPage <= 1}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
              title="Previous Page"
            >
              <ChevronLeftIcon className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-2">
              <input
                type="number"
                min="1"
                max={document.pages.length}
                value={document.currentPage}
                onChange={(e) => {
                  const page = parseInt(e.target.value);
                  if (page >= 1 && page <= document.pages.length) {
                    pdfDispatch({
                      type: "UPDATE_DOCUMENT",
                      payload: { id: document.id, currentPage: page },
                    });
                    // Remove queueRenderPage call - useEffect will handle rendering
                  }
                }}
                className="w-16 px-2 py-1 text-center border border-gray-300 rounded text-sm"
              />
              <span className="text-sm text-gray-600">of {document.pages.length}</span>
            </div>

            <button
              onClick={handleNextPage}
              disabled={document.currentPage >= document.pages.length}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
              title="Next Page"
            >
              <ChevronRightIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Color Adjustments */}
          <div className="flex items-center space-x-2 border-l border-gray-200 pl-4">
            <button
              onClick={() => setShowColorAdjustments(!showColorAdjustments)}
              className={`p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded ${
                showColorAdjustments ? "bg-blue-100 text-blue-600" : ""
              }`}
              title="Color Adjustments"
            >
              <AdjustmentsHorizontalIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Document Actions */}
          <div className="flex items-center space-x-2 border-l border-gray-200 pl-4">
            <button
              onClick={handlePrint}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
              title="Print"
            >
              <PrinterIcon className="w-5 h-5" />
            </button>
            <button
              onClick={handleShare}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
              title="Share Document"
            >
              <ShareIcon className="w-5 h-5" />
            </button>

            <button
              onClick={() => setShowComments(!showComments)}
              className={`p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded ${
                showComments ? "bg-gray-100 text-gray-900" : ""
              }`}
              title="Comments"
            >
              <ChatBubbleLeftRightIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Editing Tools */}
          <div className="flex items-center space-x-2 border-l border-gray-200 pl-4">
            <button
              onClick={() => {
                uiDispatch({ type: "SET_ACTIVE_TOOL", payload: "text" });
                setIsAddingText(true);
              }}
              className={`p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded ${
                uiState.activeTool === "text" ? "bg-gray-100 text-gray-900" : ""
              }`}
              title="Add Text"
            >
              <PencilIcon className="w-5 h-5" />
            </button>
            <button
              onClick={() => setShowImageEditor(true)}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
              title="Image Editor"
            >
              <PhotoIcon className="w-5 h-5" />
            </button>
            <button
              onClick={handleDownloadPDF}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
              title="Download PDF"
            >
              <DocumentArrowDownIcon className="w-5 h-5" />
            </button>
            <button
              onClick={() => {
                const downloadEvent = new CustomEvent("downloadPDF");
                window.dispatchEvent(downloadEvent);
                toast.success("Downloading document...");
              }}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
              title="Save/Download Document"
            >
              <DocumentArrowDownIcon className="w-5 h-5" />
            </button>
            <button
              onClick={() => setShowExportModal(true)}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
              title="Export Document"
            >
              <DocumentArrowDownIcon className="w-5 h-5" />
            </button>
            <button
              onClick={() => setShowDocumentProtection(true)}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
              title="Document Protection"
            >
              <ShieldCheckIcon className="w-5 h-5" />
            </button>
            <button
              onClick={() => setShowFileManager(true)}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
              title="File Manager"
            >
              <FolderOpenIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Color Adjustment Panel */}
      {showColorAdjustments && (
        <div className="bg-white border-b border-gray-200 px-4 py-3">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-900">Advanced Color Tools</h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    // Cycle through presets
                    const presets = [
                      {
                        name: "Vivid",
                        values: {
                          brightness: 110,
                          contrast: 120,
                          saturation: 130,
                          vibrance: 20,
                        },
                      },
                      {
                        name: "Vintage",
                        values: {
                          brightness: 95,
                          contrast: 110,
                          saturation: 80,
                          sepia: true,
                        },
                      },
                      {
                        name: "B&W",
                        values: {
                          brightness: 105,
                          contrast: 130,
                          saturation: 0,
                          grayscale: true,
                        },
                      },
                      {
                        name: "Dramatic",
                        values: {
                          brightness: 90,
                          contrast: 140,
                          saturation: 120,
                          vibrance: 30,
                        },
                      },
                    ];
                    const currentIndex = Math.floor(Math.random() * presets.length);
                    const preset = presets[currentIndex];
                    setColorAdjustments((prev) => ({
                      ...prev,
                      ...preset.values,
                    }));
                    toast.success(`Applied ${preset.name} preset`);
                  }}
                  className="p-1 text-gray-500 hover:text-gray-700"
                  title="Color Presets"
                >
                  <SwatchIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    // Auto enhance algorithm
                    const enhanced = {
                      brightness: Math.min(120, colorAdjustments.brightness + 10),
                      contrast: Math.min(150, colorAdjustments.contrast + 15),
                      saturation: Math.min(140, colorAdjustments.saturation + 20),
                      vibrance: Math.min(50, colorAdjustments.vibrance + 15),
                      exposure: Math.max(-20, Math.min(20, colorAdjustments.exposure + 5)),
                      shadows: Math.min(30, colorAdjustments.shadows + 10),
                      highlights: Math.max(-30, colorAdjustments.highlights - 5),
                      sharpen: Math.min(20, colorAdjustments.sharpen + 5),
                    };
                    setColorAdjustments((prev) => ({ ...prev, ...enhanced }));
                    toast.success("Auto enhancement applied");
                  }}
                  className="p-1 text-gray-500 hover:text-gray-700"
                  title="Auto Enhance"
                >
                  <SparklesIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    // Smart balance - professional look
                    setColorAdjustments({
                      brightness: 105,
                      contrast: 115,
                      saturation: 110,
                      hue: 0,
                      invert: false,
                      grayscale: false,
                      sepia: false,
                      temperature: 5,
                      tint: 2,
                      gamma: 1.05,
                      vibrance: 15,
                      exposure: 3,
                      shadows: 8,
                      highlights: -3,
                      blur: 0,
                      sharpen: 2,
                      opacity: 100,
                    });
                    toast.success("Smart balance applied");
                  }}
                  className="p-1 text-gray-500 hover:text-gray-700"
                  title="Smart Balance"
                >
                  <EyeDropperIcon className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Basic Adjustments */}
            <div className="mb-6">
              <h4 className="text-xs font-medium text-gray-700 mb-3 flex items-center">
                <SunIcon className="w-3 h-3 mr-1" />
                Basic Adjustments
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* Brightness */}
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Brightness</label>
                  <input
                    type="range"
                    min="0"
                    max="200"
                    value={colorAdjustments.brightness}
                    onChange={(e) =>
                      setColorAdjustments((prev) => ({
                        ...prev,
                        brightness: parseInt(e.target.value),
                      }))
                    }
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-xs text-gray-500">{colorAdjustments.brightness}%</span>
                </div>

                {/* Contrast */}
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Contrast</label>
                  <input
                    type="range"
                    min="0"
                    max="200"
                    value={colorAdjustments.contrast}
                    onChange={(e) =>
                      setColorAdjustments((prev) => ({
                        ...prev,
                        contrast: parseInt(e.target.value),
                      }))
                    }
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-xs text-gray-500">{colorAdjustments.contrast}%</span>
                </div>

                {/* Saturation */}
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Saturation</label>
                  <input
                    type="range"
                    min="0"
                    max="200"
                    value={colorAdjustments.saturation}
                    onChange={(e) =>
                      setColorAdjustments((prev) => ({
                        ...prev,
                        saturation: parseInt(e.target.value),
                      }))
                    }
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-xs text-gray-500">{colorAdjustments.saturation}%</span>
                </div>

                {/* Vibrance */}
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Vibrance</label>
                  <input
                    type="range"
                    min="-100"
                    max="100"
                    value={colorAdjustments.vibrance}
                    onChange={(e) =>
                      setColorAdjustments((prev) => ({
                        ...prev,
                        vibrance: parseInt(e.target.value),
                      }))
                    }
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-xs text-gray-500">
                    {colorAdjustments.vibrance > 0 ? "+" : ""}
                    {colorAdjustments.vibrance}
                  </span>
                </div>
              </div>
            </div>

            {/* Color Temperature & Tint */}
            <div className="mb-6">
              <h4 className="text-xs font-medium text-gray-700 mb-3 flex items-center">
                <MoonIcon className="w-3 h-3 mr-1" />
                Color Temperature
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* Temperature */}
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Temperature</label>
                  <input
                    type="range"
                    min="-100"
                    max="100"
                    value={colorAdjustments.temperature}
                    onChange={(e) =>
                      setColorAdjustments((prev) => ({
                        ...prev,
                        temperature: parseInt(e.target.value),
                      }))
                    }
                    className="w-full h-2 bg-gradient-to-r from-blue-400 to-orange-400 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-xs text-gray-500">
                    {colorAdjustments.temperature > 0 ? "+" : ""}
                    {colorAdjustments.temperature}
                  </span>
                </div>

                {/* Tint */}
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Tint</label>
                  <input
                    type="range"
                    min="-100"
                    max="100"
                    value={colorAdjustments.tint}
                    onChange={(e) =>
                      setColorAdjustments((prev) => ({
                        ...prev,
                        tint: parseInt(e.target.value),
                      }))
                    }
                    className="w-full h-2 bg-gradient-to-r from-green-400 to-pink-400 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-xs text-gray-500">
                    {colorAdjustments.tint > 0 ? "+" : ""}
                    {colorAdjustments.tint}
                  </span>
                </div>

                {/* Hue */}
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Hue</label>
                  <input
                    type="range"
                    min="-180"
                    max="180"
                    value={colorAdjustments.hue}
                    onChange={(e) =>
                      setColorAdjustments((prev) => ({
                        ...prev,
                        hue: parseInt(e.target.value),
                      }))
                    }
                    className="w-full h-2 bg-gradient-to-r from-red-400 via-yellow-400 via-green-400 via-blue-400 to-purple-400 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-xs text-gray-500">{colorAdjustments.hue}°</span>
                </div>

                {/* Gamma */}
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Gamma</label>
                  <input
                    type="range"
                    min="0.1"
                    max="3"
                    step="0.1"
                    value={colorAdjustments.gamma}
                    onChange={(e) =>
                      setColorAdjustments((prev) => ({
                        ...prev,
                        gamma: parseFloat(e.target.value),
                      }))
                    }
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-xs text-gray-500">{colorAdjustments.gamma.toFixed(1)}</span>
                </div>
              </div>
            </div>

            {/* Exposure & Tone */}
            <div className="mb-6">
              <h4 className="text-xs font-medium text-gray-700 mb-3">Exposure & Tone</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* Exposure */}
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Exposure</label>
                  <input
                    type="range"
                    min="-100"
                    max="100"
                    value={colorAdjustments.exposure}
                    onChange={(e) =>
                      setColorAdjustments((prev) => ({
                        ...prev,
                        exposure: parseInt(e.target.value),
                      }))
                    }
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-xs text-gray-500">
                    {colorAdjustments.exposure > 0 ? "+" : ""}
                    {colorAdjustments.exposure}
                  </span>
                </div>

                {/* Shadows */}
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Shadows</label>
                  <input
                    type="range"
                    min="-100"
                    max="100"
                    value={colorAdjustments.shadows}
                    onChange={(e) =>
                      setColorAdjustments((prev) => ({
                        ...prev,
                        shadows: parseInt(e.target.value),
                      }))
                    }
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-xs text-gray-500">
                    {colorAdjustments.shadows > 0 ? "+" : ""}
                    {colorAdjustments.shadows}
                  </span>
                </div>

                {/* Highlights */}
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Highlights</label>
                  <input
                    type="range"
                    min="-100"
                    max="100"
                    value={colorAdjustments.highlights}
                    onChange={(e) =>
                      setColorAdjustments((prev) => ({
                        ...prev,
                        highlights: parseInt(e.target.value),
                      }))
                    }
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-xs text-gray-500">
                    {colorAdjustments.highlights > 0 ? "+" : ""}
                    {colorAdjustments.highlights}
                  </span>
                </div>

                {/* Opacity */}
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Opacity</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={colorAdjustments.opacity}
                    onChange={(e) =>
                      setColorAdjustments((prev) => ({
                        ...prev,
                        opacity: parseInt(e.target.value),
                      }))
                    }
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-xs text-gray-500">{colorAdjustments.opacity}%</span>
                </div>
              </div>
            </div>

            {/* Effects */}
            <div className="mb-6">
              <h4 className="text-xs font-medium text-gray-700 mb-3">Effects</h4>
              <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
                {/* Blur */}
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Blur</label>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    step="0.5"
                    value={colorAdjustments.blur}
                    onChange={(e) =>
                      setColorAdjustments((prev) => ({
                        ...prev,
                        blur: parseFloat(e.target.value),
                      }))
                    }
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-xs text-gray-500">{colorAdjustments.blur}px</span>
                </div>

                {/* Sharpen */}
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Sharpen</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={colorAdjustments.sharpen}
                    onChange={(e) =>
                      setColorAdjustments((prev) => ({
                        ...prev,
                        sharpen: parseInt(e.target.value),
                      }))
                    }
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-xs text-gray-500">{colorAdjustments.sharpen}%</span>
                </div>
              </div>
            </div>

            {/* Filter Toggles & Presets */}
            <div className="flex items-center justify-between mt-6">
              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={colorAdjustments.invert}
                    onChange={(e) =>
                      setColorAdjustments((prev) => ({
                        ...prev,
                        invert: e.target.checked,
                      }))
                    }
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Invert</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={colorAdjustments.grayscale}
                    onChange={(e) =>
                      setColorAdjustments((prev) => ({
                        ...prev,
                        grayscale: e.target.checked,
                      }))
                    }
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Grayscale</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={colorAdjustments.sepia}
                    onChange={(e) =>
                      setColorAdjustments((prev) => ({
                        ...prev,
                        sepia: e.target.checked,
                      }))
                    }
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Sepia</span>
                </label>
              </div>

              {/* Color Presets */}
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-600">Presets:</span>
                <button
                  onClick={() =>
                    setColorAdjustments({
                      brightness: 110,
                      contrast: 120,
                      saturation: 130,
                      hue: 0,
                      invert: false,
                      grayscale: false,
                      sepia: false,
                      temperature: 10,
                      tint: 5,
                      gamma: 1.1,
                      vibrance: 20,
                      exposure: 10,
                      shadows: 15,
                      highlights: -10,
                      blur: 0,
                      sharpen: 0,
                      opacity: 100,
                    })
                  }
                  className="px-2 py-1 text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 rounded transition-colors"
                >
                  Vivid
                </button>
                <button
                  onClick={() =>
                    setColorAdjustments({
                      brightness: 95,
                      contrast: 110,
                      saturation: 80,
                      hue: 0,
                      invert: false,
                      grayscale: false,
                      sepia: true,
                      temperature: 20,
                      tint: 10,
                      gamma: 1.2,
                      vibrance: -10,
                      exposure: 5,
                      shadows: 20,
                      highlights: -15,
                      blur: 0,
                      sharpen: 0,
                      opacity: 100,
                    })
                  }
                  className="px-2 py-1 text-xs bg-amber-100 hover:bg-amber-200 text-amber-700 rounded transition-colors"
                >
                  Vintage
                </button>
                <button
                  onClick={() =>
                    setColorAdjustments({
                      brightness: 105,
                      contrast: 130,
                      saturation: 0,
                      hue: 0,
                      invert: false,
                      grayscale: true,
                      sepia: false,
                      temperature: 0,
                      tint: 0,
                      gamma: 1.1,
                      vibrance: 0,
                      exposure: 0,
                      shadows: 10,
                      highlights: -5,
                      blur: 0,
                      sharpen: 10,
                      opacity: 100,
                    })
                  }
                  className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded transition-colors"
                >
                  B&W
                </button>
                <button
                  onClick={() =>
                    setColorAdjustments({
                      brightness: 90,
                      contrast: 140,
                      saturation: 120,
                      hue: 0,
                      invert: false,
                      grayscale: false,
                      sepia: false,
                      temperature: -20,
                      tint: -10,
                      gamma: 0.9,
                      vibrance: 30,
                      exposure: -5,
                      shadows: 25,
                      highlights: -20,
                      blur: 0,
                      sharpen: 5,
                      opacity: 100,
                    })
                  }
                  className="px-2 py-1 text-xs bg-indigo-100 hover:bg-indigo-200 text-indigo-700 rounded transition-colors"
                >
                  Dramatic
                </button>
              </div>

              <button
                onClick={() =>
                  setColorAdjustments({
                    brightness: 100,
                    contrast: 100,
                    saturation: 100,
                    hue: 0,
                    invert: false,
                    grayscale: false,
                    sepia: false,
                    temperature: 0,
                    tint: 0,
                    gamma: 1,
                    vibrance: 0,
                    exposure: 0,
                    shadows: 0,
                    highlights: 0,
                    blur: 0,
                    sharpen: 0,
                    opacity: 100,
                  })
                }
                className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded transition-colors"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PDF Content */}
      <div
        ref={viewerRef}
        className="flex-1 overflow-auto p-4"
        style={{
          cursor: uiState.activeTool === "hand" ? (touchState.isDragging ? "grabbing" : "grab") : "default",
          touchAction: "pan-y pinch-zoom", // Allow vertical scrolling and pinch zoom, but handle horizontal ourselves
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        {/* Loading State */}
        {isLoadingPDF && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading PDF...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {loadingError && !isLoadingPDF && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center max-w-md">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <div className="text-red-600 mb-2">
                  <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-red-800 mb-2">Failed to Load PDF</h3>
                <p className="text-red-700 text-sm mb-4">{loadingError}</p>
                <button
                  onClick={() => loadPDFDocument()}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        )}

        {/* PDF Content */}
        {!isLoadingPDF && !loadingError && pdfDoc && (
          <div className="flex justify-center">
            <div
              className={`relative transition-all duration-300 ease-out ${
                isTransitioning ? "transform scale-95 opacity-80" : "transform scale-100 opacity-100"
              }`}
              style={{
                transform: touchState.isDragging
                  ? `translateX(${(touchState.currentX - touchState.startX) * 0.2}px) scale(${
                      1 - Math.abs(touchState.currentX - touchState.startX) * 0.0002
                    })`
                  : isTransitioning
                    ? "scale(0.98) translateY(-5px)"
                    : "scale(1) translateY(0px)",
                transition: touchState.isDragging ? "none" : "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                filter:
                  touchState.isDragging && Math.abs(touchState.currentX - touchState.startX) > 50
                    ? `brightness(${100 - Math.abs(touchState.currentX - touchState.startX) * 0.1}%)`
                    : "brightness(100%)",
              }}
            >
              <canvas
                ref={canvasRef}
                onClick={handleCanvasClick}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.dataTransfer.dropEffect = "copy";
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  const files = Array.from(e.dataTransfer.files);
                  const imageFile = files.find((file) => file.type.startsWith("image/"));
                  if (imageFile) {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    const mockEvent = {
                      target: { files: [imageFile] },
                    } as any;
                    handleImageFileSelect(mockEvent, x, y);
                  }
                }}
                className="pdf-page shadow-lg"
                style={{
                  maxWidth: "100%",
                  height: "auto",
                  cursor:
                    uiState.activeTool === "select"
                      ? "default"
                      : uiState.activeTool === "text"
                        ? "text"
                        : isAddingImage
                          ? "copy"
                          : "crosshair",
                  filter: [
                    `brightness(${colorAdjustments.brightness}%)`,
                    `contrast(${colorAdjustments.contrast}%)`,
                    `saturate(${colorAdjustments.saturation}%)`,
                    `hue-rotate(${colorAdjustments.hue}deg)`,
                    colorAdjustments.blur > 0 ? `blur(${colorAdjustments.blur}px)` : "",
                    colorAdjustments.invert ? "invert(1)" : "",
                    colorAdjustments.grayscale ? "grayscale(1)" : "",
                    colorAdjustments.sepia ? "sepia(1)" : "",
                  ]
                    .filter(Boolean)
                    .join(" "),
                  opacity: colorAdjustments.opacity / 100,
                }}
              />

              {/* Annotations Overlay */}
              <div className="absolute inset-0 pointer-events-none">
                {document.annotations
                  .filter((ann) => ann.pageNumber === document.currentPage)
                  .map((annotation) => (
                    <div
                      key={annotation.id}
                      className={`absolute pointer-events-auto ${
                        annotation.type === "highlight"
                          ? "annotation-highlight"
                          : annotation.type === "note"
                            ? "annotation-note"
                            : "annotation-drawing"
                      }`}
                      style={{
                        left: `${annotation.x}px`,
                        top: `${annotation.y}px`,
                        width: `${annotation.width}px`,
                        height: `${annotation.height}px`,
                        backgroundColor: annotation.color || "#fbbf24",
                      }}
                      title={annotation.content}
                    >
                      {annotation.type === "note" && annotation.content && (
                        <div className="absolute top-full left-0 mt-1 p-2 bg-yellow-100 border border-yellow-300 rounded shadow-lg text-sm max-w-xs z-10 opacity-0 hover:opacity-100 transition-opacity">
                          {annotation.content}
                        </div>
                      )}
                    </div>
                  ))}
              </div>

              {/* Text elements overlay */}
              <div className="absolute inset-0 pointer-events-none">
                {textElements
                  .filter((element) => element.pageNumber === document.currentPage)
                  .map((element) => (
                    <div
                      key={element.id}
                      className={`absolute pointer-events-auto cursor-text border-2 ${
                        selectedTextElement === element.id
                          ? "border-blue-500"
                          : "border-transparent hover:border-gray-300"
                      }`}
                      style={{
                        left: `${element.x}px`,
                        top: `${element.y}px`,
                        width: `${element.width}px`,
                        height: `${element.height}px`,
                        fontSize: `${element.fontSize}px`,
                        fontFamily: element.fontFamily,
                        fontWeight: element.fontWeight,
                        fontStyle: element.fontStyle,
                        textDecoration: element.textDecoration,
                        textAlign: element.textAlign,
                        color: element.color,
                        display: "flex",
                        alignItems: "center",
                        padding: "2px",
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedTextElement(element.id);
                        setShowTextEditor(true);
                      }}
                    >
                      {element.isEditing ? (
                        <input
                          type="text"
                          value={element.content}
                          onChange={(e) => {
                            setTextElements((prev) =>
                              prev.map((el) => (el.id === element.id ? { ...el, content: e.target.value } : el)),
                            );
                          }}
                          onBlur={() => {
                            setTextElements((prev) =>
                              prev.map((el) => (el.id === element.id ? { ...el, isEditing: false } : el)),
                            );
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              setTextElements((prev) =>
                                prev.map((el) => (el.id === element.id ? { ...el, isEditing: false } : el)),
                              );
                            }
                          }}
                          className="w-full h-full bg-transparent border-none outline-none"
                          autoFocus
                        />
                      ) : (
                        <span
                          onDoubleClick={() => {
                            setTextElements((prev) =>
                              prev.map((el) => (el.id === element.id ? { ...el, isEditing: true } : el)),
                            );
                          }}
                        >
                          {element.content}
                        </span>
                      )}
                    </div>
                  ))}
              </div>

              {/* Image elements overlay */}
              <div className="absolute inset-0 pointer-events-none">
                {imageElements
                  .filter((element) => element.pageNumber === document.currentPage)
                  .map((element) => (
                    <div
                      key={element.id}
                      className={`absolute pointer-events-auto cursor-move border-2 group ${
                        selectedImageElement === element.id
                          ? "border-blue-500"
                          : "border-transparent hover:border-gray-300"
                      }`}
                      style={{
                        left: `${element.x}px`,
                        top: `${element.y}px`,
                        width: `${element.width}px`,
                        height: `${element.height}px`,
                        transform: `rotate(${element.rotation || 0}deg) scaleX(${element.flipX ? -1 : 1}) scaleY(${
                          element.flipY ? -1 : 1
                        })`,
                        opacity: element.opacity || 1,
                        zIndex: selectedImageElement === element.id ? 10 : 1,
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedImageElement(element.id);
                      }}
                      onDoubleClick={() => {
                        setShowImageEditor(true);
                        setSelectedImageElement(element.id);
                      }}
                    >
                      <img
                        src={element.src}
                        alt="PDF Image"
                        className="w-full h-full object-contain"
                        style={{
                          borderWidth: `${element.borderWidth || 0}px`,
                          borderColor: element.borderColor || "#000000",
                          borderStyle: element.borderStyle || "solid",
                          filter: [
                            element.shadow ? "drop-shadow(2px 2px 4px rgba(0,0,0,0.3))" : "",
                            `brightness(${element.brightness || 1})`,
                            `contrast(${element.contrast || 1})`,
                            `saturate(${element.saturation || 1})`,
                            `hue-rotate(${element.hue || 0}deg)`,
                            `blur(${element.blur || 0}px)`,
                            `sepia(${element.sepia || 0})`,
                            `grayscale(${element.grayscale || 0})`,
                            element.invert ? "invert(1)" : "",
                          ]
                            .filter(Boolean)
                            .join(" "),
                          borderRadius: `${element.borderRadius || 0}px`,
                          backgroundColor:
                            element.backgroundColor !== "transparent" ? element.backgroundColor : "transparent",
                        }}
                        draggable={false}
                      />

                      {/* Quick action buttons on hover */}
                      {selectedImageElement === element.id && (
                        <div className="absolute -top-8 left-0 flex space-x-1 bg-white border border-gray-300 rounded shadow-lg p-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowImageEditor(true);
                            }}
                            className="p-1 hover:bg-gray-100 rounded"
                            title="Edit Image"
                          >
                            <AdjustmentsHorizontalIcon className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setImageElements((prev) =>
                                prev.map((el) =>
                                  el.id === element.id
                                    ? {
                                        ...el,
                                        rotation: (el.rotation || 0) + 90,
                                      }
                                    : el,
                                ),
                              );
                            }}
                            className="p-1 hover:bg-gray-100 rounded"
                            title="Rotate 90°"
                          >
                            <ArrowPathIcon className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setImageElements((prev) => prev.filter((el) => el.id !== element.id));
                              setSelectedImageElement(null);
                              toast.success("Image deleted");
                            }}
                            className="p-1 hover:bg-red-100 text-red-600 rounded"
                            title="Delete Image"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                      )}

                      {/* Resize handles */}
                      {selectedImageElement === element.id && (
                        <>
                          {["nw", "ne", "sw", "se"].map((handle) => (
                            <div
                              key={handle}
                              className="absolute w-2 h-2 bg-blue-500 border border-white cursor-pointer"
                              style={{
                                top: handle.includes("n") ? -4 : "auto",
                                bottom: handle.includes("s") ? -4 : "auto",
                                left: handle.includes("w") ? -4 : "auto",
                                right: handle.includes("e") ? -4 : "auto",
                                cursor: `${handle}-resize`,
                              }}
                            />
                          ))}
                        </>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Status Bar */}
      <div className="bg-gradient-to-r from-gray-50 to-white border-t border-gray-200 px-4 py-3 flex items-center justify-between text-sm shadow-sm">
        <div className="flex items-center space-x-6">
          {/* Page Info */}
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="font-medium text-gray-900">
              Page {document.currentPage} of {document.pages.length}
            </span>
          </div>

          {/* Zoom Info */}
          <div className="flex items-center space-x-2 px-3 py-1 bg-blue-50 rounded-full border border-blue-200">
            <MagnifyingGlassIcon className="w-4 h-4 text-blue-600" />
            <span className="font-medium text-blue-700">{Math.round(document.zoom * 100)}%</span>
          </div>

          {/* Active Tool */}
          <div className="flex items-center space-x-2 px-3 py-1 bg-green-50 rounded-full border border-green-200">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="font-medium text-green-700 capitalize">
              {uiState.activeTool === "select"
                ? "Selection"
                : uiState.activeTool === "hand"
                  ? "Hand Tool"
                  : uiState.activeTool === "text"
                    ? "Text Editor"
                    : uiState.activeTool === "highlight"
                      ? "Highlighter"
                      : uiState.activeTool === "note"
                        ? "Comment"
                        : uiState.activeTool === "drawing"
                          ? "Drawing"
                          : uiState.activeTool === "signature"
                            ? "Signature"
                            : uiState.activeTool}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-6">
          {/* Document Stats */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <ChatBubbleLeftRightIcon className="w-4 h-4 text-amber-500" />
              <span className="text-gray-600">
                <span className="font-medium text-gray-900">{document.annotations.length}</span> annotations
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <PencilIcon className="w-4 h-4 text-purple-500" />
              <span className="text-gray-600">
                <span className="font-medium text-gray-900">{textElements.length}</span> text elements
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <PhotoIcon className="w-4 h-4 text-indigo-500" />
              <span className="text-gray-600">
                <span className="font-medium text-gray-900">{imageElements.length}</span> images
              </span>
            </div>
          </div>

          {/* Last Modified */}
          <div className="flex items-center space-x-2 text-gray-500">
            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
            <span className="text-xs">Modified {document.modifiedAt.toLocaleTimeString()}</span>
          </div>
        </div>
      </div>

      {/* Modals and Comment System */}
      {showPrintModal && (
        <PrintModal
          isOpen={showPrintModal}
          onClose={() => setShowPrintModal(false)}
          onPrint={handlePrintDocument}
          documentName={document?.name || "Document"}
          totalPages={totalPages}
        />
      )}

      {showShareModal && (
        <ShareModal
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
          documentName={document?.name || "Document"}
          documentId={document?.id || "doc-1"}
        />
      )}

      {showComments && (
        <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-xl z-50 border-l border-neutral-200">
          <CommentSystem
            comments={comments}
            currentUser={{
              id: "user-1",
              name: "Current User",
              email: "user@example.com",
            }}
            onAddComment={handleAddComment}
            onUpdateComment={handleUpdateComment}
            onDeleteComment={handleDeleteComment}
            onReplyToComment={handleReplyToComment}
            onUpdateReply={handleUpdateReply}
            onDeleteReply={handleDeleteReply}
            onLikeComment={handleLikeComment}
            onLikeReply={handleLikeReply}
            onResolveComment={handleResolveComment}
            onChangeCommentStatus={handleChangeCommentStatus}
            selectedCommentId={selectedCommentId}
            onSelectComment={handleSelectComment}
          />
        </div>
      )}

      {/* Text Editor */}
      {showTextEditor && selectedTextElement && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold">Text Editor</h3>
              <button
                onClick={() => {
                  setShowTextEditor(false);
                  setSelectedTextElement(null);
                }}
                className="p-2 hover:bg-gray-100 rounded"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4">
              <TextEditor
                initialText={textElements.find((el) => el.id === selectedTextElement)?.content || ""}
                onSave={(text: string, formatting: any) => {
                  if (selectedTextElement) {
                    setTextElements((prev) =>
                      prev.map((el) =>
                        el.id === selectedTextElement
                          ? {
                              ...el,
                              content: text,
                              fontSize: formatting.fontSize,
                              fontFamily: formatting.fontFamily,
                              fontWeight: formatting.fontWeight,
                              fontStyle: formatting.fontStyle,
                              textDecoration: formatting.textDecoration,
                              textAlign: formatting.textAlign,
                              color: formatting.color,
                            }
                          : el,
                      ),
                    );
                    setShowTextEditor(false);
                    setSelectedTextElement(null);
                    toast.success("Text updated successfully");
                  }
                }}
                onCancel={() => {
                  setShowTextEditor(false);
                  setSelectedTextElement(null);
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Export Modal */}
      <ExportModal
        isVisible={showExportModal}
        onClose={() => setShowExportModal(false)}
        onExport={handleExportDocument}
        documentName={document?.name || "Document"}
        totalPages={totalPages}
        currentPage={document?.currentPage || 1}
      />

      {/* Document Protection */}
      <DocumentProtection
        isVisible={showDocumentProtection}
        onClose={() => setShowDocumentProtection(false)}
        onApplyProtection={(settings) => {
          console.log("Applying protection with settings:", settings);
          // TODO: Implement actual protection functionality
        }}
      />

      {/* File Manager */}
      <FileManager
        isVisible={showFileManager}
        onClose={() => setShowFileManager(false)}
        onOpenFile={(file) => {
          console.log("Opening file:", file);
          // TODO: Implement file opening functionality
        }}
        onCreateFolder={(name, parentId) => {
          console.log("Creating folder:", name, parentId);
          // TODO: Implement folder creation
        }}
        onUploadFiles={(files, parentId) => {
          console.log("Uploading files:", files, parentId);
          // TODO: Implement file upload
        }}
        onDeleteItems={(itemIds) => {
          console.log("Deleting items:", itemIds);
          // TODO: Implement item deletion
        }}
        onRenameItem={(itemId, newName) => {
          console.log("Renaming item:", itemId, newName);
          // TODO: Implement item renaming
        }}
        onMoveItems={(itemIds, targetFolderId) => {
          console.log("Moving items:", itemIds, targetFolderId);
          // TODO: Implement item moving
        }}
        onToggleFavorite={(itemId) => {
          console.log("Toggling favorite:", itemId);
          // TODO: Implement favorite toggle
        }}
        onAddTags={(itemId, tags) => {
          console.log("Adding tags:", itemId, tags);
          // TODO: Implement tag addition
        }}
        files={[]}
        currentFolderId={undefined}
      />

      {/* Image Editor */}
      <ImageEditor
        isVisible={showImageEditor}
        onClose={() => setShowImageEditor(false)}
        onAddImage={(element) => {
          const newElement = {
            ...element,
            id: `image-${Date.now()}`,
            pageNumber: document.currentPage,
          };
          setImageElements((prev) => [...prev, newElement]);
          toast.success("Image added successfully");
        }}
        onUpdateImage={(id, updates) => {
          setImageElements((prev) => prev.map((el) => (el.id === id ? { ...el, ...updates } : el)));
        }}
        onDeleteImage={(id) => {
          setImageElements((prev) => prev.filter((el) => el.id !== id));
          toast.success("Image deleted");
        }}
        imageElements={imageElements.filter((el) => el.pageNumber === document.currentPage)}
        canvasWidth={800}
        canvasHeight={600}
      />
    </div>
  );
}
