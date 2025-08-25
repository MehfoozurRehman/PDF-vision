// Stirling-PDF API endpoints configuration

export const STIRLING_ENDPOINTS = {
  // System Information
  SYSTEM_INFO: '/api/v1/info',
  SYSTEM_STATUS: '/api/v1/info/status',
  
  // PDF Information
  GET_PDF_INFO: '/api/v1/info/get-info-on-pdf',
  
  // General Operations
  MERGE_PDFS: '/api/v1/general/merge-pdfs',
  SPLIT_PAGES: '/api/v1/general/split-pages',
  SPLIT_BY_SIZE: '/api/v1/general/split-by-size-or-count',
  SPLIT_BY_CHAPTERS: '/api/v1/general/split-pdf-by-chapters',
  ROTATE_PDF: '/api/v1/general/rotate-pdf',
  EXTRACT_PAGES: '/api/v1/general/extract-pages',
  REMOVE_PAGES: '/api/v1/general/remove-pages',
  PDF_ORGANIZER: '/api/v1/general/pdf-organizer',
  
  // Conversion Operations
  PDF_TO_IMG: '/api/v1/convert/pdf-to-img',
  IMG_TO_PDF: '/api/v1/convert/img-to-pdf',
  PDF_TO_WORD: '/api/v1/convert/pdf-to-word',
  PDF_TO_HTML: '/api/v1/convert/pdf-to-html',
  PDF_TO_PRESENTATION: '/api/v1/convert/pdf-to-presentation',
  PDF_TO_TEXT: '/api/v1/convert/pdf-to-text',
  PDF_TO_XML: '/api/v1/convert/pdf-to-xml',
  PDF_TO_CSV: '/api/v1/convert/pdf-to-csv',
  PDF_TO_PDFA: '/api/v1/convert/pdf-to-pdfa',
  HTML_TO_PDF: '/api/v1/convert/html-to-pdf',
  URL_TO_PDF: '/api/v1/convert/url-to-pdf',
  MARKDOWN_TO_PDF: '/api/v1/convert/markdown-to-pdf',
  FILE_TO_PDF: '/api/v1/convert/file-to-pdf',
  
  // Security Operations
  ADD_PASSWORD: '/api/v1/security/add-password',
  REMOVE_PASSWORD: '/api/v1/security/remove-password',
  CHANGE_PERMISSIONS: '/api/v1/security/change-permissions',
  ADD_WATERMARK: '/api/v1/security/add-watermark',
  REMOVE_WATERMARK: '/api/v1/security/remove-watermark',
  CERT_SIGN: '/api/v1/security/cert-sign',
  REMOVE_CERT_SIGN: '/api/v1/security/remove-cert-sign',
  SANITIZE_PDF: '/api/v1/security/sanitize-pdf',
  AUTO_REDACT: '/api/v1/security/auto-redact',
  REDACT: '/api/v1/security/redact',
  
  // Miscellaneous Operations
  COMPRESS_PDF: '/api/v1/misc/compress-pdf',
  OCR_PDF: '/api/v1/misc/ocr-pdf',
  ADD_IMAGE: '/api/v1/misc/add-image',
  STAMP: '/api/v1/misc/stamp',
  REPAIR: '/api/v1/misc/repair',
  REMOVE_BLANKS: '/api/v1/misc/remove-blanks',
  COMPARE: '/api/v1/misc/compare',
  ADD_PAGE_NUMBERS: '/api/v1/misc/add-page-numbers',
  AUTO_RENAME: '/api/v1/misc/auto-rename',
  GET_IMAGES: '/api/v1/misc/extract-images',
  CHANGE_METADATA: '/api/v1/misc/change-metadata',
  EXTRACT_IMAGE_SCANS: '/api/v1/misc/extract-image-scans',
  FLATTEN: '/api/v1/misc/flatten',
  PRINT_FILE: '/api/v1/misc/print-file',
  REMOVE_ANNOTATIONS: '/api/v1/misc/remove-annotations',
  SHOW_JAVASCRIPT: '/api/v1/misc/show-javascript',
  AUTO_CROP: '/api/v1/misc/auto-crop',
  ADJUST_CONTRAST: '/api/v1/misc/adjust-contrast',
  SCALE_PAGES: '/api/v1/misc/scale-pages',
  MULTI_PAGE_LAYOUT: '/api/v1/misc/multi-page-layout',
  PDF_TO_SINGLE_PAGE: '/api/v1/misc/pdf-to-single-page',
  OVERLAY_PDF: '/api/v1/misc/overlay-pdf',
  CROP: '/api/v1/misc/crop',
} as const;

// Helper function to get endpoint URL
export function getEndpoint(endpoint: keyof typeof STIRLING_ENDPOINTS): string {
  return STIRLING_ENDPOINTS[endpoint];
}

// API response status codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;

// Common MIME types for PDF operations
export const MIME_TYPES = {
  PDF: 'application/pdf',
  PNG: 'image/png',
  JPEG: 'image/jpeg',
  GIF: 'image/gif',
  TIFF: 'image/tiff',
  BMP: 'image/bmp',
  WEBP: 'image/webp',
  DOC: 'application/msword',
  DOCX: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  HTML: 'text/html',
  TXT: 'text/plain',
  XML: 'application/xml',
  CSV: 'text/csv',
  ZIP: 'application/zip',
} as const;

// File extensions mapping
export const FILE_EXTENSIONS = {
  PDF: '.pdf',
  PNG: '.png',
  JPEG: '.jpg',
  GIF: '.gif',
  TIFF: '.tiff',
  BMP: '.bmp',
  WEBP: '.webp',
  DOC: '.doc',
  DOCX: '.docx',
  HTML: '.html',
  TXT: '.txt',
  XML: '.xml',
  CSV: '.csv',
  ZIP: '.zip',
} as const;