import {
  StirlingPDFResponse,
  PDFInfo,
  SplitOptions,
  MergeOptions,
  CompressOptions,
  WatermarkOptions,
  SecurityOptions,
  ConversionOptions,
  OCROptions,
  RotateOptions,
  ExtractOptions,
  StampOptions,
  RequestConfig,
  ProgressCallback
} from './types';

// Custom error class
class APIError extends Error {
  public status: number;
  public code?: string;

  constructor({ message, status, code }: { message: string; status: number; code?: string }) {
    super(message);
    this.name = 'APIError';
    this.status = status;
    this.code = code;
  }
}

export class StirlingPDFClient {
  private baseURL: string;
  private defaultTimeout: number = 30000;

  constructor(baseURL: string = 'http://localhost:8081') {
    this.baseURL = baseURL.replace(/\/$/, ''); // Remove trailing slash
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit & { config?: RequestConfig } = {}
  ): Promise<T> {
    const { config, ...fetchOptions } = options;
    const url = `${this.baseURL}${endpoint}`;
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), config?.timeout || this.defaultTimeout);
    
    try {
      const response = await fetch(url, {
        ...fetchOptions,
        signal: config?.signal || controller.signal,
        headers: {
          'Accept': 'application/json',
          ...fetchOptions.headers,
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        throw new APIError({
          message: errorText || `HTTP ${response.status}: ${response.statusText}`,
          status: response.status,
        });
      }

      // Handle different response types
      const contentType = response.headers.get('content-type');
      if (contentType?.includes('application/json')) {
        return await response.json();
      } else {
        return await response.blob() as T;
      }
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof APIError) {
        throw error;
      }
      throw new APIError({
        message: error instanceof Error ? error.message : 'Unknown error occurred',
        status: 0,
      });
    }
  }

  private createFormData(files: File[], additionalData?: Record<string, any>): FormData {
    const formData = new FormData();
    
    files.forEach((file, index) => {
      formData.append(files.length === 1 ? 'fileInput' : `fileInput${index}`, file);
    });

    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, typeof value === 'object' ? JSON.stringify(value) : String(value));
        }
      });
    }

    return formData;
  }

  // System Information
  async getSystemInfo(): Promise<any> {
    return this.makeRequest('/api/v1/info');
  }

  async getSystemStatus(): Promise<any> {
    return this.makeRequest('/api/v1/info/status');
  }

  // PDF Information
  async getPDFInfo(file: File, config?: RequestConfig): Promise<PDFInfo> {
    const formData = this.createFormData([file]);
    return this.makeRequest('/api/v1/info/get-info-on-pdf', {
      method: 'POST',
      body: formData,
      config,
    });
  }

  // Merge Operations
  async mergePDFs(files: File[], options?: MergeOptions, config?: RequestConfig): Promise<Blob> {
    const formData = this.createFormData(files, options);
    return this.makeRequest('/api/v1/general/merge-pdfs', {
      method: 'POST',
      body: formData,
      config,
    });
  }

  // Split Operations
  async splitPDF(file: File, options: SplitOptions, config?: RequestConfig): Promise<Blob> {
    const formData = this.createFormData([file], options);
    let endpoint = '/api/v1/general/split-pages';
    
    if (options.splitType === 'size') {
      endpoint = '/api/v1/general/split-by-size-or-count';
    } else if (options.splitType === 'chapters') {
      endpoint = '/api/v1/general/split-pdf-by-chapters';
    }

    return this.makeRequest(endpoint, {
      method: 'POST',
      body: formData,
      config,
    });
  }

  // Compression
  async compressPDF(file: File, options: CompressOptions, config?: RequestConfig): Promise<Blob> {
    const formData = this.createFormData([file], options);
    return this.makeRequest('/api/v1/misc/compress-pdf', {
      method: 'POST',
      body: formData,
      config,
    });
  }

  // Security Operations
  async addPassword(file: File, options: SecurityOptions, config?: RequestConfig): Promise<Blob> {
    const formData = this.createFormData([file], options);
    return this.makeRequest('/api/v1/security/add-password', {
      method: 'POST',
      body: formData,
      config,
    });
  }

  async removePassword(file: File, password: string, config?: RequestConfig): Promise<Blob> {
    const formData = this.createFormData([file], { password });
    return this.makeRequest('/api/v1/security/remove-password', {
      method: 'POST',
      body: formData,
      config,
    });
  }

  async changePermissions(file: File, options: SecurityOptions, config?: RequestConfig): Promise<Blob> {
    const formData = this.createFormData([file], options);
    return this.makeRequest('/api/v1/security/change-permissions', {
      method: 'POST',
      body: formData,
      config,
    });
  }

  // Watermark Operations
  async addWatermark(file: File, options: WatermarkOptions, config?: RequestConfig): Promise<Blob> {
    const formData = this.createFormData([file]);
    
    if (options.text) {
      formData.append('watermarkText', options.text);
    }
    if (options.image) {
      formData.append('watermarkImage', options.image);
    }
    
    Object.entries(options).forEach(([key, value]) => {
      if (key !== 'text' && key !== 'image' && value !== undefined) {
        formData.append(key, String(value));
      }
    });

    return this.makeRequest('/api/v1/security/add-watermark', {
      method: 'POST',
      body: formData,
      config,
    });
  }

  async removeWatermark(file: File, config?: RequestConfig): Promise<Blob> {
    const formData = this.createFormData([file]);
    return this.makeRequest('/api/v1/security/remove-watermark', {
      method: 'POST',
      body: formData,
      config,
    });
  }

  // Conversion Operations
  async convertPDFToImages(file: File, options: ConversionOptions, config?: RequestConfig): Promise<Blob> {
    const formData = this.createFormData([file], options);
    return this.makeRequest('/api/v1/convert/pdf-to-img', {
      method: 'POST',
      body: formData,
      config,
    });
  }

  async convertImagesToPDF(files: File[], config?: RequestConfig): Promise<Blob> {
    const formData = this.createFormData(files);
    return this.makeRequest('/api/v1/convert/img-to-pdf', {
      method: 'POST',
      body: formData,
      config,
    });
  }

  async convertPDFToWord(file: File, config?: RequestConfig): Promise<Blob> {
    const formData = this.createFormData([file]);
    return this.makeRequest('/api/v1/convert/pdf-to-word', {
      method: 'POST',
      body: formData,
      config,
    });
  }

  async convertPDFToHTML(file: File, config?: RequestConfig): Promise<Blob> {
    const formData = this.createFormData([file]);
    return this.makeRequest('/api/v1/convert/pdf-to-html', {
      method: 'POST',
      body: formData,
      config,
    });
  }

  // OCR Operations
  async performOCR(file: File, options: OCROptions, config?: RequestConfig): Promise<Blob> {
    const formData = this.createFormData([file], {
      ...options,
      languages: options.languages.join(','),
    });
    return this.makeRequest('/api/v1/misc/ocr-pdf', {
      method: 'POST',
      body: formData,
      config,
    });
  }

  // Page Operations
  async rotatePDF(file: File, options: RotateOptions, config?: RequestConfig): Promise<Blob> {
    const formData = this.createFormData([file], {
      ...options,
      pageNumbers: options.pageNumbers?.join(','),
    });
    return this.makeRequest('/api/v1/general/rotate-pdf', {
      method: 'POST',
      body: formData,
      config,
    });
  }

  async extractPages(file: File, options: ExtractOptions, config?: RequestConfig): Promise<Blob> {
    const formData = this.createFormData([file], {
      ...options,
      pageNumbers: options.pageNumbers.join(','),
    });
    return this.makeRequest('/api/v1/general/extract-pages', {
      method: 'POST',
      body: formData,
      config,
    });
  }

  async removePages(file: File, pageNumbers: number[], config?: RequestConfig): Promise<Blob> {
    const formData = this.createFormData([file], {
      pageNumbers: pageNumbers.join(','),
    });
    return this.makeRequest('/api/v1/general/remove-pages', {
      method: 'POST',
      body: formData,
      config,
    });
  }

  // Stamp Operations
  async addStamp(file: File, options: StampOptions, config?: RequestConfig): Promise<Blob> {
    const formData = this.createFormData([file]);
    
    if (options.text) {
      formData.append('stampText', options.text);
    }
    if (options.image) {
      formData.append('stampImage', options.image);
    }
    
    Object.entries(options).forEach(([key, value]) => {
      if (key !== 'text' && key !== 'image' && value !== undefined) {
        formData.append(key, String(value));
      }
    });

    return this.makeRequest('/api/v1/misc/stamp', {
      method: 'POST',
      body: formData,
      config,
    });
  }

  // Utility Methods
  async downloadFile(blob: Blob, filename: string): Promise<void> {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // Health Check
  async healthCheck(): Promise<boolean> {
    try {
      await this.getSystemStatus();
      return true;
    } catch {
      return false;
    }
  }
}

// Create a singleton instance
export const stirlingClient = new StirlingPDFClient();

export { APIError };