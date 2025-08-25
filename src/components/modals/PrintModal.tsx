"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import { Modal, Card, Switch, Slider } from "@/components/ui";
import {
  PrinterIcon,
  DocumentIcon,
  Cog6ToothIcon,
  PhotoIcon,
  DocumentTextIcon,
  RectangleStackIcon,
  ScaleIcon,
  AdjustmentsHorizontalIcon,
} from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";

interface PrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentName: string;
  totalPages: number;
  onPrint: (settings: PrintSettings) => Promise<void> | void;
}

interface ValidationError {
  field: keyof PrintSettings;
  message: string;
}

type PrintModalTab = "basic" | "layout" | "quality" | "advanced";

type PrintError = {
  type: "validation" | "print" | "network";
  message: string;
  field?: keyof PrintSettings;
};

type PageRange = "all" | "current" | "custom";
type Orientation = "portrait" | "landscape";
type PaperSize = "A4" | "A3" | "Letter" | "Legal" | "Tabloid";
type ScalingMode = "fit" | "actual" | "custom";
type MarginSize = "none" | "minimum" | "normal" | "maximum";
type PrintQuality = "draft" | "normal" | "high" | "maximum";
type ColorMode = "color" | "grayscale" | "blackwhite";
type DuplexMode = "none" | "long" | "short";

interface PrintSettings {
  readonly pageRange: PageRange;
  readonly customPages: string;
  readonly copies: number;
  readonly orientation: Orientation;
  readonly paperSize: PaperSize;
  readonly scaling: ScalingMode;
  readonly customScale: number;
  readonly margins: MarginSize;
  readonly quality: PrintQuality;
  readonly colorMode: ColorMode;
  readonly duplex: DuplexMode;
  readonly collate: boolean;
  readonly includeAnnotations: boolean;
  readonly includeComments: boolean;
  readonly watermark: boolean;
  readonly watermarkText: string;
  readonly headers: boolean;
  readonly footers: boolean;
  readonly pageNumbers: boolean;
}

interface PaperSizeInfo {
  readonly width: number;
  readonly height: number;
  readonly unit: "mm" | "in";
}

interface QualityInfo {
  readonly dpi: number;
  readonly description: string;
}

const paperSizes: Record<PaperSize, PaperSizeInfo> = {
  A4: { width: 210, height: 297, unit: "mm" },
  A3: { width: 297, height: 420, unit: "mm" },
  Letter: { width: 8.5, height: 11, unit: "in" },
  Legal: { width: 8.5, height: 14, unit: "in" },
  Tabloid: { width: 11, height: 17, unit: "in" },
} as const;

const qualitySettings: Record<PrintQuality, QualityInfo> = {
  draft: { dpi: 150, description: "Fast, lower quality" },
  normal: { dpi: 300, description: "Balanced quality and speed" },
  high: { dpi: 600, description: "High quality, slower" },
  maximum: { dpi: 1200, description: "Maximum quality, slowest" },
} as const;

// Constants for validation
const VALIDATION_RULES = {
  copies: { min: 1, max: 999 },
  scale: { min: 25, max: 400 },
  watermarkText: { maxLength: 100 },
} as const;

