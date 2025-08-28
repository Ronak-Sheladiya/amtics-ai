import { supabase } from '../config/supabase.js';

// Storage Setup Utilities
export class StorageSetup {
  // Initialize all storage buckets
  static async initializeStorage() {
    try {
      console.log('🗄️ Initializing Supabase storage buckets...');

      const results = {
        buckets: {},
        policies: {},
        errors: []
      };

      // Create buckets
      const buckets = [
        {
          id: 'profile-images',
          name: 'profile-images',
          public: true,
          fileSizeLimit: 2 * 1024 * 1024, // 2MB
          allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
        },
        {
          id: 'user-portfolios',
          name: 'user-portfolios',
          public: false,
          fileSizeLimit: 10 * 1024 * 1024, // 10MB
          allowedMimeTypes: [
            'image/jpeg', 'image/png', 'image/webp', 'image/gif',
            'application/pdf', 'video/mp4', 'video/webm'
          ]
        },
        {
          id: 'thumbnails',
          name: 'thumbnails',
          public: true,
          fileSizeLimit: 1 * 1024 * 1024, // 1MB
          allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp']
        },
        {
          id: 'documents',
          name: 'documents',
          public: false,
          fileSizeLimit: 5 * 1024 * 1024, // 5MB
          allowedMimeTypes: [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
          ]
        }
      ];

      // Create each bucket
      for (const bucketConfig of buckets) {
        try {
          const { data, error } = await supabase.storage.createBucket(bucketConfig.id, {
            public: bucketConfig.public,
            fileSizeLimit: bucketConfig.fileSizeLimit,
            allowedMimeTypes: bucketConfig.allowedMimeTypes
          });

          if (error && !error.message.includes('already exists')) {
            results.errors.push(`Failed to create bucket ${bucketConfig.id}: ${error.message}`);
          } else {
            results.buckets[bucketConfig.id] = {
              status: error?.message.includes('already exists') ? 'exists' : 'created',
              config: bucketConfig
            };
          }
        } catch (error) {
          results.errors.push(`Exception creating bucket ${bucketConfig.id}: ${error.message}`);
        }
      }

      console.log('✅ Storage buckets initialization completed');
      return results;
    } catch (error) {
      console.error('❌ Storage initialization failed:', error);
      return { buckets: {}, policies: {}, errors: [error.message] };
    }
  }

  // Check if buckets exist
  static async checkBuckets() {
    try {
      const { data: buckets, error } = await supabase.storage.listBuckets();
      
      if (error) {
        return { exists: false, error: error.message };
      }

      const expectedBuckets = ['profile-images', 'user-portfolios', 'thumbnails', 'documents'];
      const existingBuckets = buckets.map(bucket => bucket.id);
      const missing = expectedBuckets.filter(id => !existingBuckets.includes(id));

      return {
        exists: missing.length === 0,
        existingBuckets,
        missingBuckets: missing,
        allBuckets: buckets
      };
    } catch (error) {
      return { exists: false, error: error.message };
    }
  }

  // Get bucket info
  static async getBucketInfo(bucketId) {
    try {
      const { data, error } = await supabase.storage.getBucket(bucketId);
      return { data, error };
    } catch (error) {
      return { data: null, error: error.message };
    }
  }

  // List files in bucket (admin function)
  static async listBucketFiles(bucketId, options = {}) {
    try {
      const { data, error } = await supabase.storage
        .from(bucketId)
        .list(options.path || '', {
          limit: options.limit || 100,
          offset: options.offset || 0
        });

      return { data, error };
    } catch (error) {
      return { data: null, error: error.message };
    }
  }

