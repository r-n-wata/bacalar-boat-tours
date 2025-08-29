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
  console.log('className', className)
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
         "font-medium text-primary bg-orange-300 rounded-full px-4 py-3 hover:bg-primary hover:bg-orange-400 transition",
        className // include optional custom classes
      )}
    >
      <ArrowLeft className="w-5 h-5" />
    </button>
  );
};

export default BackButton;