export default function PrintModal({ isOpen, onClose, documentName, totalPages, onPrint }: PrintModalProps) {
  const [settings, setSettings] = useState<PrintSettings>({
    pageRange: "all",
    customPages: "",
    copies: 1,
    orientation: "portrait",
    paperSize: "A4",
    scaling: "fit",
    customScale: 100,
    margins: "normal",
    quality: "normal",
    colorMode: "color",
    duplex: "none",
    collate: true,
    includeAnnotations: true,
    includeComments: false,
    watermark: false,
    watermarkText: "CONFIDENTIAL",
    headers: false,
    footers: false,
    pageNumbers: true,
  });

  const [activeTab, setActiveTab] = useState<PrintModalTab>("basic");
  const [previewMode, setPreviewMode] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingProgress, setLoadingProgress] = useState<number>(0);
  const [loadingMessage, setLoadingMessage] = useState<string>("");
  const [error, setError] = useState<PrintError | null>(null);
  const [validationErrors, setValidationErrors] = useState<Partial<Record<keyof PrintSettings, string>>>({});
  const modalRef = useRef<HTMLDivElement>(null);
  const firstFocusableRef = useRef<HTMLButtonElement>(null);
  const lastFocusableRef = useRef<HTMLButtonElement>(null);
  const previouslyFocusedElement = useRef<HTMLElement | null>(null);

  const handleSettingChange = <K extends keyof PrintSettings>(key: K, value: PrintSettings[K]): void => {
    setSettings((prev) => ({ ...prev, [key]: value }));

    // Clear validation error for this field when user makes changes
    if (validationErrors[key]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[key];
        return newErrors;
      });
    }
  };

  // Keyboard navigation handlers
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      const { key, target, shiftKey } = event;

      // Handle tab navigation within modal
      if (key === "Tab") {
        const focusableElements = modalRef.current?.querySelectorAll(
          'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"]):not([disabled])',
        );

        if (!focusableElements || focusableElements.length === 0) return;

        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

        if (shiftKey && target === firstElement) {
          event.preventDefault();
          lastElement.focus();
        } else if (!shiftKey && target === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }

      // Handle arrow key navigation for radio groups
      if ((key === "ArrowUp" || key === "ArrowDown") && (target as HTMLElement).getAttribute("role") === "radio") {
        event.preventDefault();
        const radioGroup = (target as HTMLElement).closest('[role="radiogroup"]');
        if (!radioGroup) return;

        const radios = Array.from(radioGroup.querySelectorAll('[role="radio"]')) as HTMLElement[];
        const currentIndex = radios.indexOf(target as HTMLElement);

        let nextIndex: number;
        if (key === "ArrowUp") {
          nextIndex = currentIndex > 0 ? currentIndex - 1 : radios.length - 1;
        } else {
          nextIndex = currentIndex < radios.length - 1 ? currentIndex + 1 : 0;
        }

        radios[nextIndex].focus();
        radios[nextIndex].click();
      }

      // Handle Enter and Space for button activation
      if ((key === "Enter" || key === " ") && (target as HTMLElement).tagName === "BUTTON") {
        event.preventDefault();
        (target as HTMLButtonElement).click();
      }

      // Handle Escape to close modal
      if (key === "Escape") {
        event.preventDefault();
        handleClose();
      }
    },
    [onClose],
  );

  // Focus management and trapping
  useEffect(() => {
    if (!isOpen) return;

    // Store the previously focused element
    previouslyFocusedElement.current = document.activeElement as HTMLElement;

    // Focus the first focusable element when modal opens
    const focusFirstElement = () => {
      const focusableElements = modalRef.current?.querySelectorAll(
        'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"]):not([disabled])',
      );

      if (focusableElements && focusableElements.length > 0) {
        const firstElement = focusableElements[0] as HTMLElement;
        firstElement.focus();
      }
    };

    // Small delay to ensure modal is rendered
    const timeoutId = setTimeout(focusFirstElement, 100);

    // Cleanup function to restore focus when modal closes
    return () => {
      clearTimeout(timeoutId);
      if (previouslyFocusedElement.current) {
        previouslyFocusedElement.current.focus();
      }
    };
  }, [isOpen]);

  // Enhanced focus trapping
  const trapFocus = useCallback((event: React.KeyboardEvent) => {
    if (event.key !== "Tab") return;

    const focusableElements = modalRef.current?.querySelectorAll(
      'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"]):not([disabled])',
    );

    if (!focusableElements || focusableElements.length === 0) return;

    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
    const activeElement = document.activeElement;

    if (event.shiftKey) {
      // Shift + Tab: moving backwards
      if (activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      }
    } else {
      // Tab: moving forwards
      if (activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }
  }, []);

  // Handle focus restoration on close
  const handleClose = useCallback(() => {
    if (previouslyFocusedElement.current) {
      previouslyFocusedElement.current.focus();
    }
    onClose();
  }, [onClose]);

  const validatePageRange = (pages: string): boolean => {
    if (!pages.trim()) return false;

    // Allow formats like: "1", "1-5", "1,3,5", "1-3,5,7-9"
    const pageRangeRegex = /^\d+(-\d+)?(,\s*\d+(-\d+)?)*$/;
    if (!pageRangeRegex.test(pages.trim())) return false;

    const ranges = pages.split(",");
    for (const range of ranges) {
      const trimmed = range.trim();
      if (trimmed.includes("-")) {
        const [start, end] = trimmed.split("-").map((n) => parseInt(n.trim()));
        if (isNaN(start) || isNaN(end) || start < 1 || end > totalPages || start > end) {
          return false;
        }
      } else {
        const page = parseInt(trimmed);
        if (isNaN(page) || page < 1 || page > totalPages) {
          return false;
        }
      }
    }
    return true;
  };

  const getPageCount = (): number => {
    switch (settings.pageRange) {
      case "all":
        return totalPages;
      case "current":
        return 1;
      case "custom": {
        if (!validatePageRange(settings.customPages)) return 0;

        const ranges = settings.customPages.split(",");
        let count = 0;

        for (const range of ranges) {
          const trimmed = range.trim();
          if (trimmed.includes("-")) {
            const [start, end] = trimmed.split("-").map((n) => parseInt(n.trim()));
            count += Math.max(0, end - start + 1);
          } else {
            count += 1;
          }
        }

        return count;
      }
      default:
        return 0;
    }
  };

  const getTotalSheets = (): number => {
    const pageCount = getPageCount();
    const pagesPerSheet = settings.duplex === "none" ? 1 : 2;
    const sheets = Math.ceil(pageCount / pagesPerSheet);
    return sheets * settings.copies;
  };

  const handlePrint = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setLoadingProgress(0);
      setLoadingMessage("Preparing print job...");

      // Validate settings before printing
      const errors = validatePrintSettings(settings);
      if (Object.keys(errors).length > 0) {
        setValidationErrors(errors);
        return;
      }

      if (settings.pageRange === "custom" && !validatePageRange(settings.customPages)) {
        setError({ type: "validation", message: "Invalid page range. Please check your input.", field: "customPages" });
        return;
      }

      // Simulate progress updates
      const progressSteps = [
        { progress: 20, message: "Validating print settings..." },
        { progress: 40, message: "Processing document..." },
        { progress: 60, message: "Applying print options..." },
        { progress: 80, message: "Sending to printer..." },
        { progress: 100, message: "Print job completed!" },
      ];

      for (const step of progressSteps) {
        setLoadingProgress(step.progress);
        setLoadingMessage(step.message);
        await new Promise((resolve) => setTimeout(resolve, 300)); // Simulate processing time
      }

      await onPrint(settings);
      onClose();
    } catch (err) {
      setError({ type: "print", message: err instanceof Error ? err.message : "An error occurred while printing" });
    } finally {
      setIsLoading(false);
      setLoadingProgress(0);
      setLoadingMessage("");
    }
  };

  const validatePrintSettings = (settings: PrintSettings): Record<string, string> => {
    const errors: Record<string, string> = {};

    if (settings.pageRange === "custom" && !settings.customPages.trim()) {
      errors.customPages = "Please specify a page range";
    }

    if (settings.copies < 1 || settings.copies > 999) {
      errors.copies = "Number of copies must be between 1 and 999";
    }

    if (settings.customScale < 25 || settings.customScale > 400) {
      errors.customScale = "Scale must be between 25% and 400%";
    }

    return errors;
  };

  const tabs = [
    { id: "basic", label: "Basic", icon: DocumentIcon },
    { id: "layout", label: "Layout", icon: RectangleStackIcon },
    { id: "quality", label: "Quality", icon: PhotoIcon },
    { id: "advanced", label: "Advanced", icon: Cog6ToothIcon },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Print Settings"
      description={`Configure print settings for "${documentName}"`}
      size="xl"
    >
      <div
        ref={modalRef}
        onKeyDown={(e) => {
          handleKeyDown(e);
          trapFocus(e);
        }}
        className="focus:outline-none space-y-6 relative"
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="print-modal-title"
        aria-describedby="print-modal-description"
      >
        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center rounded-lg">
            <div className="bg-white p-6 rounded-lg shadow-lg border max-w-sm w-full mx-4">
              <div className="text-center space-y-4">
                <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Printing Document</h3>
                  <p className="text-sm text-gray-600 mb-4">{loadingMessage}</p>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
                      style={{ width: `${loadingProgress}%` }}
                      role="progressbar"
                      aria-valuenow={loadingProgress}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label={`Print progress: ${loadingProgress}%`}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">{loadingProgress}% complete</p>
                </div>
              </div>
            </div>
          </div>
        )}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4" role="alert">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" aria-hidden="true" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Print Error</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error.message}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="border-b border-neutral-200">
          <nav className="flex space-x-8" role="tablist" aria-label="Print settings tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as PrintModalTab)}
                  onKeyDown={(e) => {
                    if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
                      e.preventDefault();
                      const tabs = ["basic", "layout", "quality", "advanced"] as PrintModalTab[];
                      const currentIndex = tabs.indexOf(activeTab);
                      let nextIndex: number;

                      if (e.key === "ArrowLeft") {
                        nextIndex = currentIndex > 0 ? currentIndex - 1 : tabs.length - 1;
                      } else {
                        nextIndex = currentIndex < tabs.length - 1 ? currentIndex + 1 : 0;
                      }

                      setActiveTab(tabs[nextIndex]);
                      // Focus the new tab
                      setTimeout(() => {
                        const newTab = document.querySelector(
                          `[aria-controls="${tabs[nextIndex]}-panel"]`,
                        ) as HTMLElement;
                        newTab?.focus();
                      }, 0);
                    }
                  }}
                  role="tab"
                  aria-selected={activeTab === tab.id}
                  aria-controls={`${tab.id}-panel`}
                  tabIndex={activeTab === tab.id ? 0 : -1}
                  className={cn(
                    "flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2",
                    activeTab === tab.id
                      ? "border-primary-500 text-primary-600"
                      : "border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300",
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="min-h-[400px]" role="tabpanel" id={`${activeTab}-panel`} aria-labelledby={`${activeTab}-tab`}>
          {activeTab === "basic" && (
            <div className="space-y-6">
              <Card padding="lg">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Page Selection</h3>

                  <div className="space-y-3">
                    <label className="flex items-center space-x-3">
                      <input
                        type="radio"
                        name="pageRange"
                        value="all"
                        checked={settings.pageRange === "all"}
                        onChange={(e) => handleSettingChange("pageRange", e.target.value as "all")}
                        className="form-radio"
                      />
                      <span>All pages ({totalPages} pages)</span>
                    </label>

                    <label className="flex items-center space-x-3">
                      <input
                        type="radio"
                        name="pageRange"
                        value="current"
                        checked={settings.pageRange === "current"}
                        onChange={(e) => handleSettingChange("pageRange", e.target.value as "current")}
                        className="form-radio"
                      />
                      <span>Current page</span>
                    </label>

                    <label className="flex items-center space-x-3">
                      <input
                        type="radio"
                        name="pageRange"
                        value="custom"
                        checked={settings.pageRange === "custom"}
                        onChange={(e) => handleSettingChange("pageRange", e.target.value as "custom")}
                        className="form-radio"
                      />
                      <span>Custom range</span>
                    </label>

                    {settings.pageRange === "custom" && (
                      <div className="ml-6">
                        <input
                          type="text"
                          value={settings.customPages}
                          onChange={(e) => handleSettingChange("customPages", e.target.value)}
                          placeholder="e.g., 1-3, 5, 8-10"
                          className={cn(
                            "input",
                            settings.customPages && !validatePageRange(settings.customPages)
                              ? "border-red-300 focus:border-red-500"
                              : "",
                          )}
                        />
                        <p className="text-sm text-neutral-500 mt-1">
                          Enter page numbers and ranges (e.g., 1-3, 5, 8-10)
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </Card>

              <Card padding="lg">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Copies & Collation</h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">Number of copies</label>
                      <input
                        type="number"
                        min="1"
                        max="999"
                        value={settings.copies}
                        onChange={(e) => handleSettingChange("copies", parseInt(e.target.value) || 1)}
                        className="input"
                      />
                    </div>

                    <div className="flex items-end">
                      <Switch
                        checked={settings.collate}
                        onChange={(checked) => handleSettingChange("collate", checked)}
                        label="Collate copies"
                        description="Print complete sets"
                      />
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {activeTab === "layout" && (
            <div className="space-y-6">
              <Card padding="lg">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Paper & Orientation</h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">Paper size</label>
                      <select
                        value={settings.paperSize}
                        onChange={(e) => handleSettingChange("paperSize", e.target.value as PrintSettings["paperSize"])}
                        className="input"
                      >
                        {Object.entries(paperSizes).map(([size, dimensions]) => (
                          <option key={size} value={size}>
                            {size} ({dimensions.width} × {dimensions.height} {dimensions.unit})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">Orientation</label>
                      <select
                        value={settings.orientation}
                        onChange={(e) => handleSettingChange("orientation", e.target.value as "portrait" | "landscape")}
                        className="input"
                      >
                        <option value="portrait">Portrait</option>
                        <option value="landscape">Landscape</option>
                      </select>
                    </div>
                  </div>
                </div>
              </Card>

              <Card padding="lg">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Scaling & Margins</h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">Scaling</label>
                      <select
                        value={settings.scaling}
                        onChange={(e) => handleSettingChange("scaling", e.target.value as PrintSettings["scaling"])}
                        className="input"
                      >
                        <option value="fit">Fit to page</option>
                        <option value="actual">Actual size</option>
                        <option value="custom">Custom scale</option>
                      </select>

                      {settings.scaling === "custom" && (
                        <div className="mt-3">
                          <Slider
                            value={settings.customScale}
                            onChange={(value) => handleSettingChange("customScale", value)}
                            min={25}
                            max={400}
                            step={5}
                            label="Custom scale"
                            showValue
                          />
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">Margins</label>
                      <select
                        value={settings.margins}
                        onChange={(e) => handleSettingChange("margins", e.target.value as PrintSettings["margins"])}
                        className="input"
                      >
                        <option value="none">None</option>
                        <option value="minimum">Minimum</option>
                        <option value="normal">Normal</option>
                        <option value="maximum">Maximum</option>
                      </select>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {activeTab === "quality" && (
            <div className="space-y-6">
              <Card padding="lg">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Print Quality</h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">Quality level</label>
                      <select
                        value={settings.quality}
                        onChange={(e) => handleSettingChange("quality", e.target.value as PrintSettings["quality"])}
                        className="input"
                      >
                        {Object.entries(qualitySettings).map(([quality, config]) => (
                          <option key={quality} value={quality}>
                            {quality.charAt(0).toUpperCase() + quality.slice(1)} ({config.dpi} DPI) -{" "}
                            {config.description}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">Color mode</label>
                      <select
                        value={settings.colorMode}
                        onChange={(e) => handleSettingChange("colorMode", e.target.value as PrintSettings["colorMode"])}
                        className="input"
                      >
                        <option value="color">Color</option>
                        <option value="grayscale">Grayscale</option>
                        <option value="blackwhite">Black & White</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">Duplex printing</label>
                      <select
                        value={settings.duplex}
                        onChange={(e) => handleSettingChange("duplex", e.target.value as PrintSettings["duplex"])}
                        className="input"
                      >
                        <option value="none">Single-sided</option>
                        <option value="long">Double-sided (flip on long edge)</option>
                        <option value="short">Double-sided (flip on short edge)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {activeTab === "advanced" && (
            <div className="space-y-6">
              <Card padding="lg">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Content Options</h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <Switch
                        checked={settings.includeAnnotations}
                        onChange={(checked) => handleSettingChange("includeAnnotations", checked)}
                        label="Include annotations"
                        description="Print highlights and markups"
                      />

                      <Switch
                        checked={settings.includeComments}
                        onChange={(checked) => handleSettingChange("includeComments", checked)}
                        label="Include comments"
                        description="Print comment bubbles"
                      />

                      <Switch
                        checked={settings.pageNumbers}
                        onChange={(checked) => handleSettingChange("pageNumbers", checked)}
                        label="Page numbers"
                        description="Add page numbers to print"
                      />
                    </div>

                    <div className="space-y-3">
                      <Switch
                        checked={settings.headers}
                        onChange={(checked) => handleSettingChange("headers", checked)}
                        label="Headers"
                        description="Include document title in header"
                      />

                      <Switch
                        checked={settings.footers}
                        onChange={(checked) => handleSettingChange("footers", checked)}
                        label="Footers"
                        description="Include date and filename"
                      />

                      <Switch
                        checked={settings.watermark}
                        onChange={(checked) => handleSettingChange("watermark", checked)}
                        label="Watermark"
                        description="Add watermark to pages"
                      />
                    </div>
                  </div>

                  {settings.watermark && (
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-neutral-700 mb-2">Watermark text</label>
                      <input
                        type="text"
                        value={settings.watermarkText}
                        onChange={(e) => handleSettingChange("watermarkText", e.target.value)}
                        placeholder="Enter watermark text"
                        className="input"
                      />
                    </div>
                  )}
                </div>
              </Card>
            </div>
          )}
        </div>

        {/* Print Summary */}
        <Card padding="lg" variant="filled">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-neutral-900">Print Summary</h3>
              <p className="text-sm text-neutral-600">
                {getPageCount()} pages × {settings.copies} copies = {getTotalSheets()} sheets
              </p>
              <p className="text-xs text-neutral-500">
                Quality: {qualitySettings[settings.quality].dpi} DPI • Color: {settings.colorMode} • Paper:{" "}
                {settings.paperSize}
              </p>
            </div>

            <div className="text-right">
              <div className="text-2xl font-bold text-primary-600">{getTotalSheets()}</div>
              <div className="text-sm text-neutral-500">sheets</div>
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-neutral-200">
          <button
            ref={firstFocusableRef}
            onClick={handleClose}
            className="btn btn-ghost focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            aria-label="Cancel printing"
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleClose();
              }
            }}
          >
            Cancel
          </button>
          <button
            ref={lastFocusableRef}
            onClick={handlePrint}
            className="btn btn-primary focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[140px]"
            disabled={isLoading || (settings.pageRange === "custom" && !validatePageRange(settings.customPages))}
            aria-label={isLoading ? "Printing document..." : "Print document"}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                if (!isLoading && !(settings.pageRange === "custom" && !validatePageRange(settings.customPages))) {
                  handlePrint();
                }
              }
            }}
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                Printing...
              </>
            ) : (
              <>
                <PrinterIcon className="w-4 h-4 mr-2" aria-hidden="true" />
                Print Document
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
}