  // Get storage statistics
  static async getStorageStats() {
    try {
      const buckets = ['profile-images', 'user-portfolios', 'thumbnails', 'documents'];
      const stats = {
        totalFiles: 0,
        totalSize: 0,
        bucketStats: {}
      };

      for (const bucketId of buckets) {
        try {
          const { data: files, error } = await supabase.storage
            .from(bucketId)
            .list('', { limit: 1000 });

          if (!error && files) {
            const bucketFiles = files.filter(file => file.name !== '.emptyFolderPlaceholder');
            const bucketSize = bucketFiles.reduce((total, file) => total + (file.metadata?.size || 0), 0);

            stats.bucketStats[bucketId] = {
              fileCount: bucketFiles.length,
              totalSize: bucketSize,
              files: bucketFiles
            };

            stats.totalFiles += bucketFiles.length;
            stats.totalSize += bucketSize;
          }
        } catch (bucketError) {
          stats.bucketStats[bucketId] = {
            fileCount: 0,
            totalSize: 0,
            error: bucketError.message
          };
        }
      }

      return { data: stats, error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  }

  // Clean up orphaned files (admin function)
  static async cleanupOrphanedFiles() {
    try {
      const results = {
        cleaned: [],
        errors: []
      };

      // This would need to be implemented based on your specific cleanup logic
      // For example, removing files that don't have corresponding database records

      return results;
    } catch (error) {
      return { cleaned: [], errors: [error.message] };
    }
  }
}

// Storage Helper Functions
export const storageUtils = {
  // Get file URL
  getFileUrl: (bucketId, filePath, isPublic = false) => {
    if (isPublic) {
      const { data } = supabase.storage.from(bucketId).getPublicUrl(filePath);
      return data.publicUrl;
    } else {
      // For private files, you would need to create signed URLs
      return supabase.storage.from(bucketId).createSignedUrl(filePath, 3600); // 1 hour
    }
  },

  // Upload file with progress
  uploadWithProgress: async (bucketId, filePath, file, onProgress) => {
    return new Promise((resolve, reject) => {
      const { data, error } = supabase.storage
        .from(bucketId)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
          onUploadProgress: onProgress
        });

      if (error) {
        reject(error);
      } else {
        resolve(data);
      }
    });
  },

  // Validate file before upload
  validateFile: (file, maxSize = 10 * 1024 * 1024, allowedTypes = []) => {
    const errors = [];

    if (!file) {
      errors.push('No file provided');
      return { isValid: false, errors };
    }

    if (file.size > maxSize) {
      errors.push(`File size exceeds limit of ${Math.round(maxSize / 1024 / 1024)}MB`);
    }

    if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
      errors.push('File type not allowed');
    }

    return {
      isValid: errors.length === 0,
      errors,
      fileInfo: {
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified
      }
    };
  },

  // Format file size
  formatFileSize: (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  },

  // Get file extension
  getFileExtension: (filename) => {
    return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
  },

  // Generate unique filename
  generateUniqueFilename: (originalName, userId) => {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    const extension = storageUtils.getFileExtension(originalName);
    return `${userId}/${timestamp}_${random}.${extension}`;
  },

  // Check if file exists
  checkFileExists: async (bucketId, filePath) => {
    try {
      const { data, error } = await supabase.storage
        .from(bucketId)
        .download(filePath);

      return { exists: !error, error: error?.message };
    } catch (error) {
      return { exists: false, error: error.message };
    }
  }
};

// Storage Events (for real-time updates)
export class StorageEventManager {
  constructor() {
    this.listeners = {};
  }

  // Subscribe to storage events
  subscribe(eventType, callback) {
    if (!this.listeners[eventType]) {
      this.listeners[eventType] = [];
    }
    this.listeners[eventType].push(callback);

    // Return unsubscribe function
    return () => {
      this.listeners[eventType] = this.listeners[eventType].filter(cb => cb !== callback);
    };
  }

  // Emit storage event
  emit(eventType, data) {
    if (this.listeners[eventType]) {
      this.listeners[eventType].forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error('Storage event callback error:', error);
        }
      });
    }
  }

  // File upload event
  onFileUploaded(bucketId, filePath, metadata) {
    this.emit('file_uploaded', { bucketId, filePath, metadata, timestamp: new Date() });
  }

  // File deleted event
  onFileDeleted(bucketId, filePath) {
    this.emit('file_deleted', { bucketId, filePath, timestamp: new Date() });
  }

  // File updated event
  onFileUpdated(bucketId, filePath, metadata) {
    this.emit('file_updated', { bucketId, filePath, metadata, timestamp: new Date() });
  }
}

// Export singleton instance
export const storageEvents = new StorageEventManager();

// Bucket configurations for reference
export const BUCKET_CONFIGS = {
  'profile-images': {
    public: true,
    maxSize: 2 * 1024 * 1024, // 2MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
    description: 'User profile images'
  },
  'user-portfolios': {
    public: false,
    maxSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: [
      'image/jpeg', 'image/png', 'image/webp', 'image/gif',
      'application/pdf', 'video/mp4', 'video/webm'
    ],
    description: 'User portfolio content requiring verification'
  },
  'thumbnails': {
    public: true,
    maxSize: 1 * 1024 * 1024, // 1MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
    description: 'Thumbnail images for content preview'
  },
  'documents': {
    public: false,
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ],
    description: 'Document files and reports'
  }
};

export default { StorageSetup, storageUtils, storageEvents, BUCKET_CONFIGS };
