import { useState, useCallback } from 'react';
import { Upload, X } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../services/Firebase';

const ImageUploader = ({
    initialImage = null,
    onChange,
    className = '',
    accept = 'image/*',
    maxSize = 5 * 1024 * 1024, // 5MB
    storagePath = 'uploads/' // Default storage path
}) => {
    const [preview, setPreview] = useState(initialImage);
    const [error, setError] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [progress, setProgress] = useState(0);

    const handleChange = useCallback(async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file
        if (!file.type.match('image.*')) {
            setError('Please select an image file');
            return;
        }

        if (file.size > maxSize) {
            setError(`File too large (max ${maxSize / 1024 / 1024}MB)`);
            return;
        }

        setError('');
        setIsUploading(true);
        setProgress(0);
        
        try {
            // Generate new filename with GUID
            const fileExtension = file.name.split('.').pop();
            const newFileName = `${uuidv4()}.${fileExtension}`;
            const storageRef = ref(storage, `${storagePath}${newFileName}`);
            
            // Create preview
            const reader = new FileReader();
            reader.onload = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(file);

            // Upload to Firebase Storage with progress tracking
            const uploadTask = uploadBytesResumable(storageRef, file);
            
            uploadTask.on('state_changed', 
                (snapshot) => {
                    // Track upload progress
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setProgress(progress);
                },
                (error) => {
                    // Handle unsuccessful uploads
                    setError('Upload failed: ' + error.message);
                    setIsUploading(false);
                },
                async () => {
                    // Handle successful upload
                    try {
                        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                        onChange(downloadURL); // Only pass the download URL
                        setIsUploading(false);
                    } catch (error) {
                        setError('Failed to get download URL: ' + error.message);
                        setIsUploading(false);
                    }
                }
            );

        } catch (error) {
            setError('Upload error: ' + error.message);
            setIsUploading(false);
        }
    }, [maxSize, onChange, storagePath]);

    const removeImage = useCallback(() => {
        setPreview(null);
        onChange(null); // Pass null when removing image
        setError('');
    }, [onChange]);

    return (
        <div className={`space-y-2 ${className}`}>
            <div className="relative group">
                {isUploading ? (
                    <div className="flex flex-col items-center justify-center h-48 w-full rounded-lg border border-gray-200 bg-gray-50">
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div 
                                className="bg-orange-500 h-2.5 rounded-full" 
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>
                        <p className="mt-3 text-sm text-gray-500">Uploading... {Math.round(progress)}%</p>
                    </div>
                ) : preview ? (
                    <>
                        <img
                            src={preview}
                            alt="Preview"
                            className="w-full h-48 object-cover rounded-lg border border-gray-200"
                        />
                        <button
                            type="button"
                            onClick={removeImage}
                            className="absolute top-2 right-2 p-1 bg-white/80 rounded-full shadow hover:bg-white transition-all"
                            aria-label="Remove image"
                        >
                            <X className="w-5 h-5 text-red-500" />
                        </button>
                    </>
                ) : (
                    <label className="flex flex-col items-center justify-center h-48 w-full cursor-pointer rounded-lg border-2 border-dashed border-gray-300 hover:border-orange-500 transition-colors">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Upload className="w-8 h-8 mb-3 text-gray-400" />
                            <p className="text-sm text-gray-500">
                                <span className="font-semibold">Click to upload</span> or drag and drop
                            </p>
                            <p className="text-xs text-gray-500">PNG, JPG, GIF (max {maxSize / 1024 / 1024}MB)</p>
                        </div>
                        <input
                            type="file"
                            accept={accept}
                            onChange={handleChange}
                            className="hidden"
                        />
                    </label>
                )}
            </div>
            
            {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
    );
};

export default ImageUploader;