export interface UploadedFileMetadata {
  name: string;
  originalName: string;
  size: number;
  contentType: string;
  downloadUrl: string;
  path: string;
  createdAt: string;
  tenantId?: string;
}

export interface StorageUploadOptions {
  folder?: string;
  allowedTypes?: string[];
  maxSizeBytes?: number;
  tenantId?: string;
  isPublic?: boolean;
}

export interface FileUploadResult {
  success: boolean;
  file?: UploadedFileMetadata;
  error?: string;
}

