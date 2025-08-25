// TypeScript interfaces for Stirling-PDF API

export interface StirlingPDFResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PDFInfo {
  title?: string;
  author?: string;
  subject?: string;
  keywords?: string;
  creator?: string;
  producer?: string;
  creationDate?: string;
  modificationDate?: string;
  pageCount: number;
  fileSize: number;
  version?: string;
  encrypted: boolean;
  permissions?: string[];
}

export interface SplitOptions {
  splitType: "pages" | "size" | "chapters";
  pages?: number[];
  pageRanges?: string;
  splitAfterPages?: number;
  maxFileSize?: number;
  chapterLevel?: number;
}

export interface MergeOptions {
  sortType?: "name" | "date" | "size";
  sortOrder?: "asc" | "desc";
}

export interface CompressOptions {
  optimizeLevel: 1 | 2 | 3 | 4;
  imageQuality?: number;
  imageScale?: number;
  removeMetadata?: boolean;
}

export interface WatermarkOptions {
  text?: string;
  image?: File;
  position: "center" | "top-left" | "top-right" | "bottom-left" | "bottom-right";
  opacity: number;
  rotation?: number;
  fontSize?: number;
  color?: string;
}

export interface SecurityOptions {
  ownerPassword?: string;
  userPassword?: string;
  canPrint?: boolean;
  canModify?: boolean;
  canCopy?: boolean;
  canAnnotate?: boolean;
  canFillForms?: boolean;
  canExtractForAccessibility?: boolean;
  canAssemble?: boolean;
  canPrintHighQuality?: boolean;
}

export interface ConversionOptions {
  format: "png" | "jpg" | "gif" | "tiff" | "bmp" | "webp";
  dpi?: number;
  quality?: number;
  colorType?: "rgb" | "grayscale" | "blackwhite";
  singleOrMultiple?: "single" | "multiple";
}

export interface OCROptions {
  languages: string[];
  sidecar?: boolean;
  deskew?: boolean;
  clean?: boolean;
  cleanFinal?: boolean;
  ocrType?: "skip-text" | "force-ocr" | "skip-ocr";
}

export interface RotateOptions {
  angle: 90 | 180 | 270;
  pageNumbers?: number[];
}

export interface ExtractOptions {
  pageNumbers: number[];
  splitIntoSeparateFiles?: boolean;
}

export interface StampOptions {
  text?: string;
  image?: File;
  position: string;
  overrideX?: number;
  overrideY?: number;
  customMargin?: number;
  customColor?: string;
  fontSize?: number;
  rotation?: number;
  opacity?: number;
}

export interface APIErrorInterface {
  message: string;
  status: number;
  code?: string;
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export type ProgressCallback = (progress: UploadProgress) => void;

export interface RequestConfig {
  timeout?: number;
  onProgress?: ProgressCallback;
  signal?: AbortSignal;
}
