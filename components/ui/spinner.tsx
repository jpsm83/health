"use client";

import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface SpinnerProps {
  size?: "sm" | "md" | "lg" | "xl" | "2xl";
  className?: string;
  text?: string;
  fullScreen?: boolean;
  overlay?: boolean;
}

const sizeClasses = {
  sm: "w-4 h-4",
  md: "w-6 h-6",
  lg: "w-8 h-8",
  xl: "w-16 h-16",
  "2xl": "w-20 h-20",
};

export default function Spinner({
  size = "md",
  className,
  text,
  fullScreen = false,
  overlay = false,
}: SpinnerProps) {
  const spinner = (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-2",
        className
      )}
    >
      <Loader2
        className={cn(
          "animate-spin",
          sizeClasses[size],
          className
        )}
        style={{
          background: "linear-gradient(to right, #7537fa, #ff006a)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          color: "transparent",
        }}
      />
      {text && (
        <p className="text-sm text-gray-600 dark:text-gray-400">{text}</p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
        {spinner}
      </div>
    );
  }

  if (overlay) {
    return (
      <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-lg">
        {spinner}
      </div>
    );
  }

  return spinner;
}

