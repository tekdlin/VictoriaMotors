'use client';

import { useCallback, useState } from 'react';
import { cn } from '@/lib/utils';
import { Upload, X, FileCheck, AlertCircle } from 'lucide-react';

interface FileUploadProps {
  label: string;
  accept?: string;
  maxSize?: number; // in MB
  onFileSelect: (file: File) => void;
  onFileRemove?: () => void;
  error?: string;
  currentFile?: { name: string; url?: string } | null;
}

export function FileUpload({
  label,
  accept = 'image/*,.pdf',
  maxSize = 10,
  onFileSelect,
  onFileRemove,
  error,
  currentFile,
}: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const validateFile = useCallback(
    (file: File): boolean => {
      setLocalError(null);

      // Check file size
      if (file.size > maxSize * 1024 * 1024) {
        setLocalError(`File size must be less than ${maxSize}MB`);
        return false;
      }

      // Check file type
      const validTypes = accept.split(',').map(t => t.trim());
      const fileType = file.type;
      const fileExt = '.' + file.name.split('.').pop()?.toLowerCase();

      const isValidType = validTypes.some(type => {
        if (type.endsWith('/*')) {
          return fileType.startsWith(type.replace('/*', ''));
        }
        return type === fileExt || type === fileType;
      });

      if (!isValidType) {
        setLocalError('Invalid file type');
        return false;
      }

      return true;
    },
    [accept, maxSize]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        const file = e.dataTransfer.files[0];
        if (validateFile(file)) {
          onFileSelect(file);
        }
      }
    },
    [onFileSelect, validateFile]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();
      if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        if (validateFile(file)) {
          onFileSelect(file);
        }
      }
    },
    [onFileSelect, validateFile]
  );

  const displayError = error || localError;

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-victoria-navy-800 mb-1.5">
        {label}
      </label>

      {currentFile ? (
        <div className="flex items-center justify-between p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
          <div className="flex items-center gap-3">
            <FileCheck className="h-5 w-5 text-emerald-600" />
            <span className="text-sm text-emerald-800 font-medium">
              {currentFile.name}
            </span>
          </div>
          {onFileRemove && (
            <button
              type="button"
              onClick={onFileRemove}
              className="text-emerald-600 hover:text-emerald-800 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
      ) : (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={cn(
            'relative flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg transition-all duration-200 cursor-pointer',
            dragActive
              ? 'border-victoria-navy-500 bg-victoria-navy-50'
              : displayError
              ? 'border-red-300 bg-red-50'
              : 'border-victoria-slate-300 hover:border-victoria-slate-400 bg-victoria-slate-50'
          )}
        >
          <input
            type="file"
            accept={accept}
            onChange={handleChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />

          {displayError ? (
            <AlertCircle className="h-10 w-10 text-red-400 mb-3" />
          ) : (
            <Upload
              className={cn(
                'h-10 w-10 mb-3 transition-colors',
                dragActive ? 'text-victoria-navy-500' : 'text-victoria-slate-400'
              )}
            />
          )}

          <p className="text-sm text-victoria-slate-600 text-center">
            <span className="font-medium text-victoria-navy-700">
              Click to upload
            </span>{' '}
            or drag and drop
          </p>
          <p className="text-xs text-victoria-slate-500 mt-1">
            {accept.replace(/,/g, ', ')} (max {maxSize}MB)
          </p>
        </div>
      )}

      {displayError && (
        <p className="mt-1.5 text-sm text-red-600">{displayError}</p>
      )}
    </div>
  );
}
