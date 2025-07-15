// components/ui/LoadingOverlay.tsx
import React from "react";
import LoadingSpinner from "./LoadingSpinner";

export default function LoadingOverlay({
  text = "Loading...",
  spinnerSize = 48,
}: {
  text?: string;
  spinnerSize?: number;
}) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center space-y-4 bg-black/30 backdrop-blur-sm">
      <LoadingSpinner size={spinnerSize} color="text-white" />
      <p className="text-white text-lg font-medium">{text}</p>
    </div>
  );
}
