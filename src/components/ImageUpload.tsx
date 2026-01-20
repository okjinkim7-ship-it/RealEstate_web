"use client";

import { useState, useRef, useEffect } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { uploadImage } from "@/app/actions/upload";

interface ImageUploadProps {
    defaultValue?: string;
    onImageUploaded: (url: string) => void;
}

export default function ImageUpload({ defaultValue, onImageUploaded }: ImageUploadProps) {
    const [preview, setPreview] = useState<string | null>(defaultValue || null);
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleUpload = async (file: File) => {
        setIsUploading(true);
        const formData = new FormData();
        formData.append("file", file);

        const result = await uploadImage(formData);

        if (result.url) {
            setPreview(result.url);
            onImageUploaded(result.url);
        } else {
            alert("Upload failed");
        }
        setIsUploading(false);
    };

    const onDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const onDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const onDrop = async (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            if (file.type.startsWith("image/")) {
                await handleUpload(file);
            }
        }
    };

    return (
        <div className="space-y-2">
            <div
                className={`relative border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center transition-colors cursor-pointer
          ${isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"}
          ${preview ? "h-64" : "h-48"}
        `}
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
                onClick={() => fileInputRef.current?.click()}
                tabIndex={0}
                onPaste={(e) => {
                    if (e.clipboardData && e.clipboardData.files.length > 0) {
                        const file = e.clipboardData.files[0];
                        if (file.type.startsWith("image/")) {
                            handleUpload(file);
                        }
                    }
                }}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        fileInputRef.current?.click();
                    }
                }}
            >
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                            handleUpload(e.target.files[0]);
                        }
                    }}
                />

                {isUploading ? (
                    <div className="flex flex-col items-center text-gray-500">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-2"></div>
                        <span>Uploading...</span>
                    </div>
                ) : preview ? (
                    <div className="relative w-full h-full group">
                        <img
                            src={preview}
                            alt="Preview"
                            className="w-full h-full object-contain rounded-md"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center">
                            <div className="opacity-0 group-hover:opacity-100 flex flex-col items-center text-white">
                                <Upload className="h-6 w-6 mb-1" />
                                <span className="text-sm">Click or Drop to change</span>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center text-gray-500">
                        <div className="p-3 bg-gray-100 rounded-full mb-3">
                            <Upload className="h-6 w-6 text-gray-400" />
                        </div>
                        <p className="text-sm font-medium text-gray-700">
                            클릭하여 업로드하거나 이미지를 드래그하세요
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                            또는 이미지를 복사하여 붙여넣으세요 (Ctrl+V)
                        </p>
                    </div>
                )}
            </div>
            {preview && (
                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        setPreview(null);
                        onImageUploaded("");
                        if (fileInputRef.current) fileInputRef.current.value = "";
                    }}
                    className="text-sm text-red-600 hover:text-red-800 flex items-center"
                >
                    <X className="h-4 w-4 mr-1" /> 이미지 삭제
                </button>
            )}
        </div>
    );
}
