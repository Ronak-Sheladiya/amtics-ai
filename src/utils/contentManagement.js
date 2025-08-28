import { supabase, dbHelpers, storageHelpers } from '../config/supabase.js';

// Content Management Utilities
export const contentManager = {
  // Upload content with metadata
  uploadContent: async (userId, file, metadata = {}) => {
    try {
      // Upload file to storage
      const { data: uploadData, error: uploadError } = await storageHelpers.uploadUserContent(
        userId, 
        file, 
        metadata.contentType || 'portfolio'
      );

      if (uploadError) {
        return { success: false, error: uploadError.message };
      }

      // Create thumbnail for images
      let thumbnailUrl = null;
      if (file.type.startsWith('image/')) {
        thumbnailUrl = await createThumbnail(file, userId);
      }

      // Insert content record into database
      const contentData = {
        user_id: userId,
        content_type: metadata.contentType || determineContentType(file.type),
        title: metadata.title || file.name,
        description: metadata.description || '',
        file_url: uploadData.url,
        thumbnail_url: thumbnailUrl,
        file_size: uploadData.file_size,
        mime_type: uploadData.mime_type,
        verification_status: 'pending',
        tags: metadata.tags || [],
        metadata: {
          original_filename: file.name,
          upload_timestamp: new Date().toISOString(),
          ...metadata.additionalData
        }
      };

      const { data: contentRecord, error: dbError } = await supabase
        .from('user_content')
        .insert(contentData)
        .select()
        .single();

      if (dbError) {
        // Cleanup uploaded file if database insertion fails
        await storageHelpers.deleteFile('user-portfolios', uploadData.path);
        return { success: false, error: dbError.message };
      }

      // Log activity
      await dbHelpers.logActivity(
        userId,
        'content_upload',
        `Uploaded ${metadata.contentType || 'content'}: ${contentData.title}`,
        {
          content_id: contentRecord.id,
          file_size: uploadData.file_size,
          mime_type: uploadData.mime_type
        }
      );

      return { success: true, data: contentRecord };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get content for verification (admin function)
  getContentForVerification: async (filters = {}) => {
    try {
      let query = supabase
        .from('user_content')
        .select(`
          id, title, description, file_url, thumbnail_url,
          content_type, verification_status, uploaded_at,
          file_size, mime_type, verification_notes, verified_at,
          tags, metadata,
          users:user_id (id, name, enrollment_number, email, profile_image_url),
          verified_by_user:verified_by (name)
        `);

      // Apply filters
      if (filters.status && filters.status !== 'all') {
        query = query.eq('verification_status', filters.status);
      }
      if (filters.contentType && filters.contentType !== 'all') {
        query = query.eq('content_type', filters.contentType);
      }
      if (filters.userId) {
        query = query.eq('user_id', filters.userId);
      }
      if (filters.dateFrom) {
        query = query.gte('uploaded_at', filters.dateFrom);
      }
      if (filters.dateTo) {
        query = query.lte('uploaded_at', filters.dateTo);
      }

      // Pagination
      if (filters.page && filters.limit) {
        const offset = (filters.page - 1) * filters.limit;
        query = query.range(offset, offset + filters.limit - 1);
      }

      return await query.order('uploaded_at', { ascending: false });
    } catch (error) {
      return { data: null, error };
    }
  },

  // Verify content (admin function)
  verifyContent: async (contentId, verificationData, adminId) => {
    try {
      const { status, notes } = verificationData;
      
      if (!['verified', 'declined'].includes(status)) {
        return { success: false, error: 'Invalid verification status' };
      }

      const { data: updatedContent, error } = await supabase
        .from('user_content')
        .update({
          verification_status: status,
          verified_by: adminId,
          verification_notes: notes,
          verified_at: new Date().toISOString()
        })
        .eq('id', contentId)
        .select(`
          *,
          users:user_id (id, name, email)
        `)
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      // Log verification activity
      await dbHelpers.logActivity(
        adminId,
        'content_verified',
        `${status.charAt(0).toUpperCase() + status.slice(1)} content: ${updatedContent.title}`,
        {
          content_id: contentId,
          verification_status: status,
          user_id: updatedContent.user_id
        }
      );

      // Log activity for content owner
      await dbHelpers.logActivity(
        updatedContent.user_id,
        'content_status_changed',
        `Content "${updatedContent.title}" was ${status}`,
        {
          content_id: contentId,
          verification_status: status,
          verified_by: adminId
        }
      );

      return { success: true, data: updatedContent };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get user's content
  getUserContent: async (userId, filters = {}) => {
    try {
      let query = supabase
        .from('user_content')
        .select(`
          id, title, description, file_url, thumbnail_url,
          content_type, verification_status, uploaded_at,
          file_size, mime_type, verification_notes, verified_at,
          tags, metadata
        `)
        .eq('user_id', userId);

      if (filters.status && filters.status !== 'all') {
        query = query.eq('verification_status', filters.status);
      }
      if (filters.contentType && filters.contentType !== 'all') {
        query = query.eq('content_type', filters.contentType);
      }

      return await query.order('uploaded_at', { ascending: false });
    } catch (error) {
      return { data: null, error };
    }
  },

  // Delete content
  deleteContent: async (contentId, userId, isAdmin = false) => {
    try {
      // Get content details first
      const { data: content, error: fetchError } = await supabase
        .from('user_content')
        .select('*')
        .eq('id', contentId)
        .single();

      if (fetchError) {
        return { success: false, error: fetchError.message };
      }

      // Check permissions
      if (!isAdmin && content.user_id !== userId) {
        return { success: false, error: 'Unauthorized to delete this content' };
      }

      // Delete from storage
      const filePath = content.file_url.split('/').pop();
      await storageHelpers.deleteFile('user-portfolios', `${content.user_id}/${filePath}`);
      
      // Delete thumbnail if exists
      if (content.thumbnail_url) {
        const thumbnailPath = content.thumbnail_url.split('/').pop();
        await storageHelpers.deleteFile('thumbnails', `${content.user_id}/${thumbnailPath}`);
      }

      // Delete from database
      const { error: deleteError } = await supabase
        .from('user_content')
        .delete()
        .eq('id', contentId);

      if (deleteError) {
        return { success: false, error: deleteError.message };
      }

      // Log activity
      await dbHelpers.logActivity(
        userId,
        'content_deleted',
        `Deleted content: ${content.title}`,
        {
          content_id: contentId,
          content_type: content.content_type,
          was_verified: content.verification_status === 'verified'
        }
      );

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Update content metadata
  updateContent: async (contentId, updates, userId, isAdmin = false) => {
    try {
      // Get current content
      const { data: content, error: fetchError } = await supabase
        .from('user_content')
        .select('user_id')
        .eq('id', contentId)
        .single();

      if (fetchError) {
        return { success: false, error: fetchError.message };
      }

      // Check permissions
      if (!isAdmin && content.user_id !== userId) {
        return { success: false, error: 'Unauthorized to update this content' };
      }

      // Filter allowed updates
      const allowedUpdates = {
        title: updates.title,
        description: updates.description,
        tags: updates.tags
      };

      // Remove undefined values
      Object.keys(allowedUpdates).forEach(key => {
        if (allowedUpdates[key] === undefined) {
          delete allowedUpdates[key];
        }
      });

      const { data: updatedContent, error } = await supabase
        .from('user_content')
        .update(allowedUpdates)
        .eq('id', contentId)
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      // Log activity
      await dbHelpers.logActivity(
        userId,
        'content_updated',
        `Updated content: ${updatedContent.title}`,
        {
          content_id: contentId,
          updated_fields: Object.keys(allowedUpdates)
        }
      );

      return { success: true, data: updatedContent };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
};

// Helper functions
const determineContentType = (mimeType) => {
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType.startsWith('video/')) return 'video';
  if (mimeType.includes('pdf') || mimeType.includes('document')) return 'document';
  return 'portfolio';
};

const createThumbnail = async (file, userId) => {
  try {
    // Create a canvas thumbnail (simplified version)
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    return new Promise((resolve) => {
      img.onload = async () => {
        // Set thumbnail dimensions
        const maxSize = 300;
        const ratio = Math.min(maxSize / img.width, maxSize / img.height);
        canvas.width = img.width * ratio;
        canvas.height = img.height * ratio;
        
        // Draw and resize
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        // Convert to blob
        canvas.toBlob(async (blob) => {
          if (blob) {
            const thumbnailFile = new File([blob], `thumbnail_${Date.now()}.jpg`, {
              type: 'image/jpeg'
            });
            
            // Upload thumbnail
            const { data, error } = await storageHelpers.uploadUserContent(
              userId, 
              thumbnailFile, 
              'thumbnail'
            );
            
            resolve(error ? null : data.url);
          } else {
            resolve(null);
          }
        }, 'image/jpeg', 0.8);
      };
      
      img.onerror = () => resolve(null);
      img.src = URL.createObjectURL(file);
    });
  } catch (error) {
    console.error('Error creating thumbnail:', error);
    return null;
  }
};

// Content validation
export const contentValidator = {
  validateFile: (file, maxSize = 10 * 1024 * 1024) => { // 10MB default
    const errors = [];
    
    if (!file) {
      errors.push('No file selected');
      return { isValid: false, errors };
    }
    
    if (file.size > maxSize) {
      errors.push(`File size must be less than ${Math.round(maxSize / 1024 / 1024)}MB`);
    }
    
    const allowedTypes = [
      'image/jpeg', 'image/png', 'image/webp', 'image/gif',
      'application/pdf', 'video/mp4', 'video/webm',
      'application/msword', 
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    if (!allowedTypes.includes(file.type)) {
      errors.push('File type not supported');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  },
  
  validateMetadata: (metadata) => {
    const errors = [];
    
    if (metadata.title && metadata.title.length > 255) {
      errors.push('Title must be less than 255 characters');
    }
    
    if (metadata.description && metadata.description.length > 1000) {
      errors.push('Description must be less than 1000 characters');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
};

export default contentManager;
