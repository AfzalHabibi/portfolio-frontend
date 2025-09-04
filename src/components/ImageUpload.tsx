import React, { useCallback, useState, useRef } from 'react';
import { toast } from 'react-toastify';

interface ImageFile {
  id: string;
  file: File;
  preview: string;
  name: string;
  size: number;
}

interface ExistingImage {
  id: string;
  url: string;
  name?: string;
}

interface ImageUploadProps {
  label: string;
  multiple?: boolean;
  maxFiles?: number;
  maxFileSize?: number; // in MB
  acceptedFormats?: string[];
  existingImages?: ExistingImage[];
  onImagesChange: (files: File[], existingImages: ExistingImage[]) => void;
  required?: boolean;
  className?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  label,
  multiple = false,
  maxFiles = 10,
  maxFileSize = 10, // 10MB default
  acceptedFormats = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
  existingImages = [],
  onImagesChange,
  required = false,
  className = ''
}) => {
  const [imageFiles, setImageFiles] = useState<ImageFile[]>([]);
  const [existingImagesList, setExistingImagesList] = useState<ExistingImage[]>(existingImages);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Validate file
  const validateFile = useCallback((file: File): string | null => {
    // Check file type
    if (!acceptedFormats.includes(file.type)) {
      return `Invalid file format. Accepted formats: ${acceptedFormats.map(f => f.split('/')[1]).join(', ')}`;
    }

    // Check file size
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxFileSize) {
      return `File size too large. Maximum size: ${maxFileSize}MB`;
    }

    return null;
  }, [acceptedFormats, maxFileSize]);

  // Process selected files
  const processFiles = useCallback((files: FileList) => {
    const newFiles: ImageFile[] = [];
    const errors: string[] = [];

    // Check total files limit
    const totalExistingCount = imageFiles.length + existingImagesList.length;
    const availableSlots = maxFiles - totalExistingCount;

    if (files.length > availableSlots) {
      errors.push(`Too many files. You can only add ${availableSlots} more images (maximum ${maxFiles} total)`);
      return;
    }

    Array.from(files).forEach((file, index) => {
      const error = validateFile(file);
      if (error) {
        errors.push(`${file.name}: ${error}`);
        return;
      }

      // Check for duplicate file names
      const isDuplicate = imageFiles.some(img => img.name === file.name) ||
                         existingImagesList.some(img => img.name === file.name);
      
      if (isDuplicate) {
        errors.push(`${file.name}: File already exists`);
        return;
      }

      const imageFile: ImageFile = {
        id: `new-${Date.now()}-${index}`,
        file,
        preview: URL.createObjectURL(file),
        name: file.name,
        size: file.size
      };

      newFiles.push(imageFile);
    });

    if (errors.length > 0) {
      toast.error(errors.join('\n'));
    }

    if (newFiles.length > 0) {
      const updatedImageFiles = [...imageFiles, ...newFiles];
      setImageFiles(updatedImageFiles);
      
      // Notify parent component
      const allFiles = updatedImageFiles.map(img => img.file);
      onImagesChange(allFiles, existingImagesList);
    }
  }, [imageFiles, existingImagesList, maxFiles, validateFile, onImagesChange]);

  // Handle file input change
  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFiles(files);
    }
    // Reset input value to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [processFiles]);

  // Handle drag and drop
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processFiles(files);
    }
  }, [processFiles]);

  // Remove new image file
  const removeImageFile = useCallback((id: string) => {
    const updatedFiles = imageFiles.filter(img => {
      if (img.id === id) {
        // Revoke object URL to prevent memory leaks
        URL.revokeObjectURL(img.preview);
        return false;
      }
      return true;
    });
    
    setImageFiles(updatedFiles);
    
    // Notify parent component
    const allFiles = updatedFiles.map(img => img.file);
    onImagesChange(allFiles, existingImagesList);
  }, [imageFiles, existingImagesList, onImagesChange]);

  // Remove existing image
  const removeExistingImage = useCallback((id: string) => {
    const updatedExistingImages = existingImagesList.filter(img => img.id !== id);
    setExistingImagesList(updatedExistingImages);
    
    // Notify parent component
    const allFiles = imageFiles.map(img => img.file);
    onImagesChange(allFiles, updatedExistingImages);
  }, [imageFiles, existingImagesList, onImagesChange]);

  // Format file size
  const formatFileSize = useCallback((bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }, []);

  // Trigger file input
  const triggerFileInput = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  // Clear all images
  const clearAllImages = useCallback(() => {
    // Revoke all object URLs
    imageFiles.forEach(img => URL.revokeObjectURL(img.preview));
    setImageFiles([]);
    setExistingImagesList([]);
    onImagesChange([], []);
  }, [imageFiles, onImagesChange]);

  const totalImages = imageFiles.length + existingImagesList.length;
  const canAddMore = totalImages < maxFiles;

  return (
    <div className={`image-upload-container ${className}`}>
      <div className="form-group">
        <div className="image-upload-header">
          <label className="form-label">
            {label} {required && <span className="text-danger">*</span>}
          </label>
          <div className="image-upload-info">
            <span className="image-count">
              {totalImages}/{maxFiles} images
            </span>
            {totalImages > 0 && (
              <button
                type="button"
                className="btn-clear-all"
                onClick={clearAllImages}
                title="Clear all images"
              >
                <i className="fas fa-trash-alt"></i>
                Clear All
              </button>
            )}
          </div>
        </div>

        {/* Upload Area */}
        {canAddMore && (
          <div
            className={`image-upload-area ${isDragOver ? 'drag-over' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={triggerFileInput}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept={acceptedFormats.join(',')}
              multiple={multiple}
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
            
            <div className="upload-content">
              <div className="upload-icon">
                <i className="fas fa-cloud-upload-alt"></i>
              </div>
              <div className="upload-text">
                <h4>Drop images here or click to browse</h4>
                <p>
                  Supported formats: {acceptedFormats.map(f => f.split('/')[1]).join(', ')}
                  <br />
                  Maximum file size: {maxFileSize}MB
                  {multiple && <><br />Maximum {maxFiles} images total</>}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Image Previews */}
        {(imageFiles.length > 0 || existingImagesList.length > 0) && (
          <div className="image-previews">
            <div className="images-grid">
              {/* Existing Images */}
              {existingImagesList.map((image) => (
                <div key={`existing-${image.id}`} className="image-preview-item existing-image">
                  <div className="image-container">
                    <img
                      src={image.url}
                      alt={image.name || 'Existing image'}
                      loading="lazy"
                    />
                    <div className="image-overlay">
                      <button
                        type="button"
                        className="btn-remove"
                        onClick={() => removeExistingImage(image.id)}
                        title="Remove image"
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    </div>
                    <div className="image-badge existing">
                      <i className="fas fa-check"></i>
                      Existing
                    </div>
                  </div>
                  <div className="image-info">
                    <div className="image-name" title={image.name || image.url}>
                      {image.name || 'Existing image'}
                    </div>
                  </div>
                </div>
              ))}

              {/* New Image Files */}
              {imageFiles.map((imageFile) => (
                <div key={imageFile.id} className="image-preview-item new-image">
                  <div className="image-container">
                    <img
                      src={imageFile.preview}
                      alt={imageFile.name}
                      loading="lazy"
                    />
                    <div className="image-overlay">
                      <button
                        type="button"
                        className="btn-remove"
                        onClick={() => removeImageFile(imageFile.id)}
                        title="Remove image"
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    </div>
                    <div className="image-badge new">
                      <i className="fas fa-plus"></i>
                      New
                    </div>
                  </div>
                  <div className="image-info">
                    <div className="image-name" title={imageFile.name}>
                      {imageFile.name}
                    </div>
                    <div className="image-size">
                      {formatFileSize(imageFile.size)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Help Text */}
        <div className="upload-help">
          <small className="text-muted">
            <i className="fas fa-info-circle me-1"></i>
            {multiple ? 
              `You can upload up to ${maxFiles} images. Drag and drop multiple files or click to browse.` :
              'Click to browse or drag and drop a single image.'
            }
          </small>
        </div>
      </div>
    </div>
  );
};

export default ImageUpload;
