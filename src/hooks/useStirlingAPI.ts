import { useState, useCallback } from 'react';
import { stirlingClient } from '@/api/stirling-client';
import {
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
} from '@/api/types';
import { toast } from 'react-hot-toast';

interface UseStirlingAPIState {
  loading: boolean;
  error: string | null;
  progress: number;
}

interface UseStirlingAPIReturn {
  state: UseStirlingAPIState;
  operations: {
    // System operations
    checkHealth: () => Promise<boolean>;
    getSystemInfo: () => Promise<any>;
    
    // PDF information
    getPDFInfo: (file: File) => Promise<any>;
    
    // Core PDF operations
    mergePDFs: (files: File[], options?: MergeOptions) => Promise<Blob | null>;
    splitPDF: (file: File, options: SplitOptions) => Promise<Blob | null>;
    compressPDF: (file: File, options: CompressOptions) => Promise<Blob | null>;
    
    // Security operations
    addPassword: (file: File, options: SecurityOptions) => Promise<Blob | null>;
    removePassword: (file: File, password: string) => Promise<Blob | null>;
    changePermissions: (file: File, options: SecurityOptions) => Promise<Blob | null>;
    
    // Watermark operations
    addWatermark: (file: File, options: WatermarkOptions) => Promise<Blob | null>;
    removeWatermark: (file: File) => Promise<Blob | null>;
    
    // Conversion operations
    convertPDFToImages: (file: File, options: ConversionOptions) => Promise<Blob | null>;
    convertImagesToPDF: (files: File[]) => Promise<Blob | null>;
    convertPDFToWord: (file: File) => Promise<Blob | null>;
    convertPDFToHTML: (file: File) => Promise<Blob | null>;
    
    // OCR operations
    performOCR: (file: File, options: OCROptions) => Promise<Blob | null>;
    
    // Page operations
    rotatePDF: (file: File, options: RotateOptions) => Promise<Blob | null>;
    extractPages: (file: File, options: ExtractOptions) => Promise<Blob | null>;
    removePages: (file: File, pageNumbers: number[]) => Promise<Blob | null>;
    
    // Stamp operations
    addStamp: (file: File, options: StampOptions) => Promise<Blob | null>;
    
    // Utility operations
    downloadFile: (blob: Blob, filename: string) => Promise<void>;
  };
  resetState: () => void;
}

