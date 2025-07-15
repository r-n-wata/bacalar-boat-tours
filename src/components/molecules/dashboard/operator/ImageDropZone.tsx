// components/atoms/ImageDropzone.tsx
"use client";

import { useDropzone } from "react-dropzone";
import { useCallback } from "react";

type ImageDropzoneProps = {
  onDrop: (acceptedFiles: File[]) => void;
  selectedImages: File[];
};

export default function ImageDropzone({
  onDrop,
  selectedImages,
}: ImageDropzoneProps) {
  const handleDrop = useCallback(
    (acceptedFiles: File[]) => {
      onDrop(acceptedFiles);
    },
    [onDrop]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleDrop,
    accept: { "image/*": [] },
    multiple: true,
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed p-6 rounded-lg text-center cursor-pointer transition 
        ${
          isDragActive
            ? "border-teal-600 bg-teal-50"
            : "border-gray-300 bg-white"
        }`}
    >
      <input {...getInputProps()} />
      <p className="text-gray-600">
        {isDragActive
          ? "Drop the images here ..."
          : "Drag & drop images here, or click to browse"}
      </p>

      {selectedImages?.length > 0 && (
        <div className="mt-4 grid grid-cols-4 gap-4">
          {selectedImages.map((img, index) => {
            const imageUrl =
              typeof img === "string" ? img : URL.createObjectURL(img);

            return (
              <img
                key={index}
                src={imageUrl}
                alt={`Selected ${index}`}
                className="w-full h-24 object-cover rounded"
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
