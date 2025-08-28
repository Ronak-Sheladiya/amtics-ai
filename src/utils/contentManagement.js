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
      if (filters.page && filters.limit) {\n        const offset = (filters.page - 1) * filters.limit;\n        query = query.range(offset, offset + filters.limit - 1);\n      }\n\n      return await query.order('uploaded_at', { ascending: false });\n    } catch (error) {\n      return { data: null, error };\n    }\n  },\n\n  // Verify content (admin function)\n  verifyContent: async (contentId, verificationData, adminId) => {\n    try {\n      const { status, notes } = verificationData;\n      \n      if (!['verified', 'declined'].includes(status)) {\n        return { success: false, error: 'Invalid verification status' };\n      }\n\n      const { data: updatedContent, error } = await supabase\n        .from('user_content')\n        .update({\n          verification_status: status,\n          verified_by: adminId,\n          verification_notes: notes,\n          verified_at: new Date().toISOString()\n        })\n        .eq('id', contentId)\n        .select(`\n          *,\n          users:user_id (id, name, email)\n        `)\n        .single();\n\n      if (error) {\n        return { success: false, error: error.message };\n      }\n\n      // Log verification activity\n      await dbHelpers.logActivity(\n        adminId,\n        'content_verified',\n        `${status.charAt(0).toUpperCase() + status.slice(1)} content: ${updatedContent.title}`,\n        {\n          content_id: contentId,\n          verification_status: status,\n          user_id: updatedContent.user_id\n        }\n      );\n\n      // Log activity for content owner\n      await dbHelpers.logActivity(\n        updatedContent.user_id,\n        'content_status_changed',\n        `Content \"${updatedContent.title}\" was ${status}`,\n        {\n          content_id: contentId,\n          verification_status: status,\n          verified_by: adminId\n        }\n      );\n\n      return { success: true, data: updatedContent };\n    } catch (error) {\n      return { success: false, error: error.message };\n    }\n  },\n\n  // Get user's content\n  getUserContent: async (userId, filters = {}) => {\n    try {\n      let query = supabase\n        .from('user_content')\n        .select(`\n          id, title, description, file_url, thumbnail_url,\n          content_type, verification_status, uploaded_at,\n          file_size, mime_type, verification_notes, verified_at,\n          tags, metadata\n        `)\n        .eq('user_id', userId);\n\n      if (filters.status && filters.status !== 'all') {\n        query = query.eq('verification_status', filters.status);\n      }\n      if (filters.contentType && filters.contentType !== 'all') {\n        query = query.eq('content_type', filters.contentType);\n      }\n\n      return await query.order('uploaded_at', { ascending: false });\n    } catch (error) {\n      return { data: null, error };\n    }\n  },\n\n  // Delete content\n  deleteContent: async (contentId, userId, isAdmin = false) => {\n    try {\n      // Get content details first\n      const { data: content, error: fetchError } = await supabase\n        .from('user_content')\n        .select('*')\n        .eq('id', contentId)\n        .single();\n\n      if (fetchError) {\n        return { success: false, error: fetchError.message };\n      }\n\n      // Check permissions\n      if (!isAdmin && content.user_id !== userId) {\n        return { success: false, error: 'Unauthorized to delete this content' };\n      }\n\n      // Delete from storage\n      const filePath = content.file_url.split('/').pop();\n      await storageHelpers.deleteFile('user-portfolios', `${content.user_id}/${filePath}`);\n      \n      // Delete thumbnail if exists\n      if (content.thumbnail_url) {\n        const thumbnailPath = content.thumbnail_url.split('/').pop();\n        await storageHelpers.deleteFile('thumbnails', `${content.user_id}/${thumbnailPath}`);\n      }\n\n      // Delete from database\n      const { error: deleteError } = await supabase\n        .from('user_content')\n        .delete()\n        .eq('id', contentId);\n\n      if (deleteError) {\n        return { success: false, error: deleteError.message };\n      }\n\n      // Log activity\n      await dbHelpers.logActivity(\n        userId,\n        'content_deleted',\n        `Deleted content: ${content.title}`,\n        {\n          content_id: contentId,\n          content_type: content.content_type,\n          was_verified: content.verification_status === 'verified'\n        }\n      );\n\n      return { success: true };\n    } catch (error) {\n      return { success: false, error: error.message };\n    }\n  },\n\n  // Update content metadata\n  updateContent: async (contentId, updates, userId, isAdmin = false) => {\n    try {\n      // Get current content\n      const { data: content, error: fetchError } = await supabase\n        .from('user_content')\n        .select('user_id')\n        .eq('id', contentId)\n        .single();\n\n      if (fetchError) {\n        return { success: false, error: fetchError.message };\n      }\n\n      // Check permissions\n      if (!isAdmin && content.user_id !== userId) {\n        return { success: false, error: 'Unauthorized to update this content' };\n      }\n\n      // Filter allowed updates\n      const allowedUpdates = {\n        title: updates.title,\n        description: updates.description,\n        tags: updates.tags\n      };\n\n      // Remove undefined values\n      Object.keys(allowedUpdates).forEach(key => {\n        if (allowedUpdates[key] === undefined) {\n          delete allowedUpdates[key];\n        }\n      });\n\n      const { data: updatedContent, error } = await supabase\n        .from('user_content')\n        .update(allowedUpdates)\n        .eq('id', contentId)\n        .select()\n        .single();\n\n      if (error) {\n        return { success: false, error: error.message };\n      }\n\n      // Log activity\n      await dbHelpers.logActivity(\n        userId,\n        'content_updated',\n        `Updated content: ${updatedContent.title}`,\n        {\n          content_id: contentId,\n          updated_fields: Object.keys(allowedUpdates)\n        }\n      );\n\n      return { success: true, data: updatedContent };\n    } catch (error) {\n      return { success: false, error: error.message };\n    }\n  }\n};\n\n// Helper functions\nconst determineContentType = (mimeType) => {\n  if (mimeType.startsWith('image/')) return 'image';\n  if (mimeType.startsWith('video/')) return 'video';\n  if (mimeType.includes('pdf') || mimeType.includes('document')) return 'document';\n  return 'portfolio';\n};\n\nconst createThumbnail = async (file, userId) => {\n  try {\n    // Create a canvas thumbnail (simplified version)\n    const canvas = document.createElement('canvas');\n    const ctx = canvas.getContext('2d');\n    const img = new Image();\n    \n    return new Promise((resolve) => {\n      img.onload = async () => {\n        // Set thumbnail dimensions\n        const maxSize = 300;\n        const ratio = Math.min(maxSize / img.width, maxSize / img.height);\n        canvas.width = img.width * ratio;\n        canvas.height = img.height * ratio;\n        \n        // Draw and resize\n        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);\n        \n        // Convert to blob\n        canvas.toBlob(async (blob) => {\n          if (blob) {\n            const thumbnailFile = new File([blob], `thumbnail_${Date.now()}.jpg`, {\n              type: 'image/jpeg'\n            });\n            \n            // Upload thumbnail\n            const { data, error } = await storageHelpers.uploadUserContent(\n              userId, \n              thumbnailFile, \n              'thumbnail'\n            );\n            \n            resolve(error ? null : data.url);\n          } else {\n            resolve(null);\n          }\n        }, 'image/jpeg', 0.8);\n      };\n      \n      img.onerror = () => resolve(null);\n      img.src = URL.createObjectURL(file);\n    });\n  } catch (error) {\n    console.error('Error creating thumbnail:', error);\n    return null;\n  }\n};\n\n// Content validation\nexport const contentValidator = {\n  validateFile: (file, maxSize = 10 * 1024 * 1024) => { // 10MB default\n    const errors = [];\n    \n    if (!file) {\n      errors.push('No file selected');\n      return { isValid: false, errors };\n    }\n    \n    if (file.size > maxSize) {\n      errors.push(`File size must be less than ${Math.round(maxSize / 1024 / 1024)}MB`);\n    }\n    \n    const allowedTypes = [\n      'image/jpeg', 'image/png', 'image/webp', 'image/gif',\n      'application/pdf', 'video/mp4', 'video/webm',\n      'application/msword', \n      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'\n    ];\n    \n    if (!allowedTypes.includes(file.type)) {\n      errors.push('File type not supported');\n    }\n    \n    return {\n      isValid: errors.length === 0,\n      errors\n    };\n  },\n  \n  validateMetadata: (metadata) => {\n    const errors = [];\n    \n    if (metadata.title && metadata.title.length > 255) {\n      errors.push('Title must be less than 255 characters');\n    }\n    \n    if (metadata.description && metadata.description.length > 1000) {\n      errors.push('Description must be less than 1000 characters');\n    }\n    \n    return {\n      isValid: errors.length === 0,\n      errors\n    };\n  }\n};\n\nexport default contentManager;\n