export function useStirlingAPI(): UseStirlingAPIReturn {
  const [state, setState] = useState<UseStirlingAPIState>({
    loading: false,
    error: null,
    progress: 0,
  });

  const resetState = useCallback(() => {
    setState({
      loading: false,
      error: null,
      progress: 0,
    });
  }, []);

  const executeOperation = useCallback(async <T>(
    operation: () => Promise<T>,
    successMessage?: string,
    errorMessage?: string
  ): Promise<T | null> => {
    setState(prev => ({ ...prev, loading: true, error: null, progress: 0 }));
    
    try {
      const result = await operation();
      
      if (successMessage) {
        toast.success(successMessage);
      }
      
      setState(prev => ({ ...prev, loading: false, progress: 100 }));
      return result;
    } catch (error: any) {
      const errorMsg = error?.message || errorMessage || 'Operation failed';
      setState(prev => ({ ...prev, loading: false, error: errorMsg }));
      toast.error(errorMsg);
      return null;
    }
  }, []);

  const createRequestConfig = useCallback((): RequestConfig => {
    return {
      onProgress: (progress) => {
        setState(prev => ({ ...prev, progress: progress.percentage }));
      },
    };
  }, []);

  // System operations
  const checkHealth = useCallback(async (): Promise<boolean> => {
    const result = await executeOperation(
      () => stirlingClient.healthCheck(),
      undefined,
      'Failed to check system health'
    );
    return result ?? false;
  }, [executeOperation]);

  const getSystemInfo = useCallback(async () => {
    return executeOperation(
      () => stirlingClient.getSystemInfo(),
      undefined,
      'Failed to get system information'
    );
  }, [executeOperation]);

  // PDF information
  const getPDFInfo = useCallback(async (file: File) => {
    return executeOperation(
      () => stirlingClient.getPDFInfo(file, createRequestConfig()),
      undefined,
      'Failed to get PDF information'
    );
  }, [executeOperation, createRequestConfig]);

  // Core PDF operations
  const mergePDFs = useCallback(async (files: File[], options?: MergeOptions): Promise<Blob | null> => {
    return executeOperation(
      () => stirlingClient.mergePDFs(files, options, createRequestConfig()),
      'PDFs merged successfully',
      'Failed to merge PDFs'
    );
  }, [executeOperation, createRequestConfig]);

  const splitPDF = useCallback(async (file: File, options: SplitOptions): Promise<Blob | null> => {
    return executeOperation(
      () => stirlingClient.splitPDF(file, options, createRequestConfig()),
      'PDF split successfully',
      'Failed to split PDF'
    );
  }, [executeOperation, createRequestConfig]);

  const compressPDF = useCallback(async (file: File, options: CompressOptions): Promise<Blob | null> => {
    return executeOperation(
      () => stirlingClient.compressPDF(file, options, createRequestConfig()),
      'PDF compressed successfully',
      'Failed to compress PDF'
    );
  }, [executeOperation, createRequestConfig]);

  // Security operations
  const addPassword = useCallback(async (file: File, options: SecurityOptions): Promise<Blob | null> => {
    return executeOperation(
      () => stirlingClient.addPassword(file, options, createRequestConfig()),
      'Password added successfully',
      'Failed to add password'
    );
  }, [executeOperation, createRequestConfig]);

  const removePassword = useCallback(async (file: File, password: string): Promise<Blob | null> => {
    return executeOperation(
      () => stirlingClient.removePassword(file, password, createRequestConfig()),
      'Password removed successfully',
      'Failed to remove password'
    );
  }, [executeOperation, createRequestConfig]);

  const changePermissions = useCallback(async (file: File, options: SecurityOptions): Promise<Blob | null> => {
    return executeOperation(
      () => stirlingClient.changePermissions(file, options, createRequestConfig()),
      'Permissions changed successfully',
      'Failed to change permissions'
    );
  }, [executeOperation, createRequestConfig]);

  // Watermark operations
  const addWatermark = useCallback(async (file: File, options: WatermarkOptions): Promise<Blob | null> => {
    return executeOperation(
      () => stirlingClient.addWatermark(file, options, createRequestConfig()),
      'Watermark added successfully',
      'Failed to add watermark'
    );
  }, [executeOperation, createRequestConfig]);

  const removeWatermark = useCallback(async (file: File): Promise<Blob | null> => {
    return executeOperation(
      () => stirlingClient.removeWatermark(file, createRequestConfig()),
      'Watermark removed successfully',
      'Failed to remove watermark'
    );
  }, [executeOperation, createRequestConfig]);

  // Conversion operations
  const convertPDFToImages = useCallback(async (file: File, options: ConversionOptions): Promise<Blob | null> => {
    return executeOperation(
      () => stirlingClient.convertPDFToImages(file, options, createRequestConfig()),
      'PDF converted to images successfully',
      'Failed to convert PDF to images'
    );
  }, [executeOperation, createRequestConfig]);

  const convertImagesToPDF = useCallback(async (files: File[]): Promise<Blob | null> => {
    return executeOperation(
      () => stirlingClient.convertImagesToPDF(files, createRequestConfig()),
      'Images converted to PDF successfully',
      'Failed to convert images to PDF'
    );
  }, [executeOperation, createRequestConfig]);

  const convertPDFToWord = useCallback(async (file: File): Promise<Blob | null> => {
    return executeOperation(
      () => stirlingClient.convertPDFToWord(file, createRequestConfig()),
      'PDF converted to Word successfully',
      'Failed to convert PDF to Word'
    );
  }, [executeOperation, createRequestConfig]);

  const convertPDFToHTML = useCallback(async (file: File): Promise<Blob | null> => {
    return executeOperation(
      () => stirlingClient.convertPDFToHTML(file, createRequestConfig()),
      'PDF converted to HTML successfully',
      'Failed to convert PDF to HTML'
    );
  }, [executeOperation, createRequestConfig]);

  // OCR operations
  const performOCR = useCallback(async (file: File, options: OCROptions): Promise<Blob | null> => {
    return executeOperation(
      () => stirlingClient.performOCR(file, options, createRequestConfig()),
      'OCR completed successfully',
      'Failed to perform OCR'
    );
  }, [executeOperation, createRequestConfig]);

  // Page operations
  const rotatePDF = useCallback(async (file: File, options: RotateOptions): Promise<Blob | null> => {
    return executeOperation(
      () => stirlingClient.rotatePDF(file, options, createRequestConfig()),
      'PDF rotated successfully',
      'Failed to rotate PDF'
    );
  }, [executeOperation, createRequestConfig]);

  const extractPages = useCallback(async (file: File, options: ExtractOptions): Promise<Blob | null> => {
    return executeOperation(
      () => stirlingClient.extractPages(file, options, createRequestConfig()),
      'Pages extracted successfully',
      'Failed to extract pages'
    );
  }, [executeOperation, createRequestConfig]);

  const removePages = useCallback(async (file: File, pageNumbers: number[]): Promise<Blob | null> => {
    return executeOperation(
      () => stirlingClient.removePages(file, pageNumbers, createRequestConfig()),
      'Pages removed successfully',
      'Failed to remove pages'
    );
  }, [executeOperation, createRequestConfig]);

  // Stamp operations
  const addStamp = useCallback(async (file: File, options: StampOptions): Promise<Blob | null> => {
    return executeOperation(
      () => stirlingClient.addStamp(file, options, createRequestConfig()),
      'Stamp added successfully',
      'Failed to add stamp'
    );
  }, [executeOperation, createRequestConfig]);

  // Utility operations
  const downloadFile = useCallback(async (blob: Blob, filename: string): Promise<void> => {
    await executeOperation(
      () => stirlingClient.downloadFile(blob, filename),
      'File downloaded successfully',
      'Failed to download file'
    );
  }, [executeOperation]);

  return {
    state,
    operations: {
      checkHealth,
      getSystemInfo,
      getPDFInfo,
      mergePDFs,
      splitPDF,
      compressPDF,
      addPassword,
      removePassword,
      changePermissions,
      addWatermark,
      removeWatermark,
      convertPDFToImages,
      convertImagesToPDF,
      convertPDFToWord,
      convertPDFToHTML,
      performOCR,
      rotatePDF,
      extractPages,
      removePages,
      addStamp,
      downloadFile,
    },
    resetState,
  };
}