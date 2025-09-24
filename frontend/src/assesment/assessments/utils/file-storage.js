/**
 * File storage utilities for assessment responses
 * Handles storing files in IndexedDB as base64 or File objects
 */

/**
 * Convert file to base64 for storage
 */
export function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

/**
 * Convert base64 back to file
 */
export function base64ToFile(base64String, filename, mimeType) {
  const arr = base64String.split(',');
  const mime = arr[0].match(/:(.*?);/)[1] || mimeType;
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  
  return new File([u8arr], filename, { type: mime });
}

/**
 * Store file for assessment response
 * Returns a file reference object that can be stored in IndexedDB
 */
export async function storeFileResponse(file, questionId, assessmentId) {
  if (!file) return null;
  
  try {
    const base64 = await fileToBase64(file);
    
    return {
      id: `${assessmentId}-${questionId}-${Date.now()}`,
      originalName: file.name,
      mimeType: file.type,
      size: file.size,
      base64Data: base64,
      uploadedAt: new Date().toISOString()
    };
  } catch (error) {
    console.error('Failed to store file:', error);
    throw new Error('Failed to process file upload');
  }
}

/**
 * Retrieve file from stored response
 */
export function retrieveFileFromResponse(storedFile) {
  if (!storedFile || !storedFile.base64Data) return null;
  
  try {
    return base64ToFile(
      storedFile.base64Data, 
      storedFile.originalName, 
      storedFile.mimeType
    );
  } catch (error) {
    console.error('Failed to retrieve file:', error);
    return null;
  }
}

/**
 * Get file info for display without converting back to File object
 */
export function getFileInfo(storedFile) {
  if (!storedFile) return null;
  
  return {
    name: storedFile.originalName,
    size: storedFile.size,
    type: storedFile.mimeType,
    uploadedAt: storedFile.uploadedAt
  };
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}