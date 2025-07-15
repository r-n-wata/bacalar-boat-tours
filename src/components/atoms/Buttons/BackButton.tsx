"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import clsx from "clsx";

interface BackButtonProps {
  to?: string; // Optional, defaults to going back one page
  label?: string;
  className?: string; // Allow custom class overrides
}

const BackButton: React.FC<BackButtonProps> = ({
  to,
  label = "Back",
  className,
}) => {
  const router = useRouter();

  const handleClick = () => {
    if (to) {
      router.push(to);
    } else {
      router.back();
    }
  };

  return (
    <button
      onClick={handleClick}
      className={clsx(
        "fixed top-4 left-4 z-50 flex items-center gap-2 text-sm font-medium bg-white/80 text-primary border border-primary rounded-full px-4 py-2 hover:bg-primary hover:text-white transition",
        className // include optional custom classes
      )}
    >
      <ArrowLeft className="w-4 h-4" />
      {label}
    </button>
  );
};

export default BackButton;
